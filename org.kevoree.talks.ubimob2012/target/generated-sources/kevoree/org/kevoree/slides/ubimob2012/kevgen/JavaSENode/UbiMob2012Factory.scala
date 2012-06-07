package org.kevoree.slides.ubimob2012.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.ubimob2012._
class UbiMob2012Factory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=UbiMob2012Factory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=UbiMob2012Factory.remove(instanceName)
def createInstanceActivator = UbiMob2012Factory.createInstanceActivator
}

object UbiMob2012Factory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new UbiMob2012Activator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createUbiMob2012()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMob2012].startPage()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMob2012].stopPage()}
override def updateComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMob2012].updatePage()}
}}
def createUbiMob2012() : org.kevoree.slides.ubimob2012.UbiMob2012 ={
val newcomponent = new org.kevoree.slides.ubimob2012.UbiMob2012();
newcomponent.getHostedPorts().put("request",createUbiMob2012PORTrequest(newcomponent))
newcomponent.getNeededPorts().put("content",createUbiMob2012PORTcontent(newcomponent))
newcomponent.getNeededPorts().put("forward",createUbiMob2012PORTforward(newcomponent))
newcomponent}
def createUbiMob2012PORTrequest(component : UbiMob2012) : UbiMob2012PORTrequest ={ new UbiMob2012PORTrequest(component)}
def createUbiMob2012PORTcontent(component : UbiMob2012) : UbiMob2012PORTcontent ={ return new UbiMob2012PORTcontent(component);}
def createUbiMob2012PORTforward(component : UbiMob2012) : UbiMob2012PORTforward ={ return new UbiMob2012PORTforward(component);}
}
