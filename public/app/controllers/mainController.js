angular.module('mainController', ['authServices', 'jsGridServices', 'dateTimeServices', 'averageCostsServices', 'minimalCostsServices', 'maximalCostsServices', 'dailyCostsServices', 'monthlyCostsServices', 'weeklyCostsServices', 'pieChartServices', 'lineChartServices'])
    .controller('mainCtrl', function (Auth, Grid, AverageCosts, MinimalCosts, MaximalCosts, DailyCosts, MonthlyCosts, WeeklyCosts, PieChart, LineChart, DateTime, $timeout, $location, $rootScope, $scope, $http) {
        var app = this;
        app.loadme = false;
        $scope.costs = [];

        $scope.costtypes = [];
        $http.get('/api/coststype').then(function (data) {
            for (var i = 0; i < data.data.length; i++) {
                $scope.costtypes.push(data.data[i].name);
            }
            $scope.costtype = $scope.costtypes[0];
            $scope.costtypes = $scope.costtypes.sort();

            $scope.linecharts = LineChart.data($scope.costtypes);
            $scope.piecharts = PieChart.data($scope.costtypes);
        });       

        $scope.drawChart = function (costtype = $scope.costtype, chart) {
            if (document.getElementById(chart.name)) {
                switch (chart.type) {
                    case 'line': {
                        var data = google.visualization.arrayToDataTable(LineChart.getData($scope.costs, costtype));
                        var optionsChart = chart.optionsChart;
                        optionsChart.title = costtype + optionsChart.title;
                        var chart = new google.visualization.LineChart(document.getElementById(chart.name));
                        chart.draw(data, optionsChart);
                    }
                        break;
                    case 'pie': {
                        var data = google.visualization.arrayToDataTable(PieChart.getData($scope.costs, costtype));
                        var optionsChart = chart.optionsChart;
                        var chart = new google.visualization.PieChart(document.getElementById(chart.name));
                        chart.draw(data, optionsChart);
                    }
                        break;
                }
            }
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

        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.useremail = data.data.email;
                    app.loadme = true;

                    $http.get('/api/costs/' + app.username).then(function (data) {
                        $scope.costs = data.data;
                        $rootScope.listCosts = [
                            MonthlyCosts.total($scope.costs),
                            AverageCosts.total($scope.costs),
                            MinimalCosts.total($scope.costs),
                            MaximalCosts.total($scope.costs),
                            DailyCosts.total($scope.costs),
                            WeeklyCosts.total($scope.costs)
                        ];
                        google.charts.setOnLoadCallback(function () {
                            for (var i = 0; i < $scope.piecharts.length; i++) {
                                $scope.drawChart($scope.piecharts[i].filter.option, $scope.piecharts[i]);
                            }
                            for (var i = 0; i < $scope.linecharts.length; i++) {
                                $scope.drawChart(undefined, $scope.linecharts[i]);
                            }
                        });
                        Grid.fillGrid($scope.costs, app.username, $scope.costtypes);
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
    });