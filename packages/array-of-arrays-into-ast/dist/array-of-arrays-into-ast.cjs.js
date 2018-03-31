'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var mergeAdvanced = _interopDefault(require('object-merge-advanced'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isArr = Array.isArray;

function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}

function generateAst(input, opts) {
  if (!isArr(input)) {
    throw new Error("array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type " + (typeof input === "undefined" ? "undefined" : _typeof(input)) + " equal to:\n" + JSON.stringify(input, null, 4));
  } else if (input.length === 0) {
    return {};
  }

  var defaults = {
    dedupe: true
  };
  opts = Object.assign({}, defaults, opts);

  checkTypes(opts, defaults, {
    msg: "array-of-arrays-into-ast: [THROW_ID_02*]",
    optsVarName: "opts"
  });

  var res = {};

  input.forEach(function (arr) {

    var temp = null;
    for (var i = arr.length; i--;) {
      temp = _defineProperty({}, arr[i], [temp]); // uses ES6 computed property names
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
    }
    res = mergeAdvanced(res, temp, { concatInsteadOfMerging: !opts.dedupe });
  });
  return sortObject(res);
}

module.exports = generateAst;
