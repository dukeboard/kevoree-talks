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

    jQuery(document.body).on("RUN", function () {
//        console.log("starting slide plugin");
        jQuery(document.body).on("SET_SLIDE", function (event) {
            // we do nothing if the current slide is the last one
            if (event.slideNumber === undefined || event.slideNumber < 0) {
                goToSlide(0);
            } else if (event.slideNumber < kslide.getLength()) {
                goToSlide(event.slideNumber);
            }
        });

        jQuery(document.body).on("START", goToStart);

        jQuery(document.body).on("END", goToEnd);

        jQuery(document.body).on("SET_CURSOR", function (event) {
            goToSlide(event.cursor)
        });

        jQuery(document.body).on("SLIDE",goToSlideMode);

        jQuery(document.body).on("LIST", goToListMode);

        jQuery(window).resize(function () {
            if (kslide.isSlideMode()) {
                kslide.applyTransform(kslide.getTransform());
            }
        });

        if (kslide.isSlideMode()) {
            goToSlideMode();
        } else {
            goToListMode();
        }
    });

    function goToSlideMode() {
        var slideNumber = kslide.getCurrentSlideNumber();
        // there is no slide selected, we select the first one
        if (-1 === slideNumber) {
            kslide.getUrl().hash = kslide.getSlideHash(0);
            history.replaceState(null, null, kslide.buildURL(true, kslide.getUrl().pathname, 0));
        } else {
            history.replaceState(null, null, kslide.buildURL(true, kslide.getUrl().pathname, slideNumber));
        }
        enterSlideMode();
    }

    function goToListMode() {
        var slideNumber = kslide.getCurrentSlideNumber();
        if (slideNumber === -1) {
            history.pushState(null, null, kslide.getUrl().pathname);
        } else {
            history.pushState(null, null, kslide.getUrl().pathname + kslide.getSlideHash(slideNumber));
        }
        enterListMode();
        scrollToSlide(slideNumber);
    }

    function enterSlideMode() {
        jQuery(document.body).removeClass('list');
        jQuery(document.body).addClass('slideMode');
        kslide.applyTransform(kslide.getTransform());
    }

    function enterListMode() {
        jQuery(document.body).removeClass('slideMode');
        jQuery(document.body).addClass('list');
        kslide.applyTransform('none');
        jQuery(document.body).trigger('list');
    }

    function goToSlide(slideNumber) {
        if (-1 == slideNumber || slideNumber >= kslide.length) {
            return;
        }
        kslide.getUrl().hash = kslide.getSlideHash(slideNumber);
    }

    function goToStart() {
        goToSlide(0);
    }

    function goToEnd() {
        goToSlide(kslide.getLength() - 1);
    }

    function scrollToSlide(slideNumber) {
        // do nothing if currentSlideNumber is unknown (-1)
        if (-1 === slideNumber) {
            return;
        }
        var currentSlide = jQuery("#" + kslide.getSlide(slideNumber).id).get(0);

        if (null != currentSlide) {
            window.scrollTo(0, currentSlide.offsetTop);
        }
    }
}