/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.1.29
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/helga
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var unescapeJs = _interopDefault(require('unescape-js'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var version = "1.1.29";

var defaults = {
  targetJSON: false
};
function helga(str, originalOpts) {
  var opts = _objectSpread2({}, defaults, {}, originalOpts);
  var beautified = unescapeJs(str);
  var minified = unescapeJs(str);
  if (opts.targetJSON) {
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0);
    minified = minified.slice(1, minified.length - 1);
  }
  return {
    minified: minified,
    beautified: beautified
  };
}

exports.defaults = defaults;
exports.helga = helga;
exports.version = version;
