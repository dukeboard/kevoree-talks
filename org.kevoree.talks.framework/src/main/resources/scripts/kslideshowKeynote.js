function KSlideShowKeynote () {

    var pluginListeners = [];

    this.startKeynote = function () {
        if (pluginListeners) {
            for (var i = 0; i < pluginListeners.length; i++) {
                try {
                    pluginListeners[i].listener.start();
                } catch (e) {
                    console.error("Unable to execute the method 'start' on " + pluginListeners[i].listener, e)
                }
            }

        }
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
            id:pluginListeners.length,
            listener:f
        });
    };
}