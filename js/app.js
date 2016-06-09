/*
    Author: Auro Mota <auro@blueorc.com>
*/

'use strict';
var app = angular.module('app', ['ui.router', 'oitozero.ngSweetAlert'])

.run(['dbService', function(dbService) {
    dbService.initDatabase();
    //indexedDB.deleteDatabase('database');
}]);
