/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
	'use strict';

	app.directive('wqProgressBar', wqProgressBar);

	wqProgressBar.$inject = [];

	function wqProgressBar() {

		function link(scope, element, attrs) {
			var percentage;

			function update() {
				element.css({
					width: percentage + '%'
				});
			}

			scope.$on('percentageReady', function(e, value) {
				if(attrs.wqProgressBar === "wrong") {
					percentage = value.wrongPercentage;
					update();
				}
				if(attrs.wqProgressBar === "right") {
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
