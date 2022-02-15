/*!
* Start Bootstrap - Bare v5.0.7 (https://startbootstrap.com/template/bare)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var selectValue = "";

// This method won't work if move to next page. 
// Need API like do some Get method and passing selected device throung the URl Like: signalsense.com/index.html?deviceID=01
function saveSelectedValue (selectValue) {
    const element = document.getElementById("device-option");
    var value = element.options[element.selectedIndex].text;
    if (value!== "Select Devices") {
        selectValue = value
    } else selectValue = "";
    console.log(selectValue);
    return selectValue;
    
}

console.log(selectValue);

// var element = document.getElementById("device-option");
// console.log(element);

// selectValue = element.options[element.selectedIndex].text;
// console.log(selectValue);

// var title = document.getElementById("selected-device");
// title.textContent = selectValue;
// console.log(title.textContent)

// console.log(selectValue);

// var title = document.getElementById("selected-device");
// title.textContent = selectValue;
// console.log(title.textContent)

// function greeting () {
//     const e = document.getElementById("selected-device")
//     console.log(e);
//     e.textContent += selectValue;
// }
// var title = document.getElementById("selected-device");
// console.log(title);
// h1.textContent += selectValue;
// console.log(h1.textContent);
// Check if such header actually exists
// if (h1) {
//   h1.innerHTML = greeting();
// }