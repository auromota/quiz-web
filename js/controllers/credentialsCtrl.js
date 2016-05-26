(function() {
    'use strict';

    app.controller('credentialsCtrl', credentialsCtrl);

    credentialsCtrl.$inject = ['$scope'];

    function credentialsCtrl($scope) {
        $scope.user = {};

        $scope.submit = function() {
            console.log('teste');
        }
    }
    
})();
