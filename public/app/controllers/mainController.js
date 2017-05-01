angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $scope, $http) {
        var app = this;
        app.loadme = false;
        /////////////// costs
        $rootScope.currentuser = '';
        $scope.costs = [];


        $scope.cost = { username: '', costname: '', costprice: '', paydate: '', costtype: '', costdescription: '' };
        $scope.addCost = function () {
            $scope.cost.username = $rootScope.currentuser;

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

                        $http.get('/api/costs/' + $rootScope.currentuser).then(function (data) {
                            $scope.costs = data.data;
                        });

                    }, 1000);
                } else {
                    $scope.errorMsg = data.data.message;
                    $scope.loading = false;
                }
            });

        };
        $http.get('/api/costs/' + $rootScope.currentuser).then(function (data) {
            $scope.costs = data.data;
        });
        /////////////////////////////////////////////////////////////////////////////
        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    $rootScope.currentuser = data.data.username;
                    app.username = data.data.username;
                    app.useremail = data.data.email;
                    app.loadme = true;
                });
            } else {
                app.isLoggedIn = false;
                app.username = '';
                $rootScope.currentuser = '';
                app.loadme = true;
            }
        });

        this.doLogin = function (loginData) {
            app.loading = true;
            app.errorMsg = false;
            app.successMsg = false;

            Auth.login(app.loginData).then(function (data) {
                $rootScope.currentuser = data.config.data.username;
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    app.loading = false;
                    $timeout(function () {
                        console.log('$rootScope.currentuser is: ' + $rootScope.currentuser);

                        $http.get('/api/costs/' + $rootScope.currentuser).then(function (data) {
                            $scope.costs = data.data;
                        });
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
