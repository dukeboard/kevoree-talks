function KSlideShow() {

    var url = null;
    var body = null;
    var slides = null;
    var progress = null;
    var slideList = [];
    var emptySlide = null;
    var orderedpluginListeners = [];
    var pluginListeners = [];
    var self = this;

    function initializeSlidesList() {
        slides = jQuery('* .slide');
        slides.each(function (index, slide) {
            if (!slide.id) {
                slide.id = index;
            }
            slideList.push({
                id: slide.id,
                hasInnerNavigation: null !== slide.querySelector('.next')
            });
        });
    }

    function initializeOrderedListeners(index, lastCallback, previousCallback) {
        if (index < orderedpluginListeners.length) {
            try {
                var newCallback = orderedpluginListeners[index].listener.initialize();
                if (newCallback) {
                    var callbacks = [];
                    callbacks.push(newCallback);
                    var promise = jQuery.when.apply(null, callbacks);
                    if (index + 1 < orderedpluginListeners.length) {
                        promise.then(function () {
                            initializeOrderedListeners(index + 1, lastCallback, promise);
                        });
                    } else {
                        promise.then(function () {
                            lastCallback.resolve();
                        });
                    }
                } else {
                    if (index + 1 < orderedpluginListeners.length) {
                        initializeOrderedListeners(index + 1, lastCallback, previousCallback);
                    } else if (previousCallback) {
                        previousCallback.then(function () {
                            lastCallback.resolve();
                        });
                    } else {
                        lastCallback.resolve();
                    }

                }
            } catch (e) {
                console.error(e.message);
                console.warn("Unable to execute the method 'initialize' on ", pluginListeners[index].listener);
            }
        } else {
            lastCallback.resolve();
        }
    }

    this.startKeynote = function () {
        var callbacks = [];
        if (pluginListeners) {
            for (var i = 0; i < pluginListeners.length; i++) {
                try {
                    var callback = pluginListeners[i].listener.initialize();
                    if (callback) {
                        callbacks.push(callback);
                    }

                } catch (e) {
                    console.error(e.message);
                    console.warn("Unable to execute the method 'initialize' on ", pluginListeners[i].listener);
                }
            }
        }

        if (orderedpluginListeners) {
            callback = jQuery.Deferred();
            initializeOrderedListeners(0, callback);
            callbacks.push(callback);
        }

        var promise = jQuery.when.apply(null, callbacks);
        promise.then(function () {
            window.addEventListener('resize', function () {
                if (!isListMode()) {
                    applyTransform(getTransform());
                }
            }, false);
            url = window.location;
            body = document.body;
            progress = document.querySelector('div.progress div');
            initializeSlidesList();

            if (!isListMode()) {
                goToFull();
            }

            // following lines allow to display include content instead of black screen in slide mode (and select the slide in list mode)
            var anchor = url.hash;
            url.hash = '';
            url.hash = anchor;

            if (pluginListeners) {
                for (var i = 0; i < pluginListeners.length; i++) {
                    try {
                        pluginListeners[i].listener.start();
                    } catch (e) {
                        console.error(e.message);
                        console.warn("Unable to execute the method 'start' on ", pluginListeners[i].listener);
                    }
                }
            }
        })
    };

    this.getNotes = function () {
        return {"type": "NOTES", "notes": getDetails(getCurrentSlideNumber())};
    };

    this.getLength = function () {
        return {"type": "LENGTH", "length": slideList.length};
    };

    this.getCursor = function () {
        return {"type": "CURSOR", "cursor": getCurrentSlideNumber()};
    };

    this.sendEvent = function (sender, message) {
        var response = null;
        if (message.type === "BACK") {
            back();
        } else if (message.type === "FORWARD") {
            forward();
        } else if (message.type === "START") {
            goToStart();
        } else if (message.type === "END") {
            goToEnd();
        } else if (message.type === "FULLSCREEN") {
            fullscreen()
        } else if (message.type === "EMPTY_SLIDE") {
            addEmptySlide(message.position);
        } else if (message.type === "SET_CURSOR") {
            initializeInnerTransition(message.cursor);
            goToSlide(message.cursor);
        } else if (message.type === "SET_ID") {
            if ('' !== message.id && isListMode()) {
                url.hash = '#' + message.id;
            }
        } else if (message.type === "FULL") {
            goToFull();
        } else if (message.type === "LIST") {
            goToList();
        }
        if (pluginListeners) {
            for (var i = 0; i < pluginListeners.length; i++) {
                if (pluginListeners[i].listener != sender) {
                    try {
                        pluginListeners[i].listener.listener(message);
                    } catch (e) {
                        console.error(e.message);
                        console.warn("Unable to execute the method 'listener' on ", pluginListeners[i].listener)
                    }
                }

            }
        }
        return response;
    };

    /**
     * register a listener to KSlideshow
     * @param listener the listener to regsiter
     * @param ordered true if the listener need to be initialize following the order in which the listeners were added, false, if order doesn't matter
     */
    this.addPluginListener = function (listener, ordered) {
        if (ordered) {
            orderedpluginListeners.push({
                id: orderedpluginListeners.length,
                listener: listener
            });
        } else {
            pluginListeners.push({
                id: pluginListeners.length,
                listener: listener
            });
        }
    };

    function getCurrentSlideNumber() {
        var currentSlideId = url.hash.substr(1);
        for (var i = 0; i < slideList.length; ++i) {
            if (currentSlideId === slideList[i].id) {
                return i;
            }
        }
        return -1;
    }

    function back() {
        goToPreviousSlide(getCurrentSlideNumber());
    }

    function forward() {
        goToNextSlide(getCurrentSlideNumber());
    }

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

    function addEmptySlide(position) {
        if (position != undefined) {
            emptySlide = document.createElement("section");
            emptySlide.className = "slide";
            emptySlide.id = "EMPTY_SLIDE_" + position;
            // look for the position+1 th element on body
            var node = body.querySelector(".slide:nth-of-type(" + (+position + 1) + ")");
            if (node != null) {
                body.insertBefore(emptySlide, node);
            } else {
                body.appendChild(emptySlide);
            }
            initializeSlidesList();
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
        if (null === progress) {
            return;
        }
        var slide = slides[slideNumber];
        if (slide.className.indexOf("cover") == -1 && slide.className.indexOf("shout") == -1) {
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

    function goToList() {
        history.pushState(null, null, url.pathname + getSlideHash(getCurrentSlideNumber()));
        enterListMode();
        scrollToCurrentSlide();
    }

    function goToFull() {
        // there is no slide selected, we select the first one
        if (-1 === getCurrentSlideNumber()) {
            url.hash = getSlideHash(0);
            history.replaceState(null, null, url.pathname + '?full' + getSlideHash(0));
        } else {
            history.replaceState(null, null, url.pathname + '?full' + getSlideHash(getCurrentSlideNumber()));
        }
        initializeInnerTransition(getCurrentSlideNumber());
        enterSlideMode();
        updateProgress(getCurrentSlideNumber());
    }

    function enterSlideMode() {
        body.className = 'full';
        applyTransform(getTransform());
    }

    function enterListMode() {
        body.className = 'list';
        applyTransform('none');
    }

    function getTransform() {
        var denominator = Math.max(
            (body.clientWidth / window.innerWidth),
            (body.clientHeight / window.innerHeight)
        );
        return 'scale(' + (1 / denominator) + ')';
    }

    function applyTransform(transform) {
        body.style.WebkitTransform = transform;
        body.style.MozTransform = transform;
        body.style.msTransform = transform;
        body.style.OTransform = transform;
        body.style.transform = transform;
    }

    function initializeInnerTransition(slideNumber) {
        if (slideNumber === undefined || slideNumber < 0 || slideNumber >= slideList.length) {
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

    function fullscreen() {
        /* On Firefox + slide as cover  unable to switch to next slide.
         * You need to go to fullscreen, try to go to next slide, then go back to the previous slide and then the slides work fine.
         * */

        if (screenfull) {
            screenfull.request();
        }
    }

    function goToStart() {
        initializeInnerTransition(0);
        goToSlide(0);
    }

    function goToEnd() {
        rollbackInnerTransition(slideList.length - 1);
        goToSlide(slideList.length - 1);
    }

    function getDetails(slideNumber) {
        if (document.body.className == "full") {
            // the nth equals slideNumber+1 because the slide 0 is the first
            slideNumber++;
            if (slideNumber <= slides.length) {
                var slide = slides[slideNumber];
                var d;
                if (slide) {
                    d = slide.querySelector("details");
                }
            }
            return d ? d.innerHTML : "";
        } else {
            return "";
        }
    }
}