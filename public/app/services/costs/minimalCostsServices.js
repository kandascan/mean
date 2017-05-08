angular.module('minimalCostsServices', ['dateTimeServices'])
    .factory('MinimalCosts', function (DateTime) {
        var costsFactory = {};

        costsFactory.total = function (items) {
            if (items.length === 0) return 0;

            var minCostsThisWeek = Number.MAX_VALUE;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateThisWeek(items[i].paydate)) {
                    if (items[i].costprice < minCostsThisWeek) {
                        minCostsThisWeek = items[i].costprice;
                    }
                }
            }

            if (minCostsThisWeek === Number.MAX_VALUE) {
                minCostsThisWeek = 0;
            }

            var minCostLastWeek = Number.MAX_VALUE;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateLastWeek(items[i].paydate)) {
                    if (items[i].costprice < minCostLastWeek) {
                        minCostLastWeek = items[i].costprice;
                    }
                }
            }

            if (minCostLastWeek === Number.MAX_VALUE) {
                minCostLastWeek = 0;
            }

            var arrowClass = '';
            var colorClass = '';
            var costPercent = 0;

            if (minCostsThisWeek !== 0 && minCostLastWeek !== 0) {
                costPercent = Math.round((minCostsThisWeek / minCostLastWeek) * 10000) / 100;
            }

            if (minCostsThisWeek > minCostLastWeek) {
                colorClass = 'red';
                arrowClass = 'fa fa-sort-desc';
            } else {
                colorClass = 'green';
                arrowClass = 'fa fa-sort-asc';
            }

            return {
                header: {
                    name: ' Min cost this week',
                    icon: 'fa fa-long-arrow-down'
                },
                body: {
                    cost: Math.round(minCostsThisWeek * 100) / 100
                },
                footer: {
                    arrow: arrowClass,
                    percent: costPercent + '%',
                    color: colorClass,
                    description: ' From last Week'
                }
            };
        };


        return costsFactory;
    });