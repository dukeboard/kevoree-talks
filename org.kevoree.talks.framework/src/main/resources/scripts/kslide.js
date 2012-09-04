function KSlide() {

    this.slideList = [];
    this.pluginListeners = [];
    /* Notify all registered plugin */
    this.notifyAllPlugin = function (message, previousSlideNumber, currentSlideNumber) {
        if (this.pluginListeners) {
            for (i = 0; i < this.pluginListeners.length; i++) {
                this.pluginListeners[i].listener(message, previousSlideNumber, currentSlideNumber);
            }
        }
    };
    /* this.notifyPlugin = function(message, previousSlideNumber, currentSlideNumber){
     alert("this is a notifcation");
     }; */
    this.addPluginListener = function (f) {
        this.pluginListeners.push({
            id:this.pluginListeners.length,
            listener:f
        });
    };

    /* Public methods */
    function getTransform() {
        var denominator = Math.max(
            (body.clientWidth / window.innerWidth),
            (body.clientHeight / window.innerHeight)
        );
        return 'scale(' + (1 / denominator) + ')';
    }

    ;
    function applyTransform(transform) {
        body.style.WebkitTransform = transform;
        body.style.MozTransform = transform;
        body.style.msTransform = transform;
        body.style.OTransform = transform;
        body.style.transform = transform;
    }

    ;
    this.enterSlideMode = function () {
        body.className = 'full';
        applyTransform(getTransform());
    };
    this.enterListMode = function () {
        body.className = 'list';
        applyTransform('none');
    };
    this.getCurrentSlideNumber = function () {
        currentSlideId = url.hash.substr(1);
        for (i = 0; i < slideList.length; ++i) {
            if (currentSlideId === slideList[i].id) {
                return i;
            }
        }
        return -1;
    }
    this.goToPreviousSlide = null;
    this.goToNextSlide = null;
    this.back = function () {
        this.goToPreviousSlide(this.getCurrentSlideNumber());
        this.notifyAllPlugin("BACK");
    };
    this.forward = function () {
        previousSlideNumber = this.getCurrentSlideNumber();
        currentSlideNumber = this.goToNextSlide(previousSlideNumber);
        this.notifyAllPlugin("FORWARD", previousSlideNumber, currentSlideNumber);
    };
    /* Main Kevoree Keynote function */
    this.startKeynote = function () {
        /* Just rename for scope */
        selfPointer = this;
        getCurrentSlideNumber = this.getCurrentSlideNumber;

        this.addPluginListener(notifyCurrentSlideNumber);

        slideList = this.slideList;
        url = window.location;
        body = document.body;
        slides = jQuery('.slide');
        progress = document.querySelector('div.progress div');
        emptySlide = null;
        slides.each(function (index, slide) {
            if (!slide.id) {
                slide.id = Math.floor(Math.random() * 10001);
            }
            slideList.push({
                id:slide.id,
                hasInnerNavigation:null !== slide.querySelector('.next')
            });
        });

        function scrollToCurrentSlide() {
            // do nothing if currentSlideNumber is unknown (-1)
            if (-1 === getCurrentSlideNumber()) {
                return;
            }
            var currentSlide = document.getElementById(slideList[getCurrentSlideNumber()].id);

            if (null != currentSlide) {
                window.scrollTo(0, currentSlide.offsetTop);
            }
        }

        function isListMode() {
            return 'full' !== url.search.substr(1);
        }

        function normalizeSlideNumber(slideNumber) {
            if (0 > slideNumber) {
                return slideList.length - 1;
            } else if (slideList.length <= slideNumber) {
                return 0;
            } else {
                return slideNumber;
            }
        }

        function updateProgress(slideNumber) {
            // TODO move this kind of style modification into css
            var slide = slides[slideNumber];
            if (slide.className.indexOf("cover") == -1 && slide.className.indexOf("shout") == -1) {

                if (null === progress) {
                    return;
                }
                progress.style.width = (100 / (slideList.length - 1) * normalizeSlideNumber(slideNumber)).toFixed(2) + '%';
                progress.style.visibility = "visible";
            } else {
                progress.style.visibility = "hidden";
            }
        }

        function getSlideHash(slideNumber) {
            return '#' + slideList[normalizeSlideNumber(slideNumber)].id;
        }

        function goToSlide(slideNumber) {
            if (-1 == slideNumber || slideNumber >= slideList.length) {
                return;
            }
            url.hash = getSlideHash(slideNumber);
            if (!isListMode()) {
                updateProgress(slideNumber);
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

        function dispatchSingleSlideModeFromEvent(e) {
            var slideId = getContainingSlideId(e.target);
            if ('' !== slideId && isListMode()) {
                e.preventDefault();
                dispatchSingleSlideMode(slideId)
            }
        }

        function dispatchSingleSlideMode(slideId) {
            if ('' !== slideId && isListMode()) {
                url.hash = '#' + slideId;
                history.replaceState(null, null, url.pathname + '?full#' + slideId);
                selfPointer.enterSlideMode();
                initializeInnerTransition(getCurrentSlideNumber());
                updateProgress(getCurrentSlideNumber());
                selfPointer.notifyAllPlugin("SET_CURSOR", getCurrentSlideNumber());
            }
        }

        function initializeInnerTransition(slideNumber) {
            if (slideNumber >= slideList.length) {
                return;
            }
            if (slideList[slideNumber].hasInnerNavigation) {
                var innerNodes = slides[slideNumber].querySelectorAll('.next');
                for (var i = 0, ii = innerNodes.length; i < ii; i++) {
                    if (innerNodes[i].className.indexOf("active") != -1) {
                        innerNodes[i].className = innerNodes[i].className.substring(0, innerNodes[i].className.length - " active".length);
                    }
                }
                innerNodes[0].className = innerNodes[0].className + ' active';
            }
        }

        function goToNextSlide(slideNumber) {
            // there is no inner navigation or it is not the slideshow view so we just go back to the next slide
            if (!slideList[slideNumber].hasInnerNavigation || url.toString().indexOf("?full#") == -1) {
                // do nothing if slideNumber is larger than the number of slides
                if (slideNumber + 1 == slideList.length) {
                    return -1;
                }
                slideNumber++;
                initializeInnerTransition(slideNumber);
                goToSlide(slideNumber);
                return slideNumber
            } else {
                var newInner = getNextInner(slideNumber);
                if (newInner) {
                    newInner.className = newInner.className + ' active';
                    /*$(newInner).bind('nextActivate', function(event, param1, param2) {
                     alert(event+ "\n" + param1 + "\n" + param2);
                     });*/
                    try {
                        // create event to trigger listener that can manage animations on the appearing elements
                        jQuery(newInner).trigger('nextActivated');
                    } catch (e) {
                    }
                    return slideNumber;
                } else {
                    // there is no next inactive inner item so we just go to the next slide
                    slideNumber++;
                    initializeInnerTransition(slideNumber);
                    goToSlide(slideNumber);
                    return slideNumber;
                }
            }
        }

        this.goToNextSlide = goToNextSlide;

        function getNextInner(slideNumber) {
            var slide = slides[slideNumber];
            var inners = slide.querySelectorAll('.next');
            var activeInners = slide.querySelectorAll('.next.active');
            var nbActiveInner = activeInners.length;
            return inners[nbActiveInner];
        }


        function rollbackInnerTransition(slideNumber) {
            // update new current slide according to innerTransition (all the inner must be displayed)
            if (slideList[slideNumber].hasInnerNavigation) {
                var activeNodes = slides[slideNumber].querySelectorAll('.next');
                for (var i = 0, ii = activeNodes.length; i < ii; i++) {
                    if (activeNodes[i].className.indexOf("active") == -1) {
                        activeNodes[i].className = activeNodes[i].className + " active";
                    }
                }
            }
        }

        function goToPreviousSlide(slideNumber) {
            // there is no inner navigation or it is not the slideshow view so we just go back to the previous slide
            if (!slideList[slideNumber].hasInnerNavigation || url.toString().indexOf("?full#") == -1) {
                // do nothing if slideNumber is smaller than 0
                if (slideNumber == 0) {
                    return -1;
                }
                slideNumber--;
                rollbackInnerTransition(slideNumber);
                goToSlide(slideNumber);
                return slideNumber
            } else {
                var activeNodes = slides[slideNumber].querySelectorAll('.next.active');
                var currentNode = activeNodes[activeNodes.length - 1];
                if (activeNodes.length > 1 && currentNode) {
                    try {
                        // create event to trigger listener that can manage animations on the disappearing elements
                        jQuery(currentNode).trigger('nextUnactivated');
                    } catch (e) {
                    }
                    currentNode.className = currentNode.className.substring(0, currentNode.className.length - " active".length);
                    return slideNumber;
                } else {
                    // there is no previous active inner item so we just go back to the previous slide
                    slideNumber--;
                    rollbackInnerTransition(slideNumber);
                    goToSlide(slideNumber);
                    return slideNumber
                }
            }
        }

        this.goToPreviousSlide = goToPreviousSlide;


        function fullscreen() {
            /* On Firefox + slide as cover  unable to switch to next slide.
             * You need to go to fullscreen, try to go to next slide, then go back to the previous slide and then the slides work fine.
             * */

            if (screenfull) {
                screenfull.request();
            }
        }


        function goStart() {
            initializeInnerTransition(0);
            goToSlide(0);
            selfPointer.notifyAllPlugin("START");
        }

        function goEnd() {
            rollbackInnerTransition(slideList.length - 1);
            goToSlide(slideList.length - 1);
            selfPointer.notifyAllPlugin("END");
        }

// Event handlers
        window.addEventListener('DOMContentLoaded', function () {
            if (!isListMode()) {
                // "?full" is present without slide hash, so we should display first slide
                if (-1 === getCurrentSlideNumber()) {
                    history.replaceState(null, null, url.pathname + '?full' + getSlideHash(0));
                }
                selfPointer.enterSlideMode();
                initializeInnerTransition(getCurrentSlideNumber());
                updateProgress(getCurrentSlideNumber());
            }
        }, false);


        window.addEventListener('popstate', function (e) {
            if (isListMode()) {
                selfPointer.enterListMode();
                scrollToCurrentSlide();
            } else {
                selfPointer.enterSlideMode();
            }
        }, false);

        window.addEventListener('resize', function (e) {
            if (!isListMode()) {
                applyTransform(getTransform());
            }
        }, false);

        function keyEventListener(e) {
            // Shortcut for alt, shift and meta keys
            if (e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }

            var currentSlideNumber = getCurrentSlideNumber();

            switch (e.which) {
                case 13: // Enter
                    if (isListMode()) {
                        e.preventDefault();
                        history.pushState(null, null, url.pathname + '?full' + getSlideHash(currentSlideNumber));
                        selfPointer.enterSlideMode();
                        updateProgress(currentSlideNumber);
                    }
                    break;

                case 27: // Esc
                    if (!isListMode()) {
                        e.preventDefault();
                        history.pushState(null, null, url.pathname + getSlideHash(currentSlideNumber));
                        selfPointer.enterListMode();
                        scrollToCurrentSlide();
                    }
                    break;

                case 33: // PgUp
                case 38: // Up
                case 37: // Left
                case 72: // h
                case 75: // k
                    e.preventDefault();
                    selfPointer.back.apply(selfPointer);
                    break;

                case 34: // PgDown
                case 40: // Down
                case 39: // Right
                case 76: // l
                case 74: // j
                    e.preventDefault();
                    selfPointer.forward.apply(selfPointer);
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
                    if (!e.shiftKey) {
                        currentSlideNumber += 1;
                        initializeInnerTransition(currentSlideNumber);
                    } else {
                        currentSlideNumber += -1;
                    }
                    goToSlide(currentSlideNumber);
                    selfPointer.notifyAllPlugin("SET_CURSOR", currentSlideNumber);
                    break;
                case 70: // f
                    e.preventDefault();
                    fullscreen();
                    break;
                default:
                // Behave as usual
            }
        }

        var orgX, newX;
        var tracking = false;

        function touchStartEvent(aEvent) {
            aEvent.preventDefault();
            tracking = true;
            orgX = aEvent.changedTouches[0].pageX;
        }

        function touchMoveEvent(aEvent) {
            if (!tracking) return;
            newX = aEvent.changedTouches[0].pageX;
            if (orgX - newX > 100) {
                tracking = false;
                selfPointer.forward();
            } else {
                if (orgX - newX < -100) {
                    tracking = false;
                    selfPointer.back();
                }
            }
        }

        document.addEventListener("touchstart", touchStartEvent, false);
        document.addEventListener("touchmove", touchMoveEvent, false);
        document.addEventListener('touchend', dispatchSingleSlideModeFromEvent, false);
        document.addEventListener('click', dispatchSingleSlideModeFromEvent, false);
        document.addEventListener('keydown', keyEventListener, false);

// functions that allow to interact with display script
        function notifyCurrentSlideNumber(message, args) {
            if (window.opener != null) {
                postMsg(window.opener, message, args);
            }
        }

        function getDetails(slideNumber) {
            if (document.body.className == "full") {
                try {
                    // the nth equals slideNumber+1 because the slide 0 is the first
                    slideNumber++;
                    var activeNodes = document.querySelectorAll(".slide:nth-of-type(" + slideNumber + ")");
                    var d = activeNodes[activeNodes.length - 1].querySelector("details");
                } catch (e) {
                    alert("Unable to get DOMElement.\nPlease check special characters on the id: " + getSlideHash(slideNumber))
                }
                return d ? d.innerHTML : "";
            } else {
                return "";
            }
        }

        function postMsg(aWin, aMsg) { // [arg0, [arg1...]]
            aMsg = [aMsg];
            for (var i = 2; i < arguments.length; i++) {
                aMsg.push(encodeURIComponent(arguments[i]));
            }
            aWin.postMessage(aMsg.join(" "), "*");
        }

        window.onmessage = function (aEvent) {
            var argv = aEvent.data.split(" "), argc = argv.length;
            argv.forEach(function (e, i, a) {
                a[i] = decodeURIComponent(e)
            });
            var win = aEvent.source;
            if (argv[0] === "REGISTER" && argc === 1) {
                postMsg(win, "REGISTERED", document.title, slides.length);
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "BACK" && argc === 1) {
                goToPreviousSlide(getCurrentSlideNumber());
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "FORWARD" && argc === 1) {
                goToNextSlide(getCurrentSlideNumber());
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "START" && argc === 1) {
                initializeInnerTransition(0);
                goToSlide(0);
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "END" && argc === 1) {
                rollbackInnerTransition(slideList.length - 1);
                goToSlide(slideList.length - 1);
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "SET_CURSOR" && argc === 2) {
                initializeInnerTransition(argv[1]);
                goToSlide(argv[1]);
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "GET_CURSOR" && argc === 1) {
                postMsg(win, "CURSOR", getCurrentSlideNumber());
            } else if (argv[0] === "GET_NOTES" && argc === 1) {
                postMsg(win, "NOTES", getDetails(getCurrentSlideNumber()));
            } else if (argv[0] === "LIST" && argc === 1) {
                if (!isListMode()) {
                    history.pushState(null, null, url.pathname + getSlideHash(getCurrentSlideNumber()));
                    selfPointer.enterListMode();
                    scrollToCurrentSlide();
                }
            } else if (argv[0] === "FULL" && argc === 1) {
                if (isListMode()) {
                    var slideNumber = getCurrentSlideNumber();
                    if (slideNumber == -1) {
                        slideNumber = 0;
                    }
                    dispatchSingleSlideMode(slideList[slideNumber].id)
                }
            } else if (argv[0] === "EMPTY_SLIDE") {
                emptySlide = document.createElement("section");
                emptySlide.className = "slide";
                emptySlide.id = "SLIDE_END";
                body.appendChild(emptySlide);
                slideList.push({
                    id:emptySlide.id,
                    hasInnerNavigation:false
                });
                slides = document.querySelectorAll('.slide');
            }
        };

// function that allow to interact with WebSocket script
        /*
         function notifyAllPlugin(message, previousSlideNumber, currentSlideNumber) {
         try {
         if (typeof(wsMaster) != 'undefined') {
         if (message == "FORWARD" && previousSlideNumber != currentSlideNumber) {
         message = "SET_CURSOR";
         previousSlideNumber = currentSlideNumber
         }
         var aMsg = [message, previousSlideNumber];
         for (var i = 2; i < arguments.length; i++) {
         aMsg.push(encodeURIComponent(arguments[i]));
         }
         wsMaster.send(aMsg.join(" "));
         }
         } catch (e) {
         }
         }
         */
    }
}