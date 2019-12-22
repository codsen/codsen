// here we fetch the rules from all the places,
// to start with, from /src/rules

// IMPORTS AND CONSTS
// -----------------------------------------------------------------------------

import defineLazyProp from "define-lazy-prop";
import allBadCharacterRules from "./rules/all-bad-character.json";
import allTagRules from "./rules/all-tag.json";
import allAttribRules from "./rules/all-attribute.json";
import allBadNamedHTMLEntityRules from "./rules/all-bad-named-html-entity.json";
import clone from "lodash.clonedeep";
import matcher from "matcher";
const builtInRules = {};
import { isEnabled } from "./util/util";

// CHARACTER-LEVEL rules
// -----------------------------------------------------------------------------

import badCharacterNull from "./rules/bad-character/bad-character-null";
defineLazyProp(builtInRules, "bad-character-null", () => badCharacterNull);

import badCharacterStartOfHeading from "./rules/bad-character/bad-character-start-of-heading";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-heading",
  () => badCharacterStartOfHeading
);

import badCharacterStartOfText from "./rules/bad-character/bad-character-start-of-text";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-text",
  () => badCharacterStartOfText
);

import badCharacterEndOfText from "./rules/bad-character/bad-character-end-of-text";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-text",
  () => badCharacterEndOfText
);

import badCharacterEndOfTransmission from "./rules/bad-character/bad-character-end-of-transmission";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission",
  () => badCharacterEndOfTransmission
);

import badCharacterEnquiry from "./rules/bad-character/bad-character-enquiry";
defineLazyProp(
  builtInRules,
  "bad-character-enquiry",
  () => badCharacterEnquiry
);

import badCharacterAcknowledge from "./rules/bad-character/bad-character-acknowledge";
defineLazyProp(
  builtInRules,
  "bad-character-acknowledge",
  () => badCharacterAcknowledge
);

import badCharacterBell from "./rules/bad-character/bad-character-bell";
defineLazyProp(builtInRules, "bad-character-bell", () => badCharacterBell);

import badCharacterBackspace from "./rules/bad-character/bad-character-backspace";
defineLazyProp(
  builtInRules,
  "bad-character-backspace",
  () => badCharacterBackspace
);

import badCharacterTabulation from "./rules/bad-character/bad-character-tabulation";
defineLazyProp(
  builtInRules,
  "bad-character-tabulation",
  () => badCharacterTabulation
);

import badCharacterLineTabulation from "./rules/bad-character/bad-character-line-tabulation";
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation",
  () => badCharacterLineTabulation
);

import badCharacterFormFeed from "./rules/bad-character/bad-character-form-feed";
defineLazyProp(
  builtInRules,
  "bad-character-form-feed",
  () => badCharacterFormFeed
);

import badCharacterShiftOut from "./rules/bad-character/bad-character-shift-out";
defineLazyProp(
  builtInRules,
  "bad-character-shift-out",
  () => badCharacterShiftOut
);

import badCharacterShiftIn from "./rules/bad-character/bad-character-shift-in";
defineLazyProp(
  builtInRules,
  "bad-character-shift-in",
  () => badCharacterShiftIn
);

import badCharacterDataLinkEscape from "./rules/bad-character/bad-character-data-link-escape";
defineLazyProp(
  builtInRules,
  "bad-character-data-link-escape",
  () => badCharacterDataLinkEscape
);

import badCharacterDeviceControlOne from "./rules/bad-character/bad-character-device-control-one";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-one",
  () => badCharacterDeviceControlOne
);

import badCharacterDeviceControlTwo from "./rules/bad-character/bad-character-device-control-two";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-two",
  () => badCharacterDeviceControlTwo
);

import badCharacterDeviceControlThree from "./rules/bad-character/bad-character-device-control-three";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-three",
  () => badCharacterDeviceControlThree
);

import badCharacterDeviceControlFour from "./rules/bad-character/bad-character-device-control-four";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-four",
  () => badCharacterDeviceControlFour
);

import badCharacterNegativeAcknowledge from "./rules/bad-character/bad-character-negative-acknowledge";
defineLazyProp(
  builtInRules,
  "bad-character-negative-acknowledge",
  () => badCharacterNegativeAcknowledge
);

import badCharacterSynchronousIdle from "./rules/bad-character/bad-character-synchronous-idle";
defineLazyProp(
  builtInRules,
  "bad-character-synchronous-idle",
  () => badCharacterSynchronousIdle
);

import badCharacterEndOfTransmissionBlock from "./rules/bad-character/bad-character-end-of-transmission-block";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission-block",
  () => badCharacterEndOfTransmissionBlock
);

import badCharacterCancel from "./rules/bad-character/bad-character-cancel";
defineLazyProp(builtInRules, "bad-character-cancel", () => badCharacterCancel);

import badCharacterEndOfMedium from "./rules/bad-character/bad-character-end-of-medium";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-medium",
  () => badCharacterEndOfMedium
);

import badCharacterSubstitute from "./rules/bad-character/bad-character-substitute";
defineLazyProp(
  builtInRules,
  "bad-character-substitute",
  () => badCharacterSubstitute
);

import badCharacterEscape from "./rules/bad-character/bad-character-escape";
defineLazyProp(builtInRules, "bad-character-escape", () => badCharacterEscape);

import badCharacterInformationSeparatorFour from "./rules/bad-character/bad-character-information-separator-four";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-four",
  () => badCharacterInformationSeparatorFour
);

import badCharacterInformationSeparatorThree from "./rules/bad-character/bad-character-information-separator-three";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-three",
  () => badCharacterInformationSeparatorThree
);

import badCharacterInformationSeparatorTwo from "./rules/bad-character/bad-character-information-separator-two";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-two",
  () => badCharacterInformationSeparatorTwo
);

import badCharacterInformationSeparatorOne from "./rules/bad-character/bad-character-information-separator-one";
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-one",
  () => badCharacterInformationSeparatorOne
);

import badCharacterDelete from "./rules/bad-character/bad-character-delete";
defineLazyProp(builtInRules, "bad-character-delete", () => badCharacterDelete);

import badCharacterControl0080 from "./rules/bad-character/bad-character-control-0080";
defineLazyProp(
  builtInRules,
  "bad-character-control-0080",
  () => badCharacterControl0080
);

import badCharacterControl0081 from "./rules/bad-character/bad-character-control-0081";
defineLazyProp(
  builtInRules,
  "bad-character-control-0081",
  () => badCharacterControl0081
);

import badCharacterBreakPermittedHere from "./rules/bad-character/bad-character-break-permitted-here";
defineLazyProp(
  builtInRules,
  "bad-character-break-permitted-here",
  () => badCharacterBreakPermittedHere
);

import badCharacterNoBreakHere from "./rules/bad-character/bad-character-no-break-here";
defineLazyProp(
  builtInRules,
  "bad-character-no-break-here",
  () => badCharacterNoBreakHere
);

import badCharacterControl0084 from "./rules/bad-character/bad-character-control-0084";
defineLazyProp(
  builtInRules,
  "bad-character-control-0084",
  () => badCharacterControl0084
);

import badCharacterNextLine from "./rules/bad-character/bad-character-next-line";
defineLazyProp(
  builtInRules,
  "bad-character-next-line",
  () => badCharacterNextLine
);

import badCharacterStartOfSelectedArea from "./rules/bad-character/bad-character-start-of-selected-area";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-selected-area",
  () => badCharacterStartOfSelectedArea
);

import badCharacterEndOfSelectedArea from "./rules/bad-character/bad-character-end-of-selected-area";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-selected-area",
  () => badCharacterEndOfSelectedArea
);

import badCharacterCharacterTabulationSet from "./rules/bad-character/bad-character-character-tabulation-set";
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation-set",
  () => badCharacterCharacterTabulationSet
);

import badCharacterCharacterTabulationWithJustification from "./rules/bad-character/bad-character-character-tabulation-with-justification";
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation-with-justification",
  () => badCharacterCharacterTabulationWithJustification
);

import badCharacterLineTabulationSet from "./rules/bad-character/bad-character-line-tabulation-set";
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation-set",
  () => badCharacterLineTabulationSet
);

import badCharacterPartialLineForward from "./rules/bad-character/bad-character-partial-line-forward";
defineLazyProp(
  builtInRules,
  "bad-character-partial-line-forward",
  () => badCharacterPartialLineForward
);

import badCharacterPartialLineBackward from "./rules/bad-character/bad-character-partial-line-backward";
defineLazyProp(
  builtInRules,
  "bad-character-partial-line-backward",
  () => badCharacterPartialLineBackward
);

import badCharacterReverseLineFeed from "./rules/bad-character/bad-character-reverse-line-feed";
defineLazyProp(
  builtInRules,
  "bad-character-reverse-line-feed",
  () => badCharacterReverseLineFeed
);

import badCharacterSingleShiftTwo from "./rules/bad-character/bad-character-single-shift-two";
defineLazyProp(
  builtInRules,
  "bad-character-single-shift-two",
  () => badCharacterSingleShiftTwo
);

import badCharacterSingleShiftThree from "./rules/bad-character/bad-character-single-shift-three";
defineLazyProp(
  builtInRules,
  "bad-character-single-shift-three",
  () => badCharacterSingleShiftThree
);

import badCharacterDeviceControlString from "./rules/bad-character/bad-character-device-control-string";
defineLazyProp(
  builtInRules,
  "bad-character-device-control-string",
  () => badCharacterDeviceControlString
);

import badCharacterPrivateUseOne from "./rules/bad-character/bad-character-private-use-1";
defineLazyProp(
  builtInRules,
  "bad-character-private-use-1",
  () => badCharacterPrivateUseOne
);

import badCharacterPrivateUseTwo from "./rules/bad-character/bad-character-private-use-2";
defineLazyProp(
  builtInRules,
  "bad-character-private-use-2",
  () => badCharacterPrivateUseTwo
);

import badCharacterSetTransmitState from "./rules/bad-character/bad-character-set-transmit-state";
defineLazyProp(
  builtInRules,
  "bad-character-set-transmit-state",
  () => badCharacterSetTransmitState
);

import badCharacterCancelCharacter from "./rules/bad-character/bad-character-cancel-character";
defineLazyProp(
  builtInRules,
  "bad-character-cancel-character",
  () => badCharacterCancelCharacter
);

import badCharacterMessageWaiting from "./rules/bad-character/bad-character-message-waiting";
defineLazyProp(
  builtInRules,
  "bad-character-message-waiting",
  () => badCharacterMessageWaiting
);

import badCharacterStartOfProtectedArea from "./rules/bad-character/bad-character-start-of-protected-area";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-protected-area",
  () => badCharacterStartOfProtectedArea
);

import badCharacterEndOfProtectedArea from "./rules/bad-character/bad-character-end-of-protected-area";
defineLazyProp(
  builtInRules,
  "bad-character-end-of-protected-area",
  () => badCharacterEndOfProtectedArea
);

import badCharacterStartOfString from "./rules/bad-character/bad-character-start-of-string";
defineLazyProp(
  builtInRules,
  "bad-character-start-of-string",
  () => badCharacterStartOfString
);

import badCharacterControl0099 from "./rules/bad-character/bad-character-control-0099";
defineLazyProp(
  builtInRules,
  "bad-character-control-0099",
  () => badCharacterControl0099
);

import badCharacterSingleCharacterIntroducer from "./rules/bad-character/bad-character-single-character-introducer";
defineLazyProp(
  builtInRules,
  "bad-character-single-character-introducer",
  () => badCharacterSingleCharacterIntroducer
);

import badCharacterControlSequenceIntroducer from "./rules/bad-character/bad-character-control-sequence-introducer";
defineLazyProp(
  builtInRules,
  "bad-character-control-sequence-introducer",
  () => badCharacterControlSequenceIntroducer
);

import badCharacterStringTerminator from "./rules/bad-character/bad-character-string-terminator";
defineLazyProp(
  builtInRules,
  "bad-character-string-terminator",
  () => badCharacterStringTerminator
);

import badCharacterOperatingSystemCommand from "./rules/bad-character/bad-character-operating-system-command";
defineLazyProp(
  builtInRules,
  "bad-character-operating-system-command",
  () => badCharacterOperatingSystemCommand
);

import badCharacterPrivateMessage from "./rules/bad-character/bad-character-private-message";
defineLazyProp(
  builtInRules,
  "bad-character-private-message",
  () => badCharacterPrivateMessage
);

import badCharacterApplicationProgramCommand from "./rules/bad-character/bad-character-application-program-command";
defineLazyProp(
  builtInRules,
  "bad-character-application-program-command",
  () => badCharacterApplicationProgramCommand
);

import badCharacterSoftHyphen from "./rules/bad-character/bad-character-soft-hyphen";
defineLazyProp(
  builtInRules,
  "bad-character-soft-hyphen",
  () => badCharacterSoftHyphen
);

// space characters:
// https://www.fileformat.info/info/unicode/category/Zs/list.htm

import badCharacterNonBreakingSpace from "./rules/bad-character/bad-character-non-breaking-space";
defineLazyProp(
  builtInRules,
  "bad-character-non-breaking-space",
  () => badCharacterNonBreakingSpace
);

import badCharacterOghamSpaceMark from "./rules/bad-character/bad-character-ogham-space-mark";
defineLazyProp(
  builtInRules,
  "bad-character-ogham-space-mark",
  () => badCharacterOghamSpaceMark
);

import badCharacterEnQuad from "./rules/bad-character/bad-character-en-quad";
defineLazyProp(builtInRules, "bad-character-en-quad", () => badCharacterEnQuad);

import badCharacterEmQuad from "./rules/bad-character/bad-character-em-quad";
defineLazyProp(builtInRules, "bad-character-em-quad", () => badCharacterEmQuad);

import badCharacterEnSpace from "./rules/bad-character/bad-character-en-space";
defineLazyProp(
  builtInRules,
  "bad-character-en-space",
  () => badCharacterEnSpace
);

import badCharacterEmSpace from "./rules/bad-character/bad-character-em-space";
defineLazyProp(
  builtInRules,
  "bad-character-em-space",
  () => badCharacterEmSpace
);

import badCharacterThreePerEmSpace from "./rules/bad-character/bad-character-three-per-em-space";
defineLazyProp(
  builtInRules,
  "bad-character-three-per-em-space",
  () => badCharacterThreePerEmSpace
);

import badCharacterFourPerEmSpace from "./rules/bad-character/bad-character-four-per-em-space";
defineLazyProp(
  builtInRules,
  "bad-character-four-per-em-space",
  () => badCharacterFourPerEmSpace
);

import badCharacterSixPerEmSpace from "./rules/bad-character/bad-character-six-per-em-space";
defineLazyProp(
  builtInRules,
  "bad-character-six-per-em-space",
  () => badCharacterSixPerEmSpace
);

import badCharacterFigureSpace from "./rules/bad-character/bad-character-figure-space";
defineLazyProp(
  builtInRules,
  "bad-character-figure-space",
  () => badCharacterFigureSpace
);

import badCharacterPunctuationSpace from "./rules/bad-character/bad-character-punctuation-space";
defineLazyProp(
  builtInRules,
  "bad-character-punctuation-space",
  () => badCharacterPunctuationSpace
);

import badCharacterThinSpace from "./rules/bad-character/bad-character-thin-space";
defineLazyProp(
  builtInRules,
  "bad-character-thin-space",
  () => badCharacterThinSpace
);

import badCharacterHairSpace from "./rules/bad-character/bad-character-hair-space";
defineLazyProp(
  builtInRules,
  "bad-character-hair-space",
  () => badCharacterHairSpace
);

import badCharacterZeroWidthSpace from "./rules/bad-character/bad-character-zero-width-space";
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-space",
  () => badCharacterZeroWidthSpace
);

import badCharacterZeroWidthNonJoiner from "./rules/bad-character/bad-character-zero-width-non-joiner";
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-non-joiner",
  () => badCharacterZeroWidthNonJoiner
);

import badCharacterZeroWidthJoiner from "./rules/bad-character/bad-character-zero-width-joiner";
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-joiner",
  () => badCharacterZeroWidthJoiner
);

import badCharacterLeftToRightMark from "./rules/bad-character/bad-character-left-to-right-mark";
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-mark",
  () => badCharacterLeftToRightMark
);

import badCharacterRightToLeftMark from "./rules/bad-character/bad-character-right-to-left-mark";
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-mark",
  () => badCharacterRightToLeftMark
);

import badCharacterLeftToRightEmbedding from "./rules/bad-character/bad-character-left-to-right-embedding";
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-embedding",
  () => badCharacterLeftToRightEmbedding
);

import badCharacterRightToLeftEmbedding from "./rules/bad-character/bad-character-right-to-left-embedding";
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-embedding",
  () => badCharacterRightToLeftEmbedding
);

import badCharacterPopDirectionalFormatting from "./rules/bad-character/bad-character-pop-directional-formatting";
defineLazyProp(
  builtInRules,
  "bad-character-pop-directional-formatting",
  () => badCharacterPopDirectionalFormatting
);

import badCharacterLeftToRightOverride from "./rules/bad-character/bad-character-left-to-right-override";
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-override",
  () => badCharacterLeftToRightOverride
);

import badCharacterRightToLeftOverride from "./rules/bad-character/bad-character-right-to-left-override";
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-override",
  () => badCharacterRightToLeftOverride
);

//

import badCharacterWordJoiner from "./rules/bad-character/bad-character-word-joiner";
defineLazyProp(
  builtInRules,
  "bad-character-word-joiner",
  () => badCharacterWordJoiner
);

import badCharacterFunctionApplication from "./rules/bad-character/bad-character-function-application";
defineLazyProp(
  builtInRules,
  "bad-character-function-application",
  () => badCharacterFunctionApplication
);

import badCharacterInvisibleTimes from "./rules/bad-character/bad-character-invisible-times";
defineLazyProp(
  builtInRules,
  "bad-character-invisible-times",
  () => badCharacterInvisibleTimes
);

import badCharacterInvisibleSeparator from "./rules/bad-character/bad-character-invisible-separator";
defineLazyProp(
  builtInRules,
  "bad-character-invisible-separator",
  () => badCharacterInvisibleSeparator
);

import badCharacterInvisiblePlus from "./rules/bad-character/bad-character-invisible-plus";
defineLazyProp(
  builtInRules,
  "bad-character-invisible-plus",
  () => badCharacterInvisiblePlus
);

import badCharacterLeftToRightIsolate from "./rules/bad-character/bad-character-left-to-right-isolate";
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-isolate",
  () => badCharacterLeftToRightIsolate
);

import badCharacterRightToLeftIsolate from "./rules/bad-character/bad-character-right-to-left-isolate";
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-isolate",
  () => badCharacterRightToLeftIsolate
);

import badCharacterFirstStrongIsolate from "./rules/bad-character/bad-character-first-strong-isolate";
defineLazyProp(
  builtInRules,
  "bad-character-first-strong-isolate",
  () => badCharacterFirstStrongIsolate
);

import badCharacterPopDirectionalIsolate from "./rules/bad-character/bad-character-pop-directional-isolate";
defineLazyProp(
  builtInRules,
  "bad-character-pop-directional-isolate",
  () => badCharacterPopDirectionalIsolate
);

import badCharacterInhibitSymmetricSwapping from "./rules/bad-character/bad-character-inhibit-symmetric-swapping";
defineLazyProp(
  builtInRules,
  "bad-character-inhibit-symmetric-swapping",
  () => badCharacterInhibitSymmetricSwapping
);

import badCharacterActivateSymmetricSwapping from "./rules/bad-character/bad-character-activate-symmetric-swapping";
defineLazyProp(
  builtInRules,
  "bad-character-activate-symmetric-swapping",
  () => badCharacterActivateSymmetricSwapping
);

import badCharacterInhibitArabicFormShaping from "./rules/bad-character/bad-character-inhibit-arabic-form-shaping";
defineLazyProp(
  builtInRules,
  "bad-character-inhibit-arabic-form-shaping",
  () => badCharacterInhibitArabicFormShaping
);

import badCharacterActivateArabicFormShaping from "./rules/bad-character/bad-character-activate-arabic-form-shaping";
defineLazyProp(
  builtInRules,
  "bad-character-activate-arabic-form-shaping",
  () => badCharacterActivateArabicFormShaping
);

import badCharacterNationalDigitShapes from "./rules/bad-character/bad-character-national-digit-shapes";
defineLazyProp(
  builtInRules,
  "bad-character-national-digit-shapes",
  () => badCharacterNationalDigitShapes
);

import badCharacterNominalDigitShapes from "./rules/bad-character/bad-character-nominal-digit-shapes";
defineLazyProp(
  builtInRules,
  "bad-character-nominal-digit-shapes",
  () => badCharacterNominalDigitShapes
);

import badCharacterZeroWidthNoBreakSpace from "./rules/bad-character/bad-character-zero-width-no-break-space";
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-no-break-space",
  () => badCharacterZeroWidthNoBreakSpace
);

import badCharacterInterlinearAnnotationAnchor from "./rules/bad-character/bad-character-interlinear-annotation-anchor";
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-anchor",
  () => badCharacterInterlinearAnnotationAnchor
);

import badCharacterInterlinearAnnotationSeparator from "./rules/bad-character/bad-character-interlinear-annotation-separator";
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-separator",
  () => badCharacterInterlinearAnnotationSeparator
);

import badCharacterInterlinearAnnotationTerminator from "./rules/bad-character/bad-character-interlinear-annotation-terminator";
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-terminator",
  () => badCharacterInterlinearAnnotationTerminator
);

import badCharacterLineSeparator from "./rules/bad-character/bad-character-line-separator";
defineLazyProp(
  builtInRules,
  "bad-character-line-separator",
  () => badCharacterLineSeparator
);

import badCharacterParagraphSeparator from "./rules/bad-character/bad-character-paragraph-separator";
defineLazyProp(
  builtInRules,
  "bad-character-paragraph-separator",
  () => badCharacterParagraphSeparator
);

//

import badCharacterNarrowNoBreakSpace from "./rules/bad-character/bad-character-narrow-no-break-space";
defineLazyProp(
  builtInRules,
  "bad-character-narrow-no-break-space",
  () => badCharacterNarrowNoBreakSpace
);

import badCharacterMediumMathematicalSpace from "./rules/bad-character/bad-character-medium-mathematical-space";
defineLazyProp(
  builtInRules,
  "bad-character-medium-mathematical-space",
  () => badCharacterMediumMathematicalSpace
);

import badCharacterIdeographicSpace from "./rules/bad-character/bad-character-ideographic-space";
defineLazyProp(
  builtInRules,
  "bad-character-ideographic-space",
  () => badCharacterIdeographicSpace
);

import badCharacterReplacementCharacter from "./rules/bad-character/bad-character-replacement-character";
defineLazyProp(
  builtInRules,
  "bad-character-replacement-character",
  () => badCharacterReplacementCharacter
);

// TAG-LEVEL rules
// -----------------------------------------------------------------------------

import tagSpaceAfterOpeningBracket from "./rules/tag/tag-space-after-opening-bracket";
defineLazyProp(
  builtInRules,
  "tag-space-after-opening-bracket",
  () => tagSpaceAfterOpeningBracket
);

import tagSpaceBeforeClosingSlash from "./rules/tag/tag-space-before-closing-slash";
defineLazyProp(
  builtInRules,
  "tag-space-before-closing-slash",
  () => tagSpaceBeforeClosingSlash
);

import tagSpaceBetweenSlashAndBracket from "./rules/tag/tag-space-between-slash-and-bracket";
defineLazyProp(
  builtInRules,
  "tag-space-between-slash-and-bracket",
  () => tagSpaceBetweenSlashAndBracket
);

import tagClosingBackslash from "./rules/tag/tag-closing-backslash";
defineLazyProp(
  builtInRules,
  "tag-closing-backslash",
  () => tagClosingBackslash
);

import tagVoidSlash from "./rules/tag/tag-void-slash";
defineLazyProp(builtInRules, "tag-void-slash", () => tagVoidSlash);

import tagNameCase from "./rules/tag/tag-name-case";
defineLazyProp(builtInRules, "tag-name-case", () => tagNameCase);

import tagIsPresent from "./rules/tag/tag-is-present";
defineLazyProp(builtInRules, "tag-is-present", () => tagIsPresent);

import tagBold from "./rules/tag/tag-bold";
defineLazyProp(builtInRules, "tag-bold", () => tagBold);

// ATTRIBUTE rules
// -----------------------------------------------------------------------------

import attributeMalformed from "./rules/attribute/attribute-malformed";
defineLazyProp(builtInRules, "attribute-malformed", () => attributeMalformed);

// ATTRIBUTE-VALIDATE- rules
// -----------------------------------------------------------------------------

import attributeValidateAbbr from "./rules/attribute-validate/attribute-validate-abbr";
defineLazyProp(
  builtInRules,
  "attribute-validate-abbr",
  () => attributeValidateAbbr
);

import attributeValidateAcceptCharset from "./rules/attribute-validate/attribute-validate-accept-charset";
defineLazyProp(
  builtInRules,
  "attribute-validate-accept-charset",
  () => attributeValidateAcceptCharset
);

import attributeValidateAccept from "./rules/attribute-validate/attribute-validate-accept";
defineLazyProp(
  builtInRules,
  "attribute-validate-accept",
  () => attributeValidateAccept
);

import attributeValidateAccesskey from "./rules/attribute-validate/attribute-validate-accesskey";
defineLazyProp(
  builtInRules,
  "attribute-validate-accesskey",
  () => attributeValidateAccesskey
);

import attributeValidateAction from "./rules/attribute-validate/attribute-validate-action";
defineLazyProp(
  builtInRules,
  "attribute-validate-action",
  () => attributeValidateAction
);

import attributeValidateAlign from "./rules/attribute-validate/attribute-validate-align";
defineLazyProp(
  builtInRules,
  "attribute-validate-align",
  () => attributeValidateAlign
);

import attributeValidateAlink from "./rules/attribute-validate/attribute-validate-alink";
defineLazyProp(
  builtInRules,
  "attribute-validate-alink",
  () => attributeValidateAlink
);

import attributeValidateArchive from "./rules/attribute-validate/attribute-validate-archive";
defineLazyProp(
  builtInRules,
  "attribute-validate-archive",
  () => attributeValidateArchive
);

import attributeValidateAxis from "./rules/attribute-validate/attribute-validate-axis";
defineLazyProp(
  builtInRules,
  "attribute-validate-axis",
  () => attributeValidateAxis
);

import attributeValidateBackground from "./rules/attribute-validate/attribute-validate-background";
defineLazyProp(
  builtInRules,
  "attribute-validate-background",
  () => attributeValidateBackground
);

import attributeValidateBgcolor from "./rules/attribute-validate/attribute-validate-bgcolor";
defineLazyProp(
  builtInRules,
  "attribute-validate-bgcolor",
  () => attributeValidateBgcolor
);

import attributeValidateBorder from "./rules/attribute-validate/attribute-validate-border";
defineLazyProp(
  builtInRules,
  "attribute-validate-border",
  () => attributeValidateBorder
);

import attributeValidateCellpadding from "./rules/attribute-validate/attribute-validate-cellpadding";
defineLazyProp(
  builtInRules,
  "attribute-validate-cellpadding",
  () => attributeValidateCellpadding
);

import attributeValidateCellspacing from "./rules/attribute-validate/attribute-validate-cellspacing";
defineLazyProp(
  builtInRules,
  "attribute-validate-cellspacing",
  () => attributeValidateCellspacing
);

import attributeValidateChar from "./rules/attribute-validate/attribute-validate-char";
defineLazyProp(
  builtInRules,
  "attribute-validate-char",
  () => attributeValidateChar
);

import attributeValidateCharoff from "./rules/attribute-validate/attribute-validate-charoff";
defineLazyProp(
  builtInRules,
  "attribute-validate-charoff",
  () => attributeValidateCharoff
);

import attributeValidateCharset from "./rules/attribute-validate/attribute-validate-charset";
defineLazyProp(
  builtInRules,
  "attribute-validate-charset",
  () => attributeValidateCharset
);

import attributeValidateWidth from "./rules/attribute-validate/attribute-validate-width";
defineLazyProp(
  builtInRules,
  "attribute-validate-width",
  () => attributeValidateWidth
);

// BAD-HTML-ENTITY rules
// -----------------------------------------------------------------------------
// (some of them, only plugin-based-ones - the rest are on linter.js, directly on a callback)

import htmlEntitiesNotEmailFriendly from "./rules/bad-html-entity/bad-named-html-entity-not-email-friendly";
defineLazyProp(
  builtInRules,
  "bad-named-html-entity-not-email-friendly",
  () => htmlEntitiesNotEmailFriendly
);

// CHARACTER rules
// -----------------------------------------------------------------------------
// additional rules running from "character" nodes, more comlex than just
// matching the Unicode number as "bad-character-*" rules do.

import characterEncode from "./rules/character/character-encode";
defineLazyProp(builtInRules, "character-encode", () => characterEncode);

import characterUnspacedPunctuation from "./rules/character/character-unspaced-punctuation";
defineLazyProp(
  builtInRules,
  "character-unspaced-punctuation",
  () => characterUnspacedPunctuation
);

// EXPORTS
// -----------------------------------------------------------------------------

function get(something) {
  return builtInRules[something];
}

// it expands the grouped rules, such as "bad-character", then
// removes the grouped rule so that only real, single rules
// are passed to Linter
function normaliseRequestedRules(opts) {
  // console.log(
  //   `870 normaliseRequestedRules() RECEIVED: ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );
  const res = {};
  // first, if there are known group rules such as "bad-character", set
  // them as a foundation:
  if (Object.keys(opts).includes("all") && isEnabled(opts.all)) {
    Object.keys(builtInRules).forEach(ruleName => {
      res[ruleName] = opts.all;
    });
  } else {
    let temp;
    if (
      Object.keys(opts).some(ruleName => {
        if (
          ["bad-character", "bad-character*", "bad-character-*"].includes(
            ruleName
          )
        ) {
          temp = ruleName;
          return true;
        }
      })
    ) {
      allBadCharacterRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (
      Object.keys(opts).some(ruleName => {
        if (["tag", "tag*", "tag-*"].includes(ruleName)) {
          temp = ruleName;
          return true;
        }
      })
    ) {
      allTagRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (
      Object.keys(opts).some(ruleName => {
        if (["attribute", "attribute*", "attribute-*"].includes(ruleName)) {
          temp = ruleName;
          return true;
        }
      })
    ) {
      allAttribRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).includes("bad-html-entity")) {
      allBadNamedHTMLEntityRules.forEach(ruleName => {
        // whole group of rules, not necessarily starting with "bad-html-entity"
        // will be added. Currently it's the list:
        //  * bad-named-html-entity-malformed-nbsp
        //  * bad-named-html-entity-malformed-*
        //  * bad-named-html-entity-unrecognised
        //  * bad-named-html-entity-multiple-encoding
        //  * bad-malformed-numeric-character-entity
        //  * encoded-html-entity-nbsp
        //  * encoded-numeric-html-entity-reference

        res[ruleName] = opts["bad-html-entity"];
      });
    }

    // then, a-la Object.assign the rest
    Object.keys(opts).forEach(ruleName => {
      if (
        ![
          "all",
          "tag",
          "tag*",
          "tag-*",
          "attribute",
          "attribute*",
          "attribute-*",
          "bad-character",
          "bad-character",
          "bad-character*",
          "bad-character-*",
          "bad-html-entity"
        ].includes(ruleName)
      ) {
        // now, it depends is an exact rule name is being queried or is it wildcard
        if (Object.keys(builtInRules).includes(ruleName)) {
          res[ruleName] = clone(opts[ruleName]);
        } else if (ruleName.includes("*")) {
          Object.keys(builtInRules).forEach(builtInRule => {
            if (matcher.isMatch(builtInRule, ruleName)) {
              res[builtInRule] = clone(opts[ruleName]);
            }
          });
        }
        // TODO - else clause error messaging - rule is configured but not available
      }
    });
  }

  console.log(
    `1104 normaliseRequestedRules() FINAL ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export { get, normaliseRequestedRules };
