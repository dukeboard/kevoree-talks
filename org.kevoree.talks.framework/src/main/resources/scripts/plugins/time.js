/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 08/09/12
 * Time: 16:56
 */
function KTime () {
    var self = this;

    var talkIsStarted = false;
    var talkStartTime = null;

    this.listener = function () {

    };

    function startClock () {
        var addZero = function (num) {
            return num < 10 ? '0' + num : num;
        };
        setInterval(function () {
            var now = new Date();
            document.querySelector("#hours").innerHTML = addZero(now.getHours());
            document.querySelector("#minutes").innerHTML = addZero(now.getMinutes());
            document.querySelector("#seconds").innerHTML = addZero(now.getSeconds());
            if (talkIsStarted) {
                var time = now.getTime() - talkStartTime.getTime();
                var date = new Date(time);
                document.querySelector("#talk-time").innerHTML = addZero(date.getUTCHours()) + ":" + addZero(date.getUTCMinutes()) + ":" + addZero(date.getUTCSeconds());
            }
        }, 1000);
    }

    function talkTime () {
        talkIsStarted = !talkIsStarted;
        talkStartTime = new Date();
        if (talkIsStarted) {
            document.querySelector('#talk-time').innerHTML = "00:00:00";
        }
    }

    this.start = function () {
        startClock();
        document.querySelector('#talk-time').addEventListener("touchstart", talkTime, false);
        document.querySelector('#talk-time').addEventListener("click", talkTime, false);
    };

}