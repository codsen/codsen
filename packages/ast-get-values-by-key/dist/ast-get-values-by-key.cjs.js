'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var traverse = _interopDefault(require('ast-monkey-traverse'));
var matcher = _interopDefault(require('matcher'));
var clone = _interopDefault(require('lodash.clonedeep'));

function existy(x) {
  return x != null;
}
function getAllValuesByKey(originalInput, whatToFind, originalReplacement) {
  if (!existy(originalInput)) {
    throw new Error("ast-get-values-by-key: [THROW_ID_01] the first argument is missing!");
  }
  if (!existy(whatToFind)) {
    throw new Error("ast-get-values-by-key: [THROW_ID_02] the second argument is missing!");
  }
  var replacement;
  if (existy(originalReplacement)) {
    if (typeof originalReplacement === "string") {
      replacement = [originalReplacement];
    } else {
      replacement = clone(originalReplacement);
    }
  }
  var res = [];
  var input = traverse(originalInput, function (key, val) {
    var current = val !== undefined ? val : key;
    if (val !== undefined && matcher.isMatch(key, whatToFind, {
      caseSensitive: true
    })) {
      if (replacement === undefined) {
        res.push(val);
      } else if (replacement.length > 0) {
        return replacement.shift();
      }
    }
    return current;
  });
  return replacement === undefined ? res : input;
}

module.exports = getAllValuesByKey;
