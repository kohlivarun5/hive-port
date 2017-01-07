angular.module('starter.services', [])


.service('FirebaseSvc', function ($firebaseArray,$firebaseObject) {
  var FireBaseRef = firebase.database().ref();

  var REFS = {
      root : FireBaseRef,
      trades : FireBaseRef.child("trades"),
      deposits : FireBaseRef.child("deposits"),
      settings : FireBaseRef.child("settings")
  };

  return {
    getTrades : function() {
      return $firebaseArray(REFS.trades);
    },
    getDeposits : function() {
      return $firebaseArray(REFS.deposits);
    },
    getSettings : function() {
      return $firebaseObject(REFS.settings);
    },
  };
})

.service('Settings',function(FirebaseSvc) {
  var self = this;
  this.get = FirebaseSvc.getSettings;
})

.service('Trades',function(FirebaseSvc,$ionicModal,$rootScope) {

  var self = this;

  this.getAll = FirebaseSvc.getTrades;

  this.delete = function(trade,allTrades) {
    allTrades.$remove(trade);
  };

  this.details = function(trade,allTrades) {
    var modalScope = $rootScope.$new(true);
    modalScope.trade = trade || {
      ticker : "",
      quantity : 0,
      total_cost : 0,
    };

    $ionicModal.fromTemplateUrl('templates/modal-trade-details.html', {
        scope:modalScope,
        animation: 'slide-in-up'
    })
    .then(function(modal) {

      modalScope.modal=modal;

      modalScope.submit = function() {
        modalScope.trade.quantity=parseInt(modalScope.trade.quantity);
        modalScope.trade.total_cost=parseFloat(modalScope.trade.total_cost);
        if (modalScope.trade.quantity < 0) {
          modalScope.trade.total_cost=Math.abs(modalScope.trade.total_cost) * -1;
        } else {
          modalScope.trade.total_cost=Math.abs(modalScope.trade.total_cost);
        }

        if (!trade) { 
          allTrades.$add(modalScope.trade).then(function() { modal.hide(); });
        }
        else {
          allTrades.$save(modalScope.trade).then(function() { modal.hide(); });
        }
      };
      modal.show();
    });
  };

})

.service('Deposits',function(FirebaseSvc,$ionicModal,$rootScope) {

  var self = this;

  this.getAll = FirebaseSvc.getDeposits;

  this.delete = function(deposit,allDeposits) {
    allDeposits.$remove(deposit);
  };

  this.details = function(deposit,allDeposits) {
    var modalScope = $rootScope.$new(true);
    var today = new Date();
    modalScope.deposit = deposit || {
      domestic_currency : "USD",
      foreign_currency : "INR",
      domestic_amount : 0,
      base_foreign_fx : 0,
      foreign_interest_rate_percent_pa : 0,
      start_date : new Date(),
      end_date : today.setFullYear(today.getFullYear() + 1)
    };

    if (deposit) {
      modalScope.deposit.start_date = new Date(modalScope.deposit.start_date);
      modalScope.deposit.end_date = new Date(modalScope.deposit.end_date);
    }


    $ionicModal.fromTemplateUrl('templates/modal-deposit-details.html', {
        scope:modalScope,
        animation: 'slide-in-up'
    })
    .then(function(modal) {

      modalScope.modal=modal;

      modalScope.submit = function() {
        modalScope.deposit.domestic_amount=parseFloat(modalScope.deposit.domestic_amount);
        modalScope.deposit.base_foreign_fx=parseFloat(modalScope.deposit.base_foreign_fx);
        modalScope.deposit.foreign_interest_rate_percent_pa=parseFloat(modalScope.deposit.foreign_interest_rate_percent_pa);
        modalScope.deposit.start_date = modalScope.deposit.start_date.getTime();

        console.log(modalScope.deposit);

        if (!deposit) { 
          allDeposits.$add(modalScope.deposit).then(function() { modal.hide(); });
        }
        else {
          allDeposits.$save(modalScope.deposit).then(function() { modal.hide(); });
        }
      };
      modal.show();
    });
  };

})

.service('Prices',function($http) {
  
  var self = this;

  var fixedEncodeURIComponent = function(str) {
        return encodeURIComponent(str)
                .replace(/[!'()]/g, escape)
                .replace(/\*/g, "%2A")
                .replace(/\"/g, "%22");
    };
    var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';

  this.getStockPrice = function (ticker,callback) {
    var query = 'select Change,LastTradePriceOnly from yahoo.finance.quote where symbol = "' + ticker + '"';
    var url = 'http://query.yahooapis.com/v1/public/yql?q=' + fixedEncodeURIComponent(query) + format;
    $http.jsonp(url).success(function(data) {
      callback(data.query.results.quote.LastTradePriceOnly,
               data.query.results.quote.Change);
    });
  };

  this.getFxRate = function (foreign_currency,callback) {
    return self.getStockPrice(foreign_currency+"=X",callback);
  };

})
;
