import _ from 'lodash';
var atrament = require('atrament');

var sketcher = new atrament.Atrament('#sk8tchbook');

var requestObj = {
  "language": "en-US",
  "version": 1,
  "strokes": []
};

function process(obj) {
  obj.recognizerUnits
}

function returnFunction(xhttp) {
  var response = JSON.parse(xhttp.responseText);
  document.getElementById('response').innerHTML = JSON.stringify(response, null, 2);
  process(response);
}

function errorFunction(xhttp) {
  console.log("Error: %s, Detail: %s", xhttp.status, xhttp.responseText);
}

function callRecognizer() {
  var SERVER_ADDRESS = "https://api.cognitive.microsoft.com";
  var ENDPOINT_URL = SERVER_ADDRESS + "/inkrecognizer/v1.0-preview/recognize";
  var SUBSCRIPTION_KEY = document.getElementById("subkey").value;

  if (SUBSCRIPTION_KEY === "") {
    window.alert("Please change the subscriptionKey variable by a valid key!");
    return;
  }
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        returnFunction(xhttp);
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

var submit = function() {
  var strokes = sketcher.strokes;
  var start = 212;
  for (var i = 0; i < strokes.length; i++) {
    sampleJson.strokes.push({
      "id": start + i,
      points: strokes[i].join(",")
    })
  }
  callRecognizer();
}
window.submit = submit;

var handleClear = function() {
  sketcher.clear();
  sketcher.strokes = [];
  sketcher.path = [];
};
window.handleClear = handleClear;