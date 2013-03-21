/**
 * Created with IntelliJ IDEA.
 * User: edaubert - erwan.daubert@gmail.com
 * Date: 27/02/2013
 * Time: 13:24
 */

function IncludePlugin(kslide) {
    var self = this;

    this.listener = function (message) {
    };

    this.initialize = function () {
        var includes = jQuery(".includeHtml");
        var callbacks = [];
        //Load sub talk slides
        includes.each(function () {
            var callback = jQuery.Deferred();
            callbacks.push(callback);
            jQuery(this).load(this.id + ".html", function () {
                callback.resolve();
            });
        });
        return jQuery.when.apply(null, callbacks);

    };

    this.start = function () {
    };
}