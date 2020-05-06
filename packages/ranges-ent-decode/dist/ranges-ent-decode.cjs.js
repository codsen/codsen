/**
 * ranges-ent-decode
 * Decode HTML entities recursively, get string index ranges of what needs to be replaced where
 * Version: 2.0.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-ent-decode
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var he = _interopDefault(require('he'));
var mergeRanges = _interopDefault(require('ranges-merge'));
var isObj = _interopDefault(require('lodash.isplainobject'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function chomp(str) {
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  return str;
}
function decode(str, originalOpts) {
  if (typeof str !== "string") {
    throw new TypeError("ranges-ent-decode/decode(): [THROW_ID_01] Expected a String! Currently it's given as ".concat(str, ", type ").concat(_typeof(str)));
  }
  if (originalOpts != null && !isObj(originalOpts)) {
    throw new TypeError("ranges-ent-decode/decode(): [THROW_ID_02] Optional Options Object, the second in put argument, must be a plain object! Currently it's given as ".concat(originalOpts, ", type ").concat(_typeof(originalOpts)));
  }
  var defaults = {
    isAttributeValue: false,
    strict: false
  };
  var opts;
  if (!originalOpts) {
    opts = defaults;
  } else {
    opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  }
  var entityRegex = /&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
  var rangesArr = [];
  var array1;
  var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
  if (opts.strict) {
    var matchedInvalidEntities = str.match(regexInvalidEntity);
    if (matchedInvalidEntities) {
      throw new Error("ranges-ent-decode/decode(): [THROW_ID_04] Parse error - strict mode is on and input contains an invalid entity. Here are all the invalid entities: ".concat(JSON.stringify(matchedInvalidEntities, null, 4)));
    }
  }
  while ((array1 = entityRegex.exec(str)) !== null) {
    var chomped = chomp(array1[0]);
    if (chomped === "&") {
      rangesArr.push([entityRegex.lastIndex - array1[0].length, entityRegex.lastIndex, "&"]);
    } else {
      var decoded = he.decode(chomped, opts);
      if (decoded !== chomped) {
        rangesArr.push([entityRegex.lastIndex - array1[0].length, entityRegex.lastIndex, decoded]);
      }
    }
  }
  return mergeRanges(rangesArr);
}

module.exports = decode;
