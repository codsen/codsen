import {
  left,
  right,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight
} from "string-left-right";
import knownBooleanHTMLAttributes from "./knownBooleanHTMLAttributes.json";
import fixBrokenEntities from "string-fix-broken-named-entities";
import errorsCharacters from "./errors-characters.json";
import knownHTMLTags from "./knownHTMLTags.json";
import knownESPTags from "./knownESPTags.json";
import errorsRules from "./errors-rules.json";
import arrayiffy from "arrayiffy-if-string";
import checkTypes from "check-types-mini";
import { version } from "../package.json";
import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";
import merge from "ranges-merge";
import * as util from "./util";
const isArr = Array.isArray;
const {
  attributeOnTheRight,
  withinTagInnerspace,
  isLowerCaseLetter,
  findClosingQuote,
  tagOnTheRight,
  charIsQuote,
  encodeChar,
  isStr,
  isNum,
  flip,
  log
} = util;

// the main function:
// -----------------------------------------------------------------------------

function lint(str, originalOpts) {
  // Internal functions (placed here to access the same scope)
  // ---------------------------------------------------------------------------

  // this function below gets pinged each time a tag's record has been gathered
  function pingTag(logTag) {
    console.log(`046 pingTag(): ${JSON.stringify(logTag, null, 4)}`);
  }

  function pingEspTag(espTagObj) {
    // 1. catch mismatching parentheses' errors:
    if (isNum(espTagObj.startAt) && isNum(espTagObj.endAt)) {
      const openingParens = str
        .slice(espTagObj.startAt, espTagObj.endAt)
        .match(/\(/g);
      const closingParens = str
        .slice(espTagObj.startAt, espTagObj.endAt)
        .match(/\)/g);
      if (
        (isArr(openingParens) &&
          isArr(closingParens) &&
          openingParens.length !== closingParens.length) ||
        (isArr(openingParens) && !isArr(closingParens)) ||
        (!isArr(openingParens) && isArr(closingParens))
      ) {
        if (
          (isArr(openingParens) &&
            isArr(closingParens) &&
            openingParens.length > closingParens.length) ||
          (isArr(openingParens) &&
            openingParens.length &&
            !isArr(closingParens))
        ) {
          submit({
            name: "esp-more-opening-parentheses-than-closing",
            position: [[espTagObj.startAt, espTagObj.endAt]]
          });
          console.log(
            `078 ${log(
              "push",
              "esp-more-opening-parentheses-than-closing",
              `${`[[${espTagObj.startAt}, ${espTagObj.endAt}]]`}`
            )}`
          );
        } else if (
          (isArr(openingParens) &&
            isArr(closingParens) &&
            openingParens.length < closingParens.length) ||
          (isArr(closingParens) &&
            closingParens.length &&
            !isArr(openingParens))
        ) {
          submit({
            name: "esp-more-closing-parentheses-than-opening",
            position: [[espTagObj.startAt, espTagObj.endAt]]
          });
          console.log(
            `097 ${log(
              "push",
              "esp-more-closing-parentheses-than-opening",
              `${`[[${espTagObj.startAt}, ${espTagObj.endAt}]]`}`
            )}`
          );
        }
      }
    }
  }

  // Input argument validation
  // ---------------------------------------------------------------------------
  if (!isStr(str)) {
    throw new Error(
      `emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }

  // Prep the opts
  // ---------------------------------------------------------------------------

  const defaults = {
    rules: {},
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };

  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        enforceStrictKeyset: true,
        msg: "emlint: [THROW_ID_03*]",
        ignorePaths: "rules.*",
        schema: {
          rules: ["string", "object", "false", "null", "undefined"],
          style: ["object", "null", "undefined"],
          "style.line_endings_CR_LF_CRLF": ["string", "null", "undefined"]
        }
      });

      // normalise opts.style.line_endings_CR_LF_CRLF:
      if (opts.style && isStr(opts.style.line_endings_CR_LF_CRLF)) {
        if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
          if (opts.style.line_endings_CR_LF_CRLF !== "CR") {
            // CR value is messed up
            opts.style.line_endings_CR_LF_CRLF === "CR";
          }
        } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "lf") {
          if (opts.style.line_endings_CR_LF_CRLF !== "LF") {
            // LF value is messed up
            opts.style.line_endings_CR_LF_CRLF === "LF";
          }
        } else if (
          opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf"
        ) {
          if (opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
            // CRLF value is messed up
            opts.style.line_endings_CR_LF_CRLF === "CRLF";
          }
        } else {
          throw new Error(
            `emlint: [THROW_ID_04] opts.style.line_endings_CR_LF_CRLF should be either falsey or string "CR" or "LF" or "CRLF". It was given as:\n${JSON.stringify(
              opts.style.line_endings_CR_LF_CRLF,
              null,
              4
            )} (type is string)`
          );
        }
      }
    } else {
      throw new Error(
        `emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
          originalOpts,
          null,
          4
        )} (type ${typeof originalOpts})`
      );
    }
  } else {
    opts = clone(defaults);
  }

  console.log(
    `188 USING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // Define variables
  // ---------------------------------------------------------------------------

  let rawEnforcedEOLChar;
  if (opts.style && isStr(opts.style.line_endings_CR_LF_CRLF)) {
    if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
      rawEnforcedEOLChar = "\r";
    } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
      rawEnforcedEOLChar = "\r\n";
    } else {
      rawEnforcedEOLChar = "\n";
    }
  }

  // doNothingUntil can be either falsey or truthy: index number or boolean true
  // If it's number, it's instruction to avoid actions until that index is
  // reached when traversing. If it's boolean, it means we don't know when we'll
  // stop, we just turn on the flag (permanently, for now).
  let doNothingUntil = null;

  // here we keep a note why we activated "doNothingUntil":
  let doNothingUntilReason = null;

  // Tag tracking:
  let logTag;
  const defaultLogTag = {
    tagStartAt: null,
    tagEndAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    recognised: null,
    closing: null,
    pureHTML: true,
    attributes: [],
    esp: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag(); // initiate!

  // PS. we do this contraption above to make life easier when we want to reset
  // the marker object. Imagine, what happens if we add a new key we want to
  // keep record of. All resets, if they were hardcoded, would have to be manually
  // updated. Now, with above reset, there's single source of truth, single
  // reference of all keys. As a bonus, besides reset, we can always query deeper
  // keys, like "if obj.key1.key2". Without reset, "key1" would not exist and
  // we could not query.

  // ================

  // Attribute tracking:
  // Each object represents one attribute. Each will be pushed into logTag.attributes
  // array when assembled.
  let logAttr;
  const defaultLogAttr = {
    attrStartAt: null,
    attrEndAt: null,
    attrNameStartAt: null,
    attrNameEndAt: null,
    attrName: null,
    attrValue: null,
    attrValueStartAt: null,
    attrValueEndAt: null,
    attrEqualAt: null,
    attrOpeningQuote: { pos: null, val: null },
    attrClosingQuote: { pos: null, val: null },
    recognised: null,
    pureHTML: true
  };
  function resetLogAttr() {
    logAttr = clone(defaultLogAttr);
  }
  resetLogAttr(); // initiate!

  // ================

  // Heuristic ESP marker tracking:
  // ESP stands for Email Service Provider
  // for example, Mailchimp, Eloqua, Bronto and Responsys are ESP's.

  // Heuristic means it's not hardcoded, a.k.a. smart, a.k.a. "quasi-A.I."

  // We mark their templating language markers, such as "{{" and "}}".
  // There many ESP's and many different template marking languages they use.
  // The plan is to come up with a universal algorithm that can recognise them
  // all. This is an ambitious task but wasn't flying to the ambitious too?
  // Nobody has pulled off heuristical ESP tag recognition before.
  // But hey, nobody has pulled off a decent HTML linter at the first place...
  let logEspTag;
  const defaultEspTag = {
    headStartAt: null,
    headEndAt: null,
    headVal: null,
    tailStartAt: null,
    tailEndAt: null,
    tailVal: null,
    startAt: null,
    endAt: null,
    recognised: null,
    type: null
  };
  function resetEspTag() {
    logEspTag = clone(defaultEspTag);
  }
  resetEspTag(); // initiate!

  // templating language recognition-related bits

  // temp contains all common templating language head/tail marker characters:
  const espChars = `{}%-$_()*|`;
  // known functions-based ESP templating language head/tail characters:
  const espCharsFunc = `$`;

  // ================

  let logWhitespace;
  const defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace(); // initiate!

  // ================

  // Tag-related issues will be first pushed here and only when closing of the
  // tag is really confirmed, they will be pushed into real issues array.
  // This is necessary to solve ambiguous cases such as "a < b" where algorithm
  // can't "see", is it tag further down or is it raw unencoded brackets.
  // In each case, we have two different issues:
  // "bad-character-unencoded-opening-bracket" (suitable for rawIssueStaging), OR
  // "tag-space-after-opening-bracket" (suitable for tagIssueStaging)

  let tagIssueStaging = [];
  let rawIssueStaging = [];

  // Return-related:
  // ================

  const retObj = {
    issues: [],
    applicableRules: {}
  };

  // prepare the "applicableRules"
  // -----------------------------------------------------------------------------

  // Assemble a new object out of all character and general rules coming from JSON
  // and set rule names as keys, and their values as boolean "false".
  // Then, in lint() function, whenever any rule COULD be applied if it was on,
  // set the key in applicableRules with that rule's name to boolean "true".
  Object.keys(errorsRules)
    .concat(Object.keys(errorsCharacters))
    .sort()
    .forEach(ruleName => {
      retObj.applicableRules[ruleName] = false;
    });

  function submit(issueObj, whereTo) {
    // 1. set particular rule as among "applicable" rules, but not for stage
    // group of characters (they might be wiped later):
    if (whereTo !== "raw" && whereTo !== "tag") {
      retObj.applicableRules[issueObj.name] = true;
      console.log(
        `364 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`retObj.applicableRules.${
          issueObj.name
        }`}\u001b[${39}m`} = ${retObj.applicableRules[issueObj.name]}`
      );
    } else {
      console.log(`369 didn't put "${issueObj.name}" in applicableRules`);
    }
    // 2. add the given issue to final issues array:
    if (
      !opts.rules.hasOwnProperty(issueObj.name) ||
      opts.rules[issueObj.name]
    ) {
      console.log(
        `377 opts.rules[${issueObj.name}] = ${opts.rules[issueObj.name]}`
      );
      if (whereTo === "raw") {
        console.log(`380 PUSH to rawIssueStaging`);
        // it's an issue about raw characters, outside of tags, put into stage:
        rawIssueStaging.push(issueObj);
      } else if (whereTo === "tag") {
        console.log(`384 PUSH to tagIssueStaging`);
        // it's an issue about raw characters within tags, put into stage:
        tagIssueStaging.push(issueObj);
      } else {
        console.log(`388 PUSH to retObj.issues`);
        // it's definitely real issue:
        retObj.issues.push(issueObj);
      }
    }
  }

  function submitOpeningBracket(from, to) {
    submit(
      {
        name: "bad-character-unencoded-opening-bracket",
        position: [[from, to, "&lt;"]]
      },
      "raw"
    );
    console.log(
      `404 ${log(
        "push raw",
        "bad-character-unencoded-opening-bracket",
        `${`[[${from}, ${to}, "&lt;"]]`}`
      )}`
    );
  }
  function submitClosingBracket(from, to) {
    submit(
      {
        name: "bad-character-unencoded-closing-bracket",
        position: [[from, to, "&gt;"]]
      },
      "raw"
    );
    console.log(
      `420 ${log(
        "push raw",
        "bad-character-unencoded-closing-bracket",
        `${`[[${from}, ${to}, "&gt;"]]`}`
      )}`
    );
  }

  // ================

  // it's used only when opts.style.line_endings_CR_LF_CRLF is not set, to track
  // mixed line endings, calculate prevalent EOL type and set all others to that
  const logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };

  // ================

  // when it's set, it's set to an index of an opening quote:
  let withinQuotes = null;
  // also, this is not enough since we will deal with potentially broken code
  // where quotes might be missing, mismatching or redundant. Our algorithm
  // will often know the location of (future) closing quotes, way before
  // main traversing those location on the main loop (before of auxiliary loops).
  // We need a way to force "withinQuotes" to be closed at certain index.
  let withinQuotesEndAt = null;

  // ---------------------------------------------------------------------------

  if (str.length === 0) {
    // Sometimes things with file I/O operations go wrong and contents get lost
    // This rule will report such cases. You might want to know if your HTML
    // file contents went poof.
    submit({
      name: "file-empty",
      position: [[0, 0]]
    });
    console.log(`459 ${log("push", "file-empty")}`);
  }

  //                         L O O P     S T A R T S
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                               \  |  /
  //                                \ | /
  //                                 \|/
  //                                  V
  for (let i = 0, len = str.length; i < len; i++) {
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE TOP
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // activate the "doNothing" mode if we're within ESP tag:
    if (
      logEspTag.headVal !== null &&
      i === logEspTag.headEndAt &&
      doNothingUntil === null
    ) {
      // activate the "doNothing" so that HTML rules are not applied onto
      // the ESP templating tags:
      doNothingUntil = true;
      doNothingUntilReason = "esp";
      console.log(
        `503 ${log(
          "set",
          "doNothingUntil",
          doNothingUntil,
          "doNothingUntilReason",
          doNothingUntilReason
        )}`
      );
    }

    // -------------------------------------------------------------------------

    const charcode = str[i].charCodeAt(0);
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m ${`\u001b[${31}m${
        doNothingUntil && doNothingUntil !== i
          ? `██ doNothingUntil ${doNothingUntil} (reason: ${doNothingUntilReason})`
          : ""
      }\u001b[${39}m`}`
    );

    if (doNothingUntil && doNothingUntil !== true && i >= doNothingUntil) {
      doNothingUntil = null;
      console.log(`528 ${log("RESET", "doNothingUntil", doNothingUntil)}`);
      doNothingUntilReason = null;
    }

    // catch a state of being within CDATA
    // https://stackoverflow.com/questions/2784183/what-does-cdata-in-xml-mean

    console.log(`535 ${`\u001b[${90}m${`above CDATA clauses`}\u001b[${39}m`}`);
    if (
      str[i + 4] &&
      str[i].toLowerCase() === "c" &&
      rightSeq(
        str,
        i,
        { i: true },
        "d*",
        "a*",
        "t*",
        "a*",
        "[?*",
        "]?",
        "[?*"
      ) &&
      ("<![".includes(str[left(str, i)]) ||
        (str[i - 1] &&
          !"<![".includes(str[i - 1]) &&
          str[i - 2] === "[" &&
          str[i - 3] === "!" &&
          str[i - 4] === "<" &&
          (!str[i - 5] ||
            (str[i - 5].trim().length && !"<![".includes(str[i - 5])))) ||
        (str[i - 1] &&
          !"<![".includes(str[i - 1]) &&
          str[i - 2] === "!" &&
          str[i - 3] === "<" &&
          (!str[i - 4] ||
            (str[i - 4].trim().length && !"<![".includes(str[i - 4]))))) &&
      leftSeq(str, i, "&", "l", "t", ";", "!", "[") === null
    ) {
      console.log(`567 \u001b[${90}m${`within CDATA clauses`}\u001b[${39}m`);

      // right() - 1 will remove any trailing whitespace, if any
      const rightSideOfCdataOpening =
        right(
          str,
          rightSeq(
            str,
            i,
            { i: true },
            "d*",
            "a*",
            "t*",
            "a*",
            "[?*",
            "]?",
            "[?*"
          ).rightmostChar
        ) - 1;

      console.log(
        `588 ${`\u001b[${33}m${`rightSideOfCdataOpening`}\u001b[${39}m`} = ${JSON.stringify(
          rightSideOfCdataOpening,
          null,
          4
        )}`
      );

      let leftChomp = chompLeft(str, i, "<?*", "!?*", "[?*", "]?*");
      console.log(
        `597 ${`\u001b[${33}m${`leftChomp`}\u001b[${39}m`} = ${JSON.stringify(
          leftChomp,
          null,
          4
        )}`
      );

      // tackle the cases of rogue characters between legit characters, for
      // example; <!.[CDATA[some stuff]]>
      // or
      // rogue characters instead of legit characters, for example:
      // <!.CDATA[some stuff]]>
      // The allowance is for a single character.

      // rogue insertion cases:
      // <![.
      // <!.[
      // <.![
      // ].]> (closing, covered in tails section, not here)
      // ]].> (closing, covered in tails section, not here)

      // rogue replacement cases:
      // <!.
      // <.[
      // ].> (closing, covered in tails section, not here)

      if (
        // <![.
        (!`<![`.includes(str[i - 1]) &&
          str[i - 2] === "[" &&
          str[i - 3] === "!" &&
          str[i - 4] === "<" &&
          (!str[i - 5] || !`<![`.includes(str[i - 5]))) ||
        // <!.[
        (str[i - 1] === "[" &&
          !`<![`.includes(str[i - 2]) &&
          str[i - 3] === "!" &&
          str[i - 4] === "<" &&
          (!str[i - 5] || !`<![`.includes(str[i - 5]))) ||
        // <.![
        (str[i - 1] === "[" &&
          str[i - 2] === "!" &&
          !`<![`.includes(str[i - 3]) &&
          str[i - 4] === "<" &&
          (!str[i - 5] || !`<![`.includes(str[i - 5])))
      ) {
        console.log(
          `644 OLD ${`\u001b[${33}m${`leftChomp`}\u001b[${39}m`} was ${leftChomp}, becomes ${Math.min(
            leftChomp,
            i - 4
          )}`
        );
        leftChomp = Math.min(leftChomp, i - 4);
      } else if (
        // <!.
        (!`<![`.includes(str[i - 1]) &&
          str[i - 2] === "!" &&
          str[i - 3] === "<" &&
          (!str[i - 4] || !`<![`.includes(str[i - 4]))) ||
        // <.[
        (str[i - 1] === "[" &&
          !`<![`.includes(str[i - 2]) &&
          str[i - 3] === "<" &&
          (!str[i - 4] || !`<![`.includes(str[i - 4])))
      ) {
        console.log(
          `663 OLD ${`\u001b[${33}m${`leftChomp`}\u001b[${39}m`} was ${leftChomp}, becomes ${Math.min(
            leftChomp,
            i - 3
          )}`
        );
        leftChomp = Math.min(leftChomp, i - 3);
      }

      if (str.slice(leftChomp, rightSideOfCdataOpening + 1) !== "<![CDATA[") {
        submit({
          name: "bad-cdata-tag-malformed",
          position: [[leftChomp, rightSideOfCdataOpening + 1, "<![CDATA["]]
        });
        console.log(
          `677 ${log(
            "push",
            "bad-cdata-tag-malformed",
            `${`[[${leftChomp}, ${rightSideOfCdataOpening + 1}, "<![CDATA["]]`}`
          )}`
        );
      }

      // 6. Finally, activate doNothingUntil
      doNothingUntil = true;
      doNothingUntilReason = "cdata";
      console.log(
        `689 ${log(
          "set",
          "doNothingUntil",
          doNothingUntil,
          "doNothingUntilReason",
          doNothingUntilReason
        )}`
      );

      // 7. take care of issues at rawIssueStaging:
      if (rawIssueStaging.length) {
        console.log(
          `701 let's process all ${
            rawIssueStaging.length
          } raw character issues at staging`
        );
        rawIssueStaging.forEach(issueObj => {
          if (issueObj.position[0][0] < leftChomp) {
            submit(issueObj);
            console.log(`708 ${log("push", "issueObj", issueObj)}`);
          } else {
            console.log(`710 discarding ${JSON.stringify(issueObj, null, 4)}`);
          }
        });
        rawIssueStaging = [];
        console.log(`714 ${log("reset", "doNothingUntil", doNothingUntil)}`);
      }

      // 8. jump over all cdata opening tag characters
      console.log(`718 ${log("set", "i", i, "then continue")}`);
      i = rightSideOfCdataOpening;
      continue;
    }

    // catch the ending of a CDATA
    if (
      doNothingUntil === true &&
      doNothingUntilReason === "cdata" &&
      `[]`.includes(str[i])
    ) {
      let temp = chompRight(str, i, "[?*", "]?*", "[?*", "]?*", ">");
      console.log(`730 ${`\u001b[${31}m${`██`}\u001b[${39}m`} temp = ${temp}`);

      if (
        // ].]>
        (str[i] === "]" &&
          str[i + 1] &&
          str[i + 1].trim().length &&
          !`>]`.includes(str[i + 1]) &&
          str[i + 2] === "]" &&
          str[i + 3] === ">") ||
        // ]].>
        (str[i] === "]" &&
          str[i + 1] === "]" &&
          str[i + 2] &&
          str[i + 2].trim().length &&
          !`>]`.includes(str[i + 2]) &&
          str[i + 3] === ">")
      ) {
        console.log(
          `749 OLD ${`\u001b[${33}m${`temp`}\u001b[${39}m`} was ${temp}, becomes ${Math.min(
            temp || i + 4,
            i + 4
          )}`
        );
        temp = Math.max(temp || i + 4, i + 4);
      } else if (
        // ].>
        str[i] === "]" &&
        str[i + 1] &&
        str[i + 1].trim().length &&
        !`>]`.includes(str[i + 1]) &&
        str[i + 2] === ">"
      ) {
        console.log(
          `764 OLD ${`\u001b[${33}m${`temp`}\u001b[${39}m`} was ${temp}, becomes ${Math.min(
            temp || i + 3,
            i + 3
          )}`
        );
        temp = Math.max(temp || i + 3, i + 3);
      }

      if (temp) {
        if (str.slice(i, temp) !== "]]>") {
          submit({
            name: "bad-cdata-tag-malformed",
            position: [[i, temp, "]]>"]]
          });
          console.log(
            `779 ${log(
              "push",
              "bad-cdata-tag-malformed",
              `${`[[${i}, ${temp}, "]]>"]]`}`
            )}`
          );
        }
        doNothingUntil = i + 3;
        console.log(`787 ${log("set", "doNothingUntil", doNothingUntil)}`);
      }
    }

    // catch a state of being within quotes
    // if it's JS code, consider the JS escape slashes might be present and
    // render potential closing quote useless. Luckily, we have the
    // "doNothingUntilReason" state which identifies state of being within
    // <script> tag.
    if (
      doNothingUntil === null ||
      ((doNothingUntil !== null && doNothingUntilReason !== "script tag") ||
        (doNothingUntilReason === "script tag" &&
          (str[i - 1] !== "\\" || str[i - 2] === "\\")))
    ) {
      if (withinQuotes === null && `"'\``.includes(str[i])) {
        // ps. we don't use charIsQuote() because it's too wide and includes too
        // much, all curlies as well.
        withinQuotes = i;
        console.log(`806 ${log("set", "withinQuotes", withinQuotes)}`);
      } else if (
        withinQuotes !== null &&
        str[withinQuotes] === str[i] &&
        (!withinQuotesEndAt || withinQuotesEndAt === i)
      ) {
        console.log(`812 withinQuotes was ${withinQuotes}, resetting to null`);
        withinQuotes = null;
        withinQuotesEndAt = null;
        console.log(`815 ${log("set", "withinQuotes", withinQuotes)}`);
      }
    }

    if (withinQuotesEndAt && withinQuotesEndAt === i) {
      withinQuotes = null;
      withinQuotesEndAt = null;
      console.log(
        `823 ${log(
          "reset",
          "withinQuotes",
          withinQuotes,
          "withinQuotesEndAt",
          withinQuotesEndAt
        )}`
      );
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE MIDDLE
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // in heuristical ESP tag recognition cases, catch the closing of tails,
    // for example, if ESP tag was %%- ... -%% then we'd catch the -%% part here
    if (
      doNothingUntil &&
      doNothingUntilReason === "esp" &&
      logEspTag.tailStartAt &&
      logEspTag.tailEndAt === null &&
      !espChars.includes(str[i + 1])
    ) {
      // ESP tag tail closing can be a single character, for example eDialog
      // closing tails were single underscore.
      console.log(
        `865 ${`\u001b[${90}m${`within tail closing clauses`}\u001b[${39}m`}`
      );
      doNothingUntil = i + 1;
    }

    // catch the opening of an ESP templating language tails
    // for example, {% if count > 0 %} was heads and its tails would be:
    // {% endif %}. Now tails has its opening {% and closing %}.
    // Here we catch the tails opening, for example "{%" of tails {% endif %}
    if (
      doNothingUntil &&
      doNothingUntilReason === "esp" &&
      logEspTag.headVal &&
      logEspTag.tailStartAt === null
    ) {
      console.log(
        `881 ${`\u001b[${90}m${`within ESP tag tail opening clauses`}\u001b[${39}m`}`
      );
      let temp1;
      if (
        logEspTag.recognised &&
        arrayiffy(knownESPTags[logEspTag.headVal].sibling).some(closingVal => {
          if (rightSeq(str, i, ...closingVal.split(""))) {
            temp1 = closingVal;
            return true;
          }
        })
      ) {
        console.log(`893 recognised tail openings`);
        // right() will take first non-whitespace character on the right.
        // rightSeq() takes sequence of arguments to match, in that order, so
        // we get heads sibling, tails (knownESPTags[logEspTag.headVal].sibling)
        // then we split it into characters (the .split("") part) and feed it into
        // rightSeq().
        const tempEnd = rightSeq(str, i, ...temp1.split(""));
        logEspTag.tailStartAt = tempEnd.leftmostChar;
        logEspTag.tailEndAt = tempEnd.rightmostChar + 1;
        logEspTag.tailVal = str.slice(
          logEspTag.tailStartAt,
          logEspTag.tailEndAt
        );
        logEspTag.endAt = logEspTag.tailEndAt;
        doNothingUntil = logEspTag.endAt;
        console.log(
          `909 ${log(
            "SET",
            "logEspTag.tailStartAt",
            logEspTag.tailStartAt,
            "logEspTag.tailEndAt",
            logEspTag.tailEndAt,
            "logEspTag.tailVal",
            logEspTag.tailVal,
            "logEspTag.endAt",
            logEspTag.endAt,
            "doNothingUntil",
            doNothingUntil
          )}`
        );

        pingEspTag(logEspTag);

        resetEspTag();
        // } else if (!logEspTag.recognised && espChars.includes(str[i])) {
      } else if (flip(logEspTag.headVal).includes(str[i])) {
        console.log(`929 unrecognised tail openings`);
        // Cases of a single-character ESP closing tags. For example, eDialog
        // used single underscore.
        // Algorithm rules: one character will be accepted as closing, but
        // it must be present among characters in head or be flipped version of
        // it. For example, opening is: ${ and closing is: }
        // Or for example, opening: two underscores, closing - single underscore
        if (
          espChars.includes(str[right(str, i)]) ||
          logEspTag.headVal.includes(str[i]) ||
          flip(logEspTag.headVal).includes(str[i])
        ) {
          logEspTag.tailStartAt = i;
          console.log(
            `943 ${log("SET", "logEspTag.tailStartAt", logEspTag.tailStartAt)}`
          );
        } else {
          console.log(
            `${`\u001b[${33}m${`logEspTag.headVal`}\u001b[${39}m`} = ${JSON.stringify(
              logEspTag.headVal,
              null,
              4
            )}`
          );
          console.log(
            `logEspTag.headVal.includes(${
              str[i]
            }) = ${logEspTag.headVal.includes(str[i])}`
          );
        }
      }
    }

    // catch the closing of an ESP templating language heads
    // for example, "}}" of a pair {{ ... }} or a pair "-%}" of {%- ... -%} or
    // closing "%%" of a pair %%...%% and so on.
    if (
      logEspTag.headStartAt !== null &&
      logEspTag.headEndAt === null &&
      i > logEspTag.headStartAt &&
      (str[i + 1] &&
        (!str[i + 1].trim().length || !espChars.includes(str[i + 1])))
    ) {
      // In very rare scenario, we might think we have heads but it's tails.
      // In such case, freak out.
      if (
        !logEspTag.recognised ||
        knownESPTags[logEspTag.headVal].type === "opening"
      ) {
        if (str.slice(logEspTag.headStartAt, i + 1) !== "--") {
          // all good.
          // finish the marker:
          logEspTag.headEndAt = i + 1;
          logEspTag.headVal = str.slice(logEspTag.headStartAt, i + 1);
          // let's check the known ESP tag database:
          logEspTag.recognised = knownESPTags.hasOwnProperty(logEspTag.headVal);
          console.log(
            `986 ${log(
              "SET",
              "logEspTag.headEndAt",
              logEspTag.headEndAt,
              "logEspTag.headVal",
              logEspTag.headVal,
              "logEspTag.recognised",
              logEspTag.recognised
            )}`
          );
        }
      } else {
        // freak out!
        // TODO
      }
    }

    // catch the opening of an ESP templating language heads
    // for example, "{{" of a pair {{ ... }} or a pair "{%-" of {%- ... -%} or
    // "%%" of a pair %%...%% and so on.
    if (
      logEspTag.startAt === null &&
      logEspTag.headStartAt === null &&
      espChars.includes(str[i]) &&
      str[i + 1] &&
      !leftSeq(str, i, "<", "!") &&
      (!doNothingUntil || doNothingUntil === true)
    ) {
      // above, precaution against non-boolean "doNothingUntil" - when it's
      // numeric, it means we know precisely when to stop. It happens only
      // when esp tag has been reset.
      //
      // tag-based templating languages like Jinja:
      if (espChars.includes(str[i + 1])) {
        logEspTag.headStartAt = i;
        logEspTag.startAt = i;
        logEspTag.type = "tag-based";
        console.log(
          `1024 ${log(
            "SET",
            "logEspTag.headStartAt",
            logEspTag.headStartAt,
            "logEspTag.startAt",
            logEspTag.startAt
          )}`
        );
      } else if (
        espCharsFunc.includes(str[i]) &&
        isLowerCaseLetter(str[i + 1])
      ) {
        // function-based ESP templating language, like Responsys Interact.
        // Pattern is sequence of at least one opening special character,
        // followed by a-z lowercase latin letter.
        logEspTag.headStartAt = i;
        logEspTag.startAt = i;
        logEspTag.headEndAt = i + 1;
        logEspTag.headVal = str[i];
        logEspTag.type = "function-based";
        logEspTag.recognised = knownESPTags.hasOwnProperty(str[i]);
        console.log(
          `1046 ${log(
            "SET",
            "logEspTag.headStartAt",
            logEspTag.headStartAt,
            "logEspTag.headEndAt",
            logEspTag.headEndAt,
            "logEspTag.startAt",
            logEspTag.startAt,
            "logEspTag.headVal",
            logEspTag.headVal,
            "logEspTag.recognised",
            logEspTag.recognised
          )}`
        );
      }

      // if ESP tag head was captured, tackle any excessive whitespace in
      // front of it:
      if (
        logEspTag.headStartAt !== null &&
        logWhitespace.startAt !== null &&
        logWhitespace.startAt < i - 1 &&
        !logWhitespace.includesLinebreaks
      ) {
        submit({
          name: "tag-excessive-whitespace-inside-tag",
          position: [[logWhitespace.startAt + 1, i]]
        });
        console.log(
          `1075 ${log(
            "push",
            "tag-excessive-whitespace-inside-tag",
            `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
          )}`
        );
      }
    }

    // catch the tag attributes
    if (!doNothingUntil && logTag.tagNameEndAt !== null) {
      //               S
      //               S
      //               S
      //   logging tag attrs - START
      //               S
      //               S
      //               S
      //

      console.log(
        `1096 ${`\u001b[${90}m${`above catching the ending of an attribute's name`}\u001b[${39}m`}`
      );
      // 1. catch the ending of an attribute's name
      if (
        logAttr.attrNameStartAt !== null &&
        logAttr.attrNameEndAt === null &&
        logAttr.attrName === null &&
        !util.isLatinLetter(str[i]) &&
        (str[i] !== ":" || !util.isLatinLetter(str[i + 1]))
      ) {
        logAttr.attrNameEndAt = i;
        logAttr.attrName = str.slice(
          logAttr.attrNameStartAt,
          logAttr.attrNameEndAt
        );
        console.log(
          `1112 ${log(
            "SET",
            "logAttr.attrNameEndAt",
            logAttr.attrNameEndAt,
            "logAttr.attrName",
            logAttr.attrName
          )}`
        );

        // if attribute ended on a character, different from "equal" and there
        // is no "equal" character to the right, terminate this attribute right
        // here. There can be attributes without values, for example, "nowrap".
        if (str[i] !== "=") {
          if (str[right(str, i)] === "=") {
            // TODO - there's equal to the right
            console.log("1127 equal to the right though");
          } else {
            // TODO - there's not equal to the right
            console.log("1130 not equal, so terminate attr");
          }
        }
      }

      console.log(
        `1136 ${`\u001b[${90}m${`above catching what follows the attribute's name`}\u001b[${39}m`}`
      );
      // 2. catch what follows the attribute's name
      if (
        logAttr.attrNameEndAt !== null &&
        logAttr.attrEqualAt === null &&
        i >= logAttr.attrNameEndAt &&
        str[i].trim().length
      ) {
        let temp;
        if (str[i] === "'" || str[i] === '"') {
          temp = attributeOnTheRight(str, i);
        }
        console.log(
          `1150 ${`\u001b[${90}m${`inside catch what follows the attribute's name`}\u001b[${39}m`}`
        );
        if (str[i] === "=") {
          logAttr.attrEqualAt = i;
          console.log(
            `1155 ${log("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );

          // If there's whitespace on the right, especially where the first
          // character after that whitespace is not single or double quote,
          // check, either it's an attribute without a value and quotes (only
          // with equal character) or unquoted attribute.
          // The standard flow will traverse that whitespace, wipe it and insert
          // the double quotes. We need to cover case of error
          // "tag-attribute-quote-and-onwards-missing"

          if (str[i + 1]) {
            const nextCharOnTheRightAt = right(str, i);

            // 1. repeated equal character cases - chomp them all

            if (str[nextCharOnTheRightAt] === "=") {
              // repeated equal character after the attribute
              // error "tag-attribute-repeated-equal"
              console.log(`1174 REPEATED EQUAL DETECTED`);
              // console.log(`1175 RESET logWhitespace`);
              // resetLogWhitespace();
              let nextEqualStartAt = i + 1;
              let nextEqualEndAt = nextCharOnTheRightAt + 1;

              // set "doNothingUntil" to skip processing of already
              // processed equal(s)
              doNothingUntil = nextEqualEndAt;
              doNothingUntilReason = "repeated equals";
              console.log(
                `1185 ${log("set", "doNothingUntil", doNothingUntil)}`
              );

              console.log(
                `1189 SET ${`\u001b[${36}m${`nextEqualStartAt = "${nextEqualStartAt}"; nextEqualEndAt = "${nextEqualEndAt};"`}\u001b[${39}m`}`
              );
              while (nextEqualStartAt && nextEqualEndAt) {
                console.log(`       ${`\u001b[${35}m${`*`}\u001b[${39}m`}`);
                submit({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                console.log(
                  `1198 ${log(
                    "push",
                    "tag-attribute-repeated-equal",
                    `${`[[${nextEqualStartAt}, ${nextEqualEndAt}]]`}`
                  )}`
                );
                // look what's next
                const temp = right(str, nextEqualEndAt - 1);
                console.log(`1206 ${log("set", "temp", temp)}`);
                if (str[temp] === "=") {
                  console.log(
                    `1209 ${`\u001b[${36}m${`yes, there's "=" on the right`}\u001b[${39}m`}`
                  );
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = temp + 1;
                  console.log(
                    `1214 SET ${`\u001b[${36}m${`nextEqualStartAt = "${nextEqualStartAt}"; nextEqualEndAt = "${nextEqualEndAt};"`}\u001b[${39}m`}`
                  );

                  // set "doNothingUntil" to skip processing of already
                  // processed equal(s)
                  doNothingUntil = nextEqualEndAt;
                  doNothingUntilReason = "already processed equals";
                  console.log(
                    `1222 ${log("set", "doNothingUntil", doNothingUntil)}`
                  );
                } else {
                  nextEqualStartAt = null;
                  console.log(
                    `1227 ${log("set", "nextEqualStartAt", nextEqualStartAt)}`
                  );
                }
              }
              console.log(`       ${`\u001b[${35}m${`*`}\u001b[${39}m`}`);
            }
          }
        } else if (temp) {
          console.log(
            `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ENDED ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
          );
          console.log(
            "1239 quoted attribute's value on the right, equal is indeed missing"
          );
          // 1. push the issue:
          submit({
            name: "tag-attribute-missing-equal",
            position: [[i, i, "="]]
          });
          console.log(
            `1247 ${log(
              "push",
              "tag-attribute-missing-equal",
              `${`[[${i}, ${i}, "="]]`}`
            )}`
          );
          // 2. complete the marker records:
          logAttr.attrEqualAt = i;
          console.log(
            `1256 ${log("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );
          // 3. we need to mark where value starts too:
          logAttr.attrValueStartAt = i + 1;
          console.log(
            `1261 ${log(
              "SET",
              "logAttr.attrValueStartAt",
              logAttr.attrValueStartAt
            )}`
          );
          // 4. ... and ends...
          logAttr.attrValueEndAt = temp;
          console.log(
            `1270 ${log(
              "SET",
              "logAttr.attrValueEndAt",
              logAttr.attrValueEndAt
            )}`
          );
          // 4. and quotes themselves:
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = str[i];
          logAttr.attrClosingQuote.pos = temp;
          logAttr.attrClosingQuote.val = str[temp];
          console.log(
            `1282 ${log(
              "SET",
              "logAttr.attrOpeningQuote",
              logAttr.attrOpeningQuote,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          // 5. and attr value:
          logAttr.attrValue = str.slice(i + 1, temp);
          console.log(
            `1293 ${log("SET", "logAttr.attrValue", logAttr.attrValue)}`
          );
        } else {
          console.log(
            `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ENDED ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
          );
          // so if it's not equal and the code is not messed up, we have an attribute without a value,
          // for example, <td nowrap>.
          // Fine, push it to logTag, reset logAttr markers.

          // 1. push
          logTag.attributes.push(clone(logAttr));
          console.log(`1305 ${log("PUSH, then RESET", "logAttr")}`);

          // 2. reset:
          resetLogAttr();
        }

        if (logWhitespace.startAt !== null) {
          // it depends, is it equal (value might follow), or is it a letter,
          // in which case, it's an attribute without a value:
          if (str[i] === "=") {
            submit({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, i]]
            });
            console.log(
              `1320 ${log(
                "push",
                "tag-attribute-space-between-name-and-equals",
                `${`[[${logWhitespace.startAt}, ${i}]]`}`
              )}`
            );
            // reset the whitespace because repetitive equal catches might
            // skip many indexes and activate "doNothingUntil" and the whitespace
            // turn off catches might get skipped otherwise
            resetLogWhitespace();
          } else if (util.isLatinLetter(str[i])) {
            // it seems like a start of a new attribute. Push existing and reset
            logTag.attributes.push(clone(logAttr));
            console.log(`1333 ${log("PUSH, then RESET", "logAttr")}`);

            // then, reset:
            resetLogAttr();

            // also, maybe there was an excessive whitespace?
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < i) {
                  // retain that space, push the rest of the chunk
                  submit({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, i]]
                  });
                  console.log(
                    `1348 ${log(
                      "push",
                      "tag-excessive-whitespace-inside-tag",
                      `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
                    )}`
                  );
                }
                console.log("1355 dead end of excessive whitespace check");
              } else {
                // replace whole chunk with a single space
                submit({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, i, " "]]
                });
                console.log(
                  `1363 ${log(
                    "push",
                    "tag-excessive-whitespace-inside-tag",
                    `${`[[${logWhitespace.startAt}, ${i}, " "]]`}`
                  )}`
                );
              }
            }
          } else {
            // TODO - maybe it's some quote?
          }
        }
      }

      console.log(
        `1378 ${`\u001b[${90}m${`above catching the begining of an attribute's name`}\u001b[${39}m`}`
      );
      // 3. catch the begining of an attribute's name
      if (logAttr.attrStartAt === null && util.isLatinLetter(str[i])) {
        console.log(
          `1383 ${`\u001b[${90}m${`inside catching the begining of an attribute's name`}\u001b[${39}m`}`
        );
        logAttr.attrStartAt = i;
        logAttr.attrNameStartAt = i;
        console.log(
          `1388 ${log(
            "SET",
            "logAttr.attrStartAt",
            logAttr.attrStartAt,
            "logAttr.attrNameStartAt",
            logAttr.attrNameStartAt
          )}`
        );
        if (logWhitespace.startAt !== null && logWhitespace.startAt < i - 1) {
          // it depends, can we reuse the space at position str[logWhitespace.startAt],
          // that is, the first whitespace character of this chunk.
          // - If it's a space, keep it, just delete the rest of the chunk of
          // the characters
          // - If it's not a space, replace whole whitespace chunk with a single
          // space character.
          if (str[logWhitespace.startAt] === " ") {
            // keep first whitespace chunk's character, existing space
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, i]]
            });
            console.log(
              `1410 ${log(
                "push",
                "tag-excessive-whitespace-inside-tag",
                `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
              )}`
            );
          } else {
            // replace whole whitespace chunk with a single space
            submit({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, i, " "]]
            });
            console.log(
              `1423 ${log(
                "push",
                "tag-excessive-whitespace-inside-tag",
                `${`[[${logWhitespace.startAt}, ${i}, " "]]`}`
              )}`
            );
          }
        }

        // also, check what's on the left
        if (str[i - 1]) {
          if (charIsQuote(str[i - 1])) {
            // traverse backwards and chomp all quotes
            for (let y = i - 1; y--; ) {
              if (!charIsQuote(str[y])) {
                if (!str[y].trim().length) {
                  submit({
                    name: "tag-stray-character",
                    position: [[y + 1, i]]
                  });
                  console.log(
                    `1444 ${log(
                      "push",
                      "tag-stray-character",
                      `${JSON.stringify([[y + 1, i]], null, 0)}`
                    )}`
                  );
                }
                break;
              }
            }
          }
        }
      }

      console.log(
        `1459 ${`\u001b[${90}m${`above catching what follows attribute's equal`}\u001b[${39}m`}`
      );
      // 4. catch what follows attribute's equal
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos === null
      ) {
        console.log(
          `1467 ${`\u001b[${90}m${`inside catching what follows attribute's equal`}\u001b[${39}m`}`
        );
        if (logAttr.attrEqualAt < i && str[i].trim().length) {
          console.log("1470 catching what follows equal");
          if (charcode === 34 || charcode === 39) {
            // it's single or double quote

            // tackle preceding whitespace, if any:
            if (logWhitespace.startAt && logWhitespace.startAt < i) {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
              console.log(
                `1481 ${log(
                  "push",
                  "tag-attribute-space-between-equals-and-opening-quotes",
                  `${JSON.stringify([[logWhitespace.startAt, i]], null, 0)}`
                )}`
              );
            }
            resetLogWhitespace();

            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = str[i];

            const closingQuotePeek = findClosingQuote(str, i);
            console.log(
              `1495 ${log("set", "closingQuotePeek", closingQuotePeek)}`
            );
            // if we found closing quote, set it right away:
            if (closingQuotePeek) {
              // now it might be a position of non-existing closing quote, the
              // position of where the closing SHOULD BE, but not necessarily
              // where it IS.

              // we match opening quotes (we know) with character of peeked result
              if (str[closingQuotePeek] !== str[i]) {
                // maybe it's ismatching quote?
                if (
                  str[closingQuotePeek] === "'" ||
                  str[closingQuotePeek] === '"'
                ) {
                  const isDouble = str[closingQuotePeek] === '"';
                  // yes it is a mismatching quote
                  const name = `tag-attribute-mismatching-quotes-is-${
                    isDouble ? "double" : "single"
                  }`;
                  submit({
                    name: name,
                    position: [
                      [
                        closingQuotePeek,
                        closingQuotePeek + 1,
                        `${isDouble ? "'" : '"'}`
                      ]
                    ]
                  });
                  console.log(
                    `1526 ${log(
                      "push",
                      name,
                      `${`[[${closingQuotePeek}, ${closingQuotePeek + 1}, ${
                        isDouble ? "'" : '"'
                      }]]`}`
                    )}`
                  );
                } else {
                  // it's out of whack, some bracket or whatever.
                  // now if there is no quote at that position (closingQuotePeek),
                  // raise an issue as well:

                  const compensation = "";
                  // if (
                  //   str[closingQuotePeek - 1] &&
                  //   str[closingQuotePeek] &&
                  //   str[closingQuotePeek - 1].trim().length &&
                  //   str[closingQuotePeek].trim().length &&
                  //   str[closingQuotePeek] !== "/" &&
                  //   str[closingQuotePeek] !== ">"
                  // ) {
                  //   compensation = " ";
                  // }
                  // there are considerations about where exactly to insert the bracket:
                  // * whitespace
                  // * existing closing slashes

                  let fromPositionToInsertAt = str[closingQuotePeek - 1].trim()
                    .length
                    ? closingQuotePeek
                    : left(str, closingQuotePeek) + 1;
                  console.log(
                    `1559 ${log(
                      "set",
                      "fromPositionToInsertAt",
                      fromPositionToInsertAt
                    )}`
                  );
                  let toPositionToInsertAt = closingQuotePeek;
                  console.log(
                    `1567 ${log(
                      "set",
                      "toPositionToInsertAt",
                      toPositionToInsertAt
                    )}`
                  );

                  if (str[left(str, closingQuotePeek)] === "/") {
                    console.log("1575 SLASH ON THE LEFT");
                    toPositionToInsertAt = left(str, closingQuotePeek);
                    // if there's a gap between slash and closing bracket, tackle it
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      submit({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                      console.log(
                        `1584 ${log(
                          "push",
                          "tag-whitespace-closing-slash-and-bracket",
                          `${`[[${toPositionToInsertAt +
                            1}, ${closingQuotePeek}]]`}`
                        )}`
                      );
                    }

                    // move on
                    fromPositionToInsertAt =
                      left(str, toPositionToInsertAt) + 1;
                    console.log(
                      `1597 ${log(
                        "set",
                        "toPositionToInsertAt",
                        toPositionToInsertAt,
                        "fromPositionToInsertAt",
                        fromPositionToInsertAt
                      )}`
                    );
                  }

                  submit({
                    name: "tag-attribute-closing-quotation-mark-missing",
                    position: [
                      [
                        fromPositionToInsertAt,
                        toPositionToInsertAt,
                        `${str[i]}${compensation}`
                      ]
                    ]
                  });
                  console.log(
                    `1618 ${log(
                      "push",
                      "tag-attribute-closing-quotation-mark-missing",
                      `${`[[${closingQuotePeek}, ${closingQuotePeek}, ${`${
                        str[i]
                      }${compensation}`}]]`}`
                    )}`
                  );
                }
              }
              // either way,
              logAttr.attrClosingQuote.pos = closingQuotePeek;
              logAttr.attrClosingQuote.val = str[i];
              logAttr.attrValue = str.slice(i + 1, closingQuotePeek);
              logAttr.attrValueStartAt = i + 1;
              logAttr.attrValueEndAt = closingQuotePeek;
              logAttr.attrEndAt = closingQuotePeek;
              console.log(
                `1636 ${log(
                  "set",
                  "logAttr.attrClosingQuote",
                  logAttr.attrClosingQuote,
                  "logAttr.attrValue",
                  logAttr.attrValue,
                  "logAttr.attrValueStartAt",
                  logAttr.attrValueStartAt,
                  "logAttr.attrValueEndAt",
                  logAttr.attrValueEndAt,
                  "logAttr.attrEndAt",
                  logAttr.attrEndAt
                )}`
              );

              // tackle any unencoded characters within attribute's value.
              // mind you, we are going to skip all those characters, so they
              // won't get processed within the general rules

              // since we know the range of indexes where the attribute's value
              // is, iterate it again, looking for unencoded characters:
              for (let y = i + 1; y < closingQuotePeek; y++) {
                const newIssue = encodeChar(str, y);
                if (newIssue) {
                  tagIssueStaging.push(newIssue);
                  console.log(
                    `1662 ${log("push tagIssueStaging", "newIssue", newIssue)}`
                  );
                }
              }

              // check, have any raw unencoded characters been gathered in raw
              // staging so far
              if (rawIssueStaging.length) {
                console.log(
                  `1671 ${`\u001b[${31}m${`██`}\u001b[${39}m`} raw stage present: ${JSON.stringify(
                    rawIssueStaging,
                    null,
                    4
                  )}`
                );
              }

              // maybe there's no whitespace in front of this attribute,
              // also consider it might be already tackled stray quotes, for
              // example, <a "bcd="ef"/>
              //             ^
              //            these
              if (
                logAttr.attrNameStartAt &&
                str[logAttr.attrNameStartAt - 1].trim().length &&
                (!opts.rules || opts.rules["tag-stray-character"] !== false) &&
                !retObj.issues.some(issueObj => {
                  return (
                    (issueObj.name === "tag-stray-quotes" ||
                      issueObj.name === "tag-stray-character") &&
                    issueObj.position[0][1] === logAttr.attrNameStartAt
                  );
                })
              ) {
                // insert space here:
                submit({
                  name: "tag-missing-space-before-attribute",
                  position: [
                    [logAttr.attrNameStartAt, logAttr.attrNameStartAt, " "]
                  ]
                });
                console.log(
                  `1704 ${log(
                    "push",
                    "tag-missing-space-before-attribute",
                    `${`[[${logAttr.attrNameStartAt}, ${
                      logAttr.attrNameStartAt
                    }, " "]]`}`
                  )}`
                );
              }

              // then, push the attribute and wipe the markers because we're done
              logTag.attributes.push(clone(logAttr));
              console.log(`1716 ${log("PUSH, then RESET", "logAttr")}`);

              // finally, offset the index:
              // normally, we'd "jump over" to index at "closingQuotePeek", but
              // maybe it's whitespace? In that case, pull back to the last non-
              // whitespace character, so that whitespace can be caught properly.
              if (str[closingQuotePeek].trim().length) {
                doNothingUntil =
                  closingQuotePeek -
                  (charIsQuote(str[closingQuotePeek]) ? 0 : 1) +
                  1;
                // i =
                //   closingQuotePeek -
                //   (charIsQuote(str[closingQuotePeek]) ? 0 : 1);
                // console.log(`1730 ${log("set", "i", i)}`);
              } else {
                // pull back to nearest non-whitespace char
                doNothingUntil = left(str, closingQuotePeek) + 1;
                // i = left(str, closingQuotePeek);
                // console.log(`1735 ${log("set", "i", i)}`);
              }
              doNothingUntilReason = "closing quote looked up";
              if (withinQuotes !== null) {
                withinQuotesEndAt = logAttr.attrClosingQuote.pos;
              }
              console.log(
                `1742 ${log(
                  "set",
                  "doNothingUntil",
                  doNothingUntil,
                  "withinQuotesEndAt",
                  withinQuotesEndAt
                )}`
              );

              // then, reset:
              resetLogAttr();

              // maybe we offset right up to the end of a string.
              if (
                i === len - 1 &&
                logTag.tagStartAt !== null &&
                ((logAttr.attrEqualAt !== null &&
                  logAttr.attrOpeningQuote.pos !== null) ||
                  logTag.attributes.some(
                    attrObj =>
                      attrObj.attrEqualAt !== null &&
                      attrObj.attrOpeningQuote.pos !== null
                  ))
              ) {
                // inset closing bracket
                submit({
                  name: "tag-missing-closing-bracket",
                  position: [[i + 1, i + 1, ">"]]
                });
                console.log(
                  `1772 ${log(
                    "push",
                    "tag-missing-closing-bracket",
                    `${`[[${i + 1}, ${i + 1}, ">"]]`}`
                  )}`
                );
              }

              console.log(`1780 ${log("continue")}`);
              continue;
            }
          } else if (charcode === 8220 || charcode === 8221) {
            // left-double-quotation-mark
            // http://www.fileformat.info/info/unicode/char/201C/index.htm
            // right-double-quotation-mark
            // https://www.fileformat.info/info/unicode/char/201d/index.htm
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `"`;
            console.log(
              `1791 ${log(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote
              )}`
            );

            // it's an error, so push right away:
            const name =
              charcode === 8220
                ? "tag-attribute-left-double-quotation-mark"
                : "tag-attribute-right-double-quotation-mark";
            submit({
              name,
              position: [[i, i + 1, `"`]]
            });
            console.log(
              `1808 ${log("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
            );

            logAttr.attrValueStartAt = i + 1;
            console.log(
              `1813 ${log(
                "set",
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );

            // don't forget the withinQuotes flag:
            withinQuotes = i;
            console.log(`1822 ${log("set", "withinQuotes", withinQuotes)}`);
          } else if (charcode === 8216 || charcode === 8217) {
            // left-single-quotation-mark
            // https://www.fileformat.info/info/unicode/char/2018/index.htm
            // right-single-quotation-mark
            // https://www.fileformat.info/info/unicode/char/2019/index.htm
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `'`;
            console.log(
              `1831 ${log(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote
              )}`
            );

            // it's an error, so push right away:
            const name =
              charcode === 8216
                ? "tag-attribute-left-single-quotation-mark"
                : "tag-attribute-right-single-quotation-mark";
            submit({
              name,
              position: [[i, i + 1, `'`]]
            });
            console.log(
              `1848 ${log("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
            );

            logAttr.attrValueStartAt = i + 1;
            console.log(
              `1853 ${log(
                "set",
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );

            // don't forget the withinQuotes flag:
            withinQuotes = i;
            console.log(`1862 ${log("set", "withinQuotes", withinQuotes)}`);
          } else if (!withinTagInnerspace(str, i)) {
            console.log(
              `1865 \u001b[${33}m${`██`}\u001b[${39}m - withinTagInnerspace() ${`\u001b[${32}m${`false`}\u001b[${39}m`}`
            );
            // insert missing opening quote here, right at this index,
            // which means, to the left of this character

            const closingQuotePeek = findClosingQuote(str, i);
            console.log(`1871 ███████████████████████████████████████`);
            console.log(
              `1873 ${log("set", "closingQuotePeek", closingQuotePeek)}`
            );

            const quoteValToPut = charIsQuote(str[closingQuotePeek])
              ? str[closingQuotePeek]
              : `"`;

            // 1. push the issue:
            submit({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[left(str, i) + 1, i, quoteValToPut]]
            });
            console.log(
              `1886 ${log(
                "push",
                "tag-attribute-opening-quotation-mark-missing",
                `${`[[${left(str, i) + 1}, ${i}, ${quoteValToPut}]]`}`
              )}`
            );

            // 2. set markers:
            logAttr.attrOpeningQuote = {
              pos: i,
              val: quoteValToPut
            };
            logAttr.attrValueStartAt = i;
            console.log(
              `1900 mark opening quote: ${log(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote,
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );
            // don't forget the withinQuotes flag:
            withinQuotes = i;
            console.log(`1910 ${log("set", "withinQuotes", withinQuotes)}`);

            // 3. check the closing quotes
            // traverse forward until the first equal or closing bracket or
            // closing quotes, whichever comes first.
            console.log("1915 traverse forward\n\n\n");
            let closingBracketIsAt = null;

            // We'll traverse forward to find the index of the last character
            // within the particular tag.
            // For example,
            // <a bcd= ef=gh > ij>
            // We start at "g", index 11.
            // False alert is ">" at index 14 because to the right of it we
            // spot another bracket, not preceded with "wrong" characters.
            // We end up with result 18, ">" at that index is the true end of
            // the tag we're currently in.

            // Tag's contents might end at closing bracket or closing slash.
            // In either case, that last character's index will be marked as
            // the following, "innerTagEndsAt":
            let innerTagEndsAt = null;

            // Algorithm-wise, even if we spot the suspected ending closing
            // bracket, we must continue further, to ensure "greedy" traversal,
            // We must capture as much code as possible because unencoded
            // brackets are expected to be among attribute values.
            // For example, famous button label "Click here >" can be put into
            // "alt" attribute with unencoded bracket, that's common.

            for (let y = i; y < len; y++) {
              console.log(
                `1942 \u001b[${36}m${`str[${y}] = "${str[y]}"`}\u001b[${39}m`
              );
              if (
                str[y] === ">" &&
                ((str[left(str, y)] !== "/" && withinTagInnerspace(str, y)) ||
                  str[left(str, y)] === "/")
              ) {
                const leftAt = left(str, y);
                closingBracketIsAt = y;
                console.log(
                  `1952 ${log(
                    "set",
                    "leftAt",
                    leftAt,
                    "closingBracketIsAt",
                    closingBracketIsAt
                  )}`
                );
                innerTagEndsAt = y; // default, case when there's no slash
                if (str[leftAt] === "/") {
                  innerTagEndsAt = leftAt;
                  console.log(
                    `1964 ${log("set", "innerTagEndsAt", innerTagEndsAt)}`
                  );
                }
                // break; - don't break, move on, to ensure "greedy" capture
              }

              const dealBrakerCharacters = `=<`;
              if (
                innerTagEndsAt !== null &&
                dealBrakerCharacters.includes(str[y])
              ) {
                console.log(
                  `1976 \u001b[${36}m${`break ("${
                    str[y]
                  }" is a bad character)`}\u001b[${39}m`
                );
                break;
              }
            }
            console.log(
              `1984 ${log(
                "set",
                "closingBracketIsAt",
                closingBracketIsAt,
                "innerTagEndsAt",
                innerTagEndsAt
              )}`
            );

            let innerTagContents;
            if (i < innerTagEndsAt) {
              innerTagContents = str.slice(i, innerTagEndsAt);
            } else {
              innerTagContents = "";
            }
            console.log(
              `2000 ${log("set", "innerTagContents", innerTagContents)}`
            );

            let startingPoint = innerTagEndsAt;

            // in example below, attrNameStartsAt = 10, that's where "ghj"
            // name starts:
            let attributeOnTheRightBeginsAt;

            // We need to detect if closing quotes of this attribute are
            // missing. Algorithm will cover cases where closing quotes are
            // missing and closing of a tag follows. We just need to cover
            // cases where value-less attribute follows, where whole sentence
            // is unquoted and where there are multiple unquoted attributes.
            if (innerTagContents.includes("=")) {
              console.log(`2015 inner tag contents include an equal character`);
              // for example, we have:
              //
              // <a bcd=ef ghj=kl>
              //        ^ i=7
              //
              // innerTagContents: "ef ghj=kl"
              //
              // we need to get to the beginning of an attribute's name at
              // the end of this substring, index of "g".

              const temp1 = innerTagContents.split("=")[0];

              console.log(`2028 ${log("set", "temp1", temp1)}`);
              // if it has spaces, that last space is the separator boundary
              // between attributes.
              if (temp1.split("").some(char => !char.trim().length)) {
                console.log(
                  "2033 traverse backwards to find beginning of the attr on the right\n\n\n"
                );
                for (let z = i + temp1.length; z--; ) {
                  console.log(
                    `2037 \u001b[${35}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`
                  );
                  if (!str[z].trim().length) {
                    attributeOnTheRightBeginsAt = z + 1;
                    console.log(
                      `2042 ${log(
                        "set",
                        "attributeOnTheRightBeginsAt",
                        attributeOnTheRightBeginsAt,
                        "then BREAK"
                      )}`
                    );
                    break;
                    // }
                  }
                  if (z === i) {
                    break;
                  }
                }
                console.log("\n\n\n");

                console.log(
                  `2059 ${log(
                    "log",
                    "attributeOnTheRightBeginsAt",
                    attributeOnTheRightBeginsAt
                  )}`
                );

                // if the character to the left of "attrNameStartsAt" is not
                // some quote, add one:
                const temp2 = left(str, attributeOnTheRightBeginsAt);
                if (!charIsQuote(temp2)) {
                  startingPoint = temp2 + 1;
                }
              }
            } else {
              console.log(
                `2075 inner tag contents don't include an equal character`
              );
            }

            let caughtAttrEnd = null;
            let caughtAttrStart = null;
            let finalClosingQuotesShouldBeAt = null;

            // When we match a boolean attribute, we set this flag. This way,
            // the next "caughtAttrStart" becomes the location of suspected
            // closing quotes. We move on, until there is no further offset
            // of "finalClosingQuotesShouldBeAt".
            let boolAttrFound = false;

            console.log("\n\n\n\n\n\n");
            console.log(
              `2091 ${`\u001b[${31}m${`TRAVERSE BACKWARDS`}\u001b[${39}m`}; startingPoint=${startingPoint}`
            );
            for (let z = startingPoint; z--; z > i) {
              // logging:
              console.log(
                `2096 ${`\u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`}`
              );
              // bail if equal is encountered
              if (str[z] === "=") {
                console.log(`2100 ${log("break")}`);
                break;
              }

              // catch attr ending:
              if (caughtAttrEnd === null && str[z].trim().length) {
                caughtAttrEnd = z + 1;
                console.log(
                  `2108 ${log("set", "caughtAttrEnd", caughtAttrEnd)}`
                );

                if (boolAttrFound) {
                  // 1. finalClosingQuotesShouldBeAt
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  console.log(
                    `2115 ${log(
                      "set",
                      "finalClosingQuotesShouldBeAt",
                      finalClosingQuotesShouldBeAt
                    )}`
                  );
                  // 2. reset
                  boolAttrFound = false;
                  console.log(
                    `2124 ${log("set", "boolAttrFound", boolAttrFound)}`
                  );
                }
              }
              // catch beginning of an attribute:
              if (!str[z].trim().length && caughtAttrEnd) {
                caughtAttrStart = z + 1;
                console.log(
                  `2132 ${`\u001b[${35}m${`ATTR`}\u001b[${39}m`}: ${str.slice(
                    caughtAttrStart,
                    caughtAttrEnd
                  )} (${caughtAttrStart}-${caughtAttrEnd})`
                );
                // check, is the attribute we carved among the known booleans
                if (str[right(str, caughtAttrEnd)] === "=") {
                  // if it has a value
                  // if what precedes doesn't end with a quote, add one.
                  // For example,
                  // <a bcd = ef ghi = jk lmn / >
                  // we traversed backwards from i=15 to i=11 (across "ghi")

                  const temp1 = left(str, caughtAttrStart);
                  if (!charIsQuote(str[temp1])) {
                    attributeOnTheRightBeginsAt = right(str, temp1 + 1);
                    console.log(
                      `2149 ${log(
                        "set",
                        "attributeOnTheRightBeginsAt",
                        attributeOnTheRightBeginsAt
                      )}`
                    );
                  }

                  break;
                } else {
                  // if it's boolean attribute,
                  if (
                    knownBooleanHTMLAttributes.includes(
                      str.slice(caughtAttrStart, caughtAttrEnd)
                    )
                  ) {
                    // yes it is known
                    boolAttrFound = true;
                    console.log(
                      `2168 ${log("set", "boolAttrFound", boolAttrFound)}`
                    );
                  } else {
                    // no it is not recognised
                    console.log(`2172 ${log("break")}`);
                    break;
                  }
                }

                // reset
                caughtAttrEnd = null;
                caughtAttrStart = null;
                console.log(
                  `2181 ${log(
                    "reset",
                    "caughtAttrEnd",
                    caughtAttrEnd,
                    "caughtAttrStart",
                    caughtAttrStart
                  )}`
                );
              }
            }
            console.log(
              `2192 ${`\u001b[${31}m${`TRAVERSE ENDED`}\u001b[${39}m`}`
            );

            // if the quote has been "pulled back", for example,
            // <a bcd=ef gh     nowrap     noresize    reversed   >
            // from innerTagEndsAt === 51 to finalClosingQuotesShouldBeAt === 12
            // set it there right away

            console.log(
              `2201 ${log(
                "log",
                "finalClosingQuotesShouldBeAt",
                finalClosingQuotesShouldBeAt,
                "attributeOnTheRightBeginsAt",
                attributeOnTheRightBeginsAt
              )}`
            );

            if (!finalClosingQuotesShouldBeAt && attributeOnTheRightBeginsAt) {
              finalClosingQuotesShouldBeAt =
                left(str, attributeOnTheRightBeginsAt) + 1;

              console.log(
                `2215 ${log(
                  "log",
                  "attributeOnTheRightBeginsAt",
                  attributeOnTheRightBeginsAt
                )}`
              );
              console.log(
                `2222 ${log(
                  "set",
                  "finalClosingQuotesShouldBeAt",
                  finalClosingQuotesShouldBeAt
                )}`
              );
            }

            console.log(
              `2231 ██ ${log(
                "log",
                "caughtAttrEnd",
                caughtAttrEnd,
                "left(str, caughtAttrEnd)",
                left(str, caughtAttrEnd)
              )}`
            );

            if (
              caughtAttrEnd &&
              logAttr.attrOpeningQuote &&
              !finalClosingQuotesShouldBeAt &&
              str[left(str, caughtAttrEnd)] !== logAttr.attrOpeningQuote.val
            ) {
              finalClosingQuotesShouldBeAt = caughtAttrEnd;
              console.log(
                `2248 ${log(
                  "set",
                  "finalClosingQuotesShouldBeAt",
                  finalClosingQuotesShouldBeAt
                )}`
              );
            }

            console.log(
              `2257 ${`\u001b[${32}m${`██`} \u001b[${39}m`} ${`\u001b[${33}m${`finalClosingQuotesShouldBeAt`}\u001b[${39}m`} = ${JSON.stringify(
                finalClosingQuotesShouldBeAt,
                null,
                4
              )}`
            );

            if (finalClosingQuotesShouldBeAt) {
              // 1. if closing quote is missing

              // 1.1. push the issue:
              submit({
                name: "tag-attribute-closing-quotation-mark-missing",
                position: [
                  [
                    finalClosingQuotesShouldBeAt,
                    finalClosingQuotesShouldBeAt,
                    logAttr.attrOpeningQuote.val
                  ]
                ]
              });
              console.log(
                `2279 ${log(
                  "push",
                  "tag-attribute-closing-quotation-mark-missing",
                  `${`[[${finalClosingQuotesShouldBeAt}, ${finalClosingQuotesShouldBeAt}, ${
                    logAttr.attrOpeningQuote.val
                  }]]`}`
                )}`
              );

              // 1.2. complete the attribute's record:
              logAttr.attrClosingQuote.pos = finalClosingQuotesShouldBeAt;
              logAttr.attrValueEndAt = finalClosingQuotesShouldBeAt;
              logAttr.attrEndAt = finalClosingQuotesShouldBeAt + 1;
            } else {
              // 2. if closing qoute is present:
              logAttr.attrClosingQuote.pos = left(str, caughtAttrEnd);
              logAttr.attrValueEndAt = logAttr.attrClosingQuote.pos;
              logAttr.attrEndAt = caughtAttrEnd;
            }

            // either way, rest are the same for both cases:
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            logAttr.attrValue = str.slice(
              logAttr.attrOpeningQuote.pos,
              logAttr.attrClosingQuote.pos
            );

            console.log(
              `2307 ${log(
                "set",
                "logAttr.attrClosingQuote.pos",
                logAttr.attrClosingQuote.pos,
                "logAttr.attrClosingQuote.val",
                logAttr.attrClosingQuote.val,
                "logAttr.attrValueEndAt",
                logAttr.attrValueEndAt,
                "logAttr.attrEndAt",
                logAttr.attrEndAt,
                "logAttr.attrValue",
                logAttr.attrValue
              )}`
            );

            // 3. encode attr value if necessary
            if (logAttr.attrValueStartAt < logAttr.attrValueEndAt) {
              for (
                let z = logAttr.attrValueStartAt;
                z < logAttr.attrValueEndAt;
                z++
              ) {
                console.log(
                  `2330 \u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`
                );
                const temp = encodeChar(str, z);
                if (temp) {
                  submit(temp);
                  console.log(
                    `2336 ${log("push", "unencoded character", temp)}`
                  );
                }
              }
            }

            // 4. we can't offset the for index "i" because of memory issues
            // but let's set "doNothingUntil"
            if (!doNothingUntil) {
              doNothingUntil = logAttr.attrClosingQuote.pos;
              doNothingUntilReason = "missing opening quotes";
              logWhitespace.startAt = null;
              console.log(
                `2349 ${log(
                  "set",
                  "doNothingUntil",
                  doNothingUntil,
                  "logWhitespace.startAt",
                  logWhitespace.startAt
                )}`
              );
            }

            // 5. since attribute record is complete, push it to logTag
            console.log(`2360 ${log("about to push", "logAttr", logAttr)}`);
            logTag.attributes.push(clone(logAttr));
            console.log(
              `2363 ${log("PUSH, then RESET", "logAttr", "then CONTINUE")}`
            );

            // 6. reset logAttr:
            resetLogAttr();

            // 7. offset:
            continue;
          } else {
            console.log(
              `2373 \u001b[${33}m${`██`}\u001b[${39}m - withinTagInnerspace() ${`\u001b[${32}m${`true`}\u001b[${39}m`}`
            );

            // the quotes and value is completely missing,
            // for example <img alt= />

            //
            //
            // working towards rule "tag-attribute-quote-and-onwards-missing"
            //
            //

            let start = logAttr.attrStartAt;
            const temp = right(str, i);
            console.log(`2387 ${log("set", "start", start, "temp", temp)}`);
            if (
              (str[i] === "/" && temp && str[temp] === ">") ||
              str[i] === ">"
            ) {
              // if we're removing a dud attribute at the end of the tag, let's
              // remove also all the whitespace in front of it:
              for (let y = logAttr.attrStartAt; y--; ) {
                if (str[y].trim().length) {
                  start = y + 1;
                  break;
                }
              }
            }
            submit({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, i]]
            });
            console.log(
              `2406 ${log(
                "push",
                "tag-attribute-quote-and-onwards-missing",
                `${`[[${start}, ${i}]]`}`
              )}`
            );
            // reset logWhitespace because it might get reported as well:
            console.log(`2413 ${log("reset", "logWhitespace")}`);
            resetLogWhitespace();
            console.log(`2415 ${log("reset", "logAttr")}`);
            resetLogAttr();

            // offset the index
            console.log(
              `2420 ${log("offset the index", "i--; then continue")}`
            );
            i--;
            continue;
          }

          console.log(
            `2427 ${log(
              "SET",
              "logAttr.attrOpeningQuote.pos",
              logAttr.attrOpeningQuote.pos,
              "logAttr.attrOpeningQuote.val",
              logAttr.attrOpeningQuote.val
            )}`
          );
          // tackle any whitespace between equal and quotes:
          if (logWhitespace.startAt !== null) {
            // 1. if it's single or double quote, this whitespace is probably
            // accidental:
            if (str[i] === "'" || str[i] === '"') {
              submit({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
              console.log(
                `2445 ${log(
                  "push",
                  "tag-attribute-space-between-equals-and-opening-quotes",
                  `${`[[${logWhitespace.startAt}, ${i}]]`}`
                )}`
              );
            } else if (withinTagInnerspace(str, i + 1)) {
              // Attribute's quotes and content was lost
              // for example, <aaa bbb="ccc" ddd= eee="fff"/>
              // tag-attribute-quote-and-onwards-missing
              submit({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, i]]
              });
              console.log(
                `2460 ${log(
                  "push",
                  "tag-attribute-quote-and-onwards-missing",
                  `${`[[${logAttr.attrStartAt}, ${i}]]`}`
                )}`
              );
              console.log(`2466 ${log("reset", "logAttr")}`);
              resetLogAttr();
            }
          }
        } else if (!str[i + 1] || !right(str, i)) {
          console.log("2471");
          submit({
            name: "file-missing-ending",
            position: [[i + 1, i + 1]]
          });
          console.log(
            `2477 ${log(
              "push",
              "file-missing-ending",
              `${`[[${i + 1}, ${i + 1}]]`}`
            )}`
          );
          console.log(`2483 then CONTINUE`);
          continue;
        }
      }

      console.log(
        `2489 ${`\u001b[${90}m${`above catching closing quote (single or double)`}\u001b[${39}m`}`
      );
      // 5. catch closing quote (single or double)
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos !== null &&
        (logAttr.attrClosingQuote.pos === null ||
          i === logAttr.attrClosingQuote.pos) &&
        i > logAttr.attrOpeningQuote.pos &&
        charIsQuote(str[i])
      ) {
        console.log(
          `2501 ${`\u001b[${90}m${`inside catching closing quote (single or double)`}\u001b[${39}m`}`
        );
        if (charcode === 34 || charcode === 39) {
          // if it's single or double quote

          // 1. check for quote mismatch, then push new issue, but check if
          // this issue hasn't been recorded already:
          const issueName = `tag-attribute-mismatching-quotes-is-${
            charcode === 34 ? "double" : "single"
          }`;

          if (
            str[i] !== logAttr.attrOpeningQuote.val &&
            (!retObj.issues.length ||
              !retObj.issues.some(issueObj => {
                return (
                  issueObj.name === issueName &&
                  issueObj.position.length === 1 &&
                  issueObj.position[0][0] === i &&
                  issueObj.position[0][1] === i + 1
                );
              }))
          ) {
            submit({
              name: issueName,
              position: [[i, i + 1, `${charcode === 34 ? "'" : '"'}`]]
            });
            console.log(
              `2529 ${log(
                "push",
                issueName,
                `${`[[${i}, ${i + 1}, ${charcode === 34 ? "'" : '"'}]]`}`
              )}`
            );
          } else {
            console.log(
              `2537 ${`\u001b[${31}m${`didn't push an issue`}\u001b[${39}m`}`
            );
          }

          // 2. Set closing quote:
          logAttr.attrClosingQuote.pos = i;
          // For now it would be more efficient to assume the value is the same
          // and skip writing it. We know closing quotes are the same.. But only
          // for now.
          logAttr.attrClosingQuote.val = str[i];
          console.log(
            `2548 ${log(
              "SET",
              "logAttr.attrClosingQuote.pos",
              logAttr.attrClosingQuote.pos,
              "logAttr.attrClosingQuote.val",
              logAttr.attrClosingQuote.val
            )}`
          );

          // 3. Set the attribute's value in the marker, if
          // it's not set already:

          if (logAttr.attrValue === null) {
            if (
              logAttr.attrOpeningQuote.pos &&
              logAttr.attrClosingQuote.pos &&
              logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos
            ) {
              // it's non-empty string
              logAttr.attrValue = str.slice(logAttr.attrValueStartAt, i);
            } else {
              // empty string, no need to slice
              logAttr.attrValue = "";
            }
            console.log(
              `2573 ${log("SET", "logAttr.attrValue", logAttr.attrValue)}`
            );
          }

          // 4. Set the attribute's ending index in the marker:
          logAttr.attrEndAt = i;
          logAttr.attrValueEndAt = i;
          console.log(
            `2581 ${log(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrValueEndAt",
              logAttr.attrValueEndAt
            )}`
          );

          // 5. don't forget "withinQuotes" marker
          if (withinQuotes) {
            withinQuotes = null;
            console.log(`2593 ${log("SET", "withinQuotes", withinQuotes)}`);
          }

          // 6. Finally, push the attributes object into
          logTag.attributes.push(clone(logAttr));
          console.log(`2598 ${log("PUSH, then RESET", "logAttr")}`);

          // then, reset:
          resetLogAttr();
        } else if (
          isStr(logAttr.attrOpeningQuote.val) &&
          (charcode === 8220 || charcode === 8221)
        ) {
          // 1. if curlies were used to open this and this is curlie
          const name =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          submit({
            name: name,
            position: [[i, i + 1, '"']]
          });
          console.log(
            `2616 ${log("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
          );

          // 2. Set the attribute's ending index in the marker:
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = '"';
          console.log(
            `2624 ${log(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );

          // 3. Finally, push the attributes object into
          logTag.attributes.push(clone(logAttr));
          console.log(`2635 ${log("PUSH, then RESET", "logAttr")}`);

          // then, reset:
          resetLogAttr();
        } else if (
          isStr(logAttr.attrOpeningQuote.val) &&
          (charcode === 8216 || charcode === 8217) &&
          ((right(str, i) !== null &&
            (str[right(str, i)] === ">" || str[right(str, i)] === "/")) ||
            withinTagInnerspace(str, i + 1))
        ) {
          // if curlies were used to open this and this is curlie
          const name =
            charcode === 8216
              ? "tag-attribute-left-single-quotation-mark"
              : "tag-attribute-right-single-quotation-mark";
          submit({
            name: name,
            position: [[i, i + 1, `'`]]
          });
          console.log(
            `2656 ${log("push", name, `${`[[${i}, ${i + 1}, "'"]]`}`)}`
          );

          // 2. Set the attribute's ending index in the marker:
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = "'";
          console.log(
            `2664 ${log(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );

          // 3. Don't forget the "withinQuotes" flag:
          withinQuotes = null;
          withinQuotesEndAt = null;
          console.log(
            `2677 ${log("reset", "withinQuotes & withinQuotesEndAt")}`
          );

          // 4. Finally, push the attributes object into
          logTag.attributes.push(clone(logAttr));
          console.log(`2682 ${log("PUSH, then RESET", "logAttr")}`);

          // 5. then, reset:
          resetLogAttr();
        }
      }

      // 6. if reached this far, check error clauses.
      console.log(`2690 ${`\u001b[${90}m${`error clauses`}\u001b[${39}m`}`);

      // unclosed attribute, followed by slash + closing bracket OR closing bracket
      if (
        logAttr.attrOpeningQuote.val &&
        logAttr.attrOpeningQuote.pos < i &&
        logAttr.attrClosingQuote.pos === null &&
        // !(logAttr.attrOpeningQuote.val && !logAttr.attrClosingQuote.val) &&
        ((str[i] === "/" && right(str, i) && str[right(str, i)] === ">") ||
          str[i] === ">")
      ) {
        console.log("2701 inside error catch clauses");
        // 1. push the issue:
        submit({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[i, i, logAttr.attrOpeningQuote.val]]
        });
        console.log(
          `2708 ${log(
            "push",
            "tag-attribute-closing-quotation-mark-missing",
            `${`[[${i}, ${i}, ${logAttr.attrOpeningQuote.val}]]`}`
          )}`
        );
        // 2. complete the attribute's record:
        logAttr.attrClosingQuote.pos = i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log(
          `2718 ${log(
            "set",
            "logAttr.attrClosingQuote",
            logAttr.attrClosingQuote
          )}`
        );
        // 3. since attribute record is complete, push it to logTag
        logTag.attributes.push(clone(logAttr));
        console.log(`2726 ${log("PUSH, then RESET", "logAttr")}`);

        // 4. reset logAttr:
        resetLogAttr();
      }

      //
      //               S
      //               S
      //               S
      //   logging tag attrs  -  END
      //               S
      //               S
      //               S
    }

    // catch unprintable, unencoded characters that don't belong to HTML:
    // match by UTF-16 (decimal) value of the character, equivalent to .charCodeAt(0)
    // for example, 32 is space character in ASCII
    if (charcode < 32) {
      const name = `bad-character-${util.lowAsciiCharacterNames[charcode]}`;
      if (charcode === 9) {
        // TODO - detect tabs as indentation vs. tabs in body
        if (!doNothingUntil) {
          // Replace all tabs, '\u0009', with double spaces:
          submit({
            name,
            position: [[i, i + 1, "  "]]
          });
          console.log(`2755 PUSH "${name}", [[${i}, ${i + 1}, "  "]]`);
        }
      } else if (charcode === 13) {
        // Catch CR line endings (\r)

        // 10 - "\u000A" - line feed
        // 13 - "\u000D" - carriage return
        if (isStr(str[i + 1]) && str[i + 1].charCodeAt(0) === 10) {
          // 1. LF follows, we've got CRLF
          if (!doNothingUntil) {
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "CRLF"
            ) {
              // 1.1. a different line ending is enforced via opts.style.line_endings_CR_LF_CRLF
              submit({
                name: "file-wrong-type-line-ending-CRLF",
                position: [[i, i + 2, rawEnforcedEOLChar]]
              });
              console.log(
                `2776 ${log(
                  "push",
                  "file-wrong-type-line-ending-CRLF",
                  `${`[[${i}, ${i + 2}, ${JSON.stringify(
                    rawEnforcedEOLChar,
                    null,
                    0
                  )}]]`}`
                )}`
              );
            } else {
              // 1.2. so line endings is not enforced. Make a note of this line ending.
              logLineEndings.crlf.push([i, i + 2]);
              console.log(
                `2790 ${log("logLineEndings.crlf push", `[${i}, ${i + 2}]`)}`
              );
            }
          }

          // if this line end is within ESP tag, it's an error
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[i, i + 2]]
            });
            console.log(
              `2802 ${log(
                "push",
                "esp-line-break-within-templating-tag",
                `${`[[${i}, ${i + 2}]]`}`
              )}`
            );
          }
        } else {
          // 2. It's standalone CR
          if (!doNothingUntil) {
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "CR"
            ) {
              // 2.1. a different line ending is enforced via opts.style.line_endings_CR_LF_CRLF
              submit({
                name: "file-wrong-type-line-ending-CR",
                position: [[i, i + 1, rawEnforcedEOLChar]]
              });
              console.log(
                `2823 ${log(
                  "push",
                  "file-wrong-type-line-ending-CR",
                  `${`[[${i}, ${i + 1}, ${JSON.stringify(
                    rawEnforcedEOLChar,
                    null,
                    0
                  )}]]`}`
                )}`
              );
            } else {
              // 2.2. so line endings is not enforced. Make a note of this line ending.
              logLineEndings.cr.push([i, i + 1]);
              console.log(
                `2837 ${log("logLineEndings.cr push", `[${i}, ${i + 1}]`)}`
              );
            }
          }

          // if this line end is within ESP tag, it's an error
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[i, i + 1]]
            });
            console.log(
              `2849 ${log(
                "push",
                "esp-line-break-within-templating-tag",
                `${`[[${i}, ${i + 1}]]`}`
              )}`
            );
          }
        }
      } else if (charcode === 10) {
        if (!(isStr(str[i - 1]) && str[i - 1].charCodeAt(0) === 13)) {
          // 3. Catch LF line endings (\n) (not second part of CRLF)
          // this double "IF" nesting allows to skip processing LF second time,
          // as standalone, in "CRLF" cases
          if (!doNothingUntil) {
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "LF"
            ) {
              // 3.1. a different line ending is enforced via opts.style.line_endings_CR_LF_CRLF
              submit({
                name: "file-wrong-type-line-ending-LF",
                position: [[i, i + 1, rawEnforcedEOLChar]]
              });
              console.log(
                `2874 ${log(
                  "push",
                  "file-wrong-type-line-ending-LF",
                  `${`[[${i}, ${i + 1}, ${JSON.stringify(
                    rawEnforcedEOLChar,
                    null,
                    0
                  )}]]`}`
                )}`
              );
            } else {
              // 3.2. so line endings is not enforced. Make a note of this line ending.
              logLineEndings.lf.push([i, i + 1]);
              console.log(
                `2888 ${log("logLineEndings.lf push", `[${i}, ${i + 1}]`)}`
              );
            }
          }

          // if this line end is within ESP tag, it's an error
          if (logEspTag.headStartAt !== null) {
            submit({
              name: "esp-line-break-within-templating-tag",
              position: [[i, i + 1]]
            });
            console.log(
              `2900 ${log(
                "push",
                "esp-line-break-within-templating-tag",
                `${`[[${i}, ${i + 1}]]`}`
              )}`
            );
          }
        }
      } else if (!doNothingUntil) {
        // Remove this character.
        // Just check the surroundings, maybe there is whitespace on each side,
        // in which case we need to collapse it into space or linebreak (also
        // considering preferred line endings).
        const nearestNonWhitespaceCharIdxOnTheLeft = left(str, i);
        const nearestNonWhitespaceCharIdxOnTheRight = right(str, i);
        let addThis; // we might assign space or linebreak
        if (
          nearestNonWhitespaceCharIdxOnTheLeft < i - 1 &&
          (nearestNonWhitespaceCharIdxOnTheRight > i + 1 ||
            (nearestNonWhitespaceCharIdxOnTheRight === null &&
              str[i + 1] &&
              str[i + 1] !== "\n" &&
              str[i + 1] !== "\r" &&
              !str[i + 1].trim().length)) // maybe there's whitespace chunk after, leading to EOF
        ) {
          const tempWhitespace = str.slice(
            nearestNonWhitespaceCharIdxOnTheLeft + 1,
            nearestNonWhitespaceCharIdxOnTheRight
          );
          if (tempWhitespace.includes("\n") || tempWhitespace.includes("\r")) {
            if (opts.style && opts.style.line_endings_CR_LF_CRLF) {
              // if preferred EOL is set, use that
              addThis = opts.style.line_endings_CR_LF_CRLF;
            } else {
              addThis = "\n";
            }
          } else {
            addThis = " ";
          }
        }
        console.log(`2940 ${log("log", "addThis", addThis)}`);

        if (addThis) {
          submit({
            name,
            position: [
              [
                nearestNonWhitespaceCharIdxOnTheLeft + 1,
                nearestNonWhitespaceCharIdxOnTheRight,
                addThis
              ]
            ]
          });
          console.log(
            `2954 ${log(
              "push",
              name,
              `${`[[${nearestNonWhitespaceCharIdxOnTheLeft +
                1}, ${nearestNonWhitespaceCharIdxOnTheRight}, ${addThis}]]`}`
            )}`
          );
        } else {
          submit({
            name,
            position: [[i, i + 1]]
          });
          console.log(`2966 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
        }
      }
    } else if (!doNothingUntil && charcode > 126 && charcode < 160) {
      // whole C1 group
      // https://en.wikipedia.org/wiki/List_of_Unicode_characters#Control_codes
      const name = `bad-character-${util.c1CharacterNames[charcode - 127]}`;
      submit({
        name,
        position: [[i, i + 1]]
      });
      console.log(`2977 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
    } else if (!doNothingUntil && charcode === 60) {
      console.log(
        `2980 ${`\u001b[${90}m${`within opening raw bracket "<" clauses`}\u001b[${39}m`}`
      );
      const whatsOnTheRight1 = right(str, i);
      if (whatsOnTheRight1) {
        // maybe there's a comment on the right
        const whatsOnTheRight2 = right(str, whatsOnTheRight1);
        if (str[whatsOnTheRight1] === "!") {
          // tackle any whitespace:
          if (
            whatsOnTheRight1 > i + 1 &&
            str[right(str, whatsOnTheRight1)] !== "["
          ) {
            submit({
              name: "html-comment-spaces",
              position: [[i + 1, whatsOnTheRight1]]
            });
            console.log(
              `2997 ${log(
                "push",
                "html-comment-spaces",
                `${`[[${i + 1}, ${whatsOnTheRight1}]]`}`
              )}`
            );
          }
          // see what follows:
          const whatsOnTheRight3 = right(str, whatsOnTheRight2);
          if (str[whatsOnTheRight2] === "-") {
            // tackle any whitespace:
            if (whatsOnTheRight2 > whatsOnTheRight1 + 1) {
              submit({
                name: "html-comment-spaces",
                position: [[whatsOnTheRight1 + 1, whatsOnTheRight2]]
              });
              console.log(
                `3014 ${log(
                  "push",
                  "html-comment-spaces",
                  `${`[[${whatsOnTheRight1 + 1}, ${whatsOnTheRight2}]]`}`
                )}`
              );
            }

            // see what follows:
            const whatsOnTheRight4 = right(str, whatsOnTheRight3);
            if (str[whatsOnTheRight3] === "-") {
              // healthy opening comment

              // tackle any whitespace:
              if (whatsOnTheRight3 > whatsOnTheRight2 + 1) {
                submit({
                  name: "html-comment-spaces",
                  position: [[whatsOnTheRight2 + 1, whatsOnTheRight3]]
                });
                console.log(
                  `3034 ${log(
                    "push",
                    "html-comment-spaces",
                    `${`[[${whatsOnTheRight2 + 1}, ${whatsOnTheRight3}]]`}`
                  )}`
                );
              }
            }
            // too many dashes
            if (str[whatsOnTheRight4] === "-") {
              console.log(
                `3045 ${`\u001b[${36}m${`======= do-while loop =======`}\u001b[${39}m`}`
              );
              let endingOfTheSequence = whatsOnTheRight4;
              let charOnTheRightAt;

              do {
                charOnTheRightAt = right(str, endingOfTheSequence);
                console.log(
                  `3053 ${`\u001b[${36}m${`SET charOnTheRightAt = ${charOnTheRightAt}`}\u001b[${39}m`}`
                );
                if (str[charOnTheRightAt] === "-") {
                  endingOfTheSequence = charOnTheRightAt;
                  console.log(
                    `3058 ${`\u001b[${36}m${`SET endingOfTheSequence = ${endingOfTheSequence}`}\u001b[${39}m`}`
                  );
                }
              } while (str[charOnTheRightAt] === "-");

              const charOnTheRight = right(str, endingOfTheSequence);
              submit({
                name: "html-comment-redundant-dash",
                position: [[whatsOnTheRight3 + 1, charOnTheRight]]
              });
              console.log(
                `3069 ${log(
                  "push",
                  "html-comment-redundant-dash",
                  `${`[[${whatsOnTheRight3 + 1}, ${charOnTheRight}]]`}`
                )}`
              );

              doNothingUntil = charOnTheRight;
              doNothingUntilReason = "repeated HTML comment dashes";
              console.log(
                `3079 ${log(
                  "set",
                  "doNothingUntil",
                  doNothingUntil,
                  "doNothingUntilReason",
                  doNothingUntilReason
                )}`
              );
            }
          }
        } else if (str[whatsOnTheRight1] === "-") {
          // maybe it's opening comment without excl mark?
        } else {
          // it's not a comment, so encode this bracket:
          console.log(`3093 submitOpeningBracket(${i}, ${i + 1})`);
          submitOpeningBracket(i, i + 1);
        }
      } else {
        // if there's no non-whitespace characters on the right, encode it:
        console.log(`3098 submitOpeningBracket(${i}, ${i + 1})`);
        submitOpeningBracket(i, i + 1);
      }
    } else if (!doNothingUntil && charcode === 62) {
      console.log(
        `3103 ${`\u001b[${90}m${`within closing raw bracket ">" clauses`}\u001b[${39}m`}`
      );
      const whatsOnTheLeft1 = left(str, i);
      if (str[whatsOnTheLeft1] === "-") {
        const whatsOnTheLeft2 = left(str, whatsOnTheLeft1);
        if (str[whatsOnTheLeft2] === "-") {
          // healthy closing comment
        }
      } else {
        console.log(`3112 submitClosingBracket(${i}, ${i + 1})`);
        submitClosingBracket(i, i + 1);
      }
    } else if (!doNothingUntil && charcode === 160) {
      // unencoded non-breaking space
      // https://en.wikipedia.org/wiki/Non-breaking_space
      // http://www.fileformat.info/info/unicode/char/00a0/index.htm
      const name = `bad-character-unencoded-non-breaking-space`;
      submit({
        name,
        position: [[i, i + 1, "&nbsp;"]]
      });
      console.log(
        `3125 ${log("push", name, `${`[[${i}, ${i + 1}, "&nbsp;"]]`}`)}`
      );
    } else if (!doNothingUntil && charcode === 5760) {
      // ogham space mark:
      // https://www.fileformat.info/info/unicode/char/1680/index.htm
      const name = `bad-character-ogham-space-mark`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3135 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8192) {
      // en quad:
      // https://www.fileformat.info/info/unicode/char/2000/index.htm
      const name = `bad-character-en-quad`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3144 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8193) {
      // em quad:
      // https://www.fileformat.info/info/unicode/char/2001/index.htm
      const name = `bad-character-em-quad`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3153 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8194) {
      // en space:
      // https://www.fileformat.info/info/unicode/char/2002/index.htm
      const name = `bad-character-en-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3162 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8195) {
      // em space:
      // https://www.fileformat.info/info/unicode/char/2003/index.htm
      const name = `bad-character-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3171 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8196) {
      // three-per-em space:
      // https://www.fileformat.info/info/unicode/char/2004/index.htm
      const name = `bad-character-three-per-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3180 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8197) {
      // four-per-em space:
      // https://www.fileformat.info/info/unicode/char/2005/index.htm
      const name = `bad-character-four-per-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3189 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8198) {
      // six-per-em space:
      // https://www.fileformat.info/info/unicode/char/2006/index.htm
      const name = `bad-character-six-per-em-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3198 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8199) {
      // figure space:
      // https://www.fileformat.info/info/unicode/char/2007/index.htm
      const name = `bad-character-figure-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3207 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8200) {
      // punctuation space:
      // https://www.fileformat.info/info/unicode/char/2008/index.htm
      const name = `bad-character-punctuation-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3216 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8201) {
      // thin space:
      // https://www.fileformat.info/info/unicode/char/2009/index.htm
      const name = `bad-character-thin-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3225 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8202) {
      // hair space:
      // https://www.fileformat.info/info/unicode/char/200a/index.htm
      const name = `bad-character-hair-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(`3234 ${log("push", name, `${`[[${i}, ${i + 1}, " "]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8203) {
      // zero width space:
      // https://www.fileformat.info/info/unicode/char/200b/index.htm
      // https://www.w3.org/TR/html4/struct/text.html#h-9.1
      const name = `bad-character-zero-width-space`;
      submit({
        name,
        position: [[i, i + 1]]
      });
      console.log(`3244 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
    } else if (!doNothingUntil && charcode === 8232) {
      // line separator character:
      // https://www.fileformat.info/info/unicode/char/2028/index.htm
      const name = `bad-character-line-separator`;
      submit({
        name,
        position: [[i, i + 1, "\n"]]
      });
      console.log(
        `3254 ${log("push", name, `${`[[${i}, ${i + 1}, "\\n"]]`}`)}`
      );
    } else if (!doNothingUntil && charcode === 8233) {
      // paragraph separator character:
      // https://www.fileformat.info/info/unicode/char/2029/index.htm
      const name = `bad-character-paragraph-separator`;
      submit({
        name,
        position: [[i, i + 1, "\n"]]
      });
      console.log(
        `3265 ${log("push", name, `${`[[${i}, ${i + 1}, "\\n"]]`}`)}`
      );
    } else if (!doNothingUntil && charcode === 8239) {
      // narrow no-break space character:
      // https://www.fileformat.info/info/unicode/char/202f/index.htm
      const name = `bad-character-narrow-no-break-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(
        `3276 ${log("push", name, `${`[[${i}, ${i + 1}, "\\n"]]`}`)}`
      );
    } else if (!doNothingUntil && charcode === 8287) {
      // medium mathematical space character:
      // https://www.fileformat.info/info/unicode/char/205f/index.htm
      const name = `bad-character-medium-mathematical-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(
        `3287 ${log("push", name, `${`[[${i}, ${i + 1}, "\\n"]]`}`)}`
      );
    } else if (!doNothingUntil && charcode === 12288) {
      // ideographic character:
      // https://www.fileformat.info/info/unicode/char/3000/index.htm
      const name = `bad-character-ideographic-space`;
      submit({
        name,
        position: [[i, i + 1, " "]]
      });
      console.log(
        `3298 ${log("push", name, `${`[[${i}, ${i + 1}, "\\n"]]`}`)}`
      );
    } else if (!doNothingUntil && encodeChar(str, i)) {
      console.log(
        `${`\u001b[${90}m${`1 it's a raw character which should be encoded`}\u001b[${39}m`}`
      );
      const newIssue = encodeChar(str, i);
      submit(newIssue, "raw");
      console.log(`3306 ${log("push to raw stage", "newIssue", newIssue)}`);
    } else if (!doNothingUntil && charcode >= 888 && charcode <= 8591) {
      console.log(`3308`);
      // !!! this clause has to be the last !!!
      // otherwise, dead spots will skip characters between 888 and 8591.
      if (
        charcode === 888 ||
        charcode === 889 ||
        (charcode >= 896 && charcode <= 899) ||
        charcode === 907 ||
        charcode === 909 ||
        charcode === 930 ||
        charcode === 1328 ||
        charcode === 1367 ||
        charcode === 1368 ||
        charcode === 1419 ||
        charcode === 1419 ||
        charcode === 1420 ||
        charcode === 1424 ||
        (charcode >= 1480 && charcode <= 1487) ||
        (charcode >= 1515 && charcode <= 1519) ||
        (charcode >= 1525 && charcode <= 1535) ||
        charcode === 1565 ||
        charcode === 1806 ||
        charcode === 1867 ||
        charcode === 1868 ||
        (charcode >= 1970 && charcode <= 1983) ||
        (charcode >= 2043 && charcode <= 2047) ||
        charcode === 2094 ||
        charcode === 2095 ||
        charcode === 2111 ||
        charcode === 2140 ||
        charcode === 2141 ||
        charcode === 2143 ||
        (charcode >= 2155 && charcode <= 2207) ||
        charcode === 2229 ||
        (charcode >= 2238 && charcode <= 2258) ||
        charcode === 2436 ||
        charcode === 2445 ||
        charcode === 2446 ||
        charcode === 2449 ||
        charcode === 2450 ||
        charcode === 2473 ||
        charcode === 2481 ||
        charcode === 2483 ||
        charcode === 2484 ||
        charcode === 2485 ||
        charcode === 2490 ||
        charcode === 2491 ||
        charcode === 2501 ||
        charcode === 2502 ||
        charcode === 2505 ||
        charcode === 2506 ||
        (charcode >= 2511 && charcode <= 2518) ||
        (charcode >= 2520 && charcode <= 2523) ||
        charcode === 2526 ||
        (charcode >= 8384 && charcode <= 8399) ||
        (charcode >= 8433 && charcode <= 8447) ||
        charcode === 8588 ||
        charcode === 8589 ||
        charcode === 8590 ||
        charcode === 8591
      ) {
        // non-existing characters like for example:
        // https://www.fileformat.info/info/unicode/char/0378/index.htm
        // http://www.fileformat.info/info/unicode/char/0379/index.htm
        // http://www.fileformat.info/info/unicode/char/0383/index.htm
        // http://www.fileformat.info/info/unicode/char/038b/index.htm
        const name = `bad-character-generic`;
        submit({
          name,
          position: [[i, i + 1]]
        });
        console.log(`3379 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
      }
    }

    // ^^^ BAD CHARACTER DETECTION CHUNK ENDS ^^^

    // catch the ending of whitespace chunks:
    if (
      !doNothingUntil &&
      logWhitespace.startAt !== null &&
      str[i].trim().length
    ) {
      // 1. catch the whitespace before closing slash, within a tag
      console.log(
        `3393 ${`\u001b[${90}m${`inside whitespace chunks ending clauses`}\u001b[${39}m`}`
      );
      if (
        logTag.tagNameStartAt !== null &&
        logAttr.attrStartAt === null &&
        (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= i) &&
        (str[i] === ">" ||
          (str[i] === "/" && "<>".includes(str[right(str, i)])))
      ) {
        console.log("3402");
        // we're within a tag but not within an attribute and this is whitespace
        // chunk before closing slash or closing bracket
        let name = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          name = "tag-whitespace-closing-slash-and-bracket";
        }

        submit({
          name: name,
          position: [[logWhitespace.startAt, i]]
        });
        console.log(
          `3415 ${log("push", name, `${`[[${logWhitespace.startAt}, ${i}]]`}`)}`
        );
      }
    }

    // catch the start of whitespace chunks:
    if (
      !doNothingUntil &&
      !str[i].trim().length &&
      logWhitespace.startAt === null
    ) {
      logWhitespace.startAt = i;
      console.log(
        `3428 ${log("set", "logWhitespace.startAt", logWhitespace.startAt)}`
      );
    }

    // catch linebreaks within the whitespace chunks:
    if ((!doNothingUntil && str[i] === "\n") || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log(
          `3437 ${log(
            "set",
            "logWhitespace.includesLinebreaks",
            logWhitespace.includesLinebreaks
          )}`
        );
      }
      logWhitespace.lastLinebreakAt = i;
      console.log(
        `3446 ${log(
          "set",
          "logWhitespace.lastLinebreakAt",
          logWhitespace.lastLinebreakAt
        )}`
      );
    }

    console.log("3454");
    // catch the ending of the tag name:
    // PS. we deliberately allow capital Latin letters through the net, so that
    // later we could flag them up
    if (
      !doNothingUntil &&
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      !util.isLatinLetter(str[i]) &&
      str[i] !== "<" &&
      str[i] !== "/"
    ) {
      console.log("3466 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      console.log(
        `3471 ${log(
          "set",
          "logTag.tagNameEndAt",
          logTag.tagNameEndAt,
          "logTag.tagName",
          logTag.tagName,
          "logTag.recognised",
          logTag.recognised
        )}`
      );

      // maybe there's a stray quote, for example, <a"bcd="ef"/>
      if (charIsQuote(str[i]) || str[i] === "=") {
        console.log(`3484 stray quote clauses`);
        let addSpace; // default value - false
        let strayCharsEndAt = i + 1;
        // traverse forward and chomp all quote-like characters. When first non-
        // quote character is met, stop, evaluate is it whitespace or not.
        // If not, we need to compensate this missing whitespace, to add a space
        if (str[i + 1].trim().length) {
          if (charIsQuote(str[i + 1]) || str[i + 1] === "=") {
            // traverse forward
            console.log(`\u001b[${36}m${`3493 traverse forward`}\u001b[${39}m`);
            for (let y = i + 1; y < len; y++) {
              console.log(
                `\u001b[${36}m${`3496 str[${y}] = str[y]`}\u001b[${39}m`
              );
              if (!charIsQuote(str[y]) && str[y] !== "=") {
                if (str[y].trim().length) {
                  addSpace = true;
                  strayCharsEndAt = y;
                }
                break;
              }
            }
          } else {
            // So other kind of non-whitespace character (not quote, not equal)
            // follows current character. Add a compensation space.
            addSpace = true;
          }
        }
        if (addSpace) {
          submit({
            name: "tag-stray-character",
            position: [[i, strayCharsEndAt, " "]]
          });
          console.log(
            `3518 ${log(
              "push",
              "tag-stray-character",
              `${`[[${i}, ${strayCharsEndAt}, " "]]`}`
            )}`
          );
        } else {
          submit({
            name: "tag-stray-character",
            position: [[i, strayCharsEndAt]]
          });
          console.log(
            `3530 ${log(
              "push",
              "tag-stray-character",
              `${`[[${i}, ${strayCharsEndAt}]]`}`
            )}`
          );
        }
      }
    }

    // catch the start of the tag name:
    if (
      !doNothingUntil &&
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      util.isLatinLetter(str[i]) &&
      logTag.tagStartAt < i
    ) {
      console.log(`3548 within catching the start of the tag name clauses`);
      logTag.tagNameStartAt = i;
      console.log(
        `3551 ${log("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)}`
      );
      if (logTag.closing === null) {
        // set it to boolean to signify we set it
        logTag.closing = false;
        console.log(`3556 ${log("set", "logTag.closing", logTag.closing)}`);
      }

      // rule "space-between-opening-bracket-and-tag-name":
      if (logTag.tagStartAt < i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
        console.log(
          `3566 ${log(
            "stage",
            "tag-space-after-opening-bracket",
            `${`[[${logTag.tagStartAt + 1}, ${i}]]`}`
          )}`
        );
      }
    }

    // catch uppercase characters in tag names:
    if (
      !doNothingUntil &&
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      util.isUppercaseLetter(str[i]) &&
      !str
        .slice(logTag.tagNameStartAt)
        .toLowerCase()
        .startsWith("doctype")
    ) {
      submit({
        name: "tag-name-lowercase",
        position: [[i, i + 1, str[i].toLowerCase()]]
      });
      console.log(
        `3591 ${log(
          "push",
          "tag-name-lowercase",
          `${`[[${i}, ${i + 1}, ${JSON.stringify(
            str[i].toLowerCase(),
            null,
            4
          )}]]`}`
        )}`
      );
    }

    // catch the closing slash in front of a tag's name:
    if (
      !doNothingUntil &&
      str[i] === "/" &&
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null
    ) {
      if (logTag.closing === null) {
        // it's first occurence
        logTag.closing = true;
      } else {
        // there are repeated slashes
        // TODO
      }
    }

    // catch the beginning of a tag:
    if (!doNothingUntil && str[i] === "<") {
      console.log(
        `3622 ${`\u001b[${90}m${`within catching the beginning of a tag clauses`}\u001b[${39}m`}`
      );
      if (logTag.tagStartAt === null) {
        // mark it
        logTag.tagStartAt = i;
        console.log(
          `3628 ${log("set", "logTag.tagStartAt", logTag.tagStartAt)}`
        );
      } else if (tagOnTheRight(str, i)) {
        // maybe it's a case of unclosed tag, where a tag should be closed right before here,
        // and here a new tag starts?
        console.log(
          `3634 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new tag starts`
        );
        // two cases:
        // 1. if there is at least one attribute with equal+quotes, it's a tag
        // 2. else, it should be regarded as a set of unencoded characters (brackets, for example)

        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.length &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null &&
              attrObj.attrOpeningQuote.pos !== null
          )
        ) {
          console.log(
            `3650 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)`
          );
          // console.log("3652 ███████████████████████████████████████v");
          // console.log(
          //   `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} = ${JSON.stringify(
          //     logTag,
          //     null,
          //     4
          //   )}`
          // );
          // console.log("3660 ███████████████████████████████████████^");
          // 1. find out what's the last character on the left:
          const lastNonWhitespaceOnLeft = left(str, i);
          console.log(
            `3664 ${log(
              "set",
              "lastNonWhitespaceOnLeft",
              lastNonWhitespaceOnLeft
            )}`
          );
          // 2. if it's a bracket, no need to add closing bracket
          if (str[lastNonWhitespaceOnLeft] === ">") {
            // 2-1 no need to add a closing bracket.

            // 2-1-1. mark the ending of a tag:
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
            console.log(
              `3677 ${log("set", "logTag.tagEndAt", logTag.tagEndAt)}`
            );
          } else {
            // 2-2 add a closing bracket
            // 2-2-1. push the issue:
            submit({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, i, ">"]]
            });
            console.log(
              `3687 ${log(
                "push",
                "tag-missing-closing-bracket",
                `${`[[${lastNonWhitespaceOnLeft + 1}, ${i}, ">"]]`}`
              )}`
            );
          }
          // 3. take care of issues at rawIssueStaging:
          if (rawIssueStaging.length) {
            console.log(
              `3697 let's process all ${
                rawIssueStaging.length
              } raw character issues at staging`
            );
            rawIssueStaging.forEach(issueObj => {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                submit(issueObj);
                console.log(`3704 ${log("push", "issueObj", issueObj)}`);
              } else {
                console.log(
                  `3707 discarding ${JSON.stringify(issueObj, null, 4)}`
                );
              }
            });
          }

          // 4. ping the pingTag()
          pingTag(clone(logTag));

          // 5. reset all:
          resetLogTag();
          resetLogAttr(); // as well, just in case
          rawIssueStaging = [];
          console.log(
            `3721 ${log("reset", "logTag & logAttr && rawIssueStaging")}`
          );

          // 6. mark the beginning of a new tag:
          logTag.tagStartAt = i;
          console.log(
            `3727 ${log("set", "logTag.tagStartAt", logTag.tagStartAt)}`
          );
        } else {
          console.log(`3730 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS`);
          // 1.
          if (rawIssueStaging.length) {
            // merge any issues that are on or after dud tag
            console.log(
              `3735 ${log("processing", "rawIssueStaging", rawIssueStaging)}`
            );
            console.log(
              `3738 ${log("log", "logTag.tagStartAt", logTag.tagStartAt)}`
            );
            console.log(
              `3741 ${`\u001b[${31}m${JSON.stringify(
                logAttr,
                null,
                4
              )}\u001b[${39}m`}`
            );
            rawIssueStaging.forEach(issueObj => {
              if (
                // issueObj.position[0][0] >= logTag.tagStartAt &&
                issueObj.position[0][0] < i // ||
                // (issueObj.position[0][0] > a && issueObj.position[0][0] < b)
              ) {
                submit(issueObj);
                console.log(`3754 ${log("push", "issueObj", issueObj)}`);
              } else {
                console.log("");
                console.log(
                  `3758 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
                    issueObj,
                    null,
                    4
                  )}\nbecause ${`\u001b[${33}m${`issueObj.position[0][0]`}\u001b[${39}m`}=${
                    issueObj.position[0][0]
                  } not < ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`}=${
                    logTag.tagStartAt
                  }`
                );
              }
            });
            console.log(`3770 wipe rawIssueStaging`);
            rawIssueStaging = [];
          }

          // 2. wipe tag issues, this tag is dud
          if (tagIssueStaging.length) {
            console.log(`3776 ${log("wipe", "tagIssueStaging")}`);
            tagIssueStaging = [];
          }
        }
      }
    }

    // catch a closing bracket of a tag, >
    if (
      !doNothingUntil &&
      charcode === 62 &&
      logTag.tagStartAt !== null &&
      (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < i)
    ) {
      console.log(
        `3791 within catching a closing bracket of a tag, >, clauses`
      );
      // 1. merge any staging:
      if (tagIssueStaging.length) {
        tagIssueStaging.forEach(issue => {
          console.log(`3796 submit "${issue}" from staging`);
          submit(issue);
        });
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        // merge any issues that are up to the tag's beginning character's index
        console.log(
          `3804 ${log("processing", "rawIssueStaging", rawIssueStaging)}`
        );
        console.log(
          `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} = ${JSON.stringify(
            logTag,
            null,
            4
          )}`
        );
        rawIssueStaging.forEach(issueObj => {
          if (
            issueObj.position[0][0] < logTag.tagStartAt ||
            (logTag.attributes.some(attrObj => {
              return (
                attrObj.attrValueStartAt < issueObj.position[0][0] &&
                attrObj.attrValueEndAt > issueObj.position[0][0]
              );
            }) &&
              !retObj.issues.some(existingIssue => {
                return (
                  existingIssue.position[0][0] === issueObj.position[0][0] &&
                  existingIssue.position[0][1] === issueObj.position[0][1]
                );
              }))
          ) {
            submit(issueObj);
            console.log(`3830 ${log("push", "issueObj", issueObj)}`);
          } else {
            console.log("");
            console.log(
              `3834 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
                issueObj,
                null,
                4
              )}\nbecause ${`\u001b[${33}m${`issueObj.position[0][0]`}\u001b[${39}m`}=${
                issueObj.position[0][0]
              } not < ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`}=${
                logTag.tagStartAt
              }`
            );
          }
        });
        console.log(`3846 wipe rawIssueStaging`);
        rawIssueStaging = [];
      }

      // if it's a <script> tag, activate the doNothingUntil
      // permanently, until further notice
      if (logTag.tagName === "script") {
        doNothingUntil = true;
        doNothingUntilReason = "script tag";
        console.log(
          `3856 ${log(
            "set",
            "doNothingUntil",
            doNothingUntil
          )}, then reset logTag and rawIssueStaging`
        );
      }

      // 2. reset:
      resetLogTag();
      resetLogAttr();
      console.log(`3867 ${log("reset", "logTag & logAttr")}`);
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE BOTTOM
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // catch the </script> and stop "doNothingUntil"
    // PS. "withinQuotes === null" clause below is very interesting, we're
    // basically "parsing" JS code here, although there's no real parsing.
    // With regards of this rule, imagine if JS code within <script> tag had
    // a string, "</script>". That would not be considered as closing script
    // tag, would it?
    if (
      doNothingUntil &&
      doNothingUntilReason === "script tag" &&
      str[i] === "t" &&
      str[i - 1] === "p" &&
      str[i - 2] === "i" &&
      str[i - 3] === "r" &&
      str[i - 4] === "c" &&
      str[i - 5] === "s" &&
      withinQuotes === null
    ) {
      const charOnTheRight = right(str, i);
      const charOnTheLeft = left(str, i - 5);
      console.log(
        `3910 ${log(
          "set",
          "charOnTheRight",
          charOnTheRight,
          "charOnTheLeft",
          charOnTheLeft,
          "str[charOnTheRight]",
          str[charOnTheRight],
          "str[charOnTheLeft]",
          str[charOnTheLeft]
        )}`
      );
      // if there's slash on the left, it's closing slash tag
      if (str[charOnTheLeft] === "/") {
        // check what's on the left:
        const charFurtherOnTheLeft = left(str, charOnTheLeft);
        console.log(
          `3927 ${log(
            "set",
            "charFurtherOnTheLeft",
            charFurtherOnTheLeft,
            "str[charFurtherOnTheLeft]",
            str[charFurtherOnTheLeft]
          )}`
        );
      } else if (str[charOnTheLeft] === "<") {
        // we have a new opening <script> tag!
        console.log(`3937 opening <script> tag!`);
      }

      doNothingUntil = charOnTheRight + 1;
      console.log(`3941 ${log("set", "doNothingUntil", doNothingUntil)}`);
    }

    // reset whitespace
    if (
      !doNothingUntil &&
      logWhitespace.startAt !== null &&
      str[i].trim().length
    ) {
      resetLogWhitespace();
      console.log(`3951 ${log("reset", "logWhitespace")}`);
    }

    // catch the string's end, EOF EOL
    // if (!doNothingUntil && !str[i + 1]) {
    if (!str[i + 1]) {
      console.log("3957");
      // this (str[i]) is the last character
      if (rawIssueStaging.length) {
        console.log("3960");
        // if this resembles a tag (there's at least one attribute with equal+quotes pattern),
        // wipe all raw issues since the beginning of this tag, then push the rest in.
        // then, add all tagIssueStaging
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null
          )
        ) {
          console.log("3971");
          // 1. push all issues before index at which the tag started
          rawIssueStaging.forEach(issueObj => {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              submit(issueObj);
              console.log(`3976 ${log("push", "issueObj", issueObj)}`);
            } else {
              console.log(
                `\n1519 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
                  issueObj,
                  null,
                  4
                )}\nbecause ${`\u001b[${33}m${`issueObj.position[0][0]`}\u001b[${39}m`}=${
                  issueObj.position[0][0]
                } not < ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`}=${
                  logTag.tagStartAt
                }`
              );
            }
          });
          console.log(`3991 wipe rawIssueStaging`);
          rawIssueStaging = [];

          // 2. add missing closing bracket
          submit({
            name: "tag-missing-closing-bracket",
            position: [
              [
                logWhitespace.startAt ? logWhitespace.startAt : i + 1,
                i + 1,
                ">"
              ]
            ]
          });
          console.log(
            `4006 ${log(
              "push",
              "tag-missing-closing-bracket",
              `${`[[${
                logWhitespace.startAt ? logWhitespace.startAt : i + 1
              }, ${i + 1}, ">"]]`}`
            )}`
          );
        } else if (
          !retObj.issues.some(
            issueObj => issueObj.name === "file-missing-ending"
          )
        ) {
          // if there's no tag registered, just dump all raw
          // character-related issues at staging, "rawIssueStaging"
          // into final issues:
          rawIssueStaging.forEach(issueObj => {
            submit(issueObj);
            console.log(
              `4025 ${`\u001b[${32}m${`SUBMIT`}\u001b[${39}m`} ${JSON.stringify(
                issueObj,
                null,
                0
              )}`
            );
          });
          console.log(
            `4033 wipe ${`\u001b[${33}m${`rawIssueStaging`}\u001b[${39}m`}`
          );
          rawIssueStaging = [];
        }
      }
    }

    // logging
    const output = {
      logTag: true,
      logAttr: false,
      logEspTag: true,
      logWhitespace: true,
      logLineEndings: false,
      retObj: false,
      retObj_mini: true,
      tagIssueStaging: false,
      rawIssueStaging: false,
      withinQuotes: false
    };
    const retObj_mini = clone(retObj);
    Object.keys(retObj_mini.applicableRules).forEach(rule => {
      if (!retObj_mini.applicableRules[rule]) {
        delete retObj_mini.applicableRules[rule];
      }
    });

    console.log(
      `${
        Object.keys(output).some(key => output[key])
          ? `${`\u001b[${31}m${`█ `}\u001b[${39}m`}`
          : ""
      }${
        output.logTag && logTag.tagStartAt && logTag.tagStartAt !== null
          ? `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} ${JSON.stringify(
              logTag,
              null,
              4
            )}; `
          : ""
      }${
        output.logAttr && logAttr.attrStartAt && logAttr.attrStartAt !== null
          ? `${`\u001b[${33}m${`logAttr`}\u001b[${39}m`} ${JSON.stringify(
              logAttr,
              null,
              4
            )}; `
          : ""
      }${
        output.logEspTag &&
        logEspTag.headStartAt &&
        logEspTag.headStartAt !== null
          ? `${`\u001b[${33}m${`logEspTag`}\u001b[${39}m`} ${JSON.stringify(
              logEspTag,
              null,
              4
            )}; `
          : ""
      }${
        output.logWhitespace &&
        logWhitespace.startAt &&
        logWhitespace.startAt !== null
          ? `${`\u001b[${33}m${`logWhitespace`}\u001b[${39}m`} ${JSON.stringify(
              logWhitespace,
              null,
              0
            )}; `
          : ""
      }${
        output.logLineEndings
          ? `${`\u001b[${33}m${`logLineEndings`}\u001b[${39}m`} ${JSON.stringify(
              logLineEndings,
              null,
              0
            )}; `
          : ""
      }${
        output.retObj
          ? `${`\u001b[${33}m${`retObj`}\u001b[${39}m`} ${JSON.stringify(
              retObj,
              null,
              4
            )}; `
          : ""
      }${
        output.retObj_mini
          ? `${`\u001b[${33}m${`retObj_mini`}\u001b[${39}m`} ${JSON.stringify(
              retObj_mini,
              null,
              4
            )}; `
          : ""
      }${
        output.tagIssueStaging && tagIssueStaging.length
          ? `\n${`\u001b[${33}m${`tagIssueStaging`}\u001b[${39}m`} ${JSON.stringify(
              tagIssueStaging,
              null,
              4
            )}; `
          : ""
      }${
        output.rawIssueStaging && rawIssueStaging.length
          ? `\n${`\u001b[${33}m${`rawIssueStaging`}\u001b[${39}m`} ${JSON.stringify(
              rawIssueStaging,
              null,
              4
            )}; `
          : ""
      }${
        output.withinQuotes && withinQuotes
          ? `\n${`\u001b[${33}m${`withinQuotes`}\u001b[${39}m`} ${JSON.stringify(
              withinQuotes,
              null,
              4
            )}; ${`\u001b[${33}m${`withinQuotesEndAt`}\u001b[${39}m`} = ${withinQuotesEndAt}; `
          : ""
      }`
    );

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
  }
  //                                  ^
  //                                 /|\
  //                                / | \
  //                               /  |  \
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                         L O O P     E N D S

  //
  //
  //               P O S T - L O O P    P R O C E S S I N G
  //
  //

  //                          .----------------.
  //                         | .--------------. |
  //                         | |     __       | |
  //                         | |    /  |      | |
  //                         | |    `| |      | |
  //                         | |     | |      | |
  //                         | |    _| |_     | |
  //                         | |   |_____|    | |
  //                         | |              | |
  //                         | '--------------' |
  //                          '----------------'

  // tend the mismatching EOL's, if applicable. That's at least two
  // kinds of EOL's was recorded and no opts are enforcing a particular
  // style of EOL (opts.style.line_endings_CR_LF_CRLF).
  if (
    (!opts.style || !opts.style.line_endings_CR_LF_CRLF) &&
    ((logLineEndings.cr.length && logLineEndings.lf.length) ||
      (logLineEndings.lf.length && logLineEndings.crlf.length) ||
      (logLineEndings.cr.length && logLineEndings.crlf.length))
  ) {
    // so line endings are mixed up. Let's find which type is prevalent:
    if (
      logLineEndings.cr.length > logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      console.log("4203 CR clearly prevalent");
      // replace all LF and CRLF with CR
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (
      logLineEndings.lf.length > logLineEndings.crlf.length &&
      logLineEndings.lf.length > logLineEndings.cr.length
    ) {
      console.log("4225 LF clearly prevalent");
      // replace all CR and CRLF with LF
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length > logLineEndings.lf.length &&
      logLineEndings.crlf.length > logLineEndings.cr.length
    ) {
      console.log("4247 CRLF clearly prevalent");
      // replace all CR and LF with CRLF
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length === logLineEndings.lf.length &&
      logLineEndings.lf.length === logLineEndings.cr.length
    ) {
      console.log("4269 same amount of each type of EOL");
      // replace CR and CRLF with LF
      // no need for checking the existance (if logLineEndings.crlf.length ...):
      logLineEndings.crlf.forEach(eolEntryArr => {
        submit({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(eolEntryArr => {
        submit({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (
      logLineEndings.cr.length === logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      console.log("4288 CR & CRLF are prevalent over LF");
      // replace CR and LF with CRLF
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      (logLineEndings.lf.length === logLineEndings.crlf.length &&
        logLineEndings.lf.length > logLineEndings.cr.length) ||
      (logLineEndings.cr.length === logLineEndings.lf.length &&
        logLineEndings.cr.length > logLineEndings.crlf.length)
    ) {
      console.log(
        "4313 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF"
      );
      // replace CRLF and CR with LF
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          submit({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    }
  }

  //                          .----------------.
  //                         | .--------------. |
  //                         | |    _____     | |
  //                         | |   / ___ `.   | |
  //                         | |  |_/___) |   | |
  //                         | |   .'____.'   | |
  //                         | |  / /____     | |
  //                         | |  |_______|   | |
  //                         | |              | |
  //                         | '--------------' |
  //                          '----------------'

  // tap the package "string-fix-broken-named-entities" to fix any broken
  // HTML entities

  const htmlEntityFixes = fixBrokenEntities(str, {
    cb: oodles => {
      // Example of the returned obj API:
      // {
      //   ruleName: "missing semicolon on &pi; (don't confuse with &piv;)",
      //   entityName: "pi",
      //   rangeFrom: i,
      //   rangeTo: i + 3,
      //   rangeValEncoded: "&pi;",
      //   rangeValDecoded: "\u03C0"
      // }
      return {
        name: oodles.ruleName,
        position: [
          oodles.rangeValEncoded != null
            ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
            : [oodles.rangeFrom, oodles.rangeTo]
        ]
      };
    }
  });

  console.log(
    `4373 \u001b[${33}m${`█`}\u001b[${39}m\u001b[${31}m${`█`}\u001b[${39}m\u001b[${34}m${`█`}\u001b[${39}m ${log(
      "log",
      "htmlEntityFixes",
      htmlEntityFixes
    )}`
  );

  if (isArr(htmlEntityFixes) && htmlEntityFixes.length) {
    // filter out the existing raw unencoded ampersand issues
    retObj.issues = retObj.issues
      .filter(issueObj => {
        console.log(
          `${`\u001b[${36}m${`3851 filtering issueObj=${JSON.stringify(
            issueObj,
            null,
            4
          )}`}\u001b[${39}m`}`
        );
        return (
          issueObj.name !== "bad-character-unencoded-ampersand" ||
          htmlEntityFixes.every(entityFixObj => {
            return issueObj.position[0][0] !== entityFixObj.position[0][0];
          })
        );
      })
      .concat(htmlEntityFixes ? htmlEntityFixes : [])
      .filter(issueObj => !opts.rules || opts.rules[issueObj.name] !== false);
  }
  // also remove "bad-character-unencoded-ampersand" from applicable rules
  if (
    !retObj.issues.some(
      issueObj => issueObj.name === "bad-character-unencoded-ampersand"
    )
  ) {
    retObj.applicableRules["bad-character-unencoded-ampersand"] = false;
    console.log(
      `4409 SET retObj.applicableRules["bad-character-unencoded-ampersand"] = false`
    );
  }
  // also push "htmlEntityFixes" to applicable rules:
  console.log(
    `4414 ${`\u001b[${33}m${`htmlEntityFixes`}\u001b[${39}m`} = ${JSON.stringify(
      htmlEntityFixes,
      null,
      4
    )}`
  );
  if (isArr(htmlEntityFixes) && htmlEntityFixes.length) {
    htmlEntityFixes.forEach(issueObj => {
      console.log(
        `4423 ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
          issueObj,
          null,
          4
        )}`
      );
      if (!retObj.applicableRules[issueObj.name]) {
        retObj.applicableRules[issueObj.name] = true;
        console.log(
          `4432 retObj.applicableRules[issueObj.name] = ${
            retObj.applicableRules[issueObj.name]
          }`
        );
      }
    });
  }

  // console.log(
  //   `4441 ████\n     ████\n     ████\n retObj = ${JSON.stringify(
  //     retObj,
  //     null,
  //     4
  //   )}`
  // );
  // console.log(`\n████\n████\n████\n`);

  //                          .----------------.
  //                         | .--------------. |
  //                         | |    ______    | |
  //                         | |   / ____ `.  | |
  //                         | |   `'  __) |  | |
  //                         | |   _  |__ '.  | |
  //                         | |  | \____) |  | |
  //                         | |   \______.'  | |
  //                         | |              | |
  //                         | '--------------' |
  //                          '----------------'

  // merge all fixes into ranges-apply-ready array:
  console.log("4462 BEFORE FIX:");
  console.log(`4463 ${log("log", "retObj.issues", retObj.issues)}`);

  retObj.fix =
    isArr(retObj.issues) && retObj.issues.length
      ? merge(
          retObj.issues
            .filter(issueObj => {
              console.log(
                `4471 errorsRules[${issueObj.name}] = ${(errorsRules[
                  issueObj.name
                ],
                null,
                4)}`
              );
              console.log(
                `4478 errorsRules[issueObj.name].unfixable = ${
                  errorsRules[issueObj.name]
                    ? errorsRules[issueObj.name].unfixable
                    : errorsRules[issueObj.name]
                }`
              );
              return (
                !errorsRules[issueObj.name] ||
                !errorsRules[issueObj.name].unfixable
              );
            })
            .reduce((acc, obj) => {
              return acc.concat(obj.position);
            }, [])
        )
      : null;
  console.log(`4494 ${log("log", "retObj.fix", retObj.fix)}`);

  return retObj;
}

export { lint, version };

// REF from https://steelbrain.me/linter/examples/standard-linter-v2.html
// {
//   severity: 'info',
//   location: {
//     file: editorPath,
//     position: [[0, 0], [0, 1]],
//   },
//   excerpt: `A random value is ${Math.random()}`,
//   description: `### What is this?\nThis is a randomly generated value`
// }

// -----------------------------------------------------------------------------
//
// Notes for self.

// TODO - complete witing up pingTag() on all tag ending catches
