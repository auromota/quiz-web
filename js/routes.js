app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/_home.html',
            controller: 'HomeController'
        })
        .state('credentials', {
            url: '/credentials',
            templateUrl: 'partials/_credentials.html',
            controller: 'CredentialsController'
        });

});
