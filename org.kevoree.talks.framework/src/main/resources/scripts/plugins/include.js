/**
 * Created with IntelliJ IDEA.
 * User: edaubert - erwan.daubert@gmail.com
 * Date: 27/02/2013
 * Time: 13:24
 */

function IncludePlugin(kslide) {
    var self = this;

    jQuery(kslide.getBody()).on("INITIALIZE", function () {
        self.initialize();
    });

    this.initialize = function () {
        console.log("initialize include plugin");
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
        // following lines allow to display include content instead of black screen in slide mode (and select the slide in list mode)
        var anchor = kslide.getUrl().hash;
        kslide.getUrl().hash = '';
        kslide.getUrl().hash = anchor;
    };
}