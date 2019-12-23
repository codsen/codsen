import { matchRight } from "string-match-left-right";
import { left, right } from "string-left-right";
import isTagOpening from "is-html-tag-opening";
import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";
import {
  charSuitableForHTMLAttrName,
  allHTMLTagsKnownToHumanity,
  // charSuitableForTagName,
  // isLowerCaseLetter,
  // isUppercaseLetter,
  // secondToLastChar,
  isLatinLetter,
  // isLowercase,
  flipEspTag,
  // secondChar,
  // firstChar,
  // lastChar,
  isStr,
  isNum
} from "./util";

const defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

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

// contains all common templating language head/tail marker characters:
const espChars = `{}%-$_()*|`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "%)", "*)"];

function tokenizer(str, tagCb, charCb, originalOpts) {
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
  if (tagCb && typeof tagCb !== "function") {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ${typeof tagCb}, equal to ${JSON.stringify(
        tagCb,
        null,
        4
      )}`
    );
  }
  if (charCb && typeof charCb !== "function") {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the second input argument, callback function, should be a function but it was given as type ${typeof charCb}, equal to ${JSON.stringify(
        charCb,
        null,
        4
      )}`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the third input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
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

  const opts = Object.assign({}, defaults, originalOpts);
  if (
    opts.reportProgressFunc &&
    typeof opts.reportProgressFunc !== "function"
  ) {
    throw new TypeError(
      `codsen-tokenizer: [THROW_ID_06] opts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(
        opts.reportProgressFunc,
        null,
        4
      )} (${typeof opts.reportProgressFunc})`
    );
  }

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
    type: null, // html, css, js, text, esp
    start: null,
    end: null,
    tail: null, // used to store the guessed ESP token's/tag's tail
    kind: null,
    attribs: []
  };
  function tokenReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    token = clone(tokenDefault);
  }

  // same for attributes:
  let attrib = {};
  const attribDefault = {
    attribName: null,
    attribNameStartAt: null,
    attribNameEndAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValue: null,
    attribValueStartAt: null,
    attribValueEndAt: null,
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
        `248 ${`\u001b[${33}m${`wholeEspTagLump`}\u001b[${39}m`} = ${JSON.stringify(
          wholeEspTagLump,
          null,
          4
        )}`
      );
      console.log(
        `255 ${`\u001b[${33}m${`whichLayerToMatch.openingLump`}\u001b[${39}m`} = ${JSON.stringify(
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
            `277 RETURN ${wholeEspTagLump.length -
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
          `300 ${`\u001b[${33}m${`uniqueCharsListFromGuessedClosingLumpArr`}\u001b[${39}m`} = ${JSON.stringify(
            uniqueCharsListFromGuessedClosingLumpArr,
            null,
            0
          )}`
        );

        let found = 0;
        for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
          console.log(`309 char = ${wholeEspTagLump[y]}`);

          if (
            !uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            ) &&
            found > 1
          ) {
            console.log(`317 RETURN ${y}`);
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
              `331 SET found = ${found}; uniqueCharsListFromGuessedClosingLumpArr = ${JSON.stringify(
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
        console.log(`346 RETURN ${wholeEspTagLump.length}`);
        return wholeEspTagLump.length;
      }
    }
  }

  function matchLayerFirst(str, i) {
    return matchLayerLast(str, i, true);
  }

  function pingCharCb(incomingToken) {
    // no cloning, no reset
    if (charCb) {
      charCb(incomingToken);
    }
  }

  function pingTagCb(incomingToken) {
    if (tagCb) {
      console.log(
        `366 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
          incomingToken,
          null,
          4
        )}`
      );
      tagCb(clone(incomingToken));
      // reset
      tokenReset();
    }
  }

  function dumpCurrentToken(token, i) {
    console.log(
      `380 ${`\u001b[${35}m${`dumpCurrentToken()`}\u001b[${39}m`}; incoming token=${JSON.stringify(
        token,
        null,
        0
      )}; i = ${`\u001b[${33}m${i}\u001b[${39}m`}`
    );
    // let's ensure it was not CSS with trailing whitespace, because now is the
    // time to separate it and report it as a standalone token.
    if (
      !["text", "esp"].includes(token.type) &&
      token.start !== null &&
      token.start < i &&
      str[i - 1] &&
      !str[i - 1].trim().length
    ) {
      console.log(`395 this token indeed had trailing whitespace`);
      // separate that trailing space
      token.end = left(str, i) + 1;
      console.log(
        `399 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        }`
      );
      pingTagCb(token);
      token.start = left(str, i) + 1;
      token.end = null;
      token.type = "text";
      console.log(
        `408 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
          token.start
        }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
      );
    }

    // if a token is already being recorded, end it
    if (token.start !== null) {
      if (token.end === null) {
        // (esp tags will have it set already)
        token.end = i;
        console.log(
          `420 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }; then PING tagCb()`
        );
      }
      pingTagCb(token);
    }
  }

  function initHtmlToken() {
    token = Object.assign(
      {
        tagNameStartAt: null,
        tagNameEndAt: null,
        tagName: null,
        recognised: null,
        closing: false,
        void: false,
        pureHTML: true, // meaning there are no esp bits
        esp: []
      },
      token
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

  for (let i = 0; i < len; i++) {
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
    if (opts.reportProgressFunc) {
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
          console.log(`503 DONE ${currentPercentageDone}%`);
        }
      }
    }

    // turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    // TODO - turn doNothing, start registering "from" value
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log(`514 TURN OFF doNothing`);
    }

    if (token.end && token.end === i) {
      // if value was captured from the past, push it now
      console.log(`519 call dumpCurrentToken()`);
      if (token.kind === "style") {
        styleStarts = true;
      }
      // we need to retain the information after tag was dumped to tagCb() and wiped
      dumpCurrentToken(token, i);

      console.log(`526 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} layers`);
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
    if (!doNothing && ["html", "esp", "css"].includes(token.type)) {
      console.log(`544 inside layers clauses`);

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
          console.log(`561 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
        } else {
          // it's opening then
          layers.push({
            type: "simple",
            value: str[i],
            position: i
          });
          console.log(
            `570 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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

      console.log(
        `583 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
          layers,
          null,
          4
        )}`
      );
    }

    // catch the beginning of a token
    // -------------------------------------------------------------------------
    // below, the part:
    // (token.type !== "esp" || token.tail.includes(str[i]))
    // means that we won't end ESP token and start HTML token unless anticipated tail
    // character is matched

    if (!doNothing) {
      if (
        !layers.length &&
        str[i] === "<" &&
        (isTagOpening(str, i) ||
          str.startsWith("!--", i + 1) ||
          matchRight(str, i, ["doctype", "xml", "cdata"], {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })) &&
        (token.type !== "esp" || token.tail.includes(str[i]))
      ) {
        console.log(`610 html tag opening`);

        if (token.type && Number.isInteger(token.start)) {
          console.log(`613 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
        } else {
          console.log(`616 didn't call dumpCurrentToken()`);
        }

        console.log(`619 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();

        token.start = i;
        token.type = "html";
        console.log(
          `625 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );

        // add other HTML-specific keys onto the object
        initHtmlToken();

        if (matchRight(str, i, "!--")) {
          token.kind = "comment";
          console.log(
            `636 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "doctype";
          console.log(
            `648 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
            `660 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
            `672 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "style", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-", "/", "\\"]
          })
        ) {
          token.kind = "style";
          console.log(
            `684 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        }
      } else if (
        espChars.includes(str[i]) &&
        str[i + 1] &&
        espChars.includes(str[i + 1]) &&
        !(str[i] === "-" && str[i + 1] === "-") &&
        !(
          // insurance against repeated percentages
          (
            "0123456789".includes(str[left(str, i)]) &&
            (!str[i + 2] ||
              [`"`, `'`, ";"].includes(str[i + 2]) ||
              !str[i + 2].trim().length)
          )
        )
      ) {
        console.log(`704 ESP tag detected`);

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
          `719 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wholeEspTagLump = ${wholeEspTagLump}`
        );
        console.log(
          `722 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
        console.log(
          `729 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )}`
        );

        if (!espLumpBlacklist.includes(wholeEspTagLump)) {
          // check the "layers" records - maybe it's a closing part of a set?
          console.log(`738 ESP lump is not blacklisted.`);

          let lengthOfClosingEspChunk;

          if (layers.length && matchLayerLast(str, i)) {
            console.log(
              `744 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against the last layer`
            );
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            console.log(
              `748 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (token.end === null) {
                token.end = i + lengthOfClosingEspChunk;
                console.log(
                  `761 SET ${`\u001b[${32}m${`token.end`}\u001b[${39}m`} = ${
                    token.end
                  }`
                );
              }
              console.log(
                `767 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                  token,
                  null,
                  4
                )} before pinging`
              );
              dumpCurrentToken(token, i);
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers.pop();
            console.log(`779 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else if (layers.length && matchLayerFirst(str, i)) {
            console.log(
              `782 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against first layer`
            );
            console.log(
              `785 wipe all layers, there were strange unclosed characters`
            );
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            console.log(
              `789 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );

            // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()
            if (token.type === "esp") {
              if (token.end === null) {
                token.end = i + lengthOfClosingEspChunk;
                console.log(
                  `802 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4
                  )} before pinging`
                );
              }
              dumpCurrentToken(token, i);
            }

            // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:
            layers = [];
            console.log(`815 ${`\u001b[${32}m${`WIPE`}\u001b[${39}m`} layers`);
          } else {
            console.log(
              `818 closing part of a set ${`\u001b[${31}m${`NOT MATCHED`}\u001b[${39}m`} - means it's a new opening`
            );
            console.log(`820 push new layer`);
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i
            });
            console.log(
              `828 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
              `840 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );

            // also, if it's a standalone ESP token, terminate the previous token
            // and start recording a new-one

            if (
              !(
                token.type === "html" &&
                (token.kind === "comment" ||
                  // it's attribute's contents:
                  (isNum(attrib.attribStart) && attrib.attribEnd === null))
              )
            ) {
              console.log(
                `859 ${`\u001b[${36}m${`██`}\u001b[${39}m`} standalone ESP tag`
              );
              dumpCurrentToken(token, i);

              token.start = i;
              token.type = "esp";
              console.log(
                `866 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );
              token.tail = flipEspTag(wholeEspTagLump);
              console.log(
                `874 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tail`}\u001b[${39}m`} = ${
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
            `889 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }

        //
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log(`896`);
          // 1. if there's whitespace, ping it as text
          if (!str[i].trim().length) {
            token.start = i;
            token.type = "text";
            token.end = right(str, i) || str.length;
            console.log(
              `903 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
            pingTagCb(token);

            // consider <style> ...  EOL - nothing inside, whitespace leading to
            // end of the string
            if (right(str, i)) {
              token.start = right(str, i);
              token.type = "css";
              console.log(
                `917 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );

              doNothing = right(str, i);
              console.log(
                `926 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            }
          } else {
            // css starts with away after opening tag
            token.start = i;
            token.type = "css";
            console.log(
              `934 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
          }
        } else {
          // finally, the last default type is "text"
          console.log(`941 ${`\u001b[${31}m${`reset`}\u001b[${39}m`} attrib`);
          attribReset();
          token.start = i;
          console.log(
            `945 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }`
          );
          token.type = "text";
          token.attribs = [];
          attribReset();
          console.log(
            `953 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
              token.type
            }; ${`\u001b[${33}m${`token.attribs`}\u001b[${39}m`} = ${
              token.attribs
            }`
          );
        }
      }

      // END OF if (!doNothing)
    }

    // catch the ending of a token
    // -------------------------------------------------------------------------
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log(
          `971 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
        // at this point attr might be still not submitted yet, we can't reset it here
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        console.log(`982 POSSIBLE ESP TAILS`);
        // extract the whole lump of ESP tag characters:
        let wholeEspTagClosing = "";

        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[y];
          } else {
            break;
          }
        }
        console.log(`993 wholeEspTagClosing = ${wholeEspTagClosing}`);

        // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here

        // find the breaking point where tails end
        if (wholeEspTagClosing.length > token.head.length) {
          console.log(
            `1003 wholeEspTagClosing.length = ${`\u001b[${33}m${
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
            console.log(`1031 - chunk ends with the same heads`);
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
              `1053 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `1059 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            console.log(
              `1064 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `1070 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            console.log(`1078`);
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
              console.log(`1113 definitely tails + new heads`);
              token.end = i + firstPartOfWholeEspTagClosing.length;
              console.log(
                `1116 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`
              );
              doNothing = token.end;
              console.log(
                `1122 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
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
              `1137 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `1143 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          }
          console.log(`1146`);
        } else {
          // we consider this whole chunk is tails.
          token.end = i + wholeEspTagClosing.length;
          console.log(
            `1151 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
          doNothing = token.end;
          console.log(
            `1157 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }
      }
      // END OF if (!doNothing)
    }

    // Catch the end of a tag name
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "html" &&
      isNum(token.tagNameStartAt) &&
      !isNum(token.tagNameEndAt)
    ) {
      // tag names can be with numbers, h1
      if (!isLatinLetter(str[i]) && !isNum(str[i])) {
        token.tagNameEndAt = i;
        console.log(
          `1177 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndAt`}\u001b[${39}m`} = ${
            token.tagNameEndAt
          }`
        );

        token.tagName = str.slice(token.tagNameStartAt, i);
        console.log(
          `1184 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
            token.tagName
          }`
        );

        // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.
        if (voidTags.includes(token.tagName)) {
          token.void = true;
          console.log(
            `1195 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.void`}\u001b[${39}m`} = ${
              token.void
            }`
          );
        }

        token.recognised =
          allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) ||
          ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
        console.log(
          `1205 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.recognised`}\u001b[${39}m`} = ${
            token.recognised
          }`
        );
      }
    }

    // Catch the start of a tag name:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "html" &&
      !isNum(token.tagNameStartAt) &&
      isNum(token.start) &&
      token.start < i
    ) {
      // MULTIPLE ENTRY!
      // Consider closing tag's slashes and tag name itself.

      if (str[i] === "/") {
        token.closing = true;
        console.log(
          `1228 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
            token.closing
          }`
        );
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        console.log(
          `1235 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameStartAt`}\u001b[${39}m`} = ${
            token.tagNameStartAt
          }`
        );
        // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name
        if (!token.closing) {
          token.closing = false;
          console.log(
            `1244 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
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
      token.type === "html" &&
      isNum(attrib.attribNameStartAt) &&
      i > attrib.attribNameStartAt &&
      attrib.attribNameEndAt === null &&
      !charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`1265 inside catch the tag attribute name end clauses`);
      attrib.attribNameEndAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartAt, i);
      console.log(
        `1269 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndAt`}\u001b[${39}m`} = ${
          attrib.attribNameEndAt
        }; ${`\u001b[${33}m${`attrib.attribName`}\u001b[${39}m`} = ${JSON.stringify(
          attrib.attribName,
          null,
          0
        )}`
      );

      // maybe there's a space in front of equal, <div class= "">
      if (!str[i].trim().length && str[right(str, i)] === "=") {
        console.log(`1280 equal on the right`);
      } else if (
        !str[i].trim().length ||
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        // a value-less attribute
        attrib.attribEnd = i;
        console.log(
          `1289 SET ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndAt`}\u001b[${39}m`} = ${
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
      token.type === "html" &&
      isNum(token.tagNameEndAt) &&
      i > token.tagNameEndAt &&
      attrib.attribStart === null &&
      charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`1310 inside catch the tag attribute name start clauses`);
      attrib.attribStart = i;
      attrib.attribNameStartAt = i;
      console.log(
        `1314 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribStart`}\u001b[${39}m`} = ${
          attrib.attribStart
        }; ${`\u001b[${33}m${`attrib.attribNameStartAt`}\u001b[${39}m`} = ${
          attrib.attribNameStartAt
        }`
      );
    }

    // Catch the end of a tag attribute's value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "html" &&
      isNum(attrib.attribValueStartAt) &&
      i >= attrib.attribValueStartAt &&
      attrib.attribValueEndAt === null
    ) {
      console.log(`1332 inside catching end of a tag attr clauses`);
      if (`'"`.includes(str[i])) {
        // TODO - detect mismatching quotes
        if (
          str[attrib.attribOpeningQuoteAt] === str[i] &&
          !layers.some(layerObj => layerObj.type === "esp")
        ) {
          console.log(`1339 opening and closing quotes matched!`);
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
          attrib.attribEnd = i + 1;
          console.log(
            `1345 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribClosingQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueEndAt`}\u001b[${39}m`} = ${
              attrib.attribValueEndAt
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
        (!str[i].trim().length ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        // ^ either whitespace or tag's closing or ESP literal's start ends
        // the attribute's value if there are no quotes
        console.log(`1368 opening quote was missing, terminate attr val here`);

        attrib.attribValueEndAt = i;
        attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
        attrib.attribEnd = i;
        console.log(
          `1374 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueEndAt`}\u001b[${39}m`} = ${
            attrib.attribValueEndAt
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
      token.type === "html" &&
      !isNum(attrib.attribValueStartAt) &&
      isNum(attrib.attribNameEndAt) &&
      attrib.attribNameEndAt <= i &&
      str[i].trim().length
    ) {
      console.log(`1400 inside catching attr value start clauses`);
      if (
        str[i] === "=" &&
        !`'"=`.includes(str[right(str, i)]) &&
        !espChars.includes(str[right(str, i)]) // it might be an ESP literal
      ) {
        attrib.attribValueStartAt = right(str, i);
        console.log(
          `1408 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartAt
          }`
        );
      } else if (`'"`.includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartAt = i + 1;
        }
        console.log(
          `1418 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
            attrib.attribOpeningQuoteAt
          }; ${`\u001b[${33}m${`attrib.attribValueStartAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartAt
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
      token.type === "html" &&
      attrib.attribStart !== null &&
      attrib.attribEnd === null
    ) {
      console.log(
        `1449 ${`\u001b[${31}m${`██`}\u001b[${39}m`} bracket within attribute's value`
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

      // Traverse then
      for (let y = i + 1; y < len; y++) {
        console.log(
          `1467 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
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
            `1480 closing quote (${
              str[attrib.attribOpeningQuoteAt]
            }) found, ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          if (y !== i + 1 && str[y - 1] !== "=") {
            thisIsRealEnding = true;
            console.log(
              `1487 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
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
            `1498 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
          );

          // TODO - pop only if type === "simple" and it's the same opening
          // quotes of this attribute
          layers.pop();
          console.log(
            `1505 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
              layers,
              null,
              4
            )}`
          );

          console.log(`1512 break`);
          break;
        }
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
          `1529 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );

        // set and push the attribute's records, just closing quote will be
        // null and possibly value too

        if (
          Number.isInteger(attrib.attribValueStartAt) &&
          attrib.attribValueStartAt < i &&
          str.slice(attrib.attribValueStartAt, i).trim().length
        ) {
          attrib.attribValueEndAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
          // otherwise, nulls stay
        } else {
          attrib.attribValueStartAt = null;
        }

        attrib.attribEnd = i;
        console.log(
          `1551 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}  ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );

        // 2. push and wipe
        console.log(
          `1558 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`
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

    if (charCb) {
      console.log(
        `1587 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
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
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
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
  }
}

// -----------------------------------------------------------------------------

export default tokenizer;
