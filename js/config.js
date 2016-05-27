(function() {
    'use strict';

    var User = {
        name: 'user',
        columns: [
            { name: 'id', type: lf.Type.STRING },
            { name: 'name', type: lf.Type.STRING }
        ],
        primaryKeys: [{column: 'id'}]
    };

    var Question = {
        name: 'question',
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

    var Test = {
        name: 'test',
        columns: [
            { name: 'id', type: lf.Type.INTEGER },
            { name: 'userId', type: lf.Type.STRING }
        ],
        primaryKeys: [{column: 'id', isAutoIncrement: true}],
        foreignKeys: [{name: 'fkUserId', column: 'userId', ref: 'user.id', action: lf.ConstraintAction.CASCADE}]
    }

    var tables = {
        User: User,
        Question: Question,
        Test: Test
    };

    app.constant('TABLE', tables);

})();
