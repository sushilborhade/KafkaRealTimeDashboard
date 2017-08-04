
var webSocket;
var parameters;
var vimUrl;
var clientAdu;
var clientTgpkey;
var clientUsername;
//var isSecure = false;
var clientStation;
var timedACWEnabled = false;
var autoACWTimeout = 10;
var acwTimer;
var custID='0';

/*
 * var corrId = document.getElementById("logCorId").value;
	var token = document.getElementById("logToken").value;
 */
function dialerLogin(){
	//var username = $('#dialerUname').val();
	
	/*
	 * {
		    "request":{
		        "action":161,
		        "correlationId":"",
		        "username":clientUsername,
		        "aduid" : clientAdu
		    }
	}
	 */
	
	var params = '{"request":{"action":161, "correlationId":"", "username":"'+clientUsername+'", '+
		'"aduid":"'+clientAdu+'"}}';
	
	send(params);
}

/*
 * {
	    "request":{
	        "action":163,
	        "correlationId":"",
	        "username":clientUsername,
	        "aduid" : clientAdu
	    }
	}
 */
function getCampaignList(){
	var username = $('#dialerUname').val();
	var params = '{"request":{"action":163, "correlationId":"", "username":"'+clientUsername
		+'", "aduid":"'+clientAdu+'"}}';

	send(params);
}

/*
 * {
		"request":{
			"action":164,
			"correlationId":"",
			"username":clientUsername,
			"aduid" : clientAdu,
			"campaignId": campId
		}
	}
 */
function getCampaignJobList(){
	var username = $('#dialerUname').val();
	var campId = $('#campId').val();
	var params = '{"request":{"action":164, "correlationId":"", "username":"'+clientUsername
				+'", "aduid":"'+clientAdu+'", "campaignId":"'+campId+'"}}';
	send(params);
}

function enableJobId(){
	if($('#campId').val() != ""){
		$('#jobId').attr("disabled",false);
		$('#campJobList').attr("disabled",false);
		
	}else{
		$('#jobId').attr("disabled",true);
		$('#campJobList').attr("disabled",true);
	}
	
}

function enableButtons(){
	if($('#jobId').val() != "" && $('#campId').val() != ""){
		$('#joinJob').attr("disabled",false);
		$('#outcomes').attr("disabled",false);
		$('#nextCall').attr("disabled",false);
		
	}else{
		$('#joinJob').attr("disabled",true);
		$('#outcomes').attr("disabled",true);
		$('#nextCall').attr("disabled",true);
	}
	
}
/*
 * {
		    "request":{
		        "action":165,
		        "correlationId":"",
		        "username":clientUsername,
		        "aduid" : clientAdu,
		        "campaignId":campId,
		        "jobId":jobId
		    }
		}
 */
function joinJob(){
	var jobId = $('#jobId').val();
	var campId = $('#campId').val();
	var params = '{"request":{"action":165, "correlationId":"", "username":"'+clientUsername
	+'", "aduid":"'+clientAdu+'", "jobId":"'+jobId+'"}}';
	
	send(params);

}

/*
 * {
		    "request":{
		        "action":166,
		        "correlationId":"",
		        "username":clientUsername,
		        "aduid" : clientAdu,
		        "campaignId":campId,
		        "jobId":campId
		    }
		}
 */
function fetchOutcomes(){
	var jobId = $('#jobId').val();
	var campId = $('#campId').val();
	var params = '{"request":{"action":166, "correlationId":"", "username":"'+clientUsername
	+'", "aduid":"'+clientAdu+'", "campaignId":"'+campId+'", "jobId":"'+jobId+'"}}';

	send(params);
}

/*
 * {
		    "request":{
		        "action":167,
		        "correlationId":"",
		        "username":clientUsername,
		        "aduid" : clientAdu,
		        "campaignId":campId,
		        "jobId":campId
		    }
		}
 */

function nextCall(){
	var jobId = $('#jobId').val();
	var campId = $('#campId').val();
	var params = '{"request":{"action":167, "correlationId":"", "username":"'+clientUsername
				+'", "aduid":"'+clientAdu+'", "campaignId":"'+campId+'", "jobId":"'+jobId+'"}}';

}
/*function setSSL(){
	isSecure = document.getElementById("sslCheck").checked
	console.log("isSecure :: "+isSecure);
}*/

function connectUG1(){
	var uname = document.getElementById("logUname").value;
	var pass = document.getElementById("logPwd").value;
//	var action = document.getElementById("logAction").value;
	var station = document.getElementById("logStnId").value;
//	var tgp = document.getElementById("tenantGrp").value;
	
	console.log("UG Username : "+uname+"\nPassword : "+pass+"\nStation Id : "+station)
//	var url = "https://192.168.0.105:8443/com.interactcrm.ug.servlet.AgentRequestServlet?loginId="
//				+uname+"&password="+pass+"&action="+action;
//	console.log("Servlet URL : "+url);
//	document.location.href= url;	
	try {
//		http://softphone.ringo3.interactcrm.com:8080/WebSocProject/html/Index.html
		var params = {
			"loginId" : uname,
			"wisdom" : pass,
			"action" : "login"
//			"stationId" : station,
//			"tgpkey" : tgp
		}
	//	var params = "loginId="+uname+"&password="+pass+"&action=100";
		console.log("Params :: "+JSON.stringify(params));
		jQuery.support.cors = true;
		var ugUrl = "http://ug.ringo3.interactcrm.com:8080/UserGateway/AgentRequestServlet";//TODO change here for http/https
		console.log("UG URL : "+ugUrl)
//		$.post(ugUrl, "");//TODO This is only for https
		var  posting  = $.post(ugUrl, JSON.stringify(params));
		console.log("After post")
		posting.done(function(resp) {
			//alert("te");
			console.log("Callback")
			try {
				console.log("Response : " + resp);
				if (resp != null) {
					var obj = JSON.parse(resp);
					vimUrl = obj.response.voice;
					console.log("VIM URL to connect : " + vimUrl);
					connect();
				}
			} catch (e) {
				console.log("Inner catch :: "+e.message)
			}
		});
		} catch (e) {
			alert("Outer catch :: "+e.message)
			console.log("Outer catch :: "+e.message)
		}
}

function connectUG(){
	var input = document.getElementById("requestTA");
	var output = document.getElementById("responseTA");
	input.value+="\nConnecting to UG..."
	clientUsername = document.getElementById("logUname").value;
	var pass = document.getElementById("logPwd").value;
//	var action = document.getElementById("logAction").value;
	var station = document.getElementById("logStnId").value;
	var host = document.getElementById("logHost").value;
	input.value += "\nUG Username : "+clientUsername+"\nPassword : "+pass+"\nStation Id : "+station;
//	var url = "https://192.168.0.105:8443/com.interactcrm.ug.servlet.AgentRequestServlet?loginId="
//				+uname+"&password="+pass+"&action="+action;
//	console.log("Servlet URL : "+url);
//	document.location.href= url;	
	try {
//		http://softphone.ringo3.interactcrm.com:8080/WebSocProject/html/Index.html
//		var params = {
//			"loginId" : uname,
//			"password" : pass,
//			"action" : "login"
////			"stationId" : station,
////			"tgpkey" : tgp
//		}
//		var params = "loginId="+clientUsername+"&wisdom="+pass+"&action=100&host=192.168.0.116";
//		var params = "loginId="+clientUsername+"&wisdom="+pass+"&action=100&host="+host;
		var params = 'action=100&hostname='+host+'&wisdom='+pass+'&loginId='+clientUsername+'&station='+station;
		console.log("Params :: "+JSON.stringify(params));
		
		try{
			jQuery.support.cors = true;
			var json = JSON.stringify(params);
			console.log("Params :: "+json) 
			var ugUrl = document.getElementById("logUG").value;
			input.value+="\nUG URL :: "+ugUrl;
//			console.log("UG URL :: "+ugUrl);
//			$.get(ugUrl, "");// !!!!!!!!!!!!!!!!!!!!!!!FOR HTTPS !!!!!!!!!!!!!!!!!!!!!!!!!
			$.ajax({
						url : ugUrl,
//						url : "http://192.168.0.105:8080/UserGateway/AgentRequestServlet",
						type : "POST",
						data : params,
						contentType:"application/x-www-form-urlencoded; charset=utf-8",
						dataType : "text",
						beforeSend: function (request) {
//        						 request.setRequestHeader("Access-Control-Allow-Origin", "*");
								 console.log("Params sent in body :: "+params)
//								 request.setRequestHeader("vnd.ing.int.ctx-employeeid", clientUsername);
						},
						success : function(result) {
							output.value+="\nUG response :: "+result;
//							console.log("Result :: "+JSON.stringify(result));
							if (result != null || result != undefined) {
								var jsonRes = JSON.parse(result);
								//console.log("Result :: "+result.response.voice);
								//var obj = JSON.parse(result);
								console.log("Response :: "+JSON.stringify(jsonRes.response))
								vimUrl = jsonRes.response.voice;
								output.value+="\nMessage from VIM :: "+jsonRes.response.message
//								console.log("Message from VIM :: "+result.response.message);
								clientAdu = jsonRes.response.aduid;
								clientTgpkey = jsonRes.response.tgpkey;
								clientStation = jsonRes.response.station;
								output.value+="\nVIM URL to connect : " + vimUrl;
//								console.log("VIM URL to connect : " + vimUrl);
//								console.log("UG response :: "+JSON.stringify(result))
								connect();
				}
						},
						error : function(result) {
							output.value+="\nError :: "+JSON.stringify(result);
//							console.log("Error :: "+JSON.stringify(result)+" Error Message :: "+result.errorMessage);
						}
					});
		} catch(exp){
//			console.log("Inner log :: "+exp.message)
			input.value+="\nInner log :: "+exp.message;
		}
		
		} catch (e) {
			input.value="\nOuter catch :: "+e.message;
//			console.log("Outer catch :: "+e.message)
		}
		//input.focus();
		// output.focus();
}



function connect() {
//	console.log("connect to web socket");
	/*parameters = localStorage.getItem("params");
	console.log("connect() parameters "+parameters);
	url = localStorage.getItem("response")
	console.log("Fetch url from : "+url)*/
	openSocket()
}

function directConnect(){
	var input = document.getElementById("requestTA");
	var output = document.getElementById("responseTA");
	input.value += "Direct Connect requested!!!";
//	console.log("Direct Connect")
	// Ensures only one connection is open at a time
	if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
		writeResponse("WebSocket is already opened.");
		return;
	}
	if(vimUrl == undefined){
		alert("URL not provided by UG :: "+vimUrl)
		output.value += "URL not provided by UG :: "+vimUrl;
		return;
	}
	// Create a new instance of the websocket
	/*if(isSecure){
		input += "\nOpening a secure WebSocket isSecure :: "+isSecure
		var socURL = "wss://"+vimUrl;//For https
	}else{
		input += "\nOpening an unsecure Web Socket isSecure :: "+isSecure
		var socURL = "ws://"+vimUrl;//For http
	}*/
/*	webSocket = new WebSocket(
			"wss://192.168.0.106:19090/InteractionManager/interactionSocket");*/
	//input.value += "WebSocket URL : "+socURL;
	input.value += "WebSocket URL : "+vimUrl;
//	console.log("WebSocket URL : "+socURL)
//	webSocket = new WebSocket(socURL);
	webSocket = new WebSocket(vimUrl);

	/**
	 * Binds functions to the listeners for the websocket.
	 */
	webSocket.onopen = function(event) {
		// For reasons I can't determine, onopen gets called twice
		// and the first time event.data is undefined.
		// Leave a comment if you know the answer.
		console.log("Socket open now!!!");
		output.value += "Socket open now!!!";
		//trying to invoke login to avoid dual logins
//		login();
//		console.log("login() of application called" );
		if (event.data === undefined)
			return;

		writeResponse(event.data);
		
	};

	webSocket.onmessage = function(event) {
		writeResponse(event.data);
	};

	webSocket.onclose = function(event) {
		writeResponse("Connection closed");
	};
	//input.focus();
	// output.focus();
}


function openSocket() {
	var input = document.getElementById("requestTA");
	var output = document.getElementById("responseTA");
	input.value += "\nopenSocket of WebSocket";
//	console.log("openSocket of WebSocket")
	// Ensures only one connection is open at a time
	if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
		writeResponse("WebSocket is already opened.");
		return;
	}
	var vimUrl = "ws://192.168.0.92:8080/KafkaProducerConsumer/InteractionSocket";
	if(vimUrl == undefined){
//		alert("URL not provided by UG :: "+vimUrl)
		output.value += "\nURL not provided by UG :: "+vimUrl;
		return;
	}
	// Create a new instance of the websocket
	/*if(isSecure){
		input += "\nOpening a secure WebSocket isSecure :: "+isSecure
		var socURL = "wss://"+vimUrl;//For https
		console.log("Opening socket on :: "+socURL)
	}else{
		input += "\nOpening an unsecure Web Socket isSecure :: "+isSecure
		var socURL = "ws://"+vimUrl;//For http
	}*/
/*	webSocket = new WebSocket(
			"wss://192.168.0.106:19090/InteractionManager/interactionSocket");*/
	/*output.value += "\nWebSocket URL : "+socURL
	webSocket = new WebSocket(socURL);*/
	
	output.value += "\nWebSocket URL : "+vimUrl
	webSocket = new WebSocket(vimUrl);

	/**
	 * Binds functions to the listeners for the websocket.
	 */
	webSocket.onopen = function(event) {
		// For reasons I can't determine, onopen gets called twice
		// and the first time event.data is undefined.
		// Leave a comment if you know the answer.
		output.value += "\nSocket open now!!!"
		//trying to invoke login to avoid dual logins
		login();
		output.value +="\nlogin() of application called" ;
		if (event.data === undefined)
			return;

		writeResponse(event.data);
		
	};

	webSocket.onmessage = function(event) {
		var txt = event.data;
		writeResponse(txt);
	};

	webSocket.onclose = function(event) {
		writeResponse("Connection closed");
	};
//	input.focus();
//	// output.focus();	
}

/**
 * Sends the value of the text input to the server
 */
function send(text) {
	webSocket.send(text);
}

function closeSocket() {
	webSocket.close();
}

function writeResponse(text) {
	document.getElementById("responseTA").value += "\n===================================================================\nData received from server is : " 
		+ text+"\n===================================================================";
//	console.log("Data received from server is : " + text);
}

/*******************************************************************************
 * 
 * These are methods of demo client
 * 
 ******************************************************************************/

/*
 * { "request": { "correlationId":"", "action":101,
 * "token":"0019d73c00660240c0a8006a3ebc0000", "username":"alex", "pwd":"@le6",
 * "stationId":"95213" } }
 */
function login() {
	var clientUsername = "Sushil";
	var clientAdu = "sdfd7f9sd8dsf8d0";
	var station = "3434";
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------login--------------------"
	var corrId = document.getElementById("logCorId").value;
//	var action = document.getElementById("logAction").value;
//	var token = document.getElementById("logToken").value;
	document.getElementById("logUname").value = clientUsername;
	var pass = document.getElementById("logPwd").value;
	if(clientStation=="" || clientStation == undefined){
		var station = document.getElementById("logStnId").value;
	} else{
		var station = clientStation;
	}
//	var tenantGrp = document.getElementById("tenantGrp").value;
	
	/* var text = '{"correlationId":"' + corrId + '", "action":101, "aduid":"'
			+ clientAdu + '", "username":"' + username + '", "pwd":"' + pass
			+ '", "stationId":"' + station + '", "tgpkey":"'+clientTgpkey+'"}'; 
			
		var text = '{"correlationId":"' + corrId + '", "action":101, "aduid":"'
			+ clientAdu + '", "username":"' + clientUsername + '", "pwd":"' + pass
			+ '", "stationId":"'+station+'", "tgpkey":"'+clientTgpkey+'"}';*/
			
			var text = '{"correlationId":"' + corrId + '", "action":101, "aduid":"'
			+ clientAdu + '", "username":"' + clientUsername + '", "stationId":"'
			+station+'", "tgpkey":"'+clientTgpkey+'"}';
	// alert("Test : "+text)' + station + '
	var json = '{"request":' + text + '}'
//	input.value += "\nLogin JSON : " + json
	input+="Not printing login request because of security reasons!!!";
	send(json);
//	input.focus();
}

/*
 * { "request": { "action":102, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000" } }"aduid":"'+token+'",
 */
function logout() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------logout--------------------"
	var corrId = document.getElementById("logCorId").value;// alert("Correlation
															// ID "+corrId)
//	var action = document.getElementById("logAction").value;// alert("Action
															// "+action)
//	var token = document.getElementById("logToken").value;// alert("Token
															// "+token)
//	var username = document.getElementById("logUname").value;// alert("Username"+username)
//	var pass = document.getElementById("logPwd").value;// alert("Password
														// "+pass)
//	var station = document.getElementById("logStnId").value;// alert("Station ID
															// "+station)
	/*
	 * var text = '{"correlationId":"'+corrId+'", "action":'+action+',
	 * "token":"'+token+'", "username":"'+ username+'", "pwd":"'+pass+'",
	 * "stationId":"'+station+'"}';
	 */
	var text = '{"action":102, "correlationId":"' + corrId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '"}';
	var json = '{"request":' + text + '}'
	input.value+= "\nLogout JSON : " + json
	send(json);
//	input.focus();
}

/*
 * { "request": { "correlationId":"", "action":103, "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000" } }
 */
function getAUXCodes() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------getAUXCodes--------------------"
	var corId = document.getElementById("auxCorId").value;
//	var action = document.getElementById("auxAction").value;
//	var aduId = document.getElementById("auxADU").value;
//	var username = document.getElementById("username").value;
	var text = '{"correlationId":"' + corId + '", "action":103, "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '"}';
	var json = '{"request":' + text + '}'
	input.value+="\nGet AUX Codes JSON : " + json
	send(json);
//	input.focus();
}

/*
 * { "request": { "action":105, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000", "reasonCode" : 28, } }
 */
function goToAUX() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------goToAux--------------------"
	var corId = document.getElementById("auxCorId").value;
//	var action = document.getElementById("auxAction").value;
//	var aduId = document.getElementById("auxADU").value;
//	var username = document.getElementById("username").value;
	var reason = document.getElementById("auxReason").value;
	var agentVoiceMode = document.getElementById("agentVoiceMode").value;
	var text = '{"action":105, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "reasonCode":"' + reason + '","agent_voicemode":"'+agentVoiceMode+'"}';
//	input.value+=("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nPut agent to AUX JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":106, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000", } }
 */
function makeAvaiable() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------makeAvailable--------------------"
	var corId = document.getElementById("auxCorId").value;
	var agentVoiceMode = document.getElementById("agentVoiceMode").value;
//	var action = document.getElementById("auxAction").value;
//	var aduId = document.getElementById("auxADU").value;
//	var username = document.getElementById("username").value;
	var text = '{"action":106, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '","agent_voicemode":"'+agentVoiceMode+'"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+="\nMake agent available JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":111, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000", "destination" : "9876543210", "data":{
 * "CustomerName":"John", "Phone":9877665, "City":"London" } } }
 * '"data":{"CustomerName":"'+name+'", "Phone":"'+phone+'", "City":"'+city+'"}';
 */
function makeCall() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------makeCall--------------------"
	var corId = document.getElementById("bccCorId").value;
//	var action = document.getElementById("bccAction").value;
//	var username = document.getElementById("bccUsername").value;
//	var adu = document.getElementById("bccADU").value;
	var dest = document.getElementById("bccDest").value;
	var name = document.getElementById("bccCustName").value;
	var phone = document.getElementById("bccPhone").value;
	var city = document.getElementById("bccCity").value;

	var personal = '{"CustomerName":"' + name + '", "Phone":"' + phone
			+ '", "City":"' + city + '"}';
//	console.log("Personal Data : " + personal)
	var text = '{"action":111, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "destination":"' + dest
			+ '", "data":' + personal + '}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+="\nInitiate Call JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":113, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002" } }
 */
function acceptCall() {
	var input = document.getElementById("requestTA");
	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------acceptCall--------------------"
	try {
		var corId = document.getElementById("bccCorId").value;
//		var action = document.getElementById("bccAction").value;
//		var username = document.getElementById("bccUsername").value;
//		var adu = document.getElementById("bccADU").value;
		var cdu = document.getElementById("bccCDU").value;
		
		alert("CDU ID--> "+cdu);

		var text = '{"action":113, "correlationId":"' + corId
				+ '", "username":"' + clientUsername + '", "aduid":"' + clientAdu
				+ '", "cduid":"' + cdu + '"}';
//		console.log("Text : " + text)
		var json = '{"request":' + text + '}'
		input.value+="\nAccept Call JSON : " + json
		send(json);
	} catch (e) {
		output.value+="\nExcpetion while accepting incoming call : "+e.message
	}
	// input.focus();
	// output.focus();
}

/*
 * { "request": { "action":114, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002" } }
 */
function hold() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------hold--------------------"
	var corId = document.getElementById("bccCorId").value;
//	var action = document.getElementById("bccAction").value;
//	var username = document.getElementById("bccUsername").value;
//	var adu = document.getElementById("bccADU").value;
	var cdu = document.getElementById("bccCDU").value;

	var text = '{"action":114, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value +="\nJSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":115, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002" } }
 */
function reconnect() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------reconnect--------------------"
	var corId = document.getElementById("bccCorId").value;
//	var action = document.getElementById("bccAction").value;
//	var username = document.getElementById("bccUsername").value;
//	var adu = document.getElementById("bccADU").value;
	var cdu = document.getElementById("bccCDU").value;

	var text = '{"action":115, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nJSON : " + json
	send(json);
	// input.focus();
}





/*
 * { "request": { "action":116, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002" } }
 */
function hangUp() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------hangUp--------------------"
	var corId = document.getElementById("bccCorId").value;
//	var action = document.getElementById("bccAction").value;
//	var username = document.getElementById("bccUsername").value;
//	var adu = document.getElementById("bccADU").value;
	var cdu = document.getElementById("bccCDU").value;

	var text = '{"action":116, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nJSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":117, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002" } }
 */
function endWrapUp() {
	try
	{
		if(acwTimer) {
			window.clearTimeout(acwTimer);
		}
	}
	catch (e)
	{
		output.value +="\nEXCEPTION :: "+e.message
//		alert('exception while clearing the timer!'+e.message);
	}
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------endWrapUp--------------------"
	var corId = document.getElementById("bccCorId").value;
//	var action = document.getElementById("bccAction").value;
//	var username = document.getElementById("bccUsername").value;
//	var adu = document.getElementById("bccADU").value;
	var cdu = document.getElementById("bccCDU").value;

	var text = '{"action":117, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nJSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":118, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", "destinationNumber":"765423",
 * "externalUUI":"", "data":{ "CustomerName":"John", "Phone":9877665,
 * "City":"London" } } }
 */
function transfer() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------transfer--------------------"
	var corId = document.getElementById("tCorId").value;
//	var action = document.getElementById("tAction").value;
//	var username = document.getElementById("tUsername").value;
//	var adu = document.getElementById("tADU").value;
	var cdu = document.getElementById("tCDU").value;
	var dest = document.getElementById("tDest").value;
	var uui = document.getElementById("tUUI").value;
	var name = document.getElementById("tCustName").value;
	var phone = document.getElementById("tPhone").value;
	var city = document.getElementById("tCity").value;

	var personal = '{"CustomerName":"' + name + '", "Phone":"' + phone
			+ '", "City":"' + city + '"}';
	console.log("Personal Data : " + personal)
	var text = '{"action":118, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu
			+ '", "destinationNumber":"' + dest + '", "externalUUI":"' + uui
			+ '", "data":' + personal + '}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nJSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":119, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", "destinationNumber":"765423",
 * "externalUUI":"", "data":{ "CustomerName":"John", "Phone":9877665,
 * "City":"London" } } }
 */
function consultTransfer() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------consultTransfer--------------------"
	var corId = document.getElementById("tCorId").value;
//	var action = document.getElementById("tAction").value;
//	var username = document.getElementById("tUsername").value;
//	var adu = document.getElementById("tADU").value;
	var cdu = document.getElementById("tCDU").value;
	var dest = document.getElementById("tDest").value;
	var uui = document.getElementById("tUUI").value;
	var name = document.getElementById("tCustName").value;
	var phone = document.getElementById("tPhone").value;
	var city = document.getElementById("tCity").value;

	var personal = '{"CustomerName":"' + name + '", "Phone":"' + phone
			+ '", "City":"' + city + '"}';
	console.log("Personal Data : " + personal)
	var text = '{"action":119, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu
			+ '", "destinationNumber":"' + dest + '", "externalUUI":"' + uui
			+ '", "data":' + personal + '}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nJSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":120, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", } }
 */
function completeTrans() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------completeTransfer--------------------"
	var corId = document.getElementById("tCorId").value;
//	var action = document.getElementById("tAction").value;
//	var username = document.getElementById("tUsername").value;
//	var adu = document.getElementById("tADU").value;
	var cdu = document.getElementById("tCDU").value;

	var text = '{"action":120, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value +="\nComplete Transfer JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":123, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", } }
 */
function cancelTrans() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------cancelTransfer--------------------"
	var corId = document.getElementById("tCorId").value;
//	var action = document.getElementById("tAction").value;
//	var username = document.getElementById("tUsername").value;
//	var adu = document.getElementById("tADU").value;
	var cdu = document.getElementById("tCDU").value;

	var text = '{"action":123, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value += "\nBack to caller JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":121, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", "destinationNumber":"765423",
 * "data":{ "CustomerName":"John", "Phone":9877665, "City":"London" } } }
 */
function beginConf() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------beginConference--------------------"
	var corId = document.getElementById("cCorId").value;
//	var action = document.getElementById("cAction").value;
//	var username = document.getElementById("cUsername").value;
//	var adu = document.getElementById("cADU").value;
	var cdu = document.getElementById("cCDU").value;
	var dest = document.getElementById("cDest").value;
	var name = document.getElementById("cCustName").value;
	var phone = document.getElementById("cPhone").value;
	var city = document.getElementById("cCity").value;

	var personal = '{"CustomerName":"' + name + '", "Phone":"' + phone
			+ '", "City":"' + city + '"}';
//	console.log("Personal Data : " + personal)
	var text = '{"action":121, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu
			+ '", "destinationNumber":"' + dest + '", "data":' + personal + '}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nBegin Conference JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":123, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", } }
 */
function cancelConf() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------cancelConference--------------------"
	var corId = document.getElementById("cCorId").value;
//	var action = document.getElementById("cAction").value;
//	var username = document.getElementById("cUsername").value;
//	var adu = document.getElementById("cADU").value;
	var cdu = document.getElementById("cCDU").value;

	var text = '{"action":123, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nCancel Conference JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":120, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", } }
 */
function completeConf() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------completeConference--------------------"
	var corId = document.getElementById("cCorId").value;
//	var action = document.getElementById("cAction").value;
//	var username = document.getElementById("cUsername").value;
//	var adu = document.getElementById("cADU").value;
	var cdu = document.getElementById("cCDU").value;

	var text = '{"action":120, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value += "\nComplete Conference JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":124, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", } }
 */
function toggle() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------toggle--------------------"
	var corId = document.getElementById("mCorId").value;
//	var action = document.getElementById("mAction").value;
//	var username = document.getElementById("mUsername").value;
//	var adu = document.getElementById("mADU").value;
	var cdu = document.getElementById("mCDU").value;

	var text = '{"action":124, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nToggle JSON : " + json;
	send(json);
	// input.focus();
}

/*
 * { "request": { "action":125, "correlationId":"", "username":"alex", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", “dtmf” : “1” } }
 */
function dtmf() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------dtmf--------------------"
	var corId = document.getElementById("mCorId").value;
//	var action = document.getElementById("mAction").value;
//	var username = document.getElementById("mUsername").value;
//	var adu = document.getElementById("mADU").value;
	var cdu = document.getElementById("mCDU").value;
	var dt = document.getElementById("mDTMF").value;

	var text = '{"action":125, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu
			+ '", "dtmf":"' + dt + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.vlaue += "\nDTMF JSON : " + json
	send(json);
	// input.focus();
}

function restore() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------Get Agent Details--------------------"
	var corId = document.getElementById("mCorId").value;
//	var username = document.getElementById("mUsername").value;
//	var adu = document.getElementById("mADU").value;
	var cdu = document.getElementById("mCDU").value;
	

	var text = '{"action":107, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu
			+  '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.vlaue+= "\nRestore JSON : " + json
	send(json);
	// input.focus();
}

/**********************************************************************************************
 * This would reconnect to send session reconnect request
 * ********************************************************************************************
 */

function reconnectSession(){
	var input = document.getElementById("requestTA");
	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------reconnectSession--------------------"
	try{
		directConnect();
		var corId = document.getElementById("mCorId").value;
//		var username = document.getElementById("mUsername").value;
//		var adu = document.getElementById("mADU").value;
		var cdu = document.getElementById("mCDU").value;
		

		var text = '{"action":107, "correlationId":"' + corId + '", "username":"'
				+ clientUsername + '", "aduid":"' + clientAdu + '", "cduid":"' + cdu
				+  '"}';
//		console.log("Text : " + text)
		var json = '{"request":' + text + '}'
		input.value += "\nJSON : " + json
		 setTimeout(function(){
			 send(json);
    },1000); 
	} catch(e){
		output.value+="\nError while reconnecting to the session :: "+e
	}
	// input.focus();
	// output.focus();
}

/*
 * {
    "request ":{
        “action”:144,
        “correlationId”:”“,
        “username”:”alex”,
        “aduid” : “0019d73c00660240c0a8006a3ebc0000”
        "sections":[
            {
                "section":"Agent/Desktop",
                "properties":[
                    {
                        "property":"AuxWorkOnLogin",
                        "value":""
                    },
                    {
                        "property":"AuxLoginReasonCode",
                        "value":""
                    },
                    {
                        "property":"AuxReasonCodesEnabled",
                        "value":""
                    },
                    {
                        "property":"LogoutReasonCodesEnabled",
                        "value":""
                    },
                    {
                        "property":"AuxRonaReasonCode",
                        "value":""
                    },
                    {
                        "property":"WrapUpEnabled",
                        "value":"0"
                    },
                    {
                        "property":"EnableCDUPopUp",
                        "value":"0"
                    }
                ]
            },
            {
                "section":"Agent/Desktop/Voice",
                "properties":[
                    {
                        "property":"AutoIn",
                        "value":""
                    },
                    {
                        "property":"RONATimeout",
                        "value":""
                    },
                    {
                        "property":"SwitchTimedACWEnabled",
                        "value":""
                    },
                    {
                        "property":"TimedACWTime",
                        "value":""
                    }
                ]
            },
            {
                "section":"Agent/Custom",
                "properties":[
                    {
                        "property":"CRMURL",
                        "value":""
                    },
                    {
                        "property":"Pivotal URL",
                        "value":""
                    }
                ]
            }
        ]
    }
}

 */
 /**
 *
 *It obtains section data
 *
 */
function request(){
	var input = document.getElementById("requestTA");
	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------request--------------------"
	try{
		var corId = document.getElementById("mCorId").value;
//		var username = document.getElementById("mUsername").value;
//		var adu = document.getElementById("mADU").value;
		var cdu = document.getElementById("mCDU").value;
		var tmp	=	"["+
	"{	\"section\" : \"Agent/Desktop\", "+
	"\"properties\" : "+
	"[ "+
	"{\"property\":\"AuxWorkOnLogin\",\"value\":\"\"},"+
	"{\"property\":\"AuxLoginReasonCode\",\"value\":\"\"},"+
	"{\"property\":\"AuxReasonCodesEnabled\",\"value\":\"\"},"+
	"{\"property\":\"LogoutReasonCodesEnabled\",\"value\":\"\"},"+
	"{\"property\":\"AuxRonaReasonCode\",\"value\":\"\"},"+
	"{\"property\":\"WrapUpEnabled\",\"value\":\"0\"},"+
	"{\"property\":\"EnableCDUPopUp\",\"value\":\"0\"}"+
	"]	    "+
	"},"+
	"{   \"section\" : \"Agent/Desktop/Voice\","+
	"\"properties\" :"+
	"["+
	"{\"property\":\"AutoIn\",\"value\":\"\"},"+
	"{\"property\":\"RONATimeout\",\"value\":\"\"},"+
	"{\"property\":\"SwitchTimedACWEnabled\",\"value\":\"\"},"+
	"{\"property\":\"TimedACWTime\",\"value\":\"\"}"+
	"]"+
	"}"+
	"]";

//		console.log("Agent section data"+$.parseJSON(agentProp));
		var text = '{"action":144, "correlationId":"' + corId + '", "username":"'
		+ clientUsername + '", "aduid":"' + clientAdu +'", "sections":'+tmp+'}';
		console.log("Text formed is :: "+text);
//		var obj = JSON.parse(text);
//		console.log("Object formed is :: "+JSON.stringify(obj));
//		obj.push(agentProp);
//		text = JSON.stringify(obj);
//		console.log("Text : " + text)
		var json = '{"request":' + text + '}'
		input.value += "\nJSON : " + json
		send(json);
	} catch(e){
		output.value+= "\nError while sending section data request :: "+e.message
	}
	// input.focus();
	// output.focus();
}

/*
 * { " response": { "actioncode":228, "correlationId":"", "username":"alex",
 * "aduid" : "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", "reason" : "Cannot make a
 * telephone call to", "operationname" : "111" } }
 * 
 * function optFailed() { var corId = document.getElementById("mCorId").value;
 * var action = document.getElementById("mAction").value; var username =
 * document.getElementById("mUsername").value; var adu =
 * document.getElementById("mADU").value; var cdu =
 * document.getElementById("mCDU").value; var reason =
 * document.getElementById("mReason").value; var optName =
 * document.getElementById("mOptName").value;
 * 
 * var text ='{"actioncode":228, "correlationId":"'+corId+'",
 * "username":"'+username+'", "aduid":"' +adu+'", "cduid":"'+cdu+'",
 * "reason":"'+reason+'", "operationname":"'+optName+'"}'; console.log("Text :
 * "+text) var json = '{"request":'+text+'}' console.log("Text : "+text+"\nJSON :
 * "+json) send(json); }
 */

/*
 * { " response": { "actioncode":229, "correlationId":"", "aduid" :
 * "0019d73c00660240c0a8006a3ebc0000",
 * "cduid":"52d7d646000000000a4084b3232f0002", "reason" : "Invalid JSON format",
 * "jsondata" : "{}" } }
 * 
 * function invalidRqst() { var corId = document.getElementById("mCorId").value;
 * var action = document.getElementById("mAction").value; var adu =
 * document.getElementById("mADU").value; var cdu =
 * document.getElementById("mCDU").value; var reason =
 * document.getElementById("mReason").value; var data =
 * document.getElementById("mRqstData").value;
 * 
 * 
 * var text ='{"actioncode":229, "correlationId":"'+corId+'", "aduid":"'
 * +adu+'", "cduid":"'+cdu+'", "reason":"'+reason+'", "jsondata":"'+data+'"}';
 * console.log("Text : "+text) var json = '{"request":'+text+'}'
 * console.log("Text : "+text+"\nJSON : "+json) send(json); }
 */

/*
 * { “request”: { “action”:141, “correlationId”:”“, “username”:”alex”, “aduid” :
 * “0019d73c00660240c0a8006a3ebc0000” } }
 */
function getQList() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------getQueueList--------------------"
	var corId = document.getElementById("uCorId").value;
//	var action = document.getElementById("uAction").value;
//	var aduId = document.getElementById("uADU").value;
//	var username = document.getElementById("uUsername").value;
	var text = '{"action":141, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nQueueList JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { “request”: { “action”:142, “correlationId”:”“, “username”:”alex”, “aduid” :
 * “0019d73c00660240c0a8006a3ebc0000” } }
 */
function getAgntList() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------getAgentList--------------------"
	var corId = document.getElementById("uCorId").value;
//	var action = document.getElementById("uAction").value;
//	var aduId = document.getElementById("uADU").value;
//	var username = document.getElementById("uUsername").value;
	var text = '{"action":142, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nAgentList JSON : " + json
	send(json);
	// input.focus();
}

/*
 * { “request”: { “action”:143, “correlationId”:”“, “username”:”alex”, “aduid” :
 * “0019d73c00660240c0a8006a3ebc0000” } }
 */
function getAddBook() {
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	input.value+= "\n--------------------getAddressBook--------------------"
	var corId = document.getElementById("uCorId").value;
//	var action = document.getElementById("uAction").value;
//	var aduId = document.getElementById("uADU").value;
//	var username = document.getElementById("uUsername").value;
	var text = '{"action":143, "correlationId":"' + corId + '", "username":"'
			+ clientUsername + '", "aduid":"' + clientAdu + '"}';
//	console.log("Text : " + text)
	var json = '{"request":' + text + '}'
	input.value+= "\nAddressBook JSON : " + json
	send(json);
	// input.focus();
}

/*
 * {
    "request":{
        "aduid":"ffeb75ed0016026bc0a800691f900000",
        "username":"margaret@valuefirst.com",
        "phoneNumber": "",
        "customerId": "1272",
        "requestNextCall":true,
        "correlationId":"",
        "jobId":"72",
        "cduid":"ffeb7cee00600203c0a800c0c3500000",
        "action":170,
        "outcomeStr":"Customer Not Interested",
        "actionId":2,
        "callbackTime":"",
        "notes":"Called customer but he is not interested in our offer.",
        "callInitiateTime":""
    }
}
 */
function dispose(){
	var input = document.getElementById("requestTA");
//	var output = document.getElementById("responseTA");
	var custId = document.getElementById("custId").value;
	var jobId = document.getElementById("jobId").value;
	var cduId = document.getElementById("cduId").value;
	var outcomeStr = document.getElementById("outcomeString").value;
	var actionId = document.getElementById("actionId").value;
	var initTime = document.getElementById("initTime").value;
	var callBackTime = document.getElementById("callBackTime").value;
	callBackTime = new Date(callBackTime).getTime();
	alert(callBackTime+ "<==== CallbackTime");
	

	input.value+= "\n--------------------dispose--------------------"
		var text ='{"aduid":"' + clientAdu+'", "username":"'+clientUsername+'", "phoneNumber":"",' 
			+'"customerId":"'+custId+'", "requestNextCall":"true", "correlationId":"", "jobId":"'+jobId+'","cduid":"'
			+cduId+'","action":170,"outcomeStr":"'+outcomeStr+'","actionId":"'+actionId+'","callbackTime":"'+
			callBackTime+'","notes":"TEST NOTES","callInitiateTime":"'+initTime+'"}';

	var json = '{"request":' + text + '}'
	input.value+= "\nDISPOSITION JSON : " + json
	send(json);

}


function fetchOutcomes(){
	var jobId = document.getElementById("jobId").value;
	var campaignId = document.getElementById("campId").value;
	var input = document.getElementById("requestTA");
	input.value+= "\n--------------------Get Outcomes--------------------"
		var text ='{"aduid":"' + clientAdu+'", "username":"'+clientUsername+'","jobId":"'+jobId+'","campaignId":"'
			+campaignId+'","action":166}';
	
	var json = '{"request":' + text + '}'
	input.value+= "\nGET OUTCOMES JSON : " + json
	send(json);
}
/******************************************************************************************************
 * 
 * Textareas CleanUp functions
 * 
 ******************************************************************************************************/

function cleanRequestData(){
//	var cnf = confirm("Are you sure you want to clear the request data");
//	console.log("CONFIRM :: "+cnf)
	if(true == confirm("Are you sure you want to clear the request data")){
		document.getElementById("requestTA").value="";
	}
}

function cleanResponseData(){
//	var cnf = confirm("Are you sure you want to clear the response data");
//	console.log("CONFIRM :: "+cnf)
	if(true == confirm("Are you sure you want to clear the response data")){
		document.getElementById("responseTA").value="";
	}
}


function scrollDown(){
	console.log("scrollDown is called!!!")
	var rqstTA = document.getElementById("requestTA");
	var rspnTA = document.getElementById("responseTA");
	rqstTA.scrollTop = rqstA.scrollHeight;
	rspnTA.scrollTop = rspnTA.scrollHeight;
}


