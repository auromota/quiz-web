/*
    Author: Auro Mota <auro@blueorc.com>
*/

var wqUtil = {
    getPercetange: function(number, total) {
        if(!total) {
            return 100;
        }
        return 100*number/total;
    }
};
