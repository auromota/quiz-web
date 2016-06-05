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
        var isReady = false;
        var tables = {};
        var tableNames = Object.keys(TABLE);
        var service = {
            db: db,
            isReady: isReady,
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
                        .then(function(database) {
                            isConnecting = false;
                            service.db = database;
                            tableNames.forEach(function(tableName) {
                                service[tableName] = service.db.getSchema().table(tableName);
                            });
                            window.db = database;
                            deferred.resolve();
                        }, function(err) {
                            deferred.reject(err);
                        });
                } else {
                    deferred.resolve();
                }
            } else {
                deferred.reject('Still connecting to the database');
            }
            return deferred.promise;
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

        function initDatabase() {
            connect().then(function() {
                checkForExistingQuestions().then(
                    function(hasData) {
                        if(!hasData) {
                            insertQuestions().then(
                                function() {
                                    isReady = true;
                                }
                            )
                        }
                    }
                );
            })
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

        function checkForExistingQuestions() {
            var deferred = $q.defer();
            service.db.select().
                from(service.questions).
                exec().then(
                    function(data) {
                        deferred.resolve(data.length > 0);
                    }
                );
            return deferred.promise;
        }
    }

})();
