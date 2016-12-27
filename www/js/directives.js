angular.module('starter.directives', [])
.directive("price", function(StockPrices) {
  return {
    templateUrl:"templates/directive-price.html",
    scope: {
      ticker: "=",
      quantity: "=",
      total_cost: "="
    },
    link: function(scope) {
      console.log(scope);
      StockPrices.get(scope.ticker,function(price,change) {
        scope.price=price;
        scope.change=change;
      });
    }
  };
})
;
