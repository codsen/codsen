/**
 * emlint
 * Non-parsing, email template-oriented linter
 * Version: 1.6.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fixBrokenEntities = _interopDefault(require('string-fix-broken-named-entities'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));
var merge = _interopDefault(require('ranges-merge'));
var stringLeftRight = require('string-left-right');
var he = _interopDefault(require('he'));

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
	"bad-character-em-quad": {
	description: "https://www.fileformat.info/info/unicode/char/2001/index.htm",
	excerpt: "bad character - em quad",
	scope: "all"
},
	"bad-character-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2001/index.htm",
	excerpt: "bad character - em space",
	scope: "all"
},
	"bad-character-en-quad": {
	description: "https://www.fileformat.info/info/unicode/char/2000/index.htm",
	excerpt: "bad character - en quad",
	scope: "all"
},
	"bad-character-en-space": {
	description: "https://www.fileformat.info/info/unicode/char/2000/index.htm",
	excerpt: "bad character - en space",
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
	"bad-character-figure-space": {
	description: "https://www.fileformat.info/info/unicode/char/2007/index.htm",
	excerpt: "bad character - figure space",
	scope: "all"
},
	"bad-character-form-feed": {
	description: "https://www.fileformat.info/info/unicode/char/000c/index.htm",
	excerpt: "bad character - form feed",
	scope: "all"
},
	"bad-character-four-per-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2005/index.htm",
	excerpt: "bad character - four-per-em space",
	scope: "all"
},
	"bad-character-generic": {
	description: "This character is invalid",
	excerpt: "bad character",
	scope: "all"
},
	"bad-character-grave-accent": {
	description: "https://www.fileformat.info/info/unicode/char/0060/index.htm",
	excerpt: "bad character - grave accent",
	scope: "html"
},
	"bad-character-hair-space": {
	description: "https://www.fileformat.info/info/unicode/char/200a/index.htm",
	excerpt: "bad character - hair space",
	scope: "all"
},
	"bad-character-high-octet-preset": {
	description: "http://www.fileformat.info/info/unicode/char/0081/index.htm",
	excerpt: "bad character - high octet preset",
	scope: "all"
},
	"bad-character-ideographic-space": {
	description: "https://www.fileformat.info/info/unicode/char/3000/index.htm",
	excerpt: "bad character - ideographic space",
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
	"bad-character-line-separator": {
	description: "https://www.fileformat.info/info/unicode/char/2028/index.htm",
	excerpt: "bad character - line separator",
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
	"bad-character-medium-mathematical-space": {
	description: "https://www.fileformat.info/info/unicode/char/205f/index.htm",
	excerpt: "bad character - medium mathematical space",
	scope: "all"
},
	"bad-character-message-waiting": {
	description: "http://www.fileformat.info/info/unicode/char/0095/index.htm",
	excerpt: "bad character - message waiting",
	scope: "all"
},
	"bad-character-narrow-no-break-space": {
	description: "https://www.fileformat.info/info/unicode/char/202f/index.htm",
	excerpt: "bad character - narrow no-break space",
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
	"bad-character-ogham-space-mark": {
	description: "https://www.fileformat.info/info/unicode/char/1680/index.htm",
	excerpt: "bad character - ogham space mark",
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
	"bad-character-paragraph-separator": {
	description: "https://www.fileformat.info/info/unicode/char/2029/index.htm",
	excerpt: "bad character - paragraph separator",
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
	"bad-character-punctuation-space": {
	description: "https://www.fileformat.info/info/unicode/char/2008/index.htm",
	excerpt: "bad character - punctuation space",
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
	"bad-character-six-per-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2005/index.htm",
	excerpt: "bad character - six-per-em space",
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
	"bad-character-thin-space": {
	description: "https://www.fileformat.info/info/unicode/char/2009/index.htm",
	excerpt: "bad character - thin space",
	scope: "all"
},
	"bad-character-three-per-em-space": {
	description: "https://www.fileformat.info/info/unicode/char/2004/index.htm",
	excerpt: "bad character - three-per-em space",
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
	sibling: "$",
	type: "closing"
};
var knownESPTags = {
	$: $,
	"%}": {
	sibling: [
		"{%",
		"{%-"
	],
	type: "closing"
},
	"*|": {
	sibling: "|*",
	type: "opening"
},
	"-%}": {
	sibling: [
		"{%-",
		"{%"
	],
	type: "closing"
},
	"{%": {
	sibling: [
		"%}",
		"-%}"
	],
	type: "opening"
},
	"{%-": {
	sibling: [
		"-%}",
		"%}"
	],
	type: "opening"
},
	"|*": {
	sibling: "*|",
	type: "closing"
}
};

var errorsRules = {
	"bad-cdata-tag-malformed": {
	description: "CDATA opening tag is malformed",
	excerpt: "malformed CDATA tag",
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
	"bad-named-html-entity-multiple-encoding": {
	description: "HTML named entity was encoded multiple times, causing repeated amp;",
	excerpt: "repeated amp; because of over-encoding",
	scope: "html"
},
	"esp-line-break-within-templating-tag": {
	description: "There should be no line breaks within ESP template tags",
	excerpt: "line break should be removed",
	scope: "all",
	unfixable: true
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
	"html-comment-redundant-dash": {
	description: "There are too many dashes in HTML comment",
	excerpt: "redundant dash",
	scope: "html"
},
	"html-comment-spaces": {
	description: "There should be no spaces between HTML comment characters",
	excerpt: "rogue spaces",
	scope: "html"
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
	"tag-duplicate-closing-slash": {
	description: "Tag's closing slash is repeated",
	excerpt: "repeated tag's closing slash",
	scope: "html"
},
	"tag-closing-left-slash": {
	description: "Tag's closing slash is wrong, it's left not right",
	excerpt: "should be right slash",
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

var version = "1.6.1";

var AMP = "#x26";
var Abreve = "#x102";
var Acy = "#x410";
var Afr = "#x1D504";
var Amacr = "#x100";
var And = "#x2A53";
var Aogon = "#x104";
var Aopf = "#x1D538";
var ApplyFunction = "#x2061";
var Ascr = "#x1D49C";
var Assign = "#x2254";
var Backslash = "#x2216";
var Barv = "#x2AE7";
var Barwed = "#x2306";
var Bcy = "#x411";
var Because = "#x2235";
var Bernoullis = "#x212C";
var Bfr = "#x1D505";
var Bopf = "#x1D539";
var Breve = "#x2D8";
var Bscr = "#x212C";
var Bumpeq = "#x224E";
var CHcy = "#x427";
var COPY = "#xA9";
var Cacute = "#x106";
var Cap = "#x22D2";
var CapitalDifferentialD = "#x2145";
var Cayleys = "#x212D";
var Ccaron = "#x10C";
var Ccirc = "#x108";
var Cconint = "#x2230";
var Cdot = "#x10A";
var Cedilla = "#xB8";
var CenterDot = "#xB7";
var Cfr = "#x212D";
var CircleDot = "#x2299";
var CircleMinus = "#x2296";
var CirclePlus = "#x2295";
var CircleTimes = "#x2297";
var ClockwiseContourIntegral = "#x2232";
var CloseCurlyDoubleQuote = "#x201D";
var CloseCurlyQuote = "#x2019";
var Colon = "#x2237";
var Colone = "#x2A74";
var Congruent = "#x2261";
var Conint = "#x222F";
var ContourIntegral = "#x222E";
var Copf = "#x2102";
var Coproduct = "#x2210";
var CounterClockwiseContourIntegral = "#x2233";
var Cross = "#x2A2F";
var Cscr = "#x1D49E";
var Cup = "#x22D3";
var CupCap = "#x224D";
var DD = "#x2145";
var DDotrahd = "#x2911";
var DJcy = "#x402";
var DScy = "#x405";
var DZcy = "#x40F";
var Darr = "#x21A1";
var Dashv = "#x2AE4";
var Dcaron = "#x10E";
var Dcy = "#x414";
var Del = "#x2207";
var Dfr = "#x1D507";
var DiacriticalAcute = "#xB4";
var DiacriticalDot = "#x2D9";
var DiacriticalDoubleAcute = "#x2DD";
var DiacriticalGrave = "#x60";
var DiacriticalTilde = "#x2DC";
var Diamond = "#x22C4";
var DifferentialD = "#x2146";
var Dopf = "#x1D53B";
var Dot = "#xA8";
var DotDot = "#x20DC";
var DotEqual = "#x2250";
var DoubleContourIntegral = "#x222F";
var DoubleDot = "#xA8";
var DoubleDownArrow = "#x21D3";
var DoubleLeftArrow = "#x21D0";
var DoubleLeftRightArrow = "#x21D4";
var DoubleLeftTee = "#x2AE4";
var DoubleLongLeftArrow = "#x27F8";
var DoubleLongLeftRightArrow = "#x27FA";
var DoubleLongRightArrow = "#x27F9";
var DoubleRightArrow = "#x21D2";
var DoubleRightTee = "#x22A8";
var DoubleUpArrow = "#x21D1";
var DoubleUpDownArrow = "#x21D5";
var DoubleVerticalBar = "#x2225";
var DownArrow = "#x2193";
var DownArrowBar = "#x2913";
var DownArrowUpArrow = "#x21F5";
var DownBreve = "#x311";
var DownLeftRightVector = "#x2950";
var DownLeftTeeVector = "#x295E";
var DownLeftVector = "#x21BD";
var DownLeftVectorBar = "#x2956";
var DownRightTeeVector = "#x295F";
var DownRightVector = "#x21C1";
var DownRightVectorBar = "#x2957";
var DownTee = "#x22A4";
var DownTeeArrow = "#x21A7";
var Downarrow = "#x21D3";
var Dscr = "#x1D49F";
var Dstrok = "#x110";
var ENG = "#x14A";
var Ecaron = "#x11A";
var Ecy = "#x42D";
var Edot = "#x116";
var Efr = "#x1D508";
var Element = "#x2208";
var Emacr = "#x112";
var EmptySmallSquare = "#x25FB";
var EmptyVerySmallSquare = "#x25AB";
var Eogon = "#x118";
var Eopf = "#x1D53C";
var Equal = "#x2A75";
var EqualTilde = "#x2242";
var Equilibrium = "#x21CC";
var Escr = "#x2130";
var Esim = "#x2A73";
var Exists = "#x2203";
var ExponentialE = "#x2147";
var Fcy = "#x424";
var Ffr = "#x1D509";
var FilledSmallSquare = "#x25FC";
var FilledVerySmallSquare = "#x25AA";
var Fopf = "#x1D53D";
var ForAll = "#x2200";
var Fouriertrf = "#x2131";
var Fscr = "#x2131";
var GJcy = "#x403";
var GT = "#x3E";
var Gammad = "#x3DC";
var Gbreve = "#x11E";
var Gcedil = "#x122";
var Gcirc = "#x11C";
var Gcy = "#x413";
var Gdot = "#x120";
var Gfr = "#x1D50A";
var Gg = "#x22D9";
var Gopf = "#x1D53E";
var GreaterEqual = "#x2265";
var GreaterEqualLess = "#x22DB";
var GreaterFullEqual = "#x2267";
var GreaterGreater = "#x2AA2";
var GreaterLess = "#x2277";
var GreaterSlantEqual = "#x2A7E";
var GreaterTilde = "#x2273";
var Gscr = "#x1D4A2";
var Gt = "#x226B";
var HARDcy = "#x42A";
var Hacek = "#x2C7";
var Hcirc = "#x124";
var Hfr = "#x210C";
var HilbertSpace = "#x210B";
var Hopf = "#x210D";
var HorizontalLine = "#x2500";
var Hscr = "#x210B";
var Hstrok = "#x126";
var HumpDownHump = "#x224E";
var HumpEqual = "#x224F";
var IEcy = "#x415";
var IJlig = "#x132";
var IOcy = "#x401";
var Icy = "#x418";
var Idot = "#x130";
var Ifr = "#x2111";
var Im = "#x2111";
var Imacr = "#x12A";
var ImaginaryI = "#x2148";
var Implies = "#x21D2";
var Int = "#x222C";
var Integral = "#x222B";
var Intersection = "#x22C2";
var InvisibleComma = "#x2063";
var InvisibleTimes = "#x2062";
var Iogon = "#x12E";
var Iopf = "#x1D540";
var Iscr = "#x2110";
var Itilde = "#x128";
var Iukcy = "#x406";
var Jcirc = "#x134";
var Jcy = "#x419";
var Jfr = "#x1D50D";
var Jopf = "#x1D541";
var Jscr = "#x1D4A5";
var Jsercy = "#x408";
var Jukcy = "#x404";
var KHcy = "#x425";
var KJcy = "#x40C";
var Kcedil = "#x136";
var Kcy = "#x41A";
var Kfr = "#x1D50E";
var Kopf = "#x1D542";
var Kscr = "#x1D4A6";
var LJcy = "#x409";
var LT = "#x3C";
var Lacute = "#x139";
var Lang = "#x27EA";
var Laplacetrf = "#x2112";
var Larr = "#x219E";
var Lcaron = "#x13D";
var Lcedil = "#x13B";
var Lcy = "#x41B";
var LeftAngleBracket = "#x27E8";
var LeftArrow = "#x2190";
var LeftArrowBar = "#x21E4";
var LeftArrowRightArrow = "#x21C6";
var LeftCeiling = "#x2308";
var LeftDoubleBracket = "#x27E6";
var LeftDownTeeVector = "#x2961";
var LeftDownVector = "#x21C3";
var LeftDownVectorBar = "#x2959";
var LeftFloor = "#x230A";
var LeftRightArrow = "#x2194";
var LeftRightVector = "#x294E";
var LeftTee = "#x22A3";
var LeftTeeArrow = "#x21A4";
var LeftTeeVector = "#x295A";
var LeftTriangle = "#x22B2";
var LeftTriangleBar = "#x29CF";
var LeftTriangleEqual = "#x22B4";
var LeftUpDownVector = "#x2951";
var LeftUpTeeVector = "#x2960";
var LeftUpVector = "#x21BF";
var LeftUpVectorBar = "#x2958";
var LeftVector = "#x21BC";
var LeftVectorBar = "#x2952";
var Leftarrow = "#x21D0";
var Leftrightarrow = "#x21D4";
var LessEqualGreater = "#x22DA";
var LessFullEqual = "#x2266";
var LessGreater = "#x2276";
var LessLess = "#x2AA1";
var LessSlantEqual = "#x2A7D";
var LessTilde = "#x2272";
var Lfr = "#x1D50F";
var Ll = "#x22D8";
var Lleftarrow = "#x21DA";
var Lmidot = "#x13F";
var LongLeftArrow = "#x27F5";
var LongLeftRightArrow = "#x27F7";
var LongRightArrow = "#x27F6";
var Longleftarrow = "#x27F8";
var Longleftrightarrow = "#x27FA";
var Longrightarrow = "#x27F9";
var Lopf = "#x1D543";
var LowerLeftArrow = "#x2199";
var LowerRightArrow = "#x2198";
var Lscr = "#x2112";
var Lsh = "#x21B0";
var Lstrok = "#x141";
var Lt = "#x226A";
var Mcy = "#x41C";
var MediumSpace = "#x205F";
var Mellintrf = "#x2133";
var Mfr = "#x1D510";
var MinusPlus = "#x2213";
var Mopf = "#x1D544";
var Mscr = "#x2133";
var NJcy = "#x40A";
var Nacute = "#x143";
var Ncaron = "#x147";
var Ncedil = "#x145";
var Ncy = "#x41D";
var NegativeMediumSpace = "#x200B";
var NegativeThickSpace = "#x200B";
var NegativeThinSpace = "#x200B";
var NegativeVeryThinSpace = "#x200B";
var NestedGreaterGreater = "#x226B";
var NestedLessLess = "#x226A";
var Nfr = "#x1D511";
var NoBreak = "#x2060";
var NonBreakingSpace = "#xA0";
var Nopf = "#x2115";
var Not = "#x2AEC";
var NotCongruent = "#x2262";
var NotCupCap = "#x226D";
var NotDoubleVerticalBar = "#x2226";
var NotElement = "#x2209";
var NotEqual = "#x2260";
var NotEqualTilde = "#x2242;&#x338";
var NotExists = "#x2204";
var NotGreater = "#x226F";
var NotGreaterEqual = "#x2271";
var NotGreaterFullEqual = "#x2267;&#x338";
var NotGreaterGreater = "#x226B;&#x338";
var NotGreaterLess = "#x2279";
var NotGreaterSlantEqual = "#x2A7E;&#x338";
var NotGreaterTilde = "#x2275";
var NotHumpDownHump = "#x224E;&#x338";
var NotHumpEqual = "#x224F;&#x338";
var NotLeftTriangle = "#x22EA";
var NotLeftTriangleBar = "#x29CF;&#x338";
var NotLeftTriangleEqual = "#x22EC";
var NotLess = "#x226E";
var NotLessEqual = "#x2270";
var NotLessGreater = "#x2278";
var NotLessLess = "#x226A;&#x338";
var NotLessSlantEqual = "#x2A7D;&#x338";
var NotLessTilde = "#x2274";
var NotNestedGreaterGreater = "#x2AA2;&#x338";
var NotNestedLessLess = "#x2AA1;&#x338";
var NotPrecedes = "#x2280";
var NotPrecedesEqual = "#x2AAF;&#x338";
var NotPrecedesSlantEqual = "#x22E0";
var NotReverseElement = "#x220C";
var NotRightTriangle = "#x22EB";
var NotRightTriangleBar = "#x29D0;&#x338";
var NotRightTriangleEqual = "#x22ED";
var NotSquareSubset = "#x228F;&#x338";
var NotSquareSubsetEqual = "#x22E2";
var NotSquareSuperset = "#x2290;&#x338";
var NotSquareSupersetEqual = "#x22E3";
var NotSubset = "#x2282;&#x20D2";
var NotSubsetEqual = "#x2288";
var NotSucceeds = "#x2281";
var NotSucceedsEqual = "#x2AB0;&#x338";
var NotSucceedsSlantEqual = "#x22E1";
var NotSucceedsTilde = "#x227F;&#x338";
var NotSuperset = "#x2283;&#x20D2";
var NotSupersetEqual = "#x2289";
var NotTilde = "#x2241";
var NotTildeEqual = "#x2244";
var NotTildeFullEqual = "#x2247";
var NotTildeTilde = "#x2249";
var NotVerticalBar = "#x2224";
var Nscr = "#x1D4A9";
var Ocy = "#x41E";
var Odblac = "#x150";
var Ofr = "#x1D512";
var Omacr = "#x14C";
var Oopf = "#x1D546";
var OpenCurlyDoubleQuote = "#x201C";
var OpenCurlyQuote = "#x2018";
var Or = "#x2A54";
var Oscr = "#x1D4AA";
var Otimes = "#x2A37";
var OverBar = "#x203E";
var OverBrace = "#x23DE";
var OverBracket = "#x23B4";
var OverParenthesis = "#x23DC";
var PartialD = "#x2202";
var Pcy = "#x41F";
var Pfr = "#x1D513";
var PlusMinus = "#xB1";
var Poincareplane = "#x210C";
var Popf = "#x2119";
var Pr = "#x2ABB";
var Precedes = "#x227A";
var PrecedesEqual = "#x2AAF";
var PrecedesSlantEqual = "#x227C";
var PrecedesTilde = "#x227E";
var Product = "#x220F";
var Proportion = "#x2237";
var Proportional = "#x221D";
var Pscr = "#x1D4AB";
var QUOT = "#x22";
var Qfr = "#x1D514";
var Qopf = "#x211A";
var Qscr = "#x1D4AC";
var RBarr = "#x2910";
var REG = "#xAE";
var Racute = "#x154";
var Rang = "#x27EB";
var Rarr = "#x21A0";
var Rarrtl = "#x2916";
var Rcaron = "#x158";
var Rcedil = "#x156";
var Rcy = "#x420";
var Re = "#x211C";
var ReverseElement = "#x220B";
var ReverseEquilibrium = "#x21CB";
var ReverseUpEquilibrium = "#x296F";
var Rfr = "#x211C";
var RightAngleBracket = "#x27E9";
var RightArrow = "#x2192";
var RightArrowBar = "#x21E5";
var RightArrowLeftArrow = "#x21C4";
var RightCeiling = "#x2309";
var RightDoubleBracket = "#x27E7";
var RightDownTeeVector = "#x295D";
var RightDownVector = "#x21C2";
var RightDownVectorBar = "#x2955";
var RightFloor = "#x230B";
var RightTee = "#x22A2";
var RightTeeArrow = "#x21A6";
var RightTeeVector = "#x295B";
var RightTriangle = "#x22B3";
var RightTriangleBar = "#x29D0";
var RightTriangleEqual = "#x22B5";
var RightUpDownVector = "#x294F";
var RightUpTeeVector = "#x295C";
var RightUpVector = "#x21BE";
var RightUpVectorBar = "#x2954";
var RightVector = "#x21C0";
var RightVectorBar = "#x2953";
var Rightarrow = "#x21D2";
var Ropf = "#x211D";
var RoundImplies = "#x2970";
var Rrightarrow = "#x21DB";
var Rscr = "#x211B";
var Rsh = "#x21B1";
var RuleDelayed = "#x29F4";
var SHCHcy = "#x429";
var SHcy = "#x428";
var SOFTcy = "#x42C";
var Sacute = "#x15A";
var Sc = "#x2ABC";
var Scedil = "#x15E";
var Scirc = "#x15C";
var Scy = "#x421";
var Sfr = "#x1D516";
var ShortDownArrow = "#x2193";
var ShortLeftArrow = "#x2190";
var ShortRightArrow = "#x2192";
var ShortUpArrow = "#x2191";
var SmallCircle = "#x2218";
var Sopf = "#x1D54A";
var Sqrt = "#x221A";
var Square = "#x25A1";
var SquareIntersection = "#x2293";
var SquareSubset = "#x228F";
var SquareSubsetEqual = "#x2291";
var SquareSuperset = "#x2290";
var SquareSupersetEqual = "#x2292";
var SquareUnion = "#x2294";
var Sscr = "#x1D4AE";
var Star = "#x22C6";
var Sub = "#x22D0";
var Subset = "#x22D0";
var SubsetEqual = "#x2286";
var Succeeds = "#x227B";
var SucceedsEqual = "#x2AB0";
var SucceedsSlantEqual = "#x227D";
var SucceedsTilde = "#x227F";
var SuchThat = "#x220B";
var Sum = "#x2211";
var Sup = "#x22D1";
var Superset = "#x2283";
var SupersetEqual = "#x2287";
var Supset = "#x22D1";
var TRADE = "#x2122";
var TSHcy = "#x40B";
var TScy = "#x426";
var Tab = "#x9";
var Tcaron = "#x164";
var Tcedil = "#x162";
var Tcy = "#x422";
var Tfr = "#x1D517";
var Therefore = "#x2234";
var ThickSpace = "#x205F;&#x200A";
var ThinSpace = "#x2009";
var Tilde = "#x223C";
var TildeEqual = "#x2243";
var TildeFullEqual = "#x2245";
var TildeTilde = "#x2248";
var Topf = "#x1D54B";
var TripleDot = "#x20DB";
var Tscr = "#x1D4AF";
var Tstrok = "#x166";
var Uarr = "#x219F";
var Uarrocir = "#x2949";
var Ubrcy = "#x40E";
var Ubreve = "#x16C";
var Ucy = "#x423";
var Udblac = "#x170";
var Ufr = "#x1D518";
var Umacr = "#x16A";
var UnderBrace = "#x23DF";
var UnderBracket = "#x23B5";
var UnderParenthesis = "#x23DD";
var Union = "#x22C3";
var UnionPlus = "#x228E";
var Uogon = "#x172";
var Uopf = "#x1D54C";
var UpArrow = "#x2191";
var UpArrowBar = "#x2912";
var UpArrowDownArrow = "#x21C5";
var UpDownArrow = "#x2195";
var UpEquilibrium = "#x296E";
var UpTee = "#x22A5";
var UpTeeArrow = "#x21A5";
var Uparrow = "#x21D1";
var Updownarrow = "#x21D5";
var UpperLeftArrow = "#x2196";
var UpperRightArrow = "#x2197";
var Upsi = "#x3D2";
var Uring = "#x16E";
var Uscr = "#x1D4B0";
var Utilde = "#x168";
var VDash = "#x22AB";
var Vbar = "#x2AEB";
var Vcy = "#x412";
var Vdash = "#x22A9";
var Vdashl = "#x2AE6";
var Vee = "#x22C1";
var Verbar = "#x2016";
var Vert = "#x2016";
var VerticalBar = "#x2223";
var VerticalSeparator = "#x2758";
var VerticalTilde = "#x2240";
var VeryThinSpace = "#x200A";
var Vfr = "#x1D519";
var Vopf = "#x1D54D";
var Vscr = "#x1D4B1";
var Vvdash = "#x22AA";
var Wcirc = "#x174";
var Wedge = "#x22C0";
var Wfr = "#x1D51A";
var Wopf = "#x1D54E";
var Wscr = "#x1D4B2";
var Xfr = "#x1D51B";
var Xopf = "#x1D54F";
var Xscr = "#x1D4B3";
var YAcy = "#x42F";
var YIcy = "#x407";
var YUcy = "#x42E";
var Ycirc = "#x176";
var Ycy = "#x42B";
var Yfr = "#x1D51C";
var Yopf = "#x1D550";
var Yscr = "#x1D4B4";
var ZHcy = "#x416";
var Zacute = "#x179";
var Zcaron = "#x17D";
var Zcy = "#x417";
var Zdot = "#x17B";
var ZeroWidthSpace = "#x200B";
var Zfr = "#x2128";
var Zopf = "#x2124";
var Zscr = "#x1D4B5";
var abreve = "#x103";
var ac = "#x223E";
var acE = "#x223E;&#x333";
var acd = "#x223F";
var acy = "#x430";
var af = "#x2061";
var afr = "#x1D51E";
var aleph = "#x2135";
var amacr = "#x101";
var amalg = "#x2A3F";
var andand = "#x2A55";
var andd = "#x2A5C";
var andslope = "#x2A58";
var andv = "#x2A5A";
var ange = "#x29A4";
var angle = "#x2220";
var angmsd = "#x2221";
var angmsdaa = "#x29A8";
var angmsdab = "#x29A9";
var angmsdac = "#x29AA";
var angmsdad = "#x29AB";
var angmsdae = "#x29AC";
var angmsdaf = "#x29AD";
var angmsdag = "#x29AE";
var angmsdah = "#x29AF";
var angrt = "#x221F";
var angrtvb = "#x22BE";
var angrtvbd = "#x299D";
var angsph = "#x2222";
var angst = "#xC5";
var angzarr = "#x237C";
var aogon = "#x105";
var aopf = "#x1D552";
var ap = "#x2248";
var apE = "#x2A70";
var apacir = "#x2A6F";
var ape = "#x224A";
var apid = "#x224B";
var approx = "#x2248";
var approxeq = "#x224A";
var ascr = "#x1D4B6";
var asympeq = "#x224D";
var awconint = "#x2233";
var awint = "#x2A11";
var bNot = "#x2AED";
var backcong = "#x224C";
var backepsilon = "#x3F6";
var backprime = "#x2035";
var backsim = "#x223D";
var backsimeq = "#x22CD";
var barvee = "#x22BD";
var barwed = "#x2305";
var barwedge = "#x2305";
var bbrk = "#x23B5";
var bbrktbrk = "#x23B6";
var bcong = "#x224C";
var bcy = "#x431";
var becaus = "#x2235";
var because = "#x2235";
var bemptyv = "#x29B0";
var bepsi = "#x3F6";
var bernou = "#x212C";
var beth = "#x2136";
var between = "#x226C";
var bfr = "#x1D51F";
var bigcap = "#x22C2";
var bigcirc = "#x25EF";
var bigcup = "#x22C3";
var bigodot = "#x2A00";
var bigoplus = "#x2A01";
var bigotimes = "#x2A02";
var bigsqcup = "#x2A06";
var bigstar = "#x2605";
var bigtriangledown = "#x25BD";
var bigtriangleup = "#x25B3";
var biguplus = "#x2A04";
var bigvee = "#x22C1";
var bigwedge = "#x22C0";
var bkarow = "#x290D";
var blacklozenge = "#x29EB";
var blacksquare = "#x25AA";
var blacktriangle = "#x25B4";
var blacktriangledown = "#x25BE";
var blacktriangleleft = "#x25C2";
var blacktriangleright = "#x25B8";
var blank = "#x2423";
var blk12 = "#x2592";
var blk14 = "#x2591";
var blk34 = "#x2593";
var block = "#x2588";
var bne = "=&#x20E5";
var bnequiv = "#x2261;&#x20E5";
var bnot = "#x2310";
var bopf = "#x1D553";
var bot = "#x22A5";
var bottom = "#x22A5";
var bowtie = "#x22C8";
var boxDL = "#x2557";
var boxDR = "#x2554";
var boxDl = "#x2556";
var boxDr = "#x2553";
var boxH = "#x2550";
var boxHD = "#x2566";
var boxHU = "#x2569";
var boxHd = "#x2564";
var boxHu = "#x2567";
var boxUL = "#x255D";
var boxUR = "#x255A";
var boxUl = "#x255C";
var boxUr = "#x2559";
var boxV = "#x2551";
var boxVH = "#x256C";
var boxVL = "#x2563";
var boxVR = "#x2560";
var boxVh = "#x256B";
var boxVl = "#x2562";
var boxVr = "#x255F";
var boxbox = "#x29C9";
var boxdL = "#x2555";
var boxdR = "#x2552";
var boxdl = "#x2510";
var boxdr = "#x250C";
var boxh = "#x2500";
var boxhD = "#x2565";
var boxhU = "#x2568";
var boxhd = "#x252C";
var boxhu = "#x2534";
var boxminus = "#x229F";
var boxplus = "#x229E";
var boxtimes = "#x22A0";
var boxuL = "#x255B";
var boxuR = "#x2558";
var boxul = "#x2518";
var boxur = "#x2514";
var boxv = "#x2502";
var boxvH = "#x256A";
var boxvL = "#x2561";
var boxvR = "#x255E";
var boxvh = "#x253C";
var boxvl = "#x2524";
var boxvr = "#x251C";
var bprime = "#x2035";
var breve = "#x2D8";
var bscr = "#x1D4B7";
var bsemi = "#x204F";
var bsim = "#x223D";
var bsime = "#x22CD";
var bsolb = "#x29C5";
var bsolhsub = "#x27C8";
var bullet = "#x2022";
var bump = "#x224E";
var bumpE = "#x2AAE";
var bumpe = "#x224F";
var bumpeq = "#x224F";
var cacute = "#x107";
var capand = "#x2A44";
var capbrcup = "#x2A49";
var capcap = "#x2A4B";
var capcup = "#x2A47";
var capdot = "#x2A40";
var caps = "#x2229;&#xFE00";
var caret = "#x2041";
var caron = "#x2C7";
var ccaps = "#x2A4D";
var ccaron = "#x10D";
var ccirc = "#x109";
var ccups = "#x2A4C";
var ccupssm = "#x2A50";
var cdot = "#x10B";
var cemptyv = "#x29B2";
var centerdot = "#xB7";
var cfr = "#x1D520";
var chcy = "#x447";
var check = "#x2713";
var checkmark = "#x2713";
var cir = "#x25CB";
var cirE = "#x29C3";
var circeq = "#x2257";
var circlearrowleft = "#x21BA";
var circlearrowright = "#x21BB";
var circledR = "#xAE";
var circledS = "#x24C8";
var circledast = "#x229B";
var circledcirc = "#x229A";
var circleddash = "#x229D";
var cire = "#x2257";
var cirfnint = "#x2A10";
var cirmid = "#x2AEF";
var cirscir = "#x29C2";
var clubsuit = "#x2663";
var colone = "#x2254";
var coloneq = "#x2254";
var comp = "#x2201";
var compfn = "#x2218";
var complement = "#x2201";
var complexes = "#x2102";
var congdot = "#x2A6D";
var conint = "#x222E";
var copf = "#x1D554";
var coprod = "#x2210";
var copysr = "#x2117";
var cross = "#x2717";
var cscr = "#x1D4B8";
var csub = "#x2ACF";
var csube = "#x2AD1";
var csup = "#x2AD0";
var csupe = "#x2AD2";
var ctdot = "#x22EF";
var cudarrl = "#x2938";
var cudarrr = "#x2935";
var cuepr = "#x22DE";
var cuesc = "#x22DF";
var cularr = "#x21B6";
var cularrp = "#x293D";
var cupbrcap = "#x2A48";
var cupcap = "#x2A46";
var cupcup = "#x2A4A";
var cupdot = "#x228D";
var cupor = "#x2A45";
var cups = "#x222A;&#xFE00";
var curarr = "#x21B7";
var curarrm = "#x293C";
var curlyeqprec = "#x22DE";
var curlyeqsucc = "#x22DF";
var curlyvee = "#x22CE";
var curlywedge = "#x22CF";
var curvearrowleft = "#x21B6";
var curvearrowright = "#x21B7";
var cuvee = "#x22CE";
var cuwed = "#x22CF";
var cwconint = "#x2232";
var cwint = "#x2231";
var cylcty = "#x232D";
var dHar = "#x2965";
var daleth = "#x2138";
var dash = "#x2010";
var dashv = "#x22A3";
var dbkarow = "#x290F";
var dblac = "#x2DD";
var dcaron = "#x10F";
var dcy = "#x434";
var dd = "#x2146";
var ddagger = "#x2021";
var ddarr = "#x21CA";
var ddotseq = "#x2A77";
var demptyv = "#x29B1";
var dfisht = "#x297F";
var dfr = "#x1D521";
var dharl = "#x21C3";
var dharr = "#x21C2";
var diam = "#x22C4";
var diamond = "#x22C4";
var diamondsuit = "#x2666";
var die = "#xA8";
var digamma = "#x3DD";
var disin = "#x22F2";
var div = "#xF7";
var divideontimes = "#x22C7";
var divonx = "#x22C7";
var djcy = "#x452";
var dlcorn = "#x231E";
var dlcrop = "#x230D";
var dopf = "#x1D555";
var dot = "#x2D9";
var doteq = "#x2250";
var doteqdot = "#x2251";
var dotminus = "#x2238";
var dotplus = "#x2214";
var dotsquare = "#x22A1";
var doublebarwedge = "#x2306";
var downarrow = "#x2193";
var downdownarrows = "#x21CA";
var downharpoonleft = "#x21C3";
var downharpoonright = "#x21C2";
var drbkarow = "#x2910";
var drcorn = "#x231F";
var drcrop = "#x230C";
var dscr = "#x1D4B9";
var dscy = "#x455";
var dsol = "#x29F6";
var dstrok = "#x111";
var dtdot = "#x22F1";
var dtri = "#x25BF";
var dtrif = "#x25BE";
var duarr = "#x21F5";
var duhar = "#x296F";
var dwangle = "#x29A6";
var dzcy = "#x45F";
var dzigrarr = "#x27FF";
var eDDot = "#x2A77";
var eDot = "#x2251";
var easter = "#x2A6E";
var ecaron = "#x11B";
var ecir = "#x2256";
var ecolon = "#x2255";
var ecy = "#x44D";
var edot = "#x117";
var ee = "#x2147";
var efDot = "#x2252";
var efr = "#x1D522";
var eg = "#x2A9A";
var egs = "#x2A96";
var egsdot = "#x2A98";
var el = "#x2A99";
var elinters = "#x23E7";
var ell = "#x2113";
var els = "#x2A95";
var elsdot = "#x2A97";
var emacr = "#x113";
var emptyset = "#x2205";
var emptyv = "#x2205";
var emsp13 = "#x2004";
var emsp14 = "#x2005";
var eng = "#x14B";
var eogon = "#x119";
var eopf = "#x1D556";
var epar = "#x22D5";
var eparsl = "#x29E3";
var eplus = "#x2A71";
var epsi = "#x3B5";
var epsiv = "#x3F5";
var eqcirc = "#x2256";
var eqcolon = "#x2255";
var eqsim = "#x2242";
var eqslantgtr = "#x2A96";
var eqslantless = "#x2A95";
var equest = "#x225F";
var equivDD = "#x2A78";
var eqvparsl = "#x29E5";
var erDot = "#x2253";
var erarr = "#x2971";
var escr = "#x212F";
var esdot = "#x2250";
var esim = "#x2242";
var expectation = "#x2130";
var exponentiale = "#x2147";
var fallingdotseq = "#x2252";
var fcy = "#x444";
var female = "#x2640";
var ffilig = "#xFB03";
var fflig = "#xFB00";
var ffllig = "#xFB04";
var ffr = "#x1D523";
var filig = "#xFB01";
var flat = "#x266D";
var fllig = "#xFB02";
var fltns = "#x25B1";
var fopf = "#x1D557";
var fork = "#x22D4";
var forkv = "#x2AD9";
var fpartint = "#x2A0D";
var frac13 = "#x2153";
var frac15 = "#x2155";
var frac16 = "#x2159";
var frac18 = "#x215B";
var frac23 = "#x2154";
var frac25 = "#x2156";
var frac35 = "#x2157";
var frac38 = "#x215C";
var frac45 = "#x2158";
var frac56 = "#x215A";
var frac58 = "#x215D";
var frac78 = "#x215E";
var frown = "#x2322";
var fscr = "#x1D4BB";
var gE = "#x2267";
var gEl = "#x2A8C";
var gacute = "#x1F5";
var gammad = "#x3DD";
var gap = "#x2A86";
var gbreve = "#x11F";
var gcirc = "#x11D";
var gcy = "#x433";
var gdot = "#x121";
var gel = "#x22DB";
var geq = "#x2265";
var geqq = "#x2267";
var geqslant = "#x2A7E";
var ges = "#x2A7E";
var gescc = "#x2AA9";
var gesdot = "#x2A80";
var gesdoto = "#x2A82";
var gesdotol = "#x2A84";
var gesl = "#x22DB;&#xFE00";
var gesles = "#x2A94";
var gfr = "#x1D524";
var gg = "#x226B";
var ggg = "#x22D9";
var gimel = "#x2137";
var gjcy = "#x453";
var gl = "#x2277";
var glE = "#x2A92";
var gla = "#x2AA5";
var glj = "#x2AA4";
var gnE = "#x2269";
var gnap = "#x2A8A";
var gnapprox = "#x2A8A";
var gne = "#x2A88";
var gneq = "#x2A88";
var gneqq = "#x2269";
var gnsim = "#x22E7";
var gopf = "#x1D558";
var grave = "#x60";
var gscr = "#x210A";
var gsim = "#x2273";
var gsime = "#x2A8E";
var gsiml = "#x2A90";
var gtcc = "#x2AA7";
var gtcir = "#x2A7A";
var gtdot = "#x22D7";
var gtlPar = "#x2995";
var gtquest = "#x2A7C";
var gtrapprox = "#x2A86";
var gtrarr = "#x2978";
var gtrdot = "#x22D7";
var gtreqless = "#x22DB";
var gtreqqless = "#x2A8C";
var gtrless = "#x2277";
var gtrsim = "#x2273";
var gvertneqq = "#x2269;&#xFE00";
var gvnE = "#x2269;&#xFE00";
var hairsp = "#x200A";
var half = "#xBD";
var hamilt = "#x210B";
var hardcy = "#x44A";
var harrcir = "#x2948";
var harrw = "#x21AD";
var hbar = "#x210F";
var hcirc = "#x125";
var heartsuit = "#x2665";
var hercon = "#x22B9";
var hfr = "#x1D525";
var hksearow = "#x2925";
var hkswarow = "#x2926";
var hoarr = "#x21FF";
var homtht = "#x223B";
var hookleftarrow = "#x21A9";
var hookrightarrow = "#x21AA";
var hopf = "#x1D559";
var horbar = "#x2015";
var hscr = "#x1D4BD";
var hslash = "#x210F";
var hstrok = "#x127";
var hybull = "#x2043";
var hyphen = "#x2010";
var ic = "#x2063";
var icy = "#x438";
var iecy = "#x435";
var iff = "#x21D4";
var ifr = "#x1D526";
var ii = "#x2148";
var iiiint = "#x2A0C";
var iiint = "#x222D";
var iinfin = "#x29DC";
var iiota = "#x2129";
var ijlig = "#x133";
var imacr = "#x12B";
var imagline = "#x2110";
var imagpart = "#x2111";
var imath = "#x131";
var imof = "#x22B7";
var imped = "#x1B5";
var incare = "#x2105";
var infintie = "#x29DD";
var inodot = "#x131";
var intcal = "#x22BA";
var integers = "#x2124";
var intercal = "#x22BA";
var intlarhk = "#x2A17";
var intprod = "#x2A3C";
var iocy = "#x451";
var iogon = "#x12F";
var iopf = "#x1D55A";
var iprod = "#x2A3C";
var iscr = "#x1D4BE";
var isinE = "#x22F9";
var isindot = "#x22F5";
var isins = "#x22F4";
var isinsv = "#x22F3";
var isinv = "#x2208";
var it = "#x2062";
var itilde = "#x129";
var iukcy = "#x456";
var jcirc = "#x135";
var jcy = "#x439";
var jfr = "#x1D527";
var jmath = "#x237";
var jopf = "#x1D55B";
var jscr = "#x1D4BF";
var jsercy = "#x458";
var jukcy = "#x454";
var kappav = "#x3F0";
var kcedil = "#x137";
var kcy = "#x43A";
var kfr = "#x1D528";
var kgreen = "#x138";
var khcy = "#x445";
var kjcy = "#x45C";
var kopf = "#x1D55C";
var kscr = "#x1D4C0";
var lAarr = "#x21DA";
var lAtail = "#x291B";
var lBarr = "#x290E";
var lE = "#x2266";
var lEg = "#x2A8B";
var lHar = "#x2962";
var lacute = "#x13A";
var laemptyv = "#x29B4";
var lagran = "#x2112";
var langd = "#x2991";
var langle = "#x27E8";
var lap = "#x2A85";
var larrb = "#x21E4";
var larrbfs = "#x291F";
var larrfs = "#x291D";
var larrhk = "#x21A9";
var larrlp = "#x21AB";
var larrpl = "#x2939";
var larrsim = "#x2973";
var larrtl = "#x21A2";
var lat = "#x2AAB";
var latail = "#x2919";
var late = "#x2AAD";
var lates = "#x2AAD;&#xFE00";
var lbarr = "#x290C";
var lbbrk = "#x2772";
var lbrace = "{";
var lbrack = "[";
var lbrke = "#x298B";
var lbrksld = "#x298F";
var lbrkslu = "#x298D";
var lcaron = "#x13E";
var lcedil = "#x13C";
var lcub = "{";
var lcy = "#x43B";
var ldca = "#x2936";
var ldquor = "#x201E";
var ldrdhar = "#x2967";
var ldrushar = "#x294B";
var ldsh = "#x21B2";
var leftarrow = "#x2190";
var leftarrowtail = "#x21A2";
var leftharpoondown = "#x21BD";
var leftharpoonup = "#x21BC";
var leftleftarrows = "#x21C7";
var leftrightarrow = "#x2194";
var leftrightarrows = "#x21C6";
var leftrightharpoons = "#x21CB";
var leftrightsquigarrow = "#x21AD";
var leftthreetimes = "#x22CB";
var leg = "#x22DA";
var leq = "#x2264";
var leqq = "#x2266";
var leqslant = "#x2A7D";
var les = "#x2A7D";
var lescc = "#x2AA8";
var lesdot = "#x2A7F";
var lesdoto = "#x2A81";
var lesdotor = "#x2A83";
var lesg = "#x22DA;&#xFE00";
var lesges = "#x2A93";
var lessapprox = "#x2A85";
var lessdot = "#x22D6";
var lesseqgtr = "#x22DA";
var lesseqqgtr = "#x2A8B";
var lessgtr = "#x2276";
var lesssim = "#x2272";
var lfisht = "#x297C";
var lfr = "#x1D529";
var lg = "#x2276";
var lgE = "#x2A91";
var lhard = "#x21BD";
var lharu = "#x21BC";
var lharul = "#x296A";
var lhblk = "#x2584";
var ljcy = "#x459";
var ll = "#x226A";
var llarr = "#x21C7";
var llcorner = "#x231E";
var llhard = "#x296B";
var lltri = "#x25FA";
var lmidot = "#x140";
var lmoust = "#x23B0";
var lmoustache = "#x23B0";
var lnE = "#x2268";
var lnap = "#x2A89";
var lnapprox = "#x2A89";
var lne = "#x2A87";
var lneq = "#x2A87";
var lneqq = "#x2268";
var lnsim = "#x22E6";
var loang = "#x27EC";
var loarr = "#x21FD";
var lobrk = "#x27E6";
var longleftarrow = "#x27F5";
var longleftrightarrow = "#x27F7";
var longmapsto = "#x27FC";
var longrightarrow = "#x27F6";
var looparrowleft = "#x21AB";
var looparrowright = "#x21AC";
var lopar = "#x2985";
var lopf = "#x1D55D";
var loplus = "#x2A2D";
var lotimes = "#x2A34";
var lozenge = "#x25CA";
var lozf = "#x29EB";
var lparlt = "#x2993";
var lrarr = "#x21C6";
var lrcorner = "#x231F";
var lrhar = "#x21CB";
var lrhard = "#x296D";
var lrtri = "#x22BF";
var lscr = "#x1D4C1";
var lsh = "#x21B0";
var lsim = "#x2272";
var lsime = "#x2A8D";
var lsimg = "#x2A8F";
var lsquor = "#x201A";
var lstrok = "#x142";
var ltcc = "#x2AA6";
var ltcir = "#x2A79";
var ltdot = "#x22D6";
var lthree = "#x22CB";
var ltimes = "#x22C9";
var ltlarr = "#x2976";
var ltquest = "#x2A7B";
var ltrPar = "#x2996";
var ltri = "#x25C3";
var ltrie = "#x22B4";
var ltrif = "#x25C2";
var lurdshar = "#x294A";
var luruhar = "#x2966";
var lvertneqq = "#x2268;&#xFE00";
var lvnE = "#x2268;&#xFE00";
var mDDot = "#x223A";
var male = "#x2642";
var malt = "#x2720";
var maltese = "#x2720";
var map = "#x21A6";
var mapsto = "#x21A6";
var mapstodown = "#x21A7";
var mapstoleft = "#x21A4";
var mapstoup = "#x21A5";
var marker = "#x25AE";
var mcomma = "#x2A29";
var mcy = "#x43C";
var measuredangle = "#x2221";
var mfr = "#x1D52A";
var mho = "#x2127";
var mid = "#x2223";
var midcir = "#x2AF0";
var minusb = "#x229F";
var minusd = "#x2238";
var minusdu = "#x2A2A";
var mlcp = "#x2ADB";
var mldr = "hellip";
var mnplus = "#x2213";
var models = "#x22A7";
var mopf = "#x1D55E";
var mp = "#x2213";
var mscr = "#x1D4C2";
var mstpos = "#x223E";
var multimap = "#x22B8";
var mumap = "#x22B8";
var nGg = "#x22D9;&#x338";
var nGt = "#x226B;&#x20D2";
var nGtv = "#x226B;&#x338";
var nLeftarrow = "#x21CD";
var nLeftrightarrow = "#x21CE";
var nLl = "#x22D8;&#x338";
var nLt = "#x226A;&#x20D2";
var nLtv = "#x226A;&#x338";
var nRightarrow = "#x21CF";
var nVDash = "#x22AF";
var nVdash = "#x22AE";
var nacute = "#x144";
var nang = "#x2220;&#x20D2";
var nap = "#x2249";
var napE = "#x2A70;&#x338";
var napid = "#x224B;&#x338";
var napos = "#x149";
var napprox = "#x2249";
var natur = "#x266E";
var natural = "#x266E";
var naturals = "#x2115";
var nbump = "#x224E;&#x338";
var nbumpe = "#x224F;&#x338";
var ncap = "#x2A43";
var ncaron = "#x148";
var ncedil = "#x146";
var ncong = "#x2247";
var ncongdot = "#x2A6D;&#x338";
var ncup = "#x2A42";
var ncy = "#x43D";
var neArr = "#x21D7";
var nearhk = "#x2924";
var nearr = "#x2197";
var nearrow = "#x2197";
var nedot = "#x2250;&#x338";
var nequiv = "#x2262";
var nesear = "#x2928";
var nesim = "#x2242;&#x338";
var nexist = "#x2204";
var nexists = "#x2204";
var nfr = "#x1D52B";
var ngE = "#x2267;&#x338";
var nge = "#x2271";
var ngeq = "#x2271";
var ngeqq = "#x2267;&#x338";
var ngeqslant = "#x2A7E;&#x338";
var nges = "#x2A7E;&#x338";
var ngsim = "#x2275";
var ngt = "#x226F";
var ngtr = "#x226F";
var nhArr = "#x21CE";
var nharr = "#x21AE";
var nhpar = "#x2AF2";
var nis = "#x22FC";
var nisd = "#x22FA";
var niv = "#x220B";
var njcy = "#x45A";
var nlArr = "#x21CD";
var nlE = "#x2266;&#x338";
var nlarr = "#x219A";
var nldr = "#x2025";
var nle = "#x2270";
var nleftarrow = "#x219A";
var nleftrightarrow = "#x21AE";
var nleq = "#x2270";
var nleqq = "#x2266;&#x338";
var nleqslant = "#x2A7D;&#x338";
var nles = "#x2A7D;&#x338";
var nless = "#x226E";
var nlsim = "#x2274";
var nlt = "#x226E";
var nltri = "#x22EA";
var nltrie = "#x22EC";
var nmid = "#x2224";
var nopf = "#x1D55F";
var notinE = "#x22F9;&#x338";
var notindot = "#x22F5;&#x338";
var notinva = "#x2209";
var notinvb = "#x22F7";
var notinvc = "#x22F6";
var notni = "#x220C";
var notniva = "#x220C";
var notnivb = "#x22FE";
var notnivc = "#x22FD";
var npar = "#x2226";
var nparallel = "#x2226";
var nparsl = "#x2AFD;&#x20E5";
var npart = "#x2202;&#x338";
var npolint = "#x2A14";
var npr = "#x2280";
var nprcue = "#x22E0";
var npre = "#x2AAF;&#x338";
var nprec = "#x2280";
var npreceq = "#x2AAF;&#x338";
var nrArr = "#x21CF";
var nrarr = "#x219B";
var nrarrc = "#x2933;&#x338";
var nrarrw = "#x219D;&#x338";
var nrightarrow = "#x219B";
var nrtri = "#x22EB";
var nrtrie = "#x22ED";
var nsc = "#x2281";
var nsccue = "#x22E1";
var nsce = "#x2AB0;&#x338";
var nscr = "#x1D4C3";
var nshortmid = "#x2224";
var nshortparallel = "#x2226";
var nsim = "#x2241";
var nsime = "#x2244";
var nsimeq = "#x2244";
var nsmid = "#x2224";
var nspar = "#x2226";
var nsqsube = "#x22E2";
var nsqsupe = "#x22E3";
var nsubE = "#x2AC5;&#x338";
var nsube = "#x2288";
var nsubset = "#x2282;&#x20D2";
var nsubseteq = "#x2288";
var nsubseteqq = "#x2AC5;&#x338";
var nsucc = "#x2281";
var nsucceq = "#x2AB0;&#x338";
var nsup = "#x2285";
var nsupE = "#x2AC6;&#x338";
var nsupe = "#x2289";
var nsupset = "#x2283;&#x20D2";
var nsupseteq = "#x2289";
var nsupseteqq = "#x2AC6;&#x338";
var ntgl = "#x2279";
var ntlg = "#x2278";
var ntriangleleft = "#x22EA";
var ntrianglelefteq = "#x22EC";
var ntriangleright = "#x22EB";
var ntrianglerighteq = "#x22ED";
var numero = "#x2116";
var numsp = "#x2007";
var nvDash = "#x22AD";
var nvHarr = "#x2904";
var nvap = "#x224D;&#x20D2";
var nvdash = "#x22AC";
var nvge = "#x2265;&#x20D2";
var nvgt = "#x3E;&#x20D2";
var nvinfin = "#x29DE";
var nvlArr = "#x2902";
var nvle = "#x2264;&#x20D2";
var nvlt = "#x3C;&#x20D2";
var nvltrie = "#x22B4;&#x20D2";
var nvrArr = "#x2903";
var nvrtrie = "#x22B5;&#x20D2";
var nvsim = "#x223C;&#x20D2";
var nwArr = "#x21D6";
var nwarhk = "#x2923";
var nwarr = "#x2196";
var nwarrow = "#x2196";
var nwnear = "#x2927";
var oS = "#x24C8";
var oast = "#x229B";
var ocir = "#x229A";
var ocy = "#x43E";
var odash = "#x229D";
var odblac = "#x151";
var odiv = "#x2A38";
var odot = "#x2299";
var odsold = "#x29BC";
var ofcir = "#x29BF";
var ofr = "#x1D52C";
var ogon = "#x2DB";
var ogt = "#x29C1";
var ohbar = "#x29B5";
var ohm = "#x3A9";
var oint = "#x222E";
var olarr = "#x21BA";
var olcir = "#x29BE";
var olcross = "#x29BB";
var olt = "#x29C0";
var omacr = "#x14D";
var omid = "#x29B6";
var ominus = "#x2296";
var oopf = "#x1D560";
var opar = "#x29B7";
var operp = "#x29B9";
var orarr = "#x21BB";
var ord = "#x2A5D";
var order = "#x2134";
var orderof = "#x2134";
var origof = "#x22B6";
var oror = "#x2A56";
var orslope = "#x2A57";
var orv = "#x2A5B";
var oscr = "#x2134";
var osol = "#x2298";
var otimesas = "#x2A36";
var ovbar = "#x233D";
var par = "#x2225";
var parallel = "#x2225";
var parsim = "#x2AF3";
var parsl = "#x2AFD";
var pcy = "#x43F";
var pertenk = "#x2031";
var pfr = "#x1D52D";
var phiv = "#x3D5";
var phmmat = "#x2133";
var phone = "#x260E";
var pitchfork = "#x22D4";
var planck = "#x210F";
var planckh = "#x210E";
var plankv = "#x210F";
var plusacir = "#x2A23";
var plusb = "#x229E";
var pluscir = "#x2A22";
var plusdo = "#x2214";
var plusdu = "#x2A25";
var pluse = "#x2A72";
var plussim = "#x2A26";
var plustwo = "#x2A27";
var pm = "#xB1";
var pointint = "#x2A15";
var popf = "#x1D561";
var pr = "#x227A";
var prE = "#x2AB3";
var prap = "#x2AB7";
var prcue = "#x227C";
var pre = "#x2AAF";
var prec = "#x227A";
var precapprox = "#x2AB7";
var preccurlyeq = "#x227C";
var preceq = "#x2AAF";
var precnapprox = "#x2AB9";
var precneqq = "#x2AB5";
var precnsim = "#x22E8";
var precsim = "#x227E";
var primes = "#x2119";
var prnE = "#x2AB5";
var prnap = "#x2AB9";
var prnsim = "#x22E8";
var profalar = "#x232E";
var profline = "#x2312";
var profsurf = "#x2313";
var propto = "#x221D";
var prsim = "#x227E";
var prurel = "#x22B0";
var pscr = "#x1D4C5";
var puncsp = "#x2008";
var qfr = "#x1D52E";
var qint = "#x2A0C";
var qopf = "#x1D562";
var qprime = "#x2057";
var qscr = "#x1D4C6";
var quaternions = "#x210D";
var quatint = "#x2A16";
var questeq = "#x225F";
var rAarr = "#x21DB";
var rAtail = "#x291C";
var rBarr = "#x290F";
var rHar = "#x2964";
var race = "#x223D;&#x331";
var racute = "#x155";
var raemptyv = "#x29B3";
var rangd = "#x2992";
var range = "#x29A5";
var rangle = "#x27E9";
var rarrap = "#x2975";
var rarrb = "#x21E5";
var rarrbfs = "#x2920";
var rarrc = "#x2933";
var rarrfs = "#x291E";
var rarrhk = "#x21AA";
var rarrlp = "#x21AC";
var rarrpl = "#x2945";
var rarrsim = "#x2974";
var rarrtl = "#x21A3";
var rarrw = "#x219D";
var ratail = "#x291A";
var ratio = "#x2236";
var rationals = "#x211A";
var rbarr = "#x290D";
var rbbrk = "#x2773";
var rbrke = "#x298C";
var rbrksld = "#x298E";
var rbrkslu = "#x2990";
var rcaron = "#x159";
var rcedil = "#x157";
var rcy = "#x440";
var rdca = "#x2937";
var rdldhar = "#x2969";
var rdquor = "#x201D";
var rdsh = "#x21B3";
var realine = "#x211B";
var realpart = "#x211C";
var reals = "#x211D";
var rect = "#x25AD";
var rfisht = "#x297D";
var rfr = "#x1D52F";
var rhard = "#x21C1";
var rharu = "#x21C0";
var rharul = "#x296C";
var rhov = "#x3F1";
var rightarrow = "#x2192";
var rightarrowtail = "#x21A3";
var rightharpoondown = "#x21C1";
var rightharpoonup = "#x21C0";
var rightleftarrows = "#x21C4";
var rightleftharpoons = "#x21CC";
var rightrightarrows = "#x21C9";
var rightsquigarrow = "#x219D";
var rightthreetimes = "#x22CC";
var ring = "#x2DA";
var risingdotseq = "#x2253";
var rlarr = "#x21C4";
var rlhar = "#x21CC";
var rmoust = "#x23B1";
var rmoustache = "#x23B1";
var rnmid = "#x2AEE";
var roang = "#x27ED";
var roarr = "#x21FE";
var robrk = "#x27E7";
var ropar = "#x2986";
var ropf = "#x1D563";
var roplus = "#x2A2E";
var rotimes = "#x2A35";
var rpargt = "#x2994";
var rppolint = "#x2A12";
var rrarr = "#x21C9";
var rscr = "#x1D4C7";
var rsh = "#x21B1";
var rsquor = "#x2019";
var rthree = "#x22CC";
var rtimes = "#x22CA";
var rtri = "#x25B9";
var rtrie = "#x22B5";
var rtrif = "#x25B8";
var rtriltri = "#x29CE";
var ruluhar = "#x2968";
var rx = "#x211E";
var sacute = "#x15B";
var sc = "#x227B";
var scE = "#x2AB4";
var scap = "#x2AB8";
var sccue = "#x227D";
var sce = "#x2AB0";
var scedil = "#x15F";
var scirc = "#x15D";
var scnE = "#x2AB6";
var scnap = "#x2ABA";
var scnsim = "#x22E9";
var scpolint = "#x2A13";
var scsim = "#x227F";
var scy = "#x441";
var sdotb = "#x22A1";
var sdote = "#x2A66";
var seArr = "#x21D8";
var searhk = "#x2925";
var searr = "#x2198";
var searrow = "#x2198";
var seswar = "#x2929";
var setminus = "#x2216";
var setmn = "#x2216";
var sext = "#x2736";
var sfr = "#x1D530";
var sfrown = "#x2322";
var sharp = "#x266F";
var shchcy = "#x449";
var shcy = "#x448";
var shortmid = "#x2223";
var shortparallel = "#x2225";
var sigmav = "#x3C2";
var simdot = "#x2A6A";
var sime = "#x2243";
var simeq = "#x2243";
var simg = "#x2A9E";
var simgE = "#x2AA0";
var siml = "#x2A9D";
var simlE = "#x2A9F";
var simne = "#x2246";
var simplus = "#x2A24";
var simrarr = "#x2972";
var slarr = "#x2190";
var smallsetminus = "#x2216";
var smashp = "#x2A33";
var smeparsl = "#x29E4";
var smid = "#x2223";
var smile = "#x2323";
var smt = "#x2AAA";
var smte = "#x2AAC";
var smtes = "#x2AAC;&#xFE00";
var softcy = "#x44C";
var solb = "#x29C4";
var solbar = "#x233F";
var sopf = "#x1D564";
var spadesuit = "#x2660";
var spar = "#x2225";
var sqcap = "#x2293";
var sqcaps = "#x2293;&#xFE00";
var sqcup = "#x2294";
var sqcups = "#x2294;&#xFE00";
var sqsub = "#x228F";
var sqsube = "#x2291";
var sqsubset = "#x228F";
var sqsubseteq = "#x2291";
var sqsup = "#x2290";
var sqsupe = "#x2292";
var sqsupset = "#x2290";
var sqsupseteq = "#x2292";
var squ = "#x25A1";
var square = "#x25A1";
var squarf = "#x25AA";
var squf = "#x25AA";
var srarr = "#x2192";
var sscr = "#x1D4C8";
var ssetmn = "#x2216";
var ssmile = "#x2323";
var sstarf = "#x22C6";
var star = "#x2606";
var starf = "#x2605";
var straightepsilon = "#x3F5";
var straightphi = "#x3D5";
var strns = "#xAF";
var subE = "#x2AC5";
var subdot = "#x2ABD";
var subedot = "#x2AC3";
var submult = "#x2AC1";
var subnE = "#x2ACB";
var subne = "#x228A";
var subplus = "#x2ABF";
var subrarr = "#x2979";
var subset = "#x2282";
var subseteq = "#x2286";
var subseteqq = "#x2AC5";
var subsetneq = "#x228A";
var subsetneqq = "#x2ACB";
var subsim = "#x2AC7";
var subsub = "#x2AD5";
var subsup = "#x2AD3";
var succ = "#x227B";
var succapprox = "#x2AB8";
var succcurlyeq = "#x227D";
var succeq = "#x2AB0";
var succnapprox = "#x2ABA";
var succneqq = "#x2AB6";
var succnsim = "#x22E9";
var succsim = "#x227F";
var sung = "#x266A";
var supE = "#x2AC6";
var supdot = "#x2ABE";
var supdsub = "#x2AD8";
var supedot = "#x2AC4";
var suphsol = "#x27C9";
var suphsub = "#x2AD7";
var suplarr = "#x297B";
var supmult = "#x2AC2";
var supnE = "#x2ACC";
var supne = "#x228B";
var supplus = "#x2AC0";
var supset = "#x2283";
var supseteq = "#x2287";
var supseteqq = "#x2AC6";
var supsetneq = "#x228B";
var supsetneqq = "#x2ACC";
var supsim = "#x2AC8";
var supsub = "#x2AD4";
var supsup = "#x2AD6";
var swArr = "#x21D9";
var swarhk = "#x2926";
var swarr = "#x2199";
var swarrow = "#x2199";
var swnwar = "#x292A";
var target = "#x2316";
var tbrk = "#x23B4";
var tcaron = "#x165";
var tcedil = "#x163";
var tcy = "#x442";
var tdot = "#x20DB";
var telrec = "#x2315";
var tfr = "#x1D531";
var therefore = "#x2234";
var thetav = "#x3D1";
var thickapprox = "#x2248";
var thicksim = "#x223C";
var thkap = "#x2248";
var thksim = "#x223C";
var timesb = "#x22A0";
var timesbar = "#x2A31";
var timesd = "#x2A30";
var tint = "#x222D";
var toea = "#x2928";
var top = "#x22A4";
var topbot = "#x2336";
var topcir = "#x2AF1";
var topf = "#x1D565";
var topfork = "#x2ADA";
var tosa = "#x2929";
var tprime = "#x2034";
var triangle = "#x25B5";
var triangledown = "#x25BF";
var triangleleft = "#x25C3";
var trianglelefteq = "#x22B4";
var triangleq = "#x225C";
var triangleright = "#x25B9";
var trianglerighteq = "#x22B5";
var tridot = "#x25EC";
var trie = "#x225C";
var triminus = "#x2A3A";
var triplus = "#x2A39";
var trisb = "#x29CD";
var tritime = "#x2A3B";
var trpezium = "#x23E2";
var tscr = "#x1D4C9";
var tscy = "#x446";
var tshcy = "#x45B";
var tstrok = "#x167";
var twixt = "#x226C";
var twoheadleftarrow = "#x219E";
var twoheadrightarrow = "#x21A0";
var uHar = "#x2963";
var ubrcy = "#x45E";
var ubreve = "#x16D";
var ucy = "#x443";
var udarr = "#x21C5";
var udblac = "#x171";
var udhar = "#x296E";
var ufisht = "#x297E";
var ufr = "#x1D532";
var uharl = "#x21BF";
var uharr = "#x21BE";
var uhblk = "#x2580";
var ulcorn = "#x231C";
var ulcorner = "#x231C";
var ulcrop = "#x230F";
var ultri = "#x25F8";
var umacr = "#x16B";
var uogon = "#x173";
var uopf = "#x1D566";
var uparrow = "#x2191";
var updownarrow = "#x2195";
var upharpoonleft = "#x21BF";
var upharpoonright = "#x21BE";
var uplus = "#x228E";
var upsi = "#x3C5";
var upuparrows = "#x21C8";
var urcorn = "#x231D";
var urcorner = "#x231D";
var urcrop = "#x230E";
var uring = "#x16F";
var urtri = "#x25F9";
var uscr = "#x1D4CA";
var utdot = "#x22F0";
var utilde = "#x169";
var utri = "#x25B5";
var utrif = "#x25B4";
var uuarr = "#x21C8";
var uwangle = "#x29A7";
var vArr = "#x21D5";
var vBar = "#x2AE8";
var vBarv = "#x2AE9";
var vDash = "#x22A8";
var vangrt = "#x299C";
var varepsilon = "#x3F5";
var varkappa = "#x3F0";
var varnothing = "#x2205";
var varphi = "#x3D5";
var varpi = "#x3D6";
var varpropto = "#x221D";
var varr = "#x2195";
var varrho = "#x3F1";
var varsigma = "#x3C2";
var varsubsetneq = "#x228A;&#xFE00";
var varsubsetneqq = "#x2ACB;&#xFE00";
var varsupsetneq = "#x228B;&#xFE00";
var varsupsetneqq = "#x2ACC;&#xFE00";
var vartheta = "#x3D1";
var vartriangleleft = "#x22B2";
var vartriangleright = "#x22B3";
var vcy = "#x432";
var vdash = "#x22A2";
var vee = "#x2228";
var veebar = "#x22BB";
var veeeq = "#x225A";
var vellip = "#x22EE";
var vfr = "#x1D533";
var vltri = "#x22B2";
var vnsub = "#x2282;&#x20D2";
var vnsup = "#x2283;&#x20D2";
var vopf = "#x1D567";
var vprop = "#x221D";
var vrtri = "#x22B3";
var vscr = "#x1D4CB";
var vsubnE = "#x2ACB;&#xFE00";
var vsubne = "#x228A;&#xFE00";
var vsupnE = "#x2ACC;&#xFE00";
var vsupne = "#x228B;&#xFE00";
var vzigzag = "#x299A";
var wcirc = "#x175";
var wedbar = "#x2A5F";
var wedge = "#x2227";
var wedgeq = "#x2259";
var wfr = "#x1D534";
var wopf = "#x1D568";
var wp = "#x2118";
var wr = "#x2240";
var wreath = "#x2240";
var wscr = "#x1D4CC";
var xcap = "#x22C2";
var xcirc = "#x25EF";
var xcup = "#x22C3";
var xdtri = "#x25BD";
var xfr = "#x1D535";
var xhArr = "#x27FA";
var xharr = "#x27F7";
var xlArr = "#x27F8";
var xlarr = "#x27F5";
var xmap = "#x27FC";
var xnis = "#x22FB";
var xodot = "#x2A00";
var xopf = "#x1D569";
var xoplus = "#x2A01";
var xotime = "#x2A02";
var xrArr = "#x27F9";
var xrarr = "#x27F6";
var xscr = "#x1D4CD";
var xsqcup = "#x2A06";
var xuplus = "#x2A04";
var xutri = "#x25B3";
var xvee = "#x22C1";
var xwedge = "#x22C0";
var yacy = "#x44F";
var ycirc = "#x177";
var ycy = "#x44B";
var yfr = "#x1D536";
var yicy = "#x457";
var yopf = "#x1D56A";
var yscr = "#x1D4CE";
var yucy = "#x44E";
var zacute = "#x17A";
var zcaron = "#x17E";
var zcy = "#x437";
var zdot = "#x17C";
var zeetrf = "#x2128";
var zfr = "#x1D537";
var zhcy = "#x436";
var zigrarr = "#x21DD";
var zopf = "#x1D56B";
var zscr = "#x1D4CF";
var emailPatternNumericEntities = {
	AMP: AMP,
	Abreve: Abreve,
	Acy: Acy,
	Afr: Afr,
	Amacr: Amacr,
	And: And,
	Aogon: Aogon,
	Aopf: Aopf,
	ApplyFunction: ApplyFunction,
	Ascr: Ascr,
	Assign: Assign,
	Backslash: Backslash,
	Barv: Barv,
	Barwed: Barwed,
	Bcy: Bcy,
	Because: Because,
	Bernoullis: Bernoullis,
	Bfr: Bfr,
	Bopf: Bopf,
	Breve: Breve,
	Bscr: Bscr,
	Bumpeq: Bumpeq,
	CHcy: CHcy,
	COPY: COPY,
	Cacute: Cacute,
	Cap: Cap,
	CapitalDifferentialD: CapitalDifferentialD,
	Cayleys: Cayleys,
	Ccaron: Ccaron,
	Ccirc: Ccirc,
	Cconint: Cconint,
	Cdot: Cdot,
	Cedilla: Cedilla,
	CenterDot: CenterDot,
	Cfr: Cfr,
	CircleDot: CircleDot,
	CircleMinus: CircleMinus,
	CirclePlus: CirclePlus,
	CircleTimes: CircleTimes,
	ClockwiseContourIntegral: ClockwiseContourIntegral,
	CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
	CloseCurlyQuote: CloseCurlyQuote,
	Colon: Colon,
	Colone: Colone,
	Congruent: Congruent,
	Conint: Conint,
	ContourIntegral: ContourIntegral,
	Copf: Copf,
	Coproduct: Coproduct,
	CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
	Cross: Cross,
	Cscr: Cscr,
	Cup: Cup,
	CupCap: CupCap,
	DD: DD,
	DDotrahd: DDotrahd,
	DJcy: DJcy,
	DScy: DScy,
	DZcy: DZcy,
	Darr: Darr,
	Dashv: Dashv,
	Dcaron: Dcaron,
	Dcy: Dcy,
	Del: Del,
	Dfr: Dfr,
	DiacriticalAcute: DiacriticalAcute,
	DiacriticalDot: DiacriticalDot,
	DiacriticalDoubleAcute: DiacriticalDoubleAcute,
	DiacriticalGrave: DiacriticalGrave,
	DiacriticalTilde: DiacriticalTilde,
	Diamond: Diamond,
	DifferentialD: DifferentialD,
	Dopf: Dopf,
	Dot: Dot,
	DotDot: DotDot,
	DotEqual: DotEqual,
	DoubleContourIntegral: DoubleContourIntegral,
	DoubleDot: DoubleDot,
	DoubleDownArrow: DoubleDownArrow,
	DoubleLeftArrow: DoubleLeftArrow,
	DoubleLeftRightArrow: DoubleLeftRightArrow,
	DoubleLeftTee: DoubleLeftTee,
	DoubleLongLeftArrow: DoubleLongLeftArrow,
	DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
	DoubleLongRightArrow: DoubleLongRightArrow,
	DoubleRightArrow: DoubleRightArrow,
	DoubleRightTee: DoubleRightTee,
	DoubleUpArrow: DoubleUpArrow,
	DoubleUpDownArrow: DoubleUpDownArrow,
	DoubleVerticalBar: DoubleVerticalBar,
	DownArrow: DownArrow,
	DownArrowBar: DownArrowBar,
	DownArrowUpArrow: DownArrowUpArrow,
	DownBreve: DownBreve,
	DownLeftRightVector: DownLeftRightVector,
	DownLeftTeeVector: DownLeftTeeVector,
	DownLeftVector: DownLeftVector,
	DownLeftVectorBar: DownLeftVectorBar,
	DownRightTeeVector: DownRightTeeVector,
	DownRightVector: DownRightVector,
	DownRightVectorBar: DownRightVectorBar,
	DownTee: DownTee,
	DownTeeArrow: DownTeeArrow,
	Downarrow: Downarrow,
	Dscr: Dscr,
	Dstrok: Dstrok,
	ENG: ENG,
	Ecaron: Ecaron,
	Ecy: Ecy,
	Edot: Edot,
	Efr: Efr,
	Element: Element,
	Emacr: Emacr,
	EmptySmallSquare: EmptySmallSquare,
	EmptyVerySmallSquare: EmptyVerySmallSquare,
	Eogon: Eogon,
	Eopf: Eopf,
	Equal: Equal,
	EqualTilde: EqualTilde,
	Equilibrium: Equilibrium,
	Escr: Escr,
	Esim: Esim,
	Exists: Exists,
	ExponentialE: ExponentialE,
	Fcy: Fcy,
	Ffr: Ffr,
	FilledSmallSquare: FilledSmallSquare,
	FilledVerySmallSquare: FilledVerySmallSquare,
	Fopf: Fopf,
	ForAll: ForAll,
	Fouriertrf: Fouriertrf,
	Fscr: Fscr,
	GJcy: GJcy,
	GT: GT,
	Gammad: Gammad,
	Gbreve: Gbreve,
	Gcedil: Gcedil,
	Gcirc: Gcirc,
	Gcy: Gcy,
	Gdot: Gdot,
	Gfr: Gfr,
	Gg: Gg,
	Gopf: Gopf,
	GreaterEqual: GreaterEqual,
	GreaterEqualLess: GreaterEqualLess,
	GreaterFullEqual: GreaterFullEqual,
	GreaterGreater: GreaterGreater,
	GreaterLess: GreaterLess,
	GreaterSlantEqual: GreaterSlantEqual,
	GreaterTilde: GreaterTilde,
	Gscr: Gscr,
	Gt: Gt,
	HARDcy: HARDcy,
	Hacek: Hacek,
	Hcirc: Hcirc,
	Hfr: Hfr,
	HilbertSpace: HilbertSpace,
	Hopf: Hopf,
	HorizontalLine: HorizontalLine,
	Hscr: Hscr,
	Hstrok: Hstrok,
	HumpDownHump: HumpDownHump,
	HumpEqual: HumpEqual,
	IEcy: IEcy,
	IJlig: IJlig,
	IOcy: IOcy,
	Icy: Icy,
	Idot: Idot,
	Ifr: Ifr,
	Im: Im,
	Imacr: Imacr,
	ImaginaryI: ImaginaryI,
	Implies: Implies,
	Int: Int,
	Integral: Integral,
	Intersection: Intersection,
	InvisibleComma: InvisibleComma,
	InvisibleTimes: InvisibleTimes,
	Iogon: Iogon,
	Iopf: Iopf,
	Iscr: Iscr,
	Itilde: Itilde,
	Iukcy: Iukcy,
	Jcirc: Jcirc,
	Jcy: Jcy,
	Jfr: Jfr,
	Jopf: Jopf,
	Jscr: Jscr,
	Jsercy: Jsercy,
	Jukcy: Jukcy,
	KHcy: KHcy,
	KJcy: KJcy,
	Kcedil: Kcedil,
	Kcy: Kcy,
	Kfr: Kfr,
	Kopf: Kopf,
	Kscr: Kscr,
	LJcy: LJcy,
	LT: LT,
	Lacute: Lacute,
	Lang: Lang,
	Laplacetrf: Laplacetrf,
	Larr: Larr,
	Lcaron: Lcaron,
	Lcedil: Lcedil,
	Lcy: Lcy,
	LeftAngleBracket: LeftAngleBracket,
	LeftArrow: LeftArrow,
	LeftArrowBar: LeftArrowBar,
	LeftArrowRightArrow: LeftArrowRightArrow,
	LeftCeiling: LeftCeiling,
	LeftDoubleBracket: LeftDoubleBracket,
	LeftDownTeeVector: LeftDownTeeVector,
	LeftDownVector: LeftDownVector,
	LeftDownVectorBar: LeftDownVectorBar,
	LeftFloor: LeftFloor,
	LeftRightArrow: LeftRightArrow,
	LeftRightVector: LeftRightVector,
	LeftTee: LeftTee,
	LeftTeeArrow: LeftTeeArrow,
	LeftTeeVector: LeftTeeVector,
	LeftTriangle: LeftTriangle,
	LeftTriangleBar: LeftTriangleBar,
	LeftTriangleEqual: LeftTriangleEqual,
	LeftUpDownVector: LeftUpDownVector,
	LeftUpTeeVector: LeftUpTeeVector,
	LeftUpVector: LeftUpVector,
	LeftUpVectorBar: LeftUpVectorBar,
	LeftVector: LeftVector,
	LeftVectorBar: LeftVectorBar,
	Leftarrow: Leftarrow,
	Leftrightarrow: Leftrightarrow,
	LessEqualGreater: LessEqualGreater,
	LessFullEqual: LessFullEqual,
	LessGreater: LessGreater,
	LessLess: LessLess,
	LessSlantEqual: LessSlantEqual,
	LessTilde: LessTilde,
	Lfr: Lfr,
	Ll: Ll,
	Lleftarrow: Lleftarrow,
	Lmidot: Lmidot,
	LongLeftArrow: LongLeftArrow,
	LongLeftRightArrow: LongLeftRightArrow,
	LongRightArrow: LongRightArrow,
	Longleftarrow: Longleftarrow,
	Longleftrightarrow: Longleftrightarrow,
	Longrightarrow: Longrightarrow,
	Lopf: Lopf,
	LowerLeftArrow: LowerLeftArrow,
	LowerRightArrow: LowerRightArrow,
	Lscr: Lscr,
	Lsh: Lsh,
	Lstrok: Lstrok,
	Lt: Lt,
	"Map": "#x2905",
	Mcy: Mcy,
	MediumSpace: MediumSpace,
	Mellintrf: Mellintrf,
	Mfr: Mfr,
	MinusPlus: MinusPlus,
	Mopf: Mopf,
	Mscr: Mscr,
	NJcy: NJcy,
	Nacute: Nacute,
	Ncaron: Ncaron,
	Ncedil: Ncedil,
	Ncy: Ncy,
	NegativeMediumSpace: NegativeMediumSpace,
	NegativeThickSpace: NegativeThickSpace,
	NegativeThinSpace: NegativeThinSpace,
	NegativeVeryThinSpace: NegativeVeryThinSpace,
	NestedGreaterGreater: NestedGreaterGreater,
	NestedLessLess: NestedLessLess,
	Nfr: Nfr,
	NoBreak: NoBreak,
	NonBreakingSpace: NonBreakingSpace,
	Nopf: Nopf,
	Not: Not,
	NotCongruent: NotCongruent,
	NotCupCap: NotCupCap,
	NotDoubleVerticalBar: NotDoubleVerticalBar,
	NotElement: NotElement,
	NotEqual: NotEqual,
	NotEqualTilde: NotEqualTilde,
	NotExists: NotExists,
	NotGreater: NotGreater,
	NotGreaterEqual: NotGreaterEqual,
	NotGreaterFullEqual: NotGreaterFullEqual,
	NotGreaterGreater: NotGreaterGreater,
	NotGreaterLess: NotGreaterLess,
	NotGreaterSlantEqual: NotGreaterSlantEqual,
	NotGreaterTilde: NotGreaterTilde,
	NotHumpDownHump: NotHumpDownHump,
	NotHumpEqual: NotHumpEqual,
	NotLeftTriangle: NotLeftTriangle,
	NotLeftTriangleBar: NotLeftTriangleBar,
	NotLeftTriangleEqual: NotLeftTriangleEqual,
	NotLess: NotLess,
	NotLessEqual: NotLessEqual,
	NotLessGreater: NotLessGreater,
	NotLessLess: NotLessLess,
	NotLessSlantEqual: NotLessSlantEqual,
	NotLessTilde: NotLessTilde,
	NotNestedGreaterGreater: NotNestedGreaterGreater,
	NotNestedLessLess: NotNestedLessLess,
	NotPrecedes: NotPrecedes,
	NotPrecedesEqual: NotPrecedesEqual,
	NotPrecedesSlantEqual: NotPrecedesSlantEqual,
	NotReverseElement: NotReverseElement,
	NotRightTriangle: NotRightTriangle,
	NotRightTriangleBar: NotRightTriangleBar,
	NotRightTriangleEqual: NotRightTriangleEqual,
	NotSquareSubset: NotSquareSubset,
	NotSquareSubsetEqual: NotSquareSubsetEqual,
	NotSquareSuperset: NotSquareSuperset,
	NotSquareSupersetEqual: NotSquareSupersetEqual,
	NotSubset: NotSubset,
	NotSubsetEqual: NotSubsetEqual,
	NotSucceeds: NotSucceeds,
	NotSucceedsEqual: NotSucceedsEqual,
	NotSucceedsSlantEqual: NotSucceedsSlantEqual,
	NotSucceedsTilde: NotSucceedsTilde,
	NotSuperset: NotSuperset,
	NotSupersetEqual: NotSupersetEqual,
	NotTilde: NotTilde,
	NotTildeEqual: NotTildeEqual,
	NotTildeFullEqual: NotTildeFullEqual,
	NotTildeTilde: NotTildeTilde,
	NotVerticalBar: NotVerticalBar,
	Nscr: Nscr,
	Ocy: Ocy,
	Odblac: Odblac,
	Ofr: Ofr,
	Omacr: Omacr,
	Oopf: Oopf,
	OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
	OpenCurlyQuote: OpenCurlyQuote,
	Or: Or,
	Oscr: Oscr,
	Otimes: Otimes,
	OverBar: OverBar,
	OverBrace: OverBrace,
	OverBracket: OverBracket,
	OverParenthesis: OverParenthesis,
	PartialD: PartialD,
	Pcy: Pcy,
	Pfr: Pfr,
	PlusMinus: PlusMinus,
	Poincareplane: Poincareplane,
	Popf: Popf,
	Pr: Pr,
	Precedes: Precedes,
	PrecedesEqual: PrecedesEqual,
	PrecedesSlantEqual: PrecedesSlantEqual,
	PrecedesTilde: PrecedesTilde,
	Product: Product,
	Proportion: Proportion,
	Proportional: Proportional,
	Pscr: Pscr,
	QUOT: QUOT,
	Qfr: Qfr,
	Qopf: Qopf,
	Qscr: Qscr,
	RBarr: RBarr,
	REG: REG,
	Racute: Racute,
	Rang: Rang,
	Rarr: Rarr,
	Rarrtl: Rarrtl,
	Rcaron: Rcaron,
	Rcedil: Rcedil,
	Rcy: Rcy,
	Re: Re,
	ReverseElement: ReverseElement,
	ReverseEquilibrium: ReverseEquilibrium,
	ReverseUpEquilibrium: ReverseUpEquilibrium,
	Rfr: Rfr,
	RightAngleBracket: RightAngleBracket,
	RightArrow: RightArrow,
	RightArrowBar: RightArrowBar,
	RightArrowLeftArrow: RightArrowLeftArrow,
	RightCeiling: RightCeiling,
	RightDoubleBracket: RightDoubleBracket,
	RightDownTeeVector: RightDownTeeVector,
	RightDownVector: RightDownVector,
	RightDownVectorBar: RightDownVectorBar,
	RightFloor: RightFloor,
	RightTee: RightTee,
	RightTeeArrow: RightTeeArrow,
	RightTeeVector: RightTeeVector,
	RightTriangle: RightTriangle,
	RightTriangleBar: RightTriangleBar,
	RightTriangleEqual: RightTriangleEqual,
	RightUpDownVector: RightUpDownVector,
	RightUpTeeVector: RightUpTeeVector,
	RightUpVector: RightUpVector,
	RightUpVectorBar: RightUpVectorBar,
	RightVector: RightVector,
	RightVectorBar: RightVectorBar,
	Rightarrow: Rightarrow,
	Ropf: Ropf,
	RoundImplies: RoundImplies,
	Rrightarrow: Rrightarrow,
	Rscr: Rscr,
	Rsh: Rsh,
	RuleDelayed: RuleDelayed,
	SHCHcy: SHCHcy,
	SHcy: SHcy,
	SOFTcy: SOFTcy,
	Sacute: Sacute,
	Sc: Sc,
	Scedil: Scedil,
	Scirc: Scirc,
	Scy: Scy,
	Sfr: Sfr,
	ShortDownArrow: ShortDownArrow,
	ShortLeftArrow: ShortLeftArrow,
	ShortRightArrow: ShortRightArrow,
	ShortUpArrow: ShortUpArrow,
	SmallCircle: SmallCircle,
	Sopf: Sopf,
	Sqrt: Sqrt,
	Square: Square,
	SquareIntersection: SquareIntersection,
	SquareSubset: SquareSubset,
	SquareSubsetEqual: SquareSubsetEqual,
	SquareSuperset: SquareSuperset,
	SquareSupersetEqual: SquareSupersetEqual,
	SquareUnion: SquareUnion,
	Sscr: Sscr,
	Star: Star,
	Sub: Sub,
	Subset: Subset,
	SubsetEqual: SubsetEqual,
	Succeeds: Succeeds,
	SucceedsEqual: SucceedsEqual,
	SucceedsSlantEqual: SucceedsSlantEqual,
	SucceedsTilde: SucceedsTilde,
	SuchThat: SuchThat,
	Sum: Sum,
	Sup: Sup,
	Superset: Superset,
	SupersetEqual: SupersetEqual,
	Supset: Supset,
	TRADE: TRADE,
	TSHcy: TSHcy,
	TScy: TScy,
	Tab: Tab,
	Tcaron: Tcaron,
	Tcedil: Tcedil,
	Tcy: Tcy,
	Tfr: Tfr,
	Therefore: Therefore,
	ThickSpace: ThickSpace,
	ThinSpace: ThinSpace,
	Tilde: Tilde,
	TildeEqual: TildeEqual,
	TildeFullEqual: TildeFullEqual,
	TildeTilde: TildeTilde,
	Topf: Topf,
	TripleDot: TripleDot,
	Tscr: Tscr,
	Tstrok: Tstrok,
	Uarr: Uarr,
	Uarrocir: Uarrocir,
	Ubrcy: Ubrcy,
	Ubreve: Ubreve,
	Ucy: Ucy,
	Udblac: Udblac,
	Ufr: Ufr,
	Umacr: Umacr,
	UnderBrace: UnderBrace,
	UnderBracket: UnderBracket,
	UnderParenthesis: UnderParenthesis,
	Union: Union,
	UnionPlus: UnionPlus,
	Uogon: Uogon,
	Uopf: Uopf,
	UpArrow: UpArrow,
	UpArrowBar: UpArrowBar,
	UpArrowDownArrow: UpArrowDownArrow,
	UpDownArrow: UpDownArrow,
	UpEquilibrium: UpEquilibrium,
	UpTee: UpTee,
	UpTeeArrow: UpTeeArrow,
	Uparrow: Uparrow,
	Updownarrow: Updownarrow,
	UpperLeftArrow: UpperLeftArrow,
	UpperRightArrow: UpperRightArrow,
	Upsi: Upsi,
	Uring: Uring,
	Uscr: Uscr,
	Utilde: Utilde,
	VDash: VDash,
	Vbar: Vbar,
	Vcy: Vcy,
	Vdash: Vdash,
	Vdashl: Vdashl,
	Vee: Vee,
	Verbar: Verbar,
	Vert: Vert,
	VerticalBar: VerticalBar,
	VerticalSeparator: VerticalSeparator,
	VerticalTilde: VerticalTilde,
	VeryThinSpace: VeryThinSpace,
	Vfr: Vfr,
	Vopf: Vopf,
	Vscr: Vscr,
	Vvdash: Vvdash,
	Wcirc: Wcirc,
	Wedge: Wedge,
	Wfr: Wfr,
	Wopf: Wopf,
	Wscr: Wscr,
	Xfr: Xfr,
	Xopf: Xopf,
	Xscr: Xscr,
	YAcy: YAcy,
	YIcy: YIcy,
	YUcy: YUcy,
	Ycirc: Ycirc,
	Ycy: Ycy,
	Yfr: Yfr,
	Yopf: Yopf,
	Yscr: Yscr,
	ZHcy: ZHcy,
	Zacute: Zacute,
	Zcaron: Zcaron,
	Zcy: Zcy,
	Zdot: Zdot,
	ZeroWidthSpace: ZeroWidthSpace,
	Zfr: Zfr,
	Zopf: Zopf,
	Zscr: Zscr,
	abreve: abreve,
	ac: ac,
	acE: acE,
	acd: acd,
	acy: acy,
	af: af,
	afr: afr,
	aleph: aleph,
	amacr: amacr,
	amalg: amalg,
	andand: andand,
	andd: andd,
	andslope: andslope,
	andv: andv,
	ange: ange,
	angle: angle,
	angmsd: angmsd,
	angmsdaa: angmsdaa,
	angmsdab: angmsdab,
	angmsdac: angmsdac,
	angmsdad: angmsdad,
	angmsdae: angmsdae,
	angmsdaf: angmsdaf,
	angmsdag: angmsdag,
	angmsdah: angmsdah,
	angrt: angrt,
	angrtvb: angrtvb,
	angrtvbd: angrtvbd,
	angsph: angsph,
	angst: angst,
	angzarr: angzarr,
	aogon: aogon,
	aopf: aopf,
	ap: ap,
	apE: apE,
	apacir: apacir,
	ape: ape,
	apid: apid,
	approx: approx,
	approxeq: approxeq,
	ascr: ascr,
	asympeq: asympeq,
	awconint: awconint,
	awint: awint,
	bNot: bNot,
	backcong: backcong,
	backepsilon: backepsilon,
	backprime: backprime,
	backsim: backsim,
	backsimeq: backsimeq,
	barvee: barvee,
	barwed: barwed,
	barwedge: barwedge,
	bbrk: bbrk,
	bbrktbrk: bbrktbrk,
	bcong: bcong,
	bcy: bcy,
	becaus: becaus,
	because: because,
	bemptyv: bemptyv,
	bepsi: bepsi,
	bernou: bernou,
	beth: beth,
	between: between,
	bfr: bfr,
	bigcap: bigcap,
	bigcirc: bigcirc,
	bigcup: bigcup,
	bigodot: bigodot,
	bigoplus: bigoplus,
	bigotimes: bigotimes,
	bigsqcup: bigsqcup,
	bigstar: bigstar,
	bigtriangledown: bigtriangledown,
	bigtriangleup: bigtriangleup,
	biguplus: biguplus,
	bigvee: bigvee,
	bigwedge: bigwedge,
	bkarow: bkarow,
	blacklozenge: blacklozenge,
	blacksquare: blacksquare,
	blacktriangle: blacktriangle,
	blacktriangledown: blacktriangledown,
	blacktriangleleft: blacktriangleleft,
	blacktriangleright: blacktriangleright,
	blank: blank,
	blk12: blk12,
	blk14: blk14,
	blk34: blk34,
	block: block,
	bne: bne,
	bnequiv: bnequiv,
	bnot: bnot,
	bopf: bopf,
	bot: bot,
	bottom: bottom,
	bowtie: bowtie,
	boxDL: boxDL,
	boxDR: boxDR,
	boxDl: boxDl,
	boxDr: boxDr,
	boxH: boxH,
	boxHD: boxHD,
	boxHU: boxHU,
	boxHd: boxHd,
	boxHu: boxHu,
	boxUL: boxUL,
	boxUR: boxUR,
	boxUl: boxUl,
	boxUr: boxUr,
	boxV: boxV,
	boxVH: boxVH,
	boxVL: boxVL,
	boxVR: boxVR,
	boxVh: boxVh,
	boxVl: boxVl,
	boxVr: boxVr,
	boxbox: boxbox,
	boxdL: boxdL,
	boxdR: boxdR,
	boxdl: boxdl,
	boxdr: boxdr,
	boxh: boxh,
	boxhD: boxhD,
	boxhU: boxhU,
	boxhd: boxhd,
	boxhu: boxhu,
	boxminus: boxminus,
	boxplus: boxplus,
	boxtimes: boxtimes,
	boxuL: boxuL,
	boxuR: boxuR,
	boxul: boxul,
	boxur: boxur,
	boxv: boxv,
	boxvH: boxvH,
	boxvL: boxvL,
	boxvR: boxvR,
	boxvh: boxvh,
	boxvl: boxvl,
	boxvr: boxvr,
	bprime: bprime,
	breve: breve,
	bscr: bscr,
	bsemi: bsemi,
	bsim: bsim,
	bsime: bsime,
	bsolb: bsolb,
	bsolhsub: bsolhsub,
	bullet: bullet,
	bump: bump,
	bumpE: bumpE,
	bumpe: bumpe,
	bumpeq: bumpeq,
	cacute: cacute,
	capand: capand,
	capbrcup: capbrcup,
	capcap: capcap,
	capcup: capcup,
	capdot: capdot,
	caps: caps,
	caret: caret,
	caron: caron,
	ccaps: ccaps,
	ccaron: ccaron,
	ccirc: ccirc,
	ccups: ccups,
	ccupssm: ccupssm,
	cdot: cdot,
	cemptyv: cemptyv,
	centerdot: centerdot,
	cfr: cfr,
	chcy: chcy,
	check: check,
	checkmark: checkmark,
	cir: cir,
	cirE: cirE,
	circeq: circeq,
	circlearrowleft: circlearrowleft,
	circlearrowright: circlearrowright,
	circledR: circledR,
	circledS: circledS,
	circledast: circledast,
	circledcirc: circledcirc,
	circleddash: circleddash,
	cire: cire,
	cirfnint: cirfnint,
	cirmid: cirmid,
	cirscir: cirscir,
	clubsuit: clubsuit,
	colone: colone,
	coloneq: coloneq,
	comp: comp,
	compfn: compfn,
	complement: complement,
	complexes: complexes,
	congdot: congdot,
	conint: conint,
	copf: copf,
	coprod: coprod,
	copysr: copysr,
	cross: cross,
	cscr: cscr,
	csub: csub,
	csube: csube,
	csup: csup,
	csupe: csupe,
	ctdot: ctdot,
	cudarrl: cudarrl,
	cudarrr: cudarrr,
	cuepr: cuepr,
	cuesc: cuesc,
	cularr: cularr,
	cularrp: cularrp,
	cupbrcap: cupbrcap,
	cupcap: cupcap,
	cupcup: cupcup,
	cupdot: cupdot,
	cupor: cupor,
	cups: cups,
	curarr: curarr,
	curarrm: curarrm,
	curlyeqprec: curlyeqprec,
	curlyeqsucc: curlyeqsucc,
	curlyvee: curlyvee,
	curlywedge: curlywedge,
	curvearrowleft: curvearrowleft,
	curvearrowright: curvearrowright,
	cuvee: cuvee,
	cuwed: cuwed,
	cwconint: cwconint,
	cwint: cwint,
	cylcty: cylcty,
	dHar: dHar,
	daleth: daleth,
	dash: dash,
	dashv: dashv,
	dbkarow: dbkarow,
	dblac: dblac,
	dcaron: dcaron,
	dcy: dcy,
	dd: dd,
	ddagger: ddagger,
	ddarr: ddarr,
	ddotseq: ddotseq,
	demptyv: demptyv,
	dfisht: dfisht,
	dfr: dfr,
	dharl: dharl,
	dharr: dharr,
	diam: diam,
	diamond: diamond,
	diamondsuit: diamondsuit,
	die: die,
	digamma: digamma,
	disin: disin,
	div: div,
	divideontimes: divideontimes,
	divonx: divonx,
	djcy: djcy,
	dlcorn: dlcorn,
	dlcrop: dlcrop,
	dopf: dopf,
	dot: dot,
	doteq: doteq,
	doteqdot: doteqdot,
	dotminus: dotminus,
	dotplus: dotplus,
	dotsquare: dotsquare,
	doublebarwedge: doublebarwedge,
	downarrow: downarrow,
	downdownarrows: downdownarrows,
	downharpoonleft: downharpoonleft,
	downharpoonright: downharpoonright,
	drbkarow: drbkarow,
	drcorn: drcorn,
	drcrop: drcrop,
	dscr: dscr,
	dscy: dscy,
	dsol: dsol,
	dstrok: dstrok,
	dtdot: dtdot,
	dtri: dtri,
	dtrif: dtrif,
	duarr: duarr,
	duhar: duhar,
	dwangle: dwangle,
	dzcy: dzcy,
	dzigrarr: dzigrarr,
	eDDot: eDDot,
	eDot: eDot,
	easter: easter,
	ecaron: ecaron,
	ecir: ecir,
	ecolon: ecolon,
	ecy: ecy,
	edot: edot,
	ee: ee,
	efDot: efDot,
	efr: efr,
	eg: eg,
	egs: egs,
	egsdot: egsdot,
	el: el,
	elinters: elinters,
	ell: ell,
	els: els,
	elsdot: elsdot,
	emacr: emacr,
	emptyset: emptyset,
	emptyv: emptyv,
	emsp13: emsp13,
	emsp14: emsp14,
	eng: eng,
	eogon: eogon,
	eopf: eopf,
	epar: epar,
	eparsl: eparsl,
	eplus: eplus,
	epsi: epsi,
	epsiv: epsiv,
	eqcirc: eqcirc,
	eqcolon: eqcolon,
	eqsim: eqsim,
	eqslantgtr: eqslantgtr,
	eqslantless: eqslantless,
	equest: equest,
	equivDD: equivDD,
	eqvparsl: eqvparsl,
	erDot: erDot,
	erarr: erarr,
	escr: escr,
	esdot: esdot,
	esim: esim,
	expectation: expectation,
	exponentiale: exponentiale,
	fallingdotseq: fallingdotseq,
	fcy: fcy,
	female: female,
	ffilig: ffilig,
	fflig: fflig,
	ffllig: ffllig,
	ffr: ffr,
	filig: filig,
	flat: flat,
	fllig: fllig,
	fltns: fltns,
	fopf: fopf,
	fork: fork,
	forkv: forkv,
	fpartint: fpartint,
	frac13: frac13,
	frac15: frac15,
	frac16: frac16,
	frac18: frac18,
	frac23: frac23,
	frac25: frac25,
	frac35: frac35,
	frac38: frac38,
	frac45: frac45,
	frac56: frac56,
	frac58: frac58,
	frac78: frac78,
	frown: frown,
	fscr: fscr,
	gE: gE,
	gEl: gEl,
	gacute: gacute,
	gammad: gammad,
	gap: gap,
	gbreve: gbreve,
	gcirc: gcirc,
	gcy: gcy,
	gdot: gdot,
	gel: gel,
	geq: geq,
	geqq: geqq,
	geqslant: geqslant,
	ges: ges,
	gescc: gescc,
	gesdot: gesdot,
	gesdoto: gesdoto,
	gesdotol: gesdotol,
	gesl: gesl,
	gesles: gesles,
	gfr: gfr,
	gg: gg,
	ggg: ggg,
	gimel: gimel,
	gjcy: gjcy,
	gl: gl,
	glE: glE,
	gla: gla,
	glj: glj,
	gnE: gnE,
	gnap: gnap,
	gnapprox: gnapprox,
	gne: gne,
	gneq: gneq,
	gneqq: gneqq,
	gnsim: gnsim,
	gopf: gopf,
	grave: grave,
	gscr: gscr,
	gsim: gsim,
	gsime: gsime,
	gsiml: gsiml,
	gtcc: gtcc,
	gtcir: gtcir,
	gtdot: gtdot,
	gtlPar: gtlPar,
	gtquest: gtquest,
	gtrapprox: gtrapprox,
	gtrarr: gtrarr,
	gtrdot: gtrdot,
	gtreqless: gtreqless,
	gtreqqless: gtreqqless,
	gtrless: gtrless,
	gtrsim: gtrsim,
	gvertneqq: gvertneqq,
	gvnE: gvnE,
	hairsp: hairsp,
	half: half,
	hamilt: hamilt,
	hardcy: hardcy,
	harrcir: harrcir,
	harrw: harrw,
	hbar: hbar,
	hcirc: hcirc,
	heartsuit: heartsuit,
	hercon: hercon,
	hfr: hfr,
	hksearow: hksearow,
	hkswarow: hkswarow,
	hoarr: hoarr,
	homtht: homtht,
	hookleftarrow: hookleftarrow,
	hookrightarrow: hookrightarrow,
	hopf: hopf,
	horbar: horbar,
	hscr: hscr,
	hslash: hslash,
	hstrok: hstrok,
	hybull: hybull,
	hyphen: hyphen,
	ic: ic,
	icy: icy,
	iecy: iecy,
	iff: iff,
	ifr: ifr,
	ii: ii,
	iiiint: iiiint,
	iiint: iiint,
	iinfin: iinfin,
	iiota: iiota,
	ijlig: ijlig,
	imacr: imacr,
	imagline: imagline,
	imagpart: imagpart,
	imath: imath,
	imof: imof,
	imped: imped,
	"in": "#x2208",
	incare: incare,
	infintie: infintie,
	inodot: inodot,
	intcal: intcal,
	integers: integers,
	intercal: intercal,
	intlarhk: intlarhk,
	intprod: intprod,
	iocy: iocy,
	iogon: iogon,
	iopf: iopf,
	iprod: iprod,
	iscr: iscr,
	isinE: isinE,
	isindot: isindot,
	isins: isins,
	isinsv: isinsv,
	isinv: isinv,
	it: it,
	itilde: itilde,
	iukcy: iukcy,
	jcirc: jcirc,
	jcy: jcy,
	jfr: jfr,
	jmath: jmath,
	jopf: jopf,
	jscr: jscr,
	jsercy: jsercy,
	jukcy: jukcy,
	kappav: kappav,
	kcedil: kcedil,
	kcy: kcy,
	kfr: kfr,
	kgreen: kgreen,
	khcy: khcy,
	kjcy: kjcy,
	kopf: kopf,
	kscr: kscr,
	lAarr: lAarr,
	lAtail: lAtail,
	lBarr: lBarr,
	lE: lE,
	lEg: lEg,
	lHar: lHar,
	lacute: lacute,
	laemptyv: laemptyv,
	lagran: lagran,
	langd: langd,
	langle: langle,
	lap: lap,
	larrb: larrb,
	larrbfs: larrbfs,
	larrfs: larrfs,
	larrhk: larrhk,
	larrlp: larrlp,
	larrpl: larrpl,
	larrsim: larrsim,
	larrtl: larrtl,
	lat: lat,
	latail: latail,
	late: late,
	lates: lates,
	lbarr: lbarr,
	lbbrk: lbbrk,
	lbrace: lbrace,
	lbrack: lbrack,
	lbrke: lbrke,
	lbrksld: lbrksld,
	lbrkslu: lbrkslu,
	lcaron: lcaron,
	lcedil: lcedil,
	lcub: lcub,
	lcy: lcy,
	ldca: ldca,
	ldquor: ldquor,
	ldrdhar: ldrdhar,
	ldrushar: ldrushar,
	ldsh: ldsh,
	leftarrow: leftarrow,
	leftarrowtail: leftarrowtail,
	leftharpoondown: leftharpoondown,
	leftharpoonup: leftharpoonup,
	leftleftarrows: leftleftarrows,
	leftrightarrow: leftrightarrow,
	leftrightarrows: leftrightarrows,
	leftrightharpoons: leftrightharpoons,
	leftrightsquigarrow: leftrightsquigarrow,
	leftthreetimes: leftthreetimes,
	leg: leg,
	leq: leq,
	leqq: leqq,
	leqslant: leqslant,
	les: les,
	lescc: lescc,
	lesdot: lesdot,
	lesdoto: lesdoto,
	lesdotor: lesdotor,
	lesg: lesg,
	lesges: lesges,
	lessapprox: lessapprox,
	lessdot: lessdot,
	lesseqgtr: lesseqgtr,
	lesseqqgtr: lesseqqgtr,
	lessgtr: lessgtr,
	lesssim: lesssim,
	lfisht: lfisht,
	lfr: lfr,
	lg: lg,
	lgE: lgE,
	lhard: lhard,
	lharu: lharu,
	lharul: lharul,
	lhblk: lhblk,
	ljcy: ljcy,
	ll: ll,
	llarr: llarr,
	llcorner: llcorner,
	llhard: llhard,
	lltri: lltri,
	lmidot: lmidot,
	lmoust: lmoust,
	lmoustache: lmoustache,
	lnE: lnE,
	lnap: lnap,
	lnapprox: lnapprox,
	lne: lne,
	lneq: lneq,
	lneqq: lneqq,
	lnsim: lnsim,
	loang: loang,
	loarr: loarr,
	lobrk: lobrk,
	longleftarrow: longleftarrow,
	longleftrightarrow: longleftrightarrow,
	longmapsto: longmapsto,
	longrightarrow: longrightarrow,
	looparrowleft: looparrowleft,
	looparrowright: looparrowright,
	lopar: lopar,
	lopf: lopf,
	loplus: loplus,
	lotimes: lotimes,
	lozenge: lozenge,
	lozf: lozf,
	lparlt: lparlt,
	lrarr: lrarr,
	lrcorner: lrcorner,
	lrhar: lrhar,
	lrhard: lrhard,
	lrtri: lrtri,
	lscr: lscr,
	lsh: lsh,
	lsim: lsim,
	lsime: lsime,
	lsimg: lsimg,
	lsquor: lsquor,
	lstrok: lstrok,
	ltcc: ltcc,
	ltcir: ltcir,
	ltdot: ltdot,
	lthree: lthree,
	ltimes: ltimes,
	ltlarr: ltlarr,
	ltquest: ltquest,
	ltrPar: ltrPar,
	ltri: ltri,
	ltrie: ltrie,
	ltrif: ltrif,
	lurdshar: lurdshar,
	luruhar: luruhar,
	lvertneqq: lvertneqq,
	lvnE: lvnE,
	mDDot: mDDot,
	male: male,
	malt: malt,
	maltese: maltese,
	map: map,
	mapsto: mapsto,
	mapstodown: mapstodown,
	mapstoleft: mapstoleft,
	mapstoup: mapstoup,
	marker: marker,
	mcomma: mcomma,
	mcy: mcy,
	measuredangle: measuredangle,
	mfr: mfr,
	mho: mho,
	mid: mid,
	midcir: midcir,
	minusb: minusb,
	minusd: minusd,
	minusdu: minusdu,
	mlcp: mlcp,
	mldr: mldr,
	mnplus: mnplus,
	models: models,
	mopf: mopf,
	mp: mp,
	mscr: mscr,
	mstpos: mstpos,
	multimap: multimap,
	mumap: mumap,
	nGg: nGg,
	nGt: nGt,
	nGtv: nGtv,
	nLeftarrow: nLeftarrow,
	nLeftrightarrow: nLeftrightarrow,
	nLl: nLl,
	nLt: nLt,
	nLtv: nLtv,
	nRightarrow: nRightarrow,
	nVDash: nVDash,
	nVdash: nVdash,
	nacute: nacute,
	nang: nang,
	nap: nap,
	napE: napE,
	napid: napid,
	napos: napos,
	napprox: napprox,
	natur: natur,
	natural: natural,
	naturals: naturals,
	nbump: nbump,
	nbumpe: nbumpe,
	ncap: ncap,
	ncaron: ncaron,
	ncedil: ncedil,
	ncong: ncong,
	ncongdot: ncongdot,
	ncup: ncup,
	ncy: ncy,
	neArr: neArr,
	nearhk: nearhk,
	nearr: nearr,
	nearrow: nearrow,
	nedot: nedot,
	nequiv: nequiv,
	nesear: nesear,
	nesim: nesim,
	nexist: nexist,
	nexists: nexists,
	nfr: nfr,
	ngE: ngE,
	nge: nge,
	ngeq: ngeq,
	ngeqq: ngeqq,
	ngeqslant: ngeqslant,
	nges: nges,
	ngsim: ngsim,
	ngt: ngt,
	ngtr: ngtr,
	nhArr: nhArr,
	nharr: nharr,
	nhpar: nhpar,
	nis: nis,
	nisd: nisd,
	niv: niv,
	njcy: njcy,
	nlArr: nlArr,
	nlE: nlE,
	nlarr: nlarr,
	nldr: nldr,
	nle: nle,
	nleftarrow: nleftarrow,
	nleftrightarrow: nleftrightarrow,
	nleq: nleq,
	nleqq: nleqq,
	nleqslant: nleqslant,
	nles: nles,
	nless: nless,
	nlsim: nlsim,
	nlt: nlt,
	nltri: nltri,
	nltrie: nltrie,
	nmid: nmid,
	nopf: nopf,
	notinE: notinE,
	notindot: notindot,
	notinva: notinva,
	notinvb: notinvb,
	notinvc: notinvc,
	notni: notni,
	notniva: notniva,
	notnivb: notnivb,
	notnivc: notnivc,
	npar: npar,
	nparallel: nparallel,
	nparsl: nparsl,
	npart: npart,
	npolint: npolint,
	npr: npr,
	nprcue: nprcue,
	npre: npre,
	nprec: nprec,
	npreceq: npreceq,
	nrArr: nrArr,
	nrarr: nrarr,
	nrarrc: nrarrc,
	nrarrw: nrarrw,
	nrightarrow: nrightarrow,
	nrtri: nrtri,
	nrtrie: nrtrie,
	nsc: nsc,
	nsccue: nsccue,
	nsce: nsce,
	nscr: nscr,
	nshortmid: nshortmid,
	nshortparallel: nshortparallel,
	nsim: nsim,
	nsime: nsime,
	nsimeq: nsimeq,
	nsmid: nsmid,
	nspar: nspar,
	nsqsube: nsqsube,
	nsqsupe: nsqsupe,
	nsubE: nsubE,
	nsube: nsube,
	nsubset: nsubset,
	nsubseteq: nsubseteq,
	nsubseteqq: nsubseteqq,
	nsucc: nsucc,
	nsucceq: nsucceq,
	nsup: nsup,
	nsupE: nsupE,
	nsupe: nsupe,
	nsupset: nsupset,
	nsupseteq: nsupseteq,
	nsupseteqq: nsupseteqq,
	ntgl: ntgl,
	ntlg: ntlg,
	ntriangleleft: ntriangleleft,
	ntrianglelefteq: ntrianglelefteq,
	ntriangleright: ntriangleright,
	ntrianglerighteq: ntrianglerighteq,
	numero: numero,
	numsp: numsp,
	nvDash: nvDash,
	nvHarr: nvHarr,
	nvap: nvap,
	nvdash: nvdash,
	nvge: nvge,
	nvgt: nvgt,
	nvinfin: nvinfin,
	nvlArr: nvlArr,
	nvle: nvle,
	nvlt: nvlt,
	nvltrie: nvltrie,
	nvrArr: nvrArr,
	nvrtrie: nvrtrie,
	nvsim: nvsim,
	nwArr: nwArr,
	nwarhk: nwarhk,
	nwarr: nwarr,
	nwarrow: nwarrow,
	nwnear: nwnear,
	oS: oS,
	oast: oast,
	ocir: ocir,
	ocy: ocy,
	odash: odash,
	odblac: odblac,
	odiv: odiv,
	odot: odot,
	odsold: odsold,
	ofcir: ofcir,
	ofr: ofr,
	ogon: ogon,
	ogt: ogt,
	ohbar: ohbar,
	ohm: ohm,
	oint: oint,
	olarr: olarr,
	olcir: olcir,
	olcross: olcross,
	olt: olt,
	omacr: omacr,
	omid: omid,
	ominus: ominus,
	oopf: oopf,
	opar: opar,
	operp: operp,
	orarr: orarr,
	ord: ord,
	order: order,
	orderof: orderof,
	origof: origof,
	oror: oror,
	orslope: orslope,
	orv: orv,
	oscr: oscr,
	osol: osol,
	otimesas: otimesas,
	ovbar: ovbar,
	par: par,
	parallel: parallel,
	parsim: parsim,
	parsl: parsl,
	pcy: pcy,
	pertenk: pertenk,
	pfr: pfr,
	phiv: phiv,
	phmmat: phmmat,
	phone: phone,
	pitchfork: pitchfork,
	planck: planck,
	planckh: planckh,
	plankv: plankv,
	plusacir: plusacir,
	plusb: plusb,
	pluscir: pluscir,
	plusdo: plusdo,
	plusdu: plusdu,
	pluse: pluse,
	plussim: plussim,
	plustwo: plustwo,
	pm: pm,
	pointint: pointint,
	popf: popf,
	pr: pr,
	prE: prE,
	prap: prap,
	prcue: prcue,
	pre: pre,
	prec: prec,
	precapprox: precapprox,
	preccurlyeq: preccurlyeq,
	preceq: preceq,
	precnapprox: precnapprox,
	precneqq: precneqq,
	precnsim: precnsim,
	precsim: precsim,
	primes: primes,
	prnE: prnE,
	prnap: prnap,
	prnsim: prnsim,
	profalar: profalar,
	profline: profline,
	profsurf: profsurf,
	propto: propto,
	prsim: prsim,
	prurel: prurel,
	pscr: pscr,
	puncsp: puncsp,
	qfr: qfr,
	qint: qint,
	qopf: qopf,
	qprime: qprime,
	qscr: qscr,
	quaternions: quaternions,
	quatint: quatint,
	questeq: questeq,
	rAarr: rAarr,
	rAtail: rAtail,
	rBarr: rBarr,
	rHar: rHar,
	race: race,
	racute: racute,
	raemptyv: raemptyv,
	rangd: rangd,
	range: range,
	rangle: rangle,
	rarrap: rarrap,
	rarrb: rarrb,
	rarrbfs: rarrbfs,
	rarrc: rarrc,
	rarrfs: rarrfs,
	rarrhk: rarrhk,
	rarrlp: rarrlp,
	rarrpl: rarrpl,
	rarrsim: rarrsim,
	rarrtl: rarrtl,
	rarrw: rarrw,
	ratail: ratail,
	ratio: ratio,
	rationals: rationals,
	rbarr: rbarr,
	rbbrk: rbbrk,
	rbrke: rbrke,
	rbrksld: rbrksld,
	rbrkslu: rbrkslu,
	rcaron: rcaron,
	rcedil: rcedil,
	rcy: rcy,
	rdca: rdca,
	rdldhar: rdldhar,
	rdquor: rdquor,
	rdsh: rdsh,
	realine: realine,
	realpart: realpart,
	reals: reals,
	rect: rect,
	rfisht: rfisht,
	rfr: rfr,
	rhard: rhard,
	rharu: rharu,
	rharul: rharul,
	rhov: rhov,
	rightarrow: rightarrow,
	rightarrowtail: rightarrowtail,
	rightharpoondown: rightharpoondown,
	rightharpoonup: rightharpoonup,
	rightleftarrows: rightleftarrows,
	rightleftharpoons: rightleftharpoons,
	rightrightarrows: rightrightarrows,
	rightsquigarrow: rightsquigarrow,
	rightthreetimes: rightthreetimes,
	ring: ring,
	risingdotseq: risingdotseq,
	rlarr: rlarr,
	rlhar: rlhar,
	rmoust: rmoust,
	rmoustache: rmoustache,
	rnmid: rnmid,
	roang: roang,
	roarr: roarr,
	robrk: robrk,
	ropar: ropar,
	ropf: ropf,
	roplus: roplus,
	rotimes: rotimes,
	rpargt: rpargt,
	rppolint: rppolint,
	rrarr: rrarr,
	rscr: rscr,
	rsh: rsh,
	rsquor: rsquor,
	rthree: rthree,
	rtimes: rtimes,
	rtri: rtri,
	rtrie: rtrie,
	rtrif: rtrif,
	rtriltri: rtriltri,
	ruluhar: ruluhar,
	rx: rx,
	sacute: sacute,
	sc: sc,
	scE: scE,
	scap: scap,
	sccue: sccue,
	sce: sce,
	scedil: scedil,
	scirc: scirc,
	scnE: scnE,
	scnap: scnap,
	scnsim: scnsim,
	scpolint: scpolint,
	scsim: scsim,
	scy: scy,
	sdotb: sdotb,
	sdote: sdote,
	seArr: seArr,
	searhk: searhk,
	searr: searr,
	searrow: searrow,
	seswar: seswar,
	setminus: setminus,
	setmn: setmn,
	sext: sext,
	sfr: sfr,
	sfrown: sfrown,
	sharp: sharp,
	shchcy: shchcy,
	shcy: shcy,
	shortmid: shortmid,
	shortparallel: shortparallel,
	sigmav: sigmav,
	simdot: simdot,
	sime: sime,
	simeq: simeq,
	simg: simg,
	simgE: simgE,
	siml: siml,
	simlE: simlE,
	simne: simne,
	simplus: simplus,
	simrarr: simrarr,
	slarr: slarr,
	smallsetminus: smallsetminus,
	smashp: smashp,
	smeparsl: smeparsl,
	smid: smid,
	smile: smile,
	smt: smt,
	smte: smte,
	smtes: smtes,
	softcy: softcy,
	solb: solb,
	solbar: solbar,
	sopf: sopf,
	spadesuit: spadesuit,
	spar: spar,
	sqcap: sqcap,
	sqcaps: sqcaps,
	sqcup: sqcup,
	sqcups: sqcups,
	sqsub: sqsub,
	sqsube: sqsube,
	sqsubset: sqsubset,
	sqsubseteq: sqsubseteq,
	sqsup: sqsup,
	sqsupe: sqsupe,
	sqsupset: sqsupset,
	sqsupseteq: sqsupseteq,
	squ: squ,
	square: square,
	squarf: squarf,
	squf: squf,
	srarr: srarr,
	sscr: sscr,
	ssetmn: ssetmn,
	ssmile: ssmile,
	sstarf: sstarf,
	star: star,
	starf: starf,
	straightepsilon: straightepsilon,
	straightphi: straightphi,
	strns: strns,
	subE: subE,
	subdot: subdot,
	subedot: subedot,
	submult: submult,
	subnE: subnE,
	subne: subne,
	subplus: subplus,
	subrarr: subrarr,
	subset: subset,
	subseteq: subseteq,
	subseteqq: subseteqq,
	subsetneq: subsetneq,
	subsetneqq: subsetneqq,
	subsim: subsim,
	subsub: subsub,
	subsup: subsup,
	succ: succ,
	succapprox: succapprox,
	succcurlyeq: succcurlyeq,
	succeq: succeq,
	succnapprox: succnapprox,
	succneqq: succneqq,
	succnsim: succnsim,
	succsim: succsim,
	sung: sung,
	supE: supE,
	supdot: supdot,
	supdsub: supdsub,
	supedot: supedot,
	suphsol: suphsol,
	suphsub: suphsub,
	suplarr: suplarr,
	supmult: supmult,
	supnE: supnE,
	supne: supne,
	supplus: supplus,
	supset: supset,
	supseteq: supseteq,
	supseteqq: supseteqq,
	supsetneq: supsetneq,
	supsetneqq: supsetneqq,
	supsim: supsim,
	supsub: supsub,
	supsup: supsup,
	swArr: swArr,
	swarhk: swarhk,
	swarr: swarr,
	swarrow: swarrow,
	swnwar: swnwar,
	target: target,
	tbrk: tbrk,
	tcaron: tcaron,
	tcedil: tcedil,
	tcy: tcy,
	tdot: tdot,
	telrec: telrec,
	tfr: tfr,
	therefore: therefore,
	thetav: thetav,
	thickapprox: thickapprox,
	thicksim: thicksim,
	thkap: thkap,
	thksim: thksim,
	timesb: timesb,
	timesbar: timesbar,
	timesd: timesd,
	tint: tint,
	toea: toea,
	top: top,
	topbot: topbot,
	topcir: topcir,
	topf: topf,
	topfork: topfork,
	tosa: tosa,
	tprime: tprime,
	triangle: triangle,
	triangledown: triangledown,
	triangleleft: triangleleft,
	trianglelefteq: trianglelefteq,
	triangleq: triangleq,
	triangleright: triangleright,
	trianglerighteq: trianglerighteq,
	tridot: tridot,
	trie: trie,
	triminus: triminus,
	triplus: triplus,
	trisb: trisb,
	tritime: tritime,
	trpezium: trpezium,
	tscr: tscr,
	tscy: tscy,
	tshcy: tshcy,
	tstrok: tstrok,
	twixt: twixt,
	twoheadleftarrow: twoheadleftarrow,
	twoheadrightarrow: twoheadrightarrow,
	uHar: uHar,
	ubrcy: ubrcy,
	ubreve: ubreve,
	ucy: ucy,
	udarr: udarr,
	udblac: udblac,
	udhar: udhar,
	ufisht: ufisht,
	ufr: ufr,
	uharl: uharl,
	uharr: uharr,
	uhblk: uhblk,
	ulcorn: ulcorn,
	ulcorner: ulcorner,
	ulcrop: ulcrop,
	ultri: ultri,
	umacr: umacr,
	uogon: uogon,
	uopf: uopf,
	uparrow: uparrow,
	updownarrow: updownarrow,
	upharpoonleft: upharpoonleft,
	upharpoonright: upharpoonright,
	uplus: uplus,
	upsi: upsi,
	upuparrows: upuparrows,
	urcorn: urcorn,
	urcorner: urcorner,
	urcrop: urcrop,
	uring: uring,
	urtri: urtri,
	uscr: uscr,
	utdot: utdot,
	utilde: utilde,
	utri: utri,
	utrif: utrif,
	uuarr: uuarr,
	uwangle: uwangle,
	vArr: vArr,
	vBar: vBar,
	vBarv: vBarv,
	vDash: vDash,
	vangrt: vangrt,
	varepsilon: varepsilon,
	varkappa: varkappa,
	varnothing: varnothing,
	varphi: varphi,
	varpi: varpi,
	varpropto: varpropto,
	varr: varr,
	varrho: varrho,
	varsigma: varsigma,
	varsubsetneq: varsubsetneq,
	varsubsetneqq: varsubsetneqq,
	varsupsetneq: varsupsetneq,
	varsupsetneqq: varsupsetneqq,
	vartheta: vartheta,
	vartriangleleft: vartriangleleft,
	vartriangleright: vartriangleright,
	vcy: vcy,
	vdash: vdash,
	vee: vee,
	veebar: veebar,
	veeeq: veeeq,
	vellip: vellip,
	vfr: vfr,
	vltri: vltri,
	vnsub: vnsub,
	vnsup: vnsup,
	vopf: vopf,
	vprop: vprop,
	vrtri: vrtri,
	vscr: vscr,
	vsubnE: vsubnE,
	vsubne: vsubne,
	vsupnE: vsupnE,
	vsupne: vsupne,
	vzigzag: vzigzag,
	wcirc: wcirc,
	wedbar: wedbar,
	wedge: wedge,
	wedgeq: wedgeq,
	wfr: wfr,
	wopf: wopf,
	wp: wp,
	wr: wr,
	wreath: wreath,
	wscr: wscr,
	xcap: xcap,
	xcirc: xcirc,
	xcup: xcup,
	xdtri: xdtri,
	xfr: xfr,
	xhArr: xhArr,
	xharr: xharr,
	xlArr: xlArr,
	xlarr: xlarr,
	xmap: xmap,
	xnis: xnis,
	xodot: xodot,
	xopf: xopf,
	xoplus: xoplus,
	xotime: xotime,
	xrArr: xrArr,
	xrarr: xrarr,
	xscr: xscr,
	xsqcup: xsqcup,
	xuplus: xuplus,
	xutri: xutri,
	xvee: xvee,
	xwedge: xwedge,
	yacy: yacy,
	ycirc: ycirc,
	ycy: ycy,
	yfr: yfr,
	yicy: yicy,
	yopf: yopf,
	yscr: yscr,
	yucy: yucy,
	zacute: zacute,
	zcaron: zcaron,
	zcy: zcy,
	zdot: zdot,
	zeetrf: zeetrf,
	zfr: zfr,
	zhcy: zhcy,
	zigrarr: zigrarr,
	zopf: zopf,
	zscr: zscr
};

var isArr = Array.isArray;
var lowAsciiCharacterNames = ["null", "start-of-heading", "start-of-text", "end-of-text", "end-of-transmission", "enquiry", "acknowledge", "bell", "backspace", "character-tabulation", "line-feed", "line-tabulation", "form-feed", "carriage-return", "shift-out", "shift-in", "data-link-escape", "device-control-one", "device-control-two", "device-control-three", "device-control-four", "negative-acknowledge", "synchronous-idle", "end-of-transmission-block", "cancel", "end-of-medium", "substitute", "escape", "information-separator-four", "information-separator-three", "information-separator-two", "information-separator-one", "space", "exclamation-mark"];
var c1CharacterNames = ["delete", "padding", "high-octet-preset", "break-permitted-here", "no-break-here", "index", "next-line", "start-of-selected-area", "end-of-selected-area", "character-tabulation-set", "character-tabulation-with-justification", "line-tabulation-set", "partial-line-forward", "partial-line-backward", "reverse-line-feed", "single-shift-two", "single-shift-three", "device-control-string", "private-use-1", "private-use-2", "set-transmit-state", "cancel-character", "message-waiting", "start-of-protected-area", "end-of-protected-area", "start-of-string", "single-graphic-character-introducer", "single-character-intro-introducer", "control-sequence-introducer", "string-terminator", "operating-system-command", "private-message", "application-program-command"];
function charSuitableForAttrName(_char) {
  var res = !"\"'><=".includes(_char);
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
    if (breakingCharValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    })) {
      if (!terminatorCharValidatorFuncArr) {
        return {
          v: i
        };
      }
      lastRes = i;
    }
    if (terminatorCharValidatorFuncArr !== null && lastRes && terminatorCharValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    })) {
      return {
        v: lastRes
      };
    }
    if (!charWePassValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    }) && !breakingCharValidatorFuncArr.some(function (func) {
      return func(str[i], i);
    })) {
      return {
        v: false
      };
    }
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret = _loop(i);
    if (_typeof(_ret) === "object") return _ret.v;
  }
}
function onlyAttrFriendlyCharsLeadingToEqual(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return onlyTheseLeadToThat(str, idx, charSuitableForAttrName,
  function (_char2) {
    return _char2 === "=";
  }
  );
}
function charIsQuote(_char3) {
  var res = "\"'`\u2018\u2019\u201C\u201D".includes(_char3);
  return res;
}
function isTagChar(_char4) {
  if (typeof _char4 !== "string" || _char4.length > 1) {
    throw new Error("emlint/util/isTagChar(): input is not a single string character!");
  }
  return !"><=".includes(_char4);
}
function isLowerCaseLetter(_char5) {
  return isStr(_char5) && _char5.charCodeAt(0) > 96 && _char5.charCodeAt(0) < 123;
}
function isUppercaseLetter(_char6) {
  return isStr(_char6) && _char6.length === 1 && _char6.charCodeAt(0) > 64 && _char6.charCodeAt(0) < 91;
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isLatinLetter(_char8) {
  return isStr(_char8) && _char8.length === 1 && (_char8.charCodeAt(0) > 64 && _char8.charCodeAt(0) < 91 || _char8.charCodeAt(0) > 96 && _char8.charCodeAt(0) < 123);
}
function charSuitableForTagName(_char9) {
  return isLowerCaseLetter(_char9) || _char9 === ":";
}
function withinTagInnerspace(str, idx, closingQuotePos) {
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
      return true;
    }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      if (!str[i + 1] || !stringLeftRight.right(str, i) || !str.slice(i).includes("'") && !str.slice(i).includes('"')) {
        return true;
      } else if (str[stringLeftRight.right(str, i)] === "<") {
        return true;
      }
    }
    else if (r3_1 && !r3_2 && str[i].trim().length && !isTagChar(str[i])) {
        if (str[i] === "<") {
          r3_2 = true;
        } else {
          r3_1 = false;
        }
      }
      else if (r3_2 && !r3_3 && str[i].trim().length) {
          if (charSuitableForTagName(str[i]) || str[i] === "/") {
            r3_3 = true;
          } else {
            r3_1 = false;
            r3_2 = false;
          }
        }
        else if (r3_3 && !r3_4 && str[i].trim().length && !charSuitableForTagName(str[i])) {
            if ("<>".includes(str[i]) || str[i] === "/" && "<>".includes(stringLeftRight.right(str, i))) {
              return true;
            } else if ("='\"".includes(str[i])) {
              r3_1 = false;
              r3_2 = false;
              r3_3 = false;
            }
          }
          else if (r3_3 && !r3_4 && !str[i].trim().length) {
              r3_4 = true;
            }
            else if (r3_4 && !r3_5 && str[i].trim().length) {
                if (charSuitableForAttrName(str[i])) {
                  r3_5 = true;
                } else {
                  r3_1 = false;
                  r3_2 = false;
                  r3_3 = false;
                  r3_4 = false;
                }
              }
              else if (r3_5) {
                  if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
                    return true;
                  }
                }
    if (!quotes.within && beginningOfAString && charSuitableForAttrName(str[i]) && !r2_1 && (str[stringLeftRight.left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))) {
      r2_1 = true;
    }
    else if (!r2_2 && r2_1 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r2_2 = true;
        } else if (str[i] === ">" || str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
          var closingBracketAt = i;
          if (str[i] === "/") {
            closingBracketAt = str[stringLeftRight.right(str, i)];
          }
          if (stringLeftRight.right(str, closingBracketAt)) {
            r3_1 = true;
            r2_1 = false;
          } else {
            return true;
          }
        } else {
          r2_1 = false;
        }
      }
      else if (!r2_3 && r2_2 && str[i].trim().length) {
          if ("'\"".includes(str[i])) {
            r2_3 = true;
          } else {
            r2_1 = false;
            r2_2 = false;
          }
        }
        else if (r2_3 && charIsQuote(str[i])) {
            if (str[i] === str[quotes.at]) {
              r2_4 = true;
            } else {
              if (closingQuotePos != null && closingQuotePos === i) {
                if (isStr(str[quotes.at]) && "\"'".includes(str[quotes.at]) && "\"'".includes(str[i])) {
                  r2_4 = true;
                } else if (isStr(str[quotes.at]) && "\u2018\u2019".includes(str[quotes.at]) && "\u2018\u2019".includes(str[i])) {
                  r2_4 = true;
                } else if (isStr(str[quotes.at]) && "\u201C\u201D".includes(str[quotes.at]) && "\u201C\u201D".includes(str[i])) {
                  r2_4 = true;
                }
              } else if (closingQuotePos == null && withinTagInnerspace(str, null, i)) {
                if (quotes.within) {
                  quotes.within = false;
                }
                r2_4 = true;
              }
            }
          }
          else if (r2_4 && !quotes.within && str[i].trim().length && str[i] !== "/") {
              if (str[i] === ">") {
                return true;
              } else if (charSuitableForAttrName(str[i])) {
                return true;
              }
            }
    if (!quotes.within && beginningOfAString && !r4_1 && charSuitableForAttrName(str[i]) && (str[stringLeftRight.left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))) {
      r4_1 = true;
    }
    else if (r4_1 && str[i].trim().length && (!charSuitableForAttrName(str[i]) || str[i] === "/")) {
        if (str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
          return true;
        }
        r4_1 = false;
      }
    if (beginningOfAString && !quotes.within && !r5_1 && str[i].trim().length && charSuitableForAttrName(str[i])) {
      r5_1 = true;
    }
    else if (r5_1 && !r5_2 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r5_2 = true;
        } else {
          r5_1 = false;
        }
      }
      else if (r5_2 && !r5_3 && str[i].trim().length) {
          if (str[i] === ">") {
            r5_3 = true;
          } else {
            r5_1 = false;
            r5_2 = false;
          }
        }
        else if (r5_3 && str[i].trim().length && !isTagChar(str[i])) {
            if (str[i] === "<") {
              r3_2 = true;
            } else {
              r5_1 = false;
              r5_2 = false;
              r5_3 = false;
            }
          }
    if (!quotes.within && !r6_1 && (charSuitableForAttrName(str[i]) || !str[i].trim().length) && !charSuitableForAttrName(str[i - 1]) && str[i - 1] !== "=") {
      r6_1 = true;
    }
    if (!quotes.within && r6_1 && !r6_2 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
      if (str[i] === "=") {
        r6_2 = true;
      } else {
        r6_1 = false;
      }
    }
    else if (!r6_3 && r6_2 && str[i].trim().length) {
        if (charIsQuote(str[i])) {
          r6_3 = true;
        } else {
          r6_1 = false;
          r6_2 = false;
        }
      }
      else if (r6_3 && charIsQuote(str[i])) {
          if (str[i] === str[quotes.at]) {
            return true;
          }
          else if (str[i + 1] && "/>".includes(str[stringLeftRight.right(str, i)])) {
              return true;
            }
        }
    if (beginningOfAString && str[i].trim().length && charSuitableForAttrName(str[i]) && !r7_1
    ) {
        r7_1 = true;
      }
    if (r7_1 && !str[i].trim().length && str[i + 1] && charSuitableForAttrName(str[i + 1])) {
      r7_1 = false;
    }
    if (!quotes.within && str[i].trim().length && !charSuitableForAttrName(str[i]) && r7_1
    ) {
        if (str[i] === "=") {
          return true;
        }
        r7_1 = false;
      }
    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
    }
  }
  return false;
}
function tagOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var r1 = /^<\s*\w+\s*\/?\s*>/g;
  var r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  var r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  var r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  var whatToTest = idx ? str.slice(idx) : str;
  var passed = false;
  if (r1.test(whatToTest)) {
    passed = true;
  } else if (r2.test(whatToTest)) {
    passed = true;
  } else if (r3.test(whatToTest)) {
    passed = true;
  } else if (r4.test(whatToTest)) {
    passed = true;
  }
  var res = isStr(str) && idx < str.length && passed;
  return res;
}
function attributeOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var closingQuoteAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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
    if (i === closingQuoteAt && i > idx || closingQuoteAt === null && i > idx && str[i] === startingQuoteVal) {
      closingQuoteAt = i;
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
      }
    }
    if (str[i] === ">") {
      lastClosingBracket = i;
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
    }
    if (str[i] === "=") {
      lastEqual = i;
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          return closingQuoteAt;
        }
      } else {
        if (closingQuoteAt) {
          return false;
        }
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          var correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            return lastSomeQuote;
          }
        }
        var correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          return false;
        }
      }
    }
    if (closingQuoteMatched && lastClosingBracket && lastClosingBracket > closingQuoteMatched) {
      return closingQuoteAt;
    }
    if (closingQuoteMatched && lastClosingBracket === null && lastOpeningBracket === null && (lastSomeQuote === null || lastSomeQuote && closingQuoteAt >= lastSomeQuote) && lastEqual === null) {
      return closingQuoteAt;
    }
    if (!str[i + 1]) ;
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    var correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      return lastSomeQuote;
    }
  }
  return false;
}
function findClosingQuote(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var lastNonWhitespaceCharWasQuoteAt = null;
  var lastQuoteAt = null;
  var startingQuote = "\"'".includes(str[idx]) ? str[idx] : null;
  var lastClosingBracketAt = null;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      if (i > idx && (str[i] === "'" || str[i] === '"') && withinTagInnerspace(str, i + 1)) {
        return i;
      }
      if (tagOnTheRight(str, i + 1)) {
        return i;
      }
    }
    else if (str[i].trim().length) {
        if (str[i] === ">") {
          lastClosingBracketAt = i;
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            var temp = withinTagInnerspace(str, i);
            if (temp) {
              if (lastNonWhitespaceCharWasQuoteAt === idx) {
                return lastNonWhitespaceCharWasQuoteAt + 1;
              }
              return lastNonWhitespaceCharWasQuoteAt;
            }
          }
        } else if (str[i] === "=") {
          var whatFollowsEq = stringLeftRight.right(str, i);
          if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
            if (lastQuoteAt && lastQuoteAt !== idx && withinTagInnerspace(str, lastQuoteAt + 1)) {
              return lastQuoteAt + 1;
            } else if (!lastQuoteAt || lastQuoteAt === idx) {
              var startingPoint = str[i - 1].trim().length ? i - 1 : stringLeftRight.left(str, i);
              var res = void 0;
              for (var y = startingPoint; y--;) {
                if (!str[y].trim().length) {
                  res = stringLeftRight.left(str, y) + 1;
                  break;
                } else if (y === idx) {
                  res = idx + 1;
                  break;
                }
              }
              return res;
            }
          } else if (str[i + 1].trim().length) {
            var _temp = void 0;
            for (var _y = i; _y--;) {
              if (!str[_y].trim().length) {
                _temp = stringLeftRight.left(str, _y);
                break;
              }
            }
            if (charIsQuote(_temp)) {
              return _temp;
            }
            return _temp + 1;
          }
        } else if (str[i] !== "/") {
          if (str[i] === "<" && tagOnTheRight(str, i)) {
            if (lastClosingBracketAt !== null) {
              return lastClosingBracketAt;
            }
          }
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            lastNonWhitespaceCharWasQuoteAt = null;
          }
        }
      }
  }
  return null;
}
function encodeChar(str, i) {
  if (str[i] === "<") {
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
function pingEspTag(str, espTagObj, submit) {
  if (isNum(espTagObj.startAt) && isNum(espTagObj.endAt)) {
    var openingParens = str.slice(espTagObj.startAt, espTagObj.endAt).match(/\(/g);
    var closingParens = str.slice(espTagObj.startAt, espTagObj.endAt).match(/\)/g);
    if (isArr(openingParens) && isArr(closingParens) && openingParens.length !== closingParens.length || isArr(openingParens) && !isArr(closingParens) || !isArr(openingParens) && isArr(closingParens)) {
      if (isArr(openingParens) && isArr(closingParens) && openingParens.length > closingParens.length || isArr(openingParens) && openingParens.length && !isArr(closingParens)) {
        submit({
          name: "esp-more-opening-parentheses-than-closing",
          position: [[espTagObj.startAt, espTagObj.endAt]]
        });
      } else if (isArr(openingParens) && isArr(closingParens) && openingParens.length < closingParens.length || isArr(closingParens) && closingParens.length && !isArr(openingParens)) {
        submit({
          name: "esp-more-closing-parentheses-than-opening",
          position: [[espTagObj.startAt, espTagObj.endAt]]
        });
      }
    }
  }
}
function encode(str) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "html";
  if (mode === "html") {
    var encoded = he.encode(str, {
      useNamedReferences: true
    });
    if (typeof encoded === "string" && encoded.length && encoded.startsWith("&") && encoded.endsWith(";") && _typeof(emailPatternNumericEntities) === "object" && Object.prototype.hasOwnProperty.call(emailPatternNumericEntities, encoded.slice(1, encoded.length - 1))) {
      encoded = "&".concat(emailPatternNumericEntities[encoded.slice(1, encoded.length - 1)], ";");
    }
    return encoded;
  }
}

var isArr$1 = Array.isArray;
var attributeOnTheRight$1 = attributeOnTheRight,
    withinTagInnerspace$1 = withinTagInnerspace,
    isLowerCaseLetter$1 = isLowerCaseLetter,
    findClosingQuote$1 = findClosingQuote,
    tagOnTheRight$1 = tagOnTheRight,
    charIsQuote$1 = charIsQuote,
    encodeChar$1 = encodeChar,
    pingEspTag$1 = pingEspTag,
    encode$1 = encode,
    isStr$1 = isStr,
    flip$1 = flip;
function lint(str, originalOpts) {
  function pingTag(logTag) {}
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
    comment: false,
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
    }
    if (!Object.prototype.hasOwnProperty.call(opts.rules, issueObj.name) || opts.rules[issueObj.name]) {
      if (whereTo === "raw") {
        rawIssueStaging.push(issueObj);
      } else if (whereTo === "tag") {
        tagIssueStaging.push(issueObj);
      } else {
        retObj.issues.push(issueObj);
      }
    }
  }
  function submitOpeningBracket(from, to) {
    submit({
      name: "bad-character-unencoded-opening-bracket",
      position: [[from, to, "&lt;"]]
    }, "raw");
  }
  function submitClosingBracket(from, to) {
    submit({
      name: "bad-character-unencoded-closing-bracket",
      position: [[from, to, "&gt;"]]
    }, "raw");
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
  }
  var _loop = function _loop(_i, len) {
    if (logEspTag.headVal !== null && _i === logEspTag.headEndAt && doNothingUntil === null) {
      doNothingUntil = true;
      doNothingUntilReason = "esp";
    }
    var charcode = str[_i].charCodeAt(0);
    if (doNothingUntil && doNothingUntil !== true && _i >= doNothingUntil) {
      doNothingUntil = null;
      doNothingUntilReason = null;
    }
    if (str[_i + 4] && str[_i].toLowerCase() === "c" && stringLeftRight.rightSeq(str, _i, {
      i: true
    }, "d*", "a*", "t*", "a*", "[?*", "]?", "[?*") && ("<![".includes(str[stringLeftRight.left(str, _i)]) || str[_i - 1] && !"<![".includes(str[_i - 1]) && str[_i - 2] === "[" && str[_i - 3] === "!" && str[_i - 4] === "<" && (!str[_i - 5] || str[_i - 5].trim().length && !"<![".includes(str[_i - 5])) || str[_i - 1] && !"<![".includes(str[_i - 1]) && str[_i - 2] === "!" && str[_i - 3] === "<" && (!str[_i - 4] || str[_i - 4].trim().length && !"<![".includes(str[_i - 4]))) && stringLeftRight.leftSeq(str, _i, "&", "l", "t", ";", "!", "[") === null) {
      var rightSideOfCdataOpening = stringLeftRight.right(str, stringLeftRight.rightSeq(str, _i, {
        i: true
      }, "d*", "a*", "t*", "a*", "[?*", "]?", "[?*").rightmostChar) - 1;
      var leftChomp = stringLeftRight.chompLeft(str, _i, "<?*", "!?*", "[?*", "]?*");
      if (
      !"<![".includes(str[_i - 1]) && str[_i - 2] === "[" && str[_i - 3] === "!" && str[_i - 4] === "<" && (!str[_i - 5] || !"<![".includes(str[_i - 5])) ||
      str[_i - 1] === "[" && !"<![".includes(str[_i - 2]) && str[_i - 3] === "!" && str[_i - 4] === "<" && (!str[_i - 5] || !"<![".includes(str[_i - 5])) ||
      str[_i - 1] === "[" && str[_i - 2] === "!" && !"<![".includes(str[_i - 3]) && str[_i - 4] === "<" && (!str[_i - 5] || !"<![".includes(str[_i - 5]))) {
        leftChomp = Math.min(leftChomp, _i - 4);
      } else if (
      !"<![".includes(str[_i - 1]) && str[_i - 2] === "!" && str[_i - 3] === "<" && (!str[_i - 4] || !"<![".includes(str[_i - 4])) ||
      str[_i - 1] === "[" && !"<![".includes(str[_i - 2]) && str[_i - 3] === "<" && (!str[_i - 4] || !"<![".includes(str[_i - 4]))) {
        leftChomp = Math.min(leftChomp, _i - 3);
      }
      if (str.slice(leftChomp, rightSideOfCdataOpening + 1) !== "<![CDATA[") {
        submit({
          name: "bad-cdata-tag-malformed",
          position: [[leftChomp, rightSideOfCdataOpening + 1, "<![CDATA["]]
        });
      }
      doNothingUntil = true;
      doNothingUntilReason = "cdata";
      if (rawIssueStaging.length) {
        rawIssueStaging.forEach(function (issueObj) {
          if (issueObj.position[0][0] < leftChomp) {
            submit(issueObj);
          }
        });
        rawIssueStaging = [];
      }
      _i = rightSideOfCdataOpening;
      i = _i;
      return "continue";
    }
    if (doNothingUntil === true && doNothingUntilReason === "cdata" && "[]".includes(str[_i])) {
      var temp = stringLeftRight.chompRight(str, _i, "[?*", "]?*", "[?*", "]?*", ">");
      if (
      str[_i] === "]" && str[_i + 1] && str[_i + 1].trim().length && !">]".includes(str[_i + 1]) && str[_i + 2] === "]" && str[_i + 3] === ">" ||
      str[_i] === "]" && str[_i + 1] === "]" && str[_i + 2] && str[_i + 2].trim().length && !">]".includes(str[_i + 2]) && str[_i + 3] === ">") {
        temp = Math.max(temp || _i + 4, _i + 4);
      } else if (
      str[_i] === "]" && str[_i + 1] && str[_i + 1].trim().length && !">]".includes(str[_i + 1]) && str[_i + 2] === ">") {
        temp = Math.max(temp || _i + 3, _i + 3);
      }
      if (temp) {
        if (str.slice(_i, temp) !== "]]>") {
          submit({
            name: "bad-cdata-tag-malformed",
            position: [[_i, temp, "]]>"]]
          });
        }
        doNothingUntil = _i + 3;
      }
    }
    if (doNothingUntil === null || doNothingUntil !== null && doNothingUntilReason !== "script tag" || doNothingUntilReason === "script tag" && (str[_i - 1] !== "\\" || str[_i - 2] === "\\")) {
      if (withinQuotes === null && "\"'`".includes(str[_i])) {
        withinQuotes = _i;
      } else if (withinQuotes !== null && str[withinQuotes] === str[_i] && (!withinQuotesEndAt || withinQuotesEndAt === _i)) {
        withinQuotes = null;
        withinQuotesEndAt = null;
      }
    }
    if (withinQuotesEndAt && withinQuotesEndAt === _i) {
      withinQuotes = null;
      withinQuotesEndAt = null;
    }
    if (!doNothingUntil && logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && !isLatinLetter(str[_i])) {
      logTag.tagNameEndAt = _i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, _i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      if (charIsQuote$1(str[_i]) || str[_i] === "=") {
        var addSpace;
        var strayCharsEndAt = _i + 1;
        if (str[_i + 1].trim().length) {
          if (charIsQuote$1(str[_i + 1]) || str[_i + 1] === "=") {
            for (var y = _i + 1; y < len; y++) {
              if (!charIsQuote$1(str[y]) && str[y] !== "=") {
                if (str[y].trim().length) {
                  addSpace = true;
                  strayCharsEndAt = y;
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
        } else {
          submit({
            name: "tag-stray-character",
            position: [[_i, strayCharsEndAt]]
          });
        }
      }
    }
    if (doNothingUntil && doNothingUntilReason === "esp" && logEspTag.tailStartAt && logEspTag.tailEndAt === null && !espChars.includes(str[_i + 1])) {
      doNothingUntil = _i + 1;
    }
    if (doNothingUntil && doNothingUntilReason === "esp" && logEspTag.headVal && logEspTag.tailStartAt === null) {
      var temp1;
      if (logEspTag.recognised && arrayiffy(knownESPTags[logEspTag.headVal].sibling).some(function (closingVal) {
        if (stringLeftRight.rightSeq.apply(void 0, [str, _i].concat(_toConsumableArray(closingVal.split(""))))) {
          temp1 = closingVal;
          i = _i;
          return true;
        }
      })) {
        var tempEnd = stringLeftRight.rightSeq.apply(void 0, [str, _i].concat(_toConsumableArray(temp1.split(""))));
        logEspTag.tailStartAt = tempEnd.leftmostChar;
        logEspTag.tailEndAt = tempEnd.rightmostChar + 1;
        logEspTag.tailVal = str.slice(logEspTag.tailStartAt, logEspTag.tailEndAt);
        logEspTag.endAt = logEspTag.tailEndAt;
        doNothingUntil = logEspTag.endAt;
        pingEspTag$1(str, logEspTag, submit);
        resetEspTag();
      } else if (flip$1(logEspTag.headVal).includes(str[_i])) {
        if (espChars.includes(str[stringLeftRight.right(str, _i)]) || logEspTag.headVal.includes(str[_i]) || flip$1(logEspTag.headVal).includes(str[_i])) {
          logEspTag.tailStartAt = _i;
        }
      }
    }
    if (logEspTag.headStartAt !== null && logEspTag.headEndAt === null && _i > logEspTag.headStartAt && str[_i + 1] && (!str[_i + 1].trim().length || !espChars.includes(str[_i + 1]))) {
      if (!logEspTag.recognised || knownESPTags[logEspTag.headVal].type === "opening") {
        if (str.slice(logEspTag.headStartAt, _i + 1) !== "--") {
          logEspTag.headEndAt = _i + 1;
          logEspTag.headVal = str.slice(logEspTag.headStartAt, _i + 1);
          logEspTag.recognised = Object.prototype.hasOwnProperty.call(knownESPTags, logEspTag.headVal);
        }
      }
    }
    if (!logTag.comment && logEspTag.startAt === null && logEspTag.headStartAt === null && espChars.includes(str[_i]) && str[_i + 1] && !stringLeftRight.leftSeq(str, _i, "<", "!") && (!doNothingUntil || doNothingUntil === true)) {
      if (espChars.includes(str[_i + 1])) {
        logEspTag.headStartAt = _i;
        logEspTag.startAt = _i;
        logEspTag.type = "tag-based";
      } else if (espCharsFunc.includes(str[_i]) && isLowerCaseLetter$1(str[_i + 1])) {
        logEspTag.headStartAt = _i;
        logEspTag.startAt = _i;
        logEspTag.headEndAt = _i + 1;
        logEspTag.headVal = str[_i];
        logEspTag.type = "function-based";
        logEspTag.recognised = Object.prototype.hasOwnProperty.call(knownESPTags, str[_i]);
      }
      if (logEspTag.headStartAt !== null && logWhitespace.startAt !== null && logWhitespace.startAt < _i - 1 && !logWhitespace.includesLinebreaks) {
        submit({
          name: "tag-excessive-whitespace-inside-tag",
          position: [[logWhitespace.startAt + 1, _i]]
        });
      }
    }
    if (!doNothingUntil && logTag.tagNameEndAt !== null) {
      if (logAttr.attrNameStartAt !== null && logAttr.attrNameEndAt === null && logAttr.attrName === null && !isLatinLetter(str[_i]) && (str[_i] !== ":" || !isLatinLetter(str[_i + 1]))) {
        logAttr.attrNameEndAt = _i;
        logAttr.attrName = str.slice(logAttr.attrNameStartAt, logAttr.attrNameEndAt);
        if (str[_i] !== "=") {
          if (str[stringLeftRight.right(str, _i)] === "=") ;
        }
      }
      if (logAttr.attrNameEndAt !== null && logAttr.attrEqualAt === null && _i >= logAttr.attrNameEndAt && str[_i].trim().length) {
        var _temp;
        if (str[_i] === "'" || str[_i] === '"') {
          _temp = attributeOnTheRight$1(str, _i);
        }
        if (str[_i] === "=") {
          logAttr.attrEqualAt = _i;
          if (str[_i + 1]) {
            var nextCharOnTheRightAt = stringLeftRight.right(str, _i);
            if (str[nextCharOnTheRightAt] === "=") {
              var nextEqualStartAt = _i + 1;
              var nextEqualEndAt = nextCharOnTheRightAt + 1;
              doNothingUntil = nextEqualEndAt;
              doNothingUntilReason = "repeated equals";
              while (nextEqualStartAt && nextEqualEndAt) {
                submit({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                var _temp2 = stringLeftRight.right(str, nextEqualEndAt - 1);
                if (str[_temp2] === "=") {
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = _temp2 + 1;
                  doNothingUntil = nextEqualEndAt;
                  doNothingUntilReason = "already processed equals";
                } else {
                  nextEqualStartAt = null;
                }
              }
            }
          }
        } else if (_temp) {
          submit({
            name: "tag-attribute-missing-equal",
            position: [[_i, _i, "="]]
          });
          logAttr.attrEqualAt = _i;
          logAttr.attrValueStartAt = _i + 1;
          logAttr.attrValueEndAt = _temp;
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = str[_i];
          logAttr.attrClosingQuote.pos = _temp;
          logAttr.attrClosingQuote.val = str[_temp];
          logAttr.attrValue = str.slice(_i + 1, _temp);
        } else {
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[_i] === "=") {
            submit({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, _i]]
            });
            resetLogWhitespace();
          } else if (isLatinLetter(str[_i])) {
            logTag.attributes.push(clone(logAttr));
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < _i) {
                  submit({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, _i]]
                  });
                }
              } else {
                submit({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, _i, " "]]
                });
              }
            }
          }
        }
      }
      if (logAttr.attrStartAt === null && isLatinLetter(str[_i])) {
        logAttr.attrStartAt = _i;
        logAttr.attrNameStartAt = _i;
        if (logWhitespace.startAt !== null && logWhitespace.startAt < _i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, _i]]
            });
          } else {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, _i, " "]]
            });
          }
        }
        if (str[_i - 1]) {
          if (charIsQuote$1(str[_i - 1])) {
            for (var _y = _i - 1; _y--;) {
              if (!charIsQuote$1(str[_y])) {
                if (!str[_y].trim().length) {
                  submit({
                    name: "tag-stray-character",
                    position: [[_y + 1, _i]]
                  });
                }
                break;
              }
            }
          }
        }
      }
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos === null) {
        if (logAttr.attrEqualAt < _i && str[_i].trim().length) {
          if (charcode === 34 || charcode === 39) {
            if (logWhitespace.startAt && logWhitespace.startAt < _i) {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, _i]]
              });
            }
            resetLogWhitespace();
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = str[_i];
            var closingQuotePeek = findClosingQuote$1(str, _i);
            if (closingQuotePeek) {
              if (str[closingQuotePeek] !== str[_i]) {
                if (str[closingQuotePeek] === "'" || str[closingQuotePeek] === '"') {
                  var isDouble = str[closingQuotePeek] === '"';
                  var name = "tag-attribute-mismatching-quotes-is-".concat(isDouble ? "double" : "single");
                  submit({
                    name: name,
                    position: [[closingQuotePeek, closingQuotePeek + 1, "".concat(isDouble ? "'" : '"')]]
                  });
                } else {
                  var compensation = "";
                  var fromPositionToInsertAt = str[closingQuotePeek - 1].trim().length ? closingQuotePeek : stringLeftRight.left(str, closingQuotePeek) + 1;
                  var toPositionToInsertAt = closingQuotePeek;
                  if (str[stringLeftRight.left(str, closingQuotePeek)] === "/") {
                    toPositionToInsertAt = stringLeftRight.left(str, closingQuotePeek);
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      submit({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                    }
                    fromPositionToInsertAt = stringLeftRight.left(str, toPositionToInsertAt) + 1;
                  }
                  submit({
                    name: "tag-attribute-closing-quotation-mark-missing",
                    position: [[fromPositionToInsertAt, toPositionToInsertAt, "".concat(str[_i]).concat(compensation)]]
                  });
                }
              }
              logAttr.attrClosingQuote.pos = closingQuotePeek;
              logAttr.attrClosingQuote.val = str[_i];
              logAttr.attrValue = str.slice(_i + 1, closingQuotePeek);
              logAttr.attrValueStartAt = _i + 1;
              logAttr.attrValueEndAt = closingQuotePeek;
              logAttr.attrEndAt = closingQuotePeek;
              for (var _y2 = _i + 1; _y2 < closingQuotePeek; _y2++) {
                var newIssue = encodeChar$1(str, _y2);
                if (newIssue) {
                  tagIssueStaging.push(newIssue);
                }
              }
              if (rawIssueStaging.length) ;
              if (logAttr.attrNameStartAt && str[logAttr.attrNameStartAt - 1].trim().length && (!opts.rules || opts.rules["tag-stray-character"] !== false) && !retObj.issues.some(function (issueObj) {
                i = _i;
                return (issueObj.name === "tag-stray-quotes" || issueObj.name === "tag-stray-character") && issueObj.position[0][1] === logAttr.attrNameStartAt;
              })) {
                submit({
                  name: "tag-missing-space-before-attribute",
                  position: [[logAttr.attrNameStartAt, logAttr.attrNameStartAt, " "]]
                });
              }
              logTag.attributes.push(clone(logAttr));
              if (str[closingQuotePeek].trim().length) {
                var calculatedDoNothingUntil = closingQuotePeek - (charIsQuote$1(str[closingQuotePeek]) ? 0 : 1) + 1;
                if (calculatedDoNothingUntil > _i) {
                  doNothingUntil = calculatedDoNothingUntil;
                  doNothingUntilReason = "closing quote looked up";
                }
              } else {
                var _calculatedDoNothingUntil = stringLeftRight.left(str, closingQuotePeek) + 1;
                if (_calculatedDoNothingUntil > _i) {
                  doNothingUntil = _calculatedDoNothingUntil;
                  doNothingUntilReason = "closing quote looked up";
                }
              }
              if (withinQuotes !== null) {
                withinQuotesEndAt = logAttr.attrClosingQuote.pos;
              }
              resetLogAttr();
              if (_i === len - 1 && logTag.tagStartAt !== null && (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null || logTag.attributes.some(function (attrObj) {
                return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
              }))) {
                submit({
                  name: "tag-missing-closing-bracket",
                  position: [[_i + 1, _i + 1, ">"]]
                });
              }
              i = _i;
              return "continue";
            }
          } else if (charcode === 8220 || charcode === 8221) {
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = "\"";
            var _name = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
            submit({
              name: _name,
              position: [[_i, _i + 1, "\""]]
            });
            logAttr.attrValueStartAt = _i + 1;
            withinQuotes = _i;
          } else if (charcode === 8216 || charcode === 8217) {
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = "'";
            var _name2 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
            submit({
              name: _name2,
              position: [[_i, _i + 1, "'"]]
            });
            logAttr.attrValueStartAt = _i + 1;
            withinQuotes = _i;
          } else if (!withinTagInnerspace$1(str, _i)) {
            var _closingQuotePeek = findClosingQuote$1(str, _i);
            var quoteValToPut = charIsQuote$1(str[_closingQuotePeek]) ? str[_closingQuotePeek] : "\"";
            submit({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[stringLeftRight.left(str, _i) + 1, _i, quoteValToPut]]
            });
            logAttr.attrOpeningQuote = {
              pos: _i,
              val: quoteValToPut
            };
            logAttr.attrValueStartAt = _i;
            withinQuotes = _i;
            var innerTagEndsAt = null;
            for (var _y3 = _i; _y3 < len; _y3++) {
              if (str[_y3] === ">" && (str[stringLeftRight.left(str, _y3)] !== "/" && withinTagInnerspace$1(str, _y3) || str[stringLeftRight.left(str, _y3)] === "/")) {
                var leftAt = stringLeftRight.left(str, _y3);
                innerTagEndsAt = _y3;
                if (str[leftAt] === "/") {
                  innerTagEndsAt = leftAt;
                }
              }
              var dealBrakerCharacters = "=<";
              if (innerTagEndsAt !== null && dealBrakerCharacters.includes(str[_y3])) {
                break;
              }
            }
            var innerTagContents;
            if (_i < innerTagEndsAt) {
              innerTagContents = str.slice(_i, innerTagEndsAt);
            } else {
              innerTagContents = "";
            }
            var startingPoint = innerTagEndsAt;
            var attributeOnTheRightBeginsAt;
            if (innerTagContents.includes("=")) {
              var _temp3 = innerTagContents.split("=")[0];
              if (_temp3.split("").some(function (_char) {
                return !_char.trim().length;
              })) {
                for (var z = _i + _temp3.length; z--;) {
                  if (!str[z].trim().length) {
                    attributeOnTheRightBeginsAt = z + 1;
                    break;
                  }
                  if (z === _i) {
                    break;
                  }
                }
                var temp2 = stringLeftRight.left(str, attributeOnTheRightBeginsAt);
                if (!charIsQuote$1(temp2)) {
                  startingPoint = temp2 + 1;
                }
              }
            }
            var caughtAttrEnd = null;
            var caughtAttrStart = null;
            var finalClosingQuotesShouldBeAt = null;
            var boolAttrFound = false;
            for (var _z = startingPoint; _z--; _z > _i) {
              if (str[_z] === "=") {
                break;
              }
              if (caughtAttrEnd === null && str[_z].trim().length) {
                caughtAttrEnd = _z + 1;
                if (boolAttrFound) {
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  boolAttrFound = false;
                }
              }
              if (!str[_z].trim().length && caughtAttrEnd) {
                caughtAttrStart = _z + 1;
                if (str[stringLeftRight.right(str, caughtAttrEnd)] === "=") {
                  var _temp4 = stringLeftRight.left(str, caughtAttrStart);
                  if (!charIsQuote$1(str[_temp4])) {
                    attributeOnTheRightBeginsAt = stringLeftRight.right(str, _temp4 + 1);
                  }
                  break;
                } else {
                  if (knownBooleanHTMLAttributes.includes(str.slice(caughtAttrStart, caughtAttrEnd))) {
                    boolAttrFound = true;
                  } else {
                    break;
                  }
                }
                caughtAttrEnd = null;
                caughtAttrStart = null;
              }
            }
            if (!finalClosingQuotesShouldBeAt && attributeOnTheRightBeginsAt) {
              finalClosingQuotesShouldBeAt = stringLeftRight.left(str, attributeOnTheRightBeginsAt) + 1;
            }
            if (caughtAttrEnd && logAttr.attrOpeningQuote && !finalClosingQuotesShouldBeAt && str[stringLeftRight.left(str, caughtAttrEnd)] !== logAttr.attrOpeningQuote.val) {
              finalClosingQuotesShouldBeAt = caughtAttrEnd;
            }
            if (finalClosingQuotesShouldBeAt) {
              submit({
                name: "tag-attribute-closing-quotation-mark-missing",
                position: [[finalClosingQuotesShouldBeAt, finalClosingQuotesShouldBeAt, logAttr.attrOpeningQuote.val]]
              });
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
            if (logAttr.attrValueStartAt < logAttr.attrValueEndAt) {
              for (var _z2 = logAttr.attrValueStartAt; _z2 < logAttr.attrValueEndAt; _z2++) {
                var _temp5 = encodeChar$1(str, _z2);
                if (_temp5) {
                  submit(_temp5);
                }
              }
            }
            if (!doNothingUntil) {
              doNothingUntil = logAttr.attrClosingQuote.pos;
              doNothingUntilReason = "missing opening quotes";
              logWhitespace.startAt = null;
            }
            logTag.attributes.push(clone(logAttr));
            resetLogAttr();
            i = _i;
            return "continue";
          } else {
            var start = logAttr.attrStartAt;
            var _temp6 = stringLeftRight.right(str, _i);
            if (str[_i] === "/" && _temp6 && str[_temp6] === ">" || str[_i] === ">") {
              for (var _y4 = logAttr.attrStartAt; _y4--;) {
                if (str[_y4].trim().length) {
                  start = _y4 + 1;
                  break;
                }
              }
            }
            submit({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, _i]]
            });
            resetLogWhitespace();
            resetLogAttr();
            _i--;
            i = _i;
            return "continue";
          }
          if (logWhitespace.startAt !== null) {
            if (str[_i] === "'" || str[_i] === '"') {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, _i]]
              });
            } else if (withinTagInnerspace$1(str, _i + 1)) {
              submit({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, _i]]
              });
              resetLogAttr();
            }
          }
        } else if (!str[_i + 1] || !stringLeftRight.right(str, _i)) {
          submit({
            name: "file-missing-ending",
            position: [[_i + 1, _i + 1]]
          });
          i = _i;
          return "continue";
        }
      }
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null && (logAttr.attrClosingQuote.pos === null || _i === logAttr.attrClosingQuote.pos) && _i > logAttr.attrOpeningQuote.pos && charIsQuote$1(str[_i])) {
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
          }
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = str[_i];
          if (logAttr.attrValue === null) {
            if (logAttr.attrOpeningQuote.pos && logAttr.attrClosingQuote.pos && logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos) {
              logAttr.attrValue = str.slice(logAttr.attrValueStartAt, _i);
            } else {
              logAttr.attrValue = "";
            }
          }
          logAttr.attrEndAt = _i;
          logAttr.attrValueEndAt = _i;
          if (withinQuotes) {
            withinQuotes = null;
          }
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8220 || charcode === 8221)) {
          var _name3 = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
          submit({
            name: _name3,
            position: [[_i, _i + 1, '"']]
          });
          logAttr.attrEndAt = _i;
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = '"';
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8216 || charcode === 8217) && (stringLeftRight.right(str, _i) !== null && (str[stringLeftRight.right(str, _i)] === ">" || str[stringLeftRight.right(str, _i)] === "/") || withinTagInnerspace$1(str, _i + 1))) {
          var _name4 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
          submit({
            name: _name4,
            position: [[_i, _i + 1, "'"]]
          });
          logAttr.attrEndAt = _i;
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = "'";
          withinQuotes = null;
          withinQuotesEndAt = null;
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        }
      }
      if (logAttr.attrOpeningQuote.val && logAttr.attrOpeningQuote.pos < _i && logAttr.attrClosingQuote.pos === null && (
      str[_i] === "/" && stringLeftRight.right(str, _i) && str[stringLeftRight.right(str, _i)] === ">" || str[_i] === ">")) {
        submit({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[_i, _i, logAttr.attrOpeningQuote.val]]
        });
        logAttr.attrClosingQuote.pos = _i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        logTag.attributes.push(clone(logAttr));
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
        }
      } else if (charcode === 13) {
        if (isStr$1(str[_i + 1]) && str[_i + 1].charCodeAt(0) === 10) {
          if (!doNothingUntil) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
              submit({
                name: "file-wrong-type-line-ending-CRLF",
                position: [[_i, _i + 2, rawEnforcedEOLChar]]
              });
            } else {
              logLineEndings.crlf.push([_i, _i + 2]);
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[_i, _i + 2]]
            });
          }
        } else {
          if (!doNothingUntil) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CR") {
              submit({
                name: "file-wrong-type-line-ending-CR",
                position: [[_i, _i + 1, rawEnforcedEOLChar]]
              });
            } else {
              logLineEndings.cr.push([_i, _i + 1]);
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[_i, _i + 1]]
            });
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
            } else {
              logLineEndings.lf.push([_i, _i + 1]);
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[_i, _i + 1]]
            });
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
        if (addThis) {
          submit({
            name: _name5,
            position: [[nearestNonWhitespaceCharIdxOnTheLeft + 1, nearestNonWhitespaceCharIdxOnTheRight, addThis]]
          });
        } else {
          submit({
            name: _name5,
            position: [[_i, _i + 1]]
          });
        }
      }
    } else if (!doNothingUntil && charcode > 126 && charcode < 160) {
      var _name6 = "bad-character-".concat(c1CharacterNames[charcode - 127]);
      submit({
        name: _name6,
        position: [[_i, _i + 1]]
      });
    } else if (!doNothingUntil && charcode === 38) {
      if (isLowerCaseLetter$1(str[stringLeftRight.right(str, _i)])) ; else {
        submit({
          name: "bad-character-unencoded-ampersand",
          position: [[_i, _i + 1, "&amp;"]]
        });
      }
    } else if (!doNothingUntil && charcode === 60) {
      var whatsOnTheRight1 = stringLeftRight.right(str, _i);
      if (whatsOnTheRight1) {
        var whatsOnTheRight2 = stringLeftRight.right(str, whatsOnTheRight1);
        if (str[whatsOnTheRight1] === "!") {
          if (whatsOnTheRight1 > _i + 1 && str[stringLeftRight.right(str, whatsOnTheRight1)] !== "[") {
            submit({
              name: "html-comment-spaces",
              position: [[_i + 1, whatsOnTheRight1]]
            });
          }
          var whatsOnTheRight3 = stringLeftRight.right(str, whatsOnTheRight2);
          if (str[whatsOnTheRight2] === "-") {
            if (whatsOnTheRight2 > whatsOnTheRight1 + 1) {
              submit({
                name: "html-comment-spaces",
                position: [[whatsOnTheRight1 + 1, whatsOnTheRight2]]
              });
            }
            var whatsOnTheRight4 = stringLeftRight.right(str, whatsOnTheRight3);
            if (str[whatsOnTheRight3] === "-") {
              logTag.comment = true;
              if (whatsOnTheRight3 > whatsOnTheRight2 + 1) {
                submit({
                  name: "html-comment-spaces",
                  position: [[whatsOnTheRight2 + 1, whatsOnTheRight3]]
                });
              }
            }
            if (str[whatsOnTheRight4] === "-") {
              var endingOfTheSequence = whatsOnTheRight4;
              var charOnTheRightAt;
              do {
                charOnTheRightAt = stringLeftRight.right(str, endingOfTheSequence);
                if (str[charOnTheRightAt] === "-") {
                  endingOfTheSequence = charOnTheRightAt;
                }
              } while (str[charOnTheRightAt] === "-");
              var charOnTheRight = stringLeftRight.right(str, endingOfTheSequence);
              submit({
                name: "html-comment-redundant-dash",
                position: [[whatsOnTheRight3 + 1, charOnTheRight]]
              });
              doNothingUntil = charOnTheRight;
              doNothingUntilReason = "repeated HTML comment dashes";
            }
          }
        } else if (str[whatsOnTheRight1] === "-") ; else {
          submitOpeningBracket(_i, _i + 1);
        }
      } else {
        submitOpeningBracket(_i, _i + 1);
      }
    } else if (!doNothingUntil && charcode === 62) {
      var whatsOnTheLeft1 = stringLeftRight.left(str, _i);
      if (str[whatsOnTheLeft1] === "-") {
        var whatsOnTheLeft2 = stringLeftRight.left(str, whatsOnTheLeft1);
        if (str[whatsOnTheLeft2] === "-") ;
      } else {
        submitClosingBracket(_i, _i + 1);
      }
    } else if (!doNothingUntil && charcode === 160) {
      var _name7 = "bad-character-unencoded-non-breaking-space";
      submit({
        name: _name7,
        position: [[_i, _i + 1, "&nbsp;"]]
      });
    } else if (!doNothingUntil && charcode === 5760) {
      var _name8 = "bad-character-ogham-space-mark";
      submit({
        name: _name8,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8192) {
      var _name9 = "bad-character-en-quad";
      submit({
        name: _name9,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8193) {
      var _name10 = "bad-character-em-quad";
      submit({
        name: _name10,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8194) {
      var _name11 = "bad-character-en-space";
      submit({
        name: _name11,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8195) {
      var _name12 = "bad-character-em-space";
      submit({
        name: _name12,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8196) {
      var _name13 = "bad-character-three-per-em-space";
      submit({
        name: _name13,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8197) {
      var _name14 = "bad-character-four-per-em-space";
      submit({
        name: _name14,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8198) {
      var _name15 = "bad-character-six-per-em-space";
      submit({
        name: _name15,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8199) {
      var _name16 = "bad-character-figure-space";
      submit({
        name: _name16,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8200) {
      var _name17 = "bad-character-punctuation-space";
      submit({
        name: _name17,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8201) {
      var _name18 = "bad-character-thin-space";
      submit({
        name: _name18,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8202) {
      var _name19 = "bad-character-hair-space";
      submit({
        name: _name19,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8203) {
      var _name20 = "bad-character-zero-width-space";
      submit({
        name: _name20,
        position: [[_i, _i + 1]]
      });
    } else if (!doNothingUntil && charcode === 8232) {
      var _name21 = "bad-character-line-separator";
      submit({
        name: _name21,
        position: [[_i, _i + 1, "\n"]]
      });
    } else if (!doNothingUntil && charcode === 8233) {
      var _name22 = "bad-character-paragraph-separator";
      submit({
        name: _name22,
        position: [[_i, _i + 1, "\n"]]
      });
    } else if (!doNothingUntil && charcode === 8239) {
      var _name23 = "bad-character-narrow-no-break-space";
      submit({
        name: _name23,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8287) {
      var _name24 = "bad-character-medium-mathematical-space";
      submit({
        name: _name24,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 12288) {
      var _name25 = "bad-character-ideographic-space";
      submit({
        name: _name25,
        position: [[_i, _i + 1, " "]]
      });
    } else if (!doNothingUntil && encodeChar$1(str, _i)) {
      var _newIssue = encodeChar$1(str, _i);
      submit(_newIssue, "raw");
    } else if (!doNothingUntil && charcode >= 888 && charcode <= 8591) {
      if (charcode === 888 || charcode === 889 || charcode >= 896 && charcode <= 899 || charcode === 907 || charcode === 909 || charcode === 930 || charcode === 1328 || charcode === 1367 || charcode === 1368 || charcode === 1419 || charcode === 1419 || charcode === 1420 || charcode === 1424 || charcode >= 1480 && charcode <= 1487 || charcode >= 1515 && charcode <= 1519 || charcode >= 1525 && charcode <= 1535 || charcode === 1565 || charcode === 1806 || charcode === 1867 || charcode === 1868 || charcode >= 1970 && charcode <= 1983 || charcode >= 2043 && charcode <= 2047 || charcode === 2094 || charcode === 2095 || charcode === 2111 || charcode === 2140 || charcode === 2141 || charcode === 2143 || charcode >= 2155 && charcode <= 2207 || charcode === 2229 || charcode >= 2238 && charcode <= 2258 || charcode === 2436 || charcode === 2445 || charcode === 2446 || charcode === 2449 || charcode === 2450 || charcode === 2473 || charcode === 2481 || charcode === 2483 || charcode === 2484 || charcode === 2485 || charcode === 2490 || charcode === 2491 || charcode === 2501 || charcode === 2502 || charcode === 2505 || charcode === 2506 || charcode >= 2511 && charcode <= 2518 || charcode >= 2520 && charcode <= 2523 || charcode === 2526 || charcode >= 8384 && charcode <= 8399 || charcode >= 8433 && charcode <= 8447 || charcode === 8588 || charcode === 8589 || charcode === 8590 || charcode === 8591) {
        var _name26 = "bad-character-generic";
        submit({
          name: _name26,
          position: [[_i, _i + 1]]
        });
      }
    } else if (charcode >= 128 && !doNothingUntil) {
      var encoded = encode$1(str.slice(_i, _i + 1));
      submit({
        name: "bad-character-unencoded-char-outside-ascii",
        position: [[_i, _i + 1, encoded]]
      });
    }
    if (!doNothingUntil && logWhitespace.startAt !== null && str[_i].trim().length) {
      if (logTag.tagNameStartAt !== null && logAttr.attrStartAt === null && (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= _i) && (str[_i] === ">" || str[_i] === "/" && "<>".includes(str[stringLeftRight.right(str, _i)]))) {
        var _name27 = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          _name27 = "tag-whitespace-closing-slash-and-bracket";
        }
        submit({
          name: _name27,
          position: [[logWhitespace.startAt, _i]]
        });
      }
    }
    if (!doNothingUntil && !str[_i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = _i;
    }
    if (!doNothingUntil && str[_i] === "\n" || str[_i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
      }
      logWhitespace.lastLinebreakAt = _i;
    }
    if (!doNothingUntil && logTag.tagStartAt !== null && logTag.tagNameStartAt === null && isLatinLetter(str[_i]) && logTag.tagStartAt < _i) {
      logTag.tagNameStartAt = _i;
      if (logTag.closing === null) {
        logTag.closing = false;
      }
      if (logTag.tagStartAt < _i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, _i]]
        });
      }
    }
    if (!doNothingUntil && logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && isUppercaseLetter(str[_i]) && !str.slice(logTag.tagNameStartAt).toLowerCase().startsWith("doctype")) {
      submit({
        name: "tag-name-lowercase",
        position: [[_i, _i + 1, str[_i].toLowerCase()]]
      });
    }
    if (!doNothingUntil && str[_i] === "/" && logTag.tagStartAt !== null && logTag.tagNameStartAt === null) {
      if (logTag.closing === null) {
        logTag.closing = true;
      }
    }
    if (!doNothingUntil && str[_i] === "<") {
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = _i;
      } else if (tagOnTheRight$1(str, _i)) {
        if (logTag.tagStartAt !== null && (logTag.attributes.length && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
        }) || isStr$1(logTag.tagName) && knownHTMLTags.includes(logTag.tagName) && stringLeftRight.right(str, logTag.tagNameEndAt - 1) === _i)) {
          var lastNonWhitespaceOnLeft = stringLeftRight.left(str, _i);
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
          } else {
            submit({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, _i, ">"]]
            });
          }
          if (rawIssueStaging.length) {
            rawIssueStaging.forEach(function (issueObj) {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                submit(issueObj);
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          logTag.tagStartAt = _i;
        } else {
          if (rawIssueStaging.length) {
            rawIssueStaging.forEach(function (issueObj) {
              if (
              issueObj.position[0][0] < _i
              ) {
                  submit(issueObj);
                }
            });
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            tagIssueStaging = [];
          }
        }
      }
    }
    if (!doNothingUntil && logTag.tagStartAt !== null && (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < _i)) {
      if (charcode === 62) {
        if (tagIssueStaging.length) {
          tagIssueStaging.forEach(function (issue) {
            submit(issue);
          });
          tagIssueStaging = [];
        }
        if (rawIssueStaging.length) {
          rawIssueStaging.forEach(function (issueObj) {
            if (issueObj.position[0][0] < logTag.tagStartAt || logTag.attributes.some(function (attrObj) {
              i = _i;
              return attrObj.attrValueStartAt < issueObj.position[0][0] && attrObj.attrValueEndAt > issueObj.position[0][0];
            }) && !retObj.issues.some(function (existingIssue) {
              i = _i;
              return existingIssue.position[0][0] === issueObj.position[0][0] && existingIssue.position[0][1] === issueObj.position[0][1];
            })) {
              submit(issueObj);
            }
          });
          rawIssueStaging = [];
        }
        if (logTag.tagName === "script") {
          doNothingUntil = true;
          doNothingUntilReason = "script tag";
        }
        resetLogTag();
        resetLogAttr();
      } else if (charcode === 47) {
        var chompedSlashes = stringLeftRight.chompRight(str, _i, {
          mode: 1
        }, "\\?*", "/*", "\\?*");
        if (str[chompedSlashes] === ">" || str[chompedSlashes] && !str[chompedSlashes].trim().length && str[stringLeftRight.right(str, chompedSlashes)] === ">") {
          if (logWhitespace.startAt !== null) {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, _i]]
            });
            resetLogWhitespace();
          }
          var _issueName = str.slice(_i + 1, chompedSlashes).includes("\\") ? "tag-closing-left-slash" : "tag-duplicate-closing-slash";
          submit({
            name: _issueName,
            position: [[_i + 1, chompedSlashes]]
          });
          doNothingUntil = chompedSlashes;
          doNothingUntilReason = "repeated slash";
        }
      } else if (charcode === 92) {
        var _chompedSlashes = stringLeftRight.chompRight(str, _i, {
          mode: 1
        }, "/?*", "\\*", "/?*");
        if (str[_chompedSlashes] === ">" || str[_chompedSlashes] && !str[_chompedSlashes].trim().length && str[stringLeftRight.right(str, _chompedSlashes)] === ">") {
          submit({
            name: "tag-closing-left-slash",
            position: [[_i, _chompedSlashes, "/"]]
          });
          doNothingUntil = _chompedSlashes;
          doNothingUntilReason = "repeated slash";
        } else if (_chompedSlashes === null && str[stringLeftRight.right(str, _i)] === ">") {
          submit({
            name: "tag-closing-left-slash",
            position: [[_i, _i + 1, "/"]]
          });
        }
        if (logWhitespace.startAt !== null) {
          submit({
            name: "tag-excessive-whitespace-inside-tag",
            position: [[logWhitespace.startAt, _i]]
          });
          resetLogWhitespace();
        }
      }
    }
    if (doNothingUntil && doNothingUntilReason === "script tag" && str[_i] === "t" && str[_i - 1] === "p" && str[_i - 2] === "i" && str[_i - 3] === "r" && str[_i - 4] === "c" && str[_i - 5] === "s" && withinQuotes === null) {
      var _charOnTheRight = stringLeftRight.right(str, _i);
      var charOnTheLeft = stringLeftRight.left(str, _i - 5);
      if (str[charOnTheLeft] === "/") {
        var charFurtherOnTheLeft = stringLeftRight.left(str, charOnTheLeft);
      } else if (str[charOnTheLeft] === "<") ;
      doNothingUntil = _charOnTheRight + 1;
    }
    if (!doNothingUntil && logWhitespace.startAt !== null && str[_i].trim().length) {
      resetLogWhitespace();
    }
    if (!str[_i + 1]) {
      if (rawIssueStaging.length) {
        if (logTag.tagStartAt !== null && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null;
        })) {
          rawIssueStaging.forEach(function (issueObj) {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              submit(issueObj);
            }
          });
          rawIssueStaging = [];
          submit({
            name: "tag-missing-closing-bracket",
            position: [[logWhitespace.startAt ? logWhitespace.startAt : _i + 1, _i + 1, ">"]]
          });
        } else if (!retObj.issues.some(function (issueObj) {
          return issueObj.name === "file-missing-ending";
        })) {
          rawIssueStaging.forEach(function (issueObj) {
            submit(issueObj);
          });
          rawIssueStaging = [];
        }
      }
    }
    var retObj_mini = clone(retObj);
    Object.keys(retObj_mini.applicableRules).forEach(function (rule) {
      if (!retObj_mini.applicableRules[rule]) {
        delete retObj_mini.applicableRules[rule];
      }
    });
    i = _i;
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret = _loop(i, len);
    if (_ret === "continue") continue;
  }
  if ((!opts.style || !opts.style.line_endings_CR_LF_CRLF) && (logLineEndings.cr.length && logLineEndings.lf.length || logLineEndings.lf.length && logLineEndings.crlf.length || logLineEndings.cr.length && logLineEndings.crlf.length)) {
    if (logLineEndings.cr.length > logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
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
  if (isArr$1(htmlEntityFixes) && htmlEntityFixes.length) {
    retObj.issues = retObj.issues.filter(function (issueObj) {
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
  }
  if (isArr$1(htmlEntityFixes) && htmlEntityFixes.length) {
    htmlEntityFixes.forEach(function (issueObj) {
      if (!retObj.applicableRules[issueObj.name]) {
        retObj.applicableRules[issueObj.name] = true;
      }
    });
  }
  retObj.fix = isArr$1(retObj.issues) && retObj.issues.length ? merge(retObj.issues.filter(function (issueObj) {
    return !errorsRules[issueObj.name] || !errorsRules[issueObj.name].unfixable;
  }).reduce(function (acc, obj) {
    return acc.concat(obj.position);
  }, [])) : null;
  return retObj;
}

exports.lint = lint;
exports.version = version;
