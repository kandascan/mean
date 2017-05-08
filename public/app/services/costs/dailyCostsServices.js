angular.module('dailyCostsServices', ['dateTimeServices'])
    .factory('DailyCosts', function (DateTime) {
        var costsFactory = {};

        costsFactory.total = function (items) {
            if (items.length === 0) return 0;
            var todayCost = 0;
            var yesterdayCost = 0;
            var costPercent = 0;
            var today = DateTime.getDateTime(new Date());
            var yesterday = DateTime.getDateTime(new Date(new Date().setDate(new Date().getDate() - 1)));
            var arrowClass = '';
            var colorClass = '';
            for (var i = 0; i < items.length; i++) {
                if (DateTime.getDateTimeFromDate(items[i].paydate) === today) {
                    todayCost += items[i].costprice;
                }
                if (DateTime.getDateTimeFromDate(items[i].paydate) === yesterday) {
                    yesterdayCost += items[i].costprice;
                }
            }
            if (todayCost > yesterdayCost) {
                colorClass = 'red';
                arrowClass = 'fa fa-sort-desc';
            } else {
                colorClass = 'green';
                arrowClass = 'fa fa-sort-asc';
            }

            if (todayCost !== 0 && yesterdayCost !== 0) {
                costPercent = Math.round((todayCost / yesterdayCost) * 10000) / 100;
            }

            return {
                header: {
                    name: ' Total sum today',
                    icon: 'fa fa-calendar'
                },
                body: {
                    cost: Math.round(todayCost * 100) / 100
                },
                footer: {
                    arrow: arrowClass,
                    percent: costPercent + '%',
                    color: colorClass,
                    description: ' From yesterday'
                }
            };
        };

        return costsFactory;
    });