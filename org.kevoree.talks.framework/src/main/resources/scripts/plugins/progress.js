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

    jQuery(document.body).on("RUN", start);
    jQuery(document.body).on("SET_SLIDE", update);
    jQuery(document.body).on("PREVIOUS_SLIDE", update);
    jQuery(document.body).on("START", update);
    jQuery(document.body).on("END", update);
    jQuery(document.body).on("SLIDE", update);


    function update (message) {
        if (kslide.isSlideMode() || message.type == "SLIDE") {
            updateProgress(message.slideNumber);
        }
    }

    function start () {
//        console.log("starting progress plugin");
        jQuery(document.body).append("<div class='progress'><div></div></div>");
        progress = jQuery('div.progress div').get(0);
        updateProgress(kslide.getCurrentSlideNumber());
    }

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