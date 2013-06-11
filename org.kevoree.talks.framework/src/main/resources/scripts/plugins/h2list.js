/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 22/04/13
 * Time: 14:39
 *
 * @author Erwan Daubert
 * @version 1.0
 */
function H2List(kslide, toDisplayInAddition) {
    var self = this;

    jQuery(document.body).on("INITIALIZE", function () {
//        console.log("initializing h2list plugin");
        var slides = jQuery('* .slide.shout').has('h2.h2-list');
        var h2s = jQuery('* .slide.shout > h2.h2-list');
        slides.each(function (index, slide) {
            var h2ToAddBefore = [];
            var h2ToAddAfter = [];
            var addBefore = true;
            var child = null;
            var toNotDisplayBefore = index - Math.floor(toDisplayInAddition / 2);
            var toNotDisplayAfter = index + Math.ceil(toDisplayInAddition / 2);
            if (toNotDisplayBefore < 0) {
                toNotDisplayAfter = index + Math.ceil(toDisplayInAddition / 2) - toNotDisplayBefore;
            }
            if (toNotDisplayAfter >= h2s.length) {
                toNotDisplayBefore = toNotDisplayBefore - (toNotDisplayAfter - h2s.length + 1);
            }
            h2s.each(function (index2, h2) {
                if (index2 >= toNotDisplayBefore && index2 <= toNotDisplayAfter) {
                    if (!slide.contains(h2)) {
                        var clone = h2.cloneNode(true);
                        jQuery(clone).addClass('slave');
                        if (addBefore) {
                            h2ToAddBefore.push(clone);
                        } else {
                            h2ToAddAfter.push(clone);
                        }
                    } else {
                        child = h2;
                        addBefore = false;
                    }
                }
            });
            for (var i = 0; i < h2ToAddBefore.length; i++) {
                slide.insertBefore(h2ToAddBefore[i], child);
            }
            for (i = 0; i < h2ToAddAfter.length; i++) {
                slide.appendChild(h2ToAddAfter[i]);
            }
        });
        jQuery(document.body).trigger("INITIALIZED");
    });
}