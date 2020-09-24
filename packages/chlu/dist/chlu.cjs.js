/**
 * chlu
 * CH-ange-L-og U-pdate - Automatically fix errors in your changelog file
 * Version: 3.7.74
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/chlu/
 */

'use strict';

var getPkgRepo = require('get-pkg-repo');
var semverCompare = require('semver-compare');
var empty = require('ast-contains-only-empty-space');
var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');
var min = require('lodash.min');
var dd = require('dehumanize-date');
var trim = require('lodash.trim');
var easyReplace = require('easy-replace');
var emojiRegexLib = require('emoji-regex');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var getPkgRepo__default = /*#__PURE__*/_interopDefaultLegacy(getPkgRepo);
var semverCompare__default = /*#__PURE__*/_interopDefaultLegacy(semverCompare);
var empty__default = /*#__PURE__*/_interopDefaultLegacy(empty);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var min__default = /*#__PURE__*/_interopDefaultLegacy(min);
var dd__default = /*#__PURE__*/_interopDefaultLegacy(dd);
var trim__default = /*#__PURE__*/_interopDefaultLegacy(trim);
var easyReplace__default = /*#__PURE__*/_interopDefaultLegacy(easyReplace);
var emojiRegexLib__default = /*#__PURE__*/_interopDefaultLegacy(emojiRegexLib);

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

var emojiRegex = emojiRegexLib__default['default']();
var versionWithBracketsRegex = /\[v?\d+\.\d+(\.\d+)*\]/g;
var versionWithoutBracketsRegex = /v?\d+\.\d+(\.\d+)*/g;
var versionWithoutBracketsRegexNoVersion = /\d+\.\d+(\.\d+)*/g;
function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
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
var isArr = Array.isArray;
function isFooterLink(str) {
  if (str === undefined) {
    return false;
  }
  if (!isStr(str)) {
    throw new TypeError("chlu/util.js/isFooterLink(): [THROW_ID_02] The input must be string");
  }
  return str.length > 0 && existy(str.match(versionWithBracketsRegex)) && aContainsB(str, "]:");
}
function isTitle(str) {
  if (str === undefined) {
    return false;
  }
  if (!isStr(str)) {
    throw new TypeError("chlu/util.js/isTitle(): [THROW_ID_01] The input must be string - it was given as ".concat(JSON.stringify(str, null, 4), " (").concat(_typeof(str), ")"));
  }
  var stringInFrontOfVersion;
  if (existy(str.match(versionWithoutBracketsRegex))) {
    stringInFrontOfVersion = str.split(str.match(versionWithoutBracketsRegex)[0]);
    if (stringInFrontOfVersion === null) {
      stringInFrontOfVersion = "";
    } else {
      stringInFrontOfVersion = stringInFrontOfVersion[0];
    }
  }
  return str.length > 0 && existy(str.match(versionWithoutBracketsRegex)) && !str.includes("http") && !str.includes("]:") && trim__default['default'](stringInFrontOfVersion, "[# \t") === "" && str.includes("#");
}
function getTitlesAndFooterLinks(linesArr) {
  var titles = [];
  var footerLinks = [];
  var i;
  var len;
  var temp;
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
  function prep() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    if (str.startsWith("v")) {
      if (str[1] === ".") {
        return str.slice(2);
      }
      return str.slice(1);
    }
    return str;
  }
  if (arguments.length < 2) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_03] There must be two arguments, string and an array.");
  }
  if (!isStr(currVers)) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_04] The first argument must be string. Currently it's ".concat(_typeof(currVers)));
  } else {
    currVers = prep(currVers);
  }
  if (!isArr(originalVersionsArr)) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_05] The second argument must be an array. Currently it's ".concat(_typeof(originalVersionsArr), " equal to:\nJSON.stringify(originalVersionsArr, null, 4)"));
  }
  var versionsArr = clone__default['default'](originalVersionsArr).map(function (val) {
    return prep(val);
  }).sort(semverCompare__default['default']);
  if (currVers === versionsArr[0]) {
    return null;
  }
  for (var i = 0, len = versionsArr.length; i < len; i++) {
    if (versionsArr[i] === currVers && existy(versionsArr[i - 1])) {
      return versionsArr[i - 1];
    }
  }
  throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_06] The given version (".concat(currVers, ") is not in the versions array (").concat(JSON.stringify(versionsArr, null, 4), ")"));
}
function setRow(rowsArray, index, content) {
  var res = clone__default['default'](rowsArray);
  for (var i = 0, len = res.length; i < len; i++) {
    if (i === index) {
      res[i] = content;
    }
  }
  return res;
}
function getRow(rowsArray, index) {
  if (!existy(index) || !Number.isInteger(index)) {
    throw new TypeError("chlu/util.js/getRow(): [THROW_ID_07]: first input arg must be a natural number. Currently it's given as: ".concat(_typeof(index), " and equal: ").concat(JSON.stringify(index, null, 4)));
  }
  if (!existy(rowsArray) || !isArr(rowsArray)) {
    throw new TypeError("chlu/util.js/getRow(): [THROW_ID_08]: second input arg must be an rowsArrayay. Currently it's given as: ".concat(_typeof(rowsArray), " and equal: ").concat(JSON.stringify(rowsArray, null, 4)));
  }
  for (var i = 0, len = rowsArray.length; i < len; i++) {
    if (i === index) {
      return rowsArray[i];
    }
  }
  return null;
}
function getSetFooterLink(str) {
  var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var mode;
  if (_typeof(o) === "object" && o !== null && typeof o.mode === "string") {
    mode = o.mode;
  } else {
    mode = "get";
  }
  if (typeof str !== "string" || !str.includes("/")) {
    return null;
  }
  var split = str.split("/");
  var res = {};
  if (!o) {
    o = {};
    o.type = "github";
  } else if (!o.type) {
    o.type = "github";
  }
  var currentlyWeHaveLinkOfAType = str.includes("github") ? "github" : "bitbucket";
  for (var i = 0, len = split.length; i < len; i++) {
    if (split[i] === "github.com" || split[i] === "bitbucket.org") {
      res.user = existy(o.user) ? o.user : split[i + 1];
      res.project = existy(o.project) ? o.project : split[i + 2];
    } else if (split[i] === "compare") {
      if (split[i + 1].includes("...")) {
        var splitVersions = trim__default['default'](split[i + 1], "#diff").split("...");
        res.versBefore = existy(o.versBefore) ? o.versBefore : trim__default['default'](currentlyWeHaveLinkOfAType === "github" ? splitVersions[0] : splitVersions[1], "v");
        res.versAfter = existy(o.versAfter) ? o.versAfter : trim__default['default'](currentlyWeHaveLinkOfAType === "github" ? splitVersions[1] : splitVersions[0], "v");
      } else if (split[i + 1].includes("%0D")) {
        var _splitVersions = trim__default['default'](split[i + 1], "#diff").split("%0D");
        res.versBefore = existy(o.versBefore) ? o.versBefore : trim__default['default'](currentlyWeHaveLinkOfAType === "github" ? _splitVersions[0] : _splitVersions[1], "v");
        res.versAfter = existy(o.versAfter) ? o.versAfter : trim__default['default'](currentlyWeHaveLinkOfAType === "github" ? _splitVersions[1] : _splitVersions[0], "v");
      } else {
        return null;
      }
    } else if (i === 0) {
      res.version = existy(o.version) ? o.version : split[i].match(versionWithoutBracketsRegex)[0];
    }
  }
  if (mode === "get") {
    res.type = currentlyWeHaveLinkOfAType;
    return res;
  }
  if (o.type === "github") {
    return "[".concat(res.version, "]: https://github.com/").concat(res.user, "/").concat(res.project, "/compare/v").concat(res.versBefore, "...v").concat(res.versAfter);
  }
  if (o.type === "bitbucket") {
    return "[".concat(res.version, "]: https://bitbucket.org/").concat(res.user, "/").concat(res.project, "/branches/compare/v").concat(res.versAfter, "%0Dv").concat(res.versBefore, "#diff");
  }
}
function versionSort(a, b) {
  return semverCompare__default['default'](a.version, b.version);
}
function filterDate(someString) {
  var res = someString.trim();
  res = easyReplace__default['default'](res, {
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
  res = trim__default['default'](res, "[](),.-/\\ \u2013\u2014\t\xA0");
  return res;
}

var isArr$1 = Array.isArray;
function existy$1(x) {
  return x != null;
}
function chlu(changelogContents, gitTags, packageJsonContents) {
  if (!arguments.length || !existy$1(changelogContents)) {
    return;
  }
  var processedGitTags;
  if (_typeof(gitTags) === "object" && gitTags !== null && !Array.isArray(gitTags) && existy$1(gitTags.latest)) {
    processedGitTags = {};
    processedGitTags.latest = gitTags.latest.split("|").map(function (val) {
      if (val[0] === "v") {
        return val.slice(1);
      }
      return val;
    });
    processedGitTags.all = {};
    processedGitTags.versionsOnly = [];
    if (isArr$1(gitTags.all)) {
      gitTags.all.sort().forEach(function (key) {
        processedGitTags.all[key.slice(12)] = key.slice(0, 10);
        processedGitTags.versionsOnly.push(key.slice(12));
      });
    }
  }
  var changelogMd = changelogContents;
  var packageJson;
  if (packageJsonContents) {
    var parsedContents;
    if (typeof packageJsonContents === "string") {
      try {
        parsedContents = JSON.parse(packageJsonContents);
      } catch (e) {
        throw new Error("chlu/main.js: [THROW_ID_04] Package JSON could not be parsed, JSON.parse gave error:\n".concat(e, "\n\nBy the way, we're talking about contents:\n").concat(JSON.stringify(packageJsonContents, null, 0), "\ntheir type is: \"").concat(_typeof(packageJsonContents), "\"").concat(typeof packageJsonContents === "string" ? " and its length is: ".concat(packageJsonContents.length) : ""));
      }
    } else if (isObj__default['default'](packageJsonContents)) {
      parsedContents = packageJsonContents;
    }
    try {
      packageJson = getPkgRepo__default['default'](parsedContents);
    } catch (e) {
      throw new Error("chlu/main.js: [THROW_ID_05] There was an error in get-pkg-repo:\n".concat(e, "\n\nBy the way, we're talking about contents:\n").concat(JSON.stringify(parsedContents, null, 4)));
    }
    if (packageJson && packageJson.type && packageJson.type !== "github" && packageJson.type !== "bitbucket") {
      throw new Error("chlu/main.js: [THROW_ID_01] Package JSON shows the library is neither GitHub nor BitBucket-based - ".concat(packageJson.type));
    }
  }
  var temp;
  var titles = [];
  var footerLinks = [];
  var newLinesArr = [];
  var linesArr = changelogMd.split(/\r?\n/);
  var titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  for (var i = 0, len = footerLinks.length; i < len; i++) {
    if (!existy$1(getSetFooterLink(footerLinks[i].content, {
      mode: "get"
    }))) {
      linesArr.splice(footerLinks[i].rowNum, 1);
    }
  }
  titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  var assumedPackageJsonType;
  var assumedPackageUser;
  var assumedPackageProject;
  if (!packageJson) {
    if (footerLinks[0] && footerLinks[0].content && footerLinks[0].content.includes("bitbucket.org")) {
      assumedPackageJsonType = "bitbucket";
    } else if (footerLinks[0] && footerLinks[0].content && footerLinks[0].content.includes("github.com")) {
      assumedPackageJsonType = "github";
    } else {
      throw new Error("chlu/main.js: [THROW_ID_02] Both package.json and Git data were missing and we had to rely on the first footer link to detect the type of repository: Github or Bitbucket. But we couldn't extract the first link from your changelog's footer!");
    }
    if (assumedPackageJsonType) {
      footerLinks[0].content.split("/").forEach(function (chunkOfLine, i, arr) {
        if (chunkOfLine.includes("bitbucket.org") || chunkOfLine.includes("github.com")) {
          if (arr.length > i + 2) {
            assumedPackageUser = arr[i + 1];
            assumedPackageProject = arr[i + 2];
          } else {
            throw new Error("chlu/main.js: [THROW_ID_03] We could not extract user and package from the footer link: \"".concat(footerLinks[0].content, "\""));
          }
        }
      });
    }
  }
  var sortedTitlesArray = titles.map(function (el) {
    return el.version;
  }).sort(semverCompare__default['default']);
  var unusedFooterLinks = footerLinks.filter(function (link) {
    return !titles.map(function (title) {
      return title.version;
    }).includes(link.version);
  });
  while (unusedFooterLinks.length > 0) {
    linesArr.splice(unusedFooterLinks[0].rowNum, 1);
    footerLinks = getTitlesAndFooterLinks(linesArr).footerLinks;
    unusedFooterLinks = footerLinks.filter(function (link) {
      return !titles.map(function (title) {
        return title.version;
      }).includes(link.version);
    });
  }
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
  var ascendingFooterLinkCount = 0;
  var descendingFooterLinkCount = 0;
  if (footerLinks.length > 1) {
    for (var _i2 = 0, _len2 = footerLinks.length; _i2 < _len2 - 1; _i2++) {
      if (semverCompare__default['default'](footerLinks[_i2].version, footerLinks[_i2 + 1].version) === 1) {
        descendingFooterLinkCount += 1;
      } else {
        ascendingFooterLinkCount += 1;
      }
    }
  }
  var ascending = true;
  if (ascendingFooterLinkCount <= descendingFooterLinkCount) {
    ascending = false;
  }
  var whereToPlaceIt;
  if (footerLinks.length === 0) {
    for (var _i3 = linesArr.length - 1, start = 0; _i3 >= start; _i3--) {
      if (existy$1(linesArr[_i3]) && !empty__default['default'](linesArr[_i3])) {
        whereToPlaceIt = _i3 + 2;
        break;
      }
    }
  } else {
    whereToPlaceIt = footerLinks[0].rowNum;
  }
  temp = [];
  if (packageJson && packageJson.type && packageJson.type === "github" || assumedPackageJsonType === "github") {
    missingFooterLinks.forEach(function (key) {
      temp.push("[".concat(key.version, "]: https://github.com/").concat(assumedPackageUser || packageJson.user, "/").concat(assumedPackageProject || packageJson.project, "/compare/v").concat(getPreviousVersion(key.version, sortedTitlesArray), "...v").concat(key.version));
    });
  } else if (packageJson && packageJson.type && packageJson.type === "bitbucket" || assumedPackageJsonType === "bitbucket") {
    missingFooterLinks.forEach(function (key) {
      temp.push("[".concat(key.version, "]: https://bitbucket.org/").concat(assumedPackageUser || packageJson.user, "/").concat(assumedPackageProject || packageJson.project, "/branches/compare/v").concat(key.version, "%0Dv").concat(getPreviousVersion(key.version, sortedTitlesArray), "#diff"));
    });
  }
  if (ascending) {
    temp = temp.reverse();
  }
  newLinesArr = linesArr.slice(0, whereToPlaceIt).concat(temp.concat(linesArr.slice(whereToPlaceIt)));
  temp = getTitlesAndFooterLinks(newLinesArr);
  titles = temp.titles;
  footerLinks = temp.footerLinks;
  for (var _i4 = 0, _len3 = footerLinks.length; _i4 < _len3; _i4++) {
    var extracted = getSetFooterLink(footerLinks[_i4].content, {
      mode: "get"
    });
    var finalUser = assumedPackageUser || packageJson.user;
    var finalProject = assumedPackageProject || packageJson.project;
    var finalVersBefore = getPreviousVersion(extracted.version, sortedTitlesArray);
    if (processedGitTags) {
      if (!processedGitTags.versionsOnly.includes(extracted.version)) {
        finalVersBefore = processedGitTags.versionsOnly[processedGitTags.versionsOnly.length - 1];
      } else {
        finalVersBefore = getPreviousVersion(extracted.version, processedGitTags.versionsOnly);
      }
    } else {
      var extractedVersBefore = extracted.versBefore;
      var titlesVersBefore = getPreviousVersion(extracted.version, sortedTitlesArray);
      if (semverCompare__default['default'](extractedVersBefore, titlesVersBefore) < 1) {
        finalVersBefore = titlesVersBefore;
      } else {
        finalVersBefore = extractedVersBefore;
      }
    }
    var finalVersAfter = extracted.version;
    var finalVersion = extracted.version;
    footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
      user: finalUser,
      project: finalProject,
      versBefore: finalVersBefore,
      versAfter: finalVersAfter,
      version: finalVersion,
      type: assumedPackageJsonType || packageJson.type,
      mode: "set"
    });
    newLinesArr = setRow(newLinesArr, footerLinks[_i4].rowNum, footerLinks[_i4].content);
  }
  temp = clone__default['default'](footerLinks).sort(versionSort);
  if (!ascending) {
    temp = temp.reverse();
  }
  footerLinks.forEach(function (footerLink, index) {
    newLinesArr = setRow(newLinesArr, footerLink.rowNum, temp[index].content);
  });
  var firstRowWithFooterLink = min__default['default'](footerLinks.map(function (link) {
    return link.rowNum;
  }));
  for (var _i5 = firstRowWithFooterLink + 1, _len4 = newLinesArr.length; _i5 < _len4; _i5++) {
    if (newLinesArr[_i5] === "" || typeof newLinesArr[_i5] === "string" && newLinesArr[_i5].trim() === "") {
      newLinesArr.splice(_i5, 1);
      _i5 -= 1;
    }
  }
  if (newLinesArr[newLinesArr.length - 1] !== "") {
    newLinesArr.push("");
  }
  titlesAndFooterLinks = getTitlesAndFooterLinks(newLinesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  if (existy$1(footerLinks) && footerLinks.length > 0 && !empty__default['default'](getRow(newLinesArr, footerLinks[0].rowNum - 1))) {
    newLinesArr.splice(footerLinks[0].rowNum, 0, "");
  }
  {
    titles.forEach(function (title) {
      var fixedDate = dd__default['default'](filterDate(title.afterVersion));
      if (fixedDate !== null) {
        newLinesArr = setRow(newLinesArr, title.rowNum, "## ".concat(title.version !== sortedTitlesArray[0] ? "[" : "").concat(title.version).concat(title.version !== sortedTitlesArray[0] ? "]" : "", " - ").concat(fixedDate));
      } else {
        newLinesArr = setRow(newLinesArr, title.rowNum, "## ".concat(title.version !== sortedTitlesArray[0] ? "[" : "").concat(title.version).concat(title.version !== sortedTitlesArray[0] ? "]" : "", " - ").concat(filterDate(title.afterVersion)));
      }
    });
  }
  return newLinesArr.join("\n");
}

module.exports = chlu;
