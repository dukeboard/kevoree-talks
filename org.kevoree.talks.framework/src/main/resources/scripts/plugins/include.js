/**
 * Created with IntelliJ IDEA.
 * User: edaubert - erwan.daubert@gmail.com
 * Date: 27/02/2013
 * Time: 13:24
 */

function IncludePlugin (kslide) {
    var self = this;

    this.listener = function (message) {
    };

    this.start = function () {
        //Load sub talk slides
        jQuery(".includeHtml").each(function (i) {
            jQuery(this).load(this.id + ".html");
        });
    }
    }