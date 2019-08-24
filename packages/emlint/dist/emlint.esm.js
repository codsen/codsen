/**
 * emlint
 * Non-parsing, email template-oriented linter
 * Version: 1.7.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

import fixBrokenEntities from 'string-fix-broken-named-entities';
import { notEmailFriendly } from 'all-named-html-entities';
import arrayiffy from 'arrayiffy-if-string';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';
import merge from 'ranges-merge';
import { right, left, rightSeq, leftSeq, chompLeft, chompRight } from 'string-left-right';
import he from 'he';

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
	"bad-named-html-entity-not-email-friendly": {
	description: "HTML named entity is not email template-friendly, use numeric",
	excerpt: "should be numeric entity",
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

var version = "1.7.0";

const isArr = Array.isArray;
const lowAsciiCharacterNames = [
  "null",
  "start-of-heading",
  "start-of-text",
  "end-of-text",
  "end-of-transmission",
  "enquiry",
  "acknowledge",
  "bell",
  "backspace",
  "character-tabulation",
  "line-feed",
  "line-tabulation",
  "form-feed",
  "carriage-return",
  "shift-out",
  "shift-in",
  "data-link-escape",
  "device-control-one",
  "device-control-two",
  "device-control-three",
  "device-control-four",
  "negative-acknowledge",
  "synchronous-idle",
  "end-of-transmission-block",
  "cancel",
  "end-of-medium",
  "substitute",
  "escape",
  "information-separator-four",
  "information-separator-three",
  "information-separator-two",
  "information-separator-one",
  "space",
  "exclamation-mark"
];
const c1CharacterNames = [
  "delete",
  "padding",
  "high-octet-preset",
  "break-permitted-here",
  "no-break-here",
  "index",
  "next-line",
  "start-of-selected-area",
  "end-of-selected-area",
  "character-tabulation-set",
  "character-tabulation-with-justification",
  "line-tabulation-set",
  "partial-line-forward",
  "partial-line-backward",
  "reverse-line-feed",
  "single-shift-two",
  "single-shift-three",
  "device-control-string",
  "private-use-1",
  "private-use-2",
  "set-transmit-state",
  "cancel-character",
  "message-waiting",
  "start-of-protected-area",
  "end-of-protected-area",
  "start-of-string",
  "single-graphic-character-introducer",
  "single-character-intro-introducer",
  "control-sequence-introducer",
  "string-terminator",
  "operating-system-command",
  "private-message",
  "application-program-command"
];
function charSuitableForAttrName(char) {
  const res = !`"'><=`.includes(char);
  return res;
}
function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char);
}
function onlyTheseLeadToThat(
  str,
  idx = 0,
  charWePassValidatorFuncArr,
  breakingCharValidatorFuncArr,
  terminatorCharValidatorFuncArr = null
) {
  if (typeof idx !== "number") {
    idx = 0;
  }
  if (typeof charWePassValidatorFuncArr === "function") {
    charWePassValidatorFuncArr = [charWePassValidatorFuncArr];
  }
  if (typeof breakingCharValidatorFuncArr === "function") {
    breakingCharValidatorFuncArr = [breakingCharValidatorFuncArr];
  }
  if (typeof terminatorCharValidatorFuncArr === "function") {
    terminatorCharValidatorFuncArr = [terminatorCharValidatorFuncArr];
  }
  let lastRes = false;
  for (let i = 0, len = str.length; i < len; i++) {
    if (breakingCharValidatorFuncArr.some(func => func(str[i], i))) {
      if (!terminatorCharValidatorFuncArr) {
        return i;
      }
      lastRes = i;
    }
    if (
      terminatorCharValidatorFuncArr !== null &&
      lastRes &&
      terminatorCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      return lastRes;
    }
    if (
      !charWePassValidatorFuncArr.some(func => func(str[i], i)) &&
      !breakingCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      return false;
    }
  }
}
function onlyAttrFriendlyCharsLeadingToEqual(str, idx = 0) {
  return onlyTheseLeadToThat(
    str,
    idx,
    charSuitableForAttrName,
    char => char === "="
  );
}
function charIsQuote(char) {
  const res = `"'\`\u2018\u2019\u201C\u201D`.includes(char);
  return res;
}
function isTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error(
      "emlint/util/isTagChar(): input is not a single string character!"
    );
  }
  return !`><=`.includes(char);
}
function lastChar(str) {
  if (typeof str !== "string" || !str.length) {
    return "";
  }
  return str[str.length - 1];
}
function secondToLastChar(str) {
  if (typeof str !== "string" || !str.length || str.length === 1) {
    return "";
  }
  return str[str.length - 2];
}
function firstChar(str) {
  if (typeof str !== "string" || !str.length) {
    return "";
  }
  return str[0];
}
function secondChar(str) {
  if (typeof str !== "string" || !str.length || str.length === 1) {
    return "";
  }
  return str[1];
}
function isLowerCaseLetter(char) {
  return isStr(char) && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}
function isUppercaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 64 &&
    char.charCodeAt(0) < 91
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isLowercase(char) {
  return (
    isStr(char) && char.toLowerCase() === char && char.toUpperCase() !== char
  );
}
function isLatinLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char) || char === ":";
}
function log(...pairs) {
  return pairs.reduce((accum, curr, idx, arr) => {
    if (idx === 0 && typeof curr === "string") {
      return `\u001b[${32}m${curr.toUpperCase()}\u001b[${39}m`;
    } else if (idx % 2 !== 0) {
      return `${accum} \u001b[${33}m${curr}\u001b[${39}m`;
    }
    return `${accum} = ${JSON.stringify(curr, null, 4)}${
      arr[idx + 1] ? ";" : ""
    }`;
  }, "");
}
function withinTagInnerspace(str, idx, closingQuotePos) {
  if (typeof idx !== "number") {
    if (idx == null) {
      idx = 0;
    } else {
      throw new Error(
        `emlint/util.js/withinTagInnerspace(): second argument is of a type ${typeof idx}`
      );
    }
  }
  const quotes = {
    at: null,
    last: false,
    precedes: false,
    within: false
  };
  let beginningOfAString = true;
  let r2_1 = false;
  let r2_2 = false;
  let r2_3 = false;
  let r2_4 = false;
  let r3_1 = false;
  let r3_2 = false;
  let r3_3 = false;
  let r3_4 = false;
  let r3_5 = false;
  let r4_1 = false;
  let r5_1 = false;
  let r5_2 = false;
  let r5_3 = false;
  let r6_1 = false;
  let r6_2 = false;
  let r6_3 = false;
  let r7_1 = false;
  for (let i = idx, len = str.length; i < len; i++) {
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
    if (
      quotes.at &&
      !quotes.within &&
      quotes.precedes &&
      str[i] !== str[quotes.at]
    ) {
      quotes.at = null;
    }
    if (
      !quotes.within &&
      beginningOfAString &&
      str[i] === "/" &&
      ">".includes(str[right(str, i)])
    ) {
      return true;
    }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      if (
        !str[i + 1] ||
        !right(str, i) ||
        (!str.slice(i).includes("'") && !str.slice(i).includes('"'))
      ) {
        return true;
      } else if (str[right(str, i)] === "<") {
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
    else if (
      r3_3 &&
      !r3_4 &&
      str[i].trim().length &&
      !charSuitableForTagName(str[i])
    ) {
      if (
        "<>".includes(str[i]) ||
        (str[i] === "/" && "<>".includes(right(str, i)))
      ) {
        return true;
      } else if (`='"`.includes(str[i])) {
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
    if (
      !quotes.within &&
      beginningOfAString &&
      charSuitableForAttrName(str[i]) &&
      !r2_1 &&
      (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r2_1 = true;
    }
    else if (
      !r2_2 &&
      r2_1 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r2_2 = true;
      } else if (
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        let closingBracketAt = i;
        if (str[i] === "/") {
          closingBracketAt = str[right(str, i)];
        }
        if (right(str, closingBracketAt)) {
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
      if (`'"`.includes(str[i])) {
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
          if (
            isStr(str[quotes.at]) &&
            `"'`.includes(str[quotes.at]) &&
            `"'`.includes(str[i])
          ) {
            r2_4 = true;
          } else if (
            isStr(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[i])
          ) {
            r2_4 = true;
          } else if (
            isStr(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[i])
          ) {
            r2_4 = true;
          }
        } else if (
          closingQuotePos == null &&
          withinTagInnerspace(str, null, i)
        ) {
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
    if (
      !quotes.within &&
      beginningOfAString &&
      !r4_1 &&
      charSuitableForAttrName(str[i]) &&
      (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r4_1 = true;
    }
    else if (
      r4_1 &&
      str[i].trim().length &&
      (!charSuitableForAttrName(str[i]) || str[i] === "/")
    ) {
      if (str[i] === "/" && str[right(str, i)] === ">") {
        return true;
      }
      r4_1 = false;
    }
    if (
      beginningOfAString &&
      !quotes.within &&
      !r5_1 &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i])
    ) {
      r5_1 = true;
    }
    else if (
      r5_1 &&
      !r5_2 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
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
    if (
      !quotes.within &&
      !r6_1 &&
      (charSuitableForAttrName(str[i]) || !str[i].trim().length) &&
      !charSuitableForAttrName(str[i - 1]) &&
      str[i - 1] !== "="
    ) {
      r6_1 = true;
    }
    if (
      !quotes.within &&
      r6_1 &&
      !r6_2 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
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
      else if (str[i + 1] && `/>`.includes(str[right(str, i)])) {
        return true;
      }
    }
    if (
      beginningOfAString &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i]) &&
      !r7_1
    ) {
      r7_1 = true;
    }
    if (
      r7_1 &&
      !str[i].trim().length &&
      str[i + 1] &&
      charSuitableForAttrName(str[i + 1])
    ) {
      r7_1 = false;
    }
    if (
      !quotes.within &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i]) &&
      r7_1
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
function tagOnTheRight(str, idx = 0) {
  const r1 = /^<\s*\w+\s*\/?\s*>/g;
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    passed = true;
  } else if (r2.test(whatToTest)) {
    passed = true;
  } else if (r3.test(whatToTest)) {
    passed = true;
  } else if (r4.test(whatToTest)) {
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  return res;
}
function attributeOnTheRight(str, idx = 0, closingQuoteAt = null) {
  const startingQuoteVal = str[idx];
  if (startingQuoteVal !== "'" && startingQuoteVal !== '"') {
    throw new Error(
      `1 emlint/util/attributeOnTheRight(): first character is not a single/double quote!\nstartingQuoteVal = ${JSON.stringify(
        startingQuoteVal,
        null,
        0
      )}\nstr = ${JSON.stringify(str, null, 4)}\nidx = ${JSON.stringify(
        idx,
        null,
        0
      )}`
    );
  }
  let closingQuoteMatched = false;
  let lastClosingBracket = null;
  let lastOpeningBracket = null;
  let lastSomeQuote = null;
  let lastEqual = null;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    if (
      (i === closingQuoteAt && i > idx) ||
      (closingQuoteAt === null && i > idx && str[i] === startingQuoteVal)
    ) {
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
          const correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            return lastSomeQuote;
          }
        }
        const correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          return false;
        }
      }
    }
    if (
      closingQuoteMatched &&
      lastClosingBracket &&
      lastClosingBracket > closingQuoteMatched
    ) {
      return closingQuoteAt;
    }
    if (
      closingQuoteMatched &&
      lastClosingBracket === null &&
      lastOpeningBracket === null &&
      (lastSomeQuote === null ||
        (lastSomeQuote && closingQuoteAt >= lastSomeQuote)) &&
      lastEqual === null
    ) {
      return closingQuoteAt;
    }
    if (!str[i + 1]) ;
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    const correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      return lastSomeQuote;
    }
  }
  return false;
}
function findClosingQuote(str, idx = 0) {
  let lastNonWhitespaceCharWasQuoteAt = null;
  let lastQuoteAt = null;
  const startingQuote = `"'`.includes(str[idx]) ? str[idx] : null;
  let lastClosingBracketAt = null;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      if (
        i > idx &&
        (str[i] === "'" || str[i] === '"') &&
        withinTagInnerspace(str, i + 1)
      ) {
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
          const temp = withinTagInnerspace(str, i);
          if (temp) {
            if (lastNonWhitespaceCharWasQuoteAt === idx) {
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            return lastNonWhitespaceCharWasQuoteAt;
          }
        }
      } else if (str[i] === "=") {
        const whatFollowsEq = right(str, i);
        if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
          if (
            lastQuoteAt &&
            lastQuoteAt !== idx &&
            withinTagInnerspace(str, lastQuoteAt + 1)
          ) {
            return lastQuoteAt + 1;
          } else if (!lastQuoteAt || lastQuoteAt === idx) {
            const startingPoint = str[i - 1].trim().length
              ? i - 1
              : left(str, i);
            let res;
            for (let y = startingPoint; y--; ) {
              if (!str[y].trim().length) {
                res = left(str, y) + 1;
                break;
              } else if (y === idx) {
                res = idx + 1;
                break;
              }
            }
            return res;
          }
        } else if (str[i + 1].trim().length) {
          let temp;
          for (let y = i; y--; ) {
            if (!str[y].trim().length) {
              temp = left(str, y);
              break;
            }
          }
          if (charIsQuote(temp)) {
            return temp;
          }
          return temp + 1;
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
    const openingParens = str
      .slice(espTagObj.startAt, espTagObj.endAt)
      .match(/\(/g);
    const closingParens = str
      .slice(espTagObj.startAt, espTagObj.endAt)
      .match(/\)/g);
    if (
      (isArr(openingParens) &&
        isArr(closingParens) &&
        openingParens.length !== closingParens.length) ||
      (isArr(openingParens) && !isArr(closingParens)) ||
      (!isArr(openingParens) && isArr(closingParens))
    ) {
      if (
        (isArr(openingParens) &&
          isArr(closingParens) &&
          openingParens.length > closingParens.length) ||
        (isArr(openingParens) && openingParens.length && !isArr(closingParens))
      ) {
        submit({
          name: "esp-more-opening-parentheses-than-closing",
          position: [[espTagObj.startAt, espTagObj.endAt]]
        });
      } else if (
        (isArr(openingParens) &&
          isArr(closingParens) &&
          openingParens.length < closingParens.length) ||
        (isArr(closingParens) && closingParens.length && !isArr(openingParens))
      ) {
        submit({
          name: "esp-more-closing-parentheses-than-opening",
          position: [[espTagObj.startAt, espTagObj.endAt]]
        });
      }
    }
  }
}
function encode(str, mode = "html") {
  if (mode === "html") {
    let encoded = he.encode(str, {
      useNamedReferences: true
    });
    if (
      typeof encoded === "string" &&
      encoded.length &&
      encoded.startsWith("&") &&
      encoded.endsWith(";") &&
      typeof notEmailFriendly === "object" &&
      Object.prototype.hasOwnProperty.call(
        notEmailFriendly,
        encoded.slice(1, encoded.length - 1)
      )
    ) {
      encoded = `&${notEmailFriendly[encoded.slice(1, encoded.length - 1)]};`;
    }
    return encoded;
  }
}

var util = /*#__PURE__*/Object.freeze({
  characterSuitableForNames: characterSuitableForNames,
  charSuitableForAttrName: charSuitableForAttrName,
  charSuitableForTagName: charSuitableForTagName,
  lowAsciiCharacterNames: lowAsciiCharacterNames,
  attributeOnTheRight: attributeOnTheRight,
  onlyTheseLeadToThat: onlyTheseLeadToThat,
  withinTagInnerspace: withinTagInnerspace,
  isLowerCaseLetter: isLowerCaseLetter,
  isUppercaseLetter: isUppercaseLetter,
  findClosingQuote: findClosingQuote,
  secondToLastChar: secondToLastChar,
  c1CharacterNames: c1CharacterNames,
  tagOnTheRight: tagOnTheRight,
  isLatinLetter: isLatinLetter,
  isLowercase: isLowercase,
  charIsQuote: charIsQuote,
  pingEspTag: pingEspTag,
  encodeChar: encodeChar,
  secondChar: secondChar,
  firstChar: firstChar,
  isTagChar: isTagChar,
  lastChar: lastChar,
  encode: encode,
  isStr: isStr,
  isNum: isNum,
  flip: flip,
  log: log
});

const isArr$1 = Array.isArray;
const {
  characterSuitableForNames: characterSuitableForNames$1,
  attributeOnTheRight: attributeOnTheRight$1,
  withinTagInnerspace: withinTagInnerspace$1,
  isLowerCaseLetter: isLowerCaseLetter$1,
  findClosingQuote: findClosingQuote$1,
  tagOnTheRight: tagOnTheRight$1,
  isLatinLetter: isLatinLetter$1,
  charIsQuote: charIsQuote$1,
  encodeChar: encodeChar$1,
  pingEspTag: pingEspTag$1,
  encode: encode$1,
  isStr: isStr$1,
  flip: flip$1,
  log: log$1
} = util;
function lint(str, originalOpts) {
  function pingTag(logTag) {
  }
  if (!isStr$1(str)) {
    throw new Error(
      `emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  const defaults = {
    rules: {},
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };
  let opts;
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
        } else if (
          opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf"
        ) {
          if (opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
            opts.style.line_endings_CR_LF_CRLF === "CRLF";
          }
        } else {
          throw new Error(
            `emlint: [THROW_ID_04] opts.style.line_endings_CR_LF_CRLF should be either falsey or string "CR" or "LF" or "CRLF". It was given as:\n${JSON.stringify(
              opts.style.line_endings_CR_LF_CRLF,
              null,
              4
            )} (type is string)`
          );
        }
      }
    } else {
      throw new Error(
        `emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
          originalOpts,
          null,
          4
        )} (type ${typeof originalOpts})`
      );
    }
  } else {
    opts = clone(defaults);
  }
  let rawEnforcedEOLChar;
  if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
    if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
      rawEnforcedEOLChar = "\r";
    } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
      rawEnforcedEOLChar = "\r\n";
    } else {
      rawEnforcedEOLChar = "\n";
    }
  }
  let doNothingUntil = null;
  let doNothingUntilReason = null;
  let ampersandStage = [];
  let logTag;
  const defaultLogTag = {
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
  let logAttr;
  const defaultLogAttr = {
    attrStartAt: null,
    attrEndAt: null,
    attrNameStartAt: null,
    attrNameEndAt: null,
    attrName: null,
    attrValue: null,
    attrValueStartAt: null,
    attrValueEndAt: null,
    attrEqualAt: null,
    attrOpeningQuote: { pos: null, val: null },
    attrClosingQuote: { pos: null, val: null },
    recognised: null,
    pureHTML: true
  };
  function resetLogAttr() {
    logAttr = clone(defaultLogAttr);
  }
  resetLogAttr();
  let logEspTag;
  const defaultEspTag = {
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
  const espChars = `{}%-$_()*|`;
  const espCharsFunc = `$`;
  let logWhitespace;
  const defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();
  let tagIssueStaging = [];
  let rawIssueStaging = [];
  const retObj = {
    issues: [],
    applicableRules: {}
  };
  Object.keys(errorsRules)
    .concat(Object.keys(errorsCharacters))
    .sort()
    .forEach(ruleName => {
      retObj.applicableRules[ruleName] = false;
    });
  function submit(issueObj, whereTo) {
    if (whereTo !== "raw" && whereTo !== "tag") {
      retObj.applicableRules[issueObj.name] = true;
    }
    if (
      !Object.prototype.hasOwnProperty.call(opts.rules, issueObj.name) ||
      opts.rules[issueObj.name]
    ) {
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
    submit(
      {
        name: "bad-character-unencoded-opening-bracket",
        position: [[from, to, "&lt;"]]
      },
      "raw"
    );
  }
  function submitClosingBracket(from, to) {
    submit(
      {
        name: "bad-character-unencoded-closing-bracket",
        position: [[from, to, "&gt;"]]
      },
      "raw"
    );
  }
  const logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };
  let withinQuotes = null;
  let withinQuotesEndAt = null;
  if (str.length === 0) {
    submit({
      name: "file-empty",
      position: [[0, 0]]
    });
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      logEspTag.headVal !== null &&
      i === logEspTag.headEndAt &&
      doNothingUntil === null
    ) {
      doNothingUntil = true;
      doNothingUntilReason = "esp";
    }
    const charcode = str[i].charCodeAt(0);
    if (doNothingUntil && doNothingUntil !== true && i >= doNothingUntil) {
      doNothingUntil = null;
      doNothingUntilReason = null;
    }
    if (
      str[i + 4] &&
      str[i].toLowerCase() === "c" &&
      rightSeq(
        str,
        i,
        { i: true },
        "d*",
        "a*",
        "t*",
        "a*",
        "[?*",
        "]?",
        "[?*"
      ) &&
      ("<![".includes(str[left(str, i)]) ||
        (str[i - 1] &&
          !"<![".includes(str[i - 1]) &&
          str[i - 2] === "[" &&
          str[i - 3] === "!" &&
          str[i - 4] === "<" &&
          (!str[i - 5] ||
            (str[i - 5].trim().length && !"<![".includes(str[i - 5])))) ||
        (str[i - 1] &&
          !"<![".includes(str[i - 1]) &&
          str[i - 2] === "!" &&
          str[i - 3] === "<" &&
          (!str[i - 4] ||
            (str[i - 4].trim().length && !"<![".includes(str[i - 4]))))) &&
      leftSeq(str, i, "&", "l", "t", ";", "!", "[") === null
    ) {
      const rightSideOfCdataOpening =
        right(
          str,
          rightSeq(
            str,
            i,
            { i: true },
            "d*",
            "a*",
            "t*",
            "a*",
            "[?*",
            "]?",
            "[?*"
          ).rightmostChar
        ) - 1;
      let leftChomp = chompLeft(str, i, "<?*", "!?*", "[?*", "]?*");
      if (
        (!`<![`.includes(str[i - 1]) &&
          str[i - 2] === "[" &&
          str[i - 3] === "!" &&
          str[i - 4] === "<" &&
          (!str[i - 5] || !`<![`.includes(str[i - 5]))) ||
        (str[i - 1] === "[" &&
          !`<![`.includes(str[i - 2]) &&
          str[i - 3] === "!" &&
          str[i - 4] === "<" &&
          (!str[i - 5] || !`<![`.includes(str[i - 5]))) ||
        (str[i - 1] === "[" &&
          str[i - 2] === "!" &&
          !`<![`.includes(str[i - 3]) &&
          str[i - 4] === "<" &&
          (!str[i - 5] || !`<![`.includes(str[i - 5])))
      ) {
        leftChomp = Math.min(leftChomp, i - 4);
      } else if (
        (!`<![`.includes(str[i - 1]) &&
          str[i - 2] === "!" &&
          str[i - 3] === "<" &&
          (!str[i - 4] || !`<![`.includes(str[i - 4]))) ||
        (str[i - 1] === "[" &&
          !`<![`.includes(str[i - 2]) &&
          str[i - 3] === "<" &&
          (!str[i - 4] || !`<![`.includes(str[i - 4])))
      ) {
        leftChomp = Math.min(leftChomp, i - 3);
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
        rawIssueStaging.forEach(issueObj => {
          if (issueObj.position[0][0] < leftChomp) {
            submit(issueObj);
          }
        });
        rawIssueStaging = [];
      }
      i = rightSideOfCdataOpening;
      continue;
    }
    if (
      doNothingUntil === true &&
      doNothingUntilReason === "cdata" &&
      `[]`.includes(str[i])
    ) {
      let temp = chompRight(str, i, "[?*", "]?*", "[?*", "]?*", ">");
      if (
        (str[i] === "]" &&
          str[i + 1] &&
          str[i + 1].trim().length &&
          !`>]`.includes(str[i + 1]) &&
          str[i + 2] === "]" &&
          str[i + 3] === ">") ||
        (str[i] === "]" &&
          str[i + 1] === "]" &&
          str[i + 2] &&
          str[i + 2].trim().length &&
          !`>]`.includes(str[i + 2]) &&
          str[i + 3] === ">")
      ) {
        temp = Math.max(temp || i + 4, i + 4);
      } else if (
        str[i] === "]" &&
        str[i + 1] &&
        str[i + 1].trim().length &&
        !`>]`.includes(str[i + 1]) &&
        str[i + 2] === ">"
      ) {
        temp = Math.max(temp || i + 3, i + 3);
      }
      if (temp) {
        if (str.slice(i, temp) !== "]]>") {
          submit({
            name: "bad-cdata-tag-malformed",
            position: [[i, temp, "]]>"]]
          });
        }
        doNothingUntil = i + 3;
      }
    }
    if (
      doNothingUntil === null ||
      ((doNothingUntil !== null && doNothingUntilReason !== "script tag") ||
        (doNothingUntilReason === "script tag" &&
          (str[i - 1] !== "\\" || str[i - 2] === "\\")))
    ) {
      if (withinQuotes === null && `"'\``.includes(str[i])) {
        withinQuotes = i;
      } else if (
        withinQuotes !== null &&
        str[withinQuotes] === str[i] &&
        (!withinQuotesEndAt || withinQuotesEndAt === i)
      ) {
        withinQuotes = null;
        withinQuotesEndAt = null;
      }
    }
    if (withinQuotesEndAt && withinQuotesEndAt === i) {
      withinQuotes = null;
      withinQuotesEndAt = null;
    }
    if (
      !doNothingUntil &&
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      !isLatinLetter(str[i])
    ) {
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      if (charIsQuote$1(str[i]) || str[i] === "=") {
        let addSpace;
        let strayCharsEndAt = i + 1;
        if (str[i + 1].trim().length) {
          if (charIsQuote$1(str[i + 1]) || str[i + 1] === "=") {
            for (let y = i + 1; y < len; y++) {
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
            position: [[i, strayCharsEndAt, " "]]
          });
        } else {
          submit({
            name: "tag-stray-character",
            position: [[i, strayCharsEndAt]]
          });
        }
      }
    }
    if (
      doNothingUntil &&
      doNothingUntilReason === "esp" &&
      logEspTag.tailStartAt &&
      logEspTag.tailEndAt === null &&
      !espChars.includes(str[i + 1])
    ) {
      doNothingUntil = i + 1;
    }
    if (
      doNothingUntil &&
      doNothingUntilReason === "esp" &&
      logEspTag.headVal &&
      logEspTag.tailStartAt === null
    ) {
      let temp1;
      if (
        logEspTag.recognised &&
        arrayiffy(knownESPTags[logEspTag.headVal].sibling).some(closingVal => {
          if (rightSeq(str, i, ...closingVal.split(""))) {
            temp1 = closingVal;
            return true;
          }
        })
      ) {
        const tempEnd = rightSeq(str, i, ...temp1.split(""));
        logEspTag.tailStartAt = tempEnd.leftmostChar;
        logEspTag.tailEndAt = tempEnd.rightmostChar + 1;
        logEspTag.tailVal = str.slice(
          logEspTag.tailStartAt,
          logEspTag.tailEndAt
        );
        logEspTag.endAt = logEspTag.tailEndAt;
        doNothingUntil = logEspTag.endAt;
        pingEspTag$1(str, logEspTag, submit);
        resetEspTag();
      } else if (flip$1(logEspTag.headVal).includes(str[i])) {
        if (
          espChars.includes(str[right(str, i)]) ||
          logEspTag.headVal.includes(str[i]) ||
          flip$1(logEspTag.headVal).includes(str[i])
        ) {
          logEspTag.tailStartAt = i;
        }
      }
    }
    if (
      logEspTag.headStartAt !== null &&
      logEspTag.headEndAt === null &&
      i > logEspTag.headStartAt &&
      (str[i + 1] &&
        (!str[i + 1].trim().length || !espChars.includes(str[i + 1])))
    ) {
      if (
        !logEspTag.recognised ||
        knownESPTags[logEspTag.headVal].type === "opening"
      ) {
        if (str.slice(logEspTag.headStartAt, i + 1) !== "--") {
          logEspTag.headEndAt = i + 1;
          logEspTag.headVal = str.slice(logEspTag.headStartAt, i + 1);
          logEspTag.recognised = Object.prototype.hasOwnProperty.call(
            knownESPTags,
            logEspTag.headVal
          );
        }
      }
    }
    if (
      !logTag.comment &&
      logEspTag.startAt === null &&
      logEspTag.headStartAt === null &&
      espChars.includes(str[i]) &&
      str[i + 1] &&
      !leftSeq(str, i, "<", "!") &&
      (!doNothingUntil || doNothingUntil === true)
    ) {
      if (espChars.includes(str[i + 1])) {
        logEspTag.headStartAt = i;
        logEspTag.startAt = i;
        logEspTag.type = "tag-based";
      } else if (
        espCharsFunc.includes(str[i]) &&
        isLowerCaseLetter$1(str[i + 1])
      ) {
        logEspTag.headStartAt = i;
        logEspTag.startAt = i;
        logEspTag.headEndAt = i + 1;
        logEspTag.headVal = str[i];
        logEspTag.type = "function-based";
        logEspTag.recognised = Object.prototype.hasOwnProperty.call(
          knownESPTags,
          str[i]
        );
      }
      if (
        logEspTag.headStartAt !== null &&
        logWhitespace.startAt !== null &&
        logWhitespace.startAt < i - 1 &&
        !logWhitespace.includesLinebreaks
      ) {
        submit({
          name: "tag-excessive-whitespace-inside-tag",
          position: [[logWhitespace.startAt + 1, i]]
        });
      }
    }
    if (!doNothingUntil && logTag.tagNameEndAt !== null) {
      if (
        logAttr.attrNameStartAt !== null &&
        logAttr.attrNameEndAt === null &&
        logAttr.attrName === null &&
        !isLatinLetter(str[i]) &&
        (str[i] !== ":" || !isLatinLetter(str[i + 1]))
      ) {
        logAttr.attrNameEndAt = i;
        logAttr.attrName = str.slice(
          logAttr.attrNameStartAt,
          logAttr.attrNameEndAt
        );
        if (str[i] !== "=") {
          if (str[right(str, i)] === "=") ;
        }
      }
      if (
        logAttr.attrNameEndAt !== null &&
        logAttr.attrEqualAt === null &&
        i >= logAttr.attrNameEndAt &&
        str[i].trim().length
      ) {
        let temp;
        if (str[i] === "'" || str[i] === '"') {
          temp = attributeOnTheRight$1(str, i);
        }
        if (str[i] === "=") {
          logAttr.attrEqualAt = i;
          if (str[i + 1]) {
            const nextCharOnTheRightAt = right(str, i);
            if (str[nextCharOnTheRightAt] === "=") {
              let nextEqualStartAt = i + 1;
              let nextEqualEndAt = nextCharOnTheRightAt + 1;
              doNothingUntil = nextEqualEndAt;
              doNothingUntilReason = "repeated equals";
              while (nextEqualStartAt && nextEqualEndAt) {
                submit({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                const temp = right(str, nextEqualEndAt - 1);
                if (str[temp] === "=") {
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = temp + 1;
                  doNothingUntil = nextEqualEndAt;
                  doNothingUntilReason = "already processed equals";
                } else {
                  nextEqualStartAt = null;
                }
              }
            }
          }
        } else if (temp) {
          submit({
            name: "tag-attribute-missing-equal",
            position: [[i, i, "="]]
          });
          logAttr.attrEqualAt = i;
          logAttr.attrValueStartAt = i + 1;
          logAttr.attrValueEndAt = temp;
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = str[i];
          logAttr.attrClosingQuote.pos = temp;
          logAttr.attrClosingQuote.val = str[temp];
          logAttr.attrValue = str.slice(i + 1, temp);
        } else {
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[i] === "=") {
            submit({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, i]]
            });
            resetLogWhitespace();
          } else if (isLatinLetter(str[i])) {
            logTag.attributes.push(clone(logAttr));
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < i) {
                  submit({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, i]]
                  });
                }
              } else {
                submit({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, i, " "]]
                });
              }
            }
          }
        }
      }
      if (logAttr.attrStartAt === null && isLatinLetter(str[i])) {
        logAttr.attrStartAt = i;
        logAttr.attrNameStartAt = i;
        if (logWhitespace.startAt !== null && logWhitespace.startAt < i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, i]]
            });
          } else {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, i, " "]]
            });
          }
        }
        if (str[i - 1]) {
          if (charIsQuote$1(str[i - 1])) {
            for (let y = i - 1; y--; ) {
              if (!charIsQuote$1(str[y])) {
                if (!str[y].trim().length) {
                  submit({
                    name: "tag-stray-character",
                    position: [[y + 1, i]]
                  });
                }
                break;
              }
            }
          }
        }
      }
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos === null
      ) {
        if (logAttr.attrEqualAt < i && str[i].trim().length) {
          if (charcode === 34 || charcode === 39) {
            if (logWhitespace.startAt && logWhitespace.startAt < i) {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
            }
            resetLogWhitespace();
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = str[i];
            const closingQuotePeek = findClosingQuote$1(str, i);
            if (closingQuotePeek) {
              if (str[closingQuotePeek] !== str[i]) {
                if (
                  str[closingQuotePeek] === "'" ||
                  str[closingQuotePeek] === '"'
                ) {
                  const isDouble = str[closingQuotePeek] === '"';
                  const name = `tag-attribute-mismatching-quotes-is-${
                    isDouble ? "double" : "single"
                  }`;
                  submit({
                    name: name,
                    position: [
                      [
                        closingQuotePeek,
                        closingQuotePeek + 1,
                        `${isDouble ? "'" : '"'}`
                      ]
                    ]
                  });
                } else {
                  const compensation = "";
                  let fromPositionToInsertAt = str[closingQuotePeek - 1].trim()
                    .length
                    ? closingQuotePeek
                    : left(str, closingQuotePeek) + 1;
                  let toPositionToInsertAt = closingQuotePeek;
                  if (str[left(str, closingQuotePeek)] === "/") {
                    toPositionToInsertAt = left(str, closingQuotePeek);
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      submit({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                    }
                    fromPositionToInsertAt =
                      left(str, toPositionToInsertAt) + 1;
                  }
                  submit({
                    name: "tag-attribute-closing-quotation-mark-missing",
                    position: [
                      [
                        fromPositionToInsertAt,
                        toPositionToInsertAt,
                        `${str[i]}${compensation}`
                      ]
                    ]
                  });
                }
              }
              logAttr.attrClosingQuote.pos = closingQuotePeek;
              logAttr.attrClosingQuote.val = str[i];
              logAttr.attrValue = str.slice(i + 1, closingQuotePeek);
              logAttr.attrValueStartAt = i + 1;
              logAttr.attrValueEndAt = closingQuotePeek;
              logAttr.attrEndAt = closingQuotePeek;
              for (let y = i + 1; y < closingQuotePeek; y++) {
                const newIssue = encodeChar$1(str, y);
                if (newIssue) {
                  tagIssueStaging.push(newIssue);
                }
              }
              if (rawIssueStaging.length) ;
              if (
                logAttr.attrNameStartAt &&
                str[logAttr.attrNameStartAt - 1].trim().length &&
                (!opts.rules || opts.rules["tag-stray-character"] !== false) &&
                !retObj.issues.some(issueObj => {
                  return (
                    (issueObj.name === "tag-stray-quotes" ||
                      issueObj.name === "tag-stray-character") &&
                    issueObj.position[0][1] === logAttr.attrNameStartAt
                  );
                })
              ) {
                submit({
                  name: "tag-missing-space-before-attribute",
                  position: [
                    [logAttr.attrNameStartAt, logAttr.attrNameStartAt, " "]
                  ]
                });
              }
              logTag.attributes.push(clone(logAttr));
              if (str[closingQuotePeek].trim().length) {
                const calculatedDoNothingUntil =
                  closingQuotePeek -
                  (charIsQuote$1(str[closingQuotePeek]) ? 0 : 1) +
                  1;
                if (calculatedDoNothingUntil > i) {
                  doNothingUntil = calculatedDoNothingUntil;
                  doNothingUntilReason = "closing quote looked up";
                }
              } else {
                const calculatedDoNothingUntil =
                  left(str, closingQuotePeek) + 1;
                if (calculatedDoNothingUntil > i) {
                  doNothingUntil = calculatedDoNothingUntil;
                  doNothingUntilReason = "closing quote looked up";
                }
              }
              if (withinQuotes !== null) {
                withinQuotesEndAt = logAttr.attrClosingQuote.pos;
              }
              resetLogAttr();
              if (
                i === len - 1 &&
                logTag.tagStartAt !== null &&
                ((logAttr.attrEqualAt !== null &&
                  logAttr.attrOpeningQuote.pos !== null) ||
                  logTag.attributes.some(
                    attrObj =>
                      attrObj.attrEqualAt !== null &&
                      attrObj.attrOpeningQuote.pos !== null
                  ))
              ) {
                submit({
                  name: "tag-missing-closing-bracket",
                  position: [[i + 1, i + 1, ">"]]
                });
              }
              continue;
            }
          } else if (charcode === 8220 || charcode === 8221) {
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `"`;
            const name =
              charcode === 8220
                ? "tag-attribute-left-double-quotation-mark"
                : "tag-attribute-right-double-quotation-mark";
            submit({
              name,
              position: [[i, i + 1, `"`]]
            });
            logAttr.attrValueStartAt = i + 1;
            withinQuotes = i;
          } else if (charcode === 8216 || charcode === 8217) {
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `'`;
            const name =
              charcode === 8216
                ? "tag-attribute-left-single-quotation-mark"
                : "tag-attribute-right-single-quotation-mark";
            submit({
              name,
              position: [[i, i + 1, `'`]]
            });
            logAttr.attrValueStartAt = i + 1;
            withinQuotes = i;
          } else if (!withinTagInnerspace$1(str, i)) {
            const closingQuotePeek = findClosingQuote$1(str, i);
            const quoteValToPut = charIsQuote$1(str[closingQuotePeek])
              ? str[closingQuotePeek]
              : `"`;
            submit({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[left(str, i) + 1, i, quoteValToPut]]
            });
            logAttr.attrOpeningQuote = {
              pos: i,
              val: quoteValToPut
            };
            logAttr.attrValueStartAt = i;
            withinQuotes = i;
            let innerTagEndsAt = null;
            for (let y = i; y < len; y++) {
              if (
                str[y] === ">" &&
                ((str[left(str, y)] !== "/" && withinTagInnerspace$1(str, y)) ||
                  str[left(str, y)] === "/")
              ) {
                const leftAt = left(str, y);
                innerTagEndsAt = y;
                if (str[leftAt] === "/") {
                  innerTagEndsAt = leftAt;
                }
              }
              const dealBrakerCharacters = `=<`;
              if (
                innerTagEndsAt !== null &&
                dealBrakerCharacters.includes(str[y])
              ) {
                break;
              }
            }
            let innerTagContents;
            if (i < innerTagEndsAt) {
              innerTagContents = str.slice(i, innerTagEndsAt);
            } else {
              innerTagContents = "";
            }
            let startingPoint = innerTagEndsAt;
            let attributeOnTheRightBeginsAt;
            if (innerTagContents.includes("=")) {
              const temp1 = innerTagContents.split("=")[0];
              if (temp1.split("").some(char => !char.trim().length)) {
                for (let z = i + temp1.length; z--; ) {
                  if (!str[z].trim().length) {
                    attributeOnTheRightBeginsAt = z + 1;
                    break;
                  }
                  if (z === i) {
                    break;
                  }
                }
                const temp2 = left(str, attributeOnTheRightBeginsAt);
                if (!charIsQuote$1(temp2)) {
                  startingPoint = temp2 + 1;
                }
              }
            }
            let caughtAttrEnd = null;
            let caughtAttrStart = null;
            let finalClosingQuotesShouldBeAt = null;
            let boolAttrFound = false;
            for (let z = startingPoint; z--; z > i) {
              if (str[z] === "=") {
                break;
              }
              if (caughtAttrEnd === null && str[z].trim().length) {
                caughtAttrEnd = z + 1;
                if (boolAttrFound) {
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  boolAttrFound = false;
                }
              }
              if (!str[z].trim().length && caughtAttrEnd) {
                caughtAttrStart = z + 1;
                if (str[right(str, caughtAttrEnd)] === "=") {
                  const temp1 = left(str, caughtAttrStart);
                  if (!charIsQuote$1(str[temp1])) {
                    attributeOnTheRightBeginsAt = right(str, temp1 + 1);
                  }
                  break;
                } else {
                  if (
                    knownBooleanHTMLAttributes.includes(
                      str.slice(caughtAttrStart, caughtAttrEnd)
                    )
                  ) {
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
              finalClosingQuotesShouldBeAt =
                left(str, attributeOnTheRightBeginsAt) + 1;
            }
            if (
              caughtAttrEnd &&
              logAttr.attrOpeningQuote &&
              !finalClosingQuotesShouldBeAt &&
              str[left(str, caughtAttrEnd)] !== logAttr.attrOpeningQuote.val
            ) {
              finalClosingQuotesShouldBeAt = caughtAttrEnd;
            }
            if (finalClosingQuotesShouldBeAt) {
              submit({
                name: "tag-attribute-closing-quotation-mark-missing",
                position: [
                  [
                    finalClosingQuotesShouldBeAt,
                    finalClosingQuotesShouldBeAt,
                    logAttr.attrOpeningQuote.val
                  ]
                ]
              });
              logAttr.attrClosingQuote.pos = finalClosingQuotesShouldBeAt;
              logAttr.attrValueEndAt = finalClosingQuotesShouldBeAt;
              logAttr.attrEndAt = finalClosingQuotesShouldBeAt + 1;
            } else {
              logAttr.attrClosingQuote.pos = left(str, caughtAttrEnd);
              logAttr.attrValueEndAt = logAttr.attrClosingQuote.pos;
              logAttr.attrEndAt = caughtAttrEnd;
            }
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            logAttr.attrValue = str.slice(
              logAttr.attrOpeningQuote.pos,
              logAttr.attrClosingQuote.pos
            );
            if (logAttr.attrValueStartAt < logAttr.attrValueEndAt) {
              for (
                let z = logAttr.attrValueStartAt;
                z < logAttr.attrValueEndAt;
                z++
              ) {
                const temp = encodeChar$1(str, z);
                if (temp) {
                  submit(temp);
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
            continue;
          } else {
            let start = logAttr.attrStartAt;
            const temp = right(str, i);
            if (
              (str[i] === "/" && temp && str[temp] === ">") ||
              str[i] === ">"
            ) {
              for (let y = logAttr.attrStartAt; y--; ) {
                if (str[y].trim().length) {
                  start = y + 1;
                  break;
                }
              }
            }
            submit({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, i]]
            });
            resetLogWhitespace();
            resetLogAttr();
            i--;
            continue;
          }
          if (logWhitespace.startAt !== null) {
            if (str[i] === "'" || str[i] === '"') {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
            } else if (withinTagInnerspace$1(str, i + 1)) {
              submit({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, i]]
              });
              resetLogAttr();
            }
          }
        } else if (!str[i + 1] || !right(str, i)) {
          submit({
            name: "file-missing-ending",
            position: [[i + 1, i + 1]]
          });
          continue;
        }
      }
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos !== null &&
        (logAttr.attrClosingQuote.pos === null ||
          i === logAttr.attrClosingQuote.pos) &&
        i > logAttr.attrOpeningQuote.pos &&
        charIsQuote$1(str[i])
      ) {
        if (charcode === 34 || charcode === 39) {
          const issueName = `tag-attribute-mismatching-quotes-is-${
            charcode === 34 ? "double" : "single"
          }`;
          if (
            str[i] !== logAttr.attrOpeningQuote.val &&
            (!retObj.issues.length ||
              !retObj.issues.some(issueObj => {
                return (
                  issueObj.name === issueName &&
                  issueObj.position.length === 1 &&
                  issueObj.position[0][0] === i &&
                  issueObj.position[0][1] === i + 1
                );
              }))
          ) {
            submit({
              name: issueName,
              position: [[i, i + 1, `${charcode === 34 ? "'" : '"'}`]]
            });
          }
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = str[i];
          if (logAttr.attrValue === null) {
            if (
              logAttr.attrOpeningQuote.pos &&
              logAttr.attrClosingQuote.pos &&
              logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos
            ) {
              logAttr.attrValue = str.slice(logAttr.attrValueStartAt, i);
            } else {
              logAttr.attrValue = "";
            }
          }
          logAttr.attrEndAt = i;
          logAttr.attrValueEndAt = i;
          if (withinQuotes) {
            withinQuotes = null;
          }
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (
          isStr$1(logAttr.attrOpeningQuote.val) &&
          (charcode === 8220 || charcode === 8221)
        ) {
          const name =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          submit({
            name: name,
            position: [[i, i + 1, '"']]
          });
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = '"';
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (
          isStr$1(logAttr.attrOpeningQuote.val) &&
          (charcode === 8216 || charcode === 8217) &&
          ((right(str, i) !== null &&
            (str[right(str, i)] === ">" || str[right(str, i)] === "/")) ||
            withinTagInnerspace$1(str, i + 1))
        ) {
          const name =
            charcode === 8216
              ? "tag-attribute-left-single-quotation-mark"
              : "tag-attribute-right-single-quotation-mark";
          submit({
            name: name,
            position: [[i, i + 1, `'`]]
          });
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = "'";
          withinQuotes = null;
          withinQuotesEndAt = null;
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        }
      }
      if (
        logAttr.attrOpeningQuote.val &&
        logAttr.attrOpeningQuote.pos < i &&
        logAttr.attrClosingQuote.pos === null &&
        ((str[i] === "/" && right(str, i) && str[right(str, i)] === ">") ||
          str[i] === ">")
      ) {
        submit({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[i, i, logAttr.attrOpeningQuote.val]]
        });
        logAttr.attrClosingQuote.pos = i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        logTag.attributes.push(clone(logAttr));
        resetLogAttr();
      }
    }
    if (charcode < 32) {
      const name = `bad-character-${lowAsciiCharacterNames[charcode]}`;
      if (charcode === 9) {
        if (!doNothingUntil) {
          submit({
            name,
            position: [[i, i + 1, "  "]]
          });
        }
      } else if (charcode === 13) {
        if (isStr$1(str[i + 1]) && str[i + 1].charCodeAt(0) === 10) {
          if (!doNothingUntil) {
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "CRLF"
            ) {
              submit({
                name: "file-wrong-type-line-ending-CRLF",
                position: [[i, i + 2, rawEnforcedEOLChar]]
              });
            } else {
              logLineEndings.crlf.push([i, i + 2]);
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[i, i + 2]]
            });
          }
        } else {
          if (!doNothingUntil) {
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "CR"
            ) {
              submit({
                name: "file-wrong-type-line-ending-CR",
                position: [[i, i + 1, rawEnforcedEOLChar]]
              });
            } else {
              logLineEndings.cr.push([i, i + 1]);
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[i, i + 1]]
            });
          }
        }
      } else if (charcode === 10) {
        if (!(isStr$1(str[i - 1]) && str[i - 1].charCodeAt(0) === 13)) {
          if (!doNothingUntil) {
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "LF"
            ) {
              submit({
                name: "file-wrong-type-line-ending-LF",
                position: [[i, i + 1, rawEnforcedEOLChar]]
              });
            } else {
              logLineEndings.lf.push([i, i + 1]);
            }
          }
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[i, i + 1]]
            });
          }
        }
      } else if (!doNothingUntil) {
        const nearestNonWhitespaceCharIdxOnTheLeft = left(str, i);
        const nearestNonWhitespaceCharIdxOnTheRight = right(str, i);
        let addThis;
        if (
          nearestNonWhitespaceCharIdxOnTheLeft < i - 1 &&
          (nearestNonWhitespaceCharIdxOnTheRight > i + 1 ||
            (nearestNonWhitespaceCharIdxOnTheRight === null &&
              str[i + 1] &&
              str[i + 1] !== "\n" &&
              str[i + 1] !== "\r" &&
              !str[i + 1].trim().length))
        ) {
          const tempWhitespace = str.slice(
            nearestNonWhitespaceCharIdxOnTheLeft + 1,
            nearestNonWhitespaceCharIdxOnTheRight
          );
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
            name,
            position: [
              [
                nearestNonWhitespaceCharIdxOnTheLeft + 1,
                nearestNonWhitespaceCharIdxOnTheRight,
                addThis
              ]
            ]
          });
        } else {
          submit({
            name,
            position: [[i, i + 1]]
          });
        }
      }
    } else if (!doNothingUntil && charcode > 126 && charcode < 160) {
      const name = `bad-character-${c1CharacterNames[charcode - 127]}`;
      submit({
        name,
        position: [[i, i + 1]]
      });
    } else if (!doNothingUntil && charcode === 38) {
      if (isLatinLetter$1(str[right(str, i)])) {
        ampersandStage.push(i);
      } else {
        submit({
          name: "bad-character-unencoded-ampersand",
          position: [[i, i + 1, "&amp;"]]
        });
      }
    } else if (!doNothingUntil && charcode === 60) {
      const whatsOnTheRight1 = right(str, i);
      if (whatsOnTheRight1) {
        const whatsOnTheRight2 = right(str, whatsOnTheRight1);
        if (str[whatsOnTheRight1] === "!") {
          if (
            whatsOnTheRight1 > i + 1 &&
            str[right(str, whatsOnTheRight1)] !== "["
          ) {
            submit({
              name: "html-comment-spaces",
              position: [[i + 1, whatsOnTheRight1]]
            });
          }
          const whatsOnTheRight3 = right(str, whatsOnTheRight2);
          if (str[whatsOnTheRight2] === "-") {
            if (whatsOnTheRight2 > whatsOnTheRight1 + 1) {
              submit({
                name: "html-comment-spaces",
                position: [[whatsOnTheRight1 + 1, whatsOnTheRight2]]
              });
            }
            const whatsOnTheRight4 = right(str, whatsOnTheRight3);
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
              let endingOfTheSequence = whatsOnTheRight4;
              let charOnTheRightAt;
              do {
                charOnTheRightAt = right(str, endingOfTheSequence);
                if (str[charOnTheRightAt] === "-") {
                  endingOfTheSequence = charOnTheRightAt;
                }
              } while (str[charOnTheRightAt] === "-");
              const charOnTheRight = right(str, endingOfTheSequence);
              submit({
                name: "html-comment-redundant-dash",
                position: [[whatsOnTheRight3 + 1, charOnTheRight]]
              });
              doNothingUntil = charOnTheRight;
              doNothingUntilReason = "repeated HTML comment dashes";
            }
          }
        } else if (str[whatsOnTheRight1] === "-") ; else {
          submitOpeningBracket(i, i + 1);
        }
      } else {
        submitOpeningBracket(i, i + 1);
      }
    } else if (!doNothingUntil && charcode === 62) {
      const whatsOnTheLeft1 = left(str, i);
      if (str[whatsOnTheLeft1] === "-") {
        const whatsOnTheLeft2 = left(str, whatsOnTheLeft1);
        if (str[whatsOnTheLeft2] === "-") ;
      } else {
        submitClosingBracket(i, i + 1);
      }
    } else if (!doNothingUntil && charcode === 160) {
      const name = `bad-character-unencoded-non-breaking-space`;
      submit({
        name,
        position: [[i, i + 1, "&nbsp;"]]
      });
    } else if (!doNothingUntil && charcode === 5760) {
      const name = `bad-character-ogham-space-mark`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8192) {
      const name = `bad-character-en-quad`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8193) {
      const name = `bad-character-em-quad`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8194) {
      const name = `bad-character-en-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8195) {
      const name = `bad-character-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8196) {
      const name = `bad-character-three-per-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8197) {
      const name = `bad-character-four-per-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8198) {
      const name = `bad-character-six-per-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8199) {
      const name = `bad-character-figure-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8200) {
      const name = `bad-character-punctuation-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8201) {
      const name = `bad-character-thin-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8202) {
      const name = `bad-character-hair-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8203) {
      const name = `bad-character-zero-width-space`;
      submit({
        name,
        position: [[i, i + 1]]
      });
    } else if (!doNothingUntil && charcode === 8232) {
      const name = `bad-character-line-separator`;
      submit({
        name,
        position: [[i, i + 1, "\n"]]
      });
    } else if (!doNothingUntil && charcode === 8233) {
      const name = `bad-character-paragraph-separator`;
      submit({
        name,
        position: [[i, i + 1, "\n"]]
      });
    } else if (!doNothingUntil && charcode === 8239) {
      const name = `bad-character-narrow-no-break-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 8287) {
      const name = `bad-character-medium-mathematical-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && charcode === 12288) {
      const name = `bad-character-ideographic-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
    } else if (!doNothingUntil && encodeChar$1(str, i)) {
      const newIssue = encodeChar$1(str, i);
      submit(newIssue, "raw");
    } else if (!doNothingUntil && charcode >= 888 && charcode <= 8591) {
      if (
        charcode === 888 ||
        charcode === 889 ||
        (charcode >= 896 && charcode <= 899) ||
        charcode === 907 ||
        charcode === 909 ||
        charcode === 930 ||
        charcode === 1328 ||
        charcode === 1367 ||
        charcode === 1368 ||
        charcode === 1419 ||
        charcode === 1419 ||
        charcode === 1420 ||
        charcode === 1424 ||
        (charcode >= 1480 && charcode <= 1487) ||
        (charcode >= 1515 && charcode <= 1519) ||
        (charcode >= 1525 && charcode <= 1535) ||
        charcode === 1565 ||
        charcode === 1806 ||
        charcode === 1867 ||
        charcode === 1868 ||
        (charcode >= 1970 && charcode <= 1983) ||
        (charcode >= 2043 && charcode <= 2047) ||
        charcode === 2094 ||
        charcode === 2095 ||
        charcode === 2111 ||
        charcode === 2140 ||
        charcode === 2141 ||
        charcode === 2143 ||
        (charcode >= 2155 && charcode <= 2207) ||
        charcode === 2229 ||
        (charcode >= 2238 && charcode <= 2258) ||
        charcode === 2436 ||
        charcode === 2445 ||
        charcode === 2446 ||
        charcode === 2449 ||
        charcode === 2450 ||
        charcode === 2473 ||
        charcode === 2481 ||
        charcode === 2483 ||
        charcode === 2484 ||
        charcode === 2485 ||
        charcode === 2490 ||
        charcode === 2491 ||
        charcode === 2501 ||
        charcode === 2502 ||
        charcode === 2505 ||
        charcode === 2506 ||
        (charcode >= 2511 && charcode <= 2518) ||
        (charcode >= 2520 && charcode <= 2523) ||
        charcode === 2526 ||
        (charcode >= 8384 && charcode <= 8399) ||
        (charcode >= 8433 && charcode <= 8447) ||
        charcode === 8588 ||
        charcode === 8589 ||
        charcode === 8590 ||
        charcode === 8591
      ) {
        const name = `bad-character-generic`;
        submit({
          name,
          position: [[i, i + 1]]
        });
      }
    } else if (charcode >= 128 && !doNothingUntil) {
      const encoded = encode$1(str.slice(i, i + 1));
      submit({
        name: "bad-character-unencoded-char-outside-ascii",
        position: [[i, i + 1, encoded]]
      });
    }
    if (
      isArr$1(ampersandStage) &&
      ampersandStage.length &&
      i > ampersandStage[ampersandStage.length - 1] &&
      !characterSuitableForNames$1(str[i])
    ) {
      if (str[i] === ";") {
        if (
          Object.keys(notEmailFriendly).includes(
            str.slice(ampersandStage[ampersandStage.length - 1] + 1, i)
          )
        ) {
          submit({
            name: "bad-named-html-entity-not-email-friendly",
            position: [
              [
                ampersandStage[ampersandStage.length - 1] + 1,
                i,
                notEmailFriendly[
                  str.slice(ampersandStage[ampersandStage.length - 1] + 1, i)
                ]
              ]
            ]
          });
        }
      } else {
        while (isArr$1(ampersandStage) && ampersandStage.length) {
          const ampIdx = ampersandStage.shift();
          submit({
            name: "bad-character-unencoded-ampersand",
            position: [[ampIdx, ampIdx + 1, "&amp;"]]
          });
        }
      }
      ampersandStage = [];
    }
    if (
      !doNothingUntil &&
      logWhitespace.startAt !== null &&
      str[i].trim().length
    ) {
      if (
        logTag.tagNameStartAt !== null &&
        logAttr.attrStartAt === null &&
        (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= i) &&
        (str[i] === ">" ||
          (str[i] === "/" && "<>".includes(str[right(str, i)])))
      ) {
        let name = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          name = "tag-whitespace-closing-slash-and-bracket";
        }
        submit({
          name: name,
          position: [[logWhitespace.startAt, i]]
        });
      }
    }
    if (
      !doNothingUntil &&
      !str[i].trim().length &&
      logWhitespace.startAt === null
    ) {
      logWhitespace.startAt = i;
    }
    if ((!doNothingUntil && str[i] === "\n") || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
      }
      logWhitespace.lastLinebreakAt = i;
    }
    if (
      !doNothingUntil &&
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      isLatinLetter(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      if (logTag.closing === null) {
        logTag.closing = false;
      }
      if (logTag.tagStartAt < i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
      }
    }
    if (
      !doNothingUntil &&
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      isUppercaseLetter(str[i]) &&
      !str
        .slice(logTag.tagNameStartAt)
        .toLowerCase()
        .startsWith("doctype")
    ) {
      submit({
        name: "tag-name-lowercase",
        position: [[i, i + 1, str[i].toLowerCase()]]
      });
    }
    if (
      !doNothingUntil &&
      str[i] === "/" &&
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null
    ) {
      if (logTag.closing === null) {
        logTag.closing = true;
      }
    }
    if (!doNothingUntil && str[i] === "<") {
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = i;
      } else if (tagOnTheRight$1(str, i)) {
        if (
          logTag.tagStartAt !== null &&
          ((logTag.attributes.length &&
            logTag.attributes.some(
              attrObj =>
                attrObj.attrEqualAt !== null &&
                attrObj.attrOpeningQuote.pos !== null
            )) ||
            (isStr$1(logTag.tagName) &&
              knownHTMLTags.includes(logTag.tagName) &&
              right(str, logTag.tagNameEndAt - 1) === i))
        ) {
          const lastNonWhitespaceOnLeft = left(str, i);
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
          } else {
            submit({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, i, ">"]]
            });
          }
          if (rawIssueStaging.length) {
            rawIssueStaging.forEach(issueObj => {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                submit(issueObj);
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          logTag.tagStartAt = i;
        } else {
          if (rawIssueStaging.length) {
            rawIssueStaging.forEach(issueObj => {
              if (
                issueObj.position[0][0] < i
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
    if (
      !doNothingUntil &&
      logTag.tagStartAt !== null &&
      (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < i)
    ) {
      if (charcode === 62) {
        if (tagIssueStaging.length) {
          tagIssueStaging.forEach(issue => {
            submit(issue);
          });
          tagIssueStaging = [];
        }
        if (rawIssueStaging.length) {
          rawIssueStaging.forEach(issueObj => {
            if (
              issueObj.position[0][0] < logTag.tagStartAt ||
              (logTag.attributes.some(attrObj => {
                return (
                  attrObj.attrValueStartAt < issueObj.position[0][0] &&
                  attrObj.attrValueEndAt > issueObj.position[0][0]
                );
              }) &&
                !retObj.issues.some(existingIssue => {
                  return (
                    existingIssue.position[0][0] === issueObj.position[0][0] &&
                    existingIssue.position[0][1] === issueObj.position[0][1]
                  );
                }))
            ) {
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
        const chompedSlashes = chompRight(
          str,
          i,
          { mode: 1 },
          "\\?*",
          "/*",
          "\\?*"
        );
        if (
          str[chompedSlashes] === ">" ||
          (str[chompedSlashes] &&
            !str[chompedSlashes].trim().length &&
            str[right(str, chompedSlashes)] === ">")
        ) {
          if (logWhitespace.startAt !== null) {
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, i]]
            });
            resetLogWhitespace();
          }
          const issueName = str.slice(i + 1, chompedSlashes).includes("\\")
            ? "tag-closing-left-slash"
            : "tag-duplicate-closing-slash";
          submit({
            name: issueName,
            position: [[i + 1, chompedSlashes]]
          });
          doNothingUntil = chompedSlashes;
          doNothingUntilReason = "repeated slash";
        }
      } else if (charcode === 92) {
        const chompedSlashes = chompRight(
          str,
          i,
          { mode: 1 },
          "/?*",
          "\\*",
          "/?*"
        );
        if (
          str[chompedSlashes] === ">" ||
          (str[chompedSlashes] &&
            !str[chompedSlashes].trim().length &&
            str[right(str, chompedSlashes)] === ">")
        ) {
          submit({
            name: "tag-closing-left-slash",
            position: [[i, chompedSlashes, "/"]]
          });
          doNothingUntil = chompedSlashes;
          doNothingUntilReason = "repeated slash";
        } else if (chompedSlashes === null && str[right(str, i)] === ">") {
          submit({
            name: "tag-closing-left-slash",
            position: [[i, i + 1, "/"]]
          });
        }
        if (logWhitespace.startAt !== null) {
          submit({
            name: "tag-excessive-whitespace-inside-tag",
            position: [[logWhitespace.startAt, i]]
          });
          resetLogWhitespace();
        }
      }
    }
    if (
      doNothingUntil &&
      doNothingUntilReason === "script tag" &&
      str[i] === "t" &&
      str[i - 1] === "p" &&
      str[i - 2] === "i" &&
      str[i - 3] === "r" &&
      str[i - 4] === "c" &&
      str[i - 5] === "s" &&
      withinQuotes === null
    ) {
      const charOnTheRight = right(str, i);
      const charOnTheLeft = left(str, i - 5);
      if (str[charOnTheLeft] === "/") {
        const charFurtherOnTheLeft = left(str, charOnTheLeft);
      } else if (str[charOnTheLeft] === "<") ;
      doNothingUntil = charOnTheRight + 1;
    }
    if (
      !doNothingUntil &&
      logWhitespace.startAt !== null &&
      str[i].trim().length
    ) {
      resetLogWhitespace();
    }
    if (!str[i + 1]) {
      if (rawIssueStaging.length) {
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null
          )
        ) {
          rawIssueStaging.forEach(issueObj => {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              submit(issueObj);
            }
          });
          rawIssueStaging = [];
          submit({
            name: "tag-missing-closing-bracket",
            position: [
              [
                logWhitespace.startAt ? logWhitespace.startAt : i + 1,
                i + 1,
                ">"
              ]
            ]
          });
        } else if (
          !retObj.issues.some(
            issueObj => issueObj.name === "file-missing-ending"
          )
        ) {
          rawIssueStaging.forEach(issueObj => {
            submit(issueObj);
          });
          rawIssueStaging = [];
        }
      }
    }
    const retObj_mini = clone(retObj);
    Object.keys(retObj_mini.applicableRules).forEach(rule => {
      if (!retObj_mini.applicableRules[rule]) {
        delete retObj_mini.applicableRules[rule];
      }
    });
  }
  if (
    (!opts.style || !opts.style.line_endings_CR_LF_CRLF) &&
    ((logLineEndings.cr.length && logLineEndings.lf.length) ||
      (logLineEndings.lf.length && logLineEndings.crlf.length) ||
      (logLineEndings.cr.length && logLineEndings.crlf.length))
  ) {
    if (
      logLineEndings.cr.length > logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (
      logLineEndings.lf.length > logLineEndings.crlf.length &&
      logLineEndings.lf.length > logLineEndings.cr.length
    ) {
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length > logLineEndings.lf.length &&
      logLineEndings.crlf.length > logLineEndings.cr.length
    ) {
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length === logLineEndings.lf.length &&
      logLineEndings.lf.length === logLineEndings.cr.length
    ) {
      logLineEndings.crlf.forEach(eolEntryArr => {
        submit({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(eolEntryArr => {
        submit({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (
      logLineEndings.cr.length === logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      (logLineEndings.lf.length === logLineEndings.crlf.length &&
        logLineEndings.lf.length > logLineEndings.cr.length) ||
      (logLineEndings.cr.length === logLineEndings.lf.length &&
        logLineEndings.cr.length > logLineEndings.crlf.length)
    ) {
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    }
  }
  const htmlEntityFixes = fixBrokenEntities(str, {
    cb: oodles => {
      return {
        name: oodles.ruleName,
        position: [
          oodles.rangeValEncoded != null
            ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
            : [oodles.rangeFrom, oodles.rangeTo]
        ]
      };
    }
  });
  if (isArr$1(htmlEntityFixes) && htmlEntityFixes.length) {
    retObj.issues = retObj.issues
      .filter(issueObj => {
        return (
          issueObj.name !== "bad-character-unencoded-ampersand" ||
          htmlEntityFixes.every(entityFixObj => {
            return issueObj.position[0][0] !== entityFixObj.position[0][0];
          })
        );
      })
      .concat(htmlEntityFixes ? htmlEntityFixes : [])
      .filter(issueObj => !opts.rules || opts.rules[issueObj.name] !== false);
  }
  if (
    !retObj.issues.some(
      issueObj => issueObj.name === "bad-character-unencoded-ampersand"
    )
  ) {
    retObj.applicableRules["bad-character-unencoded-ampersand"] = false;
  }
  if (isArr$1(htmlEntityFixes) && htmlEntityFixes.length) {
    htmlEntityFixes.forEach(issueObj => {
      if (!retObj.applicableRules[issueObj.name]) {
        retObj.applicableRules[issueObj.name] = true;
      }
    });
  }
  retObj.fix =
    isArr$1(retObj.issues) && retObj.issues.length
      ? merge(
          retObj.issues
            .filter(issueObj => {
              return (
                !errorsRules[issueObj.name] ||
                !errorsRules[issueObj.name].unfixable
              );
            })
            .reduce((acc, obj) => {
              return acc.concat(obj.position);
            }, [])
        )
      : null;
  return retObj;
}

export { lint, version };
