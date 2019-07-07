import { RecognitionResponse, RecognitionResult, Rectangle } from './recognizer';
import { getDeployment, getService } from './k8s';

function hasOverlap(r1: Rectangle, r2: Rectangle): boolean {
    return r1.topY > r2.topY && r1.topY < r2.topY + r2.height;
}

function overlaps(o1: RecognitionResult, o2: RecognitionResult): boolean {
    return hasOverlap(o1.boundingRectangle, o2.boundingRectangle) ||
        hasOverlap(o2.boundingRectangle, o1.boundingRectangle);
}

function calculateLayers(elts: RecognitionResult[]): RecognitionResult[][] {
    var layers: RecognitionResult[][] = [];
    for (var i = 0; i < elts.length; i++) {
        var found = false;
        for (var j = 0; j < layers.length; j++) {
            if (overlaps(layers[j][0], elts[i])) {
                layers[j].push(elts[i]);
                found = true;
                break;
            }
        }
        if (!found) {
            layers.push([elts[i]]);
        }
    }
    layers.sort((a: RecognitionResult[], b: RecognitionResult[]): number => {
        return a[0].boundingRectangle.topY - b[0].boundingRectangle.topY;
    });
    return layers;
}

function findName(layer: RecognitionResult[]): string | null {
    for (var i = 0; i < layer.length; i++) {
        if (layer[i].category === 'inkWord') {
            return layer[i].recognizedText;
        }
    }
    return null;
}

export function process(obj: RecognitionResponse) {
    console.log(obj);

    var layers = calculateLayers(obj.recognitionUnits);
    var output = document.getElementById('output');
    output.innerHTML = 'There are ' + layers.length + ' layers ' +
        layers.map((layer: RecognitionResult[]) => '' + layer.length).join(',');
  
    var objects: string[] = [];
    var replicas = 0;
    obj.recognitionUnits.forEach((elt: RecognitionResult) => {
      objects.push(elt.recognizedObject);
      if (elt.recognizedObject === "square" || elt.recognizedObject === "rectangle") {
          replicas++;
      }
    });

    var objs = '';
    var deployment = getDeployment();
    deployment.spec.replicas = replicas;
    objs = JSON.stringify(deployment, null, 2);
    if (layers.length > 1) {
        var service = getService();
        var name = findName(layers[0]);
        if (name) {
            service.metadata.name = name;
            deployment.metadata.name = name + '-deployment';
        }
        objs += '\n' + JSON.stringify(service, null, 2);
    }
    document.getElementById('response').innerHTML = objs;
  }
  