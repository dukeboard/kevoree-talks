/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 29/04/13
 * Time: 11:36
 *
 * @author Erwan Daubert
 * @version 1.0
 */
function Collapse(kslide) {
    this.listener = function (message) {
        if (message.type == "FORWARD") {
            var slide = kslide.getSlide().slide;
            var activeInners = getActiveInners(slide);
            var activeInner = activeInners[activeInners.length - 1];
            for (var i = activeInners.length - 2; i >= 0; i--) {
                if (activeInners[i].className.indexOf("collapse") != -1 && !isParentInner(activeInners[i], activeInner)) {
                    var childs = getChildLi(activeInners[i]);
                    for (var j = 0; j < childs.length; j++) {
                        jQuery(childs[j]).hide();
                    }
                }
            }
        } else if (message.type == "BACK") {
            var slide = kslide.getSlide().slide;
            var activeInners = getActiveInners(slide);
            var activeInner = activeInners[activeInners.length - 1];
            for (var i = activeInners.length - 2; i >= 0; i--) {
                if (activeInners[i].className.indexOf("collapse") != -1 && isParentInner(activeInners[i], activeInner)) {
                  var childs = getChildLi(activeInners[i]);
                    for (var j = 0; j < childs.length; j++) {
                        jQuery(childs[j]).show();
                    }
                }
            }
        }
    };
    this.initialize = function () {
    };
    this.start = function () {
    };

    function isParentInner(parent, potentialChild) {
        var childs = parent.querySelectorAll("li");
        for (var i = 0; i < childs.length; i++) {
            if (childs[i] == potentialChild) {
                return true;
            }
        }
        return false;
    }
    function getChildLi(inner) {
        return inner.querySelectorAll("li");
    }

    function getActiveInners(slide) {
        return slide.querySelectorAll('.next.active');
    }
}