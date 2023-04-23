var $dropdown = $("#device-option");

function saveSelectedValue() {
    sessionStorage.setItem('nodeId', $("#device-option").val());
}
