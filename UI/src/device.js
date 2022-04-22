var deviceId = sessionStorage.getItem('nodeId');
var selectedRow = 0;
var selectedLight = 0;
var $deviceLocation = $("#selected-device");
var $streamText = $("#streamBody");

var intersectionID = '';
$.getJSON(`https://signalsense.link/api/node/?nodeId=${deviceId}`, function(data){
    $.each(data, function(){
        console.log(this);
        console.log('intersection = ' + this.intersectionID);
        $deviceLocation.text(`${this.nodeDescription}`);
        intersectionID = this.intersectionID;
        $.getJSON(`https://signalsense.link/api/intersection/stream?intersectionID=${intersectionID}`, function(data){
            console.log(this);
            $.each(data, function(){
                var d = JSON.stringify(this)
                $streamText.text(`${d}`);
            });
        });
    });
});


$.getJSON(`https://signalsense.link/api/node/light?nodeId=${deviceId}` , function(data) {
    var tbl_body = document.createElement("tbody");
    $.each(data, function() {
        var tbl_row = tbl_body.insertRow();
        tbl_row.id = this.nodeID;
        tbl_row.setAttribute("data-bs-toggle","modal");
        tbl_row.setAttribute("data-bs-target","#myModal");
        $.each(this, function(k , v) {
            if(k=="lightPhase" || k=="lightRowID"){
                var cell = tbl_row.insertCell();
                cell.appendChild(document.createTextNode(v.toString()));
            }else if(k=='state'){ 
                var newV = "";
                switch (v){
                    case "1":
                        newV = "RED";
                        break;
                    case "2":
                        newV = "YELLOW";
                        break;
                    case "3":
                        newV = "GREEN";
                        break;    
                    case "0":
                        newV = "Light Not Found";
                        break;
                }
                var cell = tbl_row.insertCell();
                cell.appendChild(document.createTextNode(newV));
                }
        });
    });
    $("#light-table").append(tbl_body);   //DOM table doesn't have .appendChild
    addRowHandlers();
    updateArrowPhase(data);
});
 var imageSrc = `https://signalsense.link/api/node/getImage?nodeId=${deviceId}`;
 $('#intersection-img').attr("src", imageSrc);

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
        phaseLable.innerHTML = 'Phase ' + v.lightPhase;  // update phase number

        rowDiv.append(phaseLable);
        colDiv.append(rowDiv);
        arrowPhase.append(colDiv);
    });

}

function updatePhaseImg(dataValue) {
    var imgSource = "";
    var state = dataValue.state;
    switch (state){
        case '1':
            imgSource = "assets/straight-red.png";
            break;
        case '3':
            imgSource = "assets/straight-green.png";
            break;
        case '2':
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
					updateModal();
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
