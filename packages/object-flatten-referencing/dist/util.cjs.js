'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var type = _interopDefault(require('type-detect'));
var clone = _interopDefault(require('lodash.clonedeep'));
var isStringInt = _interopDefault(require('is-string-int'));

/* eslint padded-blocks: 0 */

var isArr = Array.isArray;

function isStr(something) {
  return type(something) === 'string';
}
function isObj(something) {
  return type(something) === 'Object';
}

function flattenObject(objOrig, opts) {
  if (arguments.length === 0 || Object.keys(objOrig).length === 0) {
    return [];
  }
  var obj = clone(objOrig);
  var res = [];
  if (isObj(obj)) {
    Object.keys(obj).forEach(function (key) {
      if (isObj(obj[key])) {
        obj[key] = flattenObject(obj[key], opts);
      }
      if (isArr(obj[key])) {
        res = res.concat(obj[key].map(function (el) {
          return key + opts.objectKeyAndValueJoinChar + el;
        }));
      }
      if (isStr(obj[key])) {
        res.push(key + opts.objectKeyAndValueJoinChar + obj[key]);
      }
    });
  }
  return res;
}

function flattenArr(arrOrig, opts, wrap, joinArraysUsingBrs) {
  if (arguments.length === 0 || arrOrig.length === 0) {
    return '';
  }
  var arr = clone(arrOrig);
  var res = '';
  if (arr.length > 0) {
    if (joinArraysUsingBrs) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (isStr(arr[i])) {
          var lineBreak = void 0;
          lineBreak = '';
          if (opts.mergeArraysWithLineBreaks && i > 0 && (!opts.mergeWithoutTrailingBrIfLineContainsBr || typeof arr[i - 1] !== 'string' || opts.mergeWithoutTrailingBrIfLineContainsBr && arr[i - 1] !== undefined && !arr[i - 1].toLowerCase().includes('<br'))) {
            lineBreak = '<br' + (opts.xhtml ? ' /' : '') + '>';
          }
          res += lineBreak + (wrap ? opts.wrapHeadsWith : '') + arr[i] + (wrap ? opts.wrapTailsWith : '');
        } else if (isArr(arr[i])) {
          // there's an array among elements
          if (arr[i].length > 0 && arr[i].every(isStr)) {
            (function () {
              var lineBreak = '';
              if (opts.mergeArraysWithLineBreaks && res.length > 0) {
                lineBreak = '<br' + (opts.xhtml ? ' /' : '') + '>';
              }
              res = arr[i].reduce(function (acc, val, i2, arr2) {
                var trailingSpace = '';
                if (i2 !== arr2.length - 1) {
                  trailingSpace = ' ';
                }
                return acc + (i2 === 0 ? lineBreak : '') + (wrap ? opts.wrapHeadsWith : '') + val + (wrap ? opts.wrapTailsWith : '') + trailingSpace;
              }, res);
            })();
          }
        }
      }
    } else {
      res = arr.reduce(function (acc, val, i, arr2) {
        var lineBreak = '';
        if (opts.mergeArraysWithLineBreaks && res.length > 0) {
          lineBreak = '<br' + (opts.xhtml ? ' /' : '') + '>';
        }
        var trailingSpace = '';
        if (i !== arr2.length - 1) {
          trailingSpace = ' ';
        }
        return acc + (i === 0 ? lineBreak : '') + (wrap ? opts.wrapHeadsWith : '') + val + (wrap ? opts.wrapTailsWith : '') + trailingSpace;
      }, res);
    }
  }
  return res;
}

function arrayiffyString(something) {
  if (isStr(something)) {
    if (something.length > 0) {
      return [something];
    }
    return [];
  }
  return something;
}

function reclaimIntegerString(something) {
  if (isStr(something) && isStringInt(something)) {
    return parseInt(something, 10);
  }
  return something;
}

var util = {
  flattenObject: flattenObject,
  flattenArr: flattenArr,
  arrayiffyString: arrayiffyString,
  reclaimIntegerString: reclaimIntegerString
};

module.exports = util;
