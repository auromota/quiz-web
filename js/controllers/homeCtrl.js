(function() {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope'];

    function homeCtrl($scope) {
        $scope.exit = function() {
            window.top.close();
        }
    }
    
})();
