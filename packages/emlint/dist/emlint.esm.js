/**
 * emlint
 * Pluggable email template code linter
 * Version: 2.5.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

import tokenizer from 'codsen-tokenizer';
import defineLazyProp from 'define-lazy-prop';
import clone from 'lodash.clonedeep';
import matcher from 'matcher';
import { leftStopAtNewLines, right, left } from 'string-left-right';
import { notEmailFriendly } from 'html-entities-not-email-friendly';
import he from 'he';
import lineColumn from 'line-column';
import stringFixBrokenNamedEntities from 'string-fix-broken-named-entities';

var allBadCharacterRules = [
	"bad-character-acknowledge",
	"bad-character-activate-arabic-form-shaping",
	"bad-character-activate-symmetric-swapping",
	"bad-character-application-program-command",
	"bad-character-backspace",
	"bad-character-bell",
	"bad-character-break-permitted-here",
	"bad-character-cancel",
	"bad-character-cancel-character",
	"bad-character-character-tabulation-set",
	"bad-character-character-tabulation-with-justification",
	"bad-character-control-0080",
	"bad-character-control-0081",
	"bad-character-control-0084",
	"bad-character-control-0099",
	"bad-character-control-sequence-introducer",
	"bad-character-data-link-escape",
	"bad-character-delete",
	"bad-character-device-control-four",
	"bad-character-device-control-one",
	"bad-character-device-control-string",
	"bad-character-device-control-three",
	"bad-character-device-control-two",
	"bad-character-em-quad",
	"bad-character-em-space",
	"bad-character-en-quad",
	"bad-character-en-space",
	"bad-character-end-of-medium",
	"bad-character-end-of-protected-area",
	"bad-character-end-of-selected-area",
	"bad-character-end-of-text",
	"bad-character-end-of-transmission",
	"bad-character-end-of-transmission-block",
	"bad-character-enquiry",
	"bad-character-escape",
	"bad-character-figure-space",
	"bad-character-first-strong-isolate",
	"bad-character-form-feed",
	"bad-character-four-per-em-space",
	"bad-character-function-application",
	"bad-character-hair-space",
	"bad-character-ideographic-space",
	"bad-character-information-separator-four",
	"bad-character-information-separator-one",
	"bad-character-information-separator-three",
	"bad-character-information-separator-two",
	"bad-character-inhibit-arabic-form-shaping",
	"bad-character-inhibit-symmetric-swapping",
	"bad-character-interlinear-annotation-anchor",
	"bad-character-interlinear-annotation-separator",
	"bad-character-interlinear-annotation-terminator",
	"bad-character-invisible-plus",
	"bad-character-invisible-separator",
	"bad-character-invisible-times",
	"bad-character-left-to-right-embedding",
	"bad-character-left-to-right-isolate",
	"bad-character-left-to-right-mark",
	"bad-character-left-to-right-override",
	"bad-character-line-separator",
	"bad-character-line-tabulation",
	"bad-character-line-tabulation-set",
	"bad-character-medium-mathematical-space",
	"bad-character-message-waiting",
	"bad-character-narrow-no-break-space",
	"bad-character-national-digit-shapes",
	"bad-character-negative-acknowledge",
	"bad-character-next-line",
	"bad-character-no-break-here",
	"bad-character-nominal-digit-shapes",
	"bad-character-non-breaking-space",
	"bad-character-null",
	"bad-character-ogham-space-mark",
	"bad-character-operating-system-command",
	"bad-character-paragraph-separator",
	"bad-character-partial-line-backward",
	"bad-character-partial-line-forward",
	"bad-character-pop-directional-formatting",
	"bad-character-pop-directional-isolate",
	"bad-character-private-message",
	"bad-character-private-use-1",
	"bad-character-private-use-2",
	"bad-character-punctuation-space",
	"bad-character-replacement-character",
	"bad-character-reverse-line-feed",
	"bad-character-right-to-left-embedding",
	"bad-character-right-to-left-isolate",
	"bad-character-right-to-left-mark",
	"bad-character-right-to-left-override",
	"bad-character-set-transmit-state",
	"bad-character-shift-in",
	"bad-character-shift-out",
	"bad-character-single-character-introducer",
	"bad-character-single-shift-three",
	"bad-character-single-shift-two",
	"bad-character-six-per-em-space",
	"bad-character-soft-hyphen",
	"bad-character-start-of-heading",
	"bad-character-start-of-protected-area",
	"bad-character-start-of-selected-area",
	"bad-character-start-of-string",
	"bad-character-start-of-text",
	"bad-character-string-terminator",
	"bad-character-substitute",
	"bad-character-synchronous-idle",
	"bad-character-tabulation",
	"bad-character-thin-space",
	"bad-character-three-per-em-space",
	"bad-character-word-joiner",
	"bad-character-zero-width-joiner",
	"bad-character-zero-width-no-break-space",
	"bad-character-zero-width-non-joiner",
	"bad-character-zero-width-space"
];

var allTagRules = [
	"tag-bold",
	"tag-closing-backslash",
	"tag-is-present",
	"tag-name-case",
	"tag-space-after-opening-bracket",
	"tag-space-before-closing-slash",
	"tag-space-between-slash-and-bracket",
	"tag-void-slash"
];

var allAttribRules = [
	"attribute-malformed"
];

var allBadNamedHTMLEntityRules = [
	"bad-malformed-numeric-character-entity",
	"bad-named-html-entity-malformed-nbsp",
	"bad-named-html-entity-multiple-encoding",
	"bad-named-html-entity-not-email-friendly",
	"bad-named-html-entity-unrecognised"
];

function isEnabled(maybeARulesValue) {
  if (Number.isInteger(maybeARulesValue) && maybeARulesValue > 0) {
    return maybeARulesValue;
  } else if (
    Array.isArray(maybeARulesValue) &&
    maybeARulesValue.length &&
    Number.isInteger(maybeARulesValue[0]) &&
    maybeARulesValue[0] > 0
  ) {
    return maybeARulesValue[0];
  }
  return 0;
}

function badCharacterNull(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 0) {
        context.report({
          ruleId: "bad-character-null",
          message: "Bad character - NULL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfHeading(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 1) {
        context.report({
          ruleId: "bad-character-start-of-heading",
          message: "Bad character - START OF HEADING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfText(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 2) {
        context.report({
          ruleId: "bad-character-start-of-text",
          message: "Bad character - START OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfText(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 3) {
        context.report({
          ruleId: "bad-character-end-of-text",
          message: "Bad character - END OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, "\n"]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfTransmission(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 4) {
        context.report({
          ruleId: "bad-character-end-of-transmission",
          message: "Bad character - END OF TRANSMISSION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEnquiry(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 5) {
        context.report({
          ruleId: "bad-character-enquiry",
          message: "Bad character - ENQUIRY.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterAcknowledge(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 6) {
        context.report({
          ruleId: "bad-character-acknowledge",
          message: "Bad character - ACKNOWLEDGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBell(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 7) {
        context.report({
          ruleId: "bad-character-bell",
          message: "Bad character - BELL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBackspace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8) {
        context.report({
          ruleId: "bad-character-backspace",
          message: "Bad character - BACKSPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterTabulation(context, ...originalOpts) {
  let mode = "never";
  if (
    Array.isArray(originalOpts) &&
    originalOpts[0] &&
    typeof originalOpts[0] === "string" &&
    originalOpts[0].toLowerCase() === "indentationisfine"
  ) {
    mode = "indentationIsFine";
  }
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 9) {
        if (mode === "never") {
          context.report({
            ruleId: "bad-character-tabulation",
            message: "Bad character - TABULATION.",
            idxFrom: i,
            idxTo: i + 1,
            fix: {
              ranges: [[i, i + 1, " "]]
            }
          });
        } else if (mode === "indentationIsFine") {
          const charTopOnBreaksIdx = leftStopAtNewLines(context.str, i);
          if (
            charTopOnBreaksIdx !== null &&
            context.str[charTopOnBreaksIdx].trim().length
          ) {
            context.report({
              ruleId: "bad-character-tabulation",
              message: "Bad character - TABULATION.",
              idxFrom: i,
              idxTo: i + 1,
              fix: {
                ranges: [[i, i + 1, " "]]
              }
            });
          }
        }
      }
    }
  };
}

function badCharacterLineTabulation(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 11) {
        context.report({
          ruleId: "bad-character-line-tabulation",
          message: "Bad character - LINE TABULATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFormFeed(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 12) {
        context.report({
          ruleId: "bad-character-form-feed",
          message: "Bad character - FORM FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterShiftOut(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 14) {
        context.report({
          ruleId: "bad-character-shift-out",
          message: "Bad character - SHIFT OUT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterShiftIn(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 15) {
        context.report({
          ruleId: "bad-character-shift-in",
          message: "Bad character - SHIFT IN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDataLinkEscape(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 16) {
        context.report({
          ruleId: "bad-character-data-link-escape",
          message: "Bad character - DATA LINK ESCAPE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlOne(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 17) {
        context.report({
          ruleId: "bad-character-device-control-one",
          message: "Bad character - DEVICE CONTROL ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 18) {
        context.report({
          ruleId: "bad-character-device-control-two",
          message: "Bad character - DEVICE CONTROL TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlThree(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 19) {
        context.report({
          ruleId: "bad-character-device-control-three",
          message: "Bad character - DEVICE CONTROL THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlFour(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 20) {
        context.report({
          ruleId: "bad-character-device-control-four",
          message: "Bad character - DEVICE CONTROL FOUR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNegativeAcknowledge(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 21) {
        context.report({
          ruleId: "bad-character-negative-acknowledge",
          message: "Bad character - NEGATIVE ACKNOWLEDGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSynchronousIdle(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 22) {
        context.report({
          ruleId: "bad-character-synchronous-idle",
          message: "Bad character - SYNCHRONOUS IDLE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfTransmissionBlock(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 23) {
        context.report({
          ruleId: "bad-character-end-of-transmission-block",
          message: "Bad character - END OF TRANSMISSION BLOCK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCancel(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 24) {
        context.report({
          ruleId: "bad-character-cancel",
          message: "Bad character - CANCEL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfMedium(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 25) {
        context.report({
          ruleId: "bad-character-end-of-medium",
          message: "Bad character - END OF MEDIUM.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSubstitute(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 26) {
        context.report({
          ruleId: "bad-character-substitute",
          message: "Bad character - SUBSTITUTE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEscape(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 27) {
        context.report({
          ruleId: "bad-character-escape",
          message: "Bad character - ESCAPE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorFour(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 28) {
        context.report({
          ruleId: "bad-character-information-separator-four",
          message: "Bad character - INFORMATION SEPARATOR FOUR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorThree(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 29) {
        context.report({
          ruleId: "bad-character-information-separator-three",
          message: "Bad character - INFORMATION SEPARATOR THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 30) {
        context.report({
          ruleId: "bad-character-information-separator-two",
          message: "Bad character - INFORMATION SEPARATOR TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorTwo$1(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 31) {
        context.report({
          ruleId: "bad-character-information-separator-one",
          message: "Bad character - INFORMATION SEPARATOR ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDelete(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 127) {
        context.report({
          ruleId: "bad-character-delete",
          message: "Bad character - DELETE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0080(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 128) {
        context.report({
          ruleId: "bad-character-control-0080",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0081(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 129) {
        context.report({
          ruleId: "bad-character-control-0081",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBreakPermittedHere(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 130) {
        context.report({
          ruleId: "bad-character-break-permitted-here",
          message: "Bad character - BREAK PERMITTED HERE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNoBreakHere(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 131) {
        context.report({
          ruleId: "bad-character-no-break-here",
          message: "Bad character - NO BREAK HERE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0084(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 132) {
        context.report({
          ruleId: "bad-character-control-0084",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNextLine(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 133) {
        context.report({
          ruleId: "bad-character-next-line",
          message: "Bad character - NEXT LINE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfSelectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 134) {
        context.report({
          ruleId: "bad-character-start-of-selected-area",
          message: "Bad character - START OF SELECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfSelectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 135) {
        context.report({
          ruleId: "bad-character-end-of-selected-area",
          message: "Bad character - END OF SELECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCharacterTabulationSet(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 136) {
        context.report({
          ruleId: "bad-character-character-tabulation-set",
          message: "Bad character - CHARACTER TABULATION SET.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCharacterTabulationWithJustification(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 137) {
        context.report({
          ruleId: "bad-character-character-tabulation-with-justification",
          message: "Bad character - CHARACTER TABULATION WITH JUSTIFICATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLineTabulationSet(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 138) {
        context.report({
          ruleId: "bad-character-line-tabulation-set",
          message: "Bad character - LINE TABULATION SET.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPartialLineForward(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 139) {
        context.report({
          ruleId: "bad-character-partial-line-forward",
          message: "Bad character - PARTIAL LINE FORWARD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPartialLineBackward(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 140) {
        context.report({
          ruleId: "bad-character-partial-line-backward",
          message: "Bad character - PARTIAL LINE BACKWARD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterReverseLineFeed(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 141) {
        context.report({
          ruleId: "bad-character-reverse-line-feed",
          message: "Bad character - REVERSE LINE FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleShiftTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 142) {
        context.report({
          ruleId: "bad-character-single-shift-two",
          message: "Bad character - SINGLE SHIFT TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleShiftTwo$1(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 143) {
        context.report({
          ruleId: "bad-character-single-shift-three",
          message: "Bad character - SINGLE SHIFT THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlString(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 144) {
        context.report({
          ruleId: "bad-character-device-control-string",
          message: "Bad character - DEVICE CONTROL STRING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateUseOne(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 145) {
        context.report({
          ruleId: "bad-character-private-use-1",
          message: "Bad character - PRIVATE USE ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateUseTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 146) {
        context.report({
          ruleId: "bad-character-private-use-2",
          message: "Bad character - PRIVATE USE TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSetTransmitState(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 147) {
        context.report({
          ruleId: "bad-character-set-transmit-state",
          message: "Bad character - SET TRANSMIT STATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCancelCharacter(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 148) {
        context.report({
          ruleId: "bad-character-cancel-character",
          message: "Bad character - CANCEL CHARACTER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterMessageWaiting(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 149) {
        context.report({
          ruleId: "bad-character-message-waiting",
          message: "Bad character - MESSAGE WAITING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfProtectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 150) {
        context.report({
          ruleId: "bad-character-start-of-protected-area",
          message: "Bad character - START OF PROTECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfProtectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 151) {
        context.report({
          ruleId: "bad-character-end-of-protected-area",
          message: "Bad character - END OF PROTECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfString(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 152) {
        context.report({
          ruleId: "bad-character-start-of-string",
          message: "Bad character - START OF STRING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0099(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 153) {
        context.report({
          ruleId: "bad-character-control-0099",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleCharacterIntroducer(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 154) {
        context.report({
          ruleId: "bad-character-single-character-introducer",
          message: "Bad character - SINGLE CHARACTER INTRODUCER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControlSequenceIntroducer(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 155) {
        context.report({
          ruleId: "bad-character-control-sequence-introducer",
          message: "Bad character - CONTROL SEQUENCE INTRODUCER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStringTerminator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 156) {
        context.report({
          ruleId: "bad-character-string-terminator",
          message: "Bad character - STRING TERMINATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterOperatingSystemCommand(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 157) {
        context.report({
          ruleId: "bad-character-operating-system-command",
          message: "Bad character - OPERATING SYSTEM COMMAND.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateMessage(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 158) {
        context.report({
          ruleId: "bad-character-private-message",
          message: "Bad character - PRIVATE MESSAGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterApplicationProgramCommand(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 159) {
        context.report({
          ruleId: "bad-character-application-program-command",
          message: "Bad character - APPLICATION PROGRAM COMMAND.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSoftHyphen(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 173) {
        context.report({
          ruleId: "bad-character-soft-hyphen",
          message: "Bad character - SOFT HYPHEN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNonBreakingSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 160) {
        context.report({
          ruleId: "bad-character-non-breaking-space",
          message: "Bad character - NON-BREAKING SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterOghamSpaceMark(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 5760) {
        context.report({
          ruleId: "bad-character-ogham-space-mark",
          message: "Bad character - OGHAM SPACE MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEnQuad(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8192) {
        context.report({
          ruleId: "bad-character-en-quad",
          message: "Bad character - EN QUAD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEmQuad(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8193) {
        context.report({
          ruleId: "bad-character-em-quad",
          message: "Bad character - EM QUAD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEnSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8194) {
        context.report({
          ruleId: "bad-character-en-space",
          message: "Bad character - EN SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8195) {
        context.report({
          ruleId: "bad-character-em-space",
          message: "Bad character - EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterThreePerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8196) {
        context.report({
          ruleId: "bad-character-three-per-em-space",
          message: "Bad character - THREE-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterFourPerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8197) {
        context.report({
          ruleId: "bad-character-four-per-em-space",
          message: "Bad character - FOUR-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterSixPerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8198) {
        context.report({
          ruleId: "bad-character-six-per-em-space",
          message: "Bad character - SIX-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterFigureSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8199) {
        context.report({
          ruleId: "bad-character-figure-space",
          message: "Bad character - FIGURE SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterPunctuationSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8200) {
        context.report({
          ruleId: "bad-character-punctuation-space",
          message: "Bad character - PUNCTUATION SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterThinSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8201) {
        context.report({
          ruleId: "bad-character-thin-space",
          message: "Bad character - THIN SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterHairSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8202) {
        context.report({
          ruleId: "bad-character-hair-space",
          message: "Bad character - HAIR SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8203) {
        context.report({
          ruleId: "bad-character-zero-width-space",
          message: "Bad character - ZERO WIDTH SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthNonJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8204) {
        context.report({
          ruleId: "bad-character-zero-width-non-joiner",
          message: "Bad character - ZERO WIDTH NON-JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8205) {
        context.report({
          ruleId: "bad-character-zero-width-joiner",
          message: "Bad character - ZERO WIDTH JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightMark(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8206) {
        context.report({
          ruleId: "bad-character-left-to-right-mark",
          message: "Bad character - LEFT-TO-RIGHT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftMark(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8207) {
        context.report({
          ruleId: "bad-character-right-to-left-mark",
          message: "Bad character - RIGHT-TO-LEFT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightEmbedding(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8234) {
        context.report({
          ruleId: "bad-character-left-to-right-embedding",
          message: "Bad character - LEFT-TO-RIGHT EMBEDDING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftEmbedding(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8235) {
        context.report({
          ruleId: "bad-character-right-to-left-embedding",
          message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPopDirectionalFormatting(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8236) {
        context.report({
          ruleId: "bad-character-pop-directional-formatting",
          message: "Bad character - POP DIRECTIONAL FORMATTING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightOverride(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8237) {
        context.report({
          ruleId: "bad-character-left-to-right-override",
          message: "Bad character - LEFT-TO-RIGHT OVERRIDE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftOverride(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8238) {
        context.report({
          ruleId: "bad-character-right-to-left-override",
          message: "Bad character - RIGHT-TO-LEFT OVERRIDE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterWordJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8288) {
        context.report({
          ruleId: "bad-character-word-joiner",
          message: "Bad character - WORD JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFunctionApplication(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8289) {
        context.report({
          ruleId: "bad-character-function-application",
          message: "Bad character - FUNCTION APPLICATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisibleTimes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8290) {
        context.report({
          ruleId: "bad-character-invisible-times",
          message: "Bad character - INVISIBLE TIMES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisibleSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8291) {
        context.report({
          ruleId: "bad-character-invisible-separator",
          message: "Bad character - INVISIBLE SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisiblePlus(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8292) {
        context.report({
          ruleId: "bad-character-invisible-plus",
          message: "Bad character - INVISIBLE PLUS.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8294) {
        context.report({
          ruleId: "bad-character-left-to-right-isolate",
          message: "Bad character - LEFT-TO-RIGHT ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8295) {
        context.report({
          ruleId: "bad-character-right-to-left-isolate",
          message: "Bad character - RIGHT-TO-LEFT ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFirstStrongIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8296) {
        context.report({
          ruleId: "bad-character-first-strong-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPopDirectionalIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8297) {
        context.report({
          ruleId: "bad-character-pop-directional-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInhibitSymmetricSwapping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8298) {
        context.report({
          ruleId: "bad-character-inhibit-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterActivateSymmetricSwapping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8299) {
        context.report({
          ruleId: "bad-character-activate-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInhibitArabicFormShaping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8300) {
        context.report({
          ruleId: "bad-character-inhibit-arabic-form-shaping",
          message: "Bad character - INHIBIT ARABIC FORM SHAPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterActivateArabicFormShaping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8301) {
        context.report({
          ruleId: "bad-character-activate-arabic-form-shaping",
          message: "Bad character - ACTIVATE ARABIC FORM SHAPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNationalDigitShapes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8302) {
        context.report({
          ruleId: "bad-character-national-digit-shapes",
          message: "Bad character - NATIONAL DIGIT SHAPES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNominalDigitShapes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8303) {
        context.report({
          ruleId: "bad-character-nominal-digit-shapes",
          message: "Bad character - NOMINAL DIGIT SHAPES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthNoBreakSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65279) {
        context.report({
          ruleId: "bad-character-zero-width-no-break-space",
          message: "Bad character - ZERO WIDTH NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationAnchor(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65529) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-anchor",
          message: "Bad character - INTERLINEAR ANNOTATION ANCHOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65530) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-separator",
          message: "Bad character - INTERLINEAR ANNOTATION SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationTerminator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65531) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-terminator",
          message: "Bad character - INTERLINEAR ANNOTATION TERMINATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLineSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8232) {
        context.report({
          ruleId: "bad-character-line-separator",
          message: "Bad character - LINE SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterParagraphSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8233) {
        context.report({
          ruleId: "bad-character-paragraph-separator",
          message: "Bad character - PARAGRAPH SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNarrowNoBreakSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8239) {
        context.report({
          ruleId: "bad-character-narrow-no-break-space",
          message: "Bad character - NARROW NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterMediumMathematicalSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8287) {
        context.report({
          ruleId: "bad-character-medium-mathematical-space",
          message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterIdeographicSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 12288) {
        context.report({
          ruleId: "bad-character-ideographic-space",
          message: "Bad character - IDEOGRAPHIC SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterReplacementCharacter(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65533) {
        context.report({
          ruleId: "bad-character-replacement-character",
          message: "Bad character - REPLACEMENT CHARACTER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function tagSpaceAfterOpeningBracket(context) {
  return {
    html: function(node) {
      const ranges = [];
      if (
        typeof context.str[node.start + 1] === "string" &&
        !context.str[node.start + 1].trim().length
      ) {
        ranges.push([node.start + 1, right(context.str, node.start + 1)]);
      }
      if (!context.str[node.tagNameStartAt - 1].trim().length) {
        const charToTheLeftOfTagNameIdx = left(
          context.str,
          node.tagNameStartAt
        );
        if (charToTheLeftOfTagNameIdx !== node.start) {
          ranges.push([charToTheLeftOfTagNameIdx + 1, node.tagNameStartAt]);
        }
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-space-after-opening-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: { ranges }
        });
      }
    }
  };
}

function tagSpaceBeforeClosingSlash(context, ...opts) {
  return {
    html: function(node) {
      const gapValue = context.str.slice(node.start + 1, node.tagNameStartAt);
      let mode = "never";
      if (Array.isArray(opts) && ["always", "never"].includes(opts[0])) {
        mode = opts[0];
      }
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos);
      if (
        mode === "never" &&
        node.void &&
        context.str[slashPos] === "/" &&
        leftOfSlashPos < slashPos - 1
      ) {
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Bad whitespace.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: slashPos,
          fix: { ranges: [[leftOfSlashPos + 1, slashPos]] }
        });
      } else if (
        mode === "always" &&
        node.void &&
        context.str[slashPos] === "/" &&
        leftOfSlashPos === slashPos - 1
      ) {
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Missing space.",
          idxFrom: slashPos,
          idxTo: slashPos,
          fix: { ranges: [[slashPos, slashPos, " "]] }
        });
      }
    }
  };
}

function tagSpaceBetweenSlashAndBracket(context) {
  return {
    html: function(node) {
      if (
        Number.isInteger(node.end) &&
        context.str[node.end - 1] === ">" &&
        context.str[left(context.str, node.end - 1)] === "/" &&
        left(context.str, node.end - 1) < node.end - 2
      ) {
        const idxFrom = left(context.str, node.end - 1) + 1;
        context.report({
          ruleId: "tag-space-between-slash-and-bracket",
          message: "Bad whitespace.",
          idxFrom,
          idxTo: node.end - 1,
          fix: { ranges: [[idxFrom, node.end - 1]] }
        });
      }
    }
  };
}

const BACKSLASH = "\u005C";
function tagClosingBackslash(context) {
  return {
    html: function(node) {
      const ranges = [];
      if (
        Number.isInteger(node.start) &&
        Number.isInteger(node.tagNameStartAt) &&
        context.str.slice(node.start, node.tagNameStartAt).includes(BACKSLASH)
      ) {
        for (let i = node.start; i < node.tagNameStartAt; i++) {
          if (context.str[i] === BACKSLASH) {
            ranges.push([i, i + 1]);
          }
        }
      }
      if (
        Number.isInteger(node.end) &&
        context.str[node.end - 1] === ">" &&
        context.str[left(context.str, node.end - 1)] === BACKSLASH
      ) {
        let message = node.void
          ? "Replace backslash with slash."
          : "Delete this.";
        const backSlashPos = left(context.str, node.end - 1);
        let idxFrom = left(context.str, backSlashPos) + 1;
        let whatToInsert = node.void ? "/" : "";
        if (
          context.processedRulesConfig["tag-space-before-closing-slash"] &&
          ((Number.isInteger(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig["tag-space-before-closing-slash"] >
              0) ||
            (Array.isArray(
              context.processedRulesConfig["tag-space-before-closing-slash"]
            ) &&
              context.processedRulesConfig[
                "tag-space-before-closing-slash"
              ][0] > 0 &&
              context.processedRulesConfig[
                "tag-space-before-closing-slash"
              ][1] === "never"))
        ) {
          idxFrom = left(context.str, backSlashPos) + 1;
        }
        if (
          Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
          context.processedRulesConfig["tag-space-before-closing-slash"][0] >
            0 &&
          context.processedRulesConfig["tag-space-before-closing-slash"][1] ===
            "always"
        ) {
          idxFrom = left(context.str, backSlashPos) + 1;
          whatToInsert = ` ${whatToInsert}`;
          if (node.void && context.str[idxFrom + 1] === " ") {
            idxFrom++;
            whatToInsert = whatToInsert.trim();
          } else if (!node.void) {
            whatToInsert = whatToInsert.trim();
          }
        }
        if (
          node.void &&
          Array.isArray(context.processedRulesConfig["tag-void-slash"]) &&
          context.processedRulesConfig["tag-void-slash"][0] > 0 &&
          context.processedRulesConfig["tag-void-slash"][1] === "never"
        ) {
          whatToInsert = "";
          idxFrom = left(context.str, backSlashPos) + 1;
          message = "Delete this.";
        }
        context.report({
          ruleId: "tag-closing-backslash",
          message,
          idxFrom,
          idxTo: node.end - 1,
          fix: { ranges: [[idxFrom, node.end - 1, whatToInsert]] }
        });
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-closing-backslash",
          message: "Wrong slash - backslash.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: { ranges }
        });
      }
    }
  };
}

const BACKSLASH$1 = "\u005C";
function tagVoidSlash(context, ...opts) {
  return {
    html: function(node) {
      let mode = "always";
      if (Array.isArray(opts) && ["always", "never"].includes(opts[0])) {
        mode = opts[0];
      }
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos);
      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        context.report({
          ruleId: "tag-void-slash",
          message: "Remove the slash.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: closingBracketPos,
          fix: { ranges: [[leftOfSlashPos + 1, closingBracketPos]] }
        });
      } else if (
        mode === "always" &&
        node.void &&
        context.str[slashPos] !== "/" &&
        (!context.processedRulesConfig["tag-closing-backslash"] ||
          !(
            context.str[slashPos] === BACKSLASH$1 &&
            ((Number.isInteger(
              context.processedRulesConfig["tag-closing-backslash"]
            ) &&
              context.processedRulesConfig["tag-closing-backslash"] > 0) ||
              (Array.isArray(
                context.processedRulesConfig["tag-closing-backslash"]
              ) &&
                context.processedRulesConfig["tag-closing-backslash"][0] > 0 &&
                context.processedRulesConfig["tag-closing-backslash"][1] ===
                  "always"))
          ))
      ) {
        if (
          Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
          context.processedRulesConfig["tag-space-before-closing-slash"][1] ===
            "always"
        ) {
          if (context.str[slashPos + 1] === " ") {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 2,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 2, closingBracketPos, "/"]] }
            });
          } else {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 1,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 1, closingBracketPos, " /"]] }
            });
          }
        } else if (
          context.processedRulesConfig["tag-space-before-closing-slash"] ===
            undefined ||
          (Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig[
              "tag-space-before-closing-slash"
            ][1] === "never") ||
          (Number.isInteger(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig["tag-space-before-closing-slash"] > 0)
        ) {
          context.report({
            ruleId: "tag-void-slash",
            message: "Missing slash.",
            idxFrom: slashPos + 1,
            idxTo: closingBracketPos,
            fix: { ranges: [[slashPos + 1, closingBracketPos, "/"]] }
          });
        }
      }
    }
  };
}

function tagNameCase(context) {
  const knownUpperCaseTags = ["DOCTYPE", "CDATA"];
  return {
    html: function(node) {
      if (node.tagName && node.recognised === true) {
        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          if (node.tagName !== node.tagName.toUpperCase()) {
            const ranges = [
              [
                node.tagNameStartAt,
                node.tagNameEndAt,
                node.tagName.toUpperCase()
              ]
            ];
            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartAt,
              idxTo: node.tagNameEndAt,
              fix: { ranges }
            });
          }
        } else if (node.tagName !== node.tagName.toLowerCase()) {
          const ranges = [
            [node.tagNameStartAt, node.tagNameEndAt, node.tagName.toLowerCase()]
          ];
          context.report({
            ruleId: "tag-name-case",
            message: "Bad tag name case.",
            idxFrom: node.tagNameStartAt,
            idxTo: node.tagNameEndAt,
            fix: { ranges }
          });
        }
      }
    }
  };
}

function tagIsPresent(context, ...opts) {
  return {
    html: function(node) {
      if (Array.isArray(opts) && opts.length) {
        const temp = matcher([node.tagName], opts);
        if (matcher([node.tagName], opts).length) {
          context.report({
            ruleId: "tag-is-present",
            message: `${node.tagName} is not allowed.`,
            idxFrom: node.start,
            idxTo: node.end,
            fix: { ranges: [[node.start, node.end]] }
          });
        }
      }
    }
  };
}

function tagBold(context, ...opts) {
  return {
    html: function(node) {
      let suggested = "strong";
      if (
        Array.isArray(opts) &&
        typeof opts[0] === "string" &&
        opts[0].toLowerCase() === "b"
      ) {
        suggested = "b";
      }
      if (node.tagName === "bold") {
        context.report({
          ruleId: "tag-bold",
          message: `Tag "bold" does not exist in HTML.`,
          idxFrom: node.start,
          idxTo: node.end,
          fix: { ranges: [[node.tagNameStartAt, node.tagNameEndAt, suggested]] }
        });
      }
    }
  };
}

function attributeMalformed(context, ...opts) {
  return {
    attribute: function(node) {
      if (
        node.attribValueStartAt !== null &&
        context.str[node.attribNameEndAt] !== "="
      ) {
        context.report({
          ruleId: "attribute-malformed",
          message: `Equal is missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd,
          fix: { ranges: [[node.attribNameEndAt, node.attribNameEndAt, "="]] }
        });
      }
    }
  };
}

function htmlEntitiesNotEmailFriendly(context) {
  return {
    entity: function({ idxFrom, idxTo }) {
      if (
        Object.keys(notEmailFriendly).includes(
          context.str.slice(idxFrom + 1, idxTo - 1)
        )
      ) {
        context.report({
          ruleId: "bad-named-html-entity-not-email-friendly",
          message: "Email-unfriendly named HTML entity.",
          idxFrom: idxFrom,
          idxTo: idxTo,
          fix: {
            ranges: [
              [
                idxFrom,
                idxTo,
                `&${
                  notEmailFriendly[context.str.slice(idxFrom + 1, idxTo - 1)]
                };`
              ]
            ]
          }
        });
      }
    }
  };
}

function characterEncode(context, ...opts) {
  return {
    character: function({ type, chr, i }) {
      let mode = "named";
      if (Array.isArray(opts) && ["named", "numeric"].includes(opts[0])) {
        mode = opts[0];
      }
      if (
        type === "text" &&
        typeof chr === "string" &&
        (chr.charCodeAt(0) > 127 || `<>"&`.includes(chr)) &&
        (chr.charCodeAt(0) !== 160 ||
          !Object.keys(context.processedRulesConfig).includes(
            "bad-character-non-breaking-space"
          ) ||
          !isEnabled(
            context.processedRulesConfig["bad-character-non-breaking-space"]
          ))
      ) {
        let encodedChr = he.encode(chr, {
          useNamedReferences: mode === "named"
        });
        if (
          Object.keys(notEmailFriendly).includes(
            encodedChr.slice(1, encodedChr.length - 1)
          )
        ) {
          encodedChr = `&${
            notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)]
          };`;
        }
        let charName = "";
        if (chr.charCodeAt(0) === 160) {
          charName = " no-break space";
        } else if (chr.charCodeAt(0) === 38) {
          charName = " ampersand";
        } else if (chr.charCodeAt(0) === 60) {
          charName = " less than";
        } else if (chr.charCodeAt(0) === 62) {
          charName = " greater than";
        } else if (chr.charCodeAt(0) === 34) {
          charName = " double quotes";
        } else if (chr.charCodeAt(0) === 163) {
          charName = " pound sign";
        }
        context.report({
          ruleId: "character-encode",
          message: `Unencoded${charName} character.`,
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, encodedChr]]
          }
        });
      }
    }
  };
}

function characterUnspacedPunctuation(context, ...originalOpts) {
  const charCodeMapping = {
    "63": "questionMark",
    "33": "exclamationMark",
    "59": "semicolon",
    "187": "rightDoubleAngleQuotMark",
    "171": "leftDoubleAngleQuotMark"
  };
  return {
    text: function(node) {
      const defaults = {
        questionMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        exclamationMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        semicolon: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        rightDoubleAngleQuotMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        leftDoubleAngleQuotMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        }
      };
      let opts = Object.assign({}, defaults);
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        typeof originalOpts[0] === "object" &&
        originalOpts[0] !== null
      ) {
        opts = Object.assign({}, defaults, originalOpts[0]);
      }
      for (let i = node.start; i < node.end; i++) {
        const charCode = context.str[i].charCodeAt(0);
        if (charCodeMapping[String(charCode)]) {
          const charName = charCodeMapping[String(charCode)];
          if (
            opts[charName].whitespaceLeft === "never" &&
            i &&
            !context.str[i - 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: left(context.str, i) + 1,
              idxTo: i,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[left(context.str, i) + 1, i]]
              }
            });
          }
          if (
            opts[charName].whitespaceRight === "never" &&
            i < node.end - 1 &&
            !context.str[i + 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: i + 1,
              idxTo: right(context.str, i),
              message: "Remove the whitespace.",
              fix: {
                ranges: [[i + 1, right(context.str, i)]]
              }
            });
          }
          if (
            opts[charName].whitespaceLeft === "always" &&
            i &&
            context.str[i - 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i, i, " "]]
              }
            });
          }
          if (
            opts[charName].whitespaceRight === "always" &&
            i < node.end - 1 &&
            context.str[i + 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i + 1, i + 1, " "]]
              }
            });
          }
        }
      }
    }
  };
}

const builtInRules = {};
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
  () => badCharacterInformationSeparatorTwo$1
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
  () => badCharacterSingleShiftTwo$1
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
defineLazyProp(
  builtInRules,
  "tag-space-after-opening-bracket",
  () => tagSpaceAfterOpeningBracket
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
defineLazyProp(builtInRules, "attribute-malformed", () => attributeMalformed);
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
function get(something) {
  return builtInRules[something];
}
function normaliseRequestedRules(opts) {
  const res = {};
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
        res[ruleName] = opts["bad-html-entity"];
      });
    }
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
        if (Object.keys(builtInRules).includes(ruleName)) {
          res[ruleName] = clone(opts[ruleName]);
        } else if (ruleName.includes("*")) {
          Object.keys(builtInRules).forEach(builtInRule => {
            if (matcher.isMatch(builtInRule, ruleName)) {
              res[builtInRule] = clone(opts[ruleName]);
            }
          });
        }
      }
    });
  }
  return res;
}

var domain;
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);
function EventEmitter() {
  EventEmitter.init.call(this);
}
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.usingDomains = false;
EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;
EventEmitter.defaultMaxListeners = 10;
EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    if (domain.active && !(this instanceof domain.Domain)) ;
  }
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};
function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}
function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}
EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');
  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;
  domain = this.domain;
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er;
    } else {
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }
  handler = events[type];
  if (!handler)
    return false;
  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);
      events = target._events;
    }
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }
  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}
EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      events = this._events;
      if (!events)
        return this;
      list = events[type];
      if (!list)
        return this;
      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;
        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }
        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }
      return this;
    };
EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;
      events = this._events;
      if (!events)
        return this;
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }
      return this;
    };
EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;
  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }
  return ret;
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}
function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

EventEmitter.defaultMaxListeners = 0;
class Linter extends EventEmitter {
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.config = config;
    if (config) {
      if (typeof config !== "object") {
        throw new Error(
          `emlint/verify(): [THROW_ID_01] second input argument, config is not a plain object but ${typeof config}. It's equal to:\n${JSON.stringify(
            config,
            null,
            4
          )}`
        );
      } else if (!Object.keys(config).length) {
        return this.messages;
      } else if (!config.rules || typeof config.rules !== "object") {
        throw new Error(
          `emlint/verify(): [THROW_ID_02] config contains no rules! It was given as:\n${JSON.stringify(
            config,
            null,
            4
          )}`
        );
      }
    } else {
      return this.messages;
    }
    const processedRulesConfig = normaliseRequestedRules(config.rules);
    this.processedRulesConfig = processedRulesConfig;
    Object.keys(processedRulesConfig)
      .filter(ruleName => get(ruleName))
      .filter(ruleName => {
        if (typeof processedRulesConfig[ruleName] === "number") {
          return processedRulesConfig[ruleName] > 0;
        } else if (Array.isArray(processedRulesConfig[ruleName])) {
          return processedRulesConfig[ruleName][0] > 0;
        }
      })
      .forEach(rule => {
        let rulesFunction;
        if (
          Array.isArray(processedRulesConfig[rule]) &&
          processedRulesConfig[rule].length > 1
        ) {
          rulesFunction = get(rule)(
            this,
            ...processedRulesConfig[rule].slice(1)
          );
        } else {
          rulesFunction = get(rule)(this);
        }
        Object.keys(rulesFunction).forEach(consumedNode => {
          this.on(consumedNode, (...args) => {
            rulesFunction[consumedNode](...args);
          });
        });
      });
    tokenizer(
      str,
      obj => {
        this.emit(obj.type, obj);
        if (
          obj.type === "html" &&
          Array.isArray(obj.attribs) &&
          obj.attribs.length
        ) {
          obj.attribs.forEach(attribObj => {
            this.emit(
              "attribute",
              Object.assign({}, attribObj, {
                tag: Object.assign({}, obj)
              })
            );
          });
        }
      },
      obj => {
        this.emit("character", obj);
      }
    );
    if (
      Object.keys(config.rules).some(
        ruleName =>
          (ruleName === "all" ||
          ruleName === "bad-html-entity" ||
            ruleName.startsWith("bad-html-entity") ||
            ruleName.startsWith("bad-named-html-entity") ||
            matcher.isMatch(
              ["bad-malformed-numeric-character-entity"],
              ruleName
            )) &&
          (isEnabled(config.rules[ruleName]) ||
            isEnabled(processedRulesConfig[ruleName]))
      )
    ) {
      stringFixBrokenNamedEntities(str, {
        cb: obj => {
          let matchedRulesName;
          let severity;
          if (Object.keys(config.rules).includes("bad-html-entity")) {
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              severity = 1;
            } else if (Array.isArray(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"][0];
            } else if (Number.isInteger(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"];
            }
          } else if (
            Object.keys(config.rules).some(rulesName => {
              if (matcher.isMatch(obj.ruleName, rulesName)) {
                matchedRulesName = rulesName;
                return true;
              }
            })
          ) {
            if (
              obj.ruleName === "bad-named-html-entity-unrecognised" &&
              config.rules["bad-named-html-entity-unrecognised"] === undefined
            ) {
              severity = 1;
            } else if (Array.isArray(config.rules[matchedRulesName])) {
              severity = config.rules[matchedRulesName][0];
            } else if (Number.isInteger(config.rules[matchedRulesName])) {
              severity = config.rules[matchedRulesName];
            }
          }
          if (Number.isInteger(severity)) {
            let message;
            if (obj.ruleName === "bad-named-html-entity-malformed-nbsp") {
              message = "Malformed NBSP entity.";
            } else if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              message = "Unrecognised named entity.";
            } else if (
              obj.ruleName === "bad-named-html-entity-multiple-encoding"
            ) {
              message = "HTML entity encoding over and over.";
            } else if (
              obj.ruleName === "bad-malformed-numeric-character-entity"
            ) {
              message = "Malformed numeric entity.";
            } else {
              message = `Malformed ${
                obj.entityName ? obj.entityName : "named"
              } entity.`;
            }
            let ranges = [
              [
                obj.rangeFrom,
                obj.rangeTo,
                obj.rangeValEncoded ? obj.rangeValEncoded : ""
              ]
            ];
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              ranges = [];
            }
            this.report({
              severity,
              ruleId: obj.ruleName,
              message,
              idxFrom: obj.rangeFrom,
              idxTo: obj.rangeTo,
              fix: {
                ranges
              }
            });
          }
        },
        entityCatcherCb: (from, to) => {
          this.emit("entity", { idxFrom: from, idxTo: to });
        }
      });
    }
    ["html", "css", "text", "esp", "character"].forEach(eventName => {
      this.removeAllListeners(eventName);
    });
    return this.messages;
  }
  report(obj) {
    const { line, col } = lineColumn(this.str, obj.idxFrom);
    let severity = obj.severity;
    if (
      !Number.isInteger(obj.severity) &&
      typeof this.processedRulesConfig[obj.ruleId] === "number"
    ) {
      severity = this.processedRulesConfig[obj.ruleId];
    } else if (!Number.isInteger(obj.severity)) {
      severity = this.processedRulesConfig[obj.ruleId][0];
    }
    this.messages.push(Object.assign({}, { line, column: col, severity }, obj));
  }
}

var version = "2.5.1";

export { Linter, version };
