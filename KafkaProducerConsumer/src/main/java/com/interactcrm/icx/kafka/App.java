package com.interactcrm.icx.kafka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import com.interactcrm.icx.kafka.client.KafkaClient;
import com.interactcrm.icx.kafka.ws.WSClientConnector;
import com.interactcrm.logging.factory.LogInitializer;
import com.interactcrm.utils.Utility;

@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan({"com.interactcrm.icx.kafka"})
public class App {
	
	public static void main(String[] args) throws Exception {

		try {
			LogInitializer.initialize(Utility.getAppHome(), Utility.getAppLogPath());
			WSClientConnector.getInstance().registerWSListener(KafkaClient.getInstance());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("Initializing app.................=================");
		SpringApplication.run(App.class, args);
	}
}
