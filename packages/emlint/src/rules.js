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
import badCharacterStartOfHeading from "./rules/bad-character-start-of-heading";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-heading",
  () => badCharacterStartOfHeading
);
import badCharacterStartOfText from "./rules/bad-character-start-of-text";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-text",
  () => badCharacterStartOfText
);
import badCharacterEndOfText from "./rules/bad-character-end-of-text";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-text",
  () => badCharacterEndOfText
);
import badCharacterEndOfTransmission from "./rules/bad-character-end-of-transmission";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission",
  () => badCharacterEndOfTransmission
);
import badCharacterEnquiry from "./rules/bad-character-enquiry";
defineLazyProp(
  builtInRules,
  "bad-character-enquiry",
  () => badCharacterEnquiry
);
import badCharacterAcknowledge from "./rules/bad-character-acknowledge";
defineLazyProp(
  builtInRules,
  "bad-character-acknowledge",
  () => badCharacterAcknowledge
);
import badCharacterBell from "./rules/bad-character-bell";
defineLazyProp(builtInRules, "bad-character-bell", () => badCharacterBell);
import badCharacterBackspace from "./rules/bad-character-backspace";
defineLazyProp(
  builtInRules,
  "bad-character-backspace",
  () => badCharacterBackspace
);
import badCharacterTabulation from "./rules/bad-character-character-tabulation";
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation",
  () => badCharacterTabulation
);
import badCharacterLineTabulation from "./rules/bad-character-line-tabulation";
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation",
  () => badCharacterLineTabulation
);

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
