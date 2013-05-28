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

    this.listener = function (message) {
        if (kslide.isSlideMode()) {
            updateProgress(kslide.getCurrentSlideNumber());
        }
    };

    this.initialize = function () {
    };

    this.start = function () {
        progress = jQuery('div.progress div').get(0);
        updateProgress(kslide.getCurrentSlideNumber());
    };

    function updateProgress(slideNumber) {
        if (null === progress || slideNumber === -1) {
            return;
        }
        var slide = kslide.getSlide(kslide.getCurrentSlideNumber()).slide;
        if (slide && slide.className.indexOf("cover") == -1 && slide.className.indexOf("shout") == -1) {
            progress.style.width = (100 / (kslide.getLength().length - 1) * normalizeSlideNumber(slideNumber)).toFixed(2) + '%';
            progress.style.visibility = "visible";
        } else {
            progress.style.visibility = "hidden";
        }
    }

    function normalizeSlideNumber(slideNumber) {
        if (0 > slideNumber) {
            return kslide.getLength().length - 1;
        } else if (kslide.getLength().length <= slideNumber) {
            return 0;
        } else {
            return slideNumber;
        }
    }
}