import "./createRequire.js";

var expect = require("chai").expect;
var XMLHttpRequest = require('xhr2');
function roboflow_infer(url) {
    let roboflow_request_url =
        `https://detect.roboflow.com/traffic-signals-mcmpm/7?api_key=J75OVf8NP35SMck8OfdL&confidence=50&overlap=50&format=json&image=` + url;
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.open('POST', roboflow_request_url);
        xhr.send();
    });
}

describe("Roboflow Infer", function () {
    it("Passes all red light URL", async function () {
        let ALL_RED_URL = `https://www.gannett-cdn.com/presto/2020/10/12/NFTU/bdc79f6e-cd7c-4e23-826d-2e4de1286fa7-TrafficSignal.jpg`
         roboflow_infer(ALL_RED_URL).then(ROBOFLOW_ALL_RED_RESPONSE => {
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[0].class).to.equal("red");
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[1].class).to.equal("red");
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[2].class).to.equal("left-red");
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[3].class).to.equal("left-red");

        });

    });
    it("Passes all green light URL", async function () {
        let ALL_GREEN_URL = `https://www.gannett-cdn.com/presto/2020/08/26/PSPR/0b690531-ac10-4cb0-8ff3-f7b3d455b8da-tGreen_lights00002.jpg?width=660&height=471&fit=crop&format=pjpg&auto=webp`
        roboflow_infer(ALL_GREEN_URL).then(ROBOFLOW_ALL_GREEN_RESPONSE => {
            expect(ROBOFLOW_ALL_GREEN_RESPONSE.pGREENictions[0].class).to.equal("green");
            expect(ROBOFLOW_ALL_GREEN_RESPONSE.predictions[1].class).to.equal("green");

        });

    });
    it("Passes all yellow light URL", async function () {
        let ALL_RED_URL = `https://www.pressenterprise.com/wp-content/uploads/migration/n22/n22p6k-syellowlight0610afdbbinary1054348.jpg?w=978`
        roboflow_infer(ALL_RED_URL).then(ROBOFLOW_ALL_RED_RESPONSE => {
            console.log(ROBOFLOW_ALL_RED_RESPONSE)
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[0].class).to.equal("red");
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[1].class).to.equal("red");
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[2].class).to.equal("left-red");
            expect(ROBOFLOW_ALL_RED_RESPONSE.predictions[3].class).to.equal("left-red");

        });

    });
})