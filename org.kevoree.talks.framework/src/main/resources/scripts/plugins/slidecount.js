/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 08/09/12
 * Time: 13:15
 */
function KSlideCountSlave(kslide) {
    var self = this;
    jQuery(document.body).on("RUN", function () {
        jQuery(document.body).on("SET_SLIDE", function (message) {
            if (message.slideNumber < kslide.getLength() && message.slideNumber >= 0) {
                jQuery(document.body).trigger({type: "POSITION", position: message.slideNumber});
            }
        });
        jQuery(document.body).on("START", function () {
            jQuery(document.body).trigger({type: "POSITION", position: 0});
        });
        jQuery(document.body).on("END", function () {
            jQuery(document.body).trigger({type: "POSITION", position: kslide.getLength() - 1});
        });
        jQuery(document.body).on("GET_LENGTH", function () {
            jQuery(document.body).trigger({type: "LENGTH", length: kslide.getLength()});
        });
        jQuery(document.body).on("GET_POSITION", function () {
            jQuery(document.body).trigger({type: "POSITION", position: kslide.getCurrentSlideNumber()});
        });
    });

}
function KSlideCountMaster(kslideKeynote) {
    var self = this;

    jQuery(document.body).on("RUN", function () {
        jQuery(document.body).on("LENGTH", function (message) {
            if (message.length != undefined && message.length != null) {
                jQuery("#slidecount").html(message.length);
            }
        });
        jQuery(document.body).on("POSITION", function (message) {
            if (message.position != undefined && message.position != null) {
                jQuery('#slideidx').html(+message.position + 1);
                jQuery('#nextslideidx').html(+message.position == (+(jQuery("#slidecount").html()) - 1) ? "END" : (+message.position + 2));
            }
        });
        jQuery(document.body).trigger({type: "GET_LENGTH"});
        jQuery(document.body).trigger({type: "GET_POSITION"});
        var element = jQuery('#slideidx');
        element.click(setCursor);
        element.on("touchstart", setCursor);
    });


    function setCursor() {
        jQuery(document.body).trigger({type: "SET_SLIDE", slideNumber: +prompt('Go to slide...', '1') - 1, previousSlideNumber : kslideKeynote.getCurrentSlideNumber()});
    }
}
