/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.factory('utilService', utilService);

    utilService.$inject = ['NUMBER_OF_QUESTIONS'];

    function utilService(NUMBER_OF_QUESTIONS) {
        var service = {
            getPercetange: getPercetange,
            generateRandomArray: generateRandomArray,
            canInsertNumber: canInsertNumber
        };

        return service;

        function getPercetange(number, total) {
            if(!total) {
                return 100;
            }
            return 100*number/total;
        }

        function generateRandomArray(size) {
            var array = [];
            var arraySize = size > NUMBER_OF_QUESTIONS ? NUMBER_OF_QUESTIONS : size;
            for(var i=0; i<arraySize; i++) {
                var pos = Math.floor(Math.random() * size);
                while(!canInsertNumber(array, pos)) {
                    var pos = Math.floor(Math.random() * size);
                }
                array.push(pos);
            }
            return array;
        }

        function canInsertNumber(array, pos) {
            var can = true;
            array.forEach(function(id) {
                if(id == pos) can = false;
            });
            return can;
        }
    }
})();
