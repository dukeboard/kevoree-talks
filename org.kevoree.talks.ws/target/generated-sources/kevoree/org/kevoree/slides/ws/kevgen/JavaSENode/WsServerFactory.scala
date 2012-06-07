package org.kevoree.slides.ws.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.ws._
class WsServerFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=WsServerFactory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=WsServerFactory.remove(instanceName)
def createInstanceActivator = WsServerFactory.createInstanceActivator
}

object WsServerFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new WsServerActivator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createWsServer()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ws.WsServer].startServer()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ws.WsServer].stopServer()}
}}
def createWsServer() : org.kevoree.slides.ws.WsServer ={
val newcomponent = new org.kevoree.slides.ws.WsServer();
newcomponent}
}
