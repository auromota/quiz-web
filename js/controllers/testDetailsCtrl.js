/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('testDetailsCtrl', testDetailsCtrl);

    testDetailsCtrl.$inject = ['$scope', '$state', 'testService', 'answerService', 'questionService'];

    function testDetailsCtrl($scope, $state, testService, answerService, questionService) {

        $scope.data = {};

        $scope.questionTimeChart = {
            type: 'ColumnChart',
            displayed: false
        };

        function loadTest(id) {
            testService.getTestAndUser(id).then(loadAnswers, redirect);
        }

        function redirect() {
            $state.go('home');
        }

        function loadAnswers(data) {
            $scope.data.test = data.tests;
            $scope.data.user = data.users;
            answerService.getByTestId($scope.data.test.id).then(loadQuestions);
        }

        function loadQuestions(answers) {
            $scope.data.answers = answers;
            $scope.data.answers.forEach(loadQuestion);
            loadData();
        }

        function loadData() {
            loadQuestionTimeChart();
            calculateTotalTime();
        }

        function calculateTotalTime() {
            var time = 0;
            $scope.data.answers.forEach(sum);
            $scope.totalTime = time;

            function sum(answer) {
                time += answer.time;
            }
        }

        function loadQuestion(answer) {
            questionService.getById(answer.questionId).then(function(questions) {
                if(questions) {
                    answer.question = questions[0];
                }
            });
        }

        function getQuestionTimeChartRows() {
            var rows = [];
            $scope.data.answers.forEach(function(answer) {
                var row = {
                    c: [
                        {v: 'Questão ' + answer.order},
                        {v: answer.time}
                    ]
                };
                rows.push(row);
            });
            return rows;
        }


        function loadQuestionTimeChart() {
            var data = {
                cols: [
                    {id: 'question', label: 'Questão', type: 'string'},
                    {id: 'time', label: 'Tempo', type: 'number'}
                ],
                rows: getQuestionTimeChartRows()
            }
            $scope.questionTimeChart.data = data;
            $scope.questionTimeChart.options = {
                title: 'Duração por questão',
                colors: ['#2c3e50'],
                vAxis: {
                    title: 'Tempo',
                    gridlines: {
                        count: 10
                    }
                },
                hAxis: {
                    title: 'Questão'
                }
            }
        }

        if($state.params.testId) {
            loadTest($state.params.testId)
        } else {
            $state.go('logs');
        }

    }

})();
