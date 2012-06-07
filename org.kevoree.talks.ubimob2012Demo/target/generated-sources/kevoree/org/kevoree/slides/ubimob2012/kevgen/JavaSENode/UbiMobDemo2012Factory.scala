package org.kevoree.slides.ubimob2012.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.ubimob2012._
class UbiMobDemo2012Factory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=UbiMobDemo2012Factory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=UbiMobDemo2012Factory.remove(instanceName)
def createInstanceActivator = UbiMobDemo2012Factory.createInstanceActivator
}

object UbiMobDemo2012Factory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new UbiMobDemo2012Activator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createUbiMobDemo2012()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMobDemo2012].startPage()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMobDemo2012].stopPage()}
override def updateComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMobDemo2012].updatePage()}
}}
def createUbiMobDemo2012() : org.kevoree.slides.ubimob2012.UbiMobDemo2012 ={
val newcomponent = new org.kevoree.slides.ubimob2012.UbiMobDemo2012();
newcomponent.getHostedPorts().put("request",createUbiMobDemo2012PORTrequest(newcomponent))
newcomponent.getNeededPorts().put("content",createUbiMobDemo2012PORTcontent(newcomponent))
newcomponent.getNeededPorts().put("forward",createUbiMobDemo2012PORTforward(newcomponent))
newcomponent}
def createUbiMobDemo2012PORTrequest(component : UbiMobDemo2012) : UbiMobDemo2012PORTrequest ={ new UbiMobDemo2012PORTrequest(component)}
def createUbiMobDemo2012PORTcontent(component : UbiMobDemo2012) : UbiMobDemo2012PORTcontent ={ return new UbiMobDemo2012PORTcontent(component);}
def createUbiMobDemo2012PORTforward(component : UbiMobDemo2012) : UbiMobDemo2012PORTforward ={ return new UbiMobDemo2012PORTforward(component);}
}
