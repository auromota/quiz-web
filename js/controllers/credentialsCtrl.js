/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('credentialsCtrl', credentialsCtrl);

    credentialsCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'SweetAlert', 'userService', 'securityService'];

    function credentialsCtrl($scope, $rootScope, $timeout, SweetAlert, userService, securityService) {
        $scope.user = {};

        $scope.submit = function () {
            var params = {
                title: 'Pronto para começar?',
                text: 'Bem-vindo, ' + $scope.user.name + '! Vamos testar seus conhecimentos. Bora lá? ;)',
                imageUrl: './img/question.png',
                showCancelButton: true,
                cancelButtonText: 'Ainda não',
                confirmButtonText: 'Iniciar',
                confirmButtonColor: '#2c3e50',
                closeOnCancel: false,
                closeOnConfirm: false
            };
            SweetAlert.swal(params, function (isConfirm) {
                if (isConfirm) {
                    confirmUser();
                } else {
                    showComeBackSoonMessage();
                }
            });
        }

        function confirmUser() {
            userService.save($scope.user).then(
                function (user) {
                    securityService.login(user);
                    $rootScope.$broadcast('userSelected', user);
                }
            );
        }

        function showComeBackSoonMessage() {
            var params = {
                title: 'Ah! :(',
                text: 'Esperamos que você volte em breve!',
                type: 'error',
                confirmButtonText: 'Pode deixar',
                confirmButtonColor: '#2c3e50'
            };
            SweetAlert.swal(params);
        }

    }

})();
