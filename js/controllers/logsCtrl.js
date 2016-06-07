/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('logsCtrl', logsCtrl);

    logsCtrl.$inject = ['$scope', '$state', 'testService'];

    function logsCtrl($scope, $state, testService) {

        testService.getAllTestsAndUsers().then(function(tests) {
            $scope.tests = tests;
        }, function(err) {
            $state.go('home');
        });
    }

})();
