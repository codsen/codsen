/**
 * ast-get-values-by-key
 * Extract values and paths from AST by keys OR set them by keys
 * Version: 3.0.5
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

var version = "3.0.5";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
var version$1 = version;
/**
 * Extract values and paths from AST by keys OR set them by keys
 */

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
      } else if (replacement.length) {
        return replacement.shift();
      }
    }

    return current;
  });
  return replacement === undefined ? findings : amended;
}

exports.getByKey = getByKey;
exports.version = version$1;
