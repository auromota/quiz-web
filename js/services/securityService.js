/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.factory('securityService', securityService);

    securityService.$inject = [];

    function securityService() {
        var key = 'authentication';

        var service = {
            login: login,
            logout: logout,
            getUser: getUser
        };

        return service;

        function login(user) {
            window.localStorage[key] = angular.toJson(user);
        }

        function logout() {
            window.localStorage[key] = '{}';
        }

        function getUser() {
            var userString = window.localStorage[key];
            var user = {};
            if(userString) {
                user = angular.fromJson(userString);
            }
            return user;
        }

    }

})();
