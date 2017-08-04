package com.interactcrm.icx.kafka.factory;

import com.interactcrm.icx.kafka.consumers.ICXConsumer;
import com.interactcrm.icx.kafka.producers.ICXProducer;

public class KafkaFactory {

	private static final KafkaFactory KAFKA_FACTORY = new KafkaFactory();
	private static final ICXConsumer ICXCONSUMER = new ICXConsumer();
	private KafkaFactory() {
	}

	public static KafkaFactory getInstance(){
		return KAFKA_FACTORY;
	}

	public ICXProducer getICXProducer(){
		return ICXProducer.getInstance();
	}

	public ICXConsumer getICXConsumer(){
		return ICXCONSUMER;
	}
}
