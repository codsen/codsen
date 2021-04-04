/**
 * @name stristri
 * @fileoverview Extracts or deletes HTML, CSS, text and/or templating tags from string
 * @version 3.1.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/stristri/}
 */

import { tokenizer } from 'codsen-tokenizer';
import { collapse } from 'string-collapse-white-space';
import { rApply } from 'ranges-apply';
import { detectLang } from 'detect-templating-language';

const defaultOpts = {
  html: true,
  css: true,
  text: false,
  templatingTags: false,
  js: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

var version$1 = "3.1.5";

const version = version$1;
function returnHelper(result, applicableOpts, templatingLang, start) {
  /* istanbul ignore next */
  if (arguments.length !== 4) {
    throw new Error(`stristri/returnHelper(): should be 3 input args but ${arguments.length} were given!`);
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
    result,
    applicableOpts,
    templatingLang
  };
}
function stri(input, originalOpts) {
  const start = Date.now();
  if (typeof input !== "string") {
    throw new Error(`stristri: [THROW_ID_01] the first input arg must be string! It was given as ${JSON.stringify(input, null, 4)} (${typeof input})`);
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as ${JSON.stringify(originalOpts, null, 4)} (${typeof originalOpts})`);
  }
  const opts = { ...defaultOpts,
    ...originalOpts
  };
  const applicableOpts = {
    html: false,
    css: false,
    text: false,
    js: false,
    templatingTags: false
  };
  if (!input) {
    returnHelper("", applicableOpts, detectLang(input), start);
  }
  const gatheredRanges = [];
  let withinHTMLComment = false;
  let withinXML = false;
  let withinCSS = false;
  let withinScript = false;
  tokenizer(input, {
    tagCb: token => {
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
  return returnHelper(collapse(rApply(input, gatheredRanges), {
    trimLines: true,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1
  }).result, applicableOpts, detectLang(input), start);
}

export { defaultOpts as defaults, stri, version };
