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
    // console.log(data);
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
    updateArrowPhase(data);
});

function updateArrowPhase(data) {
    console.log(data);
    var arrowPhase = document.getElementById("arrow-phase");
    
    $.each(data, function(k, v) {
        var colDiv = document.createElement("div");
        colDiv.setAttribute("class", "col");

        var phaseImg = document.createElement("img");
        var phaseImgSource = updatePhaseImg(v);
        phaseImg.setAttribute("src", phaseImgSource);
        colDiv.append(phaseImg);

        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row");

        var phaseLable = document.createElement('h5');
        phaseLable.innerHTML = 'Phase ' + v.light_phase;  // update phase number

        rowDiv.append(phaseLable);
        colDiv.append(rowDiv);
        arrowPhase.append(colDiv);
    });

    // console.log(arrowPhase);
}

function updatePhaseImg(dataValue) {
    var imgSource = "";
    var state = dataValue.state;
    // console.log(state + ' ');
    switch (state){
        case 'RED':
            imgSource = "assets/straight-red.png";
            break;
        case 'GREEN':
            imgSource = "assets/straight-green.png";
            break;
        case 'YELLOW':
            imgSource = "assets/straight-yellow.png";
            break;
        case 'LEFT_RED':
            imgSource = "assets/left-red.png";
            break;
        case 'LEFT_GREEN':
            imgSource = "assets/left-green.png";
            break;
        case 'LEFT_YELLOW':
            imgSource = "assets/left-yellow.png";
            break;
        case 'RIGHT_RED':
            imgSource = "assets/right-red.png";
            break;
        case 'RIGHT_GREEN':
            imgSource = "assets/right-green.png";
            break;
        case 'RIGHT_YELLOW':
            imgSource = "assets/right-yellow.png";
            break;  
    }

    return imgSource;
}

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
