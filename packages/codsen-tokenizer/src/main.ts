import {
  matchLeft,
  matchRight,
  matchLeftIncl,
  matchRightIncl,
} from "string-match-left-right";
import rfdc from "rfdc";
import { left, right } from "string-left-right";
import { isAttrClosing } from "is-html-attribute-closing";
import { allHtmlAttribs } from "html-all-known-attributes";
import { isAttrNameChar } from "is-char-suitable-for-html-attr-name";
import {
  voidTags,
  isPlainObject as isObj,
  isLatinLetter,
  inlineTags,
  backtick,
} from "codsen-utils";

import getWholeEspTagLumpOnTheRight from "./util/getWholeEspTagLumpOnTheRight";
import startsHtmlComment from "./util/startsHtmlComment";
import startsCssComment from "./util/startsCssComment";
import matchLayerLast from "./util/matchLayerLast";
import startsTag from "./util/startsTag";
import startsEsp from "./util/startsEsp";
import getLastEspLayerObjIdx from "./util/getLastEspLayerObjIdx";
import {
  charSuitableForTagName,
  isTagNameRecognised,
  xBeforeYOnTheRight,
  espLumpBlacklist,
  veryEspChars,
  flipEspTag,
  espChars,
  Token,
  charsThatEndCSSChunks,
  SOMEQUOTE,
  attrNameRegexp,
  Attrib,
  TokenType,
  TextToken,
  RuleToken,
  CommentToken,
  CharacterToken,
  TagToken,
  Property,
  LayerType,
  LayerSimple,
  LayerEsp,
  EspToken,
  Layer,
  LayerKindAt,
  Opts,
  TokenCb,
  CharCb,
  AtToken,
} from "./util/util";
import { version as v } from "../package.json";

const clone = rfdc();
const version: string = v;

declare let DEV: boolean;

const importantStartsRegexp = /^\s*!?\s*[a-zA-Z0-9]+(?:[\s;}<>'"]|$)/gm;

const defaults: Opts = {
  tagCb: null,
  tagCbLookahead: 0,
  charCb: null,
  charCbLookahead: 0,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

export interface Res {
  timeTakenInMilliseconds: number;
}

/**
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 */
function tokenizer(str: string, opts?: Partial<Opts>): Res {
  let start = Date.now();
  //
  //
  //
  //
  //
  //
  //
  // INSURANCE
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        "codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.",
      );
    } else {
      throw new Error(
        `codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4,
        )}`,
      );
    }
  }
  if (opts && !isObj(opts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof opts}, equal to ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  }
  if (opts && isObj(opts) && opts.tagCb && typeof opts.tagCb !== "function") {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof opts.tagCb}, equal to ${JSON.stringify(
        opts.tagCb,
        null,
        4,
      )}`,
    );
  }
  if (opts && isObj(opts) && opts.charCb && typeof opts.charCb !== "function") {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof opts.charCb}, equal to ${JSON.stringify(
        opts.charCb,
        null,
        4,
      )}`,
    );
  }
  if (
    opts &&
    isObj(opts) &&
    opts.reportProgressFunc &&
    typeof opts.reportProgressFunc !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof opts.reportProgressFunc}, equal to ${JSON.stringify(
        opts.reportProgressFunc,
        null,
        4,
      )}`,
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

  let resolvedOpts: Opts = { ...defaults, ...opts };

  //
  //
  //
  //
  //
  //
  //
  // VARS
  // ---------------------------------------------------------------------------

  let currentPercentageDone = 0;
  let lastPercentage = 0;
  let len = str.length;
  let midLen = Math.floor(len / 2);
  let doNothing = 0; // index until where to do nothing
  let withinScript = false; // marks a state of being between <script> and </script>
  let withinStyle = false; // flag used to instruct content after <style> to toggle type="css"
  let withinStyleComment = false;

  // resolvedOpts.*CbLookahead allows to request "x"-many tokens "from the future"
  // to be reported upon each token. You can check what's coming next.
  // To implement this, we need to stash "x"-many tokens and only when enough
  // have been gathered, array.shift() the first one and ping the callback
  // with it, along with "x"-many following tokens. Later, in the end,
  // we clean up stashes and report only as many as we have.

  // The stashes will be LIFO (last in first out) style arrays:
  let tagStash: Token[] = [];
  let charStash: CharacterToken[] = [];

  // when we compile the token, we fill this object:
  let token: Token = {} as Token;
  function tokenReset(): void {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    DEV &&
      console.log(
        `201 ${`\u001b[${36}m${`██ tokenReset():`}\u001b[${39}m`} tokenReset() called`,
      );
    token = {
      type: null,
      start: null,
      end: null,
      value: null,
    } as any;
    attribReset();
  }

  // same for attributes:
  let attribDefaults: Attrib = {
    attribName: "",
    attribNameRecognised: false,
    attribNameStartsAt: null as any,
    attribNameEndsAt: null as any,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValueRaw: null as any,
    attribValue: [],
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStarts: null as any,
    attribEnds: null as any,
    attribLeft: null as any,
  };
  let attrib: Attrib = { ...attribDefaults };
  function attribReset(): void {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    DEV &&
      console.log(
        `234 ${`\u001b[${36}m${`██ attribReset():`}\u001b[${39}m`} attribReset() called`,
      );
    attrib = clone(attribDefaults);
  }

  function attribPush(tokenObj: TextToken | CommentToken | Property): void {
    DEV && console.log(`240`);
    // 1. clean up any existing tokens first
    /* c8 ignore next */
    if (
      attrib.attribValue.length &&
      attrib.attribValue[~-attrib.attribValue.length].start &&
      !attrib.attribValue[~-attrib.attribValue.length].end
    ) {
      attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
      attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
        attrib.attribValue[~-attrib.attribValue.length].start,
        tokenObj.start,
      );
      DEV &&
        console.log(
          `255 complete previous attr, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
            attrib,
            null,
            4,
          )}`,
        );
    }

    attrib.attribValue.push(tokenObj);
    DEV &&
      console.log(
        `266 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} now = ${JSON.stringify(
          attrib,
          null,
          4,
        )}`,
      );
  }

  // same for property
  let propertyDefault: Property = {
    start: null as any, // a convenience value, mirroring "propertyStarts"
    end: null as any, // a convenience value, mirroring whatever was last
    property: null,
    propertyStarts: null,
    propertyEnds: null,
    value: null as any,
    valueStarts: null,
    valueEnds: null,
    important: null,
    importantStarts: null,
    importantEnds: null,
    colon: null,
    semi: null,
  };
  let property: Property = { ...propertyDefault };
  function propertyReset(): void {
    property = { ...propertyDefault };
  }

  // The CSS properties can be in <style> blocks or inline, <div style="">.
  // When we process the code, we have to address both places. This "push"
  // is used in handful of places so we DRY'ed it to a function.
  function pushProperty(p: Property | TextToken): void {
    // push and init and patch up to resume
    if (attrib?.attribName === "style") {
      DEV && console.log(`301 push property`);
      DEV &&
        console.log(
          `304 FIY, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
            attrib,
            null,
            4,
          )}`,
        );
      DEV &&
        console.log(
          `312 FIY, ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
            attrib.attribValue,
            null,
            4,
          )}`,
        );
      attrib.attribValue.push({ ...p });
    } else if (token && Array.isArray((token as RuleToken).properties)) {
      DEV && console.log(`320 push property`);
      (token as RuleToken).properties.push({ ...p });
    }
  }

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

  let lastNonWhitespaceCharAt = null;

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
  let layers: Layer[] = [];
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
  function lastLayerIs(something: LayerType): boolean {
    return !!(
      Array.isArray(layers) &&
      layers.length &&
      layers[~-layers.length].type === something
    );
  }

  // processes closing comment - it's DRY'ed here because it's in multiple places
  // considering broken code like stray closing inline css comment blocks etc.
  function closingComment(i: number): void {
    DEV &&
      console.log(
        `438 closingComment(): ${`\u001b[${32}m${`closing comment`}\u001b[${39}m`}`,
      );
    let end = (right(str, i) || i) + 1;
    attribPush({
      type: "comment",
      start: i,
      end,
      value: str.slice(i, end), // think of broken cases with whitespace, / *
      closing: true,
      kind: "block",
      language: "css",
    });

    // skip next character
    doNothing = end;
    DEV &&
      console.log(
        `455 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
          doNothing,
          null,
          4,
        )}`,
      );

    // pop the block comment layer
    if (lastLayerIs("block")) {
      layers.pop();
      DEV &&
        console.log(
          `467 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} layers, now = ${JSON.stringify(
            layers,
            null,
            4,
          )}`,
        );
    }
  }

  function reportFirstFromStash(
    stash: (CharacterToken | Token)[],
    cb: null | CharCb | TokenCb,
    lookaheadLength: number,
  ): void {
    DEV &&
      console.log(
        `483 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ██ ${`\u001b[${33}m${`START`}\u001b[${39}m`}`,
      );
    // start to assemble node we're report to the callback cb1()
    let currentElem = stash.shift();
    // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them

    // that's the container where they'll sit:
    let next = [];

    for (let i = 0; i < lookaheadLength; i++) {
      DEV && console.log(`i = ${i}`);
      // we want as many as "lookaheadLength" from stash but there might be
      // not enough there
      if (stash[i]) {
        next.push(clone(stash[i]));
        DEV && console.log(`499`);
      } else {
        DEV &&
          console.log(
            `503 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${31}m${`STOP`}\u001b[${39}m`} - there are not enough elements in stash`,
          );
        break;
      }
    }

    // finally, ping the callback with assembled element:
    DEV &&
      console.log(
        `512 ${`\u001b[${35}m${`reportFirstFromStash()`}\u001b[${39}m`}: ${`\u001b[${32}m${`PING CB`}\u001b[${39}m`} with ${JSON.stringify(
          currentElem,
          null,
          4,
        )}`,
      );
    if (typeof cb === "function") {
      cb(currentElem as any, next as any[]);
    }
  }

  function pingCharCb(incomingToken: CharacterToken): void {
    // no cloning, no reset
    if (resolvedOpts.charCb) {
      // if there were no stashes, we'd call the callback like this:
      // resolvedOpts.charCb(incomingToken);

      // 1. push to stash
      charStash.push(incomingToken);

      // 2. is there are enough tokens in the stash, ping the first-one
      DEV &&
        console.log(
          `535 ${
            charStash.length > resolvedOpts.charCbLookahead
              ? `${`\u001b[${36}m${`pingCharCb()`}\u001b[${39}m`}: ${`\u001b[${32}m${`ENOUGH VALUES IN CHAR STASH`}\u001b[${39}m`}`
              : `${`\u001b[${36}m${`pingCharCb()`}\u001b[${39}m`}: ${`\u001b[${31}m${`NOT ENOUGH VALUES IN CHAR STASH, MOVE ON`}\u001b[${39}m`}`
          }`,
        );
      if (charStash.length > resolvedOpts.charCbLookahead) {
        reportFirstFromStash(
          charStash,
          resolvedOpts.charCb,
          resolvedOpts.charCbLookahead,
        );
        DEV &&
          console.log(
            `549 ${`\u001b[${90}m${`██ charStash`}\u001b[${39}m`} = ${JSON.stringify(
              charStash,
              null,
              4,
            )}`,
          );
      }
    }
  }

  function pingTagCb(incomingToken: Token): void {
    if (resolvedOpts.tagCb) {
      // DEV && console.log(
      //   `419 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
      //     incomingToken,
      //     null,
      //     4
      //   )}`
      // );

      // resolvedOpts.tagCb(clone(incomingToken));
      // 1. push to stash
      tagStash.push(incomingToken);

      // 2. is there are enough tokens in the stash, ping the first-one
      DEV &&
        console.log(
          `576 ${
            tagStash.length > resolvedOpts.tagCbLookahead
              ? `${`\u001b[${36}m${`pingTagCb()`}\u001b[${39}m`}: ${`\u001b[${32}m${`ENOUGH VALUES IN TAG STASH`}\u001b[${39}m`}`
              : `${`\u001b[${36}m${`pingTagCb()`}\u001b[${39}m`}: ${`\u001b[${31}m${`NOT ENOUGH VALUES IN TAG STASH, MOVE ON`}\u001b[${39}m`}`
          }`,
        );
      if (tagStash.length > resolvedOpts.tagCbLookahead) {
        reportFirstFromStash(
          tagStash,
          resolvedOpts.tagCb,
          resolvedOpts.tagCbLookahead,
        );
        DEV &&
          console.log(
            `590 pingTagCb(): ${`\u001b[${90}m${`██ tagStash`}\u001b[${39}m`} = ${JSON.stringify(
              tagStash,
              null,
              4,
            )}`,
          );
      }
    }
  }

  function dumpCurrentToken(incomingToken: Token, i: number): void {
    DEV &&
      console.log(
        `603 ${`\u001b[${35}m${`dumpCurrentToken()`}\u001b[${39}m`}; incoming incomingToken=${JSON.stringify(
          incomingToken,
          null,
          0,
        )}; i = ${`\u001b[${33}m${i}\u001b[${39}m`}`,
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
      DEV && console.log(`620`);
      // this ending is definitely a token ending. Now the question is,
      // maybe we need to split all gathered token contents into two:
      // maybe it's a tag and a whitespace? or an unclosed tag?
      // in some cases, this token.end will be only end of a second token,
      // we'll need to find where this last chunk started and terminate the
      // previous token (one which started at the current token.start) there.
      if (left(str, i) !== null) {
        DEV && console.log(`628`);
        incomingToken.end = (left(str, i) as number) + 1;
      } else {
        DEV && console.log(`631`);
        incomingToken.end = i;
      }
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      DEV &&
        console.log(
          `637 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.end`}\u001b[${39}m`} = ${
            incomingToken.end
          } (last two characters ending at incomingToken.end: ${JSON.stringify(
            str[~-incomingToken.end],
            null,
            4,
          )} + ${JSON.stringify(
            str[incomingToken.end],
            null,
            4,
          )}); ${`\u001b[${33}m${`incomingToken.value`}\u001b[${39}m`} = "${
            incomingToken.value
          }"`,
        );
      if (
        incomingToken.type === "tag" &&
        !"/>".includes(str[~-incomingToken.end])
      ) {
        DEV &&
          console.log(
            `657 ${`\u001b[${35}m${`██ UNCLOSED TAG CASES`}\u001b[${39}m`}`,
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
          DEV &&
            console.log(
              `680 ${`\u001b[${32}m${`██ validate all attributes`}\u001b[${39}m`}`,
            );
          // initial cut-off point is token.tagNameEndsAt
          DEV && console.log(`683 SET cutOffIndex = ${cutOffIndex}`);
          // with each validated attribute, push the cutOffIndex forward:
          for (
            let i2 = 0, len2 = incomingToken.attribs.length;
            i2 < len2;
            i2++
          ) {
            DEV &&
              console.log(
                `692 ${`\u001b[${36}m${`incomingToken.attribs[${i2}]`}\u001b[${39}m`} = ${JSON.stringify(
                  incomingToken.attribs[i2],
                  null,
                  4,
                )}`,
              );
            if (
              incomingToken.attribs[i2].attribNameRecognised &&
              incomingToken.attribs[i2].attribEnds
            ) {
              cutOffIndex = incomingToken.attribs[i2].attribEnds;
              DEV &&
                console.log(
                  `705 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`,
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
                DEV &&
                  console.log(
                    `725 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`,
                  );
              }
            } else {
              DEV &&
                console.log(`730 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
              // delete false attributes from incomingToken.attribs
              if (i2 === 0) {
                // if it's the first attribute and it's already
                // not suitable, for example:
                // <a click here</a>
                // all attributes ("click", "here") are removed:
                incomingToken.attribs = [];
              } else {
                // leave only attributes up to i2-th
                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
              }
              DEV &&
                console.log(
                  `744 ${`\u001b[${32}m${`CALCULATED`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.attribs`}\u001b[${39}m`} = ${JSON.stringify(
                    incomingToken.attribs,
                    null,
                    4,
                  )}`,
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
          DEV &&
            console.log(
              `763 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.tagNameEndsAt`}\u001b[${39}m`} = ${
                incomingToken.tagNameEndsAt
              }`,
            );
        }
        if (
          incomingToken.tagNameStartsAt &&
          incomingToken.tagNameEndsAt &&
          !incomingToken.tagName
        ) {
          incomingToken.tagName = str.slice(
            incomingToken.tagNameStartsAt,
            cutOffIndex,
          );
          DEV &&
            console.log(
              `779 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`incomingToken.tagName`}\u001b[${39}m`} = ${
                incomingToken.tagName
              }`,
            );
          incomingToken.recognised = isTagNameRecognised(incomingToken.tagName);
        }

        DEV && console.log(`786 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(incomingToken);
        initToken("text", cutOffIndex);
        attribReset();
        DEV &&
          console.log(
            `792 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`,
          );
      } else {
        DEV &&
          console.log(`798 ${`\u001b[${35}m${`██ HEALTHY TAG`}\u001b[${39}m`}`);
        DEV && console.log(`799 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(incomingToken);
        DEV && console.log(`801 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
        tokenReset();
        // if there was whitespace after token's end:
        if (str[~-i] && !str[~-i].trim()) {
          DEV &&
            console.log(`806 indeed there was whitespace after token's end`);
          initToken("text", (left(str, i) as number) + 1);
          attribReset();
          DEV &&
            console.log(
              `811 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                token.type
              }`,
            );
        }
      }

      DEV &&
        console.log(
          `822 FINALLY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4,
          )}`,
        );
    }

    // if a token is already being recorded, end it
    if (token.start !== null) {
      DEV && console.log(`832 *`);
      if (token.end === null && token.start !== i) {
        // (esp tags will have it set already)
        token.end = i;
        token.value = str.slice(token.start, token.end);
        DEV &&
          console.log(
            `839 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }; ${`\u001b[${33}m${`token.value`}\u001b[${39}m`} = ${JSON.stringify(
              token.value,
              null,
              4,
            )}`,
          );
      }

      // normally we'd ping the token but let's not forget we have token stashes
      // in "attribToBackup" and "parentTokenToBackup"

      DEV && console.log(`852 *`);
      if (token.start !== null && token.end) {
        // if it's a text token inside "at" rule, nest it, push into that
        // "at" rule pending in layers - otherwise, ping as standalone
        if (lastLayerIs("at")) {
          (layers[~-layers.length] as LayerKindAt).token.rules.push(
            token as any,
          );
          DEV &&
            console.log(
              `862 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} into layers AT rule`,
            );
        } else {
          DEV &&
            console.log(
              `867 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} as standalone`,
            );
          pingTagCb(token);
        }
      }
      DEV && console.log(`872 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
      tokenReset();
    }

    DEV && console.log(`876 end of dumpCurrentToken() reached`);
  }

  function atRuleWaitingForClosingCurlie(): boolean {
    return (
      lastLayerIs("at") &&
      isObj((layers[~-layers.length] as LayerKindAt).token) &&
      !!(layers[~-layers.length] as LayerKindAt).token.openingCurlyAt &&
      !(layers[~-layers.length] as LayerKindAt).token.closingCurlyAt
    );
  }

  function getNewToken(type: TokenType, startVal: number | null = null): Token {
    if (type === "tag") {
      return {
        type,
        start: startVal as any,
        end: null as any,
        value: null as any,
        tagNameStartsAt: null as any,
        tagNameEndsAt: null as any,
        tagName: null as any,
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
        start: startVal as any,
        end: null as any,
        value: null as any,
        closing: false,
        kind: "simple", // or "only" or "not" (HTML) - OR  - "block" or "line" (CSS)
        language: "html", // or "css"
      };
    }
    if (type === "rule") {
      return {
        type,
        start: startVal as any,
        end: null as any,
        value: null as any,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectorsStart: null,
        selectorsEnd: null,
        selectors: [],
        properties: [],
      };
    }
    if (type === "at") {
      return {
        type,
        start: startVal as any,
        end: null as any,
        value: null as any,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        identifier: null,
        identifierStartsAt: null,
        identifierEndsAt: null,
        query: null as any,
        queryStartsAt: null as any,
        queryEndsAt: null as any,
        rules: [],
      };
    }
    if (type === "esp") {
      return {
        type,
        start: startVal as any,
        end: null as any,
        value: null as any,
        head: null,
        headStartsAt: null,
        headEndsAt: null,
        tail: null,
        tailStartsAt: null,
        tailEndsAt: null,
      };
    }
    // a default is text token
    return {
      type: "text",
      start: startVal as any,
      end: null as any,
      value: null as any,
    };
  }

  function initToken(type: TokenType, startVal: number | null): void {
    // we mutate the object on the parent scope, so no Object.assign here
    token = getNewToken(type, startVal);
  }

  function initProperty(propertyStarts: number | Partial<Property>): void {
    // we mutate the object on the parent scope, so no Object.assign here
    propertyReset();
    if (typeof propertyStarts === "number") {
      property.propertyStarts = propertyStarts;
      property.start = propertyStarts;
    } else {
      property = { ...propertyDefault, ...propertyStarts };
    }
  }

  function ifQuoteThenAttrClosingQuote(idx: number): boolean {
    // either it's not a quote:
    return (
      !`'"`.includes(str[idx]) ||
      // precaution when both attrib.attribOpeningQuoteAt and
      // attrib.attribValueStartsAt are missing and thus unusable - just
      // skip this clause in that case... (but it should not ever happen)
      !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) ||
      // or it's real closing quote, because if not, let's keep it within
      // the value, it will be easier to validate, imagine:
      // <div style="float:"left"">
      //
      isAttrClosing(
        str,
        (attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) as number,
        idx,
      )
    );
  }

  function attrEndsAt(idx: number, extras?: boolean): boolean {
    DEV &&
      console.log(
        `1014 incoming: ${`\u001b[${33}m${`extras`}\u001b[${39}m`} = ${JSON.stringify(
          extras,
          null,
          4,
        )}`,
      );
    // either we're within normal head css styles:
    return (
      (`;}/`.includes(str[idx]) &&
        (!attrib?.attribName || attrib.attribName !== "style")) ||
      // or within inline css styles within html
      (`/;'"><`.includes(str[idx]) &&
        attrib &&
        attrib.attribName === "style" &&
        // and it's a real quote, not rogue double-wrapping around the value
        (extras || ifQuoteThenAttrClosingQuote(idx)))
    );
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
    DEV &&
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
      );

    // Progress:
    // -------------------------------------------------------------------------
    if (!doNothing && str[i] && resolvedOpts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          resolvedOpts.reportProgressFunc(
            Math.floor(
              (resolvedOpts.reportProgressFuncTo -
                resolvedOpts.reportProgressFuncFrom) /
                2,
            ),
          );
        }
      } else if (len >= 2000) {
        // defaults:
        // resolvedOpts.reportProgressFuncFrom = 0
        // resolvedOpts.reportProgressFuncTo = 100

        currentPercentageDone =
          resolvedOpts.reportProgressFuncFrom +
          Math.floor(
            (i / len) *
              (resolvedOpts.reportProgressFuncTo -
                resolvedOpts.reportProgressFuncFrom),
          );

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          resolvedOpts.reportProgressFunc(currentPercentageDone);
          DEV && console.log(`1095 DONE ${currentPercentageDone}%`);
        }
      }
    }

    // Left/Right helpers
    // -------------------------------------------------------------------------

    let leftVal = left(str, i);
    let rightVal = right(str, i);

    // Turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    if (
      withinStyle &&
      token.type &&
      !["rule", "at", "text", "comment"].includes(token.type)
    ) {
      DEV &&
        console.log(
          `1116 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4,
          )}`,
        );
      withinStyle = false;
      DEV &&
        console.log(
          `1125 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinStyle`}\u001b[${39}m`} = false`,
        );
    }

    if (doNothing && i >= doNothing) {
      doNothing = 0;
      DEV && console.log(`1131 TURN OFF doNothing`);
    }

    // skip chain of the same-type characters
    // -------------------------------------------------------------------------

    if (
      isLatinLetter(str[i]) &&
      isLatinLetter(str[~-i]) &&
      isLatinLetter(str[i + 1])
    ) {
      // <style>.a{color:1pximportant}
      //                    ^
      //                  mangled !important
      if (
        property?.valueStarts &&
        !property.valueEnds &&
        !property.importantStarts &&
        str.startsWith("important", i)
      ) {
        property.valueEnds = i;
        property.value = str.slice(property.valueStarts, i);
        property.importantStarts = i;
        DEV &&
          console.log(
            `1156 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.valueEnds`}\u001b[${39}m`} = ${
              property.valueEnds
            };  ${`\u001b[${33}m${`property.value`}\u001b[${39}m`} = ${
              property.value
            };  ${`\u001b[${33}m${`property.importantStarts`}\u001b[${39}m`} = ${
              property.importantStarts
            }`,
          );
      }

      DEV &&
        console.log(
          `1168 ${`\u001b[${32}m${`SKIP`}\u001b[${39}m`} middle of the letters chunk`,
        );
      continue;
    }

    if (
      ` \t\r\n`.includes(str[i]) &&
      // ~- means subtract 1
      str[i] === str[~-i] &&
      str[i] === str[i + 1]
    ) {
      DEV &&
        console.log(
          `1181 ${`\u001b[${32}m${`SKIP`}\u001b[${39}m`} middle of the spaces chunk`,
        );
      continue;
    }

    // catch the curly tails of at-rules
    // -------------------------------------------------------------------------

    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      DEV &&
        console.log(`1191 inside catch the curly tails of at-rules' clauses`);

      // if (token.type === null && str[i] === "}") {
      // if (str[i] === "}") {
      if (str[i] === "}") {
        if (
          !token.type ||
          token.type === "text" ||
          (token.type === "rule" && token.openingCurlyAt === null)
        ) {
          // rule token must end earlier
          if (token.type === "rule") {
            DEV && console.log(`1203 complete the "rule" token`);
            token.end = (leftVal as number) + 1;
            token.value = str.slice(token.start, token.end);
            DEV &&
              console.log(
                `1208 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                  token,
                  null,
                  4,
                )}`,
              );
            pingTagCb(token);

            // if it's a text token inside "at" rule, nest it, push into that
            // "at" rule pending in layers - otherwise, ping as standalone
            if (lastLayerIs("at")) {
              (layers[~-layers.length] as LayerKindAt).token.rules.push(token);
              DEV &&
                console.log(
                  `1222 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} into layers AT rule`,
                );
            }

            DEV &&
              console.log(`1227 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
            tokenReset();

            // if there was trailing whitespace, initiate it
            if (leftVal !== null && leftVal < ~-i) {
              DEV &&
                console.log(
                  `1234 initiate whitespace from [${leftVal + 1}, ${i}]`,
                );
              initToken("text", leftVal + 1);
              attribReset();
              DEV &&
                console.log(
                  `1240 ${`\u001b[${33}m${`token`}\u001b[${39}m`} now = ${JSON.stringify(
                    token,
                    null,
                    4,
                  )}`,
                );
            }
          }

          DEV && console.log(`1249 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);

          DEV &&
            console.log(
              `1254 ${`\u001b[${35}m${`██`}\u001b[${39}m`} restore at rule from layers`,
            );
          let poppedToken = layers.pop() as LayerKindAt;
          token = clone(poppedToken.token);
          DEV &&
            console.log(`1259 new token: ${JSON.stringify(token, null, 4)}`);

          // then, continue on "at" rule's token...

          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          DEV &&
            console.log(
              `1268 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                token,
                null,
                4,
              )} before pinging`,
            );
          pingTagCb(token);

          // if it's a "rule" token and a parent "at" rule is pending in layers,
          // also put this "rule" into that parent in layers
          if (lastLayerIs("at")) {
            DEV &&
              console.log(
                `1281 ${`\u001b[${32}m${`PUSH this rule into last AT layer`}\u001b[${39}m`}`,
              );
            (layers[~-layers.length] as LayerKindAt).token.rules.push(
              token as any,
            );
          }

          DEV && console.log(`1288 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
          tokenReset();

          DEV &&
            console.log(
              `1293 ${`\u001b[${31}m${`skip the remaining of the program clauses for this index`}\u001b[${39}m`}`,
            );
          doNothing = i + 1;
          DEV &&
            console.log(
              `1298 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
            );
        }
      } else if (token.type === "text" && str[i]?.trim()) {
        // terminate the text token, all the non-whitespace characters comprise
        // rules because we're inside the at-token, it's CSS!
        token.end = i;
        token.value = str.slice(token.start, token.end);
        DEV &&
          console.log(
            `1308 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4,
            )}`,
          );

        // if it's a text token inside "at" rule, nest it, push into that
        // "at" rule pending in layers - otherwise, ping as standalone
        if (lastLayerIs("at")) {
          (layers[~-layers.length] as LayerKindAt).token.rules.push(token);
          DEV &&
            console.log(
              `1321 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} into layers AT rule`,
            );
        } else {
          DEV &&
            console.log(
              `1326 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} as standalone`,
            );
          pingTagCb(token);
        }
        DEV && console.log(`1330 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
        tokenReset();
      }
    }

    if (token.end && token.end === i) {
      DEV && console.log(`1336 token was captured in the past, so push it now`);
      if ((token as any).tagName === "style" && !(token as any).closing) {
        withinStyle = true;
        DEV &&
          console.log(
            `1341 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinStyle`}\u001b[${39}m`} = true`,
          );
      }
      // we need to retain the information after tag was dumped to tagCb() and wiped
      if (attribToBackup) {
        DEV && console.log(`1346 THIS TAG GOES INTO ATTRIBUTE'S attribValue`);

        // 1. restore
        attrib = attribToBackup;
        DEV &&
          console.log(
            `1352 ${`\u001b[${35}m${`RESTORE`}\u001b[${39}m`} attrib from stashed, now = ${JSON.stringify(
              attrib,
              null,
              4,
            )}`,
          );

        // 2. push current token into attrib.attribValue
        DEV &&
          console.log(
            `1362 PUSH token to be inside ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}`,
          );
        attrib.attribValue.push(token as any);

        // 3. restore real token
        token = clone(parentTokenToBackup) as TagToken;

        // 4. reset
        attribToBackup = undefined;
        parentTokenToBackup = undefined;

        DEV &&
          console.log(
            `1375 ${`\u001b[${33}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4,
            )}`,
          );
      } else {
        DEV && console.log(`1382 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);

        DEV &&
          console.log(`1386 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} layers`);
        layers.length = 0;
      }
    }

    DEV &&
      console.log(
        `1393 ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
          attrib.attribValue,
          null,
          4,
        )}`,
      );

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
        ["tag", "at"].includes(token.type) &&
        (token as any).kind !== "cdata"
      ) {
        DEV &&
          console.log(
            `1420 ${`\u001b[${36}m${`LAYERS CLAUSES`}\u001b[${39}m`} ("tag", "rule" or "at")`,
          );
        if (
          str[i] &&
          (SOMEQUOTE.includes(str[i]) || `()`.includes(str[i])) &&
          !(
            // below, we have insurance against single quotes, wrapped with quotes:
            // "'" or '"' - templating languages might put single quote as a sttring
            // character, not meaning wrapped-something.
            (
              SOMEQUOTE.includes(str[leftVal as number]) &&
              str[leftVal as number] === str[rightVal as number]
            )
          ) &&
          // protection against double-wrapped values, like
          // <div style="float:"left"">
          //
          //
          // it's not a quote or a real attr ending
          ifQuoteThenAttrClosingQuote(i)
          // because if it's not really a closing quote, it's a rogue-one and
          // it belongs to the current attribute's value so that later we
          // can catch it, validating values, imagine "float" value "left" comes
          // with quotes, as in ""left""
        ) {
          DEV &&
            console.log(
              `1447 ${`\u001b[${32}m${`a new layer quotes`}\u001b[${39}m`}`,
            );
          DEV &&
            console.log(
              `1451 last layer's value: ${
                lastLayerIs("simple") &&
                (layers[~-layers.length] as LayerSimple).value
              }`,
            );
          if (
            // maybe it's the closing counterpart?
            lastLayerIs("simple") &&
            (layers[~-layers.length] as LayerSimple).value ===
              flipEspTag(str[i])
          ) {
            layers.pop();
            DEV &&
              console.log(
                `1465 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`,
              );
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[i],
              position: i,
            });
            DEV &&
              console.log(
                `1476 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  {
                    type: "simple",
                    value: str[i],
                    position: i,
                  },
                  null,
                  4,
                )}`,
              );
          }
        }
      } else if (
        token.type === "comment" &&
        ["only", "not"].includes(token.kind)
      ) {
        DEV && console.log(`1492 inside "comments" layers clauses`);
        if ([`[`, `]`].includes(str[i])) {
          DEV && console.log(`1494`);
          if (
            // maybe it's the closing counterpart?
            lastLayerIs("simple") &&
            (layers[~-layers.length] as LayerSimple).value ===
              flipEspTag(str[i])
          ) {
            // maybe it's the closing counterpart?
            layers.pop();
            DEV &&
              console.log(
                `1505 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`,
              );
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[i],
              position: i,
            });
            DEV &&
              console.log(
                `1516 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  {
                    type: "simple",
                    value: str[i],
                  },
                  null,
                  4,
                )}`,
              );
          }
        }
      } else if (
        token.type === "esp" &&
        `'"${backtick}()`.includes(str[i]) &&
        !(
          // below, we have insurance against single quotes, wrapped with quotes:
          // "'" or '"' - templating languages might put single quote as a sttring
          // character, not meaning wrapped-something.
          (
            [`"`, `'`, "`"].includes(str[leftVal as number]) &&
            str[leftVal as number] === str[rightVal as number]
          )
        )
      ) {
        DEV && console.log(`1540`);
        if (
          // maybe it's the closing counterpart?
          lastLayerIs("simple") &&
          (layers[~-layers.length] as LayerSimple).value === flipEspTag(str[i])
        ) {
          // maybe it's the closing counterpart?
          layers.pop();
          DEV &&
            console.log(`1549 ${`\u001b[${32}m${`POP LAYERS`}\u001b[${39}m`}`);

          DEV &&
            console.log(
              `1553 ${`\u001b[${31}m${`skip the remaining of the program clauses for this index`}\u001b[${39}m`}`,
            );
          doNothing = i + 1;
          DEV &&
            console.log(
              `1558 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
            );
        } else if (!`]})>`.includes(str[i])) {
          // it's opening then
          layers.push({
            type: "simple",
            value: str[i],
            position: i,
          });
          DEV &&
            console.log(
              `1569 ${`\u001b[${32}m${`PUSH LAYER`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i],
                },
                null,
                4,
              )}`,
            );
        }
      }

      // DEV && console.log(
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
      str[i]?.trim() &&
      str[i] !== "@"
    ) {
      // the media identifier's "entry" requirements are deliberately loose
      // because we want to catch errors there, imagine somebody mistakenly
      // adds a comma, @,media
      // or adds a space, @ media
      token.identifierStartsAt = i;
      DEV &&
        console.log(
          `1609 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierStartsAt`}\u001b[${39}m`} = ${
            token.identifierStartsAt
          }`,
        );
    }

    // catch the end of the "at" rule token
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      token.queryStartsAt &&
      !token.queryEndsAt &&
      `{;`.includes(str[i])
    ) {
      DEV && console.log(`1625 end of the "at" rule token clauses start`);
      if (str[i] === "{") {
        if (str[~-i]?.trim()) {
          token.queryEndsAt = i;
          DEV &&
            console.log(
              `1631 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
                token.queryEndsAt,
                null,
                4,
              )}`,
            );
        } else {
          // trim the trailing whitespace:
          // @media (max-width: 600px) {
          //                          ^
          //                        this
          //
          token.queryEndsAt = leftVal !== null ? leftVal + 1 : i;
          // left() stops "to the left" of a character, if you used that index
          // for slicing, that character would be included, in our case,
          // @media (max-width: 600px) {
          //                         ^
          //            that would be index of this bracket
          DEV &&
            console.log(
              `1651 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
                token.queryEndsAt,
                null,
                4,
              )}`,
            );
        }
      } else {
        // ; closing, for example, illegal:
        // @charset "UTF-8";
        //                 ^
        //          we're here
        //
        token.queryEndsAt = left(str, i + 1) || 0;
        DEV &&
          console.log(
            `1667 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
              token.queryEndsAt,
              null,
              4,
            )}`,
          );
      }

      if (token.queryStartsAt && token.queryEndsAt) {
        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
        DEV &&
          console.log(
            `1679 ${`\u001b[${33}m${`token.query`}\u001b[${39}m`} = ${JSON.stringify(
              token.query,
              null,
              4,
            )}`,
          );
      }

      token.end = str[i] === ";" ? i + 1 : i;
      token.value = str.slice(token.start, token.end);

      if (str[i] === ";") {
        // if code is clean, that would be @charset for example, no curlies
        DEV &&
          console.log(
            `1694 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} the token`,
          );
        pingTagCb(token);
      } else {
        // then it's opening curlie
        DEV &&
          console.log(`1700 ${`\u001b[${32}m${`NEST`}\u001b[${39}m`} children`);
        DEV &&
          console.log(
            `1703 starting ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
              layers,
              null,
              4,
            )}`,
          );

        token.openingCurlyAt = i;
        DEV &&
          console.log(
            `1713 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
              token.openingCurlyAt
            }`,
          );

        // push so far gathered token into layers
        layers.push({
          type: "at",
          token,
        });
        DEV &&
          console.log(
            `1725 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} "at" token to layers`,
          );
      }

      DEV &&
        console.log(`1730 ${`\u001b[${31}m${`REST`}\u001b[${39}m`} the token`);
      tokenReset();
      doNothing = i + 1;
      DEV &&
        console.log(
          `1735 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
            doNothing,
            null,
            4,
          )}`,
        );
    }

    // catch the start of the query
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "at" &&
      token.identifier &&
      str[i]?.trim() &&
      !token.queryStartsAt
    ) {
      token.queryStartsAt = i;
      DEV &&
        console.log(
          `1756 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryStartsAt`}\u001b[${39}m`} = ${
            token.queryStartsAt
          }`,
        );
    }

    // catch the end of at rule's identifierStartsAt
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token &&
      token.type === "at" &&
      token.identifierStartsAt &&
      i >= token.start &&
      str[i] &&
      (!str[i].trim() || "()".includes(str[i])) &&
      !token.identifierEndsAt
    ) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
      DEV &&
        console.log(
          `1779 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierEndsAt`}\u001b[${39}m`} = ${
            token.identifierEndsAt
          }; ${`\u001b[${33}m${`token.identifier`}\u001b[${39}m`} = "${
            token.identifier
          }"`,
        );
    }

    // catch the end of a CSS chunk
    // -------------------------------------------------------------------------

    // charsThatEndCSSChunks:  } , {
    if (token.type === "rule") {
      if (
        selectorChunkStartedAt &&
        (charsThatEndCSSChunks.includes(str[i]) ||
          (str[i] &&
            rightVal &&
            !str[i].trim() &&
            charsThatEndCSSChunks.includes(str[rightVal])))
      ) {
        DEV &&
          console.log(
            `1802 FIY, ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} was ${selectorChunkStartedAt}`,
          );
        DEV &&
          console.log(
            `1806 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to selectors[]: ${JSON.stringify(
              {
                value: str.slice(selectorChunkStartedAt, i),
                selectorStarts: selectorChunkStartedAt,
                selectorEnds: i,
              },
              null,
              4,
            )}`,
          );
        token.selectors.push({
          value: str.slice(selectorChunkStartedAt, i),
          selectorStarts: selectorChunkStartedAt,
          selectorEnds: i,
        });

        selectorChunkStartedAt = undefined;
        DEV &&
          console.log(
            `1825 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`}`,
          );

        token.selectorsEnd = i;
        DEV &&
          console.log(
            `1831 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
              token.selectorsEnd
            }`,
          );
      } else if (
        str[i] === "{" &&
        str[i - 1] !== "{" && // avoid Nunjucks variable as CSS rule's value
        str[i + 1] !== "{" && // avoid Nunjucks variable as CSS rule's value
        token.openingCurlyAt &&
        !token.closingCurlyAt
      ) {
        // we encounted an opening curly even though closing hasn't
        // been met yet:
        // <style>.a{float:left;x">.b{color: red}
        //                           ^
        //                    we're here
        DEV &&
          console.log(
            `1849 ${`\u001b[${31}m${`opening curlies!`}\u001b[${39}m`}`,
          );
        DEV &&
          console.log(
            `1853 march backwards, find where selector chunk started`,
          );
        // let selectorChunkStartedAt2;
        for (let y = i; y--; ) {
          DEV &&
            console.log(
              `1859 ${`\u001b[${36}m${`str[${y}]`}\u001b[${39}m`} = ${JSON.stringify(
                str[y],
                null,
                4,
              )}`,
            );
          if (!str[y].trim() || `{}"';`.includes(str[y])) {
            DEV &&
              console.log(
                `1868 ${`\u001b[${34}m${`BREAK`}\u001b[${39}m`}, slice: "${`\u001b[${35}m${str.slice(
                  y + 1,
                  i,
                )}\u001b[${39}m`}"`,
              );

            // patch the property
            if (property?.start && !property.end) {
              property.end = y + 1;
              property.property = str.slice(property.start, property.end);
              DEV &&
                console.log(
                  `1880 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${
                    property.end
                  };  ${`\u001b[${33}m${`property.property`}\u001b[${39}m`} = ${
                    property.property
                  }`,
                );
              DEV &&
                console.log(
                  `1888 PATCHED ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                    property,
                    null,
                    4,
                  )}`,
                );
              pushProperty(property);
              propertyReset();
              DEV &&
                console.log(
                  `1898 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
                );

              token.end = y + 1;
              token.value = str.slice(token.start, token.end);
              DEV &&
                console.log(
                  `1905 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                    token.end
                  }; ${`\u001b[${33}m${`token.value`}\u001b[${39}m`} = ${
                    token.value
                  }`,
                );
              DEV &&
                console.log(
                  `1913 PATCHED ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4,
                  )}`,
                );

              DEV &&
                console.log(`1921 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
              pingTagCb(token);
              initToken(str[y + 1] === "@" ? "at" : "rule", y + 1);
              attribReset();
              token.left = left(str, y + 1);
              token.selectorsStart = y + 1;
              DEV &&
                console.log(
                  `1929 NEW ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4,
                  )}`,
                );

              i = y + 1;
              DEV &&
                console.log(
                  `1939 ${`\u001b[${31}m${`REWIND`}\u001b[${39}m`} ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
                    i,
                    null,
                    4,
                  )}`,
                );
            }

            break;
          }
        }
      }
    }

    // catch the beginning of a token
    // -------------------------------------------------------------------------

    // imagine layers are like this:
    // [
    //   {
    //     type: "esp",
    //     openingLump: "<%@",
    //     guessedClosingLump: "@%>",
    //     position: 0,
    //   },
    //   {
    //     type: "simple",
    //     value: '"',
    //     position: 17,
    //   },
    //   {
    //     type: "simple",
    //     value: "'",
    //     position: 42,
    //   },
    // ];

    // we extract the last type="esp" layer to simplify calculations
    let lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);

    DEV && console.log(`1979 main sorting checks start`);
    if (!doNothing && str[i]) {
      // DEV && console.log(
      //   `1857 ███████████████████████████████████████ IS TAG STARTING? ${startsTag(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );

      // DEV && console.log(
      //   `1707 ███████████████████████████████████████ IS COMMENT STARTING? ${startsHtmlComment(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );

      // DEV && console.log(
      //   `1717 ███████████████████████████████████████ IS ESP TAG STARTING? ${startsEsp(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );

      if (startsTag(str, i, token, layers, withinStyle, leftVal, rightVal)) {
        //
        //
        //
        // TAG STARTING
        //
        //
        //
        DEV && console.log(`2019 (html) tag opening`);

        if (token.type && token.start !== null) {
          if (token.type === "rule") {
            DEV && console.log(`2023`);
            if (property?.start) {
              // patch important if needed
              if (property.importantStarts && !property.importantEnds) {
                property.importantEnds = i;
                property.important = str.slice(property.importantStarts, i);
                DEV &&
                  console.log(
                    `2031 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.importantEnds`}\u001b[${39}m`} = ${
                      property.importantEnds
                    };  ${`\u001b[${33}m${`property.important`}\u001b[${39}m`} = "${
                      property.important
                    }"`,
                  );
              }
              // patch property
              if (property.propertyStarts && !property.propertyEnds) {
                property.propertyEnds = i;
                DEV &&
                  console.log(
                    `2043 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.propertyEnds`}\u001b[${39}m`} = ${
                      property.propertyEnds
                    }`,
                  );
                if (!property.property) {
                  property.property = str.slice(property.propertyStarts, i);
                  DEV &&
                    console.log(
                      `2051 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.property`}\u001b[${39}m`} = ${JSON.stringify(
                        property.property,
                        null,
                        4,
                      )}`,
                    );
                }
              }
              if (!property.end) {
                property.end = i;
                DEV &&
                  console.log(
                    `2063 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${
                      property.end
                    }`,
                  );
              }

              // patch value
              if (property.valueStarts && !property.valueEnds) {
                property.valueEnds = i;
                DEV &&
                  console.log(
                    `2074 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.valueEnds`}\u001b[${39}m`} = ${
                      property.valueEnds
                    }`,
                  );
                if (!property.value) {
                  property.value = str.slice(property.valueStarts, i);
                  DEV &&
                    console.log(
                      `2082 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.value`}\u001b[${39}m`} = ${JSON.stringify(
                        property.value,
                        null,
                        4,
                      )}`,
                    );
                }
              }

              pushProperty(property);
              propertyReset();
              DEV &&
                console.log(
                  `2095 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
                );
            }
          }

          DEV && console.log(`2100 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);

          DEV && console.log(`2103 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
          tokenReset();
        }

        // add other HTML-specific keys onto the object
        // second arg is "start" key:
        initToken("tag", i);
        attribReset();

        DEV &&
          console.log(
            `2114 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`,
          );

        if (withinStyle) {
          withinStyle = false;
          DEV &&
            console.log(
              `2123 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinStyle`}\u001b[${39}m`} = false`,
            );
        }

        // extract the tag name:
        let badCharacters = `?![-/`;
        let extractedTagName = "";
        let letterMet = false;
        DEV && console.log(".");
        DEV &&
          console.log(
            `2134 ${`\u001b[${36}m${`extract the tag name`}\u001b[${39}m`}`,
          );

        if (rightVal) {
          for (let y = rightVal; y < len; y++) {
            DEV &&
              console.log(
                `${`\u001b[${36}m${`str[y]`}\u001b[${39}m`} = ${JSON.stringify(
                  str[y],
                  null,
                  4,
                )}`,
              );
            if (
              !letterMet &&
              str[y]?.trim() &&
              str[y].toUpperCase() !== str[y].toLowerCase()
            ) {
              letterMet = true;
            }
            if (
              // at least one letter has been met, to cater
              // <? xml ...
              letterMet &&
              str[y] &&
              // it's whitespace
              (!str[y].trim() ||
                // or symbol which definitely does not belong to a tag,
                // considering we want to catch some rogue characters to
                // validate and flag them up later
                (!/\w/.test(str[y]) && !badCharacters.includes(str[y])) ||
                str[y] === "[")
              // if letter has been met, "[" is also terminating character
              // think <![CDATA[x<y]]>
              //               ^
              //             this
            ) {
              DEV &&
                console.log(
                  `2173 SET ${`\u001b[${33}m${`extractedTagName`}\u001b[${39}m`} = ${JSON.stringify(
                    extractedTagName,
                    null,
                    4,
                  )}`,
                );
              break;
            } else if (!badCharacters.includes(str[y])) {
              extractedTagName += str[y].trim().toLowerCase();
            }
          }
        }

        DEV && console.log(".");

        // set the kind:

        if (extractedTagName === "doctype") {
          (token as TagToken).kind = "doctype";
          DEV &&
            console.log(
              `2194 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                (token as TagToken).kind
              }`,
            );
        } else if (extractedTagName === "cdata") {
          (token as TagToken).kind = "cdata";
          DEV &&
            console.log(
              `2202 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                (token as TagToken).kind
              }`,
            );
        } else if (extractedTagName === "xml") {
          (token as TagToken).kind = "xml";
          DEV &&
            console.log(
              `2210 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                (token as TagToken).kind
              }`,
            );
        } else if (inlineTags.has(extractedTagName)) {
          (token as TagToken).kind = "inline";
          DEV &&
            console.log(
              `2218 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                (token as TagToken).kind
              }`,
            );

          if (extractedTagName) {
            // for perf
            doNothing = i;
            DEV &&
              console.log(
                `2228 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                  doNothing,
                  null,
                  4,
                )}`,
              );
          }
        }
      } else if (!withinScript && startsHtmlComment(str, i, token, layers)) {
        //
        //
        //
        // HTML COMMENT STARTING
        //
        //
        //
        DEV && console.log(`2244 HTML comment opening`);

        if (token.start != null) {
          DEV && console.log(`2247 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
        }

        // add other HTML-specific keys onto the object
        // second arg is "start" key:
        initToken("comment", i);
        attribReset();
        // the "language" default is "html" anyway so no need to set it

        DEV &&
          console.log(
            `2259 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`,
          );

        // set "closing"
        if (str[i] === "-") {
          (token as CommentToken).closing = true;
          DEV &&
            console.log(
              `2269 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
                (token as CommentToken).closing
              }`,
            );
        } else if (
          matchRightIncl(str, i, ["<![endif]-->"], {
            i: true,
            trimBeforeMatching: true,
            maxMismatches: 2,
          })
        ) {
          (token as CommentToken).closing = true;
          (token as CommentToken).kind = "only";
          DEV &&
            console.log(
              `2284 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
                (token as CommentToken).closing
              }; ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                (token as CommentToken).kind
              }`,
            );
        }

        if (withinStyle) {
          withinStyle = false;
          DEV &&
            console.log(
              `2296 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinStyle`}\u001b[${39}m`} = false`,
            );
        }
      } else if (
        !withinScript &&
        startsCssComment(str, i, token, layers, withinStyle)
      ) {
        //
        //
        //
        // CSS COMMENT STARTING
        //
        //
        //
        DEV && console.log(`2310 CSS block comment opening`);

        if (token.start != null) {
          DEV && console.log(`2313 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
        }

        // add other token-specific keys onto the object
        // second arg is "start" key:
        initToken("comment", i);
        attribReset();

        (token as CommentToken).language = "css";
        DEV &&
          console.log(
            `2325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.language`}\u001b[${39}m`} = ${
              (token as CommentToken).language
            }`,
          );
        (token as CommentToken).kind =
          str[i] === "/" && str[i + 1] === "/" ? "line" : "block";
        token.value = str.slice(i, i + 2);
        token.end = i + 2;
        (token as CommentToken).closing = str[i] === "*" && str[i + 1] === "/";

        withinStyleComment = true;

        if ((token as CommentToken).closing) {
          withinStyleComment = false;
        }

        doNothing = i + 2;
        DEV &&
          console.log(
            `2344 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
          );

        DEV &&
          console.log(
            `2349 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4,
            )}; ${`\u001b[${33}m${`withinStyleComment`}\u001b[${39}m`} = ${JSON.stringify(
              withinStyleComment,
              null,
              4,
            )}`,
          );
      } else if (
        !withinScript &&
        // if we encounter two consecutive characters of guessed lump
        ((typeof lastEspLayerObjIdx === "number" &&
          layers[lastEspLayerObjIdx] &&
          layers[lastEspLayerObjIdx].type === "esp" &&
          (layers[lastEspLayerObjIdx] as LayerEsp).openingLump &&
          (layers[lastEspLayerObjIdx] as LayerEsp).guessedClosingLump &&
          (layers[lastEspLayerObjIdx] as LayerEsp).guessedClosingLump.length >
            1 &&
          // current character is among guessed lump's characters
          (layers[lastEspLayerObjIdx] as LayerEsp).guessedClosingLump.includes(
            str[i],
          ) &&
          // ...and the following character too...
          (layers[lastEspLayerObjIdx] as LayerEsp).guessedClosingLump.includes(
            str[i + 1],
          ) &&
          // since we "jump" over layers, that is, passed quotes
          // and what not, we have to ensure we don't skip
          // legit cases like:
          // ${"${name}${name}${name}${name}"}
          //          ^
          //          here
          // Responsys expression can be within a value! we have
          // to respect those quotes!
          //
          // these are erroneous quotes representing layers
          // which we do ignore (JSP example):
          //
          // <%@taglib prefix="t' tagdir='/WEB-INF/tags"%>
          //                  ^ ^        ^             ^
          //                  errors
          !(
            // we excluse the same case,
            // ${"${name}${name}${name}${name}"}
            //          ^
            //        false ending
            // we ensure that quote doesn't follow the esp layer
            // "lastEspLayerObjIdx" and there's counterpart of it
            // on the right, and there's ESP char on the right of it

            // next layer after esp's follows
            (
              layers[lastEspLayerObjIdx + 1] &&
              // and it's quote
              `'"`.includes((layers[lastEspLayerObjIdx + 1] as any).value) &&
              // matching quote on the right has ESP character following
              // it exists (>-1)
              str.indexOf((layers[lastEspLayerObjIdx + 1] as any).value, i) >
                0 &&
              (
                layers[lastEspLayerObjIdx] as LayerEsp
              ).guessedClosingLump.includes(
                str[
                  right(
                    str,
                    str.indexOf(
                      (layers[lastEspLayerObjIdx + 1] as any).value,
                      i,
                    ),
                  ) as number
                ],
              )
            )
          )) ||
          // hard check
          (startsEsp(str, i, token, layers, withinStyle) &&
            // ensure we're not inside quotes, so it's not an expression within a value
            // ${"${name}${name}${name}${name}"}
            //    ^
            //   we could be here - notice quotes wrapping all around
            //
            (!lastLayerIs("simple") ||
              ![`'`, `"`].includes(
                (layers[~-layers.length] as LayerSimple).value,
              ) ||
              // or we're within an attribute (so quotes are HTML tag's not esp tag's)
              (attrib?.attribStarts && !attrib.attribEnds))))
      ) {
        //
        //
        //
        // ESP TAG STARTING
        //
        //
        //
        DEV &&
          console.log(
            `2448 ${`\u001b[${32}m${`ESP heads or tails start here`}\u001b[${39}m`}`,
          );

        // in case of inline CSS styles, check, maybe we need to end any
        // inline CSS rule tokens
        if (
          attrib?.attribValue.length &&
          !attrib.attribValue[~-attrib.attribValue.length].end
        ) {
          attrib.attribValue[~-attrib.attribValue.length].end = i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
            attrib.attribValue[~-attrib.attribValue.length].start,
            i,
          );
          DEV &&
            console.log(
              `2464 ${`\u001b[${32}m${`PATCH`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValue[~-attrib.attribValue.length]`}\u001b[${39}m`} = ${JSON.stringify(
                attrib.attribValue[~-attrib.attribValue.length],
                null,
                4,
              )}`,
            );
        }

        //
        //
        //
        // FIRST, extract the tag opening and guess the closing judging from it
        let wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(
          str,
          i,
          layers,
        );
        DEV &&
          console.log(
            `2483 ██ ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wholeEspTagLumpOnTheRight`}\u001b[${39}m`} = ${wholeEspTagLumpOnTheRight}`,
          );
        DEV &&
          console.log(
            `2487 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
              layers,
              null,
              4,
            )}`,
          );
        DEV &&
          console.log(
            `2495 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4,
            )}`,
          );

        // lump can't end with attribute's ending, that is, something like:
        // <frameset cols="**">
        // that's a false positive
        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
          DEV && console.log(`2506`);
          // check the "layers" records - maybe it's a closing part of a set?
          let lengthOfClosingEspChunk;

          let disposableVar = {
            char: "",
            idx: 0,
          };

          if (
            layers.length &&
            //
            // if layer match result is truthy, we take it, otherwise, move on
            // but don't calculate twice!
            // eslint-disable-next-line no-cond-assign
            (lengthOfClosingEspChunk = matchLayerLast(
              wholeEspTagLumpOnTheRight,
              layers,
            ))
          ) {
            DEV &&
              console.log(
                `2528 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against the last layer`,
              );
            DEV &&
              console.log(
                `2532 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                  lengthOfClosingEspChunk,
                  null,
                  4,
                )}`,
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

                // correction for XML-like templating tags, closing can
                // have a slash, <c:set zzz/>
                //                         ^
                if (str[i] === ">" && str[leftVal as number] === "/") {
                  token.tailStartsAt = leftVal;
                  DEV &&
                    console.log(
                      `2556 closing slash correction, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} token.tailStartsAt=${
                        token.tailStartsAt
                      }`,
                    );
                  token.tail = str.slice(token.tailStartsAt as number, i + 1);
                }

                DEV &&
                  console.log(
                    `2565 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${32}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                      token,
                      null,
                      4,
                    )}`,
                  );
              }

              // activate doNothing until the end of tails because otherwise,
              // mid-tail characters will initiate new tail start clauses
              // and we'll have overlap/false result
              doNothing = token.tailEndsAt as number;
              DEV &&
                console.log(
                  `2579 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
                );

              DEV &&
                console.log(
                  `2584 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4,
                  )}; ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                    property,
                    null,
                    4,
                  )}; ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                    attrib,
                    null,
                    4,
                  )};`,
                );
              // it depends will we ping it as a standalone token or will we
              // nest inside the parent tag among attributes
              if (parentTokenToBackup) {
                DEV &&
                  console.log(
                    `2603 ${`\u001b[${32}m${`NEST INSIDE THE STASHED TAG`}\u001b[${39}m`}`,
                  );
                // push token to parent, to be among its attributes

                // 1. ensure key "attribs" exist (thinking about comment tokens etc)
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs = [];
                }

                // 2. push somewhere
                if (property?.start) {
                  // push to attribValue
                  DEV &&
                    console.log(
                      `2617 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} token to be inside ${`\u001b[${33}m${`property.value`}\u001b[${39}m`}`,
                    );
                  if (!Array.isArray(property.value)) {
                    property.value = [];
                  }
                  property.value.push({ ...token } as any);

                  DEV &&
                    console.log(
                      `2626 ${`\u001b[${32}m${`NOW`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                        property,
                        null,
                        4,
                      )}`,
                    );
                } else if (attribToBackup) {
                  // restore
                  attrib = attribToBackup;
                  DEV &&
                    console.log(
                      `2637 ${`\u001b[${35}m${`RESTORE`}\u001b[${39}m`} attrib from stashed, now = ${JSON.stringify(
                        attrib,
                        null,
                        4,
                      )}`,
                    );

                  // push to attribValue
                  DEV &&
                    console.log(
                      `2647 PUSH token to be inside ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}`,
                    );
                  attrib.attribValue.push({ ...token } as any);
                } else if (
                  attrib?.attribStarts &&
                  Array.isArray(attrib.attribValue)
                ) {
                  // push to attrib value
                  DEV && console.log(`2655 PUSH token to attrib`);
                  attrib.attribValue.push({ ...token } as any);
                  DEV &&
                    console.log(
                      `2659 now ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
                        attrib.attribValue,
                        null,
                        4,
                      )}`,
                    );
                } else {
                  // push to attribs
                  DEV && console.log(`2667 PUSH token to be among attribs`);
                  parentTokenToBackup.attribs.push({ ...token } as any);
                }

                // 3. parentTokenToBackup becomes token
                token = clone(parentTokenToBackup);
                DEV &&
                  console.log(
                    `2675 ${`\u001b[${32}m${`RESTORE`}\u001b[${39}m`} ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                      token,
                      null,
                      4,
                    )}`,
                  );

                // 4. resets
                parentTokenToBackup = undefined;
                attribToBackup = undefined;

                // 5. pop layers, remove the opening ESP tag record
                DEV && console.log(`2687 POP layers`);
                layers.pop();

                // 6. finally, continue, bypassing the rest of the code in this loop
                DEV &&
                  console.log(
                    `2693 ${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`,
                  );

                continue;
              } else {
                DEV &&
                  console.log(
                    `2700 ${`\u001b[${32}m${`PING AS STANDALONE`}\u001b[${39}m`}`,
                  );
                dumpCurrentToken(token, i);
              }

              DEV &&
                console.log(`2706 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
              tokenReset();
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers.pop();
            DEV &&
              console.log(
                `2715 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`,
              );
          } else if (
            layers.length &&
            // eslint-disable-next-line no-cond-assign
            (lengthOfClosingEspChunk = matchLayerLast(
              wholeEspTagLumpOnTheRight,
              layers,
              true,
            ))
          ) {
            DEV &&
              console.log(
                `2728 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against first layer`,
              );
            DEV &&
              console.log(
                `2732 wipe all layers, there were strange unclosed characters`,
              );
            DEV &&
              console.log(
                `2736 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                  lengthOfClosingEspChunk,
                  null,
                  4,
                )}`,
              );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + (lengthOfClosingEspChunk || 0);
                token.value = str.slice(token.start, token.end);
                DEV &&
                  console.log(
                    `2751 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                      token,
                      null,
                      4,
                    )} before pinging`,
                  );
              }
              if (!token.tailStartsAt) {
                token.tailStartsAt = i;
              }
              if (!token.tailEndsAt && lengthOfClosingEspChunk) {
                token.tailEndsAt = token.tailStartsAt + lengthOfClosingEspChunk;
                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
              }
              dumpCurrentToken(token, i);

              DEV &&
                console.log(`2768 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
              tokenReset();
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers.length = 0;
            DEV &&
              console.log(
                `2777 ${`\u001b[${32}m${`WIPE`}\u001b[${39}m`} layers`,
              );
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
            attrib?.attribValue?.length &&
            attrib.attribValue[~-attrib.attribValue.length].start &&
            Array.from(
              str.slice(
                attrib.attribValue[~-attrib.attribValue.length].start,
                i,
              ),
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
                (disposableVar = { char, idx }),
            ) &&
            // we're inside attribute
            token.type === "tag" &&
            attrib?.attribValueStartsAt &&
            !attrib.attribValueEndsAt &&
            // last attribute's value element is text-type
            // imagine, the { x from <a b="{ x %}"> would be
            // such unrecognised text:
            attrib.attribValue[~-attrib.attribValue.length] &&
            (attrib.attribValue[~-attrib.attribValue.length] as any).type ===
              "text"
          ) {
            DEV &&
              console.log(
                `2842 ${`\u001b[${31}m${`██`}\u001b[${39}m`} seems like a stray lump`,
              );
            DEV &&
              console.log(
                `2846 FIY, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                  attrib,
                  null,
                  4,
                )}`,
              );
            DEV &&
              console.log(
                `2854 FIY, ${`\u001b[${33}m${`disposableVar`}\u001b[${39}m`} = ${JSON.stringify(
                  disposableVar,
                  null,
                  4,
                )}`,
              );

            DEV &&
              console.log(
                `2863 let's convert last attrib.attribValue[] object into ESP-type`,
              );

            // token does contain ESP tags, so it's not pure HTML
            token.pureHTML = false;

            let lastAttrValueObj =
              attrib.attribValue[~-attrib.attribValue.length];

            // getNewToken() just creates a new token according
            // the latest (DRY) reference, it doesn't reset
            // the "token" unlike initToken()
            let newTokenToPutInstead: EspToken = getNewToken(
              "esp",
              lastAttrValueObj.start,
            ) as EspToken;

            // for remaining values, we need to consider, is there
            // text in front:
            //
            // <a b="{ x %}">
            // vs.
            // <a b="something { x %}">

            if (!disposableVar.idx) {
              DEV &&
                console.log(
                  `2890 ${`\u001b[${33}m${`ESP tag is this whole text token`}\u001b[${39}m`}`,
                );
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt =
                newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = i;
              newTokenToPutInstead.tailEndsAt =
                i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;

              (attrib.attribValue as any[])[~-attrib.attribValue.length] =
                newTokenToPutInstead;
            } else {
              DEV &&
                console.log(
                  `2906 ${`\u001b[${33}m${`we need to extract frontal part of text token`}\u001b[${39}m`}`,
                );
            }
          } else {
            DEV &&
              console.log(
                `2912 closing part of a set ${`\u001b[${31}m${`NOT MATCHED`}\u001b[${39}m`} - means it's a new opening`,
              );

            // If we've got an unclosed heads and here new heads are starting,
            // pop the last heads in layers - they will never be matched anyway.
            // Let parser/linter deal with it
            if (lastLayerIs("esp")) {
              layers.pop();
              DEV &&
                console.log(
                  `2922 ${`\u001b[${31}m${`POP layers - it was heads without tails`}\u001b[${39}m`}`,
                );
            }

            // if we're within a tag attribute, push the last esp token there
            if (attribToBackup) {
              if (!Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue = [];
              }
              DEV && console.log(`2931 push token to attribValue`);
              attribToBackup.attribValue.push(token as any);
            }

            DEV && console.log(`2935 push new layer`);
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLumpOnTheRight,
              guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
              position: i,
            });
            DEV &&
              console.log(
                `2944 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  {
                    type: "esp",
                    openingLump: wholeEspTagLumpOnTheRight,
                    guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
                    position: i,
                  },
                  null,
                  4,
                )}`,
              );
            DEV &&
              console.log(
                `2957 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                  layers,
                  null,
                  4,
                )}`,
              );

            // also, if it's a standalone ESP token, terminate the previous token
            // and start recording a new-one

            if (token.start !== null) {
              // it means token has already being recorded, we need to tackle it -
              // the new, ESP token is incoming!

              // we nest ESP tokens inside "tag" type attributes
              if (token.type === "tag") {
                DEV &&
                  console.log(
                    `2975 ${`\u001b[${36}m${`██`}\u001b[${39}m`} ESP tag-inside-tag clauses`,
                  );
                // maybe it's an ESP token within an inline CSS style?
                // <div style="width: {{ w }}">

                DEV &&
                  console.log(
                    `2982 FIY, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                      attrib,
                      null,
                      4,
                    )}`,
                  );

                if (attrib && attrib.attribName === "style") {
                  DEV &&
                    console.log(
                      `2992 ${`\u001b[${32}m${`ESP inside inline CSS style rule's value`}\u001b[${39}m`}`,
                    );

                  if (
                    property.start &&
                    !property.end &&
                    property.propertyEnds &&
                    !property.valueStarts
                  ) {
                    property.valueStarts = i;
                    DEV &&
                      console.log(
                        `3004 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.valueStarts`}\u001b[${39}m`} = ${JSON.stringify(
                          property.valueStarts,
                          null,
                          4,
                        )}`,
                      );
                  } else if (property.start) {
                    // imagine:

                    // <div style="width: 100{{ w }}">
                    //                       ^
                    //               we're here

                    // or

                    // <td style="a: b; {% if x %}c: d{% endif %} e: f;">x</td>
                    //                                ^
                    //                        we're here

                    if (!Array.isArray(property.value)) {
                      // terminate the property
                      DEV &&
                        console.log(
                          `3027 ███████████████████████████████████████ FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                            token,
                            null,
                            4,
                          )}; ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                            property,
                            null,
                            4,
                          )}; ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                            attrib,
                            null,
                            4,
                          )}`,
                        );

                      // complete the property
                      if (property.propertyStarts && !property.propertyEnds) {
                        DEV && console.log(`3044`);
                        property.propertyEnds = (leftVal as number) + 1;
                        property.property = str.slice(
                          property.propertyStarts,
                          i,
                        );
                      } else if (property.valueStarts && !property.valueEnds) {
                        DEV && console.log(`3051`);
                        property.valueEnds = (leftVal as number) + 1;
                        property.value = str.slice(
                          property.valueStarts,
                          property.valueEnds,
                        );
                      }

                      if (property.start && !property.end) {
                        property.end = (leftVal as number) + 1;
                      }

                      DEV &&
                        console.log(
                          `3065 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                            property,
                            null,
                            4,
                          )}`,
                        );

                      if (attrib && Array.isArray(attrib.attribValue)) {
                        attrib.attribValue.push(clone(property));
                        DEV &&
                          console.log(
                            `3076 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} property into ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}`,
                          );

                        // if there was trailing whitespace, like for example:
                        // <td style="a: b;\n    {% if x %}c: d {% endif %}\ne: f;">
                        //                                     ^
                        //                                  here
                        //
                        // then create the missing text token to reflect this gap
                        if (property.end !== i) {
                          DEV &&
                            console.log(
                              `3088 PATCH NEEDED ███████████████████████████████████████`,
                            );
                          let newTextToken = getNewToken(
                            "text",
                            (leftVal as number) + 1,
                          ) as TextToken;
                          newTextToken.end = i;
                          newTextToken.value = str.slice(
                            (leftVal as number) + 1,
                            i,
                          );
                          DEV &&
                            console.log(
                              `3101 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}${`\u001b[${33}m${`newTextToken`}\u001b[${39}m`} = ${JSON.stringify(
                                newTextToken,
                                null,
                                4,
                              )}`,
                            );
                          attrib.attribValue.push(clone(newTextToken));
                        }

                        propertyReset();
                        DEV &&
                          console.log(
                            `3113 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} property`,
                          );
                      }
                    }
                  }
                } else {
                  // usual inner-tag ESP tokens
                  // <a b="{% if something %}">

                  // instead of dumping the tag token and starting a new-one,
                  // save the parent token, then nest all ESP tags among attributes
                  if (
                    token.tagNameStartsAt &&
                    (!token.tagName || !token.tagNameEndsAt)
                  ) {
                    token.tagNameEndsAt = i;
                    token.tagName = str.slice(token.tagNameStartsAt, i);
                    token.recognised = isTagNameRecognised(token.tagName);
                    DEV &&
                      console.log(
                        `3133 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
                          token.tagNameEndsAt
                        }; ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
                          token.tagName
                        }`,
                      );
                  }

                  if (attrib.attribStarts && !attrib.attribEnds) {
                    attribToBackup = clone(attrib);
                    DEV &&
                      console.log(
                        `3145 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attribToBackup`}\u001b[${39}m`} = ${JSON.stringify(
                          attribToBackup,
                          null,
                          4,
                        )}`,
                      );
                  }
                }

                parentTokenToBackup = clone(token);
                DEV &&
                  console.log(
                    `3157 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`parentTokenToBackup`}\u001b[${39}m`} = ${JSON.stringify(
                      parentTokenToBackup,
                      null,
                      4,
                    )}`,
                  );
              } else if (token.type === "text") {
                // case like:
                // <div style="x: a{{ b }}c{{ d }}e;">
                //                         ^
                //                  we're here

                token.end = i;
                token.value = str.slice(token.start, i);
                DEV &&
                  console.log(
                    `3173 COMPLETE ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                      token,
                      null,
                      4,
                    )}`,
                  );

                if (Array.isArray(property.value)) {
                  property.value.push(token);
                  DEV &&
                    console.log(
                      `3184 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`property`}\u001b[${39}m`} now: ${JSON.stringify(
                        property,
                        null,
                        4,
                      )}`,
                    );
                } else {
                  DEV && console.log(`3191 dump the token`);
                  dumpCurrentToken(token, i);
                }
              } else if (!attribToBackup) {
                DEV &&
                  console.log(
                    `3197 ${`\u001b[${36}m${`██`}\u001b[${39}m`} standalone ESP tag - call the dump`,
                  );
                dumpCurrentToken(token, i);
              } else if (
                attribToBackup &&
                Array.isArray(attribToBackup.attribValue) &&
                attribToBackup.attribValue.length &&
                (
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ] as any
                ).type === "esp" &&
                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .end
              ) {
                DEV &&
                  console.log(
                    `3214 complete the unclosed token in attribToBackup`,
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
                  i,
                );
                DEV &&
                  console.log(
                    `3229 ██ patched ${`\u001b[${33}m${`attribToBackup`}\u001b[${39}m`} = ${JSON.stringify(
                      attribToBackup,
                      null,
                      4,
                    )}`,
                  );
              }
            }

            // now, either way, if parent tag was stashed in "parentTokenToBackup"
            // or if this is a new ESP token and there's nothing to nest,
            // let's initiate it:
            initToken("esp", i);
            // attribReset();
            // ^^^ DON'T RESET attrib - because we nest ESP tags within attrib.value

            DEV &&
              console.log(
                `3247 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`,
              );
            (token as EspToken).head = wholeEspTagLumpOnTheRight;
            (token as EspToken).headStartsAt = i;
            (token as EspToken).headEndsAt =
              i + wholeEspTagLumpOnTheRight.length;

            // toggle parentTokenToBackup.pureHTML
            if (parentTokenToBackup?.pureHTML) {
              parentTokenToBackup.pureHTML = false;
              DEV &&
                console.log(
                  `3263 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`parentTokenToBackup.pureHTML`}\u001b[${39}m`} = ${JSON.stringify(
                    parentTokenToBackup.pureHTML,
                    null,
                    4,
                  )}`,
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
              DEV && console.log(`3289 *`);
              if (
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .start === token.start
              ) {
                DEV &&
                  console.log(
                    `3296 ${`\u001b[${31}m${`TEXT TOKEN INITIATED WHERE ESP WILL BE`}\u001b[${39}m`}`,
                  );
                // erase it from stash
                attribToBackup.attribValue.pop();
                DEV &&
                  console.log(
                    `3302 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} attribToBackup.attribValue, now attribToBackup.attribValue: ${JSON.stringify(
                      attribToBackup.attribValue,
                      null,
                      4,
                    )}`,
                  );
              } else if (
                // if the "text" type object is the last in "attribValue" and
                // it's not closed, let's close it and calculate its value:
                (
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ] as any
                ).type === "text" &&
                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .end
              ) {
                DEV && console.log(`3319`);
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].end = i;
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].value = str.slice(
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ].start,
                  i,
                );

                DEV && console.log(`3332`);
              }
            }
          }

          // do nothing for the second and following characters from the lump
          doNothing =
            i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
          DEV &&
            console.log(
              `3342 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
            );
        }

        DEV && console.log(`3346 end of ESP head/tail clauses reached`);
      } else if (
        !withinScript &&
        withinStyle &&
        !withinStyleComment &&
        str[i]?.trim() &&
        // insurance against rogue extra closing curlies:
        // .a{x}}
        // don't start new rule at closing curlie!
        !`{}`.includes(str[i]) &&
        // if at rule starts right after <style>, if we're on "@"
        // for example:
        // <style>@media a {.b{c}}</style>
        // first the <style> tag token will be pushed and then tag object
        // reset and then, still at "@"
        (!token.type ||
          // or, there was whitespace and we started recording a text token
          // <style>  @media a {.b{c}}</style>
          //          ^
          //        we're here - look at the whitespace on the left.
          //
          ["text"].includes(token.type))
      ) {
        // Text token inside styles can be either whitespace chunk
        // or rogue characters. In either case, inside styles, when
        // "withinStyle" is on, non-whitespace character terminates
        // this text token and "rule" token starts
        DEV &&
          console.log(
            `3375 ██ ${`\u001b[${32}m${`at/rule starts`}\u001b[${39}m`}`,
          );

        if (token.type) {
          DEV && console.log(`3379 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
        }

        initToken(str[i] === "@" ? "at" : "rule", i);
        attribReset();
        (token as RuleToken).left = lastNonWhitespaceCharAt;
        DEV &&
          console.log(
            `3388 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.left`}\u001b[${39}m`} = ${JSON.stringify(
              (token as RuleToken).left,
              null,
              4,
            )}`,
          );
        (token as RuleToken).nested = layers.some((o) => o.type === "at");
        DEV &&
          console.log(
            `3397 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.nested`}\u001b[${39}m`} = ${JSON.stringify(
              (token as RuleToken).nested,
              null,
              4,
            )}`,
          );
      } else if (!token.type) {
        DEV && console.log(`3404 BLANK token, so initiate text token`);
        initToken("text", i);
        attribReset();
        DEV &&
          console.log(
            `3409 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4,
            )}`,
          );

        if (withinScript && str.indexOf("</script>", i)) {
          DEV &&
            console.log(
              `3419 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                doNothing,
                null,
                4,
              )}`,
            );
          doNothing = str.indexOf("</script>", i);
        } else {
          doNothing = i;
          DEV &&
            console.log(
              `3430 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                doNothing,
                null,
                4,
              )}`,
            );
        }
      }
    }

    let R1;
    let R2;
    if (
      !doNothing &&
      str[i] &&
      (property.start || str[i] === "!") &&
      (!layers.length || layers[~-layers.length].type !== "esp") &&
      (token.type !== "text" || Array.isArray(property.value))
    ) {
      let idxRightIncl = right(str, i - 1) as number;
      R1 =
        `;<>`.includes(str[idxRightIncl]) ||
        // or it's a quote
        (`'"`.includes(str[idxRightIncl]) &&
          // but then it has to be a matching counterpart
          // either there are no layers
          // or there are but they're empty
          (!layers?.length ||
            // or array is not empty but its last element is
            !layers[~-layers.length] ||
            // or it's neither empty not falsy but doesn't have "value" key
            !(layers[~-layers.length] as any).value ||
            // or it is a plain object with a value key and that layer
            // means opening quotes has been opened and this quote at this
            // index (or if it's whitespace, first index to the right) is a
            // closing counterpart for that quote in "layers"
            (layers[~-layers.length] as any).value === str[idxRightIncl]));
      R2 = matchRightIncl(str, i, ["!important"], {
        i: true,
        trimBeforeMatching: true,
        maxMismatches: 2,
      });
      DEV &&
        console.log(
          `3474 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${
            R1 ? 32 : 31
          }m${`R1`}\u001b[${39}m`} = ${R1}; ${`\u001b[${
            R2 ? 32 : 31
          }m${`R2`}\u001b[${39}m`} = ${R2}`,
        );
    }

    // catch the end of a css property (with or without !important)
    // -------------------------------------------------------------------------
    /* c8 ignore next */
    if (
      !doNothing &&
      property &&
      ((property.semi && property.semi < i && property.semi < i) ||
        (((property.valueStarts &&
          !property.valueEnds &&
          str[rightVal as number] !== "!" &&
          // either non-whitespace character doesn't exist on the right
          (!rightVal ||
            // or at that character !important does not start
            R1)) ||
          (property.importantStarts && !property.importantEnds)) &&
          (!property.valueEnds || str[rightVal as number] !== ";") &&
          // either end of string was reached
          // or it's a whitespace
          (!str[i]?.trim() ||
            // or it's a semicolon after a value
            (!property.valueEnds && str[i] === ";") ||
            // or we reached the end of the attribute
            attrEndsAt(
              i,
              Array.isArray(property.value) &&
                property.value[~-property.value.length].type === "esp",
            ))))
    ) {
      DEV &&
        console.log(
          `3512 ${`\u001b[${32}m${`css property ends`}\u001b[${39}m`}`,
        );

      /* c8 ignore next */
      if (property.importantStarts && !property.importantEnds) {
        property.importantEnds = (left(str, i) as number) + 1;
        property.important = str.slice(
          property.importantStarts,
          property.importantEnds,
        );
        DEV &&
          console.log(
            `3524 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.importantEnds`}\u001b[${39}m`} = ${JSON.stringify(
              property.importantEnds,
              null,
              4,
            )}; ${`\u001b[${33}m${`property.important`}\u001b[${39}m`} = ${JSON.stringify(
              property.important,
              null,
              4,
            )}`,
          );
      }

      /* c8 ignore next */
      if (property.valueStarts && !property.valueEnds) {
        property.valueEnds = (left(str, i) as number) + 1;
        if (!Array.isArray(property.value)) {
          property.value = str.slice(property.valueStarts, property.valueEnds);
          DEV &&
            console.log(
              `3543 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.valueEnds`}\u001b[${39}m`} = ${JSON.stringify(
                property.valueEnds,
                null,
                4,
              )}; ${`\u001b[${33}m${`property.value`}\u001b[${39}m`} = ${JSON.stringify(
                property.value,
                null,
                4,
              )}`,
            );
        }
      }

      /* c8 ignore next */
      if (str[i] === ";") {
        property.semi = i;
        DEV &&
          console.log(
            `3561 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
              property.semi,
              null,
              4,
            )}`,
          );
        property.end = i + 1;
        DEV &&
          console.log(
            `3570 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
              property.end,
              null,
              4,
            )}`,
          );
      } else if (str[rightVal as number] === ";") {
        property.semi = rightVal;
        property.end = (property.semi as number) + 1;
        DEV &&
          console.log(
            `3581 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
              property.semi,
              null,
              4,
            )}; ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
              property.end,
              null,
              4,
            )}`,
          );

        doNothing = property.end;
        DEV &&
          console.log(
            `3595 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
              doNothing,
              null,
              4,
            )}`,
          );
      }

      /* c8 ignore next */
      if (!property.end) {
        property.end = (left(str, i) as number) + 1;
        DEV &&
          console.log(
            `3608 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
              property.end,
              null,
              4,
            )}`,
          );
      }

      /* c8 ignore next */
      if (token.type === "text" && token.start && !token.end) {
        token.end = i;
        token.value = str.slice(token.start, i);
        if (Array.isArray(property.value)) {
          property.value.push(token);
          DEV &&
            console.log(
              `3624 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
        }

        // restore real token
        if (parentTokenToBackup) {
          token = clone(parentTokenToBackup);
          DEV &&
            console.log(
              `3637 ${`\u001b[${32}m${`RESTORE`}\u001b[${39}m`} ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                token,
                null,
                4,
              )}`,
            );
        }
      }

      // we might need to extract inner whitespace as
      // a standalone text token:
      // <style>.a{  padding:  1px  2px  3px  4px  }
      //                                           ^
      //                                  we're here

      let newTextToken;
      if (
        property.valueEnds !== i &&
        !property.important &&
        !str[i - 1].trim()
      ) {
        newTextToken = getNewToken("text", property.valueEnds) as TextToken;
        newTextToken.end = i;
        newTextToken.value = str.slice(property.valueEnds as number, i);
        DEV &&
          console.log(
            `3663 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}${`\u001b[${33}m${`newTextToken`}\u001b[${39}m`} = ${JSON.stringify(
              newTextToken,
              null,
              4,
            )}`,
          );
      }

      pushProperty(property);
      DEV &&
        console.log(
          `3674 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            property,
            null,
            4,
          )}, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`}`,
        );
      propertyReset();
      if (newTextToken) {
        DEV &&
          console.log(
            `3684 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              newTextToken,
              null,
              4,
            )}`,
          );
        pushProperty(newTextToken);
      }

      if (!doNothing && (!str[i] || str[i].trim()) && str[i] === ";") {
        doNothing = i;
        DEV &&
          console.log(
            `3697 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
              doNothing,
              null,
              4,
            )}`,
          );
      }
    }

    // catch the end of a css property's value
    // -------------------------------------------------------------------------
    /* c8 ignore next */
    if (
      !doNothing &&
      // token.type === "rule" &&
      property?.start &&
      property.valueStarts &&
      !property.valueEnds
    ) {
      DEV &&
        console.log(
          `3718 ${`\u001b[${90}m${`css property's value ending clauses`}\u001b[${39}m`}`,
        );
      if (
        // either end was reached
        !str[i] ||
        // or terminating characters (semi etc) follow
        R1 ||
        // or !important starts
        R2 ||
        str[right(str, i - 1) as number] === "!" ||
        // normal head css styles:
        (`;}`.includes(str[i]) &&
          (!attrib?.attribName || attrib.attribName !== "style")) ||
        // inline css styles within html
        (`;'"`.includes(str[i]) &&
          attrib &&
          attrib.attribName === "style" &&
          // it's real quote, not rogue double-wrapping around the value
          ifQuoteThenAttrClosingQuote(i)) ||
        // it's a whitespace chunk with linebreaks
        (rightVal &&
          !str[i].trim() &&
          (str.slice(i, rightVal).includes("\n") ||
            str.slice(i, rightVal).includes("\r")))
      ) {
        DEV &&
          console.log(
            `3745 FIY, ${`\u001b[${33}m${`lastNonWhitespaceCharAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastNonWhitespaceCharAt,
              null,
              4,
            )}`,
          );

        if (
          lastNonWhitespaceCharAt &&
          // it's not a quote
          (!`'"`.includes(str[i]) ||
            // there's nothing on the right
            !rightVal ||
            // or it is a quote, but there's no quote on the right
            !`'";`.includes(str[rightVal]))
        ) {
          property.valueEnds = lastNonWhitespaceCharAt + 1;
          DEV &&
            console.log(
              `3764 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.valueEnds`}\u001b[${39}m`} = ${
                property.valueEnds
              }`,
            );

          // if it's a text token, end it, imagine
          // <div style="width: {{ w }}px">
          //                             ^
          //                          we're here
          if (token.type === "text") {
            token.end = i;
            token.value = str.slice(token.start, i);
            DEV &&
              console.log(
                `3778 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`,
              );

            if (Array.isArray(property.value)) {
              property.value.push(token);
              DEV &&
                console.log(
                  `3787 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`property`}\u001b[${39}m`}, now: ${JSON.stringify(
                    property,
                    null,
                    4,
                  )}`,
                );
            }

            // restore parent token
            token = clone(parentTokenToBackup) as TagToken;
          }

          if (!Array.isArray(property.value)) {
            property.value = str.slice(
              property.valueStarts,
              lastNonWhitespaceCharAt + 1,
            );
            DEV &&
              console.log(
                `3806 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.value`}\u001b[${39}m`} = ${
                  property.value
                }`,
              );
          }
        }
        if (str[i] === ";") {
          property.semi = i;
          DEV &&
            console.log(
              `3816 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
                property.semi,
                null,
                4,
              )}`,
            );
        } else if (
          // it's whitespace
          str[i] &&
          !str[i].trim() &&
          // semicolon follows
          str[rightVal as number] === ";"
        ) {
          property.semi = rightVal;
          DEV &&
            console.log(
              `3832 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
                property.semi,
                null,
                4,
              )}`,
            );
        }

        if (
          // if semicolon has been spotted...
          property.semi
        ) {
          // set the ending too
          property.end = property.semi + 1; // happy path, clean code has "end" at semi
          DEV &&
            console.log(
              `3848 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
                property.end,
                null,
                4,
              )}`,
            );
        }

        if (
          // if there's no semicolon in the view
          !property.semi &&
          // and semi is not coming next
          !R1 &&
          // and !important is not following
          !R2 &&
          str[right(str, i - 1) as number] !== "!" &&
          // and property hasn't ended
          !property.end
        ) {
          // we need to end it because this is it
          property.end = i;
          DEV &&
            console.log(
              `3871 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
                property.end,
                null,
                4,
              )}`,
            );
        }

        DEV &&
          console.log(
            `3881 ${`\u001b[${32}m${`NOW`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              property,
              null,
              4,
            )}`,
          );

        if (property.end) {
          // push and init and patch up to resume
          if (property.end > i) {
            // if ending is in the future, skip everything up to it
            doNothing = property.end;
            DEV &&
              console.log(
                `3895 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                  doNothing,
                  null,
                  4,
                )}`,
              );
          }
          pushProperty(property);
          propertyReset();
          DEV &&
            console.log(
              `3906 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
            );
        }
      } else if (
        str[i] === ":" &&
        property?.colon &&
        property.colon < i &&
        lastNonWhitespaceCharAt &&
        property.colon + 1 < lastNonWhitespaceCharAt
      ) {
        // .a{b:c d:e;}
        //         ^
        //  we're here
        //
        DEV &&
          console.log(
            `3922 ${`\u001b[${31}m${`MISSING SEMICOL`}\u001b[${39}m`}`,
          );
        DEV &&
          console.log(
            `3926 FIY, ${`\u001b[${33}m${`lastNonWhitespaceCharAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastNonWhitespaceCharAt,
              null,
              4,
            )}`,
          );

        // semicolon is missing...
        // traverse backwards from "lastNonWhitespaceCharAt", just in case
        // there's space before colon, .a{b:c d :e;}
        //                                      ^
        //                               we're here
        //
        // we're looking to pinpoint where one rule ends and another starts.

        DEV &&
          console.log(
            `3943 ██ "${str.slice(
              right(str, property.colon) as any,
              lastNonWhitespaceCharAt + 1,
            )}"`,
          );
        let split: string[] = [];

        if (right(str, property.colon)) {
          split = str
            .slice(
              right(str, property.colon) as number,
              lastNonWhitespaceCharAt + 1,
            )
            .split(/\s+/);
          DEV &&
            console.log(
              `${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
                split,
                null,
                4,
              )}`,
            );
        }
        if (split.length === 2) {
          // it's missing semicolon, like: .a{b:c d:e;}
          //                                 ^   ^
          //                                 |gap| we split
          //
          property.valueEnds = property.valueStarts + split[0].length;
          property.value = str.slice(property.valueStarts, property.valueEnds);
          property.end = property.valueEnds;
          DEV &&
            console.log(
              `3976 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );

          // push and init and patch up to resume
          DEV &&
            console.log(
              `3986 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
          pushProperty(property);
          // backup the values before wiping the property:
          let whitespaceStarts = property.end;
          let newPropertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
          propertyReset();
          DEV &&
            console.log(
              `3999 push, then ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
            );

          pushProperty({
            type: "text",
            start: whitespaceStarts,
            end: newPropertyStarts,
            value: str.slice(whitespaceStarts, newPropertyStarts),
          } as any);
          DEV &&
            console.log(
              `4010 PUSH to ${`\u001b[${33}m${`token.properties`}\u001b[${39}m`}, now = ${JSON.stringify(
                (token as any).properties,
                null,
                4,
              )}`,
            );

          property.start = newPropertyStarts;
          property.propertyStarts = newPropertyStarts;
          DEV &&
            console.log(
              `4021 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
        }
      } else if (str[i] === "/" && str[rightVal as number] === "*") {
        // comment starts
        // <a style="color: red/* zzz */">
        //                     ^
        //                we're here

        /* c8 ignore next */
        if (property.valueStarts && !property.valueEnds) {
          property.valueEnds = i;
          property.value = str.slice(property.valueStarts, i);
        }

        /* c8 ignore next */
        if (!property.end) {
          property.end = i;
        }

        DEV &&
          console.log(
            `4047 ${`\u001b[${32}m${`NOW`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              property,
              null,
              4,
            )}`,
          );

        // push and init and patch up to resume
        pushProperty(property);
        propertyReset();
        DEV &&
          console.log(
            `4059 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
          );
      }
    }

    // catch the css property's semicolon
    // -------------------------------------------------------------------------
    if (!doNothing && property?.start && !property.end && str[i] === ";") {
      property.semi = i;
      property.end = i + 1;
      DEV &&
        console.log(
          `4071 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
            property.semi,
            null,
            4,
          )}; ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
            property.end,
            null,
            4,
          )}`,
        );
      if (!property.propertyEnds) {
        property.propertyEnds = i;
        DEV &&
          console.log(
            `4085 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.propertyEnds`}\u001b[${39}m`} = ${JSON.stringify(
              property.propertyEnds,
              null,
              4,
            )}`,
          );
      }
      if (
        property.propertyStarts &&
        property.propertyEnds &&
        !property.property
      ) {
        property.property = str.slice(
          property.propertyStarts,
          property.propertyEnds,
        );
        DEV &&
          console.log(
            `4103 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.property`}\u001b[${39}m`} = ${JSON.stringify(
              property.property,
              null,
              4,
            )}`,
          );
      }

      pushProperty(property);
      DEV &&
        console.log(
          `4114 push ${JSON.stringify(
            property,
            null,
            4,
          )}, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`}`,
        );
      propertyReset();

      doNothing = i;
      DEV &&
        console.log(
          `4125 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
            doNothing,
            null,
            4,
          )}`,
        );
    }

    // catch the end of css property's !important
    // -------------------------------------------------------------------------
    /* c8 ignore next */
    if (
      property?.importantStarts &&
      !property.importantEnds &&
      str[i] &&
      !str[i].trim()
    ) {
      property.importantEnds = i;
      property.important = str.slice(property.importantStarts, i);
      DEV &&
        console.log(
          `4146 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.importantEnds`}\u001b[${39}m`} = ${
            property.importantEnds
          };  ${`\u001b[${33}m${`property.important`}\u001b[${39}m`} = ${JSON.stringify(
            property.important,
            null,
            0,
          )}`,
        );
    }

    // catch the start of css property's !important
    // -------------------------------------------------------------------------
    /* c8 ignore next */
    if (
      !doNothing &&
      property?.valueEnds &&
      !property.importantStarts &&
      // it's an exclamation mark
      (str[i] === "!" ||
        // considering missing excl. mark cases, more strict req.:
        (isLatinLetter(str[i]) && str.slice(i).match(importantStartsRegexp)))
    ) {
      DEV &&
        console.log(
          `4170 ${`\u001b[${32}m${`css property's !important starts`}\u001b[${39}m`}`,
        );
      property.importantStarts = i;
      DEV &&
        console.log(
          `4175 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.importantStarts`}\u001b[${39}m`} = ${JSON.stringify(
            property.importantStarts,
            null,
            4,
          )}`,
        );

      // correction for cases like:
      // <style>.a{color:red 1important}
      //                     ^
      //            we're here, that "1" needs to be included as part of important
      if (
        // it's non-whitespace char in front
        (str[i - 1]?.trim() &&
          // and before that it's whitespace
          str[i - 2] &&
          !str[i - 2].trim()) ||
        // there's a "1" in front
        (str[i - 1] === "1" &&
          // and it's not numeric character before it
          // padding: 101important
          //            ^
          //          unlikely it's a mistyped !
          str[i - 2] &&
          !/\d/.test(str[i - 2]))
      ) {
        // merge that character into !important
        property.valueEnds = (left(str, i - 1) as number) + 1;
        property.value = str.slice(
          property.valueStarts as number,
          property.valueEnds,
        );
        DEV &&
          console.log(
            `4209 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              property,
              null,
              4,
            )}`,
          );
        property.importantStarts--;
        property.important = `${str[i - 1]}${property.important}`;
      }
    }

    // catch the start of a css property's value
    // -------------------------------------------------------------------------
    /* c8 ignore next */
    if (
      !doNothing &&
      property?.colon &&
      !property.valueStarts &&
      // can't be within ESP token,
      // <div style="width: {{ w }}">
      //                       ^
      (!layers.length || layers[~-layers.length].type !== "esp") &&
      str[i]?.trim()
    ) {
      DEV && console.log(`4233`);
      /* c8 ignore next */
      if (
        // stopper character met:
        `;}'"`.includes(str[i]) &&
        // either it's real closing quote or not a quote
        ifQuoteThenAttrClosingQuote(i)
      ) {
        DEV &&
          console.log(`4242 ${`\u001b[${31}m${`broken code!`}\u001b[${39}m`}`);
        /* c8 ignore next */
        if (str[i] === ";") {
          property.semi = i;
          DEV &&
            console.log(
              `4248 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
                property.semi,
                null,
                4,
              )}`,
            );
        }

        let temp;

        // patch missing .end
        /* c8 ignore next */
        if (!property.end) {
          property.end = property.semi
            ? property.semi + 1
            : (left(str, i) as number) + 1;
          DEV &&
            console.log(
              `4266 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
                property.end,
                null,
                4,
              )}`,
            );
          temp = property.end;
        }

        // push and init and patch up to resume
        pushProperty(property);
        propertyReset();
        DEV &&
          console.log(
            `4280 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
          );

        DEV &&
          console.log(
            `4285 FIY, ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              4,
            )}`,
          );

        // if there was a whitespace gap, submit it as text token
        /* c8 ignore next */
        if (temp && temp < i) {
          pushProperty({
            type: "text",
            start: temp,
            end: i,
            value: str.slice(temp, i),
          } as any);
        }
      } else if (str[i] === "!") {
        DEV &&
          console.log(
            `4305 ${`\u001b[${32}m${`css property's !important starts`}\u001b[${39}m`}`,
          );
        property.importantStarts = i;
        DEV &&
          console.log(
            `4310 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.importantStarts`}\u001b[${39}m`} = ${
              property.importantStarts
            }`,
          );
      } else {
        DEV &&
          console.log(
            `4317 ${`\u001b[${32}m${`css property's value starts`}\u001b[${39}m`}`,
          );
        property.valueStarts = i;
        DEV &&
          console.log(
            `4322 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.valueStarts`}\u001b[${39}m`} = ${
              property.valueStarts
            }`,
          );
      }
    }

    // catch double opening curlies inside a css property
    if (
      !doNothing &&
      str[i] === "{" &&
      str[i + 1] === "{" &&
      property?.valueStarts &&
      !property.valueEnds &&
      str.indexOf("}}", i) > 0
    ) {
      doNothing = str.indexOf("}}") + 2;
      DEV &&
        console.log(
          `4341 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
            doNothing,
            null,
            4,
          )}`,
        );
    }

    // catch the start of a css chunk
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i]?.trim() &&
      !"{}".includes(str[i]) &&
      !selectorChunkStartedAt &&
      !token.openingCurlyAt
    ) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        DEV &&
          console.log(
            `4363 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`,
          );

        if (token.selectorsStart === null) {
          token.selectorsStart = i;
          DEV &&
            console.log(
              `4370 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsStart`}\u001b[${39}m`} = ${
                token.selectorsStart
              }`,
            );
        }
      } else {
        // this contraption is needed to catch commas and assign
        // correctly broken chunk range, [selectorsStart, selectorsEnd]
        token.selectorsEnd = i + 1;
        DEV &&
          console.log(
            `4381 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
              token.selectorsEnd
            }`,
          );
      }
    }

    // catch the end of a css property's name
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      // token.type === "rule" &&
      property?.propertyStarts &&
      property.propertyStarts < i &&
      !property.propertyEnds &&
      // end was reached
      // or it's whitespace
      (!str[i]?.trim() ||
        // or
        // it's not suitable
        (!attrNameRegexp.test(str[i]) &&
          // and
          // it's a colon (clean code)
          // <div style="float:left;">z</div>
          //                  ^
          //          we're here
          //
          (str[i] === ":" ||
            //
            // or
            //
            // <div style="float.:left;">z</div>
            //                  ^
            //                include this dot within property name
            //                so that we can catch it later validating prop names
            //
            !rightVal ||
            !`:/}`.includes(str[rightVal]) ||
            // mind the rogue closings .a{x}}
            (str[i] === "}" && str[rightVal] === "}"))) ||
        // <style>.a{b!}
        //            ^
        str[i] === "!") &&
      // also, regarding the slash,
      // <div style="//color: red;">
      //              ^
      //            don't close here, continue, gather "//color"
      //
      (str[i] !== "/" || str[i - 1] !== "/")
    ) {
      DEV &&
        console.log(
          `4433 ${`\u001b[${32}m${`css property's name ends`}\u001b[${39}m`}`,
        );

      property.propertyEnds = i;
      property.property = str.slice(property.propertyStarts, i);
      DEV &&
        console.log(
          `4440 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
            property,
            null,
            4,
          )}`,
        );
      if (property.valueStarts) {
        // it's needed to safeguard against case like:
        // <style>.a{b:c d:e;}</style>
        //                ^
        //            imagine we're here - valueStarts is not set!
        property.end = i;
        DEV &&
          console.log(
            `4454 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
              property.end,
              null,
              4,
            )}`,
          );
      }

      // missing colon and onwards:
      // <style>.b{c}</style>
      // <style>.b{c;d}</style>
      if (
        `};`.includes(str[i]) ||
        // it's whitespace and it's not leading up to a colon
        (str[i] && !str[i].trim() && str[rightVal as number] !== ":")
      ) {
        if (str[i] === ";") {
          property.semi = i;
          DEV &&
            console.log(
              `4474 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.semi`}\u001b[${39}m`} = ${JSON.stringify(
                property.semi,
                null,
                4,
              )}`,
            );
        }

        // precaution against broken code:
        // .a{x}}
        //
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : i;
          DEV &&
            console.log(
              `4489 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
                property.end,
                null,
                4,
              )}`,
            );
        }

        // push and init and patch up to resume
        pushProperty(property);
        propertyReset();
        DEV &&
          console.log(
            `4502 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
          );
      }

      // cases with replaced colon:
      // <div style="float.left;">

      if (
        // it's a non-whitespace character
        str[i]?.trim() &&
        // and property seems plausible - its first char at least
        attrNameRegexp.test(str[property.propertyStarts]) &&
        // but this current char is not:
        !attrNameRegexp.test(str[i]) &&
        // and it's not terminating character
        !`:'"`.includes(str[i])
      ) {
        DEV &&
          console.log(
            `4521 ${`\u001b[${31}m${`dodgy character?`}\u001b[${39}m`}`,
          );
        // find out locations of next semi and next colon
        let nextSemi = str.indexOf(";", i);
        let nextColon = str.indexOf(":", i);
        DEV &&
          console.log(
            `4528 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextSemi`}\u001b[${39}m`} = ${nextSemi}; ${`\u001b[${33}m${`nextColon`}\u001b[${39}m`} = ${nextColon}`,
          );
        // whatever the situation, colon must not be before semi on the right
        // either one or both missing is fine, we just want to avoid
        // <div style="floa.t:left;
        //                 ^
        //            this is not a dodgy colon
        //
        // but,
        //
        // <div style="float.left;
        //                  ^
        //                this is

        if (
          // either semi but no colon
          ((nextColon === -1 && nextSemi !== -1) ||
            !(nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi)) &&
          !`{}`.includes(str[i]) &&
          rightVal &&
          // <style>.a{b!}
          //            ^
          (!`!`.includes(str[i]) || isLatinLetter(str[rightVal]))
        ) {
          // <div style="float.left;">
          //                  ^
          //            we're here
          DEV &&
            console.log(
              `4557 ${`\u001b[${32}m${`CORRECTION #1 - set this as colon`}\u001b[${39}m`}`,
            );
          property.colon = i;
          property.valueStarts = rightVal;
          DEV &&
            console.log(
              `4563 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.colon`}\u001b[${39}m`} = ${
                property.colon
              }; ${`\u001b[${33}m${`property.valueStarts`}\u001b[${39}m`} = ${
                property.valueStarts
              }`,
            );
        } else if (
          nextColon !== -1 &&
          nextSemi !== -1 &&
          nextColon < nextSemi
        ) {
          // case like
          // <div style="floa/t:left;">
          //                 ^
          //          we're here
          DEV &&
            console.log(
              `4580 ${`\u001b[${32}m${`CORRECTION #2 - patch by extending the prop`}\u001b[${39}m`}`,
            );
          property.propertyEnds = null;
          DEV &&
            console.log(
              `4585 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.propertyEnds`}\u001b[${39}m`} = ${
                property.propertyEnds
              }`,
            );
        } else if (str[i] === "!") {
          property.importantStarts = i;
          DEV &&
            console.log(
              `4593 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.importantStarts`}\u001b[${39}m`} = ${
                property.importantStarts
              }`,
            );
        }
      }
    }

    // catch the colon of a css property
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      // we don't check for token.type === "rule" because inline css will use
      // these clauses too and token.type === "tag" there, but
      // attrib.attribName === "style"

      // on other hand, we don't need strict validation here either, to enter
      // these clauses it's enough that "property" was initiated.
      property?.propertyEnds &&
      !property.valueStarts &&
      str[i] === ":"
    ) {
      property.colon = i;
      DEV &&
        console.log(
          `4618 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.colon`}\u001b[${39}m`} = ${JSON.stringify(
            property.colon,
            null,
            4,
          )}`,
        );

      // if string abruptly ends, record it here
      if (!rightVal) {
        property.end = i + 1;
        DEV &&
          console.log(
            `4630 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.end`}\u001b[${39}m`} = ${JSON.stringify(
              property.end,
              null,
              4,
            )}`,
          );

        if (str[i + 1]) {
          // push and init and patch up to resume
          pushProperty(property);
          propertyReset();
          DEV &&
            console.log(
              `4643 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
            );

          // that's some trailing whitespace, create a new text token for it
          if ((token as any).properties) {
            (token as any).properties.push({
              type: "text",
              start: i + 1,
              end: null as any,
              value: null as any,
            });
            DEV &&
              console.log(
                `4656 PUSH to ${`\u001b[${33}m${`token.properties`}\u001b[${39}m`}, now = ${JSON.stringify(
                  (token as any).properties,
                  null,
                  4,
                )}`,
              );

            doNothing = i + 1;
            DEV &&
              console.log(
                `4666 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                  doNothing,
                  null,
                  4,
                )}`,
              );
          }
        }
      }

      DEV &&
        console.log(
          `4678 FIY, ${`\u001b[${33}m${`lastNonWhitespaceCharAt`}\u001b[${39}m`} = ${JSON.stringify(
            lastNonWhitespaceCharAt,
            null,
            4,
          )}`,
        );

      // insurance against rogue characters
      // <style>.a{float:left;x">color: red}
      //                      |       ^
      //                      |     we're here
      //           propertyStarts
      if (
        property.propertyEnds &&
        lastNonWhitespaceCharAt &&
        property.propertyEnds !== lastNonWhitespaceCharAt + 1 &&
        // it ends upon a bad character
        !attrNameRegexp.test(str[property.propertyEnds])
      ) {
        property.propertyEnds = lastNonWhitespaceCharAt + 1;
        property.property = str.slice(
          property.propertyStarts as number,
          property.propertyEnds,
        );
        DEV &&
          console.log(
            `4704 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`property.propertyEnds`}\u001b[${39}m`} = ${
              property.propertyEnds
            }; ${`\u001b[${33}m${`property.property`}\u001b[${39}m`} = ${
              property.property
            }`,
          );
      }
    }

    // catch the start of a css property's name
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i]?.trim() &&
      // NOTA BENE - there's same clause for inline HTML style
      // let all the crap in, filter later:
      !"{}".includes(str[i]) &&
      // above is instead of a stricter clause:
      // attrNameRegexp.test(str[i]) &&
      token.selectorsEnd &&
      token.openingCurlyAt &&
      !property.propertyStarts &&
      !property.importantStarts
    ) {
      DEV &&
        console.log(
          `4731 ${`\u001b[${32}m${`css property's name starts`}\u001b[${39}m`}`,
        );

      // first, check maybe there's unfinished text token before it
      if (
        Array.isArray(token.properties) &&
        token.properties.length &&
        token.properties[~-token.properties.length].start &&
        !token.properties[~-token.properties.length].end
      ) {
        token.properties[~-token.properties.length].end = i;
        token.properties[~-token.properties.length].value = str.slice(
          token.properties[~-token.properties.length].start,
          i,
        );
        DEV &&
          console.log(
            `4748 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} last elem of ${`\u001b[${33}m${`token.properties[]`}\u001b[${39}m`} to: ${JSON.stringify(
              token.properties[~-token.properties.length],
              null,
              4,
            )}`,
          );
      }

      // in normal cases we're set propertyStarts but sometimes it can be
      // importantStarts, imagine:
      // <style>.a{color:red; !important;}
      //                      ^
      //                we're here
      //
      // we want to put "!important" under key "important", not under
      // "property"

      if (str[i] === ";") {
        DEV && console.log(`4766`);
        initProperty({
          start: i,
          end: i + 1,
          semi: i,
        });
        pushProperty(property);
        propertyReset();
        DEV &&
          console.log(
            `4776 init, push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
          );
      } else if (str[i] === "!") {
        DEV && console.log(`4779`);
        initProperty({
          start: i,
          importantStarts: i,
        });
        DEV &&
          console.log(
            `4786 ${`\u001b[${32}m${`INIT`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              property,
              null,
              4,
            )}`,
          );
      } else {
        DEV && console.log(`4793`);
        initProperty(i);
        DEV &&
          console.log(
            `4797 ${`\u001b[${32}m${`INIT`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              property,
              null,
              4,
            )}`,
          );
      }

      doNothing = i;
      DEV &&
        console.log(
          `4808 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
            doNothing,
            null,
            4,
          )}`,
        );
    }

    // catch the start a property
    // -------------------------------------------------------------------------
    // Mostly happens in dirty code cases - the start is normally being triggered
    // not from here, the first character, but earlier, from previous clauses.
    // But imagine <div style="float;left">z</div>
    //                              ^
    //                            wrong
    //
    // in case like above, "l" would not have the beginning of a property
    // triggered, hence this clause here
    if (
      !doNothing &&
      (!token || token.type !== "esp") &&
      // style attribute is being processed at the moment
      attrib &&
      attrib.attribName === "style" &&
      // it's not done yet
      attrib.attribOpeningQuoteAt &&
      !attrib.attribClosingQuoteAt &&
      // but property hasn't been initiated
      !property.start &&
      // yet the character is suitable:
      // it's not a whitespace
      str[i]?.trim() &&
      // NOTA BENE - there's same clause for inline HTML style
      // it's not some separator
      !`'"`.includes(str[i]) &&
      // it's not inside CSS block comment
      !lastLayerIs("block")
    ) {
      DEV && console.log(`4846 inside start of css property/comment token`);
      // It's either css comment or a css property.
      // Dirty characters go as property name, then later we validate and
      // catch them.
      // Empty space goes as text token, see separate clauses above.

      if (
        // currently it's slash
        str[i] === "/" &&
        // asterisk follows, straight away or after whitespace
        str[rightVal as number] === "*"
      ) {
        DEV &&
          console.log(
            `4860 ${`\u001b[${32}m${`BLOCK COMMENT OPENING`}\u001b[${39}m`}`,
          );

        attribPush({
          type: "comment",
          start: i,
          end: (rightVal as number) + 1,
          value: str.slice(i, (rightVal as number) + 1), // think of broken cases with whitespace, / *
          closing: false,
          kind: "block",
          language: "css",
        });

        // push a new layer, comment
        layers.push({
          type: "block",
          value: str.slice(i, (rightVal as number) + 1), // think of broken cases with whitespace, / *
          position: i,
        });
        DEV &&
          console.log(
            `4881 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} new layer, ${JSON.stringify(
              {
                type: "block",
                value: str[i],
                position: i,
              },
              null,
              4,
            )}`,
          );

        // skip the next char, consider there might be whitespace in front
        doNothing = (rightVal as number) + 1;
        DEV &&
          console.log(
            `4896 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
              doNothing,
              null,
              4,
            )}`,
          );
      }
      // if it's a closing comment
      else if (str[i] === "*" && str[rightVal as number] === "/") {
        DEV && console.log(`4905 call closingComment()`);
        closingComment(i);
      } else {
        DEV && console.log(`4908`);
        // first, close the text token if it's not ended
        if (
          Array.isArray(attrib.attribValue) &&
          attrib.attribValue.length &&
          !attrib.attribValue[~-attrib.attribValue.length].end
        ) {
          attrib.attribValue[~-attrib.attribValue.length].end = i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
            attrib.attribValue[~-attrib.attribValue.length].start,
            i,
          );
          DEV &&
            console.log(
              `4922 complete last attrib object: ${JSON.stringify(
                attrib.attribValue[~-attrib.attribValue.length],
                null,
                4,
              )}`,
            );
        }

        // initiate a property
        // if !important has been detected, that's a CSS like:
        // <div style="float:left;!important">
        // the !important is alone by itself
        // also, it can be semi along by itself
        if (str[i] === ";") {
          DEV && console.log(`4936`);
          initProperty({
            start: i,
            end: i + 1,
            semi: i,
          });
          DEV &&
            console.log(
              `4944 ${`\u001b[${32}m${`INIT`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
          doNothing = i;
          DEV &&
            console.log(
              `4953 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                doNothing,
                null,
                4,
              )}`,
            );
        } else if (R2) {
          DEV && console.log(`4960`);
          initProperty({
            start: i,
            importantStarts: i,
          });
          DEV &&
            console.log(
              `4967 ${`\u001b[${32}m${`INIT`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
        } else {
          // protection against unclosed quotes
          // <div style="float:left;; >
          //                          ^
          //                    we're here
          DEV && console.log(`4978`);
          initProperty(i);
          DEV &&
            console.log(
              `4982 ${`\u001b[${32}m${`INIT`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
        }
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
        DEV &&
          console.log(
            `5011 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`,
          );
        // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (
        token.type === "comment" &&
        token.language === "html" &&
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
          DEV &&
            console.log(
              `5063 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL "ONLY" DETECTED`}\u001b[${39}m`}`,
            );
          token.kind = "only";
          DEV &&
            console.log(
              `5068 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                token.kind
              }`,
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
          DEV &&
            console.log(
              `5092 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL "NOT" DETECTED`}\u001b[${39}m`}`,
            );
          token.kind = "not";
          token.closing = true;
          DEV &&
            console.log(
              `5098 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                token.kind
              }; ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
                token.closing
              }`,
            );
        } else if (
          token.kind === "simple" &&
          token.language === "html" &&
          !token.closing &&
          str[rightVal as number] === ">"
        ) {
          DEV &&
            console.log(
              `5112 ${`\u001b[${32}m${`simplet-kind comment token's ending caught`}\u001b[${39}m`}`,
            );
          token.end = (rightVal as number) + 1;
          token.kind = "simplet";
          token.closing = null;
          DEV &&
            console.log(
              `5119 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`,
            );
          DEV &&
            console.log(
              `5125 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                token.kind
              }`,
            );
          DEV &&
            console.log(
              `5131 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
                token.closing
              }`,
            );
        } else if (token.language === "html") {
          // if it's a simple HTML comment, <!--, end it right here
          DEV &&
            console.log(
              `5139 ${`\u001b[${32}m${`${token.kind} comment token's ending caught`}\u001b[${39}m`}`,
            );
          token.end = i + 1;

          // tokenizer will catch <!- as opening, so we need to extend
          // for correct cases with two dashes <!--
          if (
            str[leftVal as number] === "!" &&
            str[rightVal as number] === "-"
          ) {
            token.end = (rightVal as number) + 1;
            DEV &&
              console.log(
                `5152 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`,
              );
          }

          token.value = str.slice(token.start, token.end);
          DEV &&
            console.log(
              `5161 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`,
            );
        }
        // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (
        token.type === "comment" &&
        token.language === "html" &&
        str[i] === ">" &&
        (!layers.length || str[rightVal as number] === "<")
      ) {
        // if last layer was for square bracket, this means closing
        // counterpart is missing so we need to remove it now
        // because it's the ending of the tag ("only" kind) or
        // at least the first part of it ("not" kind)
        if (
          Array.isArray(layers) &&
          layers.length &&
          (layers[~-layers.length] as any).value === "["
        ) {
          layers.pop();
          DEV &&
            console.log(`5185 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} layers`);
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
          DEV &&
            console.log(
              `5200 that's kind="not" comment and it continues on the right`,
            );
          token.kind = "not";
          DEV &&
            console.log(
              `5205 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                token.kind
              }`,
            );
        } else {
          DEV &&
            console.log(
              `5212 that's the end of opening type="comment" kind="only" comment`,
            );
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          DEV &&
            console.log(
              `5218 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`,
            );
        }
      } else if (
        token.type === "comment" &&
        token.language === "css" &&
        str[i] === "*" &&
        str[i + 1] === "/"
      ) {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        DEV &&
          console.log(
            `5233 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`,
          );
      } else if (
        token.type === "esp" &&
        token.end === null &&
        typeof token.head === "string" &&
        typeof token.tail === "string" &&
        token.tail.includes(str[i])
      ) {
        DEV && console.log(`5244 POSSIBLE ESP TAILS`);
        // extract the whole lump of ESP tag characters:
        let wholeEspTagClosing = "";

        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing += str[y];
          } else {
            break;
          }
        }
        DEV && console.log(`5255 wholeEspTagClosing = ${wholeEspTagClosing}`);

        // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here

        // find the breaking point where tails end
        if (wholeEspTagClosing.length > token.head.length) {
          DEV &&
            console.log(
              `5266 wholeEspTagClosing.length = ${`\u001b[${33}m${
                wholeEspTagClosing.length
              }\u001b[${39}m`} > token.head.length = ${`\u001b[${33}m${
                token.head.length
              }\u001b[${39}m`}`,
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
          let headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            DEV && console.log(`5294 - chunk ends with the same heads`);
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
            DEV &&
              console.log(
                `5318 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`,
              );
            doNothing = token.end;
            DEV &&
              console.log(
                `5325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
              );
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            DEV &&
              console.log(
                `5332 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`,
              );
            doNothing = token.end;
            DEV &&
              console.log(
                `5339 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
              );
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            DEV && console.log(`5347`);
            // We're very lucky because heads and tails are using different
            // characters, possibly opposite brackets of some kind.
            // That's Nunjucks, Responsys (but no eDialog) patterns.
            let firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              0,
              wholeEspTagClosing.indexOf(headsFirstChar),
            );
            let secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              wholeEspTagClosing.indexOf(headsFirstChar),
            );
            DEV &&
              console.log(
                `${`\u001b[${33}m${`firstPartOfWholeEspTagClosing`}\u001b[${39}m`} = ${JSON.stringify(
                  firstPartOfWholeEspTagClosing,
                  null,
                  4,
                )}`,
              );
            DEV &&
              console.log(
                `${`\u001b[${33}m${`secondPartOfWholeEspTagClosing`}\u001b[${39}m`} = ${JSON.stringify(
                  secondPartOfWholeEspTagClosing,
                  null,
                  4,
                )}`,
              );
            // imagine we sliced off (Nunjucks): -%}{%-
            // if every character from anticipated tails (-%}) is present in the front
            // chunk, Bob's your uncle, that's tails with new heads following.
            if (
              firstPartOfWholeEspTagClosing.length &&
              secondPartOfWholeEspTagClosing.length &&
              token.tail
                .split("")
                .every((char) => firstPartOfWholeEspTagClosing.includes(char))
            ) {
              DEV && console.log(`5384 definitely tails + new heads`);
              token.end = i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              DEV &&
                console.log(
                  `5389 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                    token.end
                  }`,
                );
              doNothing = token.end;
              DEV &&
                console.log(
                  `5396 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
                );
            }
          } else {
            // so heads and tails don't contain unique character, and more so,
            // starting-one, PLUS, second set is different.
            // For example, ESP heads/tails can be *|zzz|*
            // Imaginary example, following heads would be variation of those
            // above, ^|zzz|^
            DEV && console.log(`CASE #2.`);
            // TODO
            // for now, return defaults, from else scenario below:
            // we consider this whole chunk is tails.
            token.end = i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            DEV &&
              console.log(
                `5413 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`,
              );
            doNothing = token.end;
            DEV &&
              console.log(
                `5420 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
              );
          }
          DEV && console.log(`5423`);
        } else {
          // we consider this whole chunk is tails.
          token.end = i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          DEV &&
            console.log(
              `5430 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`,
            );

          // if last layer is ESP tag and we've got its closing, pop the layer
          if (lastLayerIs("esp")) {
            DEV &&
              console.log(
                `5439 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers, now ${`\u001b[${33}m${`layers`}\u001b[${39}m`}: ${JSON.stringify(
                  layers,
                  null,
                  4,
                )}`,
              );
            layers.pop();
          }

          doNothing = token.end;
          DEV &&
            console.log(
              `5451 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
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
      DEV && console.log(`5467 catch the end of a tag name clauses`);

      // tag names can be with numbers, h1
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        DEV &&
          console.log(
            `5474 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
              token.tagNameEndsAt
            }`,
          );

        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        DEV &&
          console.log(
            `5482 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
              token.tagName
            }`,
          );

        if (token.tagName && token.tagName.toLowerCase() === "script") {
          withinScript = !withinScript;
          DEV &&
            console.log(
              `5491 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinScript`}\u001b[${39}m`} = ${JSON.stringify(
                withinScript,
                null,
                4,
              )}`,
            );
        }

        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
          DEV &&
            console.log(
              `5503 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
                token.kind
              }`,
            );
        }

        // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.
        if (voidTags.includes(token.tagName)) {
          token.void = true;
          DEV &&
            console.log(
              `5516 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.void`}\u001b[${39}m`} = ${
                token.void
              }`,
            );
        }

        token.recognised = isTagNameRecognised(token.tagName);

        DEV &&
          console.log(
            `5526 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.recognised`}\u001b[${39}m`} = ${
              token.recognised
            }`,
          );

        doNothing = i;
        DEV &&
          console.log(
            `5534 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
              doNothing,
              null,
              4,
            )}`,
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
      DEV && console.log(`5553 catch the start of a tag name clauses`);
      // MULTIPLE ENTRY!
      // Consider closing tag's slashes and tag name itself.

      if (str[i] === "/") {
        token.closing = true;
        DEV &&
          console.log(
            `5561 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`,
          );

        doNothing = i;
        DEV &&
          console.log(
            `5569 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
              doNothing,
              null,
              4,
            )}`,
          );
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        DEV &&
          console.log(
            `5579 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameStartsAt`}\u001b[${39}m`} = ${
              token.tagNameStartsAt
            }`,
          );
        // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name
        if (!token.closing) {
          token.closing = false;
          DEV &&
            console.log(
              `5589 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
                token.closing
              }`,
            );

          doNothing = i;
          DEV &&
            console.log(
              `5597 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
                doNothing,
                null,
                4,
              )}`,
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
      !isAttrNameChar(str[i])
    ) {
      DEV &&
        console.log(`5622 inside catch the tag attribute name end clauses`);
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);

      if (attrib.attribName.startsWith("mc:")) {
        // that's a mailchimp attribute
        token.pureHTML = false;
      }

      DEV &&
        console.log(
          `5634 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndsAt`}\u001b[${39}m`} = ${
            attrib.attribNameEndsAt
          }; ${`\u001b[${33}m${`attrib.attribName`}\u001b[${39}m`} = ${JSON.stringify(
            attrib.attribName,
            null,
            0,
          )}`,
        );

      // maybe there's a space in front of equal, <div class= "">
      if (str[i] && !str[i].trim() && str[rightVal as number] === "=") {
        DEV && console.log(`5645 equal on the right`);
      } else if (
        (str[i] && !str[i].trim()) ||
        str[i] === ">" ||
        (str[i] === "/" && str[rightVal as number] === ">")
      ) {
        if (`'"`.includes(str[rightVal as number])) {
          DEV &&
            console.log(
              `5654 ${`\u001b[${31}m${`space instead of equal`}\u001b[${39}m`}`,
            );
        } else {
          DEV &&
            console.log(
              `5659 ${`\u001b[${31}m${`a value-less attribute detected`}\u001b[${39}m`}`,
            );
          attrib.attribEnds = i;
          DEV &&
            console.log(
              `5664 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${
                attrib.attribEnds
              }`,
            );

          // push and wipe
          DEV &&
            console.log(
              `5672 ${`\u001b[${32}m${`PUSH ATTR AND WIPE`}\u001b[${39}m`}`,
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
      attrib.attribStarts === null &&
      isAttrNameChar(str[i])
    ) {
      DEV &&
        console.log(`5693 inside catch the tag attribute name start clauses`);
      attrib.attribStarts = i;
      // even though in theory left() which reports first non-whitespace
      // character's index on the left can be null, it does not happen
      // in this context - there will be tag's name or something in front!
      attrib.attribLeft = lastNonWhitespaceCharAt as number;
      attrib.attribNameStartsAt = i;
      DEV &&
        console.log(
          `5702 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribStarts`}\u001b[${39}m`} = ${
            attrib.attribStarts
          }; ${`\u001b[${33}m${`attrib.attribLeft`}\u001b[${39}m`} = ${
            attrib.attribLeft
          }; ${`\u001b[${33}m${`attrib.attribNameStartsAt`}\u001b[${39}m`} = ${
            attrib.attribNameStartsAt
          }`,
        );

      DEV &&
        console.log(
          `5713 ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
            attrib.attribValue,
            null,
            4,
          )}`,
        );
    }

    // catch the curlies inside CSS rule
    // -------------------------------------------------------------------------

    if (!doNothing && token.type === "rule") {
      if (
        str[i] === "{" &&
        str[i + 1] !== "{" &&
        str[i - 1] !== "{" &&
        !token.openingCurlyAt
      ) {
        token.openingCurlyAt = i;
        DEV &&
          console.log(
            `5734 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
              token.openingCurlyAt
            }`,
          );
      } else if (
        str[i] === "}" &&
        token.openingCurlyAt &&
        !token.closingCurlyAt
      ) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        DEV &&
          console.log(
            `5748 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
              token.closingCurlyAt
            }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${token.end}`,
          );

        // check is the property's last text token closed:
        if (
          Array.isArray(token.properties) &&
          token.properties.length &&
          token.properties[~-token.properties.length].start &&
          !token.properties[~-token.properties.length].end
        ) {
          token.properties[~-token.properties.length].end = i;
          token.properties[~-token.properties.length].value = str.slice(
            token.properties[~-token.properties.length].start,
            i,
          );
          DEV &&
            console.log(
              `5767 ${`\u001b[${32}m${`COMPLETE`}\u001b[${39}m`} ${`\u001b[${33}m${`token.properties[]`}\u001b[${39}m`} last elem, now = ${JSON.stringify(
                token.properties[~-token.properties.length],
                null,
                4,
              )}`,
            );
        }

        // if there's partial, still-pending property, push it
        if (property.start) {
          DEV &&
            console.log(
              `5779 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} the pending property`,
            );
          token.properties.push(property);
          propertyReset();
        }

        DEV && console.log(`5785 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);

        // if it's a "rule" token and a parent "at" rule is pending in layers,
        // also put this "rule" into that parent in layers
        if (lastLayerIs("at")) {
          DEV &&
            console.log(
              `5793 ${`\u001b[${32}m${`PUSH this rule into last AT layer`}\u001b[${39}m`}`,
            );
          (layers[~-layers.length] as LayerKindAt).token.rules.push(token);
        }

        DEV && console.log(`5798 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`}`);
        tokenReset();
      }
    }

    // catch the ending of a attribute sub-token value
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      attrib.attribName &&
      Array.isArray(attrib.attribValue) &&
      attrib.attribValue.length &&
      !attrib.attribValue[~-attrib.attribValue.length].end
    ) {
      // TODO
      DEV &&
        console.log(
          `5816 ${`\u001b[${35}m${`██`}\u001b[${39}m`} inside attribute sub-token end clauses`,
        );

      // if it's a closing comment
      if (str[i] === "*" && str[rightVal as number] === "/") {
        closingComment(i);
      }
    }

    // catch the beginning of a attribute sub-token value
    // -------------------------------------------------------------------------

    if (
      // EITHER IT'S INLINE CSS:
      (!doNothing &&
        // attribute has been recording
        // and it's not finished
        attrib?.attribValueStartsAt &&
        !attrib.attribValueEndsAt &&
        // and its property hasn't been recording
        !property.propertyStarts &&
        // and it's not within ESP token inside inline CSS
        token.type !== "esp" &&
        // we're inside the value
        i >= attrib.attribValueStartsAt &&
        // if attribValue array is empty, no object has been placed yet,
        Array.isArray(attrib.attribValue) &&
        (!attrib.attribValue.length ||
          // or there is one but it's got ending (prevention from submitting
          // another text type object on top, before previous has been closed)
          (attrib.attribValue[~-attrib.attribValue.length].end &&
            // and that end is less than current index i
            attrib.attribValue[~-attrib.attribValue.length].end <= i))) ||
      // OR IT'S HEAD CSS
      (!doNothing &&
        // css rule token has been recording
        token.type === "rule" &&
        // token started:
        token.openingCurlyAt &&
        // but not ended:
        !token.closingCurlyAt &&
        // there is no unfinished property being recorded
        !property.propertyStarts)
    ) {
      DEV &&
        console.log(
          `5862 ${`\u001b[${36}m${`██`}\u001b[${39}m`} inside attribute sub-token start clauses`,
        );

      // if it's suitable for property, start a property

      if (
        str[i] === ";" &&
        // a) if it's inline HTML tag CSS style attribute
        ((attrib &&
          Array.isArray(attrib.attribValue) &&
          attrib.attribValue.length &&
          // last attribute has semi already set:
          (attrib.attribValue[~-attrib.attribValue.length] as any).semi &&
          // and that semi is really behind this current index
          (attrib.attribValue[~-attrib.attribValue.length] as any).semi < i) ||
          // or
          // b) if it's head CSS styles block
          (token &&
            token.type === "rule" &&
            Array.isArray(token.properties) &&
            token.properties.length &&
            (token.properties[~-token.properties.length] as any).semi &&
            (token.properties[~-token.properties.length] as any).semi < i))
      ) {
        // rogue semi?
        // <div style="float:left;;">
        //                        ^
        // if so, it goes as a standalone property, something like:
        // {
        //   start: 23,
        //   end: 24,
        //   property: null,
        //   propertyStarts: null,
        //   propertyEnds: null,
        //   value: null,
        //   valueStarts: null,
        //   valueEnds: null,
        //   important: null,
        //   importantStarts: null,
        //   importantEnds: null,
        //   colon: null,
        //   semi: 23,
        // }
        initProperty({
          start: i,
          semi: i,
        });
        DEV &&
          console.log(
            `5911 ${`\u001b[${32}m${`INIT`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
              property,
              null,
              4,
            )}`,
          );
        doNothing = i + 1;
        DEV &&
          console.log(
            `5920 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${JSON.stringify(
              doNothing,
              null,
              4,
            )}`,
          );
      }
      // if it's whitespace, for example,
      // <a style="  /* zzz */color: red;  ">
      //           ^
      //         this
      //
      // rogue text will go as property, for example:
      //
      // <a style="  z color: red;  ">
      else if (
        // whitespace is automatically text token
        (str[i] && !str[i].trim()) ||
        // if comment layer has been started, it's also a text token, no matter even
        // if it's a property, because it's comment's contents.
        lastLayerIs("block")
      ) {
        DEV && console.log(`5942`);
        // depends where to push, is it inline css or head css rule
        if (attrib.attribName) {
          (attrib.attribValue as any).push({
            type: "text",
            start: i,
            end: null,
            value: null,
          });
          DEV &&
            console.log(
              `5953 PUSH to ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}, now = ${JSON.stringify(
                attrib.attribValue,
                null,
                4,
              )}`,
            );
        } else if (
          token.type === "rule" &&
          // we don't want to push over the properties in-progress
          (!Array.isArray(token.properties) ||
            !token.properties.length ||
            // last property should have ended
            token.properties[~-token.properties.length].end)
        ) {
          token.properties.push({
            type: "text",
            start: i,
            end: null as any,
            value: null as any,
          });
          DEV &&
            console.log(
              `5975 PUSH to ${`\u001b[${33}m${`token.properties`}\u001b[${39}m`}, now = ${JSON.stringify(
                token.properties,
                null,
                4,
              )}`,
            );
        }
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
      DEV && console.log(`5995 inside a catching end of a tag attr clauses`);
      if (SOMEQUOTE.includes(str[i])) {
        DEV && console.log(`5997 currently on a quote`);

        DEV &&
          console.log(
            `6001 ███████████████████████████████████████ isAttrClosing(str, ${
              attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt
            }, ${i}) = ${isAttrClosing(
              str,
              attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
              i,
            )}`,
          );

        if (
          // so we're on a single/double quote,
          // (str[i], the current character is a quote)
          // and...
          // we're not inside some ESP tag - ESP layers are not pending:
          !layers.some((layerObj) => layerObj.type === "esp") &&
          // and the current character passed the
          // attribute closing quote validation by
          // "is-html-attribute-closing"
          //
          // the isAttrClosing() api is the following:
          // 1. str, 2. opening quotes index, 3. suspected
          // character for attribute closing (quotes typically,
          // but can be mismatching)...
          // see the package "is-html-attribute-closing" on npm:
          //
          //
          // either end was reached,
          (!str[i] ||
            // or there is no closing bracket further
            !str.includes(">", i) ||
            // further checks confirm it looks like legit closing
            isAttrClosing(
              str,
              attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
              i,
            ))
        ) {
          DEV &&
            console.log(
              `6040 ${`\u001b[${32}m${`opening and closing quotes matched!`}\u001b[${39}m`}`,
            );
          DEV &&
            console.log(
              `6044 ${`\u001b[${32}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                attrib,
                null,
                4,
              )}`,
            );

          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          }
          attrib.attribEnds = i + 1;

          if (property.propertyStarts) {
            attrib.attribValue.push(clone(property));
            DEV &&
              console.log(
                `6062 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} property into ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}`,
              );
            propertyReset();
            DEV &&
              console.log(
                `6067 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} property`,
              );
          }

          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            !attrib.attribValue[~-attrib.attribValue.length].end
          ) {
            DEV &&
              console.log(
                `6078 set the ending on the last object within "attribValue"`,
              );
            // if it's not a property (of inline style), set its "end"
            if (
              !(attrib.attribValue[~-attrib.attribValue.length] as any).property
            ) {
              attrib.attribValue[~-attrib.attribValue.length].end = i;
              DEV &&
                console.log(
                  `6087 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValue[${~-attrib
                    .attribValue.length}].end`}\u001b[${39}m`} = ${
                    attrib.attribValue[~-attrib.attribValue.length].end
                  };`,
                );

              if (
                (attrib.attribValue[~-attrib.attribValue.length] as any)
                  .property === null
              ) {
                DEV &&
                  console.log(
                    `6099 ${`\u001b[${31}m${`CSS property without a value!`}\u001b[${39}m`}`,
                  );
                // it's CSS property without a value:
                // <img style="display" />
                (
                  attrib.attribValue[~-attrib.attribValue.length] as any
                ).property = str.slice(
                  attrib.attribValue[~-attrib.attribValue.length].start,
                  i,
                );
                (
                  attrib.attribValue[~-attrib.attribValue.length] as any
                ).propertyEnds = i;
                DEV &&
                  console.log(
                    `6114 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValue[${~-attrib
                      .attribValue.length}].value`}\u001b[${39}m`} = ${
                      attrib.attribValue[~-attrib.attribValue.length].value
                    }; ${`\u001b[${33}m${`attrib.attribValue[${~-attrib
                      .attribValue
                      .length}].propertyEnds`}\u001b[${39}m`} = ${i}`,
                  );
              } else {
                DEV && console.log(`6122 assign to value`);
                attrib.attribValue[~-attrib.attribValue.length].value =
                  str.slice(
                    attrib.attribValue[~-attrib.attribValue.length].start,
                    i,
                  );
                DEV &&
                  console.log(
                    `6130 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValue[${~-attrib
                      .attribValue.length}].value`}\u001b[${39}m`} = ${
                      attrib.attribValue[~-attrib.attribValue.length].value
                    }`,
                  );
              }
            }
          }
          DEV &&
            console.log(
              `6140 ${`\u001b[${32}m${`NOW`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                attrib,
                null,
                4,
              )}`,
            );

          // 2. if the pair was mismatching, wipe layers' last element
          if (str[attrib.attribOpeningQuoteAt as number] !== str[i]) {
            layers.pop();
            layers.pop();
            DEV &&
              console.log(
                `6153 POP × 2, now layers = ${JSON.stringify(layers, null, 4)}`,
              );
          }

          // 3. last check for the last attribValue's .end - in some broken code
          // cases it might be still null:
          // <div style="float:left;x">
          //                         ^
          //                       we're here
          if (
            attrib.attribValue[~-attrib.attribValue.length] &&
            !attrib.attribValue[~-attrib.attribValue.length].end
          ) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            DEV &&
              console.log(
                `6169 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} .end on the last attribValue, now = ${JSON.stringify(
                  attrib.attribValue[~-attrib.attribValue.length],
                  null,
                  4,
                )}`,
              );
          }

          // 4. push and wipe
          DEV &&
            console.log(
              `6180 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                attrib,
                null,
                4,
              )}`,
            );
          token.attribs.push(clone(attrib));
          attribReset();
        } else if (
          (!Array.isArray(attrib.attribValue) ||
            !attrib.attribValue.length ||
            // last attrib value should not be a text token
            (attrib.attribValue[~-attrib.attribValue.length] as any).type !==
              "text") &&
          !property.propertyStarts
        ) {
          // quotes not matched, so it's unencoded, raw quote, part of the value
          // for example
          // <table width=""100">
          //               ^
          //            rogue quote

          // let's initiate a next token
          attrib.attribValue.push({
            type: "text",
            start: i,
            end: null as any,
            value: null as any,
          });

          DEV &&
            console.log(
              `6212 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} new to attrib.attribValue, now ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}: ${JSON.stringify(
                attrib.attribValue,
                null,
                4,
              )}`,
            );
        }

        DEV && console.log(`6220`);
      } else if (
        attrib.attribOpeningQuoteAt === null &&
        ((str[i] && !str[i].trim()) ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        // ^ either whitespace or tag's closing or ESP literal's start ends
        // the attribute's value if there are no quotes
        DEV &&
          console.log(
            `6231 opening quote was missing, terminate attr val here`,
          );

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
            attrib.attribValue[~-attrib.attribValue.length].end,
          );
        }
        attrib.attribEnds = i;
        DEV &&
          console.log(
            `6250 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
              attrib.attribValueEndsAt
            }; ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${
              attrib.attribValueRaw
            }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
              attrib.attribValue,
              null,
              4,
            )}; ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${
              attrib.attribEnds
            }`,
          );

        // 2. push and wipe
        token.attribs.push(clone(attrib));
        attribReset();

        // 3. pop layers
        layers.pop();
        DEV &&
          console.log(
            `6271 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
              layers,
              null,
              4,
            )}`,
          );

        // 4. tackle the tag ending
        if (str[i] === ">") {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          DEV &&
            console.log(
              `6284 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`,
            );
        }
      } else if (
        str[i] === "=" &&
        leftVal !== null &&
        rightVal &&
        (`'"`.includes(str[rightVal]) ||
          (str[~-i] && isLatinLetter(str[~-i]))) &&
        // this will catch url params like
        // <img src="https://z.png?query=" />
        //                              ^
        //                            false alarm
        //
        // let's exclude anything URL-related
        !(
          attrib?.attribOpeningQuoteAt &&
          // check for presence of slash, /
          (/\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
            // check for mailto:
            /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
            // check for /\w?\w/ like
            // <img src="codsen.com?query=" />
            //                     ^
            /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)))
        )
      ) {
        DEV &&
          console.log(
            `6315 ${`\u001b[${31}m${`MISSING CLOSING QUOTE ON PREVIOUS ATTR.`}\u001b[${39}m`}`,
          );

        // all depends, are there whitespace characters:
        // imagine
        // <a href="border="0">
        // vs
        // <a href="xyz border="0">
        // that's two different cases - there's nothing to salvage in former!

        DEV &&
          console.log(
            `6327 ${`\u001b[${36}m${`██ traverse backwards, try to salvage something`}\u001b[${39}m`}`,
          );
        let whitespaceFound;
        let attribClosingQuoteAt;

        for (let y = leftVal; y >= attrib.attribValueStartsAt; y--) {
          DEV &&
            console.log(
              `6335 ${`\u001b[${36}m${`------- str[${y}] = ${str[y]} -------`}\u001b[${39}m`}`,
            );

          // catch where whitespace starts
          if (!whitespaceFound && str[y] && !str[y].trim()) {
            whitespaceFound = true;

            if (attribClosingQuoteAt) {
              // slice the captured chunk
              let extractedChunksVal = str.slice(y, attribClosingQuoteAt);
              DEV &&
                console.log(
                  `6347 ${`\u001b[${33}m${`extractedChunksVal`}\u001b[${39}m`} = ${JSON.stringify(
                    extractedChunksVal,
                    null,
                    4,
                  )}`,
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
          if (whitespaceFound && str[y]?.trim()) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              // that's the first, default location
              attribClosingQuoteAt = y + 1;
              DEV &&
                console.log(
                  `6370 SET attribClosingQuoteAt = ${attribClosingQuoteAt}`,
                );
            } else {
              DEV && console.log(`6373 X`);
            }
          }
        }

        DEV &&
          console.log(
            `6380 FIY, ${`\u001b[${33}m${`attribClosingQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
              attribClosingQuoteAt,
              null,
              4,
            )}`,
          );

        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(
              attrib.attribValueStartsAt,
              attribClosingQuoteAt,
            );

            DEV &&
              console.log(
                `6397 FIY, ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                  attrib,
                  null,
                  4,
                )}`,
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
                attrib.attribValueEndsAt,
              );
              DEV &&
                console.log(
                  `6417 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} attrib.attribValue's last object's end and value: ${JSON.stringify(
                    attrib.attribValue,
                    null,
                    4,
                  )}`,
                );
            }
          }
          attrib.attribEnds = attribClosingQuoteAt;
          DEV &&
            console.log(
              `6428 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
                attrib.attribClosingQuoteAt
              }; ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
                attrib.attribValueEndsAt
              }; ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${
                attrib.attribValueRaw
              }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
                attrib.attribValue,
                null,
                4,
              )}; ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${
                attrib.attribEnds
              }`,
            );

          // 2. if the pair was mismatching, wipe layers' last element
          if (str[attrib.attribOpeningQuoteAt as number] !== str[i]) {
            layers.pop();
            DEV &&
              console.log(
                `6448 POP × 1, now layers = ${JSON.stringify(layers, null, 4)}`,
              );
          }

          // 3. push and wipe
          token.attribs.push(clone(attrib));
          attribReset();

          DEV &&
            console.log(
              `6458 ██ ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                attrib,
                null,
                4,
              )}`,
            );

          // 4. pull the i back to the position where the attribute ends
          i = ~-attribClosingQuoteAt;
          continue;
        } else if (
          attrib.attribOpeningQuoteAt &&
          (`'"`.includes(str[rightVal]) ||
            allHtmlAttribs.has(
              str.slice(attrib.attribOpeningQuoteAt + 1, i).trim(),
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
          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1;
          DEV &&
            console.log(
              `6489 SET ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${
                attrib.attribEnds
              }`,
            );

          // 3. value doesn't start, this needs correction
          attrib.attribValueStartsAt = null;

          // 4. pop the attribValue[] last element
          attrib.attribValue.pop();

          // 5. pop the opening quotes layer
          layers.pop();

          // 6. push and wipe
          token.attribs.push(clone(attrib));
          attribReset();

          // 7. continue
          continue;
        }
      } else if (str[i] === "/" && str[rightVal as number] === ">") {
        DEV && console.log(`6511 ${`\u001b[${33}m${`TAG ENDS`}\u001b[${39}m`}`);
        if (attrib.attribValueStartsAt) {
          attrib.attribValueStartsAt = null;
          DEV &&
            console.log(
              `6516 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
                attrib.attribValueStartsAt,
                null,
                4,
              )}`,
            );
        }
        if (!attrib.attribEnds) {
          attrib.attribEnds = i;
          DEV &&
            console.log(
              `6527 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrib.attribEnds,
                null,
                4,
              )}`,
            );
        }
      } else if (
        attrib &&
        attrib.attribName !== "style" &&
        attrib.attribStarts &&
        !attrib.attribEnds &&
        !property.propertyStarts &&
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
        DEV &&
          console.log(
            `6553 ${`\u001b[${33}m${`ATTR. DOESN'T END, STRING VALUE TOKEN STARTS UNDER attribValue`}\u001b[${39}m`}`,
          );

        attrib.attribValue.push({
          type: "text",
          start: i,
          end: null as any,
          value: null as any,
        });

        DEV &&
          console.log(
            `6565 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} new to attrib.attribValue, now ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`}: ${JSON.stringify(
              attrib.attribValue,
              null,
              4,
            )}`,
          );
      } else if (
        property &&
        !property.importantStarts &&
        // ESP token is involved:
        Array.isArray(property.value) &&
        str[i] &&
        // and !important does not follow:
        (str[i].trim() || !R2)
      ) {
        // <div style="width: {{ w }}px">
        //                           ^
        //                    we're here

        // also, this clause will initiate text tokens
        // for all intra-ESP whitespace:
        // <div style="padding: {{ t }} {{ r }} {{ b }} {{ l }}">
        //                             ^
        //                       like this

        // backup the parent tag token
        parentTokenToBackup = clone(token);
        DEV &&
          console.log(
            `6594 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`parentTokenToBackup`}\u001b[${39}m`} = ${JSON.stringify(
              parentTokenToBackup,
              null,
              4,
            )}`,
          );

        // initiate a text token
        initToken("text", i);

        DEV &&
          console.log(
            `6606 ${`\u001b[${33}m${`token`}\u001b[${39}m`} now = ${JSON.stringify(
              token,
              null,
              4,
            )}`,
          );
      }
    } else if (
      token.type === "esp" &&
      attribToBackup &&
      parentTokenToBackup &&
      attribToBackup.attribOpeningQuoteAt &&
      attribToBackup.attribValueStartsAt &&
      `'"`.includes(str[i]) &&
      str[attribToBackup.attribOpeningQuoteAt] === str[i] &&
      isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, i)
    ) {
      DEV &&
        console.log(
          `6625 ${`\u001b[${31}m${`██`}\u001b[${39}m`} emergency catching tag attr closing quotes inside attribute, with ESP tag unclosed`,
        );

      // imagine unclosed ESP tag inside attr value:
      // <tr class="{% x">
      //                ^
      //             we're here

      // we need to still proactively look for closing attribute quotes,
      // even inside ESP tags, if we're inside tag attributes

      DEV &&
        console.log(
          `6638 ${`\u001b[${32}m${`opening and closing quotes matched!`}\u001b[${39}m`}`,
        );
      DEV &&
        console.log(
          `6642 ${`\u001b[${32}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`attribToBackup`}\u001b[${39}m`} = ${JSON.stringify(
            attribToBackup,
            null,
            4,
          )}`,
        );

      // 1. patch up missing token (which is type="esp" currently) values
      token.end = i;
      token.value = str.slice(token.start, i);

      // 2. push token into attribToBackup.attribValue
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue = [];
      }
      DEV && console.log(`6657 push token to attribValue`);
      attribToBackup.attribValue.push(token);

      // 3. patch up missing values in attribToBackup
      attribToBackup.attribValueEndsAt = i;
      attribToBackup.attribValueRaw = str.slice(
        attribToBackup.attribValueStartsAt,
        i,
      );
      attribToBackup.attribClosingQuoteAt = i;
      attribToBackup.attribEnds = i + 1;

      // 4. restore parent token
      token = clone(parentTokenToBackup);

      token.attribs.push(attribToBackup);

      // 5. reset all
      attribToBackup = undefined;
      parentTokenToBackup = undefined;

      DEV &&
        console.log(
          `6680 FIY, now ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4,
          )}`,
        );

      attribReset();

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
      str[i]?.trim()
    ) {
      DEV && console.log(`6725 inside catching attr value start clauses`);
      if (
        str[i] === "=" &&
        !SOMEQUOTE.includes(str[rightVal as number]) &&
        !`=`.includes(str[rightVal as number]) &&
        !espChars.includes(str[rightVal as number]) // it might be an ESP literal
      ) {
        // find the index of the next quote, single or double
        let firstQuoteOnTheRightIdx = SOMEQUOTE.split("")
          .map((quote) => str.indexOf(quote, rightVal as number))
          .filter((val) => val > 0).length
          ? Math.min(
              ...SOMEQUOTE.split("")
                .map((quote) => str.indexOf(quote, rightVal as number))
                .filter((val) => val > 0),
            )
          : undefined;

        DEV &&
          console.log(
            `6745 ${`\u001b[${33}m${`firstQuoteOnTheRightIdx`}\u001b[${39}m`} = ${JSON.stringify(
              firstQuoteOnTheRightIdx,
              null,
              4,
            )}`,
          );

        // catch attribute name - equal - attribute name - equal
        // <span width=height=100>
        if (
          // there is a character on the right (otherwise value would be null)
          rightVal &&
          // there is equal character in the remaining chunk
          str.slice(rightVal).includes("=") &&
          // characters upto first equals form a known attribute value
          allHtmlAttribs.has(
            str
              .slice(rightVal, rightVal + str.slice(rightVal).indexOf("="))
              .trim()
              .toLowerCase(),
          )
        ) {
          DEV && console.log(`6767 attribute ends`);
          // we have something like:
          // <span width=height=100>

          // 1. end the attribute
          attrib.attribEnds = i + 1;

          // 2. push and wipe
          DEV &&
            console.log(
              `6777 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`,
            );
          token.attribs.push({ ...attrib });
          attribReset();
        } else if (
          // try to stop this clause:
          //
          // if there are no quotes in the remaining string
          !firstQuoteOnTheRightIdx ||
          // there is one but there are equal character between here and its location
          str
            .slice(rightVal as number, firstQuoteOnTheRightIdx)
            .includes("=") ||
          // if there is no second quote of that type in the remaining string
          !str.includes(
            str[firstQuoteOnTheRightIdx],
            firstQuoteOnTheRightIdx + 1,
          ) ||
          // if string slice from quote to quote includes equal or brackets
          Array.from(
            str.slice(
              firstQuoteOnTheRightIdx + 1,
              str.indexOf(
                str[firstQuoteOnTheRightIdx],
                firstQuoteOnTheRightIdx + 1,
              ),
            ),
          ).some((char) => `<>=`.includes(char))
        ) {
          DEV &&
            console.log(
              `6808 case of missing opening quotes - attribute continues`,
            );
          // case of missing opening quotes
          attrib.attribValueStartsAt = rightVal;
          DEV &&
            console.log(
              `6814 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
                attrib.attribValueStartsAt
              }`,
            );

          // push missing entry into layers
          layers.push({
            type: "simple",
            value: null as any,
            position: attrib.attribValueStartsAt as any,
          });
          DEV &&
            console.log(
              `6827 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: null,
                  position: attrib.attribValueStartsAt,
                },
                null,
                4,
              )}`,
            );
        }
      } else if (SOMEQUOTE.includes(str[i])) {
        // maybe it's <span width='"100"> and it's a false opening quote, '
        let nextCharIdx = rightVal;
        if (
          // a non-whitespace character exists on the right of index i
          nextCharIdx &&
          // if it is a quote character
          SOMEQUOTE.includes(str[nextCharIdx]) &&
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
                right(
                  str,
                  str.indexOf(str[nextCharIdx], nextCharIdx + 1),
                ) as number
              ]) &&
          // and that slice does not contain equal or brackets or quote of other kind
          !Array.from(
            str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx])),
          ).some((char) => `<>=${str[i]}`.includes(char))
        ) {
          DEV &&
            console.log(
              `6870 ${`\u001b[${31}m${`rogue quote!`}\u001b[${39}m`}`,
            );
          // pop the layers
          layers.pop();
        } else {
          // OK then...

          // has the quotes started (it's closing quote) or it's the opening quote?

          /* eslint no-lonely-if: "off" */
          if (!attrib.attribOpeningQuoteAt) {
            DEV && console.log(`6881 all fine, mark the quote as starting`);
            attrib.attribOpeningQuoteAt = i;
            DEV &&
              console.log(
                `6885 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
                  attrib.attribOpeningQuoteAt
                }`,
              );

            if (
              // character exists on the right
              str[i + 1] &&
              // EITHER it's not the same as opening quote we're currently on
              (str[i + 1] !== str[i] ||
                // OR it's a rogue quote, part of the value
                !ifQuoteThenAttrClosingQuote(i + 1))
            ) {
              attrib.attribValueStartsAt = i + 1;
              DEV &&
                console.log(
                  `6901 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
                    attrib.attribValueStartsAt
                  }`,
                );
            }
          } else {
            // One quote exists.
            // <table width="100">
            //                  ^
            //
            /* c8 ignore next */
            if (isAttrClosing(str, attrib.attribOpeningQuoteAt, i)) {
              DEV && console.log(`6913`);
              attrib.attribClosingQuoteAt = i;
              DEV &&
                console.log(
                  `6917 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
                    attrib.attribClosingQuoteAt,
                    null,
                    4,
                  )}`,
                );
            }

            /* c8 ignore next */
            if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
              if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                attrib.attribValueRaw = str.slice(
                  attrib.attribOpeningQuoteAt + 1,
                  attrib.attribClosingQuoteAt,
                );
                DEV &&
                  console.log(
                    `6934 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${JSON.stringify(
                      attrib.attribValueRaw,
                      null,
                      4,
                    )}`,
                  );
              } else {
                attrib.attribValueRaw = "";
                DEV &&
                  console.log(
                    `6944 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueRaw`}\u001b[${39}m`} = ${JSON.stringify(
                      attrib.attribValueRaw,
                      null,
                      4,
                    )}`,
                  );
              }

              attrib.attribEnds = i + 1;
              DEV &&
                console.log(
                  `6955 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}  ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${
                    attrib.attribEnds
                  }`,
                );
              // push and wipe
              DEV &&
                console.log(
                  `6962 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`,
                );
              token.attribs.push(clone(attrib));
              attribReset();
            }
            DEV &&
              console.log(
                `6969 now ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
                  attrib,
                  null,
                  4,
                )}`,
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
      !doNothing &&
      str[i] === ">" &&
      // consider ERB templating tags like <%= @p1 %>
      str[i - 1] !== "%" &&
      token.type === "tag" &&
      attrib.attribStarts &&
      !attrib.attribEnds
    ) {
      DEV &&
        console.log(
          `7008 ${`\u001b[${31}m${`██`}\u001b[${39}m`} bracket within attribute's value`,
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
          DEV &&
            console.log(
              `7028 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
                str[y],
                null,
                0,
              )}`}\u001b[${39}m`}`,
            );

          // if we reach the closing counterpart of the quotes, terminate
          if (
            attrib.attribOpeningQuoteAt &&
            str[y] === str[attrib.attribOpeningQuoteAt]
          ) {
            DEV &&
              console.log(
                `7042 closing quote (${
                  str[attrib.attribOpeningQuoteAt]
                }) found, ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`,
              );
            if (y !== i + 1 && str[~-y] !== "=") {
              thisIsRealEnding = true;
              DEV &&
                console.log(
                  `7050 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`,
                );
            }
            break;
          } else if (str[y] === ">") {
            // must be real tag closing, we just tackle missing quotes
            // TODO - missing closing quotes
            break;
          } else if (str[y] === "<") {
            thisIsRealEnding = true;
            DEV &&
              console.log(
                `7062 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`,
              );

            // TODO - pop only if type === "simple" and it's the same opening
            // quotes of this attribute
            layers.pop();
            DEV &&
              console.log(
                `7070 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
                  layers,
                  null,
                  4,
                )}`,
              );

            DEV && console.log(`7077 break`);
            break;
          } else if (!str[y + 1]) {
            // if end was reached and nothing caught, that's also positive sign
            thisIsRealEnding = true;
            DEV &&
              console.log(
                `7084 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`,
              );

            DEV && console.log(`7087 break`);
            break;
          }
        }
      } else {
        DEV && console.log(`7092 string ends so this was the bracket`);
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
        DEV &&
          console.log(
            `7110 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`,
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
            DEV && console.log(`7132`);
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
              attrib.attribValue[~-attrib.attribValue.length].start,
              i,
            );
          }
          // otherwise, nulls stay
        } else {
          attrib.attribValueStartsAt = null;
        }

        if (attrib.attribEnds === null) {
          attrib.attribEnds = i;
          DEV &&
            console.log(
              `7148 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}  ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${
                attrib.attribEnds
              }`,
            );
        }

        // for broken code cases, clean up attribValue like:
        // "attribValue": [
        // {
        //   "type": "text",
        //   "start": 9,
        //   "end": null, <-----
        //   "value": null
        //   }
        // ],
        while (
          attrib.attribValue?.length &&
          attrib.attribValue[~-attrib.attribValue.length].end === null
        ) {
          attrib.attribValue.pop();
        }

        if (attrib) {
          // 2. push and wipe
          DEV &&
            console.log(
              `7174 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`,
            );
          token.attribs.push(clone(attrib));
          attribReset();
        }
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

    if (str[i] && resolvedOpts.charCb) {
      DEV &&
        console.log(
          `7205 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            {
              type: token.type,
              chr: str[i],
              i,
            },
            null,
            4,
          )}`,
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
      // if there is unfinished "attrib" object, submit it
      // as is, that's abruptly ended attribute

      // insurance clauses - in case text token slips through this far
      if (token.type !== "tag") {
        // maybe it's a broken code case where ESP token is set
        // as the main "token" and there's backed up real tag token?
        if (token.type === "esp" && parentTokenToBackup) {
          DEV &&
            console.log(
              `7246 ${`\u001b[${31}m${`broken ESP token!`}\u001b[${39}m`}`,
            );

          // property by now will be already pushed to attrib,
          // so we check its contents directly
          if (
            attrib &&
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            Array.isArray(attrib.attribValue[~-attrib.attribValue.length].value)
          ) {
            // push this esp token to the last attrib value
            (attrib.attribValue[~-attrib.attribValue.length].value as any).push(
              clone(token),
            );

            DEV &&
              console.log(
                `7264 SET ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
                  attrib.attribValue,
                  null,
                  4,
                )}`,
              );

            // patch missing values on attrib
            if (!attrib.attribValueEndsAt) {
              attrib.attribValueEndsAt = token.end;
            }
          }

          token = clone(parentTokenToBackup);
          DEV &&
            console.log(
              `7280 ${`\u001b[${32}m${`RESTORE`}\u001b[${39}m`} ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                token,
                null,
                4,
              )}`,
            );
          attribToBackup = undefined;
          parentTokenToBackup = undefined;

          token.attribs.push(clone(attrib));
          attribReset();
        }

        attribReset();
        DEV &&
          console.log(`7295 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} attrib`);
      } else if (attrib?.attribName) {
        DEV &&
          console.log(
            `7299 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4,
            )}; ${`\u001b[${33}m${`attrib`}\u001b[${39}m`} = ${JSON.stringify(
              attrib,
              null,
              4,
            )}`,
          );

        // push and wipe
        DEV &&
          console.log(
            `7313 ${`\u001b[${32}m${`PUSH ATTR AND WIPE`}\u001b[${39}m`}`,
          );
        // patch the attr ending if it's missing
        if (!attrib.attribEnds) {
          attrib.attribEnds = i;
          DEV &&
            console.log(
              `7320 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrib.attribEnds,
                null,
                4,
              )}`,
            );
        }
        (token as any).attribs.push({ ...attrib });
        attribReset();
      }

      // if there was an unfinished CSS property, finish it
      if (
        token &&
        Array.isArray((token as RuleToken).properties) &&
        (token as RuleToken).properties.length &&
        !(token as RuleToken).properties[
          ~-(token as RuleToken).properties.length
        ].end
      ) {
        (token as RuleToken).properties[
          ~-(token as RuleToken).properties.length
        ].end = i;
        if (
          (token as RuleToken).properties[
            ~-(token as RuleToken).properties.length
          ].start &&
          !(token as RuleToken).properties[
            ~-(token as RuleToken).properties.length
          ].value
        ) {
          (token as RuleToken).properties[
            ~-(token as RuleToken).properties.length
          ].value = str.slice(
            (token as RuleToken).properties[
              ~-(token as RuleToken).properties.length
            ].start,
            i,
          );
        }
      }

      // if there is unfinished css property that has been
      // recording, end it and push it as is. That's an
      // abruptly ended css chunk.
      if (property?.propertyStarts) {
        // patch property.end
        if (!property.end) {
          property.end = i;
        }
        pushProperty(property);
        propertyReset();
        DEV &&
          console.log(
            `7374 push, then ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`}`,
          );
      }

      DEV && console.log(`7378 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
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

    if (str[i]?.trim()) {
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

    DEV &&
      console.log(
        `${`\u001b[${90}m${`==========================================\n██ token: ${JSON.stringify(
          token,
          null,
          4,
        )}${
          property.propertyStarts || property.importantStarts
            ? `\n██ property: ${JSON.stringify(property, null, 4)}`
            : ""
        }${
          attrib.attribStarts
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
                4,
              )}`
            : ""
        }${
          layers.length ? `\n██ layers: ${JSON.stringify(layers, null, 4)}` : ""
        }`}\u001b[${39}m`}${
          doNothing
            ? `\n${`\u001b[${31}m${`DO NOTHING UNTIL ${doNothing}`}\u001b[${39}m`}`
            : ""
        }`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`withinStyle = ${withinStyle}`}\u001b[${39}m`}  ${`\u001b[${90}m${`withinStyleComment = ${withinStyleComment}`}\u001b[${39}m`}  ${`\u001b[${90}m${`withinScript = ${withinScript}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`selectorChunkStartedAt = ${selectorChunkStartedAt}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(`${`\u001b[${90}m${`rightVal = ${rightVal}`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `${`\u001b[${90}m${`lastNonWhitespaceCharAt = ${lastNonWhitespaceCharAt}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${
          parentTokenToBackup
            ? `${`\u001b[${90}m${`parentTokenToBackup = ${JSON.stringify(
                parentTokenToBackup,
                null,
                4,
              )}`}\u001b[${39}m`}`
            : ""
        }`,
      );
  }

  //
  // finally, clear stashes
  //
  if (charStash.length) {
    DEV &&
      console.log(
        `7474 FINALLY, clear ${`\u001b[${33}m${`charStash`}\u001b[${39}m`}`,
      );
    for (let i = 0, len2 = charStash.length; i < len2; i++) {
      reportFirstFromStash(
        charStash,
        resolvedOpts.charCb,
        resolvedOpts.charCbLookahead,
      );
      DEV &&
        console.log(
          `7484 ${`\u001b[${90}m${`██ charStash`}\u001b[${39}m`} = ${JSON.stringify(
            charStash,
            null,
            4,
          )}`,
        );
    }
  }

  if (tagStash.length) {
    DEV &&
      console.log(
        `7496 FINALLY, clear ${`\u001b[${33}m${`tagStash`}\u001b[${39}m`}`,
      );
    for (let i = 0, len2 = tagStash.length; i < len2; i++) {
      reportFirstFromStash(
        tagStash,
        resolvedOpts.tagCb,
        resolvedOpts.tagCbLookahead,
      );
      DEV &&
        console.log(
          `7506 ${`\u001b[${90}m${`██ tagStash`}\u001b[${39}m`} = ${JSON.stringify(
            tagStash,
            null,
            4,
          )}`,
        );
    }
  }

  // return stats
  let timeTakenInMilliseconds = Date.now() - start;
  DEV && console.log(" ");
  DEV &&
    console.log(
      `7520 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`timeTakenInMilliseconds`}\u001b[${39}m`} = ${JSON.stringify(
        timeTakenInMilliseconds,
        null,
        4,
      )}`,
    );
  DEV && console.log(" ");
  return {
    timeTakenInMilliseconds,
  };
}

const util = { matchLayerLast };

export {
  tokenizer,
  defaults,
  version,
  util,
  TagToken,
  TextToken,
  CommentToken,
  RuleToken,
  AtToken,
  EspToken,
  CharCb,
  Opts,
};
