var app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl: 'app/views/pages/home.html',
                authentidacted: true
            })

            .when('/about', {
                templateUrl: 'app/views/pages/about.html',
                authentidacted: true
            })

            .when('/addCost', {
                templateUrl: 'app/views/pages/costs/addCost.html',
                authentidacted: true
            })

            .when('/showCosts', {
                templateUrl: 'app/views/pages/costs/showCosts.html',
                authentidacted: true
            })

            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'registrationController',
                controllerAs: 'register',
                authentidacted: false
            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authentidacted: false

            })

            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authentidacted: true

            })

            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                authentidacted: true

            })

            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({ //dont show # in url 
            enabled: true,
            requireBase: false
        });
    });

app.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.$$route.authentidacted === true) {
            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/login');
            }
        } else if (next.$$route.authentidacted === false) {
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        }
    });
}]);