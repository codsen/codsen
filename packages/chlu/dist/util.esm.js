import cmp from 'semver-compare';
import clone from 'lodash.clonedeep';
import isNum from 'is-natural-number';
import trim from 'lodash.trim';
import easyReplace from 'easy-replace';
import emojiRegexLib from 'emoji-regex';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var emojiRegex = emojiRegexLib();

// REGEXES
// -----------------------------------------------------------------------------

var versionWithBracketsRegex = /\[v?\d+\.\d+(\.\d+)*\]/g;
var versionWithoutBracketsRegex = /v?\d+\.\d+(\.\d+)*/g;
var versionWithoutBracketsRegexNoVersion = /\d+\.\d+(\.\d+)*/g;

// FUNCTIONS
// -----------------------------------------------------------------------------

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function isArr(something) {
  return Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
function aContainsB(a, b) {
  if (!truthy(a) || !truthy(b)) {
    return false;
  }
  return a.indexOf(b) >= 0;
}

function isFooterLink(str) {
  if (str === undefined) {
    return false;
  } else if (!isStr(str)) {
    throw new TypeError("chlu/util.js/isFooterLink(): [THROW_ID_02] The input must be string");
  }
  return str.length > 0 && existy(str.match(versionWithBracketsRegex)) && aContainsB(str, "]:");
}

// Is current string (line as input one-by-one) a title?
// For example, "## [1.2.0] - 2017-04-24" is.
// For example, "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0" is not
function isTitle(str) {
  if (str === undefined) {
    return false;
  } else if (!isStr(str)) {
    throw new TypeError("chlu/util.js/isTitle(): [THROW_ID_01] The input must be string");
  }
  var stringInFrontOfVersion = void 0;
  if (existy(str.match(versionWithoutBracketsRegex))) {
    stringInFrontOfVersion = str.split(str.match(versionWithoutBracketsRegex)[0]);
    if (stringInFrontOfVersion === null) {
      stringInFrontOfVersion = "";
    } else {
      stringInFrontOfVersion = stringInFrontOfVersion[0];
    }
  }
  return str.length > 0 && existy(str.match(versionWithoutBracketsRegex)) && !str.includes("http") && !str.includes("]:") && trim(stringInFrontOfVersion, "[# \t") === "" && str.includes("#");
}

function getTitlesAndFooterLinks(linesArr) {
  var titles = [];
  var footerLinks = [];
  var i = void 0;
  var len = void 0;
  var temp = void 0;

  for (i = 0, len = linesArr.length; i < len; i++) {
    if (isTitle(linesArr[i])) {
      var firstEncounteredVersion = linesArr[i].match(versionWithoutBracketsRegexNoVersion)[0];
      titles.push({
        version: firstEncounteredVersion,
        rowNum: i,
        linked: existy(linesArr[i].match(versionWithBracketsRegex)),
        content: linesArr[i],
        beforeVersion: linesArr[i].split(firstEncounteredVersion)[0],
        afterVersion: linesArr[i].split(firstEncounteredVersion)[1]
      });
    } else if (isFooterLink(linesArr[i])) {
      temp = linesArr[i].match(versionWithBracketsRegex)[0];
      footerLinks.push({
        version: temp.substring(1, temp.length - 1),
        rowNum: i,
        content: linesArr[i]
      });
    }
  }
  return {
    titles: titles,
    footerLinks: footerLinks
  };
}

function getPreviousVersion(currVers, originalVersionsArr) {
  if (arguments.length < 2) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_03] There must be two arguments, string and an array.");
  }
  if (!isStr(currVers)) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_04] The first argument must be string. Currently it's " + (typeof currVers === "undefined" ? "undefined" : _typeof(currVers)));
  }
  if (!isArr(originalVersionsArr)) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_05] The second argument must be an array. Currently it's " + (typeof originalVersionsArr === "undefined" ? "undefined" : _typeof(originalVersionsArr)) + " equal to:\nJSON.stringify(originalVersionsArr, null, 4)");
  }
  var versionsArr = clone(originalVersionsArr).sort(cmp);
  // first, check if it's the first version from the versions array.
  // in that case, there's no previous version, so we return null:
  if (currVers === versionsArr[0]) {
    return null;
  }
  // next, iterate versions array and try to get the previous version:
  for (var i = 0, len = versionsArr.length; i < len; i++) {
    if (versionsArr[i] === currVers && existy(versionsArr[i - 1])) {
      return versionsArr[i - 1];
    }
  }
  // if nothing was found yet, throw:
  throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_06] The given version (" + currVers + ") is not in the versions array (" + JSON.stringify(versionsArr, null, 4) + ")");
}

function setRow(rowsArray, index, content) {
  var res = clone(rowsArray);
  for (var i = 0, len = res.length; i < len; i++) {
    if (i === index) {
      res[i] = content;
    }
  }
  return res;
}

function getRow(rowsArray, index) {
  if (!existy(index) || !isNum(index)) {
    throw new TypeError("chlu/util.js/getRow(): [THROW_ID_07]: first input arg must be a natural number. Currently it's given as: " + (typeof index === "undefined" ? "undefined" : _typeof(index)) + " and equal: " + JSON.stringify(index, null, 4));
  }
  if (!existy(rowsArray) || !isArr(rowsArray)) {
    throw new TypeError("chlu/util.js/getRow(): [THROW_ID_08]: second input arg must be an rowsArrayay. Currently it's given as: " + (typeof rowsArray === "undefined" ? "undefined" : _typeof(rowsArray)) + " and equal: " + JSON.stringify(rowsArray, null, 4));
  }
  for (var i = 0, len = rowsArray.length; i < len; i++) {
    if (i === index) {
      return rowsArray[i];
    }
  }
  return null;
}

// gets and sets various pieces in strings of the format:
// "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
function getSetFooterLink(str, o) {
  var mode = void 0;
  if (existy(o)) {
    mode = "set";
  } else {
    mode = "get";
    o = {};
  }
  if (typeof str !== "string" || !str.includes("/")) {
    return null;
  }
  var split = str.split("/");
  var res = {};

  for (var i = 0, len = split.length; i < len; i++) {
    if (split[i] === "github.com") {
      res.user = existy(o.user) ? o.user : split[i + 1];
      res.project = existy(o.project) ? o.project : split[i + 2];
    } else if (split[i] === "compare") {
      if (split[i + 1].includes("...")) {
        var splitVersions = split[i + 1].split("...");
        res.versBefore = existy(o.versBefore) ? o.versBefore : trim(splitVersions[0], "v");
        res.versAfter = existy(o.versAfter) ? o.versAfter : trim(splitVersions[1], "v");
      } else {
        // incurance against broken compare links:
        return null;
      }
    } else if (i === 0) {
      res.version = existy(o.version) ? o.version : split[i].match(versionWithoutBracketsRegex)[0];
    }
  }
  if (mode === "get") {
    return res;
  }
  return "[" + res.version + "]: https://github.com/" + res.user + "/" + res.project + "/compare/v" + res.versBefore + "...v" + res.versAfter;
}

function versionSort(a, b) {
  return cmp(a.version, b.version);
}

function filterDate(someString) {
  var res = someString.trim();
  res = easyReplace(res, {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "[",
    searchFor: "YANKED",
    rightMaybe: "]",
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      searchFor: true
    }
  });
  res = res.replace(".", " ");
  res = res.replace(",", " ");
  res = res.replace(";", " ");
  res = res.replace(emojiRegex, "");
  res = res.replace(/[ ]+/g, " ");
  res = trim(res, "[](),.-/\\ \u2013\u2014\t\xA0");
  return res;
}

export { isTitle, isFooterLink, versionWithBracketsRegex, versionWithoutBracketsRegex, getPreviousVersion, getRow, setRow, getTitlesAndFooterLinks, getSetFooterLink, aContainsB, versionSort, filterDate };
