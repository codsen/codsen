/* eslint no-return-assign: 0, no-bitwise: 0 */

import {
  matchLeft,
  matchRight,
  matchLeftIncl,
  matchRightIncl,
} from "string-match-left-right";
import clone from "lodash.clonedeep";
import { left, right } from "string-left-right";
import attributeEnds from "is-html-attribute-closing";
import { allHtmlAttribs } from "html-all-known-attributes";
import charSuitableForHTMLAttrName from "is-char-suitable-for-html-attr-name";
import getWholeEspTagLumpOnTheRight from "./util/getWholeEspTagLumpOnTheRight";
import matchLayerLast from "./util/matchLayerLast";
import startsComment from "./util/startsComment";
import startsTag from "./util/startsTag";
import startsEsp from "./util/startsEsp";
import {
  charSuitableForTagName,
  isTagNameRecognised,
  xBeforeYOnTheRight,
  espLumpBlacklist,
  isLatinLetter,
  veryEspChars,
  flipEspTag,
  espChars,
  isStr,
} from "./util/util";

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
  "wbr",
];

// Rules which might wrap the media queries, for example:
// @supports (display: grid) {...
// const atRulesWhichMightWrapStyles = ["media", "supports", "document"];

const charsThatEndCSSChunks = ["{", "}", ","];
const BACKTICK = "\x60";

// TODO remove:
// same as used in string-extract-class-names
// const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`;

function tokenizer(str, originalOpts) {
  const start = Date.now();
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
    tagCbLookahead: 0,
    charCb: null,
    charCbLookahead: 0,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
  };
  const opts = { ...defaults, ...originalOpts };

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

  // opts.*CbLookahead allows to request "x"-many tokens "from the future"
  // to be reported upon each token. You can check what's coming next.
  // To implement this, we need to stash "x"-many tokens and only when enough
  // have been gathered, array.shift() the first one and ping the callback
  // with it, along with "x"-many following tokens. Later, in the end,
  // we clean up stashes and report only as many as we have.

  // The stashes will be LIFO (last in first out) style arrays:
  const tagStash = [];
  const charStash = [];

  // when we compile the token, we fill this object:
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null,
    value: null,
  };
  function tokenReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    console.log(
      `202 ${`\u001b[${36}m${`██ tokenReset():`}\u001b[${39}m`} tokenReset() called`
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
    attribValueRaw: null,
    attribValue: [],
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStart: null,
    attribEnd: null,
    attribLeft: null,
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

  let parentTokenToBackup;
  // We use it for nested ESP tags - for example, <td{% z %}>
  // The esp tag {% z %} is nested among the tag's attributes:
  // {
  //   type: "tag",
  //   start: 0,
  //   end: 11,
  //   value: `<td{% z %}>`,
  //   attribs: [
  //     {
  //       type: "esp",
  //       start: 3,
  //       end: 10,
  //       value: "{% z %}",
  //       head: "{%",
  //       tail: "%}",
  //       kind: null,
  //     },
  //   ],
  // }
  //
  // to allow this, we have to save the current, parent token, in case above,
  // <td...> and then initiate the ESP token, which later will get nested

  let attribToBackup;
  // We use it when ESP tag is inside the attribute:
  // <a b="{{ c }}d">
  //
  // we need to back up both tag and attrib objects, assemble esp tag, then
  // restore both and stick it inside the "attrib"'s array "attribValue":
  //
  // attribValue: [
  //   {
  //     type: "esp",
  //     start: 6,
  //     end: 13,
  //     value: "{{ c }}",
  //     head: "{{",
  //     tail: "}}",
  //   },
  //   {
  //     type: "text",
  //     start: 13,
  //     end: 14,
  //     value: "d",
  //   },
  // ],

  let lastNonWhitespaceCharAt;

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
  const layers = [];
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

  // used by both tag and character callbacks:
  function reportFirstFromStash(stash, cb, lookaheadLength) {
    console.time("reportFirstFromStash()");
    console.log(
      `342 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ██ ${`\u001b[${33}m${`START`}\u001b[${39}m`}`
    );
    // start to assemble node we're report to the callback cb1()
    const currentElem = stash.shift();
    // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them

    // that's the container where they'll sit:
    const next = [];

    for (let i = 0; i < lookaheadLength; i++) {
      console.log(`i = ${i}`);
      // we want as many as "lookaheadLength" from stash but there might be
      // not enough there
      if (stash[i]) {
        next.push(clone(stash[i]));
        console.log(
          `359 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} currentElem[2].next now = ${JSON.stringify(
            currentElem[2] && currentElem[2].next
              ? currentElem[2].next
              : undefined,
            null,
            4
          )}`
        );
      } else {
        console.log(
          `369 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${31}m${`STOP`}\u001b[${39}m`} - there are not enough elements in stash`
        );
        break;
      }
    }

    // finally, ping the callback with assembled element:
    console.log(
      `377 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${32}m${`PING CB`}\u001b[${39}m`} with ${JSON.stringify(
        currentElem,
        null,
        4
      )}`
    );
    cb(currentElem, next);
    console.timeEnd("reportFirstFromStash()");
  }

  function pingCharCb(incomingToken) {
    console.time("pingCharCb()");
    // no cloning, no reset
    if (opts.charCb) {
      // if there were no stashes, we'd call the callback like this:
      // opts.charCb(incomingToken);

      // 1. push to stash
      charStash.push(incomingToken);

      // 2. is there are enough tokens in the stash, ping the first-one
      console.log(
        `399 ${
          charStash.length > opts.charCbLookahead
            ? `${`\u001b[${36}m${`pingCharCb()`}\u001b[${39}m`}: ${`\u001b[${32}m${`ENOUGH VALUES IN CHAR STASH`}\u001b[${39}m`}`
            : `${`\u001b[${36}m${`pingCharCb()`}\u001b[${39}m`}: ${`\u001b[${31}m${`NOT ENOUGH VALUES IN CHAR STASH, MOVE ON`}\u001b[${39}m`}`
        }`
      );
      if (charStash.length > opts.charCbLookahead) {
        reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
        console.log(
          `408 ${`\u001b[${90}m${`██ charStash`}\u001b[${39}m`} = ${JSON.stringify(
            charStash,
            null,
            4
          )}`
        );
      }
    }
    console.timeEnd("pingCharCb()");
  }

  function pingTagCb(incomingToken) {
    console.time("pingTagCb()");
    if (opts.tagCb) {
      // console.log(
      //   `419 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
      //     incomingToken,
      //     null,
      //     4
      //   )}`
      // );

      // opts.tagCb(clone(incomingToken));
      // 1. push to stash
      tagStash.push(incomingToken);

      // 2. is there are enough tokens in the stash, ping the first-one
      console.log(
        `436 ${
          tagStash.length > opts.tagCbLookahead
            ? `${`\u001b[${36}m${`pingCharCb()`}\u001b[${39}m`}: ${`\u001b[${32}m${`ENOUGH VALUES IN TAG STASH`}\u001b[${39}m`}`
            : `${`\u001b[${36}m${`pingCharCb()`}\u001b[${39}m`}: ${`\u001b[${31}m${`NOT ENOUGH VALUES IN TAG STASH, MOVE ON`}\u001b[${39}m`}`
        }`
      );
      if (tagStash.length > opts.tagCbLookahead) {
        reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
        console.log(
          `445 ${`\u001b[${90}m${`██ tagStash`}\u001b[${39}m`} = ${JSON.stringify(
            tagStash,
            null,
            4
          )}`
        );
      }
    }
    console.timeEnd("pingTagCb()");
  }

  function dumpCurrentToken(incomingToken, i) {
    console.time("dumpCurrentToken()");
    console.log(
      `459 ${`\u001b[${35}m${`dumpCurrentToken()`}\u001b[${39}m`}; incoming incomingToken=${JSON.stringify(
        incomingToken,
        null,
        0
      )}; i = ${`\u001b[${33}m${i}\u001b[${39}m`}`
    );
    // Let's ensure it was not a token with trailing whitespace, because now is
    // the time to separate it and report it as a standalone token.
    // Also, the following clause will catch the unclosed tags like
    // <a href="z" click here</a>

    if (
      !["text", "esp"].includes(incomingToken.type) &&
      incomingToken.start !== null &&
      incomingToken.start < i &&
      ((str[~-i] && !str[~-i].trim()) || str[i] === "<")
    ) {
      console.log(`476`);
      // this ending is definitely a token ending. Now the question is,
      // maybe we need to split all gathered token contents into two:
      // maybe it's a tag and a whitespace? or an unclosed tag?
      // in some cases, this token.end will be only end of a second token,
      // we'll need to find where this last chunk started and terminate the
      // previous token (one which started at the current token.start) there.
      incomingToken.end = left(str, i) + 1;
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      console.log(
        `486 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.end`}\u001b[${39}m`} = ${
          incomingToken.end
        } (last two characters ending at incomingToken.end: ${JSON.stringify(
          str[~-incomingToken.end],
          null,
          4
        )} + ${JSON.stringify(
          str[incomingToken.end],
          null,
          4
        )}); ${`\u001b[${33}m${`incomingToken.value`}\u001b[${39}m`} = "${
          incomingToken.value
        }"`
      );
      if (
        incomingToken.type === "tag" &&
        !"/>".includes(str[~-incomingToken.end])
      ) {
        console.log(
          `505 ${`\u001b[${35}m${`██ UNCLOSED TAG CASES`}\u001b[${39}m`}`
        );
        // we need to potentially shift the incomingToken.end left, imagine:
        // <a href="z" click here</a>
        //                       ^
        //               we are here ("i" value), that's incomingToken.end currently
        //
        // <a href="z" click here</a>
        //            ^
        //        incomingToken.end should be here
        //

        // PLAN: take current token, if there are attributes, validate
        // each one of them, terminate at the point of the first smell.
        // If there are no attributes, terminate at the end of a tag name

        let cutOffIndex = incomingToken.tagNameEndsAt || i;
        if (
          Array.isArray(incomingToken.attribs) &&
          incomingToken.attribs.length
        ) {
          console.log(
            `527 ${`\u001b[${32}m${`██ validate all attributes`}\u001b[${39}m`}`
          );
          // initial cut-off point is token.tagNameEndsAt
          console.log(`530 SET cutOffIndex = ${cutOffIndex}`);
          // with each validated attribute, push the cutOffIndex forward:
          for (
            let i2 = 0, len2 = incomingToken.attribs.length;
            i2 < len2;
            i2++
          ) {
            console.log(
              `538 ${`\u001b[${36}m${`incomingToken.attribs[${i2}]`}\u001b[${39}m`} = ${JSON.stringify(
                incomingToken.attribs[i2],
                null,
                4
              )}`
            );
            if (incomingToken.attribs[i2].attribNameRecognised) {
              cutOffIndex = incomingToken.attribs[i2].attribEnd;
              console.log(
                `547 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`
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
                !str[cutOffIndex].trim() &&
                str[cutOffIndex + 1].trim()
              ) {
                cutOffIndex += 1;
                console.log(
                  `566 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`
                );
              }
            } else {
              console.log(`570 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
              // delete false attributes from incomingToken.attribs
              if (i2 === 0) {
                // if it's the first attribute and it's already
                // not suitable, for example:
                // <a click here</a>
                // all attributes ("click", "here") are removed:
                incomingToken.attribs.length = 0;
              } else {
                // leave only attributes up to i2-th
                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
              }
              console.log(
                `583 ${`\u001b[${32}m${`CALCULATED`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.attribs`}\u001b[${39}m`} = ${JSON.stringify(
                  incomingToken.attribs,
                  null,
                  4
                )}`
              );

              // in the end stop the loop:
              break;
            }
          }
        }

        incomingToken.end = cutOffIndex;
        incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
        if (!incomingToken.tagNameEndsAt) {
          incomingToken.tagNameEndsAt = cutOffIndex;
          console.log(
            `601 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.tagNameEndsAt`}\u001b[${39}m`} = ${
              incomingToken.tagNameEndsAt
            }`
          );
        }
        if (
          incomingToken.tagNameStartsAt &&
          incomingToken.tagNameEndsAt &&
          !incomingToken.tagName
        ) {
          incomingToken.tagName = str.slice(
            incomingToken.tagNameStartsAt,
            cutOffIndex
          );
          console.log(
            `616 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.tagName`}\u001b[${39}m`} = ${
              incomingToken.tagName
            }`
          );
          incomingToken.recognised = isTagNameRecognised(incomingToken.tagName);
        }

        console.log(`623 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(incomingToken);
        initToken("text", cutOffIndex);
        console.log(
          `627 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );
      } else {
        console.log(`632 ${`\u001b[${35}m${`██ HEALTHY TAG`}\u001b[${39}m`}`);
        console.log(`633 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(incomingToken);
        console.log(`635 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();
        // if there was whitespace after token's end:
        if (str[~-i] && !str[~-i].trim()) {
          console.log(`639 indeed there was whitespace after token's end`);
          initToken("text", left(str, i) + 1);
          console.log(
            `642 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
        }
      }

      console.log(
        `650 FINALLY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
    }

    // if a token is already being recorded, end it
    if (token.start !== null) {
      console.log(`660 *`);
      if (token.end === null && token.start !== i) {
        // (esp tags will have it set already)
        token.end = i;
        token.value = str.slice(token.start, token.end);
        console.log(
          `666 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }; ${`\u001b[${33}m${`token.value`}\u001b[${39}m`} = ${token.value}`
        );
      }

      // normally we'd ping the token but let's not forget we have token stashes
      // in "attribToBackup" and "parentTokenToBackup"

      console.log(`675 *`);
      if (token.start !== null && token.end) {
        console.log(`677 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
      }
      console.log(`680 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
      token = tokenReset();
    }

    console.log(`684 end of dumpCurrentToken() reached`);
    console.timeEnd("dumpCurrentToken()");
  }

  function atRuleWaitingForClosingCurlie() {
    return (
      layers.length &&
      layers[~-layers.length].type === "at" &&
      isObj(layers[~-layers.length].token) &&
      layers[~-layers.length].token.openingCurlyAt &&
      !layers[~-layers.length].token.closingCurlyAt
    );
  }

  function getNewToken(type, startVal = null) {
    if (type === "tag") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        recognised: null,
        closing: false,
        void: false,
        pureHTML: true, // meaning there are no esp bits
        kind: null,
        attribs: [],
      };
    }
    if (type === "comment") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        closing: false,
        kind: "simple", // or "only" or "not"
      };
    }
    if (type === "rule") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectorsStart: null,
        selectorsEnd: null,
        selectors: [],
      };
    }
    if (type === "at") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        openingCurlyAt: null,
        closingCurlyAt: null,
        identifier: null,
        identifierStartsAt: null,
        identifierEndsAt: null,
        query: null,
        queryStartsAt: null,
        queryEndsAt: null,
      };
    }
    if (type === "text") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
      };
    }
    if (type === "esp") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        head: null,
        headStartsAt: null,
        headEndsAt: null,
        tail: null,
        tailStartsAt: null,
        tailEndsAt: null,
      };
    }
  }

  function initToken(type, startVal) {
    console.time("initToken()");
    // we mutate the object on the parent scope, so no Object.assign here
    attribReset();
    token = getNewToken(type, startVal);
    console.timeEnd("initToken()");
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
    console.time(`\u001b[${90}m${`loop iteration`}\u001b[${39}m`);
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
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 4)
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
          console.log(`847 DONE ${currentPercentageDone}%`);
        }
      }
    }

    // Turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    if (
      styleStarts &&
      token.type &&
      !["rule", "at", "text"].includes(token.type)
    ) {
      console.log(
        `861 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
      styleStarts = false;
      console.log(
        `869 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
      );
    }

    if (doNothing && i >= doNothing) {
      doNothing = false;
      console.log(`875 TURN OFF doNothing`);
    }

    // skip chain of the same-type characters
    // -------------------------------------------------------------------------

    if (
      isLatinLetter(str[i]) &&
      isLatinLetter(str[~-i]) &&
      isLatinLetter(str[i + 1])
    ) {
      console.log(
        `887 ${`\u001b[${32}m${`SKIP`}\u001b[${39}m`} middle of the letters chunk`
      );
      console.timeEnd(`\u001b[${90}m${`loop iteration`}\u001b[${39}m`);
      continue;
    }

    if (
      ` \t\r\n`.includes(str[i]) &&
      // ~- means subtract 1
      str[i] === str[~-i] &&
      str[i] === str[i + 1]
    ) {
      console.log(
        `900 ${`\u001b[${32}m${`SKIP`}\u001b[${39}m`} middle of the spaces chunk`
      );
      console.timeEnd(`\u001b[${90}m${`loop iteration`}\u001b[${39}m`);
      continue;
    }

    // catch the curly tails of at-rules
    // -------------------------------------------------------------------------

    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      console.log(`910 inside catch the curly tails of at-rules' clauses`);

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
            console.log(`922 complete the "rule" token`);
            token.end = left(str, i) + 1;
            token.value = str.slice(token.start, token.end);
            console.log(
              `926 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                token,
                null,
                4
              )} before pinging`
            );
            pingTagCb(token);
            token = tokenReset();

            // if there was trailing whitespace, initiate it
            if (left(str, i) < ~-i) {
              console.log(
                `938 initiate whitespace from [${left(str, i) + 1}, ${i}]`
              );
              initToken("text", left(str, i) + 1);
              console.log(
                `942 ${`\u001b[${33}m${`token`}\u001b[${39}m`} now = ${JSON.stringify(
                  token,
                  null,
                  4
                )}`
              );
            }
          }

          console.log(`951 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);

          console.log(
            `955 ${`\u001b[${35}m${`██`}\u001b[${39}m`} restore at rule from layers`
          );
          const poppedToken = layers.pop();
          token = poppedToken.token;
          console.log(`959 new token: ${JSON.stringify(token, null, 4)}`);

          // then, continue on "at" rule's token...

          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          console.log(
            `967 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4
            )} before pinging`
          );
          pingTagCb(token);
          tokenReset();

          console.log(
            `977 ${`\u001b[${31}m${`skip the remaining of the program clauses for this index`}\u001b[${39}m`}`
          );
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i] && str[i].trim()) {
        // terminate the text token, all the non-whitespace characters comprise
        // rules because we're inside the at-token, it's CSS!
        token.end = i;
        token.value = str.slice(token.start, token.end);
        console.log(
          `987 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )} before pinging`
        );
        pingTagCb(token);
        tokenReset();
      }
    }

    if (token.end && token.end === i) {
      console.log(`999 token was captured in the past, so push it now`);
      if (token.tagName === "style" && !token.closing) {
        styleStarts = true;
        console.log(
          `1003 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = true`
        );
      }
      // we need to retain the information after tag was dumped to tagCb() and wiped
      if (attribToBackup) {
        console.log(`1008 THIS TAG GOES INTO ATTRIBUTE'S attribValue`);

        // 1. restore
        attrib = attribToBackup;
        console.log(
          `1013 ${`\u001b[${35}m${`RESTORE`}\u001b[${39}m`} attrib from stashed, now = ${JSON.stringify(
            attrib,
            null,
            4
          )}`
        );

        // 2. push current token into attrib.attribValue
        console.log(
          `1022 PUSH token to be inside ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}`
        );
        attrib.attribValue.push(token);

        // 3. restore real token
        token = clone(parentTokenToBackup);

        // 4. reset
        attribToBackup = undefined;
        parentTokenToBackup = undefined;

        console.log(
          `1034 ${`\u001b[${33}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )}`
        );
      } else {
        console.log(`1041 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);

        console.log(`1044 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} layers`);
        layers.length = 0;
      }
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
        ["tag", "rule", "at"].includes(token.type) &&
        token.kind !== "cdata"
      ) {
        console.log(
          `1068 ${`\u001b[${36}m${`LAYERS CLAUSES`}\u001b[${39}m`} ("tag", "rule" or "at")`
        );
        if (
          [`"`, `'`, `(`, `)`].includes(str[i]) &&
          !(
            // below, we have insurance against single quotes, wrapped with quotes:
            // "'" or '"' - templating languages might put single quote as a sttring
            // character, not meaning wrapped-something.
            (
              [`"`, `'`, "`"].includes(str[left(str, i)]) &&
              str[left(str, i)] === str[right(str, i)]
            )
          )
        ) {
          if (
            // maybe it's the closing counterpart?
            Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === "simple" &&
            layers[~-layers.length].value === flipEspTag(str[i])
          ) {
            layers.pop();
            console.log(`1090 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[i],
              position: i,
            });
            console.log(
              `1099 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i],
                  position: i,
                },
                null,
                4
              )}`
            );
          }
        }
      } else if (
        token.type === "comment" &&
        ["only", "not"].includes(token.kind)
      ) {
        console.log(`1115 inside "comments" layers clauses`);
        if ([`[`, `]`].includes(str[i])) {
          if (
            // maybe it's the closing counterpart?
            Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === "simple" &&
            layers[~-layers.length].value === flipEspTag(str[i])
          ) {
            // maybe it's the closing counterpart?
            layers.pop();
            console.log(`1126 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[i],
              position: i,
            });
            console.log(
              `1135 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i],
                },
                null,
                4
              )}`
            );
          }
        }
      } else if (
        token.type === "esp" &&
        `'"${BACKTICK}()`.includes(str[i]) &&
        !(
          // below, we have insurance against single quotes, wrapped with quotes:
          // "'" or '"' - templating languages might put single quote as a sttring
          // character, not meaning wrapped-something.
          (
            [`"`, `'`, "`"].includes(str[left(str, i)]) &&
            str[left(str, i)] === str[right(str, i)]
          )
        )
      ) {
        if (
          // maybe it's the closing counterpart?
          Array.isArray(layers) &&
          layers.length &&
          layers[~-layers.length].type === "simple" &&
          layers[~-layers.length].value === flipEspTag(str[i])
        ) {
          // maybe it's the closing counterpart?
          layers.pop();
          console.log(`1168 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);

          console.log(
            `1171 ${`\u001b[${31}m${`skip the remaining of the program clauses for this index`}\u001b[${39}m`}`
          );
          doNothing = i + 1;
        } else if (!`]})>`.includes(str[i])) {
          // it's opening then
          layers.push({
            type: "simple",
            value: str[i],
            position: i,
          });
          console.log(
            `1182 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              {
                type: "simple",
                value: str[i],
              },
              null,
              4
            )}`
          );
        }
      }

      // console.log(
      //   `1094 FIY, currently ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
      //     layers,
      //     null,
      //     4
      //   )}`
      // );
    }

    // catch the start of at rule's identifierStartsAt
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      token.start != null &&
      i >= token.start &&
      !token.identifierStartsAt &&
      str[i] &&
      str[i].trim() &&
      str[i] !== "@"
    ) {
      // the media identifier's "entry" requirements are deliberately loose
      // because we want to catch errors there, imagine somebody mistakenly
      // adds a comma, @,media
      // or adds a space, @ media
      token.identifierStartsAt = i;
      console.log(
        `1222 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierStartsAt`}\u001b[${39}m`} = ${
          token.identifierStartsAt
        }`
      );
    }

    // catch the end of the query
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      token.queryStartsAt != null &&
      !token.queryEndsAt &&
      "{};".includes(str[i])
    ) {
      if (str[~-i] && str[~-i].trim()) {
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
        `1255 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryEndsAt`}\u001b[${39}m`} = ${
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
      !token.openingCurlyAt
    ) {
      token.openingCurlyAt = i;
      console.log(
        `1273 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
          token.openingCurlyAt
        }`
      );

      // push so far gathered token into layers
      layers.push({
        type: "at",
        token,
      });
      console.log(
        `1284 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} "at" token to layers`
      );

      // look what's inside, maybe curlies pair is empty, or maybe there's
      // something weird like a tag?
      const charIdxOnTheRight = right(str, i);
      console.log(
        `1291 ${`\u001b[${33}m${`charIdxOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
          charIdxOnTheRight,
          null,
          4
        )}`
      );

      if (str[charIdxOnTheRight] === "}") {
        // empty media query
        token.closingCurlyAt = charIdxOnTheRight;
        console.log(
          `1302 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
            token.closingCurlyAt
          }; ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} until ${doNothing}`
        );

        // submit the token
        console.log(
          `1309 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
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
            `1336 submit this whitespace token, [${
              i + 1
            }, ${charIdxOnTheRight}]`
          );
          initToken("text", i + 1);
          token.end = charIdxOnTheRight;
          token.value = str.slice(token.start, token.end);
          // submit the token
          console.log(
            `1345 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4
            )} before pinging`
          );
          pingTagCb(token);
        }

        initToken("rule", charIdxOnTheRight);
        token.left = i;
        console.log(
          `1357 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.left`}\u001b[${39}m`} = ${JSON.stringify(
            token.left,
            null,
            4
          )}`
        );

        doNothing = charIdxOnTheRight;
        console.log(
          `1366 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
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
      str[i] &&
      str[i].trim() &&
      !token.queryStartsAt
    ) {
      token.queryStartsAt = i;
      console.log(
        `1388 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryStartsAt`}\u001b[${39}m`} = ${
          token.queryStartsAt
        }`
      );
    }

    // catch the end of at rule's identifierStartsAt
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      token.identifierStartsAt != null &&
      i >= token.start &&
      str[i] &&
      (!str[i].trim() || "()".includes(str[i])) &&
      !token.identifierEndsAt
    ) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
      console.log(
        `1409 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierEndsAt`}\u001b[${39}m`} = ${
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
      selectorChunkStartedAt &&
      (charsThatEndCSSChunks.includes(str[i]) ||
        (str[i] &&
          !str[i].trim() &&
          charsThatEndCSSChunks.includes(str[right(str, i)])))
    ) {
      console.log(
        `1430 FIY, ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} was ${selectorChunkStartedAt}`
      );
      console.log(
        `1433 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to selectors[]: ${JSON.stringify(
          {
            value: str.slice(selectorChunkStartedAt, i),
            selectorStarts: selectorChunkStartedAt,
            selectorEnds: i,
          },
          null,
          4
        )}`
      );
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: i,
      });

      selectorChunkStartedAt = undefined;
      console.log(
        `1451 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`}`
      );

      token.selectorsEnd = i;
      console.log(
        `1456 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
          token.selectorsEnd
        }`
      );
    }

    // catch the beginning of a token
    // -------------------------------------------------------------------------
    if (!doNothing && str[i]) {
      // console.log(
      //   `1260 ███████████████████████████████████████ IS TAG STARTING? ${startsTag(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     styleStarts
      //   )}`
      // );

      // console.log(
      //   `1276 ███████████████████████████████████████ IS COMMENT STARTING? ${startsComment(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     styleStarts
      //   )}`
      // );

      // console.log(
      //   `1533 ███████████████████████████████████████ IS ESP TAG STARTING? ${startsEsp(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     styleStarts
      //   )}`
      // );

      console.log(`1495 main sorting checks start`);

      if (startsTag(str, i, token, layers, styleStarts)) {
        //
        //
        //
        // TAG STARTING
        //
        //
        //
        console.log(`1505 (html) tag opening`);

        if (token.type && token.start !== null) {
          console.log(`1508 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);

          console.log(`1511 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
          tokenReset();
        }

        // add other HTML-specific keys onto the object
        // second arg is "start" key:
        initToken("tag", i);

        console.log(
          `1520 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );

        if (styleStarts) {
          styleStarts = false;
          console.log(
            `1528 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
          );
        }

        // set the kind:

        if (
          matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
          })
        ) {
          token.kind = "doctype";
          console.log(
            `1542 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "cdata", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
          })
        ) {
          token.kind = "cdata";
          console.log(
            `1554 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "xml", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
          })
        ) {
          token.kind = "xml";
          console.log(
            `1566 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
        console.log(`1579 comment opening`);

        if (token.start != null) {
          console.log(`1582 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
        }

        // add other HTML-specific keys onto the object
        // second arg is "start" key:
        initToken("comment", i);

        console.log(
          `1591 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );

        // set "closing"
        if (str[i] === "-") {
          token.closing = true;
          console.log(
            `1600 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        } else if (
          matchRightIncl(str, i, ["<![endif]-->"], {
            i: true,
            trimBeforeMatching: true,
            maxMismatches: 2,
          })
        ) {
          token.closing = true;
          token.kind = "only";
          console.log(
            `1614 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }; ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${token.kind}`
          );
        }

        if (styleStarts) {
          styleStarts = false;
          console.log(
            `1623 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
          );
        }
      } else if (
        startsEsp(str, i, token, layers, styleStarts) &&
        // ensure we're not inside quotes, so it's not an expression within a value
        // ${"${name}${name}${name}${name}"}
        //    ^
        //   we could be here - notice quotes wrapping all around
        //
        (!Array.isArray(layers) ||
          !layers.length ||
          // last layer is not quotes
          layers[~-layers.length].type !== "simple" ||
          ![`'`, `"`].includes(layers[~-layers.length].value) ||
          // or we're within an attribute (so quotes are HTML tag's not esp tag's)
          (attrib && attrib.attribStart && !attrib.attribEnd))
      ) {
        //
        //
        //
        // ESP TAG STARTING
        //
        //
        //
        console.log(`1648 ESP heads or tails start here`);

        // ESP tags can't be entered from after CSS at-rule tokens or
        // normal CSS rule tokens

        //
        //
        //
        // FIRST, extract the tag opening and guess the closing judging from it
        const wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(
          str,
          i,
          layers
        );
        console.log(
          `1663 ██ ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wholeEspTagLumpOnTheRight`}\u001b[${39}m`} = ${wholeEspTagLumpOnTheRight}`
        );
        console.log(
          `1666 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
        console.log(
          `1673 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )}`
        );

        // lump can't end with attribute's ending, that is, something like:
        // <frameset cols="**">
        // that's a false positive
        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
          console.log(`1684`);
          // check the "layers" records - maybe it's a closing part of a set?
          let lengthOfClosingEspChunk;

          let disposableVar;

          if (
            layers.length &&
            //
            // if layer match result is truthy, we take it, otherwise, move on
            // but don't calculate twice!
            // eslint-disable-next-line no-cond-assign
            (lengthOfClosingEspChunk = matchLayerLast(
              wholeEspTagLumpOnTheRight,
              layers
            ))
          ) {
            console.log(
              `1702 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against the last layer`
            );
            console.log(
              `1705 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
                token.tailStartsAt = i;
                token.tailEndsAt = token.end;

                console.log(
                  `1723 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${32}m${`token`}\u001b[${39}m`} = ${token}`
                );
              }

              // activate doNothing until the end of tails because otherwise,
              // mid-tail characters will initiate new tail start clauses
              // and we'll have overlap/false result
              console.log(
                `1731 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
              doNothing = token.tailEndsAt;

              console.log(
                `1736 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                  token,
                  null,
                  4
                )} before pinging`
              );
              // it depends will we ping it as a standalone token or will we
              // nest inside the parent tag among attributes
              if (parentTokenToBackup) {
                console.log(
                  `1746 ${`\u001b[${32}m${`NEST INSIDE THE STASHED TAG`}\u001b[${39}m`}`
                );
                // push token to parent, to be among its attributes

                // 1. ensure key "attribs" exist (thinking about comment tokens etc)
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs.length = 0;
                }

                // 2. push somewhere
                if (attribToBackup) {
                  // 1. restore
                  attrib = attribToBackup;
                  console.log(
                    `1760 ${`\u001b[${35}m${`RESTORE`}\u001b[${39}m`} attrib from stashed, now = ${JSON.stringify(
                      attrib,
                      null,
                      4
                    )}`
                  );

                  // 2. push to attribValue
                  console.log(
                    `1769 PUSH token to be inside ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}`
                  );
                  attrib.attribValue.push(clone(token));

                  // 3. attribToBackup is reset in all cases, below
                } else {
                  // push to attribs
                  console.log(`1776 PUSH token to be among attribs`);
                  parentTokenToBackup.attribs.push(clone(token));
                }

                // 3. parentTokenToBackup becomes token
                token = clone(parentTokenToBackup);
                console.log(
                  `1783 ${`\u001b[${32}m${`RESTORE`}\u001b[${39}m`} ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4
                  )}`
                );

                // 4. resets
                parentTokenToBackup = undefined;
                attribToBackup = undefined;

                // 5. pop layers, remove the opening ESP tag record
                console.log(`1795 POP layers`);
                layers.pop();

                // 6. finally, continue, bypassing the rest of the code in this loop
                console.log(
                  `1800 ${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`
                );
                console.timeEnd(
                  `\u001b[${90}m${`loop iteration`}\u001b[${39}m`
                );
                continue;
              } else {
                console.log(
                  `1808 ${`\u001b[${32}m${`PING AS STANDALONE`}\u001b[${39}m`}`
                );
                dumpCurrentToken(token, i);
              }

              console.log(
                `1814 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`
              );
              tokenReset();
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers.pop();
            console.log(`1822 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else if (
            layers.length &&
            // eslint-disable-next-line no-cond-assign
            (lengthOfClosingEspChunk = matchLayerLast(
              wholeEspTagLumpOnTheRight,
              layers,
              "matchFirst"
            ))
          ) {
            console.log(
              `1833 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against first layer`
            );
            console.log(
              `1836 wipe all layers, there were strange unclosed characters`
            );
            console.log(
              `1839 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                console.log(
                  `1853 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4
                  )} before pinging`
                );
              }
              dumpCurrentToken(token, i);

              console.log(
                `1863 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`
              );
              tokenReset();
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers.length = 0;
            console.log(`1871 ${`\u001b[${32}m${`WIPE`}\u001b[${39}m`} layers`);
          } else if (
            // insurance against stray tails inside attributes:
            // <a b="{ x %}">
            //       ^   ^
            //       |   |
            //       |   we're here
            //       |
            //       |
            //     this opening bracket is incomplete
            //     and therefore not recognised as an opening
            //
            //
            // if ESP character lump we extracted, for example,
            // %} contains a closing character, in this case, a }
            attrib &&
            attrib.attribValue &&
            attrib.attribValue.length &&
            Array.from(
              str.slice(
                attrib.attribValue[~-attrib.attribValue.length].start,
                i
              )
            ).some(
              (char, idx) =>
                wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) &&
                // ensure it's not a false alarm, "notVeryEspChars"
                // bunch, for example, % or $ can be legit characters
                //
                // either it's from "veryEspChars" list so
                // it can be anywhere, not necessarily at the
                // beginning, for example, broken mailchimp:
                // <a b="some text | x *|">
                //                 ^
                //               this is
                //
                (veryEspChars.includes(char) ||
                  // or that character must be the first character
                  // of the attribute's value, for example:
                  // <a b="% x %}">
                  //       ^
                  //     this
                  //
                  // because imagine false positive, legit %:
                  // <a b="Real 5% discount! x %}">
                  //             ^
                  //    definitely not a part of broken opening {%
                  //
                  // it's zero'th index:
                  !idx) &&
                (disposableVar = { char, idx })
            ) &&
            // we're inside attribute
            token.type === "tag" &&
            attrib &&
            attrib.attribValueStartsAt &&
            !attrib.attribValueEndsAt &&
            // last attribute's value element is text-type
            // imagine, the { x from <a b="{ x %}"> would be
            // such unrecognised text:
            attrib.attribValue[~-attrib.attribValue.length] &&
            attrib.attribValue[~-attrib.attribValue.length].type === "text"
          ) {
            console.log(
              `1935 ${`\u001b[${31}m${`██`}\u001b[${39}m`} seems like a stray lump`
            );
            console.log(
              `1938 FIY, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                attrib,
                null,
                4
              )}`
            );
            console.log(
              `1945 FIY, ${`\u001b[${33}m${`disposableVar`}\u001b[${39}m`} = ${JSON.stringify(
                disposableVar,
                null,
                4
              )}`
            );

            console.log(
              `1953 let's convert last attrib.attribValue[] object into ESP-type`
            );

            // token does contain ESP tags, so it's not pure HTML
            token.pureHTML = false;

            const lastAttrValueObj =
              attrib.attribValue[~-attrib.attribValue.length];

            // getNewToken() just creates a new token according
            // the latest (DRY) reference, it doesn't reset
            // the "token" unlike initToken()
            const newTokenToPutInstead = getNewToken(
              "esp",
              lastAttrValueObj.start
            );

            // for remaining values, we need to consider, is there
            // text in front:
            //
            // <a b="{ x %}">
            // vs.
            // <a b="something { x %}">

            if (!disposableVar || !disposableVar.idx) {
              console.log(
                `1979 ${`\u001b[${33}m${`ESP tag is this whole text token`}\u001b[${39}m`}`
              );
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt =
                newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = i;
              newTokenToPutInstead.tailEndsAt =
                i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;

              attrib.attribValue[
                ~-attrib.attribValue.length
              ] = newTokenToPutInstead;
            } else {
              console.log(
                `1995 ${`\u001b[${33}m${`we need to extract frontal part of text token`}\u001b[${39}m`}`
              );
            }
          } else {
            console.log(
              `2000 closing part of a set ${`\u001b[${31}m${`NOT MATCHED`}\u001b[${39}m`} - means it's a new opening`
            );

            // If we've got an unclosed heads and here new heads are starting,
            // pop the last heads in layers - they will never be matched anyway.
            // Let parser/linter deal with it
            if (
              Array.isArray(layers) &&
              layers.length &&
              layers[~-layers.length].type === "esp"
            ) {
              layers.pop();
              console.log(
                `2013 ${`\u001b[${31}m${`POP layers - it was heads without tails`}\u001b[${39}m`}`
              );
            }

            // if we're within a tag attribute, push the last esp token there
            if (attribToBackup) {
              if (!Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue.length = 0;
              }
              attribToBackup.attribValue.push(token);
            }

            console.log(`2025 push new layer`);
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLumpOnTheRight,
              guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
              position: i,
            });
            console.log(
              `2033 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "esp",
                  openingLump: wholeEspTagLumpOnTheRight,
                  guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
                  position: i,
                },
                null,
                4
              )}`
            );
            console.log(
              `2045 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );

            // also, if it's a standalone ESP token, terminate the previous token
            // and start recording a new-one

            if (token.start !== null) {
              // it means token has already being recorded, we need to tackle it -
              // the new, ESP token is incoming!

              // we nest ESP tokens inside "tag" type attributes
              if (token.type === "tag") {
                console.log(
                  `2062 ${`\u001b[${36}m${`██`}\u001b[${39}m`} ESP tag-inside-tag clauses`
                );
                // instead of dumping the tag token and starting a new-one,
                // save the parent token, then nest all ESP tags among attributes
                if (!token.tagName || !token.tagNameEndsAt) {
                  token.tagNameEndsAt = i;
                  token.tagName = str.slice(token.tagNameStartsAt, i);
                  token.recognised = isTagNameRecognised(token.tagName);
                  console.log(
                    `2071 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
                      token.tagNameEndsAt
                    }; ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
                      token.tagName
                    }`
                  );
                }

                parentTokenToBackup = clone(token);
                console.log(
                  `2081 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`parentTokenToBackup`}\u001b[${39}m`} = ${JSON.stringify(
                    parentTokenToBackup,
                    null,
                    4
                  )}`
                );

                if (attrib.attribStart && !attrib.attribEnd) {
                  attribToBackup = clone(attrib);
                  console.log(
                    `2091 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attribToBackup`}\u001b[${39}m`} = ${JSON.stringify(
                      attribToBackup,
                      null,
                      4
                    )}`
                  );
                }
              } else if (!attribToBackup) {
                console.log(
                  `2100 ${`\u001b[${36}m${`██`}\u001b[${39}m`} standalone ESP tag - call the dump`
                );
                dumpCurrentToken(token, i);
              } else if (
                attribToBackup &&
                Array.isArray(attribToBackup.attribValue) &&
                attribToBackup.attribValue.length &&
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .type === "esp" &&
                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .end
              ) {
                console.log(
                  `2113 complete the unclosed token in attribToBackup`
                );
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].end = i;
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].value = str.slice(
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ].start,
                  i
                );
                console.log(
                  `2127 ██ patched ${`\u001b[${33}m${`attribToBackup`}\u001b[${39}m`} = ${JSON.stringify(
                    attribToBackup,
                    null,
                    4
                  )}`
                );
              }
            }

            // now, either way, if parent tag was stashed in "parentTokenToBackup"
            // or if this is a new ESP token and there's nothing to nest,
            // let's initiate it:
            initToken("esp", i);
            console.log(
              `2141 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = i;
            token.headEndsAt = i + wholeEspTagLumpOnTheRight.length;

            // toggle parentTokenToBackup.pureHTML
            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
              console.log(
                `2153 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`parentTokenToBackup.pureHTML`}\u001b[${39}m`} = ${JSON.stringify(
                  parentTokenToBackup.pureHTML,
                  null,
                  4
                )}`
              );
            }

            // if text token has been initiated, imagine:
            //  "attribValue": [
            //     {
            //         "type": "text",
            //         "start": 6, <-------- after the initiation of this, we started ESP token at 6
            //         "end": null,
            //         "value": null
            //     },
            //     {
            //         "type": "esp",
            //         "start": 6, <-------- same start on real ESP token
            //           ...
            //  ],
            if (
              attribToBackup &&
              Array.isArray(attribToBackup.attribValue) &&
              attribToBackup.attribValue.length
            ) {
              console.log(`2179 *`);
              if (
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .start === token.start
              ) {
                console.log(
                  `2185 ${`\u001b[${31}m${`TEXT TOKEN INITIATED WHERE ESP WILL BE`}\u001b[${39}m`}`
                );
                // erase it from stash
                attribToBackup.attribValue.pop();
                console.log(
                  `2190 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} attribToBackup.attribValue, now attribToBackup.attribValue: ${JSON.stringify(
                    attribToBackup.attribValue,
                    null,
                    4
                  )}`
                );
              } else if (
                // if the "text" type object is the last in "attribValue" and
                // it's not closed, let's close it and calculate its value:
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .type === "text" &&
                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .end
              ) {
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].end = i;
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].value = str.slice(
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ].start,
                  i
                );

                console.log(
                  `2217 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attribToBackup.attribValue[
                    ${~-attribToBackup.attribValue.length}
                  ]`}\u001b[${39}m`} = ${JSON.stringify(
                    attribToBackup.attribValue[
                      ~-attribToBackup.attribValue.length
                    ],
                    null,
                    4
                  )}`
                );
              }
            }
          }

          // do nothing for the second and following characters from the lump
          doNothing =
            i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
          console.log(
            `2235 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }

        console.log(`2239 end of ESP head/tail clauses reached`);
      } else if (token.start === null || token.end === i) {
        console.log(`2241`);
        if (styleStarts) {
          console.log(`2243`);
          // 1. if there's whitespace, ping it as text
          if (str[i] && !str[i].trim()) {
            initToken("text", i);
            token.end = right(str, i) || str.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `2250 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
            pingTagCb(token);

            // activate donothing
            doNothing = token.end;
            console.log(
              `2261 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );

            console.log(`2264 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
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
              token.left = lastNonWhitespaceCharAt;
              console.log(
                `2280 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );

              // jump over the whitespace if such follows
              if (str[i + 1] && !str[i + 1].trim()) {
                doNothing = right(str, i);
                console.log(
                  `2291 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
                );
              }
            }
          } else if (str[i]) {
            // css starts right away after opening tag

            // for broken code cases, all characters go as "text"
            if ("}".includes(str[i])) {
              console.log(
                `2301 ${`\u001b[${31}m${`BAD CHARACTER`}\u001b[${39}m`}, initiated "text" node`
              );
              initToken("text", i);
              doNothing = i + 1;
              console.log(
                `2306 SET ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            } else {
              // add other CSS rule-specific keys onto the object
              // second arg is "start" key:
              initToken(str[i] === "@" ? "at" : "rule", i);
            }

            console.log(
              `2315 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
          }
        } else if (str[i]) {
          // finally, the last, default token type is "text"
          console.log(`2322 ${`\u001b[${31}m${`reset`}\u001b[${39}m`} token`);

          initToken("text", i);
          console.log(
            `2326 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
        }
      } else if (
        token.type === "text" &&
        styleStarts &&
        str[i] &&
        str[i].trim() &&
        !"{},".includes(str[i])
      ) {
        // Text token inside styles can be either whitespace chunk
        // or rogue characters. In either case, inside styles, when
        // "styleStarts" is on, non-whitespace character terminates
        // this text token and "rule" token starts
        console.log(`2342 ██ terminate text token, rule starts`);

        console.log(`2344 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);

        initToken("rule", i);
        token.left = lastNonWhitespaceCharAt;
        console.log(
          `2350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.left`}\u001b[${39}m`} = ${JSON.stringify(
            token.left,
            null,
            4
          )}`
        );
      }

      // END OF if (!doNothing)
    }

    // catch the start of a css chunk
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i] &&
      str[i].trim() &&
      !"{}".includes(str[i]) &&
      !selectorChunkStartedAt &&
      !token.openingCurlyAt
    ) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        console.log(
          `2375 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`
        );

        if (token.selectorsStart === null) {
          token.selectorsStart = i;
          console.log(
            `2381 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsStart`}\u001b[${39}m`} = ${
              token.selectorsStart
            }`
          );
        }
      } else {
        // this contraption is needed to catch commas and assign
        // correctly broken chunk range, [selectorsStart, selectorsEnd]
        token.selectorsEnd = i + 1;
        console.log(
          `2391 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
            token.selectorsEnd
          }`
        );
      }
    }

    // in comment type, "only" kind tokens, submit square brackets to layers
    // -------------------------------------------------------------------------
    // ps. it's so that we can rule out greater-than signs

    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
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
        token.value = str.slice(token.start, token.end);
        console.log(
          `2416 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
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
          (matchLeft(str, i, "!-", {
            trimBeforeMatching: true,
          }) ||
            (matchLeftIncl(str, i, "!-", {
              trimBeforeMatching: true,
            }) &&
              str[i + 1] !== "-"))) ||
          (str[token.start] === "-" &&
            str[i] === ">" &&
            matchLeft(str, i, "--", {
              trimBeforeMatching: true,
              maxMismatches: 1,
            })))
      ) {
        if (
          str[i] === "-" &&
          (matchRight(str, i, ["[if", "(if", "{if"], {
            i: true,
            trimBeforeMatching: true,
          }) ||
            (matchRight(str, i, ["if"], {
              i: true,
              trimBeforeMatching: true,
            }) &&
              // the following case will assume closing sq. bracket is present
              (xBeforeYOnTheRight(str, i, "]", ">") ||
                // in case there are no brackets leading up to "mso" (which must exist)
                (str.includes("mso", i) &&
                  !str.slice(i, str.indexOf("mso")).includes("<") &&
                  !str.slice(i, str.indexOf("mso")).includes(">")))))
        ) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--[if gte mso 9]>
          //     ^
          //    we're here
          //
          console.log(
            `2466 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL "ONLY" DETECTED`}\u001b[${39}m`}`
          );
          token.kind = "only";
          console.log(
            `2470 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          // ensure it's not starting with closing counterpart,
          // --><![endif]-->
          // but with
          // <!--<![endif]-->
          str[token.start] !== "-" &&
          matchRightIncl(str, i, ["-<![endif"], {
            i: true,
            trimBeforeMatching: true,
            maxMismatches: 2,
          })
        ) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--<![endif]-->
          //     ^
          //    we're here
          //
          console.log(
            `2493 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL "NOT" DETECTED`}\u001b[${39}m`}`
          );
          token.kind = "not";
          token.closing = true;
          console.log(
            `2498 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }; ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        } else if (
          token.kind === "simple" &&
          !token.closing &&
          str[right(str, i)] === ">"
        ) {
          console.log(
            `2510 ${`\u001b[${32}m${`simplet-kind comment token's ending caught`}\u001b[${39}m`}`
          );
          token.end = right(str, i) + 1;
          token.kind = "simplet";
          token.closing = null;
          console.log(
            `2516 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
          console.log(
            `2521 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
          console.log(
            `2526 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        } else {
          // if it's a simple HTML comment, <!--, end it right here
          console.log(
            `2533 ${`\u001b[${32}m${`${token.kind} comment token's ending caught`}\u001b[${39}m`}`
          );
          token.end = i + 1;

          // tokenizer will catch <!- as opening, so we need to extend
          // for correct cases with two dashes <!--
          if (str[left(str, i)] === "!" && str[right(str, i)] === "-") {
            token.end = right(str, i) + 1;
            console.log(
              `2542 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
          }

          token.value = str.slice(token.start, token.end);
          console.log(
            `2550 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
        }
        // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (
        token.type === "comment" &&
        str[i] === ">" &&
        (!layers.length || str[right(str, i)] === "<")
      ) {
        // if last layer was for square bracket, this means closing
        // counterpart is missing so we need to remove it now
        // because it's the ending of the tag ("only" kind) or
        // at least the first part of it ("not" kind)
        if (
          Array.isArray(layers) &&
          layers.length &&
          layers[~-layers.length].value === "["
        ) {
          layers.pop();
          console.log(`2572 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} layers`);
        }

        // the difference between opening Outlook conditional comment "only"
        // and conditional "only not" is that <!--> follows
        if (
          !["simplet", "not"].includes(token.kind) &&
          matchRight(str, i, ["<!-->", "<!---->"], {
            trimBeforeMatching: true,
            maxMismatches: 1,
            lastMustMatch: true,
          })
        ) {
          console.log(
            `2586 that's kind="not" comment and it continues on the right`
          );
          token.kind = "not";
          console.log(
            `2590 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else {
          console.log(
            `2596 that's the end of opening type="comment" kind="only" comment`
          );
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          console.log(
            `2601 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
        }
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        console.log(`2612 POSSIBLE ESP TAILS`);
        // extract the whole lump of ESP tag characters:
        let wholeEspTagClosing = "";

        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing += str[y];
          } else {
            break;
          }
        }
        console.log(`2623 wholeEspTagClosing = ${wholeEspTagClosing}`);

        // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here

        // find the breaking point where tails end
        if (wholeEspTagClosing.length > token.head.length) {
          console.log(
            `2633 wholeEspTagClosing.length = ${`\u001b[${33}m${
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
            console.log(`2661 - chunk ends with the same heads`);
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
            token.value = str.slice(token.start, token.end);
            console.log(
              `2684 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `2690 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `2696 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `2702 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            console.log(`2710`);
            // We're very lucky because heads and tails are using different
            // characters, possibly opposite brackets of some kind.
            // That's Nunjucks, Responsys (but no eDialog) patterns.
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
                .every((char) => firstPartOfWholeEspTagClosing.includes(char))
            ) {
              console.log(`2745 definitely tails + new heads`);
              token.end = i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              console.log(
                `2749 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`
              );
              doNothing = token.end;
              console.log(
                `2755 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            }
          } else {
            // so heads and tails don't contain unique character, and more so,
            // starting-one, PLUS, second set is different.
            // For example, ESP heads/tails can be *|zzz|*
            // Imaginery example, following heads would be variation of those
            // above, ^|zzz|^
            console.log(`CASE #2.`);
            // TODO
            // for now, return defaults, from else scenario below:
            // we consider this whole chunk is tails.
            token.end = i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `2771 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `2777 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          }
          console.log(`2780`);
        } else {
          // we consider this whole chunk is tails.
          token.end = i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          console.log(
            `2786 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );

          // if last layer is ESP tag and we've got its closing, pop the layer
          if (
            Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === "esp"
          ) {
            console.log(
              `2798 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers, now ${`\u001b[${33}m${`layers`}\u001b[${39}m`}: ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );
            layers.pop();
          }

          doNothing = token.end;
          console.log(
            `2809 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
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
      token.tagNameStartsAt &&
      !token.tagNameEndsAt
    ) {
      console.log(`2825 catch the end of a tag name clauses`);

      // tag names can be with numbers, h1
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        console.log(
          `2831 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
            token.tagNameEndsAt
          }`
        );

        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        console.log(
          `2838 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
            token.tagName
          }`
        );

        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
          console.log(
            `2846 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        }

        // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.
        if (voidTags.includes(token.tagName)) {
          token.void = true;
          console.log(
            `2858 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.void`}\u001b[${39}m`} = ${
              token.void
            }`
          );
        }

        token.recognised = isTagNameRecognised(token.tagName);

        console.log(
          `2867 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.recognised`}\u001b[${39}m`} = ${
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
      !token.tagNameStartsAt &&
      token.start != null &&
      (token.start < i || str[token.start] !== "<")
    ) {
      console.log(`2884 catch the start of a tag name clauses`);
      // MULTIPLE ENTRY!
      // Consider closing tag's slashes and tag name itself.

      if (str[i] === "/") {
        token.closing = true;
        console.log(
          `2891 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
            token.closing
          }`
        );
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        console.log(
          `2898 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameStartsAt`}\u001b[${39}m`} = ${
            token.tagNameStartsAt
          }`
        );
        // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name
        if (!token.closing) {
          token.closing = false;
          console.log(
            `2907 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
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
      attrib.attribNameStartsAt &&
      i > attrib.attribNameStartsAt &&
      attrib.attribNameEndsAt === null &&
      !charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`2929 inside catch the tag attribute name end clauses`);
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);
      console.log(
        `2934 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndsAt`}\u001b[${39}m`} = ${
          attrib.attribNameEndsAt
        }; ${`\u001b[${33}m${`attrib.attribName`}\u001b[${39}m`} = ${JSON.stringify(
          attrib.attribName,
          null,
          0
        )}`
      );

      // maybe there's a space in front of equal, <div class= "">
      if (str[i] && !str[i].trim() && str[right(str, i)] === "=") {
        console.log(`2945 equal on the right`);
      } else if (
        (str[i] && !str[i].trim()) ||
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        if (`'"`.includes(str[right(str, i)])) {
          console.log(
            `2953 ${`\u001b[${31}m${`space instead of equal`}\u001b[${39}m`}`
          );
        } else {
          console.log(
            `2957 ${`\u001b[${31}m${`a value-less attribute detected`}\u001b[${39}m`}`
          );
          attrib.attribEnd = i;
          console.log(
            `2961 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
              attrib.attribEnd
            }`
          );

          // push and wipe
          console.log(
            `2968 ${`\u001b[${32}m${`PUSH ATTR AND WIPE`}\u001b[${39}m`}`
          );
          token.attribs.push(clone(attrib));
          attribReset();
        }
      }
    }

    // catch the start of a tag attribute's name
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      str[i] &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      token.tagNameEndsAt &&
      i > token.tagNameEndsAt &&
      attrib.attribStart === null &&
      charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`2988 inside catch the tag attribute name start clauses`);
      attrib.attribStart = i;
      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = i;
      console.log(
        `2993 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribStart`}\u001b[${39}m`} = ${
          attrib.attribStart
        }; ${`\u001b[${33}m${`attrib.attribLeft`}\u001b[${39}m`} = ${
          attrib.attribLeft
        }; ${`\u001b[${33}m${`attrib.attribNameStartsAt`}\u001b[${39}m`} = ${
          attrib.attribNameStartsAt
        }`
      );
    }

    // catch the curlies inside CSS rule
    // -------------------------------------------------------------------------

    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = i;
        console.log(
          `3010 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
            token.openingCurlyAt
          }`
        );
      } else if (
        str[i] === "}" &&
        token.openingCurlyAt &&
        !token.closingCurlyAt
      ) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        console.log(
          `3023 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
            token.closingCurlyAt
          }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${token.end}`
        );

        console.log(`3028 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        tokenReset();
      }
    }

    // Catch the end of a tag attribute's value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "tag" &&
      attrib.attribValueStartsAt &&
      i >= attrib.attribValueStartsAt &&
      attrib.attribValueEndsAt === null
    ) {
      console.log(`3044 inside a catching end of a tag attr clauses`);
      if (`'"`.includes(str[i])) {
        console.log(`3046 currently on a quote`);

        console.log(
          `3049 ███████████████████████████████████████ attributeEnds(str, ${
            attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt
          }, ${i}) = ${attributeEnds(
            str,
            attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
            i
          )}`
        );

        const R1 = !layers.some((layerObj) => layerObj.type === "esp");
        const R2 = attributeEnds(
          str,
          attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
          i
        );
        console.log(
          `${`\u001b[${33}m${`R1`}\u001b[${39}m`} = ${`\u001b[${
            R1 ? 32 : 31
          }m${R1}\u001b[${39}m`}`
        );
        console.log(
          `${`\u001b[${33}m${`R2`}\u001b[${39}m`} = ${`\u001b[${
            R2 ? 32 : 31
          }m${R2}\u001b[${39}m`}`
        );

        //
        if (
          str[left(str, i)] === str[i] &&
          // str[i + 1].trim() &&
          !`/>${espChars}`.includes(str[right(str, i)]) &&
          !xBeforeYOnTheRight(str, i, "=", `"`) &&
          !xBeforeYOnTheRight(str, i, "=", `'`) &&
          (xBeforeYOnTheRight(str, i, `"`, `>`) ||
            xBeforeYOnTheRight(str, i, `'`, `>`)) &&
          // and either "<" doesn't follow:
          (!str.slice(i + 1).includes("<") ||
            // or there's no equal leading up to it:
            !str.slice(0, str.indexOf("<")).includes("="))
        ) {
          console.log(
            `3090 ${`\u001b[${31}m${`REPEATED OPENING QUOTES`}\u001b[${39}m`}`
          );

          // 1. offset the opening quote marker to this index because
          // we extract the value of an attribute by slicing between
          // "from" and "to" markers; if "from" was one character too early
          // and included quotes, those quotes would end up in the reported value
          attrib.attribOpeningQuoteAt = i;
          attrib.attribValueStartsAt = i + 1;
          console.log(
            `3100 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribOpeningQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
              attrib.attribValueStartsAt
            }`
          );

          // 2. make correction to last start index on last attrib.attribValue
          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            // start is present
            attrib.attribValue[~-attrib.attribValue.length].start &&
            // but not closing
            !attrib.attribValue[~-attrib.attribValue.length].end &&
            // and it starts too early,
            attrib.attribValueStartsAt >
              attrib.attribValue[~-attrib.attribValue.length].start
          ) {
            attrib.attribValue[~-attrib.attribValue.length].start =
              attrib.attribValueStartsAt;
            console.log(
              `3122 ${`\u001b[${32}m${`CORRECTION! SET`}\u001b[${39}m`} attrib.attribValue[~-attrib.attribValue.length].start = ${
                attrib.attribValue[~-attrib.attribValue.length].start
              }`
            );
          }

          // 3. restore layers, push this opening quote again, because
          // it has been just popped
          layers.push({
            type: "simple",
            value: str[i],
            position: i,
          });
          console.log(
            `3136 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              {
                type: "simple",
                value: str[i],
                position: i,
              },
              null,
              4
            )}`
          );
        } else if (
          // so we're on a single/double quote,
          // (str[i], the current character is a quote)
          // and...
          // we're not inside some ESP tag - ESP layers are not pending:
          !layers.some((layerObj) => layerObj.type === "esp") &&
          // and the current character passed the
          // attribute closing quote validation by
          // "is-html-attribute-closing"
          //
          // the attributeEnds() api is the following:
          // 1. str, 2. opening quotes index, 3. suspected
          // character for attribute closing (quotes typically,
          // but can be mismatching)...
          // see the package "is-html-attribute-closing" on npm:
          attributeEnds(
            str,
            attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
            i
          )
        ) {
          console.log(
            `3168 ${`\u001b[${32}m${`opening and closing quotes matched!`}\u001b[${39}m`}`
          );
          console.log(
            `3171 ${`\u001b[${32}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
              attrib,
              null,
              4
            )}`
          );

          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          }
          attrib.attribEnd = i + 1;
          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            !attrib.attribValue[~-attrib.attribValue.length].end
          ) {
            console.log(
              `3190 set the ending on the last object within "attribValue"`
            );
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
              attrib.attribValue[~-attrib.attribValue.length].start,
              i
            );
            console.log(
              `3198 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValue[${~-attrib
                .attribValue.length}].end`}\u001b[${39}m`} = ${
                attrib.attribValue[~-attrib.attribValue.length].end
              }; ${`\u001b[${33}m${`attrib.attribValue[${~-attrib.attribValue
                .length}].value`}\u001b[${39}m`} = ${
                attrib.attribValue[~-attrib.attribValue.length].value
              }`
            );
          }
          console.log(
            `3208 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribClosingQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
              attrib.attribValueEndsAt
            }; ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${
              attrib.attribValueRaw
            }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
              attrib.attribValue
            }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
              attrib.attribEnd
            }`
          );

          // 2. if the pair was mismatching, wipe layers' last element
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
            layers.pop();
            console.log(
              `3226 POP x 2, now layers = ${JSON.stringify(layers, null, 4)}`
            );
          }

          // 3. push and wipe
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (
        attrib.attribOpeningQuoteAt === null &&
        ((str[i] && !str[i].trim()) ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        // ^ either whitespace or tag's closing or ESP literal's start ends
        // the attribute's value if there are no quotes
        console.log(`3242 opening quote was missing, terminate attr val here`);

        attrib.attribValueEndsAt = i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
        if (
          Array.isArray(attrib.attribValue) &&
          attrib.attribValue.length &&
          !attrib.attribValue[~-attrib.attribValue.length].end
        ) {
          attrib.attribValue[~-attrib.attribValue.length].end = i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
            attrib.attribValue[~-attrib.attribValue.length].start,
            attrib.attribValue[~-attrib.attribValue.length].end
          );
        }
        attrib.attribEnd = i;
        console.log(
          `3259 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
            attrib.attribValueEndsAt
          }; ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${
            attrib.attribValueRaw
          }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
            attrib.attribValue
          }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );

        // 2. push and wipe
        token.attribs.push(clone(attrib));
        attribReset();

        // 3. pop layers
        layers.pop();
        console.log(
          `3277 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
            layers,
            null,
            4
          )}`
        );

        // 4. tackle the tag ending
        if (str[i] === ">") {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          console.log(
            `3289 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
        }
      } else if (
        str[i] === "=" &&
        (`'"`.includes(str[right(str, i)]) ||
          (str[~-i] && isLatinLetter(str[~-i])))
      ) {
        console.log(
          `3300 ${`\u001b[${31}m${`MISSING CLOSING QUOTE ON PREVIOUS ATTR.`}\u001b[${39}m`}`
        );
        // all depends, are there whitespace characters:
        // imagine
        // <a href="border="0">
        // vs
        // <a href="xyz border="0">
        // that's two different cases - there's nothing to salvage in former!

        console.log(
          `3310 ${`\u001b[${36}m${`██ traverse backwards, try to salvage something`}\u001b[${39}m`}`
        );
        let whitespaceFound;
        let attribClosingQuoteAt;

        for (let y = left(str, i); y >= attrib.attribValueStartsAt; y--) {
          console.log(
            `3317 ${`\u001b[${36}m${`------- str[${y}] = ${str[y]} -------`}\u001b[${39}m`}`
          );

          // catch where whitespace starts
          if (!whitespaceFound && str[y] && !str[y].trim()) {
            whitespaceFound = true;

            if (attribClosingQuoteAt) {
              // slice the captured chunk
              const extractedChunksVal = str.slice(y, attribClosingQuoteAt);
              console.log(
                `3328 ${`\u001b[${33}m${`extractedChunksVal`}\u001b[${39}m`} = ${JSON.stringify(
                  extractedChunksVal,
                  null,
                  4
                )}`
              );
            }
          }

          // where that caught whitespace ends, that's the default location
          // of double quotes.
          // <a href="xyz border="0">
          //            ^        ^
          //            |        |
          //            |   we go from here
          //         to here
          if (whitespaceFound && str[y] && str[y].trim()) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              // that's the first, default location
              attribClosingQuoteAt = y + 1;
              console.log(
                `3350 SET attribClosingQuoteAt = ${attribClosingQuoteAt}`
              );
            } else {
              console.log(`3353 X`);
            }
          }
        }

        console.log(
          `3359 FIY, ${`\u001b[${33}m${`attribClosingQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
            attribClosingQuoteAt,
            null,
            4
          )}`
        );

        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(
              attrib.attribValueStartsAt,
              attribClosingQuoteAt
            );

            console.log(
              `3375 FIY, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                attrib,
                null,
                4
              )}`
            );

            if (
              Array.isArray(attrib.attribValue) &&
              attrib.attribValue.length &&
              !attrib.attribValue[~-attrib.attribValue.length].end
            ) {
              attrib.attribValue[~-attrib.attribValue.length].end =
                attrib.attribValueEndsAt;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
                attrib.attribValue[~-attrib.attribValue.length].start,
                attrib.attribValueEndsAt
              );
              console.log(
                `3394 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} attrib.attribValue's last object's end and value: ${JSON.stringify(
                  attrib.attribValue,
                  null,
                  4
                )}`
              );
            }
          }
          attrib.attribEnd = attribClosingQuoteAt;
          console.log(
            `3404 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribClosingQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
              attrib.attribValueEndsAt
            }; ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${
              attrib.attribValueRaw
            }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
              attrib.attribValue
            }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
              attrib.attribEnd
            }`
          );

          // 2. if the pair was mismatching, wipe layers' last element
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
            console.log(
              `3421 POP x 1, now layers = ${JSON.stringify(layers, null, 4)}`
            );
          }

          // 3. push and wipe
          token.attribs.push(clone(attrib));
          attribReset();

          // 4. pull the i back to the position where the attribute ends
          i = ~-attribClosingQuoteAt;
          console.timeEnd(`\u001b[${90}m${`loop iteration`}\u001b[${39}m`);
          continue;
        } else if (
          attrib.attribOpeningQuoteAt &&
          (`'"`.includes(str[right(str, i)]) ||
            allHtmlAttribs.has(
              str.slice(attrib.attribOpeningQuoteAt + 1, i).trim()
            ))
        ) {
          // worst case scenario:
          // <span width="height="100">
          //
          // traversing back from second "=" we hit only the beginning of an
          // attribute, there was nothing to salvage.
          // In this case, reset the attribute's calculation, go backwards to "h".

          // 1. pull back the index, go backwards, read this new attribute again
          i = attrib.attribOpeningQuoteAt;

          // 2. end the attribute
          attrib.attribEnd = attrib.attribOpeningQuoteAt + 1;
          console.log(
            `3453 SET ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
              attrib.attribEnd
            }`
          );

          // 3. value doesn't start, this needs correction
          attrib.attribValueStartsAt = null;

          // 4. pop the opening quotes layer
          layers.pop();

          // 5. push and wipe
          token.attribs.push(clone(attrib));
          attribReset();

          // 6. continue
          console.timeEnd(`\u001b[${90}m${`loop iteration`}\u001b[${39}m`);
          continue;
        }
      } else if (
        attrib &&
        attrib.attribStart &&
        !attrib.attribEnd &&
        //
        // AND,
        //
        // either there are no attributes recorded under attrib.attribValue:
        (!Array.isArray(attrib.attribValue) ||
          // or it's array but empty:
          !attrib.attribValue.length ||
          // or is it not empty but its last attrib has ended by now
          (attrib.attribValue[~-attrib.attribValue.length].end &&
            attrib.attribValue[~-attrib.attribValue.length].end <= i))
      ) {
        console.log(
          `3488 ${`\u001b[${33}m${`ATTR. DOESN'T END, STRING VALUE TOKEN STARTS UNDER attribValue`}\u001b[${39}m`}`
        );

        attrib.attribValue.push({
          type: "text",
          start: i,
          end: null,
          value: null,
        });

        console.log(
          `3499 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} new to attrib.attribValue, now ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}: ${JSON.stringify(
            attrib.attribValue,
            null,
            4
          )}`
        );
      }
    } else if (
      token.type === "esp" &&
      attribToBackup &&
      parentTokenToBackup &&
      attribToBackup.attribOpeningQuoteAt &&
      `'"`.includes(str[i]) &&
      str[attribToBackup.attribOpeningQuoteAt] === str[i] &&
      attributeEnds(str, attribToBackup.attribOpeningQuoteAt, i)
    ) {
      console.log(
        `3516 ${`\u001b[${31}m${`██`}\u001b[${39}m`} emergency catching tag attr closing quotes inside attribute, with ESP tag unclosed`
      );

      // imagine unclosed ESP tag inside attr value:
      // <tr class="{% x">
      //                ^
      //             we're here

      // we need to still proactively look for closing attribute quotes,
      // even inside ESP tags, if we're inside tag attributes

      console.log(
        `3528 ${`\u001b[${32}m${`opening and closing quotes matched!`}\u001b[${39}m`}`
      );
      console.log(
        `3531 ${`\u001b[${32}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`attribToBackup`}\u001b[${39}m`} = ${JSON.stringify(
          attribToBackup,
          null,
          4
        )}`
      );

      // 1. patch up missing token (which is type="esp" currently) values
      token.end = i;
      token.value = str.slice(token.start, i);

      // 2. push token into attribToBackup.attribValue
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue.length = 0;
      }
      attribToBackup.attribValue.push(token);

      // 3. patch up missing values in attribToBackup
      attribToBackup.attribValueEndsAt = i;
      attribToBackup.attribValueRaw = str.slice(
        attribToBackup.attribValueStartsAt,
        i
      );
      attribToBackup.attribClosingQuoteAt = i;
      attribToBackup.attribEnd = i + 1;

      // 4. restore parent token
      token = clone(parentTokenToBackup);

      token.attribs.push(attribToBackup);

      // 5. reset all
      attribToBackup = undefined;
      parentTokenToBackup = undefined;

      console.log(
        `3567 FIY, now ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );

      // 6. pop the last 3 layers
      // currently layers array should be like:
      // [
      //   {
      //     "type": "simple",
      //     "value": '"',
      //     "position": 10
      //   },
      //   {
      //     "type": "esp",
      //     "openingLump": "{%",
      //     "guessedClosingLump": "%}",
      //     "position": 11
      //   }
      //   {
      //     "type": "simple",
      //     "value": '"',
      //     "position": 15
      //   },
      // ]
      layers.pop();
      layers.pop();
      layers.pop();
    }

    // Catch the start of a tag attribute's value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "tag" &&
      !attrib.attribValueStartsAt &&
      attrib.attribNameEndsAt &&
      attrib.attribNameEndsAt <= i &&
      str[i] &&
      str[i].trim()
    ) {
      console.log(`3611 inside catching attr value start clauses`);
      if (
        str[i] === "=" &&
        !`'"=`.includes(str[right(str, i)]) &&
        !espChars.includes(str[right(str, i)]) // it might be an ESP literal
      ) {
        const firstCharOnTheRight = right(str, i);
        console.log(
          `3619 ${`\u001b[${33}m${`firstCharOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
            firstCharOnTheRight,
            null,
            4
          )}; str[${firstCharOnTheRight}]: ${str[firstCharOnTheRight]}`
        );

        // find the index of the next quote, single or double
        const firstQuoteOnTheRightIdx = [
          str.indexOf(`'`, firstCharOnTheRight),
          str.indexOf(`"`, firstCharOnTheRight),
        ].filter((val) => val > 0).length
          ? Math.min(
              ...[
                str.indexOf(`'`, firstCharOnTheRight),
                str.indexOf(`"`, firstCharOnTheRight),
              ].filter((val) => val > 0)
            )
          : undefined;

        console.log(
          `3640 ${`\u001b[${33}m${`firstQuoteOnTheRightIdx`}\u001b[${39}m`} = ${JSON.stringify(
            firstQuoteOnTheRightIdx,
            null,
            4
          )}`
        );

        // catch attribute name - equal - attribute name - equal
        // <span width=height=100>
        if (
          // there is a character on the right (otherwise value would be null)
          firstCharOnTheRight &&
          // there is equal character in the remaining chunk
          str.slice(firstCharOnTheRight).includes("=") &&
          // characters upto first equals form a known attribute value
          allHtmlAttribs.has(
            str
              .slice(
                firstCharOnTheRight,
                firstCharOnTheRight +
                  str.slice(firstCharOnTheRight).indexOf("=")
              )
              .trim()
              .toLowerCase()
          )
        ) {
          console.log(`3666 attribute ends`);
          // we have something like:
          // <span width=height=100>

          // 1. end the attribute
          attrib.attribEnd = i + 1;

          // 2. push and wipe
          console.log(
            `3675 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`
          );
          token.attribs.push({ ...attrib });
          attribReset();
        } else if (
          // try to stop this clause:
          //
          // if there are no quote in the remaining string
          !firstQuoteOnTheRightIdx ||
          // there is one but there are equal character between here and its location
          str
            .slice(firstCharOnTheRight, firstQuoteOnTheRightIdx)
            .includes("=") ||
          // if there is no second quote of that type in the remaining string
          !str.includes(
            str[firstQuoteOnTheRightIdx],
            firstQuoteOnTheRightIdx + 1
          ) ||
          // if string slice from quote to quote includes equal or brackets
          Array.from(
            str.slice(
              firstQuoteOnTheRightIdx + 1,
              str.indexOf(
                str[firstQuoteOnTheRightIdx],
                firstQuoteOnTheRightIdx + 1
              )
            )
          ).some((char) => `<>=`.includes(char))
        ) {
          console.log(`3704 attribute continues`);
          // case of missing opening quotes
          attrib.attribValueStartsAt = firstCharOnTheRight;
          console.log(
            `3708 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
              attrib.attribValueStartsAt
            }`
          );

          // push missing entry into layers
          layers.push({
            type: "simple",
            value: null,
            position: attrib.attribValueStartsAt,
          });
          console.log(
            `3720 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              {
                type: "simple",
                value: null,
                position: attrib.attribValueStartsAt,
              },
              null,
              4
            )}`
          );
        }
      } else if (`'"`.includes(str[i])) {
        // maybe it's <span width='"100"> and it's a false opening quote, '
        const nextCharIdx = right(str, i);
        if (
          // a non-whitespace character exists on the right of index i
          nextCharIdx &&
          // if it is a quote character
          `'"`.includes(str[nextCharIdx]) &&
          // but opposite kind,
          str[i] !== str[nextCharIdx] &&
          // and string is long enough
          str.length > nextCharIdx + 2 &&
          // and remaining string contains that quote like the one on the right
          str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) &&
          // and to the right of it we don't have str[i] quote,
          // case: <span width="'100'">
          (!str.indexOf(str[nextCharIdx], nextCharIdx + 1) ||
            !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) ||
            str[i] !==
              str[
                right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))
              ]) &&
          // and that slice does not contain equal or brackets or quote of other kind
          !Array.from(
            str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))
          ).some((char) => `<>=${str[i]}`.includes(char))
        ) {
          console.log(`3758 ${`\u001b[${31}m${`rogue quote!`}\u001b[${39}m`}`);
          // pop the layers
          layers.pop();
        } else {
          console.log(`3762 all fine, mark the quote as starting`);
          attrib.attribOpeningQuoteAt = i;
          if (str[i + 1]) {
            attrib.attribValueStartsAt = i + 1;
          }
          console.log(
            `3768 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribOpeningQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
              attrib.attribValueStartsAt
            }`
          );

          if (
            // if attribValue array is empty, no object has been placed yet,
            Array.isArray(attrib.attribValue) &&
            (!attrib.attribValue.length ||
              // of there is one but it's got ending (prevention from submitting
              // another text type object on top, before previous has been closed)
              attrib.attribValue[~-attrib.attribValue.length].end)
          ) {
            attrib.attribValue.push({
              type: "text",
              start: attrib.attribValueStartsAt,
              end: null,
              value: null,
            });
            console.log(
              `3790 PUSH to ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}, now attrib.attribValue: ${JSON.stringify(
                attrib.attribValue,
                null,
                4
              )}`
            );
          }
        }
      }

      // else - value we assume does not start
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
      attrib.attribStart &&
      !attrib.attribEnd
    ) {
      console.log(
        `3825 ${`\u001b[${31}m${`██`}\u001b[${39}m`} bracket within attribute's value`
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
            `3844 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
              str[y],
              null,
              0
            )}`}\u001b[${39}m`}`
          );

          // if we reach the closing counterpart of the quotes, terminate
          if (
            attrib.attribOpeningQuoteAt &&
            str[y] === str[attrib.attribOpeningQuoteAt]
          ) {
            console.log(
              `3857 closing quote (${
                str[attrib.attribOpeningQuoteAt]
              }) found, ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
            );
            if (y !== i + 1 && str[~-y] !== "=") {
              thisIsRealEnding = true;
              console.log(
                `3864 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
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
              `3875 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
            );

            // TODO - pop only if type === "simple" and it's the same opening
            // quotes of this attribute
            layers.pop();
            console.log(
              `3882 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
                layers,
                null,
                4
              )}`
            );

            console.log(`3889 break`);
            break;
          } else if (!str[y + 1]) {
            // if end was reached and nothing caught, that's also positive sign
            thisIsRealEnding = true;
            console.log(
              `3895 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
            );

            console.log(`3898 break`);
            break;
          }
        }
      } else {
        console.log(`3903 string ends so this was the bracket`);
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
        token.value = str.slice(token.start, token.end);
        console.log(
          `3920 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );

        // set and push the attribute's records, just closing quote will be
        // null and possibly value too

        if (
          attrib.attribValueStartsAt &&
          i &&
          attrib.attribValueStartsAt < i &&
          str.slice(attrib.attribValueStartsAt, i).trim()
        ) {
          attrib.attribValueEndsAt = i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);

          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            !attrib.attribValue[~-attrib.attribValue.length].end
          ) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
              attrib.attribValue[~-attrib.attribValue.length].start,
              i
            );
          }
          // otherwise, nulls stay
        } else {
          attrib.attribValueStartsAt = null;
        }

        attrib.attribEnd = i;
        console.log(
          `3955 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}  ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );

        // 2. push and wipe
        console.log(
          `3962 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`
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
        `3991 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
          {
            type: token.type,
            chr: str[i],
            i,
          },
          null,
          4
        )}`
      );
      pingCharCb({
        type: token.type,
        chr: str[i],
        i,
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
      token.value = str.slice(token.start, token.end);
      console.log(`4022 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
      pingTagCb(token);
    }

    //
    //
    //
    //
    //
    //
    //
    // Record last non-whitespace character
    // -------------------------------------------------------------------------

    if (str[i] && str[i].trim()) {
      lastNonWhitespaceCharAt = i;
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
        attrib.attribStart
          ? `\n██ attrib: ${JSON.stringify(attrib, null, 4)}`
          : ""
      }${
        attribToBackup
          ? `\n██ attribToBackup: ${JSON.stringify(attribToBackup, null, 4)}`
          : ""
      }${
        parentTokenToBackup
          ? `\n██ parentTokenToBackup: ${JSON.stringify(
              parentTokenToBackup,
              null,
              4
            )}`
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
    console.log(
      `${
        parentTokenToBackup
          ? `${`\u001b[${90}m${`parentTokenToBackup = ${JSON.stringify(
              parentTokenToBackup,
              null,
              4
            )}`}\u001b[${39}m`}`
          : ""
      }`
    );

    console.timeEnd(`\u001b[${90}m${`loop iteration`}\u001b[${39}m`);
  }

  //
  // finally, clear stashes
  //
  if (charStash.length) {
    console.log(
      `4105 FINALLY, clear ${`\u001b[${33}m${`charStash`}\u001b[${39}m`}`
    );
    for (let i = 0, len2 = charStash.length; i < len2; i++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
      console.log(
        `4110 ${`\u001b[${90}m${`██ charStash`}\u001b[${39}m`} = ${JSON.stringify(
          charStash,
          null,
          4
        )}`
      );
    }
  }

  if (tagStash.length) {
    console.log(
      `4121 FINALLY, clear ${`\u001b[${33}m${`tagStash`}\u001b[${39}m`}`
    );
    for (let i = 0, len2 = tagStash.length; i < len2; i++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
      console.log(
        `4126 ${`\u001b[${90}m${`██ tagStash`}\u001b[${39}m`} = ${JSON.stringify(
          tagStash,
          null,
          4
        )}`
      );
    }
  }

  // return stats
  return {
    timeTakenInMilliseconds: Date.now() - start,
  };
}

// -----------------------------------------------------------------------------

export default tokenizer;
