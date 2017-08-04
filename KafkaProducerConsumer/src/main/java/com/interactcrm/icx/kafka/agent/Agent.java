package com.interactcrm.icx.kafka.agent;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.json.JSONException;
import org.json.JSONObject;

import com.interactcrm.icx.kafka.factory.KafkaFactory;

public class Agent implements Runnable {

	private boolean STOP = true;
	private static Map<Integer, String> map = new HashMap<>();
	private Random r = new Random();
	static {
		map.put(0, "LOGOUT");
		map.put(1, "AOL");
		map.put(2, "RONA");
		map.put(3, "LUNCH");
		map.put(4, "BIO-BREAK");
		map.put(5, "MEETING");
		map.put(6, "AVAILABLE");
	}

	private String name;

	public Agent(String name) {
		this.name = name;
	}

	public void run() {
		while(STOP){
			int nextRandomNumber = getNextRandomNumber(1, 7);
			String json = getJSON(nextRandomNumber);
			sendData(json);
			nextRandomNumber = getNextRandomNumber(4000, 10000);
			System.out.println("Agent ["+name+"] sleeping for ["+nextRandomNumber+"] milliseconds... ");
			try {
				Thread.sleep(nextRandomNumber);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		System.out.println("Agent ["+name+"] logged out...");
	}

	public void logout(){
		STOP = false;
		String json = getJSON(0);
		sendData(json);
	}

	private void sendData(String json) {
		System.out.println("Sending data to producer...");
		KafkaFactory.getInstance().getICXProducer().produceData(json);
		System.out.println("Data sent to producer...");
	}

	private int getNextRandomNumber(int low, int high) {
		int result = r.nextInt(high - low) + low;
		return result;
	}

	private String getJSON(int auxCode) {
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("name", name);
			jsonObject.put("codeId", auxCode);
			jsonObject.put("auxCode", map.get(auxCode));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
}
