angular.module('demo', ["googleApi"])
    .controller('DemoCtrl', ['$scope', 'googleLogin', 'googleCalendar', function ($scope, googleLogin, googleCalendar) {
        $scope.calendars = [
            {
                name: 'Dreams Los Cabos',
                calendarId: 'h2lr60koko64inr1p5o06esclo@group.calendar.google.com'},
            {
                name: 'Zoëtry Agua Punta Cana',
                calendarId: 'g7k4v6451f90u80ega8dia9du8@group.calendar.google.com'},
            {
                name: 'Nox Onyx Punta Cana',
                calendarId: '52coodqn5tk78u6moqpdb2apf8@group.calendar.google.com'},
            {
                name: 'Secrets Silversands Riviera Cancun',
                calendarId: 'm1g6ofkcl2vohjs2hco43pssig@group.calendar.google.com'}
            ];

        //Default calendar
        $scope.calendar = $scope.calendars[0];

        $scope.$on("google:ready", function() {
            googleLogin.login();
        });

        $scope.$on("googleCalendar:loaded", function() {
            $scope.loadEvents();
        });

        $scope.loadEvents = function() {
            googleCalendar.listEvents({calendarId: $scope.calendar.calendarId})
            .then(function(data) {
                $scope.calendarItems = data;
            });
        }

    }]);
