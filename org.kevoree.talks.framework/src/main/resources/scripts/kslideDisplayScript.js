var views = {
        id:null,
        present:null,
        future:null,
        remote:null,
        currentSlide:0,
        nbSlides:0,
        talkIsStarted:false,
        talkStartTime:null
    },
    notes = null,
    url = null,
    ws = null;

/* Get url from hash or prompt and store it */
function getUrl () {
    if (typeof(slideURL) == 'undefined') {
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
    return slideURL;
}

function loadIframes () {
    var present = document.querySelector("#present iframe");
    var future = document.querySelector("#future iframe");
    url = getUrl();
    present.src = future.src = url;
    present.onload = future.onload = function () {
        var id = this.parentNode.id;
        views[id] = this.contentWindow;
        if (views.present && views.future) {
            postMsg(views.present, "REGISTER");
            postMsg(views.future, "REGISTER");
        }
    }
}

function back () {
    // If the current slide is the first one => we do nothing
    if (views.currentSlide != 0) {
        var moveFuture = views.currentSlide != (views.nbSlides - 1);
        postMsg(views.present, "BACK");
        // If the current slide is the last one => we do nothing for the views.future
        if (moveFuture) {
            postMsg(views.future, "BACK");
        }
        updateSlideNumbers();
        if (views.remote != null) {
            postMsg(views.remote, "BACK");
        }
        notifyWebSocket("BACK");
    }
}

function forward () {
    // If the current slide is the last one => we do nothing
    if (views.currentSlide != (views.nbSlides - 1)) {
        postMsg(views.present, "FORWARD");
        postMsg(views.future, "FORWARD");
        updateSlideNumbers();
        if (views.remote != null) {
            postMsg(views.remote, "FORWARD");
        }
        notifyWebSocket("FORWARD");
    }
}

function goStart () {
    postMsg(views.present, "START");
    postMsg(views.future, "START");
    postMsg(views.future, "FORWARD");
    updateSlideNumbers();
    if (views.remote != null) {
        postMsg(views.remote, "START");
    }
    notifyWebSocket("START");
}

function goEnd () {
    postMsg(views.present, "END");
    postMsg(views.future, "END");
    postMsg(views.future, "FORWARD");
    updateSlideNumbers();
    if (views.remote != null) {
        postMsg(views.remote, "END");
    }
    notifyWebSocket("END");
}

function postMsg (aWin, aMsg) { // [arg0, [arg1...]]
    aMsg = [aMsg];
    for (var i = 2; i < arguments.length; i++)
        aMsg.push(encodeURIComponent(arguments[i]));
    aWin.postMessage(aMsg.join(" "), "*");
}

function startClock () {
    var addZero = function (num) {
        return num < 10 ? '0' + num : num;
    };
    setInterval(function () {
        var now = new Date();
        document.querySelector("#hours").innerHTML = addZero(now.getHours());
        document.querySelector("#minutes").innerHTML = addZero(now.getMinutes());
        document.querySelector("#seconds").innerHTML = addZero(now.getSeconds());
        if (views.talkIsStarted) {
            var time = now.getTime() - views.talkStartTime.getTime();
            var date = new Date(time);
            document.querySelector("#talk-time").innerHTML = addZero(date.getUTCHours()) + ":" + addZero(date.getUTCMinutes()) + ":" + addZero(date.getUTCSeconds());
        }
    }, 1000);
}

function talkTime (firstTime) {
    views.talkIsStarted = !views.talkIsStarted;
    views.talkStartTime = new Date();
    if (views.talkIsStarted) {
        document.querySelector("#talk-time").innerHTML = "00:00:00";
    }
}

function setCursor (aCursor) {
    postMsg(views.present, "SET_CURSOR", aCursor);
    postMsg(views.future, "SET_CURSOR", +aCursor + 1);
    if (views.remote != null) {
        postMsg(views.remote, "SET_CURSOR", aCursor);
    }
    updateSlideNumbers()
}

function popup () {
    views.remote = window.open(this.url, 'slides', 'width=784px,height=569px,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
}

function updateSlideNumbers () {
    postMsg(views.present, "GET_CURSOR");
    postMsg(views.future, "GET_CURSOR");
}


window.init = function init () {
    startClock();
    loadIframes();
};


var orgX, newX;
var tracking = false;
var db = document.body;
db.addEventListener("touchstart", touchStartEvent, false);
db.addEventListener("touchmove", touchMoveEvent, false);

function touchStartEvent (aEvent) {
    aEvent.preventDefault();
    tracking = true;
    orgX = aEvent.changedTouches[0].pageX;
}

function touchMoveEvent (aEvent) {
    if (!tracking) return;
    newX = aEvent.changedTouches[0].pageX;
    if (orgX - newX > 100) {
        tracking = false;
        forward();
    } else {
        if (orgX - newX < -100) {
            tracking = false;
            back();
        }
    }
}

window.onkeydown = function (e) {
    // Shortcut for alt, shift and meta keys
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
    }
    switch (e.which) {
        case 33: // PgUp
        case 38: // Up
        case 37: // Left
        case 72: // h
        case 75: // k
            e.preventDefault();
            back();
            break;

        case 34: // PgDown
        case 40: // Down
        case 39: // Right
        case 76: // l
        case 74: // j
            e.preventDefault();
            forward();
            break;

        case 36: // Home
            e.preventDefault();
            goStart();
            break;

        case 35: // End
            e.preventDefault();
            goEnd();
            break;
        case 9: // Tab = +1; Shift + Tab = -1
        case 32: // Space = +1; Shift + Space = -1
            e.preventDefault();
            if (e.shiftKey) {
                this.back();
            } else {
                this.forward();
            }
            break;
        default:
        // Behave as usual
    }
};

window.onhashchange = function () {
    loadIframes();
};

window.onmessage = function (aEvent) {
    var argv = aEvent.data.split(" "), argc = argv.length;
    argv.forEach(function (e, i, a) {
        a[i] = decodeURIComponent(e)
    });
    if (argv[0] === "CURSOR" && argc === 2) {
        if (aEvent.source === views.present && argv[1] != -1) {
            if (views.currentSlide < argv[1] && ws != null) {
                ws.send("SET_CURSOR " + argv[1]);
            } else if (views.currentSlide > argv[1] && ws != null) {
                ws.send("SET_CURSOR " + (+argv[1] + 1));
                ws.send("BACK");
            }
            views.currentSlide = argv[1];
            document.querySelector("#slideidx").innerHTML = +argv[1] == (views.nbSlides - 1) ? "END" : (+argv[1] + 1);
        } else if (aEvent.source === views.future) {
            document.querySelector("#nextslideidx").innerHTML = +argv[1] < 0 || +argv[1] == (views.nbSlides - 1) ? "END" : (+argv[1] + 1);
        } else if (aEvent.source === views.remote) {
            postMsg(views.present, "SET_CURSOR", argv[1]);
            postMsg(views.future, "SET_CURSOR", argv[1]);

            postMsg(views.future, "FORWARD");
        }
    }
    if (aEvent.source === views.present) {
        if (argv[0] === "NOTES" && argc === 2) {
            document.querySelector("#notes > #content").innerHTML = this.notes = argv[1];
        }
        if (argv[0] === "REGISTERED" && argc === 3) {
            postMsg(views.present, "FULL");
            views.nbSlides = argv[2];
            document.querySelector("#slidecount").innerHTML = argv[2];
            updateSlideNumbers();
        }
    }
    if (aEvent.source === views.future) {
        if (argv[0] === "REGISTERED" && argc === 3) {
            postMsg(views.future, "FULL")
            postMsg(views.future, "FORWARD");
            updateSlideNumbers();
        }
    }
    if (aEvent.source === views.remote) {
        if (argv[0] === "REGISTERED" && argc === 3) {
            postMsg(views.future, "FULL")
        }
        if (argv[0] == "BACK") {
            if (views.currentSlide == views.nbSlides - 1) {
                postMsg(views.present, "BACK");
            } else if (views.currentSlide > 0) {
                postMsg(views.present, "BACK");
                postMsg(views.future, "BACK");
            }
        }
        if (argv[0] == "FORWARD") {
            postMsg(views.present, "FORWARD");
            postMsg(views.future, "FORWARD");
        }
        if (argv[0] == "START") {
            postMsg(views.present, "START");
            postMsg(views.future, "START");
            postMsg(views.future, "FORWARD");
        }
        if (argv[0] == "END") {
            postMsg(views.present, "END");
            postMsg(views.future, "END");
        }
        if (argv[0] == "SET_CURSOR") {
            postMsg(views.present, "SET_CURSOR", argv[1]);
            postMsg(views.future, "SET_CURSOR", argv[1]);
            postMsg(views.future, "FORWARD");
        }
        updateSlideNumbers()
    }
}
;

// allow to close the popup when the window is unload
window.onunload = function () {
    if (views.remote != null) {
        views.remote.close();
    }
};

function connectWS () {
    var roomId = window.prompt("Keynote id: ");
    if (roomId) {
        ws = new WebSocket(wsURL);
        ws.onopen = function (e) {
            console.log('* Connected!');
            ws.send("JOIN" + roomId);
        };
        ws.onclose = function (e) {
            console.log('* Disconnected');
        };
        ws.onerror = function (e) {
            console.log('* Unexpected error');
        };
        ws.onmessage = function (aEvent) {

        };
        var slideurl = document.URL.replace("keynote", "ws");
        alert(slideurl + roomId)
    }
}

// function that allow to interact with WebSocket script
function notifyWebSocket (message) {
    try {
        if (typeof(ws) != 'undefined') {
            var aMsg = [message];
            for (var i = 2; i < arguments.length; i++) {
                aMsg.push(encodeURIComponent(arguments[i]));
            }
            ws.send(aMsg.join(" "));
        }
    } catch (e) {
    }
}