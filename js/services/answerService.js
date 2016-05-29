/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.factory('answerService', answerService);

    answerService.$inject = ['$q', 'dbService', 'crudService'];

    function answerService($q, dbService, crudService) {
        var service = {
            getByTestId: getByTestId,
            add: add,
            addAll: addAll,
            replace: replace,
            deleteByTestId: deleteByTestId
        }

        return service;

        function add(answer) {
            var deferred = $q.defer();
            crudService.insert(answer, dbService.answers).then(
                function(answer) {
                    deferred.resolve(answer);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function addAll(answers) {
            var deferred = $q.defer();
            try {
                var tx = dbService.db.createTransaction();
                var queries = [];
                answers.forEach(function(answer) {
                    var row = dbService.answers.createRow(answer);
                    var query = dbService.db.insert()
                        .into(dbService.answers)
                        .values([row]);
                    queries.push(query);
                })
                tx.exec(queries);
                if(answers.length) {
                    crudService.find(answers[0].testId, dbService.answers, 'testId').then(
                        function(answers) {
                            deferred.resolve(answers);
                        }, function(err) {
                            deferred.reject(err);
                        }
                    );
                } else {
                    deferred.resolve();
                }
            } catch(err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }

        function replace(answer) {
            var deferred = $q.defer();
            crudService.insertOrReplace(answer, dbService.answers).then(
                function(answer) {
                    deferred.resolve(answer);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getByTestId(testId) {
            var deferred = $q.defer();
            crudService.find(testId, dbService.answers, 'testId').then(
                function(answers) {
                    deferred.resolve(answers);
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function deleteByTestId(testId) {
            var deferred = $q.defer();
            crudService.remove(testId, dbService.answers, 'testId').then(
                function() {
                    deferred.resolve();
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }
    }

})();
