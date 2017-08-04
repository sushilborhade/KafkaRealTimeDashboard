package com.interactcrm.icx.kafka.controller;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.interactcrm.icx.kafka.agent.Agent;

@RestController
public class LoginAgent {

	private static Map<String, Agent> map = new HashMap<>();

	@RequestMapping(value = "/api/login/{loginid}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> loginAgent(@PathVariable("loginid") String agentId) {
		if (agentId != null && !agentId.isEmpty() && !map.containsKey(agentId)) {
			Agent agent = new Agent(agentId);
			Thread thread = new Thread(agent);
			map.put(agentId, agent);
			thread.start();
			return new ResponseEntity<>(agentId + " created successfully...", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Invalid loginid["+agentId+"]", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		}
	}

	@RequestMapping(value = "/api/logout/{loginid}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> logoutAgent(@PathVariable("loginid") String agentId) {
		if (agentId != null && !agentId.isEmpty()) {
			Agent agent = map.get(agentId);
			if(agent != null){
				map.remove(agentId);
				agent.logout();
//				KafkaFactory.getInstance().getICXConsumer().removeAgent(agentId);
			}
			return new ResponseEntity<>(agentId + " logged out successfully...", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Invalid loginid["+agentId+"]", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		}
	}

	@RequestMapping(value = "/api/agentList", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> agentList() {
		return new ResponseEntity<>(new JSONObject(map).toString(), HttpStatus.OK);
	}

}
