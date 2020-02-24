/**
 * chlu
 * CH-ange-L-og U-pdate - Automatically fix errors in your changelog file
 * Version: 3.7.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/chlu
 */

import getPkgRepo from 'get-pkg-repo';
import semverCompare from 'semver-compare';
import empty from 'ast-contains-only-empty-space';
import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';
import min from 'lodash.min';
import dd from 'dehumanize-date';
import trim from 'lodash.trim';
import easyReplace from 'easy-replace';
import emojiRegexLib from 'emoji-regex';

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
    .sort(semverCompare);
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
  return semverCompare(a.version, b.version);
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

const isArr$1 = Array.isArray;
function existy$1(x) {
  return x != null;
}
function chlu(changelogContents, gitTags, packageJsonContents) {
  if (arguments.length === 0 || !existy$1(changelogContents)) {
    return;
  }
  let processedGitTags;
  if (
    typeof gitTags === "object" &&
    gitTags !== null &&
    !Array.isArray(gitTags) &&
    existy$1(gitTags.latest)
  ) {
    processedGitTags = {};
    processedGitTags.latest = gitTags.latest.split("|").map(val => {
      if (val[0] === "v") {
        return val.slice(1);
      }
      return val;
    });
    processedGitTags.all = {};
    processedGitTags.versionsOnly = [];
    if (isArr$1(gitTags.all)) {
      gitTags.all.sort().forEach(key => {
        processedGitTags.all[key.slice(12)] = key.slice(0, 10);
        processedGitTags.versionsOnly.push(key.slice(12));
      });
    }
  }
  const changelogMd = changelogContents;
  let packageJson;
  if (packageJsonContents) {
    let parsedContents;
    if (typeof packageJsonContents === "string") {
      try {
        parsedContents = JSON.parse(packageJsonContents);
      } catch (e) {
        throw new Error(
          `chlu/main.js: [THROW_ID_04] Package JSON could not be parsed, JSON.parse gave error:\n${e}\n\nBy the way, we're talking about contents:\n${JSON.stringify(
            packageJsonContents,
            null,
            0
          )}\ntheir type is: "${typeof packageJsonContents}"${
            typeof packageJsonContents === "string"
              ? ` and its length is: ${packageJsonContents.length}`
              : ""
          }`
        );
      }
    } else if (isObj(packageJsonContents)) {
      parsedContents = packageJsonContents;
    }
    try {
      packageJson = getPkgRepo(parsedContents);
    } catch (e) {
      throw new Error(
        `chlu/main.js: [THROW_ID_05] There was an error in get-pkg-repo:\n${e}\n\nBy the way, we're talking about contents:\n${JSON.stringify(
          parsedContents,
          null,
          4
        )}`
      );
    }
    if (
      packageJson &&
      packageJson.type &&
      packageJson.type !== "github" &&
      packageJson.type !== "bitbucket"
    ) {
      throw new Error(
        `chlu/main.js: [THROW_ID_01] Package JSON shows the library is neither GitHub nor BitBucket-based - ${packageJson.type}`
      );
    }
  }
  let temp;
  let titles = [];
  let footerLinks = [];
  let newLinesArr = [];
  const linesArr = changelogMd.split(/\r?\n/);
  let titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  for (let i = 0, len = footerLinks.length; i < len; i++) {
    if (
      !existy$1(
        getSetFooterLink(footerLinks[i].content, {
          mode: "get"
        })
      )
    ) {
      linesArr.splice(footerLinks[i].rowNum, 1);
    }
  }
  titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  let assumedPackageJsonType;
  let assumedPackageUser;
  let assumedPackageProject;
  if (!packageJson) {
    if (
      footerLinks[0] &&
      footerLinks[0].content &&
      footerLinks[0].content.includes("bitbucket.org")
    ) {
      assumedPackageJsonType = "bitbucket";
    } else if (
      footerLinks[0] &&
      footerLinks[0].content &&
      footerLinks[0].content.includes("github.com")
    ) {
      assumedPackageJsonType = "github";
    } else {
      throw new Error(
        `chlu/main.js: [THROW_ID_02] Both package.json and Git data were missing and we had to rely on the first footer link to detect the type of repository: Github or Bitbucket. But we couldn't extract the first link from your changelog's footer!`
      );
    }
    if (assumedPackageJsonType) {
      footerLinks[0].content.split("/").forEach((chunkOfLine, i, arr) => {
        if (
          chunkOfLine.includes("bitbucket.org") ||
          chunkOfLine.includes("github.com")
        ) {
          if (arr.length > i + 2) {
            assumedPackageUser = arr[i + 1];
            assumedPackageProject = arr[i + 2];
          } else {
            throw new Error(
              `chlu/main.js: [THROW_ID_03] We could not extract user and package from the footer link: "${footerLinks[0].content}"`
            );
          }
        }
      });
    }
  }
  const sortedTitlesArray = titles.map(el => el.version).sort(semverCompare);
  let unusedFooterLinks = footerLinks.filter(
    link => !titles.map(title => title.version).includes(link.version)
  );
  while (unusedFooterLinks.length > 0) {
    linesArr.splice(unusedFooterLinks[0].rowNum, 1);
    footerLinks = getTitlesAndFooterLinks(linesArr).footerLinks;
    unusedFooterLinks = footerLinks.filter(
      link => !titles.map(title => title.version).includes(link.version)
    );
  }
  const missingFooterLinks = [];
  for (let i = 0, len = titles.length; i < len; i++) {
    if (len > 1 && titles[i].version !== sortedTitlesArray[0]) {
      const linkFound = footerLinks.some(
        el => titles[i].version === el.version
      );
      if (!linkFound) {
        missingFooterLinks.push(titles[i]);
      }
    }
  }
  let ascendingFooterLinkCount = 0;
  let descendingFooterLinkCount = 0;
  if (footerLinks.length > 1) {
    for (let i = 0, len = footerLinks.length; i < len - 1; i++) {
      if (
        semverCompare(footerLinks[i].version, footerLinks[i + 1].version) === 1
      ) {
        descendingFooterLinkCount++;
      } else {
        ascendingFooterLinkCount++;
      }
    }
  }
  let ascending = true;
  if (ascendingFooterLinkCount <= descendingFooterLinkCount) {
    ascending = false;
  }
  let whereToPlaceIt;
  if (footerLinks.length === 0) {
    for (let i = linesArr.length - 1, start = 0; i >= start; i--) {
      if (existy$1(linesArr[i]) && !empty(linesArr[i])) {
        whereToPlaceIt = i + 2;
        break;
      }
    }
  } else {
    whereToPlaceIt = footerLinks[0].rowNum;
  }
  temp = [];
  if (
    (packageJson && packageJson.type && packageJson.type === "github") ||
    assumedPackageJsonType === "github"
  ) {
    missingFooterLinks.forEach(key => {
      temp.push(
        `[${key.version}]: https://github.com/${assumedPackageUser ||
          packageJson.user}/${assumedPackageProject ||
          packageJson.project}/compare/v${getPreviousVersion(
          key.version,
          sortedTitlesArray
        )}...v${key.version}`
      );
    });
  } else if (
    (packageJson && packageJson.type && packageJson.type === "bitbucket") ||
    assumedPackageJsonType === "bitbucket"
  ) {
    missingFooterLinks.forEach(key => {
      temp.push(
        `[${key.version}]: https://bitbucket.org/${assumedPackageUser ||
          packageJson.user}/${assumedPackageProject ||
          packageJson.project}/branches/compare/v${
          key.version
        }%0Dv${getPreviousVersion(key.version, sortedTitlesArray)}#diff`
      );
    });
  }
  if (ascending) {
    temp = temp.reverse();
  }
  newLinesArr = linesArr
    .slice(0, whereToPlaceIt)
    .concat(temp.concat(linesArr.slice(whereToPlaceIt)));
  temp = getTitlesAndFooterLinks(newLinesArr);
  titles = temp.titles;
  footerLinks = temp.footerLinks;
  for (let i = 0, len = footerLinks.length; i < len; i++) {
    const extracted = getSetFooterLink(footerLinks[i].content, {
      mode: "get"
    });
    const finalUser = assumedPackageUser || packageJson.user;
    const finalProject = assumedPackageProject || packageJson.project;
    let finalVersBefore = getPreviousVersion(
      extracted.version,
      sortedTitlesArray
    );
    if (processedGitTags) {
      if (!processedGitTags.versionsOnly.includes(extracted.version)) {
        finalVersBefore =
          processedGitTags.versionsOnly[
            processedGitTags.versionsOnly.length - 1
          ];
      } else {
        finalVersBefore = getPreviousVersion(
          extracted.version,
          processedGitTags.versionsOnly
        );
      }
    } else {
      const extractedVersBefore = extracted.versBefore;
      const titlesVersBefore = getPreviousVersion(
        extracted.version,
        sortedTitlesArray
      );
      if (semverCompare(extractedVersBefore, titlesVersBefore) < 1) {
        finalVersBefore = titlesVersBefore;
      } else {
        finalVersBefore = extractedVersBefore;
      }
    }
    const finalVersAfter = extracted.version;
    const finalVersion = extracted.version;
    footerLinks[i].content = getSetFooterLink(footerLinks[i].content, {
      user: finalUser,
      project: finalProject,
      versBefore: finalVersBefore,
      versAfter: finalVersAfter,
      version: finalVersion,
      type: assumedPackageJsonType || packageJson.type,
      mode: "set"
    });
    newLinesArr = setRow(
      newLinesArr,
      footerLinks[i].rowNum,
      footerLinks[i].content
    );
  }
  temp = clone(footerLinks).sort(versionSort);
  if (!ascending) {
    temp = temp.reverse();
  }
  footerLinks.forEach((footerLink, index) => {
    newLinesArr = setRow(newLinesArr, footerLink.rowNum, temp[index].content);
  });
  const firstRowWithFooterLink = min(footerLinks.map(link => link.rowNum));
  for (
    let i = firstRowWithFooterLink + 1, len = newLinesArr.length;
    i < len;
    i++
  ) {
    if (
      newLinesArr[i] === "" ||
      (typeof newLinesArr[i] === "string" && newLinesArr[i].trim() === "")
    ) {
      newLinesArr.splice(i, 1);
      i--;
    }
  }
  if (newLinesArr[newLinesArr.length - 1] !== "") {
    newLinesArr.push("");
  }
  titlesAndFooterLinks = getTitlesAndFooterLinks(newLinesArr);
  titles = titlesAndFooterLinks.titles;
  footerLinks = titlesAndFooterLinks.footerLinks;
  if (
    existy$1(footerLinks) &&
    footerLinks.length > 0 &&
    !empty(getRow(newLinesArr, footerLinks[0].rowNum - 1))
  ) {
    newLinesArr.splice(footerLinks[0].rowNum, 0, "");
  }
  {
    titles.forEach(title => {
      const fixedDate = dd(filterDate(title.afterVersion));
      if (fixedDate !== null) {
        newLinesArr = setRow(
          newLinesArr,
          title.rowNum,
          `## ${title.version !== sortedTitlesArray[0] ? "[" : ""}${
            title.version
          }${title.version !== sortedTitlesArray[0] ? "]" : ""} - ${fixedDate}`
        );
      } else {
        newLinesArr = setRow(
          newLinesArr,
          title.rowNum,
          `## ${title.version !== sortedTitlesArray[0] ? "[" : ""}${
            title.version
          }${title.version !== sortedTitlesArray[0] ? "]" : ""} - ${filterDate(
            title.afterVersion
          )}`
        );
      }
    });
  }
  return newLinesArr.join("\n");
}

export default chlu;
