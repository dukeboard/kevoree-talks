/**
 * Created with IntelliJ IDEA.
 * User: edaubert erwan.daubert@gmail.com
 * Date: 23/09/12
 * Time: 12:22
 */
function KEmbedder (kslide) {
    var slideURL = null;
    var view = null,
//        url = null,
        cursor = 1,
        length = null,
        iframe = null,
        remote = null,
        self = this;


    this.listener = function (message) {
        if (message.type === "RELOAD") {
            slideURL = message.url;
            loadIFrame();
        } else if (message.type === "FULLSCREEN") {
            fullscreen();
        } else {
            view.postMessage(JSON.stringify(message), '*');
        }
    };

    this.start = function () {
        try {
            document.querySelector('#popup').addEventListener("touchstart", openPopup, false);
            document.querySelector('#popup').addEventListener("click", openPopup, false);

            document.querySelector('#back').addEventListener("touchstart", back, false);
            document.querySelector('#back').addEventListener("click", back, false);

            document.querySelector('#forward').addEventListener("touchstart", forward, false);
            document.querySelector('#forward').addEventListener("click", forward, false);

            document.querySelector('#cursor').addEventListener("change", setCursor, false);

            document.querySelector('#keynote').addEventListener("touchstart", openKeynote, false);
            document.querySelector('#keynote').addEventListener("click", openKeynote, false);

            document.querySelector('#fullscreen').addEventListener("touchstart", fullscreen, false);
            document.querySelector('#fullscreen').addEventListener("click", fullscreen, false);

            window.addEventListener('message', manageMessage, false);
            window.addEventListener('unload', unload, false);
            loadIFrame();
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    this.initialize = function () {};

    function openPopup () {
        var url = slideURL.substring(0, slideURL.lastIndexOf("/")) + "/";
        remote = window.open(url + "popup", 'slides', 'width=800,height=600,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    }

    // allow to close the popup when the window is unload
    function unload () {
        if (remote != null) {
            remote.close();
            window.removeEventListener('message', manageMessage, false);
        }
    }

    function openKeynote () {
        window.location.href = slideURL.substring(0, slideURL.lastIndexOf("/")) + "/keynote";
    }

    function back () {
        view.postMessage(JSON.stringify({"type":"BACK"}), '*');
    }

    function forward () {
        view.postMessage(JSON.stringify({"type":"FORWARD"}), '*');
    }

    function setCursor () {
        var cursor = +(document.querySelector('#cursor').value) - 1;
        view.postMessage(JSON.stringify({"type":"SET_CURSOR", "cursor":cursor}), '*');
    }

    function getUrl () {
        if (slideURL === undefined) {
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

    function loadIFrame () {
        unload();
        iframe = document.querySelector("iframe");
        iframe.src = url = getUrl();
        iframe.onload = function () {
            view = this.contentWindow;
            view.postMessage(JSON.stringify({"type":"REGISTER"}), '*');
        }
    }

    function fullscreen () {
        var requestFullscreen = iframe.requestFullscreen || iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
        if (requestFullscreen) {
            requestFullscreen.apply(iframe);
        } else {
            window.open(url, '', 'width=800,height=600,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
        }
    }

    function manageMessage (event) {
        if (event.source === view) {
            var message = JSON.parse(event.data);
            if (message.type === "REGISTERED") {
                event.source.postMessage(JSON.stringify({"type":"GET_LENGTH"}), '*');
            } else if (message.type === "CURSOR") {
                cursor = message.cursor;
                document.querySelector("#cursor").value = (+cursor + 1);
                kslide.sendEvent(self, message);
            } else if (message.type === "LENGTH") {
                document.querySelector("#length").innerHTML = length = message.length;
            }
            /*else {
             kslide.sendEvent(self, message);
             }*/
        }
    }
}