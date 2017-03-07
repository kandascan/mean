angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {
    var app = this;
    app.loadme = false;

    $rootScope.$on('$routeChangeStart', function() {
        if(Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                app.username = data.data.username;
                app.useremail = data.data.email;
                app.loadme = true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
    });

    this.doLogin = function(loginData){
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;

        Auth.login(app.loginData).then(function(data){
            
            if(data.data.success) {
                app.successMsg = data.data.message;
                app.loading = false;
                $timeout(function() {
                    $location.path('/profile');
                    app.loginData = {};
                    app.successMsg = false;
                }, 1000);
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    };

    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        }, 2000);
    };
});