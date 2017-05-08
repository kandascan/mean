angular.module('pieChartServices', ['sortServices'])
    .factory('PieChart', function (Sort) {
        var chartsFactory = {};

        chartsFactory.data = function (select) {
            return [
                {
                    icon: 'fa fa-pie-chart',
                    header: 'Pie chart',
                    name: 'piechart',
                    type: 'pie',
                    filter: {
                        select: select,
                        option: select[0]
                    },
                    optionsChart: {
                        title: 'Pie chart'
                    }
                },
                {
                    icon: 'fa fa-pie-chart',
                    header: 'Pie 3D chart',
                    name: 'piechart_3d',
                    type: 'pie',
                    filter: {
                        select: select,
                        option: select[1]
                    },
                    optionsChart: {
                        title: 'Pie 3D',
                        is3D: true
                    }
                },
                {
                    icon: 'fa fa-pie-chart',
                    header: 'Pie donut chart',
                    name: 'donutchart',
                    type: 'pie',
                    filter: {
                        select: select,
                        option: select[2]
                    },
                    optionsChart: {
                        title: 'Donut chart',
                        pieHole: 0.4
                    }
                },
                {
                    icon: 'fa fa-pie-chart',
                    header: 'Exploding pie chart',
                    name: 'explodingpiechart',
                    type: 'pie',
                    filter: {
                        select: select,
                        option: select[3]
                    },
                    optionsChart: {
                        title: 'Exploding pie',
                        pieSliceText: 'label',
                        slices: {
                            4: { offset: 0.2 },
                            12: { offset: 0.3 },
                            14: { offset: 0.4 },
                            15: { offset: 0.5 },
                        }
                    }
                }
            ];
        }


        chartsFactory.getData = function (costs, costtype) {
            var data = [];
            var title = [costtype, 'From begining'];

            if (costtype === null) {
                for (var i = 0; i < costs.length; i++) {
                    var costname = costs[i].costname;
                    var costprice = costs[i].costprice;
                    var tabdata = [costname, costprice];
                    data.push(tabdata);
                }
            } else {
                for (var i = 0; i < costs.length; i++) {
                    if (costs[i].costtype === costtype) {
                        var costname = costs[i].costname;
                        var costprice = costs[i].costprice;
                        var tabdata = [costname, costprice];
                        data.push(tabdata);
                    }
                }
            }
            data.sort(Sort.compare);
            data.unshift(title);
            return data;
        }
        return chartsFactory;
    });