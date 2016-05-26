app.controller('HomeController', ['$scope', function($scope) {

    $scope.exit = function() {
        window.top.close();
    }

}]);
