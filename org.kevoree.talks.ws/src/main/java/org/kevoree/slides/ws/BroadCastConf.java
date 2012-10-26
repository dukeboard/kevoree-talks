package org.kevoree.slides.ws;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebSocketConnection;

import java.util.HashSet;
import java.util.Set;
import java.util.Vector;

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
	private static String joinMessageType = "JOIN";

	private Vector<String> messageList = new Vector<String>();

	@Override
	public void onOpen (WebSocketConnection connection) throws Exception {
		connections.add(connection);
	}

	void sendToAll (String msg) {
		messageList.add(msg);
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
		try {
			System.out.println(message);
			JSONObject jsonReader = new JSONObject(message);
			System.out.println("on msg " + jsonReader.get("type"));
			if ("SET_CURSOR".equals(jsonReader.get("type").toString())) {
				System.out.println(message);
				messageList.clear();
				messageList.add(message);
				broadcast(message, connection, connection.data(keynoteID).toString());
			} else if (connection.data(keynoteID) != null) {
				System.out.println("store message to replay it on new connection");
				messageList.add(message);
				broadcast(message, connection, connection.data(keynoteID).toString());
			} else {
				if (joinMessageType.equals(jsonReader.get("type").toString())) {
					connection.data(keynoteID, jsonReader.get("id"));
					System.out.println("synchronize new participants");
					for (String msg : messageList) {
						System.out.println("send " + msg + " to the new participant");
						connection.send(msg);
					}
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

}
