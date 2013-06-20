package org.kevoree.slides.dukePhD;

import org.kevoree.annotation.Port;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 14/06/13
 * Time: 07:27
 * To change this template use File | Settings | File Templates.
 */
public class Errors {

    public void myProcess(){

    }

    public void callBlockingSensor(){

    }

    @Port(name="input")
    public void triggerPort(){
       try {
           callBlockingSensor();
          Thread.sleep(2000);
           myProcess();
       } catch (InterruptedException wtfException){
          //strange but what I can do ? don't care
       }
    }


}
