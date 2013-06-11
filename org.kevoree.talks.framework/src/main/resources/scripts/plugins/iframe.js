/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 22:32
 *//*


function KIFrameSlave(kslide) {
    var self = this;
    var api = new KIFrame();

    window.addEventListener("message", manageMessage, false);

    jQuery(document.body).on("INITIALIZE", function () {
    });

    jQuery(document.body).on("RUN", function () {
        window.parent.postMessage(JSON.stringify({"type": "INITIALIZED"}), '*');

        jQuery(document.body).on("NOTES", function (message) {
            window.parent.postMessage(api.stringify(message), '*');
        });
        jQuery(document.body).on("LENGTH", function (message) {
            window.parent.postMessage(api.stringify(message), '*');
        });
        jQuery(document.body).on("POSITION", function (message) {
            window.parent.postMessage(api.stringify(message), '*');
        });
    });


    function addEmptySlide(position) {
        var emptySlide = document.createElement("section");
        emptySlide.className = "slide";
        emptySlide.id = "EMPTY_SLIDE_" + position;
        if (position != undefined) {
            // look for the position+1 th element on body
            var node = jQuery(document.body).find(".slide:nth-of-type(" + (+position + 1) + ")");
            if (node != null) {
                document.body.insertBefore(emptySlide, node);
            } else {
                document.body.appendChild(emptySlide);
            }
        } else {
            document.body.appendChild(emptySlide);
        }
    }

    function removeSlide(position) {
        if (position != undefined) {
            var node = jQuery(document.body).find(".slide:nth-of-type(" + (+position + 1) + ")");
            if (node != null) {
                document.body.removeChild(node.get(0));
            }
        }
    }

    function manageMessage(event) {
        if (window.parent.document != document && window.parent === event.source) {
            var message = JSON.parse(event.data);
            if (message.type === "EMPTY_SLIDE") {
                if (message.position === "START") {
                    message.position = 0;
                } else if (message.position === "END") {
                    message.position = kslide.getLength();

                }
                addEmptySlide(message.position);
            } else if (message.type === "REMOVE_SLIDE") {
                if (message.position === "START") {
                    message.position = 0;
                } else if (message.position === "END") {
                    message.position = kslide.getLength();

                }
                removeSlide(message.position);
            } else if (message.type !== "RUN") {
                jQuery(document.body).trigger(message);
            }
        }
    }
}

function KIFrameMaster(kslide, slideURL) {
    var self = this;
    var api = new KIFrame();

    var presentInitialized = false;
    var futureInitialized = false;

    var views = {
        id: null,
        present: null,
        future: null
    };

    jQuery(document.body).on("INITIALIZE", function (message) {
        window.addEventListener('message', manageMessage, false);
        var callbackPresent = jQuery.Deferred();
        var callbackFuture = jQuery.Deferred();
        views.present = jQuery("#present").find("iframe").get(0);
        views.future = jQuery("#future").find("iframe").get(0);
        var url = getUrl();
        views.present.src = views.future.src = url;
        jQuery(views.present).load(function () {
            views.present = this.contentWindow;
            callbackPresent.resolve();
        });
        jQuery(views.future).load(function () {
            views.future = this.contentWindow;
            callbackFuture.resolve();
        });

        var callbacks = [];
        callbacks.push(callbackPresent);
        callbacks.push(callbackFuture);
        jQuery.when.apply(null, callbacks).done(function () {
            // add an empty slide on views.future and remove the first one
            views.future.postMessage(JSON.stringify({"type": "EMPTY_SLIDE", "position": "END"}), '*');
            views.future.postMessage(JSON.stringify({"type": "REMOVE_SLIDE", "position": "START"}), '*');

            // send "INITIALIZE" to views.present and views.future
            views.present.postMessage(JSON.stringify({"type": "INITIALIZED"}), '*');
            views.future.postMessage(JSON.stringify({"type": "INITIALIZED"}), '*');

        });
    });

    jQuery(document.body).on("RUN", function () {
        views.present.postMessage(JSON.stringify({"type": "GET_NOTES"}), '*');
        views.present.postMessage(JSON.stringify({"type": "GET_LENGTH"}), '*');
        views.present.postMessage(JSON.stringify({"type": "GET_POSITION"}), '*');
    });


    */
/*jQuery(document.body).on("START", function () {
        views.present.postMessage(JSON.stringify({"type": "START"}), '*');
        views.future.postMessage(JSON.stringify({"type": "START"}), '*');
    });
    jQuery(document.body).on("SET_SLIDE", function (message) {
        views.present.postMessage(JSON.stringify({"type": "SET_SLIDE", "slideNumber": message.slideNumber, "previousSlideNumber": message.previousSlideNumber}), '*');
        views.future.postMessage(JSON.stringify({"type": "SET_SLIDE", "slideNumber": message.slideNumber, "previousSlideNumber": message.previousSlideNumber}), '*');
    });
    jQuery(document.body).on("BACK", function () {
        views.present.postMessage(JSON.stringify({"type": "BACK"}), '*');
        views.future.postMessage(JSON.stringify({"type": "BACK"}), '*');
    });
    jQuery(document.body).on("FORWARD", function () {
        views.present.postMessage(JSON.stringify({"type": "FORWARD"}), '*');
        views.future.postMessage(JSON.stringify({"type": "FORWARD"}), '*');
    });
    jQuery(document.body).on("END", function () {
        views.present.postMessage(JSON.stringify({"type": "END"}), '*');
        views.future.postMessage(JSON.stringify({"type": "END"}), '*');
    });
    jQuery(document.body).on("SET_POSITION", function (message) {
        views.present.postMessage(api.stringify(message), '*');
        views.future.postMessage(api.stringify(message), '*');
    });*//*


    jQuery(document.body).on(api.managedEvents, function (message) {
        console.log(message);
        views.present.postMessage(api.stringify(message), '*');
        views.future.postMessage(api.stringify(message), '*');
    });

    */
/* Get url from hash or prompt and store it *//*

    function getUrl() {
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
        return slideURL + "frame?slide";
    }

    function manageMessage(event) {
        if (event.source === views.present || event.source === views.future) {
            var message = JSON.parse(event.data);
            if (message.type === "INITIALIZED") {
                if (event.source === views.present) {
                    presentInitialized = true;
                } else if (event.source === views.future) {
                    futureInitialized = true;
                }
                if (presentInitialized && futureInitialized) {
                    // must be triggered when views.present and views.future have been initialized !!
                    jQuery(document.body).trigger("INITIALIZED");
                }
            } else if ((message.type == "POSITION" || message.type == "LENGTH" || message.type == "NOTES") && event.source == views.present) {
                jQuery(document.body).trigger(message);
            }
        }
    }
}

function KIFrame() {

    this.stringify = function (message) {
        return JSON.stringify(message, function (key, value) {
            if ("currentTarget" == key || "delegateTarget" == key || "target" === key || "handleObj" == key || key.indexOf("jQuery") != -1) {
                return undefined;
            }
            return value;
        });
    };

    var events = "INITIALIZE INITIALIZED RUN SLIDE LIST START END FORWARD BACK SET_SLIDE FULLSCREEN NOTES GET_NOTES LENGTH GET_LENGTH POSITION SET_POSITION GET_POSITION EMPTY_SLIDE REMOVE_SLIDE POSITION";
    var managedEvents = "START END FORWARD BACK SET_SLIDE GET_NOTES GET_LENGTH SET_POSITION GET_POSITION EMPTY_SLIDE REMOVE_SLIDE";

    this.addManagedEvent = function (eventName) {

    }

}*/
