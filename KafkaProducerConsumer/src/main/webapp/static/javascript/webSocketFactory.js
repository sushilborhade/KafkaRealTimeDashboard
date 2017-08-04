var printConsole = true;
/**
 * WebSocketFactory is used for web-socket communication.
 */
myApp.factory('WebSocketFactory', [ '$rootScope', function($rootScope) {
	var webSocket;
	var socketURL;
	function openSocket(socketURL, json, $rootScope) {
		if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
			printToConsole("WebSocket is already opened.");
			return;
		}
		if (socketURL == undefined) {
			printToConsole("URL not provided by UG :: " + socketURL);
			return;
		}

		webSocket = new WebSocket(socketURL);
		/**
		 * Binds functions to the listeners for the websocket.
		 */
		webSocket.onopen = function(event) {
			// For reasons I can't determine, onopen gets called twice
			// and the first time event.data is undefined.
			// Leave a comment if you know the answer.
			printToConsole("Socket is open now!!!");
			// Inititate login with VIM.
			sendToVIM(json);
		};

		webSocket.onmessage = function(event) {
			var txt = event.data;
			try {
				var obj = angular.fromJson(txt);
				showResponse(JSON.stringify(obj));
				processContact(obj);
			} catch (e) {
				printToConsole("\nEXCEPTION :: " + e.message);
			}
		}

		webSocket.onclose = function(event) {
			printToConsole("Server closed the WS Connection.");
		};
	}

	function sendMsg(message) {
		if (angular.isString(message)) {
			showRequest(message);
			webSocket.send(message);
		} else if (angular.isObject(message)) {
			showRequest(JSON.stringify(message));
			webSocket.send(JSON.stringify(message));
		}
	}
	;

	function sendToVIM(json) {
		var j = JSON.stringify(json);
		printToConsole("Request: " + j);
		webSocket.send(j);
		showRequest(j);
	}

	this.closeSocket = function() {
		webSocket.onclose = function(event) {
			reset();
			printToConsole("Connection is closed");
		};
	};

	function processContact(jsonObj) {
		var categories = [];
		var data = [];
		angular.forEach(jsonObj.response, function(value, key) {
			categories.push(key);
			data.push(value.length);
		});

		showRequest(categories);
		showRequest(data);
		$rootScope.$emit('childEmit', categories, data);
	}
	return {
		open : function(isSecured, jsonResponse) {
			openSocket(isSecured, jsonResponse);
		},
		sendMessage : function(message) {
			sendMsg(message);
		},
		close : function() {
			closeSocket();
		}
	}
} ]);


function printToConsole(msg) {
	if (printConsole) {
		console.log(msg);
	}
}

function showRequest(message) {
	//	alert("showRequest\n"+message);
	if (message) {
		window.setTimeout(function() {
			var scope = angular.element(document.getElementById("IODiv"))
				.scope();
			scope.$apply(function() {
				scope.requestLogger = scope.requestLogger + "\n\n"
					+ message;
			});
		}, 500);
		scope = "";
	}
}

function showResponse(message) {
	if (message) {
		window.setTimeout(function() {
			var scope = angular.element(document.getElementById("IODiv"))
				.scope();
			scope.$apply(function() {
				scope.responseLogger = scope.responseLogger + "\n\n"
					+ message;
			});
		}, 500);
		scope = "";
	}
}