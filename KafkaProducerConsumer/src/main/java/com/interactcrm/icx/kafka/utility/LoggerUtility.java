package com.interactcrm.icx.kafka.utility;

import java.util.logging.Level;
import java.util.logging.Logger;

public class LoggerUtility {
	public static final String MODULE_NAME	=	"VIM";
	public static final String NEW_LINE		=	"\n";

	public static void logMessage(String className, Level level, String message){
		Logger.getLogger(className).log(level, message);
	}
}
