package org.kevoree.slides.framework.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.framework._
class KevoreeSlidePageFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=KevoreeSlidePageFactory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=KevoreeSlidePageFactory.remove(instanceName)
def createInstanceActivator = KevoreeSlidePageFactory.createInstanceActivator
}

object KevoreeSlidePageFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new KevoreeSlidePageActivator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createKevoreeSlidePage()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.framework.KevoreeSlidePage].startPage()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.framework.KevoreeSlidePage].stopPage()}
override def updateComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.framework.KevoreeSlidePage].updatePage()}
}}
def createKevoreeSlidePage() : org.kevoree.slides.framework.KevoreeSlidePage ={
val newcomponent = new org.kevoree.slides.framework.KevoreeSlidePage();
newcomponent.getHostedPorts().put("request",createKevoreeSlidePagePORTrequest(newcomponent))
newcomponent.getNeededPorts().put("content",createKevoreeSlidePagePORTcontent(newcomponent))
newcomponent.getNeededPorts().put("forward",createKevoreeSlidePagePORTforward(newcomponent))
newcomponent}
def createKevoreeSlidePagePORTrequest(component : KevoreeSlidePage) : KevoreeSlidePagePORTrequest ={ new KevoreeSlidePagePORTrequest(component)}
def createKevoreeSlidePagePORTcontent(component : KevoreeSlidePage) : KevoreeSlidePagePORTcontent ={ return new KevoreeSlidePagePORTcontent(component);}
def createKevoreeSlidePagePORTforward(component : KevoreeSlidePage) : KevoreeSlidePagePORTforward ={ return new KevoreeSlidePagePORTforward(component);}
}
