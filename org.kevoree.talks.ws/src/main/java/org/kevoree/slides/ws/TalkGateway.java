package org.kevoree.slides.ws;

import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.framework.MessagePort;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 16/06/12
 * Time: 13:14
 */


@Provides({
        @ProvidedPort(name = "prev", type = PortType.MESSAGE),
        @ProvidedPort(name = "next", type = PortType.MESSAGE)
})
@Requires({
        @RequiredPort(name = "broad", type = PortType.MESSAGE, optional = true)
})
@Library(name = "KevoreeTalks")
@ComponentType
public class TalkGateway extends AbstractComponentType {

    @Start
    @Stop
    @Update
    public void lifeCycle() {
    }

    @Port(name = "prev")
    public void handlePrev(Object o) {
        getPortByName("broad", MessagePort.class).process("BACK");
    }

    @Port(name = "next")
    public void handleNext(Object o) {
        getPortByName("broad", MessagePort.class).process("FORWARD");
    }

}
