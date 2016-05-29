/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('appCtrl', appCtrl);

    appCtrl.$inject = ['$scope', '$state', 'testService', 'answerService', 'questionService'];

    function appCtrl($scope, $state, testService, answerService, questionService) {
        $scope.user = {};
        $scope.test = {};

        $scope.$on('userSelected', function(event, user) {
            $scope.user = angular.copy(user);
            getUserTests();
        });

        $scope.$on('questionAnswered', function(event, answer) {
            $scope.answers.forEach(function(a) {
                if(a.id == answer.id) {
                    a = angular.copy(answer);
                }
            });
            pickAnotherQuestion();
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
                        loadTest(testId);
                    } else {
                        restartTest(testId);
                    }
                }
            });
        }

        function loadTest(testId) {

        }

        function restartTest(testId) {
            $scope.test = {
                id: testId,
                userId: $scope.user.id,
                isCompleted: false
            }
            answerService.deleteByTestId($scope.test.id).then(
                function() {
                    addRandomQuestionsToTest($scope.test);
                }
            )
        }

        function createNewTest() {
            $scope.test = {
                userId: $scope.user.id,
                isCompleted: false
            }
            testService.add($scope.test).then(
                function(test) {
                    $scope.test = angular.copy(test);
                    addRandomQuestionsToTest($scope.test);
                }
            )
        }

        function isNumberValid(array, pos) {
            var isValid = true;
            array.forEach(function(id) {
                if(id == pos) isValid = false;
            });
            return isValid;
        }

        function generateRandomArray(size) {
            var array = [];
            var arraySize = size > 15 ? 15 : size;
            for(var i=0; i<arraySize; i++) {
                var pos = Math.floor(Math.random() * size);
                while(!isNumberValid(array, pos)) {
                    var pos = Math.floor(Math.random() * size);
                }
                array.push(pos);
            }
            return array;
        }

        function addRandomQuestionsToTest(test) {
            questionService.getAll().then(
                function(questions) {
                    var positions = generateRandomArray(questions.length);
                    var answers = [];
                    positions.forEach(function(pos) {
                        var answer = {
                            testId: test.id,
                            questionId: questions[pos].id
                        }
                        answers.push(answer);
                    })
                    answerService.addAll(answers).then(
                        function(answers) {
                            $scope.answers = answers;
                            $state.go('test', {answerId: answers[0].id});
                        }, function(err) {
                            console.log(err);
                        }
                    );
                }
            )
        }

        function pickAnotherQuestion() {
            var id;
            $scope.answers.forEach(function(answer) {
                if(answer.answer == null) {
                    id = answer.id;
                }
            })
            if(id) {
                $state.go('test', {answerId: id});
            } else {
                $state.go('testCompleted', {testId: $scope.answers[0].testId});
            }
        }
    }

})();
