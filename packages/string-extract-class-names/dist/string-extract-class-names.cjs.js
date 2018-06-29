'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var replace = _interopDefault(require('lodash.replace'));
var without = _interopDefault(require('lodash.without'));
var flattenDeep = _interopDefault(require('lodash.flattendeep'));

function stringExtractClassNames(input) {
  if (input === undefined) {
    throw new Error();
  }
  function chopBeginning(str) {
    return replace(str, /[^.#]*/m, "");
  }
  function chopEnding(str) {
    return replace(str, /[ ~\\!@$%^&*()+=,/';:"?><[\]\\{}|`].*/g, "");
  }
  function existy(x) {
    return x != null;
  }
  var temp = input.replace(/[\0'"\\\n\r\v\t\b\f]/g, " ").split(/([.#])/);
  temp.forEach(function (el, i) {
    if (el === "." || el === "#") {
      if (existy(temp[i + 1])) {
        temp[i + 1] = el + temp[i + 1];
      }
      temp[i] = "";
    }
  });
  temp.forEach(function (el, i) {
    temp[i] = without(chopEnding(chopBeginning(temp[i])).split(/([.#][^.#]*)/), "");
  });
  temp = flattenDeep(temp);
  temp = without(temp, ".", "#");
  return temp;
}

module.exports = stringExtractClassNames;
