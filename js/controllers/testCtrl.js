/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$interval', 'answerService', 'questionService', 'securityService'];

    function testCtrl($scope, $stateParams, $rootScope, $state, $timeout, $interval, answerService, questionService, securityService) {

        var user = securityService.getUser();
        var time = 0;

        if(user.id) {
            loadQuestion();
        } else {
            $state.go('home');
        }

        $scope.hasAnswered = false;

        function loadQuestion() {
            if($stateParams.answerId) {
                answerService.getById(parseInt($stateParams.answerId)).then(
                    function(answers) {
                        if(answers.length) {
                            $scope.answer = answers[0];
                            questionService.getById($scope.answer.questionId).then(
                                function(questions) {
                                    if(questions.length) {
                                        $scope.question = questions[0];
                                        $interval(function() {
                                            time++;
                                        }, 1000);
                                    }
                                }
                            )
                        }
                    }
                )
            } else {
                $state.go('home');
            }
        }

        $scope.submit = function() {
            $scope.answer.time = angular.copy(time);
            $scope.hasAnswered = true;
            if(parseInt($scope.answer.answer) == $scope.question.rightAnswer) {
                $scope.answer.right = true;
            } else {
                $scope.answer.right = false;
            }
            answerService.update($scope.answer).then(
                function() {
                    if($scope.answer.right) {
                        alert('Você acertou!');
                    } else {
                        alert('Você errou!');
                    }
                    $rootScope.$broadcast('questionAnswered', $scope.answer);
                }
            );
        }
    }

})();
