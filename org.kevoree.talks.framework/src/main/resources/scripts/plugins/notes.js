/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 08/09/12
 * Time: 13:32
 */
function KNotes () {
    var self = this;
    this.listener = function (message) {
        if (message.type === "NOTES") {
            document.querySelector("#notes > #content").innerHTML = this.notes = message.notes;
        }
    };

    this.start = function () {

    };
}
