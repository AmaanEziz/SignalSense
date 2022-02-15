var $dropdown = $("#device-option");

$.getJSON('http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/api/node/list', function(data){
    console.log(data);

    $.each(data, function(){
        $dropdown.append($('<option />').val(this.id).text(`Node Device: ${this.location}`));
    });
});

function saveSelectedValue() {
    console.log();
    sessionStorage.setItem('nodeId', $dropdown.val());
}
