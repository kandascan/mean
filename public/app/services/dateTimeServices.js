angular.module('dateTimeServices', [])
    .factory('DateTime', function () {
        var dateFactory = {};

        dateFactory.getDateTimeFromDate = function (date) {
            var newDate = date.toString();
            var dd = newDate.substring(8, 10);
            var mm = newDate.substring(5, 7);
            var yyyy = newDate.substring(0, 4);
            return dd + '.' + mm + '.' + yyyy;
        };

        dateFactory.getDateTime = function (date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return dd + '.' + mm + '.' + yyyy;
        };

        dateFactory.CheckDateThisWeek = function (day) {
            var newDay = this.getDateTimeFromDate(day);
            Date.prototype.GetFirstDayOfWeek = function (iterator) {
                return (new Date(this.setDate(this.getDate() - this.getDay() + iterator)));
            };
            Date.prototype.GetLastDayOfWeek = function () {
                return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
            };

            var thisWeek = false;
            for (var i = 0; i < 7; i++) {
                if (newDay === this.getDateTime(new Date().GetFirstDayOfWeek(i)))
                    thisWeek = true;
            }
            return thisWeek;
        };

        dateFactory.CheckDateLastWeek = function (day) {
            var newDay = this.getDateTimeFromDate(day);
            Date.prototype.GetFirstDayOfWeek = function (iterator) {
                return (new Date(this.setDate(this.getDate() - this.getDay() + iterator)));
            }
            Date.prototype.GetLastDayOfWeek = function () {
                return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
            }

            var thisWeek = false;
            for (var i = -6; i < 1; i++) {
                if (newDay === this.getDateTime(new Date().GetFirstDayOfWeek(i)))
                    thisWeek = true;
            }
            return thisWeek;
        };

        dateFactory.getThisMonth = function (date) {
            var mm = date.getMonth() + 1; //January is 0!

            if (mm < 10) {
                mm = '0' + mm;
            }
            return mm;
        };

        dateFactory.getLastMonth = function (date) {
            var mm = date.getMonth();
            if (mm == 0)
                mm = '12';
            if (mm < 10) {
                mm = '0' + mm;
            }
            return mm;
        };

        return dateFactory;
    });