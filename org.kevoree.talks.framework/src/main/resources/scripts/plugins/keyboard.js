/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 15:14
 */

function KKeyboard(kslide) {

    var self = this;

    var orgX, newX;
    var tracking = false;

    function keyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }

        switch (e.which) {
            case 13: // Enter
                kslide.sendEvent(self, {"type": "SLIDE"});
                break;

            case 27: // Esc
                kslide.sendEvent(self, {"type": "LIST"});
                break;

            case 33: // PgUp
            case 38: // Up
            case 37: // Left
            case 72: // h
            case 75: // k
                e.preventDefault();
                kslide.sendEvent(self, {"type": "BACK"});
                break;

            case 34: // PgDown
            case 40: // Down
            case 39: // Right
            case 76: // l
            case 74: // j
                e.preventDefault();
                kslide.sendEvent(self, {"type": "FORWARD"});
                break;

            case 36: // Home
                e.preventDefault();
                kslide.sendEvent(self, {"type": "START"});
                break;

            case 35: // End
                e.preventDefault();
                kslide.sendEvent(self, {"type": "END"});
                break;

            case 9: // Tab = +1; Shift + Tab = -1
            case 32: // Space = +1; Shift + Space = -1
                e.preventDefault();
                var response = kslide.getCursor();
                if (!e.shiftKey) {
                    if (response != null && response.type === "CURSOR") {
                        kslide.sendEvent(self, {"type": "SET_CURSOR", "cursor": +(response.cursor) + 1});
                    }
                } else {
                    if (response != null && response.type === "CURSOR") {
                        kslide.sendEvent(self, {"type": "SET_CURSOR", "cursor": +(response.cursor) - 1});
                    }
                }
                break;
            case 70: // f
                e.preventDefault();
                kslide.sendEvent(self, {"type": "FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }

    this.listener = function (message) {
    };

    this.start = function () {
        document.addEventListener("touchstart", touchStartEvent, false);
        document.addEventListener("touchend", touchStopEvent, false);
        document.addEventListener('click', click, false);
        document.addEventListener('keydown', keyEventListener, false);
    };

    this.initialize = function () {
    };

    function click (event) {
        var slideId = getContainingSlideId(event.target);
        if ('' !== slideId && (!kslide.isSlideMode() || kslide.getSlide().slide.id !== slideId)) {
            kslide.sendEvent(self, {"type": "SET_ID", "id": slideId});
            kslide.sendEvent(self, {"type": "SLIDE"});
        }
    }

    function getContainingSlideId(el) {
        var node = el;
        while ('BODY' !== node.nodeName && 'HTML' !== node.nodeName) {
            if (-1 !== node.className.indexOf('slide')) {
                return node.id;
            } else {
                node = node.parentNode;
            }
        }
        return '';
    }

    function touchStartEvent(aEvent) {
        aEvent.preventDefault();
        tracking = true;
        orgX = aEvent.changedTouches[0].pageX;
    }

    function touchStopEvent(aEvent) {
        aEvent.preventDefault();
        if (!tracking) {
            return;
        }
        newX = aEvent.changedTouches[0].pageX;
        tracking = false;
        if (orgX - newX > 100) {
            kslide.sendEvent(self, {"type": "FORWARD"});
        } else if (orgX - newX < -100) {
            kslide.sendEvent(self, {"type": "BACK"});
        } else {
            kslide.sendEvent(self, {"type": "SLIDE"})
        }
    }

}
