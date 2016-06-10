/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$interval', 'SweetAlert', 'answerService', 'questionService', 'securityService', 'utilService'];

    function testCtrl($scope, $stateParams, $rootScope, $state, $timeout, $interval, SweetAlert, answerService, questionService, securityService, utilService) {

        var user = securityService.getUser();
        var time = 0;

        if(user.id) {
            loadAnswers();
        } else {
            $state.go('home');
        }

        $scope.hasAnswered = false;

        function loadAnswers() {
            if($stateParams.answerId) {
                var id = parseInt($stateParams.answerId);
                answerService.getById(id).then(loadQuestion);
            } else {
                $state.go('home');
            }
        }

        function loadQuestion(answers) {
            if(answers.length) {
                $scope.answer = answers[0];
                questionService.getById($scope.answer.questionId).then(updateProgressBar);
            }
        }

        function updateProgressBar(questions) {
            if(questions.length) {
                $scope.question = questions[0];
                var percentage = utilService.getPercetange($state.params.answered, $state.params.total);
                $scope.$emit('percentageReady', percentage);
                startTimeCounter();
            }
        }

        function startTimeCounter() {
            $interval(function() {
                time+=0.005;
            }, 5);
        }

        function getTime() {
            $scope.answer.time = angular.copy(time);
        }

        function checkAnswer() {
            if(!$scope.answer.answer) return null;
            var answer = parseInt($scope.answer.answer);
            if(answer === $scope.question.rightAnswer) {
                return true;
            }
            return false;
        }

        $scope.submit = function() {
            var answer = checkAnswer();
            if(answer !== null) {
                $scope.hasAnswered = true;
                getTime();
                $scope.answer.right = checkAnswer();
                answerService.update($scope.answer).then(showResult);
            }
        }

        function showResult() {
            var params = {};
            if($scope.answer.right) {
                params.title = 'Parabéns!';
                params.text = 'Você acertou a questão.';
                params.type = 'success';
                params.confirmButtonColor = '#2c3e50';
            } else {
                params.title = 'Que pena!';
                params.text = 'Você errou a questão.';
                params.type = 'error';
                params.confirmButtonColor = '#2c3e50';
            }
            SweetAlert.swal(params, doBroadcast);
        }

        function doBroadcast() {
            $rootScope.$broadcast('questionAnswered', $scope.answer);
        }
    }

})();
