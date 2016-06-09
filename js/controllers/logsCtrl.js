/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('logsCtrl', logsCtrl);

    logsCtrl.$inject = ['$scope', '$state', 'SweetAlert', 'testService'];

    function logsCtrl($scope, $state, SweetAlert, testService) {

        function loadTests() {
            testService.getAllTestsAndUsers().then(function(tests) {
                $scope.tests = tests;
            }, function(err) {
                $state.go('home');
            });
        }

        loadTests();

        $scope.clear = function() {
            var params = {
                title: 'Você tem certeza?',
                text: 'Se você continuar, todos os testes, inclusive os que estiverem em progresso, serão apagados.',
                type: 'warning',
                confirmButtonColor: '#d62c1a',
                confirmButtonText: 'Apagar',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            };
            SweetAlert.swal(params, function(isConfirm) {
                if(isConfirm) {
                    removeTests();
                }
            });
        }

        function removeTests() {
            testService.removeAll().then(loadTests);
        }

        $scope.details = function(id) {
            $state.go('testDetails', {testId: id});
        }

    }

})();
