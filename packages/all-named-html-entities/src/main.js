import allNamedEntities from "./allNamedEntities.json";
import entStartsWith from "./startsWith.json";
import entEndsWith from "./endsWith.json";

// -----------------------------------------------------------------------------

// import fs from "fs";
// const all = Object.keys(allNamedEntities);

// // GENERATOR:
//
// const startsWith = {};
// const endsWith = {};
//
// // assemble startsWith; group by first letter so we get:
// // startsWith = {
// //   a: [ ... ],
// //   b: [ ... ],
// //   ...
// // }
//
// for (let i = 0, len = all.length; i < len; i++) {
//   // if key for the first letter of this entity does not exist, create it:
//   const firstLetter = all[i][0];
//   const secondLetter = all[i][1];
//
//   if (!startsWith.hasOwnProperty(firstLetter)) {
//     startsWith[firstLetter] = {};
//   }
//   if (!startsWith[firstLetter].hasOwnProperty(secondLetter)) {
//     startsWith[firstLetter][secondLetter] = [];
//   }
//   // push into array by first letter:
//   startsWith[firstLetter][secondLetter].push(all[i]);
//
//   // if key for the last letter of this entity does not exist, create it:
//   const lastLetter = all[i][all[i].length - 1];
//   const secondToLastLetter = all[i][all[i].length - 2];
//   if (!endsWith.hasOwnProperty(lastLetter)) {
//     endsWith[lastLetter] = {};
//   }
//   if (!endsWith[lastLetter].hasOwnProperty(secondToLastLetter)) {
//     endsWith[lastLetter][secondToLastLetter] = [];
//   }
//   // push into array by last letter:
//   endsWith[lastLetter][secondToLastLetter].push(all[i]);
// }
//
// fs.writeFileSync("src/startsWith.json", JSON.stringify(startsWith, null, 4));
// fs.writeFileSync("src/endsWith.json", JSON.stringify(endsWith, null, 4));

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
  console.log(
    `${`\u001b[${33}m${`val`}\u001b[${39}m`} = ${JSON.stringify(val, null, 4)}`
  );
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

export { entStartsWith, entEndsWith, decode, minLength, maxLength };
