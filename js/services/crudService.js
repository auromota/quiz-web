/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.factory('crudService', crudService);

    crudService.$inject = ['$q', 'dbService'];

    function crudService($q, dbService) {
        var service = {
            find: find,
            insert: insert,
            insertOrReplace: insertOrReplace,
            findAll: findAll,
            remove: remove,
            update: update,
            removeAll: removeAll
        }

        return service;

        function insert(data, table) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                var row = dbService[table].createRow(data);
                dbService.db.insert()
                    .into(dbService[table])
                    .values([row])
                    .exec()
                    .then(function(response) {
                        deferred.resolve(response[0]);
                    }, function(err) {
                        deferred.reject(err);
                    })
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function insertOrReplace(data, table) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                var row = dbService[table].createRow(data);
                dbService.db.insertOrReplace()
                    .into(dbService[table])
                    .values([row])
                    .exec()
                    .then(function(response) {
                        deferred.resolve(response[0]);
                    }, function(err) {
                        deferred.reject(err);
                    })
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function find(value, table, column) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                dbService.db.select()
                    .from(dbService[table])
                    .where(dbService[table][column].eq(value))
                    .exec()
                    .then(function(results) {
                        if(angular.isDefined(results)) {
                            deferred.resolve(results);
                        } else {
                            deferred.reject();
                        }
                    });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function findAll(table) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                dbService.db.select()
                    .from(dbService[table])
                    .exec()
                    .then(function(results) {
                        if(angular.isDefined(results)) {
                            deferred.resolve(results);
                        } else {
                            deferred.reject();
                        }
                    });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function remove(value, table, column) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                dbService.db.delete()
                    .from(dbService[table])
                    .where(dbService[table][column].eq(value))
                    .exec()
                    .then(function(result) {
                        deferred.resolve(result);
                    }, function(err) {
                        deferred.reject(err);
                    });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function removeAll(table) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                dbService.db.delete()
                    .from(dbService[table])
                    .exec()
                    .then(function(result) {
                        deferred.resolve(result);
                    }, function(err) {
                        deferred.reject(err);
                    });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function update(id, data, table) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                var query = dbService.db.update(dbService[table]);
                var columns = Object.keys(data);
                columns.forEach(function(column) {
                    if(column != dbService[table].id.getName()) {
                        query = query.set(dbService[table][column], data[column]);
                    }
                });
                query.where(dbService[table][dbService[table].id.getName()].eq(id)).exec().then(
                    function(result) {
                        deferred.resolve(result);
                    }, function(err) {
                        deferred.reject(err);
                    }
                )
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }

})();
