package com.interactcrm.icx.kafka.ws;

import com.interactcrm.logging.Log;
import com.interactcrm.logging.factory.LogModuleFactory;
import com.interactcrm.util.logging.LogHelper;
import com.interactcrm.websocket.IWSApplication;
import com.interactcrm.websocket.IWSEventListener;
import com.interactcrm.websocket.WSFactory;

public class WSClientConnector {

	private static final LogHelper _logHelper	=	new LogHelper(WSClientConnector.class);
	private static final Log logger 			=	_logHelper.getLogger(LogModuleFactory.getModule("KAFKA_SAMPLE"));

	private static boolean isDebugEnabled		=	false;
	private static boolean isErrorEnabled		=	false;


	private static com.interactcrm.websocket.IWSConnector wsConnector	=	null;
	private static WSClientConnector wsClientConnector;
	private static IWSApplication application;
	private static WSFactory wsFactory;

	private WSClientConnector(){
		if (logger != null) {
			isDebugEnabled	=	logger.isDebugEnabled();
			isErrorEnabled	=	logger.isErrorEnabled();
		}
		wsFactory = WSFactory.getInstance();
		/**
		 * maxIdleTimeout		=	Timeout for WebSocket Session connection.
		 * sessionRestoreTime	=	Client session reconnect request.
		 * threadTimeInterval	=	Time interval for cleaning reconnectSessionMap (i.e. closeMap) of WSConnector
		 */
		// 8 HOURS
		String _8_HOURS				=	"28800000";
		
		// 3 MINS
		String _SESSION_RESTORE_TIME=	"180000";
		
		// 10 SECS
		String _THREAD_TIME_INTERVAL=	"10000";
		
		long maxIdleTimeout		=	Long.parseLong(_8_HOURS);
		long sessionRestoreTime	=	Long.parseLong(_SESSION_RESTORE_TIME);
		int threadTimeInterval	=	Integer.parseInt(_THREAD_TIME_INTERVAL);
		if(isDebugEnabled){
			logger.debug("[WSClientConnector] " + "maxIdleTimeout="+maxIdleTimeout+" sessionRestoreTime="+sessionRestoreTime+" threadTimeInterval="+threadTimeInterval);
		}
		try{
			application = wsFactory.getWSApplication(maxIdleTimeout, sessionRestoreTime, threadTimeInterval);
			wsConnector = com.interactcrm.websocket.WSFactory.getInstance().getWSConnector();
		}catch(Exception e){
			if(isErrorEnabled){
				logger.error("[WSClientConnector] ", e);
			}
		}
		if(isDebugEnabled){
			logger.debug("[WSClientConnector] Web Socket Application object : "+application+" wsConnector object : "+wsConnector);
		}
	}

	public static WSClientConnector getInstance(){
		if(wsClientConnector == null){
			if(isDebugEnabled){
				logger.debug("[getInstance] creating WSClientConnector instance...");
			}
			wsClientConnector = new WSClientConnector();
		}
		return wsClientConnector;
	}

	public void registerWSListener(IWSEventListener eventListener){
		if(isDebugEnabled){
			logger.debug("registerWSListener registering the event listener.");
		}
		try {
			application.register(eventListener);
		} catch (Exception e) {
			if(isErrorEnabled){
				logger.error("[sendResponse] Error while registering listener.", e);
			}
		}
	}

	public void sendLoginResponse(String aduId, String status, String response){
		if(isDebugEnabled){
			logger.debug("[sendLoginResponse] ADUID["+aduId+"] Staus["+status+"] Response["+response+"]");
		}
		try {
			wsConnector.loginResponse(aduId, status, response);
		} catch (Exception e) {
			if(isErrorEnabled){
				logger.error("[sendLoginResponse] Error while sending data for aduId" + aduId + " Status:"+status + " Data:"+response);
				logger.error("[sendLoginResponse] Error while sending data for aduId" + aduId, e);
			}
		}
	}

	public void sendLogoutResponse(String aduId, String status, String response){
		if(isDebugEnabled){
			logger.debug("[sendLogoutResponse] ADUID["+aduId+"] Staus["+status+"] Response["+response+"]");
		}
		try {
			wsConnector.logoutResponse(aduId, status, response);
		} catch (Exception e) {
			if(isErrorEnabled){
				logger.error("[sendLogoutResponse] Error while sending data for aduId" + aduId + " Status:"+status + " Data:"+response);
				logger.error("[sendLogoutResponse] Error while sending data for aduId" + aduId, e);
			}
		}
	}

	public void sendResponse(String aduId, String status, String response){
		if(isDebugEnabled){
			logger.debug("[sendResponse] ADUID["+aduId+"] Staus["+status+"] Response["+response+"]");
		}
		try {
			wsConnector.sendEventResponse(aduId, status, response);
		} catch (Exception e) {
			if(isErrorEnabled){
				logger.error("[sendResponse] Error while sending data for aduId" + aduId + " Status:"+status + " Data:"+response);
				logger.error("[sendResponse] Error while sending data for aduId" + aduId, e);
			}
		}
	}
}
