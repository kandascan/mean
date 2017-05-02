angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $scope, $http) {
        var app = this;
        app.loadme = false;
        /////////////// costs
        $scope.costs = [];

        $scope.costtypes = ['Petrol', 'Food', 'Bills', 'Entertainment', 'Events'];
        $scope.costtype = $scope.costtypes[0];

        function compare(a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }

        // var dataCharts = function (costs) {
        //     var data = [];
        //     var title = ['All cost', 'From begining'];

        //     for (var i = 0; i < costs.length; i++) {
        //         var costname = costs[i].costname;
        //         var costprice = costs[i].costprice;
        //         var tabdata = [costname, costprice];
        //         data.push(tabdata);
        //     }
        //     data.sort(compare);
        //     data.unshift(title);
        //     return data;
        // }

        //$scope.costtype = 'Petrol';

        var dataCharts = function (costs, title, costtype) {
            var data = [];
            var title = [title, 'From begining'];

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
            data.sort(compare);
            data.unshift(title);
            return data;
        }

        $scope.drawChart = function (item) {
            if (item === undefined) { item = $scope.costtype; }

            // Pie chart
            var data = google.visualization.arrayToDataTable(dataCharts($scope.costs, item, item));

            var optionsPieChart = {
                title: data.pg[0].label
            };
            var pieChart = new google.visualization.PieChart(document.getElementById('piechart'));
            pieChart.draw(data, optionsPieChart);



            // Pie 3D chart
            var dataFood = google.visualization.arrayToDataTable(dataCharts($scope.costs, 'Food costs', 'Food'));

            var optionsPie3DChart = {
                title: dataFood.pg[0].label,
                is3D: true,
            };
            var pie3DChart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
            pie3DChart.draw(dataFood, optionsPie3DChart);

            // Donut chart
            var dataBills = google.visualization.arrayToDataTable(dataCharts($scope.costs, 'Events costs', 'Bills'));

            var optionsDonutChart = {
                title: dataBills.pg[0].label,
                pieHole: 0.4,
            };
            var donutChart = new google.visualization.PieChart(document.getElementById('donutchart'));
            donutChart.draw(dataBills, optionsDonutChart);

            // Exploding pie chart
            var dataPetrol = google.visualization.arrayToDataTable(dataCharts($scope.costs, 'Petrol costs', 'Petrol'));

            var optionsExplodingPieChart = {
                title: dataPetrol.pg[0].label,
                pieSliceText: 'label',
                slices: {
                    4: { offset: 0.2 },
                    12: { offset: 0.3 },
                    14: { offset: 0.4 },
                    15: { offset: 0.5 },
                },
            };

            var explodingPieChart = new google.visualization.PieChart(document.getElementById('explodingpiechart'));
            explodingPieChart.draw(dataPetrol, optionsExplodingPieChart);
        }

        $scope.cost = { username: '', costname: '', costprice: '', paydate: '', costtype: '', costdescription: '' };
        $scope.addCost = function () {
            $scope.cost.username = app.username;

            $scope.loading = true;
            $scope.errorMsg = false;
            $scope.successMsg = false;
            $http.post('/api/costs', $scope.cost).then(function (data) {
                if (data.data.success) {
                    $scope.cost = { username: '', costname: '', costprice: '', paydate: '', costtype: '', costdescription: '' };
                    $scope.successMsg = data.data.message;
                    $scope.loading = false;
                    $timeout(function () {
                        $location.path('/showCosts');
                        $scope.successMsg = false;
                    }, 1000);
                } else {
                    $scope.errorMsg = data.data.message;
                    $scope.loading = false;
                }
            });

        };
        /////////////////////////////////////////////////////////////////////////////
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.useremail = data.data.email;
                    app.loadme = true;

                    $http.get('/api/costs/' + app.username).then(function (data) {
                        $scope.costs = data.data;
                        vm.sumCost = vm.totalMonth($scope.costs);
                        vm.averageCost = vm.average($scope.costs);
                        vm.minimalCost = vm.min($scope.costs);
                        vm.maximalCost = vm.max($scope.costs);
                        vm.totalToday = vm.dailySum($scope.costs);
                        vm.totalCost = vm.total($scope.costs);
                        $rootScope.listCosts = [
                            vm.sumCost,
                            vm.averageCost,
                            vm.minimalCost,
                            vm.maximalCost,
                            vm.totalToday,
                            vm.totalCost
                        ];
                        google.charts.load('current', { 'packages': ['corechart'] });
                        google.charts.setOnLoadCallback($scope.drawChart);
                    });
                });
            } else {
                app.isLoggedIn = false;
                app.username = '';
                app.loadme = true;
            }

        });

        this.doLogin = function (loginData) {
            app.loading = true;
            app.errorMsg = false;
            app.successMsg = false;

            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    app.loading = false;
                    $timeout(function () {
                        $location.path('/showCosts');
                        app.loginData = {};
                        app.successMsg = false;
                    }, 1000);
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            });
        };

        this.logout = function () {
            Auth.logout();
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
            }, 2000);
        };

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var vm = this;

        vm.average = function (items) {
            if (items.length === 0) return 0;

            var avgCostsThisWeek = 0;
            var iteratorThisWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateThisWeek(items[i].paydate)) {
                    avgCostsThisWeek += items[i].costprice;
                    iteratorThisWeek += 1;
                }
            }

            var averageCostThisWeek = Math.round((avgCostsThisWeek / iteratorThisWeek) * 100) / 100;

            var avgCostLastWeek = 0;
            var iteratorLastWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateLastWeek(items[i].paydate)) {
                    avgCostLastWeek += items[i].costprice;
                    iteratorLastWeek += 1;
                }
            }

            var averageCostLastWeek = Math.round((avgCostLastWeek / iteratorLastWeek) * 100) / 100;

            var arrowClass = '';
            var colorClass = '';
            var costPercent = 0;

            if (averageCostThisWeek !== 0 && averageCostLastWeek !== 0) {
                costPercent = Math.round((averageCostThisWeek / averageCostLastWeek) * 10000) / 100;
            }

            if (averageCostThisWeek > averageCostLastWeek) {
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

        vm.min = function (items) {
            if (items.length === 0) return 0;

            var minCostsThisWeek = Number.MAX_VALUE;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateThisWeek(items[i].paydate))
                    if (items[i].costprice < minCostsThisWeek) {
                        minCostsThisWeek = items[i].costprice;
                    }
            }

            var minCostLastWeek = Number.MAX_VALUE;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateLastWeek(items[i].paydate))
                    if (items[i].costprice < minCostLastWeek) {
                        minCostLastWeek = items[i].costprice;
                    }
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

        vm.max = function (items) {
            if (items.length === 0) return 0;

            var maxCostsThisWeek = Number.MIN_VALUE;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateThisWeek(items[i].paydate))
                    if (items[i].costprice > maxCostsThisWeek) {
                        maxCostsThisWeek = items[i].costprice;
                    }
            }

            var maxCostLastWeek = Number.MIN_VALUE;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateLastWeek(items[i].paydate))
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

        vm.getDateTimeFromDate = function (date) {
            var newDate = date.toString();
            var dd = newDate.substring(8, 10);
            var mm = newDate.substring(5, 7);
            var yyyy = newDate.substring(0, 4);
            return dd + '.' + mm + '.' + yyyy;
        };
        vm.getDateTime = function (date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return dd + '.' + mm + '.' + yyyy;
        };

        vm.dailySum = function (items) {
            if (items.length === 0) return 0;
            var todayCost = 0;
            var yesterdayCost = 0;
            var costPercent = 0;
            var today = vm.getDateTime(new Date());
            var yesterday = vm.getDateTime(new Date(new Date().setDate(new Date().getDate() - 1)));
            var arrowClass = '';
            var colorClass = '';
            for (var i = 0; i < items.length; i++) {
                if (vm.getDateTimeFromDate(items[i].paydate) === today) {
                    todayCost += items[i].costprice;
                }
                if (vm.getDateTimeFromDate(items[i].paydate) === yesterday) {
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

        vm.CheckDateThisWeek = function (day) {
            var newDay = vm.getDateTimeFromDate(day);
            Date.prototype.GetFirstDayOfWeek = function (iterator) {
                return (new Date(this.setDate(this.getDate() - this.getDay() + iterator)));
            };
            Date.prototype.GetLastDayOfWeek = function () {
                return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
            };

            var thisWeek = false;
            for (var i = 0; i < 7; i++) {
                if (newDay === vm.getDateTime(new Date().GetFirstDayOfWeek(i)))
                    thisWeek = true;
            }
            return thisWeek;
        };

        vm.CheckDateLastWeek = function (day) {
            var newDay = vm.getDateTimeFromDate(day);
            Date.prototype.GetFirstDayOfWeek = function (iterator) {
                return (new Date(this.setDate(this.getDate() - this.getDay() + iterator)));
            }
            Date.prototype.GetLastDayOfWeek = function () {
                return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
            }

            var thisWeek = false;
            for (var i = -6; i < 1; i++) {
                if (newDay === vm.getDateTime(new Date().GetFirstDayOfWeek(i)))
                    thisWeek = true;
            }
            return thisWeek;
        };

        vm.getThisMonth = function (date) {
            var mm = date.getMonth() + 1; //January is 0!

            if (mm < 10) {
                mm = '0' + mm;
            }
            return mm;
        };

        vm.getLastMonth = function (date) {
            var mm = date.getMonth();
            if (mm == 0)
                mm = '12';
            if (mm < 10) {
                mm = '0' + mm;
            }
            return mm;
        };

        vm.totalMonth = function (items) {
            var thisMonth = vm.getThisMonth(new Date());
            var lastMonth = vm.getLastMonth(new Date());
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

        vm.total = function (items) {
            var costsThisWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateThisWeek(items[i].paydate))
                    costsThisWeek += items[i].costprice;
            }

            var costLastWeek = 0;
            for (var i = 0; i < items.length; i++) {
                if (vm.CheckDateLastWeek(items[i].paydate))
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
    });
