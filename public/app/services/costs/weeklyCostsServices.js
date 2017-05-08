angular.module('weeklyCostsServices', ['dateTimeServices'])
    .factory('WeeklyCosts', function (DateTime) {
        var costsFactory = {};

        costsFactory.total = function (items) {
            var costsThisWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateThisWeek(items[i].paydate))
                    costsThisWeek += items[i].costprice;
            }

            var costLastWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (DateTime.CheckDateLastWeek(items[i].paydate))
                    costLastWeek += items[i].costprice;
            }

            var arrowClass = '';
            var colorClass = '';
            var costPercent = 0;

            if (costsThisWeek !== 0 && costLastWeek !== 0) {
                costPercent = Math.round((costsThisWeek / costLastWeek) * 10000) / 100;
            }

            if (costsThisWeek > costLastWeek) {
                colorClass = 'red';
                arrowClass = 'fa fa-sort-desc';
            } else {
                colorClass = 'green';
                arrowClass = 'fa fa-sort-asc';
            }

            return {
                header: {
                    name: ' Total costs this week',
                    icon: 'fa fa-list-alt'
                },
                body: {
                    cost: costsThisWeek
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