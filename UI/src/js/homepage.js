var $dropdown = $("#device-option");

$.getJSON('https://signalsense.link/api/node/list', function(data){
    let ONLY_WORKING_NODE_ID ='8f65b638-c41b-11ec-a763-0242ac120002'
    $.each(data, function () {
        console.log($("#device-option"))
        $("#device-option").append(`<option value=${this.nodeID}>${this.nodeDescription}</option>`)
    });
});

function saveSelectedValue() {
    sessionStorage.setItem('nodeId', $("#device-option").val());
}
