(function() {
    'use strict';

    app.factory('dbService', dbService);

    dbService.$inject = ['$http', '$log', '$q', '$rootScope', 'TABLE'];

    function dbService($http, $log, $q, $rootScope, TABLE) {
        var db = null;
        var userTable = null;
        var questionTable = null;
        var isConnecting = false;
        var service = {
            db: db,
            userTable: userTable,
            questionTable: questionTable,
            connect: connect,
            initDatabase: initDatabase
        };
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
                                service.userTable = service.db.getSchema().table(TABLE.User.name);
                                service.questionTable = service.db.getSchema().table(TABLE.Question.name);
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
                checkForExistingData().then(
                    function(dataExists) {
                        if(dataExists === false) {
                            insertSeedData().then(
                                function() {
                                    $rootScope.$broadcast('seedDataInserted');
                                }
                            )
                        }
                    }
                );
            })
        }

        function buildSchema() {
            var schemaBuilder = lf.schema.create('database', 1);
            var tableNames = Object.keys(TABLE);
            tableNames.forEach(function(tableName) {
                var table = schemaBuilder.createTable(TABLE[tableName].name);
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

        function insertSeedData() {
            var url = '../questions.json';
            return $http.get(url).then(
                function(response) {
                    var rows = response.data.map(function(obj) {
                        return service.questionTable.createRow(obj);
                    });
                    return service.db.insert()
                        .into(service.questionTable)
                        .values(rows)
                        .exec();
                }
            );
        }

        function checkForExistingData() {
            var deferred = $q.defer();
            service.db.select().
                from(service.questionTable).
                exec().then(
                    function(rows) {
                        deferred.resolve(rows.length > 0);
                    }
                );
            return deferred.promise;
        }
    }

})();
