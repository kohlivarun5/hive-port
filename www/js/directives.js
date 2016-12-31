angular.module('starter.directives', [])
.directive("positionSummary", function(StockPrices) {
  return {
    templateUrl:"templates/directive-position-summary.html",
    scope: {
      ticker: "=",
      quantity: "=",
      total_cost: "="
    },
    link: function(scope) {
      StockPrices.get(scope.ticker,function(price,change) {
        scope.price=price;
        scope.change=change;
        console.log(scope);
      });
    }
  };
})
;
