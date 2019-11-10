// here we fetch the rules from all the places,
// to start with, from /src/rules

import defineLazyProp from "define-lazy-prop";
import tagSpaceAfterOpeningBracket from "./rules/tag-space-after-opening-bracket";

const builtInRules = {};

defineLazyProp(
  builtInRules,
  "tag-space-after-opening-bracket",
  () => tagSpaceAfterOpeningBracket
);

function get(something) {
  return builtInRules[something];
}

export { get };
