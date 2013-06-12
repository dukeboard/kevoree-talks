/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 08/09/12
 * Time: 13:32
 */
function KNotesSlave(kslide) {
    var self = this;
    jQuery(document.body).on("RUN", function () {
        jQuery(document.body).on("SET_SLIDE", function (message) {
            if (message.slideNumber < kslide.getLength() && message.slideNumber >= 0) {
                jQuery(document.body).trigger({type : "NOTES", notes: getDetails(message.slideNumber)});
            }
        });
        jQuery(document.body).on("START", function () {
            jQuery(document.body).trigger({type : "NOTES", notes: getDetails(0)});
        });
        jQuery(document.body).on("END", function () {
            jQuery(document.body).trigger({type : "NOTES", notes: getDetails(kslide.getLength() - 1)});
        });
        jQuery(document.body).on("GET_NOTES", function () {
            jQuery(document.body).trigger({type : "NOTES", notes: getDetails(kslide.getCurrentSlideNumber())});
        });
    });

    function getDetails(slideNumber) {
        if (kslide.isSlideMode()) {
            if (slideNumber <= kslide.getLength()) {
                var slide = kslide.getSlide(slideNumber);
                if (slide) {
                    return jQuery(slide).find("details").html();
                }
            }
        }
        return "";
    }
}

function KNotesMaster() {
    jQuery(document.body).on("RUN", function () {
        jQuery(document.body).on("NOTES", function (message) {
            if (message.notes != undefined && message.notes != null) {
                jQuery("#notes").find("> #content").html(message.notes)
            } else {
                jQuery("#notes").find("> #content").html("")
            }
        });

        jQuery(document.body).trigger({type : "GET_NOTES"});
    });
}
