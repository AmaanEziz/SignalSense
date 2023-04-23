var $dropdown = $("#device-option");

function saveSelectedValue() {
    var intersectionName = $('#device-option').find(":selected").text();
    document.cookie = "intersection=" + intersectionName;
    sessionStorage.setItem('nodeId', $("#device-option").val());
    
}
