package org.kevoree.slides.framework.kevgen.JavaSENode
import org.kevoree.framework.port._
import scala.{Unit=>void}
import org.kevoree.slides.framework._
class KevoreeSlidePagePORTcontent(component : KevoreeSlidePage) extends org.kevoree.framework.MessagePort with KevoreeRequiredPort {
def getName : String = "content"
def getComponentName : String = component.getName 
def process(o : Object) = {
{this ! o}
}
def getInOut = false
}
