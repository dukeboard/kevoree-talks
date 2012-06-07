package org.kevoree.slides.ubimob2012.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.ubimob2012._
class UbiMob2012DevFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=UbiMob2012DevFactory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=UbiMob2012DevFactory.remove(instanceName)
def createInstanceActivator = UbiMob2012DevFactory.createInstanceActivator
}

object UbiMob2012DevFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new UbiMob2012DevActivator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createUbiMob2012Dev()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMob2012Dev].startPage()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMob2012Dev].stopPage()}
override def updateComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMob2012Dev].updatePage()}
}}
def createUbiMob2012Dev() : org.kevoree.slides.ubimob2012.UbiMob2012Dev ={
val newcomponent = new org.kevoree.slides.ubimob2012.UbiMob2012Dev();
newcomponent.getHostedPorts().put("request",createUbiMob2012DevPORTrequest(newcomponent))
newcomponent.getNeededPorts().put("content",createUbiMob2012DevPORTcontent(newcomponent))
newcomponent.getNeededPorts().put("forward",createUbiMob2012DevPORTforward(newcomponent))
newcomponent}
def createUbiMob2012DevPORTrequest(component : UbiMob2012Dev) : UbiMob2012DevPORTrequest ={ new UbiMob2012DevPORTrequest(component)}
def createUbiMob2012DevPORTcontent(component : UbiMob2012Dev) : UbiMob2012DevPORTcontent ={ return new UbiMob2012DevPORTcontent(component);}
def createUbiMob2012DevPORTforward(component : UbiMob2012Dev) : UbiMob2012DevPORTforward ={ return new UbiMob2012DevPORTforward(component);}
}
