/**
 * emlint
 * Non-parsing, email template-oriented linter
 * Version: 1.2.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringLeftRight = require('string-left-right');
var fixBrokenEntities = _interopDefault(require('string-fix-broken-named-entities'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
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
];

var errorsCharacters = {
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
	"bad-character-en-quad": {
	description: "https://www.fileformat.info/info/unicode/char/2000/index.htm",
	excerpt: "bad character - en quad",
	scope: "all"
},
	"bad-character-em-quad": {
	description: "https://www.fileformat.info/info/unicode/char/2001/index.htm",
	excerpt: "bad character - em quad",
	scope: "all"
},
	"bad-character-en-space": {
	description: "https://www.fileformat.info/info/unicode/char/2000/index.htm",
	excerpt: "bad character - en space",
	scope: "all"
},
	"bad-character-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2001/index.htm",
	excerpt: "bad character - em space",
	scope: "all"
},
	"bad-character-three-per-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2004/index.htm",
	excerpt: "bad character - three-per-em space",
	scope: "all"
},
	"bad-character-four-per-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2005/index.htm",
	excerpt: "bad character - four-per-em space",
	scope: "all"
},
	"bad-character-six-per-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2005/index.htm",
	excerpt: "bad character - six-per-em space",
	scope: "all"
},
	"bad-character-figure-space": {
	description: "https://www.fileformat.info/info/unicode/char/2007/index.htm",
	excerpt: "bad character - figure space",
	scope: "all"
},
	"bad-character-punctuation-space": {
	description: "https://www.fileformat.info/info/unicode/char/2008/index.htm",
	excerpt: "bad character - punctuation space",
	scope: "all"
},
	"bad-character-thin-space": {
	description: "https://www.fileformat.info/info/unicode/char/2009/index.htm",
	excerpt: "bad character - thin space",
	scope: "all"
},
	"bad-character-hair-space": {
	description: "https://www.fileformat.info/info/unicode/char/200a/index.htm",
	excerpt: "bad character - hair space",
	scope: "all"
},
	"bad-character-narrow-no-break-space": {
	description: "https://www.fileformat.info/info/unicode/char/202f/index.htm",
	excerpt: "bad character - narrow no-break space",
	scope: "all"
},
	"bad-character-line-separator": {
	description: "https://www.fileformat.info/info/unicode/char/2028/index.htm",
	excerpt: "bad character - line separator",
	scope: "all"
},
	"bad-character-paragraph-separator": {
	description: "https://www.fileformat.info/info/unicode/char/2029/index.htm",
	excerpt: "bad character - paragraph separator",
	scope: "all"
},
	"bad-character-medium-mathematical-space": {
	description: "https://www.fileformat.info/info/unicode/char/205f/index.htm",
	excerpt: "bad character - medium mathematical space",
	scope: "all"
},
	"bad-character-ideographic-space": {
	description: "https://www.fileformat.info/info/unicode/char/3000/index.htm",
	excerpt: "bad character - ideographic space",
	scope: "all"
},
	"bad-character-ogham-space-mark": {
	description: "https://www.fileformat.info/info/unicode/char/1680/index.htm",
	excerpt: "bad character - ogham space mark",
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
	"bad-character-generic": {
	description: "This character is invalid",
	excerpt: "bad character",
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
	"bad-character-grave-accent": {
	description: "https://www.fileformat.info/info/unicode/char/0060/index.htm",
	excerpt: "bad character - grave accent",
	scope: "html"
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
	"bad-character-unencoded-non-breaking-space": {
	description: "http://www.fileformat.info/info/unicode/char/00a0/index.htm",
	excerpt: "bad character - unencoded non-breaking space",
	scope: "all"
},
	"bad-character-unencoded-opening-bracket": {
	description: "There is unencoded opening bracket",
	excerpt: "unencoded opening bracket",
	scope: "html"
},
	"bad-character-zero-width-space": {
	description: "https://www.fileformat.info/info/unicode/char/200b/index.htm",
	excerpt: "bad character - zero width space",
	scope: "all"
}
};

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
];

var $ = {
	type: "closing",
	sibling: "$"
};
var knownESPTags = {
	"{%": {
	type: "opening",
	sibling: [
		"%}",
		"-%}"
	]
},
	"%}": {
	type: "closing",
	sibling: [
		"{%",
		"{%-"
	]
},
	"{%-": {
	type: "opening",
	sibling: [
		"-%}",
		"%}"
	]
},
	"-%}": {
	type: "closing",
	sibling: [
		"{%-",
		"{%"
	]
},
	"*|": {
	type: "opening",
	sibling: "|*"
},
	"|*": {
	type: "closing",
	sibling: "*|"
},
	$: $
};

var errorsRules = {
	"bad-named-html-entity-multiple-encoding": {
	description: "HTML named entity was encoded multiple times, causing repeated amp;",
	excerpt: "repeated amp; because of over-encoding",
	scope: "html"
},
	"bad-named-html-entity-malformed-nbsp": {
	description: "HTML named entity &nbsp; (a non-breaking space) is malformed",
	excerpt: "malformed &nbsp;",
	scope: "html"
},
	"bad-cdata-tag-malformed": {
	description: "CDATA opening tag is malformed",
	excerpt: "malformed CDATA tag",
	scope: "html"
},
	"bad-named-html-entity-missing-semicolon": {
	description: "HTML named entity is missing a semicolon",
	excerpt: "missing semicolon on a named HTML entity",
	scope: "html"
},
	"esp-more-closing-parentheses-than-opening": {
	description: "There are more closing parentheses than opening-ones",
	excerpt: "too many closing parentheses",
	scope: "all",
	unfixable: true
},
	"esp-more-opening-parentheses-than-closing": {
	description: "There are more opening parentheses than closing-ones",
	excerpt: "too many opening parentheses",
	scope: "all",
	unfixable: true
},
	"esp-line-break-within-templating-tag": {
	description: "There should be no line breaks within ESP template tags",
	excerpt: "line break should be removed",
	scope: "all",
	unfixable: true
},
	"html-comment-spaces": {
	description: "There should be no spaces between HTML comment characters",
	excerpt: "rogue spaces",
	scope: "html"
},
	"html-comment-redundant-dash": {
	description: "There are too many dashes in HTML comment",
	excerpt: "redundant dash",
	scope: "html"
},
	"html-comment-missing-dash": {
	description: "The dash in the comment is missing",
	excerpt: "missing dash",
	scope: "html"
},
	"html-comment-missing-exclamation-mark": {
	description: "The exclamation mark in the HTML comment is missing",
	excerpt: "missing exclamation mark",
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

var version = "1.2.7";

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
function isTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error("emlint/util/isTagChar(): input is not a single string character!");
  }
  return !"><=".includes(char);
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
function isNum(something) {
  return typeof something === "number";
}
function isLatinLetter(char) {
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char) || char === ":";
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
  console.log("293 withinTagInnerspace() called, idx = ".concat(idx));
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
      console.log("532 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
      console.log("\n\n\n\n\n\n");
      return true;
    }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      console.log("552 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_1", r3_1)));
      if (!str[i + 1] || !stringLeftRight.right(str, i) || !str.slice(i).includes("'") && !str.slice(i).includes('"')) {
        console.log("571 EOF detected ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3.2", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (str[stringLeftRight.right(str, i)] === "<") {
        console.log("581 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3.3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }
    else if (r3_1 && !r3_2 && str[i].trim().length && !isTagChar(str[i])) {
        if (str[i] === "<") {
          r3_2 = true;
          console.log("596 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_2", r3_2)));
        } else {
          r3_1 = false;
          console.log("605 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1)));
        }
      }
      else if (r3_2 && !r3_3 && str[i].trim().length) {
          if (charSuitableForTagName(str[i]) || str[i] === "/") {
            r3_3 = true;
            console.log("619 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_3", r3_3)));
          } else {
            r3_1 = false;
            r3_2 = false;
            console.log("629 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2)));
          }
        }
        else if (r3_3 && !r3_4 && str[i].trim().length && !charSuitableForTagName(str[i])) {
            if ("<>".includes(str[i]) || str[i] === "/" && "<>".includes(stringLeftRight.right(str, i))) {
              console.log("654 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
              console.log("\n\n\n\n\n\n");
              return true;
            } else if ("='\"".includes(str[i])) {
              r3_1 = false;
              r3_2 = false;
              r3_3 = false;
              console.log("667 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2, "r3_3", r3_3)));
            }
          }
          else if (r3_3 && !r3_4 && !str[i].trim().length) {
              r3_4 = true;
              console.log("684 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_4", r3_4)));
            }
            else if (r3_4 && !r3_5 && str[i].trim().length) {
                if (charSuitableForAttrName(str[i])) {
                  r3_5 = true;
                  console.log("698 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_5", r3_5)));
                } else {
                  r3_1 = false;
                  r3_2 = false;
                  r3_3 = false;
                  r3_4 = false;
                  console.log("710 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2, "r3_3", r3_3, "r3_4", r3_4)));
                }
              }
              else if (r3_5) {
                  if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
                    console.log("730 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                    console.log("\n\n\n\n\n\n");
                    return true;
                  }
                }
    if (!quotes.within && beginningOfAString && charSuitableForAttrName(str[i]) && !r2_1 && (str[stringLeftRight.left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))) {
      r2_1 = true;
      console.log("760 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_1", r2_1)));
    }
    else if (!r2_2 && r2_1 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r2_2 = true;
          console.log("779 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_2", r2_2)));
        } else if (str[i] === ">" || str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
          var closingBracketAt = i;
          if (str[i] === "/") {
            closingBracketAt = str[stringLeftRight.right(str, i)];
          }
          if (stringLeftRight.right(str, closingBracketAt)) {
            r3_1 = true;
            r2_1 = false;
            console.log("801 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_1", r2_1, "r3_1", r3_1)));
          } else {
            console.log("811 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2.1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
            console.log("\n\n\n\n\n\n");
            return true;
          }
        } else {
          r2_1 = false;
          console.log("822 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r2_1", r2_1)));
        }
      }
      else if (!r2_3 && r2_2 && str[i].trim().length) {
          if ("'\"".includes(str[i])) {
            r2_3 = true;
            console.log("836 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_3", r2_3)));
          } else {
            r2_1 = false;
            r2_2 = false;
            console.log("846 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r2_1", r2_1, "r2_2", r2_2)));
          }
        }
        else if (r2_3 && charIsQuote(str[i])) {
            if (str[i] === str[quotes.at]) {
              r2_4 = true;
              console.log("862 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
            } else {
              if (closingQuotePos != null && closingQuotePos === i) {
                console.log("872 recursion, this is the index the future indicated");
                if (isStr(str[quotes.at]) && "\"'".includes(str[quotes.at]) && "\"'".includes(str[i])) {
                  r2_4 = true;
                  console.log("894 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
                } else if (isStr(str[quotes.at]) && "\u2018\u2019".includes(str[quotes.at]) && "\u2018\u2019".includes(str[i])) {
                  r2_4 = true;
                  console.log("908 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
                } else if (isStr(str[quotes.at]) && "\u201C\u201D".includes(str[quotes.at]) && "\u201C\u201D".includes(str[i])) {
                  r2_4 = true;
                  console.log("922 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
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
                console.log("943 not a recursion, but result from one came positive");
                if (quotes.within) {
                  quotes.within = false;
                }
                r2_4 = true;
                console.log("953 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
              }
            }
          }
          else if (r2_4 && !quotes.within && str[i].trim().length && str[i] !== "/") {
              if (str[i] === ">") {
                console.log("967 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                console.log("\n\n\n\n\n\n");
                return true;
              } else if (charSuitableForAttrName(str[i])) {
                console.log("976 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2/2", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                console.log("\n\n\n\n\n\n");
                return true;
              }
            }
    if (!quotes.within && beginningOfAString && !r4_1 && charSuitableForAttrName(str[i]) && (str[stringLeftRight.left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))) {
      r4_1 = true;
      console.log("999 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r4_1", r4_1)));
    }
    else if (r4_1 && str[i].trim().length && (!charSuitableForAttrName(str[i]) || str[i] === "/")) {
        if (str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
          console.log("1016 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R4", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
          console.log("\n\n\n\n\n\n");
          return true;
        }
        r4_1 = false;
        console.log("1026 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r4_1", r4_1)));
      }
    if (beginningOfAString && !quotes.within && !r5_1 && str[i].trim().length && charSuitableForAttrName(str[i])) {
      r5_1 = true;
      console.log("1048 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r5_1", r5_1)));
    }
    else if (r5_1 && !r5_2 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r5_2 = true;
          console.log("1066 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r5_2", r5_2)));
        } else {
          r5_1 = false;
          console.log("1075 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r5_1", r5_1)));
        }
      }
      else if (r5_2 && !r5_3 && str[i].trim().length) {
          if (str[i] === ">") {
            r5_3 = true;
            console.log("1089 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r5_3", r5_3)));
          } else {
            r5_1 = false;
            r5_2 = false;
            console.log("1099 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r5_1", r5_1, "r5_2", r5_2)));
          }
        }
        else if (r5_3 && str[i].trim().length && !isTagChar(str[i])) {
            if (str[i] === "<") {
              r3_2 = true;
              console.log("1116 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_2", r3_2)));
            } else {
              r5_1 = false;
              r5_2 = false;
              r5_3 = false;
              console.log("1127 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r5_1", r5_1, "r5_2", r5_2, "r5_3", r5_3)));
            }
          }
    if (!quotes.within && !r6_1 && (charSuitableForAttrName(str[i]) || !str[i].trim().length) && !charSuitableForAttrName(str[i - 1]) && str[i - 1] !== "=") {
      r6_1 = true;
      console.log("1166 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r6_1", r6_1)));
    }
    if (!quotes.within && r6_1 && !r6_2 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
      if (str[i] === "=") {
        r6_2 = true;
        console.log("1185 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r6_2", r6_2)));
      } else {
        r6_1 = false;
        console.log("1194 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r6_1", r6_1)));
      }
    }
    else if (!r6_3 && r6_2 && str[i].trim().length) {
        if (charIsQuote(str[i])) {
          r6_3 = true;
          console.log("1208 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r6_3", r6_3)));
        } else {
          r6_1 = false;
          r6_2 = false;
          console.log("1218 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r6_1", r6_1, "r6_2", r6_2)));
        }
      }
      else if (r6_3 && charIsQuote(str[i])) {
          if (str[i] === str[quotes.at]) {
            console.log("1234 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R6/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
            console.log("\n\n\n\n\n\n");
            return true;
          }
          else if (str[i + 1] && "/>".includes(str[stringLeftRight.right(str, i)])) {
              console.log("1247 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R6/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
              console.log("\n\n\n\n\n\n");
              return true;
            }
        }
    if (beginningOfAString && str[i].trim().length && charSuitableForAttrName(str[i]) && !r7_1
    ) {
        r7_1 = true;
        console.log("1271 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r7_1", r7_1)));
      }
    if (r7_1 && !str[i].trim().length && str[i + 1] && charSuitableForAttrName(str[i + 1])) {
      console.log("1294 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r7_1", r7_1)));
      r7_1 = false;
    }
    if (!quotes.within && str[i].trim().length && !charSuitableForAttrName(str[i]) && r7_1
    ) {
        if (str[i] === "=") {
          console.log("1322 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R7/1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
          console.log("\n\n\n\n\n\n");
          return true;
        }
        r7_1 = false;
        console.log("1333 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r7_1", r7_1)));
      }
    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
    }
  }
  console.log("1462 withinTagInnerspace(): FIN. RETURN FALSE.");
  console.log("\n\n\n\n\n\n");
  return false;
}
function tagOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("1478 util/tagOnTheRight() called, ".concat("\x1B[".concat(33, "m", "idx", "\x1B[", 39, "m"), " = ", "\x1B[".concat(31, "m", idx, "\x1B[", 39, "m")));
  console.log("1480 tagOnTheRight() called, idx = ".concat(idx));
  var r1 = /^<\s*\w+\s*\/?\s*>/g;
  var r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  var r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  var r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  var whatToTest = idx ? str.slice(idx) : str;
  var passed = false;
  if (r1.test(whatToTest)) {
    console.log("1499 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R1", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log("1504 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R2", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log("1509 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R3", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log("1514 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R4", "\x1B[", 39, "m"), " passed"));
    passed = true;
  }
  var res = isStr(str) && idx < str.length && passed;
  console.log("1520 util/tagOnTheRight(): return ".concat("\x1B[".concat(36, "m", res, "\x1B[", 39, "m")));
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
      console.log("1613 (util/attributeOnTheRight) ".concat(log("set", "closingQuoteAt", closingQuoteAt)));
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log("1622 (util/attributeOnTheRight) ".concat(log("set", "closingQuoteMatched", closingQuoteMatched)));
      }
    }
    if (str[i] === ">") {
      lastClosingBracket = i;
      console.log("1634 (util/attributeOnTheRight) ".concat(log("set", "lastClosingBracket", lastClosingBracket)));
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log("1644 (util/attributeOnTheRight) ".concat(log("set", "lastOpeningBracket", lastOpeningBracket)));
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log("1654 (util/attributeOnTheRight) ".concat(log("set", "lastEqual", lastEqual)));
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log("1660 (util/attributeOnTheRight) ".concat(log("set", "lastSomeQuote", lastSomeQuote)));
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log("1676 (util/attributeOnTheRight) within pattern check: equal-quote");
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          console.log("1684 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
          return closingQuoteAt;
        }
      } else {
        if (closingQuoteAt) {
          console.log("1699 (util/attributeOnTheRight) STOP", 'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".');
          return false;
        }
        console.log("1706 (util/attributeOnTheRight) ".concat(log(" ███████████████████████████████████████ correction!\n", "true")));
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          var correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log("1721 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote");
            console.log("1724 (util/attributeOnTheRight) ".concat(log("return", "lastSomeQuote", lastSomeQuote)));
            return lastSomeQuote;
          }
        }
        var correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          console.log("1740 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow");
          console.log("1743 (util/attributeOnTheRight) ".concat(log("return", "false")));
          return false;
        }
      }
    }
    if (closingQuoteMatched && lastClosingBracket && lastClosingBracket > closingQuoteMatched) {
      console.log("1757 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
      return closingQuoteAt;
    }
    if (closingQuoteMatched && lastClosingBracket === null && lastOpeningBracket === null && (lastSomeQuote === null || lastSomeQuote && closingQuoteAt >= lastSomeQuote) && lastEqual === null) {
      console.log("1781 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
      return closingQuoteAt;
    }
    if (!str[i + 1]) {
      console.log("1804 (util) \"EOL reached\"");
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    console.log("1822 (util) last chance, run correction 3");
    console.log("".concat("\x1B[".concat(33, "m", "lastSomeQuote", "\x1B[", 39, "m"), " = ", JSON.stringify(lastSomeQuote, null, 4)));
    var correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      console.log("1834 (util) CORRECTION #3 PASSED - mismatched quotes confirmed");
      console.log("1836 (util) ".concat(log("return", true)));
      return lastSomeQuote;
    }
  }
  console.log("1841 (util) ".concat(log("bottom - return", "false")));
  return false;
}
function findClosingQuote(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("1861 util/findClosingQuote() called, ".concat("\x1B[".concat(33, "m", "idx", "\x1B[", 39, "m"), " = ", "\x1B[".concat(31, "m", idx, "\x1B[", 39, "m")));
  var lastNonWhitespaceCharWasQuoteAt = null;
  var lastQuoteAt = null;
  var startingQuote = "\"'".includes(str[idx]) ? str[idx] : null;
  var lastClosingBracketAt = null;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 34, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        console.log("1892 (util/findClosingQuote) quick ending, ".concat(i, " is the matching quote"));
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log("1900 (util/findClosingQuote) ".concat(log("set", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
      if (i > idx && (str[i] === "'" || str[i] === '"') && withinTagInnerspace(str, i + 1)) {
        console.log("1914 (util/findClosingQuote) ".concat(log("return", i)));
        return i;
      }
      console.log("1917 (util/findClosingQuote) didn't pass");
      if (tagOnTheRight(str, i + 1)) {
        console.log("1921 \x1B[".concat(35, "m", "\u2588\u2588", "\x1B[", 39, "m (util/findClosingQuote) tag on the right - return i=", i));
        return i;
      }
      console.log("1926 \x1B[".concat(35, "m", "\u2588\u2588", "\x1B[", 39, "m (util/findClosingQuote) NOT tag on the right"));
    }
    else if (str[i].trim().length) {
        console.log("1932 (util/findClosingQuote)");
        if (str[i] === ">") {
          lastClosingBracketAt = i;
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            console.log("1939 (util/findClosingQuote) ".concat(log("!", "suitable candidate found")));
            var temp = withinTagInnerspace(str, i);
            console.log("1948 (util/findClosingQuote) withinTagInnerspace() result: ".concat(temp));
            if (temp) {
              if (lastNonWhitespaceCharWasQuoteAt === idx) {
                console.log("1971 (util/findClosingQuote) ".concat(log("return", "lastNonWhitespaceCharWasQuoteAt + 1", lastNonWhitespaceCharWasQuoteAt + 1)));
                return lastNonWhitespaceCharWasQuoteAt + 1;
              }
              console.log("1980 (util/findClosingQuote) ".concat(log("return", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
              return lastNonWhitespaceCharWasQuoteAt;
            }
          }
        } else if (str[i] === "=") {
          var whatFollowsEq = stringLeftRight.right(str, i);
          console.log("2001 (util/findClosingQuote) ".concat(log("set", "whatFollowsEq", whatFollowsEq)));
          if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
            console.log("2011 (util/findClosingQuote)");
            console.log("".concat("\x1B[".concat(33, "m", "lastNonWhitespaceCharWasQuoteAt", "\x1B[", 39, "m"), " = ", JSON.stringify(lastNonWhitespaceCharWasQuoteAt, null, 4)));
            if (lastQuoteAt && withinTagInnerspace(str, lastQuoteAt + 1)) {
              console.log("2023 (util/findClosingQuote) ".concat(log("return", "lastQuoteAt + 1", lastQuoteAt + 1)));
              return lastQuoteAt + 1;
            } else if (!lastQuoteAt) {
              console.log("2031 we don't have lastQuoteAt");
              var startingPoint = str[i - 1].trim().length ? i - 1 : stringLeftRight.left(str, i);
              var res = void 0;
              console.log("2048 ".concat("\x1B[".concat(33, "m", "startingPoint", "\x1B[", 39, "m"), " = ", JSON.stringify(startingPoint, null, 4)));
              for (var y = startingPoint; y--;) {
                console.log("2056 \x1B[".concat(36, "m", "str[".concat(y, "] = ").concat(str[y]), "\x1B[", 39, "m"));
                if (!str[y].trim().length) {
                  console.log("2059 \x1B[".concat(36, "m", "break", "\x1B[", 39, "m"));
                  res = stringLeftRight.left(str, y) + 1;
                  break;
                }
              }
              console.log("2065 ".concat("\x1B[".concat(33, "m", "RETURN", "\x1B[", 39, "m"), ": ", JSON.stringify(res, null, 4)));
              return res;
            }
            console.log("2074 recursive cycle didn't pass");
          } else if (str[i + 1].trim().length) {
            console.log("");
            console.log("2079 it's not the expected quote but ".concat(str[whatFollowsEq], " at index ").concat(whatFollowsEq));
            var _temp = void 0;
            for (var _y = i; _y--;) {
              console.log("2092 \x1B[".concat(36, "m", "str[".concat(_y, "] = ").concat(str[_y]), "\x1B[", 39, "m"));
              if (!str[_y].trim().length) {
                _temp = stringLeftRight.left(str, _y);
                console.log("2097 (util/findClosingQuote) ".concat(log("set", "temp", _temp), ", then BREAK"));
                break;
              }
            }
            if (charIsQuote(_temp)) {
              console.log("2108 (util/findClosingQuote) ".concat(log("return", "temp", _temp)));
              return _temp;
            }
            console.log("2113 (util/findClosingQuote) ".concat(log("return", "temp + 1", _temp + 1)));
            return _temp + 1;
          }
        } else if (str[i] !== "/") {
          if (str[i] === "<" && tagOnTheRight(str, i)) {
            console.log("2124 \u2588\u2588 tag on the right");
            if (lastClosingBracketAt !== null) {
              console.log("2127 (util/findClosingQuote) ".concat(log("return", "lastClosingBracketAt", lastClosingBracketAt)));
              return lastClosingBracketAt;
            }
          }
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            lastNonWhitespaceCharWasQuoteAt = null;
            console.log("2141 (util/findClosingQuote) ".concat(log("set", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
          }
        }
      }
    console.log("2153 (util/findClosingQuote) ".concat(log("END", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
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
  } else if (str[i] === "\xA3") {
    return {
      name: "bad-character-unencoded-pound",
      position: [[i, i + 1, "&pound;"]]
    };
  } else if (str[i] === "\u20AC") {
    return {
      name: "bad-character-unencoded-euro",
      position: [[i, i + 1, "&euro;"]]
    };
  } else if (str[i] === "\xA2") {
    return {
      name: "bad-character-unencoded-cent",
      position: [[i, i + 1, "&cent;"]]
    };
  }
  return null;
}
function flip(str) {
  if (isStr(str) && str.length) {
    return str.replace(/\{/g, "}").replace(/\(/g, ")");
  }
}

var isArr = Array.isArray;
var attributeOnTheRight$1 = attributeOnTheRight,
    withinTagInnerspace$1 = withinTagInnerspace,
    isLowerCaseLetter$1 = isLowerCaseLetter,
    findClosingQuote$1 = findClosingQuote,
    tagOnTheRight$1 = tagOnTheRight,
    charIsQuote$1 = charIsQuote,
    encodeChar$1 = encodeChar,
    isStr$1 = isStr,
    isNum$1 = isNum,
    flip$1 = flip,
    log$1 = log;
function lint(str, originalOpts) {
  function pingTag(logTag) {
    console.log("046 pingTag(): ".concat(JSON.stringify(logTag, null, 4)));
  }
  function pingEspTag(espTagObj) {
    if (isNum$1(espTagObj.startAt) && isNum$1(espTagObj.endAt)) {
      var openingParens = str.slice(espTagObj.startAt, espTagObj.endAt).match(/\(/g);
      var closingParens = str.slice(espTagObj.startAt, espTagObj.endAt).match(/\)/g);
      if (isArr(openingParens) && isArr(closingParens) && openingParens.length !== closingParens.length || isArr(openingParens) && !isArr(closingParens) || !isArr(openingParens) && isArr(closingParens)) {
        if (isArr(openingParens) && isArr(closingParens) && openingParens.length > closingParens.length || isArr(openingParens) && openingParens.length && !isArr(closingParens)) {
          submit({
            name: "esp-more-opening-parentheses-than-closing",
            position: [[espTagObj.startAt, espTagObj.endAt]]
          });
          console.log("078 ".concat(log$1("push", "esp-more-opening-parentheses-than-closing", "".concat("[[".concat(espTagObj.startAt, ", ").concat(espTagObj.endAt, "]]")))));
        } else if (isArr(openingParens) && isArr(closingParens) && openingParens.length < closingParens.length || isArr(closingParens) && closingParens.length && !isArr(openingParens)) {
          submit({
            name: "esp-more-closing-parentheses-than-opening",
            position: [[espTagObj.startAt, espTagObj.endAt]]
          });
          console.log("097 ".concat(log$1("push", "esp-more-closing-parentheses-than-opening", "".concat("[[".concat(espTagObj.startAt, ", ").concat(espTagObj.endAt, "]]")))));
        }
      }
    }
  }
  if (!isStr$1(str)) {
    throw new Error("emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  var defaults = {
    rules: {},
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };
  var opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        enforceStrictKeyset: true,
        msg: "emlint: [THROW_ID_03*]",
        ignorePaths: "rules.*",
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
  console.log("188 USING ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
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
  var doNothingUntilReason = null;
  var logTag;
  var defaultLogTag = {
    tagStartAt: null,
    tagEndAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    recognised: null,
    closing: null,
    pureHTML: true,
    attributes: [],
    esp: []
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
    headVal: null,
    tailStartAt: null,
    tailEndAt: null,
    tailVal: null,
    startAt: null,
    endAt: null,
    recognised: null,
    type: null
  };
  function resetEspTag() {
    logEspTag = clone(defaultEspTag);
  }
  resetEspTag();
  var espChars = "{}%-$_()*|";
  var espCharsFunc = "$";
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
  var tagIssueStaging = [];
  var rawIssueStaging = [];
  var retObj = {
    issues: [],
    applicableRules: {}
  };
  Object.keys(errorsRules).concat(Object.keys(errorsCharacters)).sort().forEach(function (ruleName) {
    retObj.applicableRules[ruleName] = false;
  });
  function submit(issueObj, whereTo) {
    if (whereTo !== "raw" && whereTo !== "tag") {
      retObj.applicableRules[issueObj.name] = true;
      console.log("364 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "retObj.applicableRules.".concat(issueObj.name), "\x1B[", 39, "m"), " = ", retObj.applicableRules[issueObj.name]));
    } else {
      console.log("369 didn't put \"".concat(issueObj.name, "\" in applicableRules"));
    }
    if (!opts.rules.hasOwnProperty(issueObj.name) || opts.rules[issueObj.name]) {
      console.log("377 opts.rules[".concat(issueObj.name, "] = ").concat(opts.rules[issueObj.name]));
      if (whereTo === "raw") {
        console.log("380 PUSH to rawIssueStaging");
        rawIssueStaging.push(issueObj);
      } else if (whereTo === "tag") {
        console.log("384 PUSH to tagIssueStaging");
        tagIssueStaging.push(issueObj);
      } else {
        console.log("388 PUSH to retObj.issues");
        retObj.issues.push(issueObj);
      }
    }
  }
  function submitOpeningBracket(from, to) {
    submit({
      name: "bad-character-unencoded-opening-bracket",
      position: [[from, to, "&lt;"]]
    }, "raw");
    console.log("404 ".concat(log$1("push raw", "bad-character-unencoded-opening-bracket", "".concat("[[".concat(from, ", ").concat(to, ", \"&lt;\"]]")))));
  }
  function submitClosingBracket(from, to) {
    submit({
      name: "bad-character-unencoded-closing-bracket",
      position: [[from, to, "&gt;"]]
    }, "raw");
    console.log("420 ".concat(log$1("push raw", "bad-character-unencoded-closing-bracket", "".concat("[[".concat(from, ", ").concat(to, ", \"&gt;\"]]")))));
  }
  var logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };
  var withinQuotes = null;
  var withinQuotesEndAt = null;
  if (str.length === 0) {
    submit({
      name: "file-empty",
      position: [[0, 0]]
    });
    console.log("459 ".concat(log$1("push", "file-empty")));
  }
  var _loop = function _loop(_i, len) {
    if (logEspTag.headVal !== null && _i === logEspTag.headEndAt && doNothingUntil === null) {
      doNothingUntil = true;
      doNothingUntilReason = "esp";
      console.log("503 ".concat(log$1("set", "doNothingUntil", doNothingUntil, "doNothingUntilReason", doNothingUntilReason)));
    }
    var charcode = str[_i].charCodeAt(0);
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(_i, " ] = ").concat(str[_i].trim().length ? str[_i] : JSON.stringify(str[_i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m ", "\x1B[".concat(31, "m", doNothingUntil && doNothingUntil !== _i ? "\u2588\u2588 doNothingUntil ".concat(doNothingUntil, " (reason: ").concat(doNothingUntilReason, ")") : "", "\x1B[", 39, "m")));
    if (doNothingUntil && doNothingUntil !== true && _i >= doNothingUntil) {
      doNothingUntil = null;
      console.log("528 ".concat(log$1("RESET", "doNothingUntil", doNothingUntil)));
      doNothingUntilReason = null;
    }
    console.log("535 ".concat("\x1B[".concat(90, "m", "above CDATA clauses", "\x1B[", 39, "m")));
    if (str[_i + 4] && str[_i].toLowerCase() === "c" && stringLeftRight.rightSeq(str, _i, {
      i: true
    }, "d*", "a*", "t*", "a*", "[?*", "]?", "[?*") && "<![".includes(str[stringLeftRight.left(str, _i)])) {
      console.log("553 \x1B[".concat(90, "m", "within CDATA clauses", "\x1B[", 39, "m"));
      var rightSideOfCdataOpening = stringLeftRight.right(str, stringLeftRight.rightSeq(str, _i, {
        i: true
      }, "d*", "a*", "t*", "a*", "[?*", "]?", "[?*").rightmostChar) - 1;
      console.log("574 ".concat("\x1B[".concat(33, "m", "rightSideOfCdataOpening", "\x1B[", 39, "m"), " = ", JSON.stringify(rightSideOfCdataOpening, null, 4)));
      var leftChomp = stringLeftRight.chompLeft(str, _i, "<?*", "!?*", "[?*", "]?*");
      console.log("583 ".concat("\x1B[".concat(33, "m", "leftChomp", "\x1B[", 39, "m"), " = ", JSON.stringify(leftChomp, null, 4)));
      if (str.slice(leftChomp, rightSideOfCdataOpening + 1) !== "<![CDATA[") {
        submit({
          name: "bad-cdata-tag-malformed",
          position: [[leftChomp, rightSideOfCdataOpening + 1, "<![CDATA["]]
        });
        console.log("597 ".concat(log$1("push", "bad-cdata-tag-malformed", "".concat("[[".concat(leftChomp, ", ").concat(rightSideOfCdataOpening + 1, ", \"<![CDATA[\"]]")))));
      }
      doNothingUntil = true;
      doNothingUntilReason = "cdata";
      console.log("609 ".concat(log$1("set", "doNothingUntil", doNothingUntil, "doNothingUntilReason", doNothingUntilReason)));
      if (rawIssueStaging.length) {
        console.log("621 let's process all ".concat(rawIssueStaging.length, " raw character issues at staging"));
        rawIssueStaging.forEach(function (issueObj) {
          if (issueObj.position[0][0] < leftChomp) {
            submit(issueObj);
            console.log("628 ".concat(log$1("push", "issueObj", issueObj)));
          } else {
            console.log("630 discarding ".concat(JSON.stringify(issueObj, null, 4)));
          }
        });
        rawIssueStaging = [];
        console.log("634 ".concat(log$1("reset", "doNothingUntil", doNothingUntil)));
      }
    }
    if (doNothingUntil === true && doNothingUntilReason === "cdata" && "[]".includes(str[_i])) {
      var temp = stringLeftRight.chompRight(str, _i, "[?*", "]?*", "[?*", "]?*", ">");
      console.log("645 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " temp = ", temp));
      if (temp) {
        doNothingUntil = _i + 3;
        console.log("648 ".concat(log$1("set", "doNothingUntil", doNothingUntil)));
      }
    } else {
      var R1 = doNothingUntil === "true";
      var R2 = doNothingUntilReason === "cdata";
      var R3 = "[]".includes(str[_i]);
      console.log("655 R1 = ".concat(R1, " (").concat(doNothingUntil, "); R2 = ").concat(R2, " (").concat(doNothingUntilReason, "); R3 = ").concat(R3));
    }
    if (doNothingUntil === null || doNothingUntil !== null && doNothingUntilReason !== "script tag" || doNothingUntilReason === "script tag" && (str[_i - 1] !== "\\" || str[_i - 2] === "\\")) {
      if (withinQuotes === null && "\"'`".includes(str[_i])) {
        withinQuotes = _i;
        console.log("674 ".concat(log$1("set", "withinQuotes", withinQuotes)));
      } else if (withinQuotes !== null && str[withinQuotes] === str[_i] && (!withinQuotesEndAt || withinQuotesEndAt === _i)) {
        console.log("680 withinQuotes was ".concat(withinQuotes, ", resetting to null"));
        withinQuotes = null;
        withinQuotesEndAt = null;
        console.log("683 ".concat(log$1("set", "withinQuotes", withinQuotes)));
      }
    }
    if (withinQuotesEndAt && withinQuotesEndAt === _i) {
      withinQuotes = null;
      withinQuotesEndAt = null;
      console.log("691 ".concat(log$1("reset", "withinQuotes", withinQuotes, "withinQuotesEndAt", withinQuotesEndAt)));
    }
    if (doNothingUntil && doNothingUntilReason === "esp" && logEspTag.tailStartAt && logEspTag.tailEndAt === null && !espChars.includes(str[_i + 1])) {
      console.log("733 ".concat("\x1B[".concat(90, "m", "within tail closing clauses", "\x1B[", 39, "m")));
      doNothingUntil = _i + 1;
    }
    if (doNothingUntil && doNothingUntilReason === "esp" && logEspTag.headVal && logEspTag.tailStartAt === null) {
      console.log("749 ".concat("\x1B[".concat(90, "m", "within ESP tag tail opening clauses", "\x1B[", 39, "m")));
      var temp1;
      if (logEspTag.recognised && arrayiffy(knownESPTags[logEspTag.headVal].sibling).some(function (closingVal) {
        if (stringLeftRight.rightSeq.apply(void 0, [str, _i].concat(_toConsumableArray(closingVal.split(""))))) {
          temp1 = closingVal;
          i = _i;
          return true;
        }
      })) {
        console.log("761 recognised tail openings");
        var tempEnd = stringLeftRight.rightSeq.apply(void 0, [str, _i].concat(_toConsumableArray(temp1.split(""))));
        logEspTag.tailStartAt = tempEnd.leftmostChar;
        logEspTag.tailEndAt = tempEnd.rightmostChar + 1;
        logEspTag.tailVal = str.slice(logEspTag.tailStartAt, logEspTag.tailEndAt);
        logEspTag.endAt = logEspTag.tailEndAt;
        doNothingUntil = logEspTag.endAt;
        console.log("777 ".concat(log$1("SET", "logEspTag.tailStartAt", logEspTag.tailStartAt, "logEspTag.tailEndAt", logEspTag.tailEndAt, "logEspTag.tailVal", logEspTag.tailVal, "logEspTag.endAt", logEspTag.endAt, "doNothingUntil", doNothingUntil)));
        pingEspTag(logEspTag);
        resetEspTag();
      } else if (flip$1(logEspTag.headVal).includes(str[_i])) {
        console.log("797 unrecognised tail openings");
        if (espChars.includes(str[stringLeftRight.right(str, _i)]) || logEspTag.headVal.includes(str[_i]) || flip$1(logEspTag.headVal).includes(str[_i])) {
          logEspTag.tailStartAt = _i;
          console.log("811 ".concat(log$1("SET", "logEspTag.tailStartAt", logEspTag.tailStartAt)));
        } else {
          console.log("".concat("\x1B[".concat(33, "m", "logEspTag.headVal", "\x1B[", 39, "m"), " = ", JSON.stringify(logEspTag.headVal, null, 4)));
          console.log("logEspTag.headVal.includes(".concat(str[_i], ") = ").concat(logEspTag.headVal.includes(str[_i])));
        }
      }
    }
    if (logEspTag.headStartAt !== null && logEspTag.headEndAt === null && _i > logEspTag.headStartAt && str[_i + 1] && (!str[_i + 1].trim().length || !espChars.includes(str[_i + 1]))) {
      if (!logEspTag.recognised || knownESPTags[logEspTag.headVal].type === "opening") {
        if (str.slice(logEspTag.headStartAt, _i + 1) !== "--") {
          logEspTag.headEndAt = _i + 1;
          logEspTag.headVal = str.slice(logEspTag.headStartAt, _i + 1);
          logEspTag.recognised = knownESPTags.hasOwnProperty(logEspTag.headVal);
          console.log("854 ".concat(log$1("SET", "logEspTag.headEndAt", logEspTag.headEndAt, "logEspTag.headVal", logEspTag.headVal, "logEspTag.recognised", logEspTag.recognised)));
        }
      }
    }
    if (logEspTag.startAt === null && logEspTag.headStartAt === null && espChars.includes(str[_i]) && str[_i + 1] && !stringLeftRight.leftSeq(str, _i, "<", "!") && (!doNothingUntil || doNothingUntil === true)) {
      if (espChars.includes(str[_i + 1])) {
        logEspTag.headStartAt = _i;
        logEspTag.startAt = _i;
        logEspTag.type = "tag-based";
        console.log("892 ".concat(log$1("SET", "logEspTag.headStartAt", logEspTag.headStartAt, "logEspTag.startAt", logEspTag.startAt)));
      } else if (espCharsFunc.includes(str[_i]) && isLowerCaseLetter$1(str[_i + 1])) {
        logEspTag.headStartAt = _i;
        logEspTag.startAt = _i;
        logEspTag.headEndAt = _i + 1;
        logEspTag.headVal = str[_i];
        logEspTag.type = "function-based";
        logEspTag.recognised = knownESPTags.hasOwnProperty(str[_i]);
        console.log("914 ".concat(log$1("SET", "logEspTag.headStartAt", logEspTag.headStartAt, "logEspTag.headEndAt", logEspTag.headEndAt, "logEspTag.startAt", logEspTag.startAt, "logEspTag.headVal", logEspTag.headVal, "logEspTag.recognised", logEspTag.recognised)));
      }
      if (logEspTag.headStartAt !== null && logWhitespace.startAt !== null && logWhitespace.startAt < _i - 1 && !logWhitespace.includesLinebreaks) {
        submit({
          name: "tag-excessive-whitespace-inside-tag",
          position: [[logWhitespace.startAt + 1, _i]]
        });
        console.log("943 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
      }
    }
    if (!doNothingUntil && logTag.tagNameEndAt !== null) {
      console.log("964 ".concat("\x1B[".concat(90, "m", "above catching the ending of an attribute's name", "\x1B[", 39, "m")));
      if (logAttr.attrNameStartAt !== null && logAttr.attrNameEndAt === null && logAttr.attrName === null && !isLatinLetter(str[_i]) && (str[_i] !== ":" || !isLatinLetter(str[_i + 1]))) {
        logAttr.attrNameEndAt = _i;
        logAttr.attrName = str.slice(logAttr.attrNameStartAt, logAttr.attrNameEndAt);
        console.log("980 ".concat(log$1("SET", "logAttr.attrNameEndAt", logAttr.attrNameEndAt, "logAttr.attrName", logAttr.attrName)));
        if (str[_i] !== "=") {
          if (str[stringLeftRight.right(str, _i)] === "=") {
            console.log("995 equal to the right though");
          } else {
            console.log("998 not equal, so terminate attr");
          }
        }
      }
      console.log("1004 ".concat("\x1B[".concat(90, "m", "above catching what follows the attribute's name", "\x1B[", 39, "m")));
      if (logAttr.attrNameEndAt !== null && logAttr.attrEqualAt === null && _i >= logAttr.attrNameEndAt && str[_i].trim().length) {
        var _temp;
        if (str[_i] === "'" || str[_i] === '"') {
          _temp = attributeOnTheRight$1(str, _i);
        }
        console.log("1018 ".concat("\x1B[".concat(90, "m", "inside catch what follows the attribute's name", "\x1B[", 39, "m")));
        if (str[_i] === "=") {
          logAttr.attrEqualAt = _i;
          console.log("1023 ".concat(log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)));
          if (str[_i + 1]) {
            var nextCharOnTheRightAt = stringLeftRight.right(str, _i);
            if (str[nextCharOnTheRightAt] === "=") {
              console.log("1042 REPEATED EQUAL DETECTED");
              var nextEqualStartAt = _i + 1;
              var nextEqualEndAt = nextCharOnTheRightAt + 1;
              doNothingUntil = nextEqualEndAt;
              doNothingUntilReason = "repeated equals";
              console.log("1053 ".concat(log$1("set", "doNothingUntil", doNothingUntil)));
              console.log("1057 SET ".concat("\x1B[".concat(36, "m", "nextEqualStartAt = \"".concat(nextEqualStartAt, "\"; nextEqualEndAt = \"").concat(nextEqualEndAt, ";\""), "\x1B[", 39, "m")));
              while (nextEqualStartAt && nextEqualEndAt) {
                console.log("       ".concat("\x1B[".concat(35, "m", "*", "\x1B[", 39, "m")));
                submit({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                console.log("1066 ".concat(log$1("push", "tag-attribute-repeated-equal", "".concat("[[".concat(nextEqualStartAt, ", ").concat(nextEqualEndAt, "]]")))));
                var _temp2 = stringLeftRight.right(str, nextEqualEndAt - 1);
                console.log("1074 ".concat(log$1("set", "temp", _temp2)));
                if (str[_temp2] === "=") {
                  console.log("1077 ".concat("\x1B[".concat(36, "m", "yes, there's \"=\" on the right", "\x1B[", 39, "m")));
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = _temp2 + 1;
                  console.log("1082 SET ".concat("\x1B[".concat(36, "m", "nextEqualStartAt = \"".concat(nextEqualStartAt, "\"; nextEqualEndAt = \"").concat(nextEqualEndAt, ";\""), "\x1B[", 39, "m")));
                  doNothingUntil = nextEqualEndAt;
                  doNothingUntilReason = "already processed equals";
                  console.log("1090 ".concat(log$1("set", "doNothingUntil", doNothingUntil)));
                } else {
                  nextEqualStartAt = null;
                  console.log("1095 ".concat(log$1("set", "nextEqualStartAt", nextEqualStartAt)));
                }
              }
              console.log("       ".concat("\x1B[".concat(35, "m", "*", "\x1B[", 39, "m")));
            }
          }
        } else if (_temp) {
          console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ENDED ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
          console.log("1107 quoted attribute's value on the right, equal is indeed missing");
          submit({
            name: "tag-attribute-missing-equal",
            position: [[_i, _i, "="]]
          });
          console.log("1115 ".concat(log$1("push", "tag-attribute-missing-equal", "".concat("[[".concat(_i, ", ").concat(_i, ", \"=\"]]")))));
          logAttr.attrEqualAt = _i;
          console.log("1124 ".concat(log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)));
          logAttr.attrValueStartAt = _i + 1;
          console.log("1129 ".concat(log$1("SET", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
          logAttr.attrValueEndAt = _temp;
          console.log("1138 ".concat(log$1("SET", "logAttr.attrValueEndAt", logAttr.attrValueEndAt)));
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = str[_i];
          logAttr.attrClosingQuote.pos = _temp;
          logAttr.attrClosingQuote.val = str[_temp];
          console.log("1150 ".concat(log$1("SET", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          logAttr.attrValue = str.slice(_i + 1, _temp);
          console.log("1161 ".concat(log$1("SET", "logAttr.attrValue", logAttr.attrValue)));
        } else {
          console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ENDED ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
          logTag.attributes.push(clone(logAttr));
          console.log("1173 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[_i] === "=") {
            submit({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, _i]]
            });
            console.log("1188 ".concat(log$1("push", "tag-attribute-space-between-name-and-equals", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
            resetLogWhitespace();
          } else if (isLatinLetter(str[_i])) {
            logTag.attributes.push(clone(logAttr));
            console.log("1201 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < _i) {
                  submit({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, _i]]
                  });
                  console.log("1216 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
                }
                console.log("1223 dead end of excessive whitespace check");
              } else {
                submit({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, _i, " "]]
                });
                console.log("1231 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, ", \" \"]]")))));
              }
            }
          }
        }
      }
      console.log("1246 ".concat("\x1B[".concat(90, "m", "above catching the begining of an attribute's name", "\x1B[", 39, "m")));
      if (logAttr.attrStartAt === null && isLatinLetter(str[_i])) {
        console.log("1251 ".concat("\x1B[".concat(90, "m", "inside catching the begining of an attribute's name", "\x1B[", 39, "m")));
        logAttr.attrStartAt = _i;
        logAttr.attrNameStartAt = _i;
        console.log("1256 ".concat(log$1("SET", "logAttr.attrStartAt", logAttr.attrStartAt, "logAttr.attrNameStartAt", logAttr.attrNameStartAt)));
        if (logWhitespace.startAt !== null && logWhitespace.startAt < _i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, _i]]
            });
            console.log("1278 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
          } else {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, _i, " "]]
            });
            console.log("1291 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, ", \" \"]]")))));
          }
        }
        if (str[_i - 1]) {
          if (charIsQuote$1(str[_i - 1])) {
            for (var y = _i - 1; y--;) {
              if (!charIsQuote$1(str[y])) {
                if (!str[y].trim().length) {
                  submit({
                    name: "tag-stray-character",
                    position: [[y + 1, _i]]
                  });
                  console.log("1312 ".concat(log$1("push", "tag-stray-character", "".concat(JSON.stringify([[y + 1, _i]], null, 0)))));
                }
                break;
              }
            }
          }
        }
      }
      console.log("1327 ".concat("\x1B[".concat(90, "m", "above catching what follows attribute's equal", "\x1B[", 39, "m")));
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos === null) {
        console.log("1335 ".concat("\x1B[".concat(90, "m", "inside catching what follows attribute's equal", "\x1B[", 39, "m")));
        if (logAttr.attrEqualAt < _i && str[_i].trim().length) {
          console.log("1338 catching what follows equal");
          if (charcode === 34 || charcode === 39) {
            if (logWhitespace.startAt && logWhitespace.startAt < _i) {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, _i]]
              });
              console.log("1349 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat(JSON.stringify([[logWhitespace.startAt, _i]], null, 0)))));
            }
            resetLogWhitespace();
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = str[_i];
            var closingQuotePeek = findClosingQuote$1(str, _i);
            console.log("1363 ".concat(log$1("set", "closingQuotePeek", closingQuotePeek)));
            if (closingQuotePeek) {
              if (str[closingQuotePeek] !== str[_i]) {
                if (str[closingQuotePeek] === "'" || str[closingQuotePeek] === '"') {
                  var isDouble = str[closingQuotePeek] === '"';
                  var name = "tag-attribute-mismatching-quotes-is-".concat(isDouble ? "double" : "single");
                  submit({
                    name: name,
                    position: [[closingQuotePeek, closingQuotePeek + 1, "".concat(isDouble ? "'" : '"')]]
                  });
                  console.log("1394 ".concat(log$1("push", name, "".concat("[[".concat(closingQuotePeek, ", ").concat(closingQuotePeek + 1, ", ").concat(isDouble ? "'" : '"', "]]")))));
                } else {
                  var compensation = "";
                  var fromPositionToInsertAt = str[closingQuotePeek - 1].trim().length ? closingQuotePeek : stringLeftRight.left(str, closingQuotePeek) + 1;
                  console.log("1427 ".concat(log$1("set", "fromPositionToInsertAt", fromPositionToInsertAt)));
                  var toPositionToInsertAt = closingQuotePeek;
                  console.log("1435 ".concat(log$1("set", "toPositionToInsertAt", toPositionToInsertAt)));
                  if (str[stringLeftRight.left(str, closingQuotePeek)] === "/") {
                    console.log("1443 SLASH ON THE LEFT");
                    toPositionToInsertAt = stringLeftRight.left(str, closingQuotePeek);
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      submit({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                      console.log("1452 ".concat(log$1("push", "tag-whitespace-closing-slash-and-bracket", "".concat("[[".concat(toPositionToInsertAt + 1, ", ").concat(closingQuotePeek, "]]")))));
                    }
                    fromPositionToInsertAt = stringLeftRight.left(str, toPositionToInsertAt) + 1;
                    console.log("1465 ".concat(log$1("set", "toPositionToInsertAt", toPositionToInsertAt, "fromPositionToInsertAt", fromPositionToInsertAt)));
                  }
                  submit({
                    name: "tag-attribute-closing-quotation-mark-missing",
                    position: [[fromPositionToInsertAt, toPositionToInsertAt, "".concat(str[_i]).concat(compensation)]]
                  });
                  console.log("1486 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(closingQuotePeek, ", ").concat(closingQuotePeek, ", ", "".concat(str[_i]).concat(compensation), "]]")))));
                }
              }
              logAttr.attrClosingQuote.pos = closingQuotePeek;
              logAttr.attrClosingQuote.val = str[_i];
              logAttr.attrValue = str.slice(_i + 1, closingQuotePeek);
              logAttr.attrValueStartAt = _i + 1;
              logAttr.attrValueEndAt = closingQuotePeek;
              logAttr.attrEndAt = closingQuotePeek;
              console.log("1504 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote, "logAttr.attrValue", logAttr.attrValue, "logAttr.attrValueStartAt", logAttr.attrValueStartAt, "logAttr.attrValueEndAt", logAttr.attrValueEndAt, "logAttr.attrEndAt", logAttr.attrEndAt)));
              for (var _y = _i + 1; _y < closingQuotePeek; _y++) {
                var newIssue = encodeChar$1(str, _y);
                if (newIssue) {
                  tagIssueStaging.push(newIssue);
                  console.log("1530 ".concat(log$1("push tagIssueStaging", "newIssue", newIssue)));
                }
              }
              if (rawIssueStaging.length) {
                console.log("1539 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " raw stage present: ", JSON.stringify(rawIssueStaging, null, 4)));
              }
              if (logAttr.attrNameStartAt && str[logAttr.attrNameStartAt - 1].trim().length && (!opts.rules || opts.rules["tag-stray-character"] !== false) && !retObj.issues.some(function (issueObj) {
                i = _i;
                return (issueObj.name === "tag-stray-quotes" || issueObj.name === "tag-stray-character") && issueObj.position[0][1] === logAttr.attrNameStartAt;
              })) {
                submit({
                  name: "tag-missing-space-before-attribute",
                  position: [[logAttr.attrNameStartAt, logAttr.attrNameStartAt, " "]]
                });
                console.log("1572 ".concat(log$1("push", "tag-missing-space-before-attribute", "".concat("[[".concat(logAttr.attrNameStartAt, ", ").concat(logAttr.attrNameStartAt, ", \" \"]]")))));
              }
              logTag.attributes.push(clone(logAttr));
              console.log("1584 ".concat(log$1("PUSH, then RESET", "logAttr")));
              if (str[closingQuotePeek].trim().length) {
                doNothingUntil = closingQuotePeek - (charIsQuote$1(str[closingQuotePeek]) ? 0 : 1) + 1;
              } else {
                doNothingUntil = stringLeftRight.left(str, closingQuotePeek) + 1;
              }
              doNothingUntilReason = "closing quote looked up";
              if (withinQuotes !== null) {
                withinQuotesEndAt = logAttr.attrClosingQuote.pos;
              }
              console.log("1610 ".concat(log$1("set", "doNothingUntil", doNothingUntil, "withinQuotesEndAt", withinQuotesEndAt)));
              resetLogAttr();
              if (_i === len - 1 && logTag.tagStartAt !== null && (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null || logTag.attributes.some(function (attrObj) {
                return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
              }))) {
                submit({
                  name: "tag-missing-closing-bracket",
                  position: [[_i + 1, _i + 1, ">"]]
                });
                console.log("1640 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(_i + 1, ", ").concat(_i + 1, ", \">\"]]")))));
              }
              console.log("1648 ".concat(log$1("continue")));
              i = _i;
              return "continue";
            }
          } else if (charcode === 8220 || charcode === 8221) {
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = "\"";
            console.log("1659 ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote)));
            var _name = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
            submit({
              name: _name,
              position: [[_i, _i + 1, "\""]]
            });
            console.log("1676 ".concat(log$1("push", _name, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
            logAttr.attrValueStartAt = _i + 1;
            console.log("1681 ".concat(log$1("set", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
            withinQuotes = _i;
            console.log("1690 ".concat(log$1("set", "withinQuotes", withinQuotes)));
          } else if (charcode === 8216 || charcode === 8217) {
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = "'";
            console.log("1699 ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote)));
            var _name2 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
            submit({
              name: _name2,
              position: [[_i, _i + 1, "'"]]
            });
            console.log("1716 ".concat(log$1("push", _name2, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
            logAttr.attrValueStartAt = _i + 1;
            console.log("1721 ".concat(log$1("set", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
            withinQuotes = _i;
            console.log("1730 ".concat(log$1("set", "withinQuotes", withinQuotes)));
          } else if (!withinTagInnerspace$1(str, _i)) {
            console.log("1733 \x1B[".concat(33, "m", "\u2588\u2588", "\x1B[", 39, "m - withinTagInnerspace() ", "\x1B[".concat(32, "m", "false", "\x1B[", 39, "m")));
            var _closingQuotePeek = findClosingQuote$1(str, _i);
            console.log("1739 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
            console.log("1741 ".concat(log$1("set", "closingQuotePeek", _closingQuotePeek)));
            var quoteValToPut = charIsQuote$1(str[_closingQuotePeek]) ? str[_closingQuotePeek] : "\"";
            submit({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[stringLeftRight.left(str, _i) + 1, _i, quoteValToPut]]
            });
            console.log("1754 ".concat(log$1("push", "tag-attribute-opening-quotation-mark-missing", "".concat("[[".concat(stringLeftRight.left(str, _i) + 1, ", ").concat(_i, ", ").concat(quoteValToPut, "]]")))));
            logAttr.attrOpeningQuote = {
              pos: _i,
              val: quoteValToPut
            };
            logAttr.attrValueStartAt = _i;
            console.log("1768 mark opening quote: ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote, "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
            withinQuotes = _i;
            console.log("1778 ".concat(log$1("set", "withinQuotes", withinQuotes)));
            console.log("1783 traverse forward\n\n\n");
            var closingBracketIsAt = null;
            var innerTagEndsAt = null;
            for (var _y2 = _i; _y2 < len; _y2++) {
              console.log("1810 \x1B[".concat(36, "m", "str[".concat(_y2, "] = \"").concat(str[_y2], "\""), "\x1B[", 39, "m"));
              if (str[_y2] === ">" && (str[stringLeftRight.left(str, _y2)] !== "/" && withinTagInnerspace$1(str, _y2) || str[stringLeftRight.left(str, _y2)] === "/")) {
                var leftAt = stringLeftRight.left(str, _y2);
                closingBracketIsAt = _y2;
                console.log("1820 ".concat(log$1("set", "leftAt", leftAt, "closingBracketIsAt", closingBracketIsAt)));
                innerTagEndsAt = _y2;
                if (str[leftAt] === "/") {
                  innerTagEndsAt = leftAt;
                  console.log("1832 ".concat(log$1("set", "innerTagEndsAt", innerTagEndsAt)));
                }
              }
              var dealBrakerCharacters = "=<";
              if (innerTagEndsAt !== null && dealBrakerCharacters.includes(str[_y2])) {
                console.log("1844 \x1B[".concat(36, "m", "break (\"".concat(str[_y2], "\" is a bad character)"), "\x1B[", 39, "m"));
                break;
              }
            }
            console.log("1852 ".concat(log$1("set", "closingBracketIsAt", closingBracketIsAt, "innerTagEndsAt", innerTagEndsAt)));
            var innerTagContents;
            if (_i < innerTagEndsAt) {
              innerTagContents = str.slice(_i, innerTagEndsAt);
            } else {
              innerTagContents = "";
            }
            console.log("1868 ".concat(log$1("set", "innerTagContents", innerTagContents)));
            var startingPoint = innerTagEndsAt;
            var attributeOnTheRightBeginsAt;
            if (innerTagContents.includes("=")) {
              console.log("1883 inner tag contents include an equal character");
              var _temp3 = innerTagContents.split("=")[0];
              console.log("1896 ".concat(log$1("set", "temp1", _temp3)));
              if (_temp3.split("").some(function (char) {
                return !char.trim().length;
              })) {
                console.log("1901 traverse backwards to find beginning of the attr on the right\n\n\n");
                for (var z = _i + _temp3.length; z--;) {
                  console.log("1905 \x1B[".concat(35, "m", "str[".concat(z, "] = ").concat(str[z]), "\x1B[", 39, "m"));
                  if (!str[z].trim().length) {
                    attributeOnTheRightBeginsAt = z + 1;
                    console.log("1910 ".concat(log$1("set", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt, "then BREAK")));
                    break;
                  }
                  if (z === _i) {
                    break;
                  }
                }
                console.log("\n\n\n");
                console.log("1927 ".concat(log$1("log", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
                var temp2 = stringLeftRight.left(str, attributeOnTheRightBeginsAt);
                if (!charIsQuote$1(temp2)) {
                  startingPoint = temp2 + 1;
                }
              }
            } else {
              console.log("1943 inner tag contents don't include an equal character");
            }
            var caughtAttrEnd = null;
            var caughtAttrStart = null;
            var finalClosingQuotesShouldBeAt = null;
            var boolAttrFound = false;
            console.log("\n\n\n\n\n\n");
            console.log("1959 ".concat("\x1B[".concat(31, "m", "TRAVERSE BACKWARDS", "\x1B[", 39, "m"), "; startingPoint=", startingPoint));
            for (var _z = startingPoint; _z--; _z > _i) {
              console.log("1964 ".concat("\x1B[".concat(36, "m", "str[".concat(_z, "] = ").concat(str[_z]), "\x1B[", 39, "m")));
              if (str[_z] === "=") {
                console.log("1968 ".concat(log$1("break")));
                break;
              }
              if (caughtAttrEnd === null && str[_z].trim().length) {
                caughtAttrEnd = _z + 1;
                console.log("1976 ".concat(log$1("set", "caughtAttrEnd", caughtAttrEnd)));
                if (boolAttrFound) {
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  console.log("1983 ".concat(log$1("set", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt)));
                  boolAttrFound = false;
                  console.log("1992 ".concat(log$1("set", "boolAttrFound", boolAttrFound)));
                }
              }
              if (!str[_z].trim().length && caughtAttrEnd) {
                caughtAttrStart = _z + 1;
                console.log("2000 ".concat("\x1B[".concat(35, "m", "ATTR", "\x1B[", 39, "m"), ": ", str.slice(caughtAttrStart, caughtAttrEnd), " (").concat(caughtAttrStart, "-").concat(caughtAttrEnd, ")"));
                if (str[stringLeftRight.right(str, caughtAttrEnd)] === "=") {
                  var _temp4 = stringLeftRight.left(str, caughtAttrStart);
                  if (!charIsQuote$1(str[_temp4])) {
                    attributeOnTheRightBeginsAt = stringLeftRight.right(str, _temp4 + 1);
                    console.log("2017 ".concat(log$1("set", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
                  }
                  break;
                } else {
                  if (knownBooleanHTMLAttributes.includes(str.slice(caughtAttrStart, caughtAttrEnd))) {
                    boolAttrFound = true;
                    console.log("2036 ".concat(log$1("set", "boolAttrFound", boolAttrFound)));
                  } else {
                    console.log("2040 ".concat(log$1("break")));
                    break;
                  }
                }
                caughtAttrEnd = null;
                caughtAttrStart = null;
                console.log("2049 ".concat(log$1("reset", "caughtAttrEnd", caughtAttrEnd, "caughtAttrStart", caughtAttrStart)));
              }
            }
            console.log("2060 ".concat("\x1B[".concat(31, "m", "TRAVERSE ENDED", "\x1B[", 39, "m")));
            console.log("2069 ".concat(log$1("log", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt, "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
            if (!finalClosingQuotesShouldBeAt && attributeOnTheRightBeginsAt) {
              finalClosingQuotesShouldBeAt = stringLeftRight.left(str, attributeOnTheRightBeginsAt) + 1;
              console.log("2083 ".concat(log$1("log", "attributeOnTheRightBeginsAt", attributeOnTheRightBeginsAt)));
              console.log("2090 ".concat(log$1("set", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt)));
            }
            console.log("2099 \u2588\u2588 ".concat(log$1("log", "caughtAttrEnd", caughtAttrEnd, "left(str, caughtAttrEnd)", stringLeftRight.left(str, caughtAttrEnd))));
            if (caughtAttrEnd && logAttr.attrOpeningQuote && !finalClosingQuotesShouldBeAt && str[stringLeftRight.left(str, caughtAttrEnd)] !== logAttr.attrOpeningQuote.val) {
              finalClosingQuotesShouldBeAt = caughtAttrEnd;
              console.log("2116 ".concat(log$1("set", "finalClosingQuotesShouldBeAt", finalClosingQuotesShouldBeAt)));
            }
            console.log("2125 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", " \x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "finalClosingQuotesShouldBeAt", "\x1B[", 39, "m"), " = ", JSON.stringify(finalClosingQuotesShouldBeAt, null, 4)));
            if (finalClosingQuotesShouldBeAt) {
              submit({
                name: "tag-attribute-closing-quotation-mark-missing",
                position: [[finalClosingQuotesShouldBeAt, finalClosingQuotesShouldBeAt, logAttr.attrOpeningQuote.val]]
              });
              console.log("2147 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(finalClosingQuotesShouldBeAt, ", ").concat(finalClosingQuotesShouldBeAt, ", ").concat(logAttr.attrOpeningQuote.val, "]]")))));
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
            console.log("2175 ".concat(log$1("set", "logAttr.attrClosingQuote.pos", logAttr.attrClosingQuote.pos, "logAttr.attrClosingQuote.val", logAttr.attrClosingQuote.val, "logAttr.attrValueEndAt", logAttr.attrValueEndAt, "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrValue", logAttr.attrValue)));
            if (logAttr.attrValueStartAt < logAttr.attrValueEndAt) {
              for (var _z2 = logAttr.attrValueStartAt; _z2 < logAttr.attrValueEndAt; _z2++) {
                console.log("2198 \x1B[".concat(36, "m", "str[".concat(_z2, "] = ").concat(str[_z2]), "\x1B[", 39, "m"));
                var _temp5 = encodeChar$1(str, _z2);
                if (_temp5) {
                  submit(_temp5);
                  console.log("2204 ".concat(log$1("push", "unencoded character", _temp5)));
                }
              }
            }
            if (!doNothingUntil) {
              doNothingUntil = logAttr.attrClosingQuote.pos;
              doNothingUntilReason = "missing opening quotes";
              logWhitespace.startAt = null;
              console.log("2217 ".concat(log$1("set", "doNothingUntil", doNothingUntil, "logWhitespace.startAt", logWhitespace.startAt)));
            }
            console.log("2228 ".concat(log$1("about to push", "logAttr", logAttr)));
            logTag.attributes.push(clone(logAttr));
            console.log("2231 ".concat(log$1("PUSH, then RESET", "logAttr", "then CONTINUE")));
            resetLogAttr();
            i = _i;
            return "continue";
          } else {
            console.log("2241 \x1B[".concat(33, "m", "\u2588\u2588", "\x1B[", 39, "m - withinTagInnerspace() ", "\x1B[".concat(32, "m", "true", "\x1B[", 39, "m")));
            var start = logAttr.attrStartAt;
            var _temp6 = stringLeftRight.right(str, _i);
            console.log("2255 ".concat(log$1("set", "start", start, "temp", _temp6)));
            if (str[_i] === "/" && _temp6 && str[_temp6] === ">" || str[_i] === ">") {
              for (var _y3 = logAttr.attrStartAt; _y3--;) {
                if (str[_y3].trim().length) {
                  start = _y3 + 1;
                  break;
                }
              }
            }
            submit({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, _i]]
            });
            console.log("2274 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(start, ", ").concat(_i, "]]")))));
            console.log("2281 ".concat(log$1("reset", "logWhitespace")));
            resetLogWhitespace();
            console.log("2283 ".concat(log$1("reset", "logAttr")));
            resetLogAttr();
            console.log("2288 ".concat(log$1("offset the index", "i--; then continue")));
            _i--;
            i = _i;
            return "continue";
          }
          console.log("2295 ".concat(log$1("SET", "logAttr.attrOpeningQuote.pos", logAttr.attrOpeningQuote.pos, "logAttr.attrOpeningQuote.val", logAttr.attrOpeningQuote.val)));
          if (logWhitespace.startAt !== null) {
            if (str[_i] === "'" || str[_i] === '"') {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, _i]]
              });
              console.log("2313 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
            } else if (withinTagInnerspace$1(str, _i + 1)) {
              submit({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, _i]]
              });
              console.log("2328 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(logAttr.attrStartAt, ", ").concat(_i, "]]")))));
              console.log("2334 ".concat(log$1("reset", "logAttr")));
              resetLogAttr();
            }
          }
        } else if (!str[_i + 1] || !stringLeftRight.right(str, _i)) {
          console.log("2339");
          submit({
            name: "file-missing-ending",
            position: [[_i + 1, _i + 1]]
          });
          console.log("2345 ".concat(log$1("push", "file-missing-ending", "".concat("[[".concat(_i + 1, ", ").concat(_i + 1, "]]")))));
          console.log("2351 then CONTINUE");
          i = _i;
          return "continue";
        }
      }
      console.log("2357 ".concat("\x1B[".concat(90, "m", "above catching closing quote (single or double)", "\x1B[", 39, "m")));
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null && (logAttr.attrClosingQuote.pos === null || _i === logAttr.attrClosingQuote.pos) && _i > logAttr.attrOpeningQuote.pos && charIsQuote$1(str[_i])) {
        console.log("2369 ".concat("\x1B[".concat(90, "m", "inside catching closing quote (single or double)", "\x1B[", 39, "m")));
        if (charcode === 34 || charcode === 39) {
          var issueName = "tag-attribute-mismatching-quotes-is-".concat(charcode === 34 ? "double" : "single");
          if (str[_i] !== logAttr.attrOpeningQuote.val && (!retObj.issues.length || !retObj.issues.some(function (issueObj) {
            i = _i;
            return issueObj.name === issueName && issueObj.position.length === 1 && issueObj.position[0][0] === _i && issueObj.position[0][1] === _i + 1;
          }))) {
            submit({
              name: issueName,
              position: [[_i, _i + 1, "".concat(charcode === 34 ? "'" : '"')]]
            });
            console.log("2397 ".concat(log$1("push", issueName, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(charcode === 34 ? "'" : '"', "]]")))));
          } else {
            console.log("2405 ".concat("\x1B[".concat(31, "m", "didn't push an issue", "\x1B[", 39, "m")));
          }
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = str[_i];
          console.log("2416 ".concat(log$1("SET", "logAttr.attrClosingQuote.pos", logAttr.attrClosingQuote.pos, "logAttr.attrClosingQuote.val", logAttr.attrClosingQuote.val)));
          if (logAttr.attrValue === null) {
            if (logAttr.attrOpeningQuote.pos && logAttr.attrClosingQuote.pos && logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos) {
              logAttr.attrValue = str.slice(logAttr.attrValueStartAt, _i);
            } else {
              logAttr.attrValue = "";
            }
            console.log("2441 ".concat(log$1("SET", "logAttr.attrValue", logAttr.attrValue)));
          }
          logAttr.attrEndAt = _i;
          logAttr.attrValueEndAt = _i;
          console.log("2449 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrValueEndAt", logAttr.attrValueEndAt)));
          if (withinQuotes) {
            withinQuotes = null;
            console.log("2461 ".concat(log$1("SET", "withinQuotes", withinQuotes)));
          }
          logTag.attributes.push(clone(logAttr));
          console.log("2466 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8220 || charcode === 8221)) {
          var _name3 = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
          submit({
            name: _name3,
            position: [[_i, _i + 1, '"']]
          });
          console.log("2484 ".concat(log$1("push", _name3, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
          logAttr.attrEndAt = _i;
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = '"';
          console.log("2492 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          logTag.attributes.push(clone(logAttr));
          console.log("2503 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8216 || charcode === 8217) && (stringLeftRight.right(str, _i) !== null && (str[stringLeftRight.right(str, _i)] === ">" || str[stringLeftRight.right(str, _i)] === "/") || withinTagInnerspace$1(str, _i + 1))) {
          var _name4 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
          submit({
            name: _name4,
            position: [[_i, _i + 1, "'"]]
          });
          console.log("2524 ".concat(log$1("push", _name4, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"'\"]]")))));
          logAttr.attrEndAt = _i;
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = "'";
          console.log("2532 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          withinQuotes = null;
          withinQuotesEndAt = null;
          console.log("2545 ".concat(log$1("reset", "withinQuotes & withinQuotesEndAt")));
          logTag.attributes.push(clone(logAttr));
          console.log("2550 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        }
      }
      console.log("2558 ".concat("\x1B[".concat(90, "m", "error clauses", "\x1B[", 39, "m")));
      if (logAttr.attrOpeningQuote.val && logAttr.attrOpeningQuote.pos < _i && logAttr.attrClosingQuote.pos === null && (
      str[_i] === "/" && stringLeftRight.right(str, _i) && str[stringLeftRight.right(str, _i)] === ">" || str[_i] === ">")) {
        console.log("2569 inside error catch clauses");
        submit({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[_i, _i, logAttr.attrOpeningQuote.val]]
        });
        console.log("2576 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(_i, ", ").concat(_i, ", ").concat(logAttr.attrOpeningQuote.val, "]]")))));
        logAttr.attrClosingQuote.pos = _i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log("2586 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
        logTag.attributes.push(clone(logAttr));
        console.log("2594 ".concat(log$1("PUSH, then RESET", "logAttr")));
        resetLogAttr();
      }
    }
    if (charcode < 32) {
      var _name5 = "bad-character-".concat(lowAsciiCharacterNames[charcode]);
      if (charcode === 9) {
        if (!doNothingUntil) {
          submit({
            name: _name5,
            position: [[_i, _i + 1, "  "]]
          });
          console.log("2623 PUSH \"".concat(_name5, "\", [[").concat(_i, ", ").concat(_i + 1, ", \"  \"]]"));
        }
      } else if (charcode === 13) {
        if (isStr$1(str[_i + 1]) && str[_i + 1].charCodeAt(0) === 10) {
          if (!doNothingUntil) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
              submit({
                name: "file-wrong-type-line-ending-CRLF",
                position: [[_i, _i + 2, rawEnforcedEOLChar]]
              });
              console.log("2644 ".concat(log$1("push", "file-wrong-type-line-ending-CRLF", "".concat("[[".concat(_i, ", ").concat(_i + 2, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
            } else {
              logLineEndings.crlf.push([_i, _i + 2]);
              console.log("2658 ".concat(log$1("logLineEndings.crlf push", "[".concat(_i, ", ").concat(_i + 2, "]"))));
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[_i, _i + 2]]
            });
            console.log("2670 ".concat(log$1("push", "esp-line-break-within-templating-tag", "".concat("[[".concat(_i, ", ").concat(_i + 2, "]]")))));
          }
        } else {
          if (!doNothingUntil) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CR") {
              submit({
                name: "file-wrong-type-line-ending-CR",
                position: [[_i, _i + 1, rawEnforcedEOLChar]]
              });
              console.log("2691 ".concat(log$1("push", "file-wrong-type-line-ending-CR", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
            } else {
              logLineEndings.cr.push([_i, _i + 1]);
              console.log("2705 ".concat(log$1("logLineEndings.cr push", "[".concat(_i, ", ").concat(_i + 1, "]"))));
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[_i, _i + 1]]
            });
            console.log("2717 ".concat(log$1("push", "esp-line-break-within-templating-tag", "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
          }
        }
      } else if (charcode === 10) {
        if (!(isStr$1(str[_i - 1]) && str[_i - 1].charCodeAt(0) === 13)) {
          if (!doNothingUntil) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "LF") {
              submit({
                name: "file-wrong-type-line-ending-LF",
                position: [[_i, _i + 1, rawEnforcedEOLChar]]
              });
              console.log("2742 ".concat(log$1("push", "file-wrong-type-line-ending-LF", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
            } else {
              logLineEndings.lf.push([_i, _i + 1]);
              console.log("2756 ".concat(log$1("logLineEndings.lf push", "[".concat(_i, ", ").concat(_i + 1, "]"))));
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[_i, _i + 1]]
            });
            console.log("2768 ".concat(log$1("push", "esp-line-break-within-templating-tag", "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
          }
        }
      } else if (!doNothingUntil) {
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
        console.log("2808 ".concat(log$1("log", "addThis", addThis)));
        if (addThis) {
          submit({
            name: _name5,
            position: [[nearestNonWhitespaceCharIdxOnTheLeft + 1, nearestNonWhitespaceCharIdxOnTheRight, addThis]]
          });
          console.log("2822 ".concat(log$1("push", _name5, "".concat("[[".concat(nearestNonWhitespaceCharIdxOnTheLeft + 1, ", ").concat(nearestNonWhitespaceCharIdxOnTheRight, ", ").concat(addThis, "]]")))));
        } else {
          submit({
            name: _name5,
            position: [[_i, _i + 1]]
          });
          console.log("2834 ".concat(log$1("push", _name5, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
        }
      }
    } else if (!doNothingUntil && charcode > 126 && charcode < 160) {
      var _name6 = "bad-character-".concat(c1CharacterNames[charcode - 127]);
      submit({
        name: _name6,
        position: [[_i, _i + 1]]
      });
      console.log("2845 ".concat(log$1("push", _name6, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
    } else if (!doNothingUntil && charcode === 60) {
      console.log("2848 ".concat("\x1B[".concat(90, "m", "within opening raw bracket \"<\" clauses", "\x1B[", 39, "m")));
      var whatsOnTheRight1 = stringLeftRight.right(str, _i);
      if (whatsOnTheRight1) {
        var whatsOnTheRight2 = stringLeftRight.right(str, whatsOnTheRight1);
        if (str[whatsOnTheRight1] === "!") {
          if (whatsOnTheRight1 > _i + 1 && str[stringLeftRight.right(str, whatsOnTheRight1)] !== "[") {
            submit({
              name: "html-comment-spaces",
              position: [[_i + 1, whatsOnTheRight1]]
            });
            console.log("2865 ".concat(log$1("push", "html-comment-spaces", "".concat("[[".concat(_i + 1, ", ").concat(whatsOnTheRight1, "]]")))));
          }
          var whatsOnTheRight3 = stringLeftRight.right(str, whatsOnTheRight2);
          if (str[whatsOnTheRight2] === "-") {
            if (whatsOnTheRight2 > whatsOnTheRight1 + 1) {
              submit({
                name: "html-comment-spaces",
                position: [[whatsOnTheRight1 + 1, whatsOnTheRight2]]
              });
              console.log("2882 ".concat(log$1("push", "html-comment-spaces", "".concat("[[".concat(whatsOnTheRight1 + 1, ", ").concat(whatsOnTheRight2, "]]")))));
            }
            var whatsOnTheRight4 = stringLeftRight.right(str, whatsOnTheRight3);
            if (str[whatsOnTheRight3] === "-") {
              if (whatsOnTheRight3 > whatsOnTheRight2 + 1) {
                submit({
                  name: "html-comment-spaces",
                  position: [[whatsOnTheRight2 + 1, whatsOnTheRight3]]
                });
                console.log("2902 ".concat(log$1("push", "html-comment-spaces", "".concat("[[".concat(whatsOnTheRight2 + 1, ", ").concat(whatsOnTheRight3, "]]")))));
              }
            }
            if (str[whatsOnTheRight4] === "-") {
              console.log("2913 ".concat("\x1B[".concat(36, "m", "======= do-while loop =======", "\x1B[", 39, "m")));
              var endingOfTheSequence = whatsOnTheRight4;
              var charOnTheRightAt;
              do {
                charOnTheRightAt = stringLeftRight.right(str, endingOfTheSequence);
                console.log("2921 ".concat("\x1B[".concat(36, "m", "SET charOnTheRightAt = ".concat(charOnTheRightAt), "\x1B[", 39, "m")));
                if (str[charOnTheRightAt] === "-") {
                  endingOfTheSequence = charOnTheRightAt;
                  console.log("2926 ".concat("\x1B[".concat(36, "m", "SET endingOfTheSequence = ".concat(endingOfTheSequence), "\x1B[", 39, "m")));
                }
              } while (str[charOnTheRightAt] === "-");
              var charOnTheRight = stringLeftRight.right(str, endingOfTheSequence);
              submit({
                name: "html-comment-redundant-dash",
                position: [[whatsOnTheRight3 + 1, charOnTheRight]]
              });
              console.log("2937 ".concat(log$1("push", "html-comment-redundant-dash", "".concat("[[".concat(whatsOnTheRight3 + 1, ", ").concat(charOnTheRight, "]]")))));
              doNothingUntil = charOnTheRight;
              doNothingUntilReason = "repeated HTML comment dashes";
              console.log("2947 ".concat(log$1("set", "doNothingUntil", doNothingUntil, "doNothingUntilReason", doNothingUntilReason)));
            }
          }
        } else if (str[whatsOnTheRight1] === "-") ; else {
          console.log("2961 submitOpeningBracket(".concat(_i, ", ").concat(_i + 1, ")"));
          submitOpeningBracket(_i, _i + 1);
        }
      } else {
        console.log("2966 submitOpeningBracket(".concat(_i, ", ").concat(_i + 1, ")"));
        submitOpeningBracket(_i, _i + 1);
      }
    } else if (!doNothingUntil && charcode === 62) {
      console.log("2971 ".concat("\x1B[".concat(90, "m", "within closing raw bracket \">\" clauses", "\x1B[", 39, "m")));
      var whatsOnTheLeft1 = stringLeftRight.left(str, _i);
      if (str[whatsOnTheLeft1] === "-") {
        var whatsOnTheLeft2 = stringLeftRight.left(str, whatsOnTheLeft1);
        if (str[whatsOnTheLeft2] === "-") ;
      } else {
        console.log("2980 submitClosingBracket(".concat(_i, ", ").concat(_i + 1, ")"));
        submitClosingBracket(_i, _i + 1);
      }
    } else if (!doNothingUntil && charcode === 160) {
      var _name7 = "bad-character-unencoded-non-breaking-space";
      submit({
        name: _name7,
        position: [[_i, _i + 1, "&nbsp;"]]
      });
      console.log("2993 ".concat(log$1("push", _name7, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"&nbsp;\"]]")))));
    } else if (!doNothingUntil && charcode === 5760) {
      var _name8 = "bad-character-ogham-space-mark";
      submit({
        name: _name8,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3003 ".concat(log$1("push", _name8, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8192) {
      var _name9 = "bad-character-en-quad";
      submit({
        name: _name9,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3012 ".concat(log$1("push", _name9, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8193) {
      var _name10 = "bad-character-em-quad";
      submit({
        name: _name10,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3021 ".concat(log$1("push", _name10, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8194) {
      var _name11 = "bad-character-en-space";
      submit({
        name: _name11,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3030 ".concat(log$1("push", _name11, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8195) {
      var _name12 = "bad-character-em-space";
      submit({
        name: _name12,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3039 ".concat(log$1("push", _name12, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8196) {
      var _name13 = "bad-character-three-per-em-space";
      submit({
        name: _name13,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3048 ".concat(log$1("push", _name13, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8197) {
      var _name14 = "bad-character-four-per-em-space";
      submit({
        name: _name14,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3057 ".concat(log$1("push", _name14, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8198) {
      var _name15 = "bad-character-six-per-em-space";
      submit({
        name: _name15,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3066 ".concat(log$1("push", _name15, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8199) {
      var _name16 = "bad-character-figure-space";
      submit({
        name: _name16,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3075 ".concat(log$1("push", _name16, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8200) {
      var _name17 = "bad-character-punctuation-space";
      submit({
        name: _name17,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3084 ".concat(log$1("push", _name17, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8201) {
      var _name18 = "bad-character-thin-space";
      submit({
        name: _name18,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3093 ".concat(log$1("push", _name18, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8202) {
      var _name19 = "bad-character-hair-space";
      submit({
        name: _name19,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3102 ".concat(log$1("push", _name19, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \" \"]]")))));
    } else if (!doNothingUntil && charcode === 8203) {
      var _name20 = "bad-character-zero-width-space";
      submit({
        name: _name20,
        position: [[_i, _i + 1]]
      });
      console.log("3112 ".concat(log$1("push", _name20, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
    } else if (!doNothingUntil && charcode === 8232) {
      var _name21 = "bad-character-line-separator";
      submit({
        name: _name21,
        position: [[_i, _i + 1, "\n"]]
      });
      console.log("3122 ".concat(log$1("push", _name21, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"\\n\"]]")))));
    } else if (!doNothingUntil && charcode === 8233) {
      var _name22 = "bad-character-paragraph-separator";
      submit({
        name: _name22,
        position: [[_i, _i + 1, "\n"]]
      });
      console.log("3133 ".concat(log$1("push", _name22, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"\\n\"]]")))));
    } else if (!doNothingUntil && charcode === 8239) {
      var _name23 = "bad-character-narrow-no-break-space";
      submit({
        name: _name23,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3144 ".concat(log$1("push", _name23, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"\\n\"]]")))));
    } else if (!doNothingUntil && charcode === 8287) {
      var _name24 = "bad-character-medium-mathematical-space";
      submit({
        name: _name24,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3155 ".concat(log$1("push", _name24, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"\\n\"]]")))));
    } else if (!doNothingUntil && charcode === 12288) {
      var _name25 = "bad-character-ideographic-space";
      submit({
        name: _name25,
        position: [[_i, _i + 1, " "]]
      });
      console.log("3166 ".concat(log$1("push", _name25, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"\\n\"]]")))));
    } else if (!doNothingUntil && encodeChar$1(str, _i)) {
      console.log("".concat("\x1B[".concat(90, "m", "1 it's a raw character which should be encoded", "\x1B[", 39, "m")));
      var _newIssue = encodeChar$1(str, _i);
      submit(_newIssue, "raw");
      console.log("3174 ".concat(log$1("push to raw stage", "newIssue", _newIssue)));
    } else if (!doNothingUntil && charcode >= 888 && charcode <= 8591) {
      console.log("3176");
      if (charcode === 888 || charcode === 889 || charcode >= 896 && charcode <= 899 || charcode === 907 || charcode === 909 || charcode === 930 || charcode === 1328 || charcode === 1367 || charcode === 1368 || charcode === 1419 || charcode === 1419 || charcode === 1420 || charcode === 1424 || charcode >= 1480 && charcode <= 1487 || charcode >= 1515 && charcode <= 1519 || charcode >= 1525 && charcode <= 1535 || charcode === 1565 || charcode === 1806 || charcode === 1867 || charcode === 1868 || charcode >= 1970 && charcode <= 1983 || charcode >= 2043 && charcode <= 2047 || charcode === 2094 || charcode === 2095 || charcode === 2111 || charcode === 2140 || charcode === 2141 || charcode === 2143 || charcode >= 2155 && charcode <= 2207 || charcode === 2229 || charcode >= 2238 && charcode <= 2258 || charcode === 2436 || charcode === 2445 || charcode === 2446 || charcode === 2449 || charcode === 2450 || charcode === 2473 || charcode === 2481 || charcode === 2483 || charcode === 2484 || charcode === 2485 || charcode === 2490 || charcode === 2491 || charcode === 2501 || charcode === 2502 || charcode === 2505 || charcode === 2506 || charcode >= 2511 && charcode <= 2518 || charcode >= 2520 && charcode <= 2523 || charcode === 2526 || charcode >= 8384 && charcode <= 8399 || charcode >= 8433 && charcode <= 8447 || charcode === 8588 || charcode === 8589 || charcode === 8590 || charcode === 8591) {
        var _name26 = "bad-character-generic";
        submit({
          name: _name26,
          position: [[_i, _i + 1]]
        });
        console.log("3247 ".concat(log$1("push", _name26, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
      }
    }
    if (!doNothingUntil && logWhitespace.startAt !== null && str[_i].trim().length) {
      console.log("3261 ".concat("\x1B[".concat(90, "m", "inside whitespace chunks ending clauses", "\x1B[", 39, "m")));
      if (logTag.tagNameStartAt !== null && logAttr.attrStartAt === null && (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= _i) && (str[_i] === ">" || str[_i] === "/" && "<>".includes(str[stringLeftRight.right(str, _i)]))) {
        console.log("3270");
        var _name27 = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          _name27 = "tag-whitespace-closing-slash-and-bracket";
        }
        submit({
          name: _name27,
          position: [[logWhitespace.startAt, _i]]
        });
        console.log("3283 ".concat(log$1("push", _name27, "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
      }
    }
    if (!doNothingUntil && !str[_i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = _i;
      console.log("3296 ".concat(log$1("set", "logWhitespace.startAt", logWhitespace.startAt)));
    }
    if (!doNothingUntil && str[_i] === "\n" || str[_i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log("3305 ".concat(log$1("set", "logWhitespace.includesLinebreaks", logWhitespace.includesLinebreaks)));
      }
      logWhitespace.lastLinebreakAt = _i;
      console.log("3314 ".concat(log$1("set", "logWhitespace.lastLinebreakAt", logWhitespace.lastLinebreakAt)));
    }
    console.log("3322");
    if (!doNothingUntil && logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && !isLatinLetter(str[_i]) && str[_i] !== "<" && str[_i] !== "/") {
      console.log("3334 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = _i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, _i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      console.log("3339 ".concat(log$1("set", "logTag.tagNameEndAt", logTag.tagNameEndAt, "logTag.tagName", logTag.tagName, "logTag.recognised", logTag.recognised)));
      if (charIsQuote$1(str[_i]) || str[_i] === "=") {
        console.log("3352 stray quote clauses");
        var addSpace;
        var strayCharsEndAt = _i + 1;
        if (str[_i + 1].trim().length) {
          if (charIsQuote$1(str[_i + 1]) || str[_i + 1] === "=") {
            console.log("\x1B[".concat(36, "m", "3361 traverse forward", "\x1B[", 39, "m"));
            for (var _y4 = _i + 1; _y4 < len; _y4++) {
              console.log("\x1B[".concat(36, "m", "3364 str[".concat(_y4, "] = str[y]"), "\x1B[", 39, "m"));
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
          submit({
            name: "tag-stray-character",
            position: [[_i, strayCharsEndAt, " "]]
          });
          console.log("3386 ".concat(log$1("push", "tag-stray-character", "".concat("[[".concat(_i, ", ").concat(strayCharsEndAt, ", \" \"]]")))));
        } else {
          submit({
            name: "tag-stray-character",
            position: [[_i, strayCharsEndAt]]
          });
          console.log("3398 ".concat(log$1("push", "tag-stray-character", "".concat("[[".concat(_i, ", ").concat(strayCharsEndAt, "]]")))));
        }
      }
    }
    if (!doNothingUntil && logTag.tagStartAt !== null && logTag.tagNameStartAt === null && isLatinLetter(str[_i]) && logTag.tagStartAt < _i) {
      console.log("3416 within catching the start of the tag name clauses");
      logTag.tagNameStartAt = _i;
      console.log("3419 ".concat(log$1("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)));
      if (logTag.closing === null) {
        logTag.closing = false;
        console.log("3424 ".concat(log$1("set", "logTag.closing", logTag.closing)));
      }
      if (logTag.tagStartAt < _i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, _i]]
        });
        console.log("3434 ".concat(log$1("stage", "tag-space-after-opening-bracket", "".concat("[[".concat(logTag.tagStartAt + 1, ", ").concat(_i, "]]")))));
      }
    }
    if (!doNothingUntil && logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && isUppercaseLetter(str[_i]) && !str.slice(logTag.tagNameStartAt).toLowerCase().startsWith("doctype")) {
      submit({
        name: "tag-name-lowercase",
        position: [[_i, _i + 1, str[_i].toLowerCase()]]
      });
      console.log("3459 ".concat(log$1("push", "tag-name-lowercase", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(str[_i].toLowerCase(), null, 4), "]]")))));
    }
    if (!doNothingUntil && str[_i] === "/" && logTag.tagStartAt !== null && logTag.tagNameStartAt === null) {
      if (logTag.closing === null) {
        logTag.closing = true;
      }
    }
    if (!doNothingUntil && str[_i] === "<") {
      console.log("3490 ".concat("\x1B[".concat(90, "m", "within catching the beginning of a tag clauses", "\x1B[", 39, "m")));
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = _i;
        console.log("3496 ".concat(log$1("set", "logTag.tagStartAt", logTag.tagStartAt)));
      } else if (tagOnTheRight$1(str, _i)) {
        console.log("3502 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " new tag starts"));
        if (logTag.tagStartAt !== null && logTag.attributes.length && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
        })) {
          console.log("3518 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)");
          var lastNonWhitespaceOnLeft = stringLeftRight.left(str, _i);
          console.log("3532 ".concat(log$1("set", "lastNonWhitespaceOnLeft", lastNonWhitespaceOnLeft)));
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
            console.log("3545 ".concat(log$1("set", "logTag.tagEndAt", logTag.tagEndAt)));
          } else {
            submit({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, _i, ">"]]
            });
            console.log("3555 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(lastNonWhitespaceOnLeft + 1, ", ").concat(_i, ", \">\"]]")))));
          }
          if (rawIssueStaging.length) {
            console.log("3565 let's process all ".concat(rawIssueStaging.length, " raw character issues at staging"));
            rawIssueStaging.forEach(function (issueObj) {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                submit(issueObj);
                console.log("3572 ".concat(log$1("push", "issueObj", issueObj)));
              } else {
                console.log("3575 discarding ".concat(JSON.stringify(issueObj, null, 4)));
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          console.log("3589 ".concat(log$1("reset", "logTag & logAttr && rawIssueStaging")));
          logTag.tagStartAt = _i;
          console.log("3595 ".concat(log$1("set", "logTag.tagStartAt", logTag.tagStartAt)));
        } else {
          console.log("3598 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS");
          if (rawIssueStaging.length) {
            console.log("3603 ".concat(log$1("processing", "rawIssueStaging", rawIssueStaging)));
            console.log("3606 ".concat(log$1("log", "logTag.tagStartAt", logTag.tagStartAt)));
            console.log("3609 ".concat("\x1B[".concat(31, "m", JSON.stringify(logAttr, null, 4), "\x1B[", 39, "m")));
            rawIssueStaging.forEach(function (issueObj) {
              if (
              issueObj.position[0][0] < _i
              ) {
                  submit(issueObj);
                  console.log("3622 ".concat(log$1("push", "issueObj", issueObj)));
                } else {
                console.log("");
                console.log("3626 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
              }
            });
            console.log("3638 wipe rawIssueStaging");
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            console.log("3644 ".concat(log$1("wipe", "tagIssueStaging")));
            tagIssueStaging = [];
          }
        }
      }
    }
    if (!doNothingUntil && charcode === 62 && logTag.tagStartAt !== null && (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < _i)) {
      console.log("3659 within catching a closing bracket of a tag, >, clauses");
      if (tagIssueStaging.length) {
        tagIssueStaging.forEach(function (issue) {
          console.log("3664 submit \"".concat(issue, "\" from staging"));
          submit(issue);
        });
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        console.log("3672 ".concat(log$1("processing", "rawIssueStaging", rawIssueStaging)));
        console.log("".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " = ", JSON.stringify(logTag, null, 4)));
        rawIssueStaging.forEach(function (issueObj) {
          if (issueObj.position[0][0] < logTag.tagStartAt || logTag.attributes.some(function (attrObj) {
            i = _i;
            return attrObj.attrValueStartAt < issueObj.position[0][0] && attrObj.attrValueEndAt > issueObj.position[0][0];
          }) && !retObj.issues.some(function (existingIssue) {
            i = _i;
            return existingIssue.position[0][0] === issueObj.position[0][0] && existingIssue.position[0][1] === issueObj.position[0][1];
          })) {
            submit(issueObj);
            console.log("3698 ".concat(log$1("push", "issueObj", issueObj)));
          } else {
            console.log("");
            console.log("3702 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
          }
        });
        console.log("3714 wipe rawIssueStaging");
        rawIssueStaging = [];
      }
      if (logTag.tagName === "script") {
        doNothingUntil = true;
        doNothingUntilReason = "script tag";
        console.log("3724 ".concat(log$1("set", "doNothingUntil", doNothingUntil), ", then reset logTag and rawIssueStaging"));
      }
      resetLogTag();
      resetLogAttr();
      console.log("3735 ".concat(log$1("reset", "logTag & logAttr")));
    }
    if (doNothingUntil && doNothingUntilReason === "script tag" && str[_i] === "t" && str[_i - 1] === "p" && str[_i - 2] === "i" && str[_i - 3] === "r" && str[_i - 4] === "c" && str[_i - 5] === "s" && withinQuotes === null) {
      var _charOnTheRight = stringLeftRight.right(str, _i);
      var charOnTheLeft = stringLeftRight.left(str, _i - 5);
      console.log("3778 ".concat(log$1("set", "charOnTheRight", _charOnTheRight, "charOnTheLeft", charOnTheLeft, "str[charOnTheRight]", str[_charOnTheRight], "str[charOnTheLeft]", str[charOnTheLeft])));
      if (str[charOnTheLeft] === "/") {
        var charFurtherOnTheLeft = stringLeftRight.left(str, charOnTheLeft);
        console.log("3795 ".concat(log$1("set", "charFurtherOnTheLeft", charFurtherOnTheLeft, "str[charFurtherOnTheLeft]", str[charFurtherOnTheLeft])));
      } else if (str[charOnTheLeft] === "<") {
        console.log("3805 opening <script> tag!");
      }
      doNothingUntil = _charOnTheRight + 1;
      console.log("3809 ".concat(log$1("set", "doNothingUntil", doNothingUntil)));
    }
    if (!doNothingUntil && logWhitespace.startAt !== null && str[_i].trim().length) {
      resetLogWhitespace();
      console.log("3819 ".concat(log$1("reset", "logWhitespace")));
    }
    if (!str[_i + 1]) {
      console.log("3825");
      if (rawIssueStaging.length) {
        console.log("3828");
        if (logTag.tagStartAt !== null && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null;
        })) {
          console.log("3839");
          rawIssueStaging.forEach(function (issueObj) {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              submit(issueObj);
              console.log("3844 ".concat(log$1("push", "issueObj", issueObj)));
            } else {
              console.log("\n1519 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
            }
          });
          console.log("3859 wipe rawIssueStaging");
          rawIssueStaging = [];
          submit({
            name: "tag-missing-closing-bracket",
            position: [[logWhitespace.startAt ? logWhitespace.startAt : _i + 1, _i + 1, ">"]]
          });
          console.log("3874 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(logWhitespace.startAt ? logWhitespace.startAt : _i + 1, ", ").concat(_i + 1, ", \">\"]]")))));
        } else if (!retObj.issues.some(function (issueObj) {
          return issueObj.name === "file-missing-ending";
        })) {
          rawIssueStaging.forEach(function (issueObj) {
            submit(issueObj);
            console.log("3893 ".concat("\x1B[".concat(32, "m", "SUBMIT", "\x1B[", 39, "m"), " ", JSON.stringify(issueObj, null, 0)));
          });
          console.log("3901 wipe ".concat("\x1B[".concat(33, "m", "rawIssueStaging", "\x1B[", 39, "m")));
          rawIssueStaging = [];
        }
      }
    }
    var output = {
      logTag: true,
      logAttr: false,
      logEspTag: true,
      logWhitespace: true,
      logLineEndings: false,
      retObj: false,
      retObj_mini: true,
      tagIssueStaging: false,
      rawIssueStaging: false,
      withinQuotes: false
    };
    var retObj_mini = clone(retObj);
    Object.keys(retObj_mini.applicableRules).forEach(function (rule) {
      if (!retObj_mini.applicableRules[rule]) {
        delete retObj_mini.applicableRules[rule];
      }
    });
    console.log("".concat(Object.keys(output).some(function (key) {
      return output[key];
    }) ? "".concat("\x1B[".concat(31, "m", "\u2588 ", "\x1B[", 39, "m")) : "").concat(output.logTag && logTag.tagStartAt && logTag.tagStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " ", JSON.stringify(logTag, null, 4), "; ") : "").concat(output.logAttr && logAttr.attrStartAt && logAttr.attrStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logAttr", "\x1B[", 39, "m"), " ", JSON.stringify(logAttr, null, 4), "; ") : "").concat(output.logEspTag && logEspTag.headStartAt && logEspTag.headStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logEspTag", "\x1B[", 39, "m"), " ", JSON.stringify(logEspTag, null, 4), "; ") : "").concat(output.logWhitespace && logWhitespace.startAt && logWhitespace.startAt !== null ? "".concat("\x1B[".concat(33, "m", "logWhitespace", "\x1B[", 39, "m"), " ", JSON.stringify(logWhitespace, null, 0), "; ") : "").concat(output.logLineEndings ? "".concat("\x1B[".concat(33, "m", "logLineEndings", "\x1B[", 39, "m"), " ", JSON.stringify(logLineEndings, null, 0), "; ") : "").concat(output.retObj ? "".concat("\x1B[".concat(33, "m", "retObj", "\x1B[", 39, "m"), " ", JSON.stringify(retObj, null, 4), "; ") : "").concat(output.retObj_mini ? "".concat("\x1B[".concat(33, "m", "retObj_mini", "\x1B[", 39, "m"), " ", JSON.stringify(retObj_mini, null, 4), "; ") : "").concat(output.tagIssueStaging && tagIssueStaging.length ? "\n".concat("\x1B[".concat(33, "m", "tagIssueStaging", "\x1B[", 39, "m"), " ", JSON.stringify(tagIssueStaging, null, 4), "; ") : "").concat(output.rawIssueStaging && rawIssueStaging.length ? "\n".concat("\x1B[".concat(33, "m", "rawIssueStaging", "\x1B[", 39, "m"), " ", JSON.stringify(rawIssueStaging, null, 4), "; ") : "").concat(output.withinQuotes && withinQuotes ? "\n".concat("\x1B[".concat(33, "m", "withinQuotes", "\x1B[", 39, "m"), " ", JSON.stringify(withinQuotes, null, 4), "; ", "\x1B[".concat(33, "m", "withinQuotesEndAt", "\x1B[", 39, "m"), " = ").concat(withinQuotesEndAt, "; ") : ""));
    i = _i;
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret = _loop(i, len);
    if (_ret === "continue") continue;
  }
  if ((!opts.style || !opts.style.line_endings_CR_LF_CRLF) && (logLineEndings.cr.length && logLineEndings.lf.length || logLineEndings.lf.length && logLineEndings.crlf.length || logLineEndings.cr.length && logLineEndings.crlf.length)) {
    if (logLineEndings.cr.length > logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
      console.log("4071 CR clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (logLineEndings.lf.length > logLineEndings.crlf.length && logLineEndings.lf.length > logLineEndings.cr.length) {
      console.log("4093 LF clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (logLineEndings.crlf.length > logLineEndings.lf.length && logLineEndings.crlf.length > logLineEndings.cr.length) {
      console.log("4115 CRLF clearly prevalent");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (logLineEndings.crlf.length === logLineEndings.lf.length && logLineEndings.lf.length === logLineEndings.cr.length) {
      console.log("4137 same amount of each type of EOL");
      logLineEndings.crlf.forEach(function (eolEntryArr) {
        submit({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(function (eolEntryArr) {
        submit({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (logLineEndings.cr.length === logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
      console.log("4156 CR & CRLF are prevalent over LF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (logLineEndings.lf.length === logLineEndings.crlf.length && logLineEndings.lf.length > logLineEndings.cr.length || logLineEndings.cr.length === logLineEndings.lf.length && logLineEndings.cr.length > logLineEndings.crlf.length) {
      console.log("4181 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          submit({
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
  console.log("4241 \x1B[".concat(33, "m", "\u2588", "\x1B[", 39, "m\x1B[", 31, "m", "\u2588", "\x1B[", 39, "m\x1B[", 34, "m", "\u2588", "\x1B[", 39, "m ", log$1("log", "htmlEntityFixes", htmlEntityFixes)));
  if (isArr(htmlEntityFixes) && htmlEntityFixes.length) {
    retObj.issues = retObj.issues.filter(function (issueObj) {
      console.log("".concat("\x1B[".concat(36, "m", "3851 filtering issueObj=".concat(JSON.stringify(issueObj, null, 4)), "\x1B[", 39, "m")));
      return issueObj.name !== "bad-character-unencoded-ampersand" || htmlEntityFixes.every(function (entityFixObj) {
        return issueObj.position[0][0] !== entityFixObj.position[0][0];
      });
    }).concat(htmlEntityFixes ? htmlEntityFixes : []).filter(function (issueObj) {
      return !opts.rules || opts.rules[issueObj.name] !== false;
    });
  }
  if (!retObj.issues.some(function (issueObj) {
    return issueObj.name === "bad-character-unencoded-ampersand";
  })) {
    retObj.applicableRules["bad-character-unencoded-ampersand"] = false;
    console.log("4277 SET retObj.applicableRules[\"bad-character-unencoded-ampersand\"] = false");
  }
  console.log("4282 ".concat("\x1B[".concat(33, "m", "htmlEntityFixes", "\x1B[", 39, "m"), " = ", JSON.stringify(htmlEntityFixes, null, 4)));
  if (isArr(htmlEntityFixes) && htmlEntityFixes.length) {
    htmlEntityFixes.forEach(function (issueObj) {
      console.log("4291 ".concat("\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4)));
      if (!retObj.applicableRules[issueObj.name]) {
        retObj.applicableRules[issueObj.name] = true;
        console.log("4300 retObj.applicableRules[issueObj.name] = ".concat(retObj.applicableRules[issueObj.name]));
      }
    });
  }
  console.log("4330 BEFORE FIX:");
  console.log("4331 ".concat(log$1("log", "retObj.issues", retObj.issues)));
  retObj.fix = isArr(retObj.issues) && retObj.issues.length ? merge(retObj.issues.filter(function (issueObj) {
    console.log("4339 errorsRules[".concat(issueObj.name, "] = ").concat((errorsRules[issueObj.name], 4)));
    console.log("4346 errorsRules[issueObj.name].unfixable = ".concat(errorsRules[issueObj.name] ? errorsRules[issueObj.name].unfixable : errorsRules[issueObj.name]));
    return !errorsRules[issueObj.name] || !errorsRules[issueObj.name].unfixable;
  }).reduce(function (acc, obj) {
    return acc.concat(obj.position);
  }, [])) : null;
  console.log("4362 ".concat(log$1("log", "retObj.fix", retObj.fix)));
  return retObj;
}

exports.lint = lint;
exports.version = version;
