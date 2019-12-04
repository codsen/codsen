'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cmp = _interopDefault(require('semver-compare'));
var clone = _interopDefault(require('lodash.clonedeep'));
var isNum = _interopDefault(require('is-natural-number'));
var trim = _interopDefault(require('lodash.trim'));
var easyReplace = _interopDefault(require('easy-replace'));
var emojiRegexLib = _interopDefault(require('emoji-regex'));

const emojiRegex = emojiRegexLib();
const versionWithBracketsRegex = /\[v?\d+\.\d+(\.\d+)*\]/g;
const versionWithoutBracketsRegex = /v?\d+\.\d+(\.\d+)*/g;
const versionWithoutBracketsRegexNoVersion = /\d+\.\d+(\.\d+)*/g;
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
const isArr = Array.isArray;
function isFooterLink(str) {
  if (str === undefined) {
    return false;
  } else if (!isStr(str)) {
    throw new TypeError(
      "chlu/util.js/isFooterLink(): [THROW_ID_02] The input must be string"
    );
  }
  return (
    str.length > 0 &&
    existy(str.match(versionWithBracketsRegex)) &&
    aContainsB(str, "]:")
  );
}
function isTitle(str) {
  if (str === undefined) {
    return false;
  } else if (!isStr(str)) {
    throw new TypeError(
      "chlu/util.js/isTitle(): [THROW_ID_01] The input must be string"
    );
  }
  let stringInFrontOfVersion;
  if (existy(str.match(versionWithoutBracketsRegex))) {
    stringInFrontOfVersion = str.split(
      str.match(versionWithoutBracketsRegex)[0]
    );
    if (stringInFrontOfVersion === null) {
      stringInFrontOfVersion = "";
    } else {
      stringInFrontOfVersion = stringInFrontOfVersion[0];
    }
  }
  return (
    str.length > 0 &&
    existy(str.match(versionWithoutBracketsRegex)) &&
    !str.includes("http") &&
    !str.includes("]:") &&
    trim(stringInFrontOfVersion, "[# \t") === "" &&
    str.includes("#")
  );
}
function getTitlesAndFooterLinks(linesArr) {
  const titles = [];
  const footerLinks = [];
  let i;
  let len;
  let temp;
  for (i = 0, len = linesArr.length; i < len; i++) {
    if (isTitle(linesArr[i])) {
      const firstEncounteredVersion = linesArr[i].match(
        versionWithoutBracketsRegexNoVersion
      )[0];
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
    titles,
    footerLinks
  };
}
function getPreviousVersion(currVers, originalVersionsArr) {
  function prep(str = "") {
    if (str.startsWith("v")) {
      if (str[1] === ".") {
        return str.slice(2);
      }
      return str.slice(1);
    }
    return str;
  }
  if (arguments.length < 2) {
    throw new Error(
      "chlu/util.js/getPreviousVersion(): [THROW_ID_03] There must be two arguments, string and an array."
    );
  }
  if (!isStr(currVers)) {
    throw new Error(
      `chlu/util.js/getPreviousVersion(): [THROW_ID_04] The first argument must be string. Currently it's ${typeof currVers}`
    );
  } else {
    currVers = prep(currVers);
  }
  if (!isArr(originalVersionsArr)) {
    throw new Error(
      `chlu/util.js/getPreviousVersion(): [THROW_ID_05] The second argument must be an array. Currently it's ${typeof originalVersionsArr} equal to:\nJSON.stringify(originalVersionsArr, null, 4)`
    );
  }
  const versionsArr = clone(originalVersionsArr)
    .map(val => prep(val))
    .sort(cmp);
  if (currVers === versionsArr[0]) {
    return null;
  }
  for (let i = 0, len = versionsArr.length; i < len; i++) {
    if (versionsArr[i] === currVers && existy(versionsArr[i - 1])) {
      return versionsArr[i - 1];
    }
  }
  throw new Error(
    `chlu/util.js/getPreviousVersion(): [THROW_ID_06] The given version (${currVers}) is not in the versions array (${JSON.stringify(
      versionsArr,
      null,
      4
    )})`
  );
}
function setRow(rowsArray, index, content) {
  const res = clone(rowsArray);
  for (let i = 0, len = res.length; i < len; i++) {
    if (i === index) {
      res[i] = content;
    }
  }
  return res;
}
function getRow(rowsArray, index) {
  if (!existy(index) || !isNum(index)) {
    throw new TypeError(
      `chlu/util.js/getRow(): [THROW_ID_07]: first input arg must be a natural number. Currently it's given as: ${typeof index} and equal: ${JSON.stringify(
        index,
        null,
        4
      )}`
    );
  }
  if (!existy(rowsArray) || !isArr(rowsArray)) {
    throw new TypeError(
      `chlu/util.js/getRow(): [THROW_ID_08]: second input arg must be an rowsArrayay. Currently it's given as: ${typeof rowsArray} and equal: ${JSON.stringify(
        rowsArray,
        null,
        4
      )}`
    );
  }
  for (let i = 0, len = rowsArray.length; i < len; i++) {
    if (i === index) {
      return rowsArray[i];
    }
  }
  return null;
}
function getSetFooterLink(str, o = {}) {
  let mode;
  if (typeof o === "object" && o !== null && typeof o.mode === "string") {
    mode = o.mode;
  } else {
    mode = "get";
  }
  if (typeof str !== "string" || !str.includes("/")) {
    return null;
  }
  const split = str.split("/");
  const res = {};
  if (!o) {
    o = {};
    o.type = "github";
  } else if (!o.type) {
    o.type = "github";
  }
  const currentlyWeHaveLinkOfAType = str.includes("github")
    ? "github"
    : "bitbucket";
  for (let i = 0, len = split.length; i < len; i++) {
    if (split[i] === "github.com" || split[i] === "bitbucket.org") {
      res.user = existy(o.user) ? o.user : split[i + 1];
      res.project = existy(o.project) ? o.project : split[i + 2];
    } else if (split[i] === "compare") {
      if (split[i + 1].includes("...")) {
        const splitVersions = trim(split[i + 1], "#diff").split("...");
        res.versBefore = existy(o.versBefore)
          ? o.versBefore
          : trim(
              currentlyWeHaveLinkOfAType === "github"
                ? splitVersions[0]
                : splitVersions[1],
              "v"
            );
        res.versAfter = existy(o.versAfter)
          ? o.versAfter
          : trim(
              currentlyWeHaveLinkOfAType === "github"
                ? splitVersions[1]
                : splitVersions[0],
              "v"
            );
      } else if (split[i + 1].includes("%0D")) {
        const splitVersions = trim(split[i + 1], "#diff").split("%0D");
        res.versBefore = existy(o.versBefore)
          ? o.versBefore
          : trim(
              currentlyWeHaveLinkOfAType === "github"
                ? splitVersions[0]
                : splitVersions[1],
              "v"
            );
        res.versAfter = existy(o.versAfter)
          ? o.versAfter
          : trim(
              currentlyWeHaveLinkOfAType === "github"
                ? splitVersions[1]
                : splitVersions[0],
              "v"
            );
      } else {
        return null;
      }
    } else if (i === 0) {
      res.version = existy(o.version)
        ? o.version
        : split[i].match(versionWithoutBracketsRegex)[0];
    }
  }
  if (mode === "get") {
    res.type = currentlyWeHaveLinkOfAType;
    return res;
  }
  if (o.type === "github") {
    return `[${res.version}]: https://github.com/${res.user}/${res.project}/compare/v${res.versBefore}...v${res.versAfter}`;
  } else if (o.type === "bitbucket") {
    return `[${res.version}]: https://bitbucket.org/${res.user}/${res.project}/branches/compare/v${res.versAfter}%0Dv${res.versBefore}#diff`;
  }
}
function versionSort(a, b) {
  return cmp(a.version, b.version);
}
function filterDate(someString) {
  let res = someString.trim();
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
  res = trim(res, "[](),.-/\\ \u2013\u2014\t\u00A0");
  return res;
}

exports.aContainsB = aContainsB;
exports.filterDate = filterDate;
exports.getPreviousVersion = getPreviousVersion;
exports.getRow = getRow;
exports.getSetFooterLink = getSetFooterLink;
exports.getTitlesAndFooterLinks = getTitlesAndFooterLinks;
exports.isFooterLink = isFooterLink;
exports.isTitle = isTitle;
exports.setRow = setRow;
exports.versionSort = versionSort;
exports.versionWithBracketsRegex = versionWithBracketsRegex;
exports.versionWithoutBracketsRegex = versionWithoutBracketsRegex;
