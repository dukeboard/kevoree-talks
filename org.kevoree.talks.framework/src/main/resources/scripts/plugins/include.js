/**
 * Created with IntelliJ IDEA.
 * User: edaubert - erwan.daubert@gmail.com
 * Date: 27/02/2013
 * Time: 13:24
 */

function IncludePlugin(kslide) {
    var self = this;

    jQuery(document.body).on("INITIALIZE", function () {
//        console.log("initializing include plugin");
        var includes = jQuery(".includeHtml");
        var callbacks = [];
        //Load sub talk slides
        includes.each(function () {
            // avoid multiple load of same include
            if (jQuery(this).find("*").length == 0) {
                var callback = jQuery.Deferred();
                callbacks.push(callback);
                jQuery(this).load(this.id + ".html", function () {
                    callback.resolve();
                });
            }
        });
        var promise = jQuery.when.apply(null, callbacks).promise();
        promise.done(function () {
            jQuery(document.body).trigger("INITIALIZED");
        })

    });

    jQuery(document.body).on("RUN", function () {
        // following lines allow to display include content instead of black screen in slide mode (and select the slide in list mode)
        var anchor = kslide.getUrl().hash;
        kslide.getUrl().hash = '';
        kslide.getUrl().hash = anchor;
    });
}