/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('appCtrl', appCtrl);

    appCtrl.$inject = ['$scope', '$state', 'SweetAlert', 'testService', 'answerService', 'questionService'];

    function appCtrl($scope, $state, SweetAlert, testService, answerService, questionService) {
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

        function continueTest(testId) {
            var params = {
                title: 'Teste em progresso!',
                text: 'Você já tem um teste em progresso. Deseja continuá-lo?',
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Novo teste',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#2c3e50'
            };
            SweetAlert.swal(params, function(isConfirm) {
                if(isConfirm) {
                    loadTest(testId);
                } else {
                    restartTest(testId);
                }
            });
        }

        function checkTests(tests) {
            var testId = checkForIncompleteTests(tests);
            if(testId) {
                continueTest(testId);
            } else {
                showNewTest();
            }
        }

        function showNewTest() {
            var params = {
                title: 'Boa sorte!',
                text: 'Vamos lá, mostre o seu melhor! ;)',
                imageUrl: './img/luck.png',
                confirmButtonText: 'Partiu',
                confirmButtonColor: '#2c3e50'
            }
            SweetAlert.swal(params, createNewTest);
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
                    answerService.addAll(answers).then(initializeTest);
                }
            )
        }

        function initializeTest(answers) {
            $scope.answers = answers;
            var test = {
                id: $scope.test.id,
                total: $scope.answers.length
            };
            testService.update(test).then(function() {
                goToQuestion(answers[0].id);
            });
        }

        function goToQuestion(answerId) {
            var answeredCount = 0;
            $scope.answers.forEach(function(answer) {
                if(answer.answer) {
                    answeredCount++;
                }
            })
            var params = {
                answerId: answerId,
                answered: answeredCount,
                total: $scope.answers.length
            };
            $state.go('test', params);
        }

        function pickAnotherQuestion() {
            var id;
            if($scope.answers.length) {
                $scope.answers.forEach(function(answer) {
                    if(answer.answer == null) {
                        id = answer.id;
                    }
                });
                if(id) {
                    goToQuestion(id);
                } else {
                    endTest();
                }
            } else {
                addRandomQuestionsToTest();
            }
        }

        function countRightAnswers() {
            var rightCount = 0;
            $scope.answers.forEach(function(answer) {
                if(answer.right) {
                    rightCount++;
                }
            });
            return rightCount;
        }

        function endTest() {
            var rightCount = countRightAnswers();
            var percentage = wqUtil.getPercetange(rightCount, $scope.answers.length);
            var test = {
                id: $scope.answers[0].testId,
                completedOn: new Date(),
                percentage: percentage,
                right: rightCount
            };
            testService.update(test).then(goToTestCompleted);
        }

        function goToTestCompleted() {
            $state.go('testCompleted', {testId: $scope.test.id});
        }

    }

})();
