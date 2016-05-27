(function() {
    'use strict';

    app.factory('userService', userService);

    userService.$inject = ['$q', 'dbService'];

    function userService($q, dbService) {
        var service = {
            getById: getById,
            add: add
        }

        return service;

        function add(user) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                var row = dbService.userTable.createRow(user);
                dbService.db.insert()
                    .into(dbService.userTable)
                    .values([row])
                    .exec()
                    .then(function() {
                        deferred.resolve();
                    })
            });
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                dbService.db.select()
                    .from(dbService.userTable)
                    .where(dbService.userTable.id.eq(id))
                    .exec()
                    .then(function(results) {
                        if(angular.isDefined(results) && results.length == 1) {
                            deferred.resolve(results[0]);
                        } else {
                            deferred.reject();
                        }
                    });
            });
            return deferred.promise;
        }
    }

})();
