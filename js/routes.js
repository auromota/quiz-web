/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.config(configRoute);

    function configRoute($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/_home.html',
                controller: 'homeCtrl'
            })
            .state('credentials', {
                url: '/credentials',
                templateUrl: 'partials/_credentials.html',
                controller: 'credentialsCtrl'
            })
            .state('logs', {
                url: '/logs',
                templateUrl: 'partials/_logs.html',
                controller: 'logsCtrl'
            })
            .state('test', {
                url: '/test/:answerId',
                templateUrl: 'partials/_test.html',
                controller: 'testCtrl'
            });

    }
})();
