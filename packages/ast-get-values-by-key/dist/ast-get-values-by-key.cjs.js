/**
 * ast-get-values-by-key
 * Read or edit parsed HTML (or AST in general)
 * Version: 2.8.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-values-by-key/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var astMonkeyTraverse = require('ast-monkey-traverse');
var matcher = require('matcher');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

var version = "2.8.1";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

function getByKey(originalInput, whatToFind, originalReplacement) {
  var replacement;

  if (originalReplacement !== undefined) {
    replacement = Array.isArray(originalReplacement) ? clone__default['default'](originalReplacement) : [clone__default['default'](originalReplacement)];
  }

  var findings = [];
  var amended = astMonkeyTraverse.traverse(originalInput, function (key, val, innerObj) {
    var current = val !== undefined ? val : key;

    if (val !== undefined && matcher__default['default'].isMatch(key, whatToFind, {
      caseSensitive: true
    })) {
      if (replacement === undefined) {
        findings.push({
          val: val,
          path: innerObj.path
        });
      } else if (replacement.length > 0) {
        return replacement.shift();
      }
    }

    return current;
  });
  return replacement === undefined ? findings : amended;
}

exports.getByKey = getByKey;
exports.version = version;
