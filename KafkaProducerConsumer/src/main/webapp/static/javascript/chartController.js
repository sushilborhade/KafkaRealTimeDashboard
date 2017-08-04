myApp.controller('myController', function($scope, $timeout, $rootScope) {
	$scope.myCategories = [ 'Red', 'Green', 'Blue' ];
	$scope.mySeries = [ {
		//data: [0, 0, 0],
		colorByPoint : true
	} ];

	randomData();
	function randomData(min, max) {
		$scope.mySeries[0].data = [
			randomNumber(0, 100),
			randomNumber(0, 100),
			randomNumber(0, 100),
			randomNumber(0, 100)
		];

		$scope.myCategories = [ 'Red', 'Green', 'Blue', 'Yellow' ];
	};

	$scope.redrawChart = function(categories, data) {
		$scope.myCategories = categories;
		$scope.mySeries[0].data = data;
	};

	$rootScope.$on('childEmit', function(event, cat, dt) {
		console.log(cat + ' Inside Sibling one '+dt);
		$scope.redrawChart(cat, dt);
	});

	function randomNumber(min, max) {
		//return Math.floor((Math.random() * max) + min)
	}
	;
});