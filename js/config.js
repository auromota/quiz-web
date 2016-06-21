/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    var users = {
        columns: [
            { name: 'id', type: lf.Type.STRING },
            { name: 'name', type: lf.Type.STRING }
        ],
        primaryKeys: [{ column: 'id' }]
    };

    var questions = {
        columns: [
            { name: 'id', type: lf.Type.INTEGER },
            { name: 'text', type: lf.Type.STRING },
            { name: 'firstAnswer', type: lf.Type.STRING },
            { name: 'secondAnswer', type: lf.Type.STRING },
            { name: 'thirdAnswer', type: lf.Type.STRING },
            { name: 'fourthAnswer', type: lf.Type.STRING },
            { name: 'rightAnswer', type: lf.Type.INTEGER }
        ],
        primaryKeys: [{ column: 'id', isAutoIncrement: true }]
    };

    var tests = {
        columns: [
            { name: 'id', type: lf.Type.INTEGER },
            { name: 'userId', type: lf.Type.STRING },
            { name: 'completedOn', type: lf.Type.DATE_TIME, isNullable: true },
            { name: 'percentage', type: lf.Type.NUMBER, isNullable: true },
            { name: 'total', type: lf.Type.NUMBER, isNullable: true },
            { name: 'right', type: lf.Type.NUMBER, isNullable: true }
        ],
        primaryKeys: [{ column: 'id', isAutoIncrement: true }],
        foreignKeys: [{ name: 'fkUserId', column: 'userId', ref: 'users.id', action: lf.ConstraintAction.CASCADE }]
    }

    var answers = {
        columns: [
            { name: 'id', type: lf.Type.INTEGER },
            { name: 'testId', type: lf.Type.INTEGER },
            { name: 'questionId', type: lf.Type.INTEGER },
            { name: 'answer', type: lf.Type.INTEGER, isNullable: true },
            { name: 'right', type: lf.Type.BOOLEAN, isNullable: true },
            { name: 'time', type: lf.Type.NUMBER },
            { name: 'order', type: lf.Type.INTEGER }
        ],
        primaryKeys: [{column: 'id', isAutoIncrement: true}],
        foreignKeys: [
            { name: 'fkTestId', column: 'testId', ref: 'tests.id', action: lf.ConstraintAction.CASCADE },
            { name: 'fkQuestionId', column: 'questionId', ref: 'questions.id', action: lf.ConstraintAction.CASCADE }
        ]
    }

    var tables = {
        users: users,
        questions: questions,
        tests: tests,
        answers: answers
    };

    app.constant('TABLE', tables);

    app.constant('NUMBER_OF_QUESTIONS', 10);

})();
