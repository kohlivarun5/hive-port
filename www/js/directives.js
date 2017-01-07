angular.module('starter.directives', [])
.directive("positionSummary", function(Prices) {
  return {
    templateUrl:"templates/directive-position-summary.html",
    scope: {
      ticker: "=",
      quantity: "=",
      cost: "="
    },
    link: function(scope) {
      Prices.getStockPrice(scope.ticker,function(price,change) {
        scope.price=parseFloat(price);
        scope.change=parseFloat(change);
        scope.net=(scope.quantity*scope.price)-scope.cost;
      });
    }
  };
})
.directive("depositSummary", function(Prices) {
  return {
    templateUrl:"templates/directive-deposit-summary.html",
    scope: {
      deposit: "="
    },
    link: function(scope) {

      var yearsDiff = function(to,from) {
        return (to.getMonth() - from.getMonth())/12 + 
                (to.getFullYear() - from.getFullYear());
      };

      console.log(scope.deposit);
      Prices.getFxRate(scope.deposit.foreign_currency,function(price,change) {
        scope.price=parseFloat(price);
        scope.change=parseFloat(change);
        scope.yearsDiff=yearsDiff(new Date(), new Date(scope.deposit.start_date));
        scope.currentAmount = 
          scope.deposit.domestic_amount * 
            scope.deposit.base_foreign_fx *
            (1+(scope.deposit.foreign_interest_rate_percent_pa *
             scope.yearsDiff)/100) /
            price;
        scope.netPercentChange=(scope.currentAmount-scope.deposit.domestic_amount)/scope.deposit.domestic_amount*100;
      });
    }
  };
})
.directive("amount", function(Prices) {
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
