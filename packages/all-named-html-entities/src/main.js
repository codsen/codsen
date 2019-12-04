import allNamedEntities from "./allNamedEntities.json";
import brokenNamedEntities from "./brokenNamedEntities.json";

import entStartsWith from "./startsWith.json";
import entEndsWith from "./endsWith.json";

import entStartsWithCaseInsensitive from "./startsWithCaseInsensitive.json";
import entEndsWithCaseInsensitive from "./endsWithCaseInsensitive.json";

import uncertain from "./uncertain.json";

// -----------------------------------------------------------------------------

// import fs from "fs";
// const all = Object.keys(allNamedEntities);
// const allCaseInsensitive = [];
//
// all.forEach(entity => {
//   if (!allCaseInsensitive.includes(entity.toLowerCase())) {
//     allCaseInsensitive.push(entity.toLowerCase());
//   }
// });
//
// // GENERATOR:
//
// function assemble(entitiesArr, startsWithObj, endsWithObj) {
//   for (let i = 0, len = entitiesArr.length; i < len; i++) {
//     // if key for the first letter of this entity does not exist, create it:
//     const firstLetter = entitiesArr[i][0];
//     const secondLetter = entitiesArr[i][1];
//
//     if (!startsWithObj.hasOwnProperty(firstLetter)) {
//       startsWithObj[firstLetter] = {};
//     }
//     if (!startsWithObj[firstLetter].hasOwnProperty(secondLetter)) {
//       startsWithObj[firstLetter][secondLetter] = [];
//     }
//     // push into array by first letter:
//     startsWithObj[firstLetter][secondLetter].push(entitiesArr[i]);
//
//     // if key for the last letter of this entity does not exist, create it:
//     const lastLetter = entitiesArr[i][entitiesArr[i].length - 1];
//     const secondToLastLetter = entitiesArr[i][entitiesArr[i].length - 2];
//     if (!endsWithObj.hasOwnProperty(lastLetter)) {
//       endsWithObj[lastLetter] = {};
//     }
//     if (!endsWithObj[lastLetter].hasOwnProperty(secondToLastLetter)) {
//       endsWithObj[lastLetter][secondToLastLetter] = [];
//     }
//     // push into array by last letter:
//     endsWithObj[lastLetter][secondToLastLetter].push(entitiesArr[i]);
//   }
// }
//
// // PLAN:
// // assemble startsWith; group by first letter so we get:
// // startsWith = {
// //   a: [ ... ],
// //   b: [ ... ],
// //   ...
// // }
//
// // define empty objects:
// const startsWith = {};
// const endsWith = {};
// const startsWithCaseInsensitive = {};
// const endsWithCaseInsensitive = {};
//
// // mutate the pairs, case sensitive ones and insensitive:
// assemble(all, startsWith, endsWith);
// assemble(
//   allCaseInsensitive,
//   startsWithCaseInsensitive,
//   endsWithCaseInsensitive
// );
//
// fs.writeFileSync("src/startsWith.json", JSON.stringify(startsWith, null, 4));
// fs.writeFileSync("src/endsWith.json", JSON.stringify(endsWith, null, 4));
// fs.writeFileSync(
//   "src/startsWithCaseInsensitive.json",
//   JSON.stringify(startsWithCaseInsensitive, null, 4)
// );
// fs.writeFileSync(
//   "src/endsWithCaseInsensitive.json",
//   JSON.stringify(endsWithCaseInsensitive, null, 4)
// );

function decode(ent) {
  if (
    typeof ent !== "string" ||
    !ent.length ||
    !ent.startsWith("&") ||
    !ent.endsWith(";")
  ) {
    throw new Error(
      `all-named-html-entities/decode(): [THROW_ID_01] Input must be an HTML entity with leading ampersand and trailing semicolon, but "${ent}" was given`
    );
  }
  const val = ent.slice(1, ent.length - 1);
  return allNamedEntities[val] ? allNamedEntities[val] : null;
}

// -----------------------------------------------------------------------------

// const minLength = Math.min(
//   ...Object.keys(allNamedEntities).map(entName => entName.length)
// );
// const maxLength = Math.max(
//   ...Object.keys(allNamedEntities).map(entName => entName.length)
// );
const minLength = 2;
const maxLength = 31;

// -----------------------------------------------------------------------------

export {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain
};
