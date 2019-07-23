import _ from 'lodash';
import { process } from './processor';
import { getToken, recognize } from './recognizer';

declare function require(name:string): any;
var atrament = require('atrament');

var sketcher = new atrament.Atrament('#sk8tchbook');

var requestObj = {
  "language": "en-US",
  "version": 1,
  "strokes": [] as any[]
};

var submit = async function() {
  const token = await getToken();
  var strokes = sketcher.strokes as any[];
  if (!strokes) {
    console.log("no strokes!");
    document.getElementById('output').innerHTML = "this\na\nlong\nlong\ntest";
    document.getElementById('response').innerHTML = "this\na\nlong\nlong\ntest";
    return;
  }
  var start = 212;
  requestObj.strokes = strokes.map((value, ix): any => {
    return {
        id: start + ix,
        points: value.join(",")
      }
  });
  recognize(token, requestObj, process);
}
var windowAny = window as any;
windowAny.submit = submit;

var handleClear = function() {
  sketcher.clear();
  sketcher.strokes = [];
  sketcher.path = [];
  document.getElementById('output').innerHTML = '';
  document.getElementById('response').innerHTML = '';
};
windowAny.handleClear = handleClear;