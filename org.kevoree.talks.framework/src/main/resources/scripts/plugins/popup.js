/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 14:08
 */

function KPopupSlave(kslide) {
    var self = this;
    var api = new KSlideShowKeynoteAPI();

    jQuery(document.body).on("INITIALIZE", function () {
        if (window.opener != null) {
            window.addEventListener('message', manageMessage, false);
        }
        jQuery(document.body).trigger("INITIALIZED");
    });
    // TODO INITIALIZE => master send the list of events I must forward to it

    jQuery(document.body).on("RUN", function () {
        window.opener.postMessage(JSON.stringify({type: "INITIALIZED"}), '*');
    });

    jQuery(document.body).on("START END SET_SLIDE FORWARD BACK", toForward);

    function toForward(message) {
        jQuery(document.body).off("START END SET_SLIDE FORWARD BACK", toForward);
        window.opener.postMessage(api.stringify(message), '*');
        jQuery(document.body).on("START END SET_SLIDE FORWARD BACK", toForward);
    }

    function manageMessage(event) {
        if (event.source === window.opener) {
            var message = JSON.parse(event.data);
            jQuery(document.body).off("START END SET_SLIDE FORWARD BACK", toForward);
            jQuery(document.body).trigger(message);
            jQuery(document.body).on("START END SET_SLIDE FORWARD BACK", toForward);
        }
    }
}

function KPopupMaster(kslideKeynote, slideUrl) {

    var self = this;
    var popup = null;
    var api = new KSlideShowKeynoteAPI();

    // allow to close the popup when the window is unload
    function unload() {
        if (popup != null) {
            popup.close();
            popup = null;
        }
    }

    function createPopup() {
        unload();
        window.addEventListener('message', manageMessage);
        popup = window.open(slideUrl + "popup", 'slides', 'width=784px,height=569px,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    }

    jQuery(document.body).on("RUN", function () {
        window.addEventListener('unload', unload, false);
        var element = jQuery('#popup-button');
        element.on("touchstart", createPopup);
        element.click(createPopup);
        jQuery(document.body).on("START END SET_SLIDE FORWARD BACK", onReceivedEvents);
    });

    function onReceivedEvents(message) {
        if (popup != null) {
            popup.postMessage(api.stringify(message), '*');
        }
    }

    function manageMessage(event) {
        if (event.source === popup) {
            var message = JSON.parse(event.data);
            if (message.type === "INITIALIZED") {
                popup.postMessage(JSON.stringify({type: "SLIDE"}), '*');
                popup.postMessage(JSON.stringify({type: "SET_SLIDE", slideNumber: kslideKeynote.getCurrentSlideNumber(), previsouSlideNumber: kslideKeynote.getCurrentSlideNumber() - 1}), '*');
            } else {
                jQuery(document.body).off("START END SET_SLIDE FORWARD BACK", onReceivedEvents);
                jQuery(document.body).trigger(message);
                jQuery(document.body).on("START END SET_SLIDE FORWARD BACK", onReceivedEvents);
            }
        }
    }
}