var XMLHttpRequest = require('xhr2');
function roboflow_infer(url) {
    let roboflow_request_url =
        `https://detect.roboflow.com/traffic-signals-mcmpm/7?api_key=J75OVf8NP35SMck8OfdL&confidence=50&overlap=50&format=json&image=`+url;
    const Http = new XMLHttpRequest();
    Http.open("POST", roboflow_request_url);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}
