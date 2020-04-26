/**
 * string-strip-html
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 * Version: 4.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rangesApply = _interopDefault(require('ranges-apply'));
var Ranges = _interopDefault(require('ranges-push'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var trim = _interopDefault(require('lodash.trim'));
var without = _interopDefault(require('lodash.without'));
var ent = _interopDefault(require('ent'));
var stringLeftRight = require('string-left-right');

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function stripHtml(str, originalOpts) {
  var isArr = Array.isArray;
  var definitelyTagNames = new Set(["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]);
  var singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);
  var punctuation = new Set([".", ",", "?", ";", ")", "\u2026", '"', "\xBB"]);
  var stripTogetherWithTheirContentsDefaults = new Set(["script", "style", "xml"]);
  var tag = {
    attributes: []
  };
  var chunkOfWhitespaceStartsAt = null;
  var chunkOfSpacesStartsAt = null;
  var rangedOpeningTags = [];
  var attrObj = {};
  var hrefDump = {};
  var stringToInsertAfter = "";
  var hrefInsertionActive;
  var spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function isValidAttributeCharacter(char) {
    if (char.charCodeAt(0) >= 0 && char.charCodeAt(0) <= 31) {
      return false;
    }
    if (char.charCodeAt(0) >= 127 && char.charCodeAt(0) <= 159) {
      return false;
    }
    if (char.charCodeAt(0) === 32) {
      return false;
    }
    if (char.charCodeAt(0) === 34) {
      return false;
    }
    if (char.charCodeAt(0) === 39) {
      return false;
    }
    if (char.charCodeAt(0) === 62) {
      return false;
    }
    if (char.charCodeAt(0) === 47) {
      return false;
    }
    if (char.charCodeAt(0) === 61) {
      return false;
    }
    if (
    char.charCodeAt(0) >= 64976 && char.charCodeAt(0) <= 65007 ||
    char.charCodeAt(0) === 65534 ||
    char.charCodeAt(0) === 65535 ||
    char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57343 ||
    char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57342 ||
    char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57343
    ) {
        return false;
      }
    return true;
  }
  function treatRangedTags(i, opts, rangesToDelete) {
    if (opts.stripTogetherWithTheirContents.includes(tag.name)) {
      if (isArr(rangedOpeningTags) && rangedOpeningTags.some(function (obj) {
        return obj.name === tag.name && obj.lastClosingBracketAt < i;
      })) {
        for (var y = rangedOpeningTags.length; y--;) {
          if (rangedOpeningTags[y].name === tag.name) {
            if (punctuation.has(str[i])) {
              opts.cb({
                tag: tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: null,
                rangesArr: rangesToDelete,
                proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, null]
              });
            } else {
              opts.cb({
                tag: tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: "",
                rangesArr: rangesToDelete,
                proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, ""]
              });
            }
            rangedOpeningTags.splice(y, 1);
            break;
          }
        }
      } else {
        rangedOpeningTags.push(tag);
      }
    }
  }
  function calculateWhitespaceToInsert(str2,
  currCharIdx,
  fromIdx,
  toIdx,
  lastOpeningBracketAt,
  lastClosingBracketAt
  ) {
    var strToEvaluateForLineBreaks = "";
    if (fromIdx < lastOpeningBracketAt) {
      strToEvaluateForLineBreaks += str2.slice(fromIdx, lastOpeningBracketAt);
    }
    if (toIdx > lastClosingBracketAt + 1) {
      var temp = str2.slice(lastClosingBracketAt + 1, toIdx);
      if (temp.includes("\n") && str2[toIdx] === "<") {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
    }
    if (!punctuation.has(str2[currCharIdx]) &&
    str2[currCharIdx] !== "!"
    ) {
        var foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
        if (isArr(foundLineBreaks) && foundLineBreaks.length) {
          if (foundLineBreaks.length === 1) {
            return "\n";
          }
          if (foundLineBreaks.length === 2) {
            return "\n\n";
          }
          return "\n\n\n";
        }
        return " ";
      }
    return "";
  }
  function calculateHrefToBeInserted(opts) {
    if (opts.dumpLinkHrefsNearby.enabled && Object.keys(hrefDump).length && hrefDump.tagName === tag.name && tag.lastOpeningBracketAt && (hrefDump.openingTagEnds && tag.lastOpeningBracketAt > hrefDump.openingTagEnds || !hrefDump.openingTagEnds)) {
      hrefInsertionActive = true;
    }
    if (hrefInsertionActive) {
      var lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
      stringToInsertAfter = "".concat(lineBreaks).concat(hrefDump.hrefValue).concat(lineBreaks);
    }
  }
  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char);
  }
  if (typeof str !== "string") {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str).toLowerCase(), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ".concat(_typeof(originalOpts).toLowerCase(), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  function prepHopefullyAnArray(something, name) {
    if (!something) {
      return [];
    }
    if (isArr(something)) {
      return something.filter(function (val) {
        return isStr(val) && val.trim();
      });
    }
    if (isStr(something)) {
      if (something.length) {
        return [something];
      }
      return [];
    }
    if (!isArr(something)) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] ".concat(name, " must be array containing zero or more strings or something falsey. Currently it's equal to: ").concat(something, ", that a type of ").concat(_typeof(something), "."));
    }
  }
  function resetHrefMarkers() {
    if (hrefInsertionActive) {
      hrefDump = {};
      hrefInsertionActive = false;
    }
  }
  var defaults = {
    ignoreTags: [],
    onlyStripTags: [],
    stripTogetherWithTheirContents: _toConsumableArray(stripTogetherWithTheirContentsDefaults),
    skipHtmlDecoding: false,
    returnRangesOnly: false,
    trimOnlySpaces: false,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: ""
    },
    cb: null
  };
  var opts = _objectSpread2({}, defaults, {}, originalOpts);
  opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
  opts.onlyStripTags = prepHopefullyAnArray(opts.onlyStripTags, "opts.onlyStripTags");
  var onlyStripTagsMode = !!opts.onlyStripTags.length;
  if (opts.onlyStripTags.length && opts.ignoreTags.length) {
    opts.onlyStripTags = without.apply(void 0, [opts.onlyStripTags].concat(_toConsumableArray(opts.ignoreTags)));
  }
  if (!isObj(opts.dumpLinkHrefsNearby)) {
    opts.dumpLinkHrefsNearby = _objectSpread2({}, defaults.dumpLinkHrefsNearby);
  }
  if (typeof opts.ignoreTags === "string") {
    if (opts.ignoreTags.length === 0) {
      opts.ignoreTags = [];
    } else {
      opts.ignoreTags = [opts.ignoreTags];
    }
  }
  opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;
  if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") && existy(originalOpts.dumpLinkHrefsNearby)) {
    if (isObj(originalOpts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = _objectSpread2({}, defaults.dumpLinkHrefsNearby, {}, originalOpts.dumpLinkHrefsNearby);
    } else if (originalOpts.dumpLinkHrefsNearby) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key dumpLinkHrefsNearby was set to ".concat(_typeof(originalOpts.dumpLinkHrefsNearby), ", equal to ").concat(JSON.stringify(originalOpts.dumpLinkHrefsNearby, null, 4), ". The only allowed value is a plain object. See the API reference."));
    }
  }
  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (typeof opts.stripTogetherWithTheirContents === "string" && opts.stripTogetherWithTheirContents.length > 0) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }
  if (!opts.dumpLinkHrefsNearby || isObj(opts.dumpLinkHrefsNearby) && !Object.keys(opts.dumpLinkHrefsNearby).length) {
    opts.dumpLinkHrefsNearby = _objectSpread2({}, defaults.dumpLinkHrefsNearby);
  }
  if (!isArr(opts.stripTogetherWithTheirContents)) {
    opts.stripTogetherWithTheirContents = [];
  }
  var somethingCaught = {};
  if (opts.stripTogetherWithTheirContents && isArr(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length && !opts.stripTogetherWithTheirContents.every(function (el, i) {
    if (!(typeof el === "string")) {
      somethingCaught.el = el;
      somethingCaught.i = i;
      return false;
    }
    return true;
  })) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_06] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ".concat(somethingCaught.i, " has a value ").concat(somethingCaught.el, " which is not string but ").concat(_typeof(somethingCaught.el).toLowerCase(), "."));
  }
  if (!opts.cb) {
    opts.cb = function (_ref) {
      var rangesArr = _ref.rangesArr,
          proposedReturn = _ref.proposedReturn;
      rangesArr.push.apply(rangesArr, _toConsumableArray(proposedReturn));
    };
  }
  var rangesToDelete = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2
  });
  if (str === "" || str.trim() === "") {
    return str;
  }
  if (!opts.skipHtmlDecoding) {
    while (str !== ent.decode(str)) {
      str = ent.decode(str);
    }
  }
  if (!opts.trimOnlySpaces) {
    str = str.trim();
  }
  for (var i = 0, len = str.length; i < len; i++) {
    if (Object.keys(tag).length > 1 && tag.lastClosingBracketAt && tag.lastClosingBracketAt < i && str[i] !== " " && spacesChunkWhichFollowsTheClosingBracketEndsAt === null) {
      spacesChunkWhichFollowsTheClosingBracketEndsAt = i;
    }
    if (str[i] === ">") {
      if ((!tag || Object.keys(tag).length < 2) && i > 1) {
        for (var y = i; y--;) {
          if (str[y - 1] === undefined || str[y] === ">") {
            var _ret = function () {
              var startingPoint = str[y - 1] === undefined ? y : y + 1;
              var culprit = str.slice(startingPoint, i + 1);
              if (str !== "<".concat(trim(culprit.trim(), "/>"), ">") &&
              _toConsumableArray(definitelyTagNames).some(function (val) {
                return trim(culprit.trim().split(" ").filter(function (val2) {
                  return val2.trim();
                }).filter(function (val3, i3) {
                  return i3 === 0;
                }), "/>").toLowerCase() === val;
              }) && stripHtml("<".concat(culprit.trim(), ">"), opts) === "") {
                var whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, startingPoint, i + 1, startingPoint, i + 1);
                var deleteUpTo = i + 1;
                if (str[deleteUpTo] && !str[deleteUpTo].trim()) {
                  for (var z = deleteUpTo; z < len; z++) {
                    if (str[z].trim()) {
                      deleteUpTo = z;
                      break;
                    }
                    if (!str[z + 1]) {
                      deleteUpTo = z + 1;
                      break;
                    }
                  }
                }
                opts.cb({
                  tag: tag,
                  deleteFrom: startingPoint,
                  deleteTo: deleteUpTo,
                  insert: whiteSpaceCompensation,
                  rangesArr: rangesToDelete,
                  proposedReturn: [startingPoint, deleteUpTo, whiteSpaceCompensation]
                });
              }
              return "break";
            }();
            if (_ret === "break") break;
          }
        }
      }
    }
    if (str[i] === "/" && !(tag.quotes && tag.quotes.value) && Number.isInteger(tag.lastOpeningBracketAt) && !Number.isInteger(tag.lastClosingBracketAt)) {
      tag.slashPresent = i;
    }
    if (tag.nameStarts && tag.nameStarts < i && !tag.quotes && punctuation.has(str[i]) && !attrObj.equalsAt && tag.attributes && !tag.attributes.length && !tag.lastClosingBracketAt
    ) {
        tag = {};
        tag.attributes = [];
        attrObj = {};
      }
    if (str[i] === '"' || str[i] === "'") {
      if (tag.nameStarts && tag.quotes && tag.quotes.value && tag.quotes.value === str[i]) {
        attrObj.valueEnds = i;
        attrObj.value = str.slice(attrObj.valueStarts, i);
        tag.attributes.push(attrObj);
        attrObj = {};
        tag.quotes = undefined;
        var hrefVal = void 0;
        if (opts.dumpLinkHrefsNearby.enabled &&
        tag.attributes.some(function (obj) {
          if (obj.name && obj.name.toLowerCase() === "href") {
            hrefVal = "".concat(opts.dumpLinkHrefsNearby.wrapHeads || "").concat(obj.value).concat(opts.dumpLinkHrefsNearby.wrapTails || "");
            return true;
          }
        })) {
          hrefDump = {
            tagName: tag.name,
            hrefValue: hrefVal
          };
        }
      } else if (!tag.quotes && tag.nameStarts) {
        tag.quotes = {};
        tag.quotes.value = str[i];
        tag.quotes.start = i;
        if (attrObj.nameStarts && attrObj.nameEnds && attrObj.nameEnds < i && attrObj.nameStarts < i && !attrObj.valueStarts) {
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      }
    }
    if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (!str[i].trim() || !characterSuitableForNames(str[i]))) {
      tag.nameEnds = i;
      tag.name = str.slice(tag.nameStarts, tag.nameEnds + (str[i] !== ">" && str[i] !== "/" && str[i + 1] === undefined ? 1 : 0));
      if (str[tag.nameStarts - 1] !== "!" &&
      !tag.name.replace(/-/g, "").length) {
        tag = {};
        continue;
      }
      if (str[i] === "<") {
        calculateHrefToBeInserted(opts);
        var whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i, tag.lastOpeningBracketAt, i);
        opts.cb({
          tag: tag,
          deleteFrom: tag.leftOuterWhitespace,
          deleteTo: i,
          insert: "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation),
          rangesArr: rangesToDelete,
          proposedReturn: [tag.leftOuterWhitespace, i, "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation)]
        });
        resetHrefMarkers();
        treatRangedTags(i, opts, rangesToDelete);
      }
    }
    if (tag.quotes && tag.quotes.start && tag.quotes.start < i && !tag.quotes.end && attrObj.nameEnds && attrObj.equalsAt && !attrObj.valueStarts) {
      if (attrObj.valueEnds) ; else {
        attrObj.valueStarts = i;
      }
    }
    if (!tag.quotes && attrObj.nameEnds && str[i] === "=" && !attrObj.valueStarts) {
      if (!attrObj.equalsAt) {
        attrObj.equalsAt = i;
      }
    }
    if (!tag.quotes && attrObj.nameStarts && attrObj.nameEnds && !attrObj.valueStarts && str[i].trim() && str[i] !== "=") {
      tag.attributes.push(attrObj);
      attrObj = {};
    }
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      if (!str[i].trim()) {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[i] === "=") {
        if (!attrObj.equalsAt) {
          attrObj.nameEnds = i;
          attrObj.equalsAt = i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (str[i] === "/" || str[i] === ">") {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (str[i] === "<" || !isValidAttributeCharacter(str[i])) {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      }
    }
    if (!tag.quotes && tag.nameEnds < i && str[i] !== ">" && str[i] !== "/" && str[i] !== "!" && !str[i - 1].trim() && str[i].trim() && !attrObj.nameStarts && !tag.lastClosingBracketAt) {
      if (isValidAttributeCharacter("".concat(str[i]).concat(str[i + 1])) && str[i] !== "<") {
        attrObj.nameStarts = i;
      } else if (tag.onlyPlausible && str[i] !== "<") {
        tag = {};
      }
    }
    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < i && str[i] === "/" && tag.onlyPlausible) {
      tag.onlyPlausible = false;
    }
    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < i && str[i] !== "/"
    ) {
        if (tag.onlyPlausible === undefined) {
          if ((!str[i].trim() || str[i] === "<") && !tag.slashPresent) {
            tag.onlyPlausible = true;
          } else {
            tag.onlyPlausible = false;
          }
        }
        if (str[i].trim() && tag.nameStarts === undefined && str[i] !== "<" && str[i] !== "/" && str[i] !== ">" && str[i] !== "!") {
          tag.nameStarts = i;
          tag.nameContainsLetters = false;
        }
      }
    if (tag.nameStarts && !tag.quotes && str[i].toLowerCase() !== str[i].toUpperCase()) {
      tag.nameContainsLetters = true;
    }
    if (str[i] === ">") {
      if (tag.lastOpeningBracketAt !== undefined) {
        tag.lastClosingBracketAt = i;
        spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
        if (Object.keys(attrObj).length) {
          tag.attributes.push(attrObj);
          attrObj = {};
        }
        if (opts.dumpLinkHrefsNearby.enabled && hrefDump.tagName && !hrefDump.openingTagEnds) {
          hrefDump.openingTagEnds = i;
        }
      }
    }
    if (tag.lastOpeningBracketAt !== undefined) {
      if (tag.lastClosingBracketAt === undefined) {
        if (tag.lastOpeningBracketAt < i && str[i] !== "<" && (
        str[i + 1] === undefined || str[i + 1] === "<") && tag.nameContainsLetters) {
          tag.name = str.slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : i + 1).toLowerCase();
          if (opts.ignoreTags.includes(tag.name) || tag.onlyPlausible && !definitelyTagNames.has(tag.name)) {
            tag = {};
            attrObj = {};
            continue;
          }
          if ((definitelyTagNames.has(tag.name) || singleLetterTags.has(tag.name)) && (tag.onlyPlausible === false || tag.onlyPlausible === true && tag.attributes.length) || str[i + 1] === undefined) {
            calculateHrefToBeInserted(opts);
            var _whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i + 1, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);
            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i + 1,
              insert: "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation),
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, i + 1, "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation)]
            });
            resetHrefMarkers();
            treatRangedTags(i, opts, rangesToDelete);
          }
        }
      } else if (i > tag.lastClosingBracketAt && str[i].trim() || str[i + 1] === undefined) {
        var endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;
        if (opts.trimOnlySpaces && endingRangeIndex === len - 1 && spacesChunkWhichFollowsTheClosingBracketEndsAt !== null && spacesChunkWhichFollowsTheClosingBracketEndsAt < i) {
          endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
        }
        if (!onlyStripTagsMode && opts.ignoreTags.includes(tag.name) || onlyStripTagsMode && !opts.onlyStripTags.includes(tag.name)) {
          opts.cb({
            tag: tag,
            deleteFrom: null,
            deleteTo: null,
            insert: null,
            rangesArr: rangesToDelete,
            proposedReturn: []
          });
          tag = {};
          attrObj = {};
        } else if (!tag.onlyPlausible ||
        tag.attributes.length === 0 && tag.name && (definitelyTagNames.has(tag.name.toLowerCase()) || singleLetterTags.has(tag.name.toLowerCase())) ||
        tag.attributes && tag.attributes.some(function (attrObj2) {
          return attrObj2.equalsAt;
        })) {
          var _whiteSpaceCompensation2 = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, endingRangeIndex, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);
          stringToInsertAfter = "";
          hrefInsertionActive = false;
          calculateHrefToBeInserted(opts);
          var insert = void 0;
          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = "".concat(_whiteSpaceCompensation2).concat(stringToInsertAfter).concat(_whiteSpaceCompensation2 === "\n\n" ? "\n" : _whiteSpaceCompensation2);
          } else {
            insert = _whiteSpaceCompensation2;
          }
          if (tag.leftOuterWhitespace === 0 || !stringLeftRight.right(str, endingRangeIndex - 1)) {
            insert = "";
          }
          if (insert && insert.length > 1 && !insert.trim() && !insert.includes("\n") && !insert.includes("\r")) {
            insert = " ";
          }
          opts.cb({
            tag: tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: endingRangeIndex,
            insert: insert,
            rangesArr: rangesToDelete,
            proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert]
          });
          resetHrefMarkers();
          treatRangedTags(i, opts, rangesToDelete);
        } else {
          tag = {};
        }
        if (str[i] !== ">") {
          tag = {};
        }
      }
    }
    if (str[i] === "<" && str[i - 1] !== "<") {
      if (str[stringLeftRight.right(str, i)] === ">") {
        continue;
      } else {
        if (tag.nameEnds && tag.nameEnds < i && !tag.lastClosingBracketAt) {
          if (tag.onlyPlausible === true && tag.attributes && tag.attributes.length || tag.onlyPlausible === false) {
            var _whiteSpaceCompensation3 = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i, tag.lastOpeningBracketAt, i);
            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i,
              insert: _whiteSpaceCompensation3,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, i, _whiteSpaceCompensation3]
            });
            treatRangedTags(i, opts, rangesToDelete);
            tag = {};
            attrObj = {};
          } else if (tag.onlyPlausible && !definitelyTagNames.has(tag.name) && !singleLetterTags.has(tag.name) && !(tag.attributes && tag.attributes.length)) {
            tag = {};
            attrObj = {};
          }
        }
        if (tag.lastOpeningBracketAt !== undefined && tag.onlyPlausible && tag.name && !tag.quotes) {
          tag.lastOpeningBracketAt = undefined;
          tag.onlyPlausible = false;
        }
        if ((tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) && !tag.quotes) {
          tag.lastOpeningBracketAt = i;
          tag.slashPresent = false;
          tag.attributes = [];
          if (chunkOfWhitespaceStartsAt === null) {
            tag.leftOuterWhitespace = i;
          } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
            tag.leftOuterWhitespace = chunkOfSpacesStartsAt || i;
          } else {
            tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
          }
          if ("".concat(str[i + 1]).concat(str[i + 2]).concat(str[i + 3]) === "!--" || "".concat(str[i + 1]).concat(str[i + 2]).concat(str[i + 3]).concat(str[i + 4]).concat(str[i + 5]).concat(str[i + 6]).concat(str[i + 7]).concat(str[i + 8]) === "![CDATA[") {
            var cdata = true;
            if (str[i + 2] === "-") {
              cdata = false;
            }
            var closingFoundAt = void 0;
            for (var _y = i; _y < len; _y++) {
              if (!closingFoundAt && cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "]]>" || !cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "-->") {
                closingFoundAt = _y;
              }
              if (closingFoundAt && (closingFoundAt < _y && str[_y].trim() || str[_y + 1] === undefined)) {
                var rangeEnd = _y;
                if (str[_y + 1] === undefined && !str[_y].trim() || str[_y] === ">") {
                  rangeEnd += 1;
                }
                var _whiteSpaceCompensation4 = calculateWhitespaceToInsert(str, _y, tag.leftOuterWhitespace, rangeEnd, tag.lastOpeningBracketAt, closingFoundAt);
                opts.cb({
                  tag: tag,
                  deleteFrom: tag.leftOuterWhitespace,
                  deleteTo: rangeEnd,
                  insert: _whiteSpaceCompensation4,
                  rangesArr: rangesToDelete,
                  proposedReturn: [tag.leftOuterWhitespace, rangeEnd, _whiteSpaceCompensation4]
                });
                i = _y - 1;
                if (str[_y] === ">") {
                  i = _y;
                }
                tag = {};
                attrObj = {};
                break;
              }
            }
          }
        }
      }
    }
    if (str[i].trim() === "") {
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        if (tag.lastOpeningBracketAt !== undefined && tag.lastOpeningBracketAt < i && tag.nameStarts && tag.nameStarts < tag.lastOpeningBracketAt && i === tag.lastOpeningBracketAt + 1 &&
        !rangedOpeningTags.some(
        function (rangedTagObj) {
          return rangedTagObj.name === tag.name;
        })) {
          tag.onlyPlausible = true;
          tag.name = undefined;
          tag.nameStarts = undefined;
        }
      }
    } else if (chunkOfWhitespaceStartsAt !== null) {
      if (!tag.quotes && attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 && attrObj.nameEnds && attrObj.equalsAt > attrObj.nameEnds && str[i] !== '"' && str[i] !== "'") {
        if (isObj(attrObj)) {
          tag.attributes.push(attrObj);
        }
        attrObj = {};
        tag.equalsSpottedAt = undefined;
      }
      chunkOfWhitespaceStartsAt = null;
    }
    if (str[i] === " ") {
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = i;
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      chunkOfSpacesStartsAt = null;
    }
  }
  if (rangesToDelete.current()) {
    if (opts.returnRangesOnly) {
      return rangesToDelete.current();
    }
    var untrimmedRes = rangesApply(str, rangesToDelete.current());
    if (opts.trimOnlySpaces) {
      return trim(untrimmedRes, " ");
    }
    return untrimmedRes.trim();
  }
  if (opts.returnRangesOnly) {
    return [];
  }
  if (opts.trimOnlySpaces) {
    return trim(str, " ");
  }
  return str.trim();
}

module.exports = stripHtml;
