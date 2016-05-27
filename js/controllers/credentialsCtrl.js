/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('credentialsCtrl', credentialsCtrl);

    credentialsCtrl.$inject = ['$scope', 'userService'];

    function credentialsCtrl($scope, userService) {
        $scope.user = {};

        $scope.submit = function() {
            if(confirm('Sua matrícula é ' + $scope.user.id + '?')) {
                userService.save($scope.user).then(
                    function(user) {

                    }
                );
            }
        }

    }

})();
