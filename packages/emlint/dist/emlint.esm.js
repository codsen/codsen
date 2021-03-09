/**
 * emlint
 * Pluggable email template code linter
 * Version: 4.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/emlint/
 */

import { TypedEmitter } from 'tiny-typed-emitter';
import { fixEnt } from 'string-fix-broken-named-entities';
import { traverse } from 'ast-monkey-traverse';
import { getLineStartIndexes, lineCol } from 'line-column-mini';
import clone from 'lodash.clonedeep';
import { cparser } from 'codsen-parser';
import matcher from 'matcher';
import defineLazyProp from 'define-lazy-prop';
import { processCommaSep } from 'string-process-comma-separated';
import { right, left, leftStopAtNewLines } from 'string-left-right';
import isRegExp from 'lodash.isregexp';
import { rMerge } from 'ranges-merge';
import { allHtmlAttribs } from 'html-all-known-attributes';
import leven from 'leven';
import db from 'mime-db';
import { isRel } from 'is-relative-uri';
import urlRegex from 'url-regex';
import { isLangCode } from 'is-language-code';
import { isMediaD } from 'is-media-descriptor';
import { notEmailFriendly } from 'html-entities-not-email-friendly';
import he from 'he';
import { findMalformed } from 'string-find-malformed';
import { matchRight } from 'string-match-left-right';
import { pathPrev } from 'ast-monkey-util';
import op from 'object-path';

var allBadCharacterRules = ["bad-character-acknowledge", "bad-character-activate-arabic-form-shaping", "bad-character-activate-symmetric-swapping", "bad-character-application-program-command", "bad-character-backspace", "bad-character-bell", "bad-character-break-permitted-here", "bad-character-cancel", "bad-character-cancel-character", "bad-character-character-tabulation-set", "bad-character-character-tabulation-with-justification", "bad-character-control-0080", "bad-character-control-0081", "bad-character-control-0084", "bad-character-control-0099", "bad-character-control-sequence-introducer", "bad-character-data-link-escape", "bad-character-delete", "bad-character-device-control-four", "bad-character-device-control-one", "bad-character-device-control-string", "bad-character-device-control-three", "bad-character-device-control-two", "bad-character-em-quad", "bad-character-em-space", "bad-character-en-quad", "bad-character-en-space", "bad-character-end-of-medium", "bad-character-end-of-protected-area", "bad-character-end-of-selected-area", "bad-character-end-of-text", "bad-character-end-of-transmission", "bad-character-end-of-transmission-block", "bad-character-enquiry", "bad-character-escape", "bad-character-figure-space", "bad-character-first-strong-isolate", "bad-character-form-feed", "bad-character-four-per-em-space", "bad-character-function-application", "bad-character-hair-space", "bad-character-ideographic-space", "bad-character-information-separator-four", "bad-character-information-separator-one", "bad-character-information-separator-three", "bad-character-information-separator-two", "bad-character-inhibit-arabic-form-shaping", "bad-character-inhibit-symmetric-swapping", "bad-character-interlinear-annotation-anchor", "bad-character-interlinear-annotation-separator", "bad-character-interlinear-annotation-terminator", "bad-character-invisible-plus", "bad-character-invisible-separator", "bad-character-invisible-times", "bad-character-left-to-right-embedding", "bad-character-left-to-right-isolate", "bad-character-left-to-right-mark", "bad-character-left-to-right-override", "bad-character-line-separator", "bad-character-line-tabulation", "bad-character-line-tabulation-set", "bad-character-medium-mathematical-space", "bad-character-message-waiting", "bad-character-narrow-no-break-space", "bad-character-national-digit-shapes", "bad-character-negative-acknowledge", "bad-character-next-line", "bad-character-no-break-here", "bad-character-nominal-digit-shapes", "bad-character-non-breaking-space", "bad-character-null", "bad-character-ogham-space-mark", "bad-character-operating-system-command", "bad-character-paragraph-separator", "bad-character-partial-line-backward", "bad-character-partial-line-forward", "bad-character-pop-directional-formatting", "bad-character-pop-directional-isolate", "bad-character-private-message", "bad-character-private-use-1", "bad-character-private-use-2", "bad-character-punctuation-space", "bad-character-replacement-character", "bad-character-reverse-line-feed", "bad-character-right-to-left-embedding", "bad-character-right-to-left-isolate", "bad-character-right-to-left-mark", "bad-character-right-to-left-override", "bad-character-set-transmit-state", "bad-character-shift-in", "bad-character-shift-out", "bad-character-single-character-introducer", "bad-character-single-shift-three", "bad-character-single-shift-two", "bad-character-six-per-em-space", "bad-character-soft-hyphen", "bad-character-start-of-heading", "bad-character-start-of-protected-area", "bad-character-start-of-selected-area", "bad-character-start-of-string", "bad-character-start-of-text", "bad-character-string-terminator", "bad-character-substitute", "bad-character-synchronous-idle", "bad-character-tabulation", "bad-character-thin-space", "bad-character-three-per-em-space", "bad-character-word-joiner", "bad-character-zero-width-joiner", "bad-character-zero-width-no-break-space", "bad-character-zero-width-non-joiner", "bad-character-zero-width-space"];

var allTagRules = ["tag-bad-self-closing", "tag-bold", "tag-closing-backslash", "tag-is-present", "tag-missing-closing", "tag-missing-opening", "tag-name-case", "tag-rogue", "tag-space-after-opening-bracket", "tag-space-before-closing-bracket", "tag-space-before-closing-slash", "tag-space-between-slash-and-bracket", "tag-void-frontal-slash", "tag-void-slash"];

var allAttribRules = ["attribute-duplicate", "attribute-enforce-img-alt", "attribute-malformed", "attribute-on-closing-tag"];

var allCSSRules = ["css-rule-malformed", "css-trailing-semi"];

var allBadNamedHTMLEntityRules = ["bad-malformed-numeric-character-entity", "bad-named-html-entity-malformed-nbsp", "bad-named-html-entity-multiple-encoding", "bad-named-html-entity-not-email-friendly", "bad-named-html-entity-unrecognised"];

function splitByWhitespace(str, cbValues, cbWhitespace, originalOpts) {
  const defaults = {
    offset: 0,
    from: 0,
    to: str.length
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  let nameStartsAt = null;
  let whitespaceStartsAt = null;
  for (let i = opts.from; i < opts.to; i++) {
    if (whitespaceStartsAt === null && !str[i].trim().length) {
      whitespaceStartsAt = i;
    }
    if (whitespaceStartsAt !== null && (str[i].trim().length || i + 1 === opts.to)) {
      if (typeof cbWhitespace === "function") {
        cbWhitespace([whitespaceStartsAt + opts.offset, (str[i].trim().length ? i : i + 1) + opts.offset]);
      }
      whitespaceStartsAt = null;
    }
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
    }
    if (nameStartsAt !== null && (!str[i].trim().length || i + 1 === opts.to)) {
      if (typeof cbValues === "function") {
        cbValues([nameStartsAt + opts.offset, (i + 1 === opts.to && str[i].trim().length ? i + 1 : i) + opts.offset]);
      }
      nameStartsAt = null;
    }
  }
}

function checkForWhitespace(str, idxOffset) {
  if (typeof str !== "string") {
    return {
      charStart: 0,
      charEnd: 0,
      errorArr: [],
      trimmedVal: ""
    };
  }
  let charStart = 0;
  let charEnd = str.length;
  let trimmedVal;
  const gatheredRanges = [];
  const errorArr = [];
  if (!str.length || !str[0].trim().length) {
    charStart = right(str);
    if (!str.length || charStart === null) {
      charEnd = null;
      errorArr.push({
        idxFrom: +idxOffset,
        idxTo: +idxOffset + str.length,
        message: `Missing value.`,
        fix: null
      });
    } else {
      gatheredRanges.push([idxOffset, idxOffset + charStart]);
    }
  }
  if (charEnd && !str[str.length - 1].trim()) {
    charEnd = left(str, str.length - 1) + 1;
    gatheredRanges.push([idxOffset + charEnd, idxOffset + str.length]);
  }
  if (!gatheredRanges.length) {
    trimmedVal = str;
  } else {
    errorArr.push({
      idxFrom: gatheredRanges[0][0],
      idxTo: gatheredRanges[gatheredRanges.length - 1][1],
      message: `Remove whitespace.`,
      fix: {
        ranges: clone(gatheredRanges)
      }
    });
    gatheredRanges.length = 0;
    trimmedVal = str.trim();
  }
  return {
    charStart,
    charEnd,
    errorArr,
    trimmedVal
  };
}

const defaults$2 = {
  caseInsensitive: false
};
function includesWithRegex(arr, whatToMatch, originalOpts) {
  const opts = { ...defaults$2,
    ...originalOpts
  };
  if (!Array.isArray(arr) || !arr.length) {
    return false;
  }
  return arr.some(val => isRegExp(val) && whatToMatch.match(val) || typeof val === "string" && (!opts.caseInsensitive && whatToMatch === val || opts.caseInsensitive && whatToMatch.toLowerCase() === val.toLowerCase()));
}

const defaults$1 = {
  caseInsensitive: false,
  canBeCommaSeparated: false,
  quickPermittedValues: [],
  permittedValues: [],
  noSpaceAfterComma: false
};
function validateValue$2(str, idxOffset, opts, charStart, charEnd, errorArr) {
  const extractedValue = str.slice(charStart, charEnd);
  if (!(includesWithRegex(opts.quickPermittedValues, extractedValue, {
    caseInsensitive: opts.caseInsensitive
  }) || includesWithRegex(opts.permittedValues, extractedValue, {
    caseInsensitive: opts.caseInsensitive
  }))) {
    let fix = null;
    let message = `Unrecognised value: "${str.slice(charStart, charEnd)}".`;
    if (includesWithRegex(opts.quickPermittedValues, extractedValue.toLowerCase()) || includesWithRegex(opts.permittedValues, extractedValue.toLowerCase())) {
      message = `Should be lowercase.`;
      fix = {
        ranges: [[charStart + idxOffset, charEnd + idxOffset, extractedValue.toLowerCase()]]
      };
    } else if (Array.isArray(opts.quickPermittedValues) && opts.quickPermittedValues.length && opts.quickPermittedValues.length < 6 && opts.quickPermittedValues.every(val => typeof val === "string") && (!Array.isArray(opts.permittedValues) || !opts.permittedValues.length) && opts.quickPermittedValues.join("|").length < 40) {
      message = `Should be "${opts.quickPermittedValues.join("|")}".`;
    } else if (Array.isArray(opts.permittedValues) && opts.permittedValues.length && opts.permittedValues.length < 6 && opts.permittedValues.every(val => typeof val === "string") && (!Array.isArray(opts.quickPermittedValues) || !opts.quickPermittedValues.length) && opts.permittedValues.join("|").length < 40) {
      message = `Should be "${opts.permittedValues.join("|")}".`;
    }
    errorArr.push({
      idxFrom: charStart + idxOffset,
      idxTo: charEnd + idxOffset,
      message,
      fix: fix
    });
  }
}
function validateString(str, idxOffset, originalOpts) {
  const opts = { ...defaults$1,
    ...originalOpts
  };
  const {
    charStart,
    charEnd,
    errorArr
  } = checkForWhitespace(str, idxOffset);
  if (typeof charStart === "number" && typeof charEnd === "number") {
    if (opts.canBeCommaSeparated) {
      processCommaSep(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          str.slice(idxFrom - idxOffset, idxTo - idxOffset);
          validateValue$2(str, idxOffset, opts, idxFrom - idxOffset,
          idxTo - idxOffset, errorArr);
        },
        errCb: (ranges, message) => {
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message,
            fix: {
              ranges
            }
          });
        }
      });
    } else {
      str.slice(charStart, charEnd);
      validateValue$2(str, idxOffset, opts, charStart, charEnd, errorArr);
    }
  }
  return errorArr;
}

const wholeExtensionRegex = /^\.\w+$/g;
const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/g;
const fontSizeRegex = /^[+-]?[1-7]$/;
const linkTypes = ["apple-touch-icon", "apple-touch-startup-image", "alternate", "archives", "appendix", "author", "bookmark", "canonical", "chapter", "contents", "copyright", "dns-prefetch", "external", "first", "glossary", "help", "icon", "import", "index", "last", "license", "manifest", "modulepreload", "next", "nofollow", "noopener", "noreferrer", "opener", "pingback", "preconnect", "prefetch", "preload", "prerender", "prev", "search", "shortlink", "section", "sidebar", "start", "stylesheet", "subsection", "tag", "up"];
const astErrMessages = {
  "tag-missing-opening": "Opening tag is missing.",
  "tag-missing-closing": "Closing tag is missing.",
  "tag-void-frontal-slash": "Remove frontal slash."
};
function isLetter(str) {
  return typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase();
}
function isAnEnabledValue(maybeARulesValue) {
  if (Number.isInteger(maybeARulesValue) && maybeARulesValue > 0) {
    return maybeARulesValue;
  }
  if (Array.isArray(maybeARulesValue) && maybeARulesValue.length && Number.isInteger(maybeARulesValue[0]) && maybeARulesValue[0] > 0) {
    return maybeARulesValue[0];
  }
  return 0;
}
function isObj(something) {
  return !!(something && typeof something === "object" && !Array.isArray(something));
}
function isAnEnabledRule(rules, ruleId) {
  if (!ruleId) {
    return 0;
  }
  if (isObj(rules) && Object.prototype.hasOwnProperty.call(rules, ruleId)) {
    return rules[ruleId];
  }
  if (ruleId.includes("-") && Object.prototype.hasOwnProperty.call(rules, ruleId.split("-")[0])) {
    return rules[ruleId.split("-")[0]];
  }
  if (isObj(rules) && Object.prototype.hasOwnProperty.call(rules, "all")) {
    return rules.all;
  }
  return 0;
}

var util = /*#__PURE__*/Object.freeze({
__proto__: null,
wholeExtensionRegex: wholeExtensionRegex,
splitByWhitespace: splitByWhitespace,
isAnEnabledValue: isAnEnabledValue,
isAnEnabledRule: isAnEnabledRule,
astErrMessages: astErrMessages,
validateString: validateString,
fontSizeRegex: fontSizeRegex,
isoDateRegex: isoDateRegex,
linkTypes: linkTypes,
isLetter: isLetter,
isObj: isObj
});

function badCharacterNull(context) {
  return {
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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

const badCharacterTabulation = (context, ...originalOpts) => {
  let mode = "never";
  if (Array.isArray(originalOpts) && originalOpts[0] && typeof originalOpts[0] === "string" && originalOpts[0].toLowerCase() === "indentationisfine") {
    mode = "indentationIsFine";
  }
  return {
    character({
      chr,
      i
    }) {
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
          if (charTopOnBreaksIdx !== null && context.str[charTopOnBreaksIdx].trim().length) {
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
};

function badCharacterLineTabulation(context) {
  return {
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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

function badCharacterInformationSeparatorTwo$1(context) {
  return {
    character({
      chr,
      i
    }) {
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

function badCharacterInformationSeparatorTwo(context) {
  return {
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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

function badCharacterSingleShiftTwo$1(context) {
  return {
    character({
      chr,
      i
    }) {
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

function badCharacterSingleShiftTwo(context) {
  return {
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    character({
      chr,
      i
    }) {
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
    tag(node) {
      const ranges = [];
      if (typeof context.str[node.start + 1] === "string" && !context.str[node.start + 1].trim()) {
        ranges.push([node.start + 1, right(context.str, node.start + 1) || context.str.length]);
      }
      if (!context.str[node.tagNameStartsAt - 1].trim()) {
        const charToTheLeftOfTagNameIdx = left(context.str, node.tagNameStartsAt) || 0;
        if (charToTheLeftOfTagNameIdx !== node.start) {
          ranges.push([charToTheLeftOfTagNameIdx + 1, node.tagNameStartsAt]);
        }
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-space-after-opening-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: {
            ranges
          }
        });
      }
    }
  };
}

const BACKSLASH$2 = "\u005C";
function tagSpaceBeforeClosingBracket(context) {
  return {
    tag(node) {
      const ranges = [];
      if (
      context.str[node.end - 1] === ">" &&
      !context.str[node.end - 2].trim().length &&
      !`${BACKSLASH$2}/`.includes(context.str[left(context.str, node.end - 1) || 0])) {
        const from = left(context.str, node.end - 1) ? left(context.str, node.end - 1) + 1 : 0;
        ranges.push([from, node.end - 1]);
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-space-before-closing-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: {
            ranges
          }
        });
      }
    }
  };
}

function tagSpaceBeforeClosingSlash(context, mode = "never") {
  return {
    tag(node) {
      context.str.slice(node.start + 1, node.tagNameStartsAt);
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos) || 0;
      if (mode === "never" && node.void && context.str[slashPos] === "/" && leftOfSlashPos < slashPos - 1) {
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Bad whitespace.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: slashPos,
          fix: {
            ranges: [[leftOfSlashPos + 1, slashPos]]
          }
        });
      } else if (mode === "always" && node.void && context.str[slashPos] === "/" && leftOfSlashPos === slashPos - 1) {
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Missing space.",
          idxFrom: slashPos,
          idxTo: slashPos,
          fix: {
            ranges: [[slashPos, slashPos, " "]]
          }
        });
      }
    }
  };
}

function tagSpaceBetweenSlashAndBracket(context) {
  return {
    tag(node) {
      if (Number.isInteger(node.end) && context.str[node.end - 1] === ">" &&
      context.str[left(context.str, node.end - 1)] === "/" && left(context.str, node.end - 1) < node.end - 2) {
        const idxFrom = left(context.str, node.end - 1) + 1;
        context.report({
          ruleId: "tag-space-between-slash-and-bracket",
          message: "Bad whitespace.",
          idxFrom,
          idxTo: node.end - 1,
          fix: {
            ranges: [[idxFrom, node.end - 1]]
          }
        });
      }
    }
  };
}

const BACKSLASH$1 = "\u005C";
function tagClosingBackslash(context) {
  return {
    tag(node) {
      const ranges = [];
      if (Number.isInteger(node.start) && Number.isInteger(node.tagNameStartsAt) && context.str.slice(node.start, node.tagNameStartsAt).includes(BACKSLASH$1)) {
        for (let i = node.start; i < node.tagNameStartsAt; i++) {
          if (context.str[i] === BACKSLASH$1) {
            ranges.push([i, i + 1]);
          }
        }
      }
      if (Number.isInteger(node.end) && context.str[node.end - 1] === ">" &&
      context.str[left(context.str, node.end - 1)] === BACKSLASH$1) {
        let message = node.void ? "Replace backslash with slash." : "Delete this.";
        const backSlashPos = left(context.str, node.end - 1);
        let idxFrom = left(context.str, backSlashPos) + 1;
        let whatToInsert = node.void ? "/" : "";
        if (context.processedRulesConfig["tag-space-before-closing-slash"] && (Number.isInteger(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"] > 0 || Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][0] > 0 && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "never")) {
          idxFrom = left(context.str, backSlashPos) + 1;
        }
        if (Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][0] > 0 && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "always") {
          idxFrom = left(context.str, backSlashPos) + 1;
          whatToInsert = ` ${whatToInsert}`;
          if (node.void && context.str[idxFrom + 1] === " ") {
            idxFrom += 1;
            whatToInsert = whatToInsert.trim();
          } else if (!node.void) {
            whatToInsert = whatToInsert.trim();
          }
        }
        if (node.void && Array.isArray(context.processedRulesConfig["tag-void-slash"]) && context.processedRulesConfig["tag-void-slash"][0] > 0 && context.processedRulesConfig["tag-void-slash"][1] === "never") {
          whatToInsert = "";
          idxFrom = left(context.str, backSlashPos) + 1;
          message = "Delete this.";
        }
        context.report({
          ruleId: "tag-closing-backslash",
          message,
          idxFrom,
          idxTo: node.end - 1,
          fix: {
            ranges: [[idxFrom, node.end - 1, whatToInsert]]
          }
        });
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-closing-backslash",
          message: "Wrong slash - backslash.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: {
            ranges
          }
        });
      }
    }
  };
}

const BACKSLASH = "\u005C";
function tagVoidSlash(context, mode = "always") {
  return {
    tag(node) {
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos) || 0;
      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        context.report({
          ruleId: "tag-void-slash",
          message: "Remove the slash.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[leftOfSlashPos + 1, closingBracketPos]]
          }
        });
      } else if (mode === "always" && node.void && context.str[slashPos] !== "/" && (
      !context.processedRulesConfig["tag-closing-backslash"] || !(context.str[slashPos] === BACKSLASH && (Number.isInteger(context.processedRulesConfig["tag-closing-backslash"]) && context.processedRulesConfig["tag-closing-backslash"] > 0 || Array.isArray(context.processedRulesConfig["tag-closing-backslash"]) && context.processedRulesConfig["tag-closing-backslash"][0] > 0 && context.processedRulesConfig["tag-closing-backslash"][1] === "always")))) {
        if (Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "always") {
          if (context.str[slashPos + 1] === " ") {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: {
                ranges: [[slashPos + 2, closingBracketPos + 1, "/>"]]
              }
            });
          } else {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: {
                ranges: [[slashPos + 1, closingBracketPos + 1, " />"]]
              }
            });
          }
        } else if (context.processedRulesConfig["tag-space-before-closing-slash"] === undefined || Array.isArray(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"][1] === "never" || Number.isInteger(context.processedRulesConfig["tag-space-before-closing-slash"]) && context.processedRulesConfig["tag-space-before-closing-slash"] > 0) {
          context.report({
            ruleId: "tag-void-slash",
            message: "Missing slash.",
            idxFrom: node.start,
            idxTo: node.end,
            fix: {
              ranges: [[slashPos + 1, closingBracketPos + 1, "/>"]]
            }
          });
        }
      }
    }
  };
}

function tagNameCase(context) {
  const knownUpperCaseTags = ["CDATA"];
  const variableCaseTagNames = ["doctype"];
  return {
    tag(node) {
      if (node.tagName && node.recognised === true) {
        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          if (context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !== node.tagName.toUpperCase()) {
            const ranges = [[node.tagNameStartsAt, node.tagNameEndsAt, node.tagName.toUpperCase()]];
            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartsAt,
              idxTo: node.tagNameEndsAt,
              fix: {
                ranges
              }
            });
          }
        } else if (context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !== node.tagName && !variableCaseTagNames.includes(node.tagName.toLowerCase())) {
          const ranges = [[node.tagNameStartsAt, node.tagNameEndsAt, node.tagName]];
          context.report({
            ruleId: "tag-name-case",
            message: "Bad tag name case.",
            idxFrom: node.tagNameStartsAt,
            idxTo: node.tagNameEndsAt,
            fix: {
              ranges
            }
          });
        }
      }
    }
  };
}

function tagIsPresent(context, ...blacklist) {
  return {
    tag(node) {
      if (Array.isArray(blacklist) && blacklist.length) {
        matcher([node.tagName], blacklist);
        if (matcher([node.tagName], blacklist).length) {
          context.report({
            ruleId: "tag-is-present",
            message: `${node.tagName} is not allowed.`,
            idxFrom: node.start,
            idxTo: node.end,
            fix: {
              ranges: [[node.start, node.end]]
            }
          });
        }
      }
    }
  };
}

function tagBold(context, suggested = "strong") {
  return {
    tag(node) {
      if (node.tagName === "bold") {
        context.report({
          ruleId: "tag-bold",
          message: `Tag "bold" does not exist in HTML.`,
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[node.tagNameStartsAt, node.tagNameEndsAt, suggested]]
          }
        });
      }
    }
  };
}

function tagBadSelfClosing(context) {
  return {
    tag(node) {
      if (!node.void && node.value.endsWith(">") && node.value[left(node.value, node.value.length - 1)] === "/") {
        const idxFrom = node.start + left(node.value, left(node.value, node.value.length - 1)) + 1;
        const idxTo = node.start + node.value.length - 1;
        context.report({
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom,
          idxTo,
          fix: {
            ranges: [[idxFrom, idxTo]]
          }
        });
      }
    }
  };
}

const attributeDuplicate = context => {
  const attributesWhichCanBeMerged = new Set(["id", "class"]);
  function prepLast(ranges) {
    if (!Array.isArray(ranges) || !ranges.length) {
      return ranges;
    }
    if (!context.str[ranges[ranges.length - 1][1]].trim()) {
      const charOnTheRightIdx = right(context.str, ranges[ranges.length - 1][1]);
      if (`/>`.includes(context.str[charOnTheRightIdx])) {
        ranges[ranges.length - 1][1] = charOnTheRightIdx;
      }
    }
    return ranges;
  }
  return {
    tag(node) {
      if (Array.isArray(node.attribs) && node.attribs.length > 1) {
        const attrsGatheredSoFar = new Set();
        const mergeableAttrsCaught = new Set();
        for (let i = 0, len = node.attribs.length; i < len; i++) {
          if (node.attribs[i].attribName === undefined) {
            continue;
          }
          if (!attrsGatheredSoFar.has(node.attribs[i].attribName)) {
            attrsGatheredSoFar.add(node.attribs[i].attribName);
          } else if (!attributesWhichCanBeMerged.has(node.attribs[i].attribName) || Array.isArray(node.attribs[i].attribValue) && node.attribs[i].attribValue.length && node.attribs[i].attribValue.some(obj => obj.value && (obj.value.includes(`'`) || obj.value.includes(`"`)))) {
            context.report({
              ruleId: "attribute-duplicate",
              message: `Duplicate attribute "${node.attribs[i].attribName}".`,
              idxFrom: node.attribs[i].attribStarts,
              idxTo: node.attribs[i].attribEnds,
              fix: null
            });
          } else {
            mergeableAttrsCaught.add(node.attribs[i].attribName);
          }
        }
        if (mergeableAttrsCaught && mergeableAttrsCaught.size) {
          [...mergeableAttrsCaught].forEach(attrNameBeingMerged => {
            const theFirstRange = [];
            const extractedValues = [];
            const allOtherRanges = [];
            for (let i = 0, len = node.attribs.length; i < len; i++) {
              if (node.attribs[i].attribName === attrNameBeingMerged) {
                if (!theFirstRange.length) {
                  theFirstRange.push(node.attribs[i].attribLeft + 1, node.attribs[i].attribEnds);
                } else {
                  allOtherRanges.push([i ? node.attribs[i].attribLeft + 1 : node.attribs[i].attribStarts, node.attribs[i].attribEnds]);
                }
                if (node.attribs[i].attribValueStartsAt) {
                  splitByWhitespace(node.attribs[i].attribValueRaw, ([from, to]) => {
                    extractedValues.push(node.attribs[i].attribValueRaw.slice(from, to));
                  });
                }
              }
            }
            const mergedValue = extractedValues.sort().join(" ");
            if (mergedValue && mergedValue.length) {
              const ranges = prepLast(rMerge([[...theFirstRange, ` ${attrNameBeingMerged}="${mergedValue}"`], ...allOtherRanges]));
              context.report({
                ruleId: "attribute-duplicate",
                message: `Duplicate attribute "${attrNameBeingMerged}".`,
                idxFrom: node.start,
                idxTo: node.end,
                fix: {
                  ranges
                }
              });
            } else {
              const ranges = prepLast(rMerge([[...theFirstRange], ...allOtherRanges]));
              context.report({
                ruleId: "attribute-duplicate",
                message: `Duplicate attribute "${attrNameBeingMerged}".`,
                idxFrom: node.start,
                idxTo: node.end,
                fix: {
                  ranges
                }
              });
            }
          });
        }
      }
    }
  };
};

function attributeMalformed(context) {
  const blacklist = ["doctype"];
  return {
    attribute(node) {
      if (!node.attribNameRecognised && node.attribName && !node.attribName.startsWith("xmlns:") && !blacklist.includes(node.parent.tagName)) {
        let somethingMatched = false;
        for (const oneOfAttribs of allHtmlAttribs.values()) {
          if (oneOfAttribs === node.attribName.toLowerCase()) {
            context.report({
              ruleId: "attribute-malformed",
              message: `Should be lowercase.`,
              idxFrom: node.attribNameStartsAt,
              idxTo: node.attribNameEndsAt,
              fix: {
                ranges: [[node.attribNameStartsAt, node.attribNameEndsAt, oneOfAttribs.toLowerCase()]]
              }
            });
            somethingMatched = true;
            break;
          } else if (leven(oneOfAttribs, node.attribName) === 1) {
            context.report({
              ruleId: "attribute-malformed",
              message: `Probably meant "${oneOfAttribs}".`,
              idxFrom: node.attribNameStartsAt,
              idxTo: node.attribNameEndsAt,
              fix: {
                ranges: [[node.attribNameStartsAt, node.attribNameEndsAt, oneOfAttribs]]
              }
            });
            somethingMatched = true;
            break;
          }
        }
        if (!somethingMatched) {
          context.report({
            ruleId: "attribute-malformed",
            message: `Unrecognised attribute "${node.attribName}".`,
            idxFrom: node.attribNameStartsAt,
            idxTo: node.attribNameEndsAt,
            fix: null
          });
        }
      }
      if (node.attribNameEndsAt && node.attribValueStartsAt) {
        if (
        node.attribOpeningQuoteAt !== null && context.str.slice(node.attribNameEndsAt, node.attribOpeningQuoteAt) !== "=") {
          let message = `Malformed around equal.`;
          if (!context.str.slice(node.attribNameEndsAt, node.attribOpeningQuoteAt).includes("=")) {
            message = `Equal is missing.`;
          }
          let fromRange = node.attribNameEndsAt;
          const toRange = node.attribOpeningQuoteAt;
          let whatToAdd = "=";
          if (context.str[fromRange] === "=") {
            fromRange += 1;
            whatToAdd = undefined;
          }
          context.report({
            ruleId: "attribute-malformed",
            message,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: whatToAdd ? [[fromRange, toRange, "="]] : [[fromRange, toRange]]
            }
          });
        }
      }
      if (
      node.attribValueRaw && (node.attribValueRaw.startsWith(`"`) || node.attribValueRaw.startsWith(`'`)) && node.attribValueStartsAt && node.attribOpeningQuoteAt && context.str[node.attribValueStartsAt] === context.str[node.attribOpeningQuoteAt]) {
        const message = `Delete repeated opening quotes.`;
        context.report({
          ruleId: "attribute-malformed",
          message,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges: [[node.attribValueStartsAt, node.attribValueStartsAt + 1]]
          }
        });
      }
      if (node.attribValueRaw && (
      node.attribValueRaw.endsWith(`"`) || node.attribValueRaw.endsWith(`'`)) && node.attribValueEndsAt && node.attribClosingQuoteAt && context.str[node.attribValueEndsAt] === context.str[node.attribClosingQuoteAt]) {
        const message = `Delete repeated closing quotes.`;
        context.report({
          ruleId: "attribute-malformed",
          message,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges: [[node.attribValueEndsAt - 1, node.attribValueEndsAt]]
          }
        });
      }
      const ranges = [];
      if (node.attribOpeningQuoteAt === null && node.attribValueStartsAt !== null) {
        ranges.push([node.attribValueStartsAt, node.attribValueStartsAt, node.attribClosingQuoteAt === null ? `"` : context.str[node.attribClosingQuoteAt]]);
      }
      if (node.attribClosingQuoteAt === null) {
        if (node.attribValueEndsAt !== null) {
          ranges.push([node.attribValueEndsAt, node.attribValueEndsAt, node.attribOpeningQuoteAt === null ? `"` : context.str[node.attribOpeningQuoteAt]]);
        } else if (node.attribOpeningQuoteAt) {
          if (
          Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"]) &&
          context.str[node.attribOpeningQuoteAt] === "'") {
            ranges.push([node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, `""`]);
          } else {
            ranges.push([node.attribOpeningQuoteAt + 1, node.attribOpeningQuoteAt + 1, context.str[node.attribOpeningQuoteAt] || `"`]);
          }
        }
      }
      if (ranges.length) {
        context.report({
          ruleId: "attribute-malformed",
          message: `Quote${ranges.length > 1 ? "s are" : " is"} missing.`,
          idxFrom: node.attribStarts,
          idxTo: node.attribEnds,
          fix: {
            ranges
          }
        });
      }
      if (node.attribOpeningQuoteAt !== null && node.attribClosingQuoteAt !== null) {
        if (!`'"`.includes(context.str[node.attribOpeningQuoteAt])) {
          context.report({
            ruleId: "attribute-malformed",
            message: `Wrong opening quote.`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            fix: {
              ranges: [[node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, `"`]]
            }
          });
          if (context.str[node.attribClosingQuoteAt] !== `"`) {
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong closing quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [[node.attribClosingQuoteAt, node.attribClosingQuoteAt + 1, `"`]]
              }
            });
          }
        } else if (context.str[node.attribOpeningQuoteAt] !== context.str[node.attribClosingQuoteAt] || node.attribValueRaw.includes(`'`) &&
        !node.attribValueRaw.startsWith(`'`) && !node.attribValueRaw.endsWith(`'`)) {
          if ((Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"]) || node.attribValueRaw.includes(`'`)) && context.str[node.attribOpeningQuoteAt] !== `"`) {
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong opening quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [[node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, `"`]]
              }
            });
            if (context.str[node.attribClosingQuoteAt] !== `"`) {
              context.report({
                ruleId: "attribute-malformed",
                message: `Wrong closing quote.`,
                idxFrom: node.attribStarts,
                idxTo: node.attribEnds,
                fix: {
                  ranges: [[node.attribClosingQuoteAt, node.attribClosingQuoteAt + 1, `"`]]
                }
              });
            }
          } else if (node.attribValueRaw.includes(`"`)) {
            if (context.str[node.attribOpeningQuoteAt] !== `'`) {
              context.report({
                ruleId: "attribute-malformed",
                message: `Wrong opening quote.`,
                idxFrom: node.attribStarts,
                idxTo: node.attribEnds,
                fix: {
                  ranges: [[node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, `'`]]
                }
              });
            }
            if (context.str[node.attribClosingQuoteAt] !== `'`) {
              context.report({
                ruleId: "attribute-malformed",
                message: `Wrong closing quote.`,
                idxFrom: node.attribStarts,
                idxTo: node.attribEnds,
                fix: {
                  ranges: [[node.attribClosingQuoteAt, node.attribClosingQuoteAt + 1, `'`]]
                }
              });
            }
          } else {
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong closing quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [[node.attribClosingQuoteAt, node.attribClosingQuoteAt + 1, context.str[node.attribOpeningQuoteAt]]]
              }
            });
          }
        } else if (context.str[node.attribOpeningQuoteAt] === context.str[node.attribClosingQuoteAt] && node.attribValueRaw.includes(context.str[node.attribOpeningQuoteAt]) &&
        !node.attribValueRaw.startsWith(context.str[node.attribOpeningQuoteAt]) && !node.attribValueRaw.endsWith(context.str[node.attribOpeningQuoteAt])) {
          if (Object.keys(context.processedRulesConfig).includes("format-prettier") && isAnEnabledValue(context.processedRulesConfig["format-prettier"])) {
            context.report({
              ruleId: "attribute-malformed",
              message: `Encode the double quotes.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [[node.attribValueStartsAt, node.attribValueEndsAt, node.attribValueRaw.replace(/"/g, "&quot;")]]
              }
            });
          } else {
            const valueToSet = context.str[node.attribOpeningQuoteAt] === `"` ? `'` : `"`;
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong opening quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [[node.attribOpeningQuoteAt, node.attribOpeningQuoteAt + 1, valueToSet]]
              }
            });
            context.report({
              ruleId: "attribute-malformed",
              message: `Wrong closing quote.`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              fix: {
                ranges: [[node.attribClosingQuoteAt, node.attribClosingQuoteAt + 1, valueToSet]]
              }
            });
          }
        }
      }
    }
  };
}

const attributeOnClosingTag = context => {
  return {
    tag(node) {
      if (node.closing && Array.isArray(node.attribs) && node.attribs.length) {
        context.report({
          ruleId: "attribute-on-closing-tag",
          message: `Attribute on a closing tag.`,
          idxFrom: node.attribs[0].attribStarts,
          idxTo: node.attribs[node.attribs.length - 1].attribEnds,
          fix: null
        });
      }
    }
  };
};

function attributeEnforceImgAlt(context) {
  return {
    tag(node) {
      if (
      node.type === "tag" && node.tagName === "img" && (!node.attribs.length || !node.attribs.some(attrib => !attrib.attribName || attrib.attribName.toLowerCase() === "alt"))) {
        const startPos = node.attribs.length ? node.attribs[~-node.attribs.length].attribEnds : node.tagNameEndsAt;
        let endPos = startPos;
        if (context.str[startPos + 1] && !context.str[startPos].trim() && !context.str[startPos + 1].trim() && right(context.str, startPos)) {
          endPos = right(context.str, startPos) - 1;
        }
        context.report({
          ruleId: "attribute-enforce-img-alt",
          message: `Add an alt attribute.`,
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[startPos, endPos, ' alt=""']]
          }
        });
      }
    }
  };
}

function attributeValidateAbbr(context) {
  return {
    attribute(node) {
      if (node.attribName === "abbr") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-abbr",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-abbr"
          });
        });
      }
    }
  };
}

const knownUnits = ["cm", "mm", "in", "px", "pt", "pc", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax", "%"];
const knownCharsets = ["adobe-standard-encoding", "adobe-symbol-encoding", "amiga-1251", "ansi_x3.110-1983", "asmo_449", "big5", "big5-hkscs", "bocu-1", "brf", "bs_4730", "bs_viewdata", "cesu-8", "cp50220", "cp51932", "csa_z243.4-1985-1", "csa_z243.4-1985-2", "csa_z243.4-1985-gr", "csn_369103", "dec-mcs", "din_66003", "dk-us", "ds_2089", "ebcdic-at-de", "ebcdic-at-de-a", "ebcdic-ca-fr", "ebcdic-dk-no", "ebcdic-dk-no-a", "ebcdic-es", "ebcdic-es-a", "ebcdic-es-s", "ebcdic-fi-se", "ebcdic-fi-se-a", "ebcdic-fr", "ebcdic-it", "ebcdic-pt", "ebcdic-uk", "ebcdic-us", "ecma-cyrillic", "es", "es2", "euc-kr", "extended_unix_code_fixed_width_for_japanese", "extended_unix_code_packed_format_for_japanese", "gb18030", "gb2312", "gb_1988-80", "gb_2312-80", "gbk", "gost_19768-74", "greek-ccitt", "greek7", "greek7-old", "hp-desktop", "hp-legal", "hp-math8", "hp-pi-font", "hp-roman8", "hz-gb-2312", "ibm-symbols", "ibm-thai", "ibm00858", "ibm00924", "ibm01140", "ibm01141", "ibm01142", "ibm01143", "ibm01144", "ibm01145", "ibm01146", "ibm01147", "ibm01148", "ibm01149", "ibm037", "ibm038", "ibm1026", "ibm1047", "ibm273", "ibm274", "ibm275", "ibm277", "ibm278", "ibm280", "ibm281", "ibm284", "ibm285", "ibm290", "ibm297", "ibm420", "ibm423", "ibm424", "ibm437", "ibm500", "ibm775", "ibm850", "ibm851", "ibm852", "ibm855", "ibm857", "ibm860", "ibm861", "ibm862", "ibm863", "ibm864", "ibm865", "ibm866", "ibm868", "ibm869", "ibm870", "ibm871", "ibm880", "ibm891", "ibm903", "ibm904", "ibm905", "ibm918", "iec_p27-1", "inis", "inis-8", "inis-cyrillic", "invariant", "iso-10646-j-1", "iso-10646-ucs-2", "iso-10646-ucs-4", "iso-10646-ucs-basic", "iso-10646-unicode-latin1", "iso-10646-utf-1", "iso-11548-1", "iso-2022-cn", "iso-2022-cn-ext", "iso-2022-jp", "iso-2022-jp-2", "iso-2022-kr", "iso-8859-1-windows-3.0-latin-1", "iso-8859-1-windows-3.1-latin-1", "iso-8859-10", "iso-8859-13", "iso-8859-14", "iso-8859-15", "iso-8859-16", "iso-8859-2-windows-latin-2", "iso-8859-9-windows-latin-5", "iso-ir-90", "iso-unicode-ibm-1261", "iso-unicode-ibm-1264", "iso-unicode-ibm-1265", "iso-unicode-ibm-1268", "iso-unicode-ibm-1276", "iso_10367-box", "iso_2033-1983", "iso_5427", "iso_5427:1981", "iso_5428:1980", "iso_646.basic:1983", "iso_646.irv:1983", "iso_6937-2-25", "iso_6937-2-add", "iso_8859-1:1987", "iso_8859-2:1987", "iso_8859-3:1988", "iso_8859-4:1988", "iso_8859-5:1988", "iso_8859-6-e", "iso_8859-6-i", "iso_8859-6:1987", "iso_8859-7:1987", "iso_8859-8-e", "iso_8859-8-i", "iso_8859-8:1988", "iso_8859-9:1989", "iso_8859-supp", "it", "jis_c6220-1969-jp", "jis_c6220-1969-ro", "jis_c6226-1978", "jis_c6226-1983", "jis_c6229-1984-a", "jis_c6229-1984-b", "jis_c6229-1984-b-add", "jis_c6229-1984-hand", "jis_c6229-1984-hand-add", "jis_c6229-1984-kana", "jis_encoding", "jis_x0201", "jis_x0212-1990", "jus_i.b1.002", "jus_i.b1.003-mac", "jus_i.b1.003-serb", "koi7-switched", "koi8-r", "koi8-u", "ks_c_5601-1987", "ksc5636", "kz-1048", "latin-greek", "latin-greek-1", "latin-lap", "macintosh", "microsoft-publishing", "mnem", "mnemonic", "msz_7795.3", "nats-dano", "nats-dano-add", "nats-sefi", "nats-sefi-add", "nc_nc00-10:81", "nf_z_62-010", "nf_z_62-010_(1973)", "ns_4551-1", "ns_4551-2", "osd_ebcdic_df03_irv", "osd_ebcdic_df04_1", "osd_ebcdic_df04_15", "pc8-danish-norwegian", "pc8-turkish", "pt", "pt2", "ptcp154", "scsu", "sen_850200_b", "sen_850200_c", "shift_jis", "t.101-g2", "t.61-7bit", "t.61-8bit", "tis-620", "tscii", "unicode-1-1", "unicode-1-1-utf-7", "unknown-8bit", "us-ascii", "us-dk", "utf-16", "utf-16be", "utf-16le", "utf-32", "utf-32be", "utf-32le", "utf-7", "utf-8", "ventura-international", "ventura-math", "ventura-us", "videotex-suppl", "viqr", "viscii", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255", "windows-1256", "windows-1257", "windows-1258", "windows-31j", "windows-874"];
const basicColorNames = {
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00"
};
const extendedColorNames = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
const sixDigitHexColorRegex = /^#([a-f0-9]{6})$/i;
const classNameRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

function attributeValidateAcceptCharset(context) {
  return {
    attribute(node) {
      if (node.attribName === "accept-charset") {
        if (!["form"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw, node.attribValueStartsAt, {
          canBeCommaSeparated: true,
          noSpaceAfterComma: true,
          quickPermittedValues: ["UNKNOWN"],
          permittedValues: knownCharsets
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-accept-charset"
          });
        });
      }
    }
  };
}

function attributeValidateAccept(context) {
  return {
    attribute(node) {
      if (node.attribName === "accept") {
        if (!["form", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: ["audio/*", "video/*", "image/*", "text/html", "image/png", "image/gif", "video/mpeg", "text/css", "audio/basic", wholeExtensionRegex],
          permittedValues: Object.keys(db),
          canBeCommaSeparated: true,
          noSpaceAfterComma: true
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-accept"
          });
        });
      }
    }
  };
}

function attributeValidateAccesskey(context) {
  return {
    attribute(node) {
      if (node.attribName === "accesskey") {
        if (!["a", "area", "button", "input", "label", "legend", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accesskey",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr,
          trimmedVal
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        if (typeof charStart === "number" && typeof charEnd === "number") {
          if (trimmedVal.length > 1 && !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))) {
            errorArr.push({
              idxFrom: node.attribValueStartsAt + charStart,
              idxTo: node.attribValueStartsAt + charEnd,
              message: `Should be a single character (escaped or not).`,
              fix: null
            });
          }
        }
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-accesskey"
          });
        });
      }
    }
  };
}

function isSingleSpace(str, originalOpts, errorArr) {
  const defaults = {
    from: 0,
    to: str.length,
    offset: 0
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  if (str.slice(opts.from, opts.to) !== " ") {
    let ranges;
    if (str[opts.from] === " ") {
      ranges = [[opts.offset + opts.from + 1, opts.offset + opts.to]];
    } else if (str[opts.to - 1] === " ") {
      ranges = [[opts.offset + opts.from, opts.offset + opts.to - 1]];
    } else {
      ranges = [[opts.offset + opts.from, opts.offset + opts.to, " "]];
    }
    errorArr.push({
      idxFrom: opts.offset + opts.from,
      idxTo: opts.offset + opts.to,
      message: `Should be a single space.`,
      fix: {
        ranges
      }
    });
  }
}

function validateValue$1(str, originalOpts, errorArr) {
  const defaults = {
    offset: 0,
    multipleOK: false,
    from: 0,
    to: str.length,
    attribStarts: 0,
    attribEnds: str.length
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const extractedValue = str.slice(opts.from, opts.to);
  const calcultedIsRel = isRel(extractedValue);
  if (Array.from(extractedValue).some(val => !val.trim().length)) {
    const ranges = [];
    const foundCharacterRanges = [];
    splitByWhitespace(extractedValue, valueRangeArr => {
      foundCharacterRanges.push(valueRangeArr);
    }, whitespaceRangeArr => {
      ranges.push(whitespaceRangeArr);
    }, originalOpts);
    const countOfURIs = foundCharacterRanges.reduce((acc, curr) => {
      if (extractedValue.slice(curr[0] - opts.offset, curr[1] - opts.offset).match(urlRegex({
        exact: true
      }))) {
        return acc + 1;
      }
      return acc;
    }, 0);
    foundCharacterRanges.reduce((acc, curr) => {
      return acc + extractedValue.slice(curr[0] - opts.offset, curr[1] - opts.offset);
    }, "");
    if (countOfURIs > 1) {
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: `There should be only one URI.`,
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: `Remove whitespace.`,
        fix: {
          ranges
        }
      });
    }
  } else if (!extractedValue.startsWith("tel:") && !(urlRegex({
    exact: true
  }).test(extractedValue) || calcultedIsRel.res)) {
    let message = `Should be an URI.`;
    let idxFrom = opts.offset + opts.from;
    let idxTo = opts.offset + opts.to;
    const whatCouldBeExtractedAtAllFromRegex = extractedValue.match(urlRegex());
    if (Array.isArray(whatCouldBeExtractedAtAllFromRegex)) {
      if (whatCouldBeExtractedAtAllFromRegex.length > 1 && !opts.multipleOK) {
        message = `There should be only one URI.`;
      } else {
        message = `URI's should be separated with a single space.`;
      }
      idxFrom = opts.offset + opts.attribStarts;
      idxTo = opts.offset + opts.attribEnds;
    }
    errorArr.push({
      idxFrom,
      idxTo,
      message,
      fix: null
    });
  }
}
function validateUri(str, originalOpts) {
  const defaults = {
    offset: 0,
    multipleOK: false,
    separator: "space",
    oneSpaceAfterCommaOK: false,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const {
    charStart,
    charEnd,
    errorArr
  } = checkForWhitespace(str, opts.offset);
  if (Number.isInteger(charStart)) {
    if (opts.multipleOK) {
      if (opts.separator === "space") {
        splitByWhitespace(str, ([charFrom, charTo]) => {
          const extractedName = str.slice(charFrom, charTo);
          if (extractedName.endsWith(",") && extractedName.length > 1) {
            errorArr.push({
              idxFrom: opts.offset + charTo - 1,
              idxTo: opts.offset + charTo,
              message: `No commas.`,
              fix: null
            });
          } else {
            validateValue$1(str, { ...opts,
              from: charFrom,
              to: charTo,
              attribStarts: charStart,
              attribEnds: charEnd,
              offset: opts.offset
            }, errorArr);
          }
        }, ([whitespaceFrom, whitespaceTo]) => isSingleSpace(str, {
          from: whitespaceFrom,
          to: whitespaceTo,
          offset: opts.offset
        }, errorArr), {
          from: charStart,
          to: charEnd
        });
      } else {
        processCommaSep(str, {
          offset: opts.offset,
          oneSpaceAfterCommaOK: false,
          leadingWhitespaceOK: true,
          trailingWhitespaceOK: true,
          cb: (idxFrom, idxTo) => {
            str.slice(idxFrom - opts.offset, idxTo - opts.offset);
            validateValue$1(str, { ...opts,
              from: idxFrom - opts.offset,
              to: idxTo - opts.offset,
              attribStarts: charStart,
              attribEnds: charEnd,
              offset: opts.offset
            }, errorArr);
          },
          errCb: (ranges, message) => {
            let fix = {
              ranges
            };
            if (!str[ranges[0][0] - opts.offset].trim().length && str[ranges[0][0] - opts.offset - 1] && charStart < ranges[0][0] - 1 && (opts.separator === "space" || str[ranges[0][0] - opts.offset - 1] !== "," && str[ranges[0][1] - opts.offset] !== ",")) {
              fix = null;
            }
            errorArr.push({
              idxFrom: ranges[0][0],
              idxTo: ranges[ranges.length - 1][1],
              message,
              fix
            });
          }
        });
      }
    } else {
      validateValue$1(str, {
        from: charStart,
        to: charEnd,
        offset: opts.offset
      }, errorArr);
    }
  }
  return errorArr;
}

function attributeValidateAction(context) {
  return {
    attribute(node) {
      if (node.attribName === "action") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-action",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-action"
            });
          });
        }
      }
    }
  };
}

function attributeValidateAlign(context) {
  return {
    attribute(node) {
      if (node.attribName === "align") {
        if (!["applet", "caption", "iframe", "img", "input", "object", "legend", "table", "hr", "div", "h1", "h2", "h3", "h4", "h5", "h6", "p", "col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-align",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        let errorArr = [];
        if (["legend", "caption"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["top", "bottom", "left", "right"],
            canBeCommaSeparated: false
          });
        } else if (["applet", "iframe", "img", "input", "object"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["top", "middle", "bottom", "left", "right"],
            canBeCommaSeparated: false
          });
        } else if (["table", "hr"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["left", "center", "right"],
            canBeCommaSeparated: false
          });
        } else if (["div", "h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["left", "center", "right", "justify"],
            canBeCommaSeparated: false
          });
        } else if (["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["left", "center", "right", "justify", "char"],
            canBeCommaSeparated: false
          });
        }
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-align"
          });
        });
      }
    }
  };
}

const defaults = {
  namedCssLevel1OK: true,
  namedCssLevel2PlusOK: true,
  hexThreeOK: false,
  hexFourOK: false,
  hexSixOK: true,
  hexEightOK: false
};
function validateColor(str, idxOffset, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  };
  const {
    charStart,
    charEnd,
    errorArr
  } = checkForWhitespace(str, idxOffset);
  if (typeof charStart === "number" && typeof charEnd === "number") {
    const attrVal = errorArr.length ? str.slice(charStart, charEnd) : str;
    if (attrVal.length > 1 && isLetter(attrVal[0]) && isLetter(attrVal[1]) && Object.keys(extendedColorNames).includes(attrVal.toLowerCase())) {
      if (!opts.namedCssLevel1OK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Named colors (CSS Level 1) not allowed.`,
          fix: {
            ranges: [[idxOffset + charStart, idxOffset + charEnd, extendedColorNames[attrVal.toLowerCase()]]]
          }
        });
      } else if (!opts.namedCssLevel2PlusOK && (!opts.namedCssLevel1OK || !Object.keys(basicColorNames).includes(attrVal.toLowerCase()))) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Named colors (CSS Level 2+) not allowed.`,
          fix: {
            ranges: [[idxOffset + charStart, idxOffset + charEnd, extendedColorNames[attrVal.toLowerCase()]]]
          }
        });
      }
    } else if (attrVal.startsWith("#")) {
      if (attrVal.length !== 7) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Hex color code should be 6 digits-long.`,
          fix: null
        });
      } else if (!sixDigitHexColorRegex.test(attrVal)) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Unrecognised hex code.`,
          fix: null
        });
      } else if (!opts.hexSixOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Hex colors not allowed.`,
          fix: null
        });
      }
    } else if (attrVal.startsWith("rgb(")) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `rgb() is not allowed.`,
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Unrecognised color value.`,
        fix: null
      });
    }
  }
  return errorArr;
}

function attributeValidateAlink(context) {
  return {
    attribute(node) {
      if (node.attribName === "alink") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-alink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-alink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-alink"
            });
          });
        }
      }
    }
  };
}

function attributeValidateAlt(context) {
  return {
    attribute(node) {
      if (node.attribName === "alt") {
        if (!["applet", "area", "img", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-alt",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (node.attribValueStartsAt !== null && node.attribValueEndsAt !== null) {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-alt"
            });
          });
        }
      }
    }
  };
}

function attributeValidateArchive(context) {
  return {
    attribute(node) {
      if (node.attribName === "archive") {
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-archive",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        }
        else if (node.parent.tagName === "applet") {
            validateUri(node.attribValueRaw, {
              offset: node.attribValueStartsAt,
              separator: "comma",
              multipleOK: true
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-archive"
              });
            });
          } else if (node.parent.tagName === "object") {
            validateUri(node.attribValueRaw, {
              offset: node.attribValueStartsAt,
              separator: "space",
              multipleOK: true
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-archive"
              });
            });
          }
      }
    }
  };
}

function attributeValidateAxis(context) {
  return {
    attribute(node) {
      if (node.attribName === "axis") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-axis",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-axis",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-axis"
            });
          });
        }
      }
    }
  };
}

function attributeValidateBackground(context) {
  return {
    attribute(node) {
      if (node.attribName === "background") {
        if (!["body", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-background",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-background"
            });
          });
        }
      }
    }
  };
}

function attributeValidateBgcolor(context) {
  return {
    attribute(node) {
      if (node.attribName === "bgcolor") {
        if (!["table", "tr", "td", "th", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-bgcolor"
            });
          });
        }
      }
    }
  };
}

const defaultOpts = {
  type: "integer",
  whitelistValues: [],
  theOnlyGoodUnits: null,
  plusOK: false,
  negativeOK: false,
  zeroOK: true,
  badUnits: [],
  enforceCount: null,
  noUnitsIsFine: true,
  canBeCommaSeparated: false,
  customGenericValueError: null,
  skipWhitespaceChecks: false,
  customPxMessage: null,
  maxValue: null
};
function validateValue({
  str,
  opts,
  charStart,
  charEnd,
  idxOffset,
  errorArr
}) {
  if (typeof str !== "string") {
    return;
  }
  if (str[charStart] === "0") {
    if (charEnd === charStart + 1) {
      if (!opts.zeroOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Zero not allowed.`,
          fix: null
        });
      }
    } else if ("0123456789".includes(str[charStart + 1])) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Number padded with zero.`,
        fix: null
      });
    }
  }
  if (!"0123456789".includes(str[charStart]) && !"0123456789".includes(str[charEnd - 1])) {
    let message = `Digits missing.`;
    if (opts.customGenericValueError) {
      message = opts.customGenericValueError;
    } else if (Array.isArray(opts.theOnlyGoodUnits) && !opts.theOnlyGoodUnits.length && opts.type === "integer") {
      message = `Should be integer, no units.`;
    }
    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message,
      fix: null
    });
  } else if ("0123456789".includes(str[charStart]) && "0123456789".includes(str[charEnd - 1]) && (!opts.noUnitsIsFine || opts.type === "integer" && opts.maxValue && str.slice(charStart, charEnd).match(/^\d+$/) && Number.parseInt(str.slice(charStart, charEnd), 10) > opts.maxValue)) {
    if (!opts.noUnitsIsFine) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: opts.customGenericValueError || `Units missing.`,
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Maximum, ${opts.maxValue} exceeded.`,
        fix: null
      });
    }
  } else {
    for (let i = charStart; i < charEnd; i++) {
      if (!"0123456789".includes(str[i]) && (str[i] !== "." || opts.type !== "rational") && (str[i] !== "-" || !(opts.negativeOK && i === 0)) && (str[i] !== "+" || !(opts.plusOK && i === 0))) {
        const endPart = str.slice(i, charEnd);
        if (isObj(opts) && (Array.isArray(opts.theOnlyGoodUnits) && !opts.theOnlyGoodUnits.includes(endPart) || Array.isArray(opts.badUnits) && opts.badUnits.includes(endPart))) {
          if (endPart === "px") {
            const message = opts.customPxMessage ? opts.customPxMessage : `Remove px.`;
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message,
              fix: opts.customPxMessage ? null : {
                ranges: [[idxOffset + i, idxOffset + charEnd]]
              }
            });
          } else {
            let message = `Bad unit.`;
            if (str.match(/-\s*-/g)) {
              message = `Repeated minus.`;
            } else if (str.match(/\+\s*\+/g)) {
              message = `Repeated plus.`;
            } else if (Array.isArray(opts.theOnlyGoodUnits) && opts.theOnlyGoodUnits.length && opts.theOnlyGoodUnits.includes(endPart.trim())) {
              message = "Rogue whitespace.";
            } else if (opts.customGenericValueError) {
              message = opts.customGenericValueError;
            } else if (Array.isArray(opts.theOnlyGoodUnits) && !opts.theOnlyGoodUnits.length && opts.type === "integer") {
              message = `Should be integer, no units.`;
            }
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message,
              fix: null
            });
          }
        } else if (!knownUnits.includes(endPart)) {
          let message = "Unrecognised unit.";
          if (/\d/.test(endPart)) {
            message = "Messy value.";
          } else if (knownUnits.includes(endPart.trim())) {
            message = "Rogue whitespace.";
          }
          errorArr.push({
            idxFrom: idxOffset + i,
            idxTo: idxOffset + charEnd,
            message,
            fix: null
          });
        }
        break;
      }
    }
  }
}
function validateDigitAndUnit(str, idxOffset, originalOpts) {
  if (typeof str !== "string") {
    return [];
  }
  const opts = { ...defaultOpts,
    ...originalOpts
  };
  let charStart = 0;
  let charEnd = str.length;
  let errorArr = [];
  if (!opts.skipWhitespaceChecks) {
    const retrievedWhitespaceChecksObj = checkForWhitespace(str, idxOffset);
    charStart = retrievedWhitespaceChecksObj.charStart;
    charEnd = retrievedWhitespaceChecksObj.charEnd;
    errorArr = retrievedWhitespaceChecksObj.errorArr;
  }
  if (Number.isInteger(charStart)) {
    if (opts.canBeCommaSeparated) {
      const extractedValues = [];
      processCommaSep(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          const extractedValue = str.slice(idxFrom - idxOffset, idxTo - idxOffset);
          if (!Array.isArray(opts.whitelistValues) || !opts.whitelistValues.includes(extractedValue)) {
            validateValue({
              str,
              opts,
              charStart: idxFrom - idxOffset,
              charEnd: idxTo - idxOffset,
              idxOffset,
              errorArr
            });
          }
          extractedValues.push(extractedValue);
        },
        errCb: (ranges, message) => {
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message,
            fix: {
              ranges
            }
          });
        }
      });
      if (Number.isInteger(opts.enforceCount) && extractedValues.length !== opts.enforceCount) {
        errorArr.push({
          idxFrom: charStart + idxOffset,
          idxTo: charEnd + idxOffset,
          message: `There should be ${opts.enforceCount} values.`,
          fix: null
        });
      } else if (typeof opts.enforceCount === "string" && ["even", "odd"].includes(opts.enforceCount.toLowerCase())) {
        if (opts.enforceCount.toLowerCase() === "even" && extractedValues.length % 2 !== 0) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: `Should be an even number of values but found ${extractedValues.length}.`,
            fix: null
          });
        } else if (opts.enforceCount.toLowerCase() !== "even" && extractedValues.length % 2 === 0) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: `Should be an odd number of values but found ${extractedValues.length}.`,
            fix: null
          });
        }
      }
    } else {
      if (!Array.isArray(opts.whitelistValues) || !opts.whitelistValues.includes(str.slice(charStart, charEnd))) {
        validateValue({
          str,
          opts,
          charStart,
          charEnd,
          idxOffset,
          errorArr
        });
      }
    }
  }
  return errorArr;
}

function attributeValidateBorder(context) {
  return {
    attribute(node) {
      if (node.attribName === "border") {
        if (!["table", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-border",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          negativeOK: false,
          theOnlyGoodUnits: []
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-border"
          });
        });
      }
    }
  };
}

function attributeValidateCellpadding(context) {
  return {
    attribute(node) {
      if (node.attribName === "cellpadding") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-cellpadding",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          negativeOK: false,
          theOnlyGoodUnits: ["%"],
          badUnits: ["px"],
          customGenericValueError: "Should be integer, either no units or percentage."
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-cellpadding"
          });
        });
      }
    }
  };
}

function attributeValidateCellspacing(context) {
  return {
    attribute(node) {
      if (node.attribName === "cellspacing") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-cellspacing",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          negativeOK: false,
          theOnlyGoodUnits: ["%"],
          badUnits: ["px"],
          customGenericValueError: "Should be integer, either no units or percentage."
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-cellspacing"
          });
        });
      }
    }
  };
}

function attributeValidateChar(context) {
  return {
    attribute(node) {
      if (node.attribName === "char") {
        if (!["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            charStart,
            charEnd,
            errorArr,
            trimmedVal
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          if (typeof charStart === "number" && typeof charEnd === "number") {
            if (trimmedVal.length > 1 && !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))) {
              errorArr.push({
                idxFrom: node.attribValueStartsAt + charStart,
                idxTo: node.attribValueStartsAt + charEnd,
                message: `Should be a single character.`,
                fix: null
              });
            }
          }
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-char"
            });
          });
        }
      }
    }
  };
}

function attributeValidateCharoff(context) {
  return {
    attribute(node) {
      if (node.attribName === "charoff") {
        if (!["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            type: "integer",
            negativeOK: true,
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          });
          if (!node.parent.attribs.some(attribObj => attribObj.attribName === "char")) {
            errorArr.push({
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: `Attribute "char" missing.`,
              fix: null
            });
          }
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-charoff"
            });
          });
        }
      }
    }
  };
}

function attributeValidateCharset(context) {
  return {
    attribute(node) {
      if (node.attribName === "charset") {
        if (!["a", "link", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateString(node.attribValueRaw, node.attribValueStartsAt, {
            canBeCommaSeparated: false,
            noSpaceAfterComma: false,
            quickPermittedValues: [],
            permittedValues: knownCharsets
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-charset"
            });
          });
        }
      }
    }
  };
}

function validateVoid(node, context, errorArr, originalOpts) {
  const defaults = {
    xhtml: false,
    enforceSiblingAttributes: null
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  if (opts.xhtml) {
    let quotesType = `"`;
    if (node.attribOpeningQuoteAt !== null && context.str[node.attribOpeningQuoteAt] === `'`) {
      quotesType = `'`;
    } else if (node.attribClosingQuoteAt !== null && context.str[node.attribClosingQuoteAt] === `'`) {
      quotesType = `'`;
    }
    if (node.attribValueRaw !== node.attribName || context.str.slice(node.attribNameEndsAt, node.attribEnds) !== `=${quotesType}${node.attribName}${quotesType}`) {
      errorArr.push({
        idxFrom: node.attribNameStartsAt,
        idxTo: node.attribNameEndsAt,
        message: `It's XHTML, add value, ="${node.attribName}".`,
        fix: {
          ranges: [[node.attribNameEndsAt, node.attribEnds, `=${quotesType}${node.attribName}${quotesType}`]]
        }
      });
    }
  } else if (node.attribValueRaw !== null) {
    errorArr.push({
      idxFrom: node.attribNameEndsAt,
      idxTo: node.attribEnds,
      message: `Should have no value.`,
      fix: {
        ranges: [[node.attribNameEndsAt, node.attribEnds]]
      }
    });
  }
  if (isObj(opts.enforceSiblingAttributes) && Object.keys(opts.enforceSiblingAttributes).length) {
    Object.keys(opts.enforceSiblingAttributes).forEach(siblingAttr => {
      if (Array.isArray(node.parent.attribs) && !node.parent.attribs.some(attribObj => attribObj.attribName === siblingAttr)) {
        errorArr.push({
          idxFrom: node.parent.start,
          idxTo: node.parent.end,
          message: `Should have attribute "${siblingAttr}".`,
          fix: null
        });
      } else if (opts.enforceSiblingAttributes[siblingAttr] && Array.isArray(opts.enforceSiblingAttributes[siblingAttr]) && Array.isArray(node.parent.attribs) && !node.parent.attribs.some(attribObj => attribObj.attribName === siblingAttr && opts.enforceSiblingAttributes[siblingAttr].includes(attribObj.attribValueRaw))) {
        let idxFrom;
        let idxTo;
        for (let i = 0, len = node.parent.attribs.length; i < len; i++) {
          if (node.parent.attribs[i].attribName === siblingAttr) {
            idxFrom = node.parent.attribs[i].attribValueStartsAt;
            idxTo = node.parent.attribs[i].attribValueEndsAt;
            break;
          }
        }
        errorArr.push({
          idxFrom,
          idxTo,
          message: `Only tags with ${opts.enforceSiblingAttributes[siblingAttr].map(val => `"${val}"`).join(" or ")} attributes can be ${node.attribName}.`,
          fix: null
        });
      }
    });
  }
  return errorArr;
}

function attributeValidateChecked(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "checked") {
        if (node.parent.tagName !== "input") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: {
              type: ["checkbox", "radio"]
            }
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-checked"
            });
          });
        }
      }
    }
  };
}

function attributeValidateCite(context) {
  return {
    attribute(node) {
      if (node.attribName === "cite") {
        if (!["blockquote", "q", "del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cite",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-cite"
            });
          });
        }
      }
    }
  };
}

function checkClassOrIdValue(str, originalOpts, errorArr) {
  const defaults = {
    typeName: "class",
    from: 0,
    to: str.length,
    offset: 0
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const listOfUniqueNames = new Set();
  splitByWhitespace(
  str,
  ([charFrom, charTo]) => {
    const extractedName = str.slice(charFrom, charTo);
    if (!classNameRegex.test(extractedName)) {
      errorArr.push({
        idxFrom: charFrom,
        idxTo: charTo,
        message: `Wrong ${opts.typeName} name.`,
        fix: null
      });
    }
    if (!listOfUniqueNames.has(extractedName)) {
      listOfUniqueNames.add(extractedName);
    } else {
      let deleteFrom = charFrom;
      let deleteTo = charTo;
      const nonWhitespaceCharOnTheRight = right(str, deleteTo);
      if (deleteTo >= opts.to || !nonWhitespaceCharOnTheRight || nonWhitespaceCharOnTheRight > opts.to) {
        deleteFrom = left(str, charFrom) + 1;
      } else {
        deleteTo = nonWhitespaceCharOnTheRight;
      }
      errorArr.push({
        idxFrom: charFrom,
        idxTo: charTo,
        message: `Duplicate ${opts.typeName} "${extractedName}".`,
        fix: {
          ranges: [[deleteFrom, deleteTo]]
        }
      });
    }
  },
  ([whitespaceFrom, whitespaceTo]) => isSingleSpace(str, {
    from: whitespaceFrom,
    to: whitespaceTo,
    offset: opts.offset
  }, errorArr),
  opts
  );
}

function attributeValidateClass(context) {
  return {
    attribute(node) {
      if (node.attribName === "class") {
        if (["base", "basefont", "head", "html", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            charStart,
            charEnd,
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          if (typeof charStart === "number" && typeof charEnd === "number") {
            checkClassOrIdValue(context.str, {
              typeName: node.attribName,
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0
            }, errorArr
            );
          }
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-class"
            });
          });
        }
      }
    }
  };
}

function attributeValidateClassid$1(context) {
  return {
    attribute(node) {
      if (node.attribName === "classid") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-classid",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-classid"
            });
          });
        }
      }
    }
  };
}

function attributeValidateClassid(context) {
  return {
    attribute(node) {
      if (node.attribName === "clear") {
        if (node.parent.tagName !== "br") {
          context.report({
            ruleId: "attribute-validate-clear",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        if (typeof charStart === "number" && typeof charEnd === "number" && !["left", "all", "right", "none"].includes(context.str.slice(node.attribValueStartsAt + charStart, node.attribValueStartsAt + charEnd))) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message: `Should be: left|all|right|none.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-clear"
          });
        });
      }
    }
  };
}

function attributeValidateCode(context) {
  return {
    attribute(node) {
      if (node.attribName === "code") {
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-code",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-code",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            charStart,
            charEnd,
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-code"
            });
          });
        }
      }
    }
  };
}

function attributeValidateCodebase(context) {
  return {
    attribute(node) {
      if (node.attribName === "codebase") {
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-codebase",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-codebase"
            });
          });
        }
      }
    }
  };
}

function attributeValidateCodetype(context) {
  return {
    attribute(node) {
      if (node.attribName === "codetype") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-codetype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: ["application/javascript", "application/json", "application/x-www-form-urlencoded", "application/xml", "application/zip", "application/pdf", "application/sql", "application/graphql", "application/ld+json", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.oasis.opendocument.text", "application/zstd", "audio/mpeg", "audio/ogg", "multipart/form-data", "text/css", "text/html", "text/xml", "text/csv", "text/plain", "image/png", "image/jpeg", "image/gif", "application/vnd.api+json"],
          permittedValues: Object.keys(db),
          canBeCommaSeparated: false,
          noSpaceAfterComma: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-codetype"
          });
        });
      }
    }
  };
}

function attributeValidateColor(context) {
  return {
    attribute(node) {
      if (node.attribName === "color") {
        if (!["basefont", "font"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-color"
            });
          });
        }
      }
    }
  };
}

function attributeValidateCols(context) {
  return {
    attribute(node) {
      if (node.attribName === "cols") {
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cols",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          let errorArr = [];
          if (node.parent.tagName === "frameset") {
            errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              whitelistValues: ["*"],
              theOnlyGoodUnits: ["%"],
              badUnits: ["px"],
              noUnitsIsFine: true,
              canBeCommaSeparated: true,
              type: "rational",
              customGenericValueError: "Should be: pixels|%|*."
            });
          } else if (node.parent.tagName === "textarea") {
            errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units."
            });
          }
          if (Array.isArray(errorArr) && errorArr.length) {
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-cols"
              });
            });
          }
        }
      }
    }
  };
}

function attributeValidateColspan(context) {
  return {
    attribute(node) {
      if (node.attribName === "colspan") {
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-colspan",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units."
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-colspan"
          });
        });
      }
    }
  };
}

function attributeValidateCompact(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "compact") {
        if (!["dir", "dl", "menu", "ol", "ul"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-compact"
            });
          });
        }
      }
    }
  };
}

function attributeValidateContent(context) {
  return {
    attribute(node) {
      if (node.attribName === "content") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-content",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-content"
          });
        });
      }
    }
  };
}

function attributeValidateCoords(context) {
  return {
    attribute(node) {
      if (node.attribName === "coords") {
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-coords",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          if (!Array.isArray(node.parent.attribs) || !node.parent.attribs.length || !node.parent.attribs.some(attrObj => attrObj.attribName === "shape")) {
            context.report({
              ruleId: "attribute-validate-coords",
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: `Missing "shape" attribute.`,
              fix: null
            });
          } else {
            const shapeAttr = node.parent.attribs.filter(attrObj => attrObj.attribName === "shape")[0];
            let enforceCount = null;
            if (shapeAttr.attribValueRaw === "rect") {
              enforceCount = 4;
            } else if (shapeAttr.attribValueRaw === "circle") {
              enforceCount = 3;
            } else if (shapeAttr.attribValueRaw === "poly") {
              enforceCount = "even";
            }
            const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              whitelistValues: [],
              theOnlyGoodUnits: [],
              badUnits: [],
              noUnitsIsFine: true,
              canBeCommaSeparated: true,
              enforceCount,
              type: "integer",
              customGenericValueError: "Should be integer, no units."
            });
            if (Array.isArray(errorArr) && errorArr.length) {
              errorArr.forEach(errorObj => {
                context.report({ ...errorObj,
                  ruleId: "attribute-validate-coords"
                });
              });
            }
          }
        }
      }
    }
  };
}

function attributeValidateData(context) {
  return {
    attribute(node) {
      if (node.attribName === "data") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-data",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-data"
            });
          });
        }
      }
    }
  };
}

function attributeValidateDatetime(context) {
  return {
    attribute(node) {
      if (node.attribName === "datetime") {
        if (!["del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-datetime",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: [isoDateRegex],
          canBeCommaSeparated: false,
          noSpaceAfterComma: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-datetime"
          });
        });
      }
    }
  };
}

function attributeValidateDeclare(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "declare") {
        if (node.parent.tagName !== "object") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-declare"
            });
          });
        }
      }
    }
  };
}

function attributeValidateDefer(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "defer") {
        if (node.parent.tagName !== "script") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-defer"
            });
          });
        }
      }
    }
  };
}

function attributeValidateDir(context) {
  return {
    attribute(node) {
      if (node.attribName === "dir") {
        if (["applet", "base", "basefont", "br", "frame", "frameset", "iframe", "param", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-dir",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["ltr", "rtl"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-dir"
          });
        });
      }
    }
  };
}

function attributeValidateDisabled(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "disabled") {
        if (!["button", "input", "optgroup", "option", "select", "textarea"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-disabled"
            });
          });
        }
      }
    }
  };
}

function attributeValidateEnctype(context) {
  return {
    attribute(node) {
      if (node.attribName === "enctype") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-enctype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          quickPermittedValues: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
          permittedValues: Object.keys(db),
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-enctype"
          });
        });
      }
    }
  };
}

function attributeValidateFace(context) {
  return {
    attribute(node) {
      if (node.attribName === "face") {
        if (node.parent.tagName !== "font") {
          context.report({
            ruleId: "attribute-validate-face",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-face"
          });
        });
      }
    }
  };
}

function attributeValidateFor(context) {
  return {
    attribute(node) {
      if (node.attribName === "for") {
        if (node.parent.tagName !== "label") {
          context.report({
            ruleId: "attribute-validate-for",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const {
              charStart,
              charEnd,
              errorArr
            } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
            if (typeof charStart === "number" && typeof charEnd === "number") {
              const extractedValue = node.attribValueRaw.slice(charStart, charEnd);
              let message = `Wrong id name.`;
              let fix = null;
              let idxFrom = charStart + node.attribValueStartsAt;
              let idxTo = charEnd + node.attribValueStartsAt;
              if (Number.isInteger(charStart) && !classNameRegex.test(extractedValue)) {
                if (Array.from(extractedValue).some(val => !val.trim().length)) {
                  message = `Should be one value, no spaces.`;
                } else if (extractedValue.includes("#")) {
                  message = `Remove hash.`;
                  const firstHashAt = node.attribValueRaw.indexOf("#");
                  fix = {
                    ranges: [[node.attribValueStartsAt + firstHashAt, node.attribValueStartsAt + firstHashAt + 1]]
                  };
                  idxFrom = node.attribValueStartsAt + firstHashAt;
                  idxTo = node.attribValueStartsAt + firstHashAt + 1;
                }
                errorArr.push({
                  ruleId: "attribute-validate-for",
                  idxFrom,
                  idxTo,
                  message,
                  fix: fix
                });
              }
            }
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-for"
              });
            });
          }
      }
    }
  };
}

function attributeValidateFrame(context) {
  return {
    attribute(node) {
      if (node.attribName === "frame") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-frame",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["void", "above", "below", "hsides", "lhs", "rhs", "vsides", "box", "border"
          ],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-frame"
          });
        });
      }
    }
  };
}

function attributeValidateFrameborder(context) {
  return {
    attribute(node) {
      if (node.attribName === "frameborder") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-frameborder",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["0", "1"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-frameborder"
          });
        });
      }
    }
  };
}

function attributeValidateHeaders(context) {
  return {
    attribute(node) {
      if (node.attribName === "headers") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-headers",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const {
              charStart,
              charEnd,
              errorArr
            } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
            checkClassOrIdValue(context.str, {
              typeName: "id",
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0
            }, errorArr
            );
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-headers"
              });
            });
          }
      }
    }
  };
}

function attributeValidateHeight(context) {
  return {
    attribute(node) {
      if (node.attribName === "height") {
        if (!["iframe", "td", "th", "img", "object", "applet"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-height",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          badUnits: ["px"],
          theOnlyGoodUnits: ["%"],
          noUnitsIsFine: true,
          customGenericValueError: `Should be "pixels|%".`
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-height"
          });
        });
      }
    }
  };
}

function attributeValidateHref(context) {
  return {
    attribute(node) {
      if (node.attribName === "href") {
        if (!["a", "area", "link", "base"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-href",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-href"
            });
          });
        }
      }
    }
  };
}

function attributeValidateHreflang(context) {
  return {
    attribute(node) {
      if (node.attribName === "hreflang") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hreflang",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        const {
          message
        } = isLangCode(node.attribValueRaw.slice(charStart, charEnd));
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-hreflang"
          });
        });
      }
    }
  };
}

function attributeValidateHspace(context) {
  return {
    attribute(node) {
      if (node.attribName === "hspace") {
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hspace",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-hspace"
          });
        });
      }
    }
  };
}

function attributeValidateHttpequiv(context) {
  return {
    attribute(node) {
      if (node.attribName === "http-equiv") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-http-equiv",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["content-type", "default-style", "refresh", "X-UA-Compatible"],
          canBeCommaSeparated: false,
          caseInsensitive: true
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-http-equiv"
          });
        });
      }
    }
  };
}

function attributeValidateId(context) {
  return {
    attribute(node) {
      if (node.attribName === "id") {
        if (["base", "head", "html", "meta", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-id",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const {
              charStart,
              charEnd,
              errorArr
            } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
            checkClassOrIdValue(context.str, {
              typeName: node.attribName,
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0
            }, errorArr
            );
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-id"
              });
            });
          }
      }
    }
  };
}

function attributeValidateIsmap(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "ismap") {
        if (!["img", "input"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-ismap"
            });
          });
        }
      }
    }
  };
}

function attributeValidateLabel(context) {
  return {
    attribute(node) {
      if (node.attribName === "label") {
        if (!["option", "optgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-label",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-label"
            });
          });
        }
      }
    }
  };
}

function attributeValidateLang(context) {
  return {
    attribute(node) {
      if (node.attribName === "lang") {
        if (["applet", "base", "basefont", "br", "frame", "frameset", "iframe", "param", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-lang",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        const {
          message
        } = isLangCode(node.attribValueRaw.slice(charStart, charEnd));
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-lang"
          });
        });
      }
    }
  };
}

function attributeValidateLanguage(context) {
  return {
    attribute(node) {
      if (node.attribName === "language") {
        if (node.parent.tagName !== "script") {
          context.report({
            ruleId: "attribute-validate-language",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-language"
            });
          });
        }
      }
    }
  };
}

function attributeValidateLink(context) {
  return {
    attribute(node) {
      if (node.attribName === "link") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-link",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-link"
            });
          });
        }
      }
    }
  };
}

function attributeValidateLongdesc(context) {
  return {
    attribute(node) {
      if (node.attribName === "longdesc") {
        if (!["img", "frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-longdesc",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-longdesc"
            });
          });
        }
      }
    }
  };
}

function attributeValidateMarginheight(context) {
  return {
    attribute(node) {
      if (node.attribName === "marginheight") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginheight",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-marginheight"
          });
        });
      }
    }
  };
}

function attributeValidateMarginwidth(context) {
  return {
    attribute(node) {
      if (node.attribName === "marginwidth") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginwidth",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-marginwidth"
          });
        });
      }
    }
  };
}

function attributeValidateMaxlength(context) {
  return {
    attribute(node) {
      if (node.attribName === "maxlength") {
        if (node.parent.tagName !== "input") {
          context.report({
            ruleId: "attribute-validate-maxlength",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units."
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-maxlength"
          });
        });
      }
    }
  };
}

function attributeValidateMedia(context) {
  return {
    attribute(node) {
      if (node.attribName === "media") {
        if (!["style", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-media",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const {
          charStart,
          charEnd,
          errorArr
        } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
        errorArr.concat(isMediaD(node.attribValueRaw.slice(charStart, charEnd), {
          offset: node.attribValueStartsAt
        })).forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-media"
          });
        });
      }
    }
  };
}

function attributeValidateMethod(context) {
  return {
    attribute(node) {
      if (node.attribName === "method") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-method",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["get", "post"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-method"
          });
        });
      }
    }
  };
}

function attributeValidateMultiple(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "multiple") {
        if (node.parent.tagName !== "select") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-multiple"
            });
          });
        }
      }
    }
  };
}

function attributeValidateName(context) {
  return {
    attribute(node) {
      if (node.attribName === "name") {
        if (!["button", "textarea", "applet", "select", "form", "frame", "iframe", "img", "a", "input", "object", "map", "param", "meta"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-name",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-name"
            });
          });
        }
      }
    }
  };
}

function attributeValidateNohref(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "nohref") {
        if (node.parent.tagName !== "area") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-nohref"
            });
          });
        }
      }
    }
  };
}

function attributeValidateNoresize(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "noresize") {
        if (node.parent.tagName !== "frame") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-noresize"
            });
          });
        }
      }
    }
  };
}

function attributeValidateNoshade(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "noshade") {
        if (node.parent.tagName !== "hr") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-noshade"
            });
          });
        }
      }
    }
  };
}

function attributeValidateNowrap(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "nowrap") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-nowrap"
            });
          });
        }
      }
    }
  };
}

function attributeValidateObject(context) {
  return {
    attribute(node) {
      if (node.attribName === "object") {
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-object",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-object"
            });
          });
        }
      }
    }
  };
}

function validateScript(str, idxOffset
) {
  const {
    errorArr
  } = checkForWhitespace(str, idxOffset);
  return errorArr;
}

function attributeValidateOnblur(context) {
  return {
    attribute(node) {
      if (node.attribName === "onblur") {
        if (!["a", "area", "button", "input", "label", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onblur",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onblur"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnchange(context) {
  return {
    attribute(node) {
      if (node.attribName === "onchange") {
        if (!["input", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onchange",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onchange"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnclick(context) {
  return {
    attribute(node) {
      if (node.attribName === "onclick") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onclick",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onclick"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOndblclick(context) {
  return {
    attribute(node) {
      if (node.attribName === "ondblclick") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-ondblclick",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-ondblclick"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnfocus(context) {
  return {
    attribute(node) {
      if (node.attribName === "onfocus") {
        if (!["a", "area", "button", "input", "label", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onfocus",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onfocus"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnkeydown(context) {
  return {
    attribute(node) {
      if (node.attribName === "onkeydown") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onkeydown",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onkeydown"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnkeypress(context) {
  return {
    attribute(node) {
      if (node.attribName === "onkeypress") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onkeypress",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onkeypress"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnkeyup(context) {
  return {
    attribute(node) {
      if (node.attribName === "onkeyup") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onkeyup",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onkeyup"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnload(context) {
  return {
    attribute(node) {
      if (node.attribName === "onload") {
        if (!["frameset", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onload",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onload"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnmousedown(context) {
  return {
    attribute(node) {
      if (node.attribName === "onmousedown") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmousedown",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onmousedown"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnmousemove(context) {
  return {
    attribute(node) {
      if (node.attribName === "onmousemove") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmousemove",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onmousemove"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnmouseout(context) {
  return {
    attribute(node) {
      if (node.attribName === "onmouseout") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmouseout",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onmouseout"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnmouseover(context) {
  return {
    attribute(node) {
      if (node.attribName === "onmouseover") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmouseover",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onmouseover"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnmouseup(context) {
  return {
    attribute(node) {
      if (node.attribName === "onmouseup") {
        if (["applet", "base", "basefont", "bdo", "br", "font", "frame", "frameset", "head", "html", "iframe", "isindex", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onmouseup",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onmouseup"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnreset(context) {
  return {
    attribute(node) {
      if (node.attribName === "onreset") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onreset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onreset"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnsubmit(context) {
  return {
    attribute(node) {
      if (node.attribName === "onsubmit") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onsubmit",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onsubmit"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnselect(context) {
  return {
    attribute(node) {
      if (node.attribName === "onselect") {
        if (!["input", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onselect",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onselect"
              });
            });
          }
      }
    }
  };
}

function attributeValidateOnunload(context) {
  return {
    attribute(node) {
      if (node.attribName === "onunload") {
        if (!["frameset", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onunload",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
            context.report({
              ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
              idxFrom: node.attribStarts,
              idxTo: node.attribEnds,
              message: `Missing value.`,
              fix: null
            });
          } else {
            const errorArr = validateScript(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-onunload"
              });
            });
          }
      }
    }
  };
}

function attributeValidateProfile(context) {
  return {
    attribute(node) {
      if (node.attribName === "profile") {
        if (node.parent.tagName !== "head") {
          context.report({
            ruleId: "attribute-validate-profile",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: true
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-profile"
            });
          });
        }
      }
    }
  };
}

function attributeValidatePrompt(context) {
  return {
    attribute(node) {
      if (node.attribName === "prompt") {
        if (node.parent.tagName !== "isindex") {
          context.report({
            ruleId: "attribute-validate-prompt",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-prompt"
            });
          });
        }
      }
    }
  };
}

function attributeValidateReadonly(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "readonly") {
        if (!["textarea", "input"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-readonly"
            });
          });
        }
      }
    }
  };
}

function attributeValidateRel(context, enforceLowercase = false) {
  return {
    attribute(node) {
      if (node.attribName === "rel") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rel",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: linkTypes,
          canBeCommaSeparated: false,
          caseInsensitive: !enforceLowercase
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-rel"
          });
        });
      }
    }
  };
}

function attributeValidateRev(context, enforceLowercase = false) {
  return {
    attribute(node) {
      if (node.attribName === "rev") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rev",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: linkTypes,
          canBeCommaSeparated: false,
          caseInsensitive: !enforceLowercase
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-rev"
          });
        });
      }
    }
  };
}

function attributeValidateRows(context) {
  return {
    attribute(node) {
      if (node.attribName === "rows") {
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rows",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        let errorArr = [];
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else if (node.parent.tagName === "frameset") {
          errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            whitelistValues: ["*"],
            theOnlyGoodUnits: ["%"],
            badUnits: ["px"],
            noUnitsIsFine: true,
            canBeCommaSeparated: true,
            type: "rational",
            customGenericValueError: "Should be: pixels|%|*."
          });
        } else if (node.parent.tagName === "textarea") {
          errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          });
        }
        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-rows"
            });
          });
        }
      }
    }
  };
}

function attributeValidateRowspan(context) {
  return {
    attribute(node) {
      if (node.attribName === "rowspan") {
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rowspan",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units."
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-rowspan"
          });
        });
      }
    }
  };
}

function attributeValidateRules(context) {
  return {
    attribute(node) {
      if (node.attribName === "rules") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-rules",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["none", "groups", "rows", "cols", "all"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-rules"
          });
        });
      }
    }
  };
}

function attributeValidateScheme(context) {
  return {
    attribute(node) {
      if (node.attribName === "scheme") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-scheme",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-scheme"
            });
          });
        }
      }
    }
  };
}

function attributeValidateScope(context) {
  return {
    attribute(node) {
      if (node.attribName === "scope") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scope",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["row", "col", "rowgroup", "colgroup"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-scope"
          });
        });
      }
    }
  };
}

function attributeValidateScrolling(context) {
  return {
    attribute(node) {
      if (node.attribName === "scrolling") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scrolling",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["auto", "yes", "no"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-scrolling"
          });
        });
      }
    }
  };
}

function attributeValidateSelected(context, mode) {
  return {
    attribute(node) {
      const errorArr = [];
      if (node.attribName === "selected") {
        if (node.parent.tagName !== "option") {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null
          });
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-selected"
            });
          });
        }
      }
    }
  };
}

function attributeValidateShape(context) {
  return {
    attribute(node) {
      if (node.attribName === "shape") {
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-shape",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateString(node.attribValueRaw,
        node.attribValueStartsAt,
        {
          permittedValues: ["default", "rect", "circle", "poly"],
          canBeCommaSeparated: false
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-shape"
          });
        });
      }
    }
  };
}

function attributeValidateSize(context) {
  return {
    attribute(node) {
      if (node.attribName === "size") {
        if (!["hr", "font", "input", "basefont", "select"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-size",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          const {
            charStart,
            charEnd,
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-size"
            });
          });
          if (typeof charStart === "number" && typeof charEnd === "number") {
            const extractedVal = node.attribValueRaw.slice(charStart, charEnd);
            if (["hr", "input", "select"].includes(node.parent.tagName)) {
              validateDigitAndUnit(extractedVal, node.attribValueStartsAt + charStart, {
                type: "integer",
                negativeOK: false,
                theOnlyGoodUnits: [],
                skipWhitespaceChecks: true
              }).forEach(errorObj => {
                context.report({ ...errorObj,
                  ruleId: "attribute-validate-size"
                });
              });
            } else if (["font", "basefont"].includes(node.parent.tagName)) {
              if (!extractedVal.match(fontSizeRegex)) {
                const errorArr2 = validateDigitAndUnit(extractedVal, node.attribValueStartsAt + charStart, {
                  type: "integer",
                  negativeOK: false,
                  theOnlyGoodUnits: [],
                  skipWhitespaceChecks: true,
                  customGenericValueError: `Should be integer 1-7, plus/minus are optional.`
                });
                if (!errorArr2.length) {
                  errorArr2.push({
                    idxFrom: node.attribValueStartsAt + charStart,
                    idxTo: node.attribValueStartsAt + charEnd,
                    message: `Should be integer 1-7, plus/minus are optional.`,
                    fix: null
                  });
                }
                errorArr2.forEach(errorObj => {
                  context.report({ ...errorObj,
                    ruleId: "attribute-validate-size"
                  });
                });
              }
            }
          }
        }
      }
    }
  };
}

function attributeValidateSpan(context) {
  return {
    attribute(node) {
      if (node.attribName === "span") {
        if (!["col", "colgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-span",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units.",
          zeroOK: false,
          customPxMessage: `Columns number is not in pixels.`
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-span"
          });
        });
      }
    }
  };
}

function attributeValidateSrc(context) {
  return {
    attribute(node) {
      if (node.attribName === "src") {
        if (!["script", "input", "frame", "iframe", "img"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-src",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-src"
            });
          });
        }
      }
    }
  };
}

function attributeValidateStandby(context) {
  return {
    attribute(node) {
      if (node.attribName === "standby") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-standby",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-standby"
            });
          });
        }
      }
    }
  };
}

function attributeValidateStart(context) {
  return {
    attribute(node) {
      if (node.attribName === "start") {
        if (node.parent.tagName !== "ol") {
          context.report({
            ruleId: "attribute-validate-start",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units.",
          zeroOK: false,
          customPxMessage: `Starting sequence number is not in pixels.`
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-start"
          });
        });
      }
    }
  };
}

function validateStyle(token, context) {
  let nodeArr;
  let ruleId = "";
  if (token.properties !== undefined) {
    nodeArr = token.properties;
    ruleId = "css-rule-malformed";
  } else if (token.attribValue !== undefined) {
    nodeArr = token.attribValue;
    ruleId = "attribute-validate-style";
  }
  if (!nodeArr || !ruleId) {
    return;
  }
  let properties = [];
  if (nodeArr.some(property => property.property !== undefined)) {
    properties = nodeArr.filter(property => property.property !== undefined);
  }
  if (properties && properties.length) {
    for (let i = properties.length - 1; i--;) {
      if (properties[i].semi === null && properties[i].value) {
        context.report({
          ruleId,
          idxFrom: properties[i].start,
          idxTo: properties[i].end,
          message: `Add a semicolon.`,
          fix: {
            ranges: [[properties[i].end, properties[i].end, ";"]]
          }
        });
      }
    }
    properties.forEach(property => {
      if (property.important && property.important !== "!important") {
        context.report({
          ruleId,
          idxFrom: property.importantStarts,
          idxTo: property.importantEnds,
          message: `Malformed !important.`,
          fix: {
            ranges: [[property.importantStarts, property.importantEnds, "!important"]]
          }
        });
      }
      if (property.colon && property.propertyEnds && property.propertyEnds < property.colon) {
        context.report({
          ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: `Gap in front of semicolon.`,
          fix: {
            ranges: [[property.propertyEnds, property.colon]]
          }
        });
      }
      if (property.semi && (property.importantEnds || property.valueEnds) && (property.importantEnds || property.valueEnds) < property.semi) {
        context.report({
          ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: `Gap in front of semi.`,
          fix: {
            ranges: [[property.importantEnds || property.valueEnds, property.semi]]
          }
        });
      }
      if (property.colon && context.str[property.colon] !== ":") {
        context.report({
          ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: `Mis-typed colon.`,
          fix: {
            ranges: [[property.colon, property.colon + 1, ":"]]
          }
        });
      }
      if (property.semi && !property.propertyStarts && !property.valueStarts && !property.importantStarts) {
        context.report({
          ruleId,
          idxFrom: property.start,
          idxTo: property.end,
          message: `Rogue semicolon.`,
          fix: {
            ranges: [[property.semi, property.semi + 1]]
          }
        });
      }
      if (property.colon && property.valueStarts) {
        if (property.valueStarts > property.colon + 2) {
          context.report({
            ruleId,
            idxFrom: property.start,
            idxTo: property.end,
            message: `Remove whitespace.`,
            fix: {
              ranges: [[property.colon + 2, property.valueStarts]]
            }
          });
        }
        if (property.valueStarts > property.colon + 1 && !context.str[property.colon + 1].trim() && context.str[property.colon + 1] !== " ") {
          context.report({
            ruleId,
            idxFrom: property.colon + 1,
            idxTo: property.valueStarts,
            message: `Replace whitespace.`,
            fix: {
              ranges: [[property.colon + 1, property.valueStarts, " "]]
            }
          });
        }
      }
    });
  }
  if (nodeArr && Array.isArray(nodeArr) && nodeArr.length) {
    for (let i = 0, len = nodeArr.length; i < len; i++) {
      if (
      (!i ||
      i === len - 1) && nodeArr[i].type === "text" && ruleId === "attribute-validate-style") {
        if (len === 1) {
          context.report({
            ruleId,
            idxFrom: nodeArr[i].start,
            idxTo: nodeArr[i].end,
            message: `Missing value.`,
            fix: null
          });
        } else {
          context.report({
            ruleId,
            idxFrom: nodeArr[i].start,
            idxTo: nodeArr[i].end,
            message: `Remove whitespace.`,
            fix: {
              ranges: [[nodeArr[i].start, nodeArr[i].end]]
            }
          });
        }
      }
      if (nodeArr[i].value === null) {
        if (nodeArr[i].important !== null && nodeArr[i].property === null) {
          let errorRaised = false;
          if (i) {
            for (let y = nodeArr.length; y--;) {
              if (y === i) {
                continue;
              }
              if (
              nodeArr[i].important && !nodeArr[i].propertyStarts && !nodeArr[i].valueStarts &&
              nodeArr[y].property !== undefined) {
                if (
                nodeArr[y].semi &&
                !nodeArr[y].importantStarts) {
                  const fromIdx = nodeArr[y].semi;
                  const toIdx = nodeArr[y].semi + 1;
                  let whatToInsert;
                  if (context.str[nodeArr[y].semi + 1] !== " ") {
                    whatToInsert = " ";
                  }
                  context.report({
                    ruleId,
                    idxFrom: fromIdx,
                    idxTo: toIdx,
                    message: `Delete the semicolon.`,
                    fix: {
                      ranges: [[fromIdx, toIdx, whatToInsert]]
                    }
                  });
                  errorRaised = true;
                } else {
                  break;
                }
              }
            }
          }
          if (
          nodeArr[i].property !== undefined &&
          !errorRaised) {
            context.report({
              ruleId,
              idxFrom: nodeArr[i].start,
              idxTo: nodeArr[i].end,
              message: `Missing value.`,
              fix: null
            });
          }
        } else if (
        nodeArr[i].property || nodeArr[i].value || nodeArr[i].important) {
          context.report({
            ruleId,
            idxFrom: nodeArr[i].start,
            idxTo: nodeArr[i].end,
            message: `Missing value.`,
            fix: null
          });
        }
      }
    }
  }
}

function attributeValidateStyle(context, ...opts) {
  return {
    attribute(node) {
      if (node.attribName === "style") {
        if (["base", "basefont", "head", "html", "meta", "param", "script", "style", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-style",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        validateStyle(node, context);
      }
    }
  };
}

function attributeValidateSummary(context) {
  return {
    attribute(node) {
      if (node.attribName === "summary") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-summary",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-summary"
            });
          });
        }
      }
    }
  };
}

function attributeValidateTabindex(context) {
  return {
    attribute(node) {
      if (node.attribName === "tabindex") {
        if (!["a", "area", "button", "input", "object", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-tabindex",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          type: "integer",
          theOnlyGoodUnits: [],
          customGenericValueError: "Should be integer, no units.",
          zeroOK: true,
          customPxMessage: `Tabbing order number should not be in pixels.`,
          maxValue: 32767
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-tabindex"
          });
        });
      }
    }
  };
}

function attributeValidateTarget(context) {
  return {
    attribute(node) {
      if (node.attribName === "target") {
        if (!["a", "area", "base", "form", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-target",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-target"
            });
          });
        }
      }
    }
  };
}

function attributeValidateText(context) {
  return {
    attribute(node) {
      if (node.attribName === "text") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-text",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-text"
            });
          });
        }
      }
    }
  };
}

function attributeValidateTitle(context) {
  return {
    attribute(node) {
      if (node.attribName === "title") {
        if (["base", "basefont", "head", "html", "meta", "param", "script", "title"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-title",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-title"
            });
          });
        }
      }
    }
  };
}

function attributeValidateType(context) {
  return {
    attribute(node) {
      if (node.attribName === "type") {
        if (!["a", "link", "object", "param", "script", "style", "input", "li", "ol", "ul", "button"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-type",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (["a", "link", "object", "param", "script", "style"].includes(node.parent.tagName)) {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["application/javascript", "application/json", "application/x-www-form-urlencoded", "application/xml", "application/zip", "application/pdf", "application/sql", "application/graphql", "application/ld+json", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.oasis.opendocument.text", "application/zstd", "audio/mpeg", "audio/ogg", "multipart/form-data", "text/css", "text/html", "text/xml", "text/csv", "text/plain", "image/png", "image/jpeg", "image/gif", "application/vnd.api+json"],
              permittedValues: Object.keys(db),
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-type"
              });
            });
          } else if (node.parent.tagName === "input") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["text", "password", "checkbox", "radio", "submit", "reset", "file", "hidden", "image", "button"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-type"
              });
            });
          } else if (node.parent.tagName === "li") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["disc", "square", "circle", "1", "a", "A", "i", "I"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-type"
              });
            });
          } else if (node.parent.tagName === "ol") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["1", "a", "A", "i", "I"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-type"
              });
            });
          } else if (node.parent.tagName === "ul") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["disc", "square", "circle"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-type"
              });
            });
          } else if (node.parent.tagName === "button") {
            validateString(node.attribValueRaw,
            node.attribValueStartsAt,
            {
              quickPermittedValues: ["button", "submit", "reset"],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-type"
              });
            });
          }
      }
    }
  };
}

function attributeValidateUsemap(context) {
  return {
    attribute(node) {
      if (node.attribName === "usemap") {
        if (!["img", "input", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-usemap",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-usemap"
            });
          });
        }
      }
    }
  };
}

function attributeValidateValign(context) {
  return {
    attribute(node) {
      if (node.attribName === "valign") {
        if (!["col", "colgroup", "tbody", "td", "tfoot", "th", "thead", "tr"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-valign",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["top", "middle", "bottom", "baseline"],
            canBeCommaSeparated: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-valign"
            });
          });
        }
      }
    }
  };
}

function attributeValidateValue(context) {
  return {
    attribute(node) {
      if (node.attribName === "value") {
        if (!["input", "option", "param", "button", "li"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-value",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        else if (node.parent.tagName === "li") {
            validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
              zeroOK: false,
              customPxMessage: `Sequence number should not be in pixels.`
            }).forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-value"
              });
            });
          } else {
            const {
              errorArr
            } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
            errorArr.forEach(errorObj => {
              context.report({ ...errorObj,
                ruleId: "attribute-validate-value"
              });
            });
          }
      }
    }
  };
}

function attributeValidateValuetype(context) {
  return {
    attribute(node) {
      if (node.attribName === "valuetype") {
        if (node.parent.tagName !== "param") {
          context.report({
            ruleId: "attribute-validate-valuetype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else {
          validateString(node.attribValueRaw,
          node.attribValueStartsAt,
          {
            permittedValues: ["data", "ref", "object"],
            canBeCommaSeparated: false
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-valuetype"
            });
          });
        }
      }
    }
  };
}

function attributeValidateVersion(context) {
  return {
    attribute(node) {
      if (node.attribName === "version") {
        if (node.parent.tagName !== "html") {
          context.report({
            ruleId: "attribute-validate-version",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const {
            errorArr
          } = checkForWhitespace(node.attribValueRaw, node.attribValueStartsAt);
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-version"
            });
          });
        }
      }
    }
  };
}

function attributeValidateVlink(context) {
  return {
    attribute(node) {
      if (node.attribName === "vlink") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-vlink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null
          });
        } else {
          const errorArr = validateColor(node.attribValueRaw, node.attribValueStartsAt, {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          });
          errorArr.forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-vlink"
            });
          });
        }
      }
    }
  };
}

function attributeValidateVspace(context) {
  return {
    attribute(node) {
      if (node.attribName === "vspace") {
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-vspace",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
          theOnlyGoodUnits: [],
          noUnitsIsFine: true
        });
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "attribute-validate-vspace"
          });
        });
      }
    }
  };
}

function attributeValidateWidth(context) {
  return {
    attribute(node) {
      if (node.attribName === "width") {
        if (!["hr", "iframe", "img", "object", "table", "td", "th", "applet", "col", "colgroup", "pre"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-width",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null
          });
        } else if (node.parent.tagName === "pre") {
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            theOnlyGoodUnits: [],
            noUnitsIsFine: true
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-width"
            });
          });
        } else if (["colgroup", "col"].includes(node.parent.tagName)) {
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            badUnits: ["px"],
            theOnlyGoodUnits: ["*", "%"],
            noUnitsIsFine: true
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-width"
            });
          });
        } else {
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            badUnits: ["px"],
            noUnitsIsFine: true
          }).forEach(errorObj => {
            context.report({ ...errorObj,
              ruleId: "attribute-validate-width"
            });
          });
        }
      }
    }
  };
}

function htmlEntitiesNotEmailFriendly(context) {
  return {
    entity({
      idxFrom,
      idxTo
    }) {
      if (Object.keys(notEmailFriendly).includes(context.str.slice(idxFrom + 1, idxTo - 1))) {
        context.report({
          ruleId: "bad-named-html-entity-not-email-friendly",
          message: "Email-unfriendly named HTML entity.",
          idxFrom,
          idxTo,
          fix: {
            ranges: [[idxFrom, idxTo, `&${notEmailFriendly[context.str.slice(idxFrom + 1, idxTo - 1)]};`]]
          }
        });
      }
    }
  };
}

function processStr(str, offset, context, mode) {
  for (let i = 0, len = str.length; i < len; i++) {
    if ((str[i].charCodeAt(0) > 127 || `<>"&`.includes(str[i])) && (str[i].charCodeAt(0) !== 160 || !Object.keys(context.processedRulesConfig).includes("bad-character-non-breaking-space") || !isAnEnabledValue(context.processedRulesConfig["bad-character-non-breaking-space"]))) {
      let encodedChr = he.encode(str[i], {
        useNamedReferences: mode === "named"
      });
      if (Object.keys(notEmailFriendly).includes(encodedChr.slice(1, encodedChr.length - 1))) {
        encodedChr = `&${notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)]};`;
      }
      let charName = "";
      if (str[i].charCodeAt(0) === 160) {
        charName = " no-break space";
      } else if (str[i].charCodeAt(0) === 38) {
        charName = " ampersand";
      } else if (str[i].charCodeAt(0) === 60) {
        charName = " less than";
      } else if (str[i].charCodeAt(0) === 62) {
        charName = " greater than";
      } else if (str[i].charCodeAt(0) === 34) {
        charName = " double quotes";
      } else if (str[i].charCodeAt(0) === 163) {
        charName = " pound sign";
      }
      context.report({
        ruleId: "character-encode",
        message: `Unencoded${charName} character.`,
        idxFrom: i + offset,
        idxTo: i + 1 + offset,
        fix: {
          ranges: [[i + offset, i + 1 + offset, encodedChr]]
        }
      });
    }
  }
}
const characterEncode = (context, ...opts) => {
  return {
    text(token) {
      let mode = "named";
      if (Array.isArray(opts) && ["named", "numeric"].includes(opts[0])) {
        mode = opts[0];
      }
      processStr(token.value, token.start, context, mode);
    }
  };
};

function characterUnspacedPunctuation(context, originalOpts) {
  const charCodeMapping = {
    63: "questionMark",
    33: "exclamationMark",
    59: "semicolon",
    187: "rightDoubleAngleQuotMark",
    171: "leftDoubleAngleQuotMark"
  };
  return {
    text(node) {
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
      const opts = { ...defaults,
        ...originalOpts
      };
      for (let i = node.start; i < node.end; i++) {
        const charCode = context.str[i].charCodeAt(0);
        if (charCodeMapping[String(charCode)]) {
          const charName = charCodeMapping[String(charCode)];
          if (charName === "exclamationMark" && context.str[right(context.str, i)] === "-" && context.str[right(context.str, right(context.str, i))] === "-") {
            return;
          }
          if (opts[charName].whitespaceLeft === "never" && i && !context.str[i - 1].trim().length) {
            const idxFrom = left(context.str, i) ? left(context.str, i) + 1 : 0;
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom,
              idxTo: i,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[idxFrom, i]]
              }
            });
          }
          if (opts[charName].whitespaceRight === "never" && i < node.end - 1 && !context.str[i + 1].trim().length) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: i + 1,
              idxTo: right(context.str, i) || context.str.length,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[i + 1, right(context.str, i) || context.str.length]]
              }
            });
          }
          if (opts[charName].whitespaceLeft === "always" && i && context.str[i - 1].trim().length) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i, i, " "]]
              }
            });
          }
          if (opts[charName].whitespaceRight === "always" && i < node.end - 1 && context.str[i + 1].trim().length) {
            context.report({
              ruleId: "character-unspaced-punctuation",
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

function mediaMalformed(context) {
  return {
    at(node) {
      if (node.identifier === "media") {
        const errors = isMediaD(node.query, {
          offset: node.queryStartsAt
        });
        errors.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "media-malformed"
          });
        });
      }
    }
  };
}

function validateCommentClosing(token) {
  const reference = {
    simple: "-->",
    only: "<![endif]-->",
    not: "<!--<![endif]-->"
  };
  if (token.kind === "simple" && token.value === "-->" || token.kind === "only" && token.value === "<![endif]-->" || token.kind === "not" && token.value === "<!--<![endif]-->") {
    return [];
  }
  const errorArr = [];
  let valueWithoutWhitespace = "";
  splitByWhitespace(token.value, ([charFrom, charTo]) => {
    valueWithoutWhitespace = `${valueWithoutWhitespace}${token.value.slice(charFrom, charTo)}`;
  }, ([whitespaceFrom, whitespaceTo]) => {
    errorArr.push({
      ruleId: "comment-only-closing-malformed",
      idxFrom: token.start,
      idxTo: token.end,
      message: "Remove whitespace.",
      fix: {
        ranges: [[whitespaceFrom + token.start, whitespaceTo + token.start]]
      }
    });
  });
  if (token.kind === "simple" && valueWithoutWhitespace === "-->" || token.kind === "only" && valueWithoutWhitespace === "<![endif]-->" || token.kind === "not" && valueWithoutWhitespace === "<!--<![endif]-->") {
    return errorArr;
  }
  errorArr.push({
    idxFrom: token.start,
    idxTo: token.end,
    message: "Malformed closing comment tag.",
    fix: {
      ranges: [[token.start, token.end, reference[token.kind]]]
    }
  });
  return errorArr;
}

function commentClosingMalformed(context) {
  return {
    comment(node) {
      if (node.closing) {
        const errorArr = validateCommentClosing(node) || [];
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            keepSeparateWhenFixing: true,
            ruleId: "comment-closing-malformed"
          });
        });
      }
    }
  };
}

function validateCommentOpening(token) {
  const reference = {
    simple: /<!--/g,
    only: /<!--\[[^\]]+\]>/g,
    not: /<!--\[[^\]]+\]><!-->/g
  };
  if (token.kind === "simple" && reference.simple.test(token.value) || token.kind === "only" && reference.only.test(token.value) || token.kind === "not" && reference.not.test(token.value)) {
    return [];
  }
  const errorArr = [];
  let valueWithoutWhitespace = "";
  if (token.kind === "simple") {
    splitByWhitespace(token.value, ([charFrom, charTo]) => {
      valueWithoutWhitespace = `${valueWithoutWhitespace}${token.value.slice(charFrom, charTo)}`;
    }, ([whitespaceFrom, whitespaceTo]) => {
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Remove whitespace.",
        fix: {
          ranges: [[whitespaceFrom + token.start, whitespaceTo + token.start]]
        }
      });
    });
  }
  if (token.kind === "simple" && reference.simple.test(valueWithoutWhitespace) || token.kind === "only" && reference.only.test(valueWithoutWhitespace) || token.kind === "not" && reference.not.test(valueWithoutWhitespace)) {
    return errorArr;
  }
  let wrongBracketType = false;
  if (["only", "not"].includes(token.kind)) {
    findMalformed(token.value, "<!--[", ({
      idxFrom,
      idxTo
    }) => {
      let finalIdxTo = idxTo;
      if (idxFrom === token.start) {
        if (
        "{(".includes(token.value[idxTo]) &&
        matchRight(token.value, idxTo, "if", {
          trimBeforeMatching: true
        })) {
          wrongBracketType = true;
          finalIdxTo += 1;
        }
        errorArr.push({
          idxFrom: token.start,
          idxTo: token.end,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [[idxFrom + token.start, finalIdxTo + token.start, "<!--["]]
          }
        });
      }
    });
  }
  if (token.kind === "not") {
    findMalformed(token.value, "]><!-->", ({
      idxFrom,
      idxTo
    }) => {
      let finalIdxFrom = idxFrom;
      if ("})".includes(token.value[idxFrom - 1]) &&
      wrongBracketType) {
        finalIdxFrom -= 1;
      }
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [[finalIdxFrom + token.start, idxTo + token.start, "]><!-->"]]
        }
      });
    });
  } else if (token.kind === "only") {
    for (let i = token.value.length; i--;) {
      if (token.value[i].trim().length && !">]".includes(token.value[i])) {
        let rangeStart = i + 1;
        if ("})".includes(token.value[i]) && wrongBracketType) {
          rangeStart -= 1;
        }
        if (token.value.slice(i + 1) !== "]>") {
          errorArr.push({
            idxFrom: token.start,
            idxTo: token.end,
            message: "Malformed opening comment tag.",
            fix: {
              ranges: [[rangeStart + token.start, token.end, "]>"]]
            }
          });
        }
        break;
      }
    }
  }
  return errorArr;
}

function commentOpeningMalformed(context) {
  return {
    text: node => {
      findMalformed(node.value, "<!--", errorObj => {
        context.report({ ...errorObj,
          message: "Malformed opening comment tag.",
          ruleId: "comment-opening-malformed",
          fix: {
            ranges: [[errorObj.idxFrom, errorObj.idxTo, "<!--"]]
          }
        });
      }, {
        stringOffset: node.start
      });
    },
    comment: node => {
      if (!node.closing) {
        const errorArr = validateCommentOpening(node) || [];
        errorArr.forEach(errorObj => {
          context.report({ ...errorObj,
            ruleId: "comment-opening-malformed"
          });
        });
      }
    }
  };
}

function commentMismatchingPair(context) {
  return {
    ast(node) {
      traverse(node,
      (key, val, innerObj) => {
        const current = val !== undefined ? val : key;
        if (isObj(current)) {
          if (current.type === "comment" && current.closing) {
            const previousToken = op.get(node, pathPrev(innerObj.path));
            if (isObj(previousToken) && previousToken.type === "comment" && !previousToken.closing) {
              if (previousToken.kind === "not" && current.kind === "only") {
                context.report({
                  ruleId: "comment-mismatching-pair",
                  keepSeparateWhenFixing: true,
                  message: `Add "<!--".`,
                  idxFrom: current.start,
                  idxTo: current.end,
                  fix: {
                    ranges: [[current.start, current.start, "<!--"]]
                  }
                });
              } else if (previousToken.kind === "only" && current.kind === "not") {
                context.report({
                  ruleId: "comment-mismatching-pair",
                  keepSeparateWhenFixing: true,
                  message: `Remove "<!--".`,
                  idxFrom: current.start,
                  idxTo: current.end,
                  fix: {
                    ranges: [[current.start, current.end, "<![endif]-->"]]
                  }
                });
              }
            }
          }
        }
        return current;
      });
    }
  };
}

function commentConditionalNested(context) {
  return {
    ast(node) {
      const pathsWithOpeningComments = [];
      traverse(node,
      (key, val, innerObj) => {
        const current = val !== undefined ? val : key;
        if (isObj(current)) {
          if (current.type === "comment") {
            if (pathsWithOpeningComments.some(pathStr => innerObj.path.startsWith(pathStr))) {
              context.report({
                ruleId: "comment-conditional-nested",
                message: `Don't nest comments.`,
                idxFrom: current.start,
                idxTo: current.end,
                fix: null
              });
            }
            if (!current.closing) {
              pathsWithOpeningComments.push(innerObj.path);
            }
          }
        }
        return current;
      });
    }
  };
}

function tdSiblingPadding(context) {
  let start;
  let end;
  return {
    tag(node) {
      if (
      node.tagName === "tr" &&
      Array.isArray(node.children) &&
      node.children.filter(tokenObj => tokenObj.type === "tag" && tokenObj.tagName === "td" && !tokenObj.closing).length > 1 &&
      node.children.some(tokenObj => tokenObj.type === "tag" && tokenObj.tagName === "td" && !tokenObj.closing && Array.isArray(tokenObj.attribs) && tokenObj.attribs.some(attribObj => attribObj.attribName === "style" && Array.isArray(attribObj.attribValue) && attribObj.attribValue.some(attribValueObj => {
        if (typeof attribValueObj.property === "string" && attribValueObj.property.startsWith("padding-")) {
          start = attribValueObj.start;
          end = attribValueObj.end;
          return true;
        }
        return false;
      })))) {
        context.report({
          ruleId: "email-td-sibling-padding",
          message: `Don't set padding on TD when sibling TD's are present.`,
          idxFrom: start,
          idxTo: end,
          fix: null
        });
      }
    }
  };
}

function processNode(token, context, mode) {
  let nodeArr;
  if (token.properties !== undefined) {
    nodeArr = token.properties;
  } else if (token.attribValue !== undefined) {
    nodeArr = token.attribValue;
  }
  if (!nodeArr) {
    return;
  }
  const properties = nodeArr.filter(property => property.property !== undefined);
  const property = properties[~-properties.length];
  if (mode !== "never" && properties && properties.length && property.semi === null && property.valueEnds) {
    const idxFrom = property.start;
    const idxTo = property.end;
    const positionToInsert = property.importantEnds || property.valueEnds || property.propertyEnds;
    context.report({
      ruleId: "css-trailing-semi",
      idxFrom,
      idxTo,
      message: `Add a semicolon.`,
      fix: {
        ranges: [[positionToInsert, positionToInsert, ";"]]
      }
    });
  } else if (mode === "never" && properties && properties.length && property.semi !== null && property.valueEnds) {
    const idxFrom = property.start;
    const idxTo = property.end;
    const positionToRemove = property.semi;
    context.report({
      ruleId: "css-trailing-semi",
      idxFrom,
      idxTo,
      message: `Remove the semicolon.`,
      fix: {
        ranges: [[positionToRemove, positionToRemove + 1]]
      }
    });
  }
}
const trailingSemi = (context, mode) => {
  return {
    rule(node) {
      processNode(node, context, mode);
    },
    attribute(node) {
      processNode(node, context, mode);
    }
  };
};

const cssRuleMalformed = context => {
  return {
    rule(node) {
      if (Array.isArray(node.properties) && node.properties.length) {
        validateStyle(
        node, context);
      }
    }
  };
};

function processCSS(token, context) {
  let nodeArr;
  if (token.properties !== undefined) {
    nodeArr = token.properties;
  } else if (token.attribValue !== undefined) {
    nodeArr = token.attribValue;
  }
  if (!nodeArr) {
    return;
  }
  nodeArr.filter(property => property.property !== undefined).forEach(property => {
    if (property.colon && property.valueStarts && (property.valueStarts !== property.colon + 2 || context.str[property.colon + 1] !== " ")) {
      context.report({
        ruleId: "format-prettier",
        idxFrom: property.start,
        idxTo: property.end,
        message: `Put a space before a value.`,
        fix: {
          ranges: [[property.colon + 1, property.valueStarts, " "]]
        }
      });
    }
    const lastEnding = property.valueEnds || (property.colon ? property.colon + 1 : null) || property.propertyEnds;
    if (property.importantStarts && lastEnding && (lastEnding + 1 !== property.importantStarts || context.str[lastEnding] !== " ")) {
      context.report({
        ruleId: "format-prettier",
        idxFrom: property.start,
        idxTo: property.end,
        message: `Put a space in front of !imporant.`,
        fix: {
          ranges: [[lastEnding, property.importantStarts, " "]]
        }
      });
    }
  });
  if (nodeArr.length > 1) {
    let somethingMet = false;
    for (let i = 0, len = nodeArr.length; i < len; i++) {
      if (somethingMet && (
      nodeArr[i].property !== undefined ||
      nodeArr[i].type === "comment" &&
      !nodeArr[i].closing ||
      nodeArr[i].type === "esp" &&
      nodeArr[i - 2] && nodeArr[i - 2].property !== undefined) &&
      nodeArr[i - 1].type === "text" && nodeArr[i - 1].value !== " ") {
        context.report({
          ruleId: "format-prettier",
          idxFrom: nodeArr[i - 1].start,
          idxTo: nodeArr[i - 1].end,
          message: `Put a space in front of !imporant.`,
          fix: {
            ranges: [[nodeArr[i - 1].start, nodeArr[i - 1].end, " "]]
          }
        });
      } else if (
      i &&
      !["text", "esp"].includes(nodeArr[i - 1].type) &&
      nodeArr[i].property !== undefined && (
      nodeArr[i].property || nodeArr[i].value || nodeArr[i].important)) {
        context.report({
          ruleId: "format-prettier",
          idxFrom: nodeArr[i].start,
          idxTo: nodeArr[i].end,
          message: `Put a space in front.`,
          fix: {
            ranges: [[nodeArr[i].start, nodeArr[i].start, " "]]
          }
        });
      }
      if (!somethingMet && (nodeArr[i].type === undefined || nodeArr[i].type !== "text")) {
        somethingMet = true;
      }
    }
  }
}
const formatPrettier = context => {
  return {
    rule(node) {
      processCSS(node, context);
    },
    attribute(node) {
      processCSS(node, context);
    }
  };
};

const builtInRules = {};
defineLazyProp(builtInRules, "bad-character-null", () => badCharacterNull);
defineLazyProp(builtInRules, "bad-character-start-of-heading", () => badCharacterStartOfHeading);
defineLazyProp(builtInRules, "bad-character-start-of-text", () => badCharacterStartOfText);
defineLazyProp(builtInRules, "bad-character-end-of-text", () => badCharacterEndOfText);
defineLazyProp(builtInRules, "bad-character-end-of-transmission", () => badCharacterEndOfTransmission);
defineLazyProp(builtInRules, "bad-character-enquiry", () => badCharacterEnquiry);
defineLazyProp(builtInRules, "bad-character-acknowledge", () => badCharacterAcknowledge);
defineLazyProp(builtInRules, "bad-character-bell", () => badCharacterBell);
defineLazyProp(builtInRules, "bad-character-backspace", () => badCharacterBackspace);
defineLazyProp(builtInRules, "bad-character-tabulation", () => badCharacterTabulation);
defineLazyProp(builtInRules, "bad-character-line-tabulation", () => badCharacterLineTabulation);
defineLazyProp(builtInRules, "bad-character-form-feed", () => badCharacterFormFeed);
defineLazyProp(builtInRules, "bad-character-shift-out", () => badCharacterShiftOut);
defineLazyProp(builtInRules, "bad-character-shift-in", () => badCharacterShiftIn);
defineLazyProp(builtInRules, "bad-character-data-link-escape", () => badCharacterDataLinkEscape);
defineLazyProp(builtInRules, "bad-character-device-control-one", () => badCharacterDeviceControlOne);
defineLazyProp(builtInRules, "bad-character-device-control-two", () => badCharacterDeviceControlTwo);
defineLazyProp(builtInRules, "bad-character-device-control-three", () => badCharacterDeviceControlThree);
defineLazyProp(builtInRules, "bad-character-device-control-four", () => badCharacterDeviceControlFour);
defineLazyProp(builtInRules, "bad-character-negative-acknowledge", () => badCharacterNegativeAcknowledge);
defineLazyProp(builtInRules, "bad-character-synchronous-idle", () => badCharacterSynchronousIdle);
defineLazyProp(builtInRules, "bad-character-end-of-transmission-block", () => badCharacterEndOfTransmissionBlock);
defineLazyProp(builtInRules, "bad-character-cancel", () => badCharacterCancel);
defineLazyProp(builtInRules, "bad-character-end-of-medium", () => badCharacterEndOfMedium);
defineLazyProp(builtInRules, "bad-character-substitute", () => badCharacterSubstitute);
defineLazyProp(builtInRules, "bad-character-escape", () => badCharacterEscape);
defineLazyProp(builtInRules, "bad-character-information-separator-four", () => badCharacterInformationSeparatorFour);
defineLazyProp(builtInRules, "bad-character-information-separator-three", () => badCharacterInformationSeparatorThree);
defineLazyProp(builtInRules, "bad-character-information-separator-two", () => badCharacterInformationSeparatorTwo$1);
defineLazyProp(builtInRules, "bad-character-information-separator-one", () => badCharacterInformationSeparatorTwo);
defineLazyProp(builtInRules, "bad-character-delete", () => badCharacterDelete);
defineLazyProp(builtInRules, "bad-character-control-0080", () => badCharacterControl0080);
defineLazyProp(builtInRules, "bad-character-control-0081", () => badCharacterControl0081);
defineLazyProp(builtInRules, "bad-character-break-permitted-here", () => badCharacterBreakPermittedHere);
defineLazyProp(builtInRules, "bad-character-no-break-here", () => badCharacterNoBreakHere);
defineLazyProp(builtInRules, "bad-character-control-0084", () => badCharacterControl0084);
defineLazyProp(builtInRules, "bad-character-next-line", () => badCharacterNextLine);
defineLazyProp(builtInRules, "bad-character-start-of-selected-area", () => badCharacterStartOfSelectedArea);
defineLazyProp(builtInRules, "bad-character-end-of-selected-area", () => badCharacterEndOfSelectedArea);
defineLazyProp(builtInRules, "bad-character-character-tabulation-set", () => badCharacterCharacterTabulationSet);
defineLazyProp(builtInRules, "bad-character-character-tabulation-with-justification", () => badCharacterCharacterTabulationWithJustification);
defineLazyProp(builtInRules, "bad-character-line-tabulation-set", () => badCharacterLineTabulationSet);
defineLazyProp(builtInRules, "bad-character-partial-line-forward", () => badCharacterPartialLineForward);
defineLazyProp(builtInRules, "bad-character-partial-line-backward", () => badCharacterPartialLineBackward);
defineLazyProp(builtInRules, "bad-character-reverse-line-feed", () => badCharacterReverseLineFeed);
defineLazyProp(builtInRules, "bad-character-single-shift-two", () => badCharacterSingleShiftTwo$1);
defineLazyProp(builtInRules, "bad-character-single-shift-three", () => badCharacterSingleShiftTwo);
defineLazyProp(builtInRules, "bad-character-device-control-string", () => badCharacterDeviceControlString);
defineLazyProp(builtInRules, "bad-character-private-use-1", () => badCharacterPrivateUseOne);
defineLazyProp(builtInRules, "bad-character-private-use-2", () => badCharacterPrivateUseTwo);
defineLazyProp(builtInRules, "bad-character-set-transmit-state", () => badCharacterSetTransmitState);
defineLazyProp(builtInRules, "bad-character-cancel-character", () => badCharacterCancelCharacter);
defineLazyProp(builtInRules, "bad-character-message-waiting", () => badCharacterMessageWaiting);
defineLazyProp(builtInRules, "bad-character-start-of-protected-area", () => badCharacterStartOfProtectedArea);
defineLazyProp(builtInRules, "bad-character-end-of-protected-area", () => badCharacterEndOfProtectedArea);
defineLazyProp(builtInRules, "bad-character-start-of-string", () => badCharacterStartOfString);
defineLazyProp(builtInRules, "bad-character-control-0099", () => badCharacterControl0099);
defineLazyProp(builtInRules, "bad-character-single-character-introducer", () => badCharacterSingleCharacterIntroducer);
defineLazyProp(builtInRules, "bad-character-control-sequence-introducer", () => badCharacterControlSequenceIntroducer);
defineLazyProp(builtInRules, "bad-character-string-terminator", () => badCharacterStringTerminator);
defineLazyProp(builtInRules, "bad-character-operating-system-command", () => badCharacterOperatingSystemCommand);
defineLazyProp(builtInRules, "bad-character-private-message", () => badCharacterPrivateMessage);
defineLazyProp(builtInRules, "bad-character-application-program-command", () => badCharacterApplicationProgramCommand);
defineLazyProp(builtInRules, "bad-character-soft-hyphen", () => badCharacterSoftHyphen);
defineLazyProp(builtInRules, "bad-character-non-breaking-space", () => badCharacterNonBreakingSpace);
defineLazyProp(builtInRules, "bad-character-ogham-space-mark", () => badCharacterOghamSpaceMark);
defineLazyProp(builtInRules, "bad-character-en-quad", () => badCharacterEnQuad);
defineLazyProp(builtInRules, "bad-character-em-quad", () => badCharacterEmQuad);
defineLazyProp(builtInRules, "bad-character-en-space", () => badCharacterEnSpace);
defineLazyProp(builtInRules, "bad-character-em-space", () => badCharacterEmSpace);
defineLazyProp(builtInRules, "bad-character-three-per-em-space", () => badCharacterThreePerEmSpace);
defineLazyProp(builtInRules, "bad-character-four-per-em-space", () => badCharacterFourPerEmSpace);
defineLazyProp(builtInRules, "bad-character-six-per-em-space", () => badCharacterSixPerEmSpace);
defineLazyProp(builtInRules, "bad-character-figure-space", () => badCharacterFigureSpace);
defineLazyProp(builtInRules, "bad-character-punctuation-space", () => badCharacterPunctuationSpace);
defineLazyProp(builtInRules, "bad-character-thin-space", () => badCharacterThinSpace);
defineLazyProp(builtInRules, "bad-character-hair-space", () => badCharacterHairSpace);
defineLazyProp(builtInRules, "bad-character-zero-width-space", () => badCharacterZeroWidthSpace);
defineLazyProp(builtInRules, "bad-character-zero-width-non-joiner", () => badCharacterZeroWidthNonJoiner);
defineLazyProp(builtInRules, "bad-character-zero-width-joiner", () => badCharacterZeroWidthJoiner);
defineLazyProp(builtInRules, "bad-character-left-to-right-mark", () => badCharacterLeftToRightMark);
defineLazyProp(builtInRules, "bad-character-right-to-left-mark", () => badCharacterRightToLeftMark);
defineLazyProp(builtInRules, "bad-character-left-to-right-embedding", () => badCharacterLeftToRightEmbedding);
defineLazyProp(builtInRules, "bad-character-right-to-left-embedding", () => badCharacterRightToLeftEmbedding);
defineLazyProp(builtInRules, "bad-character-pop-directional-formatting", () => badCharacterPopDirectionalFormatting);
defineLazyProp(builtInRules, "bad-character-left-to-right-override", () => badCharacterLeftToRightOverride);
defineLazyProp(builtInRules, "bad-character-right-to-left-override", () => badCharacterRightToLeftOverride);
defineLazyProp(builtInRules, "bad-character-word-joiner", () => badCharacterWordJoiner);
defineLazyProp(builtInRules, "bad-character-function-application", () => badCharacterFunctionApplication);
defineLazyProp(builtInRules, "bad-character-invisible-times", () => badCharacterInvisibleTimes);
defineLazyProp(builtInRules, "bad-character-invisible-separator", () => badCharacterInvisibleSeparator);
defineLazyProp(builtInRules, "bad-character-invisible-plus", () => badCharacterInvisiblePlus);
defineLazyProp(builtInRules, "bad-character-left-to-right-isolate", () => badCharacterLeftToRightIsolate);
defineLazyProp(builtInRules, "bad-character-right-to-left-isolate", () => badCharacterRightToLeftIsolate);
defineLazyProp(builtInRules, "bad-character-first-strong-isolate", () => badCharacterFirstStrongIsolate);
defineLazyProp(builtInRules, "bad-character-pop-directional-isolate", () => badCharacterPopDirectionalIsolate);
defineLazyProp(builtInRules, "bad-character-inhibit-symmetric-swapping", () => badCharacterInhibitSymmetricSwapping);
defineLazyProp(builtInRules, "bad-character-activate-symmetric-swapping", () => badCharacterActivateSymmetricSwapping);
defineLazyProp(builtInRules, "bad-character-inhibit-arabic-form-shaping", () => badCharacterInhibitArabicFormShaping);
defineLazyProp(builtInRules, "bad-character-activate-arabic-form-shaping", () => badCharacterActivateArabicFormShaping);
defineLazyProp(builtInRules, "bad-character-national-digit-shapes", () => badCharacterNationalDigitShapes);
defineLazyProp(builtInRules, "bad-character-nominal-digit-shapes", () => badCharacterNominalDigitShapes);
defineLazyProp(builtInRules, "bad-character-zero-width-no-break-space", () => badCharacterZeroWidthNoBreakSpace);
defineLazyProp(builtInRules, "bad-character-interlinear-annotation-anchor", () => badCharacterInterlinearAnnotationAnchor);
defineLazyProp(builtInRules, "bad-character-interlinear-annotation-separator", () => badCharacterInterlinearAnnotationSeparator);
defineLazyProp(builtInRules, "bad-character-interlinear-annotation-terminator", () => badCharacterInterlinearAnnotationTerminator);
defineLazyProp(builtInRules, "bad-character-line-separator", () => badCharacterLineSeparator);
defineLazyProp(builtInRules, "bad-character-paragraph-separator", () => badCharacterParagraphSeparator);
defineLazyProp(builtInRules, "bad-character-narrow-no-break-space", () => badCharacterNarrowNoBreakSpace);
defineLazyProp(builtInRules, "bad-character-medium-mathematical-space", () => badCharacterMediumMathematicalSpace);
defineLazyProp(builtInRules, "bad-character-ideographic-space", () => badCharacterIdeographicSpace);
defineLazyProp(builtInRules, "bad-character-replacement-character", () => badCharacterReplacementCharacter);
defineLazyProp(builtInRules, "tag-space-after-opening-bracket", () => tagSpaceAfterOpeningBracket);
defineLazyProp(builtInRules, "tag-space-before-closing-bracket", () => tagSpaceBeforeClosingBracket);
defineLazyProp(builtInRules, "tag-space-before-closing-slash", () => tagSpaceBeforeClosingSlash);
defineLazyProp(builtInRules, "tag-space-between-slash-and-bracket", () => tagSpaceBetweenSlashAndBracket);
defineLazyProp(builtInRules, "tag-closing-backslash", () => tagClosingBackslash);
defineLazyProp(builtInRules, "tag-void-slash", () => tagVoidSlash);
defineLazyProp(builtInRules, "tag-name-case", () => tagNameCase);
defineLazyProp(builtInRules, "tag-is-present", () => tagIsPresent);
defineLazyProp(builtInRules, "tag-bold", () => tagBold);
defineLazyProp(builtInRules, "tag-bad-self-closing", () => tagBadSelfClosing);
defineLazyProp(builtInRules, "attribute-duplicate", () => attributeDuplicate);
defineLazyProp(builtInRules, "attribute-malformed", () => attributeMalformed);
defineLazyProp(builtInRules, "attribute-on-closing-tag", () => attributeOnClosingTag);
defineLazyProp(builtInRules, "attribute-enforce-img-alt", () => attributeEnforceImgAlt);
defineLazyProp(builtInRules, "attribute-validate-abbr", () => attributeValidateAbbr);
defineLazyProp(builtInRules, "attribute-validate-accept-charset", () => attributeValidateAcceptCharset);
defineLazyProp(builtInRules, "attribute-validate-accept", () => attributeValidateAccept);
defineLazyProp(builtInRules, "attribute-validate-accesskey", () => attributeValidateAccesskey);
defineLazyProp(builtInRules, "attribute-validate-action", () => attributeValidateAction);
defineLazyProp(builtInRules, "attribute-validate-align", () => attributeValidateAlign);
defineLazyProp(builtInRules, "attribute-validate-alink", () => attributeValidateAlink);
defineLazyProp(builtInRules, "attribute-validate-alt", () => attributeValidateAlt);
defineLazyProp(builtInRules, "attribute-validate-archive", () => attributeValidateArchive);
defineLazyProp(builtInRules, "attribute-validate-axis", () => attributeValidateAxis);
defineLazyProp(builtInRules, "attribute-validate-background", () => attributeValidateBackground);
defineLazyProp(builtInRules, "attribute-validate-bgcolor", () => attributeValidateBgcolor);
defineLazyProp(builtInRules, "attribute-validate-border", () => attributeValidateBorder);
defineLazyProp(builtInRules, "attribute-validate-cellpadding", () => attributeValidateCellpadding);
defineLazyProp(builtInRules, "attribute-validate-cellspacing", () => attributeValidateCellspacing);
defineLazyProp(builtInRules, "attribute-validate-char", () => attributeValidateChar);
defineLazyProp(builtInRules, "attribute-validate-charoff", () => attributeValidateCharoff);
defineLazyProp(builtInRules, "attribute-validate-charset", () => attributeValidateCharset);
defineLazyProp(builtInRules, "attribute-validate-checked", () => attributeValidateChecked);
defineLazyProp(builtInRules, "attribute-validate-cite", () => attributeValidateCite);
defineLazyProp(builtInRules, "attribute-validate-class", () => attributeValidateClass);
defineLazyProp(builtInRules, "attribute-validate-classid", () => attributeValidateClassid$1);
defineLazyProp(builtInRules, "attribute-validate-clear", () => attributeValidateClassid);
defineLazyProp(builtInRules, "attribute-validate-code", () => attributeValidateCode);
defineLazyProp(builtInRules, "attribute-validate-codebase", () => attributeValidateCodebase);
defineLazyProp(builtInRules, "attribute-validate-codetype", () => attributeValidateCodetype);
defineLazyProp(builtInRules, "attribute-validate-color", () => attributeValidateColor);
defineLazyProp(builtInRules, "attribute-validate-cols", () => attributeValidateCols);
defineLazyProp(builtInRules, "attribute-validate-colspan", () => attributeValidateColspan);
defineLazyProp(builtInRules, "attribute-validate-compact", () => attributeValidateCompact);
defineLazyProp(builtInRules, "attribute-validate-content", () => attributeValidateContent);
defineLazyProp(builtInRules, "attribute-validate-coords", () => attributeValidateCoords);
defineLazyProp(builtInRules, "attribute-validate-data", () => attributeValidateData);
defineLazyProp(builtInRules, "attribute-validate-datetime", () => attributeValidateDatetime);
defineLazyProp(builtInRules, "attribute-validate-declare", () => attributeValidateDeclare);
defineLazyProp(builtInRules, "attribute-validate-defer", () => attributeValidateDefer);
defineLazyProp(builtInRules, "attribute-validate-dir", () => attributeValidateDir);
defineLazyProp(builtInRules, "attribute-validate-disabled", () => attributeValidateDisabled);
defineLazyProp(builtInRules, "attribute-validate-enctype", () => attributeValidateEnctype);
defineLazyProp(builtInRules, "attribute-validate-face", () => attributeValidateFace);
defineLazyProp(builtInRules, "attribute-validate-for", () => attributeValidateFor);
defineLazyProp(builtInRules, "attribute-validate-frame", () => attributeValidateFrame);
defineLazyProp(builtInRules, "attribute-validate-frameborder", () => attributeValidateFrameborder);
defineLazyProp(builtInRules, "attribute-validate-headers", () => attributeValidateHeaders);
defineLazyProp(builtInRules, "attribute-validate-height", () => attributeValidateHeight);
defineLazyProp(builtInRules, "attribute-validate-href", () => attributeValidateHref);
defineLazyProp(builtInRules, "attribute-validate-hreflang", () => attributeValidateHreflang);
defineLazyProp(builtInRules, "attribute-validate-hspace", () => attributeValidateHspace);
defineLazyProp(builtInRules, "attribute-validate-http-equiv", () => attributeValidateHttpequiv);
defineLazyProp(builtInRules, "attribute-validate-id", () => attributeValidateId);
defineLazyProp(builtInRules, "attribute-validate-ismap", () => attributeValidateIsmap);
defineLazyProp(builtInRules, "attribute-validate-label", () => attributeValidateLabel);
defineLazyProp(builtInRules, "attribute-validate-lang", () => attributeValidateLang);
defineLazyProp(builtInRules, "attribute-validate-language", () => attributeValidateLanguage);
defineLazyProp(builtInRules, "attribute-validate-link", () => attributeValidateLink);
defineLazyProp(builtInRules, "attribute-validate-longdesc", () => attributeValidateLongdesc);
defineLazyProp(builtInRules, "attribute-validate-marginheight", () => attributeValidateMarginheight);
defineLazyProp(builtInRules, "attribute-validate-marginwidth", () => attributeValidateMarginwidth);
defineLazyProp(builtInRules, "attribute-validate-maxlength", () => attributeValidateMaxlength);
defineLazyProp(builtInRules, "attribute-validate-media", () => attributeValidateMedia);
defineLazyProp(builtInRules, "attribute-validate-method", () => attributeValidateMethod);
defineLazyProp(builtInRules, "attribute-validate-multiple", () => attributeValidateMultiple);
defineLazyProp(builtInRules, "attribute-validate-name", () => attributeValidateName);
defineLazyProp(builtInRules, "attribute-validate-nohref", () => attributeValidateNohref);
defineLazyProp(builtInRules, "attribute-validate-noresize", () => attributeValidateNoresize);
defineLazyProp(builtInRules, "attribute-validate-noshade", () => attributeValidateNoshade);
defineLazyProp(builtInRules, "attribute-validate-nowrap", () => attributeValidateNowrap);
defineLazyProp(builtInRules, "attribute-validate-object", () => attributeValidateObject);
defineLazyProp(builtInRules, "attribute-validate-onblur", () => attributeValidateOnblur);
defineLazyProp(builtInRules, "attribute-validate-onchange", () => attributeValidateOnchange);
defineLazyProp(builtInRules, "attribute-validate-onclick", () => attributeValidateOnclick);
defineLazyProp(builtInRules, "attribute-validate-ondblclick", () => attributeValidateOndblclick);
defineLazyProp(builtInRules, "attribute-validate-onfocus", () => attributeValidateOnfocus);
defineLazyProp(builtInRules, "attribute-validate-onkeydown", () => attributeValidateOnkeydown);
defineLazyProp(builtInRules, "attribute-validate-onkeypress", () => attributeValidateOnkeypress);
defineLazyProp(builtInRules, "attribute-validate-onkeyup", () => attributeValidateOnkeyup);
defineLazyProp(builtInRules, "attribute-validate-onload", () => attributeValidateOnload);
defineLazyProp(builtInRules, "attribute-validate-onmousedown", () => attributeValidateOnmousedown);
defineLazyProp(builtInRules, "attribute-validate-onmousemove", () => attributeValidateOnmousemove);
defineLazyProp(builtInRules, "attribute-validate-onmouseout", () => attributeValidateOnmouseout);
defineLazyProp(builtInRules, "attribute-validate-onmouseover", () => attributeValidateOnmouseover);
defineLazyProp(builtInRules, "attribute-validate-onmouseup", () => attributeValidateOnmouseup);
defineLazyProp(builtInRules, "attribute-validate-onreset", () => attributeValidateOnreset);
defineLazyProp(builtInRules, "attribute-validate-onsubmit", () => attributeValidateOnsubmit);
defineLazyProp(builtInRules, "attribute-validate-onselect", () => attributeValidateOnselect);
defineLazyProp(builtInRules, "attribute-validate-onunload", () => attributeValidateOnunload);
defineLazyProp(builtInRules, "attribute-validate-profile", () => attributeValidateProfile);
defineLazyProp(builtInRules, "attribute-validate-prompt", () => attributeValidatePrompt);
defineLazyProp(builtInRules, "attribute-validate-readonly", () => attributeValidateReadonly);
defineLazyProp(builtInRules, "attribute-validate-rel", () => attributeValidateRel);
defineLazyProp(builtInRules, "attribute-validate-rev", () => attributeValidateRev);
defineLazyProp(builtInRules, "attribute-validate-rows", () => attributeValidateRows);
defineLazyProp(builtInRules, "attribute-validate-rowspan", () => attributeValidateRowspan);
defineLazyProp(builtInRules, "attribute-validate-rules", () => attributeValidateRules);
defineLazyProp(builtInRules, "attribute-validate-scheme", () => attributeValidateScheme);
defineLazyProp(builtInRules, "attribute-validate-scope", () => attributeValidateScope);
defineLazyProp(builtInRules, "attribute-validate-scrolling", () => attributeValidateScrolling);
defineLazyProp(builtInRules, "attribute-validate-selected", () => attributeValidateSelected);
defineLazyProp(builtInRules, "attribute-validate-shape", () => attributeValidateShape);
defineLazyProp(builtInRules, "attribute-validate-size", () => attributeValidateSize);
defineLazyProp(builtInRules, "attribute-validate-span", () => attributeValidateSpan);
defineLazyProp(builtInRules, "attribute-validate-src", () => attributeValidateSrc);
defineLazyProp(builtInRules, "attribute-validate-standby", () => attributeValidateStandby);
defineLazyProp(builtInRules, "attribute-validate-start", () => attributeValidateStart);
defineLazyProp(builtInRules, "attribute-validate-style", () => attributeValidateStyle);
defineLazyProp(builtInRules, "attribute-validate-summary", () => attributeValidateSummary);
defineLazyProp(builtInRules, "attribute-validate-tabindex", () => attributeValidateTabindex);
defineLazyProp(builtInRules, "attribute-validate-target", () => attributeValidateTarget);
defineLazyProp(builtInRules, "attribute-validate-text", () => attributeValidateText);
defineLazyProp(builtInRules, "attribute-validate-title", () => attributeValidateTitle);
defineLazyProp(builtInRules, "attribute-validate-type", () => attributeValidateType);
defineLazyProp(builtInRules, "attribute-validate-usemap", () => attributeValidateUsemap);
defineLazyProp(builtInRules, "attribute-validate-valign", () => attributeValidateValign);
defineLazyProp(builtInRules, "attribute-validate-value", () => attributeValidateValue);
defineLazyProp(builtInRules, "attribute-validate-valuetype", () => attributeValidateValuetype);
defineLazyProp(builtInRules, "attribute-validate-version", () => attributeValidateVersion);
defineLazyProp(builtInRules, "attribute-validate-vlink", () => attributeValidateVlink);
defineLazyProp(builtInRules, "attribute-validate-vspace", () => attributeValidateVspace);
defineLazyProp(builtInRules, "attribute-validate-width", () => attributeValidateWidth);
defineLazyProp(builtInRules, "bad-named-html-entity-not-email-friendly", () => htmlEntitiesNotEmailFriendly);
defineLazyProp(builtInRules, "character-encode", () => characterEncode);
defineLazyProp(builtInRules, "character-unspaced-punctuation", () => characterUnspacedPunctuation);
defineLazyProp(builtInRules, "media-malformed", () => mediaMalformed);
defineLazyProp(builtInRules, "comment-closing-malformed", () => commentClosingMalformed);
defineLazyProp(builtInRules, "comment-opening-malformed", () => commentOpeningMalformed);
defineLazyProp(builtInRules, "comment-mismatching-pair", () => commentMismatchingPair);
defineLazyProp(builtInRules, "comment-conditional-nested", () => commentConditionalNested);
defineLazyProp(builtInRules, "email-td-sibling-padding", () => tdSiblingPadding);
defineLazyProp(builtInRules, "css-trailing-semi", () => trailingSemi);
defineLazyProp(builtInRules, "css-rule-malformed", () => cssRuleMalformed);
defineLazyProp(builtInRules, "format-prettier", () => formatPrettier);
function get(something) {
  return builtInRules[something];
}
function normaliseRequestedRules(opts) {
  const res = {};
  if (Object.keys(opts).includes("all") && isAnEnabledValue(opts.all)) {
    Object.keys(builtInRules).forEach(ruleName => {
      res[ruleName] = opts.all;
    });
  } else {
    let temp;
    if (Object.keys(opts).some(ruleName => {
      if (["bad-character", "bad-character*", "bad-character-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allBadCharacterRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).some(ruleName => {
      if (["tag", "tag*", "tag-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allTagRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).some(ruleName => {
      if (["attribute", "attribute*", "attribute-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allAttribRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).some(ruleName => {
      if (["css", "css*", "css-*"].includes(ruleName)) {
        temp = ruleName;
        return true;
      }
      return false;
    })) {
      allCSSRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).includes("bad-html-entity")) {
      allBadNamedHTMLEntityRules.forEach(ruleName => {
        res[ruleName] = opts["bad-html-entity"];
      });
    }
    Object.keys(opts).forEach(ruleName => {
      if (!["all", "tag", "tag*", "tag-*", "attribute", "attribute*", "attribute-*", "bad-character", "bad-character", "bad-character*", "bad-character-*", "bad-html-entity"].includes(ruleName)) {
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

TypedEmitter.defaultMaxListeners = 0;
class Linter extends TypedEmitter {
  constructor() {
    super();
    this.messages = [];
    this.str = "";
    this.strLineStartIndexes = [];
    this.config = {};
    this.hasBeenCalledWithKeepSeparateWhenFixing = false;
    this.processedRulesConfig = {};
  }
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.strLineStartIndexes = getLineStartIndexes(str);
    this.config = clone(config);
    this.hasBeenCalledWithKeepSeparateWhenFixing = false;
    this.processedRulesConfig = {};
    const has = Object.prototype.hasOwnProperty;
    if (config) {
      if (typeof config !== "object") {
        throw new Error(`emlint/verify(): [THROW_ID_01] second input argument, config is not a plain object but ${typeof config}. It's equal to:\n${JSON.stringify(config, null, 4)}`);
      } else if (!Object.keys(config).length) {
        return [];
      } else if (!config.rules || typeof config.rules !== "object") {
        throw new Error(`emlint/verify(): [THROW_ID_02] config contains no rules! It was given as:\n${JSON.stringify(config, null, 4)}`);
      }
    } else {
      return [];
    }
    const processedRulesConfig = normaliseRequestedRules(config.rules);
    this.processedRulesConfig = processedRulesConfig;
    Object.keys(processedRulesConfig)
    .filter(ruleName => get(ruleName))
    .filter(ruleName => {
      if (typeof processedRulesConfig[ruleName] === "number") {
        return processedRulesConfig[ruleName] > 0;
      }
      if (Array.isArray(processedRulesConfig[ruleName])) {
        return processedRulesConfig[ruleName][0] > 0;
      }
      return false;
    }).forEach(rule => {
      let rulesFunction;
      if (Array.isArray(processedRulesConfig[rule]) && processedRulesConfig[rule].length > 1) {
        rulesFunction = get(rule)(this, ...processedRulesConfig[rule].slice(1));
      } else {
        rulesFunction = get(rule)(this);
      }
      Object.keys(rulesFunction).forEach(consumedNode => {
        this.on(consumedNode, (...args) => {
          rulesFunction[consumedNode](...args);
        });
      });
    });
    this.emit("ast", traverse(cparser(str, {
      charCb: obj => {
        this.emit("character", obj);
      },
      errCb: obj => {
        const currentRulesSeverity = isAnEnabledRule(config.rules, obj.ruleId);
        if (currentRulesSeverity) {
          let message = `Something is wrong.`;
          if (isObj(obj) && typeof obj.ruleId === "string" && has.call(astErrMessages, obj.ruleId)) {
            message = astErrMessages[obj.ruleId];
          }
          this.report({
            message,
            severity: currentRulesSeverity,
            fix: null,
            ...obj
          });
        }
      }
    }), (key, val, innerObj) => {
      const current = val !== undefined ? val : key;
      if (isObj(current) && (!innerObj.parentKey || !innerObj.parentKey.startsWith("attrib"))) {
        this.emit(current.type, current);
        if (current.type === "tag" && Array.isArray(current.attribs) && current.attribs.length) {
          current.attribs.forEach(attribObj => {
            this.emit("attribute", { ...attribObj,
              parent: { ...current
              }
            });
          });
        }
      }
      return current;
    }));
    if (Object.keys(config.rules).some(ruleName => (ruleName === "all" ||
    ruleName === "bad-html-entity" ||
    ruleName.startsWith("bad-html-entity") || ruleName.startsWith("bad-named-html-entity") || matcher.isMatch(["bad-malformed-numeric-character-entity"], ruleName)) && (isAnEnabledValue(config.rules[ruleName]) || isAnEnabledValue(processedRulesConfig[ruleName])))) {
      fixEnt(str, {
        cb: obj => {
          let matchedRulesName = "";
          let severity;
          if (Object.keys(config.rules).includes("bad-html-entity")) {
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              severity = 1;
            } else if (Array.isArray(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"][0];
            } else if (Number.isInteger(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"];
            }
          } else if (Object.keys(config.rules).some(rulesName => {
            if (matcher.isMatch(obj.ruleName, rulesName)) {
              matchedRulesName = rulesName;
              return true;
            }
            return false;
          })) {
            if (obj.ruleName === "bad-named-html-entity-unrecognised" && config.rules["bad-named-html-entity-unrecognised"] === undefined) {
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
            } else if (obj.ruleName === "bad-named-html-entity-multiple-encoding") {
              message = "HTML entity encoding over and over.";
            } else if (obj.ruleName === "bad-malformed-numeric-character-entity") {
              message = "Malformed numeric entity.";
            } else {
              message = `Malformed ${obj.entityName ? obj.entityName : "named"} entity.`;
            }
            let ranges = [[obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded ? obj.rangeValEncoded : ""]];
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
          this.emit("entity", {
            idxFrom: from,
            idxTo: to
          });
        }
      });
    }
    const allEventNames = ["tag", "at", "rule", "text", "esp", "character", "attribute", "ast", "comment", "entity"];
    allEventNames.forEach(eventName => {
      this.removeAllListeners(eventName);
    });
    return clone(this.messages);
  }
  report(obj) {
    const {
      line,
      col
    } = lineCol(this.strLineStartIndexes, obj.idxFrom, true);
    let severity = obj.severity || 0;
    if (!Number.isInteger(obj.severity) && typeof this.processedRulesConfig[obj.ruleId] === "number") {
      severity = this.processedRulesConfig[obj.ruleId];
    } else if (!Number.isInteger(obj.severity) && Array.isArray(this.processedRulesConfig[obj.ruleId])) {
      severity = this.processedRulesConfig[obj.ruleId][0];
    }
    this.messages.push({
      fix: null,
      keepSeparateWhenFixing: false,
      line,
      column: col,
      severity,
      ...obj,
      ...(this.hasBeenCalledWithKeepSeparateWhenFixing ? {
        fix: null
      } : {})
    });
    if (obj.keepSeparateWhenFixing && !this.hasBeenCalledWithKeepSeparateWhenFixing && obj.fix) {
      this.hasBeenCalledWithKeepSeparateWhenFixing = true;
    }
  }
}

var version$1 = "4.3.0";

const version = version$1;

export { Linter, util, version };
