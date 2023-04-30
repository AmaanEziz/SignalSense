var deviceId = sessionStorage.getItem('nodeId');
var selectedRow = 0;
var selectedLight = 0;
var $deviceLocation = $("#selected-device");
var $streamText = $("#streamBody");
var stateUniNodeId = `8f65b638-c41b-11ec-a763-0242ac120002`
var isStateUni=deviceId==stateUniNodeId
var isHeritageHill = deviceId == "HeritageHill"
var isPowerInnRoad = deviceId == "PowerInnRoad"
var isTemple = deviceId == "Temple"

var isAllRed = (isStateUni || isHeritageHill|| isPowerInnRoad)
var intersectionID = '';
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
$deviceLocation.text(getCookie("intersection"));
console.log(getCookie("intersection"))


$.getJSON(`https://signalsense.link/api/node/light?nodeId=${stateUniNodeId}` , function(data) {
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
if (deviceId == stateUniNodeId) {
    var imageSrc = `https://signalsense.link/api/node/getImage?nodeId=${deviceId}`;
    $('#intersection-img').attr("src", imageSrc);
    $streamText.text(`0x000000400x000000040x00000004`);

}
if (deviceId == 'HeritageHill') {
    $('#intersection-img').attr("src", "https://i.ibb.co/jV9g8mc/Heritage-Hill.jpg");
    $streamText.text(`0x000000400x000000040x00000004`);

}
if (deviceId == "PowerInnRoad") {
    $('#intersection-img').attr("src", "https://i.ibb.co/0DYCjbC/Power-Inn-Road.jpg");
    $streamText.text(`0x000000400x000000040x00000004`);

}
if (deviceId == "Temple") {
    $('#intersection-img').attr("src", "https://i.ibb.co/nQJrSvp/Temple.jpg");
    $streamText.text(`0x000000010x00000001`);

}
deviceId = stateUniNodeId;
function updateArrowPhase(data) {
    var arrowPhase = document.getElementById("arrow-phase");
    
    $.each(data, function(k, v) {
        var colDiv = document.createElement("div");
        colDiv.setAttribute("class", "col");

        var phaseImg = document.createElement("img");
        let GREEN_UP_ARROW_SRC =" data:image/png;base64,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"
        let RED_UP_ARROW_SRC ="data:image/png;base64,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"
        if (deviceId == stateUniNodeId || deviceId == "HeritageHill") {
            phaseImg.setAttribute("src", RED_UP_ARROW_SRC);
            phaseImg.setAttribute("height", "100px");
            phaseImg.setAttribute("width", "100px");
        }
        if (isTemple) {
            phaseImg.setAttribute("src", GREEN_UP_ARROW_SRC);
            phaseImg.setAttribute("height", "100px");
            phaseImg.setAttribute("width", "100px");
        }
        colDiv.append(phaseImg);

        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row");

        var phaseLable = document.createElement('h5');
        if (deviceId == stateUniNodeId) {
            phaseLable.innerHTML = 'Phase 1'
        }
        if (isTemple) {
            phaseLable.innerHTML = 'Phase 2'
            if (isTemple) {
                $("#light-table tbody tr").each((index, tr) => {
                    if (index == 2) {
                        $(tr).remove()
                    }
                    console.log($(tr).find("td:eq(2)"))
                    $(tr).find("td:eq(2)").text("GREEN")
                })

            }
            $("#arrow-phase div").each((index, div) => {
                console.log(div)
                if (index == 2) {
                    $(div).remove()
                }
            })
        }

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
					updateModal();
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}

function updateModal(){
    
var $selRow = $("#selected-row");
$selRow.text(selectedRow);

}
console.log("is temple? "+isTemple)
if (isTemple) {
    $("#light-table tbody tr").each((index, tr) => {
        if (index == 2) {
            $(tr).remove()
        }
    })
}