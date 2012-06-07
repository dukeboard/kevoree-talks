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

@Library(name = "KevoreeWeb")
@ComponentType
@DictionaryType({
        @DictionaryAttribute(name = "port" , defaultValue = "8092")
})
public class WsServer extends AbstractComponentType {

    private WebServer webServer = null;

    @Start
    public void startServer(){
        webServer = WebServers.createWebServer(8092)
                .add("/keynote", new BroadCastConf())
                .add(new StaticFileHandler("/keynote"));
        webServer.start();
        System.out.println("Server running at " + webServer.getUri());
    }
    @Stop
    public void stopServer(){
        webServer.stop();
    }





}
