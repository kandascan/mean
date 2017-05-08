angular.module('sortServices', [])
    .factory('Sort', function () {
        var sortFactory = {};

        sortFactory.compare = function (a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        }

        return sortFactory;
    });