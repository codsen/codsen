'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var trim = _interopDefault(require('lodash.trim'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var traverse = _interopDefault(require('ast-monkey-traverse'));

/* eslint no-param-reassign:0 */

function containsOnlyEmptySpace(input) {
  function isStr(something) {
    return typeof something === 'string';
  }
  var isArr = Array.isArray;
  var found = true;

  if (!isArr(input) && !isObj(input) && !isStr(input)) {
    return false;
  } else if (isStr(input)) {
    return trim(input).length === 0;
  }
  input = traverse(input, function (key, val) {
    var current = val !== undefined ? val : key;
    if (isStr(current) && trim(current) !== '') {
      found = false;
    }
    return current;
  });

  return found;
}

module.exports = containsOnlyEmptySpace;
