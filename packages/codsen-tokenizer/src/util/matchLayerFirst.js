import matchLayerLast from "./matchLayerLast";

function matchLayerFirst(str2, i, layers) {
  return matchLayerLast(str2, i, layers, true);
}

export default matchLayerFirst;
