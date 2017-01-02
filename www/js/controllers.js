angular.module('starter.controllers', [])

.controller('PositionsCtrl', function($scope, $ionicListDelegate, Trades,StockPrices) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.trades = Trades.getAll();
  $scope.prices = {};

  $scope.portfolio_total_market_value=0;
  $scope.portfolio_total_cost=0;
  $scope.portfolio_daily_change=0;

  var refresh = function(event) {
    $scope.portfolio_total_market_value=0;
    $scope.portfolio_total_cost=0;
    $scope.portfolio_daily_change=0;

    var onPrice = function(price,change,trade) {
      $scope.prices[trade.ticker] = { price:price,change:change };
      $scope.portfolio_total_market_value += trade.quantity * price;
      $scope.portfolio_total_cost += trade.total_cost;
      $scope.portfolio_daily_change += trade.quantity * change;
    };
    angular.forEach($scope.trades, function(trade,index){
      var ticker = trade.ticker;
      if ($scope.prices[trade.ticker]) {
        onPrice($scope.prices[trade.ticker].price,
                $scope.prices[trade.ticker].change,
                trade);
      } else {
        StockPrices.get(trade.ticker,function(price,change) {
          onPrice(price,change,trade);
        });
      }
    });
  };

  $scope.trades.$loaded().then(function() {
    refresh();
    $scope.trades.$watch(function(event) { refresh(event); });
  });

  $scope.selectedTicker="";
  $scope.toggleTicker = function (ticker) {
    if ($scope.selectedTicker === ticker) {
      $scope.selectedTicker = "";
    } else {
      $scope.selectedTicker = ticker;
    }
  };

  $scope.add = function() { 
    Trades.details(null,$scope.trades); 
  };
  $scope.update = function(trade) { 
    $ionicListDelegate.closeOptionButtons();
    Trades.details(trade,$scope.trades); 
  };

  $scope.delete = function(trade) { 
    $ionicListDelegate.closeOptionButtons();
    Trades.delete(trade,$scope.trades); 
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
