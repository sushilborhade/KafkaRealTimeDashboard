package com.interactcrm.icx.kafka.producers;

import java.util.Properties;
import java.util.concurrent.ExecutionException;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import com.interactcrm.icx.kafka.constants.Constants;

public class ICXProducer {

	private Producer<String, String> producer;
	private static final ICXProducer ICX_PRODUCER = new ICXProducer();

	public static ICXProducer getInstance(){
		return ICX_PRODUCER;
	}

	private ICXProducer() {
		Properties props = getKafkaServerProerties();
		producer = new KafkaProducer<>(props);
	}

	public static void main(String[] args) {
		System.out.println("ICXProducer Completed...");
	}

	private static Properties getKafkaServerProerties() {
		Properties props = new Properties();
		props.put("bootstrap.servers", "192.168.1.59:9092");
		props.put("key.serializer", StringSerializer.class.getName());
		props.put("value.serializer", StringSerializer.class.getName());
		return props;
	}

	public void produceData(String json) {
		ProducerRecord<String, String> record = new ProducerRecord<>(Constants.TOPIC, json);
		try {
			RecordMetadata recordMetadata = producer.send(record).get();
			System.out.println("Offset = " + recordMetadata.offset() + "\tPartition = " + recordMetadata.partition()
					+ "\tTimeStamp = " + recordMetadata.timestamp());
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
	}

	public void close() {
		producer.close();
	}
}
