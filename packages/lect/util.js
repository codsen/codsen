/* eslint no-param-reassign:0, no-continue:0, no-console:0,
no-loop-func:0, prefer-destructuring:0 */

const objectPath = require("object-path");
const trim = require("lodash.trim");

const currentTime = new Date();
const year = currentTime.getFullYear();

function resolveVars(str, pack, parsedPack) {
  // if contributors section exists in package.json, get contributors' count from there
  let count = 0;
  if (
    objectPath.has(pack, "lect.contributors") &&
    Array.isArray(pack.lect.contributors)
  ) {
    count = pack.lect.contributors.length;
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

module.exports = {
  resolveVars,
  extractSrc,
  replaceNpmInstallRow,
  replaceNpxRow,
};
