/**
 * @name emlint
 * @fileoverview Pluggable email template code linter
 * @version 4.5.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/emlint/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _typeof = require('@babel/runtime/helpers/typeof');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _inherits = require('@babel/runtime/helpers/inherits');
var _createSuper = require('@babel/runtime/helpers/createSuper');
var tinyTypedEmitter = require('tiny-typed-emitter');
var stringFixBrokenNamedEntities = require('string-fix-broken-named-entities');
var astMonkeyTraverse = require('ast-monkey-traverse');
var lineColumnMini = require('line-column-mini');
var clone = require('lodash.clonedeep');
var codsenParser = require('codsen-parser');
var he = require('he');
var htmlEntitiesNotEmailFriendly$1 = require('html-entities-not-email-friendly');
var defineLazyProp = require('define-lazy-prop');
var matcher = require('matcher');
var stringProcessCommaSeparated = require('string-process-comma-separated');
var stringLeftRight = require('string-left-right');
var isRegExp = require('lodash.isregexp');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var rangesMerge = require('ranges-merge');
var _createForOfIteratorHelper = require('@babel/runtime/helpers/createForOfIteratorHelper');
var htmlAllKnownAttributes = require('html-all-known-attributes');
var leven = require('leven');
var db = require('mime-db');
var isRelativeUri = require('is-relative-uri');
var urlRegex = require('url-regex');
var isLanguageCode = require('is-language-code');
var isMediaDescriptor = require('is-media-descriptor');
var stringFindMalformed = require('string-find-malformed');
var stringMatchLeftRight = require('string-match-left-right');
var astMonkeyUtil = require('ast-monkey-util');
var op = require('object-path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _createSuper__default = /*#__PURE__*/_interopDefaultLegacy(_createSuper);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var he__default = /*#__PURE__*/_interopDefaultLegacy(he);
var defineLazyProp__default = /*#__PURE__*/_interopDefaultLegacy(defineLazyProp);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);
var isRegExp__default = /*#__PURE__*/_interopDefaultLegacy(isRegExp);
var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _createForOfIteratorHelper__default = /*#__PURE__*/_interopDefaultLegacy(_createForOfIteratorHelper);
var leven__default = /*#__PURE__*/_interopDefaultLegacy(leven);
var db__default = /*#__PURE__*/_interopDefaultLegacy(db);
var urlRegex__default = /*#__PURE__*/_interopDefaultLegacy(urlRegex);
var op__default = /*#__PURE__*/_interopDefaultLegacy(op);

function validateCharEncoding(charStr,
posIdx) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "named";
  var context = arguments.length > 3 ? arguments[3] : undefined;
  var encodedChr = he__default['default'].encode(charStr, {
    useNamedReferences: mode === "named"
  });
  if (Object.keys(htmlEntitiesNotEmailFriendly$1.notEmailFriendly).includes(encodedChr.slice(1, encodedChr.length - 1))) {
    encodedChr = "&".concat(htmlEntitiesNotEmailFriendly$1.notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)], ";");
  }
  var charName = "";
  if (charStr.charCodeAt(0) === 160) {
    charName = " no-break space";
  } else if (charStr.charCodeAt(0) === 38) {
    charName = " ampersand";
  } else if (charStr.charCodeAt(0) === 60) {
    charName = " less than";
  } else if (charStr.charCodeAt(0) === 62) {
    charName = " greater than";
  } else if (charStr.charCodeAt(0) === 34) {
    charName = " double quotes";
  } else if (charStr.charCodeAt(0) === 163) {
    charName = " pound sign";
  }
  context.report({
    ruleId: "character-encode",
    message: "Unencoded".concat(charName, " character."),
    idxFrom: posIdx,
    idxTo: posIdx + 1,
    fix: {
      ranges: [[posIdx, posIdx + 1, encodedChr]]
    }
  });
}

var allBadCharacterRules = ["bad-character-acknowledge", "bad-character-activate-arabic-form-shaping", "bad-character-activate-symmetric-swapping", "bad-character-application-program-command", "bad-character-backspace", "bad-character-bell", "bad-character-break-permitted-here", "bad-character-cancel", "bad-character-cancel-character", "bad-character-character-tabulation-set", "bad-character-character-tabulation-with-justification", "bad-character-control-0080", "bad-character-control-0081", "bad-character-control-0084", "bad-character-control-0099", "bad-character-control-sequence-introducer", "bad-character-data-link-escape", "bad-character-delete", "bad-character-device-control-four", "bad-character-device-control-one", "bad-character-device-control-string", "bad-character-device-control-three", "bad-character-device-control-two", "bad-character-em-quad", "bad-character-em-space", "bad-character-en-quad", "bad-character-en-space", "bad-character-end-of-medium", "bad-character-end-of-protected-area", "bad-character-end-of-selected-area", "bad-character-end-of-text", "bad-character-end-of-transmission", "bad-character-end-of-transmission-block", "bad-character-enquiry", "bad-character-escape", "bad-character-figure-space", "bad-character-first-strong-isolate", "bad-character-form-feed", "bad-character-four-per-em-space", "bad-character-function-application", "bad-character-hair-space", "bad-character-ideographic-space", "bad-character-information-separator-four", "bad-character-information-separator-one", "bad-character-information-separator-three", "bad-character-information-separator-two", "bad-character-inhibit-arabic-form-shaping", "bad-character-inhibit-symmetric-swapping", "bad-character-interlinear-annotation-anchor", "bad-character-interlinear-annotation-separator", "bad-character-interlinear-annotation-terminator", "bad-character-invisible-plus", "bad-character-invisible-separator", "bad-character-invisible-times", "bad-character-left-to-right-embedding", "bad-character-left-to-right-isolate", "bad-character-left-to-right-mark", "bad-character-left-to-right-override", "bad-character-line-separator", "bad-character-line-tabulation", "bad-character-line-tabulation-set", "bad-character-medium-mathematical-space", "bad-character-message-waiting", "bad-character-narrow-no-break-space", "bad-character-national-digit-shapes", "bad-character-negative-acknowledge", "bad-character-next-line", "bad-character-no-break-here", "bad-character-nominal-digit-shapes", "bad-character-non-breaking-space", "bad-character-null", "bad-character-ogham-space-mark", "bad-character-operating-system-command", "bad-character-paragraph-separator", "bad-character-partial-line-backward", "bad-character-partial-line-forward", "bad-character-pop-directional-formatting", "bad-character-pop-directional-isolate", "bad-character-private-message", "bad-character-private-use-1", "bad-character-private-use-2", "bad-character-punctuation-space", "bad-character-replacement-character", "bad-character-reverse-line-feed", "bad-character-right-to-left-embedding", "bad-character-right-to-left-isolate", "bad-character-right-to-left-mark", "bad-character-right-to-left-override", "bad-character-set-transmit-state", "bad-character-shift-in", "bad-character-shift-out", "bad-character-single-character-introducer", "bad-character-single-shift-three", "bad-character-single-shift-two", "bad-character-six-per-em-space", "bad-character-soft-hyphen", "bad-character-start-of-heading", "bad-character-start-of-protected-area", "bad-character-start-of-selected-area", "bad-character-start-of-string", "bad-character-start-of-text", "bad-character-string-terminator", "bad-character-substitute", "bad-character-synchronous-idle", "bad-character-tabulation", "bad-character-thin-space", "bad-character-three-per-em-space", "bad-character-word-joiner", "bad-character-zero-width-joiner", "bad-character-zero-width-no-break-space", "bad-character-zero-width-non-joiner", "bad-character-zero-width-space"];

var allTagRules = ["tag-bad-self-closing", "tag-bold", "tag-closing-backslash", "tag-is-present", "tag-malformed", "tag-missing-closing", "tag-missing-opening", "tag-name-case", "tag-rogue", "tag-space-after-opening-bracket", "tag-space-before-closing-bracket", "tag-space-between-slash-and-bracket", "tag-table", "tag-void-frontal-slash", "tag-void-slash"];

var allAttribRules = ["attribute-duplicate", "attribute-enforce-img-alt", "attribute-malformed", "attribute-on-closing-tag"];

var allCSSRules = ["css-rule-malformed", "css-trailing-semi"];

var allBadNamedHTMLEntityRules = ["bad-html-entity-malformed-nbsp", "bad-html-entity-malformed-numeric", "bad-html-entity-multiple-encoding", "bad-html-entity-not-email-friendly", "bad-html-entity-unrecognised"];

function splitByWhitespace(str, cbValues, cbWhitespace, originalOpts) {
  var defaults = {
    offset: 0,
    from: 0,
    to: str.length
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var nameStartsAt = null;
  var whitespaceStartsAt = null;
  for (var i = opts.from; i < opts.to; i++) {
    if (whitespaceStartsAt === null && !str[i].trim().length) {
      whitespaceStartsAt = i;
    }
    if (whitespaceStartsAt !== null && (str[i].trim().length || i + 1 === opts.to)) {
      if (typeof cbWhitespace === "function") {
        cbWhitespace([whitespaceStartsAt + opts.offset, (str[i].trim().length ? i : i + 1) + opts.offset]);
      }
      whitespaceStartsAt = null;
    }
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
    }
    if (nameStartsAt !== null && (!str[i].trim().length || i + 1 === opts.to)) {
      if (typeof cbValues === "function") {
        cbValues([nameStartsAt + opts.offset, (i + 1 === opts.to && str[i].trim().length ? i + 1 : i) + opts.offset]);
      }
      nameStartsAt = null;
    }
  }
}

function checkForWhitespace(str, idxOffset) {
  if (typeof str !== "string") {
    return {
      charStart: 0,
      charEnd: 0,
      errorArr: [],
      trimmedVal: ""
    };
  }
  var charStart = 0;
  var charEnd = str.length;
  var trimmedVal;
  var gatheredRanges = [];
  var errorArr = [];
  if (!str.length || !str[0].trim().length) {
    charStart = stringLeftRight.right(str);
    if (!str.length || charStart === null) {
      charEnd = null;
      errorArr.push({
        idxFrom: +idxOffset,
        idxTo: +idxOffset + str.length,
        message: "Missing value.",
        fix: null
      });
    } else {
      gatheredRanges.push([idxOffset, idxOffset + charStart]);
    }
  }
  if (charEnd && !str[str.length - 1].trim()) {
    charEnd = stringLeftRight.left(str, str.length - 1) + 1;
    gatheredRanges.push([idxOffset + charEnd, idxOffset + str.length]);
  }
  if (!gatheredRanges.length) {
    trimmedVal = str;
  } else {
    errorArr.push({
      idxFrom: gatheredRanges[0][0],
      idxTo: gatheredRanges[gatheredRanges.length - 1][1],
      message: "Remove whitespace.",
      fix: {
        ranges: clone__default['default'](gatheredRanges)
      }
    });
    gatheredRanges.length = 0;
    trimmedVal = str.trim();
  }
  return {
    charStart: charStart,
    charEnd: charEnd,
    errorArr: errorArr,
    trimmedVal: trimmedVal
  };
}

var defaults$2 = {
  caseInsensitive: false
};
function includesWithRegex(arr, whatToMatch, originalOpts) {
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults$2), originalOpts);
  if (!Array.isArray(arr) || !arr.length) {
    return false;
  }
  return arr.some(function (val) {
    return isRegExp__default['default'](val) && whatToMatch.match(val) || typeof val === "string" && (!opts.caseInsensitive && whatToMatch === val || opts.caseInsensitive && whatToMatch.toLowerCase() === val.toLowerCase());
  });
}

var defaults$1 = {
  caseInsensitive: false,
  canBeCommaSeparated: false,
  quickPermittedValues: [],
  permittedValues: [],
  noSpaceAfterComma: false
};
function validateValue$2(str, idxOffset, opts, charStart, charEnd, errorArr) {
  var extractedValue = str.slice(charStart, charEnd);
  if (!(includesWithRegex(opts.quickPermittedValues, extractedValue, {
    caseInsensitive: opts.caseInsensitive
  }) || includesWithRegex(opts.permittedValues, extractedValue, {
    caseInsensitive: opts.caseInsensitive
  }))) {
    var fix = null;
    var message = "Unrecognised value: \"".concat(str.slice(charStart, charEnd), "\".");
    if (includesWithRegex(opts.quickPermittedValues, extractedValue.toLowerCase()) || includesWithRegex(opts.permittedValues, extractedValue.toLowerCase())) {
      message = "Should be lowercase.";
      fix = {
        ranges: [[charStart + idxOffset, charEnd + idxOffset, extractedValue.toLowerCase()]]
      };
    } else if (Array.isArray(opts.quickPermittedValues) && opts.quickPermittedValues.length && opts.quickPermittedValues.length < 6 && opts.quickPermittedValues.every(function (val) {
      return typeof val === "string";
    }) && (!Array.isArray(opts.permittedValues) || !opts.permittedValues.length) && opts.quickPermittedValues.join("|").length < 40) {
      message = "Should be \"".concat(opts.quickPermittedValues.join("|"), "\".");
    } else if (Array.isArray(opts.permittedValues) && opts.permittedValues.length && opts.permittedValues.length < 6 && opts.permittedValues.every(function (val) {
      return typeof val === "string";
    }) && (!Array.isArray(opts.quickPermittedValues) || !opts.quickPermittedValues.length) && opts.permittedValues.join("|").length < 40) {
      message = "Should be \"".concat(opts.permittedValues.join("|"), "\".");
    }
    errorArr.push({
      idxFrom: charStart + idxOffset,
      idxTo: charEnd + idxOffset,
      message: message,
      fix: fix
    });
  }
}
function validateString(str, idxOffset, originalOpts) {
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults$1), originalOpts);
  var _checkForWhitespace = checkForWhitespace(str, idxOffset),
      charStart = _checkForWhitespace.charStart,
      charEnd = _checkForWhitespace.charEnd,
      errorArr = _checkForWhitespace.errorArr;
  if (typeof charStart === "number" && typeof charEnd === "number") {
    if (opts.canBeCommaSeparated) {
      stringProcessCommaSeparated.processCommaSep(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: function cb(idxFrom, idxTo) {
          str.slice(idxFrom - idxOffset, idxTo - idxOffset);
          validateValue$2(str, idxOffset, opts, idxFrom - idxOffset,
          idxTo - idxOffset, errorArr);
        },
        errCb: function errCb(ranges, message) {
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message: message,
            fix: {
              ranges: ranges
            }
          });
        }
      });
    } else {
      str.slice(charStart, charEnd);
      validateValue$2(str, idxOffset, opts, charStart, charEnd, errorArr);
    }
  }
  return errorArr;
}

var wholeExtensionRegex = /^\.\w+$/g;
var isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/g;
var fontSizeRegex = /^[+-]?[1-7]$/;
var linkTypes = ["apple-touch-icon", "apple-touch-startup-image", "alternate", "archives", "appendix", "author", "bookmark", "canonical", "chapter", "contents", "copyright", "dns-prefetch", "external", "first", "glossary", "help", "icon", "import", "index", "last", "license", "manifest", "modulepreload", "next", "nofollow", "noopener", "noreferrer", "opener", "pingback", "preconnect", "prefetch", "preload", "prerender", "prev", "search", "shortlink", "section", "sidebar", "start", "stylesheet", "subsection", "tag", "up"];
var astErrMessages = {
  "tag-missing-opening": "Opening tag is missing.",
  "tag-missing-closing": "Closing tag is missing.",
  "tag-void-frontal-slash": "Remove frontal slash."
};
function isLetter(str) {
  return typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase();
}
function isAnEnabledValue(maybeARulesValue) {
  if (Number.isInteger(maybeARulesValue) && maybeARulesValue > 0) {
    return maybeARulesValue;
  }
  if (Array.isArray(maybeARulesValue) && maybeARulesValue.length && Number.isInteger(maybeARulesValue[0]) && maybeARulesValue[0] > 0) {
    return maybeARulesValue[0];
  }
  return 0;
}
function isObj(something) {
  return !!(something && _typeof__default['default'](something) === "object" && !Array.isArray(something));
}
function isAnEnabledRule(rules, ruleId) {
  if (!ruleId) {
    return 0;
  }
  if (isObj(rules) && Object.prototype.hasOwnProperty.call(rules, ruleId)) {
    return rules[ruleId];
  }
  if (ruleId.includes("-") && Object.prototype.hasOwnProperty.call(rules, ruleId.split("-")[0])) {
    return rules[ruleId.split("-")[0]];
  }
  if (isObj(rules) && Object.prototype.hasOwnProperty.call(rules, "all")) {
    return rules.all;
  }
  return 0;
}

var util = /*#__PURE__*/Object.freeze({
__proto__: null,
wholeExtensionRegex: wholeExtensionRegex,
splitByWhitespace: splitByWhitespace,
isAnEnabledValue: isAnEnabledValue,
isAnEnabledRule: isAnEnabledRule,
astErrMessages: astErrMessages,
validateString: validateString,
fontSizeRegex: fontSizeRegex,
isoDateRegex: isoDateRegex,
linkTypes: linkTypes,
isLetter: isLetter,
isObj: isObj
});

function badCharacterNull(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 0) {
        context.report({
          ruleId: "bad-character-null",
          message: "Bad character - NULL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfHeading(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 1) {
        context.report({
          ruleId: "bad-character-start-of-heading",
          message: "Bad character - START OF HEADING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfText(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 2) {
        context.report({
          ruleId: "bad-character-start-of-text",
          message: "Bad character - START OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfText(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 3) {
        context.report({
          ruleId: "bad-character-end-of-text",
          message: "Bad character - END OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, "\n"]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfTransmission(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 4) {
        context.report({
          ruleId: "bad-character-end-of-transmission",
          message: "Bad character - END OF TRANSMISSION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEnquiry(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 5) {
        context.report({
          ruleId: "bad-character-enquiry",
          message: "Bad character - ENQUIRY.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterAcknowledge(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 6) {
        context.report({
          ruleId: "bad-character-acknowledge",
          message: "Bad character - ACKNOWLEDGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBell(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 7) {
        context.report({
          ruleId: "bad-character-bell",
          message: "Bad character - BELL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBackspace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8) {
        context.report({
          ruleId: "bad-character-backspace",
          message: "Bad character - BACKSPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

var badCharacterTabulation = function badCharacterTabulation(context) {
  for (var _len = arguments.length, originalOpts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    originalOpts[_key - 1] = arguments[_key];
  }
  var mode = "never";
  if (Array.isArray(originalOpts) && originalOpts[0] && typeof originalOpts[0] === "string" && originalOpts[0].toLowerCase() === "indentationisfine") {
    mode = "indentationIsFine";
  }
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 9) {
        if (mode === "never") {
          context.report({
            ruleId: "bad-character-tabulation",
            message: "Bad character - TABULATION.",
            idxFrom: i,
            idxTo: i + 1,
            fix: {
              ranges: [[i, i + 1, " "]]
            }
          });
        } else if (mode === "indentationIsFine") {
          var charTopOnBreaksIdx = stringLeftRight.leftStopAtNewLines(context.str, i);
          if (charTopOnBreaksIdx !== null && context.str[charTopOnBreaksIdx].trim().length) {
            context.report({
              ruleId: "bad-character-tabulation",
              message: "Bad character - TABULATION.",
              idxFrom: i,
              idxTo: i + 1,
              fix: {
                ranges: [[i, i + 1, " "]]
              }
            });
          }
        }
      }
    }
  };
};

function badCharacterLineTabulation(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 11) {
        context.report({
          ruleId: "bad-character-line-tabulation",
          message: "Bad character - LINE TABULATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFormFeed(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 12) {
        context.report({
          ruleId: "bad-character-form-feed",
          message: "Bad character - FORM FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterShiftOut(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 14) {
        context.report({
          ruleId: "bad-character-shift-out",
          message: "Bad character - SHIFT OUT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterShiftIn(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 15) {
        context.report({
          ruleId: "bad-character-shift-in",
          message: "Bad character - SHIFT IN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDataLinkEscape(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 16) {
        context.report({
          ruleId: "bad-character-data-link-escape",
          message: "Bad character - DATA LINK ESCAPE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlOne(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 17) {
        context.report({
          ruleId: "bad-character-device-control-one",
          message: "Bad character - DEVICE CONTROL ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlTwo(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 18) {
        context.report({
          ruleId: "bad-character-device-control-two",
          message: "Bad character - DEVICE CONTROL TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlThree(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 19) {
        context.report({
          ruleId: "bad-character-device-control-three",
          message: "Bad character - DEVICE CONTROL THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlFour(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 20) {
        context.report({
          ruleId: "bad-character-device-control-four",
          message: "Bad character - DEVICE CONTROL FOUR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNegativeAcknowledge(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 21) {
        context.report({
          ruleId: "bad-character-negative-acknowledge",
          message: "Bad character - NEGATIVE ACKNOWLEDGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSynchronousIdle(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 22) {
        context.report({
          ruleId: "bad-character-synchronous-idle",
          message: "Bad character - SYNCHRONOUS IDLE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfTransmissionBlock(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 23) {
        context.report({
          ruleId: "bad-character-end-of-transmission-block",
          message: "Bad character - END OF TRANSMISSION BLOCK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCancel(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 24) {
        context.report({
          ruleId: "bad-character-cancel",
          message: "Bad character - CANCEL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfMedium(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 25) {
        context.report({
          ruleId: "bad-character-end-of-medium",
          message: "Bad character - END OF MEDIUM.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSubstitute(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 26) {
        context.report({
          ruleId: "bad-character-substitute",
          message: "Bad character - SUBSTITUTE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEscape(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 27) {
        context.report({
          ruleId: "bad-character-escape",
          message: "Bad character - ESCAPE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorFour(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 28) {
        context.report({
          ruleId: "bad-character-information-separator-four",
          message: "Bad character - INFORMATION SEPARATOR FOUR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorThree(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 29) {
        context.report({
          ruleId: "bad-character-information-separator-three",
          message: "Bad character - INFORMATION SEPARATOR THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorTwo$1(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 30) {
        context.report({
          ruleId: "bad-character-information-separator-two",
          message: "Bad character - INFORMATION SEPARATOR TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorTwo(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 31) {
        context.report({
          ruleId: "bad-character-information-separator-one",
          message: "Bad character - INFORMATION SEPARATOR ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDelete(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 127) {
        context.report({
          ruleId: "bad-character-delete",
          message: "Bad character - DELETE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0080(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 128) {
        context.report({
          ruleId: "bad-character-control-0080",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0081(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 129) {
        context.report({
          ruleId: "bad-character-control-0081",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBreakPermittedHere(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 130) {
        context.report({
          ruleId: "bad-character-break-permitted-here",
          message: "Bad character - BREAK PERMITTED HERE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNoBreakHere(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 131) {
        context.report({
          ruleId: "bad-character-no-break-here",
          message: "Bad character - NO BREAK HERE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0084(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 132) {
        context.report({
          ruleId: "bad-character-control-0084",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNextLine(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 133) {
        context.report({
          ruleId: "bad-character-next-line",
          message: "Bad character - NEXT LINE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfSelectedArea(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 134) {
        context.report({
          ruleId: "bad-character-start-of-selected-area",
          message: "Bad character - START OF SELECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfSelectedArea(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 135) {
        context.report({
          ruleId: "bad-character-end-of-selected-area",
          message: "Bad character - END OF SELECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCharacterTabulationSet(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 136) {
        context.report({
          ruleId: "bad-character-character-tabulation-set",
          message: "Bad character - CHARACTER TABULATION SET.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCharacterTabulationWithJustification(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 137) {
        context.report({
          ruleId: "bad-character-character-tabulation-with-justification",
          message: "Bad character - CHARACTER TABULATION WITH JUSTIFICATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLineTabulationSet(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 138) {
        context.report({
          ruleId: "bad-character-line-tabulation-set",
          message: "Bad character - LINE TABULATION SET.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPartialLineForward(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 139) {
        context.report({
          ruleId: "bad-character-partial-line-forward",
          message: "Bad character - PARTIAL LINE FORWARD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPartialLineBackward(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 140) {
        context.report({
          ruleId: "bad-character-partial-line-backward",
          message: "Bad character - PARTIAL LINE BACKWARD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterReverseLineFeed(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 141) {
        context.report({
          ruleId: "bad-character-reverse-line-feed",
          message: "Bad character - REVERSE LINE FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleShiftTwo$1(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 142) {
        context.report({
          ruleId: "bad-character-single-shift-two",
          message: "Bad character - SINGLE SHIFT TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleShiftTwo(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 143) {
        context.report({
          ruleId: "bad-character-single-shift-three",
          message: "Bad character - SINGLE SHIFT THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlString(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 144) {
        context.report({
          ruleId: "bad-character-device-control-string",
          message: "Bad character - DEVICE CONTROL STRING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateUseOne(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 145) {
        context.report({
          ruleId: "bad-character-private-use-1",
          message: "Bad character - PRIVATE USE ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateUseTwo(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 146) {
        context.report({
          ruleId: "bad-character-private-use-2",
          message: "Bad character - PRIVATE USE TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSetTransmitState(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 147) {
        context.report({
          ruleId: "bad-character-set-transmit-state",
          message: "Bad character - SET TRANSMIT STATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCancelCharacter(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 148) {
        context.report({
          ruleId: "bad-character-cancel-character",
          message: "Bad character - CANCEL CHARACTER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterMessageWaiting(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 149) {
        context.report({
          ruleId: "bad-character-message-waiting",
          message: "Bad character - MESSAGE WAITING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfProtectedArea(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 150) {
        context.report({
          ruleId: "bad-character-start-of-protected-area",
          message: "Bad character - START OF PROTECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfProtectedArea(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 151) {
        context.report({
          ruleId: "bad-character-end-of-protected-area",
          message: "Bad character - END OF PROTECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfString(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 152) {
        context.report({
          ruleId: "bad-character-start-of-string",
          message: "Bad character - START OF STRING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0099(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 153) {
        context.report({
          ruleId: "bad-character-control-0099",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleCharacterIntroducer(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 154) {
        context.report({
          ruleId: "bad-character-single-character-introducer",
          message: "Bad character - SINGLE CHARACTER INTRODUCER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControlSequenceIntroducer(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 155) {
        context.report({
          ruleId: "bad-character-control-sequence-introducer",
          message: "Bad character - CONTROL SEQUENCE INTRODUCER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStringTerminator(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 156) {
        context.report({
          ruleId: "bad-character-string-terminator",
          message: "Bad character - STRING TERMINATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterOperatingSystemCommand(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 157) {
        context.report({
          ruleId: "bad-character-operating-system-command",
          message: "Bad character - OPERATING SYSTEM COMMAND.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateMessage(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 158) {
        context.report({
          ruleId: "bad-character-private-message",
          message: "Bad character - PRIVATE MESSAGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterApplicationProgramCommand(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 159) {
        context.report({
          ruleId: "bad-character-application-program-command",
          message: "Bad character - APPLICATION PROGRAM COMMAND.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSoftHyphen(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 173) {
        context.report({
          ruleId: "bad-character-soft-hyphen",
          message: "Bad character - SOFT HYPHEN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNonBreakingSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 160) {
        context.report({
          ruleId: "bad-character-non-breaking-space",
          message: "Bad character - NON-BREAKING SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterOghamSpaceMark(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 5760) {
        context.report({
          ruleId: "bad-character-ogham-space-mark",
          message: "Bad character - OGHAM SPACE MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEnQuad(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8192) {
        context.report({
          ruleId: "bad-character-en-quad",
          message: "Bad character - EN QUAD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEmQuad(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8193) {
        context.report({
          ruleId: "bad-character-em-quad",
          message: "Bad character - EM QUAD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEnSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8194) {
        context.report({
          ruleId: "bad-character-en-space",
          message: "Bad character - EN SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEmSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8195) {
        context.report({
          ruleId: "bad-character-em-space",
          message: "Bad character - EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterThreePerEmSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8196) {
        context.report({
          ruleId: "bad-character-three-per-em-space",
          message: "Bad character - THREE-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterFourPerEmSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8197) {
        context.report({
          ruleId: "bad-character-four-per-em-space",
          message: "Bad character - FOUR-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterSixPerEmSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8198) {
        context.report({
          ruleId: "bad-character-six-per-em-space",
          message: "Bad character - SIX-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterFigureSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8199) {
        context.report({
          ruleId: "bad-character-figure-space",
          message: "Bad character - FIGURE SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterPunctuationSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8200) {
        context.report({
          ruleId: "bad-character-punctuation-space",
          message: "Bad character - PUNCTUATION SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterThinSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8201) {
        context.report({
          ruleId: "bad-character-thin-space",
          message: "Bad character - THIN SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterHairSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8202) {
        context.report({
          ruleId: "bad-character-hair-space",
          message: "Bad character - HAIR SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8203) {
        context.report({
          ruleId: "bad-character-zero-width-space",
          message: "Bad character - ZERO WIDTH SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthNonJoiner(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8204) {
        context.report({
          ruleId: "bad-character-zero-width-non-joiner",
          message: "Bad character - ZERO WIDTH NON-JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthJoiner(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8205) {
        context.report({
          ruleId: "bad-character-zero-width-joiner",
          message: "Bad character - ZERO WIDTH JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightMark(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8206) {
        context.report({
          ruleId: "bad-character-left-to-right-mark",
          message: "Bad character - LEFT-TO-RIGHT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftMark(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8207) {
        context.report({
          ruleId: "bad-character-right-to-left-mark",
          message: "Bad character - RIGHT-TO-LEFT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightEmbedding(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8234) {
        context.report({
          ruleId: "bad-character-left-to-right-embedding",
          message: "Bad character - LEFT-TO-RIGHT EMBEDDING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftEmbedding(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8235) {
        context.report({
          ruleId: "bad-character-right-to-left-embedding",
          message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPopDirectionalFormatting(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8236) {
        context.report({
          ruleId: "bad-character-pop-directional-formatting",
          message: "Bad character - POP DIRECTIONAL FORMATTING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightOverride(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8237) {
        context.report({
          ruleId: "bad-character-left-to-right-override",
          message: "Bad character - LEFT-TO-RIGHT OVERRIDE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftOverride(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8238) {
        context.report({
          ruleId: "bad-character-right-to-left-override",
          message: "Bad character - RIGHT-TO-LEFT OVERRIDE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterWordJoiner(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8288) {
        context.report({
          ruleId: "bad-character-word-joiner",
          message: "Bad character - WORD JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFunctionApplication(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8289) {
        context.report({
          ruleId: "bad-character-function-application",
          message: "Bad character - FUNCTION APPLICATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisibleTimes(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8290) {
        context.report({
          ruleId: "bad-character-invisible-times",
          message: "Bad character - INVISIBLE TIMES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisibleSeparator(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8291) {
        context.report({
          ruleId: "bad-character-invisible-separator",
          message: "Bad character - INVISIBLE SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisiblePlus(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8292) {
        context.report({
          ruleId: "bad-character-invisible-plus",
          message: "Bad character - INVISIBLE PLUS.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightIsolate(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8294) {
        context.report({
          ruleId: "bad-character-left-to-right-isolate",
          message: "Bad character - LEFT-TO-RIGHT ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftIsolate(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8295) {
        context.report({
          ruleId: "bad-character-right-to-left-isolate",
          message: "Bad character - RIGHT-TO-LEFT ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFirstStrongIsolate(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8296) {
        context.report({
          ruleId: "bad-character-first-strong-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPopDirectionalIsolate(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8297) {
        context.report({
          ruleId: "bad-character-pop-directional-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInhibitSymmetricSwapping(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8298) {
        context.report({
          ruleId: "bad-character-inhibit-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterActivateSymmetricSwapping(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8299) {
        context.report({
          ruleId: "bad-character-activate-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInhibitArabicFormShaping(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8300) {
        context.report({
          ruleId: "bad-character-inhibit-arabic-form-shaping",
          message: "Bad character - INHIBIT ARABIC FORM SHAPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterActivateArabicFormShaping(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8301) {
        context.report({
          ruleId: "bad-character-activate-arabic-form-shaping",
          message: "Bad character - ACTIVATE ARABIC FORM SHAPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNationalDigitShapes(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8302) {
        context.report({
          ruleId: "bad-character-national-digit-shapes",
          message: "Bad character - NATIONAL DIGIT SHAPES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNominalDigitShapes(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8303) {
        context.report({
          ruleId: "bad-character-nominal-digit-shapes",
          message: "Bad character - NOMINAL DIGIT SHAPES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthNoBreakSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 65279) {
        context.report({
          ruleId: "bad-character-zero-width-no-break-space",
          message: "Bad character - ZERO WIDTH NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationAnchor(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 65529) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-anchor",
          message: "Bad character - INTERLINEAR ANNOTATION ANCHOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationSeparator(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 65530) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-separator",
          message: "Bad character - INTERLINEAR ANNOTATION SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationTerminator(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 65531) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-terminator",
          message: "Bad character - INTERLINEAR ANNOTATION TERMINATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLineSeparator(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8232) {
        context.report({
          ruleId: "bad-character-line-separator",
          message: "Bad character - LINE SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterParagraphSeparator(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8233) {
        context.report({
          ruleId: "bad-character-paragraph-separator",
          message: "Bad character - PARAGRAPH SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNarrowNoBreakSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8239) {
        context.report({
          ruleId: "bad-character-narrow-no-break-space",
          message: "Bad character - NARROW NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterMediumMathematicalSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 8287) {
        context.report({
          ruleId: "bad-character-medium-mathematical-space",
          message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterIdeographicSpace(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 12288) {
        context.report({
          ruleId: "bad-character-ideographic-space",
          message: "Bad character - IDEOGRAPHIC SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterReplacementCharacter(context) {
  return {
    character: function character(_ref) {
      var chr = _ref.chr,
          i = _ref.i;
      if (chr.charCodeAt(0) === 65533) {
        context.report({
          ruleId: "bad-character-replacement-character",
          message: "Bad character - REPLACEMENT CHARACTER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function tagSpaceAfterOpeningBracket(context) {
  return {
    tag: function tag(node) {
      var ranges = [];
      if (
      context.str[node.start] === "<" &&
      context.str[node.start + 1] &&
      !context.str[node.start + 1].trim()) {
        ranges.push([node.start + 1, stringLeftRight.right(context.str, node.start + 1) || context.str.length]);
      }
      if (
      context.str[node.start] === "<" &&
      !context.str[node.tagNameStartsAt - 1].trim()) {
        var charToTheLeftOfTagNameIdx = stringLeftRight.left(context.str, node.tagNameStartsAt) || 0;
        if (charToTheLeftOfTagNameIdx !== node.start) {
          ranges.push([charToTheLeftOfTagNameIdx + 1, node.tagNameStartsAt]);
        }
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-space-after-opening-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: {
            ranges: ranges
          }
        });
      }
    }
  };
}

var BACKSLASH$3 = "\\";
function tagSpaceBeforeClosingBracket(context) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "never";
  return {
    tag: function tag(node) {
      if (context.str[node.end - 1] !== ">") {
        return;
      }
      var leftmostPos = node.end - 1;
      var idxOnTheLeft = stringLeftRight.left(context.str, leftmostPos);
      if (context.str[idxOnTheLeft] === "/" || context.str[idxOnTheLeft] === BACKSLASH$3) {
        leftmostPos = idxOnTheLeft;
      }
      if ((Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"]) && node.void ||
      mode === "always" &&
      !(Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"]))) && context.str[leftmostPos - 1] && (
      context.str[leftmostPos - 1].trim() ||
      context.str[leftmostPos - 1] !== " " ||
      context.str[leftmostPos - 2] && !context.str[leftmostPos - 2].trim())) {
        context.report({
          ruleId: "tag-space-before-closing-bracket",
          message: "Add a space.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[stringLeftRight.left(context.str, leftmostPos) + 1, leftmostPos, " "]]
          }
        });
      } else if ((Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"]) && !node.void ||
      mode !== "always" &&
      !(Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"]))) && context.str[leftmostPos - 1] &&
      !context.str[leftmostPos - 1].trim()) {
        context.report({
          ruleId: "tag-space-before-closing-bracket",
          message: "Remove space.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[stringLeftRight.left(context.str, leftmostPos) + 1, leftmostPos]]
          }
        });
      }
    }
  };
}

var BACKSLASH$2 = "\\";
function tagSpaceBetweenSlashAndBracket(context) {
  return {
    tag: function tag(node) {
      var idxOnTheLeft = stringLeftRight.left(context.str, node.end - 1);
      if (Number.isInteger(node.end) && context.str[node.end - 1] === ">" && (
      context.str[idxOnTheLeft] === "/" || context.str[idxOnTheLeft] === BACKSLASH$2) && idxOnTheLeft < node.end - 2) {
        var idxFrom = idxOnTheLeft + 1;
        context.report({
          ruleId: "tag-space-between-slash-and-bracket",
          message: "Bad whitespace.",
          idxFrom: idxFrom,
          idxTo: node.end - 1,
          fix: {
            ranges: [[idxFrom, node.end - 1]]
          }
        });
      }
    }
  };
}

function tagTable(context) {
  return {
    tag: function tag(node) {
      if (node.tagName === "table" && !node.closing) {
        if (node.children && node.children.length) {
          var extracted = [];
          var orderNumber = 0;
          var closingTrMet = true;
          var trFound = false;
          var tdFound = false;
          for (var i = 0, len1 = node.children.length; i < len1; i++) {
            if (node.children[i].type === "tag" && node.children[i].tagName === "tr") {
              if (!trFound) {
                trFound = true;
              }
              if (node.children[i].closing) {
                if (!closingTrMet) {
                  closingTrMet = true;
                } else {
                  return;
                }
              } else {
                if (closingTrMet) {
                  closingTrMet = false;
                } else {
                  return;
                }
                var finding = {
                  orderNumber: orderNumber,
                  idx: i,
                  tds: []
                };
                orderNumber++;
                if (node.children[i].children && node.children[i].children.length) {
                  var closingTdMet = true;
                  for (var y = 0, len2 = node.children[i].children.length; y < len2; y++) {
                    if (node.children[i].children[y].type === "tag" && node.children[i].children[y].tagName === "td") {
                      if (!tdFound) {
                        tdFound = true;
                      }
                      if (node.children[i].children[y].closing) {
                        if (!closingTdMet) {
                          closingTdMet = true;
                        } else {
                          return;
                        }
                      } else {
                        if (closingTdMet) {
                          closingTdMet = false;
                        } else {
                          return;
                        }
                        finding.tds.push(y);
                      }
                    }
                  }
                  if (!closingTdMet) {
                    return;
                  }
                }
                extracted.push(finding);
              }
            } else if (
            node.children[i].type === "text" &&
            node.children[i].value.trim()) {
              context.report({
                ruleId: "tag-table",
                message: "Rogue character".concat(node.children[i].value.trim().length > 1 ? "s" : "", " between tags."),
                idxFrom: node.children[i].start,
                idxTo: node.children[i].end,
                fix: null
              });
            }
          }
          if (!trFound) {
            context.report({
              ruleId: "tag-table",
              message: "Missing children <tr> tags.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: null
            });
          } else if (!tdFound) {
            context.report({
              ruleId: "tag-table",
              message: "Missing children <td> tags.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: null
            });
          }
          if (!closingTrMet) {
            return;
          }
          if (extracted.length) {
            var bail = false;
            var spans = extracted.map(function (findingObj) {
              return findingObj.tds.reduce(function (acc, curr) {
                var temp = 0;
                if (
                node.children[findingObj.idx].children[curr].attribs && node.children[findingObj.idx].children[curr].attribs.length && node.children[findingObj.idx].children[curr].attribs.some(function (attrib) {
                  return attrib.attribName === "colspan" && attrib.attribValue && attrib.attribValue.length && attrib.attribValue.some(function (valObjNode) {
                    if (valObjNode.type === "text") {
                      if (Number.isInteger(+valObjNode.value)) {
                        temp = +valObjNode.value;
                        return true;
                      }
                      bail = true;
                    }
                    return false;
                  });
                })) {
                  return acc + temp;
                }
                return acc + 1;
              }, 0);
            });
            if (bail) {
              return;
            }
            var uniqueSpans = new Set(spans);
            var tdCounts = extracted.map(function (e) {
              return e.tds.length;
            });
            if (uniqueSpans.size && uniqueSpans.size !== 1) {
              var tdMaxCountPerRow = Math.max.apply(Math, _toConsumableArray__default['default'](tdCounts));
              extracted
              .filter(function (e) {
                return e.tds.length !== tdMaxCountPerRow;
              }).forEach(function (e) {
                if (e.tds.length === 1) {
                  if (e.tds.length === spans[e.orderNumber]) {
                    var pos = node.children[e.idx].children[e.tds[0]].end - 1;
                    context.report({
                      ruleId: "tag-table",
                      message: "Add a collspan.",
                      idxFrom: node.children[e.idx].children[e.tds[0]].start,
                      idxTo: node.children[e.idx].children[e.tds[0]].end,
                      fix: {
                        ranges: [[pos, pos, " colspan=\"".concat(tdMaxCountPerRow, "\"")]]
                      }
                    });
                  } else {
                    var attribsOfCulpridTd = node.children[e.idx].children[e.tds[0]].attribs;
                    for (var z = 0, len3 = attribsOfCulpridTd.length; z < len3; z++) {
                      if (attribsOfCulpridTd[z].attribName === "colspan") {
                        context.report({
                          ruleId: "tag-table",
                          message: "Should be colspan=\"".concat(tdMaxCountPerRow, "\"."),
                          idxFrom: attribsOfCulpridTd[z].attribStarts,
                          idxTo: attribsOfCulpridTd[z].attribEnds,
                          fix: {
                            ranges: [[attribsOfCulpridTd[z].attribValueStartsAt, attribsOfCulpridTd[z].attribValueEndsAt, "".concat(tdMaxCountPerRow)]]
                          }
                        });
                        break;
                      }
                    }
                  }
                } else {
                  context.report({
                    ruleId: "tag-table",
                    message: "Should contain ".concat(tdMaxCountPerRow, " td's."),
                    idxFrom: node.children[e.idx].start,
                    idxTo: node.children[e.idx].end,
                    fix: null
                  });
                }
              });
              tdCounts.forEach(function (tdCount, idx) {
                if (
                tdCount === tdMaxCountPerRow &&
                spans[idx] > tdCount) {
                  extracted[idx].tds.forEach(function (tdIdx) {
                    var currentTd = node.children[extracted[idx].idx].children[tdIdx];
                    currentTd.attribs.filter(function (attrib) {
                      return attrib.attribName === "colspan";
                    }).forEach(function (attrib) {
                      context.report({
                        ruleId: "tag-table",
                        message: "Remove the colspan.",
                        idxFrom: attrib.attribStarts,
                        idxTo: attrib.attribEnds,
                        fix: {
                          ranges: [[attrib.attribLeft + 1, attrib.attribEnds]]
                        }
                      });
                    });
                  });
                }
              });
            }
          }
        } else {
          context.report({
            ruleId: "tag-table",
            message: "Missing children <tr> tags.",
            idxFrom: node.start,
            idxTo: node.end,
            fix: null
          });
        }
      } else if (node.tagName === "tr" && !node.closing && node.children && node.children.length && node.children.some(function (n) {
        return n.type === "text" && n.value.trim();
      })) {
        node.children.filter(function (n) {
          return n.type === "text" && n.value.trim();
        }).forEach(function (n) {
          context.report({
            ruleId: "tag-table",
            message: "Rogue character".concat(n.value.trim().length > 1 ? "s" : "", " between tags."),
            idxFrom: n.start,
            idxTo: n.end,
            fix: null
          });
        });
      } else if (node.tagName === "td" && !node.closing) {
        if (!node.children || !node.children.length || !node.children.some(function (n) {
          return n.type !== "text" || n.value.trim();
        })) {
          context.report({
            ruleId: "tag-table",
            message: "Empty <td> tag.",
            idxFrom: node.start,
            idxTo: node.end,
            fix: null
          });
        }
      }
    }
  };
}

function tagMalformed(context) {
  return {
    tag: function tag(node) {
      if (context.str[node.start] !== "<") {
        context.report({
          ruleId: "tag-malformed",
          message: "Add an opening bracket.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[node.start, node.start, "<"]]
          }
        });
      }
      if (context.str[node.end - 1] !== ">") {
        var startPos = stringLeftRight.left(context.str, node.end) + 1;
        context.report({
          ruleId: "tag-malformed",
          message: "Add a closing bracket.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[startPos, startPos, ">"]]
          }
        });
      }
    }
  };
}

var BACKSLASH$1 = "\\";
function tagClosingBackslash(context) {
  return {
    tag: function tag(node) {
      var ranges = [];
      if (Number.isInteger(node.start) && Number.isInteger(node.tagNameStartsAt) && context.str.slice(node.start, node.tagNameStartsAt).includes(BACKSLASH$1)) {
        for (var i = node.start; i < node.tagNameStartsAt; i++) {
          if (context.str[i] === BACKSLASH$1) {
            ranges.push([i, i + 1]);
          }
        }
      }
      if (Number.isInteger(node.end) && context.str[node.end - 1] === ">" &&
      context.str[stringLeftRight.left(context.str, node.end - 1)] === BACKSLASH$1) {
        var message = node.void ? "Replace backslash with slash." : "Delete this.";
        var backSlashPos = stringLeftRight.left(context.str, node.end - 1);
        var idxFrom = stringLeftRight.left(context.str, backSlashPos) + 1;
        var whatToInsert = node.void ? "/" : "";
        if (context.processedRulesConfig["tag-space-before-closing-slash"] && (Number.isInteger(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"] > 0 || Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][0] > 0 && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "never")) {
          idxFrom = stringLeftRight.left(context.str, backSlashPos) + 1;
        }
        if (Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][0] > 0 && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "always") {
          idxFrom = stringLeftRight.left(context.str, backSlashPos) + 1;
          whatToInsert = " ".concat(whatToInsert);
          if (node.void && context.str[idxFrom + 1] === " ") {
            idxFrom += 1;
            whatToInsert = whatToInsert.trim();
          } else if (!node.void) {
            whatToInsert = whatToInsert.trim();
          }
        }
        if (node.void && Array.isArray(context.processedRulesConfig["tag-void-slash"]) && context.processedRulesConfig["tag-void-slash"][0] > 0 && context.processedRulesConfig["tag-void-slash"][1] === "never") {
          whatToInsert = "";
          idxFrom = stringLeftRight.left(context.str, backSlashPos) + 1;
          message = "Delete this.";
        }
        context.report({
          ruleId: "tag-closing-backslash",
          message: message,
          idxFrom: idxFrom,
          idxTo: node.end - 1,
          fix: {
            ranges: [[idxFrom, node.end - 1, whatToInsert]]
          }
        });
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-closing-backslash",
          message: "Wrong slash - backslash.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: {
            ranges: ranges
          }
        });
      }
    }
  };
}

var BACKSLASH = "\\";
function tagVoidSlash(context) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "always";
  return {
    tag: function tag(node) {
      var closingBracketPos = node.end - 1;
      var slashPos = stringLeftRight.left(context.str, closingBracketPos);
      var leftOfSlashPos = stringLeftRight.left(context.str, slashPos) || 0;
      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        context.report({
          ruleId: "tag-void-slash",
          message: "Remove the slash.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[leftOfSlashPos + 1, closingBracketPos]]
          }
        });
      } else if (mode === "always" && node.void && context.str[slashPos] !== "/" && (
      !context.processedRulesConfig["tag-closing-backslash"] || !(context.str[slashPos] === BACKSLASH && (Number.isInteger(context.processedRulesConfig["tag-closing-backslash"]) && context.processedRulesConfig["tag-closing-backslash"] > 0 || Array.isArray(context.processedRulesConfig["tag-closing-backslash"]) && context.processedRulesConfig["tag-closing-backslash"][0] > 0 && context.processedRulesConfig["tag-closing-backslash"][1] === "always")))) {
        if (Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "always") {
          if (context.str[slashPos + 1] === " ") {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: {
                ranges: [[slashPos + 2, closingBracketPos + 1, "/>"]]
              }
            });
          } else {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: {
                ranges: [[slashPos + 1, closingBracketPos + 1, " />"]]
              }
            });
          }
        } else if (context.processedRulesConfig["tag-space-before-closing-slash"] === undefined || Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "never" || Number.isInteger(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"] > 0) {
          context.report({
            ruleId: "tag-void-slash",
            message: "Missing slash.",
            idxFrom: node.start,
            idxTo: node.end,
            fix: {
              ranges: [[closingBracketPos, closingBracketPos + 1, "/>"]]
            }
          });
        }
      }
    }
  };
}

function tagNameCase(context) {
  var knownUpperCaseTags = ["CDATA"];
  var variableCaseTagNames = ["doctype"];
  return {
    tag: function tag(node) {
      if (node.tagName && node.recognised === true) {
        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          if (context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !== node.tagName.toUpperCase()) {
            var ranges = [[node.tagNameStartsAt, node.tagNameEndsAt, node.tagName.toUpperCase()]];
            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartsAt,
              idxTo: node.tagNameEndsAt,
              fix: {
                ranges: ranges
              }
            });
          }
        } else if (context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !== node.tagName && !variableCaseTagNames.includes(node.tagName.toLowerCase())) {
          var _ranges = [[node.tagNameStartsAt, node.tagNameEndsAt, node.tagName]];
          context.report({
            ruleId: "tag-name-case",
            message: "Bad tag name case.",
            idxFrom: node.tagNameStartsAt,
            idxTo: node.tagNameEndsAt,
            fix: {
              ranges: _ranges
            }
          });
        }
      }
    }
  };
}

function tagIsPresent(context) {
  for (var _len = arguments.length, blacklist = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    blacklist[_key - 1] = arguments[_key];
  }
  return {
    tag: function tag(node) {
      if (Array.isArray(blacklist) && blacklist.length) {
        matcher__default['default']([node.tagName], blacklist);
        if (matcher__default['default']([node.tagName], blacklist).length) {
          context.report({
            ruleId: "tag-is-present",
            message: "".concat(node.tagName, " is not allowed."),
            idxFrom: node.start,
            idxTo: node.end,
            fix: {
              ranges: [[node.start, node.end]]
            }
          });
        }
      }
    }
  };
}

function tagBold(context) {
  var suggested = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "strong";
  return {
    tag: function tag(node) {
      if (node.tagName === "bold") {
        context.report({
          ruleId: "tag-bold",
          message: "Tag \"bold\" does not exist in HTML.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[node.tagNameStartsAt, node.tagNameEndsAt, suggested]]
          }
        });
      }
    }
  };
}

function tagBadSelfClosing(context) {
  return {
    tag: function tag(node) {
      if (!node.void && node.value.endsWith(">") && node.value[stringLeftRight.left(node.value, node.value.length - 1)] === "/") {
        var idxFrom = node.start + stringLeftRight.left(node.value, stringLeftRight.left(node.value, node.value.length - 1)) + 1;
        var idxTo = node.start + node.value.length - 1;
        context.report({
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: idxFrom,
          idxTo: idxTo,
          fix: {
            ranges: [[idxFrom, idxTo]]
          }
        });
      }
    }
  };
}

var attributeDuplicate = function attributeDuplicate(context) {
  var attributesWhichCanBeMerged = new Set(["id", "class"]);
  function prepLast(ranges) {
    if (!Array.isArray(ranges) || !ranges.length) {
      return ranges;
    }
    if (!context.str[ranges[ranges.length - 1][1]].trim()) {
      var charOnTheRightIdx = stringLeftRight.right(context.str, ranges[ranges.length - 1][1]);
      if ("/>".includes(context.str[charOnTheRightIdx])) {
        ranges[ranges.length - 1][1] = charOnTheRightIdx;
      }
    }
    return ranges;
  }
  return {
    tag: function tag(node) {
      if (Array.isArray(node.attribs) && node.attribs.length > 1) {
        var attrsGatheredSoFar = new Set();
        var mergeableAttrsCaught = new Set();
        for (var i = 0, len = node.attribs.length; i < len; i++) {
          if (node.attribs[i].attribName === undefined) {
            continue;
          }
          if (!attrsGatheredSoFar.has(node.attribs[i].attribName)) {
            attrsGatheredSoFar.add(node.attribs[i].attribName);
          } else if (!attributesWhichCanBeMerged.has(node.attribs[i].attribName) || Array.isArray(node.attribs[i].attribValue) && node.attribs[i].attribValue.length && node.attribs[i].attribValue.some(function (obj) {
            return obj.value && (obj.value.includes("'") || obj.value.includes("\""));
          })) {
            context.report({
              ruleId: "attribute-duplicate",
              message: "Duplicate attribute \"".concat(node.attribs[i].attribName, "\"."),
              idxFrom: node.attribs[i].attribStarts,
              idxTo: node.attribs[i].attribEnds,
              fix: null
            });
          } else {
            mergeableAttrsCaught.add(node.attribs[i].attribName);
          }
        }
        if (mergeableAttrsCaught && mergeableAttrsCaught.size) {
          _toConsumableArray__default['default'](mergeableAttrsCaught).forEach(function (attrNameBeingMerged) {
            var theFirstRange = [];
            var extractedValues = [];
            var allOtherRanges = [];
            var _loop = function _loop(_i, _len) {
              if (node.attribs[_i].attribName === attrNameBeingMerged) {
                if (!theFirstRange.length) {
                  theFirstRange.push(node.attribs[_i].attribLeft + 1, node.attribs[_i].attribEnds);
                } else {
                  allOtherRanges.push([_i ? node.attribs[_i].attribLeft + 1 : node.attribs[_i].attribStarts, node.attribs[_i].attribEnds]);
                }
                if (node.attribs[_i].attribValueStartsAt) {
                  splitByWhitespace(node.attribs[_i].attribValueRaw, function (_ref) {
                    var _ref2 = _slicedToArray__default['default'](_ref, 2),
                        from = _ref2[0],
                        to = _ref2[1];
                    extractedValues.push(node.attribs[_i].attribValueRaw.slice(from, to));
                  });
                }
              }
            };
            for (var _i = 0, _len = node.attribs.length; _i < _len; _i++) {
              _loop(_i);
            }
            var mergedValue = extractedValues.sort().join(" ");
            if (mergedValue && mergedValue.length) {
              var ranges = prepLast(rangesMerge.rMerge([[].concat(theFirstRange, [" ".concat(attrNameBeingMerged, "=\"").concat(mergedValue, "\"")])].concat(allOtherRanges)));
              context.report({
                ruleId: "attribute-duplicate",
                message: "Duplicate attribute \"".concat(attrNameBeingMerged, "\"."),
                idxFrom: node.start,
                idxTo: node.end,
                fix: {
                  ranges: ranges
                }
              });
            } else {
              var _ranges = prepLast(rangesMerge.rMerge([[].concat(theFirstRange)].concat(allOtherRanges)));
              context.report({
                ruleId: "attribute-duplicate",
                message: "Duplicate attribute \"".concat(attrNameBeingMerged, "\"."),
                idxFrom: node.start,
                idxTo: node.end,
                fix: {
                  ranges: _ranges
                }
              });
            }
          });
        }
      }
    }
  };
};

function attributeMalformed(context) {
  for (var _len = arguments.length, config = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    config[_key - 1] = arguments[_key];
  }
  var blacklist = ["doctype"];
  return {
    attribute: function attribute(node) {
      var inTheEndUseDoubles = true;
      if (config.includes("useSingleToEscapeDouble") && node.attribValueRaw.includes("\"") && !node.attribValueRaw.includes("'") &&
      !node.attribValueRaw.trim().startsWith("\"") && !node.attribValueRaw.trim().endsWith("\"")) {
        inTheEndUseDoubles = false;
      }
      var repeatedQuotesPresent = false;
      if (
      node.attribName === undefined) {
        return;
      }
      if (!node.attribNameRecognised && node.attribName && !node.attribName.startsWith("xmlns:") && !blacklist.includes(node.parent.tagName)) {
        var somethingMatched = false;
        var _iterator = _createForOfIteratorHelper__default['default'](htmlAllKnownAttributes.allHtmlAttribs.values()),
            _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var oneOfAttribs = _step.value;
            if (oneOfAttribs === node.attribName.toLowerCase()) {
              context.report({
                ruleId: "attribute-malformed",
                message: "Should be lowercase.",
                idxFrom: node.attribNameStartsAt,
                idxTo: node.attribNameEndsAt,
                fix: {
                  ranges: [[node.attribNameStartsAt, node.attribNameEndsAt, oneOfAttribs.toLowerCase()]]
                }
              });
              somethingMatched = true;
              break;
            } else if (leven__default['default'](oneOfAttribs, node.attribName) === 1) {
              context.report({
                ruleId: "attribute-malformed",
                message: "Probably meant \"".concat(oneOfAttribs, "\"."),
                idxFrom: node.attribNameStartsAt,
                idxTo: node.attribNameEndsAt,
                fix: {
                  ranges: [[node.attribNameStartsAt, node.attribNameEndsAt, oneOfAttribs]]
                }
              });
              somethingMatched = true;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (!somethingMatched) {
          context.report({
            ruleId: "attribute-malformed",
            message: "Unrecognised attribute \"".concat(node.attribName, "\"."),
            idxFrom: node.attribNameStartsAt,
            idxTo: node.attribNameEndsAt,
            fix: null
          });
        }
      }
      if (node.attribNameEndsAt && (node.attribValueStartsAt ||
      node.attribOpeningQuoteAt && node.attribClosingQuoteAt && node.attribClosingQuoteAt === node.attribOpeningQuoteAt + 1)) {
        if (
        node.attribOpeningQuoteAt !== null && context.str.slice(node.attribNameEndsAt, node.attribOpeningQuoteAt) !== "=") {
          var message = "Malformed around equal.";
          if (!context.str.slice(node.attribNameEndsAt, node.attribOpeningQuoteAt).includes("=")) {
            message = "Equal is missing.";
          }
          var fromRange = node.attribNameEndsAt;
          var toRange = node.attribOpeningQuoteAt;
          var whatToAdd = "=";
          if (context.str[fromRange] === "=") {
            fromRange += 1;
            whatToAdd = undefined;
          }
          context.report({
            ruleId: "attribute-malformed",
            message: message,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: whatToAdd ? [[fromRange, toRange, "="]] : [[fromRange, toRange]]
            }
          });
        }
      }
      if (
      node.attribValueRaw && (node.attribValueRaw.startsWith("\"") || node.attribValueRaw.startsWith("'")) && node.attribValueStartsAt && node.attribOpeningQuoteAt && context.str[node.attribValueStartsAt] === context.str[node.attribOpeningQuoteAt]) {
        var _message = "Delete repeated opening quotes.";
        context.report({
          ruleId: "attribute-malformed",
          message: _message,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges: [[node.attribValueStartsAt, node.attribValueStartsAt + 1]]
          }
        });
        repeatedQuotesPresent = true;
      }
      if (node.attribValueRaw && (
      node.attribValueRaw.endsWith("\"") || node.attribValueRaw.endsWith("'")) && node.attribValueEndsAt && node.attribClosingQuoteAt && context.str[node.attribValueEndsAt] === context.str[node.attribClosingQuoteAt]) {
        var _message2 = "Delete repeated closing quotes.";
        context.report({
          ruleId: "attribute-malformed",
          message: _message2,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges: [[node.attribValueEndsAt - 1, node.attribValueEndsAt]]
          }
        });
        repeatedQuotesPresent = true;
      }
      if (context.str[node.attribOpeningQuoteAt] !== (inTheEndUseDoubles ? "\"" : "'")) {
        if (node.attribOpeningQuoteAt) {
          context.report({
            ruleId: "attribute-malformed",
            message: "Wrong opening quote.",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [[node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, inTheEndUseDoubles ? "\"" : "'"]]
            }
          });
        } else if (node.attribValueStartsAt) {
          context.report({
            ruleId: "attribute-malformed",
            message: "Add an opening quote.",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [[stringLeftRight.left(context.str, node.attribValueStartsAt) + 1, node.attribValueStartsAt, inTheEndUseDoubles ? "\"" : "'"]]
            }
          });
        }
      }
      if (context.str[node.attribClosingQuoteAt] !== (inTheEndUseDoubles ? "\"" : "'")) {
        if (node.attribClosingQuoteAt) {
          context.report({
            ruleId: "attribute-malformed",
            message: "Wrong closing quote.",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [[node.attribClosingQuoteAt, node.attribClosingQuoteAt + 1, inTheEndUseDoubles ? "\"" : "'"]]
            }
          });
        } else if (node.attribValueEndsAt || node.attribOpeningQuoteAt) {
          var startPos = node.attribOpeningQuoteAt;
          if (node.attribValueStartsAt) {
            startPos = node.attribValueStartsAt + node.attribValueRaw.trimEnd().length;
          }
          context.report({
            ruleId: "attribute-malformed",
            message: "Add a closing quote.",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [[startPos, node.attribValueEndsAt || node.attribOpeningQuoteAt, inTheEndUseDoubles ? "\"" : "'"]]
            }
          });
        }
      }
      if (node.parent.pureHTML && node.attribLeft && node.attribStarts && (node.attribLeft + 2 !== node.attribStarts || context.str[node.attribStarts - 1] !== " ")) {
        context.report({
          ruleId: "attribute-malformed",
          message: "Add a space.",
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges: [[node.attribLeft + 1, node.attribStarts, " "]]
          }
        });
      }
      if (!repeatedQuotesPresent && node.attribValueStartsAt && node.attribValueEndsAt && typeof node.attribValueRaw === "string" && (inTheEndUseDoubles && node.attribValueRaw.includes("\"") || !inTheEndUseDoubles && node.attribValueRaw.includes("'"))) {
        node.attribValueRaw.split("").forEach(function (char, idx) {
          if (char === (inTheEndUseDoubles ? "\"" : "'")) {
            context.report({
              ruleId: "attribute-malformed",
              message: "Unencoded quote.",
              idxFrom: node.attribValueStartsAt,
              idxTo: node.attribValueEndsAt,
              fix: {
                ranges: [[node.attribValueStartsAt + idx, node.attribValueStartsAt + idx + 1, inTheEndUseDoubles ? "&quot;" : "&apos;"]]
              }
            });
          }
        });
      }
    }
  };
}

var attributeOnClosingTag = function attributeOnClosingTag(context) {
  return {
    tag: function tag(node) {
      if (node.closing && Array.isArray(node.attribs) && node.attribs.length) {
        context.report({
          ruleId: "attribute-on-closing-tag",
          message: "Attribute on a closing tag.",
          idxFrom: node.attribs[0].attribStarts,
          idxTo: node.attribs[node.attribs.length - 1].attribEnds,
          fix: null
        });
      }
    }
  };
};

function attributeEnforceImgAlt(context) {
  return {
    tag: function tag(node) {
      if (
      node.type === "tag" && node.tagName === "img" && (!node.attribs.length || !node.attribs.some(function (attrib) {
        return !attrib.attribName || attrib.attribName.toLowerCase() === "alt";
      }))) {
        var startPos = node.attribs.length ? node.attribs[~-node.attribs.length].attribEnds : node.tagNameEndsAt;
        var endPos = startPos;
        if (context.str[startPos + 1] && !context.str[startPos].trim() && !context.str[startPos + 1].trim() && stringLeftRight.right(context.str, startPos)) {
          endPos = stringLeftRight.right(context.str, startPos) - 1;
        }
        context.report({
          ruleId: "attribute-enforce-img-alt",
          message: "Add an alt attribute.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[startPos, endPos, ' alt=""']]
          }
        });
      }
    }
  };
}

function attributeValidateAbbr(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "abbr") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-abbr",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
            errorArr = _checkForWhitespace.errorArr;
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-abbr"
          }));
        });
      }
    }
  };
}

var knownUnits = ["cm", "mm", "in", "px", "pt", "pc", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax", "%"];
var knownCharsets = ["adobe-standard-encoding", "adobe-symbol-encoding", "amiga-1251", "ansi_x3.110-1983", "asmo_449", "big5", "big5-hkscs", "bocu-1", "brf", "bs_4730", "bs_viewdata", "cesu-8", "cp50220", "cp51932", "csa_z243.4-1985-1", "csa_z243.4-1985-2", "csa_z243.4-1985-gr", "csn_369103", "dec-mcs", "din_66003", "dk-us", "ds_2089", "ebcdic-at-de", "ebcdic-at-de-a", "ebcdic-ca-fr", "ebcdic-dk-no", "ebcdic-dk-no-a", "ebcdic-es", "ebcdic-es-a", "ebcdic-es-s", "ebcdic-fi-se", "ebcdic-fi-se-a", "ebcdic-fr", "ebcdic-it", "ebcdic-pt", "ebcdic-uk", "ebcdic-us", "ecma-cyrillic", "es", "es2", "euc-kr", "extended_unix_code_fixed_width_for_japanese", "extended_unix_code_packed_format_for_japanese", "gb18030", "gb2312", "gb_1988-80", "gb_2312-80", "gbk", "gost_19768-74", "greek-ccitt", "greek7", "greek7-old", "hp-desktop", "hp-legal", "hp-math8", "hp-pi-font", "hp-roman8", "hz-gb-2312", "ibm-symbols", "ibm-thai", "ibm00858", "ibm00924", "ibm01140", "ibm01141", "ibm01142", "ibm01143", "ibm01144", "ibm01145", "ibm01146", "ibm01147", "ibm01148", "ibm01149", "ibm037", "ibm038", "ibm1026", "ibm1047", "ibm273", "ibm274", "ibm275", "ibm277", "ibm278", "ibm280", "ibm281", "ibm284", "ibm285", "ibm290", "ibm297", "ibm420", "ibm423", "ibm424", "ibm437", "ibm500", "ibm775", "ibm850", "ibm851", "ibm852", "ibm855", "ibm857", "ibm860", "ibm861", "ibm862", "ibm863", "ibm864", "ibm865", "ibm866", "ibm868", "ibm869", "ibm870", "ibm871", "ibm880", "ibm891", "ibm903", "ibm904", "ibm905", "ibm918", "iec_p27-1", "inis", "inis-8", "inis-cyrillic", "invariant", "iso-10646-j-1", "iso-10646-ucs-2", "iso-10646-ucs-4", "iso-10646-ucs-basic", "iso-10646-unicode-latin1", "iso-10646-utf-1", "iso-11548-1", "iso-2022-cn", "iso-2022-cn-ext", "iso-2022-jp", "iso-2022-jp-2", "iso-2022-kr", "iso-8859-1-windows-3.0-latin-1", "iso-8859-1-windows-3.1-latin-1", "iso-8859-10", "iso-8859-13", "iso-8859-14", "iso-8859-15", "iso-8859-16", "iso-8859-2-windows-latin-2", "iso-8859-9-windows-latin-5", "iso-ir-90", "iso-unicode-ibm-1261", "iso-unicode-ibm-1264", "iso-unicode-ibm-1265", "iso-unicode-ibm-1268", "iso-unicode-ibm-1276", "iso_10367-box", "iso_2033-1983", "iso_5427", "iso_5427:1981", "iso_5428:1980", "iso_646.basic:1983", "iso_646.irv:1983", "iso_6937-2-25", "iso_6937-2-add", "iso_8859-1:1987", "iso_8859-2:1987", "iso_8859-3:1988", "iso_8859-4:1988", "iso_8859-5:1988", "iso_8859-6-e", "iso_8859-6-i", "iso_8859-6:1987", "iso_8859-7:1987", "iso_8859-8-e", "iso_8859-8-i", "iso_8859-8:1988", "iso_8859-9:1989", "iso_8859-supp", "it", "jis_c6220-1969-jp", "jis_c6220-1969-ro", "jis_c6226-1978", "jis_c6226-1983", "jis_c6229-1984-a", "jis_c6229-1984-b", "jis_c6229-1984-b-add", "jis_c6229-1984-hand", "jis_c6229-1984-hand-add", "jis_c6229-1984-kana", "jis_encoding", "jis_x0201", "jis_x0212-1990", "jus_i.b1.002", "jus_i.b1.003-mac", "jus_i.b1.003-serb", "koi7-switched", "koi8-r", "koi8-u", "ks_c_5601-1987", "ksc5636", "kz-1048", "latin-greek", "latin-greek-1", "latin-lap", "macintosh", "microsoft-publishing", "mnem", "mnemonic", "msz_7795.3", "nats-dano", "nats-dano-add", "nats-sefi", "nats-sefi-add", "nc_nc00-10:81", "nf_z_62-010", "nf_z_62-010_(1973)", "ns_4551-1", "ns_4551-2", "osd_ebcdic_df03_irv", "osd_ebcdic_df04_1", "osd_ebcdic_df04_15", "pc8-danish-norwegian", "pc8-turkish", "pt", "pt2", "ptcp154", "scsu", "sen_850200_b", "sen_850200_c", "shift_jis", "t.101-g2", "t.61-7bit", "t.61-8bit", "tis-620", "tscii", "unicode-1-1", "unicode-1-1-utf-7", "unknown-8bit", "us-ascii", "us-dk", "utf-16", "utf-16be", "utf-16le", "utf-32", "utf-32be", "utf-32le", "utf-7", "utf-8", "ventura-international", "ventura-math", "ventura-us", "videotex-suppl", "viqr", "viscii", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255", "windows-1256", "windows-1257", "windows-1258", "windows-31j", "windows-874"];
var basicColorNames = {
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00"
};
var extendedColorNames = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
var sixDigitHexColorRegex = /^#([a-f0-9]{6})$/i;
var classNameRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

function attributeValidateAcceptCharset(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "accept-charset") {
        if (!["form"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw, node.attribValueStartsAt, {
          canBeCommaSeparated: true,
          noSpaceAfterComma: true,
          quickPermittedValues: ["UNKNOWN"],
          permittedValues: knownCharsets
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-accept-charset"
          }));
        });
      }
    }
  };
}

function attributeValidateAccept(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "accept") {
        if (!["form", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: ["audio/*", "video/*", "image/*", "text/html", "image/png", "image/gif", "video/mpeg", "text/css", "audio/basic", wholeExtensionRegex],
          permittedValues: Object.keys(db__default['default']),
          canBeCommaSeparated: true,
          noSpaceAfterComma: true
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-accept"
          }));
        });
      }
    }
  };
}

function attributeValidateAccesskey(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "accesskey") {
        if (!["a", "area", "button", "input", "label", "legend", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accesskey",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
            charStart = _checkForWhitespace.charStart,
            charEnd = _checkForWhitespace.charEnd,
            errorArr = _checkForWhitespace.errorArr,
            trimmedVal = _checkForWhitespace.trimmedVal;
        if (typeof charStart === "number" && typeof charEnd === "number") {
          if (trimmedVal.length > 1 && !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))) {
            errorArr.push({
              idxFrom: node.attribValueStartsAt + charStart,
              idxTo: node.attribValueStartsAt + charEnd,
              message: "Should be a single character (escaped or not).",
              fix: null
            });
          }
        }
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-accesskey"
          }));
        });
      }
    }
  };
}

function isSingleSpace(str, originalOpts, errorArr) {
  var defaults = {
    from: 0,
    to: str.length,
    offset: 0
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (str.slice(opts.from, opts.to) !== " ") {
    var ranges;
    if (str[opts.from] === " ") {
      ranges = [[opts.offset + opts.from + 1, opts.offset + opts.to]];
    } else if (str[opts.to - 1] === " ") {
      ranges = [[opts.offset + opts.from, opts.offset + opts.to - 1]];
    } else {
      ranges = [[opts.offset + opts.from, opts.offset + opts.to, " "]];
    }
    errorArr.push({
      idxFrom: opts.offset + opts.from,
      idxTo: opts.offset + opts.to,
      message: "Should be a single space.",
      fix: {
        ranges: ranges
      }
    });
  }
}

function validateValue$1(str, originalOpts, errorArr) {
  var defaults = {
    offset: 0,
    multipleOK: false,
    from: 0,
    to: str.length,
    attribStarts: 0,
    attribEnds: str.length
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var extractedValue = str.slice(opts.from, opts.to);
  var calcultedIsRel = isRelativeUri.isRel(extractedValue);
  if (Array.from(extractedValue).some(function (val) {
    return !val.trim().length;
  })) {
    var ranges = [];
    var foundCharacterRanges = [];
    splitByWhitespace(extractedValue, function (valueRangeArr) {
      foundCharacterRanges.push(valueRangeArr);
    }, function (whitespaceRangeArr) {
      ranges.push(whitespaceRangeArr);
    }, originalOpts);
    var countOfURIs = foundCharacterRanges.reduce(function (acc, curr) {
      if (extractedValue.slice(curr[0] - opts.offset, curr[1] - opts.offset).match(urlRegex__default['default']({
        exact: true
      }))) {
        return acc + 1;
      }
      return acc;
    }, 0);
    foundCharacterRanges.reduce(function (acc, curr) {
      return acc + extractedValue.slice(curr[0] - opts.offset, curr[1] - opts.offset);
    }, "");
    if (countOfURIs > 1) {
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: "There should be only one URI.",
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: "Remove whitespace.",
        fix: {
          ranges: ranges
        }
      });
    }
  } else if (!extractedValue.startsWith("tel:") && !(urlRegex__default['default']({
    exact: true
  }).test(extractedValue) || calcultedIsRel.res)) {
    var message = "Should be an URI.";
    var idxFrom = opts.offset + opts.from;
    var idxTo = opts.offset + opts.to;
    var whatCouldBeExtractedAtAllFromRegex = extractedValue.match(urlRegex__default['default']());
    if (Array.isArray(whatCouldBeExtractedAtAllFromRegex)) {
      if (whatCouldBeExtractedAtAllFromRegex.length > 1 && !opts.multipleOK) {
        message = "There should be only one URI.";
      } else {
        message = "URI's should be separated with a single space.";
      }
      idxFrom = opts.offset + opts.attribStarts;
      idxTo = opts.offset + opts.attribEnds;
    }
    errorArr.push({
      idxFrom: idxFrom,
      idxTo: idxTo,
      message: message,
      fix: null
    });
  }
}
function validateUri(str, originalOpts) {
  var defaults = {
    offset: 0,
    multipleOK: false,
    separator: "space",
    oneSpaceAfterCommaOK: false,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var _checkForWhitespace = checkForWhitespace(str, opts.offset),
      charStart = _checkForWhitespace.charStart,
      charEnd = _checkForWhitespace.charEnd,
      errorArr = _checkForWhitespace.errorArr;
  if (Number.isInteger(charStart)) {
    if (opts.multipleOK) {
      if (opts.separator === "space") {
        splitByWhitespace(str, function (_ref) {
          var _ref2 = _slicedToArray__default['default'](_ref, 2),
              charFrom = _ref2[0],
              charTo = _ref2[1];
          var extractedName = str.slice(charFrom, charTo);
          if (extractedName.endsWith(",") && extractedName.length > 1) {
            errorArr.push({
              idxFrom: opts.offset + charTo - 1,
              idxTo: opts.offset + charTo,
              message: "No commas.",
              fix: null
            });
          } else {
            validateValue$1(str, _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
              from: charFrom,
              to: charTo,
              attribStarts: charStart,
              attribEnds: charEnd,
              offset: opts.offset
            }), errorArr);
          }
        }, function (_ref3) {
          var _ref4 = _slicedToArray__default['default'](_ref3, 2),
              whitespaceFrom = _ref4[0],
              whitespaceTo = _ref4[1];
          return isSingleSpace(str, {
            from: whitespaceFrom,
            to: whitespaceTo,
            offset: opts.offset
          }, errorArr);
        }, {
          from: charStart,
          to: charEnd
        });
      } else {
        stringProcessCommaSeparated.processCommaSep(str, {
          offset: opts.offset,
          oneSpaceAfterCommaOK: false,
          leadingWhitespaceOK: true,
          trailingWhitespaceOK: true,
          cb: function cb(idxFrom, idxTo) {
            str.slice(idxFrom - opts.offset, idxTo - opts.offset);
            validateValue$1(str, _objectSpread__default['default'](_objectSpread__default['default']({}, opts), {}, {
              from: idxFrom - opts.offset,
              to: idxTo - opts.offset,
              attribStarts: charStart,
              attribEnds: charEnd,
              offset: opts.offset
            }), errorArr);
          },
          errCb: function errCb(ranges, message) {
            var fix = {
              ranges: ranges
            };
            if (!str[ranges[0][0] - opts.offset].trim().length && str[ranges[0][0] - opts.offset - 1] && charStart < ranges[0][0] - 1 && (opts.separator === "space" || str[ranges[0][0] - opts.offset - 1] !== "," && str[ranges[0][1] - opts.offset] !== ",")) {
              fix = null;
            }
            errorArr.push({
              idxFrom: ranges[0][0],
              idxTo: ranges[ranges.length - 1][1],
              message: message,
              fix: fix
            });
          }
        });
      }
    } else {
      validateValue$1(str, {
        from: charStart,
        to: charEnd,
        offset: opts.offset
      }, errorArr);
    }
  }
  return errorArr;
}

function attributeValidateAction(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "action") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-action",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-action"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateAlign(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "align") {
        if (!["applet", "caption", "iframe", "img", "input", "object", "legend", "table", "hr", "div", "h1", "h2", "h3", "h4", "h5", "h6", "p", "col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-align",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = [];
        if (["legend", "caption"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["top", "bottom", "left", "right"],
            canBeCommaSeparated: false
          });
        } else if (["applet", "iframe", "img", "input", "object"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["top", "middle", "bottom", "left", "right"],
            canBeCommaSeparated: false
          });
        } else if (["table", "hr"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["left", "center", "right"],
            canBeCommaSeparated: false
          });
        } else if (["div", "h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["left", "center", "right", "justify"],
            canBeCommaSeparated: false
          });
        } else if (["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["left", "center", "right", "justify", "char"],
            canBeCommaSeparated: false
          });
        }
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-align"
          }));
        });
      }
    }
  };
}

var defaults = {
  namedCssLevel1OK: true,
  namedCssLevel2PlusOK: true,
  hexThreeOK: false,
  hexFourOK: false,
  hexSixOK: true,
  hexEightOK: false
};
function validateColor(str, idxOffset, originalOpts) {
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var _checkForWhitespace = checkForWhitespace(str, idxOffset),
      charStart = _checkForWhitespace.charStart,
      charEnd = _checkForWhitespace.charEnd,
      errorArr = _checkForWhitespace.errorArr;
  if (typeof charStart === "number" && typeof charEnd === "number") {
    var attrVal = errorArr.length ? str.slice(charStart, charEnd) : str;
    if (attrVal.length > 1 && isLetter(attrVal[0]) && isLetter(attrVal[1]) && Object.keys(extendedColorNames).includes(attrVal.toLowerCase())) {
      if (!opts.namedCssLevel1OK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: "Named colors (CSS Level 1) not allowed.",
          fix: {
            ranges: [[idxOffset + charStart, idxOffset + charEnd, extendedColorNames[attrVal.toLowerCase()]]]
          }
        });
      } else if (!opts.namedCssLevel2PlusOK && (!opts.namedCssLevel1OK || !Object.keys(basicColorNames).includes(attrVal.toLowerCase()))) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: "Named colors (CSS Level 2+) not allowed.",
          fix: {
            ranges: [[idxOffset + charStart, idxOffset + charEnd, extendedColorNames[attrVal.toLowerCase()]]]
          }
        });
      }
    } else if (attrVal.startsWith("#")) {
      if (attrVal.length !== 7) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: "Hex color code should be 6 digits-long.",
          fix: null
        });
      } else if (!sixDigitHexColorRegex.test(attrVal)) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: "Unrecognised hex code.",
          fix: null
        });
      } else if (!opts.hexSixOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: "Hex colors not allowed.",
          fix: null
        });
      }
    } else if (attrVal.startsWith("rgb(")) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: "rgb() is not allowed.",
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: "Unrecognised color value.",
        fix: null
      });
    }
  }
  return errorArr;
}

function attributeValidateAlink(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "alink") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-alink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-alink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-alink"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateAlt(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "alt") {
        if (!["applet", "area", "img", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-alt",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (node.attribValueStartsAt !== null && node.attribValueEndsAt !== null) {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-alt"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateArchive(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "archive") {
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-archive",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        }
        else if (node.parent.tagName === "applet") {
            validateUri(node.attribValueRaw, {
              offset: node.attribValueStartsAt,
              separator: "comma",
              multipleOK: true
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-archive"
              }));
            });
          } else if (node.parent.tagName === "object") {
            validateUri(node.attribValueRaw, {
              offset: node.attribValueStartsAt,
              separator: "space",
              multipleOK: true
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-archive"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateAxis(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "axis") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-axis",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-axis",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-axis"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateBackground(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "background") {
        if (!["body", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-background",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-background"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateBgcolor(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "bgcolor") {
        if (!["table", "tr", "td", "th", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-bgcolor"
            }));
          });
        }
      }
    }
  };
}

var defaultOpts = {
  type: "integer",
  whitelistValues: [],
  theOnlyGoodUnits: null,
  plusOK: false,
  negativeOK: false,
  zeroOK: true,
  badUnits: [],
  enforceCount: null,
  noUnitsIsFine: true,
  canBeCommaSeparated: false,
  customGenericValueError: null,
  skipWhitespaceChecks: false,
  customPxMessage: null,
  maxValue: null
};
function validateValue(_ref) {
  var str = _ref.str,
      opts = _ref.opts,
      charStart = _ref.charStart,
      charEnd = _ref.charEnd,
      idxOffset = _ref.idxOffset,
      errorArr = _ref.errorArr;
  if (typeof str !== "string") {
    return;
  }
  if (str[charStart] === "0") {
    if (charEnd === charStart + 1) {
      if (!opts.zeroOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: "Zero not allowed.",
          fix: null
        });
      }
    } else if ("0123456789".includes(str[charStart + 1])) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: "Number padded with zero.",
        fix: null
      });
    }
  }
  if (!"0123456789".includes(str[charStart]) && !"0123456789".includes(str[charEnd - 1])) {
    var message = "Digits missing.";
    if (opts.customGenericValueError) {
      message = opts.customGenericValueError;
    } else if (Array.isArray(opts.theOnlyGoodUnits) && !opts.theOnlyGoodUnits.length && opts.type === "integer") {
      message = "Should be integer, no units.";
    }
    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message: message,
      fix: null
    });
  } else if ("0123456789".includes(str[charStart]) && "0123456789".includes(str[charEnd - 1]) && (!opts.noUnitsIsFine || opts.type === "integer" && opts.maxValue && str.slice(charStart, charEnd).match(/^\d+$/) && Number.parseInt(str.slice(charStart, charEnd), 10) > opts.maxValue)) {
    if (!opts.noUnitsIsFine) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: opts.customGenericValueError || "Units missing.",
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: "Maximum, ".concat(opts.maxValue, " exceeded."),
        fix: null
      });
    }
  } else {
    for (var i = charStart; i < charEnd; i++) {
      if (!"0123456789".includes(str[i]) && (str[i] !== "." || opts.type !== "rational") && (str[i] !== "-" || !(opts.negativeOK && i === 0)) && (str[i] !== "+" || !(opts.plusOK && i === 0))) {
        var endPart = str.slice(i, charEnd);
        if (isObj(opts) && (Array.isArray(opts.theOnlyGoodUnits) && !opts.theOnlyGoodUnits.includes(endPart) || Array.isArray(opts.badUnits) && opts.badUnits.includes(endPart))) {
          if (endPart === "px") {
            var _message = opts.customPxMessage ? opts.customPxMessage : "Remove px.";
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message: _message,
              fix: opts.customPxMessage ? null : {
                ranges: [[idxOffset + i, idxOffset + charEnd]]
              }
            });
          } else {
            var _message2 = "Bad unit.";
            if (str.match(/-\s*-/g)) {
              _message2 = "Repeated minus.";
            } else if (str.match(/\+\s*\+/g)) {
              _message2 = "Repeated plus.";
            } else if (Array.isArray(opts.theOnlyGoodUnits) && opts.theOnlyGoodUnits.length && opts.theOnlyGoodUnits.includes(endPart.trim())) {
              _message2 = "Rogue whitespace.";
            } else if (opts.customGenericValueError) {
              _message2 = opts.customGenericValueError;
            } else if (Array.isArray(opts.theOnlyGoodUnits) && !opts.theOnlyGoodUnits.length && opts.type === "integer") {
              _message2 = "Should be integer, no units.";
            }
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message: _message2,
              fix: null
            });
          }
        } else if (!knownUnits.includes(endPart)) {
          var _message3 = "Unrecognised unit.";
          if (/\d/.test(endPart)) {
            _message3 = "Messy value.";
          } else if (knownUnits.includes(endPart.trim())) {
            _message3 = "Rogue whitespace.";
          }
          errorArr.push({
            idxFrom: idxOffset + i,
            idxTo: idxOffset + charEnd,
            message: _message3,
            fix: null
          });
        }
        break;
      }
    }
  }
}
function validateDigitAndUnit(str, idxOffset, originalOpts) {
  if (typeof str !== "string") {
    return [];
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaultOpts), originalOpts);
  var charStart = 0;
  var charEnd = str.length;
  var errorArr = [];
  if (!opts.skipWhitespaceChecks) {
    var retrievedWhitespaceChecksObj = checkForWhitespace(str, idxOffset);
    charStart = retrievedWhitespaceChecksObj.charStart;
    charEnd = retrievedWhitespaceChecksObj.charEnd;
    errorArr = retrievedWhitespaceChecksObj.errorArr;
  }
  if (Number.isInteger(charStart)) {
    if (opts.canBeCommaSeparated) {
      var extractedValues = [];
      stringProcessCommaSeparated.processCommaSep(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: function cb(idxFrom, idxTo) {
          var extractedValue = str.slice(idxFrom - idxOffset, idxTo - idxOffset);
          if (!Array.isArray(opts.whitelistValues) || !opts.whitelistValues.includes(extractedValue)) {
            validateValue({
              str: str,
              opts: opts,
              charStart: idxFrom - idxOffset,
              charEnd: idxTo - idxOffset,
              idxOffset: idxOffset,
              errorArr: errorArr
            });
          }
          extractedValues.push(extractedValue);
        },
        errCb: function errCb(ranges, message) {
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message: message,
            fix: {
              ranges: ranges
            }
          });
        }
      });
      if (Number.isInteger(opts.enforceCount) && extractedValues.length !== opts.enforceCount) {
        errorArr.push({
          idxFrom: charStart + idxOffset,
          idxTo: charEnd + idxOffset,
          message: "There should be ".concat(opts.enforceCount, " values."),
          fix: null
        });
      } else if (typeof opts.enforceCount === "string" && ["even", "odd"].includes(opts.enforceCount.toLowerCase())) {
        if (opts.enforceCount.toLowerCase() === "even" && extractedValues.length % 2 !== 0) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: "Should be an even number of values but found ".concat(extractedValues.length, "."),
            fix: null
          });
        } else if (opts.enforceCount.toLowerCase() !== "even" && extractedValues.length % 2 === 0) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: "Should be an odd number of values but found ".concat(extractedValues.length, "."),
            fix: null
          });
        }
      }
    } else {
      if (!Array.isArray(opts.whitelistValues) || !opts.whitelistValues.includes(str.slice(charStart, charEnd))) {
        validateValue({
          str: str,
          opts: opts,
          charStart: charStart,
          charEnd: charEnd,
          idxOffset: idxOffset,
          errorArr: errorArr
        });
      }
    }
  }
  return errorArr;
}

function attributeValidateBorder(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "border") {
        if (!["table", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-border",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          negativeOK: false,
          theOnlyGoodUnits: []
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-border"
          }));
        });
      }
    }
  };
}

function attributeValidateCellpadding(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "cellpadding") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-cellpadding",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          negativeOK: false,
          theOnlyGoodUnits: ["%"],
          badUnits: ["px"],
          customGenericValueError: "Should be integer, either no units or percentage."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-cellpadding"
          }));
        });
      }
    }
  };
}

function attributeValidateCellspacing(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "cellspacing") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-cellspacing",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          negativeOK: false,
          theOnlyGoodUnits: ["%"],
          badUnits: ["px"],
          customGenericValueError: "Should be integer, either no units or percentage."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-cellspacing"
          }));
        });
      }
    }
  };
}

function attributeValidateChar(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "char") {
        if (!["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              charStart = _checkForWhitespace.charStart,
              charEnd = _checkForWhitespace.charEnd,
              errorArr = _checkForWhitespace.errorArr,
              trimmedVal = _checkForWhitespace.trimmedVal;
          if (typeof charStart === "number" && typeof charEnd === "number") {
            if (trimmedVal.length > 1 && !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))) {
              errorArr.push({
                idxFrom: node.attribValueStartsAt + charStart,
                idxTo: node.attribValueStartsAt + charEnd,
                message: "Should be a single character.",
                fix: null
              });
            }
          }
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-char"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateCharoff(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "charoff") {
        if (!["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            type: "integer",
            negativeOK: true,
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          });
          if (!node.parent.attribs.some(function (attribObj) {
            return attribObj.attribName === "char";
          })) {
            errorArr.push({
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: "Attribute \"char\" missing.",
              fix: null
            });
          }
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-charoff"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateCharset(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "charset") {
        if (!["a", "link", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateString(node.attribValueRaw, node.attribValueStartsAt, {
            canBeCommaSeparated: false,
            noSpaceAfterComma: false,
            quickPermittedValues: [],
            permittedValues: knownCharsets
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-charset"
            }));
          });
        }
      }
    }
  };
}

function validateVoid(node, context, errorArr, originalOpts) {
  var defaults = {
    xhtml: false,
    enforceSiblingAttributes: null
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.xhtml) {
    var quotesType = "\"";
    if (node.attribOpeningQuoteAt !== null && context.str[node.attribOpeningQuoteAt] === "'") {
      quotesType = "'";
    } else if (node.attribClosingQuoteAt !== null && context.str[node.attribClosingQuoteAt] === "'") {
      quotesType = "'";
    }
    if (node.attribValueRaw !== node.attribName || context.str.slice(node.attribNameEndsAt, node.attribEnds) !== "=".concat(quotesType).concat(node.attribName).concat(quotesType)) {
      errorArr.push({
        idxFrom: node.attribNameStartsAt,
        idxTo: node.attribNameEndsAt,
        message: "It's XHTML, add value, =\"".concat(node.attribName, "\"."),
        fix: {
          ranges: [[node.attribNameEndsAt, node.attribEnds, "=".concat(quotesType).concat(node.attribName).concat(quotesType)]]
        }
      });
    }
  } else if (node.attribValueRaw !== null) {
    errorArr.push({
      idxFrom: node.attribNameEndsAt,
      idxTo: node.attribEnds,
      message: "Should have no value.",
      fix: {
        ranges: [[node.attribNameEndsAt, node.attribEnds]]
      }
    });
  }
  if (isObj(opts.enforceSiblingAttributes) && Object.keys(opts.enforceSiblingAttributes).length) {
    Object.keys(opts.enforceSiblingAttributes).forEach(function (siblingAttr) {
      if (Array.isArray(node.parent.attribs) && !node.parent.attribs.some(function (attribObj) {
        return attribObj.attribName === siblingAttr;
      })) {
        errorArr.push({
          idxFrom: node.parent.start,
          idxTo: node.parent.end,
          message: "Should have attribute \"".concat(siblingAttr, "\"."),
          fix: null
        });
      } else if (opts.enforceSiblingAttributes[siblingAttr] && Array.isArray(opts.enforceSiblingAttributes[siblingAttr]) && Array.isArray(node.parent.attribs) && !node.parent.attribs.some(function (attribObj) {
        return attribObj.attribName === siblingAttr && opts.enforceSiblingAttributes[siblingAttr].includes(attribObj.attribValueRaw);
      })) {
        var idxFrom;
        var idxTo;
        for (var i = 0, len = node.parent.attribs.length; i < len; i++) {
          if (node.parent.attribs[i].attribName === siblingAttr) {
            idxFrom = node.parent.attribs[i].attribValueStartsAt;
            idxTo = node.parent.attribs[i].attribValueEndsAt;
            break;
          }
        }
        errorArr.push({
          idxFrom: idxFrom,
          idxTo: idxTo,
          message: "Only tags with ".concat(opts.enforceSiblingAttributes[siblingAttr].map(function (val) {
            return "\"".concat(val, "\"");
          }).join(" or "), " attributes can be ").concat(node.attribName, "."),
          fix: null
        });
      }
    });
  }
  return errorArr;
}

function attributeValidateChecked(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "checked") {
        if (node.parent.tagName !== "input") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: {
              type: ["checkbox", "radio"]
            }
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-checked"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateCite(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "cite") {
        if (!["blockquote", "q", "del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cite",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-cite"
            }));
          });
        }
      }
    }
  };
}

function checkClassOrIdValue(str, originalOpts, errorArr) {
  var defaults = {
    typeName: "class",
    from: 0,
    to: str.length,
    offset: 0
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var listOfUniqueNames = new Set();
  splitByWhitespace(
  str,
  function (_ref) {
    var _ref2 = _slicedToArray__default['default'](_ref, 2),
        charFrom = _ref2[0],
        charTo = _ref2[1];
    var extractedName = str.slice(charFrom, charTo);
    if (!classNameRegex.test(extractedName)) {
      errorArr.push({
        idxFrom: charFrom,
        idxTo: charTo,
        message: "Wrong ".concat(opts.typeName, " name."),
        fix: null
      });
    }
    if (!listOfUniqueNames.has(extractedName)) {
      listOfUniqueNames.add(extractedName);
    } else {
      var deleteFrom = charFrom;
      var deleteTo = charTo;
      var nonWhitespaceCharOnTheRight = stringLeftRight.right(str, deleteTo);
      if (deleteTo >= opts.to || !nonWhitespaceCharOnTheRight || nonWhitespaceCharOnTheRight > opts.to) {
        deleteFrom = stringLeftRight.left(str, charFrom) + 1;
      } else {
        deleteTo = nonWhitespaceCharOnTheRight;
      }
      errorArr.push({
        idxFrom: charFrom,
        idxTo: charTo,
        message: "Duplicate ".concat(opts.typeName, " \"").concat(extractedName, "\"."),
        fix: {
          ranges: [[deleteFrom, deleteTo]]
        }
      });
    }
  },
  function (_ref3) {
    var _ref4 = _slicedToArray__default['default'](_ref3, 2),
        whitespaceFrom = _ref4[0],
        whitespaceTo = _ref4[1];
    return isSingleSpace(str, {
      from: whitespaceFrom,
      to: whitespaceTo,
      offset: opts.offset
    }, errorArr);
  },
  opts
  );
}

function attributeValidateClass(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "class") {
        if (["base", "basefont", "head", "html", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              charStart = _checkForWhitespace.charStart,
              charEnd = _checkForWhitespace.charEnd,
              errorArr = _checkForWhitespace.errorArr;
          if (typeof charStart === "number" && typeof charEnd === "number") {
            checkClassOrIdValue(context.str, {
              typeName: node.attribName,
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0
            }, errorArr
            );
          }
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-class"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateClassid$1(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "classid") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-classid",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-classid"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateClassid(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "clear") {
        if (node.parent.tagName !== "br") {
          context.report({
            ruleId: "attribute-validate-clear",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
            charStart = _checkForWhitespace.charStart,
            charEnd = _checkForWhitespace.charEnd,
            errorArr = _checkForWhitespace.errorArr;
        if (typeof charStart === "number" && typeof charEnd === "number" && !["left", "all", "right", "none"].includes(context.str.slice(node.attribValueStartsAt + charStart, node.attribValueStartsAt + charEnd))) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message: "Should be: left|all|right|none.",
            fix: null
          });
        }
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-clear"
          }));
        });
      }
    }
  };
}

function attributeValidateCode(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "code") {
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-code",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-code",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
              _checkForWhitespace.charStart;
              _checkForWhitespace.charEnd;
              var errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-code"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateCodebase(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "codebase") {
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-codebase",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-codebase"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateCodetype(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "codetype") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-codetype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: ["application/javascript", "application/json", "application/x-www-form-urlencoded", "application/xml", "application/zip", "application/pdf", "application/sql", "application/graphql", "application/ld+json", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.oasis.opendocument.text", "application/zstd", "audio/mpeg", "audio/ogg", "multipart/form-data", "text/css", "text/html", "text/xml", "text/csv", "text/plain", "image/png", "image/jpeg", "image/gif", "application/vnd.api+json"],
          permittedValues: Object.keys(db__default['default']),
          canBeCommaSeparated: false,
          noSpaceAfterComma: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-codetype"
          }));
        });
      }
    }
  };
}

function attributeValidateColor(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "color") {
        if (!["basefont", "font"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-color"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateCols(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "cols") {
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cols",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = [];
          if (node.parent.tagName === "frameset") {
            errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              whitelistValues: ["*"],
              theOnlyGoodUnits: ["%"],
              badUnits: ["px"],
              noUnitsIsFine: true,
              canBeCommaSeparated: true,
              type: "rational",
              customGenericValueError: "Should be: pixels|%|*."
            });
          } else if (node.parent.tagName === "textarea") {
            errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units."
            });
          }
          if (Array.isArray(errorArr) && errorArr.length) {
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-cols"
              }));
            });
          }
        }
      }
    }
  };
}

function attributeValidateColspan(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "colspan") {
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-colspan",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-colspan"
          }));
        });
      }
    }
  };
}

function attributeValidateCompact(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "compact") {
        if (!["dir", "dl", "menu", "ol", "ul"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-compact"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateContent(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "content") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-content",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
            _checkForWhitespace.charStart;
            _checkForWhitespace.charEnd;
            var errorArr = _checkForWhitespace.errorArr;
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-content"
          }));
        });
      }
    }
  };
}

function attributeValidateCoords(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "coords") {
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-coords",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          if (!Array.isArray(node.parent.attribs) || !node.parent.attribs.length || !node.parent.attribs.some(function (attrObj) {
            return attrObj.attribName === "shape";
          })) {
            context.report({
              ruleId: "attribute-validate-coords",
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: "Missing \"shape\" attribute.",
              fix: null
            });
          } else {
            var shapeAttr = node.parent.attribs.filter(function (attrObj) {
              return attrObj.attribName === "shape";
            })[0];
            var enforceCount = null;
            if (shapeAttr.attribValueRaw === "rect") {
              enforceCount = 4;
            } else if (shapeAttr.attribValueRaw === "circle") {
              enforceCount = 3;
            } else if (shapeAttr.attribValueRaw === "poly") {
              enforceCount = "even";
            }
            var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              whitelistValues: [],
              theOnlyGoodUnits: [],
              badUnits: [],
              noUnitsIsFine: true,
              canBeCommaSeparated: true,
              enforceCount: enforceCount,
              type: "integer",
              customGenericValueError: "Should be integer, no units."
            });
            if (Array.isArray(errorArr) && errorArr.length) {
              errorArr.forEach(function (errorObj) {
                context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                  ruleId: "attribute-validate-coords"
                }));
              });
            }
          }
        }
      }
    }
  };
}

function attributeValidateData(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "data") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-data",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-data"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateDatetime(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "datetime") {
        if (!["del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-datetime",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: [isoDateRegex],
          canBeCommaSeparated: false,
          noSpaceAfterComma: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-datetime"
          }));
        });
      }
    }
  };
}

function attributeValidateDeclare(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "declare") {
        if (node.parent.tagName !== "object") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-declare"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateDefer(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "defer") {
        if (node.parent.tagName !== "script") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-defer"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateDir(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "dir") {
        if (["applet", "base", "basefont", "br", "frame", "frameset", "iframe", "param", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-dir",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["ltr", "rtl"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-dir"
          }));
        });
      }
    }
  };
}

function attributeValidateDisabled(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "disabled") {
        if (!["button", "input", "optgroup", "option", "select", "textarea"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-disabled"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateEnctype(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "enctype") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-enctype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
          permittedValues: Object.keys(db__default['default']),
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-enctype"
          }));
        });
      }
    }
  };
}

function attributeValidateFace(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "face") {
        if (node.parent.tagName !== "font") {
          context.report({
            ruleId: "attribute-validate-face",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
            _checkForWhitespace.charStart;
            _checkForWhitespace.charEnd;
            var errorArr = _checkForWhitespace.errorArr;
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-face"
          }));
        });
      }
    }
  };
}

function attributeValidateFor(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "for") {
        if (node.parent.tagName !== "label") {
          context.report({
            ruleId: "attribute-validate-for",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
                charStart = _checkForWhitespace.charStart,
                charEnd = _checkForWhitespace.charEnd,
                errorArr = _checkForWhitespace.errorArr;
            if (typeof charStart === "number" && typeof charEnd === "number") {
              var extractedValue = node.attribValueRaw.slice(charStart, charEnd);
              var message = "Wrong id name.";
              var fix = null;
              var idxFrom = charStart + node.attribValueStartsAt;
              var idxTo = charEnd + node.attribValueStartsAt;
              if (Number.isInteger(charStart) && !classNameRegex.test(extractedValue)) {
                if (Array.from(extractedValue).some(function (val) {
                  return !val.trim().length;
                })) {
                  message = "Should be one value, no spaces.";
                } else if (extractedValue.includes("#")) {
                  message = "Remove hash.";
                  var firstHashAt = node.attribValueRaw.indexOf("#");
                  fix = {
                    ranges: [[node.attribValueStartsAt + firstHashAt, node.attribValueStartsAt + firstHashAt + 1]]
                  };
                  idxFrom = node.attribValueStartsAt + firstHashAt;
                  idxTo = node.attribValueStartsAt + firstHashAt + 1;
                }
                errorArr.push({
                  ruleId: "attribute-validate-for",
                  idxFrom: idxFrom,
                  idxTo: idxTo,
                  message: message,
                  fix: fix
                });
              }
            }
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-for"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateFrame(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "frame") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-frame",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["void", "above", "below", "hsides", "lhs", "rhs", "vsides", "box", "border"
          ],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-frame"
          }));
        });
      }
    }
  };
}

function attributeValidateFrameborder(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "frameborder") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-frameborder",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["0", "1"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-frameborder"
          }));
        });
      }
    }
  };
}

function attributeValidateHeaders(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "headers") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-headers",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
                charStart = _checkForWhitespace.charStart,
                charEnd = _checkForWhitespace.charEnd,
                errorArr = _checkForWhitespace.errorArr;
            checkClassOrIdValue(context.str, {
              typeName: "id",
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0
            }, errorArr
            );
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-headers"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateHeight(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "height") {
        if (!["iframe", "td", "th", "img", "object", "applet"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-height",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          badUnits: ["px"],
          theOnlyGoodUnits: ["%"],
          noUnitsIsFine: true,
          customGenericValueError: "Should be \"pixels|%\"."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-height"
          }));
        });
      }
    }
  };
}

function attributeValidateHref(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "href") {
        if (!["a", "area", "link", "base"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-href",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-href"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateHreflang(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "hreflang") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hreflang",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
            charStart = _checkForWhitespace.charStart,
            charEnd = _checkForWhitespace.charEnd,
            errorArr = _checkForWhitespace.errorArr;
        var _isLangCode = isLanguageCode.isLangCode(node.attribValueRaw.slice(charStart, charEnd)),
            message = _isLangCode.message;
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message: message,
            fix: null
          });
        }
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-hreflang"
          }));
        });
      }
    }
  };
}

function attributeValidateHspace(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "hspace") {
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hspace",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-hspace"
          }));
        });
      }
    }
  };
}

function attributeValidateHttpequiv(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "http-equiv") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-http-equiv",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["content-type", "default-style", "refresh", "X-UA-Compatible"],
          canBeCommaSeparated: false,
          caseInsensitive: true
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-http-equiv"
          }));
        });
      }
    }
  };
}

function attributeValidateId(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "id") {
        if (["base", "head", "html", "meta", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-id",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
                charStart = _checkForWhitespace.charStart,
                charEnd = _checkForWhitespace.charEnd,
                errorArr = _checkForWhitespace.errorArr;
            checkClassOrIdValue(context.str, {
              typeName: node.attribName,
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0
            }, errorArr
            );
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-id"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateIsmap(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "ismap") {
        if (!["img", "input"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-ismap"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateLabel(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "label") {
        if (!["option", "optgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-label",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-label"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateLang(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "lang") {
        if (["applet", "base", "basefont", "br", "frame", "frameset", "iframe", "param", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-lang",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
            charStart = _checkForWhitespace.charStart,
            charEnd = _checkForWhitespace.charEnd,
            errorArr = _checkForWhitespace.errorArr;
        var _isLangCode = isLanguageCode.isLangCode(node.attribValueRaw.slice(charStart, charEnd)),
            message = _isLangCode.message;
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message: message,
            fix: null
          });
        }
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-lang"
          }));
        });
      }
    }
  };
}

function attributeValidateLanguage(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "language") {
        if (node.parent.tagName !== "script") {
          context.report({
            ruleId: "attribute-validate-language",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-language"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateLink(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "link") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-link",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-link"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateLongdesc(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "longdesc") {
        if (!["img", "frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-longdesc",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-longdesc"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateMarginheight(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "marginheight") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginheight",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-marginheight"
          }));
        });
      }
    }
  };
}

function attributeValidateMarginwidth(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "marginwidth") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginwidth",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-marginwidth"
          }));
        });
      }
    }
  };
}

function attributeValidateMaxlength(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "maxlength") {
        if (node.parent.tagName !== "input") {
          context.report({
            ruleId: "attribute-validate-maxlength",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-maxlength"
          }));
        });
      }
    }
  };
}

function attributeValidateMedia(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "media") {
        if (!["style", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-media",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
            charStart = _checkForWhitespace.charStart,
            charEnd = _checkForWhitespace.charEnd,
            errorArr = _checkForWhitespace.errorArr;
        errorArr.concat(isMediaDescriptor.isMediaD(node.attribValueRaw.slice(charStart, charEnd), {
          offset: node.attribValueStartsAt
        })).forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-media"
          }));
        });
      }
    }
  };
}

function attributeValidateMethod(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "method") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-method",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["get", "post"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-method"
          }));
        });
      }
    }
  };
}

function attributeValidateMultiple(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "multiple") {
        if (node.parent.tagName !== "select") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-multiple"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateName(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "name") {
        if (!["button", "textarea", "applet", "select", "form", "frame", "iframe", "img", "a", "input", "object", "map", "param", "meta"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-name",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-name"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateNohref(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "nohref") {
        if (node.parent.tagName !== "area") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-nohref"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateNoresize(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "noresize") {
        if (node.parent.tagName !== "frame") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-noresize"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateNoshade(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "noshade") {
        if (node.parent.tagName !== "hr") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-noshade"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateNowrap(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "nowrap") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-nowrap"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateObject(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "object") {
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-object",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-object"
            }));
          });
        }
      }
    }
  };
}

function validateScript(str, idxOffset
) {
  var _checkForWhitespace = checkForWhitespace(str, idxOffset),
      errorArr = _checkForWhitespace.errorArr;
  return errorArr;
}

function attributeValidateOnblur(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onblur") {
        if (!["a", "area", "button", "input", "label", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onblur",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onblur"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnchange(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onchange") {
        if (!["input", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onchange",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onchange"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnclick(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onclick") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onclick",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onclick"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOndblclick(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "ondblclick") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-ondblclick",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-ondblclick"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnfocus(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onfocus") {
        if (!["a", "area", "button", "input", "label", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onfocus",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onfocus"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnkeydown(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onkeydown") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onkeydown",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onkeydown"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnkeypress(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onkeypress") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onkeypress",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onkeypress"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnkeyup(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onkeyup") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onkeyup",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onkeyup"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnload(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onload") {
        if (!["frameset", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onload",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onload"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnmousedown(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onmousedown") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmousedown",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onmousedown"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnmousemove(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onmousemove") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmousemove",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onmousemove"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnmouseout(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onmouseout") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmouseout",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onmouseout"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnmouseover(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onmouseover") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmouseover",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onmouseover"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnmouseup(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onmouseup") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmouseup",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onmouseup"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnreset(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onreset") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onreset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onreset"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnsubmit(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onsubmit") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onsubmit",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onsubmit"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnselect(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onselect") {
        if (!["input", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onselect",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onselect"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateOnunload(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "onunload") {
        if (!["frameset", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onunload",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: "Missing value.",
              fix: null
            });
          } else {
            var errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-onunload"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateProfile(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "profile") {
        if (node.parent.tagName !== "head") {
          context.report({
            ruleId: "attribute-validate-profile",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: true
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-profile"
            }));
          });
        }
      }
    }
  };
}

function attributeValidatePrompt(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "prompt") {
        if (node.parent.tagName !== "isindex") {
          context.report({
            ruleId: "attribute-validate-prompt",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-prompt"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateReadonly(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "readonly") {
        if (!["textarea", "input"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-readonly"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateRel(context) {
  var enforceLowercase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return {
    attribute: function attribute(node) {
      if (node.attribName === "rel") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rel",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: linkTypes,
          canBeCommaSeparated: false,
          caseInsensitive: !enforceLowercase
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-rel"
          }));
        });
      }
    }
  };
}

function attributeValidateRev(context) {
  var enforceLowercase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return {
    attribute: function attribute(node) {
      if (node.attribName === "rev") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rev",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: linkTypes,
          canBeCommaSeparated: false,
          caseInsensitive: !enforceLowercase
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-rev"
          }));
        });
      }
    }
  };
}

function attributeValidateRows(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "rows") {
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rows",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = [];
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else if (node.parent.tagName === "frameset") {
          errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            whitelistValues: ["*"],
            theOnlyGoodUnits: ["%"],
            badUnits: ["px"],
            noUnitsIsFine: true,
            canBeCommaSeparated: true,
            type: "rational",
            customGenericValueError: "Should be: pixels|%|*."
          });
        } else if (node.parent.tagName === "textarea") {
          errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          });
        }
        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-rows"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateRowspan(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "rowspan") {
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rowspan",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-rowspan"
          }));
        });
      }
    }
  };
}

function attributeValidateRules(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "rules") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-rules",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["none", "groups", "rows", "cols", "all"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-rules"
          }));
        });
      }
    }
  };
}

function attributeValidateScheme(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "scheme") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-scheme",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-scheme"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateScope(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "scope") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scope",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["row", "col", "rowgroup", "colgroup"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-scope"
          }));
        });
      }
    }
  };
}

function attributeValidateScrolling(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "scrolling") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scrolling",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["auto", "yes", "no"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-scrolling"
          }));
        });
      }
    }
  };
}

function attributeValidateSelected(context, mode) {
  return {
    attribute: function attribute(node) {
      var errorArr = [];
      if (node.attribName === "selected") {
        if (node.parent.tagName !== "option") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-selected"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateShape(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "shape") {
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-shape",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["default", "rect", "circle", "poly"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-shape"
          }));
        });
      }
    }
  };
}

function attributeValidateSize(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "size") {
        if (!["hr", "font", "input", "basefont", "select"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-size",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              charStart = _checkForWhitespace.charStart,
              charEnd = _checkForWhitespace.charEnd,
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-size"
            }));
          });
          if (typeof charStart === "number" && typeof charEnd === "number") {
            var extractedVal = node.attribValueRaw.slice(charStart, charEnd);
            if (["hr", "input", "select"].includes(node.parent.tagName)) {
              validateDigitAndUnit(extractedVal, node.attribValueStartsAt + charStart, {
                type: "integer",
                negativeOK: false,
                theOnlyGoodUnits: [],
                skipWhitespaceChecks: true
              }).forEach(function (errorObj) {
                context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                  ruleId: "attribute-validate-size"
                }));
              });
            } else if (["font", "basefont"].includes(node.parent.tagName)) {
              if (!extractedVal.match(fontSizeRegex)) {
                var errorArr2 = validateDigitAndUnit(extractedVal, node.attribValueStartsAt + charStart, {
                  type: "integer",
                  negativeOK: false,
                  theOnlyGoodUnits: [],
                  skipWhitespaceChecks: true,
                  customGenericValueError: "Should be integer 1-7, plus/minus are optional."
                });
                if (!errorArr2.length) {
                  errorArr2.push({
                    idxFrom: node.attribValueStartsAt + charStart,
                    idxTo: node.attribValueStartsAt + charEnd,
                    message: "Should be integer 1-7, plus/minus are optional.",
                    fix: null
                  });
                }
                errorArr2.forEach(function (errorObj) {
                  context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                    ruleId: "attribute-validate-size"
                  }));
                });
              }
            }
          }
        }
      }
    }
  };
}

function attributeValidateSpan(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "span") {
        if (!["col", "colgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-span",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units.",
          zeroOK: false,
          customPxMessage: "Columns number is not in pixels."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-span"
          }));
        });
      }
    }
  };
}

function attributeValidateSrc(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "src") {
        if (!["script", "input", "frame", "iframe", "img"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-src",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-src"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateStandby(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "standby") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-standby",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-standby"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateStart(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "start") {
        if (node.parent.tagName !== "ol") {
          context.report({
            ruleId: "attribute-validate-start",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units.",
          zeroOK: false,
          customPxMessage: "Starting sequence number is not in pixels."
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-start"
          }));
        });
      }
    }
  };
}

function validateStyle(token, context) {
  var nodeArr;
  var ruleId = "";
  if (token.properties !== undefined) {
    nodeArr = token.properties;
    ruleId = "css-rule-malformed";
  } else if (token.attribValue !== undefined) {
    nodeArr = token.attribValue;
    ruleId = "attribute-validate-style";
  }
  if (!nodeArr || !ruleId) {
    return;
  }
  var properties = [];
  if (nodeArr.some(function (property) {
    return property.property !== undefined;
  })) {
    properties = nodeArr.filter(function (property) {
      return property.property !== undefined;
    });
  }
  if (properties && properties.length) {
    for (var i = properties.length - 1; i--;) {
      if (properties[i].semi === null && properties[i].value) {
        context.report({
          ruleId: ruleId,
          idxFrom: properties[i].start,
          idxTo: properties[i].end,
          message: "Add a semicolon.",
          fix: {
            ranges: [[properties[i].end, properties[i].end, ";"]]
          }
        });
      }
    }
    properties.forEach(function (property) {
      if (property.important && property.important !== "!important") {
        context.report({
          ruleId: ruleId,
          idxFrom: property.importantStarts,
          idxTo: property.importantEnds,
          message: "Malformed !important.",
          fix: {
            ranges: [[property.importantStarts, property.importantEnds, "!important"]]
          }
        });
      }
      if (property.colon && property.propertyEnds && property.propertyEnds < property.colon) {
        context.report({
          ruleId: ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: "Gap in front of semicolon.",
          fix: {
            ranges: [[property.propertyEnds, property.colon]]
          }
        });
      }
      if (property.semi && (property.importantEnds || property.valueEnds) && (property.importantEnds || property.valueEnds) < property.semi) {
        context.report({
          ruleId: ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: "Gap in front of semi.",
          fix: {
            ranges: [[property.importantEnds || property.valueEnds, property.semi]]
          }
        });
      }
      if (property.colon && context.str[property.colon] !== ":") {
        context.report({
          ruleId: ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: "Mis-typed colon.",
          fix: {
            ranges: [[property.colon, property.colon + 1, ":"]]
          }
        });
      }
      if (property.semi && !property.propertyStarts && !property.valueStarts && !property.importantStarts) {
        context.report({
          ruleId: ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: "Rogue semicolon.",
          fix: {
            ranges: [[property.semi, property.semi + 1]]
          }
        });
      }
      if (property.colon && property.valueStarts) {
        if (property.valueStarts > property.colon + 2) {
          context.report({
            ruleId: ruleId,
            idxFrom: property.start,
            idxTo: property.end,
            message: "Remove whitespace.",
            fix: {
              ranges: [[property.colon + 2, property.valueStarts]]
            }
          });
        }
        if (property.valueStarts > property.colon + 1 && !context.str[property.colon + 1].trim() && context.str[property.colon + 1] !== " ") {
          context.report({
            ruleId: ruleId,
            idxFrom: property.colon + 1,
            idxTo: property.valueStarts,
            message: "Replace whitespace.",
            fix: {
              ranges: [[property.colon + 1, property.valueStarts, " "]]
            }
          });
        }
      }
    });
  }
  if (nodeArr && Array.isArray(nodeArr) && nodeArr.length) {
    for (var _i = 0, len = nodeArr.length; _i < len; _i++) {
      if (
      (!_i ||
      _i === len - 1) && nodeArr[_i].type === "text" && ruleId === "attribute-validate-style") {
        if (len === 1) {
          context.report({
            ruleId: ruleId,
            idxFrom: nodeArr[_i].start,
            idxTo: nodeArr[_i].end,
            message: "Missing value.",
            fix: null
          });
        } else {
          context.report({
            ruleId: ruleId,
            idxFrom: nodeArr[_i].start,
            idxTo: nodeArr[_i].end,
            message: "Remove whitespace.",
            fix: {
              ranges: [[nodeArr[_i].start, nodeArr[_i].end]]
            }
          });
        }
      }
      if (nodeArr[_i].value === null) {
        if (nodeArr[_i].important !== null && nodeArr[_i].property === null) {
          var errorRaised = false;
          if (_i) {
            for (var y = nodeArr.length; y--;) {
              if (y === _i) {
                continue;
              }
              if (
              nodeArr[_i].important && !nodeArr[_i].propertyStarts && !nodeArr[_i].valueStarts &&
              nodeArr[y].property !== undefined) {
                if (
                nodeArr[y].semi &&
                !nodeArr[y].importantStarts) {
                  var fromIdx = nodeArr[y].semi;
                  var toIdx = nodeArr[y].semi + 1;
                  var whatToInsert = void 0;
                  if (context.str[nodeArr[y].semi + 1] !== " ") {
                    whatToInsert = " ";
                  }
                  context.report({
                    ruleId: ruleId,
                    idxFrom: fromIdx,
                    idxTo: toIdx,
                    message: "Delete the semicolon.",
                    fix: {
                      ranges: [[fromIdx, toIdx, whatToInsert]]
                    }
                  });
                  errorRaised = true;
                } else {
                  break;
                }
              }
            }
          }
          if (
          nodeArr[_i].property !== undefined &&
          !errorRaised) {
            context.report({
              ruleId: ruleId,
              idxFrom: nodeArr[_i].start,
              idxTo: nodeArr[_i].end,
              message: "Missing value.",
              fix: null
            });
          }
        } else if (
        nodeArr[_i].property || nodeArr[_i].value || nodeArr[_i].important) {
          context.report({
            ruleId: ruleId,
            idxFrom: nodeArr[_i].start,
            idxTo: nodeArr[_i].end,
            message: "Missing value.",
            fix: null
          });
        }
      }
    }
  }
}

function attributeValidateStyle(context) {
  for (var _len = arguments.length, opts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    opts[_key - 1] = arguments[_key];
  }
  return {
    attribute: function attribute(node) {
      if (node.attribName === "style") {
        if (["base", "basefont", "head", "html", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-style",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (node.attribValueRaw && node.attribValueRaw.trim()) {
          validateStyle(node, context);
        } else {
          context.report({
            ruleId: "attribute-validate-style",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        }
      }
    }
  };
}

function attributeValidateSummary(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "summary") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-summary",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-summary"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateTabindex(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "tabindex") {
        if (!["a", "area", "button", "input", "object", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-tabindex",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units.",
          zeroOK: true,
          customPxMessage: "Tabbing order number should not be in pixels.",
          maxValue: 32767
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-tabindex"
          }));
        });
      }
    }
  };
}

function attributeValidateTarget(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "target") {
        if (!["a", "area", "base", "form", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-target",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-target"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateText(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "text") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-text",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-text"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateTitle(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "title") {
        if (["base", "basefont", "head", "html", "meta", "param", "script", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-title",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-title"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateType(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "type") {
        if (!["a", "link", "object", "param", "script", "style", "input", "li", "ol", "ul", "button"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-type",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (["a", "link", "object", "param", "script", "style"].includes(node.parent.tagName)) {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["application/javascript", "application/json", "application/x-www-form-urlencoded", "application/xml", "application/zip", "application/pdf", "application/sql", "application/graphql", "application/ld+json", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.oasis.opendocument.text", "application/zstd", "audio/mpeg", "audio/ogg", "multipart/form-data", "text/css", "text/html", "text/xml", "text/csv", "text/plain", "image/png", "image/jpeg", "image/gif", "application/vnd.api+json"],
              permittedValues: Object.keys(db__default['default']),
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-type"
              }));
            });
          } else if (node.parent.tagName === "input") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["text", "password", "checkbox", "radio", "submit", "reset", "file", "hidden", "image", "button"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-type"
              }));
            });
          } else if (node.parent.tagName === "li") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["disc", "square", "circle", "1", "a", "A", "i", "I"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-type"
              }));
            });
          } else if (node.parent.tagName === "ol") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["1", "a", "A", "i", "I"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-type"
              }));
            });
          } else if (node.parent.tagName === "ul") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["disc", "square", "circle"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-type"
              }));
            });
          } else if (node.parent.tagName === "button") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["button", "submit", "reset"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-type"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateUsemap(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "usemap") {
        if (!["img", "input", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-usemap",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-usemap"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateValign(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "valign") {
        if (!["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-valign",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["top", "middle", "bottom", "baseline"],
            canBeCommaSeparated: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-valign"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateValue(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "value") {
        if (!["input", "option", "param", "button", "li"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-value",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        else if (node.parent.tagName === "li") {
            validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
              zeroOK: false,
              customPxMessage: "Sequence number should not be in pixels."
            }).forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-value"
              }));
            });
          } else {
            var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
                errorArr = _checkForWhitespace.errorArr;
            errorArr.forEach(function (errorObj) {
              context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
                ruleId: "attribute-validate-value"
              }));
            });
          }
      }
    }
  };
}

function attributeValidateValuetype(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "valuetype") {
        if (node.parent.tagName !== "param") {
          context.report({
            ruleId: "attribute-validate-valuetype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else {
          validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["data", "ref", "object"],
            canBeCommaSeparated: false
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-valuetype"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateVersion(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "version") {
        if (node.parent.tagName !== "html") {
          context.report({
            ruleId: "attribute-validate-version",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var _checkForWhitespace = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt),
              errorArr = _checkForWhitespace.errorArr;
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-version"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateVlink(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "vlink") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-vlink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-".concat(node.attribName.toLowerCase()),
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Missing value.",
            fix: null
          });
        } else {
          var errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-vlink"
            }));
          });
        }
      }
    }
  };
}

function attributeValidateVspace(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "vspace") {
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-vspace",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        }
        var errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "attribute-validate-vspace"
          }));
        });
      }
    }
  };
}

function attributeValidateWidth(context) {
  return {
    attribute: function attribute(node) {
      if (node.attribName === "width") {
        if (!["hr", "iframe", "img", "object", "table", "td", "th", "applet", "col", "colgroup", "pre"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-width",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: "Tag \"".concat(node.parent.tagName, "\" can't have attribute \"").concat(node.attribName, "\"."),
            fix: null
          });
        } else if (node.parent.tagName === "pre") {
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            theOnlyGoodUnits: [],
            noUnitsIsFine: true
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-width"
            }));
          });
        } else if (["colgroup", "col"].includes(node.parent.tagName)) {
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            badUnits: ["px"],
            theOnlyGoodUnits: ["*", "%"],
            noUnitsIsFine: true
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-width"
            }));
          });
        } else {
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            badUnits: ["px"],
            noUnitsIsFine: true
          }).forEach(function (errorObj) {
            context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
              ruleId: "attribute-validate-width"
            }));
          });
        }
      }
    }
  };
}

function htmlEntitiesNotEmailFriendly(context) {
  return {
    entity: function entity(_ref) {
      var idxFrom = _ref.idxFrom,
          idxTo = _ref.idxTo;
      if (Object.keys(htmlEntitiesNotEmailFriendly$1.notEmailFriendly).includes(context.str.slice(idxFrom + 1, idxTo - 1))) {
        context.report({
          ruleId: "bad-html-entity-not-email-friendly",
          message: "Email-unfriendly named HTML entity.",
          idxFrom: idxFrom,
          idxTo: idxTo,
          fix: {
            ranges: [[idxFrom, idxTo, "&".concat(htmlEntitiesNotEmailFriendly$1.notEmailFriendly[context.str.slice(idxFrom + 1, idxTo - 1)], ";")]]
          }
        });
      }
    }
  };
}

function characterEncode(context) {
  for (var _len = arguments.length, config = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    config[_key - 1] = arguments[_key];
  }
  return {
    text: function text(token) {
      if (!token.value) {
        return;
      }
      var mode = "named";
      if (config.includes("numeric")) {
        mode = "numeric";
      }
      for (var i = 0, len = token.value.length; i < len; i++) {
        if ((token.value[i].charCodeAt(0) > 127 || "<>\"".includes(token.value[i])) && (token.value[i].charCodeAt(0) !== 160 || !Object.keys(context.processedRulesConfig).includes("bad-character-non-breaking-space") || !isAnEnabledValue(context.processedRulesConfig["bad-character-non-breaking-space"]))) {
          validateCharEncoding(token.value[i], i + token.start, mode, context);
        }
      }
    }
  };
}

function mediaMalformed(context) {
  return {
    at: function at(node) {
      if (node.identifier === "media") {
        var errors = isMediaDescriptor.isMediaD(node.query, {
          offset: node.queryStartsAt
        });
        errors.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "media-malformed"
          }));
        });
      }
    }
  };
}

function validateCommentClosing(token) {
  var reference = {
    simple: "-->",
    only: "<![endif]-->",
    not: "<!--<![endif]-->"
  };
  if (token.kind === "simple" && token.value === "-->" || token.kind === "only" && token.value === "<![endif]-->" || token.kind === "not" && token.value === "<!--<![endif]-->") {
    return [];
  }
  var errorArr = [];
  var valueWithoutWhitespace = "";
  splitByWhitespace(token.value, function (_ref) {
    var _ref2 = _slicedToArray__default['default'](_ref, 2),
        charFrom = _ref2[0],
        charTo = _ref2[1];
    valueWithoutWhitespace = "".concat(valueWithoutWhitespace).concat(token.value.slice(charFrom, charTo));
  }, function (_ref3) {
    var _ref4 = _slicedToArray__default['default'](_ref3, 2),
        whitespaceFrom = _ref4[0],
        whitespaceTo = _ref4[1];
    errorArr.push({
      ruleId: "comment-only-closing-malformed",
      idxFrom: token.start,
      idxTo: token.end,
      message: "Remove whitespace.",
      fix: {
        ranges: [[whitespaceFrom + token.start, whitespaceTo + token.start]]
      }
    });
  });
  if (token.kind === "simple" && valueWithoutWhitespace === "-->" || token.kind === "only" && valueWithoutWhitespace === "<![endif]-->" || token.kind === "not" && valueWithoutWhitespace === "<!--<![endif]-->") {
    return errorArr;
  }
  errorArr.push({
    idxFrom: token.start,
    idxTo: token.end,
    message: "Malformed closing comment tag.",
    fix: {
      ranges: [[token.start, token.end, reference[token.kind]]]
    }
  });
  return errorArr;
}

function commentClosingMalformed(context) {
  return {
    comment: function comment(node) {
      if (node.closing) {
        var errorArr = validateCommentClosing(node) || [];
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            keepSeparateWhenFixing: true,
            ruleId: "comment-closing-malformed"
          }));
        });
      }
    }
  };
}

function validateCommentOpening(token) {
  var reference = {
    simple: /<!--/g,
    only: /<!--\[[^\]]+\]>/g,
    not: /<!--\[[^\]]+\]><!-->/g
  };
  if (token.kind === "simple" && reference.simple.test(token.value) || token.kind === "only" && reference.only.test(token.value) || token.kind === "not" && reference.not.test(token.value)) {
    return [];
  }
  var errorArr = [];
  var valueWithoutWhitespace = "";
  if (token.kind === "simple") {
    splitByWhitespace(token.value, function (_ref) {
      var _ref2 = _slicedToArray__default['default'](_ref, 2),
          charFrom = _ref2[0],
          charTo = _ref2[1];
      valueWithoutWhitespace = "".concat(valueWithoutWhitespace).concat(token.value.slice(charFrom, charTo));
    }, function (_ref3) {
      var _ref4 = _slicedToArray__default['default'](_ref3, 2),
          whitespaceFrom = _ref4[0],
          whitespaceTo = _ref4[1];
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Remove whitespace.",
        fix: {
          ranges: [[whitespaceFrom + token.start, whitespaceTo + token.start]]
        }
      });
    });
  }
  if (token.kind === "simple" && reference.simple.test(valueWithoutWhitespace) || token.kind === "only" && reference.only.test(valueWithoutWhitespace) || token.kind === "not" && reference.not.test(valueWithoutWhitespace)) {
    return errorArr;
  }
  var wrongBracketType = false;
  if (["only", "not"].includes(token.kind)) {
    stringFindMalformed.findMalformed(token.value, "<!--[", function (_ref5) {
      var idxFrom = _ref5.idxFrom,
          idxTo = _ref5.idxTo;
      var finalIdxTo = idxTo;
      if (idxFrom === token.start) {
        if (
        "{(".includes(token.value[idxTo]) &&
        stringMatchLeftRight.matchRight(token.value, idxTo, "if", {
          trimBeforeMatching: true
        })) {
          wrongBracketType = true;
          finalIdxTo += 1;
        }
        errorArr.push({
          idxFrom: token.start,
          idxTo: token.end,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [[idxFrom + token.start, finalIdxTo + token.start, "<!--["]]
          }
        });
      }
    });
  }
  if (token.kind === "not") {
    stringFindMalformed.findMalformed(token.value, "]><!-->", function (_ref6) {
      var idxFrom = _ref6.idxFrom,
          idxTo = _ref6.idxTo;
      var finalIdxFrom = idxFrom;
      if ("})".includes(token.value[idxFrom - 1]) &&
      wrongBracketType) {
        finalIdxFrom -= 1;
      }
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [[finalIdxFrom + token.start, idxTo + token.start, "]><!-->"]]
        }
      });
    });
  } else if (token.kind === "only") {
    for (var i = token.value.length; i--;) {
      if (token.value[i].trim().length && !">]".includes(token.value[i])) {
        var rangeStart = i + 1;
        if ("})".includes(token.value[i]) && wrongBracketType) {
          rangeStart -= 1;
        }
        if (token.value.slice(i + 1) !== "]>") {
          errorArr.push({
            idxFrom: token.start,
            idxTo: token.end,
            message: "Malformed opening comment tag.",
            fix: {
              ranges: [[rangeStart + token.start, token.end, "]>"]]
            }
          });
        }
        break;
      }
    }
  }
  return errorArr;
}

function commentOpeningMalformed(context) {
  return {
    text: function text(node) {
      stringFindMalformed.findMalformed(node.value, "<!--", function (errorObj) {
        context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
          message: "Malformed opening comment tag.",
          ruleId: "comment-opening-malformed",
          fix: {
            ranges: [[errorObj.idxFrom, errorObj.idxTo, "<!--"]]
          }
        }));
      }, {
        stringOffset: node.start
      });
    },
    comment: function comment(node) {
      if (!node.closing) {
        var errorArr = validateCommentOpening(node) || [];
        errorArr.forEach(function (errorObj) {
          context.report(_objectSpread__default['default'](_objectSpread__default['default']({}, errorObj), {}, {
            ruleId: "comment-opening-malformed"
          }));
        });
      }
    }
  };
}

function commentMismatchingPair(context) {
  return {
    ast: function ast(node) {
      astMonkeyTraverse.traverse(node,
      function (key, val, innerObj) {
        var current = val !== undefined ? val : key;
        if (isObj(current)) {
          if (current.type === "comment" && current.closing) {
            var previousToken = op__default['default'].get(node, astMonkeyUtil.pathPrev(innerObj.path));
            if (isObj(previousToken) && previousToken.type === "comment" && !previousToken.closing) {
              if (previousToken.kind === "not" && current.kind === "only") {
                context.report({
                  ruleId: "comment-mismatching-pair",
                  keepSeparateWhenFixing: true,
                  message: "Add \"<!--\".",
                  idxFrom: current.start,
                  idxTo: current.end,
                  fix: {
                    ranges: [[current.start, current.start, "<!--"]]
                  }
                });
              } else if (previousToken.kind === "only" && current.kind === "not") {
                context.report({
                  ruleId: "comment-mismatching-pair",
                  keepSeparateWhenFixing: true,
                  message: "Remove \"<!--\".",
                  idxFrom: current.start,
                  idxTo: current.end,
                  fix: {
                    ranges: [[current.start, current.end, "<![endif]-->"]]
                  }
                });
              }
            }
          }
        }
        return current;
      });
    }
  };
}

function commentConditionalNested(context) {
  return {
    ast: function ast(node) {
      var pathsWithOpeningComments = [];
      astMonkeyTraverse.traverse(node,
      function (key, val, innerObj) {
        var current = val !== undefined ? val : key;
        if (isObj(current)) {
          if (current.type === "comment") {
            if (pathsWithOpeningComments.some(function (pathStr) {
              return innerObj.path.startsWith(pathStr);
            })) {
              context.report({
                ruleId: "comment-conditional-nested",
                message: "Don't nest comments.",
                idxFrom: current.start,
                idxTo: current.end,
                fix: null
              });
            }
            if (!current.closing) {
              pathsWithOpeningComments.push(innerObj.path);
            }
          }
        }
        return current;
      });
    }
  };
}

function tdSiblingPadding(context) {
  var start;
  var end;
  return {
    tag: function tag(node) {
      if (
      node.tagName === "tr" &&
      Array.isArray(node.children) &&
      node.children.filter(function (tokenObj) {
        return tokenObj.type === "tag" && tokenObj.tagName === "td" && !tokenObj.closing;
      }).length > 1 &&
      node.children.some(function (tokenObj) {
        return tokenObj.type === "tag" && tokenObj.tagName === "td" && !tokenObj.closing && Array.isArray(tokenObj.attribs) && tokenObj.attribs.some(function (attribObj) {
          return attribObj.attribName === "style" && Array.isArray(attribObj.attribValue) && attribObj.attribValue.some(function (attribValueObj) {
            if (typeof attribValueObj.property === "string" && attribValueObj.property.startsWith("padding-")) {
              start = attribValueObj.start;
              end = attribValueObj.end;
              return true;
            }
            return false;
          });
        });
      })) {
        context.report({
          ruleId: "email-td-sibling-padding",
          message: "Don't set padding on TD when sibling TD's are present.",
          idxFrom: start,
          idxTo: end,
          fix: null
        });
      }
    }
  };
}

function processNode(token, context, mode) {
  var nodeArr;
  if (token.properties !== undefined) {
    nodeArr = token.properties;
  } else if (token.attribValue !== undefined) {
    nodeArr = token.attribValue;
  }
  if (!nodeArr) {
    return;
  }
  var properties = nodeArr.filter(function (property) {
    return property.property !== undefined;
  });
  var property = properties[~-properties.length];
  if (mode !== "never" && properties && properties.length && property.semi === null && property.valueEnds) {
    var idxFrom = property.start;
    var idxTo = property.end;
    var positionToInsert = property.importantEnds || property.valueEnds || property.propertyEnds;
    context.report({
      ruleId: "css-trailing-semi",
      idxFrom: idxFrom,
      idxTo: idxTo,
      message: "Add a semicolon.",
      fix: {
        ranges: [[positionToInsert, positionToInsert, ";"]]
      }
    });
  } else if (mode === "never" && properties && properties.length && property.semi !== null && property.valueEnds) {
    var _idxFrom = property.start;
    var _idxTo = property.end;
    var positionToRemove = property.semi;
    context.report({
      ruleId: "css-trailing-semi",
      idxFrom: _idxFrom,
      idxTo: _idxTo,
      message: "Remove the semicolon.",
      fix: {
        ranges: [[positionToRemove, positionToRemove + 1]]
      }
    });
  }
}
var trailingSemi = function trailingSemi(context, mode) {
  return {
    rule: function rule(node) {
      processNode(node, context, mode);
    },
    attribute: function attribute(node) {
      processNode(node, context, mode);
    }
  };
};

var cssRuleMalformed = function cssRuleMalformed(context) {
  return {
    rule: function rule(node) {
      if (Array.isArray(node.properties) && node.properties.length) {
        validateStyle(
        node, context);
      }
    }
  };
};

function processCSS(token, context) {
  var nodeArr;
  if (token.properties !== undefined) {
    nodeArr = token.properties;
  } else if (token.attribValue !== undefined) {
    nodeArr = token.attribValue;
  }
  if (!nodeArr) {
    return;
  }
  nodeArr.filter(function (property) {
    return property.property !== undefined;
  }).forEach(function (property) {
    if (property.colon && property.valueStarts && (property.valueStarts !== property.colon + 2 || context.str[property.colon + 1] !== " ")) {
      context.report({
        ruleId: "format-prettier",
        idxFrom: property.start,
        idxTo: property.end,
        message: "Put a space before a value.",
        fix: {
          ranges: [[property.colon + 1, property.valueStarts, " "]]
        }
      });
    }
    var lastEnding = property.valueEnds || (property.colon ? property.colon + 1 : null) || property.propertyEnds;
    if (property.importantStarts && lastEnding && (lastEnding + 1 !== property.importantStarts || context.str[lastEnding] !== " ")) {
      context.report({
        ruleId: "format-prettier",
        idxFrom: property.start,
        idxTo: property.end,
        message: "Put a space in front of !imporant.",
        fix: {
          ranges: [[lastEnding, property.importantStarts, " "]]
        }
      });
    }
  });
  if (nodeArr.length > 1) {
    var somethingMet = false;
    for (var i = 0, len = nodeArr.length; i < len; i++) {
      if (somethingMet && (
      nodeArr[i].property !== undefined ||
      nodeArr[i].type === "comment" &&
      !nodeArr[i].closing ||
      nodeArr[i].type === "esp" &&
      nodeArr[i - 2] && nodeArr[i - 2].property !== undefined) &&
      nodeArr[i - 1].type === "text" && nodeArr[i - 1].value !== " ") {
        context.report({
          ruleId: "format-prettier",
          idxFrom: nodeArr[i - 1].start,
          idxTo: nodeArr[i - 1].end,
          message: "Put a space in front of !imporant.",
          fix: {
            ranges: [[nodeArr[i - 1].start, nodeArr[i - 1].end, " "]]
          }
        });
      } else if (
      i &&
      !["text", "esp"].includes(nodeArr[i - 1].type) &&
      nodeArr[i].property !== undefined && (
      nodeArr[i].property || nodeArr[i].value || nodeArr[i].important)) {
        context.report({
          ruleId: "format-prettier",
          idxFrom: nodeArr[i].start,
          idxTo: nodeArr[i].end,
          message: "Put a space in front.",
          fix: {
            ranges: [[nodeArr[i].start, nodeArr[i].start, " "]]
          }
        });
      }
      if (!somethingMet && (nodeArr[i].type === undefined || nodeArr[i].type !== "text")) {
        somethingMet = true;
      }
    }
  }
}
var formatPrettier = function formatPrettier(context) {
  return {
    rule: function rule(node) {
      processCSS(node, context);
    },
    attribute: function attribute(node) {
      processCSS(node, context);
    }
  };
};

var builtInRules = {};
defineLazyProp__default['default'](builtInRules, "bad-character-null", function () {
  return badCharacterNull;
});
defineLazyProp__default['default'](builtInRules, "bad-character-start-of-heading", function () {
  return badCharacterStartOfHeading;
});
defineLazyProp__default['default'](builtInRules, "bad-character-start-of-text", function () {
  return badCharacterStartOfText;
});
defineLazyProp__default['default'](builtInRules, "bad-character-end-of-text", function () {
  return badCharacterEndOfText;
});
defineLazyProp__default['default'](builtInRules, "bad-character-end-of-transmission", function () {
  return badCharacterEndOfTransmission;
});
defineLazyProp__default['default'](builtInRules, "bad-character-enquiry", function () {
  return badCharacterEnquiry;
});
defineLazyProp__default['default'](builtInRules, "bad-character-acknowledge", function () {
  return badCharacterAcknowledge;
});
defineLazyProp__default['default'](builtInRules, "bad-character-bell", function () {
  return badCharacterBell;
});
defineLazyProp__default['default'](builtInRules, "bad-character-backspace", function () {
  return badCharacterBackspace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-tabulation", function () {
  return badCharacterTabulation;
});
defineLazyProp__default['default'](builtInRules, "bad-character-line-tabulation", function () {
  return badCharacterLineTabulation;
});
defineLazyProp__default['default'](builtInRules, "bad-character-form-feed", function () {
  return badCharacterFormFeed;
});
defineLazyProp__default['default'](builtInRules, "bad-character-shift-out", function () {
  return badCharacterShiftOut;
});
defineLazyProp__default['default'](builtInRules, "bad-character-shift-in", function () {
  return badCharacterShiftIn;
});
defineLazyProp__default['default'](builtInRules, "bad-character-data-link-escape", function () {
  return badCharacterDataLinkEscape;
});
defineLazyProp__default['default'](builtInRules, "bad-character-device-control-one", function () {
  return badCharacterDeviceControlOne;
});
defineLazyProp__default['default'](builtInRules, "bad-character-device-control-two", function () {
  return badCharacterDeviceControlTwo;
});
defineLazyProp__default['default'](builtInRules, "bad-character-device-control-three", function () {
  return badCharacterDeviceControlThree;
});
defineLazyProp__default['default'](builtInRules, "bad-character-device-control-four", function () {
  return badCharacterDeviceControlFour;
});
defineLazyProp__default['default'](builtInRules, "bad-character-negative-acknowledge", function () {
  return badCharacterNegativeAcknowledge;
});
defineLazyProp__default['default'](builtInRules, "bad-character-synchronous-idle", function () {
  return badCharacterSynchronousIdle;
});
defineLazyProp__default['default'](builtInRules, "bad-character-end-of-transmission-block", function () {
  return badCharacterEndOfTransmissionBlock;
});
defineLazyProp__default['default'](builtInRules, "bad-character-cancel", function () {
  return badCharacterCancel;
});
defineLazyProp__default['default'](builtInRules, "bad-character-end-of-medium", function () {
  return badCharacterEndOfMedium;
});
defineLazyProp__default['default'](builtInRules, "bad-character-substitute", function () {
  return badCharacterSubstitute;
});
defineLazyProp__default['default'](builtInRules, "bad-character-escape", function () {
  return badCharacterEscape;
});
defineLazyProp__default['default'](builtInRules, "bad-character-information-separator-four", function () {
  return badCharacterInformationSeparatorFour;
});
defineLazyProp__default['default'](builtInRules, "bad-character-information-separator-three", function () {
  return badCharacterInformationSeparatorThree;
});
defineLazyProp__default['default'](builtInRules, "bad-character-information-separator-two", function () {
  return badCharacterInformationSeparatorTwo$1;
});
defineLazyProp__default['default'](builtInRules, "bad-character-information-separator-one", function () {
  return badCharacterInformationSeparatorTwo;
});
defineLazyProp__default['default'](builtInRules, "bad-character-delete", function () {
  return badCharacterDelete;
});
defineLazyProp__default['default'](builtInRules, "bad-character-control-0080", function () {
  return badCharacterControl0080;
});
defineLazyProp__default['default'](builtInRules, "bad-character-control-0081", function () {
  return badCharacterControl0081;
});
defineLazyProp__default['default'](builtInRules, "bad-character-break-permitted-here", function () {
  return badCharacterBreakPermittedHere;
});
defineLazyProp__default['default'](builtInRules, "bad-character-no-break-here", function () {
  return badCharacterNoBreakHere;
});
defineLazyProp__default['default'](builtInRules, "bad-character-control-0084", function () {
  return badCharacterControl0084;
});
defineLazyProp__default['default'](builtInRules, "bad-character-next-line", function () {
  return badCharacterNextLine;
});
defineLazyProp__default['default'](builtInRules, "bad-character-start-of-selected-area", function () {
  return badCharacterStartOfSelectedArea;
});
defineLazyProp__default['default'](builtInRules, "bad-character-end-of-selected-area", function () {
  return badCharacterEndOfSelectedArea;
});
defineLazyProp__default['default'](builtInRules, "bad-character-character-tabulation-set", function () {
  return badCharacterCharacterTabulationSet;
});
defineLazyProp__default['default'](builtInRules, "bad-character-character-tabulation-with-justification", function () {
  return badCharacterCharacterTabulationWithJustification;
});
defineLazyProp__default['default'](builtInRules, "bad-character-line-tabulation-set", function () {
  return badCharacterLineTabulationSet;
});
defineLazyProp__default['default'](builtInRules, "bad-character-partial-line-forward", function () {
  return badCharacterPartialLineForward;
});
defineLazyProp__default['default'](builtInRules, "bad-character-partial-line-backward", function () {
  return badCharacterPartialLineBackward;
});
defineLazyProp__default['default'](builtInRules, "bad-character-reverse-line-feed", function () {
  return badCharacterReverseLineFeed;
});
defineLazyProp__default['default'](builtInRules, "bad-character-single-shift-two", function () {
  return badCharacterSingleShiftTwo$1;
});
defineLazyProp__default['default'](builtInRules, "bad-character-single-shift-three", function () {
  return badCharacterSingleShiftTwo;
});
defineLazyProp__default['default'](builtInRules, "bad-character-device-control-string", function () {
  return badCharacterDeviceControlString;
});
defineLazyProp__default['default'](builtInRules, "bad-character-private-use-1", function () {
  return badCharacterPrivateUseOne;
});
defineLazyProp__default['default'](builtInRules, "bad-character-private-use-2", function () {
  return badCharacterPrivateUseTwo;
});
defineLazyProp__default['default'](builtInRules, "bad-character-set-transmit-state", function () {
  return badCharacterSetTransmitState;
});
defineLazyProp__default['default'](builtInRules, "bad-character-cancel-character", function () {
  return badCharacterCancelCharacter;
});
defineLazyProp__default['default'](builtInRules, "bad-character-message-waiting", function () {
  return badCharacterMessageWaiting;
});
defineLazyProp__default['default'](builtInRules, "bad-character-start-of-protected-area", function () {
  return badCharacterStartOfProtectedArea;
});
defineLazyProp__default['default'](builtInRules, "bad-character-end-of-protected-area", function () {
  return badCharacterEndOfProtectedArea;
});
defineLazyProp__default['default'](builtInRules, "bad-character-start-of-string", function () {
  return badCharacterStartOfString;
});
defineLazyProp__default['default'](builtInRules, "bad-character-control-0099", function () {
  return badCharacterControl0099;
});
defineLazyProp__default['default'](builtInRules, "bad-character-single-character-introducer", function () {
  return badCharacterSingleCharacterIntroducer;
});
defineLazyProp__default['default'](builtInRules, "bad-character-control-sequence-introducer", function () {
  return badCharacterControlSequenceIntroducer;
});
defineLazyProp__default['default'](builtInRules, "bad-character-string-terminator", function () {
  return badCharacterStringTerminator;
});
defineLazyProp__default['default'](builtInRules, "bad-character-operating-system-command", function () {
  return badCharacterOperatingSystemCommand;
});
defineLazyProp__default['default'](builtInRules, "bad-character-private-message", function () {
  return badCharacterPrivateMessage;
});
defineLazyProp__default['default'](builtInRules, "bad-character-application-program-command", function () {
  return badCharacterApplicationProgramCommand;
});
defineLazyProp__default['default'](builtInRules, "bad-character-soft-hyphen", function () {
  return badCharacterSoftHyphen;
});
defineLazyProp__default['default'](builtInRules, "bad-character-non-breaking-space", function () {
  return badCharacterNonBreakingSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-ogham-space-mark", function () {
  return badCharacterOghamSpaceMark;
});
defineLazyProp__default['default'](builtInRules, "bad-character-en-quad", function () {
  return badCharacterEnQuad;
});
defineLazyProp__default['default'](builtInRules, "bad-character-em-quad", function () {
  return badCharacterEmQuad;
});
defineLazyProp__default['default'](builtInRules, "bad-character-en-space", function () {
  return badCharacterEnSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-em-space", function () {
  return badCharacterEmSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-three-per-em-space", function () {
  return badCharacterThreePerEmSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-four-per-em-space", function () {
  return badCharacterFourPerEmSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-six-per-em-space", function () {
  return badCharacterSixPerEmSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-figure-space", function () {
  return badCharacterFigureSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-punctuation-space", function () {
  return badCharacterPunctuationSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-thin-space", function () {
  return badCharacterThinSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-hair-space", function () {
  return badCharacterHairSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-zero-width-space", function () {
  return badCharacterZeroWidthSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-zero-width-non-joiner", function () {
  return badCharacterZeroWidthNonJoiner;
});
defineLazyProp__default['default'](builtInRules, "bad-character-zero-width-joiner", function () {
  return badCharacterZeroWidthJoiner;
});
defineLazyProp__default['default'](builtInRules, "bad-character-left-to-right-mark", function () {
  return badCharacterLeftToRightMark;
});
defineLazyProp__default['default'](builtInRules, "bad-character-right-to-left-mark", function () {
  return badCharacterRightToLeftMark;
});
defineLazyProp__default['default'](builtInRules, "bad-character-left-to-right-embedding", function () {
  return badCharacterLeftToRightEmbedding;
});
defineLazyProp__default['default'](builtInRules, "bad-character-right-to-left-embedding", function () {
  return badCharacterRightToLeftEmbedding;
});
defineLazyProp__default['default'](builtInRules, "bad-character-pop-directional-formatting", function () {
  return badCharacterPopDirectionalFormatting;
});
defineLazyProp__default['default'](builtInRules, "bad-character-left-to-right-override", function () {
  return badCharacterLeftToRightOverride;
});
defineLazyProp__default['default'](builtInRules, "bad-character-right-to-left-override", function () {
  return badCharacterRightToLeftOverride;
});
defineLazyProp__default['default'](builtInRules, "bad-character-word-joiner", function () {
  return badCharacterWordJoiner;
});
defineLazyProp__default['default'](builtInRules, "bad-character-function-application", function () {
  return badCharacterFunctionApplication;
});
defineLazyProp__default['default'](builtInRules, "bad-character-invisible-times", function () {
  return badCharacterInvisibleTimes;
});
defineLazyProp__default['default'](builtInRules, "bad-character-invisible-separator", function () {
  return badCharacterInvisibleSeparator;
});
defineLazyProp__default['default'](builtInRules, "bad-character-invisible-plus", function () {
  return badCharacterInvisiblePlus;
});
defineLazyProp__default['default'](builtInRules, "bad-character-left-to-right-isolate", function () {
  return badCharacterLeftToRightIsolate;
});
defineLazyProp__default['default'](builtInRules, "bad-character-right-to-left-isolate", function () {
  return badCharacterRightToLeftIsolate;
});
defineLazyProp__default['default'](builtInRules, "bad-character-first-strong-isolate", function () {
  return badCharacterFirstStrongIsolate;
});
defineLazyProp__default['default'](builtInRules, "bad-character-pop-directional-isolate", function () {
  return badCharacterPopDirectionalIsolate;
});
defineLazyProp__default['default'](builtInRules, "bad-character-inhibit-symmetric-swapping", function () {
  return badCharacterInhibitSymmetricSwapping;
});
defineLazyProp__default['default'](builtInRules, "bad-character-activate-symmetric-swapping", function () {
  return badCharacterActivateSymmetricSwapping;
});
defineLazyProp__default['default'](builtInRules, "bad-character-inhibit-arabic-form-shaping", function () {
  return badCharacterInhibitArabicFormShaping;
});
defineLazyProp__default['default'](builtInRules, "bad-character-activate-arabic-form-shaping", function () {
  return badCharacterActivateArabicFormShaping;
});
defineLazyProp__default['default'](builtInRules, "bad-character-national-digit-shapes", function () {
  return badCharacterNationalDigitShapes;
});
defineLazyProp__default['default'](builtInRules, "bad-character-nominal-digit-shapes", function () {
  return badCharacterNominalDigitShapes;
});
defineLazyProp__default['default'](builtInRules, "bad-character-zero-width-no-break-space", function () {
  return badCharacterZeroWidthNoBreakSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-interlinear-annotation-anchor", function () {
  return badCharacterInterlinearAnnotationAnchor;
});
defineLazyProp__default['default'](builtInRules, "bad-character-interlinear-annotation-separator", function () {
  return badCharacterInterlinearAnnotationSeparator;
});
defineLazyProp__default['default'](builtInRules, "bad-character-interlinear-annotation-terminator", function () {
  return badCharacterInterlinearAnnotationTerminator;
});
defineLazyProp__default['default'](builtInRules, "bad-character-line-separator", function () {
  return badCharacterLineSeparator;
});
defineLazyProp__default['default'](builtInRules, "bad-character-paragraph-separator", function () {
  return badCharacterParagraphSeparator;
});
defineLazyProp__default['default'](builtInRules, "bad-character-narrow-no-break-space", function () {
  return badCharacterNarrowNoBreakSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-medium-mathematical-space", function () {
  return badCharacterMediumMathematicalSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-ideographic-space", function () {
  return badCharacterIdeographicSpace;
});
defineLazyProp__default['default'](builtInRules, "bad-character-replacement-character", function () {
  return badCharacterReplacementCharacter;
});
defineLazyProp__default['default'](builtInRules, "tag-space-after-opening-bracket", function () {
  return tagSpaceAfterOpeningBracket;
});
defineLazyProp__default['default'](builtInRules, "tag-space-before-closing-bracket", function () {
  return tagSpaceBeforeClosingBracket;
});
defineLazyProp__default['default'](builtInRules, "tag-space-between-slash-and-bracket", function () {
  return tagSpaceBetweenSlashAndBracket;
});
defineLazyProp__default['default'](builtInRules, "tag-table", function () {
  return tagTable;
});
defineLazyProp__default['default'](builtInRules, "tag-malformed", function () {
  return tagMalformed;
});
defineLazyProp__default['default'](builtInRules, "tag-closing-backslash", function () {
  return tagClosingBackslash;
});
defineLazyProp__default['default'](builtInRules, "tag-void-slash", function () {
  return tagVoidSlash;
});
defineLazyProp__default['default'](builtInRules, "tag-name-case", function () {
  return tagNameCase;
});
defineLazyProp__default['default'](builtInRules, "tag-is-present", function () {
  return tagIsPresent;
});
defineLazyProp__default['default'](builtInRules, "tag-bold", function () {
  return tagBold;
});
defineLazyProp__default['default'](builtInRules, "tag-bad-self-closing", function () {
  return tagBadSelfClosing;
});
defineLazyProp__default['default'](builtInRules, "attribute-duplicate", function () {
  return attributeDuplicate;
});
defineLazyProp__default['default'](builtInRules, "attribute-malformed", function () {
  return attributeMalformed;
});
defineLazyProp__default['default'](builtInRules, "attribute-on-closing-tag", function () {
  return attributeOnClosingTag;
});
defineLazyProp__default['default'](builtInRules, "attribute-enforce-img-alt", function () {
  return attributeEnforceImgAlt;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-abbr", function () {
  return attributeValidateAbbr;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-accept-charset", function () {
  return attributeValidateAcceptCharset;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-accept", function () {
  return attributeValidateAccept;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-accesskey", function () {
  return attributeValidateAccesskey;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-action", function () {
  return attributeValidateAction;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-align", function () {
  return attributeValidateAlign;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-alink", function () {
  return attributeValidateAlink;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-alt", function () {
  return attributeValidateAlt;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-archive", function () {
  return attributeValidateArchive;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-axis", function () {
  return attributeValidateAxis;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-background", function () {
  return attributeValidateBackground;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-bgcolor", function () {
  return attributeValidateBgcolor;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-border", function () {
  return attributeValidateBorder;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-cellpadding", function () {
  return attributeValidateCellpadding;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-cellspacing", function () {
  return attributeValidateCellspacing;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-char", function () {
  return attributeValidateChar;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-charoff", function () {
  return attributeValidateCharoff;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-charset", function () {
  return attributeValidateCharset;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-checked", function () {
  return attributeValidateChecked;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-cite", function () {
  return attributeValidateCite;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-class", function () {
  return attributeValidateClass;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-classid", function () {
  return attributeValidateClassid$1;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-clear", function () {
  return attributeValidateClassid;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-code", function () {
  return attributeValidateCode;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-codebase", function () {
  return attributeValidateCodebase;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-codetype", function () {
  return attributeValidateCodetype;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-color", function () {
  return attributeValidateColor;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-cols", function () {
  return attributeValidateCols;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-colspan", function () {
  return attributeValidateColspan;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-compact", function () {
  return attributeValidateCompact;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-content", function () {
  return attributeValidateContent;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-coords", function () {
  return attributeValidateCoords;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-data", function () {
  return attributeValidateData;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-datetime", function () {
  return attributeValidateDatetime;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-declare", function () {
  return attributeValidateDeclare;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-defer", function () {
  return attributeValidateDefer;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-dir", function () {
  return attributeValidateDir;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-disabled", function () {
  return attributeValidateDisabled;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-enctype", function () {
  return attributeValidateEnctype;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-face", function () {
  return attributeValidateFace;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-for", function () {
  return attributeValidateFor;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-frame", function () {
  return attributeValidateFrame;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-frameborder", function () {
  return attributeValidateFrameborder;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-headers", function () {
  return attributeValidateHeaders;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-height", function () {
  return attributeValidateHeight;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-href", function () {
  return attributeValidateHref;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-hreflang", function () {
  return attributeValidateHreflang;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-hspace", function () {
  return attributeValidateHspace;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-http-equiv", function () {
  return attributeValidateHttpequiv;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-id", function () {
  return attributeValidateId;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-ismap", function () {
  return attributeValidateIsmap;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-label", function () {
  return attributeValidateLabel;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-lang", function () {
  return attributeValidateLang;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-language", function () {
  return attributeValidateLanguage;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-link", function () {
  return attributeValidateLink;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-longdesc", function () {
  return attributeValidateLongdesc;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-marginheight", function () {
  return attributeValidateMarginheight;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-marginwidth", function () {
  return attributeValidateMarginwidth;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-maxlength", function () {
  return attributeValidateMaxlength;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-media", function () {
  return attributeValidateMedia;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-method", function () {
  return attributeValidateMethod;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-multiple", function () {
  return attributeValidateMultiple;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-name", function () {
  return attributeValidateName;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-nohref", function () {
  return attributeValidateNohref;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-noresize", function () {
  return attributeValidateNoresize;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-noshade", function () {
  return attributeValidateNoshade;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-nowrap", function () {
  return attributeValidateNowrap;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-object", function () {
  return attributeValidateObject;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onblur", function () {
  return attributeValidateOnblur;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onchange", function () {
  return attributeValidateOnchange;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onclick", function () {
  return attributeValidateOnclick;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-ondblclick", function () {
  return attributeValidateOndblclick;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onfocus", function () {
  return attributeValidateOnfocus;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onkeydown", function () {
  return attributeValidateOnkeydown;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onkeypress", function () {
  return attributeValidateOnkeypress;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onkeyup", function () {
  return attributeValidateOnkeyup;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onload", function () {
  return attributeValidateOnload;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onmousedown", function () {
  return attributeValidateOnmousedown;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onmousemove", function () {
  return attributeValidateOnmousemove;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onmouseout", function () {
  return attributeValidateOnmouseout;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onmouseover", function () {
  return attributeValidateOnmouseover;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onmouseup", function () {
  return attributeValidateOnmouseup;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onreset", function () {
  return attributeValidateOnreset;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onsubmit", function () {
  return attributeValidateOnsubmit;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onselect", function () {
  return attributeValidateOnselect;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-onunload", function () {
  return attributeValidateOnunload;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-profile", function () {
  return attributeValidateProfile;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-prompt", function () {
  return attributeValidatePrompt;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-readonly", function () {
  return attributeValidateReadonly;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-rel", function () {
  return attributeValidateRel;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-rev", function () {
  return attributeValidateRev;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-rows", function () {
  return attributeValidateRows;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-rowspan", function () {
  return attributeValidateRowspan;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-rules", function () {
  return attributeValidateRules;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-scheme", function () {
  return attributeValidateScheme;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-scope", function () {
  return attributeValidateScope;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-scrolling", function () {
  return attributeValidateScrolling;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-selected", function () {
  return attributeValidateSelected;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-shape", function () {
  return attributeValidateShape;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-size", function () {
  return attributeValidateSize;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-span", function () {
  return attributeValidateSpan;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-src", function () {
  return attributeValidateSrc;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-standby", function () {
  return attributeValidateStandby;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-start", function () {
  return attributeValidateStart;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-style", function () {
  return attributeValidateStyle;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-summary", function () {
  return attributeValidateSummary;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-tabindex", function () {
  return attributeValidateTabindex;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-target", function () {
  return attributeValidateTarget;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-text", function () {
  return attributeValidateText;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-title", function () {
  return attributeValidateTitle;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-type", function () {
  return attributeValidateType;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-usemap", function () {
  return attributeValidateUsemap;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-valign", function () {
  return attributeValidateValign;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-value", function () {
  return attributeValidateValue;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-valuetype", function () {
  return attributeValidateValuetype;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-version", function () {
  return attributeValidateVersion;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-vlink", function () {
  return attributeValidateVlink;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-vspace", function () {
  return attributeValidateVspace;
});
defineLazyProp__default['default'](builtInRules, "attribute-validate-width", function () {
  return attributeValidateWidth;
});
defineLazyProp__default['default'](builtInRules, "bad-html-entity-not-email-friendly", function () {
  return htmlEntitiesNotEmailFriendly;
});
defineLazyProp__default['default'](builtInRules, "character-encode", function () {
  return characterEncode;
});
defineLazyProp__default['default'](builtInRules, "media-malformed", function () {
  return mediaMalformed;
});
defineLazyProp__default['default'](builtInRules, "comment-closing-malformed", function () {
  return commentClosingMalformed;
});
defineLazyProp__default['default'](builtInRules, "comment-opening-malformed", function () {
  return commentOpeningMalformed;
});
defineLazyProp__default['default'](builtInRules, "comment-mismatching-pair", function () {
  return commentMismatchingPair;
});
defineLazyProp__default['default'](builtInRules, "comment-conditional-nested", function () {
  return commentConditionalNested;
});
defineLazyProp__default['default'](builtInRules, "email-td-sibling-padding", function () {
  return tdSiblingPadding;
});
defineLazyProp__default['default'](builtInRules, "css-trailing-semi", function () {
  return trailingSemi;
});
defineLazyProp__default['default'](builtInRules, "css-rule-malformed", function () {
  return cssRuleMalformed;
});
defineLazyProp__default['default'](builtInRules, "format-prettier", function () {
  return formatPrettier;
});
function get(something) {
  return builtInRules[something];
}
function normaliseRequestedRules(opts) {
  var res = {};
  if (Object.keys(opts).includes("all") && isAnEnabledValue(opts.all)) {
    Object.keys(builtInRules).forEach(function (ruleName) {
      res[ruleName] = opts.all;
    });
  } else {
    var temp;
    if (Object.keys(opts).some(function (ruleName) {
      if (["bad-character", "bad-character*", "bad-character-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allBadCharacterRules.forEach(function (ruleName) {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).some(function (ruleName) {
      if (["tag", "tag*", "tag-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allTagRules.forEach(function (ruleName) {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).some(function (ruleName) {
      if (["attribute", "attribute*", "attribute-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allAttribRules.forEach(function (ruleName) {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).some(function (ruleName) {
      if (["css", "css*", "css-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allCSSRules.forEach(function (ruleName) {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).includes("bad-html-entity")) {
      allBadNamedHTMLEntityRules.forEach(function (ruleName) {
        res[ruleName] = opts["bad-html-entity"];
      });
    }
    Object.keys(opts).forEach(function (ruleName) {
      if (!["all", "tag", "tag*", "tag-*", "attribute", "attribute*", "attribute-*", "bad-character", "bad-character", "bad-character*", "bad-character-*", "bad-html-entity"].includes(ruleName)) {
        if (Object.keys(builtInRules).includes(ruleName)) {
          res[ruleName] = clone__default['default'](opts[ruleName]);
        } else if (ruleName.includes("*")) {
          Object.keys(builtInRules).forEach(function (builtInRule) {
            if (matcher__default['default'].isMatch(builtInRule, ruleName)) {
              res[builtInRule] = clone__default['default'](opts[ruleName]);
            }
          });
        }
      }
    });
  }
  return res;
}

tinyTypedEmitter.TypedEmitter.defaultMaxListeners = 0;
var Linter = function (_TypedEmitter) {
  _inherits__default['default'](Linter, _TypedEmitter);
  var _super = _createSuper__default['default'](Linter);
  function Linter() {
    var _this;
    _classCallCheck__default['default'](this, Linter);
    _this = _super.call(this);
    _this.messages = [];
    _this.str = "";
    _this.strLineStartIndexes = [];
    _this.config = {};
    _this.hasBeenCalledWithKeepSeparateWhenFixing = false;
    _this.processedRulesConfig = {};
    return _this;
  }
  _createClass__default['default'](Linter, [{
    key: "verify",
    value: function verify(str, config) {
      var _this2 = this;
      this.messages = [];
      this.str = str;
      this.strLineStartIndexes = lineColumnMini.getLineStartIndexes(str);
      this.config = clone__default['default'](config);
      this.hasBeenCalledWithKeepSeparateWhenFixing = false;
      this.processedRulesConfig = {};
      var has = Object.prototype.hasOwnProperty;
      if (config) {
        if (_typeof__default['default'](config) !== "object") {
          throw new Error("emlint/verify(): [THROW_ID_01] second input argument, config is not a plain object but ".concat(_typeof__default['default'](config), ". It's equal to:\n").concat(JSON.stringify(config, null, 4)));
        } else if (!Object.keys(config).length) {
          return [];
        } else if (!config.rules || _typeof__default['default'](config.rules) !== "object") {
          throw new Error("emlint/verify(): [THROW_ID_02] config contains no rules! It was given as:\n".concat(JSON.stringify(config, null, 4)));
        }
      } else {
        return [];
      }
      var processedRulesConfig = normaliseRequestedRules(config.rules);
      this.processedRulesConfig = processedRulesConfig;
      Object.keys(processedRulesConfig)
      .filter(function (ruleName) {
        return get(ruleName);
      })
      .filter(function (ruleName) {
        if (typeof processedRulesConfig[ruleName] === "number") {
          return processedRulesConfig[ruleName] > 0;
        }
        if (Array.isArray(processedRulesConfig[ruleName])) {
          return processedRulesConfig[ruleName][0] > 0;
        }
        return false;
      }).forEach(function (rule) {
        var rulesFunction;
        if (Array.isArray(processedRulesConfig[rule]) && processedRulesConfig[rule].length > 1) {
          rulesFunction = get(rule).apply(void 0, [_this2].concat(_toConsumableArray__default['default'](processedRulesConfig[rule].slice(1))));
        } else {
          rulesFunction = get(rule)(_this2);
        }
        Object.keys(rulesFunction).forEach(function (consumedNode) {
          _this2.on(consumedNode, function () {
            var _rulesFunction;
            (_rulesFunction = rulesFunction)[consumedNode].apply(_rulesFunction, arguments);
          });
        });
      });
      this.emit("ast", astMonkeyTraverse.traverse(codsenParser.cparser(str, {
        charCb: function charCb(obj) {
          _this2.emit("character", obj);
        },
        errCb: function errCb(obj) {
          var currentRulesSeverity = isAnEnabledRule(config.rules, obj.ruleId);
          if (currentRulesSeverity) {
            var message = "Something is wrong.";
            if (isObj(obj) && typeof obj.ruleId === "string" && has.call(astErrMessages, obj.ruleId)) {
              message = astErrMessages[obj.ruleId];
            }
            _this2.report(_objectSpread__default['default']({
              message: message,
              severity: currentRulesSeverity,
              fix: null
            }, obj));
          }
        }
      }), function (key, val, innerObj) {
        var current = val !== undefined ? val : key;
        if (isObj(current) && (!innerObj.parentKey || !innerObj.parentKey.startsWith("attrib"))) {
          _this2.emit(current.type, current);
          if (current.type === "tag" && Array.isArray(current.attribs) && current.attribs.length) {
            current.attribs.forEach(function (attribObj) {
              _this2.emit("attribute", _objectSpread__default['default'](_objectSpread__default['default']({}, attribObj), {}, {
                parent: _objectSpread__default['default']({}, current)
              }));
            });
          }
        }
        return current;
      }));
      var severity = 0;
      var letsCatchBadEntities = Object.keys(config.rules).some(function (ruleName) {
        return (ruleName === "all" || ruleName.startsWith("bad-html-entity")) && (severity = isAnEnabledValue(config.rules[ruleName]) || isAnEnabledValue(processedRulesConfig[ruleName]));
      });
      var letsCatchRawTextAmpersands = Object.keys(config.rules).some(function (ruleName) {
        return (ruleName === "all" || ruleName === "character-encode") && (isAnEnabledValue(config.rules[ruleName]) || isAnEnabledValue(processedRulesConfig[ruleName]));
      });
      if (letsCatchBadEntities || letsCatchRawTextAmpersands) {
        stringFixBrokenNamedEntities.fixEnt(str, {
          cb: letsCatchBadEntities ? function (obj) {
            if (Number.isInteger(severity) && severity) {
              var message;
              if (obj.ruleName === "bad-html-entity-malformed-nbsp") {
                message = "Malformed nbsp entity.";
              } else if (obj.ruleName === "bad-html-entity-unrecognised") {
                message = "Unrecognised named entity.";
              } else if (obj.ruleName === "bad-html-entity-multiple-encoding") {
                message = "HTML entity encoding over and over.";
              } else if (obj.ruleName === "bad-html-entity-malformed-numeric") {
                message = "Malformed numeric entity.";
              } else {
                message = "Malformed ".concat(obj.entityName ? obj.entityName : "named", " entity.");
              }
              var ranges = [[obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded ? obj.rangeValEncoded : ""]];
              if (obj.ruleName === "bad-html-entity-unrecognised") {
                ranges = [];
              }
              _this2.report({
                severity: severity,
                ruleId: obj.ruleName,
                message: message,
                idxFrom: obj.rangeFrom,
                idxTo: obj.rangeTo,
                fix: {
                  ranges: ranges
                }
              });
            }
          } : undefined,
          entityCatcherCb: letsCatchBadEntities ? function (from, to) {
            _this2.emit("entity", {
              idxFrom: from,
              idxTo: to
            });
          } : undefined,
          textAmpersandCatcherCb: letsCatchRawTextAmpersands ? function (posIdx) {
            var mode;
            if (Array.isArray(processedRulesConfig["character-encode"]) && processedRulesConfig["character-encode"].includes("numeric")) {
              mode = "numeric";
            }
            validateCharEncoding("&", posIdx, mode, _this2);
          } : undefined
        });
      }
      var allEventNames = ["tag", "at", "rule", "text", "esp", "character", "attribute", "ast", "comment", "entity"];
      allEventNames.forEach(function (eventName) {
        _this2.removeAllListeners(eventName);
      });
      return clone__default['default'](this.messages);
    }
  }, {
    key: "report",
    value: function report(obj) {
      var _lineCol = lineColumnMini.lineCol(this.strLineStartIndexes, obj.idxFrom, true),
          line = _lineCol.line,
          col = _lineCol.col;
      var severity = obj.severity || 0;
      if (!Number.isInteger(obj.severity) && typeof this.processedRulesConfig[obj.ruleId] === "number") {
        severity = this.processedRulesConfig[obj.ruleId];
      } else if (!Number.isInteger(obj.severity) && Array.isArray(this.processedRulesConfig[obj.ruleId])) {
        severity = this.processedRulesConfig[obj.ruleId][0];
      }
      this.messages.push(_objectSpread__default['default'](_objectSpread__default['default']({
        fix: null,
        keepSeparateWhenFixing: false,
        line: line,
        column: col,
        severity: severity
      }, obj), this.hasBeenCalledWithKeepSeparateWhenFixing ? {
        fix: null
      } : {}));
      if (obj.keepSeparateWhenFixing && !this.hasBeenCalledWithKeepSeparateWhenFixing && obj.fix) {
        this.hasBeenCalledWithKeepSeparateWhenFixing = true;
      }
    }
  }]);
  return Linter;
}(tinyTypedEmitter.TypedEmitter);

var version$1 = "4.5.5";

var version = version$1;

exports.Linter = Linter;
exports.util = util;
exports.version = version;
