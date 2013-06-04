function KSlideShow() {

    var url = window.location;
    var body = document.body;
    var slides = null;
    var slideList = [];
    var self = this;

    var lastOrderedListener = null;

    this.hasInnerNavigation = function (slideNumber) {
        return slideList[slideNumber].hasInnerNavigation;
    };

    function initializeSlidesList() {
        slideList = [];
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

    this.buildURL = function (slideMode, pathName, slideNumber) {
        var url = pathName;
        if (slideMode) {
            url = url + "?slide";
        }
        return  url + self.getSlideHash(slideNumber);
    };

    this.startKeynote = function () {
        jQuery(body).trigger("INITIALIZE");
        initializeSlidesList();
        jQuery(body).trigger("RUN");

        // TODO wait the end of intiialization
        // TODO how to ensure that start is call after all listener execute its initialize method ?
        /*jQuery.when(lastOrderedListener).then(function () {
         jQuery(body).trigger("RUN")
         });*/
    };

    this.getUrl = function () {
        return url;
    };

    this.getBody = function () {
        return body;
    };

    // TODO replace json by the object asked
    this.getNotes = function () {
        return {"type": "NOTES", "notes": self.getDetails(self.getCurrentSlideNumber())};
    };

    this.getLength = function () {
        return {"type": "LENGTH", "length": slideList.length};
    };

    this.getCursor = function () {
        return {"type": "CURSOR", "cursor": self.getCurrentSlideNumber()};
    };

    this.getSlide = function () {
        return {"type": "SLIDE", "slide": slides[self.getCurrentSlideNumber()]};
    };

    this.isSlideMode = function () {
        return !self.isListMode();
    };

    this.isListMode = function () {
        return 'slide' !== url.search.substr(1);
    };

    this.getCurrentSlideNumber = function () {
        var currentSlideId = url.hash.substr(1);
        for (var i = 0; i < slideList.length; ++i) {
            if (currentSlideId === slideList[i].id) {
                return i;
            }
        }
        return -1;
    };

    function scrollToCurrentSlide() {
        // do nothing if currentSlideNumber is unknown (-1)
        if (-1 === self.getCurrentSlideNumber()) {
            return;
        }
        var currentSlide = document.getElementById(slideList[self.getCurrentSlideNumber()].id);

        if (null != currentSlide) {
            window.scrollTo(0, currentSlide.offsetTop);
        }
    }

    function addEmptySlide(position) {
        if (position != undefined) {
            var emptySlide = document.createElement("section");
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


    function normalizeSlideNumber(slideNumber) {
        if (0 > slideNumber) {
            return slideList.length - 1;
        } else if (slideList.length <= slideNumber) {
            return 0;
        } else {
            return slideNumber;
        }
    }

    this.getSlideHash = function (slideNumber) {
        return '#' + slideList[normalizeSlideNumber(slideNumber)].id;
    };

    this.getTransform = function () {
        var denominator = Math.max(
            (body.clientWidth / window.innerWidth),
            (body.clientHeight / window.innerHeight)
        );
        return 'scale(' + (1 / denominator) + ')';
    };

    this.applyTransform = function (transform) {
        body.style.WebkitTransform = transform;
        body.style.MozTransform = transform;
        body.style.msTransform = transform;
        body.style.OTransform = transform;
        body.style.transform = transform;
    };
}