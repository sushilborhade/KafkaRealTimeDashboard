angular.module('myModule', []).controller('myController', function($scope, $timeout) {
		$scope.myCategories = ['Red', 'Green', 'Blue'];
	  $scope.mySeries = [{
			data: [0, 0, 0],
			colorByPoint: true,
			colors: [
				'#d9534f',
				'#5cb85c',
				'#0275d8',
				'#5cb85c'
			]
		}];

		randomData();
		function randomData(min, max) {
			$scope.mySeries[0].data = [
				randomNumber(0, 200),
				randomNumber(0, 100),
				randomNumber(0, 100),
				randomNumber(0, 100)
			];
			
			$scope.myCategories = ['Red', 'Green', 'Blue', 'Yellow'];

			$timeout(function() {
				randomData();
			}, 1000 * randomNumber(0.2, 2));
		};

		function randomNumber(min, max) {
			return Math.floor((Math.random() * max) + min)
		};
	});