/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 08/09/12
 * Time: 16:56
 */
function KTime() {
    var self = this;

    var talkIsStarted = false;
    var talkStartTime = null;

    var talkTimeElement = null;
    var hoursElement = null;
    var minutesElement = null;
    var secondsElement = null;

    function startClock() {
        var addZero = function (num) {
            return num < 10 ? '0' + num : num;
        };
        setInterval(function () {
            var now = new Date();
            hoursElement.html(addZero(now.getHours()));
            minutesElement.html(addZero(now.getMinutes()));
            secondsElement.html(addZero(now.getSeconds()));
            if (talkIsStarted) {
                var time = now.getTime() - talkStartTime.getTime();
                var date = new Date(time);
                talkTimeElement.html(addZero(date.getUTCHours()) + ":" + addZero(date.getUTCMinutes()) + ":" + addZero(date.getUTCSeconds()));
            }
        }, 1000);
    }

    function talkTime() {
        talkIsStarted = !talkIsStarted;
        talkStartTime = new Date();
        if (talkIsStarted) {
            talkTimeElement.html("00:00:00");
        }
    }

    jQuery(document.body).on("RUN", function () {
        talkTimeElement = jQuery('#talk-time');
        hoursElement = jQuery("#hours");
        minutesElement = jQuery("#minutes");
        secondsElement = jQuery("#seconds");
        startClock();
        talkTimeElement.click(talkTime);
        talkTimeElement.on("touchstart", talkTime, false);
    });

}