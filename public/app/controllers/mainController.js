angular.module('mainController', ['authServices', 'jsGridServices', 'dateTimeServices', 'averageCostsServices', 'minimalCostsServices', 'maximalCostsServices', 'dailyCostsServices', 'monthlyCostsServices', 'weeklyCostsServices', 'pieChartServices', 'lineChartServices'])
    .controller('mainCtrl', function (Auth, Grid, AverageCosts, MinimalCosts, MaximalCosts, DailyCosts, MonthlyCosts, WeeklyCosts, PieChart, LineChart, DateTime, $timeout, $location, $rootScope, $scope, $http) {
        var app = this;
        app.loadme = false;
        app.costs = [];

        app.costtypes = [];
        $http.get('/api/coststype').then(function (data) {
            for (var i = 0; i < data.data.length; i++) {
                app.costtypes.push(data.data[i].name);
            }
            app.costtypes = app.costtypes.sort();

            app.linecharts = LineChart.data(app.costtypes);
            app.piecharts = PieChart.data(app.costtypes);
        });       

        app.drawChart = function (costtype, chart) {
            if (document.getElementById(chart.name)) {
                switch (chart.type) {
                    case 'line': {
                        var data = google.visualization.arrayToDataTable(LineChart.getData(app.costs, costtype));
                        var optionsChart = chart.optionsChart;
                        optionsChart.title = costtype + optionsChart.title;
                        var chart = new google.visualization.LineChart(document.getElementById(chart.name));
                        chart.draw(data, optionsChart);
                    }
                        break;
                    case 'pie': {
                        var data = google.visualization.arrayToDataTable(PieChart.getData(app.costs, costtype));
                        var optionsChart = chart.optionsChart;
                        var chart = new google.visualization.PieChart(document.getElementById(chart.name));
                        chart.draw(data, optionsChart);
                    }
                        break;
                }
            }
        }

        app.cost = { username: '', costname: '', costprice: '', paydate: '', costtype: '', costdescription: '' };
        app.addCost = function () {
            app.cost.username = app.username;
            app.loading = true;
            app.errorMsg = false;
            app.successMsg = false;
            $http.post('/api/costs', app.cost).then(function (data) {
                if (data.data.success) {
                    app.cost = { username: '', costname: '', costprice: '', paydate: '', costtype: '', costdescription: '' };
                    app.successMsg = data.data.message;
                    app.loading = false;
                    $timeout(function () {
                        $location.path('/showCosts');
                        app.successMsg = false;
                    }, 1000);
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
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
                        app.costs = data.data;
                        $rootScope.listCosts = [
                            MonthlyCosts.total(app.costs),
                            AverageCosts.total(app.costs),
                            MinimalCosts.total(app.costs),
                            MaximalCosts.total(app.costs),
                            DailyCosts.total(app.costs),
                            WeeklyCosts.total(app.costs)
                        ];
                        google.charts.setOnLoadCallback(function () {
                            for (var i = 0; i < app.piecharts.length; i++) {
                                app.drawChart(app.piecharts[i].filter.option, app.piecharts[i]);
                            }
                            for (var i = 0; i < app.linecharts.length; i++) {
                                app.drawChart(app.linecharts[i].filter.option, app.linecharts[i]);
                            }
                        });
                        Grid.fillGrid(app.costs, app.username, app.costtypes);
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