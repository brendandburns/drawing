import _ from 'lodash';
import { process } from './processor';
import { recognize } from './recognizer';

declare function require(name:string): any;
var atrament = require('atrament');

var sketcher = new atrament.Atrament('#sk8tchbook');

var requestObj = {
  "language": "en-US",
  "version": 1,
  "strokes": [] as any[]
};

var submit = function() {
  var strokes = sketcher.strokes as any[];
  var start = 212;
  requestObj.strokes = strokes.map((value, ix): any => {
    return {
        id: start + ix,
        points: value.join(",")
      }
  });
  recognize(requestObj, process);
}
var windowAny = window as any;
windowAny.submit = submit;

var handleClear = function() {
  sketcher.clear();
  sketcher.strokes = [];
  sketcher.path = [];
};
windowAny.handleClear = handleClear;