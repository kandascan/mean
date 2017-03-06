angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'registrationController',
        controllerAs: 'register'
    })

    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })

    .otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode({ //dont show # in url 
        enabled: true,
        requireBase: false
    });
});