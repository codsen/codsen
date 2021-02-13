// here we fetch the rules from all the places,
// to start with, from /src/rules

// IMPORTS AND CONSTS
// -----------------------------------------------------------------------------

import defineLazyProp from "define-lazy-prop";
import clone from "lodash.clonedeep";
import matcher from "matcher";
import allBadCharacterRules from "./rules/all-bad-character.json";
import allTagRules from "./rules/all-tag.json";
import allAttribRules from "./rules/all-attribute.json";
import allBadNamedHTMLEntityRules from "./rules/all-bad-named-html-entity.json";
import { isAnEnabledValue } from "./util/util";
import { Linter } from "./linter";
import { RulesObj } from "./util/commonTypes";

// CHARACTER-LEVEL rules
// -----------------------------------------------------------------------------

import badCharacterNull from "./rules/bad-character/bad-character-null";

import badCharacterStartOfHeading from "./rules/bad-character/bad-character-start-of-heading";

import badCharacterStartOfText from "./rules/bad-character/bad-character-start-of-text";

import badCharacterEndOfText from "./rules/bad-character/bad-character-end-of-text";

import badCharacterEndOfTransmission from "./rules/bad-character/bad-character-end-of-transmission";

import badCharacterEnquiry from "./rules/bad-character/bad-character-enquiry";

import badCharacterAcknowledge from "./rules/bad-character/bad-character-acknowledge";

import badCharacterBell from "./rules/bad-character/bad-character-bell";

import badCharacterBackspace from "./rules/bad-character/bad-character-backspace";

import badCharacterTabulation from "./rules/bad-character/bad-character-tabulation";

import badCharacterLineTabulation from "./rules/bad-character/bad-character-line-tabulation";

import badCharacterFormFeed from "./rules/bad-character/bad-character-form-feed";

import badCharacterShiftOut from "./rules/bad-character/bad-character-shift-out";

import badCharacterShiftIn from "./rules/bad-character/bad-character-shift-in";

import badCharacterDataLinkEscape from "./rules/bad-character/bad-character-data-link-escape";

import badCharacterDeviceControlOne from "./rules/bad-character/bad-character-device-control-one";

import badCharacterDeviceControlTwo from "./rules/bad-character/bad-character-device-control-two";

import badCharacterDeviceControlThree from "./rules/bad-character/bad-character-device-control-three";

import badCharacterDeviceControlFour from "./rules/bad-character/bad-character-device-control-four";

import badCharacterNegativeAcknowledge from "./rules/bad-character/bad-character-negative-acknowledge";

import badCharacterSynchronousIdle from "./rules/bad-character/bad-character-synchronous-idle";

import badCharacterEndOfTransmissionBlock from "./rules/bad-character/bad-character-end-of-transmission-block";

import badCharacterCancel from "./rules/bad-character/bad-character-cancel";

import badCharacterEndOfMedium from "./rules/bad-character/bad-character-end-of-medium";

import badCharacterSubstitute from "./rules/bad-character/bad-character-substitute";

import badCharacterEscape from "./rules/bad-character/bad-character-escape";

import badCharacterInformationSeparatorFour from "./rules/bad-character/bad-character-information-separator-four";

import badCharacterInformationSeparatorThree from "./rules/bad-character/bad-character-information-separator-three";

import badCharacterInformationSeparatorTwo from "./rules/bad-character/bad-character-information-separator-two";

import badCharacterInformationSeparatorOne from "./rules/bad-character/bad-character-information-separator-one";

import badCharacterDelete from "./rules/bad-character/bad-character-delete";

import badCharacterControl0080 from "./rules/bad-character/bad-character-control-0080";

import badCharacterControl0081 from "./rules/bad-character/bad-character-control-0081";

import badCharacterBreakPermittedHere from "./rules/bad-character/bad-character-break-permitted-here";

import badCharacterNoBreakHere from "./rules/bad-character/bad-character-no-break-here";

import badCharacterControl0084 from "./rules/bad-character/bad-character-control-0084";

import badCharacterNextLine from "./rules/bad-character/bad-character-next-line";

import badCharacterStartOfSelectedArea from "./rules/bad-character/bad-character-start-of-selected-area";

import badCharacterEndOfSelectedArea from "./rules/bad-character/bad-character-end-of-selected-area";

import badCharacterCharacterTabulationSet from "./rules/bad-character/bad-character-character-tabulation-set";

import badCharacterCharacterTabulationWithJustification from "./rules/bad-character/bad-character-character-tabulation-with-justification";

import badCharacterLineTabulationSet from "./rules/bad-character/bad-character-line-tabulation-set";

import badCharacterPartialLineForward from "./rules/bad-character/bad-character-partial-line-forward";

import badCharacterPartialLineBackward from "./rules/bad-character/bad-character-partial-line-backward";

import badCharacterReverseLineFeed from "./rules/bad-character/bad-character-reverse-line-feed";

import badCharacterSingleShiftTwo from "./rules/bad-character/bad-character-single-shift-two";

import badCharacterSingleShiftThree from "./rules/bad-character/bad-character-single-shift-three";

import badCharacterDeviceControlString from "./rules/bad-character/bad-character-device-control-string";

import badCharacterPrivateUseOne from "./rules/bad-character/bad-character-private-use-1";

import badCharacterPrivateUseTwo from "./rules/bad-character/bad-character-private-use-2";

import badCharacterSetTransmitState from "./rules/bad-character/bad-character-set-transmit-state";

import badCharacterCancelCharacter from "./rules/bad-character/bad-character-cancel-character";

import badCharacterMessageWaiting from "./rules/bad-character/bad-character-message-waiting";

import badCharacterStartOfProtectedArea from "./rules/bad-character/bad-character-start-of-protected-area";

import badCharacterEndOfProtectedArea from "./rules/bad-character/bad-character-end-of-protected-area";

import badCharacterStartOfString from "./rules/bad-character/bad-character-start-of-string";

import badCharacterControl0099 from "./rules/bad-character/bad-character-control-0099";

import badCharacterSingleCharacterIntroducer from "./rules/bad-character/bad-character-single-character-introducer";

import badCharacterControlSequenceIntroducer from "./rules/bad-character/bad-character-control-sequence-introducer";

import badCharacterStringTerminator from "./rules/bad-character/bad-character-string-terminator";

import badCharacterOperatingSystemCommand from "./rules/bad-character/bad-character-operating-system-command";

import badCharacterPrivateMessage from "./rules/bad-character/bad-character-private-message";

import badCharacterApplicationProgramCommand from "./rules/bad-character/bad-character-application-program-command";

import badCharacterSoftHyphen from "./rules/bad-character/bad-character-soft-hyphen";

// space characters:
// https://www.fileformat.info/info/unicode/category/Zs/list.htm

import badCharacterNonBreakingSpace from "./rules/bad-character/bad-character-non-breaking-space";

import badCharacterOghamSpaceMark from "./rules/bad-character/bad-character-ogham-space-mark";

import badCharacterEnQuad from "./rules/bad-character/bad-character-en-quad";

import badCharacterEmQuad from "./rules/bad-character/bad-character-em-quad";

import badCharacterEnSpace from "./rules/bad-character/bad-character-en-space";

import badCharacterEmSpace from "./rules/bad-character/bad-character-em-space";

import badCharacterThreePerEmSpace from "./rules/bad-character/bad-character-three-per-em-space";

import badCharacterFourPerEmSpace from "./rules/bad-character/bad-character-four-per-em-space";

import badCharacterSixPerEmSpace from "./rules/bad-character/bad-character-six-per-em-space";

import badCharacterFigureSpace from "./rules/bad-character/bad-character-figure-space";

import badCharacterPunctuationSpace from "./rules/bad-character/bad-character-punctuation-space";

import badCharacterThinSpace from "./rules/bad-character/bad-character-thin-space";

import badCharacterHairSpace from "./rules/bad-character/bad-character-hair-space";

import badCharacterZeroWidthSpace from "./rules/bad-character/bad-character-zero-width-space";

import badCharacterZeroWidthNonJoiner from "./rules/bad-character/bad-character-zero-width-non-joiner";

import badCharacterZeroWidthJoiner from "./rules/bad-character/bad-character-zero-width-joiner";

import badCharacterLeftToRightMark from "./rules/bad-character/bad-character-left-to-right-mark";

import badCharacterRightToLeftMark from "./rules/bad-character/bad-character-right-to-left-mark";

import badCharacterLeftToRightEmbedding from "./rules/bad-character/bad-character-left-to-right-embedding";

import badCharacterRightToLeftEmbedding from "./rules/bad-character/bad-character-right-to-left-embedding";

import badCharacterPopDirectionalFormatting from "./rules/bad-character/bad-character-pop-directional-formatting";

import badCharacterLeftToRightOverride from "./rules/bad-character/bad-character-left-to-right-override";

import badCharacterRightToLeftOverride from "./rules/bad-character/bad-character-right-to-left-override";

//

import badCharacterWordJoiner from "./rules/bad-character/bad-character-word-joiner";

import badCharacterFunctionApplication from "./rules/bad-character/bad-character-function-application";

import badCharacterInvisibleTimes from "./rules/bad-character/bad-character-invisible-times";

import badCharacterInvisibleSeparator from "./rules/bad-character/bad-character-invisible-separator";

import badCharacterInvisiblePlus from "./rules/bad-character/bad-character-invisible-plus";

import badCharacterLeftToRightIsolate from "./rules/bad-character/bad-character-left-to-right-isolate";

import badCharacterRightToLeftIsolate from "./rules/bad-character/bad-character-right-to-left-isolate";

import badCharacterFirstStrongIsolate from "./rules/bad-character/bad-character-first-strong-isolate";

import badCharacterPopDirectionalIsolate from "./rules/bad-character/bad-character-pop-directional-isolate";

import badCharacterInhibitSymmetricSwapping from "./rules/bad-character/bad-character-inhibit-symmetric-swapping";

import badCharacterActivateSymmetricSwapping from "./rules/bad-character/bad-character-activate-symmetric-swapping";

import badCharacterInhibitArabicFormShaping from "./rules/bad-character/bad-character-inhibit-arabic-form-shaping";

import badCharacterActivateArabicFormShaping from "./rules/bad-character/bad-character-activate-arabic-form-shaping";

import badCharacterNationalDigitShapes from "./rules/bad-character/bad-character-national-digit-shapes";

import badCharacterNominalDigitShapes from "./rules/bad-character/bad-character-nominal-digit-shapes";

import badCharacterZeroWidthNoBreakSpace from "./rules/bad-character/bad-character-zero-width-no-break-space";

import badCharacterInterlinearAnnotationAnchor from "./rules/bad-character/bad-character-interlinear-annotation-anchor";

import badCharacterInterlinearAnnotationSeparator from "./rules/bad-character/bad-character-interlinear-annotation-separator";

import badCharacterInterlinearAnnotationTerminator from "./rules/bad-character/bad-character-interlinear-annotation-terminator";

import badCharacterLineSeparator from "./rules/bad-character/bad-character-line-separator";

import badCharacterParagraphSeparator from "./rules/bad-character/bad-character-paragraph-separator";

//

import badCharacterNarrowNoBreakSpace from "./rules/bad-character/bad-character-narrow-no-break-space";

import badCharacterMediumMathematicalSpace from "./rules/bad-character/bad-character-medium-mathematical-space";

import badCharacterIdeographicSpace from "./rules/bad-character/bad-character-ideographic-space";

import badCharacterReplacementCharacter from "./rules/bad-character/bad-character-replacement-character";

// TAG-LEVEL rules
// -----------------------------------------------------------------------------

import tagSpaceAfterOpeningBracket from "./rules/tag/tag-space-after-opening-bracket";

import tagSpaceBeforeClosingBracket from "./rules/tag/tag-space-before-closing-bracket";

import tagSpaceBeforeClosingSlash from "./rules/tag/tag-space-before-closing-slash";

import tagSpaceBetweenSlashAndBracket from "./rules/tag/tag-space-between-slash-and-bracket";

import tagClosingBackslash from "./rules/tag/tag-closing-backslash";

import tagVoidSlash from "./rules/tag/tag-void-slash";

import tagNameCase from "./rules/tag/tag-name-case";

import tagIsPresent from "./rules/tag/tag-is-present";

import tagBold from "./rules/tag/tag-bold";

import tagBadSelfClosing from "./rules/tag/tag-bad-self-closing";

// ATTRIBUTE rules
// -----------------------------------------------------------------------------

import attributeDuplicate from "./rules/attribute/attribute-duplicate";

import attributeMalformed from "./rules/attribute/attribute-malformed";

import attributeOnClosingTag from "./rules/attribute/attribute-on-closing-tag";

// ATTRIBUTE-VALIDATE- rules
// -----------------------------------------------------------------------------

import attributeValidateAbbr from "./rules/attribute-validate/attribute-validate-abbr";

import attributeValidateAcceptCharset from "./rules/attribute-validate/attribute-validate-accept-charset";

import attributeValidateAccept from "./rules/attribute-validate/attribute-validate-accept";

import attributeValidateAccesskey from "./rules/attribute-validate/attribute-validate-accesskey";

import attributeValidateAction from "./rules/attribute-validate/attribute-validate-action";

import attributeValidateAlign from "./rules/attribute-validate/attribute-validate-align";

import attributeValidateAlink from "./rules/attribute-validate/attribute-validate-alink";

import attributeValidateAlt from "./rules/attribute-validate/attribute-validate-alt";

import attributeValidateArchive from "./rules/attribute-validate/attribute-validate-archive";

import attributeValidateAxis from "./rules/attribute-validate/attribute-validate-axis";

import attributeValidateBackground from "./rules/attribute-validate/attribute-validate-background";

import attributeValidateBgcolor from "./rules/attribute-validate/attribute-validate-bgcolor";

import attributeValidateBorder from "./rules/attribute-validate/attribute-validate-border";

import attributeValidateCellpadding from "./rules/attribute-validate/attribute-validate-cellpadding";

import attributeValidateCellspacing from "./rules/attribute-validate/attribute-validate-cellspacing";

import attributeValidateChar from "./rules/attribute-validate/attribute-validate-char";

import attributeValidateCharoff from "./rules/attribute-validate/attribute-validate-charoff";

import attributeValidateCharset from "./rules/attribute-validate/attribute-validate-charset";

import attributeValidateChecked from "./rules/attribute-validate/attribute-validate-checked";

import attributeValidateCite from "./rules/attribute-validate/attribute-validate-cite";

import attributeValidateClass from "./rules/attribute-validate/attribute-validate-class";

import attributeValidateClassid from "./rules/attribute-validate/attribute-validate-classid";

import attributeValidateClear from "./rules/attribute-validate/attribute-validate-clear";

import attributeValidateCode from "./rules/attribute-validate/attribute-validate-code";

import attributeValidateCodebase from "./rules/attribute-validate/attribute-validate-codebase";

import attributeValidateCodetype from "./rules/attribute-validate/attribute-validate-codetype";

import attributeValidateColor from "./rules/attribute-validate/attribute-validate-color";

import attributeValidateCols from "./rules/attribute-validate/attribute-validate-cols";

import attributeValidateColspan from "./rules/attribute-validate/attribute-validate-colspan";

import attributeValidateCompact from "./rules/attribute-validate/attribute-validate-compact";

import attributeValidateContent from "./rules/attribute-validate/attribute-validate-content";

import attributeValidateCoords from "./rules/attribute-validate/attribute-validate-coords";

import attributeValidateData from "./rules/attribute-validate/attribute-validate-data";

import attributeValidateDatetime from "./rules/attribute-validate/attribute-validate-datetime";

import attributeValidateDeclare from "./rules/attribute-validate/attribute-validate-declare";

import attributeValidateDefer from "./rules/attribute-validate/attribute-validate-defer";

import attributeValidateDir from "./rules/attribute-validate/attribute-validate-dir";

import attributeValidateDisabled from "./rules/attribute-validate/attribute-validate-disabled";

import attributeValidateEnctype from "./rules/attribute-validate/attribute-validate-enctype";

import attributeValidateFace from "./rules/attribute-validate/attribute-validate-face";

import attributeValidateFor from "./rules/attribute-validate/attribute-validate-for";

import attributeValidateFrame from "./rules/attribute-validate/attribute-validate-frame";

import attributeValidateFrameborder from "./rules/attribute-validate/attribute-validate-frameborder";

import attributeValidateHeaders from "./rules/attribute-validate/attribute-validate-headers";

import attributeValidateHeight from "./rules/attribute-validate/attribute-validate-height";

import attributeValidateHref from "./rules/attribute-validate/attribute-validate-href";

import attributeValidateHreflang from "./rules/attribute-validate/attribute-validate-hreflang";

import attributeValidateHspace from "./rules/attribute-validate/attribute-validate-hspace";

import attributeValidateHttpequiv from "./rules/attribute-validate/attribute-validate-http-equiv";

import attributeValidateId from "./rules/attribute-validate/attribute-validate-id";

import attributeValidateIsmap from "./rules/attribute-validate/attribute-validate-ismap";

import attributeValidateLabel from "./rules/attribute-validate/attribute-validate-label";

import attributeValidateLang from "./rules/attribute-validate/attribute-validate-lang";

import attributeValidateLanguage from "./rules/attribute-validate/attribute-validate-language";

import attributeValidateLink from "./rules/attribute-validate/attribute-validate-link";

import attributeValidateLongdesc from "./rules/attribute-validate/attribute-validate-longdesc";

import attributeValidateMarginheight from "./rules/attribute-validate/attribute-validate-marginheight";

import attributeValidateMarginwidth from "./rules/attribute-validate/attribute-validate-marginwidth";

import attributeValidateMaxlength from "./rules/attribute-validate/attribute-validate-maxlength";

import attributeValidateMedia from "./rules/attribute-validate/attribute-validate-media";

import attributeValidateMethod from "./rules/attribute-validate/attribute-validate-method";

import attributeValidateMultiple from "./rules/attribute-validate/attribute-validate-multiple";

import attributeValidateName from "./rules/attribute-validate/attribute-validate-name";

import attributeValidateNohref from "./rules/attribute-validate/attribute-validate-nohref";

import attributeValidateNoresize from "./rules/attribute-validate/attribute-validate-noresize";

import attributeValidateNoshade from "./rules/attribute-validate/attribute-validate-noshade";

import attributeValidateNowrap from "./rules/attribute-validate/attribute-validate-nowrap";

import attributeValidateObject from "./rules/attribute-validate/attribute-validate-object";

import attributeValidateOnblur from "./rules/attribute-validate/attribute-validate-onblur";

import attributeValidateOnchange from "./rules/attribute-validate/attribute-validate-onchange";

import attributeValidateOnclick from "./rules/attribute-validate/attribute-validate-onclick";

import attributeValidateOndblclick from "./rules/attribute-validate/attribute-validate-ondblclick";

import attributeValidateOnfocus from "./rules/attribute-validate/attribute-validate-onfocus";

import attributeValidateOnkeydown from "./rules/attribute-validate/attribute-validate-onkeydown";

import attributeValidateOnkeypress from "./rules/attribute-validate/attribute-validate-onkeypress";

import attributeValidateOnkeyup from "./rules/attribute-validate/attribute-validate-onkeyup";

import attributeValidateOnload from "./rules/attribute-validate/attribute-validate-onload";

import attributeValidateOnmousedown from "./rules/attribute-validate/attribute-validate-onmousedown";

import attributeValidateOnmousemove from "./rules/attribute-validate/attribute-validate-onmousemove";

import attributeValidateOnmouseout from "./rules/attribute-validate/attribute-validate-onmouseout";

import attributeValidateOnmouseover from "./rules/attribute-validate/attribute-validate-onmouseover";

import attributeValidateOnmouseup from "./rules/attribute-validate/attribute-validate-onmouseup";

import attributeValidateOnreset from "./rules/attribute-validate/attribute-validate-onreset";

import attributeValidateOnsubmit from "./rules/attribute-validate/attribute-validate-onsubmit";

import attributeValidateOnselect from "./rules/attribute-validate/attribute-validate-onselect";

import attributeValidateOnunload from "./rules/attribute-validate/attribute-validate-onunload";

import attributeValidateProfile from "./rules/attribute-validate/attribute-validate-profile";

import attributeValidatePrompt from "./rules/attribute-validate/attribute-validate-prompt";

import attributeValidateReadonly from "./rules/attribute-validate/attribute-validate-readonly";

import attributeValidateRel from "./rules/attribute-validate/attribute-validate-rel";

import attributeValidateRev from "./rules/attribute-validate/attribute-validate-rev";

import attributeValidateRows from "./rules/attribute-validate/attribute-validate-rows";

import attributeValidateRowspan from "./rules/attribute-validate/attribute-validate-rowspan";

import attributeValidateRules from "./rules/attribute-validate/attribute-validate-rules";

import attributeValidateScheme from "./rules/attribute-validate/attribute-validate-scheme";

import attributeValidateScope from "./rules/attribute-validate/attribute-validate-scope";

import attributeValidateScrolling from "./rules/attribute-validate/attribute-validate-scrolling";

import attributeValidateSelected from "./rules/attribute-validate/attribute-validate-selected";

import attributeValidateShape from "./rules/attribute-validate/attribute-validate-shape";

import attributeValidateSize from "./rules/attribute-validate/attribute-validate-size";

import attributeValidateSpan from "./rules/attribute-validate/attribute-validate-span";

import attributeValidateSrc from "./rules/attribute-validate/attribute-validate-src";

import attributeValidateStandby from "./rules/attribute-validate/attribute-validate-standby";

import attributeValidateStart from "./rules/attribute-validate/attribute-validate-start";

import attributeValidateStyle from "./rules/attribute-validate/attribute-validate-style";

import attributeValidateSummary from "./rules/attribute-validate/attribute-validate-summary";

import attributeValidateTabindex from "./rules/attribute-validate/attribute-validate-tabindex";

import attributeValidateTarget from "./rules/attribute-validate/attribute-validate-target";

import attributeValidateText from "./rules/attribute-validate/attribute-validate-text";

import attributeValidateTitle from "./rules/attribute-validate/attribute-validate-title";

import attributeValidateType from "./rules/attribute-validate/attribute-validate-type";

import attributeValidateUsemap from "./rules/attribute-validate/attribute-validate-usemap";

import attributeValidateValign from "./rules/attribute-validate/attribute-validate-valign";

import attributeValidateValue from "./rules/attribute-validate/attribute-validate-value";

import attributeValidateValuetype from "./rules/attribute-validate/attribute-validate-valuetype";

import attributeValidateVersion from "./rules/attribute-validate/attribute-validate-version";

import attributeValidateVlink from "./rules/attribute-validate/attribute-validate-vlink";

import attributeValidateVspace from "./rules/attribute-validate/attribute-validate-vspace";

import attributeValidateWidth from "./rules/attribute-validate/attribute-validate-width";

// BAD-HTML-ENTITY rules
// -----------------------------------------------------------------------------
// (some of them, only plugin-based-ones - the rest are on linter.js, directly on a callback)

import htmlEntitiesNotEmailFriendly from "./rules/bad-html-entity/bad-named-html-entity-not-email-friendly";

// CHARACTER rules
// -----------------------------------------------------------------------------
// additional rules running from "character" nodes, more comlex than just
// matching the Unicode number as "bad-character-*" rules do.

import characterEncode from "./rules/character/character-encode";

import characterUnspacedPunctuation from "./rules/character/character-unspaced-punctuation";

// MEDIA (QUERY) rules
// -----------------------------------------------------------------------------
// rules running from "at" nodes

import mediaMalformed from "./rules/media/media-malformed";

// COMMENT TAG rules
// -----------------------------------------------------------------------------
// some of them running from tokenizer nodes:
//
// 1.
// type="comment", kind="simple"
// (<!-- content -->)
//
// 2.
// type="comment", kind="only"
// (<!--[if gte mso 9]> content <![endif]-->)
//
// 3.
// type="comment", kind="not"
// (<!--[if !mso]><!--> content <!--<![endif]-->)
//

import commentClosingMalformed from "./rules/comment/comment-closing-malformed";

import commentOpeningMalformed from "./rules/comment/comment-opening-malformed";

import commentMismatchingPair from "./rules/comment/comment-mismatching-pair";

import commentConditionalNested from "./rules/comment/comment-conditional-nested";

// EMAIL rules
// -----------------------------------------------------------------------------

import tdSiblingPadding from "./rules/email/email-td-sibling-padding";

// CSS rules
// -----------------------------------------------------------------------------

import trailingSemi from "./rules/css/trailing-semi";

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

interface BuiltInRules {
  [key: string]: () => any;
}
const builtInRules: BuiltInRules = {};
defineLazyProp(builtInRules, "bad-character-null", () => badCharacterNull);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-heading",
  () => badCharacterStartOfHeading
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-text",
  () => badCharacterStartOfText
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-text",
  () => badCharacterEndOfText
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission",
  () => badCharacterEndOfTransmission
);
defineLazyProp(
  builtInRules,
  "bad-character-enquiry",
  () => badCharacterEnquiry
);
defineLazyProp(
  builtInRules,
  "bad-character-acknowledge",
  () => badCharacterAcknowledge
);
defineLazyProp(builtInRules, "bad-character-bell", () => badCharacterBell);
defineLazyProp(
  builtInRules,
  "bad-character-backspace",
  () => badCharacterBackspace
);
defineLazyProp(
  builtInRules,
  "bad-character-tabulation",
  () => badCharacterTabulation
);
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation",
  () => badCharacterLineTabulation
);
defineLazyProp(
  builtInRules,
  "bad-character-form-feed",
  () => badCharacterFormFeed
);
defineLazyProp(
  builtInRules,
  "bad-character-shift-out",
  () => badCharacterShiftOut
);
defineLazyProp(
  builtInRules,
  "bad-character-shift-in",
  () => badCharacterShiftIn
);
defineLazyProp(
  builtInRules,
  "bad-character-data-link-escape",
  () => badCharacterDataLinkEscape
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-one",
  () => badCharacterDeviceControlOne
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-two",
  () => badCharacterDeviceControlTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-three",
  () => badCharacterDeviceControlThree
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-four",
  () => badCharacterDeviceControlFour
);
defineLazyProp(
  builtInRules,
  "bad-character-negative-acknowledge",
  () => badCharacterNegativeAcknowledge
);
defineLazyProp(
  builtInRules,
  "bad-character-synchronous-idle",
  () => badCharacterSynchronousIdle
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission-block",
  () => badCharacterEndOfTransmissionBlock
);
defineLazyProp(builtInRules, "bad-character-cancel", () => badCharacterCancel);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-medium",
  () => badCharacterEndOfMedium
);
defineLazyProp(
  builtInRules,
  "bad-character-substitute",
  () => badCharacterSubstitute
);
defineLazyProp(builtInRules, "bad-character-escape", () => badCharacterEscape);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-four",
  () => badCharacterInformationSeparatorFour
);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-three",
  () => badCharacterInformationSeparatorThree
);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-two",
  () => badCharacterInformationSeparatorTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-one",
  () => badCharacterInformationSeparatorOne
);
defineLazyProp(builtInRules, "bad-character-delete", () => badCharacterDelete);
defineLazyProp(
  builtInRules,
  "bad-character-control-0080",
  () => badCharacterControl0080
);
defineLazyProp(
  builtInRules,
  "bad-character-control-0081",
  () => badCharacterControl0081
);
defineLazyProp(
  builtInRules,
  "bad-character-break-permitted-here",
  () => badCharacterBreakPermittedHere
);
defineLazyProp(
  builtInRules,
  "bad-character-no-break-here",
  () => badCharacterNoBreakHere
);
defineLazyProp(
  builtInRules,
  "bad-character-control-0084",
  () => badCharacterControl0084
);
defineLazyProp(
  builtInRules,
  "bad-character-next-line",
  () => badCharacterNextLine
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-selected-area",
  () => badCharacterStartOfSelectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-selected-area",
  () => badCharacterEndOfSelectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation-set",
  () => badCharacterCharacterTabulationSet
);
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation-with-justification",
  () => badCharacterCharacterTabulationWithJustification
);
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation-set",
  () => badCharacterLineTabulationSet
);
defineLazyProp(
  builtInRules,
  "bad-character-partial-line-forward",
  () => badCharacterPartialLineForward
);
defineLazyProp(
  builtInRules,
  "bad-character-partial-line-backward",
  () => badCharacterPartialLineBackward
);
defineLazyProp(
  builtInRules,
  "bad-character-reverse-line-feed",
  () => badCharacterReverseLineFeed
);
defineLazyProp(
  builtInRules,
  "bad-character-single-shift-two",
  () => badCharacterSingleShiftTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-single-shift-three",
  () => badCharacterSingleShiftThree
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-string",
  () => badCharacterDeviceControlString
);
defineLazyProp(
  builtInRules,
  "bad-character-private-use-1",
  () => badCharacterPrivateUseOne
);
defineLazyProp(
  builtInRules,
  "bad-character-private-use-2",
  () => badCharacterPrivateUseTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-set-transmit-state",
  () => badCharacterSetTransmitState
);
defineLazyProp(
  builtInRules,
  "bad-character-cancel-character",
  () => badCharacterCancelCharacter
);
defineLazyProp(
  builtInRules,
  "bad-character-message-waiting",
  () => badCharacterMessageWaiting
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-protected-area",
  () => badCharacterStartOfProtectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-protected-area",
  () => badCharacterEndOfProtectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-string",
  () => badCharacterStartOfString
);
defineLazyProp(
  builtInRules,
  "bad-character-control-0099",
  () => badCharacterControl0099
);
defineLazyProp(
  builtInRules,
  "bad-character-single-character-introducer",
  () => badCharacterSingleCharacterIntroducer
);
defineLazyProp(
  builtInRules,
  "bad-character-control-sequence-introducer",
  () => badCharacterControlSequenceIntroducer
);
defineLazyProp(
  builtInRules,
  "bad-character-string-terminator",
  () => badCharacterStringTerminator
);
defineLazyProp(
  builtInRules,
  "bad-character-operating-system-command",
  () => badCharacterOperatingSystemCommand
);
defineLazyProp(
  builtInRules,
  "bad-character-private-message",
  () => badCharacterPrivateMessage
);
defineLazyProp(
  builtInRules,
  "bad-character-application-program-command",
  () => badCharacterApplicationProgramCommand
);
defineLazyProp(
  builtInRules,
  "bad-character-soft-hyphen",
  () => badCharacterSoftHyphen
);
defineLazyProp(
  builtInRules,
  "bad-character-non-breaking-space",
  () => badCharacterNonBreakingSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-ogham-space-mark",
  () => badCharacterOghamSpaceMark
);
defineLazyProp(builtInRules, "bad-character-en-quad", () => badCharacterEnQuad);
defineLazyProp(builtInRules, "bad-character-em-quad", () => badCharacterEmQuad);
defineLazyProp(
  builtInRules,
  "bad-character-en-space",
  () => badCharacterEnSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-em-space",
  () => badCharacterEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-three-per-em-space",
  () => badCharacterThreePerEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-four-per-em-space",
  () => badCharacterFourPerEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-six-per-em-space",
  () => badCharacterSixPerEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-figure-space",
  () => badCharacterFigureSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-punctuation-space",
  () => badCharacterPunctuationSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-thin-space",
  () => badCharacterThinSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-hair-space",
  () => badCharacterHairSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-space",
  () => badCharacterZeroWidthSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-non-joiner",
  () => badCharacterZeroWidthNonJoiner
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-joiner",
  () => badCharacterZeroWidthJoiner
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-mark",
  () => badCharacterLeftToRightMark
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-mark",
  () => badCharacterRightToLeftMark
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-embedding",
  () => badCharacterLeftToRightEmbedding
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-embedding",
  () => badCharacterRightToLeftEmbedding
);
defineLazyProp(
  builtInRules,
  "bad-character-pop-directional-formatting",
  () => badCharacterPopDirectionalFormatting
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-override",
  () => badCharacterLeftToRightOverride
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-override",
  () => badCharacterRightToLeftOverride
);
defineLazyProp(
  builtInRules,
  "bad-character-word-joiner",
  () => badCharacterWordJoiner
);
defineLazyProp(
  builtInRules,
  "bad-character-function-application",
  () => badCharacterFunctionApplication
);
defineLazyProp(
  builtInRules,
  "bad-character-invisible-times",
  () => badCharacterInvisibleTimes
);
defineLazyProp(
  builtInRules,
  "bad-character-invisible-separator",
  () => badCharacterInvisibleSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-invisible-plus",
  () => badCharacterInvisiblePlus
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-isolate",
  () => badCharacterLeftToRightIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-isolate",
  () => badCharacterRightToLeftIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-first-strong-isolate",
  () => badCharacterFirstStrongIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-pop-directional-isolate",
  () => badCharacterPopDirectionalIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-inhibit-symmetric-swapping",
  () => badCharacterInhibitSymmetricSwapping
);
defineLazyProp(
  builtInRules,
  "bad-character-activate-symmetric-swapping",
  () => badCharacterActivateSymmetricSwapping
);
defineLazyProp(
  builtInRules,
  "bad-character-inhibit-arabic-form-shaping",
  () => badCharacterInhibitArabicFormShaping
);
defineLazyProp(
  builtInRules,
  "bad-character-activate-arabic-form-shaping",
  () => badCharacterActivateArabicFormShaping
);
defineLazyProp(
  builtInRules,
  "bad-character-national-digit-shapes",
  () => badCharacterNationalDigitShapes
);
defineLazyProp(
  builtInRules,
  "bad-character-nominal-digit-shapes",
  () => badCharacterNominalDigitShapes
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-no-break-space",
  () => badCharacterZeroWidthNoBreakSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-anchor",
  () => badCharacterInterlinearAnnotationAnchor
);
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-separator",
  () => badCharacterInterlinearAnnotationSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-terminator",
  () => badCharacterInterlinearAnnotationTerminator
);
defineLazyProp(
  builtInRules,
  "bad-character-line-separator",
  () => badCharacterLineSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-paragraph-separator",
  () => badCharacterParagraphSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-narrow-no-break-space",
  () => badCharacterNarrowNoBreakSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-medium-mathematical-space",
  () => badCharacterMediumMathematicalSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-ideographic-space",
  () => badCharacterIdeographicSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-replacement-character",
  () => badCharacterReplacementCharacter
);

// TAG rules
// -----------------------------------------------------------------------------

defineLazyProp(
  builtInRules,
  "tag-space-after-opening-bracket",
  () => tagSpaceAfterOpeningBracket
);
defineLazyProp(
  builtInRules,
  "tag-space-before-closing-bracket",
  () => tagSpaceBeforeClosingBracket
);
defineLazyProp(
  builtInRules,
  "tag-space-before-closing-slash",
  () => tagSpaceBeforeClosingSlash
);
defineLazyProp(
  builtInRules,
  "tag-space-between-slash-and-bracket",
  () => tagSpaceBetweenSlashAndBracket
);
defineLazyProp(
  builtInRules,
  "tag-closing-backslash",
  () => tagClosingBackslash
);
defineLazyProp(builtInRules, "tag-void-slash", () => tagVoidSlash);
defineLazyProp(builtInRules, "tag-name-case", () => tagNameCase);
defineLazyProp(builtInRules, "tag-is-present", () => tagIsPresent);
defineLazyProp(builtInRules, "tag-bold", () => tagBold);
defineLazyProp(builtInRules, "tag-bad-self-closing", () => tagBadSelfClosing);
defineLazyProp(builtInRules, "attribute-duplicate", () => attributeDuplicate);
defineLazyProp(builtInRules, "attribute-malformed", () => attributeMalformed);
defineLazyProp(
  builtInRules,
  "attribute-on-closing-tag",
  () => attributeOnClosingTag
);
defineLazyProp(
  builtInRules,
  "attribute-validate-abbr",
  () => attributeValidateAbbr
);
defineLazyProp(
  builtInRules,
  "attribute-validate-accept-charset",
  () => attributeValidateAcceptCharset
);
defineLazyProp(
  builtInRules,
  "attribute-validate-accept",
  () => attributeValidateAccept
);
defineLazyProp(
  builtInRules,
  "attribute-validate-accesskey",
  () => attributeValidateAccesskey
);
defineLazyProp(
  builtInRules,
  "attribute-validate-action",
  () => attributeValidateAction
);
defineLazyProp(
  builtInRules,
  "attribute-validate-align",
  () => attributeValidateAlign
);
defineLazyProp(
  builtInRules,
  "attribute-validate-alink",
  () => attributeValidateAlink
);
defineLazyProp(
  builtInRules,
  "attribute-validate-alt",
  () => attributeValidateAlt
);
defineLazyProp(
  builtInRules,
  "attribute-validate-archive",
  () => attributeValidateArchive
);
defineLazyProp(
  builtInRules,
  "attribute-validate-axis",
  () => attributeValidateAxis
);
defineLazyProp(
  builtInRules,
  "attribute-validate-background",
  () => attributeValidateBackground
);
defineLazyProp(
  builtInRules,
  "attribute-validate-bgcolor",
  () => attributeValidateBgcolor
);
defineLazyProp(
  builtInRules,
  "attribute-validate-border",
  () => attributeValidateBorder
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cellpadding",
  () => attributeValidateCellpadding
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cellspacing",
  () => attributeValidateCellspacing
);
defineLazyProp(
  builtInRules,
  "attribute-validate-char",
  () => attributeValidateChar
);
defineLazyProp(
  builtInRules,
  "attribute-validate-charoff",
  () => attributeValidateCharoff
);
defineLazyProp(
  builtInRules,
  "attribute-validate-charset",
  () => attributeValidateCharset
);
defineLazyProp(
  builtInRules,
  "attribute-validate-checked",
  () => attributeValidateChecked
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cite",
  () => attributeValidateCite
);
defineLazyProp(
  builtInRules,
  "attribute-validate-class",
  () => attributeValidateClass
);
defineLazyProp(
  builtInRules,
  "attribute-validate-classid",
  () => attributeValidateClassid
);
defineLazyProp(
  builtInRules,
  "attribute-validate-clear",
  () => attributeValidateClear
);
defineLazyProp(
  builtInRules,
  "attribute-validate-code",
  () => attributeValidateCode
);
defineLazyProp(
  builtInRules,
  "attribute-validate-codebase",
  () => attributeValidateCodebase
);
defineLazyProp(
  builtInRules,
  "attribute-validate-codetype",
  () => attributeValidateCodetype
);
defineLazyProp(
  builtInRules,
  "attribute-validate-color",
  () => attributeValidateColor
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cols",
  () => attributeValidateCols
);
defineLazyProp(
  builtInRules,
  "attribute-validate-colspan",
  () => attributeValidateColspan
);
defineLazyProp(
  builtInRules,
  "attribute-validate-compact",
  () => attributeValidateCompact
);
defineLazyProp(
  builtInRules,
  "attribute-validate-content",
  () => attributeValidateContent
);
defineLazyProp(
  builtInRules,
  "attribute-validate-coords",
  () => attributeValidateCoords
);
defineLazyProp(
  builtInRules,
  "attribute-validate-data",
  () => attributeValidateData
);
defineLazyProp(
  builtInRules,
  "attribute-validate-datetime",
  () => attributeValidateDatetime
);
defineLazyProp(
  builtInRules,
  "attribute-validate-declare",
  () => attributeValidateDeclare
);
defineLazyProp(
  builtInRules,
  "attribute-validate-defer",
  () => attributeValidateDefer
);
defineLazyProp(
  builtInRules,
  "attribute-validate-dir",
  () => attributeValidateDir
);
defineLazyProp(
  builtInRules,
  "attribute-validate-disabled",
  () => attributeValidateDisabled
);
defineLazyProp(
  builtInRules,
  "attribute-validate-enctype",
  () => attributeValidateEnctype
);
defineLazyProp(
  builtInRules,
  "attribute-validate-face",
  () => attributeValidateFace
);
defineLazyProp(
  builtInRules,
  "attribute-validate-for",
  () => attributeValidateFor
);
defineLazyProp(
  builtInRules,
  "attribute-validate-frame",
  () => attributeValidateFrame
);
defineLazyProp(
  builtInRules,
  "attribute-validate-frameborder",
  () => attributeValidateFrameborder
);
defineLazyProp(
  builtInRules,
  "attribute-validate-headers",
  () => attributeValidateHeaders
);
defineLazyProp(
  builtInRules,
  "attribute-validate-height",
  () => attributeValidateHeight
);
defineLazyProp(
  builtInRules,
  "attribute-validate-href",
  () => attributeValidateHref
);
defineLazyProp(
  builtInRules,
  "attribute-validate-hreflang",
  () => attributeValidateHreflang
);
defineLazyProp(
  builtInRules,
  "attribute-validate-hspace",
  () => attributeValidateHspace
);
defineLazyProp(
  builtInRules,
  "attribute-validate-http-equiv",
  () => attributeValidateHttpequiv
);
defineLazyProp(
  builtInRules,
  "attribute-validate-id",
  () => attributeValidateId
);
defineLazyProp(
  builtInRules,
  "attribute-validate-ismap",
  () => attributeValidateIsmap
);
defineLazyProp(
  builtInRules,
  "attribute-validate-label",
  () => attributeValidateLabel
);
defineLazyProp(
  builtInRules,
  "attribute-validate-lang",
  () => attributeValidateLang
);
defineLazyProp(
  builtInRules,
  "attribute-validate-language",
  () => attributeValidateLanguage
);
defineLazyProp(
  builtInRules,
  "attribute-validate-link",
  () => attributeValidateLink
);
defineLazyProp(
  builtInRules,
  "attribute-validate-longdesc",
  () => attributeValidateLongdesc
);
defineLazyProp(
  builtInRules,
  "attribute-validate-marginheight",
  () => attributeValidateMarginheight
);
defineLazyProp(
  builtInRules,
  "attribute-validate-marginwidth",
  () => attributeValidateMarginwidth
);
defineLazyProp(
  builtInRules,
  "attribute-validate-maxlength",
  () => attributeValidateMaxlength
);
defineLazyProp(
  builtInRules,
  "attribute-validate-media",
  () => attributeValidateMedia
);
defineLazyProp(
  builtInRules,
  "attribute-validate-method",
  () => attributeValidateMethod
);
defineLazyProp(
  builtInRules,
  "attribute-validate-multiple",
  () => attributeValidateMultiple
);
defineLazyProp(
  builtInRules,
  "attribute-validate-name",
  () => attributeValidateName
);
defineLazyProp(
  builtInRules,
  "attribute-validate-nohref",
  () => attributeValidateNohref
);
defineLazyProp(
  builtInRules,
  "attribute-validate-noresize",
  () => attributeValidateNoresize
);
defineLazyProp(
  builtInRules,
  "attribute-validate-noshade",
  () => attributeValidateNoshade
);
defineLazyProp(
  builtInRules,
  "attribute-validate-nowrap",
  () => attributeValidateNowrap
);
defineLazyProp(
  builtInRules,
  "attribute-validate-object",
  () => attributeValidateObject
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onblur",
  () => attributeValidateOnblur
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onchange",
  () => attributeValidateOnchange
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onclick",
  () => attributeValidateOnclick
);
defineLazyProp(
  builtInRules,
  "attribute-validate-ondblclick",
  () => attributeValidateOndblclick
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onfocus",
  () => attributeValidateOnfocus
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onkeydown",
  () => attributeValidateOnkeydown
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onkeypress",
  () => attributeValidateOnkeypress
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onkeyup",
  () => attributeValidateOnkeyup
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onload",
  () => attributeValidateOnload
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onmousedown",
  () => attributeValidateOnmousedown
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onmousemove",
  () => attributeValidateOnmousemove
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onmouseout",
  () => attributeValidateOnmouseout
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onmouseover",
  () => attributeValidateOnmouseover
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onmouseup",
  () => attributeValidateOnmouseup
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onreset",
  () => attributeValidateOnreset
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onsubmit",
  () => attributeValidateOnsubmit
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onselect",
  () => attributeValidateOnselect
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onunload",
  () => attributeValidateOnunload
);
defineLazyProp(
  builtInRules,
  "attribute-validate-profile",
  () => attributeValidateProfile
);
defineLazyProp(
  builtInRules,
  "attribute-validate-prompt",
  () => attributeValidatePrompt
);
defineLazyProp(
  builtInRules,
  "attribute-validate-readonly",
  () => attributeValidateReadonly
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rel",
  () => attributeValidateRel
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rev",
  () => attributeValidateRev
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rows",
  () => attributeValidateRows
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rowspan",
  () => attributeValidateRowspan
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rules",
  () => attributeValidateRules
);
defineLazyProp(
  builtInRules,
  "attribute-validate-scheme",
  () => attributeValidateScheme
);
defineLazyProp(
  builtInRules,
  "attribute-validate-scope",
  () => attributeValidateScope
);
defineLazyProp(
  builtInRules,
  "attribute-validate-scrolling",
  () => attributeValidateScrolling
);
defineLazyProp(
  builtInRules,
  "attribute-validate-selected",
  () => attributeValidateSelected
);
defineLazyProp(
  builtInRules,
  "attribute-validate-shape",
  () => attributeValidateShape
);
defineLazyProp(
  builtInRules,
  "attribute-validate-size",
  () => attributeValidateSize
);
defineLazyProp(
  builtInRules,
  "attribute-validate-span",
  () => attributeValidateSpan
);
defineLazyProp(
  builtInRules,
  "attribute-validate-src",
  () => attributeValidateSrc
);
defineLazyProp(
  builtInRules,
  "attribute-validate-standby",
  () => attributeValidateStandby
);
defineLazyProp(
  builtInRules,
  "attribute-validate-start",
  () => attributeValidateStart
);
defineLazyProp(
  builtInRules,
  "attribute-validate-style",
  () => attributeValidateStyle
);
defineLazyProp(
  builtInRules,
  "attribute-validate-summary",
  () => attributeValidateSummary
);
defineLazyProp(
  builtInRules,
  "attribute-validate-tabindex",
  () => attributeValidateTabindex
);
defineLazyProp(
  builtInRules,
  "attribute-validate-target",
  () => attributeValidateTarget
);
defineLazyProp(
  builtInRules,
  "attribute-validate-text",
  () => attributeValidateText
);
defineLazyProp(
  builtInRules,
  "attribute-validate-title",
  () => attributeValidateTitle
);
defineLazyProp(
  builtInRules,
  "attribute-validate-type",
  () => attributeValidateType
);
defineLazyProp(
  builtInRules,
  "attribute-validate-usemap",
  () => attributeValidateUsemap
);
defineLazyProp(
  builtInRules,
  "attribute-validate-valign",
  () => attributeValidateValign
);
defineLazyProp(
  builtInRules,
  "attribute-validate-value",
  () => attributeValidateValue
);
defineLazyProp(
  builtInRules,
  "attribute-validate-valuetype",
  () => attributeValidateValuetype
);
defineLazyProp(
  builtInRules,
  "attribute-validate-version",
  () => attributeValidateVersion
);
defineLazyProp(
  builtInRules,
  "attribute-validate-vlink",
  () => attributeValidateVlink
);
defineLazyProp(
  builtInRules,
  "attribute-validate-vspace",
  () => attributeValidateVspace
);
defineLazyProp(
  builtInRules,
  "attribute-validate-width",
  () => attributeValidateWidth
);
defineLazyProp(
  builtInRules,
  "bad-named-html-entity-not-email-friendly",
  () => htmlEntitiesNotEmailFriendly
);
defineLazyProp(builtInRules, "character-encode", () => characterEncode);
defineLazyProp(
  builtInRules,
  "character-unspaced-punctuation",
  () => characterUnspacedPunctuation
);
defineLazyProp(builtInRules, "media-malformed", () => mediaMalformed);
defineLazyProp(
  builtInRules,
  "comment-closing-malformed",
  () => commentClosingMalformed
);
defineLazyProp(
  builtInRules,
  "comment-opening-malformed",
  () => commentOpeningMalformed
);
defineLazyProp(
  builtInRules,
  "comment-mismatching-pair",
  () => commentMismatchingPair
);
defineLazyProp(
  builtInRules,
  "comment-conditional-nested",
  () => commentConditionalNested
);

// EMAIL rules
// -----------------------------------------------------------------------------

defineLazyProp(
  builtInRules,
  "email-td-sibling-padding",
  () => tdSiblingPadding
);

// CSS rules
// -----------------------------------------------------------------------------

defineLazyProp(builtInRules, "trailing-semi", () => trailingSemi);

// EXPORTS
// -----------------------------------------------------------------------------

function get(
  something: string
): (context: Linter, opts?: string | string[]) => RulesObj {
  return builtInRules[something];
}

// it expands the grouped rules, such as "bad-character", then
// removes the grouped rule so that only real, single rules
// are passed to Linter
function normaliseRequestedRules(opts: RulesObj): RulesObj {
  // console.log(
  //   `870 normaliseRequestedRules() RECEIVED: ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );
  const res: RulesObj = {};
  // first, if there are known group rules such as "bad-character", set
  // them as a foundation:
  if (Object.keys(opts).includes("all") && isAnEnabledValue(opts.all)) {
    Object.keys(builtInRules).forEach((ruleName) => {
      res[ruleName] = opts.all;
    });
  } else {
    let temp: string;
    if (
      Object.keys(opts).some((ruleName) => {
        if (
          ["bad-character", "bad-character*", "bad-character-*"].includes(
            ruleName
          )
        ) {
          temp = ruleName;
          return true;
        }
        return false;
      })
    ) {
      allBadCharacterRules.forEach((ruleName) => {
        res[ruleName] = opts[temp];
      });
    }
    if (
      Object.keys(opts).some((ruleName) => {
        if (["tag", "tag*", "tag-*"].includes(ruleName)) {
          temp = ruleName;
          return true;
        }
        return false;
      })
    ) {
      allTagRules.forEach((ruleName) => {
        res[ruleName] = opts[temp];
      });
    }
    if (
      Object.keys(opts).some((ruleName) => {
        if (["attribute", "attribute*", "attribute-*"].includes(ruleName)) {
          temp = ruleName;
          return true;
        }
        return false;
      })
    ) {
      allAttribRules.forEach((ruleName) => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).includes("bad-html-entity")) {
      allBadNamedHTMLEntityRules.forEach((ruleName) => {
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
    Object.keys(opts).forEach((ruleName) => {
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
          "bad-html-entity",
        ].includes(ruleName)
      ) {
        // now, it depends is an exact rule name being queried or is it wildcard
        if (Object.keys(builtInRules).includes(ruleName)) {
          res[ruleName] = clone(opts[ruleName]);
        } else if (ruleName.includes("*")) {
          Object.keys(builtInRules).forEach((builtInRule) => {
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
    `1954 normaliseRequestedRules() FINAL ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export { get, normaliseRequestedRules };
