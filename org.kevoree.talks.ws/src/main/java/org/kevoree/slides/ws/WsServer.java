package org.kevoree.slides.ws;


import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 03/05/12
 * Time: 14:52
 */

@Library(name = "KevoreeTalks")
@ComponentType
@DictionaryType({
        @DictionaryAttribute(name = "port", defaultValue = "8092")
})
@Provides({
        @ProvidedPort(name = "in", type = PortType.MESSAGE)
})
public class WsServer extends AbstractComponentType {

    private WebServer webServer = null;
    private BroadCastConf bconf = null;

    @Port(name = "in")
    public void handleMessage(Object msg) {
        bconf.sendToAll(msg.toString());
    }

    @Start
    public void startServer() {
        bconf = new BroadCastConf();
        webServer = WebServers.createWebServer(8092)
                .add("/keynote", bconf)
                .add(new StaticFileHandler("/keynote"));
        webServer.start();
        System.out.println("Server running at " + webServer.getUri());
    }

    @Stop
    public void stopServer() {
        webServer.stop();
        webServer = null;
        bconf = null;
    }

}
