/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('testDetailsCtrl', testDetailsCtrl);

    testDetailsCtrl.$inject = ['$scope', '$state', 'testService', 'answerService'];

    function testDetailsCtrl($scope, $state, testService, answerService) {

        function loadTest(id) {
            testService.getTestAndUser(id).then(
                function(test) {
                    answerService.getByTestId(id).then(
                        function(answers) {
                            $scope.data = test;
                            $scope.data.answers = answers;
                        }
                    )
                }
            )
        }

        if($state.params.testId) {
            loadTest($state.params.testId)
        } else {
            $state.go('logs');
        }

    }

})();
