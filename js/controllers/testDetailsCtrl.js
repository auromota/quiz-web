/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('testDetailsCtrl', testDetailsCtrl);

    testDetailsCtrl.$inject = ['$scope', '$state', 'testService', 'answerService', 'questionService'];

    function testDetailsCtrl($scope, $state, testService, answerService, questionService) {

        $scope.data = {};
        $scope.testChart = {
            type: 'LineChart'
        };

        function loadTest(id) {
            testService.getTestAndUser(id).then(loadAnswers);
        }

        function loadAnswers(data) {
            $scope.data.test = data.tests;
            $scope.data.user = data.users;
            answerService.getByTestId($scope.data.test.id).then(loadQuestions);
        }

        function loadQuestions(answers) {
            $scope.data.answers = answers;
            $scope.data.answers.forEach(loadQuestion);
            loadChart();
        }

        function loadQuestion(answer) {
            questionService.getById(answer.questionId).then(function(questions) {
                if(questions) {
                    answer.question = questions[0];
                }
            });
        }

        function getChartRows() {
            var rows = [];
            $scope.data.answers.forEach(function(answer) {
                var row = {
                    c: [
                        {v: 'Questão ' + answer.questionId},
                        {v: answer.time}
                    ]
                };
                rows.push(row);
            });
            return rows;
        }


        function loadChart() {
            var data = {
                cols: [
                    {id: 'question', label: 'Questão', type: 'string'},
                    {id: 'time', label: 'Tempo', type: 'number'}
                ],
                rows: getChartRows()
            }
            $scope.testChart.data = data;
            $scope.testChart.options = {
                'title': 'Duração das questões',
                'colors': ['#2c3e50'],
                'vAxis': {
                    'title': 'Tempo',
                    'gridlines': {
                        'count': 10
                    }
                },
                'hAxis': {
                    'title': 'Questão'
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
