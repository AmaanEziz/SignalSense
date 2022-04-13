var $dropdown = $("#device-option");

$.getJSON('https://signalsense.link/api/node/list', function(data){
    console.log(data);

    $.each(data, function(){
        $dropdown.append($('<option />').val(this.nodeID).text(`Node Device: ${this.nodeDescription}`));
    });
});

function saveSelectedValue() {
    console.log();
    sessionStorage.setItem('nodeId', $dropdown.val());
}
