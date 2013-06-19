function KSlideShowKeynoteSlave(kslide) {
    var self = this;
    var api = new KSlideShowKeynoteAPI();

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
        jQuery(document.body).on("POSITION", onPositionEvent);
    });

    function onPositionEvent(message) {
        window.parent.postMessage(api.stringify(message), '*');
    }


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
                if (message.type === "POSITION") {
                    jQuery(document.body).off("POSITION", onPositionEvent);
                }
                jQuery(document.body).trigger(message);
                if (message.type === "POSITION") {
                    jQuery(document.body).on("POSITION", onPositionEvent);
                }
            }
        }
    }
}

function KSlideShowKeynoteMaster(slideURL) {
    var body = document.body;


    var self = this;
    var api = new KSlideShowKeynoteAPI();

    var presentInitialized = false;
    var futureInitialized = false;

    var views = {
        id: null,
        present: null,
        future: null,
        currentSlideNumber: -1
    };

    var events = "INITIALIZE INITIALIZED RUN SLIDE LIST START END FORWARD BACK SET_SLIDE FULLSCREEN NOTES GET_NOTES LENGTH GET_LENGTH POSITION GET_POSITION SET_POSITION EMPTY_SLIDE REMOVE_SLIDE";
    var managedEvents = "START END FORWARD BACK SET_POSITION GET_NOTES GET_LENGTH GET_POSITION EMPTY_SLIDE REMOVE_SLIDE";

    this.getManagedEvents = function () {
        return managedEvents;
    };

    this.startKeynote = function () {
        var nbInitializeHandlers = jQuery._data(body, "events").INITIALIZE.length;
        var nbInitialized = 0;

        jQuery(body).on("INITIALIZED", function () {
            nbInitialized++;
            if (nbInitialized == nbInitializeHandlers) {
                jQuery(body).trigger("RUN");
            }
        });
        jQuery(body).trigger("INITIALIZE");
    };

    this.stringify = function (message) {
        return JSON.stringify(message, function (key, value) {
            if ("currentTarget" == key || "delegateTarget" == key || "target" === key || "handleObj" == key || key.indexOf("jQuery") != -1) {
                return undefined;
            }
            return value;
        });
    };

    this.addManagedEvent = function (eventName) {
// TODO allow to add new message coming from new plugin
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

            // send "INITIALIZED" to views.present and views.future
            views.present.postMessage(JSON.stringify({"type": "INITIALIZED"}), '*');
            views.future.postMessage(JSON.stringify({"type": "INITIALIZED"}), '*');
        });
    });
    jQuery(document.body).on("RUN", function () {
        views.present.postMessage(JSON.stringify({"type": "SLIDE"}), '*');
        views.future.postMessage(JSON.stringify({"type": "SLIDE"}), '*');
    });

    jQuery(document.body).on(managedEvents, function (message) {
        views.present.postMessage(api.stringify(message), '*');
        views.future.postMessage(api.stringify(message), '*');
    });

    /* Get url from hash or prompt and store it */
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
        return slideURL + "frame";
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
            } else if (event.source == views.present) {
                if (message.type === "POSITION") {
                    views.currentSlideNumber = message.position;
                }
                jQuery(document.body).trigger(message);
            }
        }
    }

    this.getCurrentSlideNumber = function() {
        return views.currentSlideNumber;
    }
}


function KSlideShowKeynoteAPI() {

    this.stringify = function (message) {
        return JSON.stringify(message, function (key, value) {
            if ("currentTarget" == key || "delegateTarget" == key || "target" === key || "handleObj" == key || key.indexOf("jQuery") != -1) {
                return undefined;
            }
            return value;
        });
    };
}