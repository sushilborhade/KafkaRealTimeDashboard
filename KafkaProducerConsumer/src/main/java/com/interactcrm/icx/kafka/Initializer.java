package com.interactcrm.icx.kafka;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

import com.interactcrm.icx.kafka.client.KafkaClient;
import com.interactcrm.icx.kafka.consumers.ICXConsumer;
import com.interactcrm.icx.kafka.factory.KafkaFactory;
import com.interactcrm.icx.kafka.ws.WSClientConnector;
import com.interactcrm.logging.factory.LogInitializer;
import com.interactcrm.utils.Utility;

public class Initializer extends SpringBootServletInitializer {

	@Override
	public SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		try {
			LogInitializer.initialize(Utility.getAppHome(), Utility.getAppLogPath());
			registerWS();
			initializeConsumer();
		} catch (Exception e) {
			e.printStackTrace();
		}
		application.registerShutdownHook(true);
		return application.sources(App.class);
	}

	private void initializeConsumer() {
		ICXConsumer icxConsumer = KafkaFactory.getInstance().getICXConsumer();
		new Thread(icxConsumer).start();
	}

	private void registerWS() {
		WSClientConnector.getInstance().registerWSListener(KafkaClient.getInstance());
	}
	
}
