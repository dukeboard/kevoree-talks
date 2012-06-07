package org.kevoree.slides.framework.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.framework._
class KevoreeSlidePageDevFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=KevoreeSlidePageDevFactory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=KevoreeSlidePageDevFactory.remove(instanceName)
def createInstanceActivator = KevoreeSlidePageDevFactory.createInstanceActivator
}

object KevoreeSlidePageDevFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new KevoreeSlidePageDevActivator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createKevoreeSlidePageDev()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.framework.KevoreeSlidePageDev].startPage()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.framework.KevoreeSlidePageDev].stopPage()}
override def updateComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.framework.KevoreeSlidePageDev].updatePage()}
}}
def createKevoreeSlidePageDev() : org.kevoree.slides.framework.KevoreeSlidePageDev ={
val newcomponent = new org.kevoree.slides.framework.KevoreeSlidePageDev();
newcomponent.getHostedPorts().put("request",createKevoreeSlidePageDevPORTrequest(newcomponent))
newcomponent.getNeededPorts().put("content",createKevoreeSlidePageDevPORTcontent(newcomponent))
newcomponent.getNeededPorts().put("forward",createKevoreeSlidePageDevPORTforward(newcomponent))
newcomponent}
def createKevoreeSlidePageDevPORTrequest(component : KevoreeSlidePageDev) : KevoreeSlidePageDevPORTrequest ={ new KevoreeSlidePageDevPORTrequest(component)}
def createKevoreeSlidePageDevPORTcontent(component : KevoreeSlidePageDev) : KevoreeSlidePageDevPORTcontent ={ return new KevoreeSlidePageDevPORTcontent(component);}
def createKevoreeSlidePageDevPORTforward(component : KevoreeSlidePageDev) : KevoreeSlidePageDevPORTforward ={ return new KevoreeSlidePageDevPORTforward(component);}
}
