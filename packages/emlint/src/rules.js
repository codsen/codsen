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

import badCharacterFormFeed from "./rules/bad-character-form-feed";
defineLazyProp(
  builtInRules,
  "bad-character-form-feed",
  () => badCharacterFormFeed
);

import badCharacterShiftOut from "./rules/bad-character-shift-out";
defineLazyProp(
  builtInRules,
  "bad-character-shift-out",
  () => badCharacterShiftOut
);

import badCharacterShiftIn from "./rules/bad-character-shift-in";
defineLazyProp(
  builtInRules,
  "bad-character-shift-in",
  () => badCharacterShiftIn
);

import badCharacterDataLinkEscape from "./rules/bad-character-data-link-escape";
defineLazyProp(
  builtInRules,
  "bad-character-data-link-escape",
  () => badCharacterDataLinkEscape
);

import badCharacterDeviceControlOne from "./rules/bad-character-device-control-one";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-one",
  () => badCharacterDeviceControlOne
);

import badCharacterDeviceControlTwo from "./rules/bad-character-device-control-two";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-two",
  () => badCharacterDeviceControlTwo
);

import badCharacterDeviceControlThree from "./rules/bad-character-device-control-three";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-three",
  () => badCharacterDeviceControlThree
);

import badCharacterDeviceControlFour from "./rules/bad-character-device-control-four";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-four",
  () => badCharacterDeviceControlFour
);

import badCharacterNegativeAcknowledge from "./rules/bad-character-negative-acknowledge";
defineLazyProp(
  builtInRules,
  "bad-character-negative-acknowledge",
  () => badCharacterNegativeAcknowledge
);

import badCharacterSynchronousIdle from "./rules/bad-character-synchronous-idle";
defineLazyProp(
  builtInRules,
  "bad-character-synchronous-idle",
  () => badCharacterSynchronousIdle
);

import badCharacterEndOfTransmissionBlock from "./rules/bad-character-end-of-transmission-block";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission-block",
  () => badCharacterEndOfTransmissionBlock
);

import badCharacterCancel from "./rules/bad-character-cancel";
defineLazyProp(builtInRules, "bad-character-cancel", () => badCharacterCancel);

import badCharacterEndOfMedium from "./rules/bad-character-end-of-medium";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-medium",
  () => badCharacterEndOfMedium
);

import badCharacterSubstitute from "./rules/bad-character-substitute";
defineLazyProp(
  builtInRules,
  "bad-character-substitute",
  () => badCharacterSubstitute
);

import badCharacterEscape from "./rules/bad-character-escape";
defineLazyProp(builtInRules, "bad-character-escape", () => badCharacterEscape);

import badCharacterInformationSeparatorFour from "./rules/bad-character-information-separator-four";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-four",
  () => badCharacterInformationSeparatorFour
);

import badCharacterInformationSeparatorThree from "./rules/bad-character-information-separator-three";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-three",
  () => badCharacterInformationSeparatorThree
);

import badCharacterInformationSeparatorTwo from "./rules/bad-character-information-separator-two";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-two",
  () => badCharacterInformationSeparatorTwo
);

import badCharacterInformationSeparatorOne from "./rules/bad-character-information-separator-one";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-one",
  () => badCharacterInformationSeparatorOne
);

import badCharacterDelete from "./rules/bad-character-delete";
defineLazyProp(builtInRules, "bad-character-delete", () => badCharacterDelete);

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
