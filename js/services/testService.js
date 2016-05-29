/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.factory('testService', testService);

    testService.$inject = ['$q', 'dbService', 'crudService'];

    function testService($q, dbService, crudService) {
        var service = {
            getByUserId: getByUserId,
            add: add,
            update: update,
            getById: getById
        }

        return service;

        function add(test) {
            var deferred = $q.defer();
            crudService.insert(test, dbService.tests).then(
                function(test) {
                    deferred.resolve(test);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getByUserId(userId) {
            var deferred = $q.defer();
            crudService.find(userId, dbService.tests, 'userId').then(
                function(tests) {
                    deferred.resolve(tests);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function update(test) {
            var deferred = $q.defer();
            crudService.update(test.id, test, dbService.tests).then(
                function(result) {
                    deferred.resolve(result);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            crudService.find(id, dbService.tests, 'id').then(
                function(tests) {
                    deferred.resolve(tests);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }
    }

})();
