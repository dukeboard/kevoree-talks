/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 13:40
 */

function KWebsocketSlave(kslide, wsUrl, roomID) {
    var ws = null;
    var self = this;

    this.start = function () {
        try {
            if (wsUrl !== "{wsurl}") {
                ws = new WebSocket(wsUrl);
                ws.onopen = function (e) {
                    console.log('* Connected!');
                    ws.send(JSON.stringify({"type": "JOIN", "id": roomID}));
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
            kslide.sendEvent(self, {"type": "FULL"});
        }
    };

    this.stop = function () {
        document.removeEventListener('keydown', newKeyEventListener, false);
    };

    this.listener = function (message) {
    };


    function newKeyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }
        switch (e.which) {
            case 70: // f
                e.preventDefault();
                kslide.sendEvent(self, {"type": "FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }


    function manageMessage(messageString) {
        kslide.sendEvent(self, JSON.parse(messageString));
    }
}

function KWebsocketMaster(kslide, wsUrl, roomID) {
    var ws = null;
    var self = this;
    var currentSlide = null;

    this.start = function () {
        if (wsUrl != undefined && roomID === undefined) {
            document.querySelector('#keynote-button').addEventListener("touchstart", connectWS, false);
            document.querySelector('#keynote-button').addEventListener("click", connectWS, false);
        } else if (wsUrl != undefined && roomID != null) {
            connectWS();
        }
    };

    this.initialize = function () {
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

    function connectWS() {
        try {
            if (roomID === undefined) {
                roomID = window.prompt("Keynote id: ");
            }
            if (roomID !== null) {
                ws = new WebSocket(wsUrl);
                ws.onopen = function (e) {
                    console.log('* Connected!');
                    ws.send(JSON.stringify({"type": "JOIN", "id": roomID}));
                    kslide.sendEvent(self, {"type": "SET_CURSOR", "cursor": currentSlide});
                    ws.send(JSON.stringify({"type": "SET_CURSOR", "cursor": currentSlide}));
                    var slideurl = document.URL.replace("keynote", "slave");
                    alert(slideurl + roomID)
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

    function disconnectWS () {
        if (ws != null) {
            ws.close();
        }
    }
}