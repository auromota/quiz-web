/*
    Author: Auro Mota <auro@blueorc.com>
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
            getById: getById,
            getAllTestsAndUsers: getAllTestsAndUsers,
            getTestAndUser: getTestAndUser,
            removeAll: removeAll
        }

        return service;

        function add(test) {
            var deferred = $q.defer();
            crudService.insert(test, 'tests').then(
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
            crudService.find(userId, 'tests', 'userId').then(
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
            crudService.update(test.id, test, 'tests').then(
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
            crudService.find(id, 'tests', 'id').then(
                function(tests) {
                    deferred.resolve(tests[0]);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getAllTestsAndUsers() {
            var deferred = $q.defer();
            try {
                dbService.db.select()
                    .from(dbService.tests)
                    .innerJoin(dbService.users, dbService.tests.userId.eq(dbService.users.id))
                    .where(dbService.tests.completedOn.isNotNull())
                    .exec().then(
                        function(tests) {
                            deferred.resolve(tests);
                        }, function(err) {
                            deferred.reject(err);
                        }
                    );
            } catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }

        function getTestAndUser(id) {
            var deferred = $q.defer();
            try {
                dbService.db.select()
                    .from(dbService.tests)
                    .innerJoin(dbService.users, dbService.tests.userId.eq(dbService.users.id))
                    .where(dbService.tests.id.eq(id))
                    .exec().then(
                        function(test) {
                            deferred.resolve(test[0]);
                        }, function(err) {
                            deferred.reject(err);
                        }
                    );
            } catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }

        function removeAll() {
            var deferred = $q.defer();
            crudService.removeAll('tests').then(
                function(result) {
                    deferred.resolve(result);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }
    }

})();
