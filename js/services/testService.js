/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.factory('testService', testService);

    testService.$inject = ['$q', 'dbService'];

    function testService($q, dbService) {
        var service = {
            getById: getById,
            add: add
        }

        return service;

        function add(user) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                var row = dbService.tests.createRow(user);
                dbService.db.add()
                    .into(dbService.tests)
                    .values([row])
                    .exec()
                    .then(function(response) {
                        deferred.resolve(response[0]);
                    }, function(err) {
                        deferred.reject(err);
                    })
            });
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            dbService.connect().then(function() {
                dbService.db.select()
                    .from(dbService.tests)
                    .where(dbService.tests.id.eq(id))
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
