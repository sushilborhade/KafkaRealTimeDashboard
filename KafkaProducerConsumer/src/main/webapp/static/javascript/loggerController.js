/**
 * 
 */
myApp.controller('loggerController',
				function($scope) {
	$scope.cleanRequestData = function() {
		$scope.requestLogger = "Request logging...";
	}

	$scope.cleanResponseData = function() {
		$scope.responseLogger = "Response logging...";
	}

	$scope.showRequest = function(message) {
		if (message) {
			$scope.requestLogger = $scope.requestLogger + "\n" + message;
		}
	}

	$scope.showResponse = function(message) {
		if (message) {
			$scope.responseLogger = $scope.responseLogger + "\n" + message;
		}
	}
});
