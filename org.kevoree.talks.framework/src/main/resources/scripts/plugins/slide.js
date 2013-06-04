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

    jQuery(kslide.getBody()).on("RUN", function () {
        jQuery(kslide.getBody()).on("SET_SLIDE", function (event) {
            if (event.slideNumber === undefined || event.slideNumber < 0 || event.slideNumber > kslide.getLength().length) {
                goToSlide(0);
            } else {
                goToSlide(event.slideNumber);
            }
        });

//        jQuery(kslide.getBody()).on("PREVIOUS_SLIDE", function () {
//            if (kslide.getCurrentSlideNumber() < 0 || kslide.getCurrentSlideNumber() > kslide.getLength().length) {
//                goToSlide(0);
//            } else {
//                goToPreviousSlide(kslide.getCurrentSlideNumber());
//            }
//        });

        jQuery(kslide.getBody()).on("START", goToStart);

        jQuery(kslide.getBody()).on("END", goToEnd);

        jQuery(kslide.getBody()).on("SET_CURSOR", function (event) {
            goToSlide(event.cursor)
        });

        jQuery(kslide.getBody()).on("SLIDE",goToSlideMode);

        jQuery(kslide.getBody()).on("LIST", goToListMode);

        jQuery(kslide.getBody()).on("SET_ID", function (event) {
            kslide.getUrl().hash = event.id;
        });
        jQuery(window).resize(function () {
            if (kslide.isSlideMode()) {
                kslide.applyTransform(self.getTransform());
            }
        });

        if (kslide.isSlideMode()) {
            goToSlideMode();
        } else {
            goToListMode();
        }
    });

    function goToSlideMode() {
        // there is no slide selected, we select the first one
        if (-1 === kslide.getCurrentSlideNumber()) {
            kslide.getUrl().hash = kslide.getSlideHash(0);
            history.replaceState(null, null, kslide.buildURL(true, kslide.getUrl().pathname, 0));
            /* + '?slide' + kslide.getSlideHash(0)*/
        } else {
            history.replaceState(null, null, kslide.buildURL(true, kslide.getUrl().pathname, kslide.getCurrentSlideNumber()));
            /*kslide.getUrl().pathname + '?slide' + kslide.getSlideHash(kslide.getCurrentSlideNumber())*/
        }
//        initializeInnerTransition(getCurrentSlideNumber());
//        initializeCollapseTransition(getCurrentSlideNumber());
        enterSlideMode();
//        updateProgress(getCurrentSlideNumber());
    }

    function goToListMode() {
        if (kslide.getCurrentSlideNumber() === -1) {
            history.pushState(null, null, kslide.getUrl().pathname);
        } else {
            history.pushState(null, null, kslide.getUrl().pathname + kslide.getSlideHash(kslide.getCurrentSlideNumber()));
        }
        enterListMode();
        scrollToCurrentSlide();
    }

    function enterSlideMode() {
        kslide.getBody().className = 'slideMode';
        kslide.applyTransform(kslide.getTransform());
//        jQuery(kslide.getBody()).trigger('SLIDE');
    }

    function enterListMode() {
        kslide.getBody().className = 'list';
        kslide.applyTransform('none');
        jQuery(kslide.getBody()).trigger('list');
    }

    function goToNextSlide(slideNumber) {
        if (slideNumber === -1) {
            // do nothing if slideNumber is wrong
            return slideNumber;
        }
        // there is no inner navigation or it is not the slideshow view so we just go back to the next slide
//        if (!kslide.hasInnerNavigation(slideNumber) || kslide.getUrl().toString().indexOf("?full#") == -1) {
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
    }

    function goToPreviousSlide(slideNumber) {
        // there is no inner navigation or it is not the slideshow view so we just go back to the previous slide
//        if (!kslide.hasInnerNavigation(slideNumber) || kslide.getUrl().toString().indexOf("?slide#") == -1) {
        // do nothing if slideNumber is smaller than 0
        if (slideNumber == 0) {
            return;
        }
        slideNumber--;
        goToSlide(slideNumber);
    }

    function goToSlide(slideNumber) {
        if (-1 == slideNumber || slideNumber >= kslide.length) {
            return;
        }
        kslide.getUrl().hash = kslide.getSlideHash(slideNumber);
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