/**
 * stristri
 * Extracts or deletes HTML, CSS, text and/or templating tags from string
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/stristri/
 */

import tokenizer from 'codsen-tokenizer';
import collapse from 'string-collapse-white-space';
import applyR from 'ranges-apply';
import mergeR from 'ranges-merge';
import detectLang from 'detect-templating-language';

const defaultOpts = {
  html: true,
  css: true,
  text: false,
  templatingTags: false,
};

var version = "1.0.0";

function returnHelper(result, ranges, applicableOpts, templatingLang) {
  /* istanbul ignore next */
  if (arguments.length !== 4) {
    throw new Error(
      `stristri/returnHelper(): should be 3 input args but ${arguments.length} were given!`
    );
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
    result,
    ranges,
    applicableOpts,
    templatingLang,
  };
}
function stri(input, originalOpts) {
  if (typeof input !== "string") {
    throw new Error(
      `stristri: [THROW_ID_01] the first input arg must be string! It was given as ${JSON.stringify(
        input,
        null,
        4
      )} (${typeof input})`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as ${JSON.stringify(
        originalOpts,
        null,
        4
      )} (${typeof originalOpts})`
    );
  }
  const opts = {
    ...defaultOpts,
    ...originalOpts,
  };
  const applicableOpts = Object.keys(opts).reduce((acc, key) => {
    /* istanbul ignore else */
    if (typeof opts[key] === "boolean") {
      acc[key] = false;
    }
    return acc;
  }, {});
  if (!input) {
    returnHelper("", null, applicableOpts, detectLang(input));
  }
  const gatheredRanges = [];
  let withinHTMLComment = false;
  let withinXML = false;
  let withinCSS = false;
  tokenizer(input, {
    tagCb: (token) => {
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
      } else if (
        token.type === "tag" ||
        (!withinCSS && token.type === "comment")
      ) {
        if (!applicableOpts.html) {
          applicableOpts.html = true;
        }
        if (opts.html) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
        if (token.tagName === "style" && !token.closing) {
          withinCSS = true;
        } else if (
          withinCSS &&
          token.tagName === "style" &&
          token.closing
        ) {
          withinCSS = false;
        }
        if (token.tagName === "xml") {
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinXML = true;
          } else if (token.closing && withinXML) {
            withinXML = false;
          }
        }
      } else if (["at", "rule"].includes(token.type)) {
        if (!applicableOpts.css) {
          applicableOpts.css = true;
        }
        if (opts.css) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
      } else if (token.type === "text") {
        if (
          !withinCSS &&
          !withinHTMLComment &&
          !withinXML &&
          !applicableOpts.text &&
          token.value.trim()
        ) {
          applicableOpts.text = true;
        }
        if (
          (withinCSS && opts.css) ||
          (withinHTMLComment && opts.html) ||
          (!withinCSS && !withinHTMLComment && !withinXML && opts.text)
        ) {
          if (token.value.includes("\n")) {
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
  });
  return returnHelper(
    collapse(applyR(input, gatheredRanges), {
      trimLines: true,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1,
    }).result,
    mergeR(gatheredRanges),
    applicableOpts,
    detectLang(input)
  );
}

export { defaultOpts as defaults, stri, version };
