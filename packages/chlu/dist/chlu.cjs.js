'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var serverCompare = _interopDefault(require('semver-compare'));
var clone = _interopDefault(require('lodash.clonedeep'));
var isNum = _interopDefault(require('is-natural-number'));
var trim = _interopDefault(require('lodash.trim'));
var easyReplace = _interopDefault(require('easy-replace'));
var emojiRegexLib = _interopDefault(require('emoji-regex'));
var reverse = _interopDefault(require('lodash.reverse'));
var splitLines = _interopDefault(require('split-lines'));
var getPkgRepo = _interopDefault(require('get-pkg-repo'));
var empty = _interopDefault(require('ast-contains-only-empty-space'));
var insert = _interopDefault(require('just-insert'));
var includes = _interopDefault(require('lodash.includes'));
var min = _interopDefault(require('lodash.min'));
var dd = _interopDefault(require('dehumanize-date'));

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
  var versionsArr = clone(originalVersionsArr).sort(serverCompare);
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
  return serverCompare(a.version, b.version);
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

/* eslint prefer-destructuring:0, no-loop-func:0, no-plusplus:0, consistent-return:0 */

// F'S
// -----------------------------------------------------------------------------

function existy$1(x) {
  return x != null;
}

// ACTION
// -----------------------------------------------------------------------------

function chlu(changelogContents, packageJsonContents) {
  if (arguments.length === 0 || !existy$1(changelogContents)) {
    return;
  }

  var changelogMd = changelogContents;

  // TODO - add measures against wrong/missing json
  var packageJson = getPkgRepo(packageJsonContents);

  if (packageJson.type !== "github") {
    throw new Error("chlu/chlu(): [THROW_ID_01] Package JSON shows the library is not GitHub-based, but based on " + packageJson.type);
  }

  var temp = void 0;
  var titles = [];
  var footerLinks = [];
  var newLinesArr = [];

  // ACTION
  // -----------------------------------------------------------------------------

  // =======
  // stage 1: iterate through all lines and:
  // - record all titles, like:
  //   "## [1.2.0] - 2017-04-24"
  // - record all url links at the bottom, like:
  //   "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0"
  var linesArr = splitLines(changelogMd);

  var titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  // console.log('titlesAndFooterLinks = ' + JSON.stringify(titlesAndFooterLinks, null, 4))

  // =======
  // stage 2: remove any invalid footer links

  for (var i = 0, len = footerLinks.length; i < len; i++) {
    if (!existy$1(getSetFooterLink(footerLinks[i].content))) {
      linesArr.splice(footerLinks[i].rowNum, 1);
    }
  }

  // recalculate:
  titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;

  // =======
  // stage 3: get the ordered array of all title versions

  var sortedTitlesArray = titles.map(function (el) {
    return el.version;
  }).sort(serverCompare);

  // =======
  // stage 4: find unused footer links

  var unusedFooterLinks = footerLinks.filter(function (link) {
    return !includes(titles.map(function (title) {
      return title.version;
    }), link.version);
  });

  while (unusedFooterLinks.length > 0) {
    linesArr.splice(unusedFooterLinks[0].rowNum, 1);
    footerLinks = getTitlesAndFooterLinks(linesArr).footerLinks;
    unusedFooterLinks = footerLinks.filter(function (link) {
      return !includes(titles.map(function (title) {
        return title.version;
      }), link.version);
    });
  }

  // =======
  // stage 5: create footer links for all titles except the smallest version-one

  var missingFooterLinks = [];

  var _loop = function _loop(_i, _len) {
    if (_len > 1 && titles[_i].version !== sortedTitlesArray[0]) {
      var linkFound = footerLinks.some(function (el) {
        return titles[_i].version === el.version;
      });
      if (!linkFound) {
        missingFooterLinks.push(titles[_i]);
      }
    }
  };

  for (var _i = 0, _len = titles.length; _i < _len; _i++) {
    _loop(_i, _len);
  }

  // =======
  // stage 6: find out what is the order of footer links

  var ascendingFooterLinkCount = 0;
  var descendingFooterLinkCount = 0;

  if (footerLinks.length > 1) {
    for (var _i2 = 0, _len2 = footerLinks.length; _i2 < _len2 - 1; _i2++) {
      if (serverCompare(footerLinks[_i2].version, footerLinks[_i2 + 1].version) === 1) {
        descendingFooterLinkCount++;
      } else {
        ascendingFooterLinkCount++;
      }
    }
  }

  var ascending = true;
  if (ascendingFooterLinkCount <= descendingFooterLinkCount) {
    ascending = false;
  }

  // =======
  // stage 7: calculate what goes where

  var whereToPlaceIt = void 0;
  // calculate the Where
  if (footerLinks.length === 0) {
    // count from the end of the file.
    // if last non-empty line has "]:" in it, place right after it.
    // otherwise, insert an empty line. This means there's content only and no links yet.
    for (var _i3 = linesArr.length - 1, start = 0; _i3 >= start; _i3--) {
      if (existy$1(linesArr[_i3]) && !empty(linesArr[_i3])) {
        whereToPlaceIt = _i3 + 2;
        break;
      }
    }
  } else {
    whereToPlaceIt = footerLinks[0].rowNum;
  }

  // =======
  // stage 8: assemble the new chunk - array of new lines

  temp = [];
  missingFooterLinks.forEach(function (key) {
    temp.push("[" + key.version + "]: https://github.com/" + packageJson.user + "/" + packageJson.project + "/compare/v" + getPreviousVersion(key.version, sortedTitlesArray) + "...v" + key.version);
  });
  if (ascending) {
    temp = reverse(temp);
  }

  // =======
  // stage 9: insert new rows into linesArr

  newLinesArr = insert(linesArr, temp, whereToPlaceIt);

  // =======
  // stage 10: prepare for checking are footerLinks correct.
  // calculate title and footerLinks again, this time, including our additions

  temp = getTitlesAndFooterLinks(newLinesArr);
  titles = temp.titles;
  footerLinks = temp.footerLinks;

  for (var _i4 = 0, _len3 = footerLinks.length; _i4 < _len3; _i4++) {
    var extracted = getSetFooterLink(footerLinks[_i4].content);
    if (extracted.versAfter !== extracted.version || extracted.versAfter !== footerLinks[_i4].version) {
      footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
        versAfter: extracted.version
      });
    }
    // versBefore can't be lesser than the version of the previous title
    if (existy$1(getPreviousVersion(footerLinks[_i4].version, sortedTitlesArray)) && serverCompare(extracted.versBefore, getPreviousVersion(footerLinks[_i4].version, sortedTitlesArray)) < 0) {
      footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
        versBefore: getPreviousVersion(extracted.version, sortedTitlesArray)
      });
    }
    if (extracted.user !== packageJson.user) {
      footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
        user: packageJson.user
      });
    }
    if (extracted.project !== packageJson.project) {
      footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
        project: packageJson.project
      });
    }
    // write over:
    newLinesArr = setRow(newLinesArr, footerLinks[_i4].rowNum, footerLinks[_i4].content);
  }

  // ========
  // stage 11: sort all footer links, depending on a current preference

  temp = clone(footerLinks).sort(versionSort);
  if (!ascending) {
    temp = temp.reverse();
  }

  footerLinks.forEach(function (footerLink, index) {
    newLinesArr = setRow(newLinesArr, footerLink.rowNum, temp[index].content);
  });

  // ========
  // stage 12: delete empty rows between footer links:

  var firstRowWithFooterLink = min(footerLinks.map(function (link) {
    return link.rowNum;
  }));
  for (var _i5 = firstRowWithFooterLink + 1, _len4 = newLinesArr.length; _i5 < _len4; _i5++) {
    if (newLinesArr[_i5] === "" || newLinesArr[_i5] !== undefined && newLinesArr[_i5].trim() === "") {
      newLinesArr.splice(_i5, 1);
      _i5--;
    }
  }

  // ========
  // stage 13: add trailing empty line if it's missing:

  if (newLinesArr[newLinesArr.length - 1] !== "") {
    newLinesArr.push("");
  }

  // ========
  // stage 14: add any missing line break before footer links

  titlesAndFooterLinks = getTitlesAndFooterLinks(newLinesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;

  if (existy$1(footerLinks) && footerLinks.length > 0 && !empty(getRow(newLinesArr, footerLinks[0].rowNum - 1))) {
    newLinesArr.splice(footerLinks[0].rowNum, 0, "");
  }

  // ========
  // stage 15: normalise titles

  var gitStuffReadyYet = false;

  if (gitStuffReadyYet) ; else {
    titles.forEach(function (title) {
      var fixedDate = dd(filterDate(title.afterVersion));

      if (fixedDate !== null) {
        newLinesArr = setRow(newLinesArr, title.rowNum, "## " + (title.version !== sortedTitlesArray[0] ? "[" : "") + title.version + (title.version !== sortedTitlesArray[0] ? "]" : "") + " - " + fixedDate);
      } else {
        // if date is unrecogniseable leave it alone, fix the rest of the title
        newLinesArr = setRow(newLinesArr, title.rowNum, "## " + (title.version !== sortedTitlesArray[0] ? "[" : "") + title.version + (title.version !== sortedTitlesArray[0] ? "]" : "") + " - " + filterDate(title.afterVersion));
      }
    });
  }

  return newLinesArr.join("\n");
}

module.exports = chlu;
