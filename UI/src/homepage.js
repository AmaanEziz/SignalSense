var $dropdown = $("#device-option");

$.getJSON('https://signalsense.link/api/node/list', function(data){
    console.log(data);

    $.each(data, function(){
        $dropdown.append($('<option />').val(this.id).text(`Node Device: ${this.location}`));
    });
});

function saveSelectedValue() {
    console.log();
    sessionStorage.setItem('nodeId', $dropdown.val());
}
