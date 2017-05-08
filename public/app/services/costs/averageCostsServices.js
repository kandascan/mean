angular.module('averageCostsServices', ['dateTimeServices'])
    .factory('AverageCosts', function (DateTime) {
        var costsFactory = {};

        costsFactory.total = function (items) {
            if (items.length === 0) return 0;

            var avgCostsThisWeek = 0;
            var iteratorThisWeek = 0;
            var averageCostThisWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateThisWeek(items[i].paydate)) {
                    avgCostsThisWeek += items[i].costprice;
                    iteratorThisWeek += 1;
                }
            }

            if (avgCostsThisWeek != 0) {
                averageCostThisWeek = Math.round((avgCostsThisWeek / iteratorThisWeek) * 100) / 100;
            }

            var avgCostLastWeek = 0;
            var iteratorLastWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateLastWeek(items[i].paydate)) {
                    avgCostLastWeek += items[i].costprice;
                    iteratorLastWeek += 1;
                }
            }

            var averageCostLastWeek = Math.round((avgCostLastWeek / iteratorLastWeek) * 100) / 100;

            var arrowClass = '';
            var colorClass = '';
            var costPercent = 0;

            if (averageCostThisWeek !== 0 && averageCostLastWeek !== 0 && avgCostLastWeek !== 0 && avgCostsThisWeek !== 0) {
                costPercent = Math.round((averageCostThisWeek / averageCostLastWeek) * 10000) / 100;
            }

            if (averageCostThisWeek > averageCostLastWeek || avgCostLastWeek === 0) {
                colorClass = 'red';
                arrowClass = 'fa fa-sort-desc';
            } else {
                colorClass = 'green';
                arrowClass = 'fa fa-sort-asc';
            }

            return {
                header: {
                    name: ' Average cost this week',
                    icon: 'fa fa-line-chart'
                },
                body: {
                    cost: Math.round(averageCostThisWeek * 100) / 100
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