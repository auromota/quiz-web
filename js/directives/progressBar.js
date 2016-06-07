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
				if(attrs.wqProgressBar === "right") {
					percentage = 100-value;
					update();
				}
				if(attrs.wqProgressBar === "left") {
					percentage = value;
					update();
				}
			});
		}

		return {
			link: link
		}
	}
})();
