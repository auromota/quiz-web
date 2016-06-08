/*
    Author: Auro Mota <auro@blueorc.com>
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
            $scope.answers.forEach(function(a, i) {
                if(a.id == answer.id) {
                    $scope.answers[i] = angular.copy(answer);
                }
            });
            pickAnotherQuestion();
        });

        function getUserTests() {
            testService.getByUserId($scope.user.id).then(checkTests);
        }

        function checkTests(tests) {
            var testId = checkForIncompleteTests(tests);
            if(testId) {
                if(confirm('Você já tem um teste em progresso. Deseja continuá-lo?')) {
                    loadTest(testId);
                } else {
                    restartTest(testId);
                }
            } else {
                createNewTest();
            }
        }

        function checkForIncompleteTests(tests) {
            var testId;
            tests.forEach(function(test) {
                if(!test.completedOn) {
                    testId = test.id;
                }
            });
            return testId;
        }

        function loadTest(testId) {
            testService.getById(testId).then(loadAnswers);
        }

        function loadAnswers(test) {
            if(test) {
                $scope.test = angular.copy(test);
                answerService.getByTestId(test.id).then(goToAnswers);
            }
        }

        function goToAnswers(answers) {
            $scope.answers = angular.copy(answers);
            pickAnotherQuestion();
        }

        function restartTest(testId) {
            $scope.test = {
                id: testId,
                userId: $scope.user.id
            };
            answerService.deleteByTestId(testId).then(addRandomQuestionsToTest);
        }

        function createNewTest() {
            $scope.test = {
                userId: $scope.user.id
            }
            testService.add($scope.test).then(
                function(test) {
                    $scope.test = angular.copy(test);
                    addRandomQuestionsToTest();
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

        function addRandomQuestionsToTest() {
            questionService.getAll().then(
                function(questions) {
                    var positions = generateRandomArray(questions.length);
                    var answers = [];
                    positions.forEach(function(pos) {
                        var answer = {
                            testId: $scope.test.id,
                            questionId: questions[pos].id,
                            time: 0
                        }
                        answers.push(answer);
                    })
                    answerService.addAll(answers).then(
                        function(answers) {
                            $scope.answers = answers;
                            testService.update({
                                id: $scope.test.id,
                                total: $scope.answers.length
                            }).then(function(test) {
                                goToQuestion(answers[0].id);
                            })
                        }
                    );
                }
            )
        }

        function goToQuestion(answerId) {
            var answeredCount = 0;
            $scope.answers.forEach(function(answer) {
                if(answer.answer) {
                    answeredCount++;
                }
            })
            $state.go('test', {answerId: answerId, answered: answeredCount, total: $scope.answers.length});
        }

        function pickAnotherQuestion() {
            var id;
            if($scope.answers.length) {
                $scope.answers.forEach(function(answer) {
                    if(answer.answer == null) {
                        id = answer.id;
                    }
                })
                if(id) {
                    goToQuestion(id);
                } else {
                    var rightCount = 0;
                    $scope.answers.forEach(function(answer) {
                        if(answer.right) {
                            rightCount++;
                        }
                    });
                    var percentage = wqUtil.getPercetange(rightCount, $scope.answers.length);
                    testService.update({
                        id: $scope.answers[0].testId,
                        completedOn: new Date(),
                        percentage: percentage,
                        right: rightCount
                    }).then(
                        function() {
                            $state.go('testCompleted', {testId: $scope.answers[0].testId});
                        }
                    );
                }
            } else {
                addRandomQuestionsToTest();
            }
        }
    }

})();
