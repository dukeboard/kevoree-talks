/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 28/05/13
 * Time: 10:29
 *
 * @author Erwan Daubert
 * @version 1.0
 */

function SlidePlugin(kslide) {

    var self = this;

    this.listener = function (message) {
//        console.log(message);
        if (message.type === "NEXT_SLIDE") {
            if (kslide.getCurrentSlideNumber() < 0 || kslide.getCurrentSlideNumber() > kslide.getLength().length) {
                goToSlide(0);
            } else {
                goToNextSlide(kslide.getCurrentSlideNumber());
            }
        } else if (message.type === "PREVIOUS_SLIDE") {
            if (kslide.getCurrentSlideNumber() < 0 || kslide.getCurrentSlideNumber() > kslide.getLength().length) {
                goToSlide(0);
            } else {
                goToPreviousSlide(kslide.getCurrentSlideNumber());
            }
        } else if (message.type === "START") {
            goToStart();
        } else if (message.type === "END") {
            goToEnd();
        } else if (message.type === "SET_CURSOR") {
            goToSlide(message.cursor);
        } else if (message.type === "SLIDE") {
            goToSlideMode();
        } else if (message.type === "LIST") {
            goToListMode();
        } else if (message.type === "SET_ID") {
            kslide.url.hash = message.id;
        }
    };

    this.initialize = function () {
    };

    this.start = function () {
        if (kslide.isSlideMode()) {
            goToSlideMode();
        } else {
            goToListMode();
        }
    };

    function goToSlideMode() {
        // there is no slide selected, we select the first one
        if (-1 === kslide.getCurrentSlideNumber()) {
            kslide.url.hash = kslide.getSlideHash(0);
            history.replaceState(null, null, kslide.buildURL(true, kslide.url.pathname, 0));
            /* + '?slide' + kslide.getSlideHash(0)*/
        } else {
            history.replaceState(null, null, kslide.buildURL(true, kslide.url.pathname, kslide.getCurrentSlideNumber()));
            /*kslide.url.pathname + '?slide' + kslide.getSlideHash(kslide.getCurrentSlideNumber())*/
        }
//        initializeInnerTransition(getCurrentSlideNumber());
//        initializeCollapseTransition(getCurrentSlideNumber());
        enterSlideMode();
//        updateProgress(getCurrentSlideNumber());
    }

    function goToListMode() {
        if (kslide.getCurrentSlideNumber() === -1) {
            history.pushState(null, null, kslide.url.pathname);
        } else {
            history.pushState(null, null, kslide.url.pathname + kslide.getSlideHash(kslide.getCurrentSlideNumber()));
        }
        enterListMode();
        scrollToCurrentSlide();
    }

    function enterSlideMode() {
        kslide.body.className = 'slideMode';
        kslide.applyTransform(kslide.getTransform());
        jQuery(kslide.body).trigger('slide');
    }

    function enterListMode() {
        kslide.body.className = 'list';
        kslide.applyTransform('none');
        jQuery(kslide.body).trigger('list');
    }

    function goToNextSlide(slideNumber) {
        if (slideNumber === -1) {
            // do nothing if slideNumber is wrong
            return slideNumber;
        }
        // there is no inner navigation or it is not the slideshow view so we just go back to the next slide
//        if (!kslide.hasInnerNavigation(slideNumber) || kslide.url.toString().indexOf("?full#") == -1) {
        // do nothing if slideNumber is larger than the number of slides
        if (slideNumber + 1 == kslide.getLength().length) {
//                return -1;
            return -1;
        }
        slideNumber++;
//            initializeInnerTransition(slideNumber);
//            initializeCollapseTransition(slideNumber);
        goToSlide(slideNumber);
        return slideNumber;
//        }
        /* else {
         var newInner = getNextInner(slideNumber);
         if (newInner) {
         newInner.className = newInner.className + ' active';

         var activeInners = getActiveInners(slideNumber);
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
         return slideNumber;
         } else {
         // there is no next inactive inner item so we just go to the next slide
         slideNumber++;
         initializeInnerTransition(slideNumber);
         initializeCollapseTransition(slideNumber);
         goToSlide(slideNumber);
         return slideNumber;
         }
         }*/
    }

    function goToPreviousSlide(slideNumber) {
        // there is no inner navigation or it is not the slideshow view so we just go back to the previous slide
//        if (!kslide.hasInnerNavigation(slideNumber) || kslide.url.toString().indexOf("?slide#") == -1) {
        // do nothing if slideNumber is smaller than 0
        if (slideNumber == 0) {
//                return -1;
            return;
        }
        slideNumber--;
//            rollbackInnerTransition(slideNumber);
//            rollbackCollapseTransition(slideNumber);
        goToSlide(slideNumber);
//        }
        /* else {
         var activeInners = getActiveInners(slideNumber);
         var activeInner = activeInners[activeInners.length - 1];
         if (activeInners.length > 1 && activeInner) {
         var indexOf = activeInner.className.indexOf(" active");
         activeInner.className = activeInner.className.substring(0, indexOf) + activeInner.className.substring(indexOf + " active".length);

         activeInners = getActiveInners(slideNumber);
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
         return slideNumber;
         } else {
         // there is no previous active inner item so we just go back to the previous slide
         slideNumber--;
         rollbackInnerTransition(slideNumber);
         rollbackCollapseTransition(slideNumber);
         goToSlide(slideNumber);
         return slideNumber
         }
         }*/
    }

    function goToSlide(slideNumber) {
        if (-1 == slideNumber || slideNumber >= kslide.length) {
            return;
        }
        kslide.url.hash = kslide.getSlideHash(slideNumber);
        /*if (!isListMode()) {
         updateProgress(slideNumber);
         }*/
    }

    function goToStart() {
//        initializeInnerTransition(0);
//        initializeCollapseTransition(0);
        goToSlide(0);
    }

    function goToEnd() {
//        rollbackInnerTransition(slideList.length - 1);
//        rollbackCollapseTransition(slideList.length - 1);
        goToSlide(kslide.getLength().length - 1);
    }

    /*function getDetails(slideNumber) {
     if (document.body.className == "full") {
     if (slideNumber <= slides.length) {
     var slide = slides[slideNumber];
     var d;
     if (slide) {
     d = slide.querySelector("details");
     }
     }
     return d ? d.innerHTML : "";
     } else {
     return "";
     }
     }*/

    /*function fullscreen() {
     */
    /* On Firefox + slide as cover  unable to switch to next slide.
     * You need to go to fullscreen, try to go to next slide, then go back to the previous slide and then the slides work fine.
     * */
    /*

     if (screenfull) {
     screenfull.request();
     }
     }*/

    function scrollToCurrentSlide() {
        // do nothing if currentSlideNumber is unknown (-1)
        if (-1 === kslide.getCurrentSlideNumber()) {
            return;
        }
        var currentSlide = jQuery("#" + kslide.getSlide(kslide.getCurrentSlideNumber()).slide.id).get(0);

        if (null != currentSlide) {
            window.scrollTo(0, currentSlide.offsetTop);
        }
    }
}