/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 13:40
 */

function KWebsocketSlave (kslide, wsUrl, roomID) {
    var ws = null;
    var self = this;

    this.start = function () {
        try {
            if (wsUrl !== "{wsurl}") {
                ws = new WebSocket(wsUrl);
                ws.onopen = function (e) {
                    console.log('* Connected!');
                    ws.send(JSON.stringify({"type":"JOIN", "id":roomID}));
                    document.addEventListener('keydown', newKeyEventListener, false);
                };
                ws.onclose = function (e) {
                    console.log('* Disconnected');
                };
                ws.onerror = function (e) {
                    console.log('* Unexpected error');
                };
                ws.onmessage = function (e) {
                    manageMessage(e.data);
                };
            }
        } catch (e) {
            console.error("Unable to initialize the web socket");
        }
        if (ws != null) {
            kslide.sendEvent(self, {"type":"FULL"});
        }
    };

    this.listener = function (message) {
    };


    function newKeyEventListener (e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }
        switch (e.which) {
            case 70: // f
                e.preventDefault();
                kslide.sendEvent(self, {"type":"FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }


    function manageMessage (messageString) {
        kslide.sendEvent(self, JSON.parse(messageString));
    }
}

function KWebsocketMaster (kslide, wsUrl) {
    var ws = null;
    var self = this;
    var currentSlide = null;

    this.start = function () {
        if (wsUrl !== "{wsurl}") {
            document.querySelector('#keynote-button').addEventListener("touchstart", connectWS, false);
            document.querySelector('#keynote-button').addEventListener("click", connectWS, false);
        }
    };

    this.listener = function (message) {
        try {
            if (ws !== null) {
                if (message.type === "BACK" || message.type === "FORWARD" || message.type === "START" || message.type === "END" || message.type === "SET_CURSOR") {
                    ws.send(JSON.stringify(message));
                }
            } else if (message.type === "CURSOR") {
                currentSlide = message.cursor;
            }
        } catch (e) {
        }
    };

    function connectWS () {
        try {
            var roomId = window.prompt("Keynote id: ");
            if (roomId !== null) {
                ws = new WebSocket(wsUrl);
                ws.onopen = function (e) {
                    console.log('* Connected!');
                    ws.send(JSON.stringify({"type":"JOIN", "id":roomId}));
                    kslide.sendEvent(self, {"type":"SET_CURSOR", "cursor":currentSlide});
                    ws.send(JSON.stringify({"type":"SET_CURSOR", "cursor":currentSlide}));
                    var slideurl = document.URL.replace("keynote", "ws");
                    alert(slideurl + roomId)
                };
                ws.onclose = function (e) {
                    console.log('* Disconnected');
                };
                ws.onerror = function (e) {
                    console.log('* Unexpected error');
                };
                ws.onmessage = function (e) {
                    // we do nothing when the master receive messages
                };
            }
        } catch (e) {
        }
    }
}

/* document.removeEventListener('touchstart', touchStartEvent, false);
 document.removeEventListener('touchmove', touchMoveEvent, false);
 document.removeEventListener('touchend', dispatchSingleSlideModeFromEvent, false);
 document.removeEventListener('click', dispatchSingleSlideModeFromEvent, false);
 document.removeEventListener('keydown', keyEventListener, false);*/

/*function newKeyEventListener (e) {
 // Shortcut for alt, shift and meta keys
 if (e.altKey || e.ctrlKey || e.metaKey) {
 return;
 }
 switch (e.which) {
 case 70: // f
 e.preventDefault();
 fullscreen();
 break;
 default:
 // Behave as usual
 }
 }
 document.addEventListener('keydown', newKeyEventListener, false);
 };*/