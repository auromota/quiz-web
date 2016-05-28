/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.factory('userService', userService);

    userService.$inject = ['$q', 'dbService', 'crudService'];

    function userService($q, dbService, crudService) {
        var service = {
            getById: getById,
            save: save
        }

        return service;

        function save(user) {
            var deferred = $q.defer();
            crudService.insertOrReplace(user, dbService.users).then(
                function(user) {
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            crudService.find(id, dbService.users, 'id').then(
                function(user) {
                    deferred.resolve(user[0]);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

    }

})();
