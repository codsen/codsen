/* eslint prefer-destructuring:0, no-param-reassign:0 */

import cmp from "semver-compare";
import clone from "lodash.clonedeep";
import trim from "lodash.trim";
import easyReplace from "easy-replace";
import emojiRegexLib from "emoji-regex";

const emojiRegex = emojiRegexLib();

// REGEXES
// -----------------------------------------------------------------------------

const versionWithBracketsRegex = /\[v?\d+\.\d+(\.\d+)*\]/g;
const versionWithoutBracketsRegex = /v?\d+\.\d+(\.\d+)*/g;
const versionWithoutBracketsRegexNoVersion = /\d+\.\d+(\.\d+)*/g;

// FUNCTIONS
// -----------------------------------------------------------------------------

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

// Is current string (line as input one-by-one) a title?
// For example, "## [1.2.0] - 2017-04-24" is.
// For example, "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0" is not
function isTitle(str) {
  if (str === undefined) {
    return false;
  } else if (!isStr(str)) {
    throw new TypeError(
      `chlu/util.js/isTitle(): [THROW_ID_01] The input must be string - it was given as ${JSON.stringify(
        str,
        null,
        4
      )} (${typeof str})`
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
        afterVersion: linesArr[i].split(firstEncounteredVersion)[1],
      });
    } else if (isFooterLink(linesArr[i])) {
      temp = linesArr[i].match(versionWithBracketsRegex)[0];
      footerLinks.push({
        version: temp.substring(1, temp.length - 1),
        rowNum: i,
        content: linesArr[i],
      });
    }
  }
  return {
    titles,
    footerLinks,
  };
}

function getPreviousVersion(currVers, originalVersionsArr) {
  // removes leading "v" and "v."
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
    .map((val) => prep(val))
    .sort(cmp);
  // first, check if it's the first version from the versions array.
  // in that case, there's no previous version, so we return null:
  if (currVers === versionsArr[0]) {
    return null;
  }
  // next, iterate versions array and try to get the previous version:
  for (let i = 0, len = versionsArr.length; i < len; i++) {
    if (versionsArr[i] === currVers && existy(versionsArr[i - 1])) {
      return versionsArr[i - 1];
    }
  }
  // if nothing was found yet, throw:
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
  if (!existy(index) || !Number.isInteger(index)) {
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

// gets and sets various pieces in strings of the format:
// "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
// or
// "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1
function getSetFooterLink(str, o = {}) {
  // console.log(`\n\u001b[${35}m${`==== getSetFooterLink() ====`}\u001b[${39}m`);
  // console.log(
  //   `\nUTIL 221 ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
  //     str,
  //     null,
  //     4
  //   )}`
  // );

  let mode;
  if (typeof o === "object" && o !== null && typeof o.mode === "string") {
    mode = o.mode;
  } else {
    mode = "get";
  }
  // console.log(`\u001b[${32}m${`MODE = ${mode}`}\u001b[${39}m`);

  if (typeof str !== "string" || !str.includes("/")) {
    return null;
  }
  const split = str.split("/");
  const res = {};

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

  const currentlyWeHaveLinkOfAType = str.includes("github")
    ? "github"
    : "bitbucket";

  for (let i = 0, len = split.length; i < len; i++) {
    if (split[i] === "github.com" || split[i] === "bitbucket.org") {
      res.user = existy(o.user) ? o.user : split[i + 1];
      res.project = existy(o.project) ? o.project : split[i + 2];
    } else if (split[i] === "compare") {
      // github notation:
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
        // bitbucket notation:
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
        // insurance against broken compare links:
        return null;
      }
    } else if (i === 0) {
      res.version = existy(o.version)
        ? o.version
        : split[i].match(versionWithoutBracketsRegex)[0];
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
      searchFor: true,
    },
  });
  res = res.replace(".", " ");
  res = res.replace(",", " ");
  res = res.replace(";", " ");
  res = res.replace(emojiRegex, "");
  res = res.replace(/[ ]+/g, " ");
  res = trim(res, "[](),.-/\\ \u2013\u2014\t\u00A0");
  return res;
}

// FIN
// -----------------------------------------------------------------------------

export {
  isTitle,
  isFooterLink,
  versionWithBracketsRegex,
  versionWithoutBracketsRegex,
  getPreviousVersion,
  getRow,
  setRow,
  getTitlesAndFooterLinks,
  getSetFooterLink,
  aContainsB,
  versionSort,
  filterDate,
};
