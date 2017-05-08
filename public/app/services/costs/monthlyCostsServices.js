angular.module('monthlyCostsServices', ['dateTimeServices'])
    .factory('MonthlyCosts', function (DateTime) {
        var costsFactory = {};

        costsFactory.total = function (items) {
            var thisMonth = DateTime.getThisMonth(new Date());
            var lastMonth = DateTime.getLastMonth(new Date());
            var costsThisMonth = 0;
            for (var i = 0; i < items.length; i++) {
                if (items[i].paydate.substring(5, 7) == thisMonth)
                    costsThisMonth += items[i].costprice;
            }

            var costsLastMonth = 0;
            for (var i = 0; i < items.length; i++) {
                if (items[i].paydate.substring(5, 7) == lastMonth)
                    costsLastMonth += items[i].costprice;
            }

            var arrowClass = '';
            var colorClass = '';
            var costPercent = 0;

            if (costsThisMonth !== 0 && costsLastMonth !== 0) {
                costPercent = Math.round((costsThisMonth / costsLastMonth) * 10000) / 100;
            }

            if (costsThisMonth > costsLastMonth) {
                colorClass = 'red';
                arrowClass = 'fa fa-sort-desc';
            } else {
                colorClass = 'green';
                arrowClass = 'fa fa-sort-asc';
            }

            return {
                header: {
                    name: ' Total costs this month',
                    icon: 'fa fa-money'
                },
                body: {
                    cost: costsThisMonth
                },
                footer: {
                    arrow: arrowClass,
                    percent: costPercent + '%',
                    color: colorClass,
                    description: ' From last Month'
                }
            };
        };

        return costsFactory;
    });