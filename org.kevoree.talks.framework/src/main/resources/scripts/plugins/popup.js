/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 14:08
 */

function KPopupSlave (kslide) {
    var self = this;

    this.listener = function (message) {
        if (window.opener != null && message.type != "LIST" && message.type != "FULL") {
            window.opener.postMessage(JSON.stringify(message), "*");
        }
    };

    this.start = function () {
        if (window.opener != null) {
            window.addEventListener('message', manageMessage, false);
            kslide.sendEvent(self, {"type":"FULL"});
            var response = kslide.getCursor();
            if (response.type === "CURSOR") {
                window.opener.postMessage(JSON.stringify({"type":"SET_CURSOR", "cursor":response.cursor}), "*");
            }
        }
    };

    function manageMessage (event) {
        var message = JSON.parse(event.data);
        if (event.source === window.opener) {
            kslide.sendEvent(self, message);
        }
    }
}

function KPopupMaster (kslide, slideUrl) {

    var self = this;
    var popup = null;

    this.listener = function (message) {
        if (popup != null) {
            popup.postMessage(JSON.stringify(message), '*');
        }
    };

    // allow to close the popup when the window is unload
    function unload () {
        if (popup != null) {
            popup.close();
            window.removeEventListener('message', manageMessage, false);
        }
    }

    function createPopup () {
        unload();
        window.addEventListener('message', manageMessage, false);
        popup = window.open(slideUrl + "popup", 'slides', 'width=784px,height=569px,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    }

    function manageMessage (event) {
        var message = JSON.parse(event.data);
        if (popup != null && event.source === popup) {
            kslide.sendEvent(self, message);
        }
    }

    this.start = function () {
        window.addEventListener('unload', unload, false);
        document.querySelector('#popup-button').addEventListener("touchstart", createPopup, false);
        document.querySelector('#popup-button').addEventListener("click", createPopup, false);
    };
}