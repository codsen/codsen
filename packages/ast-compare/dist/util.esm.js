import type from 'type-detect';

const isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isObj(something) {
  return type(something) === "Object";
}
function isStr(something) {
  return type(something) === "string";
}
function isNum(something) {
  return type(something) === "number";
}
function isBool(something) {
  return type(something) === "boolean";
}
function isNull(something) {
  return something === null;
}
function isBlank(something) {
  if (isObj(something)) {
    return Object.keys(something).length === 0;
  } else if (isArr(something) || isStr(something)) {
    return something.length === 0;
  }
  return false;
}
function isTheTypeLegit(something) {
  return (
    isObj(something) ||
    isStr(something) ||
    isNum(something) ||
    isBool(something) ||
    isArr(something) ||
    isNull(something)
  );
}

export { existy, isBlank, isBool, isNull, isNum, isObj, isStr, isTheTypeLegit };
