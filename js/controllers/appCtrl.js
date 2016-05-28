/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('appCtrl', appCtrl);

    appCtrl.$inject = ['$scope', 'testService'];

    function appCtrl($scope, testService) {
        $scope.user = {};
        $scope.test = {};

        $scope.$on('userSelected', function(event, user) {
            $scope.user = angular.copy(user);
            getUserTests();
        });

        function getUserTests() {
            testService.getByUserId($scope.user.id).then(
                function(tests) {
                    if(tests.length) {
                        checkForIncompleteTests(tests);
                    } else {
                        createNewTest();
                    }
                }
            )
        }

        function checkForIncompleteTests(tests) {
            var testId;
            tests.forEach(function(test) {
                if(!test.isCompleted) {
                    testId = test.id;
                    if(confirm('Você já tem um teste em progresso. Deseja continuá-lo?')) {

                    } else {
                        restartTest(testId);
                    }
                }
            });
        }

        function restartTest(testId) {
            $scope.test = {
                userId: $scope.user.id,
                isCompleted: false
            }
            testService.replace($scope.test).then(
                function(test) {
                    $scope.test = angular.copy(test);
                }
            )
        }

        function createNewTest() {
            $scope.test = {
                userId: user.id,
                isCompleted: false
            }
            testService.add($scope.test).then(
                function(test) {
                    $scope.test = angular.copy(test);
                }
            )
        }
    }

})();
