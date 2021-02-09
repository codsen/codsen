/**
 * stristri
 * Extracts or deletes HTML, CSS, text and/or templating tags from string
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/stristri/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var codsenTokenizer = require('codsen-tokenizer');
var stringCollapseWhiteSpace = require('string-collapse-white-space');
var rangesApply = require('ranges-apply');
var detectTemplatingLanguage = require('detect-templating-language');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var defaultOpts = {
  html: true,
  css: true,
  text: false,
  templatingTags: false,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

var version = "3.0.3";

var version$1 = version; // return function is in single place to ensure no
// discrepancies in API when returning from multiple places

function returnHelper(result, applicableOpts, templatingLang, start) {
  /* istanbul ignore next */
  if (arguments.length !== 4) {
    throw new Error("stristri/returnHelper(): should be 3 input args but " + arguments.length + " were given!");
  }
  /* istanbul ignore next */


  if (typeof result !== "string") {
    throw new Error("stristri/returnHelper(): first arg missing!");
  }
  /* istanbul ignore next */


  if (typeof applicableOpts !== "object") {
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
/**
 * Extracts or deletes HTML, CSS, text and/or templating tags from string
 */


function stri(input, originalOpts) {
  var start = Date.now(); // insurance

  if (typeof input !== "string") {
    throw new Error("stristri: [THROW_ID_01] the first input arg must be string! It was given as " + JSON.stringify(input, null, 4) + " (" + typeof input + ")");
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as " + JSON.stringify(originalOpts, null, 4) + " (" + typeof originalOpts + ")");
  }

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaultOpts), originalOpts); // Prepare blank applicable opts object, extract all bool keys,
  // anticipate that there will be non-bool values in the future.

  var applicableOpts = {
    html: false,
    css: false,
    text: false,
    templatingTags: false
  }; // quick ending

  if (!input) {
    returnHelper("", applicableOpts, detectTemplatingLanguage.detectLang(input), start);
  }

  var gatheredRanges = []; // comments like CSS comment
  // /* some text */
  // come as minimum 3 tokens,
  // in case above we've got
  // token type = comment (opening /*), token type = text, token type = comment (closing */)
  // we need to treat the contents text tokens as either HTML or CSS, not as "text"

  var withinHTMLComment = false; // used for children nodes of XML or HTML comment tags

  var withinXML = false; // used for children nodes of XML or HTML comment tags

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
          // it's HTML comment
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
        // mark applicable opts
        if (!applicableOpts.html) {
          applicableOpts.html = true;
        }

        if (opts.html) {
          gatheredRanges.push([token.start, token.end, " "]);
        }

        if (token.tagName === "style" && !token.closing) {
          withinCSS = true;
        } else if ( // closing CSS comment '*/' is met
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
        // mark applicable opts
        if (!applicableOpts.css) {
          applicableOpts.css = true;
        }

        if (opts.css) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
      } else if (token.type === "text") {
        // mark applicable opts
        if (!withinCSS && !withinHTMLComment && !withinXML && !withinScript && !applicableOpts.text && token.value.trim()) {
          applicableOpts.text = true;
        }

        if (withinCSS && opts.css || (withinHTMLComment || withinScript) && opts.html || !withinCSS && !withinHTMLComment && !withinXML && !withinScript && opts.text) {
          if (token.value.includes("\n")) {
            gatheredRanges.push([token.start, token.end, "\n"]);
          } else {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        }
      } else if (token.type === "esp") {
        // mark applicable opts
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
exports.version = version$1;
