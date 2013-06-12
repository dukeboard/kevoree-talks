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

    jQuery(document.body).on("RUN", function () {
//        console.log("starting keyboard plugin");
        document.addEventListener("touchstart", touchStartEvent, false);
        document.addEventListener("touchend", touchStopEvent, false);
        jQuery(window).click(click);
        jQuery(window).keydown(keyEventListener);
        jQuery(document.body).on("FULLSCREEN", function () {
            /* On Firefox + slide as cover  unable to switch to next slide.
             * You need to go to fullscreen, try to go to next slide, then go back to the previous slide and then the slides work fine.
             * */

            if (screenfull) {
                screenfull.request();
            }
        });
    });

    function keyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }

        switch (e.which) {
            case 13: // Enter
                jQuery(document.body).trigger({type: "SLIDE"});
                jQuery(document.body).trigger({type: "SET_SLIDE", slideNumber: kslide.getCurrentSlideNumber(), previousSlideNumber: kslide.getCurrentSlideNumber()});
                break;

            case 27: // Esc
                jQuery(document.body).trigger({type: "LIST"});
                break;

            case 33: // PgUp
            case 38: // Up
            case 37: // Left
            case 72: // h
            case 75: // k
                e.preventDefault();
                jQuery(document.body).trigger({type: "BACK"});
                break;

            case 34: // PgDown
            case 40: // Down
            case 39: // Right
            case 76: // l
            case 74: // j
                e.preventDefault();
                jQuery(document.body).trigger({type : "FORWARD"});
                break;

            case 36: // Home
                e.preventDefault();
                jQuery(document.body).trigger({type : "START"});
                break;

            case 35: // End
                e.preventDefault();
                jQuery(document.body).trigger({type : "END"});
                break;

            case 9: // Tab = +1; Shift + Tab = -1
            case 32: // Space = +1; Shift + Space = -1
                e.preventDefault();
                if (!e.shiftKey) {
                        jQuery(document.body).trigger({type : "SET_SLIDE", slideNumber : kslide.getCurrentSlideNumber() + 1, previousSlideNumber : kslide.getCurrentSlideNumber() + 1});
                } else {
                    jQuery(document.body).trigger({type : "SET_SLIDE", slideNumber : kslide.getCurrentSlideNumber() - 1, previousSlideNumber : kslide.getCurrentSlideNumber() - 1});
                }
                break;
            case 70: // f
                e.preventDefault();
                jQuery(document.body).trigger({type : "FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }


    function click (event) {
        var slideId = getContainingSlideId(event.target);
        if ('' !== slideId && (!kslide.isSlideMode() || kslide.getSlide(kslide.getCurrentSlideNumber()).id !== slideId)) {
            var previousSlideNumber = kslide.getCurrentSlideNumber();
            kslide.getUrl().hash = slideId;
            var slideNumber = kslide.getCurrentSlideNumber();
            jQuery(document.body).trigger({type : "SLIDE"});
            jQuery(document.body).trigger({type : "SET_SLIDE", slideNumber : slideNumber, previousSlideNumber : previousSlideNumber});
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
            jQuery(document.body).trigger({type : "FORWARD"});
        } else if (orgX - newX < -100) {
            jQuery(document.body).trigger({type : "BACK"});
        } else {
            jQuery(document.body).trigger({type : "SLIDE"});
        }
    }

}

function KKeyboardKeynote(kslide) {
    jQuery(document.body).on("RUN", function () {
//        console.log("starting keyboard plugin for keynote");
        jQuery(window).keydown(keyEventListener);
    });

    function keyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }

        switch (e.which) {
            case 33: // PgUp
            case 38: // Up
            case 37: // Left
            case 72: // h
            case 75: // k
                e.preventDefault();
                jQuery(document.body).trigger({type : "BACK"});
                break;

            case 34: // PgDown
            case 40: // Down
            case 39: // Right
            case 76: // l
            case 74: // j
                e.preventDefault();
                jQuery(document.body).trigger({type : "FORWARD"});
                break;

            case 36: // Home
                e.preventDefault();
                jQuery(document.body).trigger({type : "START"});
                break;

            case 35: // End
                e.preventDefault();
                jQuery(document.body).trigger({type : "END"});
                break;

            case 9: // Tab = +1; Shift + Tab = -1
            case 32: // Space = +1; Shift + Space = -1
                e.preventDefault();
                if (!e.shiftKey) {
                    jQuery(document.body).trigger({type : "SET_SLIDE", slideNumber : kslide.getCurrentSlideNumber() + 1, previousSlideNumber : kslide.getCurrentSlideNumber() + 1});
                } else {
                    jQuery(document.body).trigger({type : "SET_SLIDE", slideNumber : kslide.getCurrentSlideNumber() - 1, previousSlideNumber : kslide.getCurrentSlideNumber() - 1});
                }
                break;
            default:
            // Behave as usual
        }
    }
}