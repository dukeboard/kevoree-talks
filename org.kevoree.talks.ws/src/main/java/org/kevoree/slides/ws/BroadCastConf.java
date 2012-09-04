package org.kevoree.slides.ws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebSocketConnection;

import java.util.HashSet;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 03/05/12
 * Time: 15:10
 */
public class BroadCastConf extends BaseWebSocketHandler {
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	private Set<WebSocketConnection> connections = new HashSet<WebSocketConnection>();
	private static String keynoteID = "KEYID";
	private static String joinID = "JOIN";

	private boolean end = false;
	private int currentCursor = 0;
	private int currentInner = 0;

	@Override
	public void onOpen (WebSocketConnection connection) throws Exception {
		connections.add(connection);
	}

	public void sendToAll (String msg) {
		for (WebSocketConnection connection : connections) {
			connection.send(msg);
			logger.debug("Send to WS connection " + connection.toString());
		}
	}

	private void broadcast (String msg, WebSocketConnection conn, String roomID) {
		for (WebSocketConnection connection : connections) {
			if (!connection.equals(conn)) {
				if (connection.data(keynoteID) != null && connection.data(keynoteID).toString().equals(roomID)) {
					connection.send(msg);
				}
			}
		}
	}

	@Override
	public void onClose (WebSocketConnection connection) throws Exception {
		connections.remove(connection);
	}

	public void onMessage (WebSocketConnection connection, String message) {
		System.out.println("on msg " + message);
		if (message.startsWith("FIX_CURSOR")) {
			int cursor = Integer.parseInt(message.substring("FIX_CURSOR".length()).trim());
			if (cursor < currentCursor) {
				end = false;
			}
			currentCursor = cursor;
			currentInner = 0;
		} else if (connection.data(keynoteID) != null) {
			if (message.contains("FORWARD")) {
				System.out.println("FORWARD: increment inner");
				currentInner = currentInner + 1;
			} else if (message.contains("BACK")) {
				System.out.println("FORWARD: decrement inner");
				currentInner = currentInner - 1;
			} else if (message.contains("START")) {
				System.out.println("START: reinitialize");
				currentCursor = 0;
				currentInner = 0;
			} else if (message.contains("END")) {
				System.out.println("END");
				end = true;
			}
			broadcast(message, connection, connection.data(keynoteID).toString());
		} else {
			if (message.contains(joinID)) {
				connection.data(keynoteID, message.replace(keynoteID, ""));
				if (end) { // corresponds to END
					System.out.println("go to END");
					connection.send("END ");
					for (int i = 0; i> currentInner;i--) {
						connection.send("BACK ");
					}
				} else {
					System.out.println("update cursor: " + currentCursor + "." + currentInner);
					connection.send("SET_CURSOR " + currentCursor);
					for (int i = 0; i < currentInner; i++) {
						connection.send("FORWARD");
					}
				}
			}
		}
	}

}
