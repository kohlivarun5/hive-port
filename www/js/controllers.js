angular.module('starter.controllers', [])

.controller('PositionsCtrl', function($scope, FirebaseSvc) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.trades = FirebaseSvc.getTrades();

  $scope.remove = function(chat) {
    Positions.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Positions) {
  $scope.chat = Positions.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
