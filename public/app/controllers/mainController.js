angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location) {
    var app = this;

    this.doLogin = function(loginData){
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;

        Auth.login(app.loginData).then(function(data){
            
            if(data.data.success) {
                app.successMsg = data.data.message;
                app.loading = false;
                $timeout(function() {
                    $location.path('/about');
                }, 1000);
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    };
});