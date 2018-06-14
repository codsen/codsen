'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var semverCompare = _interopDefault(require('semver-compare'));
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
  // removes leading "v" and "v."
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
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_04] The first argument must be string. Currently it's " + (typeof currVers === "undefined" ? "undefined" : _typeof(currVers)));
  } else {
    currVers = prep(currVers);
  }
  if (!isArr(originalVersionsArr)) {
    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_05] The second argument must be an array. Currently it's " + (typeof originalVersionsArr === "undefined" ? "undefined" : _typeof(originalVersionsArr)) + " equal to:\nJSON.stringify(originalVersionsArr, null, 4)");
  }

  var versionsArr = clone(originalVersionsArr).map(function (val) {
    return prep(val);
  }).sort(semverCompare);
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
// or
// "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1
function getSetFooterLink(str) {
  var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // console.log(`\n\u001b[${35}m${`==== getSetFooterLink() ====`}\u001b[${39}m`);
  // console.log(
  //   `\nUTIL 221 ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
  //     str,
  //     null,
  //     4
  //   )}`
  // );

  var mode = void 0;
  if ((typeof o === "undefined" ? "undefined" : _typeof(o)) === "object" && o !== null && typeof o.mode === "string") {
    mode = o.mode;
  } else {
    mode = "get";
  }
  // console.log(`\u001b[${32}m${`MODE = ${mode}`}\u001b[${39}m`);

  if (typeof str !== "string" || !str.includes("/")) {
    return null;
  }
  var split = str.split("/");
  var res = {};

  // console.log(
  //   `\nUTIL 242 ${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
  //     split,
  //     null,
  //     4
  //   )}`
  // );

  if (!o) {
    o = {};
    o.type = "github";
  } else if (!o.type) {
    o.type = "github";
  }

  // console.log(
  //   `\nUTIL 259 ${`\u001b[${33}m${`o.type`}\u001b[${39}m`} = ${JSON.stringify(
  //     o.type,
  //     null,
  //     4
  //   )}`
  // );

  var currentlyWeHaveLinkOfAType = str.includes("github") ? "github" : "bitbucket";

  for (var i = 0, len = split.length; i < len; i++) {
    if (split[i] === "github.com" || split[i] === "bitbucket.org") {
      res.user = existy(o.user) ? o.user : split[i + 1];
      res.project = existy(o.project) ? o.project : split[i + 2];
    } else if (split[i] === "compare") {
      // github notation:
      if (split[i + 1].includes("...")) {
        var splitVersions = trim(split[i + 1], "#diff").split("...");
        res.versBefore = existy(o.versBefore) ? o.versBefore : trim(currentlyWeHaveLinkOfAType === "github" ? splitVersions[0] : splitVersions[1], "v");
        res.versAfter = existy(o.versAfter) ? o.versAfter : trim(currentlyWeHaveLinkOfAType === "github" ? splitVersions[1] : splitVersions[0], "v");
      } else if (split[i + 1].includes("%0D")) {
        // bitbucket notation:
        var _splitVersions = trim(split[i + 1], "#diff").split("%0D");
        res.versBefore = existy(o.versBefore) ? o.versBefore : trim(currentlyWeHaveLinkOfAType === "github" ? _splitVersions[0] : _splitVersions[1], "v");
        res.versAfter = existy(o.versAfter) ? o.versAfter : trim(currentlyWeHaveLinkOfAType === "github" ? _splitVersions[1] : _splitVersions[0], "v");
      } else {
        // insurance against broken compare links:
        return null;
      }
    } else if (i === 0) {
      res.version = existy(o.version) ? o.version : split[i].match(versionWithoutBracketsRegex)[0];
    }
  }
  // console.log(
  //   `UTIL 319 END ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
  //     res,
  //     null,
  //     4
  //   )}`
  // );
  if (mode === "get") {
    res.type = currentlyWeHaveLinkOfAType;
    return res;
  }
  if (o.type === "github") {
    return "[" + res.version + "]: https://github.com/" + res.user + "/" + res.project + "/compare/v" + res.versBefore + "...v" + res.versAfter;
  } else if (o.type === "bitbucket") {
    return "[" + res.version + "]: https://bitbucket.org/" + res.user + "/" + res.project + "/branches/compare/v" + res.versAfter + "%0Dv" + res.versBefore + "#diff";
  }
}

function versionSort(a, b) {
  return semverCompare(a.version, b.version);
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

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var isArr$1 = Array.isArray;

// F'S
// -----------------------------------------------------------------------------

function existy$1(x) {
  return x != null;
}

// ACTION
// -----------------------------------------------------------------------------

// gitTags will come either as null or a plain object, for example:
// {
//     "latest": "v1.9.1",
//     "all": [
//         "v1.0.1",
//         "v1.1.0",
//         ...
//         "v1.9.0",
//         "v1.9.1"
//     ]
// }

function chlu(changelogContents, gitTags, packageJsonContents) {
  if (arguments.length === 0 || !existy$1(changelogContents)) {
    return;
  }

  // process the gitTags input.
  // result will be in the following format:

  // processedGitTags = {
  //     "latest": [
  //         "2017-04-18",
  //         "1.3.5"
  //     ],
  //     "all": {
  //         "1.0.0": "2017-04-01",
  //         "1.0.1": "2017-04-02",
  //         ...
  //         "1.3.4": "2017-04-17",
  //         "1.3.5": "2017-04-18"
  //     },
  //     "versionsOnly": [
  //         "1.0.0",
  //         "1.0.1",
  //         ...
  //         "1.3.4",
  //         "1.3.5"
  //     ]
  // }

  var processedGitTags = void 0;

  if ((typeof gitTags === "undefined" ? "undefined" : _typeof$1(gitTags)) === "object" && gitTags !== null && !Array.isArray(gitTags) && gitTags.latest !== undefined) {
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

  var packageJson = void 0;
  // package.json might come in falsey in case it's unavailable
  if (packageJsonContents) {
    packageJson = getPkgRepo(packageJsonContents);
    // throw only if the package.json was parsed and type is not recognised
    if (packageJson && packageJson.type && packageJson.type !== "github" && packageJson.type !== "bitbucket") {
      throw new Error("chlu/main.js: [THROW_ID_01] Package JSON shows the library is neither GitHub nor BitBucket-based - " + packageJson.type);
    }
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

  // =======
  // stage 2: remove any invalid footer links

  for (var i = 0, len = footerLinks.length; i < len; i++) {
    if (!existy$1(getSetFooterLink(footerLinks[i].content, {
      mode: "get"
    }))) {
      linesArr.splice(footerLinks[i].rowNum, 1);
    }
  }

  // recalculate:
  titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;

  var assumedPackageJsonType = void 0;
  var assumedPackageUser = void 0;
  var assumedPackageProject = void 0;
  if (!packageJson) {
    // if the package.json was not given, infer the type of diff links from the
    // first footer link's URL:
    if (footerLinks[0] && footerLinks[0].content && footerLinks[0].content.includes("bitbucket.org")) {
      assumedPackageJsonType = "bitbucket";
    } else if (footerLinks[0] && footerLinks[0].content && footerLinks[0].content.includes("github.com")) {
      assumedPackageJsonType = "github";
    } else {
      throw new Error("chlu/main.js: [THROW_ID_02] Both package.json and Git data were missing and we had to rely on the first footer link to detect the type of repository: Github or Bitbucket. But we couldn't extract the first link from your changelog's footer!");
    }

    if (assumedPackageJsonType) {
      footerLinks[0].content.split("/").forEach(function (chunkOfLine, i, arr) {
        // if the chunk contains "bitbucket.org", next chunk is user, further next
        // chunk is project. Grab those.
        if (chunkOfLine.includes("bitbucket.org") || chunkOfLine.includes("github.com")) {
          if (arr.length > i + 2) {
            assumedPackageUser = arr[i + 1];
            assumedPackageProject = arr[i + 2];
          } else {
            throw new Error("chlu/main.js: [THROW_ID_03] We could not extract user and package from the footer link: \"" + footerLinks[0].content + "\"");
          }
        }
      });
    }
  }

  // =======
  // stage 3: get the ordered array of all title versions

  var sortedTitlesArray = titles.map(function (el) {
    return el.version;
  }).sort(semverCompare);

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
      if (semverCompare(footerLinks[_i2].version, footerLinks[_i2 + 1].version) === 1) {
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
  if (packageJson && packageJson.type && packageJson.type === "github" || assumedPackageJsonType === "github") {
    missingFooterLinks.forEach(function (key) {
      temp.push("[" + key.version + "]: https://github.com/" + (assumedPackageUser || packageJson.user) + "/" + (assumedPackageProject || packageJson.project) + "/compare/v" + getPreviousVersion(key.version, sortedTitlesArray) + "...v" + key.version);
    });
  } else if (packageJson && packageJson.type && packageJson.type === "bitbucket" || assumedPackageJsonType === "bitbucket") {
    missingFooterLinks.forEach(function (key) {
      temp.push("[" + key.version + "]: https://bitbucket.org/" + (assumedPackageUser || packageJson.user) + "/" + (assumedPackageProject || packageJson.project) + "/branches/compare/v" + key.version + "%0Dv" + getPreviousVersion(key.version, sortedTitlesArray) + "#diff");
    });
  }

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
    var extracted = getSetFooterLink(footerLinks[_i4].content, {
      mode: "get"
    });

    var finalUser = assumedPackageUser || packageJson.user;
    var finalProject = assumedPackageProject || packageJson.project;
    var finalVersBefore = getPreviousVersion(extracted.version, sortedTitlesArray);
    if (processedGitTags) {
      // if we have the Git info, pick "from" git version from Git data:
      //
      // 1. check if current "to" diff Git version, "extracted.version", does not
      // exist yet among git tags
      if (!processedGitTags.versionsOnly.includes(extracted.version)) {
        // Current version is not among existing Git tags. Just pick the last.
        finalVersBefore = processedGitTags.versionsOnly[processedGitTags.versionsOnly.length - 1];
      } else {
        finalVersBefore = getPreviousVersion(extracted.version, processedGitTags.versionsOnly);
      }
    } else {
      // if the Git data is not available, use existing parsed Changelog data.

      // Let's calculate the "from" version in the link, the "1.3.5" in:
      // [1.4.0]: https://github.com/codsen/wrong-lib/compare/v1.3.5...v1.4.0

      // 1. It can come from existing value in the changelog, from this very row:
      var extractedVersBefore = extracted.versBefore;
      // 2. It can come from the previous title from the entries mentioned in the
      // changelog. Each heading mentions a version and we extract them all from there.
      var titlesVersBefore = getPreviousVersion(extracted.version, sortedTitlesArray);

      // The order of preference is:
      // 1. Git data - pick previous version from known Git tags
      // 2. Existing Changelog markdown file - current row might be custom-tweaked
      // 3. Data from the titles.

      // Since #1 is not available (see other part of outer IF clause above),
      // it's the choice between #2 and #3.

      // We would fall back to #3 only on emergency cases - when it's messed up.

      // TODO: add more checks, like is it digit.digit.digit notation in extracted
      // version from changelog ("extractedVersBefore")?
      if (semverCompare(extractedVersBefore, titlesVersBefore) < 1) {
        // mess up cases, #3
        finalVersBefore = titlesVersBefore;
      } else {
        // all OK, default case #2
        finalVersBefore = extractedVersBefore;
      }
    }
    var finalVersAfter = extracted.version;
    var finalVersion = extracted.version;

    // finally, set the row's value:
    footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
      user: finalUser,
      project: finalProject,
      versBefore: finalVersBefore,
      versAfter: finalVersAfter,
      version: finalVersion,
      type: assumedPackageJsonType || packageJson.type,
      mode: "set"
    });

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

  {
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
