package com.interactcrm.icx.kafka.client;

import java.util.logging.Level;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.common.base.Strings;
import com.interactcrm.icx.kafka.utility.LoggerUtility;
import com.interactcrm.icx.kafka.ws.WSClientConnector;
import com.interactcrm.logging.Log;
import com.interactcrm.logging.factory.LogModuleFactory;
import com.interactcrm.util.logging.LogHelper;
import com.interactcrm.websocket.Event;
import com.interactcrm.websocket.IWSEventListener;

public class KafkaClient implements IWSEventListener {

	private static IWSEventListener instance = new KafkaClient();
	private boolean isDebugEnabled = false;
	private boolean isErrorEnabled = false;
	private boolean isInfoEnabled = false;
	private LogHelper _logHelper;
	private static Log logger;

	private KafkaClient() {
		_logHelper = new LogHelper(this.getClass());
		logger = _logHelper.getLogger(LogModuleFactory.getModule(LoggerUtility.MODULE_NAME));
		String className = this.getClass().getName();
		if (logger != null) {
			isDebugEnabled = logger.isDebugEnabled();
			isErrorEnabled = logger.isErrorEnabled();
			isInfoEnabled = logger.isInfoEnabled();
		} else {
			LoggerUtility.logMessage(className, Level.SEVERE, "It seems that logger is not initialized properly.");
		}
	}

	public static IWSEventListener getInstance() {
		return instance;
	}

	@Override
	public void notifyEvent(Event event) {
		JSONObject jsonObject = event.getEventData();
		JSONObject jsonResObject = null;
		int action = 0;
		String loginId = null;
		String cduId = "";
		String aduId = "";
		try {
			jsonResObject = jsonObject.getJSONObject("request");
			action = jsonResObject.getInt("action");
			loginId = jsonResObject.getString("username");
			aduId = jsonResObject.getString("aduid");
		} catch (JSONException e) {
			if (isErrorEnabled) {
				logger.error("[notifyEvent] " + "JSON exception while parsing request JSON " + jsonResObject
						+ "\nReturning the control. Error: " + e.getMessage(), e);
			}
			return;
		}
		if (isDebugEnabled) {
			logger.debug("[notifyEvent] " + "Event received from Web Socket listener : " + jsonObject.toString());
		}

		System.out.println("LoginId " + loginId);
		System.out.println("LoginId isNullOrEmpty " + (Strings.isNullOrEmpty(loginId)));
		if (loginId == null || loginId == "" || loginId == "undefined") {
			JSONObject commonJSONList = new JSONObject();
			try {
				commonJSONList.put("reason", "");
				commonJSONList.put("jsondata", jsonResObject.toString());
			} catch (JSONException e) {
			}
			return;
		}

		try {

			if (101 == action) {
				if (isDebugEnabled) {
					logger.debug("[notifyEvent] " + "Agent [" + loginId + "] login agent into Softphone.");
				}
				JSONObject commonJSONList = new JSONObject();
				try {
					commonJSONList.put("reason", "success");
				} catch (JSONException e) {
				}
				String status = "0";
				WSClientConnector.getInstance().sendLoginResponse(aduId, status, commonJSONList.toString());
			}else if (102 == action) {
				if (isDebugEnabled) {
					logger.debug("[notifyEvent] " + "[" + loginId + "] " + "Get agent list call...");
					logger.debug("[notifyEvent] " + "[" + loginId + "] " + "getAgentList(" + loginId + ")");
				}
				String addressBookResponse = "";
				sendDataToWSConnector(aduId, addressBookResponse);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void sendDataToWSConnector(String aduId, String response) {
		try {
			WSClientConnector.getInstance().sendResponse(aduId, "", response);
		} catch (Exception e) {
			if (isErrorEnabled) {
				logger.error("[sendDataToWSConnector] ", e);
			}
		}
	}
}
