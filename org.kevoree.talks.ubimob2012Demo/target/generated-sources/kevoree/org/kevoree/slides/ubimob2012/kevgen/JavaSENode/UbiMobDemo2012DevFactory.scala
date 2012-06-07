package org.kevoree.slides.ubimob2012.kevgen.JavaSENode
import org.kevoree.framework._
import org.kevoree.slides.ubimob2012._
class UbiMobDemo2012DevFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
override def registerInstance(instanceName : String, nodeName : String)=UbiMobDemo2012DevFactory.registerInstance(instanceName,nodeName)
override def remove(instanceName : String)=UbiMobDemo2012DevFactory.remove(instanceName)
def createInstanceActivator = UbiMobDemo2012DevFactory.createInstanceActivator
}

object UbiMobDemo2012DevFactory extends org.kevoree.framework.osgi.KevoreeInstanceFactory {
def createInstanceActivator: org.kevoree.framework.osgi.KevoreeInstanceActivator = new UbiMobDemo2012DevActivator
def createComponentActor() : KevoreeComponent = {
	new KevoreeComponent(createUbiMobDemo2012Dev()){def startComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMobDemo2012Dev].startPage()}
def stopComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMobDemo2012Dev].stopPage()}
override def updateComponent(){getKevoreeComponentType.asInstanceOf[org.kevoree.slides.ubimob2012.UbiMobDemo2012Dev].updatePage()}
}}
def createUbiMobDemo2012Dev() : org.kevoree.slides.ubimob2012.UbiMobDemo2012Dev ={
val newcomponent = new org.kevoree.slides.ubimob2012.UbiMobDemo2012Dev();
newcomponent.getHostedPorts().put("request",createUbiMobDemo2012DevPORTrequest(newcomponent))
newcomponent.getNeededPorts().put("content",createUbiMobDemo2012DevPORTcontent(newcomponent))
newcomponent.getNeededPorts().put("forward",createUbiMobDemo2012DevPORTforward(newcomponent))
newcomponent}
def createUbiMobDemo2012DevPORTrequest(component : UbiMobDemo2012Dev) : UbiMobDemo2012DevPORTrequest ={ new UbiMobDemo2012DevPORTrequest(component)}
def createUbiMobDemo2012DevPORTcontent(component : UbiMobDemo2012Dev) : UbiMobDemo2012DevPORTcontent ={ return new UbiMobDemo2012DevPORTcontent(component);}
def createUbiMobDemo2012DevPORTforward(component : UbiMobDemo2012Dev) : UbiMobDemo2012DevPORTforward ={ return new UbiMobDemo2012DevPORTforward(component);}
}
