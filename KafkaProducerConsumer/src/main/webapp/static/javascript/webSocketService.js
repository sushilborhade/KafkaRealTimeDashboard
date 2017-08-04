'use strict';

myApp.factory('userService', function($q, $exceptionHandler) {
	return {

		postLoginData : function(user) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				}
			}
			return $http.post('loginUnamePwd', user, config)
					.then(
							function(response) {
								return response;
							},
							function(errResponse) {
								alert(errResponse.status + ':'
										+ errResponse.statusText);
								return $q.reject(errResponse);
							});
		},

		// send data selected from all the dropdowns to server namely
		// enterprise, environment type and regions
		postListData : function(user) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				}
			}
			return $http.post('getUIListData', user, config)
					.then(
							function(response) {
								return response;
							},
							function(errResponse) {
								alert(errResponse.status + ':'
										+ errResponse.statusText);
								return $q.reject(errResponse);
							});
		},

		// send enterprise data
		postUserData : function(user) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				}
			}
			return $http.post('validateEnterprise', user, config).then(
					function(response) {
						return response;
					}, function(errResponse) {
						return errResponse;
					});
		},

		// send the created license json
		postJsondata : function(user) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				},
			}
			return $http.post('getJson', user, config).then(function(response) {

				return response.data;
			}, function(errResponse) {
				alert(errResponse.status + ':' + errResponse.statusText);
				return $q.reject(errResponse);
			});
		},

		// download zip file
		download : function(user) {
			var downloadPath = 'download?fileName=' + user;
			window.open(downloadPath, '_blank', '');
		},

		// send data which is to be entered
		// into license history table to spring controller
		postLicHistoryData : function(user1) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				}
			}
			return $http.post('getLicHistoryData', user1, config)
					.then(
							function(response) {
								return response.data;
							},
							function(errResponse) {
								alert(errResponse.status + ':'
										+ errResponse.statusText);
								return $q.reject(errResponse);
							});
		},

		sendLocation : function(location) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				}
			}
			return $http.post('location', location, config)
					.then(
							function(response) {
								return response;
							},
							function(errResponse) {
								alert(errResponse.status + ':'
										+ errResponse.statusText);
								return $q.reject(errResponse);
							});
		},

		// get blank json from server
		getUIDetails : function() {
			return $http.get('displayJson').then(function(response) {
				return response.data;
			}, function(errResponse) {
				alert(errResponse.status + ':' + errResponse.statusText);
				return $q.reject(errResponse);
			});
		},

		// get license history data to display on license list page
		getLicHistoryDetails : function() {
			return $http.get('licenseListData').then(function(response) {
				return response.data;
			}, function(errResponse) {
				console.log(errResponse);
				alert(errResponse.status + ':' + errResponse.statusText);
				return $q.reject(errResponse);
			});
		},

		// send lic history id obtained after download license image is clicked
		// on license list page to download that specific license
		postLicHistoryId : function(licHistoryId) {
			var config = {
				headers : {
					'Content-Type' : 'application/json'
				}
			}
			return $http.post('licHistoryId', licHistoryId, config)
					.then(
							function(response) {
								return response.data;
							},
							function(errResponse) {
								alert(errResponse.status + ':'
										+ errResponse.statusText);
								return $q.reject(errResponse);
							});
		},

		endSession : function() {
			return $http.get('logout').then(function(response) {
				return response;
			}, function(errResponse) {
				alert(errResponse.status + ':' + errResponse.statusText);
				return $q.reject(errResponse);
			});
		},

		getLoggedUser : function() {
			return $http.get('loggedUser').then(function(response) {
				return response;
			}, function(errResponse) {
				alert(errResponse.status + ':' + errResponse.statusText);
				return $q.reject(errResponse);
			});
		},

		checkSessionTimeout : function() {
			return $http.get('checkSession').then(function(response) {
				return response;
			}, function(errResponse) {
				alert(errResponse.status + ':' + errResponse.statusText);
				return $q.reject(errResponse);
			});
		},
	};
});
