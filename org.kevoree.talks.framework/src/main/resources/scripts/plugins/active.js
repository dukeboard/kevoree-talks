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

    this.listener = function (message) {
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
    };

    this.initialize = function () {
    };

    this.start = function () {
        initializeInnerTransition(kslide.getCurrentSlideNumber());
    };

    function forward() {
        if (!kslide.hasInnerNavigation(kslide.getCurrentSlideNumber()) || !kslide.isSlideMode()) {
            kslide.sendEvent(self, {"type": "NEXT_SLIDE"});
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
                kslide.sendEvent(self, {"type": "NEXT_SLIDE"});
            }
        }
    }

    function back() {
        if (!kslide.hasInnerNavigation(kslide.getCurrentSlideNumber()) || !kslide.isSlideMode()) {
            kslide.sendEvent(self, {"type": "PREVIOUS_SLIDE"});
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
                kslide.sendEvent(self, {"type": "PREVIOUS_SLIDE"});
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
        if (slideNumber === undefined || slideNumber < 0 || slideNumber > kslide.getLength || !kslide.isSlideMode()) {
            return;
        }
        if (kslide.hasInnerNavigation(slideNumber)) {

            var innerNodes = jQuery(kslide.getSlide(kslide.getCurrentSlideNumber()).slide).find('.next');
            for (var i = 0, ii = innerNodes.length; i < ii; i++) {
                var indexOf = innerNodes[i].className.indexOf("active");
                if (indexOf != -1) {
                    innerNodes[i].className = innerNodes[i].className.substring(0, indexOf) + innerNodes[i].className.substring(indexOf + " active".length);
                    try {
                        jQuery(innerNodes[i]).trigger('notActive');
                        jQuery(innerNodes[i]).trigger('notCurrentActive');
                    } catch (e) {
                    }
                }
            }
            innerNodes[0].className = innerNodes[0].className + ' active';
            try {
                // create event to trigger listener that can manage animations on the appearing elements
                jQuery(innerNodes[0]).trigger('active');
                jQuery(innerNodes[0]).trigger('currentActive');
            } catch (e) {
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
                if (activeNodes[i].className.indexOf("active") == -1) {
                    activeNodes[i].className = activeNodes[i].className + " active";
                }
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