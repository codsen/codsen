// returns found object's index in "layers" array
function getLastEspLayerObjIdx(layers) {
  if (layers && layers.length) {
    // traverse layers backwards
    for (let z = layers.length; z--; ) {
      if (layers[z].type === "esp") {
        return z;
      }
    }
  }
  return undefined;
}

export default getLastEspLayerObjIdx;
