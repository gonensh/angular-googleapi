angular.module('googleApi', [])
	.value('version', '0.1')

    .service("googleApiBuilder", function($q) {
        this.loadClientCallbacks = [];

        this.build = function(requestBuilder, responseTransformer) {
            return function(args) {
                var deferred = $q.defer();
                var response;
                request = requestBuilder(args);
                request.execute(function(resp, raw) {
                    if(resp.error) {
                        deferred.reject(resp.error);
                    } else {
                        response = responseTransformer ? responseTransformer(resp) : resp;
                        deferred.resolve(response);
                    }

                });
                return deferred.promise;

            }
        };

        this.afterClientLoaded = function(callback) {
            this.loadClientCallbacks.push(callback);
        };

        this.runClientLoadedCallbacks = function() {
            for(var i=0; i < this.loadClientCallbacks.length; i++) {
                this.loadClientCallbacks[i]();
            }
        };
    })

    .provider('googleLogin', function() {

        this.configure = function(conf) {
            this.config = conf;
        };

        this.$get = function ($q, googleApiBuilder, $rootScope) {
            var config = this.config;
            var deferred = $q.defer();
            var svc = {
                login: function () {
                    googleApiBuilder.runClientLoadedCallbacks();
                    return deferred.promise;
                }
            };

            // load the gapi client, instructing it to invoke a globally-accessible function when finished
            window._googleApiLoaded = function() {
                gapi.client.setApiKey('AIzaSyCcXrbQOjSbwmYx9FPUzaaKvQZbjOdcLrk');
                $rootScope.$broadcast("google:ready", {});
            };
            var script = document.createElement('script');
            script.setAttribute("type","text/javascript");
            script.setAttribute("src", "https://apis.google.com/js/client.js?onload=_googleApiLoaded");
            document.getElementsByTagName("head")[0].appendChild(script);

            return svc;
        };
    })

    .service("googleCalendar", function(googleApiBuilder, $rootScope) {

        var self = this;
        var itemExtractor = function(resp) { return resp.items; };

        googleApiBuilder.afterClientLoaded(function() {
            gapi.client.load('calendar', 'v3', function() {

                self.listCalendarColors = googleApiBuilder.build(gapi.client.calendar.colors.get);

                self.createEvent = googleApiBuilder.build(gapi.client.calendar.events.quickAdd);
                self.deleteEvent = googleApiBuilder.build(gapi.client.calendar.events.delete);
                self.updateEvent = googleApiBuilder.build(gapi.client.calendar.events.update);
                self.listEvents = googleApiBuilder.build(gapi.client.calendar.events.list, itemExtractor);

                self.createCalendar = googleApiBuilder.build(gapi.client.calendar.calendars.insert);
                self.deleteCalendar = googleApiBuilder.build(gapi.client.calendar.calendars.delete);
                self.updateCalendar = googleApiBuilder.build(gapi.client.calendar.calendars.update);
                self.listCalendars = googleApiBuilder.build(gapi.client.calendar.calendarList.list, itemExtractor);

                $rootScope.$broadcast("googleCalendar:loaded");

            });

        });

    })

