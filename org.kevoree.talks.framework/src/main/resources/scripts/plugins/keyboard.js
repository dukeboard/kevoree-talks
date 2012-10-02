/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 15:14
 */

function KKeyboard (kslide) {

    var self = this;

    var orgX, newX;
    var tracking = false;

    function keyEventListener (e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }

        switch (e.which) {
            case 13: // Enter
                kslide.sendEvent(self, {"type":"FULL"});
                break;

            case 27: // Esc
                kslide.sendEvent(self, {"type":"LIST"});
                break;

            case 33: // PgUp
            case 38: // Up
            case 37: // Left
            case 72: // h
            case 75: // k
                e.preventDefault();
                kslide.sendEvent(self, {"type":"BACK"});
                break;

            case 34: // PgDown
            case 40: // Down
            case 39: // Right
            case 76: // l
            case 74: // j
                e.preventDefault();
                kslide.sendEvent(self, {"type":"FORWARD"});
                break;

            case 36: // Home
                e.preventDefault();
                kslide.sendEvent(self, {"type":"START"});
                break;

            case 35: // End
                e.preventDefault();
                kslide.sendEvent(self, {"type":"END"});
                break;

            case 9: // Tab = +1; Shift + Tab = -1
            case 32: // Space = +1; Shift + Space = -1
                e.preventDefault();
                var response = kslide.getCursor();
                if (!e.shiftKey) {
                    if (response != null && response.type === "CURSOR") {
                        kslide.sendEvent(self, {"type":"SET_CURSOR", "cursor":+(response.cursor) + 1});
                    }
                } else {
                    if (response != null && response.type === "CURSOR") {
                        kslide.sendEvent(self, {"type":"SET_CURSOR", "cursor":+(response.cursor) - 1});
                    }
                }
                break;
            case 70: // f
                e.preventDefault();
                kslide.sendEvent(self, {"type":"FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }

    this.listener = function (message) {
    };

    this.start = function () {
        document.addEventListener("touchstart", touchStartEvent, false);
        document.addEventListener("touchmove", touchMoveEvent, false);
//        document.addEventListener('touchend', function () {kslide.sendEvent(self, {"type":"FULL"})}, false);
        document.addEventListener('click', function () {kslide.sendEvent(self, {"type":"FULL"})}, false);
        document.addEventListener('keydown', keyEventListener, false);
    };


    function touchStartEvent (aEvent) {
        aEvent.preventDefault();
        self.tracking = true;
        self.orgX = aEvent.changedTouches[0].pageX;
    }

    function touchMoveEvent (aEvent) {
        aEvent.preventDefault();
        if (!self.tracking) {
            return;
        }
        self.newX = aEvent.changedTouches[0].pageX;
        if (self.orgX - self.newX > 100) {
            self.tracking = false;
            kslide.sendEvent(self, {"type":"FORWARD"});
        } else {
            if (self.orgX - self.newX < -100) {
                self.tracking = false;
                kslide.sendEvent(self, {"type":"BACK"});
            }
        }
    }

}
