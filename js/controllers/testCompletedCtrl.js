/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('testCompletedCtrl', testCompletedCtrl);

    testCompletedCtrl.$inject = ['$scope', '$stateParams', 'answerService'];

    function testCompletedCtrl($scope, $stateParams, answerService) {
        $scope.answers = {};
        $scope.total = null;
        $scope.rightCount = null;

        function loadTest(id) {
            answerService.getByTestId(id).then(
                function(answers) {
                    $scope.answers = answers;
                    $scope.total = $scope.answers.length;
                    $scope.rightCount = 0;
                    $scope.answers.forEach(function(answer) {
                        if(answer.right) {
                            $scope.rightCount++;
                        }
                    });
                }
            )
        }

        loadTest($stateParams.testId);
    }

})();
