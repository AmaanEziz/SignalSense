var $dropdown = $("#device-option");

function saveSelectedValue() {
    var intersectionName = $('#device-option').find(":selected").text();
    document.cookie = "intersection=" + intersectionName;
    sessionStorage.setItem('nodeId', $("#device-option").val());
    
}

<html>
<body>
   <h2>Using the <i>input event</i> to change a background color via color picker</h2>
   <input id = "colorInput" type = "color">
   <script>
      let colorInput = document.getElementById('colorInput');
      colorInput.addEventListener('input', () =>{
         document.body.style.backgroundColor = colorInput.value;
      });
   </script>
</body>
</html>
