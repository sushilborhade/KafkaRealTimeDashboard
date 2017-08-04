package com.interactcrm.icx.kafka.consumers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.interactcrm.icx.kafka.constants.Constants;
import com.interactcrm.icx.kafka.ws.WSClientConnector;

public class ICXConsumer implements Runnable {

	private boolean KEEP_RUNNING = true;

	public void setConsumerRunning(boolean keepRunning) {
		System.out.println("Stopping consumer...");
		KEEP_RUNNING = keepRunning;
	}

	private Properties getKafkaServerProerties() {
		Properties props = new Properties();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, Constants.BOOTSTRAP_SERVERS);
		props.put(ConsumerConfig.GROUP_ID_CONFIG, "ICXConsumer");
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
		return props;
	}

	private Consumer<String, String> createConsumer() {
		Properties kafkaServerProerties = getKafkaServerProerties();
		final Consumer<String, String> consumer = new KafkaConsumer<>(kafkaServerProerties);
		consumer.subscribe(Collections.singletonList(Constants.TOPIC));
		return consumer;
	}

	public void run() {

		System.out.printf("Starting consumer = [%s], on = [%s] server.", Constants.TOPIC, Constants.BOOTSTRAP_SERVERS);

		final Consumer<String, String> consumer = createConsumer();

		// infinite poll loop
		while (KEEP_RUNNING) {
			ConsumerRecords<String, String> records = consumer.poll(10000);
			for (ConsumerRecord<String, String> record : records) {
				System.out.printf("offset = %d, key = %s, value = %s\n", record.offset(), record.key(), record.value());

				try {
					String response = record.value();
					System.out.println(response);
					addToMap(response);
					sendData();
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		}
		System.out.println("Consumer stopped...");
	}

	private void sendData() throws JSONException {
		JSONObject object = new JSONObject();
//		JSONArray array = new JSONArray();
//		for (int i = 0; i < list.size(); i++) {
//			array.put(auxAgentsMap);
//		}
		object.put("response", auxAgentsMap);
		WSClientConnector.getInstance().sendResponse(Constants.ADUID, "", object.toString());
	}

	private Map<String, List<String>> auxAgentsMap = Collections.synchronizedMap(new HashMap<>());

	// {"codeId":6,"name":"sushil","auxCode":"AVAIALABLE"}

	private void addToMap(String response) {
		try {
			JSONObject jsonObject = new JSONObject(response);
			String auxCode = jsonObject.getString("auxCode");
			String name = jsonObject.getString("name");

			removeAgent(name);

			if("LOGOUT".equalsIgnoreCase(auxCode)) return;
			List<String> agentList = auxAgentsMap.get(auxCode);
			if (agentList == null) {
				agentList = new ArrayList<String>();
				auxAgentsMap.put(auxCode, agentList);
			}
			agentList.add(name);
		} catch (JSONException e) {
			e.printStackTrace();
		}

//		list.add(response);
	}

	public void removeAgent(String name) {
		Collection<List<String>> agentListValues = auxAgentsMap.values();
		agentListValues.forEach(aList -> {
			if (aList.contains(name)) {
				aList.remove(name);
			}
		});
	}

	public static void main(String[] args) {
		new ICXConsumer().run();
	}

}
