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

    jQuery(kslide.getBody()).on("RUN", function () {
        self.start();
    });

    function keyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }

        switch (e.which) {
            case 13: // Enter
//                kslide.sendEvent(self, {"type": "SLIDE"});
                jQuery(kslide.getBody()).trigger({"type": "SLIDE"});
                break;

            case 27: // Esc
//                kslide.sendEvent(self, {"type": "LIST"});
                jQuery(kslide.getBody()).trigger({"type": "LIST"});
                break;

            case 33: // PgUp
            case 38: // Up
            case 37: // Left
            case 72: // h
            case 75: // k
                e.preventDefault();
//                kslide.sendEvent(self, {"type": "BACK"});
                jQuery(kslide.getBody()).trigger({"type": "BACK"});
                break;

            case 34: // PgDown
            case 40: // Down
            case 39: // Right
            case 76: // l
            case 74: // j
                e.preventDefault();
//                kslide.sendEvent(self, {"type": "FORWARD"});
                jQuery(kslide.getBody()).trigger({"type": "FORWARD"});
                break;

            case 36: // Home
                e.preventDefault();
//                kslide.sendEvent(self, {"type": "START"});
                jQuery(kslide.getBody()).trigger({"type": "START"});
                break;

            case 35: // End
                e.preventDefault();
//                kslide.sendEvent(self, {"type": "END"});
                jQuery(kslide.getBody()).trigger({"type": "END"});
                break;

            case 9: // Tab = +1; Shift + Tab = -1
            case 32: // Space = +1; Shift + Space = -1
                e.preventDefault();
                var response = kslide.getCursor();
                if (!e.shiftKey) {
                    if (response != null && response.type === "CURSOR") {
//                        kslide.sendEvent(self, {"type": "SET_CURSOR", "cursor": +(response.cursor) + 1});
                        jQuery(kslide.getBody()).trigger({"type": "SET_CURSOR", "cursor": +(response.cursor) + 1});
                    }
                } else {
                    if (response != null && response.type === "CURSOR") {
//                        kslide.sendEvent(self, {"type": "SET_CURSOR", "cursor": +(response.cursor) - 1});
                        jQuery(kslide.getBody()).trigger({"type": "SET_CURSOR", "cursor": +(response.cursor) - 1});
                    }
                }
                break;
            case 70: // f
                e.preventDefault();
//                kslide.sendEvent(self, {"type": "FULLSCREEN"});
                jQuery(kslide.getBody()).trigger({"type": "FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }

    this.listener = function (message) {
    };

    this.start = function () {
        console.log("start keyboard plugin");
        document.addEventListener("touchstart", touchStartEvent, false);
        document.addEventListener("touchend", touchStopEvent, false);
        jQuery(window).click(click);
//        document.addEventListener('click', click, false);
//        document.addEventListener('keydown', keyEventListener, false);
        jQuery(window).keydown(keyEventListener);
    };

    function click (event) {
        var slideId = getContainingSlideId(event.target);
        if ('' !== slideId && (!kslide.isSlideMode() || kslide.getSlide().slide.id !== slideId)) {
//            kslide.sendEvent(self, {"type": "SET_ID", "id": slideId});
            jQuery(kslide.getBody()).trigger({"type": "SET_ID", "id": slideId});
//            kslide.sendEvent(self, {"type": "SLIDE"});
            jQuery(kslide.getBody()).trigger({"type": "SLIDE"});
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
//            kslide.sendEvent(self, {"type": "FORWARD"});
            jQuery(kslide.getBody()).trigger({"type": "FORWARD"});
        } else if (orgX - newX < -100) {
//            kslide.sendEvent(self, {"type": "BACK"});
            jQuery(kslide.getBody()).trigger({"type": "BACK"});
        } else {
//            kslide.sendEvent(self, {"type": "SLIDE"});
            jQuery(kslide.getBody()).trigger({"type": "SLIDE"});
        }
    }

}
