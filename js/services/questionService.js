/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.factory('questionService', questionService);

    questionService.$inject = ['$q', 'dbService', 'crudService'];

    function questionService($q, dbService, crudService) {
        var service = {
            getAll: getAll,
            getById: getById
        }

        return service;

        function getAll() {
            var deferred = $q.defer();
            crudService.findAll(dbService.questions).then(
                function(questions) {
                    deferred.resolve(questions);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            crudService.find(id, dbService.questions, 'id').then(
                function(questions) {
                    deferred.resolve(questions);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }
    }

})();
