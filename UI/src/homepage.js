var $dropdown = $("#device-option");

$.getJSON('https://signalsense.link/api/node/list', function(data){
    console.log(data);
    let ONLY_WORKING_NODE_ID ='8f65b638-c41b-11ec-a763-0242ac120002'
    $.each(data, function () {
        if (this.nodeID = ONLY_WORKING_NODE_ID) {
            $dropdown.append($('<option />').val(this.nodeID).text(`Device: ${this.nodeDescription}`));
        }
    });
});

function saveSelectedValue() {
    console.log();
    sessionStorage.setItem('nodeId', $dropdown.val());
}
