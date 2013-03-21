function KSlideShowKeynote() {

    var pluginListeners = [];

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
        var promise = jQuery.when.apply(null, callbacks);
        promise.then(function () {
            if (pluginListeners) {
                for (var i = 0; i < pluginListeners.length; i++) {
                    try {
                        pluginListeners[i].listener.start();
                    } catch (e) {
                        console.error("Unable to execute the method 'start' on " + pluginListeners[i].listener, e)
                    }
                }
            }
        });
    };


    this.sendEvent = function (listener, message) {
        if (pluginListeners) {
            for (var i = 0; i < pluginListeners.length; i++) {
                if (pluginListeners[i].listener != listener) {
                    try {
                        pluginListeners[i].listener.listener(message);
                    } catch (e) {
                        console.error("Unable to execute the method 'listener' on " + pluginListeners[i].listener, e)
                    }
                }

            }
        }
    };

    this.addPluginListener = function (f) {
        pluginListeners.push({
            id: pluginListeners.length,
            listener: f
        });
    };
}