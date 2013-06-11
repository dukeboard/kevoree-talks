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

    jQuery(document.body).on("FORWARD", function () {
        forward();
    });
    jQuery(document.body).on("BACK", function () {
        back();
    });
    jQuery(document.body).on("SET_SLIDE", function (message) {
        if (message.slideNumber >= 0 && message.slideNumber < kslide.getLength()) {
            if (message.slideNumber < message.previousSlideNumber) {
                rollbackInnerTransition(message.slideNumber);
                rollbackCollapseTransition(message.slideNumber);
            } else {
                initializeInnerTransition(message.slideNumber);
                initializeCollapseTransition(message.slideNumber);
            }
        }
    });
    jQuery(document.body).on("SET_CURSOR", function (message) {
        initializeInnerTransition(message.cursor);
        initializeCollapseTransition(message.cursor);
    });

    jQuery(document.body).on("LIST", function (message) {
        // TODO what did we need to do ?
    });
    jQuery(document.body).on("SLIDE", function (message) {
        // TODO what did we need to do ?
    });

    jQuery(document.body).on("RUN", function () {
        self.start();
    });

    this.start = function () {
//        console.log("Starting active plugin");
        initializeInnerTransition(kslide.getCurrentSlideNumber());
    };

    function forward() {
        var currentSlideNumber = kslide.getCurrentSlideNumber();
        if (!kslide.hasInnerNavigation(currentSlideNumber) || !kslide.isSlideMode()) {
            jQuery(document.body).trigger({"type": "SET_SLIDE", "slideNumber": currentSlideNumber + 1, "previousSlideNumber": currentSlideNumber});
        } else {
            var newInner = getNextInner(currentSlideNumber);
            if (newInner) {
                var activeInners = getActiveInners(currentSlideNumber);
                // set the new Inner as active
                jQuery(newInner).addClass("active");

                // create event to trigger listener that can manage animations on the appearing elements
                jQuery(activeInners[activeInners.length -1]).trigger('notCurrentActive');
                jQuery(newInner).trigger('active');
                jQuery(newInner).trigger('currentActive');

                // manage collapse element
                for (var i = activeInners.length - 1; i >= 0; i--) {
                    if (jQuery(activeInners[i]).hasClass("collapse") && (!isParentInner(activeInners[i], newInner) && newInner != activeInners[i])) {
                        jQuery(activeInners[i]).addClass("collapsed");
                    }
                }
            } else {
                jQuery(document.body).trigger({"type": "SET_SLIDE", "slideNumber": currentSlideNumber + 1, "previousSlideNumber": currentSlideNumber});
            }
        }
    }

    function back() {
        var currentSlideNumber = kslide.getCurrentSlideNumber();
        if (!kslide.hasInnerNavigation(currentSlideNumber) || !kslide.isSlideMode()) {
            jQuery(document.body).trigger({"type": "SET_SLIDE", "slideNumber": currentSlideNumber - 1, "previousSlideNumber": currentSlideNumber});
        } else {
            var activeInners = getActiveInners(currentSlideNumber);
            var activeInner = activeInners[activeInners.length - 1];
            if (activeInners.length > 1 && activeInner) {
                jQuery(activeInner).removeClass("active");

                activeInners = getActiveInners(currentSlideNumber);
                jQuery(activeInner).trigger('notActive');
                jQuery(activeInner).trigger('notCurrentActive');
                jQuery(activeInners[activeInners.length - 1]).trigger('currentActive');

                // manage collapse element
                activeInner = activeInners[activeInners.length - 1];
                for (var i = activeInners.length - 1; i >= 0; i--) {
                    if (jQuery(activeInners[i]).hasClass("collapse") && (isParentInner(activeInners[i], activeInner) || activeInner == activeInners[i])) {
                        jQuery(activeInners[i]).removeClass("collapsed");
                    }
                }
            } else {
                jQuery(document.body).trigger({"type": "SET_SLIDE", "slideNumber": currentSlideNumber - 1, "previousSlideNumber": currentSlideNumber});
            }
        }
    }

    function isParentInner(parent, potentialChild) {
        var childs = jQuery(parent).find("*");
        for (var i = 0; i < childs.length; i++) {
            if (childs[i] == potentialChild) {
                return true;
            }
        }
        return false;
    }

    function getActiveInners(slideNumber) {
        return jQuery(kslide.getSlide(slideNumber)).find('.next.active');
    }

    function getNextInner(slideNumber) {
        var slide = kslide.getSlide(slideNumber);
        var inners = jQuery(slide).find('.next');
        var activeInners = jQuery(slide).find('.next.active');
        return inners[activeInners.length];
    }

    function getInners(slideNumber) {
        var slide = kslide.getSlide(slideNumber);
        return jQuery(slide).find('.next');
    }

    function initializeInnerTransition(slideNumber) {
        if (slideNumber === undefined || slideNumber < 0 || slideNumber > kslide.getLength() || !kslide.isSlideMode()) {
            return;
        }
        if (kslide.hasInnerNavigation(slideNumber)) {
            var innerElements = getInners(slideNumber);
            if (innerElements.length > 0) {
                jQuery.each(innerElements, function (index, element) {
                    jQuery(element).removeClass("active");
                    jQuery(element).trigger('notActive');
                    jQuery(element).trigger('notCurrentActive');
                });
                jQuery(innerElements[0]).addClass("active");
                // create event to trigger listener that can manage animations on the appearing elements
                jQuery(innerElements[0]).trigger('active');
                jQuery(innerElements[0]).trigger('currentActive');
            }
        }
    }

    function rollbackInnerTransition(slideNumber) {
        if (!kslide.isSlideMode()) {
            return;
        }
        // update new current slide according to innerTransition (all the inner must be displayed)
        if (kslide.hasInnerNavigation(slideNumber)) {
            var innerElements = getInners(slideNumber);
            jQuery.each(innerElements, function (index, element) {
                jQuery(element).addClass("active");
                jQuery(element).trigger('active');
                jQuery(element).trigger('notCurrentActive');
            });
            jQuery(innerElements[innerElements.length - 1]).addClass("active");
            jQuery(innerElements[innerElements.length - 1]).trigger('active');
            jQuery(innerElements[innerElements.length - 1]).trigger('currentActive');
        }
    }

    function initializeCollapseTransition(slideNumber) {
        if (slideNumber === undefined || slideNumber < 0 || slideNumber >= kslide.getLength() || !kslide.isSlideMode()) {
            return;
        }
        if (kslide.hasInnerNavigation(slideNumber)) {
            var innerNodes = jQuery(kslide.getSlide(slideNumber)).find('.collapse');
            for (var i = 0, ii = innerNodes.length; i < ii; i++) {
                jQuery(innerNodes[i]).removeClass("collapsed");
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
                    jQuery(collapseInners[i]).addClass("collapsed");
                }
                var activeInners = jQuery(kslide.getSlide(slideNumber)).find('.next.active');
                if (activeInners[activeInners.length - 1] != collapseInners[collapseInners.length - 1]) {
                    jQuery(collapseInners[collapseInners.length - 1]).addClass("collapsed");
                }
            }
        }
    }
}