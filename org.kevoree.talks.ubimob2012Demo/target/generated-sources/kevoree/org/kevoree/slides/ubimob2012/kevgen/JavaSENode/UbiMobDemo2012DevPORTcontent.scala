package org.kevoree.slides.ubimob2012.kevgen.JavaSENode
import org.kevoree.framework.port._
import scala.{Unit=>void}
import org.kevoree.slides.ubimob2012._
class UbiMobDemo2012DevPORTcontent(component : UbiMobDemo2012Dev) extends org.kevoree.framework.MessagePort with KevoreeRequiredPort {
def getName : String = "content"
def getComponentName : String = component.getName 
def process(o : Object) = {
{this ! o}
}
def getInOut = false
}
