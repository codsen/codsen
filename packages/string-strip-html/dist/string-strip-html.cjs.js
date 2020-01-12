/**
 * string-strip-html
 * Strips HTML tags from strings. Detects legit unencoded brackets.
 * Version: 4.3.14
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

function stripHtml(str, originalOpts) {
  var isArr = Array.isArray;
  var definitelyTagNames = ["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];
  var singleLetterTags = ["a", "b", "i", "p", "q", "s", "u"];
  var punctuation = [".", ",", "?", ";", ")", "\u2026", '"', "\xBB"];
  var stripTogetherWithTheirContentsDefaults = ["script", "style", "xml"];
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
  function isValidAttributeCharacter(_char) {
    if (_char.charCodeAt(0) >= 0 && _char.charCodeAt(0) <= 31) {
      return false;
    } else if (_char.charCodeAt(0) >= 127 && _char.charCodeAt(0) <= 159) {
      return false;
    } else if (_char.charCodeAt(0) === 32) {
      return false;
    } else if (_char.charCodeAt(0) === 34) {
      return false;
    } else if (_char.charCodeAt(0) === 39) {
      return false;
    } else if (_char.charCodeAt(0) === 62) {
      return false;
    } else if (_char.charCodeAt(0) === 47) {
      return false;
    } else if (_char.charCodeAt(0) === 61) {
      return false;
    } else if (
    _char.charCodeAt(0) >= 64976 && _char.charCodeAt(0) <= 65007 ||
    _char.charCodeAt(0) === 65534 ||
    _char.charCodeAt(0) === 65535 ||
    _char.charCodeAt(0) === 55359 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55359 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55423 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55423 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55487 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55487 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55551 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55551 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55615 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55615 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55679 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55679 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55743 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55743 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55807 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55807 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55871 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55871 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55935 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55935 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 55999 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 55999 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 56063 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 56063 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 56127 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 56127 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 56191 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 56191 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 56255 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 56255 && _char.charCodeAt(1) === 57343 ||
    _char.charCodeAt(0) === 56319 && _char.charCodeAt(1) === 57342 ||
    _char.charCodeAt(0) === 56319 && _char.charCodeAt(1) === 57343
    ) {
        return false;
      }
    return true;
  }
  function treatRangedTags(i) {
    if (opts.stripTogetherWithTheirContents.includes(tag.name)) {
      if (isArr(rangedOpeningTags) && rangedOpeningTags.some(function (obj) {
        return obj.name === tag.name && obj.lastClosingBracketAt < i;
      })) {
        for (var y = rangedOpeningTags.length; y--;) {
          if (rangedOpeningTags[y].name === tag.name) {
            if (punctuation.includes(str[i])) {
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
  function calculateWhitespaceToInsert(str,
  currCharIdx,
  fromIdx,
  toIdx,
  lastOpeningBracketAt,
  lastClosingBracketAt
  ) {
    var strToEvaluateForLineBreaks = "";
    if (fromIdx < lastOpeningBracketAt) {
      strToEvaluateForLineBreaks += str.slice(fromIdx, lastOpeningBracketAt);
    }
    if (toIdx > lastClosingBracketAt + 1) {
      var temp = str.slice(lastClosingBracketAt + 1, toIdx);
      if (temp.includes("\n") && str[toIdx] === "<") {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
    }
    if (!punctuation.includes(str[currCharIdx]) &&
    str[currCharIdx] !== "!"
    ) {
        var foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
        if (isArr(foundLineBreaks) && foundLineBreaks.length) {
          if (foundLineBreaks.length === 1) {
            return "\n";
          } else if (foundLineBreaks.length === 2) {
            return "\n\n";
          }
          return "\n\n\n";
        }
        return " ";
      }
    return "";
  }
  function calculateHrefToBeInserted() {
    if (opts.dumpLinkHrefsNearby.enabled && Object.keys(hrefDump).length && hrefDump.tagName === tag.name && tag.lastOpeningBracketAt && (hrefDump.openingTagEnds && tag.lastOpeningBracketAt > hrefDump.openingTagEnds || !hrefDump.openingTagEnds)) {
      hrefInsertionActive = true;
    }
    if (hrefInsertionActive) {
      var lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
      stringToInsertAfter = "".concat(lineBreaks).concat(hrefDump.hrefValue).concat(lineBreaks);
    }
  }
  function characterSuitableForNames(_char2) {
    return /[-_A-Za-z0-9]/.test(_char2);
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
    } else if (isArr(something)) {
      return something.filter(function (val) {
        return isStr(val) && val.trim().length > 0;
      });
    } else if (isStr(something)) {
      if (something.length) {
        return [something];
      }
      return [];
    } else if (!isArr(something)) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] ".concat(name, " must be array containing zero or more strings or something falsey. Currently it's equal to: ").concat(something, ", that a type of ").concat(_typeof(something), "."));
    }
  }
  function isStr(something) {
    return typeof something === "string";
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
    stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults,
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
  var opts = Object.assign({}, defaults, originalOpts);
  opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
  opts.onlyStripTags = prepHopefullyAnArray(opts.onlyStripTags, "opts.onlyStripTags");
  var onlyStripTagsMode = !!opts.onlyStripTags.length;
  if (opts.onlyStripTags.length && opts.ignoreTags.length) {
    opts.onlyStripTags = without.apply(void 0, [opts.onlyStripTags].concat(_toConsumableArray(opts.ignoreTags)));
  }
  if (!isObj(opts.dumpLinkHrefsNearby)) {
    opts.dumpLinkHrefsNearby = Object.assign({}, defaults.dumpLinkHrefsNearby);
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
      opts.dumpLinkHrefsNearby = Object.assign({}, defaults.dumpLinkHrefsNearby, originalOpts.dumpLinkHrefsNearby);
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
    opts.dumpLinkHrefsNearby = Object.assign({}, defaults.dumpLinkHrefsNearby);
  }
  if (!isArr(opts.stripTogetherWithTheirContents)) {
    opts.stripTogetherWithTheirContents = [];
  }
  var somethingCaught = {};
  if (opts.stripTogetherWithTheirContents && isArr(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length > 0 && !opts.stripTogetherWithTheirContents.every(function (el, i) {
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
              definitelyTagNames.some(function (val) {
                return trim(culprit.trim().split(" ").filter(function (val) {
                  return val.trim().length !== 0;
                }).filter(function (val, i) {
                  return i === 0;
                }), "/>").toLowerCase() === val;
              }) && stripHtml("<".concat(culprit.trim(), ">"), opts) === "") {
                var whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, startingPoint, i + 1, startingPoint, i + 1);
                var deleteUpTo = i + 1;
                if (str[deleteUpTo] !== undefined && str[deleteUpTo].trim().length === 0) {
                  for (var z = deleteUpTo; z < len; z++) {
                    if (str[z].trim().length !== 0) {
                      deleteUpTo = z;
                      break;
                    }
                    if (str[z + 1] === undefined) {
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
    if (str[i] === "/" && !(tag.quotes && tag.quotes.value) && tag.lastOpeningBracketAt !== undefined && tag.lastClosingBracketAt === undefined) {
      tag.slashPresent = i;
    }
    if (tag.nameStarts && tag.nameStarts < i && !tag.quotes && punctuation.includes(str[i]) && !attrObj.equalsAt && tag.attributes && tag.attributes.length === 0 && !tag.lastClosingBracketAt
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
        if (opts.dumpLinkHrefsNearby.enabled && tag.attributes.some(function (obj) {
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
    if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (str[i].trim().length === 0 || !characterSuitableForNames(str[i]))) {
      tag.nameEnds = i;
      tag.name = str.slice(tag.nameStarts, tag.nameEnds + (str[i] !== ">" && str[i] !== "/" && str[i + 1] === undefined ? 1 : 0));
      if (str[tag.nameStarts - 1] !== "!" &&
      tag.name.replace(/-/g, "").length === 0) {
        tag = {};
        continue;
      }
      if (str[i] === "<") {
        calculateHrefToBeInserted();
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
        treatRangedTags(i);
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
    if (!tag.quotes && attrObj.nameStarts && attrObj.nameEnds && !attrObj.valueStarts && str[i].trim().length !== 0 && str[i] !== "=") {
      tag.attributes.push(attrObj);
      attrObj = {};
    }
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      if (str[i].trim().length === 0) {
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
    if (!tag.quotes && tag.nameEnds < i && str[i] !== ">" && str[i] !== "/" && str[i] !== "!" && str[i - 1].trim().length === 0 && str[i].trim().length !== 0 && !attrObj.nameStarts && !tag.lastClosingBracketAt) {
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
          if ((str[i].trim().length === 0 || str[i] === "<") && !tag.slashPresent) {
            tag.onlyPlausible = true;
          } else {
            tag.onlyPlausible = false;
          }
        }
        if (str[i].trim().length !== 0 && tag.nameStarts === undefined && str[i] !== "<" && str[i] !== "/" && str[i] !== ">" && str[i] !== "!") {
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
          if (opts.ignoreTags.includes(tag.name) || tag.onlyPlausible && !definitelyTagNames.includes(tag.name)) {
            tag = {};
            attrObj = {};
            continue;
          }
          if (definitelyTagNames.concat(singleLetterTags).includes(tag.name) && (tag.onlyPlausible === false || tag.onlyPlausible === true && tag.attributes.length) || str[i + 1] === undefined) {
            calculateHrefToBeInserted();
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
            treatRangedTags(i);
          }
        }
      } else if (i > tag.lastClosingBracketAt && str[i].trim().length !== 0 || str[i + 1] === undefined) {
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
        tag.attributes.length === 0 && tag.name && definitelyTagNames.concat(singleLetterTags).includes(tag.name.toLowerCase()) ||
        tag.attributes && tag.attributes.some(function (attrObj) {
          return attrObj.equalsAt;
        })) {
          var _whiteSpaceCompensation2 = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, endingRangeIndex, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);
          stringToInsertAfter = "";
          hrefInsertionActive = false;
          calculateHrefToBeInserted();
          var insert = void 0;
          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = "".concat(_whiteSpaceCompensation2).concat(stringToInsertAfter).concat(_whiteSpaceCompensation2 === "\n\n" ? "\n" : _whiteSpaceCompensation2);
          } else {
            insert = _whiteSpaceCompensation2;
          }
          if (tag.leftOuterWhitespace === 0 || !stringLeftRight.right(str, endingRangeIndex - 1)) {
            insert = "";
          }
          if (insert && insert.length > 1 && !insert.trim().length && !insert.includes("\n") && !insert.includes("\r")) {
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
          treatRangedTags(i);
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
            treatRangedTags(i);
            tag = {};
            attrObj = {};
          } else if (tag.onlyPlausible && !definitelyTagNames.concat(singleLetterTags).includes(tag.name) && !(tag.attributes && tag.attributes.length)) {
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
            var closingFoundAt = undefined;
            for (var _y = i; _y < len; _y++) {
              if (!closingFoundAt && cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "]]>" || !cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "-->") {
                closingFoundAt = _y;
              }
              if (closingFoundAt && (closingFoundAt < _y && str[_y].trim().length !== 0 || str[_y + 1] === undefined)) {
                var rangeEnd = _y;
                if (str[_y + 1] === undefined && str[_y].trim().length === 0 || str[_y] === ">") {
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
        !rangedOpeningTags.some(function (rangedTagObj) {
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
  } else if (opts.returnRangesOnly) {
    return [];
  }
  if (opts.trimOnlySpaces) {
    return trim(str, " ");
  }
  return str.trim();
}

module.exports = stripHtml;
