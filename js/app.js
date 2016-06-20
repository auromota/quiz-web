/*
    Author: Auro Mota <auro@blueorc.com>
*/

'use strict';
var app = angular.module('app', ['ui.router', 'oitozero.ngSweetAlert', 'googlechart'])

    .run(['dbService', function (dbService) {
        dbService.initDatabase();
    }]);
