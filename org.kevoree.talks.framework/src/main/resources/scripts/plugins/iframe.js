/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 22:32
 */

function KIFrameSlave (kslide) {

    var self = this;

    this.listener = function (message) {
    };

    this.start = function () {
        if (window.parent.document != document) {
            window.addEventListener("message", manageMessage, false);
            kslide.sendEvent(self, {"type":"FULL"});
        }
    };

    this.initialize = function () {};

    function manageMessage (event) {
        if (window.parent.document != document && window.parent === event.source) {
            var message = JSON.parse(event.data);
            if (message.type === "REGISTER") {
                event.source.postMessage(JSON.stringify({"type":"REGISTERED"}), '*');
            } else if (message.type === "GET_LENGTH") {
                var response = kslide.getLength();
                if (response != null && response.type == "LENGTH") {
                    window.parent.postMessage(JSON.stringify(response), '*');
                }
                // TODO do the same for GET_CURSOR
            }else if (message.type === "EMPTY_SLIDE") {
                if (message.position === "START") {
                    message.position = 0;
                } else if (message.position === "END") {
                    response = kslide.getLength();
                    if (response != null && response.type === "LENGTH") {
                        message.position = response.length;
                    }
                }
                kslide.sendEvent(self, message);
            } else {
                kslide.sendEvent(self, message);
            }
            response = kslide.getNotes();
            if (response != null && response.type == "NOTES") {
                event.source.postMessage(JSON.stringify(response), '*');
            }
            response = kslide.getCursor();
            if (response != null && response.type == "CURSOR") {
                event.source.postMessage(JSON.stringify(response), '*');
            }
        }
    }
}

function KIFrameMaster (kslide, slideURL) {
    var self = this;
    var views = {
        id:null,
        present:null,
        future:null,
        length:null,
        cursor:null
    };

    this.listener = function (message) {
        if (message.type === "START") {
            views.present.postMessage(JSON.stringify({"type":"START"}), '*');
            views.future.postMessage(JSON.stringify({"type":"START"}), '*');
            views.future.postMessage(JSON.stringify({"type":"FORWARD"}), '*');
        } else if (message.type === "SET_CURSOR") {
            views.present.postMessage(JSON.stringify(message), '*');
            views.future.postMessage(JSON.stringify(message), '*');
            views.future.postMessage(JSON.stringify({"type":"FORWARD"}), '*');
        } else if (message.type === "BACK") {
            if (views.cursor != "0") {
                views.present.postMessage(JSON.stringify(message), '*');
                views.future.postMessage(JSON.stringify(message), '*');
            }
        } else {
            views.present.postMessage(JSON.stringify(message), '*');
            views.future.postMessage(JSON.stringify(message), '*');
        }
    };

    /* Get url from hash or prompt and store it */
    function getUrl () {
        if (slideURL == undefined) {
            slideURL = window.prompt("What is the URL of the slides?");
            if (slideURL) {
                window.location.hash = slideURL.split("#")[0];
                return slideURL;
            }
            slideURL = "<style>body{background-color:white;color:black}</style>";
            slideURL += "<strong>ERROR:</strong> No URL specified.<br>";
            slideURL += "Try<em>: " + document.location + "#yourslides.html</em>";
            slideURL = "data:text/html," + encodeURIComponent(slideURL);
        }
        return slideURL + "frame";
    }

    function loadIframes () {
        views.present = document.querySelector("#present iframe");
        views.future = document.querySelector("#future iframe");
        var url = getUrl();
        views.present.src = views.future.src = url;
        views.present.onload = views.future.onload = function () {
            var id = this.parentNode.id;
            views[id] = this.contentWindow;
            views[id].postMessage(JSON.stringify({"type":"REGISTER"}), '*');
        };
    }

    this.start = function () {
        window.addEventListener('message', manageMessage, false);
        loadIframes();
    };

    this.initialize = function () {};

    this.update = function () {
         views.present.source.postMessage(JSON.stringify({"type":"GET_LENGTH"}), '*');
    };

    function manageMessage (event) {
        if (event.source === views.present || event.source === views.future) {
            var message = JSON.parse(event.data);
            if (message.type === "REGISTERED") {
                if (event.source === views.future) {
                    event.source.postMessage(JSON.stringify({"type":"EMPTY_SLIDE", "position":"END"}), '*');
                    event.source.postMessage(JSON.stringify({"type":"FORWARD"}), '*');
                } else {
//                    event.source.postMessage(JSON.stringify({"type":"EMPTY_SLIDE", "position":"START"}), '*');
                    event.source.postMessage(JSON.stringify({"type":"GET_LENGTH"}), '*');
                    event.source.postMessage(JSON.stringify({"type":"GET_NOTES"}), '*');
                }
            } else if (message.type === "NOTES") {
                if (event.source === views.present) {
                    kslide.sendEvent(self, message);
                }
            } else if (message.type === "CURSOR") {
                if (event.source === views.present) {
                    views.cursor = message.cursor;
                    kslide.sendEvent(self, message);
                }
            } else if (message.type === "LENGTH") {
                views.length = message.length;
                kslide.sendEvent(self, message);
            } else {
                kslide.sendEvent(self, message);
            }
        }
    }
}