angular.module('lineChartServices', ['dateTimeServices'])
    .factory('LineChart', function (DateTime) {
        var chartsFactory = {};

        chartsFactory.data = function (select) {
            return [
                {
                    icon: 'fa fa-line-chart',
                    header: 'Curve line chart',
                    name: 'curve_chart',
                    type: 'line',
                    filter: {
                        select: select,
                        option: select[0]
                    },
                    optionsChart: {
                        title: ' costs',
                        curveType: 'function',
                        legend: { position: 'bottom' }
                    }
                }];
        }

        chartsFactory.getData = function (costs, costtype) {
            var data = [];
            var title = ['Date', 'Price'];
            for (var i = 0; i < costs.length; i++) {
                if (costs[i].costtype === costtype) {
                    var paydate = DateTime.getDateTimeFromDate(costs[i].paydate);
                    var costprice = costs[i].costprice;
                    var tabdata = [paydate, costprice];
                    data.push(tabdata);
                }
            }
            data.unshift(title);
            return data;
        }
        return chartsFactory;
    });