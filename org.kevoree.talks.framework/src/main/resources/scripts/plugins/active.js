/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 28/05/13
 * Time: 10:26
 *
 * @author Erwan Daubert
 * @version 1.0
 */

function ActivePlugin(kslide) {

    var self = this;

    jQuery(kslide.getBody()).on("FORWARD", function () {
        forward();
    });
    jQuery(kslide.getBody()).on("BACK", function () {
        back();
    });
    jQuery(kslide.getBody()).on("SET_SLIDE", function () {
        console.log("active plugin on SET_SLIDE");
        initializeInnerTransition(kslide.getCurrentSlideNumber());
        initializeCollapseTransition(kslide.getCurrentSlideNumber());
    });
    jQuery(kslide.getBody()).on("PREVIOUS_SLIDE", function () {
        rollbackInnerTransition(kslide.getCurrentSlideNumber());
        rollbackCollapseTransition(kslide.getCurrentSlideNumber());
    });
    jQuery(kslide.getBody()).on("SET_CURSOR", function (message) {
        initializeInnerTransition(message.cursor);
        initializeCollapseTransition(message.cursor);
    });

    /*this.listener = function (message) {
     if (message.type === "FORWARD") {
     forward();
     } else if (message.type === "BACK") {
     back();
     } else if (message.type === "NEXT_SLIDE") {
     initializeInnerTransition(kslide.getCurrentSlideNumber());
     initializeCollapseTransition(kslide.getCurrentSlideNumber());
     } else if (message.type === "PREVIOUS_SLIDE") {
     rollbackInnerTransition(kslide.getCurrentSlideNumber());
     rollbackCollapseTransition(kslide.getCurrentSlideNumber());
     } else if (message.type === "SET_CURSOR") {
     initializeInnerTransition(message.cursor);
     initializeInnerTransition(message.cursor);
     }
     };*/

    jQuery(kslide.getBody()).on("RUN", function () {
        self.start();
    });

    this.start = function () {
        console.log("Starting active plugin");
        initializeInnerTransition(kslide.getCurrentSlideNumber());
    };

    function forward() {
        if (!kslide.hasInnerNavigation(kslide.getCurrentSlideNumber()) || !kslide.isSlideMode()) {
            jQuery(kslide.getBody()).trigger({"type": "NEXT_SLIDE"});
        } else {
            var newInner = getNextInner(kslide.getCurrentSlideNumber());
            if (newInner) {
                newInner.className = newInner.className + ' active';

                var activeInners = getActiveInners(kslide.getCurrentSlideNumber());
                try {
                    // create event to trigger listener that can manage animations on the appearing elements
                    jQuery(activeInners[activeInners.length - 2]).trigger('notCurrentActive');
                    jQuery(newInner).trigger('active');
                    jQuery(newInner).trigger('currentActive');
                } catch (e) {
                }

                // manage collapse element
                for (var i = activeInners.length - 2; i >= 0; i--) {
                    if (activeInners[i].className.indexOf("collapse") != -1
                        && (!isParentInner(activeInners[i], newInner) && newInner != activeInners[i])
                        && activeInners[i].className.indexOf("collapsed") == -1) {
                        activeInners[i].className = activeInners[i].className + " collapsed";
                    }
                }
            } else {
                jQuery(kslide.getBody()).trigger({"type": "NEXT_SLIDE"});
            }
        }
    }

    function back() {
        if (!kslide.hasInnerNavigation(kslide.getCurrentSlideNumber()) || !kslide.isSlideMode()) {
            jQuery(kslide.getBody()).trigger({"type": "PREVIOUS_SLIDE", "slideNumber" : kslide.getCurrentSlideNumber() -1});
        } else {
            var activeInners = getActiveInners(kslide.getCurrentSlideNumber());
            var activeInner = activeInners[activeInners.length - 1];
            if (activeInners.length > 1 && activeInner) {
                var indexOf = activeInner.className.indexOf(" active");
                activeInner.className = activeInner.className.substring(0, indexOf) + activeInner.className.substring(indexOf + " active".length);

                activeInners = getActiveInners(kslide.getCurrentSlideNumber());
                try {
                    jQuery(activeInner).trigger('notActive');
                    jQuery(activeInner).trigger('notCurrentActive');
                    jQuery(activeInners[activeInners.length - 1]).trigger('currentActive');
                } catch (e) {
                }

                // manage collapse element
                activeInner = activeInners[activeInners.length - 1];
                for (var i = activeInners.length - 1; i >= 0; i--) {
                    if (activeInners[i].className.indexOf("collapse") != -1
                        && (isParentInner(activeInners[i], activeInner) || activeInner == activeInners[i])
                        && activeInners[i].className.indexOf("collapsed") != -1) {
                        indexOf = activeInners[i].className.indexOf(" collapsed");
                        activeInners[i].className = activeInners[i].className.substring(0, indexOf) + activeInners[i].className.substring(indexOf + " collapsed".length);
                    }
                }
            } else {
                jQuery(kslide.getBody()).trigger({"type": "PREVIOUS_SLIDE", "slideNumber" : kslide.getCurrentSlideNumber() -1});
            }
        }
    }

    function isParentInner(parent, potentialChild) {
        var childs = parent.querySelectorAll("*");
        for (var i = 0; i < childs.length; i++) {
            if (childs[i] == potentialChild) {
                return true;
            }
        }
        return false;
    }

    function getActiveInners(slideNumber) {
        return jQuery(kslide.getSlide(slideNumber).slide).find('.next.active');
    }

    function getNextInner(slideNumber) {
        var slide = kslide.getSlide(slideNumber).slide;
        var inners = jQuery(slide).find('.next');
        var activeInners = jQuery(slide).find('.next.active');
        var nbActiveInner = activeInners.length;
        return inners[nbActiveInner];
    }

    function initializeInnerTransition(slideNumber) {
        console.log(slideNumber);
        if (slideNumber === undefined || slideNumber < 0 || slideNumber > kslide.getLength || !kslide.isSlideMode()) {
            console.log("unable to active inner transition");
            return;
        }
        if (kslide.hasInnerNavigation(slideNumber)) {
            console.log("initialize inner transition");
            var activeNodes = jQuery(kslide.getSlide(kslide.getCurrentSlideNumber()).slide).find('.next');
            if (activeNodes.length > 0) {
                for (var i = 0, ii = activeNodes.length; i < ii; i++) {
                    jQuery(activeNodes[i]).removeClass("active");
                    try {
                        jQuery(activeNodes[i]).trigger('notActive');
                        jQuery(activeNodes[i]).trigger('notCurrentActive');
                    } catch (e) {
                    }
                }
                jQuery(activeNodes[i]).addClass("active");
                try {
                    // create event to trigger listener that can manage animations on the appearing elements
                    jQuery(activeNodes[0]).trigger('active');
                    jQuery(activeNodes[0]).trigger('currentActive');
                } catch (e) {
                }
            }
        }
    }

    function rollbackInnerTransition(slideNumber) {
        if (!kslide.isSlideMode()) {
            return;
        }
        // update new current slide according to innerTransition (all the inner must be displayed)
        if (kslide.hasInnerNavigation(slideNumber)) {
            var activeNodes = jQuery(kslide.getSlide(kslide.getCurrentSlideNumber()).slide).find('.next');
            for (var i = 0, ii = activeNodes.length; i < ii; i++) {
                jQuery(activeNodes[i]).addClass("active");
                if (i == activeNodes.length - 1) {
                    try {
                        jQuery(activeNodes[i]).trigger('active');
                        jQuery(activeNodes[i]).trigger('currentActive');
                    } catch (e) {
                    }
                } else {
                    try {
                        jQuery(activeNodes[i]).trigger('active');
                        jQuery(activeNodes[i]).trigger('notCurrentActive');
                    } catch (e) {
                    }
                }
            }
        }
    }

    function initializeCollapseTransition(slideNumber) {
        if (slideNumber === undefined || slideNumber < 0 || slideNumber >= kslide.getLength().length || !kslide.isSlideMode()) {
            return;
        }
        if (kslide.hasInnerNavigation(slideNumber)) {
            var innerNodes = jQuery(kslide.getSlide(slideNumber)).find('.collapse');
            for (var i = 0, ii = innerNodes.length; i < ii; i++) {
                var indexOf = innerNodes[i].className.indexOf("collapsed");
                if (indexOf != -1) {
                    innerNodes[i].className = innerNodes[i].className.substring(0, indexOf) + innerNodes[i].className.substring(indexOf + " collapsed".length);
                }
            }
        }
    }

    function rollbackCollapseTransition(slideNumber) {
        if (!kslide.isSlideMode()) {
            return;
        }
        // update new current slide according to collapseTransition (all the collapse must be collapsed (except the last one if it is the last active)
        if (kslide.hasInnerNavigation(slideNumber)) {
            var collapseInners = jQuery(kslide.getSlide(slideNumber)).find('.collapse');
            if (collapseInners.length > 0) {
                for (var i = 0, ii = collapseInners.length - 1; i < ii; i++) {
                    if (collapseInners[i].className.indexOf("collapsed") == -1) {
                        collapseInners[i].className = collapseInners[i].className + " collapsed";
                    }
                }
                var activeInners = jQuery(kslide.getSlide(slideNumber)).find('.next.active');
                if (activeInners[activeInners.length - 1] != collapseInners[collapseInners.length - 1]) {
                    collapseInners[collapseInners.length - 1].className = collapseInners[collapseInners.length - 1].className + " collapsed";
                }
            }
        }
    }
}