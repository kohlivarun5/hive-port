angular.module('starter.services', [])


.service('FirebaseSvc', function ($firebaseArray,$firebaseObject) {
  var FireBaseRef = firebase.database().ref();

  var REFS = {
      root : FireBaseRef,
      trades : FireBaseRef.child("trades"),
      settings : FireBaseRef.child("settings")
  };

  return {
    getTrades : function() {
      return $firebaseArray(REFS.trades);
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

.service('StockPrices',function($http) {

  var fixedEncodeURIComponent = function(str) {
        return encodeURIComponent(str)
                .replace(/[!'()]/g, escape)
                .replace(/\*/g, "%2A")
                .replace(/\"/g, "%22");
    };
    var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';

  this.get = function (ticker,callback) {
    var query = 'select Change,LastTradePriceOnly from yahoo.finance.quote where symbol = "' + ticker + '"';
    var url = 'http://query.yahooapis.com/v1/public/yql?q=' + fixedEncodeURIComponent(query) + format;
    $http.jsonp(url).success(function(data) {
      callback(data.query.results.quote.LastTradePriceOnly,
               data.query.results.quote.Change);
    });
  };
})
;
