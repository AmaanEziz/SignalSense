var deviceId = sessionStorage.getItem('nodeId');
var selectedRow = 0;
var selectedLight = 0;




var $deviceLocation = $("#selected-device");
$.getJSON(`https://signalsense.link/api/node/?nodeId=${deviceId}`, function(data){
    console.log(`https://signalsense.link/api/node/?nodeId=${deviceId}`);


    $.each(data, function(){
        $deviceLocation.text(`${this.location}`);
    });
});

$.getJSON(`https://signalsense.link/api/node/light?nodeId=${deviceId}` , function(data) {
    console.log(data);
    var tbl_body = document.createElement("tbody");
    $.each(data, function() {
        var tbl_row = tbl_body.insertRow();
        tbl_row.id = this.id;
        tbl_row.onclick = 'chooseRow()';
        $.each(this, function(k , v) {
            if(k!="id"){
                var cell = tbl_row.insertCell();
                cell.appendChild(document.createTextNode(v.toString()));
            }
        });                      
    });
    $("#light-table").append(tbl_body);   //DOM table doesn't have .appendChild
    addRowHandlers();
});

function changePhase(){

    var phaseNum = $('#newPhaseId').val();
    $.ajax({
        type: "PATCH",
        url: "https://signalsense.link/api/node/light",
        data: JSON.stringify({id : selectedLight, light_phase : phaseNum }),
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: "true",
        success: function (response) {
            location.reload();
        },
        error: function (response) {
            alert(response.status + ' ' + response.statusText);
        }

    }
    );
};

function chooseRow(){
    alert('I AM THE ONE!');
}


function addRowHandlers() {
    var table = document.getElementById("light-table");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
                                        selectedRow = id;
                                        selectedLight = row.id;
                                        console.log(selectedLight);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}

function updateModal(){
    
var $selRow = $("#selected-row");
$selRow.text(selectedRow);
console.log(`selectedLight: ${selectedLight}`);

}
