'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var type = _interopDefault(require('type-detect'));

/* eslint max-len:0 */

var isArr = Array.isArray;

function existy(x) {
  return x != null;
}
function isObj(something) {
  return type(something) === 'Object';
}
function isStr(something) {
  return type(something) === 'string';
}
function isNum(something) {
  return type(something) === 'number';
}
function isBool(something) {
  return type(something) === 'boolean';
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
  // same as JSON spec:
  return isObj(something) || isStr(something) || isNum(something) || isBool(something) || isArr(something) || isNull(something);
}

var util = {
  existy: existy,
  isObj: isObj,
  isStr: isStr,
  isNum: isNum,
  isBool: isBool,
  isNull: isNull,
  isBlank: isBlank,
  isTheTypeLegit: isTheTypeLegit
};

module.exports = util;
