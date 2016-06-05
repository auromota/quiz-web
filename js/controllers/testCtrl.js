/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', 'answerService', 'questionService', 'securityService'];

    function testCtrl($scope, $stateParams, $rootScope, $state, $timeout, answerService, questionService, securityService) {

        var user = securityService.getUser();

        if(user.id) {
            loadQuestion();
        } else {
            $state.go('home');
        }

        $scope.hasAnswered = false;

        function loadQuestion() {
            answerService.getById(parseInt($stateParams.answerId)).then(
                function(answers) {
                    if(answers.length) {
                        $scope.answer = answers[0];
                        questionService.getById($scope.answer.questionId).then(
                            function(questions) {
                                if(questions.length) {
                                    $scope.question = questions[0];
                                }
                            }
                        )
                    }
                }, function(err) {
                    $timeout(function() {
                        loadQuestion();
                    }, 100);
                }
            )
        }

        $scope.submit = function() {
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
