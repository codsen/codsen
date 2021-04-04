/**
 * @name stristri
 * @fileoverview Extracts or deletes HTML, CSS, text and/or templating tags from string
 * @version 3.1.6
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/stristri/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var codsenTokenizer = require('codsen-tokenizer');
var stringCollapseWhiteSpace = require('string-collapse-white-space');
var rangesApply = require('ranges-apply');
var detectTemplatingLanguage = require('detect-templating-language');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var defaultOpts = {
  html: true,
  css: true,
  text: false,
  templatingTags: false,
  js: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

var version$1 = "3.1.6";

var version = version$1;
function returnHelper(result, applicableOpts, templatingLang, start) {
  /* istanbul ignore next */
  if (arguments.length !== 4) {
    throw new Error("stristri/returnHelper(): should be 3 input args but ".concat(arguments.length, " were given!"));
  }
  /* istanbul ignore next */
  if (typeof result !== "string") {
    throw new Error("stristri/returnHelper(): first arg missing!");
  }
  /* istanbul ignore next */
  if (_typeof__default['default'](applicableOpts) !== "object") {
    throw new Error("stristri/returnHelper(): second arg missing!");
  }
  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start
    },
    result: result,
    applicableOpts: applicableOpts,
    templatingLang: templatingLang
  };
}
function stri(input, originalOpts) {
  var start = Date.now();
  if (typeof input !== "string") {
    throw new Error("stristri: [THROW_ID_01] the first input arg must be string! It was given as ".concat(JSON.stringify(input, null, 4), " (").concat(_typeof__default['default'](input), ")"));
  }
  if (originalOpts && _typeof__default['default'](originalOpts) !== "object") {
    throw new Error("stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as ".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof__default['default'](originalOpts), ")"));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaultOpts), originalOpts);
  var applicableOpts = {
    html: false,
    css: false,
    text: false,
    js: false,
    templatingTags: false
  };
  if (!input) {
    returnHelper("", applicableOpts, detectTemplatingLanguage.detectLang(input), start);
  }
  var gatheredRanges = [];
  var withinHTMLComment = false;
  var withinXML = false;
  var withinCSS = false;
  var withinScript = false;
  codsenTokenizer.tokenizer(input, {
    tagCb: function tagCb(token) {
      /* istanbul ignore else */
      if (token.type === "comment") {
        if (withinCSS) {
          if (!applicableOpts.css) {
            applicableOpts.css = true;
          }
          if (opts.css) {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        } else {
          if (!applicableOpts.html) {
            applicableOpts.html = true;
          }
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinHTMLComment = true;
          } else if (token.closing && withinHTMLComment) {
            withinHTMLComment = false;
          }
          if (opts.html) {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        }
      } else if (token.type === "tag") {
        if (!applicableOpts.html) {
          applicableOpts.html = true;
        }
        if (opts.html) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
        if (token.tagName === "style" && !token.closing) {
          withinCSS = true;
        } else if (
        withinCSS && token.tagName === "style" && token.closing) {
          withinCSS = false;
        }
        if (token.tagName === "xml") {
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinXML = true;
          } else if (token.closing && withinXML) {
            withinXML = false;
          }
        }
        if (token.tagName === "script" && !token.closing) {
          withinScript = true;
        } else if (withinScript && token.tagName === "script" && token.closing) {
          withinScript = false;
        }
      } else if (["at", "rule"].includes(token.type)) {
        if (!applicableOpts.css) {
          applicableOpts.css = true;
        }
        if (opts.css) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
      } else if (token.type === "text") {
        if (withinScript) {
          applicableOpts.js = true;
        } else if (!withinCSS && !withinHTMLComment && !withinXML && !applicableOpts.text && token.value.trim()) {
          applicableOpts.text = true;
        }
        if (withinCSS && opts.css || withinScript && opts.js || withinHTMLComment && opts.html || !withinCSS && !withinHTMLComment && !withinXML && !withinScript && opts.text) {
          if (withinScript) {
            gatheredRanges.push([token.start, token.end]);
          } else if (token.value.includes("\n")) {
            gatheredRanges.push([token.start, token.end, "\n"]);
          } else {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        }
      } else if (token.type === "esp") {
        if (!applicableOpts.templatingTags) {
          applicableOpts.templatingTags = true;
        }
        if (opts.templatingTags) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
      }
    },
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo * 0.95
  });
  return returnHelper(stringCollapseWhiteSpace.collapse(rangesApply.rApply(input, gatheredRanges), {
    trimLines: true,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1
  }).result, applicableOpts, detectTemplatingLanguage.detectLang(input), start);
}

exports.defaults = defaultOpts;
exports.stri = stri;
exports.version = version;
