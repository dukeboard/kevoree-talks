/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 08/09/12
 * Time: 13:15
 */
function KSlideCount (kslide) {
    var self = this;
    this.listener = function (message) {
        if (message.type === "LENGTH") {
            document.querySelector("#slidecount").innerHTML = message.length;
        } else if (message.type === "CURSOR") {
            document.querySelector('#slideidx').innerHTML = +message.cursor + 1;
            document.querySelector('#nextslideidx').innerHTML = +message.cursor == (+(document.querySelector("#slidecount").innerHTML) - 1) ? "END" : (+message.cursor + 2);
        }
    };

    this.start = function () {
        document.querySelector('#slideidx').addEventListener("touchstart", setCursor, false);
        document.querySelector('#slideidx').addEventListener("click", setCursor, false);
    };

    function setCursor (event) {
        kslide.sendEvent(this, {"type":"SET_CURSOR", "cursor":+prompt('Go to slide...', '1') - 1});
    }

    this.initialize = function () {};
}
