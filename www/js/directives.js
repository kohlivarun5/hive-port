angular.module('starter.directives', [])
.directive("positionSummary", function(StockPrices) {
  return {
    templateUrl:"templates/directive-position-summary.html",
    scope: {
      ticker: "=",
      quantity: "=",
      cost: "="
    },
    link: function(scope) {
      StockPrices.get(scope.ticker,function(price,change) {
        scope.price=parseFloat(price);
        scope.change=parseFloat(change);
        scope.net=(scope.quantity*scope.price)-scope.cost;
        console.log(scope);
      });
    }
  };
})
.directive("amount", function(StockPrices) {
  return {
    templateUrl:"templates/directive-amount.html",
    scope: {
      value: "=",
      pre: "=",
      post: "=",
    }
  };
})
;
