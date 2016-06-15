angular.module('demo', ["googleApi"])
    .controller('DemoCtrl', ['$scope', 'googleLogin', 'googleCalendar', '$q', function ($scope, googleLogin, googleCalendar, $q) {
        $scope.calendars = [
            {
                name: 'Dreams Los Cabos',
                brand: 'dreams',
                calendarId: 'h2lr60koko64inr1p5o06esclo@group.calendar.google.com'},
            {
                name: 'Zoëtry Agua Punta Cana',
                brand: 'zoetry',
                calendarId: 'g7k4v6451f90u80ega8dia9du8@group.calendar.google.com'},
            {
                name: 'Now Onyx Punta Cana',
                brand: 'now',
                calendarId: '52coodqn5tk78u6moqpdb2apf8@group.calendar.google.com'},
            {
                name: 'Secrets Silversands Riviera Cancun',
                brand: 'secrets',
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

        // Create 'googleCalendar:loaded' event on the window
        window.gc_loaded = new Event('googleCalendar:loaded');

        $scope.loadEvents = function() {
            window.calendarItems = [];
            var promises = [];
            $scope.calendars.forEach(function(calendar){
                promises.push(getEvents(calendar));
            });
            $q.all(promises).then(function(){
                $scope.calendarItems = window.calendarItems;
                // dispatch event
                $scope.fetchSucceeded = true;
                window.dispatchEvent(window.gc_loaded);
            });
        }

        function getEvents(calendar) {
            return googleCalendar.listEvents({calendarId: calendar.calendarId})
            .then(function(data) {
                // place data in scope
                $scope.calendarItems = data;
                // parse data for bootstrap-calendar
                window.calendarItems = window.calendarItems.concat(parseEvents(data, calendar));
            }, function(data) {
                $scope.alertLabel = "Error fetching data from Google Calendar";
                $scope.fetchSucceeded = false;
            });
        }

        function parseEvents(data, calendar) {
            if(!Array.isArray(data)) return false;
            var c = [];
            data.forEach(function(event){
                
                event.start = new Date(event.start.dateTime ? event.start.dateTime : event.start.date).getTime();
                event.end = new Date(event.end.dateTime ? event.end.dateTime : event.end.date).getTime();

                if(isAllDay(event)) {
                    // set all day event as 00:00 to 23:59
                    event.start = new Date(event.end).setHours(0);
                    event.end = new Date(new Date(event.end).setHours(23)).setMinutes(59);
                }
                c.push({
                    "url": event.htmlLink,
                    "title": event.summary,
                    "organizer": event.organizer,
                    "location": calendar.name,
                    "brand": calendar.brand,
                    "class": calendar.brand+'-event',
                    "start": event.start,
                    "end": event.end
                });
            });
            return c;
        }

        function isAllDay(event) {
            // returns true if event spans exactly 24 hours
            return event.end-event.start == 86400000;
        }

    }]);
