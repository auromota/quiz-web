/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.factory('dbService', dbService);

    dbService.$inject = ['$http', '$log', '$q', '$rootScope', 'TABLE'];

    function dbService($http, $log, $q, $rootScope, TABLE) {
        var db = null;
        var tables = {};
        var tableNames = Object.keys(TABLE);
        var service = {
            db: db,
            connect: connect,
            initDatabase: initDatabase
        };
        tableNames.forEach(function(tableName) {
            tables[tableName] = null;
            service[tableName] = tables[tableName];
        });
        var isConnecting = false;
        return service;

        function connect() {
            var deferred = $q.defer();

            if(isConnecting === false) {
                var connectionOptions = {
                    storeType: lf.schema.DataStoreType.INDEXED_DB
                };
                if(service.db === null) {
                    isConnecting = true;
                    buildSchema()
                        .connect(connectionOptions)
                        .then((
                            function(database) {
                                isConnecting = false;
                                service.db = database;
                                tableNames.forEach(function(tableName) {
                                    service[tableName] = service.db.getSchema().table(tableName);
                                });
                                window.db = database;
                                deferred.resolve();
                            }
                        ));
                } else {
                    deferred.resolve();
                }
            } else {
                deferred.reject('Still connecting to the database');
            }
            return deferred.promise;
        }

        function initDatabase() {
            connect().then(function() {
                $rootScope.$broadcast('dbConnected');
                deleteExistingQuestions().then(
                    function() {
                        insertQuestions().then(
                            function() {
                                $rootScope.$broadcast('seedDataInserted');
                            }
                        )
                    }
                );
            })
        }

        function buildSchema() {
            var schemaBuilder = lf.schema.create('database', 1);
            var tableNames = Object.keys(TABLE);
            tableNames.forEach(function(tableName) {
                var table = schemaBuilder.createTable(tableName);
                if(TABLE[tableName].columns) {
                    TABLE[tableName].columns.forEach(function(column) {
                        table.addColumn(column.name, column.type);
                        if(column.isNullable) {
                            table.addNullable([column.name]);
                        }
                    });
                }
                if(TABLE[tableName].primaryKeys) {
                    TABLE[tableName].primaryKeys.forEach(function(pk) {
                        if(pk.isAutoIncrement) {
                            table.addPrimaryKey([pk.column], true);
                        } else {
                            table.addPrimaryKey([pk.column]);
                        }
                    });
                }
                if(TABLE[tableName].foreignKeys) {
                    TABLE[tableName].foreignKeys.forEach(function(fk) {
                        table.addForeignKey(fk.name, {
                            local: fk.column,
                            ref: fk.ref,
                            action: fk.action
                        })
                    });
                }
            });
            return schemaBuilder;
        }

        function insertQuestions() {
            var url = './questions.json';
            return $http.get(url).then(
                function(response) {
                    var rows = response.data.map(function(obj) {
                        return service.questions.createRow(obj);
                    });
                    return service.db.insert()
                        .into(service.questions)
                        .values(rows)
                        .exec();
                }
            );
        }

        function deleteExistingQuestions() {
            var deferred = $q.defer();
            service.db.delete().
                from(service.questions).
                exec().then(
                    function() {
                        deferred.resolve();
                    }
                );
            return deferred.promise;
        }
    }

})();
