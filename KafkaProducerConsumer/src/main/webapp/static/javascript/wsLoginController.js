myApp
		.controller(
				'wsLoginController',
				function($scope, WebSocketFactory) {
					$scope.openSocket = function() {
						login();
						/*
						 * writeRequest("\nopenSocket of WebSocket"); if
						 * (webSocket !== undefined && webSocket.readyState !==
						 * WebSocket.CLOSED) { writeResponse("WebSocket is
						 * already opened."); return; } var vimUrl =
						 * "ws://192.168.0.92:8080/KafkaProducerConsumer/InteractionSocket";
						 * if (vimUrl == undefined) { writeRequest("\nURL not
						 * provided by UG :: " + vimUrl); return; }
						 * writeRequest("\nWebSocket URL : " + vimUrl); var
						 * webSocket = new WebSocket(vimUrl);
						 * 
						 * webSocket.onopen = function(event) {
						 * writeResponse("\nSocket open now!!!"); login();
						 * writeResponse("\nlogin() of application called"); if
						 * (event.data === undefined) return;
						 * 
						 * writeResponse(event.data);
						 *  };
						 * 
						 * webSocket.onmessage = function(event) { var txt =
						 * event.data; writeResponse(txt); };
						 * 
						 * webSocket.onclose = function(event) {
						 * writeResponse("Connection closed"); };
						 */
					}

					function login() {
						/*
						 * var clientUsername = "Sushil"; var clientAdu =
						 * "sdfd7f9sd8dsf8d0"; var station = "3434";
						 * writeRequest("\n--------------------login--------------------");
						 * var corrId =
						 * document.getElementById("logCorId").value;
						 * $scope.logUname = clientUsername; var pass =
						 * document.getElementById("logPwd").value; if
						 * (clientStation == "" || clientStation == undefined) {
						 * var station =
						 * document.getElementById("logStnId").value; } else {
						 * var station = clientStation; } var text =
						 * '{"correlationId":\'1234\', "action":101, "aduid":"' +
						 * clientAdu + '", "username":"' + clientUsername + '",
						 * "stationId":"' + station + '", "tgpkey":"' +
						 * clientTgpkey + '"}'; var json = '{"request":' + text +
						 * '}' send(json);
						 */

						var socketURL = "ws://192.168.0.92:8080/KafkaProducerConsumer/InteractionSocket";

						var params = {
							correlationId : '',
							action : 101,
							aduid : "sdfd7f9sd8dsf8d0",
							username : "Sushil",
							stationId : "3434",
							tgpkey : 123
						};
						var json = {
							request : params
						};
						WebSocketFactory.open(socketURL, json);
					}

					function writeResponse(text) {
						$scope.responseTA = "\n===================================================================\nData received from server is : "
								+ text
								+ "\n===================================================================";
					}

					function writeRequest(text) {
						$scope.requestTA = "\n" + text + "\n";
					}

				});