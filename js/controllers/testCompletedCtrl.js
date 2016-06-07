/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('testCompletedCtrl', testCompletedCtrl);

    testCompletedCtrl.$inject = ['$scope', '$stateParams', '$state', 'testService', 'securityService'];

    function testCompletedCtrl($scope, $stateParams, $state, testService, securityService) {
        var user = securityService.getUser();

        if(user.id) {
            loadTest($stateParams.testId);
        } else {
            $state.go('home');
        }

        function loadTest(id) {
            testService.getById(id).then(
                function(test) {
                    $scope.rightCount = test.right;
                    $scope.total = test.total;
                    $scope.$emit('percentageReady', test.percentage);
                }
            )
        }

    }

})();
