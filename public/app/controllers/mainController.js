angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $scope, $http) {
        var app = this;
        app.loadme = false;
        /////////////// costs
        $scope.costs = [];


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
