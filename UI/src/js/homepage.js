var $dropdown = $("#device-option");

$.getJSON('https://signalsense.link/api/node/list', function (data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].nodeID == `8f65b638-c41b-11ec-a763-0242ac120002`) {
            $("#device-option").append(`<option value=${data[i].nodeID}>${data[i].nodeDescription}</option>`)
        }
    }
    $("#device-option").append(`<option value="HeritageHill">Heritage Hill Drive</option>`)
    $("#device-option").append(`<option value="PowerInnRoad">Power Inn Road</option>`)
    $("#device-option").append(`<option value="Temple">Temple Drive</option>`)


});
console.log(`<option value="HeritageHill">Heritage Hill Drive</option>`)
console.l

function saveSelectedValue() {
    sessionStorage.setItem('nodeId', $("#device-option").val());
}
