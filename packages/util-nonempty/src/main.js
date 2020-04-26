import isPlainObject from "lodash.isplainobject";

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}

function nonEmpty(input) {
  if (arguments.length === 0 || input === undefined) {
    return false;
  }
  if (isArr(input) || isStr(input)) {
    return input.length > 0;
  }
  if (isPlainObject(input)) {
    return Object.keys(input).length > 0;
  }
  if (isNum(input)) {
    return true;
  }
  return false;
}

export default nonEmpty;
