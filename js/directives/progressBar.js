/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
	'use strict';

	app.directive('progressBar', progressBar);

	progressBar.$inject = ['$document'];

	function progressBar($document) {

		function link(scope, element, attrs) {
			var percentage;

			function update() {
				element.css({
					width: percentage + '%'
				});
			}

			scope.$on('percentageReady', function(e, value) {
				if(attrs.progressBar === "wrong") {
					percentage = value.wrongPercentage;
					update();
				}
				if(attrs.progressBar === "right") {
					percentage = value.rightPercentage;
					update();
				}
			});
		}

		return {
			link: link
		}
	}
})();
