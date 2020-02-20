import { allHtmlAttribs } from "html-all-known-attributes";
import { matchLeft, matchRight, matchRightIncl } from "string-match-left-right";
import { left, right } from "string-left-right";
import clone from "lodash.clonedeep";

// functions which detect where tokens start:
import startsComment from "./util/startsComment";
import startsTag from "./util/startsTag";
import startsEsp from "./util/startsEsp";

import {
  charSuitableForHTMLAttrName,
  allHTMLTagsKnownToHumanity,
  charSuitableForTagName,
  // isLowerCaseLetter,
  // isUppercaseLetter,
  // secondToLastChar,
  // isNumOrNumStr,
  espLumpBlacklist,
  isLatinLetter,
  // isLowercase,
  flipEspTag,
  // secondChar,
  // firstChar,
  // lastChar,
  espChars,
  isStr
} from "./util";

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

// https://html.spec.whatwg.org/multipage/syntax.html#elements-2
const voidTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

// Rules which might wrap the media queries, for example:
// @supports (display: grid) {...
// const atRulesWhichMightWrapStyles = ["media", "supports", "document"];

const charsThatEndCSSChunks = ["{", "}", ","];

// TODO remove:
// same as used in string-extract-class-names
// const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`;

function tokenizer(str, originalOpts) {
  //
  //
  //
  //
  //
  //
  //
  // INSURANCE
  // ---------------------------------------------------------------------------
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.tagCb &&
    typeof originalOpts.tagCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(
        originalOpts.tagCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.charCb &&
    typeof originalOpts.charCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(
        originalOpts.charCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.reportProgressFunc &&
    typeof originalOpts.reportProgressFunc !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(
        originalOpts.reportProgressFunc,
        null,
        4
      )}`
    );
  }

  //
  //
  //
  //
  //
  //
  //
  // OPTS
  // ---------------------------------------------------------------------------

  const defaults = {
    tagCb: null,
    charCb: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };
  const opts = Object.assign({}, defaults, originalOpts);

  //
  //
  //
  //
  //
  //
  //
  // VARS
  // ---------------------------------------------------------------------------

  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing; // normally set to a number, index until where to do nothing
  let styleStarts = false; // flag used to instruct content after <style> to toggle type="css"

  // when we compile the token, we fill this object:
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null
  };
  function tokenReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    console.log(
      `185 ${`\u001b[${36}m${`██ tokenReset():`}\u001b[${39}m`} tokenReset() called`
    );
    token = clone(tokenDefault);
    attribReset();
    return token;
  }

  // same for attributes:
  let attrib = {};
  const attribDefault = {
    attribName: null,
    attribNameRecognised: null,
    attribNameStartsAt: null,
    attribNameEndsAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValue: null,
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStart: null,
    attribEnd: null
  };
  function attribReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    attrib = clone(attribDefault);
  }

  // PS. we need this contraption in order to keep a single source of truth
  // of the token format - we'll improve and change the format of the default
  // object throughout the releases - it's best when its format comes from single
  // place, in this case, "tokenDefault".

  // Initial resets:
  tokenReset();
  attribReset();

  // ---------------------------------------------------------------------------

  let selectorChunkStartedAt;
  // For example:
  //
  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |                 |
  //         <-selector chunk ->
  //
  //

  // ---------------------------------------------------------------------------

  //
  //
  //
  //
  //
  //
  //
  // INNER FUNCTIONS
  // ---------------------------------------------------------------------------

  // When we enter the double quotes or any other kind of "layer", we need to
  // ignore all findings until the "layer" is exited. Here we keep note of the
  // closing strings which exit the current "layer". There can be many of them,
  // nested and escaped and so on.
  let layers = [];
  // example of contents:
  // [
  //     {
  //         type: "simple",
  //         value: "'",
  //     },
  //     {
  //         type: "esp",
  //         guessedClosingLump: "%}"
  //     }
  // ]
  // there can be two types of layer values: simple strings to match html/css
  // token types and complex, to match esp tokens heuristically, where we don't
  // know exact ESP tails but we know set of characters that suspected "tail"
  // should match.
  //
  // RETURNS: bool false or integer, length of a matched ESP lump.
  function matchLayerLast(str, i, matchFirstInstead) {
    if (!layers.length) {
      return false;
    }
    const whichLayerToMatch = matchFirstInstead
      ? layers[0]
      : layers[layers.length - 1];
    if (whichLayerToMatch.type === "simple") {
      return str[i] === flipEspTag(whichLayerToMatch.value);
    } else if (whichLayerToMatch.type === "esp") {
      if (!espChars.includes(str[i])) {
        return false;
      }
      // so the first character is from ESP tags list
      // 1. extract esp tag lump
      let wholeEspTagLump = "";
      const len = str.length;
      for (let y = i; y < len; y++) {
        if (espChars.includes(str[y])) {
          wholeEspTagLump = wholeEspTagLump + str[y];
        } else {
          break;
        }
      }

      console.log(
        `294 ${`\u001b[${33}m${`wholeEspTagLump`}\u001b[${39}m`} = ${JSON.stringify(
          wholeEspTagLump,
          null,
          4
        )}`
      );
      console.log(
        `301 ${`\u001b[${33}m${`whichLayerToMatch.openingLump`}\u001b[${39}m`} = ${JSON.stringify(
          whichLayerToMatch.openingLump,
          null,
          4
        )}`
      );

      // if lump is tails+heads, report the length of tails only:
      // {%- a -%}{%- b -%}
      //        ^
      //      we're talking about this lump of tails and heads
      if (
        wholeEspTagLump &&
        whichLayerToMatch.openingLump &&
        wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length
      ) {
        if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
          // no need to extract tails, heads "{%-" were confirmed in example:
          // {%- a -%}{%- b -%}
          //          ^
          //         here
          console.log(
            `323 RETURN ${wholeEspTagLump.length -
              whichLayerToMatch.openingLump.length}`
          );
          return wholeEspTagLump.length - whichLayerToMatch.openingLump.length;
        }
        // else {
        // imagine case like:
        // {%- aa %}{% bb %}
        // opening heads were {%-, flipped were -%}. Now when we take lump %}{%
        // and match, the dash will be missing.
        // What we're going to do is we'll split the lump where last matched
        // continuous chunk ends (%} in example above) with condition that
        // at least one character from ESP-list follows, which is not part of
        // guessed closing lump.
        let uniqueCharsListFromGuessedClosingLumpArr = whichLayerToMatch.guessedClosingLump
          .split("")
          .reduce((acc, curr) => {
            if (!acc.includes(curr)) {
              return acc.concat([curr]);
            }
            return acc;
          }, []);
        console.log(
          `346 ${`\u001b[${33}m${`uniqueCharsListFromGuessedClosingLumpArr`}\u001b[${39}m`} = ${JSON.stringify(
            uniqueCharsListFromGuessedClosingLumpArr,
            null,
            0
          )}`
        );

        let found = 0;
        for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
          console.log(`355 char = ${wholeEspTagLump[y]}`);

          if (
            !uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            ) &&
            found > 1
          ) {
            console.log(`363 RETURN ${y}`);
            return y;
          }

          if (
            uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            )
          ) {
            found++;
            uniqueCharsListFromGuessedClosingLumpArr = uniqueCharsListFromGuessedClosingLumpArr.filter(
              el => el !== wholeEspTagLump[y]
            );
            console.log(
              `377 SET found = ${found}; uniqueCharsListFromGuessedClosingLumpArr = ${JSON.stringify(
                uniqueCharsListFromGuessedClosingLumpArr,
                null,
                0
              )}`
            );
          }
        }
      } else if (
        // match every character from the last "layers" complex-type entry must be
        // present in the extracted lump
        whichLayerToMatch.guessedClosingLump
          .split("")
          .every(char => wholeEspTagLump.includes(char))
      ) {
        console.log(`392 RETURN ${wholeEspTagLump.length}`);
        return wholeEspTagLump.length;
      }
    }
  }

  function matchLayerFirst(str, i) {
    return matchLayerLast(str, i, true);
  }

  function pingCharCb(incomingToken) {
    // no cloning, no reset
    if (opts.charCb) {
      opts.charCb(incomingToken);
    }
  }

  function pingTagCb(incomingToken) {
    if (opts.tagCb) {
      console.log(
        `412 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
          incomingToken,
          null,
          4
        )}`
      );
      opts.tagCb(clone(incomingToken));
      // tokenReset();
    }
  }

  function dumpCurrentToken(token, i) {
    console.log(
      `425 ${`\u001b[${35}m${`dumpCurrentToken()`}\u001b[${39}m`}; incoming token=${JSON.stringify(
        token,
        null,
        0
      )}; i = ${`\u001b[${33}m${i}\u001b[${39}m`}`
    );
    // Let's ensure it was not a token with trailing whitespace, because now is
    // the time to separate it and report it as a standalone token.
    // Also, the following clause will catch the unclosed tags like
    // <a href="z" click here</a>
    if (
      !["text", "esp"].includes(token.type) &&
      token.start !== null &&
      token.start < i &&
      ((str[i - 1] && !str[i - 1].trim().length) || str[i] === "<")
    ) {
      console.log(
        `442 ${
          str[i] === "<"
            ? "this token was an unclosed tag"
            : "this token indeed had trailing whitespace"
        }`
      );
      // this ending is definitely a token ending. Now the question is,
      // maybe we need to split all gathered token contents into two:
      // maybe it's a tag and a whitespace? or an unclosed tag?
      // in some cases, this token.end will be only end of a second token,
      // we'll need to find where this last chunk started and terminate the
      // previous token (one which started at the current token.start) there.
      token.end = left(str, i) + 1;
      console.log(
        `456 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        } (last two characters ending at token.end: ${JSON.stringify(
          str[token.end - 1],
          null,
          4
        )} + ${JSON.stringify(str[token.end], null, 4)})`
      );
      if (token.type === "tag" && str[token.end - 1] !== ">") {
        console.log(
          `466 ${`\u001b[${35}m${`██ UNCLOSED TAG CASES`}\u001b[${39}m`}`
        );
        // we need to potentially shift the token.end left, imagine:
        // <a href="z" click here</a>
        //                       ^
        //               we are here ("i" value), that's token.end currently
        //
        // <a href="z" click here</a>
        //            ^
        //        token.end should be here
        //

        // PLAN: take current token, if there are attributes, validate
        // each one of them, terminate at the point of the first smell.
        // If there are no attributes, terminate at the end of a tag name

        let cutOffIndex = token.tagNameEndsAt;
        if (Array.isArray(token.attribs) && token.attribs.length) {
          console.log(
            `485 ${`\u001b[${32}m${`██ validate all attributes`}\u001b[${39}m`}`
          );
          // initial cut-off point is token.tagNameEndsAt
          console.log(`488 SET cutOffIndex = ${cutOffIndex}`);
          // with each validated attribute, push the cutOffIndex forward:
          for (let i = 0, len = token.attribs.length; i < len; i++) {
            console.log(
              `492 ${`\u001b[${36}m${`token.attribs[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
                token.attribs[i],
                null,
                4
              )}`
            );
            if (token.attribs[i].attribNameRecognised) {
              cutOffIndex = token.attribs[i].attribEnd;
              console.log(
                `501 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`
              );

              // small tweak - consider this:
              // <a href="z" click here</a>
              //            ^
              //         this space in particular

              // that space above should belong to the tag's index range,
              // unless the whitespace is bigger than 1:
              // <a href="z"   click here</a>

              if (
                str[cutOffIndex + 1] &&
                !str[cutOffIndex].trim().length &&
                str[cutOffIndex + 1].trim().length
              ) {
                cutOffIndex++;
                console.log(
                  `520 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`
                );
              }
            } else {
              console.log(`524 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
              // delete false attributes from token.attribs
              if (i === 0) {
                // if it's the first attribute and it's already
                // not suitable, for example:
                // <a click here</a>
                // all attributes ("click", "here") are removed:
                token.attribs = [];
              } else {
                // leave only attributes up to i-th
                token.attribs = token.attribs.splice(0, i);
              }
              console.log(
                `537 ${`\u001b[${32}m${`CALCULATED`}\u001b[${39}m`} ${`\u001b[${33}m${`token.attribs`}\u001b[${39}m`} = ${JSON.stringify(
                  token.attribs,
                  null,
                  4
                )}`
              );

              // in the end stop the loop:
              break;
            }
          }
        }

        token.end = cutOffIndex;
        console.log(`551 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        console.log(`553 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        token = tokenReset();
        initToken("text", cutOffIndex);
        console.log(
          `557 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );
      } else {
        console.log(`562 ${`\u001b[${35}m${`██ HEALTHY TAG`}\u001b[${39}m`}`);
        console.log(`563 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        console.log(`565 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        token = tokenReset();
        // if there was whitespace after token's end:
        if (!str[i - 1].trim().length) {
          console.log(`569 indeed there was whitespace after token's end`);
          initToken("text", left(str, i) + 1);
          console.log(
            `572 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
        }
      }

      console.log(
        `580 FINALLY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
    }

    // if a token is already being recorded, end it
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        // (esp tags will have it set already)
        token.end = i;
        console.log(
          `594 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
      }
      console.log(`599 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
      pingTagCb(token);

      console.log(`602 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
      token = tokenReset();
    }
  }

  function atRuleWaitingForClosingCurlie() {
    return (
      layers.length &&
      layers[layers.length - 1].type === "at" &&
      isObj(layers[layers.length - 1].token) &&
      Number.isInteger(layers[layers.length - 1].token.openingCurlyAt) &&
      !Number.isInteger(layers[layers.length - 1].token.closingCurlyAt)
    );
  }

  function initToken(type, start) {
    // we mutate the object on the parent scope, so no Object.assign here
    attribReset();
    if (type === "tag") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.tagNameStartsAt = null;
      token.tagNameEndsAt = null;
      token.tagName = null;
      token.recognised = null;
      token.closing = false;
      token.void = false;
      token.pureHTML = true; // meaning there are no esp bits
      token.esp = [];
      token.kind = null;
      token.attribs = [];
    } else if (type === "comment") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.kind = "simple";
      token.closing = false;
    } else if (type === "rule") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
      token.selectorsStart = null;
      token.selectorsEnd = null;
      token.selectors = [];
    } else if (type === "at") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.identifier = null;
      token.identifierStartsAt = null;
      token.identifierEndsAt = null;
      token.query = null;
      token.queryStartsAt = null;
      token.queryEndsAt = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
    } else if (type === "text") {
      token.type = type;
      token.start = start;
      token.end = null;
    } else if (type === "esp") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.head = null;
      token.tail = null;
      token.kind = null;
    }
  }

  //
  //
  //
  //
  //
  //
  //
  // THE MAIN LOOP
  // ---------------------------------------------------------------------------

  // We deliberately step 1 character outside of str length
  // to simplify the algorithm. Thusly, it's i <= len not i < len:
  for (let i = 0; i <= len; i++) {
    //
    //
    //
    //
    //                                THE TOP
    //                                ███████
    //
    //
    //
    //

    // Logging:
    // -------------------------------------------------------------------------
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // Progress:
    // -------------------------------------------------------------------------
    if (!doNothing && str[i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(
            Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2
            )
          );
        }
      } else if (len >= 2000) {
        // defaults:
        // opts.reportProgressFuncFrom = 0
        // opts.reportProgressFuncTo = 100

        currentPercentageDone =
          opts.reportProgressFuncFrom +
          Math.floor(
            (i / len) *
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom)
          );

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
          console.log(`735 DONE ${currentPercentageDone}%`);
        }
      }
    }

    // turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    if (
      styleStarts &&
      token.type &&
      !["rule", "at", "text"].includes(token.type)
    ) {
      console.log(
        `749 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
      styleStarts = false;
      console.log(
        `757 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
      );
    }

    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log(`763 TURN OFF doNothing`);
    }

    // catch the curly tails of at-rules
    // -------------------------------------------------------------------------

    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      console.log(`770 inside catch the curly tails of at-rules' clauses`);

      // if (token.type === null && str[i] === "}") {
      // if (str[i] === "}") {
      if (str[i] === "}") {
        if (
          token.type === null ||
          token.type === "text" ||
          (token.type === "rule" && token.openingCurlyAt === null)
        ) {
          // rule token must end earlier
          if (token.type === "rule") {
            console.log(`782 complete the "rule" token`);
            token.end = left(str, i) + 1;
            console.log(
              `785 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                token,
                null,
                4
              )} before pinging`
            );
            pingTagCb(token);
            token = tokenReset();

            // if there was trailing whitespace, initiate it
            if (left(str, i) < i - 1) {
              console.log(
                `797 initiate whitespace from [${left(str, i) + 1}, ${i}]`
              );
              initToken("text", left(str, i) + 1);
              console.log(
                `801 ${`\u001b[${33}m${`token`}\u001b[${39}m`} now = ${JSON.stringify(
                  token,
                  null,
                  4
                )}`
              );
            }
          }

          console.log(`810 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);

          console.log(
            `814 ${`\u001b[${35}m${`██`}\u001b[${39}m`} restore at rule from layers`
          );
          const poppedToken = layers.pop();
          token = poppedToken.token;
          console.log(`818 new token: ${JSON.stringify(token, null, 4)}`);

          // then, continue on "at" rule's token...

          token.closingCurlyAt = i;
          token.end = i + 1;
          console.log(
            `825 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4
            )} before pinging`
          );
          pingTagCb(token);
          token = tokenReset();

          // skip the remaining of the program clauses for this index
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i].trim().length) {
        // terminate the text token, all the non-whitespace characters comprise
        // rules because we're inside the at-token, it's CSS!
        token.end = i;
        console.log(
          `842 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )} before pinging`
        );
        pingTagCb(token);
        token = tokenReset();
      }
    }

    if (token.end && token.end === i) {
      // if value was captured from the past, push it now
      console.log(`855 call dumpCurrentToken()`);
      if (token.tagName === "style" && !token.closing) {
        styleStarts = true;
        console.log(
          `859 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = true`
        );
      }
      // we need to retain the information after tag was dumped to tagCb() and wiped
      dumpCurrentToken(token, i);

      console.log(`865 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} layers`);
      layers = [];
    }

    //
    //
    //
    //
    //                               MIDDLE
    //                               ██████
    //
    //
    //
    //

    // record "layers" like entering double quotes
    // -------------------------------------------------------------------------
    if (!doNothing) {
      if (
        ["tag", "esp", "rule", "at"].includes(token.type) &&
        token.kind !== "cdata"
      ) {
        console.log(`887 inside "tag", "esp", "rule" or "at" layers clauses`);
        if (
          [`"`, `'`, `(`, `)`].includes(str[i]) &&
          !(
            // below, we have insurance against single quotes, wrapped with quotes:
            // "'" or '"' - templating languages might put single quote as a sttring
            // character, not meaning wrapped-something.
            (
              [`"`, `'`].includes(str[left(str, i)]) &&
              str[left(str, i)] === str[right(str, i)]
            )
          )
        ) {
          if (matchLayerLast(str, i)) {
            // maybe it's the closing counterpart?
            layers.pop();
            console.log(`903 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
            console.log(
              `912 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i]
                },
                null,
                4
              )}`
            );
          }
        }
      } else if (
        token.type === "comment" &&
        ["only", "only-not"].includes(token.kind)
      ) {
        console.log(`927 inside "comments" layers clauses`);
        if ([`[`, `]`].includes(str[i])) {
          if (matchLayerLast(str, i)) {
            // maybe it's the closing counterpart?
            layers.pop();
            console.log(`932 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
            console.log(
              `941 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i]
                },
                null,
                4
              )}`
            );
          }
        }
      }

      console.log(
        `955 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
          layers,
          null,
          4
        )}`
      );
    }

    // catch the start of at rule's identifierStartsAt
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.start) &&
      i >= token.start &&
      !Number.isInteger(token.identifierStartsAt) &&
      str[i] &&
      str[i].trim().length &&
      str[i] !== "@"
    ) {
      // the media identifier's "entry" requirements are deliberately loose
      // because we want to catch errors there, imagine somebody mistakenly
      // adds a comma, @,media
      // or adds a space, @ media
      token.identifierStartsAt = i;
      console.log(
        `982 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierStartsAt`}\u001b[${39}m`} = ${
          token.identifierStartsAt
        }`
      );
    }

    // catch the end of the query
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.queryStartsAt) &&
      !Number.isInteger(token.queryEndsAt) &&
      "{};".includes(str[i])
    ) {
      if (str[i - 1] && str[i - 1].trim().length) {
        token.queryEndsAt = i;
      } else {
        // trim the trailing whitespace:
        // @media (max-width: 600px) {
        //                          ^
        //                        this
        //
        token.queryEndsAt = left(str, i) + 1;
        // left() stops "to the left" of a character, if you used that index
        // for slicing, that character would be included, in our case,
        // @media (max-width: 600px) {
        //                         ^
        //            that would be index of this bracket
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      console.log(
        `1015 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryEndsAt`}\u001b[${39}m`} = ${
          token.queryEndsAt
        }; ${`\u001b[${33}m${`token.query`}\u001b[${39}m`} = "${token.query}"`
      );
    }

    // catch the curlies inside the query
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      str[i] === "{" &&
      token.identifier &&
      !Number.isInteger(token.openingCurlyAt)
    ) {
      token.openingCurlyAt = i;
      console.log(
        `1033 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
          token.openingCurlyAt
        }`
      );

      // push so far gathered token into layers
      layers.push({
        type: "at",
        token
      });
      console.log(
        `1044 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} "at" token to layers`
      );

      // look what's inside, maybe curlies pair is empty, or maybe there's
      // something weird like a tag?
      const charIdxOnTheRight = right(str, i);
      console.log(
        `1051 ${`\u001b[${33}m${`charIdxOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
          charIdxOnTheRight,
          null,
          4
        )}`
      );

      if (str[charIdxOnTheRight] === "}") {
        // empty media query
        token.closingCurlyAt = charIdxOnTheRight;
        console.log(
          `1062 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
            token.closingCurlyAt
          }; ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} until ${doNothing}`
        );

        // submit the token
        console.log(
          `1069 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )} before pinging`
        );
        pingTagCb(token);

        // skip the characters until after that closing curlie
        doNothing = charIdxOnTheRight;
      } else {
        // rule token starts
        tokenReset();

        // imagine we've got:
        // <style>
        // @media (max-width: 600px) {
        //   .xx[z] {a:1;}
        // }
        // </style>

        // we are at "{" which follows "600px)".

        // we need to submit this line break and indentation, a text token

        if (charIdxOnTheRight > i + 1) {
          console.log(
            `1096 submit this whitespace token, [${i +
              1}, ${charIdxOnTheRight}]`
          );
          initToken("text", i + 1);
          token.end = charIdxOnTheRight;
          // submit the token
          console.log(
            `1103 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4
            )} before pinging`
          );
          pingTagCb(token);
        }

        tokenReset();
        initToken("rule", charIdxOnTheRight);

        doNothing = charIdxOnTheRight;
        console.log(
          `1117 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
            token.type
          }; set ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} until ${doNothing}`
        );
      }
    }

    // catch the start of the query
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      token.identifier &&
      str[i].trim().length &&
      !Number.isInteger(token.queryStartsAt)
    ) {
      token.queryStartsAt = i;
      console.log(
        `1138 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryStartsAt`}\u001b[${39}m`} = ${
          token.queryStartsAt
        }`
      );
    }

    // catch the end of at rule's identifierStartsAt
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.identifierStartsAt) &&
      i >= token.start &&
      (!str[i].trim().length || "()".includes(str[i])) &&
      !Number.isInteger(token.identifierEndsAt)
    ) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
      console.log(
        `1158 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierEndsAt`}\u001b[${39}m`} = ${
          token.identifierEndsAt
        }; ${`\u001b[${33}m${`token.identifier`}\u001b[${39}m`} = "${
          token.identifier
        }"`
      );
    }

    // catch the end of a CSS chunk
    // -------------------------------------------------------------------------

    // charsThatEndCSSChunks:  } , {
    if (
      token.type === "rule" &&
      Number.isInteger(selectorChunkStartedAt) &&
      (charsThatEndCSSChunks.includes(str[i]) ||
        (str[i] &&
          !str[i].trim().length &&
          charsThatEndCSSChunks.includes(str[right(str, i)])))
    ) {
      console.log(
        `1179 FIY, ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} was ${selectorChunkStartedAt}`
      );
      console.log(
        `1182 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to selectors[]: ${JSON.stringify(
          {
            value: str.slice(selectorChunkStartedAt, i),
            selectorStarts: selectorChunkStartedAt,
            selectorEnds: i
          },
          null,
          4
        )}`
      );
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: i
      });

      selectorChunkStartedAt = undefined;
      console.log(
        `1200 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`}`
      );

      token.selectorsEnd = i;
      console.log(
        `1205 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
          token.selectorsEnd
        }`
      );
    }

    // catch the beginning of a token
    // -------------------------------------------------------------------------
    // below, the part:
    // (token.type !== "esp" || token.tail.includes(str[i]))
    // means that we won't end ESP token and start HTML token unless anticipated tail
    // character is matched

    if (!doNothing) {
      if (startsTag(str, i, token, layers, styleStarts)) {
        //
        //
        //
        // TAG STARTING
        //
        //
        //
        console.log(`1227 (html) tag opening`);

        console.log(`1229 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);

        console.log(`1232 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();

        // add other HTML-specific keys onto the object
        // second arg is "start" key:
        initToken("tag", i);

        console.log(
          `1240 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );

        if (styleStarts) {
          styleStarts = false;
          console.log(
            `1248 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
          );
        }

        // set the kind:

        if (
          matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "doctype";
          console.log(
            `1262 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "cdata", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "cdata";
          console.log(
            `1274 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "xml", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "xml";
          console.log(
            `1286 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        }
      } else if (startsComment(str, i, token, layers, styleStarts)) {
        //
        //
        //
        // COMMENT STARTING
        //
        //
        //
        console.log(`1299 comment opening`);

        console.log(`1301 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);

        console.log(`1304 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();

        // add other HTML-specific keys onto the object
        // second arg is "start" key:
        initToken("comment", i);

        console.log(
          `1312 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );

        // set "closing"
        if (str[i] === "-") {
          token.closing = true;
          console.log(
            `1321 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        } else if (
          matchRightIncl(str, i, ["<![e", "<[endif", "<!endif"], {
            trimBeforeMatching: true
          })
        ) {
          token.closing = true;
          token.kind = "only";
          console.log(
            `1333 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }; ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${token.kind}`
          );
        }

        if (styleStarts) {
          styleStarts = false;
          console.log(
            `1342 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
          );
        }
      } else if (startsEsp(str, i, token, layers, styleStarts)) {
        //
        //
        //
        // ESP TAG STARTING
        //
        //
        //
        console.log(`1353 ESP tag opening`);

        // ESP tags can't be entered from after CSS at-rule tokens or
        // normal CSS rule tokens

        //
        //
        //
        // FIRST, extract the tag opening and guess the closing judging from it
        let wholeEspTagLump = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        console.log(
          `1371 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wholeEspTagLump = ${wholeEspTagLump}`
        );
        console.log(
          `1374 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
        console.log(
          `1381 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )}`
        );

        // lump can't end with attribute's ending, that is, something like:
        // <frameset cols="**">
        // that's a false positive
        if (
          !espLumpBlacklist.includes(wholeEspTagLump) &&
          (!Array.isArray(layers) ||
            !layers.length ||
            layers[layers.length - 1].type !== "simple" ||
            layers[layers.length - 1].value !== str[i + wholeEspTagLump.length])
        ) {
          // check the "layers" records - maybe it's a closing part of a set?
          let lengthOfClosingEspChunk;

          if (layers.length && matchLayerLast(str, i)) {
            console.log(
              `1403 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against the last layer`
            );
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            console.log(
              `1407 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                console.log(
                  `1420 SET ${`\u001b[${32}m${`token.end`}\u001b[${39}m`} = ${
                    token.end
                  }`
                );
              }
              console.log(
                `1426 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                  token,
                  null,
                  4
                )} before pinging`
              );
              dumpCurrentToken(token, i);

              console.log(
                `1435 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`
              );
              tokenReset();
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers.pop();
            console.log(`1443 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else if (layers.length && matchLayerFirst(str, i)) {
            console.log(
              `1446 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against first layer`
            );
            console.log(
              `1449 wipe all layers, there were strange unclosed characters`
            );
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            console.log(
              `1453 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                console.log(
                  `1466 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4
                  )} before pinging`
                );
              }
              dumpCurrentToken(token, i);

              console.log(
                `1476 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`
              );
              tokenReset();
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers = [];
            console.log(`1484 ${`\u001b[${32}m${`WIPE`}\u001b[${39}m`} layers`);
          } else {
            console.log(
              `1487 closing part of a set ${`\u001b[${31}m${`NOT MATCHED`}\u001b[${39}m`} - means it's a new opening`
            );
            console.log(`1489 push new layer`);
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i
            });
            console.log(
              `1497 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "esp",
                  openingLump: wholeEspTagLump,
                  guessedClosingLump: flipEspTag(wholeEspTagLump),
                  position: i
                },
                null,
                4
              )}`
            );
            console.log(
              `1509 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );

            // also, if it's a standalone ESP token, terminate the previous token
            // and start recording a new-one

            if (
              !(
                token.type === "tag" &&
                (token.kind === "comment" ||
                  // it's attribute's contents:
                  (Number.isInteger(attrib.attribStart) &&
                    !Number.isInteger(attrib.attribEnd)))
              )
            ) {
              console.log(
                `1529 ${`\u001b[${36}m${`██`}\u001b[${39}m`} standalone ESP tag`
              );
              dumpCurrentToken(token, i);

              initToken("esp", i);
              console.log(
                `1535 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );
              token.tail = flipEspTag(wholeEspTagLump);
              console.log(
                `1543 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tail`}\u001b[${39}m`} = ${
                  token.tail
                }`
              );
              token.head = wholeEspTagLump;
            }
          }

          // do nothing for the second and following characters from the lump
          doNothing =
            i +
            (lengthOfClosingEspChunk
              ? lengthOfClosingEspChunk
              : wholeEspTagLump.length);
          console.log(
            `1558 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }

        //
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log(`1565`);
          // 1. if there's whitespace, ping it as text
          if (str[i] && !str[i].trim().length) {
            console.log(`1568 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
            tokenReset();
            initToken("text", i);
            token.end = right(str, i) || str.length;
            console.log(
              `1573 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
            pingTagCb(token);

            console.log(`1581 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
            tokenReset();

            // consider <style> ...  EOL - nothing inside, whitespace leading to
            // end of the string
            if (
              right(str, i) &&
              !["{", "}", "<"].includes(str[right(str, i)])
            ) {
              const idxOnTheRight = right(str, i);
              initToken(
                str[idxOnTheRight] === "@" ? "at" : "rule",
                idxOnTheRight
              );
              console.log(
                `1596 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );

              // jump over the whitespace if such follows
              if (str[i + 1] && !str[i + 1].trim().length) {
                doNothing = right(str, i);
                console.log(
                  `1607 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
                );
              }
            }
          } else if (str[i]) {
            // css starts right away after opening tag
            console.log(`1613 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
            tokenReset();

            // for broken code cases, all characters go as "text"
            if ("}".includes(str[i])) {
              console.log(
                `1619 ${`\u001b[${31}m${`BAD CHARACTER`}\u001b[${39}m`}, initiated "text" node`
              );
              initToken("text", i);
              doNothing = i + 1;
              console.log(
                `1624 SET ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            } else {
              // add other CSS rule-specific keys onto the object
              // second arg is "start" key:
              initToken(str[i] === "@" ? "at" : "rule", i);
            }

            console.log(
              `1633 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
          }
        } else if (str[i]) {
          // finally, the last, default token type is "text"
          console.log(`1640 ${`\u001b[${31}m${`reset`}\u001b[${39}m`} token`);

          // if token were not reassigned, the reset woudln't work:
          token = tokenReset();

          initToken("text", i);
          console.log(
            `1647 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
        }
      } else if (
        token.type === "text" &&
        styleStarts &&
        str[i].trim().length &&
        !"{},".includes(str[i])
      ) {
        // Text token inside styles can be either whitespace chunk
        // or rogue characters. In either case, inside styles, when
        // "styleStarts" is on, non-whitespace character terminates
        // this text token and "rule" token starts
        console.log(`1662 ██ terminate text token, rule starts`);

        console.log(`1664 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);

        console.log(`1667 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();

        initToken("rule", i);
      }

      // END OF if (!doNothing)
    }

    // catch the start of a css chunk
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i] &&
      str[i].trim().length &&
      !"{}".includes(str[i]) &&
      !Number.isInteger(selectorChunkStartedAt) &&
      !Number.isInteger(token.openingCurlyAt)
    ) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        console.log(
          `1690 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`
        );

        if (token.selectorsStart === null) {
          token.selectorsStart = i;
          console.log(
            `1696 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsStart`}\u001b[${39}m`} = ${
              token.selectorsStart
            }`
          );
        }
      } else {
        // this contraption is needed to catch commas and assign
        // correctly broken chunk range, [selectorsStart, selectorsEnd]
        token.selectorsEnd = i + 1;
        console.log(
          `1706 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
            token.selectorsEnd
          }`
        );
      }
    }

    // in comment type, "only" kind tokens, submit square brackets to layers
    // -------------------------------------------------------------------------
    // ps. it's so that we can rule out greater-than signs

    if (token.type === "comment" && ["only", "only-not"].includes(token.kind)) {
      if (str[i] === "[") {
        // submit it to layers
        // TODO
      }
    }

    // catch the ending of a token
    // -------------------------------------------------------------------------
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log(
          `1730 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
        // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (
        token.type === "comment" &&
        !layers.length &&
        token.kind === "simple" &&
        ((str[token.start] === "<" &&
          str[i] === "-" &&
          matchLeft(str, i, "!-", {
            trimBeforeMatching: true
          })) ||
          (str[token.start] === "-" &&
            str[i] === ">" &&
            matchLeft(str, i, "--", {
              trimBeforeMatching: true
            })))
      ) {
        if (matchRightIncl(str, i, ["-[if"])) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--[if gte mso 9]>
          //     ^
          //    we're here
          //
          console.log(
            `1759 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL DETECTED`}\u001b[${39}m`}`
          );
          token.kind = "only";
          console.log(
            `1763 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else {
          // if it's a simple HTML comment, <!--, end it right here
          console.log(
            `1770 ${`\u001b[${32}m${`${token.kind} comment token's ending caught`}\u001b[${39}m`}`
          );
          token.end = i + 1;
          console.log(
            `1774 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
        }
        // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (token.type === "comment" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log(
          `1784 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        console.log(`1794 POSSIBLE ESP TAILS`);
        // extract the whole lump of ESP tag characters:
        let wholeEspTagClosing = "";

        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[y];
          } else {
            break;
          }
        }
        console.log(`1805 wholeEspTagClosing = ${wholeEspTagClosing}`);

        // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here

        // find the breaking point where tails end
        if (wholeEspTagClosing.length > token.head.length) {
          console.log(
            `1815 wholeEspTagClosing.length = ${`\u001b[${33}m${
              wholeEspTagClosing.length
            }\u001b[${39}m`} > token.head.length = ${`\u001b[${33}m${
              token.head.length
            }\u001b[${39}m`}`
          );
          // in order for this to be tails + new heads, the total length should be
          // at least bigger than heads.
          //
          // For example: Responsys heads: $( - 2 chars. Tails = ) - 1 char.
          // Responsys total of closing tail + head - )$( - 3 chars.
          // That's more than head, 2 chars.
          //
          // For example, eDialog heads: _ - 1 char. Tails: __ - 2 chars.
          // eDialog total of closing tail +  head = 3 chars.
          // That's more than head, 1 char.
          //
          // And same applies to Nujnucks, even considering mix of diferent
          // heads.
          //
          // Another important point - first character in ESP literals.
          // Even if there are different types of literals, more often than not
          // first character is constant. Variations are often inside of
          // the literals pair - for example Nunjucks {{ and {% and {%-
          // the first character is always the same.
          //
          const headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            console.log(`1843 - chunk ends with the same heads`);
            // we have a situation like
            // zzz *|aaaa|**|bbb|*
            //           ^
            //         we're here and we extracted a chunk |**| and we're
            //         trying to split it into two.
            //
            // by the way, that's very lucky because node.heads (opening *| above)
            // is confirmed - we passed those heads and we know they are exact.
            // Now, our chunk ends with exactly the same new heads.
            // The only consideration is error scenario, heads intead of tails.
            // That's why we'll check, tags excluded, that's the length left:
            // |**| minus heads *| equals |* -- length 2 -- happy days.
            // Bad scenario:
            // *|aaaa*|bbb|*
            //       ^
            //      we're here
            //
            // *| minus heads *| -- length 0 -- raise an error!

            token.end = i + wholeEspTagClosing.length - token.head.length;
            console.log(
              `1865 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `1871 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            console.log(
              `1876 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `1882 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            console.log(`1890`);
            // We're very luck because heads and tails are using different
            // characters, possibly opposite brackets of some kind.
            // That's Nunjucks, Responsys but no eDialog patterns.
            const firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              0,
              wholeEspTagClosing.indexOf(headsFirstChar)
            );
            const secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              wholeEspTagClosing.indexOf(headsFirstChar)
            );
            console.log(
              `${`\u001b[${33}m${`firstPartOfWholeEspTagClosing`}\u001b[${39}m`} = ${JSON.stringify(
                firstPartOfWholeEspTagClosing,
                null,
                4
              )}`
            );
            console.log(
              `${`\u001b[${33}m${`secondPartOfWholeEspTagClosing`}\u001b[${39}m`} = ${JSON.stringify(
                secondPartOfWholeEspTagClosing,
                null,
                4
              )}`
            );
            // imagine we cliced off (Nunjucks): -%}{%-
            // if every character from anticipated tails (-%}) is present in the front
            // chunk, Bob's your uncle, that's tails with new heads following.
            if (
              firstPartOfWholeEspTagClosing.length &&
              secondPartOfWholeEspTagClosing.length &&
              token.tail
                .split("")
                .every(char => firstPartOfWholeEspTagClosing.includes(char))
            ) {
              console.log(`1925 definitely tails + new heads`);
              token.end = i + firstPartOfWholeEspTagClosing.length;
              console.log(
                `1928 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`
              );
              doNothing = token.end;
              console.log(
                `1934 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            }
          } else {
            // so heads and tails don't contain unique character, and moreso,
            // starting-one, PLUS, second set is different.
            // For example, ESP heads/tails can be *|zzz|*
            // Imaginery example, following heads would be variation of those
            // above, ^|zzz|^
            console.log(`CASE #2.`);
            // TODO
            // for now, return defaults, from else scenario below:
            // we consider this whole chunk is tails.
            token.end = i + wholeEspTagClosing.length;
            console.log(
              `1949 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `1955 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          }
          console.log(`1958`);
        } else {
          // we consider this whole chunk is tails.
          token.end = i + wholeEspTagClosing.length;
          console.log(
            `1963 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
          doNothing = token.end;
          console.log(
            `1969 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }
      }
      // END OF if (!doNothing)
    }

    // Catch the end of a tag name
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "tag" &&
      Number.isInteger(token.tagNameStartsAt) &&
      !Number.isInteger(token.tagNameEndsAt)
    ) {
      console.log(`1985 catch the end of a tag name clauses`);

      // tag names can be with numbers, h1
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        console.log(
          `1991 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
            token.tagNameEndsAt
          }`
        );

        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        console.log(
          `1998 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
            token.tagName
          }`
        );

        // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.
        if (voidTags.includes(token.tagName)) {
          token.void = true;
          console.log(
            `2009 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.void`}\u001b[${39}m`} = ${
              token.void
            }`
          );
        }

        token.recognised =
          allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) ||
          ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
        console.log(
          `2019 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.recognised`}\u001b[${39}m`} = ${
            token.recognised
          }`
        );
      }
    }

    // Catch the start of a tag name:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "tag" &&
      !Number.isInteger(token.tagNameStartsAt) &&
      Number.isInteger(token.start) &&
      token.start < i
    ) {
      // MULTIPLE ENTRY!
      // Consider closing tag's slashes and tag name itself.

      if (str[i] === "/") {
        token.closing = true;
        console.log(
          `2042 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
            token.closing
          }`
        );
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        console.log(
          `2049 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameStartsAt`}\u001b[${39}m`} = ${
            token.tagNameStartsAt
          }`
        );
        // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name
        if (!token.closing) {
          token.closing = false;
          console.log(
            `2058 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        }
      } else {
        // TODO - tag opening followed by not-a-letter?
        // <?a>
      }
    }

    // catch the end of a tag attribute's name
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      Number.isInteger(attrib.attribNameStartsAt) &&
      i > attrib.attribNameStartsAt &&
      attrib.attribNameEndsAt === null &&
      !charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`2080 inside catch the tag attribute name end clauses`);
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.includes(attrib.attribName);
      console.log(
        `2085 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndsAt`}\u001b[${39}m`} = ${
          attrib.attribNameEndsAt
        }; ${`\u001b[${33}m${`attrib.attribName`}\u001b[${39}m`} = ${JSON.stringify(
          attrib.attribName,
          null,
          0
        )}`
      );

      // maybe there's a space in front of equal, <div class= "">
      if (str[i] && !str[i].trim().length && str[right(str, i)] === "=") {
        console.log(`2096 equal on the right`);
      } else if (
        (str[i] && !str[i].trim().length) ||
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        // a value-less attribute
        attrib.attribEnd = i;
        console.log(
          `2105 SET ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndsAt`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );

        // push and wipe
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }

    // catch the start of a tag attribute's name
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      str[i] &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      Number.isInteger(token.tagNameEndsAt) &&
      i > token.tagNameEndsAt &&
      attrib.attribStart === null &&
      charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`2128 inside catch the tag attribute name start clauses`);
      attrib.attribStart = i;
      attrib.attribNameStartsAt = i;
      console.log(
        `2132 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribStart`}\u001b[${39}m`} = ${
          attrib.attribStart
        }; ${`\u001b[${33}m${`attrib.attribNameStartsAt`}\u001b[${39}m`} = ${
          attrib.attribNameStartsAt
        }`
      );
    }

    // catch the curlies inside CSS rule
    // -------------------------------------------------------------------------

    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !Number.isInteger(token.openingCurlyAt)) {
        token.openingCurlyAt = i;
        console.log(
          `2147 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
            token.openingCurlyAt
          }`
        );
      } else if (
        str[i] === "}" &&
        Number.isInteger(token.openingCurlyAt) &&
        !Number.isInteger(token.closingCurlyAt)
      ) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        console.log(
          `2159 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
            token.closingCurlyAt
          }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${token.end}`
        );

        console.log(`2164 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        tokenReset();
      }
    }

    // Catch the end of a tag attribute's value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "tag" &&
      Number.isInteger(attrib.attribValueStartsAt) &&
      i >= attrib.attribValueStartsAt &&
      attrib.attribValueEndsAt === null
    ) {
      console.log(`2180 inside catching end of a tag attr clauses`);
      if (`'"`.includes(str[i])) {
        // TODO - detect mismatching quotes
        if (
          str[attrib.attribOpeningQuoteAt] === str[i] &&
          !layers.some(layerObj => layerObj.type === "esp")
        ) {
          console.log(`2187 opening and closing quotes matched!`);
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          attrib.attribEnd = i + 1;
          console.log(
            `2193 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribClosingQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
              attrib.attribValueEndsAt
            }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
              attrib.attribValue
            }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
              attrib.attribEnd
            }`
          );

          // 2. push and wipe
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (
        attrib.attribOpeningQuoteAt === null &&
        ((str[i] && !str[i].trim().length) ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        // ^ either whitespace or tag's closing or ESP literal's start ends
        // the attribute's value if there are no quotes
        console.log(`2216 opening quote was missing, terminate attr val here`);

        attrib.attribValueEndsAt = i;
        attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
        attrib.attribEnd = i;
        console.log(
          `2222 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
            attrib.attribValueEndsAt
          }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
            attrib.attribValue
          }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );

        // 2. push and wipe
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }

    // Catch the start of a tag attribute's value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "tag" &&
      !Number.isInteger(attrib.attribValueStartsAt) &&
      Number.isInteger(attrib.attribNameEndsAt) &&
      attrib.attribNameEndsAt <= i &&
      str[i].trim().length
    ) {
      console.log(`2248 inside catching attr value start clauses`);
      if (
        str[i] === "=" &&
        !`'"=`.includes(str[right(str, i)]) &&
        !espChars.includes(str[right(str, i)]) // it might be an ESP literal
      ) {
        attrib.attribValueStartsAt = right(str, i);
        console.log(
          `2256 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartsAt
          }`
        );
      } else if (`'"`.includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartsAt = i + 1;
        }
        console.log(
          `2266 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
            attrib.attribOpeningQuoteAt
          }; ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartsAt
          }`
        );
      }
    }

    //
    //
    //
    //
    //
    //                       "PARSING" ERROR CLAUSES
    //                       ███████████████████████
    //
    //
    //
    //
    //

    // Catch raw closing brackets inside attribute's contents, maybe they
    // mean the tag ending and maybe the closing quotes are missing?
    if (
      str[i] === ">" &&
      token.type === "tag" &&
      attrib.attribStart !== null &&
      attrib.attribEnd === null
    ) {
      console.log(
        `2297 ${`\u001b[${31}m${`██`}\u001b[${39}m`} bracket within attribute's value`
      );
      // Idea is simple: we have to situations:
      // 1. this closing bracket is real, closing bracket
      // 2. this closing bracket is unencoded raw text

      // Now, we need to distinguish these two cases.

      // It's easiest done traversing right until the next closing bracket.
      // If it's case #1, we'll likely encounter a new tag opening (or nothing).
      // If it's case #2, we'll likely encounter a tag closing or attribute
      // combo's equal+quote

      let thisIsRealEnding = false;

      if (str[i + 1]) {
        // Traverse then
        for (let y = i + 1; y < len; y++) {
          console.log(
            `2316 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
              str[y],
              null,
              0
            )}`}\u001b[${39}m`}`
          );

          // if we reach the closing counterpart of the quotes, terminate
          if (
            attrib.attribOpeningQuoteAt !== null &&
            str[y] === str[attrib.attribOpeningQuoteAt]
          ) {
            console.log(
              `2329 closing quote (${
                str[attrib.attribOpeningQuoteAt]
              }) found, ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
            );
            if (y !== i + 1 && str[y - 1] !== "=") {
              thisIsRealEnding = true;
              console.log(
                `2336 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
              );
            }
            break;
          } else if (str[y] === ">") {
            // must be real tag closing, we just tackle missing quotes
            // TODO - missing closing quotes
            break;
          } else if (str[y] === "<") {
            thisIsRealEnding = true;
            console.log(
              `2347 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
            );

            // TODO - pop only if type === "simple" and it's the same opening
            // quotes of this attribute
            layers.pop();
            console.log(
              `2354 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
                layers,
                null,
                4
              )}`
            );

            console.log(`2361 break`);
            break;
          } else if (!str[y + 1]) {
            // if end was reached and nothing caught, that's also positive sign
            thisIsRealEnding = true;
            console.log(
              `2367 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
            );

            console.log(`2370 break`);
            break;
          }
        }
      } else {
        console.log(`2375 string ends so this was the bracket`);
        thisIsRealEnding = true;
      }

      //
      //
      //
      // FINALLY,
      //
      //
      //

      // if "thisIsRealEnding" was set to "true", terminate the tag here.
      if (thisIsRealEnding) {
        token.end = i + 1;
        console.log(
          `2391 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );

        // set and push the attribute's records, just closing quote will be
        // null and possibly value too

        if (
          Number.isInteger(attrib.attribValueStartsAt) &&
          attrib.attribValueStartsAt < i &&
          str.slice(attrib.attribValueStartsAt, i).trim().length
        ) {
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          // otherwise, nulls stay
        } else {
          attrib.attribValueStartsAt = null;
        }

        attrib.attribEnd = i;
        console.log(
          `2413 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}  ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );

        // 2. push and wipe
        console.log(
          `2420 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`
        );
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }

    //
    //
    //
    //
    //                               BOTTOM
    //                               ██████
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
    // ping charCb
    // -------------------------------------------------------------------------

    if (str[i] && opts.charCb) {
      console.log(
        `2449 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
          {
            type: token.type,
            chr: str[i],
            i
          },
          null,
          4
        )}`
      );
      pingCharCb({
        type: token.type,
        chr: str[i],
        i
      });
    }

    //
    //
    //
    //
    //
    //
    //
    // catch end of the string
    // -------------------------------------------------------------------------

    // notice there's no "doNothing"
    if (!str[i] && token.start !== null) {
      token.end = i;
      console.log(`2479 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
      pingTagCb(token);
    }

    //
    //
    //
    //
    //
    //
    //
    // logging:
    // -------------------------------------------------------------------------

    console.log(
      `${`\u001b[${90}m${`==========================================\n██ token: ${JSON.stringify(
        token,
        null,
        4
      )}${
        attrib.attribStart !== null
          ? `\n██ attrib: ${JSON.stringify(attrib, null, 4)}`
          : ""
      }${
        layers.length ? `\n██ layers: ${JSON.stringify(layers, null, 4)}` : ""
      }`}\u001b[${39}m`}${
        doNothing
          ? `\n${`\u001b[${31}m${`DO NOTHING UNTIL ${doNothing}`}\u001b[${39}m`}`
          : ""
      }`
    );
    console.log(
      `${`\u001b[${90}m${`styleStarts = ${styleStarts}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`selectorChunkStartedAt = ${selectorChunkStartedAt}`}\u001b[${39}m`}`
    );
  }
}

// -----------------------------------------------------------------------------

export default tokenizer;
