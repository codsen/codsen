/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 5.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-tokenizer/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringMatchLeftRight = require('string-match-left-right');
var clone = require('lodash.clonedeep');
var stringLeftRight = require('string-left-right');
var isHtmlAttributeClosing = require('is-html-attribute-closing');
var htmlAllKnownAttributes = require('html-all-known-attributes');
var isCharSuitableForHtmlAttrName = require('is-char-suitable-for-html-attr-name');
var isHtmlTagOpening = require('is-html-tag-opening');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var allHTMLTagsKnownToHumanity = new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]); // contains all common templating language head/tail marker characters:

var espChars = "{}%-$_()*|#";
var veryEspChars = "{}|#";
var notVeryEspChars = "%()$_*#";
var leftyChars = "({";
var rightyChars = "})";
var espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)", "||", "--"];
var punctuationChars = ".,;!?";
var BACKTICK = "\x60";
var LEFTDOUBLEQUOTMARK = "\u201C";
var RIGHTDOUBLEQUOTMARK = "\u201D";

function isLatinLetter(char) {
  // we mean Latin letters A-Z, a-z
  return !!(char && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123));
} // Considering custom element name character requirements:
// https://html.spec.whatwg.org/multipage/custom-elements.html
// Example of Unicode character in a regex:
// \u0041
// "-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xEFFFF]


function charSuitableForTagName(char) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
} // it flips all brackets backwards and puts characters in the opposite order


function flipEspTag(str) {
  var res = "";

  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = "]" + res;
    } else if (str[i] === "]") {
      res = "[" + res;
    } else if (str[i] === "{") {
      res = "}" + res;
    } else if (str[i] === "}") {
      res = "{" + res;
    } else if (str[i] === "(") {
      res = ")" + res;
    } else if (str[i] === ")") {
      res = "(" + res;
    } else if (str[i] === "<") {
      res = ">" + res;
    } else if (str[i] === ">") {
      res = "<" + res;
    } else if (str[i] === LEFTDOUBLEQUOTMARK) {
      res = "" + RIGHTDOUBLEQUOTMARK + res;
    } else if (str[i] === RIGHTDOUBLEQUOTMARK) {
      res = "" + LEFTDOUBLEQUOTMARK + res;
    } else {
      res = "" + str[i] + res;
    }
  }

  return res;
}

function isTagNameRecognised(tagName) {
  return allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
} // Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.


function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    }

    if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  } // default result


  return false;
}


function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
} // https://html.spec.whatwg.org/multipage/syntax.html#elements-2


var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]; // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Inline_text_semantics
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Image_and_multimedia

var inlineTags = new Set(["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]); // Rules which might wrap the media queries, for example:
// @supports (display: grid) {...
// const atRulesWhichMightWrapStyles = ["media", "supports", "document"];

var charsThatEndCSSChunks = ["{", "}", ","];
var SOMEQUOTE = "'\"" + LEFTDOUBLEQUOTMARK + RIGHTDOUBLEQUOTMARK;
var attrNameRegexp = /[\w-]/;

// returns found object's index in "layers" array
function getLastEspLayerObjIdx(layers) {
  if (layers && layers.length) {
    // traverse layers backwards
    for (var z = layers.length; z--;) {
      if (layers[z].type === "esp") {
        return z;
      }
    }
  }

  return undefined;
}

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  var wholeEspTagLumpOnTheRight = str[i];
  var len = str.length; // getLastEspLayerObj()

  var lastEspLayerObj = layers[getLastEspLayerObjIdx(layers)];

  for (var y = i + 1; y < len; y++) { // if righty character is on the left and now it's lefty,
    // we have a situation like:
    // {{ abc }}{% endif %}
    //        ^^^^
    //        lump
    //
    // {{ abc }}{% endif %}
    //         ^^
    //         ||
    //    lefty  righty
    //
    // we clice off where righty starts

    if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
      break;
    }

    if ( // consider:
    // ${(y/4)?int}
    //   ^
    //   we're here - is this opening bracket part of heads?!?
    //
    // or JSP:
    // <%=(new java.util.Date()).toLocaleString()%>
    //    ^
    // if lump already is two chars long
    wholeEspTagLumpOnTheRight.length > 1 && ( // contains one of opening-polarity characters
    wholeEspTagLumpOnTheRight.includes("<") || wholeEspTagLumpOnTheRight.includes("{") || wholeEspTagLumpOnTheRight.includes("[") || wholeEspTagLumpOnTheRight.includes("(")) && // bail if it's a bracket
    str[y] === "(") {
      break;
    }

    if (espChars.includes(str[y]) || // in case it's XML tag-like templating tag, such as JSP,
    // we check, is it in the last guessed lump's character's list
    lastEspLayerObj && lastEspLayerObj.guessedClosingLump.includes(str[y]) || str[i] === "<" && str[y] === "/" || // accept closing bracket if it's RPL comment, tails of: <#-- z -->
    str[y] === ">" && wholeEspTagLumpOnTheRight === "--" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-" || // we do exception for extra characters, such as JSP's
    // exclamation mark: <%! yo %>
    //                     ^
    // which is legit...
    //
    // at least one character must have been caught already
    !lastEspLayerObj && y > i && "!=@".includes(str[y])) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      break;
    }
  } // if lump is tails+heads, report the length of tails only:
  // {%- a -%}{%- b -%}
  //        ^
  //      we're talking about this lump of tails and heads


  if (wholeEspTagLumpOnTheRight && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].guessedClosingLump && wholeEspTagLumpOnTheRight.length > layers[layers.length - 1].guessedClosingLump.length) {
    //
    // case I.
    //
    if (wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)) {
      // no need to extract tails, heads "{%-" were confirmed in example:
      // {%- a -%}{%- b -%}
      //          ^
      //         here
      // return string, extracted ESP tails
      return wholeEspTagLumpOnTheRight.slice(0, wholeEspTagLumpOnTheRight.length - layers[layers.length - 1].openingLump.length);
    } // ELSE
    // imagine a case like:
    // {%- aa %}{% bb %}
    // opening heads were {%-, flipped were -%}. Now when we take lump %}{%
    // and match, the dash will be missing.
    // What we're going to do is we'll split the lump where last matched
    // continuous chunk ends (%} in example above) with condition that
    // at least one character from ESP-list follows, which is not part of
    // guessed closing lump.


    var uniqueCharsListFromGuessedClosingLumpArr = new Set(layers[layers.length - 1].guessedClosingLump);
    var found = 0;

    var _loop = function _loop(len2, _y) {
      if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[_y]) && found > 1) {
        return {
          v: wholeEspTagLumpOnTheRight.slice(0, _y)
        };
      }

      if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[_y])) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set([].concat(uniqueCharsListFromGuessedClosingLumpArr).filter(function (el) {
          return el !== wholeEspTagLumpOnTheRight[_y];
        }));
      }
    };

    for (var _y = 0, len2 = wholeEspTagLumpOnTheRight.length; _y < len2; _y++) {
      var _ret = _loop(len2, _y);

      if (typeof _ret === "object") return _ret.v;
    }
  }
  return wholeEspTagLumpOnTheRight;
}

// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsHtmlComment(str, i, token, layers) {
  // console.log(
  //   `R1: ${!!matchRight(str, i, ["!--"], {
  //     maxMismatches: 1,
  //     firstMustMatch: true, // <--- FUZZY MATCH, BUT EXCL. MARK IS OBLIGATORY
  //     trimBeforeMatching: true
  //   }) ||
  //     matchRight(str, i, ["![endif]"], {
  //       i: true,
  //       maxMismatches: 2,
  //       trimBeforeMatching: true
  //     })}`
  // );
  // console.log(
  //   `R2: ${!matchRight(str, i, ["![cdata", "<"], {
  //     i: true,
  //     maxMismatches: 1,
  //     trimBeforeMatching: true
  //   })}`
  // );
  // console.log(`R3: ${!!(token.type !== "comment" || token.kind !== "not")}`);
  // console.log(
  //   `R3*: ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${JSON.stringify(
  //     token.kind,
  //     null,
  //     4
  //   )}`
  // );
  return !!( // the opening is deliberately loose, with one dash missing, "!-" instead of "!--"
  str[i] === "<" && (stringMatchLeftRight.matchRight(str, i, ["!--"], {
    maxMismatches: 1,
    firstMustMatch: true,
    trimBeforeMatching: true
  }) || stringMatchLeftRight.matchRightIncl(str, i, ["<![endif]"], {
    i: true,
    maxMismatches: 2,
    trimBeforeMatching: true
  })) && !stringMatchLeftRight.matchRight(str, i, ["![cdata", "<"], {
    i: true,
    maxMismatches: 1,
    trimBeforeMatching: true
  }) && (token.type !== "comment" || token.kind !== "not") || str[i] === "-" && stringMatchLeftRight.matchRightIncl(str, i, ["-->"], {
    trimBeforeMatching: true
  }) && (token.type !== "comment" || !token.closing && token.kind !== "not") && !stringMatchLeftRight.matchLeft(str, i, "<", {
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["-", "!"]
  }) && ( // insurance against ESP tag, RPL comments: <#-- z -->
  !Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "esp" || !(layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-")));
}

// import { matchLeft, matchRight } from "string-match-left-right";
function startsCssComment(str, i, _token, _layers, withinStyle) {
  return (// cast to bool
    withinStyle && ( // match the / *
    str[i] === "/" && str[i + 1] === "*" || // match the * /
    str[i] === "*" && str[i + 1] === "/")
  );
}

// We record ESP tag head and tails as we traverse code because we need to know
// the arrangement of all pieces: start, end, nesting etc.
//
// Now, we keep records of each "layer" - new opening of some sorts: quotes,
// heads of ESP tags and so on.
//
// This function is a helper to check, does something match as a counterpart
// to the last/first layer.
//
// Quotes could be checked here but are not at the moment, here currently
// we deal with ESP tokens only
// RETURNS: undefined or integer, length of a matched ESP lump.
function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead) {
  if (matchFirstInstead === void 0) {
    matchFirstInstead = false;
  }

  if (!layers.length) {
    return;
  }

  var whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1]; // console.log(
  //   `023 matchLayer(): ${`\u001b[${33}m${`whichLayerToMatch`}\u001b[${39}m`} = ${JSON.stringify(
  //     whichLayerToMatch,
  //     null,
  //     4
  //   )}`
  // );

  if (whichLayerToMatch.type !== "esp") {
    // we aim to match ESP tag layers, so instantly it's falsey result
    // because layer we match against is not ESP tag layer
    // console.log(`033 matchLayer(): early return undefined`);
    return;
  }

  if ( // imagine case of Nunjucks: heads "{%" are normal but tails "-%}" (notice dash)
  wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) || // match every character from the last "layers" complex-type entry must be
  // present in the extracted lump
  Array.from(wholeEspTagLump).every(function (char) {
    return whichLayerToMatch.guessedClosingLump.includes(char);
  }) || // consider ruby heads, <%# and tails -%>
  whichLayerToMatch.guessedClosingLump && // length is more than 2
  whichLayerToMatch.guessedClosingLump.length > 2 && // and last two characters match to what was guessed
  whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 1] === wholeEspTagLump[wholeEspTagLump.length - 1] && whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 2] === wholeEspTagLump[wholeEspTagLump.length - 2]) {
    return wholeEspTagLump.length;
  } // console.log(`054 matchLayer(): finally, return undefined`);

}

var BACKSLASH = "\\"; // This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsTag(str, i, token, layers, withinStyle) {
  return !!(str[i] && str[i].trim().length && (!layers.length || token.type === "text") && (!token.kind || !["doctype", "xml"].includes(token.kind)) && ( // within CSS styles, initiate tags only on opening bracket:
  !withinStyle || str[i] === "<") && (str[i] === "<" && (isHtmlTagOpening.isOpening(str, i, {
    allowCustomTagNames: true
  }) || str[stringLeftRight.right(str, i)] === ">" || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH].includes(str[stringLeftRight.left(str, i)])) && isHtmlTagOpening.isOpening(str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (token.type !== "esp" || token.tail && token.tail.includes(str[i])));
}

// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsEsp(str, i, token, layers, withinStyle) {
  var res = // 1. two consecutive esp characters - Liquid, Mailchimp etc.
  // {{ or |* and so on
  espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && // ensure our suspected lump doesn't comprise only
  // of "notVeryEspChars" - real ESP tag |**| can
  // contain asterisk (*) but only asterisks can't
  // comprise an ESP tag. But curly braces can -
  // {{ and }} are valid Nunjucks heads/tails.
  // So not all ESP tag characters are equal.
  !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) && ( // only "veryEspChars" group characters can
  // be repeated, like {{ and }} - other's can't
  // for example, ** is not real ESP heads
  str[i] !== str[i + 1] || veryEspChars.includes(str[i])) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !( // insurance against repeated percentages
  //
  // imagine: "99%%."
  //             ^
  //      we're here
  str[i] === "%" && str[i + 1] === "%" && "0123456789".includes(str[i - 1]) && (!str[i + 2] || punctuationChars.includes(str[i + 2]) || !str[i + 2].trim().length)) && !(withinStyle && ("{}".includes(str[i]) || "{}".includes(str[stringLeftRight.right(str, i)]))) || //
  // 2. html-like syntax
  //
  // 2.1 - Responsys RPL and similar
  // <#if z> or </#if> and so on
  // normal opening tag
  str[i] === "<" && ( // and
  // either it's closing tag and what follows is ESP-char
  str[i + 1] === "/" && espChars.includes(str[i + 2]) || // or
  // it's not closing and esp char follows right away
  espChars.includes(str[i + 1]) && // but no cheating, character must not be second-grade
  !["-"].includes(str[i + 1])) || // 2.2 - JSP (Java Server Pages)
  // <%@ page blablabla %>
  // <c:set var="someList" value="${jspProp.someList}" />
  str[i] === "<" && ( // covers majority of JSP tag cases
  str[i + 1] === "%" || // <jsp:
  str.startsWith("jsp:", i + 1) || // <cms:
  str.startsWith("cms:", i + 1) || // <c:
  str.startsWith("c:", i + 1)) || str.startsWith("${jspProp", i) || //
  // 3. single character tails, for example RPL's closing curlies: ${zzz}
  // it's specifically a closing-kind character
  ">})".includes(str[i]) && // heads include the opposite of it
  Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) && ( // insurance against "greater than", as in:
  // <#if product.weight > 100>
  str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")) || //
  // 4. comment closing in RPL-like templating languages, for example:
  // <#-- z -->
  str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-";
  return !!res;
}

var version$1 = "5.2.0";

var version = version$1;
var importantStartsRegexp = /^\s*!?\s*[a-zA-Z0-9]+(?:[\s;}<>'"]|$)/gm;
var defaults = {
  tagCb: null,
  tagCbLookahead: 0,
  charCb: null,
  charCbLookahead: 0,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
/**
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 */

function tokenizer(str, originalOpts) {
  var start = Date.now(); //
  //
  //
  //
  //
  //
  //
  // INSURANCE
  // ---------------------------------------------------------------------------

  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"" + typeof str + "\", equal to:\n" + JSON.stringify(str, null, 4));
    }
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type " + typeof originalOpts + ", equal to " + JSON.stringify(originalOpts, null, 4));
  }

  if (originalOpts && isObj(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type " + typeof originalOpts.tagCb + ", equal to " + JSON.stringify(originalOpts.tagCb, null, 4));
  }

  if (originalOpts && isObj(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type " + typeof originalOpts.charCb + ", equal to " + JSON.stringify(originalOpts.charCb, null, 4));
  }

  if (originalOpts && isObj(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type " + typeof originalOpts.reportProgressFunc + ", equal to " + JSON.stringify(originalOpts.reportProgressFunc, null, 4));
  } //
  //
  //
  //
  //
  //
  //
  // OPTS
  // ---------------------------------------------------------------------------


  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts); //
  //
  //
  //
  //
  //
  //
  // VARS
  // ---------------------------------------------------------------------------


  var currentPercentageDone = 0;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing = 0; // index until where to do nothing

  var withinStyle = false; // flag used to instruct content after <style> to toggle type="css"

  var withinStyleComment = false; // opts.*CbLookahead allows to request "x"-many tokens "from the future"
  // to be reported upon each token. You can check what's coming next.
  // To implement this, we need to stash "x"-many tokens and only when enough
  // have been gathered, array.shift() the first one and ping the callback
  // with it, along with "x"-many following tokens. Later, in the end,
  // we clean up stashes and report only as many as we have.
  // The stashes will be LIFO (last in first out) style arrays:

  var tagStash = [];
  var charStash = []; // when we compile the token, we fill this object:

  var token = {};

  function tokenReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    token = {
      type: null,
      start: null,
      end: null,
      value: null
    };
    attribReset();
  } // same for attributes:


  var attribDefaults = {
    attribName: "",
    attribNameRecognised: false,
    attribNameStartsAt: null,
    attribNameEndsAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValueRaw: null,
    attribValue: [],
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStarts: null,
    attribEnds: null,
    attribLeft: null
  };

  var attrib = _objectSpread__default['default']({}, attribDefaults);

  function attribReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    attrib = clone__default['default'](attribDefaults);
  }

  function attribPush(tokenObj) { // 1. clean up any existing tokens first

    /* istanbul ignore else */

    if (attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && !attrib.attribValue[~-attrib.attribValue.length].end) {
      attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
      attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, tokenObj.start);
    }

    attrib.attribValue.push(tokenObj);
  } // same for property


  var propertyDefault = {
    start: null,
    end: null,
    property: null,
    propertyStarts: null,
    propertyEnds: null,
    value: null,
    valueStarts: null,
    valueEnds: null,
    important: null,
    importantStarts: null,
    importantEnds: null,
    colon: null,
    semi: null
  };

  var property = _objectSpread__default['default']({}, propertyDefault);

  function propertyReset() {
    property = _objectSpread__default['default']({}, propertyDefault);
  } // The CSS properties can be in <style> blocks or inline, <div style="">.
  // When we process the code, we have to address both places. This "push"
  // is used in handful of places so we DRY'ed it to a function.


  function pushProperty(p) {
    // push and init and patch up to resume
    if (attrib && attrib.attribName === "style") {
      attrib.attribValue.push(_objectSpread__default['default']({}, p));
    } else if (token && Array.isArray(token.properties)) {
      token.properties.push(_objectSpread__default['default']({}, p));
    }
  } // Initial resets:


  tokenReset(); // ---------------------------------------------------------------------------

  var selectorChunkStartedAt; // For example:
  //
  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |                 |
  //         <-selector chunk ->
  //
  //
  // ---------------------------------------------------------------------------

  var parentTokenToBackup; // We use it for nested ESP tags - for example, <td{% z %}>
  // The esp tag {% z %} is nested among the tag's attributes:
  // {
  //   type: "tag",
  //   start: 0,
  //   end: 11,
  //   value: `<td{% z %}>`,
  //   attribs: [
  //     {
  //       type: "esp",
  //       start: 3,
  //       end: 10,
  //       value: "{% z %}",
  //       head: "{%",
  //       tail: "%}",
  //       kind: null,
  //     },
  //   ],
  // }
  //
  // to allow this, we have to save the current, parent token, in case above,
  // <td...> and then initiate the ESP token, which later will get nested

  var attribToBackup; // We use it when ESP tag is inside the attribute:
  // <a b="{{ c }}d">
  //
  // we need to back up both tag and attrib objects, assemble esp tag, then
  // restore both and stick it inside the "attrib"'s array "attribValue":
  //
  // attribValue: [
  //   {
  //     type: "esp",
  //     start: 6,
  //     end: 13,
  //     value: "{{ c }}",
  //     head: "{{",
  //     tail: "}}",
  //   },
  //   {
  //     type: "text",
  //     start: 13,
  //     end: 14,
  //     value: "d",
  //   },
  // ],

  var lastNonWhitespaceCharAt = null; // ---------------------------------------------------------------------------
  //
  //
  //
  //
  //
  //
  //
  // INNER FUNCTIONS
  // ---------------------------------------------------------------------------
  // When we enter the double quotes or any other kind of "layer", we need to
  // ignore all findings until the "layer" is exited. Here we keep note of the
  // closing strings which exit the current "layer". There can be many of them,
  // nested and escaped and so on.

  var layers = []; // example of contents:
  // [
  //     {
  //         type: "simple",
  //         value: "'",
  //     },
  //     {
  //         type: "esp",
  //         guessedClosingLump: "%}"
  //     }
  // ]
  // there can be two types of layer values: simple strings to match html/css
  // token types and complex, to match esp tokens heuristically, where we don't
  // know exact ESP tails but we know set of characters that suspected "tail"
  // should match.
  //

  function lastLayerIs(something) {
    return !!(Array.isArray(layers) && layers.length && layers[~-layers.length].type === something);
  } // processes closing comment - it's DRY'ed here because it's in multiple places
  // considering broken code like stray closing inline css comment blocks etc.


  function closingComment(i) {
    var end = (stringLeftRight.right(str, i) || i) + 1;
    attribPush({
      type: "comment",
      start: i,
      end: end,
      value: str.slice(i, end),
      closing: true,
      kind: "block",
      language: "css"
    }); // skip next character

    doNothing = end; // pop the block comment layer

    if (lastLayerIs("block")) {
      layers.pop();
    }
  }

  function reportFirstFromStash(stash, cb, lookaheadLength) { // start to assemble node we're report to the callback cb1()

    var currentElem = stash.shift(); // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them
    // that's the container where they'll sit:

    var next = [];

    for (var i = 0; i < lookaheadLength; i++) { // we want as many as "lookaheadLength" from stash but there might be
      // not enough there

      if (stash[i]) {
        next.push(clone__default['default'](stash[i]));
      } else {
        break;
      }
    } // finally, ping the callback with assembled element:

    if (typeof cb === "function") {
      cb(currentElem, next);
    }
  }

  function pingCharCb(incomingToken) { // no cloning, no reset

    if (opts.charCb) {
      // if there were no stashes, we'd call the callback like this:
      // opts.charCb(incomingToken);
      // 1. push to stash
      charStash.push(incomingToken); // 2. is there are enough tokens in the stash, ping the first-one

      if (charStash.length > opts.charCbLookahead) {
        reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
      }
    }
  }

  function pingTagCb(incomingToken) {

    if (opts.tagCb) {
      // console.log(
      //   `419 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
      //     incomingToken,
      //     null,
      //     4
      //   )}`
      // );
      // opts.tagCb(clone(incomingToken));
      // 1. push to stash
      tagStash.push(incomingToken); // 2. is there are enough tokens in the stash, ping the first-one

      if (tagStash.length > opts.tagCbLookahead) {
        reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
      }
    }
  }

  function dumpCurrentToken(incomingToken, i) { // Let's ensure it was not a token with trailing whitespace, because now is
    // the time to separate it and report it as a standalone token.
    // Also, the following clause will catch the unclosed tags like
    // <a href="z" click here</a>

    if (!["text", "esp"].includes(incomingToken.type) && incomingToken.start !== null && incomingToken.start < i && (str[~-i] && !str[~-i].trim() || str[i] === "<")) { // this ending is definitely a token ending. Now the question is,
      // maybe we need to split all gathered token contents into two:
      // maybe it's a tag and a whitespace? or an unclosed tag?
      // in some cases, this token.end will be only end of a second token,
      // we'll need to find where this last chunk started and terminate the
      // previous token (one which started at the current token.start) there.

      if (stringLeftRight.left(str, i) !== null) {
        incomingToken.end = stringLeftRight.left(str, i) + 1;
      } else {
        incomingToken.end = i;
      }

      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);

      if (incomingToken.type === "tag" && !"/>".includes(str[~-incomingToken.end])) { // we need to potentially shift the incomingToken.end left, imagine:
        // <a href="z" click here</a>
        //                       ^
        //               we are here ("i" value), that's incomingToken.end currently
        //
        // <a href="z" click here</a>
        //            ^
        //        incomingToken.end should be here
        //
        // PLAN: take current token, if there are attributes, validate
        // each one of them, terminate at the point of the first smell.
        // If there are no attributes, terminate at the end of a tag name

        var cutOffIndex = incomingToken.tagNameEndsAt || i;

        if (Array.isArray(incomingToken.attribs) && incomingToken.attribs.length) { // initial cut-off point is token.tagNameEndsAt // with each validated attribute, push the cutOffIndex forward:

          for (var i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {

            if (incomingToken.attribs[i2].attribNameRecognised && incomingToken.attribs[i2].attribEnds) {
              cutOffIndex = incomingToken.attribs[i2].attribEnds; // small tweak - consider this:
              // <a href="z" click here</a>
              //            ^
              //         this space in particular
              // that space above should belong to the tag's index range,
              // unless the whitespace is bigger than 1:
              // <a href="z"   click here</a>

              if (str[cutOffIndex + 1] && !str[cutOffIndex].trim() && str[cutOffIndex + 1].trim()) {
                cutOffIndex += 1;
              }
            } else { // delete false attributes from incomingToken.attribs

              if (i2 === 0) {
                // if it's the first attribute and it's already
                // not suitable, for example:
                // <a click here</a>
                // all attributes ("click", "here") are removed:
                incomingToken.attribs = [];
              } else {
                // leave only attributes up to i2-th
                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
              } // in the end stop the loop:

              break;
            }
          }
        }

        incomingToken.end = cutOffIndex;
        incomingToken.value = str.slice(incomingToken.start, incomingToken.end);

        if (!incomingToken.tagNameEndsAt) {
          incomingToken.tagNameEndsAt = cutOffIndex;
        }

        if (incomingToken.tagNameStartsAt && incomingToken.tagNameEndsAt && !incomingToken.tagName) {
          incomingToken.tagName = str.slice(incomingToken.tagNameStartsAt, cutOffIndex);
          incomingToken.recognised = isTagNameRecognised(incomingToken.tagName);
        }
        pingTagCb(incomingToken);
        initToken("text", cutOffIndex);
      } else {
        pingTagCb(incomingToken);
        tokenReset(); // if there was whitespace after token's end:

        if (str[~-i] && !str[~-i].trim()) {
          initToken("text", stringLeftRight.left(str, i) + 1);
        }
      }
    } // if a token is already being recorded, end it


    if (token.start !== null) {

      if (token.end === null && token.start !== i) {
        // (esp tags will have it set already)
        token.end = i;
        token.value = str.slice(token.start, token.end);
      } // normally we'd ping the token but let's not forget we have token stashes
      // in "attribToBackup" and "parentTokenToBackup"

      if (token.start !== null && token.end) {
        // if it's a text token inside "at" rule, nest it, push into that
        // "at" rule pending in layers - otherwise, ping as standalone
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
      }
      tokenReset();
    }
  }

  function atRuleWaitingForClosingCurlie() {
    return lastLayerIs("at") && isObj(layers[~-layers.length].token) && layers[~-layers.length].token.openingCurlyAt && !layers[~-layers.length].token.closingCurlyAt;
  }

  function getNewToken(type, startVal) {
    if (startVal === void 0) {
      startVal = null;
    }

    if (type === "tag") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        recognised: null,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: []
      };
    }

    if (type === "comment") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        closing: false,
        kind: "simple",
        language: "html" // or "css"

      };
    }

    if (type === "rule") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectorsStart: null,
        selectorsEnd: null,
        selectors: [],
        properties: []
      };
    }

    if (type === "at") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        identifier: null,
        identifierStartsAt: null,
        identifierEndsAt: null,
        query: null,
        queryStartsAt: null,
        queryEndsAt: null,
        rules: []
      };
    }

    if (type === "esp") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        head: null,
        headStartsAt: null,
        headEndsAt: null,
        tail: null,
        tailStartsAt: null,
        tailEndsAt: null
      };
    } // a default is text token


    return {
      type: "text",
      start: startVal,
      end: null,
      value: null
    };
  }

  function initToken(type, startVal) { // we mutate the object on the parent scope, so no Object.assign here

    attribReset();
    token = getNewToken(type, startVal);
  }

  function initProperty(propertyStarts) { // we mutate the object on the parent scope, so no Object.assign here

    propertyReset();

    if (typeof propertyStarts === "number") {
      property.propertyStarts = propertyStarts;
      property.start = propertyStarts;
    } else {
      property = _objectSpread__default['default'](_objectSpread__default['default']({}, propertyDefault), propertyStarts);
    }
  }

  function ifQuoteThenAttrClosingQuote(idx) {
    // either it's not a quote:
    return !"'\"".includes(str[idx]) || // precaution when both attrib.attribOpeningQuoteAt and
    // attrib.attribValueStartsAt are missing and thus unusable - just
    // skip this clause in that case... (but it should not ever happen)
    !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) || // or it's real closing quote, because if not, let's keep it within
    // the value, it will be easier to validate, imagine:
    // <div style="float:"left"">
    //
    isHtmlAttributeClosing.isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, idx);
  }

  function attrEndsAt(idx) {
    // either we're within normal head css styles:
    return ";}/".includes(str[idx]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") || // or within inline css styles within html
    "/;'\"><".includes(str[idx]) && attrib && attrib.attribName === "style" && // and it's a real quote, not rogue double-wrapping around the value
    ifQuoteThenAttrClosingQuote(idx);
  } //
  //
  //
  //
  //
  //
  //
  // THE MAIN LOOP
  // ---------------------------------------------------------------------------
  // We deliberately step 1 character outside of str length
  // to simplify the algorithm. Thusly, it's i <= len not i < len:


  var _loop = function _loop(_i) { //
    //
    //
    //
    //                                THE TOP
    //                                ███████
    //
    //
    //
    //
    // Logging:
    // ------------------------------------------------------------------------- // Progress:
    // -------------------------------------------------------------------------

    if (!doNothing && str[_i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (_i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        // defaults:
        // opts.reportProgressFuncFrom = 0
        // opts.reportProgressFuncTo = 100
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    } // Left/Right helpers
    // -------------------------------------------------------------------------


    var leftVal = stringLeftRight.left(str, _i);
    var rightVal = stringLeftRight.right(str, _i); // Turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    if (withinStyle && token.type && !["rule", "at", "text", "comment"].includes(token.type)) {
      withinStyle = false;
    }

    if (doNothing && _i >= doNothing) {
      doNothing = 0;
    } // skip chain of the same-type characters
    // -------------------------------------------------------------------------


    if (isLatinLetter(str[_i]) && isLatinLetter(str[~-_i]) && isLatinLetter(str[_i + 1])) {
      // <style>.a{color:1pximportant}
      //                    ^
      //                  mangled !important
      if (property && property.valueStarts && !property.valueEnds && !property.importantStarts && str.startsWith("important", _i)) {
        property.valueEnds = _i;
        property.value = str.slice(property.valueStarts, _i);
        property.importantStarts = _i;
      }
      i = _i;
      return "continue";
    }

    if (" \t\r\n".includes(str[_i]) && // ~- means subtract 1
    str[_i] === str[~-_i] && str[_i] === str[_i + 1]) {
      i = _i;
      return "continue";
    } // catch the curly tails of at-rules
    // -------------------------------------------------------------------------


    if (!doNothing && atRuleWaitingForClosingCurlie()) { // if (token.type === null && str[i] === "}") {
      // if (str[i] === "}") {

      if (str[_i] === "}") {
        if (!token.type || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          // rule token must end earlier
          if (token.type === "rule") {
            token.end = leftVal + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token); // if it's a text token inside "at" rule, nest it, push into that
            // "at" rule pending in layers - otherwise, ping as standalone

            if (lastLayerIs("at")) {
              layers[~-layers.length].token.rules.push(token);
            }
            tokenReset(); // if there was trailing whitespace, initiate it

            if (leftVal !== null && leftVal < ~-_i) {
              initToken("text", leftVal + 1);
            }
          }
          dumpCurrentToken(token, _i);
          var poppedToken = layers.pop();
          token = poppedToken.token; // then, continue on "at" rule's token...

          token.closingCurlyAt = _i;
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token); // if it's a "rule" token and a parent "at" rule is pending in layers,
          // also put this "rule" into that parent in layers

          if (lastLayerIs("at")) {
            layers[~-layers.length].token.rules.push(token);
          }
          tokenReset();
          doNothing = _i + 1;
        }
      } else if (token.type === "text" && str[_i] && str[_i].trim()) {
        // terminate the text token, all the non-whitespace characters comprise
        // rules because we're inside the at-token, it's CSS!
        token.end = _i;
        token.value = str.slice(token.start, token.end); // if it's a text token inside "at" rule, nest it, push into that
        // "at" rule pending in layers - otherwise, ping as standalone

        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
        tokenReset();
      }
    }

    if (token.end && token.end === _i) {

      if (token.tagName === "style" && !token.closing) {
        withinStyle = true;
      } // we need to retain the information after tag was dumped to tagCb() and wiped


      if (attribToBackup) { // 1. restore

        attrib = attribToBackup; // 2. push current token into attrib.attribValue
        attrib.attribValue.push(token); // 3. restore real token

        token = clone__default['default'](parentTokenToBackup); // 4. reset

        attribToBackup = undefined;
        parentTokenToBackup = undefined;
      } else {
        dumpCurrentToken(token, _i);
        layers.length = 0;
      }
    } //
    //
    //
    //
    //                               MIDDLE
    //                               ██████
    //
    //
    //
    //
    // record "layers" like entering double quotes
    // -------------------------------------------------------------------------

    if (!doNothing) {
      if (["tag", "at"].includes(token.type) && token.kind !== "cdata") {

        if (str[_i] && (SOMEQUOTE.includes(str[_i]) || "()".includes(str[_i])) && !( // below, we have insurance against single quotes, wrapped with quotes:
        // "'" or '"' - templating languages might put single quote as a sttring
        // character, not meaning wrapped-something.
        SOMEQUOTE.includes(str[leftVal]) && str[leftVal] === str[rightVal]) && // protection against double-wrapped values, like
        // <div style="float:"left"">
        //
        //
        // it's not a quote or a real attr ending
        ifQuoteThenAttrClosingQuote(_i) // because if it's not really a closing quote, it's a rogue-one and
        // it belongs to the current attribute's value so that later we
        // can catch it, validating values, imagine "float" value "left" comes
        // with quotes, as in ""left""
        ) {

            if ( // maybe it's the closing counterpart?
            lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
              layers.pop();
            } else {
              // it's opening then
              layers.push({
                type: "simple",
                value: str[_i],
                position: _i
              });
            }
          }
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {

        if (["[", "]"].includes(str[_i])) {

          if ( // maybe it's the closing counterpart?
          lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
            // maybe it's the closing counterpart?
            layers.pop();
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[_i],
              position: _i
            });
          }
        }
      } else if (token.type === "esp" && ("'\"" + BACKTICK + "()").includes(str[_i]) && !( // below, we have insurance against single quotes, wrapped with quotes:
      // "'" or '"' - templating languages might put single quote as a sttring
      // character, not meaning wrapped-something.
      ["\"", "'", "`"].includes(str[leftVal]) && str[leftVal] === str[rightVal])) {

        if ( // maybe it's the closing counterpart?
        lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
          // maybe it's the closing counterpart?
          layers.pop();
          doNothing = _i + 1;
        } else if (!"]})>".includes(str[_i])) {
          // it's opening then
          layers.push({
            type: "simple",
            value: str[_i],
            position: _i
          });
        }
      } // console.log(
      //   `1094 FIY, currently ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
      //     layers,
      //     null,
      //     4
      //   )}`
      // );

    } // catch the start of at rule's identifierStartsAt
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "at" && token.start != null && _i >= token.start && !token.identifierStartsAt && str[_i] && str[_i].trim() && str[_i] !== "@") {
      // the media identifier's "entry" requirements are deliberately loose
      // because we want to catch errors there, imagine somebody mistakenly
      // adds a comma, @,media
      // or adds a space, @ media
      token.identifierStartsAt = _i;
    } // catch the end of the "at" rule token
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "at" && token.queryStartsAt && !token.queryEndsAt && "{;".includes(str[_i])) {

      if (str[_i] === "{") {
        if (str[~-_i] && str[~-_i].trim()) {
          token.queryEndsAt = _i;
        } else {
          // trim the trailing whitespace:
          // @media (max-width: 600px) {
          //                          ^
          //                        this
          //
          token.queryEndsAt = leftVal !== null ? leftVal + 1 : _i; // left() stops "to the left" of a character, if you used that index
          // for slicing, that character would be included, in our case,
          // @media (max-width: 600px) {
          //                         ^
          //            that would be index of this bracket
        }
      } else {
        // ; closing, for example, illegal:
        // @charset "UTF-8";
        //                 ^
        //          we're here
        //
        token.queryEndsAt = stringLeftRight.left(str, _i + 1) || 0;
      }

      if (token.queryStartsAt && token.queryEndsAt) {
        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      }

      token.end = str[_i] === ";" ? _i + 1 : _i;
      token.value = str.slice(token.start, token.end);

      if (str[_i] === ";") {
        // if code is clean, that would be @charset for example, no curlies
        pingTagCb(token);
      } else {
        // then it's opening curlie
        token.openingCurlyAt = _i; // push so far gathered token into layers

        layers.push({
          type: "at",
          token: token
        });
      }
      tokenReset();
      doNothing = _i + 1;
    } // catch the start of the query
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "at" && token.identifier && str[_i] && str[_i].trim() && !token.queryStartsAt) {
      token.queryStartsAt = _i;
    } // catch the end of at rule's identifierStartsAt
    // -------------------------------------------------------------------------


    if (!doNothing && token && token.type === "at" && token.identifierStartsAt && _i >= token.start && str[_i] && (!str[_i].trim() || "()".includes(str[_i])) && !token.identifierEndsAt) {
      token.identifierEndsAt = _i;
      token.identifier = str.slice(token.identifierStartsAt, _i);
    } // catch the end of a CSS chunk
    // -------------------------------------------------------------------------
    // charsThatEndCSSChunks:  } , {


    if (token.type === "rule") {
      if (selectorChunkStartedAt && (charsThatEndCSSChunks.includes(str[_i]) || str[_i] && rightVal && !str[_i].trim() && charsThatEndCSSChunks.includes(str[rightVal]))) {
        token.selectors.push({
          value: str.slice(selectorChunkStartedAt, _i),
          selectorStarts: selectorChunkStartedAt,
          selectorEnds: _i
        });
        selectorChunkStartedAt = undefined;
        token.selectorsEnd = _i;
      } else if (str[_i] === "{" && token.openingCurlyAt && !token.closingCurlyAt) {
        // we encounted an opening curly even though closing hasn't
        // been met yet:
        // <style>.a{float:left;x">.b{color: red}
        //                           ^
        //                    we're here // let selectorChunkStartedAt2;

        for (var y = _i; y--;) {

          if (!str[y].trim() || "{}\"';".includes(str[y])) { // patch the property

            if (property && property.start && !property.end) {
              property.end = y + 1;
              property.property = str.slice(property.start, property.end);
              pushProperty(property);
              propertyReset();
              token.end = y + 1;
              token.value = str.slice(token.start, token.end);
              pingTagCb(token);
              initToken(str[y + 1] === "@" ? "at" : "rule", y + 1);
              token.left = stringLeftRight.left(str, y + 1);
              token.selectorsStart = y + 1;
              _i = y + 1;
            }

            break;
          }
        }
      }
    } // catch the beginning of a token
    // -------------------------------------------------------------------------
    // imagine layers are like this:
    // [
    //   {
    //     type: "esp",
    //     openingLump: "<%@",
    //     guessedClosingLump: "@%>",
    //     position: 0,
    //   },
    //   {
    //     type: "simple",
    //     value: '"',
    //     position: 17,
    //   },
    //   {
    //     type: "simple",
    //     value: "'",
    //     position: 42,
    //   },
    // ];
    // we extract the last type="esp" layer to simplify calculations


    var lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);

    if (!doNothing && str[_i]) { // console.log(
      //   `1707 ███████████████████████████████████████ IS COMMENT STARTING? ${startsHtmlComment(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );
      // console.log(
      //   `1717 ███████████████████████████████████████ IS ESP TAG STARTING? ${startsEsp(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );

      if (startsTag(str, _i, token, layers, withinStyle)) {
        //
        //
        //
        // TAG STARTING
        //
        //
        //

        if (token.type && token.start !== null) {
          if (token.type === "rule") {
            if (property && property.propertyStarts) {
              property.propertyEnds = _i;
              property.property = str.slice(property.propertyStarts, _i);

              if (!property.end) {
                property.end = _i;
              }

              pushProperty(property);
              propertyReset();
            }
          }
          dumpCurrentToken(token, _i);
          tokenReset();
        } // add other HTML-specific keys onto the object
        // second arg is "start" key:


        initToken("tag", _i);

        if (withinStyle) {
          withinStyle = false;
        } // extract the tag name:


        var badCharacters = "?![-/";
        var extractedTagName = "";
        var letterMet = false;

        if (rightVal) {
          for (var _y = rightVal; _y < len; _y++) {

            if (!letterMet && str[_y] && str[_y].trim() && str[_y].toUpperCase() !== str[_y].toLowerCase()) {
              letterMet = true;
            }

            if ( // at least one letter has been met, to cater
            // <? xml ...
            letterMet && str[_y] && ( // it's whitespace
            !str[_y].trim() || // or symbol which definitely does not belong to a tag,
            // considering we want to catch some rogue characters to
            // validate and flag them up later
            !/\w/.test(str[_y]) && !badCharacters.includes(str[_y]) || str[_y] === "[") // if letter has been met, "[" is also terminating character
            // think <![CDATA[x<y]]>
            //               ^
            //             this
            ) {
                break;
              } else if (!badCharacters.includes(str[_y])) {
              extractedTagName += str[_y].trim().toLowerCase();
            }
          }
        } // set the kind:

        if (extractedTagName === "doctype") {
          token.kind = "doctype";
        } else if (extractedTagName === "cdata") {
          token.kind = "cdata";
        } else if (extractedTagName === "xml") {
          token.kind = "xml";
        } else if (inlineTags.has(extractedTagName)) {
          token.kind = "inline";
        }
      } else if (startsHtmlComment(str, _i, token, layers)) {
        //
        //
        //
        // HTML COMMENT STARTING
        //
        //
        //

        if (token.start != null) {
          dumpCurrentToken(token, _i);
        } // add other HTML-specific keys onto the object
        // second arg is "start" key:


        initToken("comment", _i); // the "language" default is "html" anyway so no need to set it // set "closing"

        if (str[_i] === "-") {
          token.closing = true;
        } else if (stringMatchLeftRight.matchRightIncl(str, _i, ["<![endif]-->"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.closing = true;
          token.kind = "only";
        }

        if (withinStyle) {
          withinStyle = false;
        }
      } else if (startsCssComment(str, _i, token, layers, withinStyle)) {
        //
        //
        //
        // CSS COMMENT STARTING
        //
        //
        //

        if (token.start != null) {
          dumpCurrentToken(token, _i);
        } // add other token-specific keys onto the object
        // second arg is "start" key:


        initToken("comment", _i);
        token.language = "css";
        token.kind = str[_i] === "/" && str[_i + 1] === "/" ? "line" : "block";
        token.value = str.slice(_i, _i + 2);
        token.end = _i + 2;
        token.closing = str[_i] === "*" && str[_i + 1] === "/";
        withinStyleComment = true;

        if (token.closing) {
          withinStyleComment = false;
        }

        doNothing = _i + 2;
      } else if ( // if we encounter two consecutive characters of guessed lump
      typeof lastEspLayerObjIdx === "number" && layers[lastEspLayerObjIdx] && layers[lastEspLayerObjIdx].type === "esp" && layers[lastEspLayerObjIdx].openingLump && layers[lastEspLayerObjIdx].guessedClosingLump && layers[lastEspLayerObjIdx].guessedClosingLump.length > 1 && // current character is among guessed lump's characters
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[_i]) && // ...and the following character too...
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[_i + 1]) && // since we "jump" over layers, that is, passed quotes
      // and what not, we have to ensure we don't skip
      // legit cases like:
      // ${"${name}${name}${name}${name}"}
      //          ^
      //          here
      // Responsys expression can be within a value! we have
      // to respect those quotes!
      //
      // these are erroneous quotes representing layers
      // which we do ignore (JSP example):
      //
      // <%@taglib prefix="t' tagdir='/WEB-INF/tags"%>
      //                  ^ ^        ^             ^
      //                  errors
      !( // we excluse the same case,
      // ${"${name}${name}${name}${name}"}
      //          ^
      //        false ending
      // we ensure that quote doesn't follow the esp layer
      // "lastEspLayerObjIdx" and there's counterpart of it
      // on the right, and there's ESP char on the right of it
      // next layer after esp's follows
      layers[lastEspLayerObjIdx + 1] && // and it's quote
      "'\"".includes(layers[lastEspLayerObjIdx + 1].value) && // matching quote on the right has ESP character following
      // it exists (>-1)
      str.indexOf(layers[lastEspLayerObjIdx + 1].value, _i) > 0 && layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[stringLeftRight.right(str, str.indexOf(layers[lastEspLayerObjIdx + 1].value, _i))])) || // hard check
      startsEsp(str, _i, token, layers, withinStyle) && ( // ensure we're not inside quotes, so it's not an expression within a value
      // ${"${name}${name}${name}${name}"}
      //    ^
      //   we could be here - notice quotes wrapping all around
      //
      !lastLayerIs("simple") || !["'", "\""].includes(layers[~-layers.length].value) || // or we're within an attribute (so quotes are HTML tag's not esp tag's)
      attrib && attrib.attribStarts && !attrib.attribEnds)) {
        //
        //
        //
        // ESP TAG STARTING
        //
        //
        // // ESP tags can't be entered from after CSS at-rule tokens or
        // normal CSS rule tokens
        //
        //
        //
        // FIRST, extract the tag opening and guess the closing judging from it

        var wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(str, _i, layers); // lump can't end with attribute's ending, that is, something like:
        // <frameset cols="**">
        // that's a false positive

        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) { // check the "layers" records - maybe it's a closing part of a set?

          var lengthOfClosingEspChunk;
          var disposableVar;

          if (layers.length && ( //
          // if layer match result is truthy, we take it, otherwise, move on
          // but don't calculate twice!
          // eslint-disable-next-line no-cond-assign
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers))) { // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()

            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(_i, _i + lengthOfClosingEspChunk);
                token.tailStartsAt = _i;
                token.tailEndsAt = token.end; // correction for XML-like templating tags, closing can
                // have a slash, <c:set zzz/>
                //                         ^

                if (str[_i] === ">" && str[leftVal] === "/") {
                  token.tailStartsAt = leftVal;
                  token.tail = str.slice(token.tailStartsAt, _i + 1);
                }
              } // activate doNothing until the end of tails because otherwise,
              // mid-tail characters will initiate new tail start clauses
              // and we'll have overlap/false result


              doNothing = token.tailEndsAt; // it depends will we ping it as a standalone token or will we
              // nest inside the parent tag among attributes

              if (parentTokenToBackup) { // push token to parent, to be among its attributes
                // 1. ensure key "attribs" exist (thinking about comment tokens etc)

                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs = [];
                } // 2. push somewhere


                if (attribToBackup) {
                  // 1. restore
                  attrib = attribToBackup; // 2. push to attribValue
                  attrib.attribValue.push(_objectSpread__default['default']({}, token));
                } else {
                  // push to attribs
                  parentTokenToBackup.attribs.push(_objectSpread__default['default']({}, token));
                } // 3. parentTokenToBackup becomes token


                token = clone__default['default'](parentTokenToBackup); // 4. resets

                parentTokenToBackup = undefined;
                attribToBackup = undefined; // 5. pop layers, remove the opening ESP tag record
                layers.pop(); // 6. finally, continue, bypassing the rest of the code in this loop
                i = _i;
                return "continue";
              } else {
                dumpCurrentToken(token, _i);
              }
              tokenReset();
            } // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:


            layers.pop();
          } else if (layers.length && ( // eslint-disable-next-line no-cond-assign
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, true))) { // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()

            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + (lengthOfClosingEspChunk || 0);
                token.value = str.slice(token.start, token.end);
              }

              if (!token.tailStartsAt) {
                token.tailStartsAt = _i;
              }

              if (!token.tailEndsAt && lengthOfClosingEspChunk) {
                token.tailEndsAt = token.tailStartsAt + lengthOfClosingEspChunk;
                token.tail = str.slice(_i, _i + lengthOfClosingEspChunk);
              }

              dumpCurrentToken(token, _i);
              tokenReset();
            } // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:


            layers.length = 0;
          } else if ( // insurance against stray tails inside attributes:
          // <a b="{ x %}">
          //       ^   ^
          //       |   |
          //       |   we're here
          //       |
          //       |
          //     this opening bracket is incomplete
          //     and therefore not recognised as an opening
          //
          //
          // if ESP character lump we extracted, for example,
          // %} contains a closing character, in this case, a }
          attrib && attrib.attribValue && attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i)).some(function (char, idx) {
            return wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) && ( // ensure it's not a false alarm, "notVeryEspChars"
            // bunch, for example, % or $ can be legit characters
            //
            // either it's from "veryEspChars" list so
            // it can be anywhere, not necessarily at the
            // beginning, for example, broken mailchimp:
            // <a b="some text | x *|">
            //                 ^
            //               this is
            //
            veryEspChars.includes(char) || // or that character must be the first character
            // of the attribute's value, for example:
            // <a b="% x %}">
            //       ^
            //     this
            //
            // because imagine false positive, legit %:
            // <a b="Real 5% discount! x %}">
            //             ^
            //    definitely not a part of broken opening {%
            //
            // it's zero'th index:
            !idx) && (disposableVar = {
              char: char,
              idx: idx
            });
          }) && // we're inside attribute
          token.type === "tag" && attrib && attrib.attribValueStartsAt && !attrib.attribValueEndsAt && // last attribute's value element is text-type
          // imagine, the { x from <a b="{ x %}"> would be
          // such unrecognised text:
          attrib.attribValue[~-attrib.attribValue.length] && attrib.attribValue[~-attrib.attribValue.length].type === "text") { // token does contain ESP tags, so it's not pure HTML

            token.pureHTML = false;
            var lastAttrValueObj = attrib.attribValue[~-attrib.attribValue.length]; // getNewToken() just creates a new token according
            // the latest (DRY) reference, it doesn't reset
            // the "token" unlike initToken()

            var newTokenToPutInstead = getNewToken("esp", lastAttrValueObj.start); // for remaining values, we need to consider, is there
            // text in front:
            //
            // <a b="{ x %}">
            // vs.
            // <a b="something { x %}">

            if (!disposableVar || !disposableVar.idx) {
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt = newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = _i;
              newTokenToPutInstead.tailEndsAt = _i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;
              attrib.attribValue[~-attrib.attribValue.length] = newTokenToPutInstead;
            }
          } else { // If we've got an unclosed heads and here new heads are starting,
            // pop the last heads in layers - they will never be matched anyway.
            // Let parser/linter deal with it

            if (lastLayerIs("esp")) {
              layers.pop();
            } // if we're within a tag attribute, push the last esp token there


            if (attribToBackup) {
              if (!Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue = [];
              }
              attribToBackup.attribValue.push(token);
            }
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLumpOnTheRight,
              guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
              position: _i
            }); // also, if it's a standalone ESP token, terminate the previous token
            // and start recording a new-one

            if (token.start !== null) {
              // it means token has already being recorded, we need to tackle it -
              // the new, ESP token is incoming!
              // we nest ESP tokens inside "tag" type attributes
              if (token.type === "tag") { // instead of dumping the tag token and starting a new-one,
                // save the parent token, then nest all ESP tags among attributes

                if (token.tagNameStartsAt && (!token.tagName || !token.tagNameEndsAt)) {
                  token.tagNameEndsAt = _i;
                  token.tagName = str.slice(token.tagNameStartsAt, _i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }

                parentTokenToBackup = clone__default['default'](token);

                if (attrib.attribStarts && !attrib.attribEnds) {
                  attribToBackup = clone__default['default'](attrib);
                }
              } else if (!attribToBackup) {
                dumpCurrentToken(token, _i);
              } else if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length && attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "esp" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = _i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, _i);
              }
            } // now, either way, if parent tag was stashed in "parentTokenToBackup"
            // or if this is a new ESP token and there's nothing to nest,
            // let's initiate it:


            initToken("esp", _i);
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = _i;
            token.headEndsAt = _i + wholeEspTagLumpOnTheRight.length; // toggle parentTokenToBackup.pureHTML

            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
            } // if text token has been initiated, imagine:
            //  "attribValue": [
            //     {
            //         "type": "text",
            //         "start": 6, <-------- after the initiation of this, we started ESP token at 6
            //         "end": null,
            //         "value": null
            //     },
            //     {
            //         "type": "esp",
            //         "start": 6, <-------- same start on real ESP token
            //           ...
            //  ],


            if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length) {

              if (attribToBackup.attribValue[~-attribToBackup.attribValue.length].start === token.start) { // erase it from stash

                attribToBackup.attribValue.pop();
              } else if ( // if the "text" type object is the last in "attribValue" and
              // it's not closed, let's close it and calculate its value:
              attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "text" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = _i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, _i);
              }
            }
          } // do nothing for the second and following characters from the lump


          doNothing = _i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
        }
      } else if (withinStyle && !withinStyleComment && str[_i] && str[_i].trim() && // insurance against rogue extra closing curlies:
      // .a{x}}
      // don't start new rule at closing curlie!
      !"{}".includes(str[_i]) && ( // if at rule starts right after <style>, if we're on "@"
      // for example:
      // <style>@media a {.b{c}}</style>
      // first the <style> tag token will be pushed and then tag object
      // reset and then, still at "@"
      !token.type || // or, there was whitespace and we started recording a text token
      // <style>  @media a {.b{c}}</style>
      //          ^
      //        we're here - look at the whitespace on the left.
      //
      ["text"].includes(token.type))) {
        // Text token inside styles can be either whitespace chunk
        // or rogue characters. In either case, inside styles, when
        // "withinStyle" is on, non-whitespace character terminates
        // this text token and "rule" token starts

        if (token.type) {
          dumpCurrentToken(token, _i);
        }

        initToken(str[_i] === "@" ? "at" : "rule", _i);
        token.left = lastNonWhitespaceCharAt;
        token.nested = layers.some(function (o) {
          return o.type === "at";
        });
      } else if (!token.type) {
        initToken("text", _i);
      }
    }

    var R1 = ";'\"{}<>".includes(str[stringLeftRight.right(str, _i - 1)]);
    var R2 = stringMatchLeftRight.matchRightIncl(str, _i, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2
    }); // catch the end of a css property (with or without !important)
    // -------------------------------------------------------------------------

    /* istanbul ignore else */

    if (!doNothing && property && (property.valueStarts && !property.valueEnds && str[rightVal] !== "!" && ( // either non-whitespace character doesn't exist on the right
    !rightVal || // or at that character !important does not start
    R1) || property.importantStarts && !property.importantEnds) && (!property.valueEnds || str[rightVal] !== ";") && ( // either end of string was reached
    !str[_i] || // or it's a whitespace
    !str[_i].trim() || // or it's a semicolon after a value
    !property.valueEnds && str[_i] === ";" || // or we reached the end of the attribute
    attrEndsAt(_i))) {
      /* istanbul ignore else */

      if (property.importantStarts && !property.importantEnds) {
        property.importantEnds = stringLeftRight.left(str, _i) + 1;
        property.important = str.slice(property.importantStarts, property.importantEnds);
      }
      /* istanbul ignore else */


      if (property.valueStarts && !property.valueEnds) {
        property.valueEnds = _i;
        property.value = str.slice(property.valueStarts, _i);
      }
      /* istanbul ignore else */


      if (str[_i] === ";") {
        property.semi = _i;
        property.end = _i + 1;
      } else if (str[rightVal] === ";") {
        property.semi = rightVal;
        property.end = property.semi + 1;
        doNothing = property.end;
      }

      if (!property.end) {
        property.end = _i;
      }

      pushProperty(property);
      propertyReset();
    } // catch the end of a css property's value
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && // token.type === "rule" &&
    property && property.valueStarts && !property.valueEnds) {

      if ( // either end was reached
      !str[_i] || // or terminating characters (semi etc) follow
      R1 || // or !important starts
      R2 || str[stringLeftRight.right(str, _i - 1)] === "!" || // normal head css styles:
      ";}".includes(str[_i]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") || // inline css styles within html
      ";'\"".includes(str[_i]) && attrib && attrib.attribName === "style" && // it's real quote, not rogue double-wrapping around the value
      ifQuoteThenAttrClosingQuote(_i) || // it's a whitespace chunk with linebreaks
      rightVal && !str[_i].trim() && (str.slice(_i, rightVal).includes("\n") || str.slice(_i, rightVal).includes("\r"))) {

        if (lastNonWhitespaceCharAt && ( // it's not a quote
        !"'\"".includes(str[_i]) || // there's nothing on the right
        !rightVal || // or it is a quote, but there's no quote on the right
        !"'\";".includes(str[rightVal]))) {
          property.valueEnds = lastNonWhitespaceCharAt + 1;
          property.value = str.slice(property.valueStarts, lastNonWhitespaceCharAt + 1);
        }

        if (str[_i] === ";") {
          property.semi = _i;
        } else if ( // it's whitespace
        str[_i] && !str[_i].trim() && // semicolon follows
        str[rightVal] === ";") {
          property.semi = rightVal;
        }

        if ( // if semicolon has been spotted...
        property.semi) {
          // set the ending too
          property.end = property.semi + 1; // happy path, clean code has "end" at semi
        }

        if ( // if there's no semicolon in the view
        !property.semi && // and semi is not coming next
        !R1 && // and !important is not following
        !R2 && str[stringLeftRight.right(str, _i - 1)] !== "!" && // and property hasn't ended
        !property.end) {
          // we need to end it because this is it
          property.end = _i;
        }

        if (property.end) {
          // push and init and patch up to resume
          if (property.end > _i) {
            // if ending is in the future, skip everything up to it
            doNothing = property.end;
          }

          pushProperty(property);
          propertyReset();
        }
      } else if (str[_i] === ":" && property && property.colon && property.colon < _i && lastNonWhitespaceCharAt && property.colon + 1 < lastNonWhitespaceCharAt) {
        // .a{b:c d:e;}
        //         ^
        //  we're here
        // // semicolon is missing...
        // traverse backwards from "lastNonWhitespaceCharAt", just in case
        // there's space before colon, .a{b:c d :e;}
        //                                      ^
        //                               we're here
        //
        // we're looking to pinpoint where one rule ends and another starts.
        var split = [];

        if (stringLeftRight.right(str, property.colon)) {
          split = str.slice(stringLeftRight.right(str, property.colon), lastNonWhitespaceCharAt + 1).split(/\s+/);
        }

        if (split.length === 2) {
          // it's missing semicol, like: .a{b:c d:e;}
          //                                 ^   ^
          //                                 |gap| we split
          //
          property.valueEnds = property.valueStarts + split[0].length;
          property.value = str.slice(property.valueStarts, property.valueEnds);
          property.end = property.valueEnds; // push and init and patch up to resume
          pushProperty(property); // backup the values before wiping the property:

          var whitespaceStarts = property.end;
          var newPropertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
          propertyReset();
          pushProperty({
            type: "text",
            start: whitespaceStarts,
            end: newPropertyStarts,
            value: str.slice(whitespaceStarts, newPropertyStarts)
          });
          property.start = newPropertyStarts;
          property.propertyStarts = newPropertyStarts;
        }
      } else if (str[_i] === "/" && str[rightVal] === "*") {
        // comment starts
        // <a style="color: red/* zzz */">
        //                     ^
        //                we're here

        /* istanbul ignore else */
        if (property.valueStarts && !property.valueEnds) {
          property.valueEnds = _i;
          property.value = str.slice(property.valueStarts, _i);
        }
        /* istanbul ignore else */


        if (!property.end) {
          property.end = _i;
        } // push and init and patch up to resume

        pushProperty(property);
        propertyReset();
      }
    } // catch the css property's semicolon
    // -------------------------------------------------------------------------


    if (!doNothing && property && property.start && !property.end && str[_i] === ";") {
      property.semi = _i;
      property.end = _i + 1;

      if (!property.propertyEnds) {
        property.propertyEnds = _i;
      }

      if (property.propertyStarts && property.propertyEnds && !property.property) {
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }

      pushProperty(property);
      propertyReset();
    } // catch the start of css property's !important
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && property && property.valueEnds && !property.importantStarts && ( // it's an exclamation mark
    str[_i] === "!" || // considering missing excl. mark cases, more strict req.:
    isLatinLetter(str[_i]) && str.slice(_i).match(importantStartsRegexp))) {
      property.importantStarts = _i; // correction for cases like:
      // <style>.a{color:red 1important}
      //                     ^
      //            we're here, that "1" needs to be included as part of important

      if ( // it's non-whitespace char in front
      str[_i - 1] && str[_i - 1].trim() && // and before that it's whitespace
      str[_i - 2] && !str[_i - 2].trim()) {
        // merge that character into !important
        property.valueEnds = stringLeftRight.left(str, _i - 1) + 1;
        property.value = str.slice(property.valueStarts, property.valueEnds);
        property.importantStarts--;
        property.important = str[_i - 1] + property.important;
      }
    } // catch the start of a css property's value
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && property && property.colon && !property.valueStarts && str[_i] && str[_i].trim()) {
      /* istanbul ignore else */

      if ( // stopper character met:
      ";}'\"".includes(str[_i]) && // either it's real closing quote or not a quote
      ifQuoteThenAttrClosingQuote(_i)) {
        /* istanbul ignore else */

        if (str[_i] === ";") {
          property.semi = _i;
        }

        var temp; // patch missing .end

        /* istanbul ignore else */

        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : stringLeftRight.left(str, _i) + 1;
          temp = property.end;
        } // push and init and patch up to resume


        pushProperty(property);
        propertyReset(); // if there was a whitespace gap, submit it as text token

        /* istanbul ignore else */

        if (temp && temp < _i) {
          pushProperty({
            type: "text",
            start: temp,
            end: _i,
            value: str.slice(temp, _i)
          });
        }
      } else {
        property.valueStarts = _i;
      }
    } // catch the start of a css chunk
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() && !"{}".includes(str[_i]) && !selectorChunkStartedAt && !token.openingCurlyAt) {
      if (!",".includes(str[_i])) {
        selectorChunkStartedAt = _i;

        if (token.selectorsStart === null) {
          token.selectorsStart = _i;
        }
      } else {
        // this contraption is needed to catch commas and assign
        // correctly broken chunk range, [selectorsStart, selectorsEnd]
        token.selectorsEnd = _i + 1;
      }
    } // catch the end of a css property's name
    // -------------------------------------------------------------------------


    if (!doNothing && // token.type === "rule" &&
    property && property.propertyStarts && property.propertyStarts < _i && !property.propertyEnds && ( // end was reached
    !str[_i] || // or it's whitespace
    !str[_i].trim() || // or
    // it's not suitable
    !attrNameRegexp.test(str[_i]) && ( // and
    // it's a colon (clean code)
    // <div style="float:left;">z</div>
    //                  ^
    //          we're here
    //
    str[_i] === ":" || //
    // or
    //
    // <div style="float.:left;">z</div>
    //                  ^
    //                include this dot within property name
    //                so that we can catch it later validating prop names
    //
    !rightVal || !":/}".includes(str[rightVal]) || // mind the rogue closings .a{x}}
    str[_i] === "}" && str[rightVal] === "}")) && ( // also, regarding the slash,
    // <div style="//color: red;">
    //              ^
    //            don't close here, continue, gather "//color"
    //
    str[_i] !== "/" || str[_i - 1] !== "/")) {
      property.propertyEnds = _i;
      property.property = str.slice(property.propertyStarts, _i);

      if (property.valueStarts) {
        // it's needed to safeguard against case like:
        // <style>.a{b:c d:e;}</style>
        //                ^
        //            imagine we're here - valueStarts is not set!
        property.end = _i;
      } // missing colon and onwards:
      // <style>.b{c}</style>
      // <style>.b{c;d}</style>


      if ("};".includes(str[_i]) || // it's whitespace and it's not leading up to a colon
      str[_i] && !str[_i].trim() && str[rightVal] !== ":") {
        if (str[_i] === ";") {
          property.semi = _i;
        } // precaution against broken code:
        // .a{x}}
        //


        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : _i;
        } // push and init and patch up to resume


        pushProperty(property);
        propertyReset();
      } // cases with replaced colon:
      // <div style="float.left;">


      if ( // it's a non-whitespace character
      str[_i] && str[_i].trim() && // and property seems plausible - its first char at least
      attrNameRegexp.test(str[property.propertyStarts]) && // but this current char is not:
      !attrNameRegexp.test(str[_i]) && // and it's not terminating character
      !":'\"".includes(str[_i])) { // find out locations of next semi and next colon

        var nextSemi = str.indexOf(";", _i);
        var nextColon = str.indexOf(":", _i); // whatever the situation, colon must not be before semi on the right
        // either one or both missing is fine, we just want to avoid
        // <div style="floa.t:left;
        //                 ^
        //            this is not a dodgy colon
        //
        // but,
        //
        // <div style="float.left;
        //                  ^
        //                this is

        if ( // either semi but no colon
        nextColon === -1 && nextSemi !== -1 || !(nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi)) {
          // <div style="float.left;">
          //                  ^
          //            we're here
          property.colon = _i;
          property.valueStarts = rightVal;
        } else if (nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi) {
          // case like
          // <div style="floa/t:left;">
          //                 ^
          //          we're here
          property.propertyEnds = null;
        }
      }
    } // catch the colon of a css property
    // -------------------------------------------------------------------------


    if (!doNothing && // we don't check for token.type === "rule" because inline css will use
    // these clauses too and token.type === "tag" there, but
    // attrib.attribName === "style"
    // on other hand, we don't need strict validation here either, to enter
    // these clauses it's enough that "property" was initiated.
    property && property.propertyEnds && !property.valueStarts && str[_i] === ":") {
      property.colon = _i; // if string abruptly ends, record it here

      if (!rightVal) {
        property.end = _i + 1;

        if (str[_i + 1]) {
          // push and init and patch up to resume
          pushProperty(property);
          propertyReset(); // that's some trailing whitespace, create a new text token for it

          if (token.properties) {
            token.properties.push({
              type: "text",
              start: _i + 1,
              end: null,
              value: null
            });
            doNothing = _i + 1;
          }
        }
      } // insurance against rogue characters
      // <style>.a{float:left;x">color: red}
      //                      |       ^
      //                      |     we're here
      //           propertyStarts

      if (property.propertyEnds && lastNonWhitespaceCharAt && property.propertyEnds !== lastNonWhitespaceCharAt + 1 && // it ends upon a bad character
      !attrNameRegexp.test(str[property.propertyEnds])) {
        property.propertyEnds = lastNonWhitespaceCharAt + 1;
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
    } // catch the start of a css property's name
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() && // let all the crap in, filter later:
    !"{};".includes(str[_i]) && // above is instead of a stricter clause:
    // attrNameRegexp.test(str[i]) &&
    //
    token.selectorsEnd && token.openingCurlyAt && !property.propertyStarts && !property.importantStarts) { // first, check maybe there's unfinished text token before it

      if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = _i;
        token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
      } // in normal cases we're set propertyStarts but sometimes it can be
      // importantStarts, imagine:
      // <style>.a{color:red; !important;}
      //                      ^
      //                we're here
      //
      // we want to put "!important" under key "important", not under
      // "property"


      if (str[_i] === "!") {
        initProperty({
          start: _i,
          importantStarts: _i
        });
      } else {
        initProperty(_i);
      }
    } // catch the start a property
    // -------------------------------------------------------------------------
    // Mostly happens in dirty code cases - the start is normally being triggered
    // not from here, the first character, but earlier, from previous clauses.
    // But imagine <div style="float;left">z</div>
    //                              ^
    //                            wrong
    //
    // in case like above, "l" would not have the beginning of a property
    // triggered, hence this clause here


    if (!doNothing && // style attribute is being processed at the moment
    attrib && attrib.attribName === "style" && // it's not done yet
    attrib.attribOpeningQuoteAt && !attrib.attribClosingQuoteAt && // but property hasn't been initiated
    !property.start && // yet the character is suitable:
    // it's not a whitespace
    str[_i] && str[_i].trim() && // it's not some separator
    !"'\";".includes(str[_i]) && // it's not inside CSS block comment
    !lastLayerIs("block")) { // It's either css comment or a css property.
      // Dirty characters go as property name, then later we validate and
      // catch them.
      // Empty space goes as text token, see separate clauses above.

      if ( // currently it's slash
      str[_i] === "/" && // asterisk follows, straight away or after whitespace
      str[rightVal] === "*") {
        attribPush({
          type: "comment",
          start: _i,
          end: rightVal + 1,
          value: str.slice(_i, rightVal + 1),
          closing: false,
          kind: "block",
          language: "css"
        }); // push a new layer, comment

        layers.push({
          type: "block",
          value: str.slice(_i, rightVal + 1),
          position: _i
        }); // skip the next char, consider there might be whitespace in front

        doNothing = rightVal + 1;
      } // if it's a closing comment
      else if (str[_i] === "*" && str[rightVal] === "/") {
          closingComment(_i);
        } else { // first, close the text token if it's not ended

          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
          } // initiate a property
          // if !important has been detected, that's a CSS like:
          // <div style="float:left;!important">
          // the !important is alone by itself


          initProperty(R2 ? {
            start: _i,
            importantStarts: _i
          } : _i);
        }
    } // in comment type, "only" kind tokens, submit square brackets to layers
    // -------------------------------------------------------------------------
    // ps. it's so that we can rule out greater-than signs


    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[_i] === "[") ;
    } // catch the ending of a token
    // -------------------------------------------------------------------------


    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[_i] === ">") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end); // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (token.type === "comment" && token.language === "html" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[_i] === "-" && (stringMatchLeftRight.matchLeft(str, _i, "!-", {
        trimBeforeMatching: true
      }) || stringMatchLeftRight.matchLeftIncl(str, _i, "!-", {
        trimBeforeMatching: true
      }) && str[_i + 1] !== "-") || str[token.start] === "-" && str[_i] === ">" && stringMatchLeftRight.matchLeft(str, _i, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[_i] === "-" && (stringMatchLeftRight.matchRight(str, _i, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || stringMatchLeftRight.matchRight(str, _i, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && ( // the following case will assume closing sq. bracket is present
        xBeforeYOnTheRight(str, _i, "]", ">") || // in case there are no brackets leading up to "mso" (which must exist)
        str.includes("mso", _i) && !str.slice(_i, str.indexOf("mso")).includes("<") && !str.slice(_i, str.indexOf("mso")).includes(">")))) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--[if gte mso 9]>
          //     ^
          //    we're here
          //
          token.kind = "only";
        } else if ( // ensure it's not starting with closing counterpart,
        // --><![endif]-->
        // but with
        // <!--<![endif]-->
        str[token.start] !== "-" && stringMatchLeftRight.matchRightIncl(str, _i, ["-<![endif"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--<![endif]-->
          //     ^
          //    we're here
          //
          token.kind = "not";
          token.closing = true;
        } else if (token.kind === "simple" && token.language === "html" && !token.closing && str[rightVal] === ">") {
          token.end = rightVal + 1;
          token.kind = "simplet";
          token.closing = null;
        } else if (token.language === "html") {
          // if it's a simple HTML comment, <!--, end it right here
          token.end = _i + 1; // tokenizer will catch <!- as opening, so we need to extend
          // for correct cases with two dashes <!--

          if (str[leftVal] === "!" && str[rightVal] === "-") {
            token.end = rightVal + 1;
          }

          token.value = str.slice(token.start, token.end);
        } // at this point other attributes might be still not submitted yet,
        // we can't reset it here

      } else if (token.type === "comment" && token.language === "html" && str[_i] === ">" && (!layers.length || str[rightVal] === "<")) {
        // if last layer was for square bracket, this means closing
        // counterpart is missing so we need to remove it now
        // because it's the ending of the tag ("only" kind) or
        // at least the first part of it ("not" kind)
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].value === "[") {
          layers.pop();
        } // the difference between opening Outlook conditional comment "only"
        // and conditional "only not" is that <!--> follows


        if (!["simplet", "not"].includes(token.kind) && stringMatchLeftRight.matchRight(str, _i, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "css" && str[_i] === "*" && str[_i + 1] === "/") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "esp" && token.end === null && typeof token.head === "string" && typeof token.tail === "string" && token.tail.includes(str[_i])) { // extract the whole lump of ESP tag characters:

        var wholeEspTagClosing = "";

        for (var _y2 = _i; _y2 < len; _y2++) {
          if (espChars.includes(str[_y2])) {
            wholeEspTagClosing += str[_y2];
          } else {
            break;
          }
        } // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here
        // find the breaking point where tails end

        if (wholeEspTagClosing.length > token.head.length) { // in order for this to be tails + new heads, the total length should be
          // at least bigger than heads.
          //
          // For example: Responsys heads: $( - 2 chars. Tails = ) - 1 char.
          // Responsys total of closing tail + head - )$( - 3 chars.
          // That's more than head, 2 chars.
          //
          // For example, eDialog heads: _ - 1 char. Tails: __ - 2 chars.
          // eDialog total of closing tail +  head = 3 chars.
          // That's more than head, 1 char.
          //
          // And same applies to Nujnucks, even considering mix of diferent
          // heads.
          //
          // Another important point - first character in ESP literals.
          // Even if there are different types of literals, more often than not
          // first character is constant. Variations are often inside of
          // the literals pair - for example Nunjucks {{ and {% and {%-
          // the first character is always the same.
          //

          var headsFirstChar = token.head[0];

          if (wholeEspTagClosing.endsWith(token.head)) { // we have a situation like
            // zzz *|aaaa|**|bbb|*
            //           ^
            //         we're here and we extracted a chunk |**| and we're
            //         trying to split it into two.
            //
            // by the way, that's very lucky because node.heads (opening *| above)
            // is confirmed - we passed those heads and we know they are exact.
            // Now, our chunk ends with exactly the same new heads.
            // The only consideration is error scenario, heads intead of tails.
            // That's why we'll check, tags excluded, that's the length left:
            // |**| minus heads *| equals |* -- length 2 -- happy days.
            // Bad scenario:
            // *|aaaa*|bbb|*
            //       ^
            //      we're here
            //
            // *| minus heads *| -- length 0 -- raise an error!

            token.end = _i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = _i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) { // We're very lucky because heads and tails are using different
            // characters, possibly opposite brackets of some kind.
            // That's Nunjucks, Responsys (but no eDialog) patterns.

            var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
            var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar)); // imagine we sliced off (Nunjucks): -%}{%-
            // if every character from anticipated tails (-%}) is present in the front
            // chunk, Bob's your uncle, that's tails with new heads following.

            if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (char) {
              return firstPartOfWholeEspTagClosing.includes(char);
            })) {
              token.end = _i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              doNothing = token.end;
            }
          } else {
            // so heads and tails don't contain unique character, and more so,
            // starting-one, PLUS, second set is different.
            // For example, ESP heads/tails can be *|zzz|*
            // Imaginary example, following heads would be variation of those
            // above, ^|zzz|^ // TODO
            // for now, return defaults, from else scenario below:
            // we consider this whole chunk is tails.

            token.end = _i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          }
        } else {
          // we consider this whole chunk is tails.
          token.end = _i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end); // if last layer is ESP tag and we've got its closing, pop the layer

          if (lastLayerIs("esp")) {
            layers.pop();
          }

          doNothing = token.end;
        }
      } // END OF if (!doNothing)

    } // Catch the end of a tag name
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && token.tagNameStartsAt && !token.tagNameEndsAt) { // tag names can be with numbers, h1

      if (!str[_i] || !charSuitableForTagName(str[_i])) {
        token.tagNameEndsAt = _i;
        token.tagName = str.slice(token.tagNameStartsAt, _i).toLowerCase();

        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        } // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.


        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }

        token.recognised = isTagNameRecognised(token.tagName);
      }
    } // Catch the start of a tag name:
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && !token.tagNameStartsAt && token.start != null && (token.start < _i || str[token.start] !== "<")) { // MULTIPLE ENTRY!
      // Consider closing tag's slashes and tag name itself.

      if (str[_i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[_i])) {
        token.tagNameStartsAt = _i; // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name

        if (!token.closing) {
          token.closing = false;
        }
      } else ;
    } // catch the end of a tag attribute's name
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && attrib.attribNameStartsAt && _i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !isCharSuitableForHtmlAttrName.isAttrNameChar(str[_i])) {
      attrib.attribNameEndsAt = _i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, _i);
      attrib.attribNameRecognised = htmlAllKnownAttributes.allHtmlAttribs.has(attrib.attribName);

      if (attrib.attribName.startsWith("mc:")) {
        // that's a mailchimp attribute
        token.pureHTML = false;
      } // maybe there's a space in front of equal, <div class= "">

      if (str[_i] && !str[_i].trim() && str[rightVal] === "=") ; else if (str[_i] && !str[_i].trim() || str[_i] === ">" || str[_i] === "/" && str[rightVal] === ">") {
        if ("'\"".includes(str[rightVal])) ; else {
          attrib.attribEnds = _i; // push and wipe
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        }
      }
    } // catch the start of a tag attribute's name
    // -------------------------------------------------------------------------


    if (!doNothing && str[_i] && token.type === "tag" && token.kind !== "cdata" && token.tagNameEndsAt && _i > token.tagNameEndsAt && attrib.attribStarts === null && isCharSuitableForHtmlAttrName.isAttrNameChar(str[_i])) {
      attrib.attribStarts = _i; // even though in theory left() which reports first non-whitespace
      // character's index on the left can be null, it does not happen
      // in this context - there will be tag's name or something in front!

      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = _i;
    } // catch the curlies inside CSS rule
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "rule") {
      if (str[_i] === "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = _i;
      } else if (str[_i] === "}" && token.openingCurlyAt && !token.closingCurlyAt) {
        token.closingCurlyAt = _i;
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end); // check is the property's last text token closed:

        if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
          token.properties[~-token.properties.length].end = _i;
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
        } // if there's partial, still-pending property, push it


        if (property.start) {
          token.properties.push(property);
          propertyReset();
        }
        pingTagCb(token); // if it's a "rule" token and a parent "at" rule is pending in layers,
        // also put this "rule" into that parent in layers

        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        }
        tokenReset();
      }
    } // catch the ending of a attribute sub-token value
    // -------------------------------------------------------------------------


    if (!doNothing && attrib.attribName && Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
      // TODO // if it's a closing comment

      if (str[_i] === "*" && str[rightVal] === "/") {
        closingComment(_i);
      }
    } // catch the beginning of a attribute sub-token value
    // -------------------------------------------------------------------------


    if ( // EITHER IT'S INLINE CSS:
    !doNothing && // attribute has been recording
    attrib && // and it's not finished
    attrib.attribValueStartsAt && !attrib.attribValueEndsAt && // and its property hasn't been recording
    !property.propertyStarts && // we're inside the value
    _i >= attrib.attribValueStartsAt && // if attribValue array is empty, no object has been placed yet,
    Array.isArray(attrib.attribValue) && (!attrib.attribValue.length || // or there is one but it's got ending (prevention from submitting
    // another text type object on top, before previous has been closed)
    attrib.attribValue[~-attrib.attribValue.length].end && // and that end is less than current index i
    attrib.attribValue[~-attrib.attribValue.length].end <= _i) || // OR IT'S HEAD CSS
    !doNothing && // css rule token has been recording
    token.type === "rule" && // token started:
    token.openingCurlyAt && // but not ended:
    !token.closingCurlyAt && // there is no unfinished property being recorded
    !property.propertyStarts) { // if it's suitable for property, start a property
      // if it's whitespace, for example,
      // <a style="  /* zzz */color: red;  ">
      //           ^
      //         this
      //
      // rogue text will go as property, for example:
      //
      // <a style="  z color: red;  ">

      if ( // whitespace is automatically text token
      str[_i] && !str[_i].trim() || // if comment layer has been started, it's also a text token, no matter even
      // if it's a property, because it's comment's contents.
      lastLayerIs("block")) { // depends where to push, is it inline css or head css rule

        if (attrib.attribName) {
          attrib.attribValue.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        } else if (token.type === "rule" && ( // we don't want to push over the properties in-progress
        !Array.isArray(token.properties) || !token.properties.length || // last property should have ended
        token.properties[~-token.properties.length].end)) {
          token.properties.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        }
      }
    } // Catch the end of a tag attribute's value:
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && attrib.attribValueStartsAt && _i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {

      if (SOMEQUOTE.includes(str[_i])) {

        if ( // so we're on a single/double quote,
        // (str[i], the current character is a quote)
        // and...
        // we're not inside some ESP tag - ESP layers are not pending:
        !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        }) && ( // and the current character passed the
        // attribute closing quote validation by
        // "is-html-attribute-closing"
        //
        // the isAttrClosing() api is the following:
        // 1. str, 2. opening quotes index, 3. suspected
        // character for attribute closing (quotes typically,
        // but can be mismatching)...
        // see the package "is-html-attribute-closing" on npm:
        //
        //
        // either end was reached,
        !str[_i] || // or there is no closing bracket further
        !str.includes(">", _i) || // further checks confirm it looks like legit closing
        isHtmlAttributeClosing.isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, _i))) {
          attrib.attribClosingQuoteAt = _i;
          attrib.attribValueEndsAt = _i;

          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);
          }

          attrib.attribEnds = _i + 1;

          if (property.propertyStarts) {
            attrib.attribValue.push(clone__default['default'](property));
            propertyReset();
          }

          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) { // if it's not a property (of inline style), set its "end"

            if (!attrib.attribValue[~-attrib.attribValue.length].property) {
              attrib.attribValue[~-attrib.attribValue.length].end = _i;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
            }
          } // 2. if the pair was mismatching, wipe layers' last element

          if (str[attrib.attribOpeningQuoteAt] !== str[_i]) {
            layers.pop();
            layers.pop();
          } // 3. last check for the last attribValue's .end - in some broken code
          // cases it might be still null:
          // <div style="float:left;x">
          //                         ^
          //                       we're here


          if (attrib.attribValue[~-attrib.attribValue.length] && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
          } // 4. push and wipe
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        } else if ((!Array.isArray(attrib.attribValue) || !attrib.attribValue.length || // last attrib value should not be a text token
        attrib.attribValue[~-attrib.attribValue.length].type !== "text") && !property.propertyStarts) {
          // quotes not matched, so it's unencoded, raw quote, part of the value
          // for example
          // <table width=""100">
          //               ^
          //            rogue quote
          // let's initiate a next token
          attrib.attribValue.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        }
      } else if (attrib.attribOpeningQuoteAt === null && (str[_i] && !str[_i].trim() || ["/", ">"].includes(str[_i]) || espChars.includes(str[_i]) && espChars.includes(str[_i + 1]))) {
        // ^ either whitespace or tag's closing or ESP literal's start ends
        // the attribute's value if there are no quotes
        attrib.attribValueEndsAt = _i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);

        if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
          attrib.attribValue[~-attrib.attribValue.length].end = _i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValue[~-attrib.attribValue.length].end);
        }

        attrib.attribEnds = _i; // 2. push and wipe

        token.attribs.push(clone__default['default'](attrib));
        attribReset(); // 3. pop layers

        layers.pop(); // 4. tackle the tag ending

        if (str[_i] === ">") {
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (str[_i] === "=" && leftVal !== null && rightVal && ("'\"".includes(str[rightVal]) || str[~-_i] && isLatinLetter(str[~-_i])) && // this will catch url params like
      // <img src="https://z.png?query=" />
      //                              ^
      //                            false alarm
      //
      // let's exclude anything URL-related
      !(attrib && attrib.attribOpeningQuoteAt && ( // check for presence of slash, /
      /\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i)) || // check for mailto:
      /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i)) || // check for /\w?\w/ like
      // <img src="codsen.com?query=" />
      //                     ^
      /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i))))) { // all depends, are there whitespace characters:
        // imagine
        // <a href="border="0">
        // vs
        // <a href="xyz border="0">
        // that's two different cases - there's nothing to salvage in former!
        var whitespaceFound;
        var attribClosingQuoteAt;

        for (var _y3 = leftVal; _y3 >= attrib.attribValueStartsAt; _y3--) { // catch where whitespace starts

          if (!whitespaceFound && str[_y3] && !str[_y3].trim()) {
            whitespaceFound = true;

            if (attribClosingQuoteAt) {
              // slice the captured chunk
              str.slice(_y3, attribClosingQuoteAt);
            }
          } // where that caught whitespace ends, that's the default location
          // of double quotes.
          // <a href="xyz border="0">
          //            ^        ^
          //            |        |
          //            |   we go from here
          //         to here


          if (whitespaceFound && str[_y3] && str[_y3].trim()) {
            whitespaceFound = false;

            if (!attribClosingQuoteAt) {
              // that's the first, default location
              attribClosingQuoteAt = _y3 + 1;
            }
          }
        }

        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;

          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, attribClosingQuoteAt);

            if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
              attrib.attribValue[~-attrib.attribValue.length].end = attrib.attribValueEndsAt;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValueEndsAt);
            }
          }

          attrib.attribEnds = attribClosingQuoteAt; // 2. if the pair was mismatching, wipe layers' last element

          if (str[attrib.attribOpeningQuoteAt] !== str[_i]) {
            layers.pop();
          } // 3. push and wipe


          token.attribs.push(clone__default['default'](attrib));
          attribReset(); // 4. pull the i back to the position where the attribute ends

          _i = ~-attribClosingQuoteAt;
          i = _i;
          return "continue";
        } else if (attrib.attribOpeningQuoteAt && ("'\"".includes(str[rightVal]) || htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, _i).trim()))) {
          // worst case scenario:
          // <span width="height="100">
          //
          // traversing back from second "=" we hit only the beginning of an
          // attribute, there was nothing to salvage.
          // In this case, reset the attribute's calculation, go backwards to "h".
          // 1. pull back the index, go backwards, read this new attribute again
          _i = attrib.attribOpeningQuoteAt; // 2. end the attribute

          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1; // 3. value doesn't start, this needs correction

          attrib.attribValueStartsAt = null; // 4. pop the opening quotes layer

          layers.pop(); // 5. push and wipe

          token.attribs.push(clone__default['default'](attrib));
          attribReset(); // 6. continue
          i = _i;
          return "continue";
        }
      } else if (attrib && attrib.attribName !== "style" && attrib.attribStarts && !attrib.attribEnds && !property.propertyStarts && ( //
      // AND,
      //
      // either there are no attributes recorded under attrib.attribValue:
      !Array.isArray(attrib.attribValue) || // or it's array but empty:
      !attrib.attribValue.length || // or is it not empty but its last attrib has ended by now
      attrib.attribValue[~-attrib.attribValue.length].end && attrib.attribValue[~-attrib.attribValue.length].end <= _i)) {
        attrib.attribValue.push({
          type: "text",
          start: _i,
          end: null,
          value: null
        });
      }
    } else if (token.type === "esp" && attribToBackup && parentTokenToBackup && attribToBackup.attribOpeningQuoteAt && attribToBackup.attribValueStartsAt && "'\"".includes(str[_i]) && str[attribToBackup.attribOpeningQuoteAt] === str[_i] && isHtmlAttributeClosing.isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, _i)) { // imagine unclosed ESP tag inside attr value:
      // <tr class="{% x">
      //                ^
      //             we're here
      // we need to still proactively look for closing attribute quotes,
      // even inside ESP tags, if we're inside tag attributes // 1. patch up missing token (which is type="esp" currently) values

      token.end = _i;
      token.value = str.slice(token.start, _i); // 2. push token into attribToBackup.attribValue

      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue = [];
      }
      attribToBackup.attribValue.push(token); // 3. patch up missing values in attribToBackup

      attribToBackup.attribValueEndsAt = _i;
      attribToBackup.attribValueRaw = str.slice(attribToBackup.attribValueStartsAt, _i);
      attribToBackup.attribClosingQuoteAt = _i;
      attribToBackup.attribEnds = _i + 1; // 4. restore parent token

      token = clone__default['default'](parentTokenToBackup);
      token.attribs.push(attribToBackup); // 5. reset all

      attribToBackup = undefined;
      parentTokenToBackup = undefined; // 6. pop the last 3 layers
      // currently layers array should be like:
      // [
      //   {
      //     "type": "simple",
      //     "value": '"',
      //     "position": 10
      //   },
      //   {
      //     "type": "esp",
      //     "openingLump": "{%",
      //     "guessedClosingLump": "%}",
      //     "position": 11
      //   }
      //   {
      //     "type": "simple",
      //     "value": '"',
      //     "position": 15
      //   },
      // ]

      layers.pop();
      layers.pop();
      layers.pop();
    } // Catch the start of a tag attribute's value:
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && !attrib.attribValueStartsAt && attrib.attribNameEndsAt && attrib.attribNameEndsAt <= _i && str[_i] && str[_i].trim()) {

      if (str[_i] === "=" && !SOMEQUOTE.includes(str[rightVal]) && !"=".includes(str[rightVal]) && !espChars.includes(str[rightVal]) // it might be an ESP literal
      ) {
          // find the index of the next quote, single or double
          var firstQuoteOnTheRightIdx = SOMEQUOTE.split("").map(function (quote) {
            return str.indexOf(quote, rightVal);
          }).filter(function (val) {
            return val > 0;
          }).length ? Math.min.apply(Math, SOMEQUOTE.split("").map(function (quote) {
            return str.indexOf(quote, rightVal);
          }).filter(function (val) {
            return val > 0;
          })) : undefined; // catch attribute name - equal - attribute name - equal
          // <span width=height=100>

          if ( // there is a character on the right (otherwise value would be null)
          rightVal && // there is equal character in the remaining chunk
          str.slice(rightVal).includes("=") && // characters upto first equals form a known attribute value
          htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(rightVal, rightVal + str.slice(rightVal).indexOf("=")).trim().toLowerCase())) { // we have something like:
            // <span width=height=100>
            // 1. end the attribute

            attrib.attribEnds = _i + 1; // 2. push and wipe
            token.attribs.push(_objectSpread__default['default']({}, attrib));
            attribReset();
          } else if ( // try to stop this clause:
          //
          // if there are no quotes in the remaining string
          !firstQuoteOnTheRightIdx || // there is one but there are equal character between here and its location
          str.slice(rightVal, firstQuoteOnTheRightIdx).includes("=") || // if there is no second quote of that type in the remaining string
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) || // if string slice from quote to quote includes equal or brackets
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(function (char) {
            return "<>=".includes(char);
          })) { // case of missing opening quotes

            attrib.attribValueStartsAt = rightVal; // push missing entry into layers

            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if (SOMEQUOTE.includes(str[_i])) {
        // maybe it's <span width='"100"> and it's a false opening quote, '
        var nextCharIdx = rightVal;

        if ( // a non-whitespace character exists on the right of index i
        nextCharIdx && // if it is a quote character
        SOMEQUOTE.includes(str[nextCharIdx]) && // but opposite kind,
        str[_i] !== str[nextCharIdx] && // and string is long enough
        str.length > nextCharIdx + 2 && // and remaining string contains that quote like the one on the right
        str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && ( // and to the right of it we don't have str[i] quote,
        // case: <span width="'100'">
        !str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !stringLeftRight.right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[_i] !== str[stringLeftRight.right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) && // and that slice does not contain equal or brackets or quote of other kind
        !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(function (char) {
          return ("<>=" + str[_i]).includes(char);
        })) { // pop the layers

          layers.pop();
        } else {
          // OK then...
          // has the quotes started (it's closing quote) or it's the opening quote?

          /* eslint no-lonely-if: "off" */
          if (!attrib.attribOpeningQuoteAt) {
            attrib.attribOpeningQuoteAt = _i;

            if ( // character exists on the right
            str[_i + 1] && ( // EITHER it's not the same as opening quote we're currently on
            str[_i + 1] !== str[_i] || // OR it's a rogue quote, part of the value
            !ifQuoteThenAttrClosingQuote(_i + 1))) {
              attrib.attribValueStartsAt = _i + 1;
            }
          } else {
            // One quote exists.
            // <table width="100">
            //                  ^
            //

            /* istanbul ignore else */
            if (isHtmlAttributeClosing.isAttrClosing(str, attrib.attribOpeningQuoteAt, _i)) {
              attrib.attribClosingQuoteAt = _i;
            }
            /* istanbul ignore else */


            if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
              if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                attrib.attribValueRaw = str.slice(attrib.attribOpeningQuoteAt + 1, attrib.attribClosingQuoteAt);
              } else {
                attrib.attribValueRaw = "";
              }

              attrib.attribEnds = _i + 1; // push and wipe
              token.attribs.push(clone__default['default'](attrib));
              attribReset();
            }
          }
        }
      } // else - value we assume does not start

    } //
    //
    //
    //
    //
    //                       "PARSING" ERROR CLAUSES
    //                       ███████████████████████
    //
    //
    //
    //
    //
    // Catch raw closing brackets inside attribute's contents, maybe they
    // mean the tag ending and maybe the closing quotes are missing?


    if (!doNothing && str[_i] === ">" && // consider ERB templating tags like <%= @p1 %>
    str[_i - 1] !== "%" && token.type === "tag" && attrib.attribStarts && !attrib.attribEnds) { // Idea is simple: we have to situations:
      // 1. this closing bracket is real, closing bracket
      // 2. this closing bracket is unencoded raw text
      // Now, we need to distinguish these two cases.
      // It's easiest done traversing right until the next closing bracket.
      // If it's case #1, we'll likely encounter a new tag opening (or nothing).
      // If it's case #2, we'll likely encounter a tag closing or attribute
      // combo's equal+quote

      var thisIsRealEnding = false;

      if (str[_i + 1]) {
        // Traverse then
        for (var _y4 = _i + 1; _y4 < len; _y4++) { // if we reach the closing counterpart of the quotes, terminate

          if (attrib.attribOpeningQuoteAt && str[_y4] === str[attrib.attribOpeningQuoteAt]) {

            if (_y4 !== _i + 1 && str[~-_y4] !== "=") {
              thisIsRealEnding = true;
            }

            break;
          } else if (str[_y4] === ">") {
            // must be real tag closing, we just tackle missing quotes
            // TODO - missing closing quotes
            break;
          } else if (str[_y4] === "<") {
            thisIsRealEnding = true; // TODO - pop only if type === "simple" and it's the same opening
            // quotes of this attribute

            layers.pop();
            break;
          } else if (!str[_y4 + 1]) {
            // if end was reached and nothing caught, that's also positive sign
            thisIsRealEnding = true;
            break;
          }
        }
      } else {
        thisIsRealEnding = true;
      } //
      //
      //
      // FINALLY,
      //
      //
      //
      // if "thisIsRealEnding" was set to "true", terminate the tag here.


      if (thisIsRealEnding) {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end); // set and push the attribute's records, just closing quote will be
        // null and possibly value too

        if (attrib.attribValueStartsAt && _i && attrib.attribValueStartsAt < _i && str.slice(attrib.attribValueStartsAt, _i).trim()) {
          attrib.attribValueEndsAt = _i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);

          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
          } // otherwise, nulls stay

        } else {
          attrib.attribValueStartsAt = null;
        }

        if (attrib.attribEnds === null) {
          attrib.attribEnds = _i;
        }

        if (attrib) {
          // 2. push and wipe
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        }
      }
    } //
    //
    //
    //
    //                               BOTTOM
    //                               ██████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // ping charCb
    // -------------------------------------------------------------------------


    if (str[_i] && opts.charCb) {
      pingCharCb({
        type: token.type,
        chr: str[_i],
        i: _i
      });
    } //
    //
    //
    //
    //
    //
    //
    // catch end of the string
    // -------------------------------------------------------------------------
    // notice there's no "doNothing"


    if (!str[_i] && token.start !== null) {
      token.end = _i;
      token.value = str.slice(token.start, token.end); // if there is unfinished "attrib" object, submit it
      // as is, that's abruptly ended attribute

      if (attrib && attrib.attribName) { // push and wipe // patch the attr ending if it's missing

        if (!attrib.attribEnds) {
          attrib.attribEnds = _i;
        }

        token.attribs.push(_objectSpread__default['default']({}, attrib));
        attribReset();
      } // if there was an unfinished CSS property, finish it


      if (token && Array.isArray(token.properties) && token.properties.length && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = _i;

        if (token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].value) {
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
        }
      } // if there is unfinished css property that has been
      // recording, end it and push it as is. That's an
      // abruptly ended css chunk.


      if (property && property.propertyStarts) {
        // patch property.end
        if (!property.end) {
          property.end = _i;
        }

        pushProperty(property);
        propertyReset();
      }
      pingTagCb(token);
    } //
    //
    //
    //
    //
    //
    //
    // Record last non-whitespace character
    // -------------------------------------------------------------------------


    if (str[_i] && str[_i].trim()) {
      lastNonWhitespaceCharAt = _i;
    } //
    //
    //
    //
    //
    //
    //
    // logging:
    // -------------------------------------------------------------------------
    i = _i;
  };

  for (var i = 0; i <= len; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  } //
  // finally, clear stashes
  //


  if (charStash.length) {

    for (var _i2 = 0, len2 = charStash.length; _i2 < len2; _i2++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }

  if (tagStash.length) {

    for (var _i3 = 0, _len = tagStash.length; _i3 < _len; _i3++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  } // return stats


  var timeTakenInMilliseconds = Date.now() - start;
  return {
    timeTakenInMilliseconds: timeTakenInMilliseconds
  };
} // -----------------------------------------------------------------------------
// export some util functions for testing purposes because sources are in TS
// and unit test runners can't read TS


var util = {
  matchLayerLast: matchLayerLast
};

exports.defaults = defaults;
exports.tokenizer = tokenizer;
exports.util = util;
exports.version = version;
