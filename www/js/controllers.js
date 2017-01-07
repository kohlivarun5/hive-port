angular.module('starter.controllers', [])

.controller('SideMenuCtrl', function($scope,Settings) {
  Settings.get().$bindTo($scope, "settings");
})
.controller('PositionsCtrl', function($scope, $ionicListDelegate,Settings,Trades,Prices) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.settings = Settings.get();

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
        Prices.getStockPrice(trade.ticker,function(price,change) {
          onPrice(price,change,trade);
        });
      }
    });
  };

  $scope.doRefresh = function() {
    $scope.prices={};
    if ($scope.trades) {
      $scope.trades.$destroy();
    }
    $scope.trades = Trades.getAll();
    $scope.trades.$loaded().then(function() {
      refresh();
      $scope.trades.$watch(function(event) { refresh(event); });
    });
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.doRefresh();

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

.controller('DepositsCtrl', function($scope,$ionicListDelegate,Deposits,Prices) {

  $scope.deposits = Deposits.getAll();

  $scope.add = function() { 
    Deposits.details(null,$scope.deposits); 
  };
  $scope.update = function(deposit) { 
    $ionicListDelegate.closeOptionButtons();
    Deposits.details(deposit,$scope.deposits); 
  };

  $scope.delete = function(deposit) { 
    $ionicListDelegate.closeOptionButtons();
    Deposits.delete(deposit,$scope.deposits); 
  };

  $scope.portfolio_total_current_amount=0;
  $scope.portfolio_total_cost=0;

  var yearsDiff = function(to,from) {
    return (to.getMonth() - from.getMonth())/12 + 
            (to.getFullYear() - from.getFullYear());
  };

  var refresh = function(event) {
    $scope.portfolio_total_current_amount=0;
    $scope.portfolio_total_cost=0;

    var onPrice = function(price,change,deposit) {
      yDiff=yearsDiff(new Date(), new Date(deposit.start_date));
      $scope.portfolio_total_current_amount+=
        deposit.domestic_amount * 
          deposit.base_foreign_fx *
          (1+(deposit.foreign_interest_rate_percent_pa * yDiff)/100) /
          price;
      $scope.portfolio_total_cost+=deposit.domestic_amount;
    };
    angular.forEach($scope.deposits, function(deposit,index){
      Prices.getFxRate(deposit.foreign_currency,function(price,change) {
        onPrice(price,change,deposit);
      });
    });
  };

  $scope.deposits.$loaded().then(function() {
    refresh();
    $scope.deposits.$watch(function(event) { refresh(event); });
  });

});
