/* eslint no-param-reassign:0, no-continue:0, no-console:0,
no-loop-func:0, prefer-destructuring:0 */

const fs = require("fs-extra");
const objectPath = require("object-path");
const pify = require("pify");
const request = pify(require("request"));
const trim = require("lodash.trim");
const isObj = require("lodash.isplainobject");
const filesize = require("filesize");
const traverse = require("ast-monkey-traverse");

const currentTime = new Date();
const year = currentTime.getFullYear();
const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}

function resolveVars(str, pack, parsedPack) {
  // if contributors section exists in package.json, get contributors' count from there
  let count = 0;
  if (
    objectPath.has(pack, "lect.contributors") &&
    isArr(pack.lect.contributors)
  ) {
    count = pack.lect.contributors.length;
  } else {
    // otherwise, peeps must be using all-contributors CLI so we need to parse
    // the contrib tables in readme and count how many contributors there are
    // TODO - call all-contributors parser
  }

  const mappings = {
    "%REPONAME%": pack.name,
    "%USERNAME%": parsedPack.user,
    "%ISSUELINK%": `${pack.repository}issues/new?issue[title]=${pack.name}%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0A${pack.name}%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt`,
    "%COMMITLINK%": `https://bitbucket.org/${parsedPack.user}/${parsedPack.project}/commits`,
    "%YEAR%": String(year),
    "%CONTRIBUTORCOUNT%": String(count),
  };
  return Object.keys(mappings).reduce(
    (accumulator, mappingsKey) =>
      // replace(accumulator, mappingsKey, mappings[mappingsKey]),
      accumulator.replace(RegExp(mappingsKey, "g"), mappings[mappingsKey]),
    str
  );
}

// -----------------------------------------------------------------------------

function extractSrc(str) {
  let attrStartsAt = null;
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      `${str[i]}${str[i + 1]}${str[i + 2]}${str[i + 3]}${str[i + 4]}` ===
      'src="'
    ) {
      attrStartsAt = i + 5;
      i += 5;
      continue;
    }
    if (attrStartsAt && str[i] === '"') {
      return str.slice(attrStartsAt, i);
    }
  }
  return null;
}

// -----------------------------------------------------------------------------

function removeRecognisedLintingBadges(str, lectrc) {
  const theSplit = str.split(/\r?\n/);
  // insurance in case the .lectrc.json does not have the key "header.rightFloatedBadge" set:
  if (!objectPath.has(lectrc, "header.rightFloatedBadge")) {
    return str;
  }
  // filter out the repeated floated linting badges:
  return theSplit
    .filter(
      (rowsVal) =>
        !rowsVal.includes(extractSrc(lectrc.header.rightFloatedBadge))
    )
    .join("\n");
}

// -----------------------------------------------------------------------------

function replaceNpmInstallRow(str, pack) {
  const theSplit = str.split(/\r?\n/);
  return theSplit
    .map((rowsContent, index) => {
      if (
        trim(rowsContent, "$ ").startsWith("npm i") &&
        theSplit[index - 1] !== undefined &&
        theSplit[index - 1].includes("```") &&
        theSplit[index + 1] !== undefined &&
        theSplit[index + 1].includes("```")
      ) {
        return `npm i ${objectPath.has(pack, "bin") ? "-g " : ""}${pack.name}`;
      }
      return rowsContent;
    })
    .join("\n");
}

// -----------------------------------------------------------------------------

function replaceNpxRow(str, pack) {
  const theSplit = str.split(/\r?\n/);
  return str
    .split(/\r?\n/)
    .map((rowsContent, index) => {
      if (
        trim(rowsContent, "$ ").startsWith("npx") &&
        theSplit[index - 1] !== undefined &&
        theSplit[index - 1].includes("```") &&
        theSplit[index + 1] !== undefined &&
        theSplit[index + 1].includes("```")
      ) {
        return `$ npx ${pack.name}`;
      }
      return rowsContent;
    })
    .join("\n");
}

// -----------------------------------------------------------------------------

function piecesHeadingIsNotAmongExcluded(str) {
  if (
    str.includes("#") &&
    (str.toLowerCase().includes("licence") ||
      str.toLowerCase().includes("testing") ||
      str.toLowerCase().includes("contributors") ||
      str.toLowerCase().includes("contributing"))
  ) {
    return false;
  }
  return true;
}

// -----------------------------------------------------------------------------

// Should report the index of "S" in "Some text" from below:
//
// [![Test in browser][runkit-img]][runkit-url]
//
// Some text
//
function extractStringUnderBadges(str) {
  let lastBadgeRow = null;
  if (typeof str !== "string") {
    return str;
  }
  const theSplit = str.split(/\r?\n/);
  theSplit.forEach((row, i) => {
    if (`${row[0]}${row[1]}${row[2]}` === "[![") {
      lastBadgeRow = i;
    }
  });
  if (lastBadgeRow !== null) {
    return theSplit
      .filter((content, idx) => idx > lastBadgeRow)
      .join("\n")
      .trim();
  }
  return str;
}

// -----------------------------------------------------------------------------

function assembleRollupInfoTable(pack, lectrc) {
  let rollupTable = "";
  rollupTable +=
    "Type            | Key in `package.json` | Path  | Size\r\n----------------|-----------------------|-------|--------";
  if (objectPath.has(pack, "main")) {
    try {
      const { size } = fs.statSync(pack.main);
      rollupTable += `\n${
        lectrc.rollup.infoTable.cjsTitle
      } | \`main\`                | \`${pack.main}\` | ${filesize(size, {
        round: 0,
      })}`;
    } catch (err) {
      return ""; // because main should always be there
    }
  }
  if (objectPath.has(pack, "module")) {
    try {
      const { size } = fs.statSync(pack.module);
      rollupTable += `\n${
        lectrc.rollup.infoTable.esmTitle
      } | \`module\`              | \`${pack.module}\` | ${filesize(size, {
        round: 0,
      })}`;
    } catch (err) {
      objectPath.del(pack, "module");
    }
  }
  if (objectPath.has(pack, "browser")) {
    try {
      const { size } = fs.statSync(pack.browser);
      rollupTable += `\n${
        lectrc.rollup.infoTable.umdTitle
      } | \`browser\`            | \`${pack.browser}\` | ${filesize(size, {
        round: 0,
      })}`;
    } catch (err) {
      objectPath.del(pack, "browser");
    }
  }
  return rollupTable;
}

// -----------------------------------------------------------------------------

function replaceRollupInfoTableAndItsHeader(str, pack, lectrc) {
  // generation part
  // ===============
  let rollupTable = "";
  if (
    (pack.module || pack.browser) &&
    objectPath.has(lectrc, "rollup.infoTable") &&
    Object.keys(lectrc.rollup.infoTable).length > 0
  ) {
    rollupTable = `${assembleRollupInfoTable(pack, lectrc)}\n\n`;
  }

  // defaults cater the case when Rollup is consumed in package.json,
  // but there's no info table in readme yet.
  // Whole contents of "install" section, "str" contents, go in front of newly-
  // generated rollup info table, "rollupTable"
  let stringBefore = `${str}\n\n`;
  let stringAfter = "";

  // removal part
  // ============
  if (str.includes("|") && str.includes("--")) {
    const theSplit = str.split(/\r?\n/);
    // First, look for the line under the table title.
    // Thing like:
    // "----------------|-----------------------|-------|--------"
    let theFirstRowThatContainsMinusMinusAndPipe = null;
    for (let i = 0, len = theSplit.length; i < len; i++) {
      if (theSplit[i].includes("--") && theSplit[i].includes("|")) {
        theFirstRowThatContainsMinusMinusAndPipe = i;
        break;
      }
    }

    let firstRowsUpForDeletionIndex = theFirstRowThatContainsMinusMinusAndPipe;
    let lastRowsUpForDeletionIndex = theFirstRowThatContainsMinusMinusAndPipe;

    // sanity check: line above our line index "theFirstRowThatContainsMinusMinusAndPipe",
    // the "----------------|-----------------------|-------|--------",
    // must contain vertical pipe. If not, throw.
    if (!theSplit[theFirstRowThatContainsMinusMinusAndPipe - 1].includes("|")) {
      throw new Error(
        `lect: the Rollup info table's heading does not contain vertical pipe symbol, which is strange! It's equal to:\n${
          theSplit[theFirstRowThatContainsMinusMinusAndPipe - 1]
        }`
      );
    }

    // if there is a sentence row above the table ending with colon, include it as well.
    // Requirements are 1) that row must end with colon; 2) above that row there
    // should be an empty line.
    // 2) requirement is to attempt to avoid including longer paragraphs above it.

    if (
      theSplit[theFirstRowThatContainsMinusMinusAndPipe - 2].trim() === "" &&
      trim(
        theSplit[theFirstRowThatContainsMinusMinusAndPipe - 3],
        "#*_ "
      ).endsWith(":") &&
      theSplit[theFirstRowThatContainsMinusMinusAndPipe - 4].trim() === ""
    ) {
      firstRowsUpForDeletionIndex =
        theFirstRowThatContainsMinusMinusAndPipe - 4;
    }
    // if there's no empty line above the table,
    if (
      theSplit[theFirstRowThatContainsMinusMinusAndPipe - 2].trim() !== "" &&
      trim(
        theSplit[theFirstRowThatContainsMinusMinusAndPipe - 2],
        "#*_ "
      ).endsWith(":") &&
      theSplit[theFirstRowThatContainsMinusMinusAndPipe - 3].trim() === ""
    ) {
      firstRowsUpForDeletionIndex =
        theFirstRowThatContainsMinusMinusAndPipe - 3;
    }

    // Once the top row is found, line above it goes as well as every single line
    // under it, which contains vertical pipe. The first row that does not contains
    // the pipe underneath breaks this deletion process.
    for (let i = 0, len = theSplit.length; i < len; i++) {
      // we're cycling form zero again not from "theFirstRowThatContainsMinusMinusAndPipe"
      // because we need to record original indexes. We can't shift the starting index.
      if (i > theFirstRowThatContainsMinusMinusAndPipe) {
        if (theSplit[i].includes("|")) {
          lastRowsUpForDeletionIndex = i;
        } else {
          break;
        }
      }
    }

    stringBefore = theSplit
      .filter(
        (rowsStringValue, rowsIndex) => rowsIndex < firstRowsUpForDeletionIndex
      )
      .join("\n");

    if (stringBefore.length > 0) {
      stringBefore += "\n\n";
    }

    stringAfter = theSplit
      .filter(
        (rowsStringValue, rowsIndex) => rowsIndex > lastRowsUpForDeletionIndex
      )
      .join("\n");

    if (stringAfter.length > 0) {
      stringAfter += "\n\n";
    }
  }

  return stringBefore + rollupTable + stringAfter;
}

// -----------------------------------------------------------------------------

function parseReadme(str) {
  // sanity checks in case a dud md file was given
  if (typeof str !== "string" || !str.includes("#")) {
    return null;
  }
  let sliceStartsAt = 0; // this is a moving marker at which we cut
  const gatheredContent = [];
  let withiBackticksBlock = false;

  for (let i = 0, len = str.length; i < len; i++) {
    // catch three backticks block
    if (`${str[i]}${str[i + 1]}${str[i + 2]}` === "```") {
      if (!withiBackticksBlock) {
        withiBackticksBlock = true;
      } else {
        withiBackticksBlock = false;
      }
    }
    // catch a new line
    if (str[i - 1] === "\n" && str[i] !== "\n" && !withiBackticksBlock) {
      if (
        `${str[i]}${str[i + 1]}` === "# " ||
        `${str[i]}${str[i + 1]}${str[i + 2]}` === "## " ||
        `${str[i]}${str[i + 1]}${str[i + 2]}${str[i + 3]}` === "### " ||
        `${str[i]}${str[i + 1]}${str[i + 2]}${str[i + 3]}${str[i + 4]}` ===
          "#### "
      ) {
        gatheredContent.push(str.slice(sliceStartsAt, i));
        sliceStartsAt = i;
      }
    }
    // catch the ending of a string
    if (str[i + 1] === undefined) {
      gatheredContent.push(str.slice(sliceStartsAt, i));
    }
  }

  // at this moment we have the readme sliced by heading (h1, h2 or h3)
  return gatheredContent.map((chunk) => {
    const res = chunk.split(/\r?\n/);
    if (
      res.length > 0 &&
      res[0] !== undefined &&
      res[0].trim().length > 0 &&
      res[0].includes("#")
    ) {
      const heading = chunk.split(/\r?\n/)[0];
      const restofit = chunk
        .split(/\r?\n/)
        .filter((el, i) => i !== 0)
        .filter(
          (el) =>
            !(
              el.replace(/&nbsp;/g, " ").includes("back to top") &&
              el.includes("[")
            )
        )
        .join("\n")
        .trim();

      const lineCount = res.length;
      return { heading, restofit, lineCount };
    }
    return chunk;
  });
}

// -----------------------------------------------------------------------------

function getUserInfo(username) {
  return request
    .get({
      url: `https://api.github.com/users/${username}`,
      headers: {
        "user-agent": "lect",
      },
    })
    .then((response) => {
      const body = JSON.parse(response.body);
      return {
        login: body.login,
        name: body.name || username,
        avatar_url: body.avatar_url,
        profile: body.blog || body.html_url,
      };
    });
  // .catch(() => {})
}
// -----------------------------------------------------------------------------

function standardiseBools(astOrSomething) {
  astOrSomething = traverse(astOrSomething, (key, val) => {
    const current = val !== undefined ? val : key;
    if (!isArr(current) && !isObj(current)) {
      return !!current;
    }
    return current;
  });
  return astOrSomething;
}

// -----------------------------------------------------------------------------

// updates all paths with correct project.
// anticipates for the case where you just copied another library into this one
// and so your GitHub user is correct, just project name needs updating.
function normalisePackageJson(obj, gitHubUser, projName) {
  if (!isObj(obj)) {
    return obj;
  }

  objectPath.set(obj, "repository", {
    type: "git",
    url: `https://bitbucket.org/${gitHubUser}/${projName}.git`,
  });

  objectPath.set(obj, "bugs", {
    url: `https://bitbucket.org/${gitHubUser}/${projName}/issues`,
  });

  if (
    !objectPath.has(obj, "homepage") ||
    !isStr(obj.homepage) ||
    obj.homepage.includes("#readme")
  ) {
    objectPath.set(
      obj,
      "homepage",
      `https://bitbucket.org/${gitHubUser}/${projName}#readme`
    );
  }

  return obj;
}

// -----------------------------------------------------------------------------

module.exports = {
  resolveVars,
  extractSrc,
  removeRecognisedLintingBadges,
  replaceNpmInstallRow,
  replaceNpxRow,
  piecesHeadingIsNotAmongExcluded,
  extractStringUnderBadges,
  replaceRollupInfoTableAndItsHeader,
  parseReadme,
  getUserInfo,
  assembleRollupInfoTable,
  standardiseBools,
  normalisePackageJson,
};
