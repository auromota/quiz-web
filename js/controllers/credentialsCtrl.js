(function() {
    'use strict';

    app.controller('credentialsCtrl', credentialsCtrl);

    credentialsCtrl.$inject = ['$scope', 'userService'];

    function credentialsCtrl($scope, userService) {
        $scope.user = {};

        $scope.submit = function() {
            userService.add($scope.user);
        }
    }

})();
