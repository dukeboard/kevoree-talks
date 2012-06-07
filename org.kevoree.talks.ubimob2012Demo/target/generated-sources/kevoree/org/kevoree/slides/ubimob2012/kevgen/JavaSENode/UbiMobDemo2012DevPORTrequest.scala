package org.kevoree.slides.ubimob2012.kevgen.JavaSENode
import org.kevoree.framework.port._
import org.kevoree.slides.ubimob2012._
import scala.{Unit=>void}
class UbiMobDemo2012DevPORTrequest(component : UbiMobDemo2012Dev) extends org.kevoree.framework.MessagePort with KevoreeProvidedPort {
def getName : String = "request"
def getComponentName : String = component.getName 
def process(o : Object) = {this ! o}
override def internal_process(msg : Any)= msg match {
case _ @ msg =>try{component.requestHandler(msg)}catch{case _ @ e => {e.printStackTrace();println("Uncatched exception while processing Kevoree message")}}
}
}
