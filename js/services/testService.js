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
            replace: replace
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

        function replace(test) {
            var deferred = $q.defer();
            crudService.insertOrReplace(test, dbService.tests).then(
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
    }

})();
