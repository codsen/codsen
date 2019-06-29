/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var split = _interopDefault(require('split-lines'));

function _typeof(obj) {
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

var version = "1.0.1";

function prepLine(str) {
  var split = str.split("|");
  var from = 0;
  var to = 500;
  if (split[1]) {
    if (split[2]) {
      from = split[1];
      to = split[2];
    } else {
      to = split[1];
    }
  }
  var res = "";
  for (var i = from; i <= to; i++) {
    res += "".concat(i === 0 ? "" : "\n").concat(i === 0 ? split[0].replace(/\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)?/g, i) : split[0].replace(/\$\$\$/g, i));
  }
  return res;
}
function prepConfig(str) {
  return split(str).map(function (rowStr) {
    return rowStr.includes("$$$") ? prepLine(rowStr) : rowStr;
  }).join("\n");
}
function generateAtomicCss(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as \"".concat(JSON.stringify(str, null, 4), "\" (type ").concat(_typeof(str), ")"));
  }
  var CONFIGHEAD = "GENERATE-ATOMIC-CSS-CONFIG-STARTS";
  var CONFIGTAIL = "GENERATE-ATOMIC-CSS-CONFIG-ENDS";
  var CONTENTHEAD = "GENERATE-ATOMIC-CSS-CONTENT-STARTS";
  var CONTENTTAIL = "GENERATE-ATOMIC-CSS-CONTENT-ENDS";
  var defaults = {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
    configOverride: null
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var extractedConfig;
  if (opts.configOverride) {
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL) && str.includes(CONTENTHEAD) && str.includes(CONTENTTAIL)) {
    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONFIGTAIL));
  } else {
    throw new Error("generate-atomic-css: [THROW_ID_01] The input string does not contain:\n".concat(!str.includes(CONFIGHEAD) ? "* config heads, \"".concat(CONFIGHEAD, "\"\n") : "").concat(!str.includes(CONFIGTAIL) ? "* config tails, \"".concat(CONFIGTAIL, "\"\n") : "").concat(!str.includes(CONTENTHEAD) ? "* content heads, \"".concat(CONTENTHEAD, "\"\n") : "").concat(!str.includes(CONTENTTAIL) ? "* content heads, \"".concat(CONTENTTAIL, "\"\n") : ""));
  }
  return "".concat(str.slice(0, str.indexOf(CONTENTHEAD) + CONTENTHEAD.length)).concat(prepConfig(extractedConfig)).concat(str.slice(str.indexOf(CONTENTTAIL)));
}

exports.generateAtomicCss = generateAtomicCss;
exports.version = version;
