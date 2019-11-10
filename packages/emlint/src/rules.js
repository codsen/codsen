// here we fetch the rules from all the places,
// to start with, from /src/rules

// IMPORTS AND CONSTS
// -----------------------------------------------------------------------------

import defineLazyProp from "define-lazy-prop";
const builtInRules = {};

// CHARACTER-LEVEL rules
// -----------------------------------------------------------------------------

import badCharacterNull from "./rules/bad-character-null";
defineLazyProp(builtInRules, "bad-character-null", () => badCharacterNull);

// TAG-LEVEL rules
// -----------------------------------------------------------------------------

import tagSpaceAfterOpeningBracket from "./rules/tag-space-after-opening-bracket";
defineLazyProp(
  builtInRules,
  "tag-space-after-opening-bracket",
  () => tagSpaceAfterOpeningBracket
);

// EXPORTS
// -----------------------------------------------------------------------------

function get(something) {
  return builtInRules[something];
}

export { get };
