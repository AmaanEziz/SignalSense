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
        let UP_ARROW_SRC ="data:image/png;base64,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"
        phaseImg.setAttribute("src", UP_ARROW_SRC);
        phaseImg.setAttribute("height", "100px");
        phaseImg.setAttribute("width", "100px");

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
