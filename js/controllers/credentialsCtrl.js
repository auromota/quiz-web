/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('credentialsCtrl', credentialsCtrl);

    credentialsCtrl.$inject = ['$scope', '$rootScope', 'userService', 'securityService'];

    function credentialsCtrl($scope, $rootScope, userService, securityService) {
        $scope.user = {};

        $scope.submit = function() {
            if(confirm('Sua matrícula é ' + $scope.user.id + '?')) {
                userService.save($scope.user).then(
                    function(user) {
                        securityService.login(user);
                        $rootScope.$broadcast('userSelected', user);
                    }
                );
            }
        }

    }

})();
