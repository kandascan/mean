angular.module('userControllers', ['userServices'])

.controller('registrationController', function($http, $location, $timeout, User){

    var app = this;

    this.regUser = function(regData){
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;

        User.create(app.regData).then(function(data){
            
            if(data.data.success) {
                app.successMsg = data.data.message;
                app.loading = false;
                $timeout(function() {
                    $location.path('/');
                }, 1000);
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    };
});