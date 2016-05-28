/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    var users = {
        columns: [
            { name: 'id', type: lf.Type.STRING },
            { name: 'name', type: lf.Type.STRING }
        ],
        primaryKeys: [{column: 'id'}]
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
        primaryKeys: [{column: 'id', isAutoIncrement: true}]
    };

    var tests = {
        columns: [
            { name: 'id', type: lf.Type.INTEGER },
            { name: 'userId', type: lf.Type.STRING },
            { name: 'isCompleted', type: lf.Type.BOOLEAN }
        ],
        primaryKeys: [{column: 'id', isAutoIncrement: true}],
        foreignKeys: [{name: 'fkUserId', column: 'userId', ref: 'users.id', action: lf.ConstraintAction.CASCADE}]
    }

    var tables = {
        users: users,
        questions: questions,
        tests: tests
    };

    app.constant('TABLE', tables);

})();
