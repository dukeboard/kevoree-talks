/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 28/05/13
 * Time: 14:40
 *
 * @author Erwan Daubert
 * @version 1.0
 */

function ProgressPlugin(kslide) {

    var self = this;
    var progress = null;

    jQuery(document.body).on("RUN", function () {
//        console.log("starting progress plugin");
        jQuery(document.body).append("<div class='progress'><div></div></div>");
        progress = jQuery('div.progress div').get(0);
        updateProgress(kslide.getCurrentSlideNumber());
        jQuery(document.body).on("SET_SLIDE", function (message) {
            if (kslide.isSlideMode()) {
                updateProgress(message.slideNumber);
            }
        });
        jQuery(document.body).on("SET_POSITION", function (message) {
            if (kslide.isSlideMode()) {
                updateProgress(message.position);
            }
        });
        jQuery(document.body).on("START", function () {
            if (kslide.isSlideMode()) {
                updateProgress(0);
            }
        });
        jQuery(document.body).on("END", function () {
            if (kslide.isSlideMode()) {
                updateProgress(kslide.getLength());
            }
        });
        jQuery(document.body).on("SLIDE", function () {
            if (kslide.isSlideMode()) {
                updateProgress(kslide.getCurrentSlideNumber());
            }
        });
    });



    function updateProgress(slideNumber) {
        if (null === progress || slideNumber === -1) {
            return;
        }
        var slide = kslide.getSlide(slideNumber);
        if (slide && !jQuery(slide).hasClass("cover") && !jQuery(slide).hasClass("shout")) {
            progress.style.width = (100 / (kslide.getLength() - 1) * normalizeSlideNumber(slideNumber)).toFixed(2) + '%';
            progress.style.visibility = "visible";
        } else {
            progress.style.visibility = "hidden";
        }
    }

    function normalizeSlideNumber(slideNumber) {
        if (0 > slideNumber) {
            return kslide.getLength() - 1;
        } else if (kslide.getLength() <= slideNumber) {
            return 0;
        } else {
            return slideNumber;
        }
    }
}