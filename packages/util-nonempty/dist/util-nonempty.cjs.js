'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(require('lodash.isplainobject'));

var isArray = Array.isArray;

var isString = function isString(something) {
  return typeof something === 'string';
};

function nonEmpty(input) {
  if (arguments.length === 0 || input === undefined) {
    return;
  } else if (isArray(input) || isString(input)) {
    return input.length > 0;
  } else if (isPlainObject(input)) {
    return Object.keys(input).length > 0;
  }
  return false;
}

module.exports = nonEmpty;
