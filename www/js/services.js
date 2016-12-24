angular.module('starter.services', [])


.service('FirebaseSvc', function ($firebaseArray,$firebaseObject) {
  var FireBaseRef = firebase.database().ref();

  var REFS = {
      root : FireBaseRef,
      trades : FireBaseRef.child("trades")
  };

  return {
    getTrades : function() {
      return $firebaseArray(REFS.trades);
    },
  };
})


.service('Trades',function(FirebaseSvc,$ionicModal,$rootScope) {

  var self = this;

  this.getAll = FirebaseSvc.getTrades;

  this.details = function(trade,allTrades) {
    var modalScope = $rootScope.$new(true);
    modalScope.trade = trade || {
      ticker : "",
      quantity : 0,
      total_cost : 0,
    };

    $ionicModal.fromTemplateUrl('templates/trade-details.html', {
        scope:modalScope,
        animation: 'slide-in-up'
    })
    .then(function(modal) {

      modalScope.modal=modal;

      modalScope.submit = function() {
        console.log(modalScope.trade);
        if (!trade) { 
          allTrades.$add(modalScope.trade).then(function() { allTrades.$save(); modal.hide(); });
        }
        else {
          allTrades[trade.$id] = modalScope.trade;
          allTrades.$save().then(function() { modal.hide(); });
        }
        modal.hide();
      };
      modal.show();

    });
  };

});
