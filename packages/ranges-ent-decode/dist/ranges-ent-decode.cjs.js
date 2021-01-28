/**
 * ranges-ent-decode
 * Recursive HTML entity decoding for Ranges workflow
 * Version: 4.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-ent-decode/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var he = require('he');
var rangesMerge = require('ranges-merge');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var he__default = /*#__PURE__*/_interopDefaultLegacy(he);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version = "4.0.1";

var version$1 = version;

function chomp(str) {
  // eslint-disable-next-line no-param-reassign
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  return str;
}

var defaults = {
  isAttributeValue: false,
  strict: false
};

function rEntDecode(str, originalOpts) {
  // insurance:
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new TypeError("ranges-ent-decode/decode(): [THROW_ID_01] Expected a String! Currently it's given as " + str + ", type " + typeof str);
  } else if (!str.trim()) {
    // fast ending, matching Ranges notation - absence is marked by falsy null
    return null;
  }

  if (originalOpts != null && !isObj__default['default'](originalOpts)) {
    throw new TypeError("ranges-ent-decode/decode(): [THROW_ID_02] Optional Options Object, the second in put argument, must be a plain object! Currently it's given as " + originalOpts + ", type " + typeof originalOpts);
  }

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts); // vars
  // ---------------------------------------------------------------------------
  // single, non-recursively encoded entity:
  // /&(#?[^;\W]+;?)/g;
  // recursively encoded (one or more times over and over) HTML entity:
  // /&(#?[^;\W]+;?)+/g;
  // regex adapted taken from he.js v1.1.1
  // the difference is recursively encoded entity catch in front which is sensitive to semicolons

  var entityRegex = /&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g; // final ranges array:

  var rangesArr = []; // temporary array container

  var array1;
  var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;

  if (opts.strict) {
    var matchedInvalidEntities = str.match(regexInvalidEntity);

    if (matchedInvalidEntities) {
      throw new Error("ranges-ent-decode/decode(): [THROW_ID_04] Parse error - strict mode is on and input contains an invalid entity. Here are all the invalid entities: " + JSON.stringify(matchedInvalidEntities, null, 4));
    }
  } // action
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line no-cond-assign


  while ((array1 = entityRegex.exec(str)) !== null) {
    var chomped = chomp(array1[0]);

    if (chomped === "&") {
      rangesArr.push([entityRegex.lastIndex - array1[0].length, entityRegex.lastIndex, "&"]);
    } else {
      var decoded = he__default['default'].decode(chomped, opts);

      if (decoded !== chomped) {
        rangesArr.push([entityRegex.lastIndex - array1[0].length, entityRegex.lastIndex, decoded]);
      }
    }
  }

  return rangesMerge.rMerge(rangesArr);
}

exports.defaults = defaults;
exports.rEntDecode = rEntDecode;
exports.version = version$1;
