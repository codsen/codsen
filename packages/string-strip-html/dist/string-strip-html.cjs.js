/**
 * string-strip-html
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 * Version: 6.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-strip-html/
 */

'use strict';

var rangesApply = require('ranges-apply');
var Ranges = require('ranges-push');
var isObj = require('lodash.isplainobject');
var trim = require('lodash.trim');
var without = require('lodash.without');
var ent = require('ent');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var rangesApply__default = /*#__PURE__*/_interopDefaultLegacy(rangesApply);
var Ranges__default = /*#__PURE__*/_interopDefaultLegacy(Ranges);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var trim__default = /*#__PURE__*/_interopDefaultLegacy(trim);
var without__default = /*#__PURE__*/_interopDefaultLegacy(without);
var ent__default = /*#__PURE__*/_interopDefaultLegacy(ent);

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char);
}
function prepHopefullyAnArray(something, name) {
  if (!something) {
    return [];
  }
  if (Array.isArray(something)) {
    return something.filter(function (val) {
      return typeof val === "string" && val.trim();
    });
  }
  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }
  throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] ".concat(name, " must be array containing zero or more strings or something falsey. Currently it's equal to: ").concat(something, ", that a type of ").concat(_typeof(something), "."));
}

function stripHtml(str, originalOpts) {
  var start = Date.now();
  var definitelyTagNames = new Set(["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]);
  var singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);
  var punctuation = new Set([".", ",", "?", ";", ")", "\u2026", '"', "\xBB"]);
  var stripTogetherWithTheirContentsDefaults = new Set(["script", "style", "xml"]);
  var rangedOpeningTags = [];
  var allTagLocations = [];
  var filteredTagLocations = [];
  var tag;
  function resetTag() {
    tag = {
      attributes: []
    };
  }
  resetTag();
  var chunkOfWhitespaceStartsAt = null;
  var chunkOfSpacesStartsAt = null;
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
  function treatRangedTags(i, opts, rangesToDelete) {
    if (Array.isArray(opts.stripTogetherWithTheirContents) && (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*"))) {
      if (Array.isArray(rangedOpeningTags) && rangedOpeningTags.some(function (obj) {
        return obj.name === tag.name && obj.lastClosingBracketAt < i;
      })) {
        var _loop = function _loop(y) {
          if (rangedOpeningTags[y].name === tag.name) {
            /* istanbul ignore else */
            if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
              filteredTagLocations = filteredTagLocations.filter(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    from = _ref2[0],
                    upto = _ref2[1];
                return (from < rangedOpeningTags[y].lastOpeningBracketAt || from >= i + 1) && (upto <= rangedOpeningTags[y].lastOpeningBracketAt || upto > i + 1);
              });
            }
            var endingIdx = i + 1;
            if (tag.lastClosingBracketAt) {
              endingIdx = tag.lastClosingBracketAt + 1;
            }
            filteredTagLocations.push([rangedOpeningTags[y].lastOpeningBracketAt, endingIdx]);
            if (punctuation.has(str[i])) {
              opts.cb({
                tag: tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i + 1,
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
            return "break";
          }
        };
        for (var y = rangedOpeningTags.length; y--;) {
          var _ret = _loop(y);
          if (_ret === "break") break;
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
    if (!punctuation.has(str2[currCharIdx]) && str2[currCharIdx] !== "!") {
      var foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
      if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
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
  if (typeof str !== "string") {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str).toLowerCase(), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  if (originalOpts && !isObj__default['default'](originalOpts)) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ".concat(_typeof(originalOpts).toLowerCase(), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
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
    trimOnlySpaces: false,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: ""
    },
    cb: null
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (Object.prototype.hasOwnProperty.call(opts, "returnRangesOnly")) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] opts.returnRangesOnly has been removed from the API since v.5 release.");
  }
  opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
  opts.onlyStripTags = prepHopefullyAnArray(opts.onlyStripTags, "opts.onlyStripTags");
  var onlyStripTagsMode = !!opts.onlyStripTags.length;
  if (opts.onlyStripTags.length && opts.ignoreTags.length) {
    opts.onlyStripTags = without__default['default'].apply(void 0, [opts.onlyStripTags].concat(_toConsumableArray(opts.ignoreTags)));
  }
  if (!isObj__default['default'](opts.dumpLinkHrefsNearby)) {
    opts.dumpLinkHrefsNearby = _objectSpread2({}, defaults.dumpLinkHrefsNearby);
  }
  opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;
  if (isObj__default['default'](originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") && existy(originalOpts.dumpLinkHrefsNearby)) {
    /* istanbul ignore else */
    if (isObj__default['default'](originalOpts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = _objectSpread2(_objectSpread2({}, defaults.dumpLinkHrefsNearby), originalOpts.dumpLinkHrefsNearby);
    } else if (originalOpts.dumpLinkHrefsNearby) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key dumpLinkHrefsNearby was set to ".concat(_typeof(originalOpts.dumpLinkHrefsNearby), ", equal to ").concat(JSON.stringify(originalOpts.dumpLinkHrefsNearby, null, 4), ". The only allowed value is a plain object. See the API reference."));
    }
  }
  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (typeof opts.stripTogetherWithTheirContents === "string" && opts.stripTogetherWithTheirContents.length > 0) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }
  var somethingCaught = {};
  if (opts.stripTogetherWithTheirContents && Array.isArray(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length && !opts.stripTogetherWithTheirContents.every(function (el, i) {
    if (!(typeof el === "string")) {
      somethingCaught.el = el;
      somethingCaught.i = i;
      return false;
    }
    return true;
  })) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_05] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ".concat(somethingCaught.i, " has a value ").concat(somethingCaught.el, " which is not string but ").concat(_typeof(somethingCaught.el).toLowerCase(), "."));
  }
  if (!opts.cb) {
    opts.cb = function (_ref3) {
      var rangesArr = _ref3.rangesArr,
          proposedReturn = _ref3.proposedReturn;
      rangesArr.push.apply(rangesArr, _toConsumableArray(proposedReturn));
    };
  }
  var rangesToDelete = new Ranges__default['default']({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2
  });
  if (!opts.skipHtmlDecoding) {
    while (str !== ent__default['default'].decode(str)) {
      str = ent__default['default'].decode(str);
    }
  }
  var _loop2 = function _loop2(_i, len) {
    if (Object.keys(tag).length > 1 && tag.lastClosingBracketAt && tag.lastClosingBracketAt < _i && str[_i] !== " " && spacesChunkWhichFollowsTheClosingBracketEndsAt === null) {
      spacesChunkWhichFollowsTheClosingBracketEndsAt = _i;
    }
    if (str[_i] === ">") {
      if ((!tag || Object.keys(tag).length < 2) && _i > 1) {
        for (var y = _i; y--;) {
          if (str[y - 1] === undefined || str[y] === ">") {
            var _ret3 = function () {
              var startingPoint = str[y - 1] === undefined ? y : y + 1;
              var culprit = str.slice(startingPoint, _i + 1);
              if (str !== "<".concat(trim__default['default'](culprit.trim(), "/>"), ">") &&
              _toConsumableArray(definitelyTagNames).some(function (val) {
                return trim__default['default'](culprit.trim().split(/\s+/).filter(function (val2) {
                  return val2.trim();
                }).filter(function (val3, i3) {
                  return i3 === 0;
                }), "/>").toLowerCase() === val;
              }) && stripHtml("<".concat(culprit.trim(), ">"), opts).result === "") {
                /* istanbul ignore else */
                if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  allTagLocations.push([startingPoint, _i + 1]);
                }
                /* istanbul ignore else */
                if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  filteredTagLocations.push([startingPoint, _i + 1]);
                }
                var whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, startingPoint, _i + 1, startingPoint, _i + 1);
                var deleteUpTo = _i + 1;
                if (str[deleteUpTo] && !str[deleteUpTo].trim()) {
                  for (var z = deleteUpTo; z < len; z++) {
                    if (str[z].trim()) {
                      deleteUpTo = z;
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
            if (_ret3 === "break") break;
          }
        }
      }
    }
    if (str[_i] === "/" && !(tag.quotes && tag.quotes.value) && Number.isInteger(tag.lastOpeningBracketAt) && !Number.isInteger(tag.lastClosingBracketAt)) {
      tag.slashPresent = _i;
    }
    if (str[_i] === '"' || str[_i] === "'") {
      if (tag.nameStarts && tag.quotes && tag.quotes.value && tag.quotes.value === str[_i]) {
        attrObj.valueEnds = _i;
        attrObj.value = str.slice(attrObj.valueStarts, _i);
        tag.attributes.push(attrObj);
        attrObj = {};
        tag.quotes = undefined;
        var hrefVal;
        if (opts.dumpLinkHrefsNearby.enabled &&
        tag.attributes.some(function (obj) {
          if (obj.name && obj.name.toLowerCase() === "href") {
            hrefVal = "".concat(opts.dumpLinkHrefsNearby.wrapHeads || "").concat(obj.value).concat(opts.dumpLinkHrefsNearby.wrapTails || "");
            i = _i;
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
        tag.quotes.value = str[_i];
        tag.quotes.start = _i;
        if (attrObj.nameStarts && attrObj.nameEnds && attrObj.nameEnds < _i && attrObj.nameStarts < _i && !attrObj.valueStarts) {
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      }
    }
    if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (!str[_i].trim() || !characterSuitableForNames(str[_i]))) {
      tag.nameEnds = _i;
      tag.name = str.slice(tag.nameStarts, tag.nameEnds + (
      /* istanbul ignore next */
      str[_i] !== ">" && str[_i] !== "/" && str[_i + 1] === undefined ? 1 : 0));
      if (
      str[tag.nameStarts - 1] !== "!" &&
      !tag.name.replace(/-/g, "").length ||
      /^\d+$/.test(tag.name[0])) {
        tag = {};
        i = _i;
        return "continue";
      }
      if (str[_i] === "<") {
        calculateHrefToBeInserted(opts);
        var whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i, tag.lastOpeningBracketAt, _i);
        if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
          /* istanbul ignore next */
          filteredTagLocations = filteredTagLocations.filter(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                from = _ref5[0],
                upto = _ref5[1];
            return !(from === tag.leftOuterWhitespace && upto === _i);
          });
        }
        opts.cb({
          tag: tag,
          deleteFrom: tag.leftOuterWhitespace,
          deleteTo: _i,
          insert: "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation),
          rangesArr: rangesToDelete,
          proposedReturn: [tag.leftOuterWhitespace, _i, "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation)]
        });
        resetHrefMarkers();
        treatRangedTags(_i, opts, rangesToDelete);
      }
    }
    if (tag.quotes && tag.quotes.start && tag.quotes.start < _i && !tag.quotes.end && attrObj.nameEnds && attrObj.equalsAt && !attrObj.valueStarts) {
      attrObj.valueStarts = _i;
    }
    if (!tag.quotes && attrObj.nameEnds && str[_i] === "=" && !attrObj.valueStarts && !attrObj.equalsAt) {
      attrObj.equalsAt = _i;
    }
    if (!tag.quotes && attrObj.nameStarts && attrObj.nameEnds && !attrObj.valueStarts && str[_i].trim() && str[_i] !== "=") {
      tag.attributes.push(attrObj);
      attrObj = {};
    }
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      if (!str[_i].trim()) {
        attrObj.nameEnds = _i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[_i] === "=") {
        /* istanbul ignore else */
        if (!attrObj.equalsAt) {
          attrObj.nameEnds = _i;
          attrObj.equalsAt = _i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (str[_i] === "/" || str[_i] === ">") {
        attrObj.nameEnds = _i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (str[_i] === "<") {
        attrObj.nameEnds = _i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      }
    }
    if (!tag.quotes && tag.nameEnds < _i && !str[_i - 1].trim() && str[_i].trim() && !"<>/!".includes(str[_i]) && !attrObj.nameStarts && !tag.lastClosingBracketAt) {
      attrObj.nameStarts = _i;
    }
    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < _i && str[_i] === "/" && tag.onlyPlausible) {
      tag.onlyPlausible = false;
    }
    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < _i && str[_i] !== "/"
    ) {
        if (tag.onlyPlausible === undefined) {
          if ((!str[_i].trim() || str[_i] === "<") && !tag.slashPresent) {
            tag.onlyPlausible = true;
          } else {
            tag.onlyPlausible = false;
          }
        }
        if (str[_i].trim() && tag.nameStarts === undefined && str[_i] !== "<" && str[_i] !== "/" && str[_i] !== ">" && str[_i] !== "!") {
          tag.nameStarts = _i;
          tag.nameContainsLetters = false;
        }
      }
    if (tag.nameStarts && !tag.quotes && str[_i].toLowerCase() !== str[_i].toUpperCase()) {
      tag.nameContainsLetters = true;
    }
    if (str[_i] === ">") {
      if (tag.lastOpeningBracketAt !== undefined) {
        tag.lastClosingBracketAt = _i;
        spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
        if (Object.keys(attrObj).length) {
          tag.attributes.push(attrObj);
          attrObj = {};
        }
        if (opts.dumpLinkHrefsNearby.enabled && hrefDump.tagName && !hrefDump.openingTagEnds) {
          hrefDump.openingTagEnds = _i;
        }
      }
    }
    if (tag.lastOpeningBracketAt !== undefined) {
      if (tag.lastClosingBracketAt === undefined) {
        if (tag.lastOpeningBracketAt < _i && str[_i] !== "<" && (
        str[_i + 1] === undefined || str[_i + 1] === "<") && tag.nameContainsLetters) {
          tag.name = str.slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : _i + 1).toLowerCase();
          /* istanbul ignore else */
          if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
            allTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
          }
          if (
          opts.ignoreTags.includes(tag.name) ||
          tag.onlyPlausible && !definitelyTagNames.has(tag.name)) {
            tag = {};
            attrObj = {};
            i = _i;
            return "continue";
          }
          if ((definitelyTagNames.has(tag.name) || singleLetterTags.has(tag.name)) && (tag.onlyPlausible === false || tag.onlyPlausible === true && tag.attributes.length) || str[_i + 1] === undefined) {
            calculateHrefToBeInserted(opts);
            var _whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i + 1, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);
            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: _i + 1,
              insert: "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation),
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, _i + 1, "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation)]
            });
            resetHrefMarkers();
            treatRangedTags(_i, opts, rangesToDelete);
          }
          /* istanbul ignore else */
          if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt && filteredTagLocations[filteredTagLocations.length - 1][1] !== _i + 1) {
            if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
              var lastRangedOpeningTag;
              for (var z = rangedOpeningTags.length; z--;) {
                /* istanbul ignore else */
                if (rangedOpeningTags[z].name === tag.name) {
                  lastRangedOpeningTag = rangedOpeningTags[z];
                }
              }
              /* istanbul ignore else */
              if (lastRangedOpeningTag) {
                filteredTagLocations = filteredTagLocations.filter(function (_ref6) {
                  var _ref7 = _slicedToArray(_ref6, 1),
                      from = _ref7[0];
                  return from !== lastRangedOpeningTag.lastOpeningBracketAt;
                });
                filteredTagLocations.push([lastRangedOpeningTag.lastOpeningBracketAt, _i + 1]);
              } else {
                /* istanbul ignore next */
                filteredTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
              }
            } else {
              filteredTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
            }
          }
        }
      } else if (_i > tag.lastClosingBracketAt && str[_i].trim() || str[_i + 1] === undefined) {
        var endingRangeIndex = tag.lastClosingBracketAt === _i ? _i + 1 : _i;
        if (opts.trimOnlySpaces && endingRangeIndex === len - 1 && spacesChunkWhichFollowsTheClosingBracketEndsAt !== null && spacesChunkWhichFollowsTheClosingBracketEndsAt < _i) {
          endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
        }
        /* istanbul ignore else */
        if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
          allTagLocations.push([tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]);
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
          /* istanbul ignore else */
          if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
            filteredTagLocations.push([tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]);
          }
          var _whiteSpaceCompensation2 = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, endingRangeIndex, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);
          stringToInsertAfter = "";
          hrefInsertionActive = false;
          calculateHrefToBeInserted(opts);
          var insert;
          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = "".concat(_whiteSpaceCompensation2).concat(stringToInsertAfter).concat(
            /* istanbul ignore next */
            _whiteSpaceCompensation2 === "\n\n" ? "\n" : _whiteSpaceCompensation2);
          } else {
            insert = _whiteSpaceCompensation2;
          }
          if (tag.leftOuterWhitespace === 0 || !stringLeftRight.right(str, endingRangeIndex - 1)) {
            insert = "";
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
          treatRangedTags(_i, opts, rangesToDelete);
        } else {
          tag = {};
        }
        if (str[_i] !== ">") {
          tag = {};
        }
      }
    }
    if (str[_i] === "<" && str[_i - 1] !== "<" && !"'\"".includes(str[_i + 1]) && (!"'\"".includes(str[_i + 2]) || /\w/.test(str[_i + 1]))) {
      if (str[stringLeftRight.right(str, _i)] === ">") {
        i = _i;
        return "continue";
      } else {
        if (tag.nameEnds && tag.nameEnds < _i && !tag.lastClosingBracketAt) {
          if (tag.onlyPlausible === true && tag.attributes && tag.attributes.length || tag.onlyPlausible === false) {
            var _whiteSpaceCompensation3 = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i, tag.lastOpeningBracketAt, _i);
            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: _i,
              insert: _whiteSpaceCompensation3,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, _i, _whiteSpaceCompensation3]
            });
            treatRangedTags(_i, opts, rangesToDelete);
            tag = {};
            attrObj = {};
          }
        }
        if (tag.lastOpeningBracketAt !== undefined && tag.onlyPlausible && tag.name && !tag.quotes) {
          tag.lastOpeningBracketAt = undefined;
          tag.name = undefined;
          tag.onlyPlausible = false;
        }
        if ((tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) && !tag.quotes) {
          tag.lastOpeningBracketAt = _i;
          tag.slashPresent = false;
          tag.attributes = [];
          if (chunkOfWhitespaceStartsAt === null) {
            tag.leftOuterWhitespace = _i;
          } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
            /* istanbul ignore next */
            tag.leftOuterWhitespace = chunkOfSpacesStartsAt || _i;
          } else {
            tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
          }
          if ("".concat(str[_i + 1]).concat(str[_i + 2]).concat(str[_i + 3]) === "!--" || "".concat(str[_i + 1]).concat(str[_i + 2]).concat(str[_i + 3]).concat(str[_i + 4]).concat(str[_i + 5]).concat(str[_i + 6]).concat(str[_i + 7]).concat(str[_i + 8]) === "![CDATA[") {
            var cdata = true;
            if (str[_i + 2] === "-") {
              cdata = false;
            }
            var closingFoundAt;
            for (var _y = _i; _y < len; _y++) {
              if (!closingFoundAt && cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "]]>" || !cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "-->") {
                closingFoundAt = _y;
              }
              if (closingFoundAt && (closingFoundAt < _y && str[_y].trim() || str[_y + 1] === undefined)) {
                var rangeEnd = _y;
                if (str[_y + 1] === undefined && !str[_y].trim() || str[_y] === ">") {
                  rangeEnd += 1;
                }
                /* istanbul ignore else */
                if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  allTagLocations.push([tag.lastOpeningBracketAt, closingFoundAt + 1]);
                }
                /* istanbul ignore else */
                if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  filteredTagLocations.push([tag.lastOpeningBracketAt, closingFoundAt + 1]);
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
                _i = _y - 1;
                if (str[_y] === ">") {
                  _i = _y;
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
    if (str[_i].trim() === "") {
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = _i;
        if (tag.lastOpeningBracketAt !== undefined && tag.lastOpeningBracketAt < _i && tag.nameStarts && tag.nameStarts < tag.lastOpeningBracketAt && _i === tag.lastOpeningBracketAt + 1 &&
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
      if (!tag.quotes && attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 && attrObj.nameEnds && attrObj.equalsAt > attrObj.nameEnds && str[_i] !== '"' && str[_i] !== "'") {
        /* istanbul ignore else */
        if (isObj__default['default'](attrObj)) {
          tag.attributes.push(attrObj);
        }
        attrObj = {};
        tag.equalsSpottedAt = undefined;
      }
      chunkOfWhitespaceStartsAt = null;
    }
    if (str[_i] === " ") {
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = _i;
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      chunkOfSpacesStartsAt = null;
    }
    i = _i;
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret2 = _loop2(i, len);
    if (_ret2 === "continue") continue;
  }
  if (str && (
  opts.trimOnlySpaces &&
  str[0] === " " ||
  !opts.trimOnlySpaces &&
  !str[0].trim())) {
    for (var _i2 = 0, _len = str.length; _i2 < _len; _i2++) {
      if (opts.trimOnlySpaces && str[_i2] !== " " || !opts.trimOnlySpaces && str[_i2].trim()) {
        rangesToDelete.push([0, _i2]);
        break;
      } else if (!str[_i2 + 1]) {
        rangesToDelete.push([0, _i2 + 1]);
      }
    }
  }
  if (str && (
  opts.trimOnlySpaces &&
  str[str.length - 1] === " " ||
  !opts.trimOnlySpaces &&
  !str[str.length - 1].trim())) {
    for (var _i3 = str.length; _i3--;) {
      if (opts.trimOnlySpaces && str[_i3] !== " " || !opts.trimOnlySpaces && str[_i3].trim()) {
        rangesToDelete.push([_i3 + 1, str.length]);
        break;
      }
    }
  }
  if ((!originalOpts || !originalOpts.cb) && rangesToDelete.current()) {
    if (rangesToDelete.current()[0] && !rangesToDelete.current()[0][0]) {
      var startingIdx = rangesToDelete.current()[0][1];
      rangesToDelete.current();
      rangesToDelete.ranges[0] = [rangesToDelete.ranges[0][0], rangesToDelete.ranges[0][1]];
    }
    if (rangesToDelete.current()[rangesToDelete.current().length - 1] && rangesToDelete.current()[rangesToDelete.current().length - 1][1] === str.length) {
      var _startingIdx = rangesToDelete.current()[rangesToDelete.current().length - 1][0];
      rangesToDelete.current();
      var startingIdx2 = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];
      if (str[startingIdx2 - 1] && (opts.trimOnlySpaces && str[startingIdx2 - 1] === " " || !opts.trimOnlySpaces && !str[startingIdx2 - 1].trim())) {
        startingIdx2 -= 1;
      }
      var backupWhatToAdd = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];
      rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [startingIdx2, rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1]];
      if (backupWhatToAdd && backupWhatToAdd.trim()) {
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(backupWhatToAdd.trimEnd());
      }
    }
  }
  var res = {
    log: {
      timeTakenInMilliseconds: Date.now() - start
    },
    result: rangesApply__default['default'](str, rangesToDelete.current()),
    ranges: rangesToDelete.current(),
    allTagLocations: allTagLocations,
    filteredTagLocations: filteredTagLocations
  };
  return res;
}

module.exports = stripHtml;
