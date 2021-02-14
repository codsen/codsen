/**
 * is-html-tag-opening
 * Does an HTML tag start at given position?
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-tag-opening/
 */

import { matchRightIncl, matchRight } from 'string-match-left-right';
import { left } from 'string-left-right';

const defaultOpts = {
  allowCustomTagNames: false,
  skipOpeningBracket: false
};
const BACKSLASH = "\u005C";
const knownHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h1 - h6", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xml"];

function isNotLetter(char) {
  return char === undefined || char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
}

function extraRequirements(str, idx) {
  // either it's opening bracket
  return str[idx] === "<" || // or there's one opening bracket to the left
  str[left(str, idx)] === "<"; // TODO: consider adding clauses for br/> -
  // slash-closing follows, but no opening
}

var version = "2.0.5";

const version$1 = version;

function isOpening(str, idx = 0, originalOpts) {
  // -----------------------------------------------------------------------------

  if (typeof str !== "string") {
    throw new Error(`is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as "${typeof str}", value being ${JSON.stringify(str, null, 4)}`);
  }

  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error(`is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as "${typeof idx}", value being ${JSON.stringify(idx, null, 4)}`);
  }

  const opts = { ...defaultOpts,
    ...originalOpts
  }; // -----------------------------------------------------------------------------
  const whitespaceChunk = `[\\\\ \\t\\r\\n/]*`; // generalChar does not include the dash, -

  const generalChar = `._a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF`; // =======
  // r1. tag without attributes
  // for example <br>, <br/>

  const r1 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}\\w+${whitespaceChunk}\\/?${whitespaceChunk}>`, "g"); // its custom-html tag version:

  const r5 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}[${generalChar}]+[-${generalChar}]*${whitespaceChunk}>`, "g"); // to anybody who wonders, the \u2070-\uFFFF covers all the surrogates
  // of which emoji can be assembled. This is a very rough match, aiming to
  // catch as much as possible, not the validation-level match.
  // If you put bunch of opening surrogates in a sequence, for example,
  // this program would still match them positively. It's to catch all emoji,
  // including future, new-fangled emoji.
  // =======
  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)

  const r2 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['"\\w]`, "g"); // its custom-html tag version:

  const r6 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\w+\\s+[${generalChar}]+[-${generalChar}]*(?:-\\w+)?\\s*=\\s*['"\\w]`); // =======
  // r3. closing/self-closing tags

  const r3 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\/?\\s*\\w+\\s*\\/?\\s*>`, "g"); // its custom-html tag version:

  const r7 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\/?\\s*[${generalChar}]+[-${generalChar}]*\\s*\\/?\\s*>`, "g"); // =======
  // r4. opening tag with attributes,

  const r4 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}\\w+(?:\\s*\\w+)?\\s*\\w+=['"]`, "g"); // its custom-html tag version:

  const r8 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}[${generalChar}]+[-${generalChar}]*\\s+(?:\\s*\\w+)?\\s*\\w+=['"]`, "g"); // =======
  // lesser requirements when opening bracket precedes index "idx"

  const r9 = new RegExp(`^<${opts.skipOpeningBracket ? `?\\/?` : ""}(${whitespaceChunk}[${generalChar}]+)+${whitespaceChunk}[\\\\/=>]`, ""); // =======

  const whatToTest = idx ? str.slice(idx) : str;
  let qualified = false;
  let passed = false; // if the result is still falsey, we match against the known HTML tag names list

  const matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
  }; // -----------------------------------------------------------------------------

  if (opts.allowCustomTagNames) {

    if ((opts.skipOpeningBracket && (str[idx - 1] === "<" || str[idx - 1] === "/" && str[left(str, left(str, idx))] === "<") || whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim()) && (r9.test(whatToTest) || /^<\w+$/.test(whatToTest))) {
      passed = true;
    } else if (r5.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r6.test(whatToTest)) {
      passed = true;
    } else if (r7.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r8.test(whatToTest)) {
      passed = true;
    }
  } else {

    if ((opts.skipOpeningBracket && (str[idx - 1] === "<" || str[idx - 1] === "/" && str[left(str, left(str, idx))] === "<") || whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim()) && r9.test(whatToTest)) {
      qualified = true;
    } else if (r1.test(whatToTest) && extraRequirements(str, idx)) {
      qualified = true;
    } else if (r2.test(whatToTest)) {
      qualified = true;
    } else if (r3.test(whatToTest) && extraRequirements(str, idx)) {
      qualified = true;
    } else if (r4.test(whatToTest)) {
      qualified = true;
    }

    if (qualified && matchRightIncl(str, idx, knownHtmlTags, {
      cb: char => {
        if (char === undefined) {

          if (str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() || str[idx - 1] === "<") {
            passed = true;
          }

          return true;
        }

        return char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
      },
      i: true,
      trimCharsBeforeMatching: ["<", "/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
    })) {
      passed = true;
    }
  }

  if (!passed && str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() && matchRight(str, idx, knownHtmlTags, matchingOptions)) {
    passed = true;
  } //
  const res = typeof str === "string" && idx < str.length && passed;
  return res;
}

export { defaultOpts as defaults, isOpening, version$1 as version };
