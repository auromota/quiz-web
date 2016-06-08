/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('logsCtrl', logsCtrl);

    logsCtrl.$inject = ['$scope', '$state', 'testService'];

    function logsCtrl($scope, $state, testService) {

        function loadTests() {
            testService.getAllTestsAndUsers().then(function(tests) {
                $scope.tests = tests;
            }, function(err) {
                $state.go('home');
            });
        }

        loadTests();

        $scope.clear = function() {
            if(confirm('Deseja apagar todos os registros?')) {
                testService.removeAll().then(loadTests);
            }
        }

        $scope.details = function(id) {
            $state.go('testDetails', {testId: id});
        }

    }

})();
