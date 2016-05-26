'use strict';
var app = angular.module('app', ['ui.router']).run([
    'dbService',
    function(dbService) {
        dbService.initDatabase();
    }
]);
