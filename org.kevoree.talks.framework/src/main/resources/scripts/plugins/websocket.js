/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 13:40
 */

function KWebsocketSlave(kslide, wsUrl, roomID) {
    var ws = null;
    var self = this;

    jQuery(document.body).on("RUN", function () {
        try {
            if (wsUrl !== "{wsurl}") {
                ws = new WebSocket(wsUrl);
                ws.onopen = function (e) {
                    console.log('* Connected!');
                    ws.send(JSON.stringify({"type": "JOIN", "id": roomID}));
                    document.addEventListener('keydown', newKeyEventListener, false);
                    jQuery(document.body).trigger({type: "SLIDE"});
                };
                ws.onclose = function (e) {
                    console.log('* Disconnected');
                };
                ws.onerror = function (e) {
                    console.log('* Unexpected error');
                };
                ws.onmessage = manageMessage
            }
        } catch (e) {
            console.error("Unable to initialize the web socket");
        }
    });


    function newKeyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }
        switch (e.which) {
            case 70: // f
                e.preventDefault();
                jQuery(document.body).trigger({type: "FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }


    function manageMessage(event) {
        var message = JSON.parse(event.data);
        jQuery(document.body).trigger(message);
    }
}

function KWebsocketMaster(kslideKeynote, wsUrl, roomID) {
    var ws = null;
    var self = this;
    var api = new KSlideShowKeynoteAPI();

    jQuery(document.body).on("RUN", function () {
        if (wsUrl != undefined && roomID === undefined) {
            var element = jQuery('#keynote-button');
            element.on("touchstart", connectWS);
            element.click(connectWS);
        } else if (wsUrl != undefined && roomID != null) {
            connectWS();
        }
    });

    jQuery(document.body).on("START END FORWARD BACK SET_SLIDE", function (message) {
        if (ws != null) {
            ws.send(api.stringify(message));
        }
    });
    /*jQuery(document.body).on("POSITION", function (message) {
     currentSlide = message.position;
     });*/

    function connectWS() {
        try {
            if (roomID === undefined) {
                roomID = window.prompt("Keynote id: ");
            }
            if (roomID !== null) {
                ws = new WebSocket(wsUrl);
                ws.onopen = function () {
                    console.log('* Connected!');
                    ws.send(JSON.stringify({"type": "JOIN", "id": roomID}));
                    jQuery(document.body).trigger({type: "SET_SLIDE", slideNumber: kslideKeynote.getCurrentSlideNumber(), previousSlideNumber: -1});
                    ws.send(JSON.stringify({type: "SET_SLIDE", slideNumber: kslideKeynote.getCurrentSlideNumber(), previousSlideNumber: -1}));
                    var slideurl = document.URL.replace("keynote", "slave");
                    if (slideurl.indexOf(roomID) == slideurl.length - roomID.length) {
                        slideurl = slideurl.substring(0, slideurl.length - roomID.length)
                    }
                    alert(slideurl + roomID)
                };
                ws.onclose = function () {
                    console.log('* Disconnected');
                };
                ws.onerror = function () {
                    console.log('* Unexpected error');
                };
                ws.onmessage = function () {
                    // we do nothing when the master receive messages
                };
            }
        } catch (e) {
        }
    }

    function disconnectWS() {
        if (ws != null) {
            ws.close();
        }
    }
}