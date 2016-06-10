angular-googleapi
=================

angular-googleapi makes it easy to use google apis from angular. So far we have support for login and a couple of google calendar methods, but it should be super easy to add others.


Usage
-----

The module will automatically load and initialize the Google API.
There is no need to manually include a `<script>` element to load the API.
Once the API is ready, it will broadcast a `google:ready` message to $rootScope.

Once this has occurred, call `googleLogin.login()` to perform the login operation.
This method returns a promise.


API Key
-------

The _Browser API Key_ should be placed in the root of the project in a file named `browser_api.key`.

This has been adapted from https://github.com/gaslight/angular-googleapi to use a Browser API Key instead of OAuth.
