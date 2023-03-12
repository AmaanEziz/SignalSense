var $dropdown = $("#device-option");

$.getJSON('https://signalsense.link/api/node/list', function(data){
    $.each(data, function () {
        $("#device-option").append(`<option value=${this.nodeID}>${this.nodeDescription}</option>`)
    });
});

function saveSelectedValue() {
    sessionStorage.setItem('nodeId', $("#device-option").val());
}
