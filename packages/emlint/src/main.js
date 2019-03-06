import knownBooleanHTMLAttributes from "./knownBooleanHTMLAttributes.json";
import fixBrokenEntities from "string-fix-broken-named-entities";
import knownHTMLTags from "./knownHTMLTags.json";
import { left, right } from "string-left-right";
import checkTypes from "check-types-mini";
import { version } from "../package.json";
import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";
import errors from "./errors.json";
import merge from "ranges-merge";
import * as util from "./util";
const isArr = Array.isArray;
const {
  attributeOnTheRight,
  withinTagInnerspace,
  findClosingQuote,
  tagOnTheRight,
  charIsQuote,
  encodeChar,
  isStr,
  log
} = util;

function lint(str, originalOpts) {
  // Internal functions (placed here to access the same scope)
  // ---------------------------------------------------------------------------

  // this function below gets pinged each time a tag's record has been gathered
  function pingTag(logTag) {
    console.log(`030 pingTag(): ${JSON.stringify(logTag, null, 4)}`);
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
    rules: "recommended",
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };

  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        msg: "emlint: [THROW_ID_03*]",
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
    `111 USING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    attributes: []
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

  // ESP marker tracking:
  // ESP stands for Email Service Provider
  // for example, Mailchimp, Eloqua, Bronto and Responsys are ESP's.
  // We mark their templating language markers, such as "{{" and "}}".
  // There many ESP's and many different template marking languages they use.
  // The plan is to come up with a universal algorithm that can recognise them
  // all. This is an ambitious task but wasn't flying to the ambitious too?
  let logEspTag;
  const defaultEspTag = {
    headStartAt: null,
    headEndAt: null,
    tailStartAt: null,
    tailEndAt: null,
    startAt: null,
    endAt: null
  };
  function resetEspTag() {
    logEspTag = clone(defaultEspTag);
  }
  resetEspTag(); // initiate!

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

  // Return-related:
  const retObj = {
    issues: []
  };

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

  // ================

  // it's used only when opts.style.line_endings_CR_LF_CRLF is not set, to track
  // mixed line endings, calculate prevalent EOL type and set all others to that
  const logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };

  // ================

  // templating language recognition-related bits

  // temp contains all common templating language head/tail marker characters:
  const espChars = `{}%-$_()`;

  // ================

  // when it's set, it's set to an index of an opening quote:
  let withinQuotes = null;

  // ---------------------------------------------------------------------------

  if (str.length === 0) {
    // Sometimes things with file I/O operations go wrong and contents get lost
    // This rule will report such cases. You might want to know if your HTML
    // file contents went poof.
    retObj.issues.push({
      name: "file-empty",
      position: [[0, 0]]
    });
    console.log(`279 ${log("push", "file-empty")}`);
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

    const charcode = str[i].charCodeAt(0);
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m ${`\u001b[${31}m${
        doNothingUntil
          ? `██ doNothingUntil ${doNothingUntil} (reason: ${doNothingUntilReason})`
          : ""
      }\u001b[${39}m`}`
    );

    if (doNothingUntil && doNothingUntil !== true && i >= doNothingUntil) {
      doNothingUntil = null;
      console.log(`325 ${log("RESET", "doNothingUntil", doNothingUntil)}`);
      doNothingUntilReason = null;
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
      if (withinQuotes === null && charIsQuote(str[i])) {
        withinQuotes = i;
        console.log(`342 ${log("set", "withinQuotes", withinQuotes)}`);
      } else if (withinQuotes !== null && str[withinQuotes] === str[i]) {
        console.log(`344 withinQuotes was ${withinQuotes}, resetting to null`);
        withinQuotes = null;
        console.log(`346 ${log("set", "withinQuotes", withinQuotes)}`);
      }
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

    // catch the ESP templating language marker heads/tails
    // for example, {{ ... }} or {%- ... -%} or %%...%% and so on.
    if (
      espChars.includes(str[i]) &&
      str[i + 1] &&
      espChars.includes(str[i + 1]) &&
      logEspTag.headStartAt === null &&
      logEspTag.startAt === null
    ) {
      logEspTag.headStartAt = i;
      logEspTag.startAt = i;
      console.log(
        `382 ${log(
          "SET",
          "logEspTag.headStartAt",
          logEspTag.headStartAt,
          "logEspTag.startAt",
          logEspTag.startAt
        )}`
      );
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
        `404 ${`\u001b[${90}m${`above catching the ending of an attribute's name`}\u001b[${39}m`}`
      );
      // 1. catch the ending of an attribute's name
      if (
        logAttr.attrNameStartAt !== null &&
        logAttr.attrNameEndAt === null &&
        logAttr.attrName === null &&
        !util.isLatinLetter(str[i])
      ) {
        logAttr.attrNameEndAt = i;
        logAttr.attrName = str.slice(
          logAttr.attrNameStartAt,
          logAttr.attrNameEndAt
        );
        console.log(
          `419 ${log(
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
            console.log("434 equal to the right though");
          } else {
            // TODO - there's not equal to the right
            console.log("437 not equal, so terminate attr");
          }
        }
      }

      console.log(
        `443 ${`\u001b[${90}m${`above catching what follows the attribute's name`}\u001b[${39}m`}`
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
          `457 ${`\u001b[${90}m${`inside catch what follows the attribute's name`}\u001b[${39}m`}`
        );
        if (str[i] === "=") {
          logAttr.attrEqualAt = i;
          console.log(
            `462 ${log("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
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
              console.log(`481 REPEATED EQUAL DETECTED`);
              // console.log(`482 RESET logWhitespace`);
              // resetLogWhitespace();
              let nextEqualStartAt = i + 1;
              let nextEqualEndAt = nextCharOnTheRightAt + 1;

              // set "doNothingUntil" to skip processing of already
              // processed equal(s)
              doNothingUntil = nextEqualEndAt;
              doNothingUntilReason = "repeated equals";
              console.log(
                `492 ${log("set", "doNothingUntil", doNothingUntil)}`
              );

              console.log(
                `496 SET ${`\u001b[${36}m${`nextEqualStartAt = "${nextEqualStartAt}"; nextEqualEndAt = "${nextEqualEndAt};"`}\u001b[${39}m`}`
              );
              while (nextEqualStartAt && nextEqualEndAt) {
                console.log(`       ${`\u001b[${35}m${`*`}\u001b[${39}m`}`);
                retObj.issues.push({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                console.log(
                  `505 ${log(
                    "push",
                    "tag-attribute-repeated-equal",
                    `${`[[${nextEqualStartAt}, ${nextEqualEndAt}]]`}`
                  )}`
                );
                // look what's next
                const temp = right(str, nextEqualEndAt - 1);
                console.log(`513 ${log("set", "temp", temp)}`);
                if (str[temp] === "=") {
                  console.log(
                    `516 ${`\u001b[${36}m${`yes, there's "=" on the right`}\u001b[${39}m`}`
                  );
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = temp + 1;
                  console.log(
                    `521 SET ${`\u001b[${36}m${`nextEqualStartAt = "${nextEqualStartAt}"; nextEqualEndAt = "${nextEqualEndAt};"`}\u001b[${39}m`}`
                  );

                  // set "doNothingUntil" to skip processing of already
                  // processed equal(s)
                  doNothingUntil = nextEqualEndAt;
                  doNothingUntilReason = "already processed equals";
                  console.log(
                    `529 ${log("set", "doNothingUntil", doNothingUntil)}`
                  );
                } else {
                  nextEqualStartAt = null;
                  console.log(
                    `534 ${log("set", "nextEqualStartAt", nextEqualStartAt)}`
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
            "546 quoted attribute's value on the right, equal is indeed missing"
          );
          // 1. push the issue:
          retObj.issues.push({
            name: "tag-attribute-missing-equal",
            position: [[i, i, "="]]
          });
          console.log(
            `554 ${log(
              "push",
              "tag-attribute-missing-equal",
              `${`[[${i}, ${i}, "="]]`}`
            )}`
          );
          // 2. complete the marker records:
          logAttr.attrEqualAt = i;
          console.log(
            `563 ${log("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );
          // 3. we need to mark where value starts too:
          logAttr.attrValueStartAt = i + 1;
          console.log(
            `568 ${log(
              "SET",
              "logAttr.attrValueStartAt",
              logAttr.attrValueStartAt
            )}`
          );
          // 4. ... and ends...
          logAttr.attrValueEndAt = temp;
          console.log(
            `577 ${log(
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
            `589 ${log(
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
            `600 ${log("SET", "logAttr.attrValue", logAttr.attrValue)}`
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
          console.log(`612 ${log("PUSH, then RESET", "logAttr")}`);

          // 2. reset:
          resetLogAttr();
        }

        if (logWhitespace.startAt !== null) {
          // it depends, is it equal (value might follow), or is it a letter,
          // in which case, it's an attribute without a value:
          if (str[i] === "=") {
            retObj.issues.push({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, i]]
            });
            console.log(
              `627 ${log(
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
            console.log(`640 ${log("PUSH, then RESET", "logAttr")}`);

            // then, reset:
            resetLogAttr();

            // also, maybe there was an excessive whitespace?
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < i) {
                  // retain that space, push the rest of the chunk
                  retObj.issues.push({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, i]]
                  });
                  console.log(
                    `655 ${log(
                      "push",
                      "tag-excessive-whitespace-inside-tag",
                      `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
                    )}`
                  );
                }
                console.log("662 dead end of excessive whitespace check");
              } else {
                // replace whole chunk with a single space
                retObj.issues.push({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, i, " "]]
                });
                console.log(
                  `670 ${log(
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
        `685 ${`\u001b[${90}m${`above catching the begining of an attribute's name`}\u001b[${39}m`}`
      );
      // 3. catch the begining of an attribute's name
      if (logAttr.attrStartAt === null && util.isLatinLetter(str[i])) {
        console.log(
          `690 ${`\u001b[${90}m${`inside catching the begining of an attribute's name`}\u001b[${39}m`}`
        );
        logAttr.attrStartAt = i;
        logAttr.attrNameStartAt = i;
        console.log(
          `695 ${log(
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
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, i]]
            });
            console.log(
              `717 ${log(
                "push",
                "tag-excessive-whitespace-inside-tag",
                `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
              )}`
            );
          } else {
            // replace whole whitespace chunk with a single space
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, i, " "]]
            });
            console.log(
              `730 ${log(
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
                  retObj.issues.push({
                    name: "tag-stray-character",
                    position: [[y + 1, i]]
                  });
                  console.log(
                    `751 ${log(
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
        `766 ${`\u001b[${90}m${`above catching what follows attribute's equal`}\u001b[${39}m`}`
      );
      // 4. catch what follows attribute's equal
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos === null
      ) {
        console.log(
          `774 ${`\u001b[${90}m${`inside catching what follows attribute's equal`}\u001b[${39}m`}`
        );
        if (logAttr.attrEqualAt < i && str[i].trim().length) {
          console.log("777 catching what follows equal");
          if (charcode === 34 || charcode === 39) {
            // it's single or double quote

            // tackle preceding whitespace, if any:
            if (logWhitespace.startAt && logWhitespace.startAt < i) {
              retObj.issues.push({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
              console.log(
                `788 ${log(
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
              `802 ${log("set", "closingQuotePeek", closingQuotePeek)}`
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
                  retObj.issues.push({
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
                    `833 ${log(
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
                    `866 ${log(
                      "set",
                      "fromPositionToInsertAt",
                      fromPositionToInsertAt
                    )}`
                  );
                  let toPositionToInsertAt = closingQuotePeek;
                  console.log(
                    `874 ${log(
                      "set",
                      "toPositionToInsertAt",
                      toPositionToInsertAt
                    )}`
                  );

                  if (str[left(str, closingQuotePeek)] === "/") {
                    console.log("882 SLASH ON THE LEFT");
                    toPositionToInsertAt = left(str, closingQuotePeek);
                    // if there's a gap between slash and closing bracket, tackle it
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      retObj.issues.push({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                      console.log(
                        `891 ${log(
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
                      `904 ${log(
                        "set",
                        "toPositionToInsertAt",
                        toPositionToInsertAt,
                        "fromPositionToInsertAt",
                        fromPositionToInsertAt
                      )}`
                    );
                  }

                  retObj.issues.push({
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
                    `925 ${log(
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
                `943 ${log(
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
                    `969 ${log("push tagIssueStaging", "newIssue", newIssue)}`
                  );
                }
              }

              // check, have any raw unencoded characters been gathered in raw
              // staging so far
              if (rawIssueStaging.length) {
                console.log(
                  `978 ${`\u001b[${31}m${`██`}\u001b[${39}m`} raw stage present!`
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
                !retObj.issues.some(issueObj => {
                  return (
                    (issueObj.name === "tag-stray-quotes" ||
                      issueObj.name === "tag-stray-character") &&
                    issueObj.position[0][1] === logAttr.attrNameStartAt
                  );
                })
              ) {
                // insert space here:
                retObj.issues.push({
                  name: "tag-missing-space-before-attribute",
                  position: [
                    [logAttr.attrNameStartAt, logAttr.attrNameStartAt, " "]
                  ]
                });
                console.log(
                  `1006 ${log(
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
              console.log(`1018 ${log("PUSH, then RESET", "logAttr")}`);

              // then, reset:
              resetLogAttr();

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
                // console.log(`1035 ${log("set", "i", i)}`);
              } else {
                // pull back to nearest non-whitespace char
                doNothingUntil = left(str, closingQuotePeek) + 1;
                // i = left(str, closingQuotePeek);
                // console.log(`1040 ${log("set", "i", i)}`);
              }
              doNothingUntilReason = "closing quote issues";
              console.log(
                `1044 ${log("set", "doNothingUntil", doNothingUntil)}`
              );

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
                retObj.issues.push({
                  name: "tag-missing-closing-bracket",
                  position: [[i + 1, i + 1, ">"]]
                });
                console.log(
                  `1065 ${log(
                    "push",
                    "tag-missing-closing-bracket",
                    `${`[[${i + 1}, ${i + 1}, ">"]]`}`
                  )}`
                );
              }

              console.log(`1073 ${log("continue")}`);
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
              `1084 ${log(
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
            retObj.issues.push({
              name,
              position: [[i, i + 1, `"`]]
            });
            console.log(
              `1101 ${log("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
            );

            logAttr.attrValueStartAt = i + 1;
            console.log(
              `1106 ${log(
                "set",
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );
          } else if (charcode === 8216 || charcode === 8217) {
            // left-single-quotation-mark
            // https://www.fileformat.info/info/unicode/char/2018/index.htm
            // right-single-quotation-mark
            // https://www.fileformat.info/info/unicode/char/2019/index.htm
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `'`;
            console.log(
              `1120 ${log(
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
            retObj.issues.push({
              name,
              position: [[i, i + 1, `'`]]
            });
            console.log(
              `1137 ${log("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
            );

            logAttr.attrValueStartAt = i + 1;
            console.log(
              `1142 ${log(
                "set",
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );
          } else if (!withinTagInnerspace(str, i)) {
            console.log(
              `1150 \u001b[${33}m${`██`}\u001b[${39}m - withinTagInnerspace() ${`\u001b[${32}m${`false`}\u001b[${39}m`}`
            );
            // insert missing opening quote here, right at this index,
            // which means, to the left of this character

            const closingQuotePeek = findClosingQuote(str, i);
            console.log(`1156 ███████████████████████████████████████`);
            console.log(
              `1158 ${log("set", "closingQuotePeek", closingQuotePeek)}`
            );

            const quoteValToPut = charIsQuote(str[closingQuotePeek])
              ? str[closingQuotePeek]
              : `"`;

            // 1. push the issue:
            retObj.issues.push({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[left(str, i) + 1, i, quoteValToPut]]
            });
            console.log(
              `1171 ${log(
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
              `1185 mark opening quote: ${log(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote,
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );

            // 3. check the closing quotes
            // traverse forward until the first equal or closing bracket or
            // closing quotes, whichever comes first.
            console.log("1197 traverse forward\n\n\n");
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
                `1224 \u001b[${36}m${`str[${y}] = "${str[y]}"`}\u001b[${39}m`
              );
              if (
                str[y] === ">" &&
                ((str[left(str, y)] !== "/" && withinTagInnerspace(str, y)) ||
                  str[left(str, y)] === "/")
              ) {
                const leftAt = left(str, y);
                closingBracketIsAt = y;
                console.log(
                  `1234 ${log(
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
                    `1246 ${log("set", "innerTagEndsAt", innerTagEndsAt)}`
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
                  `1258 \u001b[${36}m${`break ("${
                    str[y]
                  }" is a bad character)`}\u001b[${39}m`
                );
                break;
              }
            }
            console.log(
              `1266 ${log(
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
              `1282 ${log("set", "innerTagContents", innerTagContents)}`
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
              console.log(`1297 inner tag contents include an equal character`);
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

              console.log(`1310 ${log("set", "temp1", temp1)}`);
              // if it has spaces, that last space is the separator boundary
              // between attributes.
              if (temp1.split("").some(char => !char.trim().length)) {
                console.log(
                  "1315 traverse backwards to find beginning of the attr on the right\n\n\n"
                );
                // let beginningOfAString = true;
                for (let z = i + temp1.length; z--; ) {
                  console.log(
                    `1320 \u001b[${35}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`
                  );
                  if (!str[z].trim().length) {
                    // if (beginningOfAString) {
                    //   beginningOfAString = false;
                    // } else {
                    attributeOnTheRightBeginsAt = z + 1;
                    console.log(
                      `1328 ${log(
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
                  `1345 ${log(
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
                `1361 inner tag contents don't include an equal character`
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
              `1377 ${`\u001b[${31}m${`TRAVERSE BACKWARDS`}\u001b[${39}m`}; startingPoint=${startingPoint}`
            );
            for (let z = startingPoint; z--; z > i) {
              // logging:
              console.log(
                `1382 ${`\u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`}`
              );
              // bail if equal is encountered
              if (str[z] === "=") {
                console.log(`1386 ${log("break")}`);
                break;
              }

              // catch attr ending:
              if (caughtAttrEnd === null && str[z].trim().length) {
                caughtAttrEnd = z + 1;
                console.log(
                  `1394 ${log("set", "caughtAttrEnd", caughtAttrEnd)}`
                );

                if (boolAttrFound) {
                  // 1. finalClosingQuotesShouldBeAt
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  console.log(
                    `1401 ${log(
                      "set",
                      "finalClosingQuotesShouldBeAt",
                      finalClosingQuotesShouldBeAt
                    )}`
                  );
                  // 2. reset
                  boolAttrFound = false;
                  console.log(
                    `1410 ${log("set", "boolAttrFound", boolAttrFound)}`
                  );
                }
              }
              // catch beginning of an attribute:
              if (!str[z].trim().length && caughtAttrEnd) {
                caughtAttrStart = z + 1;
                console.log(
                  `1418 ${`\u001b[${35}m${`ATTR`}\u001b[${39}m`}: ${str.slice(
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
                    // // 1. push issue, adding a quote
                    // retObj.issues.push({
                    //   name: "tag-attribute-closing-quotation-mark-missing",
                    //   position: [
                    //     [
                    //       temp1 + 1,
                    //       temp1 + 1,
                    //       logAttr.attrOpeningQuote.val
                    //         ? logAttr.attrOpeningQuote.val
                    //         : `"`
                    //     ]
                    //   ]
                    // });
                    // console.log(
                    //   `1447 ${log(
                    //     "push",
                    //     "tag-attribute-closing-quotation-mark-missing",
                    //     `${`[[${temp1 + 1}, ${temp1 + 1}, ${JSON.stringify(
                    //       logAttr.attrOpeningQuote.val
                    //         ? logAttr.attrOpeningQuote.val
                    //         : `"`,
                    //       null,
                    //       4
                    //     )}]]`}`
                    //   )}`
                    // );
                    //
                    // // 2. set the markers:
                    // logAttr.attrClosingQuote = { pos: temp1 + 1, val: `"` };
                    // logAttr.attrValueEndAt = temp1 + 1;
                    // logAttr.attrEndAt = temp1 + 2;
                    // console.log(`1464 ${log("log", "logAttr", logAttr)}`);
                    //
                    // // 3. push the attribute's object into logTag
                    // logTag.attributes.push(clone(logAttr));
                    // console.log(`1468 ${log("PUSH, then RESET", "logAttr")}`);
                    //
                    // // 4. reset logAttr:
                    // resetLogAttr();

                    // // 5. since we know the next attr starts on the right, set
                    // // up its markers:
                    // logAttr.attrNameStartAt = right(str, temp1 + 1);
                    // logAttr.attrStartAt = logAttr.attrNameStartAt;
                    // console.log(
                    //   `1478 ${log(
                    //     "set",
                    //     "logAttr.attrNameStartAt",
                    //     logAttr.attrNameStartAt,
                    //     "logAttr.attrStartAt",
                    //     logAttr.attrStartAt
                    //   )}`
                    // );
                    // console.log("---");
                    // console.log(`1487 ${log("log", "logAttr", logAttr)}`);
                    // console.log("---");

                    attributeOnTheRightBeginsAt = right(str, temp1 + 1);
                    console.log(
                      `1492 ${log(
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
                      `1511 ${log("set", "boolAttrFound", boolAttrFound)}`
                    );
                  } else {
                    // no it is not recognised
                    console.log(`1515 ${log("break")}`);
                    break;
                  }
                }

                // reset
                caughtAttrEnd = null;
                caughtAttrStart = null;
                console.log(
                  `1524 ${log(
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
              `1535 ${`\u001b[${31}m${`TRAVERSE ENDED`}\u001b[${39}m`}`
            );

            // if the quote has been "pulled back", for example,
            // <a bcd=ef gh     nowrap     noresize    reversed   >
            // from innerTagEndsAt === 51 to finalClosingQuotesShouldBeAt === 12
            // set it there right away

            console.log(
              `1544 ${log(
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
                `1558 ${log(
                  "log",
                  "attributeOnTheRightBeginsAt",
                  attributeOnTheRightBeginsAt
                )}`
              );
              console.log(
                `1565 ${log(
                  "set",
                  "finalClosingQuotesShouldBeAt",
                  finalClosingQuotesShouldBeAt
                )}`
              );
            }

            console.log(
              `1574 ██ ${log(
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
                `1591 ${log(
                  "set",
                  "finalClosingQuotesShouldBeAt",
                  finalClosingQuotesShouldBeAt
                )}`
              );
            }

            console.log(
              `1600 ${`\u001b[${32}m${`██`} \u001b[${39}m`} ${`\u001b[${33}m${`finalClosingQuotesShouldBeAt`}\u001b[${39}m`} = ${JSON.stringify(
                finalClosingQuotesShouldBeAt,
                null,
                4
              )}`
            );

            if (finalClosingQuotesShouldBeAt) {
              // 1. if closing quote is missing

              // 1.1. push the issue:
              retObj.issues.push({
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
                `1622 ${log(
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
              `1650 ${log(
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
                  `1673 \u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`
                );
                const temp = encodeChar(str, z);
                if (temp) {
                  retObj.issues.push(temp);
                  console.log(
                    `1679 ${log("push", "unencoded character", temp)}`
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
                `1692 ${log(
                  "set",
                  "doNothingUntil",
                  doNothingUntil,
                  "logWhitespace.startAt",
                  logWhitespace.startAt
                )}`
              );
            }

            // 5. since attribute record is complete, push it to logTag
            console.log(`1703 ${log("about to push", "logAttr", logAttr)}`);
            logTag.attributes.push(clone(logAttr));
            console.log(
              `1706 ${log("PUSH, then RESET", "logAttr", "then CONTINUE")}`
            );

            // 6. reset logAttr:
            resetLogAttr();

            // 7. offset:
            continue;
          } else {
            console.log(
              `1716 \u001b[${33}m${`██`}\u001b[${39}m - withinTagInnerspace() ${`\u001b[${32}m${`true`}\u001b[${39}m`}`
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
            console.log(`1730 ${log("set", "start", start, "temp", temp)}`);
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
            retObj.issues.push({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, i]]
            });
            console.log(
              `1749 ${log(
                "push",
                "tag-attribute-quote-and-onwards-missing",
                `${`[[${start}, ${i}]]`}`
              )}`
            );
            // reset logWhitespace because it might get reported as well:
            console.log(`1756 ${log("reset", "logWhitespace")}`);
            resetLogWhitespace();
            console.log(`1758 ${log("reset", "logAttr")}`);
            resetLogAttr();

            // offset the index
            console.log(
              `1763 ${log("offset the index", "i--; then continue")}`
            );
            i--;
            continue;
          }

          console.log(
            `1770 ${log(
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
              retObj.issues.push({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
              console.log(
                `1788 ${log(
                  "push",
                  "tag-attribute-space-between-equals-and-opening-quotes",
                  `${`[[${logWhitespace.startAt}, ${i}]]`}`
                )}`
              );
            } else if (withinTagInnerspace(str, i + 1)) {
              // Attribute's quotes and content was lost
              // for example, <aaa bbb="ccc" ddd= eee="fff"/>
              // tag-attribute-quote-and-onwards-missing
              retObj.issues.push({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, i]]
              });
              console.log(
                `1803 ${log(
                  "push",
                  "tag-attribute-quote-and-onwards-missing",
                  `${`[[${logAttr.attrStartAt}, ${i}]]`}`
                )}`
              );
              console.log(`1809 ${log("reset", "logAttr")}`);
              resetLogAttr();
            }
          }
        } else if (!str[i + 1] || !right(str, i)) {
          console.log("1814");
          retObj.issues.push({
            name: "file-missing-ending",
            position: [[i + 1, i + 1]]
          });
          console.log(
            `1820 ${log(
              "push",
              "tag-attribute-quote-and-onwards-missing",
              `${`[[${i + 1}, ${i + 1}]]`}`
            )}`
          );
        }
      }

      console.log(
        `1830 ${`\u001b[${90}m${`above catching closing quote (single or double)`}\u001b[${39}m`}`
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
          `1842 ${`\u001b[${90}m${`inside catching closing quote (single or double)`}\u001b[${39}m`}`
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
            retObj.issues.push({
              name: issueName,
              position: [[i, i + 1, `${charcode === 34 ? "'" : '"'}`]]
            });
            console.log(
              `1870 ${log(
                "push",
                issueName,
                `${`[[${i}, ${i + 1}, ${charcode === 34 ? "'" : '"'}]]`}`
              )}`
            );
          } else {
            console.log(
              `1878 ${`\u001b[${31}m${`didn't push an issue`}\u001b[${39}m`}`
            );
          }

          // 2. Set closing quote:
          logAttr.attrClosingQuote.pos = i;
          // For now it would be more efficient to assume the value is the same
          // and skip writing it. We know closing quotes are the same.. But only
          // for now.
          logAttr.attrClosingQuote.val = str[i];
          console.log(
            `1889 ${log(
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
              logAttr.attrValue = str.slice(
                logAttr.attrOpeningQuote.pos,
                logAttr.attrClosingQuote.pos
              );
            } else {
              // empty string, no need to slice
              logAttr.attrValue = "";
            }
            console.log(
              `1917 ${log("SET", "logAttr.attrValue", logAttr.attrValue)}`
            );
          }

          // 4. Set the attribute's ending index in the marker:
          logAttr.attrEndAt = i;
          logAttr.attrValueEndAt = i;
          console.log(
            `1925 ${log(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrValueEndAt",
              logAttr.attrValueEndAt
            )}`
          );

          // 5. Finally, push the attributes object into
          logTag.attributes.push(clone(logAttr));
          console.log(`1936 ${log("PUSH, then RESET", "logAttr")}`);

          // then, reset:
          resetLogAttr();
        } else if (
          isStr(logAttr.attrOpeningQuote.val) &&
          (charcode === 8220 || charcode === 8221) // TODO - cleanup &&
          // ((right(str, i) &&
          //   (str[right(str, i)] === ">" ||
          //     str[right(str, i)] === "/")) ||
          //   )
        ) {
          // 1. if curlies were used to open this and this is curlie
          const name =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          retObj.issues.push({
            name: name,
            position: [[i, i + 1, '"']]
          });
          console.log(
            `1958 ${log("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
          );

          // 2. Set the attribute's ending index in the marker:
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = '"';
          console.log(
            `1966 ${log(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );

          // 3. Finally, push the attributes object into
          logTag.attributes.push(clone(logAttr));
          console.log(`1977 ${log("PUSH, then RESET", "logAttr")}`);

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
          retObj.issues.push({
            name: name,
            position: [[i, i + 1, `'`]]
          });
          console.log(
            `1998 ${log("push", name, `${`[[${i}, ${i + 1}, "'"]]`}`)}`
          );

          // 2. Set the attribute's ending index in the marker:
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = "'";
          console.log(
            `2006 ${log(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );

          // 3. Finally, push the attributes object into
          logTag.attributes.push(clone(logAttr));
          console.log(`2017 ${log("PUSH, then RESET", "logAttr")}`);

          // then, reset:
          resetLogAttr();
        }
      }

      // 6. if reached this far, check error clauses.
      console.log(`2025 ${`\u001b[${90}m${`error clauses`}\u001b[${39}m`}`);

      // unclosed attribute, followed by slash + closing bracket OR closing bracket
      if (
        logAttr.attrOpeningQuote.val &&
        logAttr.attrOpeningQuote.pos < i &&
        logAttr.attrClosingQuote.pos === null &&
        // !(logAttr.attrOpeningQuote.val && !logAttr.attrClosingQuote.val) &&
        ((str[i] === "/" && right(str, i) && str[right(str, i)] === ">") ||
          str[i] === ">")
      ) {
        console.log("2036 inside error catch clauses");
        // 1. push the issue:
        retObj.issues.push({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[i, i, logAttr.attrOpeningQuote.val]]
        });
        console.log(
          `2043 ${log(
            "push",
            "tag-attribute-closing-quotation-mark-missing",
            `${`[[${i}, ${i}, ${logAttr.attrOpeningQuote.val}]]`}`
          )}`
        );
        // 2. complete the attribute's record:
        logAttr.attrClosingQuote.pos = i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log(
          `2053 ${log(
            "set",
            "logAttr.attrClosingQuote",
            logAttr.attrClosingQuote
          )}`
        );
        // 3. since attribute record is complete, push it to logTag
        logTag.attributes.push(clone(logAttr));
        console.log(`2061 ${log("PUSH, then RESET", "logAttr")}`);

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

    if (!doNothingUntil) {
      // catch unprintable, unencoded characters that don't belong to HTML:
      // match by UTF-16 (decimal) value of the character, equivalent to .charCodeAt(0)
      // for example, 32 is space character in ASCII
      if (charcode < 32) {
        const name = `bad-character-${util.lowAsciiCharacterNames[charcode]}`;
        if (charcode === 9) {
          // TODO - detect tabs as indentation vs. tabs in body
          // Replace all tabs, '\u0009', with double spaces:
          retObj.issues.push({
            name,
            position: [[i, i + 1, "  "]]
          });
          console.log(`2090 PUSH "${name}", [[${i}, ${i + 1}, "  "]]`);
        } else if (charcode === 13) {
          // Catch CR line endings (\r)

          // 10 - "\u000A" - line feed
          // 13 - "\u000D" - carriage return
          if (isStr(str[i + 1]) && str[i + 1].charCodeAt(0) === 10) {
            // 1. LF follows, we've got CRLF
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "CRLF"
            ) {
              // 1.1. a different line ending is enforced via opts.style.line_endings_CR_LF_CRLF
              retObj.issues.push({
                name: "file-wrong-type-line-ending-CRLF",
                position: [[i, i + 2, rawEnforcedEOLChar]]
              });
              console.log(
                `2109 ${log(
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
                `2123 ${log("logLineEndings.crlf push", `[${i}, ${i + 2}]`)}`
              );
            }
          } else {
            // 2. It's standalone CR
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "CR"
            ) {
              // 2.1. a different line ending is enforced via opts.style.line_endings_CR_LF_CRLF
              retObj.issues.push({
                name: "file-wrong-type-line-ending-CR",
                position: [[i, i + 1, rawEnforcedEOLChar]]
              });
              console.log(
                `2139 ${log(
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
                `2153 ${log("logLineEndings.cr push", `[${i}, ${i + 1}]`)}`
              );
            }
          }
        } else if (charcode === 10) {
          if (!(isStr(str[i - 1]) && str[i - 1].charCodeAt(0) === 13)) {
            // 3. Catch LF line endings (\n) (not second part of CRLF)
            // this double "IF" nesting allows to skip processing LF second time,
            // as standalone, in "CRLF" cases
            if (
              opts.style &&
              opts.style.line_endings_CR_LF_CRLF &&
              opts.style.line_endings_CR_LF_CRLF !== "LF"
            ) {
              // 3.1. a different line ending is enforced via opts.style.line_endings_CR_LF_CRLF
              retObj.issues.push({
                name: "file-wrong-type-line-ending-LF",
                position: [[i, i + 1, rawEnforcedEOLChar]]
              });
              console.log(
                `2173 ${log(
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
                `2187 ${log("logLineEndings.lf push", `[${i}, ${i + 1}]`)}`
              );
            }
          }
        } else {
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
            if (
              tempWhitespace.includes("\n") ||
              tempWhitespace.includes("\r")
            ) {
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
          console.log(`2226 ${log("log", "addThis", addThis)}`);

          if (addThis) {
            retObj.issues.push({
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
              `2240 ${log(
                "push",
                name,
                `${`[[${nearestNonWhitespaceCharIdxOnTheLeft +
                  1}, ${nearestNonWhitespaceCharIdxOnTheRight}, ${addThis}]]`}`
              )}`
            );
          } else {
            retObj.issues.push({
              name,
              position: [[i, i + 1]]
            });
            console.log(`2252 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
          }
        }
      } else if (charcode > 126 && charcode < 160) {
        // whole C1 group
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters#Control_codes
        const name = `bad-character-${util.c1CharacterNames[charcode - 127]}`;
        retObj.issues.push({
          name,
          position: [[i, i + 1]]
        });
        console.log(`2263 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
      } else if (charcode === 160) {
        // unencoded non-breaking space
        // https://en.wikipedia.org/wiki/Non-breaking_space
        // http://www.fileformat.info/info/unicode/char/00a0/index.htm
        const name = `bad-character-unencoded-non-breaking-space`;
        retObj.issues.push({
          name,
          position: [[i, i + 1, "&nbsp;"]]
        });
        console.log(
          `2274 ${log("push", name, `${`[[${i}, ${i + 1}, "&nbsp;"]]`}`)}`
        );
      } else if (charcode === 8203) {
        // zero width space:
        // https://www.fileformat.info/info/unicode/char/200b/index.htm
        // https://www.w3.org/TR/html4/struct/text.html#h-9.1
        const name = `bad-character-zero-width-space`;
        retObj.issues.push({
          name,
          position: [[i, i + 1]]
        });
        console.log(`2285 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
      } else if (charcode === 8232) {
        // line separator character:
        // https://www.fileformat.info/info/unicode/char/2028/index.htm
        const name = `bad-character-line-separator`;
        retObj.issues.push({
          name,
          position: [[i, i + 1]]
        });
        console.log(`2294 ${log("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
      } else if (encodeChar(str, i)) {
        const newIssue = encodeChar(str, i);
        console.log(
          `2298 ${`\u001b[${31}m${`██`}\u001b[${39}m`} new issue: ${JSON.stringify(
            newIssue,
            null,
            0
          )}`
        );
        rawIssueStaging.push(newIssue);
        console.log(
          `2306 push above issue to ${`\u001b[${36}m${`rawIssueStaging`}\u001b[${39}m`}`
        );
      }
    }

    // catch the ending of whitespace chunks:
    if (
      !doNothingUntil &&
      logWhitespace.startAt !== null &&
      str[i].trim().length
    ) {
      // 1. catch the whitespace before closing slash, within a tag
      console.log(
        `2319 ${`\u001b[${90}m${`inside whitespace chunks ending clauses`}\u001b[${39}m`}`
      );
      if (
        logTag.tagNameStartAt !== null &&
        logAttr.attrStartAt === null &&
        (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= i) &&
        (str[i] === ">" ||
          (str[i] === "/" && "<>".includes(str[right(str, i)])))
      ) {
        console.log("2328");
        // we're within a tag but not within an attribute and this is whitespace
        // chunk before closing slash or closing bracket
        let name = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          name = "tag-whitespace-closing-slash-and-bracket";
        }

        retObj.issues.push({
          name: name,
          position: [[logWhitespace.startAt, i]]
        });
        console.log(
          `2341 ${log("push", name, `${`[[${logWhitespace.startAt}, ${i}]]`}`)}`
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
        `2354 ${log("set", "logWhitespace.startAt", logWhitespace.startAt)}`
      );
    }

    // catch linebreaks within the whitespace chunks:
    if ((!doNothingUntil && str[i] === "\n") || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log(
          `2363 ${log(
            "set",
            "logWhitespace.includesLinebreaks",
            logWhitespace.includesLinebreaks
          )}`
        );
      }
      logWhitespace.lastLinebreakAt = i;
      console.log(
        `2372 ${log(
          "set",
          "logWhitespace.lastLinebreakAt",
          logWhitespace.lastLinebreakAt
        )}`
      );
    }

    console.log("2380");
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
      console.log("2392 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      console.log(
        `2397 ${log(
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
        console.log(`2410 stray quote clauses`);
        let addSpace; // default value - false
        let strayCharsEndAt = i + 1;
        // traverse forward and chomp all quote-like characters. When first non-
        // quote character is met, stop, evaluate is it whitespace or not.
        // If not, we need to compensate this missing whitespace, to add a space
        if (str[i + 1].trim().length) {
          if (charIsQuote(str[i + 1]) || str[i + 1] === "=") {
            // traverse forward
            console.log(`\u001b[${36}m${`2419 traverse forward`}\u001b[${39}m`);
            for (let y = i + 1; y < len; y++) {
              console.log(
                `\u001b[${36}m${`2422 str[${y}] = str[y]`}\u001b[${39}m`
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
          retObj.issues.push({
            name: "tag-stray-character",
            position: [[i, strayCharsEndAt, " "]]
          });
          console.log(
            `2444 ${log(
              "push",
              "tag-stray-character",
              `${`[[${i}, ${strayCharsEndAt}, " "]]`}`
            )}`
          );
        } else {
          retObj.issues.push({
            name: "tag-stray-character",
            position: [[i, strayCharsEndAt]]
          });
          console.log(
            `2456 ${log(
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
      console.log(`2474 within catching the start of the tag name clauses`);
      logTag.tagNameStartAt = i;
      console.log(
        `2477 ${log("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)}`
      );
      if (logTag.closing === null) {
        // set it to boolean to signify we set it
        logTag.closing = false;
        console.log(`2482 ${log("set", "logTag.closing", logTag.closing)}`);
      }

      // rule "space-between-opening-bracket-and-tag-name":
      if (logTag.tagStartAt < i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
        console.log(
          `2492 ${log(
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
      retObj.issues.push({
        name: "tag-name-lowercase",
        position: [[i, i + 1, str[i].toLowerCase()]]
      });
      console.log(
        `2517 ${log(
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
        `2548 catch the beginning of a tag ${`\u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`}`
      );
      if (logTag.tagStartAt === null) {
        // mark it
        logTag.tagStartAt = i;
        console.log(
          `2554 ${log("set", "logTag.tagStartAt", logTag.tagStartAt)}`
        );
      } else if (tagOnTheRight(str, i)) {
        // maybe it's a case of unclosed tag, where a tag should be closed right before here,
        // and here a new tag starts?
        console.log(
          `2560 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new tag starts`
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
            `2576 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)`
          );
          // console.log("2578 ███████████████████████████████████████v");
          // console.log(
          //   `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} = ${JSON.stringify(
          //     logTag,
          //     null,
          //     4
          //   )}`
          // );
          // console.log("2586 ███████████████████████████████████████^");
          // 1. find out what's the last character on the left:
          const lastNonWhitespaceOnLeft = left(str, i);
          console.log(
            `2590 ${log(
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
              `2603 ${log("set", "logTag.tagEndAt", logTag.tagEndAt)}`
            );
          } else {
            // 2-2 add a closing bracket
            // 2-2-1. push the issue:
            retObj.issues.push({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, i, ">"]]
            });
            console.log(
              `2613 ${log(
                "push",
                "tag-missing-closing-bracket",
                `${`[[${lastNonWhitespaceOnLeft + 1}, ${i}, ">"]]`}`
              )}`
            );
          }
          // 3. take care of issues at rawIssueStaging:
          if (rawIssueStaging.length) {
            console.log(
              `2623 let's process all ${
                rawIssueStaging.length
              } raw character issues at staging`
            );
            rawIssueStaging.forEach(issueObj => {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                retObj.issues.push(issueObj);
                console.log(`2630 ${log("push", "issueObj", issueObj)}`);
              } else {
                console.log(
                  `2633 discarding ${JSON.stringify(issueObj, null, 4)}`
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
            `2647 ${log("reset", "logTag & logAttr && rawIssueStaging")}`
          );

          // 6. mark the beginning of a new tag:
          logTag.tagStartAt = i;
          console.log(
            `2653 ${log("set", "logTag.tagStartAt", logTag.tagStartAt)}`
          );
        } else {
          console.log(`2656 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS`);
          // 1.
          if (rawIssueStaging.length) {
            // merge any issues that are on or after dud tag
            console.log(
              `2661 ${log("processing", "rawIssueStaging", rawIssueStaging)}`
            );
            console.log(
              `2664 ${log("log", "logTag.tagStartAt", logTag.tagStartAt)}`
            );
            console.log(
              `2667 ${`\u001b[${31}m${JSON.stringify(
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
                retObj.issues.push(issueObj);
                console.log(`2680 ${log("push", "issueObj", issueObj)}`);
              } else {
                console.log("");
                console.log(
                  `2684 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
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
            console.log(`2696 wipe rawIssueStaging`);
            rawIssueStaging = [];
          }

          // 2. wipe tag issues, this tag is dud
          if (tagIssueStaging.length) {
            console.log(`2702 ${log("wipe", "tagIssueStaging")}`);
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
        `2717 within catching a closing bracket of a tag, >, clauses`
      );
      // 1. merge any staging:
      if (tagIssueStaging.length) {
        console.log(
          `2722 concat ${`\u001b[${33}m${`tagIssueStaging`}\u001b[${39}m`} then wipe`
        );
        retObj.issues = retObj.issues.concat(tagIssueStaging);
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        // merge any issues that are up to the tag's beginning character's index
        console.log(
          `2730 ${log("processing", "rawIssueStaging", rawIssueStaging)}`
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
            retObj.issues.push(issueObj);
            console.log(`2756 ${log("push", "issueObj", issueObj)}`);
          } else {
            console.log("");
            console.log(
              `2760 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log(`2772 wipe rawIssueStaging`);
        rawIssueStaging = [];
      }

      // if it's a <script> tag, activate the doNothingUntil
      // permanently, until further notice
      if (logTag.tagName === "script") {
        doNothingUntil = true;
        doNothingUntilReason = "script tag";
        console.log(
          `2782 ${log(
            "set",
            "doNothingUntil",
            doNothingUntil
          )}, then reset logTag and rawIssueStaging`
        );
      }

      // 2. reset:
      resetLogTag();
      resetLogAttr();
      console.log(`2793 ${log("reset", "logTag & logAttr")}`);
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
        `2836 ${log(
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
          `2853 ${log(
            "set",
            "charFurtherOnTheLeft",
            charFurtherOnTheLeft,
            "str[charFurtherOnTheLeft]",
            str[charFurtherOnTheLeft]
          )}`
        );
      } else if (str[charOnTheLeft] === "<") {
        // we have a new opening <script> tag!
        console.log(`2863 opening <script> tag!`);
      }

      doNothingUntil = charOnTheRight + 1;
      console.log(`2867 ${log("set", "doNothingUntil", doNothingUntil)}`);
    }

    // reset whitespace
    if (!doNothingUntil && str[i].trim().length) {
      resetLogWhitespace();
      console.log(`2873 ${log("reset", "logWhitespace")}`);
    }

    // catch the string's end, EOF EOL
    // if (!doNothingUntil && !str[i + 1]) {
    if (!str[i + 1]) {
      console.log("2879");
      // this (str[i]) is the last character
      if (rawIssueStaging.length) {
        console.log("2882");
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
          console.log("2893");
          // 1. push all issues before index at which the tag started
          rawIssueStaging.forEach(issueObj => {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              retObj.issues.push(issueObj);
              console.log(`2898 ${log("push", "issueObj", issueObj)}`);
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
          console.log(`2913 wipe rawIssueStaging`);
          rawIssueStaging = [];

          // 2. add missing closing bracket
          retObj.issues.push({
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
            `2928 ${log(
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
          retObj.issues = retObj.issues.concat(rawIssueStaging);
          console.log(
            `2946 concat, then wipe ${`\u001b[${33}m${`rawIssueStaging`}\u001b[${39}m`}`
          );
          rawIssueStaging = [];
        }
      }
    }

    const output = {
      logTag: false,
      logAttr: false,
      logEspTag: true,
      logWhitespace: false,
      logLineEndings: false,
      retObj: true,
      tagIssueStaging: false,
      rawIssueStaging: false
    };
    console.log(
      `${
        Object.keys(output).some(key => output[key])
          ? `${`\u001b[${31}m${`█ `}\u001b[${39}m`}`
          : ""
      }${
        output.logTag && logTag.tagStartAt !== null
          ? `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} ${JSON.stringify(
              logTag,
              null,
              4
            )}; `
          : ""
      }${
        output.logAttr && logAttr.attrStartAt !== null
          ? `${`\u001b[${33}m${`logAttr`}\u001b[${39}m`} ${JSON.stringify(
              logAttr,
              null,
              4
            )}; `
          : ""
      }${
        output.logEspTag && logEspTag.attrStartAt !== null
          ? `${`\u001b[${33}m${`logEspTag`}\u001b[${39}m`} ${JSON.stringify(
              logEspTag,
              null,
              4
            )}; `
          : ""
      }${
        output.logWhitespace && logWhitespace.startAt !== null
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
      console.log("3086 CR clearly prevalent");
      // replace all LF and CRLF with CR
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (
      logLineEndings.lf.length > logLineEndings.crlf.length &&
      logLineEndings.lf.length > logLineEndings.cr.length
    ) {
      console.log("3108 LF clearly prevalent");
      // replace all CR and CRLF with LF
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length > logLineEndings.lf.length &&
      logLineEndings.crlf.length > logLineEndings.cr.length
    ) {
      console.log("3130 CRLF clearly prevalent");
      // replace all CR and LF with CRLF
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length === logLineEndings.lf.length &&
      logLineEndings.lf.length === logLineEndings.cr.length
    ) {
      console.log("3152 same amount of each type of EOL");
      // replace CR and CRLF with LF
      // no need for checking the existance (if logLineEndings.crlf.length ...):
      logLineEndings.crlf.forEach(eolEntryArr => {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(eolEntryArr => {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (
      logLineEndings.cr.length === logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      console.log("3171 CR & CRLF are prevalent over LF");
      // replace CR and LF with CRLF
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          retObj.issues.push({
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
        "3196 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF"
      );
      // replace CRLF and CR with LF
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          retObj.issues.push({
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
  // console.log(`3254 ${log("log", "htmlEntityFixes", htmlEntityFixes)}`);

  // push any broken issues we found:
  console.log(
    `3258 \u001b[${33}m${`█`}\u001b[${39}m\u001b[${31}m${`█`}\u001b[${39}m\u001b[${34}m${`█`}\u001b[${39}m ${log(
      "log",
      "htmlEntityFixes",
      htmlEntityFixes
    )}`
  );

  if (isArr(htmlEntityFixes) && htmlEntityFixes.length) {
    // filter out the existing raw unencoded ampersand issues
    retObj.issues = retObj.issues
      .filter(issueObj => {
        return (
          issueObj.name !== "bad-character-unencoded-ampersand" ||
          htmlEntityFixes.every(entityFixObj => {
            return issueObj.position[0][0] !== entityFixObj.position[0][0];
          })
        );
      })
      .concat(htmlEntityFixes ? htmlEntityFixes : []);
  }

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
  console.log("3292 BEFORE FIX");
  console.log(`3293 ${log("log", "retObj.issues", retObj.issues)}`);

  retObj.fix =
    isArr(retObj.issues) && retObj.issues.length
      ? merge(
          retObj.issues.reduce((acc, obj) => {
            return acc.concat(obj.position);
          }, [])
        )
      : null;
  console.log(`3303 ${log("log", "retObj.fix", retObj.fix)}`);

  return retObj;
}

export { lint, version, errors };

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
