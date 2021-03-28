/**
 * html-img-alt
 * Adds missing alt attributes to img tags. Non-parsing.
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-img-alt/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringUnfancy = require('string-unfancy');
var rangesApply = require('ranges-apply');
var rangesPush = require('ranges-push');
var checkTypesMini = require('check-types-mini');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "2.0.11";

var version = version$1;
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function alts(str, originalOpts) {
  if (typeof str !== "string") {
    throw new TypeError("html-img-alt/alts(): [THROW_ID_01] Input must be string! Currently its type is: " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError("html-img-alt/alts(): [THROW_ID_02] Options object must be a plain object! Currently its type is: " + typeof originalOpts + ", equal to: " + JSON.stringify(originalOpts, null, 4));
  }
  var finalSpaceNeeded;
  var withinImageTag = false;
  var withinQuotes = false;
  var imageTagStartedAt = 0;
  var whitespaceStarted = 0;
  var slashStartedAt = 0;
  var altContentsStart = 0;
  var withinAlt = false;
  var thereShouldBeEqualCharacterHere = 0;
  var thereShouldBeTheFirstDoubleQuoteHere = 0;
  var thereShouldBeTheSecondDoubleQuoteHere = 0;
  var addSpaceInTheFutureBeforeSlashOrBracket = false;
  var altBegins = null;
  var rangesArr = new rangesPush.Ranges();
  var plausibleWithinQuotesRanges = new rangesPush.Ranges();
  var defaults = {
    unfancyTheAltContents: true
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  checkTypesMini.checkTypesMini(opts, defaults, {
    msg: "html-img-alt/alts(): [THROW_ID_03]"
  });
  for (var i = 0, len = str.length; i < len; i++) {
    str[i].charCodeAt(0);
    if ("" + str[i] + str[i + 1] + str[i + 2] + str[i + 3] === "<img") {
      if (!withinImageTag) {
        withinImageTag = true;
        imageTagStartedAt = i;
      } else {
        throw new TypeError("html-img-alt/alts(): [THROW_ID_02] Something is wrong with the code - there's an image tag within an image tag. First image tag was: " + str.slice(imageTagStartedAt - 20, imageTagStartedAt + 20) + ", then before it was closed, we've got this: " + str.slice(i - 20, i + 20));
      }
    }
    if (withinImageTag && str[i] === "/") {
      slashStartedAt = i;
    }
    if (withinImageTag && !withinQuotes) {
      if ("" + str[i] + str[i + 1] + str[i + 2] === "alt") {
        altBegins = i;
      } else if ("" + str[i - 3] + str[i - 2] + str[i - 1] === "alt") {
        withinAlt = true;
      }
    }
    if (withinAlt && str[i].trim() !== "" && str[i] !== "=" && str[i] !== '"') {
      withinAlt = false;
    }
    if (altBegins && i === altBegins + 3) {
      thereShouldBeEqualCharacterHere = i;
    }
    if (str[i] === "=") {
      if (altBegins) {
        thereShouldBeEqualCharacterHere = 0;
        thereShouldBeTheFirstDoubleQuoteHere = i + 1;
      }
      if (plausibleWithinQuotesRanges.current() && plausibleWithinQuotesRanges.current().length) {
        plausibleWithinQuotesRanges.wipe();
      }
      if (withinQuotes && str[i + 1] === '"') {
        withinQuotes = false;
        altContentsStart = 0;
      }
    }
    if (whitespaceStarted && str[i].trim() !== "") {
      if (whitespaceStarted < i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0)) {
        if (!withinQuotes) {
          rangesArr.add(whitespaceStarted, i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0));
        } else {
          plausibleWithinQuotesRanges.add(whitespaceStarted, i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0));
        }
        if (str[i] === ">" || str[i] === "/") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
        }
        if (thereShouldBeEqualCharacterHere && str[i] !== "=" && i >= thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere && str[i] !== '"' && i >= thereShouldBeTheFirstDoubleQuoteHere) {
          var missingTrailingSpace = "";
          var location = thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere;
          var thingToAdd = "";
          if (thereShouldBeEqualCharacterHere) {
            thingToAdd += "=";
          }
          if (!withinQuotes) {
            rangesArr.add(location, location, thingToAdd + "\"\"" + missingTrailingSpace);
          }
          thereShouldBeEqualCharacterHere = 0;
          thereShouldBeTheFirstDoubleQuoteHere = 0;
        }
      }
      whitespaceStarted = 0;
    }
    if (str[i] === '"') {
      withinQuotes = !withinQuotes;
      if (i === thereShouldBeTheFirstDoubleQuoteHere) {
        thereShouldBeTheSecondDoubleQuoteHere = i + 1;
      }
    }
    if (str[i] === '"') {
      if (thereShouldBeTheFirstDoubleQuoteHere && i >= thereShouldBeTheFirstDoubleQuoteHere) {
        thereShouldBeTheSecondDoubleQuoteHere = thereShouldBeTheFirstDoubleQuoteHere;
        thereShouldBeTheFirstDoubleQuoteHere = 0;
        if (withinAlt) {
          altContentsStart = i + 1;
          withinAlt = false;
        }
        if (str[i + 1].trim() === "/" || str[i + 1].trim() === ">") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
          finalSpaceNeeded = false;
        }
      } else if (thereShouldBeTheSecondDoubleQuoteHere && i >= thereShouldBeTheSecondDoubleQuoteHere) {
        plausibleWithinQuotesRanges.wipe();
        thereShouldBeTheSecondDoubleQuoteHere = 0;
        if (str[i + 1] === ">" || str[i + 1] === "/") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
          finalSpaceNeeded = false;
        }
        if (altContentsStart && opts.unfancyTheAltContents) {
          var altContents = str.slice(altContentsStart, i);
          if (stringUnfancy.unfancy(altContents).trim() !== altContents) {
            rangesArr.add(altContentsStart, i, stringUnfancy.unfancy(altContents).trim());
          }
        }
        altContentsStart = 0;
      }
    }
    if (withinImageTag && !withinQuotes && str[i] === "'") {
      rangesArr.add(i, i + 1);
      if (str[i + 1] === "/" || str[i + 1] === ">") {
        addSpaceInTheFutureBeforeSlashOrBracket = true;
      }
    }
    if (withinImageTag && str[i] === ">") {
      imageTagStartedAt = 0;
      withinQuotes = false;
      if (altBegins === null) {
        if (slashStartedAt) {
          rangesArr.add(slashStartedAt, slashStartedAt, ' alt="" ');
        } else {
          rangesArr.add(i, i, ' alt="" ');
        }
        finalSpaceNeeded = false;
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      }
      if (!slashStartedAt && thereShouldBeEqualCharacterHere === i) {
        rangesArr.add(i, i, '="" ');
        finalSpaceNeeded = false;
      } else if (slashStartedAt && thereShouldBeEqualCharacterHere === i - 1) {
        rangesArr.add(i - 1, i - 1, '="" ');
        finalSpaceNeeded = false;
      }
      if (!slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && thereShouldBeTheFirstDoubleQuoteHere <= i) {
        rangesArr.add(i, i, '"" ');
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      } else if (slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && thereShouldBeTheFirstDoubleQuoteHere <= i) {
        rangesArr.add(i - 1, i - 1, '"" ');
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      } else if (!slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && thereShouldBeTheSecondDoubleQuoteHere <= i) {
        rangesArr.add(i, i, '"');
        addSpaceInTheFutureBeforeSlashOrBracket = true;
        if (plausibleWithinQuotesRanges.current()) {
          plausibleWithinQuotesRanges.current().forEach(function (key) {
            rangesArr.add(key[0], key[1], key[2]);
          });
        }
        rangesArr.current();
        plausibleWithinQuotesRanges.wipe();
      } else if (slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && thereShouldBeTheSecondDoubleQuoteHere <= i) {
        rangesArr.add(thereShouldBeTheSecondDoubleQuoteHere + 1, thereShouldBeTheSecondDoubleQuoteHere + 1, '"');
        if (plausibleWithinQuotesRanges.current()) {
          plausibleWithinQuotesRanges.current().forEach(function (key) {
            rangesArr.add(key[0], key[1], key[2]);
          });
        }
        plausibleWithinQuotesRanges.wipe();
        rangesArr.current();
      }
      if (finalSpaceNeeded || addSpaceInTheFutureBeforeSlashOrBracket) {
        if (slashStartedAt) {
          rangesArr.add(slashStartedAt, slashStartedAt, " ");
        } else {
          rangesArr.add(i, i, " ");
        }
      }
      withinImageTag = false;
      altBegins = null;
      thereShouldBeTheFirstDoubleQuoteHere = 0;
      thereShouldBeTheSecondDoubleQuoteHere = 0;
      finalSpaceNeeded = false;
    }
    if (slashStartedAt && str[i] !== "/" && str[i].trim() !== "") {
      slashStartedAt = 0;
      thereShouldBeEqualCharacterHere = 0;
      thereShouldBeTheFirstDoubleQuoteHere = 0;
      thereShouldBeTheSecondDoubleQuoteHere = 0;
    }
    if (withinImageTag && str[i].trim() === "" && !whitespaceStarted) {
      whitespaceStarted = i;
    }
  }
  if (rangesArr.current() && rangesArr.current().length > 0) {
    return rangesApply.rApply(str, rangesArr.current());
  }
  return str;
}

exports.alts = alts;
exports.version = version;
