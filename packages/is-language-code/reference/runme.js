// reads src/language-subtag-registry.txt and bakes JSON files
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");

// READ
// -----------------------------------------------------------------------------

// source: https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
const fileName = `language-subtag-registry.txt`;
const ianaSpec = fs.readFileSync(
  path.resolve(`reference/${fileName}`),
  "utf-8"
);
console.log(
  `${`\u001b[${90}m${`reference/runme.js:`}\u001b[${39}m`} read ${`\u001b[${33}m${
    ianaSpec.length
  }\u001b[${39}m`} characters from ${fileName}`
);

// PROCESS ianaSpec
// ████████████████

const tag_types = [];

const language = [];
const extlang = [];
const grandfathered = [];
const redundant = [];
const region = [];
const script = [];
const variant = [];
const ranged = [];

ianaSpec
  .split("%%")
  .filter(val => val.trim().length && val.includes("Type:"))
  .forEach(val => {
    const splitLinesArr = val.split("\n").filter(val => val.trim().length);

    let type;
    let value;
    // 1. extract the type and value
    splitLinesArr.forEach(lineStr => {
      if (lineStr.startsWith("Type:")) {
        type = lineStr
          .slice(5)
          .trim()
          .toLowerCase();
      } else if (lineStr.startsWith("Subtag:")) {
        value = lineStr
          .slice(7)
          .trim()
          .toLowerCase();
      } else if (lineStr.startsWith("Tag:")) {
        value = lineStr
          .slice(4)
          .trim()
          .toLowerCase();
      }
    });

    // 2. push to the arrays if value is unique
    if (!value.includes("..")) {
      if (type === "extlang" && !extlang.includes(value.toLowerCase())) {
        extlang.push(value.toLowerCase());
      } else if (
        type === "grandfathered" &&
        !grandfathered.includes(value.toLowerCase())
      ) {
        grandfathered.push(value.toLowerCase());
      } else if (
        type === "language" &&
        !language.includes(value.toLowerCase())
      ) {
        language.push(value.toLowerCase());
      } else if (
        type === "redundant" &&
        !redundant.includes(value.toLowerCase())
      ) {
        redundant.push(value.toLowerCase());
      } else if (type === "region" && !region.includes(value.toLowerCase())) {
        region.push(value.toLowerCase());
      } else if (type === "script" && !script.includes(value.toLowerCase())) {
        script.push(value.toLowerCase());
      } else if (type === "variant" && !variant.includes(value.toLowerCase())) {
        variant.push(value.toLowerCase());
      }
    } else {
      // For example, Subtag: qaa..qtz
      // this covers quite a few subtags and we have to write regexes
      ranged.push({
        type,
        value
      });
    }

    // 3. compile unique types array "tag_types"
    if (!tag_types.includes(type.toLowerCase())) {
      tag_types.push(type.toLowerCase());
    }
  });

// FINALLY, WRITE
// ------------------------------------------------------------------------

fs.writeFileSync(
  path.resolve("src/tag_types.json"),
  JSON.stringify(tag_types.sort(), null, 4)
);
//
fs.writeFileSync(
  path.resolve("src/tag_extlang.json"),
  JSON.stringify(extlang.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_grandfathered.json"),
  JSON.stringify(grandfathered.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_language.json"),
  JSON.stringify(language.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_redundant.json"),
  JSON.stringify(redundant.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_region.json"),
  JSON.stringify(region.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_script.json"),
  JSON.stringify(script.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_variant.json"),
  JSON.stringify(variant.sort(), null, 4)
);
fs.writeFileSync(
  path.resolve("src/tag_ranged.json"),
  JSON.stringify(ranged.sort(), null, 4)
);

console.log(
  `${`\u001b[${90}m${`reference/runme.js:`}\u001b[${39}m`} ${`\u001b[${32}m${`SUCCESS`}\u001b[${39}m`}, all files written`
);
