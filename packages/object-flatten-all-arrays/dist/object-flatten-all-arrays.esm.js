import merge from 'lodash.merge';
import clone from 'lodash.clonedeep';
import typ from 'type-detect';
import checkTypes from 'check-types-mini';

var isArr = Array.isArray;

function flattenAllArrays(originalIncommingObj, originalOpts) {
  //
  // internal functions
  // ==================

  function arrayContainsStr(arr) {
    return arr.some(function (val) {
      return typeof val === 'string';
    });
  }

  function isObj(something) {
    return typ(something) === 'Object';
  }

  // setup
  // =====

  var defaults = {
    flattenArraysContainingStringsToBeEmpty: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: 'object-flatten-all-arrays: [THROW_ID_02*]'
  });

  var incommingObj = clone(originalIncommingObj);
  var isFirstObj = void 0;
  var combinedObj = void 0;
  var firstObjIndex = void 0;

  // action
  // ======

  // 1. check current
  if (isArr(incommingObj)) {
    if (opts.flattenArraysContainingStringsToBeEmpty && arrayContainsStr(incommingObj)) {
      return [];
    }
    isFirstObj = null;
    combinedObj = {};
    firstObjIndex = 0;
    for (var i = 0, len = incommingObj.length; i < len; i++) {
      if (isObj(incommingObj[i])) {
        combinedObj = merge(combinedObj, incommingObj[i]);
        if (isFirstObj === null) {
          isFirstObj = true;
          firstObjIndex = i;
        } else {
          incommingObj.splice(i, 1);
          i -= 1;
        }
      }
    }
    if (isFirstObj !== null) {
      incommingObj[firstObjIndex] = clone(combinedObj);
    }
  }
  // 2. traverse deeper
  if (isObj(incommingObj)) {
    Object.keys(incommingObj).forEach(function (key) {
      if (isObj(incommingObj[key]) || isArr(incommingObj[key])) {
        incommingObj[key] = flattenAllArrays(incommingObj[key], opts);
      }
    });
  } else if (isArr(incommingObj)) {
    incommingObj.forEach(function (el, i) {
      if (isObj(incommingObj[i]) || isArr(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i], opts);
      }
    });
  }
  return incommingObj;
}

export default flattenAllArrays;
