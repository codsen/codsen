/**
 * emlint
 * Non-parsing, email template-oriented linter
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fixBrokenEntities = _interopDefault(require('string-fix-broken-named-entities'));
var stringLeftRight = require('string-left-right');
var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));
var merge = _interopDefault(require('ranges-merge'));

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

var knownBooleanHTMLAttributes = [
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "compact",
  "contenteditable",
  "controls",
  "default",
  "defer",
  "disabled",
  "formNoValidate",
  "frameborder",
  "hidden",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nohref",
  "nomodule",
  "noresize",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "readonly",
  "required",
  "reversed",
  "scoped",
  "scrolling",
  "seamless",
  "selected",
  "typemustmatch"
]
;

var knownHTMLTags = [
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "doctype",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "param",
  "picture",
  "pre",
  "progress",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "ul",
  "var",
  "video",
  "wbr",
  "xml"
]
;

var version = "1.0.0";

var errors = {
	"bad-character-acknowledge": {
	description: "https://www.fileformat.info/info/unicode/char/0006/index.htm",
	excerpt: "bad character - acknowledge",
	scope: "all"
},
	"bad-character-application-program-command": {
	description: "http://www.fileformat.info/info/unicode/char/009f/index.htm",
	excerpt: "bad character - application program command",
	scope: "all"
},
	"bad-character-backspace": {
	description: "https://www.fileformat.info/info/unicode/char/0008/index.htm",
	excerpt: "bad character - backspace",
	scope: "all"
},
	"bad-character-bell": {
	description: "https://www.fileformat.info/info/unicode/char/0007/index.htm",
	excerpt: "bad character - bell",
	scope: "all"
},
	"bad-character-break-permitted-here": {
	description: "http://www.fileformat.info/info/unicode/char/0082/index.htm",
	excerpt: "bad character - break permitted here",
	scope: "all"
},
	"bad-character-cancel": {
	description: "https://www.fileformat.info/info/unicode/char/0018/index.htm",
	excerpt: "bad character - cancel",
	scope: "all"
},
	"bad-character-cancel-character": {
	description: "http://www.fileformat.info/info/unicode/char/0094/index.htm",
	excerpt: "bad character - cancel character",
	scope: "all"
},
	"bad-character-character-tabulation": {
	description: "https://www.fileformat.info/info/unicode/char/0009/index.htm",
	excerpt: "bad character - character tabulation",
	scope: "all"
},
	"bad-character-character-tabulation-set": {
	description: "http://www.fileformat.info/info/unicode/char/0088/index.htm",
	excerpt: "bad character - character tabulation set",
	scope: "all"
},
	"bad-character-character-tabulation-with-justification": {
	description: "http://www.fileformat.info/info/unicode/char/0089/index.htm",
	excerpt: "bad character - character tabulation with justification",
	scope: "all"
},
	"bad-character-control-sequence-introducer": {
	description: "http://www.fileformat.info/info/unicode/char/009b/index.htm",
	excerpt: "bad character - control sequence introducer",
	scope: "all"
},
	"bad-character-data-link-escape": {
	description: "https://www.fileformat.info/info/unicode/char/0010/index.htm",
	excerpt: "bad character - data link escape",
	scope: "all"
},
	"bad-character-delete": {
	description: "http://www.fileformat.info/info/unicode/char/007f/index.htm",
	excerpt: "bad character - delete",
	scope: "all"
},
	"bad-character-device-control-four": {
	description: "https://www.fileformat.info/info/unicode/char/0014/index.htm",
	excerpt: "bad character - device control four",
	scope: "all"
},
	"bad-character-device-control-one": {
	description: "https://www.fileformat.info/info/unicode/char/0011/index.htm",
	excerpt: "bad character - device control one",
	scope: "all"
},
	"bad-character-device-control-string": {
	description: "http://www.fileformat.info/info/unicode/char/0090/index.htm",
	excerpt: "bad character - device control string",
	scope: "all"
},
	"bad-character-device-control-three": {
	description: "https://www.fileformat.info/info/unicode/char/0013/index.htm",
	excerpt: "bad character - device control three",
	scope: "all"
},
	"bad-character-device-control-two": {
	description: "https://www.fileformat.info/info/unicode/char/0012/index.htm",
	excerpt: "bad character - device control two",
	scope: "all"
},
	"bad-character-end-of-medium": {
	description: "https://www.fileformat.info/info/unicode/char/0019/index.htm",
	excerpt: "bad character - end of medium",
	scope: "all"
},
	"bad-character-end-of-protected-area": {
	description: "http://www.fileformat.info/info/unicode/char/0097/index.htm",
	excerpt: "bad character - end of protected area",
	scope: "all"
},
	"bad-character-end-of-selected-area": {
	description: "http://www.fileformat.info/info/unicode/char/0087/index.htm",
	excerpt: "bad character - end of selected area",
	scope: "all"
},
	"bad-character-end-of-text": {
	description: "https://www.fileformat.info/info/unicode/char/0003/index.htm",
	excerpt: "bad character - end of text (ETX)",
	scope: "all"
},
	"bad-character-end-of-transmission": {
	description: "https://www.fileformat.info/info/unicode/char/0004/index.htm",
	excerpt: "bad character - end of transmission",
	scope: "all"
},
	"bad-character-end-of-transmission-block": {
	description: "https://www.fileformat.info/info/unicode/char/0017/index.htm",
	excerpt: "bad character - end of transmission block",
	scope: "all"
},
	"bad-character-enquiry": {
	description: "https://www.fileformat.info/info/unicode/char/0005/index.htm",
	excerpt: "bad character - enquiry",
	scope: "all"
},
	"bad-character-escape": {
	description: "https://www.fileformat.info/info/unicode/char/001b/index.htm",
	excerpt: "bad character - escape",
	scope: "all"
},
	"bad-character-form-feed": {
	description: "https://www.fileformat.info/info/unicode/char/000c/index.htm",
	excerpt: "bad character - form feed",
	scope: "all"
},
	"bad-character-high-octet-preset": {
	description: "http://www.fileformat.info/info/unicode/char/0081/index.htm",
	excerpt: "bad character - high octet preset",
	scope: "all"
},
	"bad-character-index": {
	description: "http://www.fileformat.info/info/unicode/char/0084/index.htm",
	excerpt: "bad character - index",
	scope: "all"
},
	"bad-character-information-separator-four": {
	description: "https://www.fileformat.info/info/unicode/char/001c/index.htm",
	excerpt: "bad character - information separator four",
	scope: "all"
},
	"bad-character-information-separator-one": {
	description: "https://www.fileformat.info/info/unicode/char/001f/index.htm",
	excerpt: "bad character - information separator one",
	scope: "all"
},
	"bad-character-information-separator-three": {
	description: "https://www.fileformat.info/info/unicode/char/001d/index.htm",
	excerpt: "bad character - information separator three",
	scope: "all"
},
	"bad-character-information-separator-two": {
	description: "https://www.fileformat.info/info/unicode/char/001e/index.htm",
	excerpt: "bad character - information separator two",
	scope: "all"
},
	"bad-character-line-tabulation": {
	description: "https://www.fileformat.info/info/unicode/char/000b/index.htm",
	excerpt: "bad character - line tabulation",
	scope: "all"
},
	"bad-character-line-tabulation-set": {
	description: "http://www.fileformat.info/info/unicode/char/008a/index.htm",
	excerpt: "bad character - line tabulation set",
	scope: "all"
},
	"bad-character-message-waiting": {
	description: "http://www.fileformat.info/info/unicode/char/0095/index.htm",
	excerpt: "bad character - message waiting",
	scope: "all"
},
	"bad-character-negative-acknowledge": {
	description: "https://www.fileformat.info/info/unicode/char/0015/index.htm",
	excerpt: "bad character - negative acknowledge",
	scope: "all"
},
	"bad-character-next-line": {
	description: "http://www.fileformat.info/info/unicode/char/0085/index.htm",
	excerpt: "bad character - next line",
	scope: "all"
},
	"bad-character-no-break-here": {
	description: "http://www.fileformat.info/info/unicode/char/0083/index.htm",
	excerpt: "bad character - no break here",
	scope: "all"
},
	"bad-character-null": {
	description: "https://www.fileformat.info/info/unicode/char/0000/index.htm",
	excerpt: "bad character - null",
	scope: "all"
},
	"bad-character-operating-system-command": {
	description: "http://www.fileformat.info/info/unicode/char/009d/index.htm",
	excerpt: "bad character - operating system command",
	scope: "all"
},
	"bad-character-padding": {
	description: "http://www.fileformat.info/info/unicode/char/0080/index.htm",
	excerpt: "bad character - padding",
	scope: "all"
},
	"bad-character-partial-line-backward": {
	description: "http://www.fileformat.info/info/unicode/char/008c/index.htm",
	excerpt: "bad character - partial line backward",
	scope: "all"
},
	"bad-character-zero-width-space": {
	description: "https://www.fileformat.info/info/unicode/char/200b/index.htm",
	excerpt: "bad character - zero width space",
	scope: "all"
},
	"bad-character-unencoded-non-breaking-space": {
	description: "http://www.fileformat.info/info/unicode/char/00a0/index.htm",
	excerpt: "bad character - unencoded non-breaking space",
	scope: "all"
},
	"bad-character-partial-line-forward": {
	description: "http://www.fileformat.info/info/unicode/char/008b/index.htm",
	excerpt: "bad character - partial line forward",
	scope: "all"
},
	"bad-character-private-message": {
	description: "http://www.fileformat.info/info/unicode/char/009e/index.htm",
	excerpt: "bad character - private message",
	scope: "all"
},
	"bad-character-grave-accent": {
	description: "https://www.fileformat.info/info/unicode/char/0060/index.htm",
	excerpt: "bad character - grave accent",
	scope: "html"
},
	"bad-character-private-use-1": {
	description: "http://www.fileformat.info/info/unicode/char/0091/index.htm",
	excerpt: "bad character - private use 1",
	scope: "all"
},
	"bad-character-private-use-2": {
	description: "http://www.fileformat.info/info/unicode/char/0092/index.htm",
	excerpt: "bad character - private use 2",
	scope: "all"
},
	"bad-character-reverse-line-feed": {
	description: "http://www.fileformat.info/info/unicode/char/008d/index.htm",
	excerpt: "bad character - reverse line feed",
	scope: "all"
},
	"bad-character-set-transmit-state": {
	description: "http://www.fileformat.info/info/unicode/char/0093/index.htm",
	excerpt: "bad character - set transmit state",
	scope: "all"
},
	"bad-character-shift-in": {
	description: "https://www.fileformat.info/info/unicode/char/000f/index.htm",
	excerpt: "bad character - shift in",
	scope: "all"
},
	"bad-character-shift-out": {
	description: "https://www.fileformat.info/info/unicode/char/000e/index.htm",
	excerpt: "bad character - shift out",
	scope: "all"
},
	"bad-character-single-character-intro-introducer": {
	description: "http://www.fileformat.info/info/unicode/char/009a/index.htm",
	excerpt: "bad character - single character intro introducer",
	scope: "all"
},
	"bad-character-single-graphic-character-introducer": {
	description: "http://www.fileformat.info/info/unicode/char/0099/index.htm",
	excerpt: "bad character - single graphic character introducer",
	scope: "all"
},
	"bad-character-single-shift-three": {
	description: "http://www.fileformat.info/info/unicode/char/008f/index.htm",
	excerpt: "bad character - single shift three",
	scope: "all"
},
	"bad-character-single-shift-two": {
	description: "http://www.fileformat.info/info/unicode/char/008e/index.htm",
	excerpt: "bad character - single shift two",
	scope: "all"
},
	"bad-character-start-of-heading": {
	description: "https://www.fileformat.info/info/unicode/char/0001/index.htm",
	excerpt: "bad character - start of heading",
	scope: "all"
},
	"bad-character-start-of-protected-area": {
	description: "http://www.fileformat.info/info/unicode/char/0096/index.htm",
	excerpt: "bad character - start of protected area",
	scope: "all"
},
	"bad-character-start-of-selected-area": {
	description: "http://www.fileformat.info/info/unicode/char/0086/index.htm",
	excerpt: "bad character - start of selected area",
	scope: "all"
},
	"bad-character-start-of-string": {
	description: "http://www.fileformat.info/info/unicode/char/0098/index.htm",
	excerpt: "bad character - start of string",
	scope: "all"
},
	"bad-character-start-of-text": {
	description: "https://www.fileformat.info/info/unicode/char/0002/index.htm",
	excerpt: "bad character - start of text",
	scope: "all"
},
	"bad-character-string-terminator": {
	description: "http://www.fileformat.info/info/unicode/char/009c/index.htm",
	excerpt: "bad character - string terminator",
	scope: "all"
},
	"bad-character-substitute": {
	description: "https://www.fileformat.info/info/unicode/char/001a/index.htm",
	excerpt: "bad character - substitute",
	scope: "all"
},
	"bad-character-synchronous-idle": {
	description: "https://www.fileformat.info/info/unicode/char/0016/index.htm",
	excerpt: "bad character - synchronous idle",
	scope: "all"
},
	"bad-character-unencoded-ampersand": {
	description: "There is unencoded ampersand",
	excerpt: "unencoded ampersand",
	scope: "html"
},
	"bad-character-unencoded-closing-bracket": {
	description: "There is unencoded closing bracket",
	excerpt: "unencoded closing bracket",
	scope: "html"
},
	"bad-character-unencoded-double-quotes": {
	description: "There is unencoded double quotes",
	excerpt: "unencoded double quotes",
	scope: "html"
},
	"bad-character-unencoded-opening-bracket": {
	description: "There is unencoded opening bracket",
	excerpt: "unencoded opening bracket",
	scope: "html"
},
	"bad-named-html-entity-amp-repetitions": {
	description: "HTML named entity was encoded multiple times, causing repeated amp;",
	excerpt: "repeated amp; because of over-encoding",
	scope: "html"
},
	"bad-named-html-entity-malformed-nbsp": {
	description: "HTML named entity &nbsp; (a non-breaking space) is malformed",
	excerpt: "malformed &nbsp;",
	scope: "html"
},
	"bad-named-html-entity-missing-semicolon": {
	description: "HTML named entity is missing a semicolon",
	excerpt: "missing semicolon on a named HTML entity",
	scope: "html"
},
	"file-empty": {
	description: "the contents are empty",
	excerpt: "the contents are empty",
	scope: "all"
},
	"file-missing-ending": {
	description: "the ending part of the contents is missing",
	excerpt: "ending part is missing",
	scope: "all"
},
	"file-mixed-line-endings-file-is-CR-mainly": {
	description: "mixed line endings detected, majority EOL's are CR",
	excerpt: "mixed line endings detected, majority EOL's are CR",
	scope: "all"
},
	"file-mixed-line-endings-file-is-CRLF-mainly": {
	description: "mixed line endings detected, majority EOL's are CRLF",
	excerpt: "mixed line endings detected, majority EOL's are CRLF",
	scope: "all"
},
	"file-mixed-line-endings-file-is-LF-mainly": {
	description: "mixed line endings detected, majority EOL's are LF",
	excerpt: "mixed line endings detected, majority EOL's are LF",
	scope: "all"
},
	"file-wrong-type-line-ending-CR": {
	description: "Carriage Return (ASCII #13) line ending detected",
	excerpt: "Carriage Return line ending",
	scope: "all"
},
	"file-wrong-type-line-ending-CRLF": {
	description: "CRLF (Carriage Return + Line Feed) line ending detected",
	excerpt: "CRLF line ending",
	scope: "all"
},
	"file-wrong-type-line-ending-LF": {
	description: "Line Feed (ASCII #10) line ending detected",
	excerpt: "Line Feed line ending",
	scope: "all"
},
	"tag-attribute-closing-quotation-mark-missing": {
	description: "The closing quotation mark is missing",
	excerpt: "the closing quotation mark is missing",
	scope: "html"
},
	"tag-attribute-left-double-quotation-mark": {
	description: "There's a left double quotation mark, https://www.fileformat.info/info/unicode/char/201C/index.htm",
	excerpt: "a left double quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-left-single-quotation-mark": {
	description: "There's a left single quotation mark, https://www.fileformat.info/info/unicode/char/2018/index.htm",
	excerpt: "a left single quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-mismatching-quotes-is-double": {
	description: "attribute's opening quote is single, but closing-one is double",
	excerpt: "there should be a single quote here instead",
	scope: "html"
},
	"tag-attribute-mismatching-quotes-is-single": {
	description: "attribute's opening quote is double, but closing-one is single",
	excerpt: "there should be a double quote here instead",
	scope: "html"
},
	"tag-attribute-missing-equal": {
	description: "The equal is missing between attribute's name and quotes",
	excerpt: "missing equal character",
	scope: "html"
},
	"tag-attribute-opening-quotation-mark-missing": {
	description: "The opening quotation mark is missing",
	excerpt: "the opening quotation mark is missing",
	scope: "html"
},
	"tag-attribute-quote-and-onwards-missing": {
	description: "One of the attributes ends with an equal sign, there are no quotes on it",
	excerpt: "attributes ends with an equal sign, there are no quotes on it",
	scope: "html"
},
	"tag-attribute-repeated-equal": {
	description: "The equal after attribute's name is repeated",
	excerpt: "repeated equal character",
	scope: "html"
},
	"tag-attribute-right-double-quotation-mark": {
	description: "There's a right double quotation mark, https://www.fileformat.info/info/unicode/char/201d/index.htm",
	excerpt: "a right double quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-right-single-quotation-mark": {
	description: "There's a right single quotation mark, https://www.fileformat.info/info/unicode/char/2019/index.htm",
	excerpt: "a right single quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-space-between-equals-and-opening-quotes": {
	description: "There's a space between attribute's equal sign and opening quotes",
	excerpt: "space between attribute's equal sign and opening quotes",
	scope: "html"
},
	"tag-attribute-space-between-name-and-equals": {
	description: "There's a space between attribute's name and equal sign",
	excerpt: "space between attribute's name and equal sign",
	scope: "html"
},
	"tag-excessive-whitespace-inside-tag": {
	description: "There's an excessive whitespace inside the tag",
	excerpt: "space between attribute's name and equal sign",
	scope: "html"
},
	"tag-generic-error": {
	description: "Something is wrong here",
	excerpt: "something is wrong here",
	scope: "html"
},
	"tag-missing-closing-bracket": {
	description: "Tag's closing bracket is missing",
	excerpt: "missing closing bracket",
	scope: "html"
},
	"tag-missing-space-before-attribute": {
	description: "The space before attribute's name is missing",
	excerpt: "missing space",
	scope: "html"
},
	"tag-name-lowercase": {
	description: "Normally all tags are in lowercase",
	excerpt: "tag name contains uppercase characters",
	scope: "html"
},
	"tag-space-after-opening-bracket": {
	description: "Many browsers, including Chrome will not consider this a tag",
	excerpt: "space between opening bracket and tag name",
	scope: "html"
},
	"tag-stray-character": {
	description: "This chunk seems to be astray and can be deleted",
	excerpt: "delete this",
	scope: "html"
},
	"tag-stray-quotes": {
	description: "These quotes can be deleted",
	excerpt: "delete this",
	scope: "html"
},
	"tag-whitespace-closing-slash-and-bracket": {
	description: "There's a whitespace between closing slash and closing bracket",
	excerpt: "whitespace between slash and closing bracket",
	scope: "html"
}
};

var lowAsciiCharacterNames = ["null", "start-of-heading", "start-of-text", "end-of-text", "end-of-transmission", "enquiry", "acknowledge", "bell", "backspace", "character-tabulation", "line-feed", "line-tabulation", "form-feed", "carriage-return", "shift-out", "shift-in", "data-link-escape", "device-control-one", "device-control-two", "device-control-three", "device-control-four", "negative-acknowledge", "synchronous-idle", "end-of-transmission-block", "cancel", "end-of-medium", "substitute", "escape", "information-separator-four", "information-separator-three", "information-separator-two", "information-separator-one", "space", "exclamation-mark"];
var c1CharacterNames = ["delete", "padding", "high-octet-preset", "break-permitted-here", "no-break-here", "index", "next-line", "start-of-selected-area", "end-of-selected-area", "character-tabulation-set", "character-tabulation-with-justification", "line-tabulation-set", "partial-line-forward", "partial-line-backward", "reverse-line-feed", "single-shift-two", "single-shift-three", "device-control-string", "private-use-1", "private-use-2", "set-transmit-state", "cancel-character", "message-waiting", "start-of-protected-area", "end-of-protected-area", "start-of-string", "single-graphic-character-introducer", "single-character-intro-introducer", "control-sequence-introducer", "string-terminator", "operating-system-command", "private-message", "application-program-command"];
function charSuitableForAttrName(char) {
  var res = !"\"'><=".includes(char);
  return res;
}
function onlyTheseLeadToThat(str) {
  var charWePassValidatorFuncArr = arguments.length > 2 ? arguments[2] : undefined;
  var breakingCharValidatorFuncArr = arguments.length > 3 ? arguments[3] : undefined;
  var terminatorCharValidatorFuncArr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  if (typeof charWePassValidatorFuncArr === "function") {
    charWePassValidatorFuncArr = [charWePassValidatorFuncArr];
  }
  if (typeof breakingCharValidatorFuncArr === "function") {
    breakingCharValidatorFuncArr = [breakingCharValidatorFuncArr];
  }
  if (typeof terminatorCharValidatorFuncArr === "function") {
    terminatorCharValidatorFuncArr = [terminatorCharValidatorFuncArr];
  }
  var lastRes = false;
  var _loop = function _loop(i, len) {
    console.log("129 str[".concat(i, "] = ").concat(str[i]));
    if (breakingCharValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    })) {
      if (!terminatorCharValidatorFuncArr) {
        console.log("135 util/onlyTheseLeadToThat: ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "return ".concat(i), "\x1B[", 39, "m")));
        return {
          v: i
        };
      }
      lastRes = i;
    }
    if (terminatorCharValidatorFuncArr !== null && lastRes && terminatorCharValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    })) {
      console.log("150 util/onlyTheseLeadToThat: ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "return ".concat(lastRes), "\x1B[", 39, "m")));
      return {
        v: lastRes
      };
    }
    if (!charWePassValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    }) && !breakingCharValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    })) {
      console.log("161 util/onlyTheseLeadToThat: ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " return ", "\x1B[".concat(31, "m", "false", "\x1B[", 39, "m")));
      return {
        v: false
      };
    }
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret = _loop(i, len);
    if (_typeof(_ret) === "object") return _ret.v;
  }
}
function onlyAttrFriendlyCharsLeadingToEqual(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return onlyTheseLeadToThat(str, idx, charSuitableForAttrName,
  function (char) {
    return char === "=";
  }
  );
}
function charIsQuote(char) {
  var res = "\"'`\u2018\u2019\u201C\u201D".includes(char);
  return res;
}
function notTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error("emlint/util/charNotTag(): input is not a single string character!");
  }
  var res = !"><=".includes(char);
  return res;
}
function isLowerCaseLetter(char) {
  return isStr(char) && char.length === 1 && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}
function isUppercaseLetter(char) {
  return isStr(char) && char.length === 1 && char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91;
}
function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(char) {
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char);
}
function log() {
  for (var _len = arguments.length, pairs = new Array(_len), _key = 0; _key < _len; _key++) {
    pairs[_key] = arguments[_key];
  }
  return pairs.reduce(function (accum, curr, idx, arr) {
    if (idx === 0 && typeof curr === "string") {
      return "\x1B[".concat(32, "m", curr.toUpperCase(), "\x1B[", 39, "m");
    } else if (idx % 2 !== 0) {
      return "".concat(accum, " \x1B[", 33, "m").concat(curr, "\x1B[", 39, "m");
    }
    return "".concat(accum, " = ").concat(JSON.stringify(curr, null, 4)).concat(arr[idx + 1] ? ";" : "");
  }, "");
}
function withinTagInnerspace(str, idx, closingQuotePos) {
  console.log("\n\n\n\n\n");
  console.log("285 withinTagInnerspace() called, idx = ".concat(idx));
  if (typeof idx !== "number") {
    if (idx == null) {
      idx = 0;
    } else {
      throw new Error("emlint/util.js/withinTagInnerspace(): second argument is of a type ".concat(_typeof(idx)));
    }
  }
  var quotes = {
    at: null,
    last: false,
    precedes: false,
    within: false
  };
  var beginningOfAString = true;
  var r2_1 = false;
  var r2_2 = false;
  var r2_3 = false;
  var r2_4 = false;
  var r3_1 = false;
  var r3_2 = false;
  var r3_3 = false;
  var r3_4 = false;
  var r3_5 = false;
  var r4_1 = false;
  var r5_1 = false;
  var r5_2 = false;
  var r5_3 = false;
  var r6_1 = false;
  var r6_2 = false;
  var r6_3 = false;
  var r7_1 = false;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("".concat("\x1B[".concat(closingQuotePos != null ? 35 : 36, "m", "=", "\x1B[", 39, "m\x1B[").concat(closingQuotePos != null ? 33 : 34, "m", "=", "\x1B[", 39, "m").repeat(15), " \x1B[", 31, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " ").concat("\x1B[".concat(closingQuotePos != null ? 35 : 36, "m", "=", "\x1B[", 39, "m\x1B[").concat(closingQuotePos != null ? 33 : 34, "m", "=", "\x1B[", 39, "m").repeat(15)).concat(closingQuotePos != null ? " RECURSION" : ""));
    if (!str[i].trim().length) {
      if (quotes.last) {
        quotes.precedes = true;
      }
    }
    if (str[i] === ">") ;
    if (str[i] === "/") ;
    if (str[i] === ">") ;
    if (charIsQuote(str[i])) {
      if (quotes.at === null) {
        quotes.within = true;
        quotes.at = i;
      } else if (str[i] === str[quotes.at] || i === closingQuotePos) {
        quotes.within = false;
      }
      quotes.last = true;
    } else if (quotes.last) {
      quotes.precedes = true;
      quotes.last = false;
    } else {
      quotes.precedes = false;
    }
    if (quotes.at && !quotes.within && quotes.precedes && str[i] !== str[quotes.at]) {
      quotes.at = null;
    }
    if (!quotes.within && beginningOfAString && str[i] === "/" && ">".includes(str[stringLeftRight.right(str, i)])) {
      console.log("566 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
      console.log("\n\n\n\n\n\n");
      return true;
    }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      console.log("586 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_1", r3_1)));
      if (!str[i + 1] || !stringLeftRight.right(str, i) || !str.slice(i).includes("'") && !str.slice(i).includes('"')) {
        console.log("605 EOF detected ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3.2", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (str[stringLeftRight.right(str, i)] === "<") {
        console.log("615 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3.3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }
    else if (r3_1 && !r3_2 && str[i].trim().length && !notTagChar(str[i])) {
        if (str[i] === "<") {
          r3_2 = true;
          console.log("630 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_2", r3_2)));
        } else {
          r3_1 = false;
          console.log("639 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1)));
        }
      }
      else if (r3_2 && !r3_3 && str[i].trim().length) {
          if (charSuitableForTagName(str[i]) || str[i] === "/") {
            r3_3 = true;
            console.log("653 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_3", r3_3)));
          } else {
            r3_1 = false;
            r3_2 = false;
            console.log("663 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2)));
          }
        }
        else if (r3_3 && !r3_4 && str[i].trim().length && !charSuitableForTagName(str[i])) {
            if ("<>".includes(str[i]) || str[i] === "/" && "<>".includes(stringLeftRight.right(str, i))) {
              console.log("688 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
              console.log("\n\n\n\n\n\n");
              return true;
            } else if ("='\"".includes(str[i])) {
              r3_1 = false;
              r3_2 = false;
              r3_3 = false;
              console.log("701 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2, "r3_3", r3_3)));
            }
          }
          else if (r3_3 && !r3_4 && !str[i].trim().length) {
              r3_4 = true;
              console.log("718 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_4", r3_4)));
            }
            else if (r3_4 && !r3_5 && str[i].trim().length) {
                if (charSuitableForAttrName(str[i])) {
                  r3_5 = true;
                  console.log("732 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_5", r3_5)));
                } else {
                  r3_1 = false;
                  r3_2 = false;
                  r3_3 = false;
                  r3_4 = false;
                  console.log("744 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2, "r3_3", r3_3, "r3_4", r3_4)));
                }
              }
              else if (r3_5) {
                  if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
                    console.log("764 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                    console.log("\n\n\n\n\n\n");
                    return true;
                  }
                }
    if (!quotes.within && beginningOfAString && charSuitableForAttrName(str[i]) && !r2_1 && (str[stringLeftRight.left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))) {
      r2_1 = true;
      console.log("794 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_1", r2_1)));
    }
    else if (!r2_2 && r2_1 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r2_2 = true;
          console.log("813 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_2", r2_2)));
        } else if (str[i] === ">" || str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
          var closingBracketAt = i;
          if (str[i] === "/") {
            closingBracketAt = str[stringLeftRight.right(str, i)];
          }
          if (stringLeftRight.right(str, closingBracketAt)) {
            r3_1 = true;
            r2_1 = false;
            console.log("835 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_1", r2_1, "r3_1", r3_1)));
          } else {
            console.log("845 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2.1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
            console.log("\n\n\n\n\n\n");
            return true;
          }
        } else {
          r2_1 = false;
          console.log("856 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r2_1", r2_1)));
        }
      }
      else if (!r2_3 && r2_2 && str[i].trim().length) {
          if ("'\"".includes(str[i])) {
            r2_3 = true;
            console.log("870 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_3", r2_3)));
          } else {
            r2_1 = false;
            r2_2 = false;
            console.log("880 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r2_1", r2_1, "r2_2", r2_2)));
          }
        }
        else if (r2_3 && charIsQuote(str[i])) {
            if (str[i] === str[quotes.at]) {
              r2_4 = true;
              console.log("896 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
            } else {
              if (closingQuotePos != null && closingQuotePos === i) {
                console.log("906 recursion, this is the index the future indicated");
                if (isStr(str[quotes.at]) && "\"'".includes(str[quotes.at]) && "\"'".includes(str[i])) {
                  r2_4 = true;
                  console.log("928 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
                } else if (isStr(str[quotes.at]) && "\u2018\u2019".includes(str[quotes.at]) && "\u2018\u2019".includes(str[i])) {
                  r2_4 = true;
                  console.log("942 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
                } else if (isStr(str[quotes.at]) && "\u201C\u201D".includes(str[quotes.at]) && "\u201C\u201D".includes(str[i])) {
                  r2_4 = true;
                  console.log("956 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
                }
              } else if (closingQuotePos == null && withinTagInnerspace(str, null, i)) {
                console.log("                        ██");
                console.log("                        ██");
                console.log("                        ██");
                console.log("                        ██");
                console.log("  OUTSIDE OF RECURSION, WITHIN MAIN LOOP AGAIN");
                console.log("                        ██");
                console.log("                        ██");
                console.log("                        ██");
                console.log("                        ██");
                console.log("977 not a recursion, but result from one came positive");
                if (quotes.within) {
                  quotes.within = false;
                }
                r2_4 = true;
                console.log("987 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
              }
            }
          }
          else if (r2_4 && !quotes.within && str[i].trim().length && str[i] !== "/") {
              if (str[i] === ">") {
                console.log("1001 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                console.log("\n\n\n\n\n\n");
                return true;
              } else if (charSuitableForAttrName(str[i])) {
                console.log("1010 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2/2", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                console.log("\n\n\n\n\n\n");
                return true;
              }
            }
    if (!quotes.within && beginningOfAString && !r4_1 && charSuitableForAttrName(str[i]) && (str[stringLeftRight.left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))) {
      r4_1 = true;
      console.log("1033 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r4_1", r4_1)));
    }
    else if (r4_1 && str[i].trim().length && (!charSuitableForAttrName(str[i]) || str[i] === "/")) {
        if (str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
          console.log("1050 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R4", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
          console.log("\n\n\n\n\n\n");
          return true;
        }
        r4_1 = false;
        console.log("1060 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r4_1", r4_1)));
      }
    if (beginningOfAString && !quotes.within && !r5_1 && str[i].trim().length && charSuitableForAttrName(str[i])) {
      r5_1 = true;
      console.log("1082 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r5_1", r5_1)));
    }
    else if (r5_1 && !r5_2 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r5_2 = true;
          console.log("1100 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r5_2", r5_2)));
        } else {
          r5_1 = false;
          console.log("1109 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r5_1", r5_1)));
        }
      }
      else if (r5_2 && !r5_3 && str[i].trim().length) {
          if (str[i] === ">") {
            r5_3 = true;
            console.log("1123 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r5_3", r5_3)));
          } else {
            r5_1 = false;
            r5_2 = false;
            console.log("1133 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r5_1", r5_1, "r5_2", r5_2)));
          }
        }
        else if (r5_3 && str[i].trim().length && !notTagChar(str[i])) {
            if (str[i] === "<") {
              r3_2 = true;
              console.log("1150 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_2", r3_2)));
            } else {
              r5_1 = false;
              r5_2 = false;
              r5_3 = false;
              console.log("1161 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r5_1", r5_1, "r5_2", r5_2, "r5_3", r5_3)));
            }
          }
    if (!quotes.within && !r6_1 && (charSuitableForAttrName(str[i]) || !str[i].trim().length) && !charSuitableForAttrName(str[i - 1]) && str[i - 1] !== "=") {
      r6_1 = true;
      console.log("1200 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r6_1", r6_1)));
    }
    if (!quotes.within && r6_1 && !r6_2 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
      if (str[i] === "=") {
        r6_2 = true;
        console.log("1219 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r6_2", r6_2)));
      } else {
        r6_1 = false;
        console.log("1228 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r6_1", r6_1)));
      }
    }
    else if (!r6_3 && r6_2 && str[i].trim().length) {
        if (charIsQuote(str[i])) {
          r6_3 = true;
          console.log("1242 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r6_3", r6_3)));
        } else {
          r6_1 = false;
          r6_2 = false;
          console.log("1252 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r6_1", r6_1, "r6_2", r6_2)));
        }
      }
      else if (r6_3 && charIsQuote(str[i])) {
          if (str[i] === str[quotes.at]) {
            console.log("1268 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R6/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
            console.log("\n\n\n\n\n\n");
            return true;
          }
          else if (str[i + 1] && "/>".includes(str[stringLeftRight.right(str, i)])) {
              console.log("1281 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R6/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
              console.log("\n\n\n\n\n\n");
              return true;
            }
        }
    if (beginningOfAString && str[i].trim().length && charSuitableForAttrName(str[i]) && !r7_1
    ) {
        r7_1 = true;
        console.log("1305 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r7_1", r7_1)));
      }
    if (r7_1 && !str[i].trim().length && str[i + 1] && charSuitableForAttrName(str[i + 1])) {
      console.log("1328 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r7_1", r7_1)));
      r7_1 = false;
    }
    if (!quotes.within && str[i].trim().length && !charSuitableForAttrName(str[i]) && r7_1
    ) {
        if (str[i] === "=") {
          console.log("1356 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R7/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
          console.log("\n\n\n\n\n\n");
          return true;
        }
        r7_1 = false;
        console.log("1367 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r7_1", r7_1)));
      }
    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
    }
  }
  console.log("1496 withinTagInnerspace(): FIN. RETURN FALSE.");
  console.log("\n\n\n\n\n\n");
  return false;
}
function tagOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("1512 util/tagOnTheRight() called, ".concat("\x1B[".concat(33, "m", "idx", "\x1B[", 39, "m"), " = ", "\x1B[".concat(31, "m", idx, "\x1B[", 39, "m")));
  console.log("1514 tagOnTheRight() called, idx = ".concat(idx));
  var r1 = /^<\s*\w+\s*\/?\s*>/g;
  var r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  var r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  var r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  var whatToTest = idx ? str.slice(idx) : str;
  var passed = false;
  if (r1.test(whatToTest)) {
    console.log("1533 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R1", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log("1538 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R2", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log("1543 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R3", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log("1548 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R4", "\x1B[", 39, "m"), " passed"));
    passed = true;
  }
  var res = isStr(str) && idx < str.length && passed;
  console.log("1554 util/tagOnTheRight(): return ".concat("\x1B[".concat(36, "m", res, "\x1B[", 39, "m")));
  return res;
}
function attributeOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var closingQuoteAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
  console.log("closingQuoteAt = ".concat(JSON.stringify(closingQuoteAt, null, 4)));
  var startingQuoteVal = str[idx];
  if (startingQuoteVal !== "'" && startingQuoteVal !== '"') {
    throw new Error("1 emlint/util/attributeOnTheRight(): first character is not a single/double quote!\nstartingQuoteVal = ".concat(JSON.stringify(startingQuoteVal, null, 0), "\nstr = ").concat(JSON.stringify(str, null, 4), "\nidx = ").concat(JSON.stringify(idx, null, 0)));
  }
  var closingQuoteMatched = false;
  var lastClosingBracket = null;
  var lastOpeningBracket = null;
  var lastSomeQuote = null;
  var lastEqual = null;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("\x1B[".concat(closingQuoteAt === null ? 36 : 32, "m", "===============================", "\x1B[", 39, "m \x1B[").concat(closingQuoteAt === null ? 34 : 31, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[").concat(closingQuoteAt === null ? 36 : 32, "m", "===============================", "\x1B[", 39, "m"));
    if (i === closingQuoteAt && i > idx || closingQuoteAt === null && i > idx && str[i] === startingQuoteVal) {
      closingQuoteAt = i;
      console.log("1647 (util/attributeOnTheRight) ".concat(log("set", "closingQuoteAt", closingQuoteAt)));
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log("1656 (util/attributeOnTheRight) ".concat(log("set", "closingQuoteMatched", closingQuoteMatched)));
      }
    }
    if (str[i] === ">") {
      lastClosingBracket = i;
      console.log("1668 (util/attributeOnTheRight) ".concat(log("set", "lastClosingBracket", lastClosingBracket)));
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log("1678 (util/attributeOnTheRight) ".concat(log("set", "lastOpeningBracket", lastOpeningBracket)));
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log("1688 (util/attributeOnTheRight) ".concat(log("set", "lastEqual", lastEqual)));
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log("1694 (util/attributeOnTheRight) ".concat(log("set", "lastSomeQuote", lastSomeQuote)));
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log("1710 (util/attributeOnTheRight) within pattern check: equal-quote");
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          console.log("1718 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
          return closingQuoteAt;
        }
      } else {
        if (closingQuoteAt) {
          console.log("1733 (util/attributeOnTheRight) STOP", 'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".');
          return false;
        }
        console.log("1740 (util/attributeOnTheRight) ".concat(log(" ███████████████████████████████████████ correction!\n", "true")));
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          var correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log("1755 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote");
            console.log("1758 (util/attributeOnTheRight) ".concat(log("return", "lastSomeQuote", lastSomeQuote)));
            return lastSomeQuote;
          }
        }
        var correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          console.log("1774 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow");
          console.log("1777 (util/attributeOnTheRight) ".concat(log("return", "false")));
          return false;
        }
      }
    }
    if (closingQuoteMatched && lastClosingBracket && lastClosingBracket > closingQuoteMatched) {
      console.log("1791 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
      return closingQuoteAt;
    }
    if (closingQuoteMatched && lastClosingBracket === null && lastOpeningBracket === null && (lastSomeQuote === null || lastSomeQuote && closingQuoteAt >= lastSomeQuote) && lastEqual === null) {
      console.log("1815 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
      return closingQuoteAt;
    }
    if (!str[i + 1]) {
      console.log("1838 (util) \"EOL reached\"");
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    console.log("1856 (util) last chance, run correction 3");
    console.log("".concat("\x1B[".concat(33, "m", "lastSomeQuote", "\x1B[", 39, "m"), " = ", JSON.stringify(lastSomeQuote, null, 4)));
    var correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      console.log("1868 (util) CORRECTION #3 PASSED - mismatched quotes confirmed");
      console.log("1870 (util) ".concat(log("return", true)));
      return lastSomeQuote;
    }
  }
  console.log("1875 (util) ".concat(log("bottom - return", "false")));
  return false;
}
function findClosingQuote(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("1895 util/findClosingQuote() called, ".concat("\x1B[".concat(33, "m", "idx", "\x1B[", 39, "m"), " = ", "\x1B[".concat(31, "m", idx, "\x1B[", 39, "m")));
  var lastNonWhitespaceCharWasQuoteAt = null;
  var lastQuoteAt = null;
  var startingQuote = "\"'".includes(str[idx]) ? str[idx] : null;
  var lastClosingBracketAt = null;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 34, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        console.log("1926 (util/findClosingQuote) quick ending, ".concat(i, " is the matching quote"));
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log("1934 (util/findClosingQuote) ".concat(log("set", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
      if (i > idx && (str[i] === "'" || str[i] === '"') && withinTagInnerspace(str, i + 1)) {
        console.log("1948 (util/findClosingQuote) ".concat(log("return", i)));
        return i;
      }
      console.log("1951 (util/findClosingQuote) didn't pass");
      if (tagOnTheRight(str, i + 1)) {
        console.log("1955 \x1B[".concat(35, "m", "\u2588\u2588", "\x1B[", 39, "m (util/findClosingQuote) tag on the right - return i=", i));
        return i;
      }
      console.log("1960 \x1B[".concat(35, "m", "\u2588\u2588", "\x1B[", 39, "m (util/findClosingQuote) NOT tag on the right"));
    }
    else if (str[i].trim().length) {
        console.log("1966 (util/findClosingQuote)");
        if (str[i] === ">") {
          lastClosingBracketAt = i;
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            console.log("1973 (util/findClosingQuote) ".concat(log("!", "suitable candidate found")));
            var temp = withinTagInnerspace(str, i);
            console.log("1982 (util/findClosingQuote) withinTagInnerspace() result: ".concat(temp));
            if (temp) {
              if (lastNonWhitespaceCharWasQuoteAt === idx) {
                console.log("2005 (util/findClosingQuote) ".concat(log("return", "lastNonWhitespaceCharWasQuoteAt + 1", lastNonWhitespaceCharWasQuoteAt + 1)));
                return lastNonWhitespaceCharWasQuoteAt + 1;
              }
              console.log("2014 (util/findClosingQuote) ".concat(log("return", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
              return lastNonWhitespaceCharWasQuoteAt;
            }
          }
        } else if (str[i] === "=") {
          var whatFollowsEq = stringLeftRight.right(str, i);
          console.log("2035 (util/findClosingQuote) ".concat(log("set", "whatFollowsEq", whatFollowsEq)));
          if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
            console.log("2045 (util/findClosingQuote)");
            console.log("".concat("\x1B[".concat(33, "m", "lastNonWhitespaceCharWasQuoteAt", "\x1B[", 39, "m"), " = ", JSON.stringify(lastNonWhitespaceCharWasQuoteAt, null, 4)));
            if (lastQuoteAt && withinTagInnerspace(str, lastQuoteAt + 1)) {
              console.log("2057 (util/findClosingQuote) ".concat(log("return", "lastQuoteAt + 1", lastQuoteAt + 1)));
              return lastQuoteAt + 1;
            } else if (!lastQuoteAt) {
              console.log("2065 we don't have lastQuoteAt");
              var startingPoint = str[i - 1].trim().length ? i - 1 : stringLeftRight.left(str, i);
              var res = void 0;
              console.log("2082 ".concat("\x1B[".concat(33, "m", "startingPoint", "\x1B[", 39, "m"), " = ", JSON.stringify(startingPoint, null, 4)));
              for (var y = startingPoint; y--;) {
                console.log("2090 \x1B[".concat(36, "m", "str[".concat(y, "] = ").concat(str[y]), "\x1B[", 39, "m"));
                if (!str[y].trim().length) {
                  console.log("2093 \x1B[".concat(36, "m", "break", "\x1B[", 39, "m"));
                  res = stringLeftRight.left(str, y) + 1;
                  break;
                }
              }
              console.log("2099 ".concat("\x1B[".concat(33, "m", "RETURN", "\x1B[", 39, "m"), ": ", JSON.stringify(res, null, 4)));
              return res;
            }
            console.log("2108 recursive cycle didn't pass");
          } else if (str[i + 1].trim().length) {
            console.log("");
            console.log("2113 it's not the expected quote but ".concat(str[whatFollowsEq], " at index ").concat(whatFollowsEq));
            var _temp = void 0;
            for (var _y = i; _y--;) {
              console.log("2126 \x1B[".concat(36, "m", "str[".concat(_y, "] = ").concat(str[_y]), "\x1B[", 39, "m"));
              if (!str[_y].trim().length) {
                _temp = stringLeftRight.left(str, _y);
                console.log("2131 (util/findClosingQuote) ".concat(log("set", "temp", _temp), ", then BREAK"));
                break;
              }
            }
            if (charIsQuote(_temp)) {
              console.log("2142 (util/findClosingQuote) ".concat(log("return", "temp", _temp)));
              return _temp;
            }
            console.log("2147 (util/findClosingQuote) ".concat(log("return", "temp + 1", _temp + 1)));
            return _temp + 1;
          }
        } else if (str[i] !== "/") {
          if (str[i] === "<" && tagOnTheRight(str, i)) {
            console.log("2158 \u2588\u2588 tag on the right");
            if (lastClosingBracketAt !== null) {
              console.log("2161 (util/findClosingQuote) ".concat(log("return", "lastClosingBracketAt", lastClosingBracketAt)));
              return lastClosingBracketAt;
            }
          }
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            lastNonWhitespaceCharWasQuoteAt = null;
            console.log("2175 (util/findClosingQuote) ".concat(log("set", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
          }
        }
      }
    console.log("2187 (util/findClosingQuote) ".concat(log("END", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
  }
  return null;
}
function encodeChar(str, i) {
  if (str[i] === "&" && (!str[i + 1] || str[i + 1] !== "a") && (!str[i + 2] || str[i + 2] !== "m") && (!str[i + 3] || str[i + 3] !== "p") && (!str[i + 3] || str[i + 3] !== ";")) {
    return {
      name: "bad-character-unencoded-ampersand",
      position: [[i, i + 1, "&amp;"]]
    };
  } else if (str[i] === "<") {
    return {
      name: "bad-character-unencoded-opening-bracket",
      position: [[i, i + 1, "&lt;"]]
    };
  } else if (str[i] === ">") {
    return {
      name: "bad-character-unencoded-closing-bracket",
      position: [[i, i + 1, "&gt;"]]
    };
  } else if (str[i] === '"') {
    return {
      name: "bad-character-unencoded-double-quotes",
      position: [[i, i + 1, "&quot;"]]
    };
  } else if (str[i] === "`") {
    return {
      name: "bad-character-grave-accent",
      position: [[i, i + 1, "&#x60;"]]
    };
  }
  return null;
}

var isArr = Array.isArray;
var attributeOnTheRight$1 = attributeOnTheRight,
    withinTagInnerspace$1 = withinTagInnerspace,
    findClosingQuote$1 = findClosingQuote,
    tagOnTheRight$1 = tagOnTheRight,
    charIsQuote$1 = charIsQuote,
    encodeChar$1 = encodeChar,
    isStr$1 = isStr,
    log$1 = log;
function lint(str, originalOpts) {
  function pingTag(logTag) {
    console.log("030 pingTag(): ".concat(JSON.stringify(logTag, null, 4)));
  }
  if (!isStr$1(str)) {
    throw new Error("emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  var defaults = {
    rules: "recommended",
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };
  var opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        msg: "emlint: [THROW_ID_03*]",
        schema: {
          rules: ["string", "object", "false", "null", "undefined"],
          style: ["object", "null", "undefined"],
          "style.line_endings_CR_LF_CRLF": ["string", "null", "undefined"]
        }
      });
      if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
        if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
          if (opts.style.line_endings_CR_LF_CRLF !== "CR") {
            opts.style.line_endings_CR_LF_CRLF === "CR";
          }
        } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "lf") {
          if (opts.style.line_endings_CR_LF_CRLF !== "LF") {
            opts.style.line_endings_CR_LF_CRLF === "LF";
          }
        } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
          if (opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
            opts.style.line_endings_CR_LF_CRLF === "CRLF";
          }
        } else {
          throw new Error("emlint: [THROW_ID_04] opts.style.line_endings_CR_LF_CRLF should be either falsey or string \"CR\" or \"LF\" or \"CRLF\". It was given as:\n".concat(JSON.stringify(opts.style.line_endings_CR_LF_CRLF, null, 4), " (type is string)"));
        }
      }
    } else {
      throw new Error("emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
    }
  } else {
    opts = clone(defaults);
  }
  console.log("112 USING ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
  var rawEnforcedEOLChar;
  if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
    if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
      rawEnforcedEOLChar = "\r";
    } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
      rawEnforcedEOLChar = "\r\n";
    } else {
      rawEnforcedEOLChar = "\n";
    }
  }
  var doNothingUntil = null;
  var logTag;
  var defaultLogTag = {
    tagStartAt: null,
    tagEndAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    recognised: null,
    pureHTML: true,
    attributes: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag();
  var logAttr;
  var defaultLogAttr = {
    attrStartAt: null,
    attrEndAt: null,
    attrNameStartAt: null,
    attrNameEndAt: null,
    attrName: null,
    attrValue: null,
    attrValueStartAt: null,
    attrValueEndAt: null,
    attrEqualAt: null,
    attrOpeningQuote: {
      pos: null,
      val: null
    },
    attrClosingQuote: {
      pos: null,
      val: null
    },
    recognised: null,
    pureHTML: true
  };
  function resetLogAttr() {
    logAttr = clone(defaultLogAttr);
  }
  resetLogAttr();
  var logEspTag;
  var defaultEspTag = {
    headStartAt: null,
    headEndAt: null,
    tailStartAt: null,
    tailEndAt: null,
    startAt: null,
    endAt: null
  };
  function resetEspTag() {
    logEspTag = clone(defaultEspTag);
  }
  resetEspTag();
  var logWhitespace;
  var defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();
  var retObj = {
    issues: []
  };
  var tagIssueStaging = [];
  var rawIssueStaging = [];
  var logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };
  var espChars = "{}%-$_()";
  if (str.length === 0) {
    retObj.issues.push({
      name: "file-empty",
      position: [[0, 0]]
    });
    console.log("267 ".concat(log$1("push", "file-empty")));
  }
  var _loop = function _loop(_i, len) {
    var charcode = str[_i].charCodeAt(0);
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(_i, " ] = ").concat(str[_i].trim().length ? str[_i] : JSON.stringify(str[_i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m ", "\x1B[".concat(31, "m", doNothingUntil ? "\u2588\u2588 doNothingUntil ".concat(doNothingUntil) : "", "\x1B[", 39, "m")));
    if (doNothingUntil && _i >= doNothingUntil) {
      doNothingUntil = null;
      console.log("311 ".concat(log$1("RESET", "doNothingUntil", doNothingUntil)));
    }
    if (espChars.includes(str[_i]) && str[_i + 1] && espChars.includes(str[_i + 1]) && logEspTag.headStartAt === null && logEspTag.startAt === null) {
      logEspTag.headStartAt = _i;
      logEspTag.startAt = _i;
      console.log("346 ".concat(log$1("SET", "logEspTag.headStartAt", logEspTag.headStartAt, "logEspTag.startAt", logEspTag.startAt)));
    }
    if (!doNothingUntil && logTag.tagNameEndAt !== null) {
      console.log("368 ".concat("\x1B[".concat(90, "m", "above catching the ending of an attribute's name", "\x1B[", 39, "m")));
      if (logAttr.attrNameStartAt !== null && logAttr.attrNameEndAt === null && logAttr.attrName === null && !isLatinLetter(str[_i])) {
        logAttr.attrNameEndAt = _i;
        logAttr.attrName = str.slice(logAttr.attrNameStartAt, logAttr.attrNameEndAt);
        console.log("383 ".concat(log$1("SET", "logAttr.attrNameEndAt", logAttr.attrNameEndAt, "logAttr.attrName", logAttr.attrName)));
        if (str[_i] !== "=") {
          if (str[stringLeftRight.right(str, _i)] === "=") {
            console.log("398 equal to the right though");
          } else {
            console.log("401 not equal, so terminate attr");
          }
        }
      }
      console.log("407 ".concat("\x1B[".concat(90, "m", "above catching what follows the attribute's name", "\x1B[", 39, "m")));
      if (logAttr.attrNameEndAt !== null && logAttr.attrEqualAt === null && _i >= logAttr.attrNameEndAt && str[_i].trim().length) {
        var temp;
        if (str[_i] === "'" || str[_i] === '"') {
          temp = attributeOnTheRight$1(str, _i);
        }
        console.log("421 ".concat("\x1B[".concat(90, "m", "inside catch what follows the attribute's name", "\x1B[", 39, "m")));
        if (str[_i] === "=") {
          logAttr.attrEqualAt = _i;
          console.log("426 ".concat(log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)));
          if (str[_i + 1]) {
            var nextCharOnTheRightAt = stringLeftRight.right(str, _i);
            if (str[nextCharOnTheRightAt] === "=") {
              console.log("445 REPEATED EQUAL DETECTED");
              var nextEqualStartAt = _i + 1;
              var nextEqualEndAt = nextCharOnTheRightAt + 1;
              doNothingUntil = nextEqualEndAt;
              console.log("455 ".concat(log$1("set", "doNothingUntil", doNothingUntil)));
              console.log("459 SET ".concat("\x1B[".concat(36, "m", "nextEqualStartAt = \"".concat(nextEqualStartAt, "\"; nextEqualEndAt = \"").concat(nextEqualEndAt, ";\""), "\x1B[", 39, "m")));
              while (nextEqualStartAt && nextEqualEndAt) {
                console.log("       ".concat("\x1B[".concat(35, "m", "*", "\x1B[", 39, "m")));
                retObj.issues.push({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                console.log("468 ".concat(log$1("push", "tag-attribute-repeated-equal", "".concat("[[".concat(nextEqualStartAt, ", ").concat(nextEqualEndAt, "]]")))));
                var _temp = stringLeftRight.right(str, nextEqualEndAt - 1);
                console.log("476 ".concat(log$1("set", "temp", _temp)));
                if (str[_temp] === "=") {
                  console.log("479 ".concat("\x1B[".concat(36, "m", "yes, there's \"=\" on the right", "\x1B[", 39, "m")));
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = _temp + 1;
                  console.log("484 SET ".concat("\x1B[".concat(36, "m", "nextEqualStartAt = \"".concat(nextEqualStartAt, "\"; nextEqualEndAt = \"").concat(nextEqualEndAt, ";\""), "\x1B[", 39, "m")));
                  doNothingUntil = nextEqualEndAt;
                  console.log("491 ".concat(log$1("set", "doNothingUntil", doNothingUntil)));
                } else {
                  nextEqualStartAt = null;
                  console.log("496 ".concat(log$1("set", "nextEqualStartAt", nextEqualStartAt)));
                }
              }
              console.log("       ".concat("\x1B[".concat(35, "m", "*", "\x1B[", 39, "m")));
            }
          }
        } else if (temp) {
          console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ENDED ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
          console.log("508 quoted attribute's value on the right, equal is indeed missing");
          retObj.issues.push({
            name: "tag-attribute-missing-equal",
            position: [[_i, _i, "="]]
          });
          console.log("516 ".concat(log$1("push", "tag-attribute-missing-equal", "".concat("[[".concat(_i, ", ").concat(_i, ", \"=\"]]")))));
          logAttr.attrEqualAt = _i;
          console.log("525 ".concat(log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)));
          logAttr.attrValueStartAt = _i + 1;
          console.log("530 ".concat(log$1("SET", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
          logAttr.attrValueEndAt = temp;
          console.log("539 ".concat(log$1("SET", "logAttr.attrValueEndAt", logAttr.attrValueEndAt)));
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = str[_i];
          logAttr.attrClosingQuote.pos = temp;
          logAttr.attrClosingQuote.val = str[temp];
          console.log("551 ".concat(log$1("SET", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          logAttr.attrValue = str.slice(_i + 1, temp);
          console.log("562 ".concat(log$1("SET", "logAttr.attrValue", logAttr.attrValue)));
        } else {
          console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ENDED ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
          logTag.attributes.push(clone(logAttr));
          console.log("574 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[_i] === "=") {
            retObj.issues.push({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, _i]]
            });
            console.log("589 ".concat(log$1("push", "tag-attribute-space-between-name-and-equals", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
            resetLogWhitespace();
          } else if (isLatinLetter(str[_i])) {
            logTag.attributes.push(clone(logAttr));
            console.log("602 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < _i) {
                  retObj.issues.push({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, _i]]
                  });
                  console.log("617 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
                }
                console.log("624 dead end of excessive whitespace check");
              } else {
                retObj.issues.push({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, _i, " "]]
                });
                console.log("632 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, ", \" \"]]")))));
              }
            }
          }
        }
      }
      console.log("647 ".concat("\x1B[".concat(90, "m", "above catching the begining of an attribute's name", "\x1B[", 39, "m")));
      if (logAttr.attrStartAt === null && isLatinLetter(str[_i])) {
        console.log("652 ".concat("\x1B[".concat(90, "m", "inside catching the begining of an attribute's name", "\x1B[", 39, "m")));
        logAttr.attrStartAt = _i;
        logAttr.attrNameStartAt = _i;
        console.log("657 ".concat(log$1("SET", "logAttr.attrStartAt", logAttr.attrStartAt, "logAttr.attrNameStartAt", logAttr.attrNameStartAt)));
        if (logWhitespace.startAt !== null && logWhitespace.startAt < _i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, _i]]
            });
            console.log("679 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
          } else {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, _i, " "]]
            });
            console.log("692 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, ", \" \"]]")))));
          }
        }
        if (str[_i - 1]) {
          if (charIsQuote$1(str[_i - 1])) {
            for (var y = _i - 1; y--;) {
              if (!charIsQuote$1(str[y])) {
                if (!str[y].trim().length) {
                  retObj.issues.push({
                    name: "tag-stray-character",
                    position: [[y + 1, _i]]
                  });
                  console.log("713 ".concat(log$1("push", "tag-stray-character", "".concat(JSON.stringify([[y + 1, _i]], null, 0)))));
                }
                break;
              }
            }
          }
        }
      }
      console.log("728 ".concat("\x1B[".concat(90, "m", "above catching what follows attribute's equal", "\x1B[", 39, "m")));
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos === null) {
        console.log("736 ".concat("\x1B[".concat(90, "m", "inside catching what follows attribute's equal", "\x1B[", 39, "m")));
        if (logAttr.attrEqualAt < _i && str[_i].trim().length) {
          console.log("739 catching what follows equal");
          if (charcode === 34 || charcode === 39) {
            if (logWhitespace.startAt && logWhitespace.startAt < _i) {
              retObj.issues.push({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, _i]]
              });
              console.log("750 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat(JSON.stringify([[logWhitespace.startAt, _i]], null, 0)))));
            }
            resetLogWhitespace();
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = str[_i];
            var closingQuotePeek = findClosingQuote$1(str, _i);
            console.log("764 ".concat(log$1("set", "closingQuotePeek", closingQuotePeek)));
            if (closingQuotePeek) {
              if (str[closingQuotePeek] !== str[_i]) {
                if (str[closingQuotePeek] === "'" || str[closingQuotePeek] === '"') {
                  var isDouble = str[closingQuotePeek] === '"';
                  var name = "tag-attribute-mismatching-quotes-is-".concat(isDouble ? "double" : "single");
                  retObj.issues.push({
                    name: name,
                    position: [[closingQuotePeek, closingQuotePeek + 1, "".concat(isDouble ? "'" : '"')]]
                  });
                  console.log("795 ".concat(log$1("push", name, "".concat("[[".concat(closingQuotePeek, ", ").concat(closingQuotePeek + 1, ", ").concat(isDouble ? "'" : '"', "]]")))));
                } else {
                  var compensation = "";
                  var fromPositionToInsertAt = str[closingQuotePeek - 1].trim().length ? closingQuotePeek : stringLeftRight.left(str, closingQuotePeek) + 1;
                  console.log("828 ".concat(log$1("set", "fromPositionToInsertAt", fromPositionToInsertAt)));
                  var toPositionToInsertAt = closingQuotePeek;
                  console.log("836 ".concat(log$1("set", "toPositionToInsertAt", toPositionToInsertAt)));
                  if (str[stringLeftRight.left(str, closingQuotePeek)] === "/") {
                    console.log("844 SLASH ON THE LEFT");
                    toPositionToInsertAt = stringLeftRight.left(str, closingQuotePeek);
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      retObj.issues.push({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                      console.log("853 ".concat(log$1("push", "tag-whitespace-closing-slash-and-bracket", "".concat("[[".concat(toPositionToInsertAt + 1, ", ").concat(closingQuotePeek, "]]")))));
                    }
                    fromPositionToInsertAt = stringLeftRight.left(str, toPositionToInsertAt) + 1;
                    console.log("866 ".concat(log$1("set", "toPositionToInsertAt", toPositionToInsertAt, "fromPositionToInsertAt", fromPositionToInsertAt)));
                  }
                  retObj.issues.push({
                    name: "tag-attribute-closing-quotation-mark-missing",
                    position: [[fromPositionToInsertAt, toPositionToInsertAt, "".concat(str[_i]).concat(compensation)]]
                  });
                  console.log("887 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(closingQuotePeek, ", ").concat(closingQuotePeek, ", ", "".concat(str[_i]).concat(compensation), "]]")))));
                }
              }
              logAttr.attrClosingQuote.pos = closingQuotePeek;
              logAttr.attrClosingQuote.val = str[_i];
              logAttr.attrValue = str.slice(_i + 1, closingQuotePeek);
              logAttr.attrValueStartAt = _i + 1;
              logAttr.attrValueEndAt = closingQuotePeek;
              logAttr.attrEndAt = closingQuotePeek;
              console.log("905 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote, "logAttr.attrValue", logAttr.attrValue, "logAttr.attrValueStartAt", logAttr.attrValueStartAt, "logAttr.attrValueEndAt", logAttr.attrValueEndAt, "logAttr.attrEndAt", logAttr.attrEndAt)));
              for (var _y = _i + 1; _y < closingQuotePeek; _y++) {
                var newIssue = encodeChar$1(str, _y);
                if (newIssue) {
                  tagIssueStaging.push(newIssue);
                  console.log("931 ".concat(log$1("push tagIssueStaging", "newIssue", newIssue)));
                }
              }
              if (rawIssueStaging.length) {
                console.log("940 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " raw stage present!"));
              }
              if (logAttr.attrNameStartAt && str[logAttr.attrNameStartAt - 1].trim().length && !retObj.issues.some(function (issueObj) {
                i = _i;
                return (issueObj.name === "tag-stray-quotes" || issueObj.name === "tag-stray-character") && issueObj.position[0][1] === logAttr.attrNameStartAt;
              })) {
                retObj.issues.push({
                  name: "tag-missing-space-before-attribute",
                  position: [[logAttr.attrNameStartAt, logAttr.attrNameStartAt, " "]]
                });
                console.log("968 ".concat(log$1("push", "tag-missing-space-before-attribute", "".concat("[[".concat(logAttr.attrNameStartAt, ", ").concat(logAttr.attrNameStartAt, ", \" \"]]")))));
              }
              logTag.attributes.push(clone(logAttr));
              console.log("980 ".concat(log$1("PUSH, then RESET", "logAttr")));
              resetLogAttr();
              if (str[closingQuotePeek].trim().length) {
                _i = closingQuotePeek - (charIsQuote$1(str[closingQuotePeek]) ? 0 : 1);
                console.log("993 ".concat(log$1("set", "i", _i)));
              } else {
                _i = stringLeftRight.left(str, closingQuotePeek);
                console.log("997 ".concat(log$1("set", "i", _i)));
              }
              if (_i === len - 1 && logTag.tagStartAt !== null && (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null || logTag.attributes.some(function (attrObj) {
                return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
              }))) {
                retObj.issues.push({
                  name: "tag-missing-closing-bracket",
                  position: [[_i + 1, _i + 1, ">"]]
                });
                console.log("1018 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(_i + 1, ", ").concat(_i + 1, ", \">\"]]")))));
              }
              console.log("1026 ".concat(log$1("continue")));
              i = _i;
              return "continue";
            }
          } else if (charcode === 8220 || charcode === 8221) {
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = "\"";
            console.log("1037 ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote)));
            var _name = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
            retObj.issues.push({
              name: _name,
              position: [[_i, _i + 1, "\""]]
            });
            console.log("1054 ".concat(log$1("push", _name, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
            logAttr.attrValueStartAt = _i + 1;
            console.log("1059 ".concat(log$1("set", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
          } else if (charcode === 8216 || charcode === 8217) {
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = "'";
            console.log("1073 ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote)));
            var _name2 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
            retObj.issues.push({
              name: _name2,
              position: [[_i, _i + 1, "'"]]
            });
            console.log("1090 ".concat(log$1("push", _name2, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
            logAttr.attrValueStartAt = _i + 1;
            console.log("1095 ".concat(log$1("set", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
          } else if (!withinTagInnerspace$1(str, _i)) {
            console.log("1103 \x1B[".concat(33, "m", "\u2588\u2588", "\x1B[", 39, "m - withinTagInnerspace() ", "\x1B[".concat(32, "m", "false", "\x1B[", 39, "m")));
            var _closingQuotePeek = findClosingQuote$1(str, _i);
            console.log("1109 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
            console.log("1111 ".concat(log$1("set", "closingQuotePeek", _closingQuotePeek)));
            var quoteValToPut = charIsQuote$1(str[_closingQuotePeek]) ? str[_closingQuotePeek] : "\"";
            retObj.issues.push({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[stringLeftRight.left(str, _i) + 1, _i, quoteValToPut]]
            });
            console.log("1124 ".concat(log$1("push", "tag-attribute-opening-quotation-mark-missing", "".concat("[[".concat(stringLeftRight.left(str, _i) + 1, ", ").concat(_i, ", ").concat(quoteValToPut, "]]")))));
            logAttr.attrOpeningQuote = {
              pos: _i,
              val: quoteValToPut
            };
            logAttr.attrValueStartAt = _i;
            console.log("1138 mark opening quote: ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote, "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
            console.log("1150 traverse forward\n\n\n");
            var closingBracketIsAt = null;
            var innerTagEndsAt = null;
            for (var _y2 = _i; _y2 < len; _y2++) {
              console.log("1177 \x1B[".concat(36, "m", "str[".concat(_y2, "] = \"").concat(str[_y2], "\""), "\x1B[", 39, "m"));
              if (str[_y2] === ">" && (str[stringLeftRight.left(str, _y2)] !== "/" && withinTagInnerspace$1(str, _y2) || str[stringLeftRight.left(str, _y2)] === "/")) {
                var leftAt = stringLeftRight.left(str, _y2);
                closingBracketIsAt = _y2;
                console.log("1187 ".concat(log$1("set", "leftAt", leftAt, "closingBracketIsAt", closingBracketIsAt)));
                innerTagEndsAt = _y2;
                if (str[leftAt] === "/") {
                  innerTagEndsAt = leftAt;
                  console.log("1199 ".concat(log$1("set", "innerTagEndsAt", innerTagEndsAt)));
                }
              }
              var dealBrakerCharacters = "=<";
              if (innerTagEndsAt !== null && dealBrakerCharacters.includes(str[_y2])) {
                console.log("1211 \x1B[".concat(36, "m", "break (\"".concat(str[_y2], "\" is a bad character)"), "\x1B[", 39, "m"));
                break;
              }
            }
            console.log("1219 ".concat(log$1("set", "closingBracketIsAt", closingBracketIsAt, "innerTagEndsAt", innerTagEndsAt)));
            var innerTagContents;
            if (_i < innerTagEndsAt) {
              innerTagContents = str.slice(_i, innerTagEndsAt);
            } else {
              innerTagContents = "";
            }
            console.log("1235 ".concat(log$1("set", "innerTagContents", innerTagContents)));
            var startingPoint = innerTagEndsAt;
            var attributeOnTheRightBeginsAt;
            if (innerTagContents.includes("=")) {
              console.log("1250 inner tag contents include an equal character");
              var temp1 = innerTagContents.split("=")[0];
              console.log("1263 ".concat(log$1("set", "temp1", temp1)));
              if (temp1.split("").some(function (char) {
                return !char.trim().length;
              })) {
                console.log("1268 traverse backwards to find beginning of the attr on the right\n\n\n");
                for (var z = _i + temp1.length; z--;) {
                  console.log("1273 \x1B[".concat(35, "m", "str[".concat(z, "] = ").concat(str[z]), "\x1B[", 39, "m"));
                  if (!str[z].trim().length) {
                    attributeOnTheRightBeginsAt = z + 1;
                    console.log("1281 ".concat(log$1("set", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt, "then BREAK")));
                    break;
                  }
                  if (z === _i) {
                    break;
                  }
                }
                console.log("\n\n\n");
                console.log("1298 ".concat(log$1("log", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
                var temp2 = stringLeftRight.left(str, attributeOnTheRightBeginsAt);
                if (!charIsQuote$1(temp2)) {
                  startingPoint = temp2 + 1;
                }
              }
            } else {
              console.log("1314 inner tag contents don't include an equal character");
            }
            var caughtAttrEnd = null;
            var caughtAttrStart = null;
            var finalClosingQuotesShouldBeAt = null;
            var boolAttrFound = false;
            console.log("\n\n\n\n\n\n");
            console.log("1330 ".concat("\x1B[".concat(31, "m", "TRAVERSE BACKWARDS", "\x1B[", 39, "m"), "; startingPoint=", startingPoint));
            for (var _z = startingPoint; _z--; _z > _i) {
              console.log("1335 ".concat("\x1B[".concat(36, "m", "str[".concat(_z, "] = ").concat(str[_z]), "\x1B[", 39, "m")));
              if (str[_z] === "=") {
                console.log("1339 ".concat(log$1("break")));
                break;
              }
              if (caughtAttrEnd === null && str[_z].trim().length) {
                caughtAttrEnd = _z + 1;
                console.log("1347 ".concat(log$1("set", "caughtAttrEnd", caughtAttrEnd)));
                if (boolAttrFound) {
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  console.log("1354 ".concat(log$1("set", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt)));
                  boolAttrFound = false;
                  console.log("1363 ".concat(log$1("set", "boolAttrFound", boolAttrFound)));
                }
              }
              if (!str[_z].trim().length && caughtAttrEnd) {
                caughtAttrStart = _z + 1;
                console.log("1371 ".concat("\x1B[".concat(35, "m", "ATTR", "\x1B[", 39, "m"), ": ", str.slice(caughtAttrStart, caughtAttrEnd), " (").concat(caughtAttrStart, "-").concat(caughtAttrEnd, ")"));
                if (str[stringLeftRight.right(str, caughtAttrEnd)] === "=") {
                  var _temp2 = stringLeftRight.left(str, caughtAttrStart);
                  if (!charIsQuote$1(str[_temp2])) {
                    attributeOnTheRightBeginsAt = stringLeftRight.right(str, _temp2 + 1);
                    console.log("1445 ".concat(log$1("set", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
                  }
                  break;
                } else {
                  if (knownBooleanHTMLAttributes.includes(str.slice(caughtAttrStart, caughtAttrEnd))) {
                    boolAttrFound = true;
                    console.log("1464 ".concat(log$1("set", "boolAttrFound", boolAttrFound)));
                  } else {
                    console.log("1468 ".concat(log$1("break")));
                    break;
                  }
                }
                caughtAttrEnd = null;
                caughtAttrStart = null;
                console.log("1477 ".concat(log$1("reset", "caughtAttrEnd", caughtAttrEnd, "caughtAttrStart", caughtAttrStart)));
              }
            }
            console.log("1488 ".concat("\x1B[".concat(31, "m", "TRAVERSE ENDED", "\x1B[", 39, "m")));
            console.log("1497 ".concat(log$1("log", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt, "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
            if (!finalClosingQuotesShouldBeAt && attributeOnTheRightBeginsAt) {
              finalClosingQuotesShouldBeAt = stringLeftRight.left(str, attributeOnTheRightBeginsAt) + 1;
              console.log("1511 ".concat(log$1("log", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
              console.log("1518 ".concat(log$1("set", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt)));
            }
            console.log("1527 \u2588\u2588 ".concat(log$1("log", "caughtAttrEnd", caughtAttrEnd, "left(str, caughtAttrEnd)", stringLeftRight.left(str, caughtAttrEnd))));
            if (caughtAttrEnd && logAttr.attrOpeningQuote && !finalClosingQuotesShouldBeAt && str[stringLeftRight.left(str, caughtAttrEnd)] !== logAttr.attrOpeningQuote.val) {
              finalClosingQuotesShouldBeAt = caughtAttrEnd;
              console.log("1544 ".concat(log$1("set", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt)));
            }
            console.log("1553 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", " \x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "finalClosingQuotesShouldBeAt", "\x1B[", 39, "m"), " = ", JSON.stringify(finalClosingQuotesShouldBeAt, null, 4)));
            if (finalClosingQuotesShouldBeAt) {
              retObj.issues.push({
                name: "tag-attribute-closing-quotation-mark-missing",
                position: [[finalClosingQuotesShouldBeAt, finalClosingQuotesShouldBeAt, logAttr.attrOpeningQuote.val]]
              });
              console.log("1575 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(finalClosingQuotesShouldBeAt, ", ").concat(finalClosingQuotesShouldBeAt, ", ").concat(logAttr.attrOpeningQuote.val, "]]")))));
              logAttr.attrClosingQuote.pos = finalClosingQuotesShouldBeAt;
              logAttr.attrValueEndAt = finalClosingQuotesShouldBeAt;
              logAttr.attrEndAt = finalClosingQuotesShouldBeAt + 1;
            } else {
              logAttr.attrClosingQuote.pos = stringLeftRight.left(str, caughtAttrEnd);
              logAttr.attrValueEndAt = logAttr.attrClosingQuote.pos;
              logAttr.attrEndAt = caughtAttrEnd;
            }
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            logAttr.attrValue = str.slice(logAttr.attrOpeningQuote.pos, logAttr.attrClosingQuote.pos);
            console.log("1603 ".concat(log$1("set", "logAttr.attrClosingQuote.pos", logAttr.attrClosingQuote.pos, "logAttr.attrClosingQuote.val", logAttr.attrClosingQuote.val, "logAttr.attrValueEndAt", logAttr.attrValueEndAt, "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrValue", logAttr.attrValue)));
            if (logAttr.attrValueStartAt < logAttr.attrValueEndAt) {
              for (var _z2 = logAttr.attrValueStartAt; _z2 < logAttr.attrValueEndAt; _z2++) {
                console.log("1626 \x1B[".concat(36, "m", "str[".concat(_z2, "] = ").concat(str[_z2]), "\x1B[", 39, "m"));
                var _temp3 = encodeChar$1(str, _z2);
                if (_temp3) {
                  retObj.issues.push(_temp3);
                  console.log("1632 ".concat(log$1("push", "unencoded character", _temp3)));
                }
              }
            }
            if (!doNothingUntil) {
              doNothingUntil = logAttr.attrClosingQuote.pos;
              logWhitespace.startAt = null;
              console.log("1644 ".concat(log$1("set", "doNothingUntil", doNothingUntil, "logWhitespace.startAt", logWhitespace.startAt)));
            }
            console.log("1655 ".concat(log$1("about to push", "logAttr", logAttr)));
            logTag.attributes.push(clone(logAttr));
            console.log("1658 ".concat(log$1("PUSH, then RESET", "logAttr", "then CONTINUE")));
            resetLogAttr();
            i = _i;
            return "continue";
          } else {
            console.log("1668 \x1B[".concat(33, "m", "\u2588\u2588", "\x1B[", 39, "m - withinTagInnerspace() ", "\x1B[".concat(32, "m", "true", "\x1B[", 39, "m")));
            var start = logAttr.attrStartAt;
            var _temp4 = stringLeftRight.right(str, _i);
            console.log("1682 ".concat(log$1("set", "start", start, "temp", _temp4)));
            if (str[_i] === "/" && _temp4 && str[_temp4] === ">" || str[_i] === ">") {
              for (var _y3 = logAttr.attrStartAt; _y3--;) {
                if (str[_y3].trim().length) {
                  start = _y3 + 1;
                  break;
                }
              }
            }
            retObj.issues.push({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, _i]]
            });
            console.log("1701 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(start, ", ").concat(_i, "]]")))));
            console.log("1708 ".concat(log$1("reset", "logWhitespace")));
            resetLogWhitespace();
            console.log("1710 ".concat(log$1("reset", "logAttr")));
            resetLogAttr();
            console.log("1715 ".concat(log$1("offset the index", "i--; then continue")));
            _i--;
            i = _i;
            return "continue";
          }
          console.log("1722 ".concat(log$1("SET", "logAttr.attrOpeningQuote.pos", logAttr.attrOpeningQuote.pos, "logAttr.attrOpeningQuote.val", logAttr.attrOpeningQuote.val)));
          if (logWhitespace.startAt !== null) {
            if (str[_i] === "'" || str[_i] === '"') {
              retObj.issues.push({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, _i]]
              });
              console.log("1740 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
            } else if (withinTagInnerspace$1(str, _i + 1)) {
              retObj.issues.push({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, _i]]
              });
              console.log("1755 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(logAttr.attrStartAt, ", ").concat(_i, "]]")))));
              console.log("1761 ".concat(log$1("reset", "logAttr")));
              resetLogAttr();
            }
          }
        } else if (!str[_i + 1] || !stringLeftRight.right(str, _i)) {
          console.log("1766");
          retObj.issues.push({
            name: "file-missing-ending",
            position: [[_i + 1, _i + 1]]
          });
          console.log("1772 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(_i + 1, ", ").concat(_i + 1, "]]")))));
        }
      }
      console.log("1782 ".concat("\x1B[".concat(90, "m", "above catching closing quote (single or double)", "\x1B[", 39, "m")));
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null && (logAttr.attrClosingQuote.pos === null || _i === logAttr.attrClosingQuote.pos) && _i > logAttr.attrOpeningQuote.pos && charIsQuote$1(str[_i])) {
        console.log("1794 ".concat("\x1B[".concat(90, "m", "inside catching closing quote (single or double)", "\x1B[", 39, "m")));
        if (charcode === 34 || charcode === 39) {
          var issueName = "tag-attribute-mismatching-quotes-is-".concat(charcode === 34 ? "double" : "single");
          if (str[_i] !== logAttr.attrOpeningQuote.val && (!retObj.issues.length || !retObj.issues.some(function (issueObj) {
            i = _i;
            return issueObj.name === issueName && issueObj.position.length === 1 && issueObj.position[0][0] === _i && issueObj.position[0][1] === _i + 1;
          }))) {
            retObj.issues.push({
              name: issueName,
              position: [[_i, _i + 1, "".concat(charcode === 34 ? "'" : '"')]]
            });
            console.log("1822 ".concat(log$1("push", issueName, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(charcode === 34 ? "'" : '"', "]]")))));
          } else {
            console.log("1830 ".concat("\x1B[".concat(31, "m", "didn't push an issue", "\x1B[", 39, "m")));
          }
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = str[_i];
          console.log("1841 ".concat(log$1("SET", "logAttr.attrClosingQuote.pos", logAttr.attrClosingQuote.pos, "logAttr.attrClosingQuote.val", logAttr.attrClosingQuote.val)));
          if (logAttr.attrValue === null) {
            if (logAttr.attrOpeningQuote.pos && logAttr.attrClosingQuote.pos && logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos) {
              logAttr.attrValue = str.slice(logAttr.attrOpeningQuote.pos, logAttr.attrClosingQuote.pos);
            } else {
              logAttr.attrValue = "";
            }
            console.log("1869 ".concat(log$1("SET", "logAttr.attrValue", logAttr.attrValue)));
          }
          logAttr.attrEndAt = _i;
          logAttr.attrValueEndAt = _i;
          console.log("1877 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrValueEndAt", logAttr.attrValueEndAt)));
          logTag.attributes.push(clone(logAttr));
          console.log("1888 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8220 || charcode === 8221)
        ) {
            var _name3 = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
            retObj.issues.push({
              name: _name3,
              position: [[_i, _i + 1, '"']]
            });
            console.log("1910 ".concat(log$1("push", _name3, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
            logAttr.attrEndAt = _i;
            logAttr.attrClosingQuote.pos = _i;
            logAttr.attrClosingQuote.val = '"';
            console.log("1918 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
            logTag.attributes.push(clone(logAttr));
            console.log("1929 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
          } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8216 || charcode === 8217) && (stringLeftRight.right(str, _i) !== null && (str[stringLeftRight.right(str, _i)] === ">" || str[stringLeftRight.right(str, _i)] === "/") || withinTagInnerspace$1(str, _i + 1))) {
          var _name4 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: _name4,
            position: [[_i, _i + 1, "'"]]
          });
          console.log("1950 ".concat(log$1("push", _name4, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"'\"]]")))));
          logAttr.attrEndAt = _i;
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = "'";
          console.log("1958 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          logTag.attributes.push(clone(logAttr));
          console.log("1969 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        }
      }
      console.log("1977 ".concat("\x1B[".concat(90, "m", "error clauses", "\x1B[", 39, "m")));
      if (logAttr.attrOpeningQuote.val && logAttr.attrOpeningQuote.pos < _i && logAttr.attrClosingQuote.pos === null && (
      str[_i] === "/" && stringLeftRight.right(str, _i) && str[stringLeftRight.right(str, _i)] === ">" || str[_i] === ">")) {
        console.log("1988 inside error catch clauses");
        retObj.issues.push({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[_i, _i, logAttr.attrOpeningQuote.val]]
        });
        console.log("1995 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(_i, ", ").concat(_i, ", ").concat(logAttr.attrOpeningQuote.val, "]]")))));
        logAttr.attrClosingQuote.pos = _i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log("2005 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
        logTag.attributes.push(clone(logAttr));
        console.log("2013 ".concat(log$1("PUSH, then RESET", "logAttr")));
        resetLogAttr();
      }
    }
    if (!doNothingUntil) {
      if (charcode < 32) {
        var _name5 = "bad-character-".concat(lowAsciiCharacterNames[charcode]);
        if (charcode === 9) {
          retObj.issues.push({
            name: _name5,
            position: [[_i, _i + 1, "  "]]
          });
          console.log("2042 PUSH \"".concat(_name5, "\", [[").concat(_i, ", ").concat(_i + 1, ", \"  \"]]"));
        } else if (charcode === 13) {
          if (isStr$1(str[_i + 1]) && str[_i + 1].charCodeAt(0) === 10) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
              retObj.issues.push({
                name: "file-wrong-type-line-ending-CRLF",
                position: [[_i, _i + 2, rawEnforcedEOLChar]]
              });
              console.log("2061 ".concat(log$1("push", "file-wrong-type-line-ending-CRLF", "".concat("[[".concat(_i, ", ").concat(_i + 2, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
            } else {
              logLineEndings.crlf.push([_i, _i + 2]);
              console.log("2075 ".concat(log$1("logLineEndings.crlf push", "[".concat(_i, ", ").concat(_i + 2, "]"))));
            }
          } else {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CR") {
              retObj.issues.push({
                name: "file-wrong-type-line-ending-CR",
                position: [[_i, _i + 1, rawEnforcedEOLChar]]
              });
              console.log("2091 ".concat(log$1("push", "file-wrong-type-line-ending-CR", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
            } else {
              logLineEndings.cr.push([_i, _i + 1]);
              console.log("2105 ".concat(log$1("logLineEndings.cr push", "[".concat(_i, ", ").concat(_i + 1, "]"))));
            }
          }
        } else if (charcode === 10) {
          if (!(isStr$1(str[_i - 1]) && str[_i - 1].charCodeAt(0) === 13)) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "LF") {
              retObj.issues.push({
                name: "file-wrong-type-line-ending-LF",
                position: [[_i, _i + 1, rawEnforcedEOLChar]]
              });
              console.log("2125 ".concat(log$1("push", "file-wrong-type-line-ending-LF", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
            } else {
              logLineEndings.lf.push([_i, _i + 1]);
              console.log("2139 ".concat(log$1("logLineEndings.lf push", "[".concat(_i, ", ").concat(_i + 1, "]"))));
            }
          }
        } else {
          var nearestNonWhitespaceCharIdxOnTheLeft = stringLeftRight.left(str, _i);
          var nearestNonWhitespaceCharIdxOnTheRight = stringLeftRight.right(str, _i);
          var addThis;
          if (nearestNonWhitespaceCharIdxOnTheLeft < _i - 1 && (nearestNonWhitespaceCharIdxOnTheRight > _i + 1 || nearestNonWhitespaceCharIdxOnTheRight === null && str[_i + 1] && str[_i + 1] !== "\n" && str[_i + 1] !== "\r" && !str[_i + 1].trim().length)
          ) {
              var tempWhitespace = str.slice(nearestNonWhitespaceCharIdxOnTheLeft + 1, nearestNonWhitespaceCharIdxOnTheRight);
              if (tempWhitespace.includes("\n") || tempWhitespace.includes("\r")) {
                if (opts.style && opts.style.line_endings_CR_LF_CRLF) {
                  addThis = opts.style.line_endings_CR_LF_CRLF;
                } else {
                  addThis = "\n";
                }
              } else {
                addThis = " ";
              }
            }
          console.log("2178 ".concat(log$1("log", "addThis", addThis)));
          if (addThis) {
            retObj.issues.push({
              name: _name5,
              position: [[nearestNonWhitespaceCharIdxOnTheLeft + 1, nearestNonWhitespaceCharIdxOnTheRight, addThis]]
            });
            console.log("2192 ".concat(log$1("push", _name5, "".concat("[[".concat(nearestNonWhitespaceCharIdxOnTheLeft + 1, ", ").concat(nearestNonWhitespaceCharIdxOnTheRight, ", ").concat(addThis, "]]")))));
          } else {
            retObj.issues.push({
              name: _name5,
              position: [[_i, _i + 1]]
            });
            console.log("2204 ".concat(log$1("push", _name5, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
          }
        }
      } else if (charcode > 126 && charcode < 160) {
        var _name6 = "bad-character-".concat(c1CharacterNames[charcode - 127]);
        retObj.issues.push({
          name: _name6,
          position: [[_i, _i + 1]]
        });
        console.log("2215 ".concat(log$1("push", _name6, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
      } else if (charcode === 160) {
        var _name7 = "bad-character-unencoded-non-breaking-space";
        retObj.issues.push({
          name: _name7,
          position: [[_i, _i + 1, "&nbsp;"]]
        });
        console.log("2226 ".concat(log$1("push", _name7, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"&nbsp;\"]]")))));
      } else if (charcode === 8203) {
        var _name8 = "bad-character-zero-width-space";
        retObj.issues.push({
          name: _name8,
          position: [[_i, _i + 1]]
        });
        console.log("2237 ".concat(log$1("push", _name8, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
      } else if (encodeChar$1(str, _i)) {
        var _newIssue = encodeChar$1(str, _i);
        console.log("2241 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " new issue: ", JSON.stringify(_newIssue, null, 0)));
        rawIssueStaging.push(_newIssue);
        console.log("2249 push above issue to ".concat("\x1B[".concat(36, "m", "rawIssueStaging", "\x1B[", 39, "m")));
      }
    }
    if (!doNothingUntil && logWhitespace.startAt !== null && str[_i].trim().length) {
      console.log("2262 ".concat("\x1B[".concat(90, "m", "inside whitespace chunks ending clauses", "\x1B[", 39, "m")));
      if (logTag.tagNameStartAt !== null && logAttr.attrStartAt === null && (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= _i) && (str[_i] === ">" || str[_i] === "/" && "<>".includes(str[stringLeftRight.right(str, _i)]))) {
        console.log("2271");
        var _name9 = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          _name9 = "tag-whitespace-closing-slash-and-bracket";
        }
        retObj.issues.push({
          name: _name9,
          position: [[logWhitespace.startAt, _i]]
        });
        console.log("2284 ".concat(log$1("push", _name9, "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
      }
    }
    if (!doNothingUntil && !str[_i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = _i;
      console.log("2297 ".concat(log$1("set", "logWhitespace.startAt", logWhitespace.startAt)));
    }
    if (!doNothingUntil && str[_i] === "\n" || str[_i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log("2306 ".concat(log$1("set", "logWhitespace.includesLinebreaks", logWhitespace.includesLinebreaks)));
      }
      logWhitespace.lastLinebreakAt = _i;
      console.log("2315 ".concat(log$1("set", "logWhitespace.lastLinebreakAt", logWhitespace.lastLinebreakAt)));
    }
    console.log("2323");
    if (!doNothingUntil && logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && !isLatinLetter(str[_i]) && str[_i] !== "<" && str[_i] !== "/") {
      console.log("2335 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = _i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, _i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      console.log("2340 ".concat(log$1("set", "logTag.tagNameEndAt", logTag.tagNameEndAt, "logTag.tagName", logTag.tagName, "logTag.recognised", logTag.recognised)));
      if (charIsQuote$1(str[_i]) || str[_i] === "=") {
        console.log("2353 stray quote clauses");
        var addSpace;
        var strayCharsEndAt = _i + 1;
        if (str[_i + 1].trim().length) {
          if (charIsQuote$1(str[_i + 1]) || str[_i + 1] === "=") {
            console.log("\x1B[".concat(36, "m", "2362 traverse forward", "\x1B[", 39, "m"));
            for (var _y4 = _i + 1; _y4 < len; _y4++) {
              console.log("\x1B[".concat(36, "m", "2365 str[".concat(_y4, "] = str[y]"), "\x1B[", 39, "m"));
              if (!charIsQuote$1(str[_y4]) && str[_y4] !== "=") {
                if (str[_y4].trim().length) {
                  addSpace = true;
                  strayCharsEndAt = _y4;
                }
                break;
              }
            }
          } else {
            addSpace = true;
          }
        }
        if (addSpace) {
          retObj.issues.push({
            name: "tag-stray-character",
            position: [[_i, strayCharsEndAt, " "]]
          });
          console.log("2387 ".concat(log$1("push", "tag-stray-character", "".concat("[[".concat(_i, ", ").concat(strayCharsEndAt, ", \" \"]]")))));
        } else {
          retObj.issues.push({
            name: "tag-stray-character",
            position: [[_i, strayCharsEndAt]]
          });
          console.log("2399 ".concat(log$1("push", "tag-stray-character", "".concat("[[".concat(_i, ", ").concat(strayCharsEndAt, "]]")))));
        }
      }
    }
    console.log("2409");
    if (!doNothingUntil && logTag.tagStartAt !== null && logTag.tagNameStartAt === null && isLatinLetter(str[_i]) && logTag.tagStartAt < _i) {
      logTag.tagNameStartAt = _i;
      console.log("2420 ".concat(log$1("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)));
      if (logTag.tagStartAt < _i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, _i]]
        });
        console.log("2430 ".concat(log$1("stage", "tag-space-after-opening-bracket", "".concat("[[".concat(logTag.tagStartAt + 1, ", ").concat(_i, "]]")))));
      }
    }
    if (!doNothingUntil && logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && isUppercaseLetter(str[_i])) {
      retObj.issues.push({
        name: "tag-name-lowercase",
        position: [[_i, _i + 1, str[_i].toLowerCase()]]
      });
      console.log("2451 ".concat(log$1("push", "tag-name-lowercase", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(str[_i].toLowerCase(), null, 4), "]]")))));
    }
    if (!doNothingUntil && str[_i] === "<") {
      console.log("2466 catch the beginning of a tag ".concat("\x1B[".concat(31, "m", "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588", "\x1B[", 39, "m")));
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = _i;
        console.log("2472 ".concat(log$1("set", "logTag.tagStartAt", logTag.tagStartAt)));
      } else if (tagOnTheRight$1(str, _i)) {
        console.log("2478 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " new tag starts"));
        if (logTag.tagStartAt !== null && logTag.attributes.length && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
        })) {
          console.log("2494 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)");
          var lastNonWhitespaceOnLeft = stringLeftRight.left(str, _i);
          console.log("2508 ".concat(log$1("set", "lastNonWhitespaceOnLeft", lastNonWhitespaceOnLeft)));
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
            console.log("2521 ".concat(log$1("set", "logTag.tagEndAt", logTag.tagEndAt)));
          } else {
            retObj.issues.push({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, _i, ">"]]
            });
            console.log("2531 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(lastNonWhitespaceOnLeft + 1, ", ").concat(_i, ", \">\"]]")))));
          }
          if (rawIssueStaging.length) {
            console.log("2541 let's process all ".concat(rawIssueStaging.length, " raw character issues at staging"));
            rawIssueStaging.forEach(function (issueObj) {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                retObj.issues.push(issueObj);
                console.log("2548 ".concat(log$1("push", "issueObj", issueObj)));
              } else {
                console.log("2551 discarding ".concat(JSON.stringify(issueObj, null, 4)));
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          console.log("2565 ".concat(log$1("reset", "logTag & logAttr && rawIssueStaging")));
          logTag.tagStartAt = _i;
          console.log("2571 ".concat(log$1("set", "logTag.tagStartAt", logTag.tagStartAt)));
        } else {
          console.log("2574 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS");
          if (rawIssueStaging.length) {
            console.log("2579 ".concat(log$1("processing", "rawIssueStaging", rawIssueStaging)));
            console.log("2582 ".concat(log$1("log", "logTag.tagStartAt", logTag.tagStartAt)));
            console.log("2585 ".concat("\x1B[".concat(31, "m", JSON.stringify(logAttr, null, 4), "\x1B[", 39, "m")));
            rawIssueStaging.forEach(function (issueObj) {
              if (
              issueObj.position[0][0] < _i
              ) {
                  retObj.issues.push(issueObj);
                  console.log("2598 ".concat(log$1("push", "issueObj", issueObj)));
                } else {
                console.log("");
                console.log("2602 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
              }
            });
            console.log("2614 wipe rawIssueStaging");
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            console.log("2620 ".concat(log$1("wipe", "tagIssueStaging")));
            tagIssueStaging = [];
          }
        }
      }
    }
    if (!doNothingUntil && charcode === 62 && logTag.tagStartAt !== null && (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < _i)) {
      if (tagIssueStaging.length) {
        console.log("2637 concat ".concat("\x1B[".concat(33, "m", "tagIssueStaging", "\x1B[", 39, "m"), " then wipe"));
        retObj.issues = retObj.issues.concat(tagIssueStaging);
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        console.log("2645 ".concat(log$1("processing", "rawIssueStaging", rawIssueStaging)));
        console.log("".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " = ", JSON.stringify(logTag, null, 4)));
        rawIssueStaging.forEach(function (issueObj) {
          if (issueObj.position[0][0] < logTag.tagStartAt || logTag.attributes.some(function (attrObj) {
            i = _i;
            return attrObj.attrValueStartAt < issueObj.position[0][0] && attrObj.attrValueEndAt > issueObj.position[0][0];
          }) && !retObj.issues.some(function (existingIssue) {
            i = _i;
            return existingIssue.position[0][0] === issueObj.position[0][0] && existingIssue.position[0][1] === issueObj.position[0][1];
          })) {
            retObj.issues.push(issueObj);
            console.log("2671 ".concat(log$1("push", "issueObj", issueObj)));
          } else {
            console.log("");
            console.log("2675 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
          }
        });
        console.log("2687 wipe rawIssueStaging");
        rawIssueStaging = [];
      }
      resetLogTag();
      resetLogAttr();
      console.log("2694 ".concat(log$1("reset", "logTag & logAttr")));
    }
    if (!doNothingUntil && str[_i].trim().length) {
      resetLogWhitespace();
      console.log("2720 ".concat(log$1("reset", "logWhitespace")));
    }
    if (!doNothingUntil && !str[_i + 1]) {
      console.log("2725");
      if (rawIssueStaging.length) {
        console.log("2728");
        if (logTag.tagStartAt !== null && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null;
        })) {
          console.log("2739");
          rawIssueStaging.forEach(function (issueObj) {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              retObj.issues.push(issueObj);
              console.log("2744 ".concat(log$1("push", "issueObj", issueObj)));
            } else {
              console.log("\n1519 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
            }
          });
          console.log("2759 wipe rawIssueStaging");
          rawIssueStaging = [];
          retObj.issues.push({
            name: "tag-missing-closing-bracket",
            position: [[logWhitespace.startAt ? logWhitespace.startAt : _i + 1, _i + 1, ">"]]
          });
          console.log("2774 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(logWhitespace.startAt ? logWhitespace.startAt : _i + 1, ", ").concat(_i + 1, ", \">\"]]")))));
        } else if (!retObj.issues.some(function (issueObj) {
          return issueObj.name === "file-missing-ending";
        })) {
          retObj.issues = retObj.issues.concat(rawIssueStaging);
          console.log("2792 concat, then wipe ".concat("\x1B[".concat(33, "m", "rawIssueStaging", "\x1B[", 39, "m")));
          rawIssueStaging = [];
        }
      }
    }
    var output = {
      logTag: true,
      logAttr: false,
      logEspTag: true,
      logWhitespace: false,
      logLineEndings: false,
      retObj: true,
      tagIssueStaging: false,
      rawIssueStaging: false
    };
    console.log("".concat(Object.keys(output).some(function (key) {
      return output[key];
    }) ? "".concat("\x1B[".concat(31, "m", "\u2588 ", "\x1B[", 39, "m")) : "").concat(output.logTag && logTag.tagStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " ", JSON.stringify(logTag, null, 4), "; ") : "").concat(output.logAttr && logAttr.attrStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logAttr", "\x1B[", 39, "m"), " ", JSON.stringify(logAttr, null, 4), "; ") : "").concat(output.logEspTag && logEspTag.attrStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logEspTag", "\x1B[", 39, "m"), " ", JSON.stringify(logEspTag, null, 4), "; ") : "").concat(output.logWhitespace && logWhitespace.startAt !== null ? "".concat("\x1B[".concat(33, "m", "logWhitespace", "\x1B[", 39, "m"), " ", JSON.stringify(logWhitespace, null, 0), "; ") : "").concat(output.logLineEndings ? "".concat("\x1B[".concat(33, "m", "logLineEndings", "\x1B[", 39, "m"), " ", JSON.stringify(logLineEndings, null, 0), "; ") : "").concat(output.retObj ? "".concat("\x1B[".concat(33, "m", "retObj", "\x1B[", 39, "m"), " ", JSON.stringify(retObj, null, 4), "; ") : "").concat(output.tagIssueStaging && tagIssueStaging.length ? "\n".concat("\x1B[".concat(33, "m", "tagIssueStaging", "\x1B[", 39, "m"), " ", JSON.stringify(tagIssueStaging, null, 4), "; ") : "").concat(output.rawIssueStaging && rawIssueStaging.length ? "\n".concat("\x1B[".concat(33, "m", "rawIssueStaging", "\x1B[", 39, "m"), " ", JSON.stringify(rawIssueStaging, null, 4), "; ") : ""));
    i = _i;
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret = _loop(i, len);
    if (_ret === "continue") continue;
  }
  if ((!opts.style || !opts.style.line_endings_CR_LF_CRLF) && (logLineEndings.cr.length && logLineEndings.lf.length || logLineEndings.lf.length && logLineEndings.crlf.length || logLineEndings.cr.length && logLineEndings.crlf.length)) {
    if (logLineEndings.cr.length > logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
      console.log("2932 CR clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (logLineEndings.lf.length > logLineEndings.crlf.length && logLineEndings.lf.length > logLineEndings.cr.length) {
      console.log("2954 LF clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (logLineEndings.crlf.length > logLineEndings.lf.length && logLineEndings.crlf.length > logLineEndings.cr.length) {
      console.log("2976 CRLF clearly prevalent");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (logLineEndings.crlf.length === logLineEndings.lf.length && logLineEndings.lf.length === logLineEndings.cr.length) {
      console.log("2998 same amount of each type of EOL");
      logLineEndings.crlf.forEach(function (eolEntryArr) {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(function (eolEntryArr) {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (logLineEndings.cr.length === logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
      console.log("3017 CR & CRLF are prevalent over LF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (logLineEndings.lf.length === logLineEndings.crlf.length && logLineEndings.lf.length > logLineEndings.cr.length || logLineEndings.cr.length === logLineEndings.lf.length && logLineEndings.cr.length > logLineEndings.crlf.length) {
      console.log("3042 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    }
  }
  var htmlEntityFixes = fixBrokenEntities(str, {
    cb: function cb(oodles) {
      return {
        name: oodles.ruleName,
        position: [oodles.rangeValEncoded != null ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded] : [oodles.rangeFrom, oodles.rangeTo]]
      };
    }
  });
  console.log("3104 \x1B[".concat(33, "m", "\u2588", "\x1B[", 39, "m\x1B[", 31, "m", "\u2588", "\x1B[", 39, "m\x1B[", 34, "m", "\u2588", "\x1B[", 39, "m ", log$1("log", "htmlEntityFixes", htmlEntityFixes)));
  if (isArr(htmlEntityFixes) && htmlEntityFixes.length) {
    retObj.issues = retObj.issues.filter(function (issueObj) {
      return issueObj.name !== "bad-character-unencoded-ampersand" || htmlEntityFixes.every(function (entityFixObj) {
        return issueObj.position[0][0] !== entityFixObj.position[0][0];
      });
    }).concat(htmlEntityFixes ? htmlEntityFixes : []);
  }
  console.log("3138 BEFORE FIX");
  console.log("3139 ".concat(log$1("log", "retObj.issues", retObj.issues)));
  retObj.fix = isArr(retObj.issues) && retObj.issues.length ? merge(retObj.issues.reduce(function (acc, obj) {
    return acc.concat(obj.position);
  }, [])) : null;
  console.log("3149 ".concat(log$1("log", "retObj.fix", retObj.fix)));
  return retObj;
}

exports.lint = lint;
exports.version = version;
exports.errors = errors;
