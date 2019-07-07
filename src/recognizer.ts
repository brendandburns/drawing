export class Point {
    public x: number;
    public y: number;
}

export class Rectangle {
    public topX: number;
    public topY: number;
    public height: number;
    public width: number;
}

export class RecognitionResult {
    public boundingRectangle: Rectangle;
    public category: string;
    public center: Point;
    public class: string;
    public confidence: number;
    public id: number;
    public parentId: number;
    public points: Point[];
    public recognizedObject: string;
    public recognizedText: string;
    public rotationAngle: number;
    public rotatedBoundingRectangle: Point[];
    public strokeIds: number[];
}

export class RecognitionResponse {
    public recognitionUnits: RecognitionResult[];
}

function returnFunction(xhttp: XMLHttpRequest, fn: (obj: RecognitionResponse) => void) {
    var response = JSON.parse(xhttp.responseText);
    fn(response);
}

function errorFunction(xhttp: XMLHttpRequest) {
    console.log("Error: %s, Detail: %s", xhttp.status, xhttp.responseText);
}

export function recognize(requestObj: any, fn: (obj: RecognitionResponse) => void) {
    var SERVER_ADDRESS = "https://api.cognitive.microsoft.com";
    var ENDPOINT_URL = SERVER_ADDRESS + "/inkrecognizer/v1.0-preview/recognize";
    var SUBSCRIPTION_KEY = (document.getElementById("subkey") as any).value;

    if (SUBSCRIPTION_KEY === "") {
        window.alert("Please change the subscriptionKey variable by a valid key!");
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                returnFunction(xhttp, fn);
            } else {
                errorFunction(xhttp);
            }
        }
    };
    xhttp.open("PUT", ENDPOINT_URL, true);
    xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
    xhttp.setRequestHeader("content-type", "application/json");
    xhttp.send(JSON.stringify(requestObj));
}
