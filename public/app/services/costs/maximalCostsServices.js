angular.module('maximalCostsServices', ['dateTimeServices'])
    .factory('MaximalCosts', function (DateTime) {
        var costsFactory = {};

        costsFactory.total = function (items) {
            if (items.length === 0) return 0;

            var maxCostsThisWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateThisWeek(items[i].paydate))
                    if (items[i].costprice > maxCostsThisWeek) {
                        maxCostsThisWeek = items[i].costprice;
                    }
            }

            var maxCostLastWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateLastWeek(items[i].paydate))
                    if (items[i].costprice > maxCostLastWeek) {
                        maxCostLastWeek = items[i].costprice;
                    }
            }

            var arrowClass = '';
            var colorClass = '';
            var costPercent = 0;

            if (maxCostsThisWeek !== 0 && maxCostLastWeek !== 0) {
                costPercent = Math.round((maxCostsThisWeek / maxCostLastWeek) * 10000) / 100;
            }

            if (maxCostsThisWeek > maxCostLastWeek) {
                colorClass = 'red';
                arrowClass = 'fa fa-sort-desc';
            } else {
                colorClass = 'green';
                arrowClass = 'fa fa-sort-asc';
            }

            return {
                header: {
                    name: ' Max cost this week',
                    icon: 'fa fa-long-arrow-up'
                },
                body: {
                    cost: Math.round(maxCostsThisWeek * 100) / 100
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