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
    token = Object.assign({}, tokenDefault);
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
    attrib = Object.assign({}, attribDefault);
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
  const layers = [];
  // example of contents:
  // [
  //     {
  //         type: "simple",
  //         value: "}",
  //     },
  //     {
  //         type: "esp",
  //         value: "%}"
  //     }
  // ]
  // there can be two types of layer values: simple strings to match html/css
  // token types and complex, to match esp tokens heuristically, where we don't
  // know exact ESP tails but we know set of characters that suspected "tail"
  // should match.
  //
  function matchLayerLast(str, i) {
    if (!layers.length) {
      return false;
    } else if (layers[layers.length - 1].type === "simple") {
      return str[i] === layers[layers.length - 1].value;
    } else if (layers[layers.length - 1].type === "esp") {
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
      console.log(`240 wholeEspTagLump = ${wholeEspTagLump}`);
      // match
      // every character from the last "layers" complex-type entry must be
      // present in the extracted lump
      return layers[layers.length - 1].value
        .split("")
        .every(char => wholeEspTagLump.includes(char));
    }
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
        `260 PING tagCb() with ${JSON.stringify(incomingToken, null, 4)}`
      );
      tagCb(clone(incomingToken));
      // reset
      tokenReset();
    }
  }

  function dumpCurrentToken(token, i) {
    console.log(
      `270 ${`\u001b[${35}m${`dumpCurrentToken()`}\u001b[${39}m`}; incoming token=${JSON.stringify(
        token,
        null,
        0
      )}; i = ${`\u001b[${33}m${i}\u001b[${39}m`}`
    );
    // let's ensure it was not CSS with trailing whitespace, because now is the
    // time to separate it and report it as a standalone token.
    if (
      token.type !== "text" &&
      token.start !== null &&
      token.start < i &&
      str[i - 1] &&
      !str[i - 1].trim().length
    ) {
      console.log(`285 this token indeed had trailing whitespace`);
      // separate that trailing space
      token.end = left(str, i) + 1;
      console.log(
        `289 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        }`
      );
      pingTagCb(token);
      token.start = left(str, i) + 1;
      token.type = "text";
      console.log(
        `297 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
          token.start
        }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
      );
    }

    // if a token is already being recorded, end it
    if (token.start !== null) {
      token.end = i;
      console.log(
        `307 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        }; then PING tagCb()`
      );
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
    //                    TOP
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
          : JSON.stringify(str[i], null, 0)
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
          console.log(`388 DONE ${currentPercentageDone}%`);
        }
      }
    }

    // turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log(`398 TURN OFF doNothing`);
    }

    if (token.end && token.end === i) {
      // if value was captured from the past, push it now
      console.log(`403 call dumpCurrentToken()`);
      if (token.kind === "style") {
        styleStarts = true;
      }
      // we need to retain the information after tag was dumped to tagCb() and wiped
      dumpCurrentToken(token, i);
    }

    //
    //
    //
    //
    //                    MIDDLE
    //
    //
    //
    //

    // record "layers" like entering double quotes
    // -------------------------------------------------------------------------
    if (
      !doNothing &&
      ["html"].includes(token.type) &&
      [`"`, `'`].includes(str[i])
    ) {
      if (matchLayerLast(str, i)) {
        // maybe it's the closing counterpart?
        layers.pop();
        console.log(`431 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
        console.log(
          `433 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
      } else if (!layers.length || layers[layers.length - 1].type !== "esp") {
        // it's opening then
        // but push only if there are no esp heads in the last position.
        // The idea is, ESP tags are complex, in many cases there's no more
        // point tracking pairs of something - quotes might be used as strings
        // for example, like "'" and in such case you wouldn't find the closing
        // single quote. Solution is to skip "layer" recording until ESP tails
        // are found.
        layers.push({
          type: "simple",
          value: str[i]
        });
        console.log(
          `452 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            {
              type: "simple",
              value: str[i]
            },
            null,
            4
          )}`
        );
        console.log(
          `462 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
      }
    }

    // catch the beginning of a token
    // -------------------------------------------------------------------------
    // below, part:
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
        console.log(`490 html tag opening`);

        if (token.type && Number.isInteger(token.start)) {
          console.log(`493 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
        } else {
          console.log(`496 didn't call dumpCurrentToken()`);
        }

        token.start = i;
        token.type = "html";

        console.log(
          `503 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );

        // add other HTML-specific keys onto the object
        initHtmlToken();

        if (matchRight(str, i, "!--")) {
          token.kind = "comment";
          console.log(
            `514 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
            `526 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
            `538 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
            `550 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
            `562 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        }
      } else if (
        !(token.type === "html" && token.kind === "comment") &&
        espChars.includes(str[i]) &&
        str[i + 1] &&
        espChars.includes(str[i + 1]) &&
        !(str[i] === "-" && str[i + 1] === "-")
      ) {
        console.log(`574 ESP tag detected`);
        // we don't look for esp tags in HTML comments because conditionals
        // often have complex contraptions with brackets and pipes that are
        // difficult to catch them all reliably.

        // extract the tag opening and guess the closing judging from it
        let wholeEspTagLump = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        console.log(
          `589 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wholeEspTagLump = ${wholeEspTagLump}`
        );
        console.log(
          `592 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );

        if (!["html", "esp"].includes(token.type)) {
          console.log("600");
          dumpCurrentToken(token, i);

          token.start = i;
          token.type = "esp";
          console.log(
            `606 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
          doNothing = i + wholeEspTagLump.length;
          console.log(
            `612 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
          token.tail = flipEspTag(wholeEspTagLump);
          console.log(
            `616 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tail`}\u001b[${39}m`} = ${
              token.tail
            }`
          );
          token.head = wholeEspTagLump;
        } else if (token.type === "html") {
          console.log("622");
          // maybe it's closing part of a set?
          if (matchLayerLast(str, i)) {
            layers.pop();
            console.log(`626 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            console.log(`628 ESP tag within HTML tag`);
            layers.push({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            });
            console.log(
              `634 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "esp",
                  value: flipEspTag(wholeEspTagLump)
                },
                null,
                4
              )}`
            );
            console.log(
              `644 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );
          }
        } else {
          console.log("652");
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log(`656`);
          // 1. if there's whitespace, ping it as text
          if (!str[i].trim().length) {
            token.start = i;
            token.type = "text";
            token.end = right(str, i) || str.length;
            console.log(
              `663 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
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
                `677 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );

              doNothing = right(str, i);
              console.log(
                `686 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            }
          } else {
            // css starts with away after opening tag
            token.start = i;
            token.type = "css";
            console.log(
              `694 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
          }
        } else {
          // finally, the last default type is "text"
          token.start = i;
          console.log(
            `703 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }`
          );
          token.type = "text";
          console.log(
            `709 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
              token.type
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
          `725 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        console.log(`735 POSSIBLE ESP TAILS`);
        // extract the whole lump of ESP tag characters:
        let wholeEspTagClosing = "";

        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[y];
          } else {
            break;
          }
        }
        console.log(`746 wholeEspTagClosing = ${wholeEspTagClosing}`);

        // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here

        // find the breaking point where tails end
        if (wholeEspTagClosing.length > token.head.length) {
          console.log(
            `756 wholeEspTagClosing.length = ${`\u001b[${33}m${
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
            console.log(`784 - chunk ends with the same heads`);
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
              `806 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `812 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            console.log(
              `817 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `823 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            console.log(`831`);
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
              console.log(`866 definitely tails + new heads`);
              token.end = i + firstPartOfWholeEspTagClosing.length;
              console.log(
                `869 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`
              );
              doNothing = token.end;
              console.log(
                `875 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
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
              `890 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `896 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          }
          console.log(`899`);
        } else {
          // we consider this whole chunk is tails.
          token.end = i + wholeEspTagClosing.length;
          console.log(
            `904 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
          doNothing = token.end;
          console.log(
            `910 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
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
          `930 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndAt`}\u001b[${39}m`} = ${
            token.tagNameEndAt
          }`
        );

        token.tagName = str.slice(token.tagNameStartAt, i);
        console.log(
          `937 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
            token.tagName
          }`
        );

        // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.
        if (voidTags.includes(token.tagName)) {
          token.void = true;
          console.log(
            `948 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.void`}\u001b[${39}m`} = ${
              token.void
            }`
          );
        }

        token.recognised =
          allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) ||
          ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
        console.log(
          `958 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.recognised`}\u001b[${39}m`} = ${
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
          `981 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
            token.closing
          }`
        );
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        console.log(
          `988 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameStartAt`}\u001b[${39}m`} = ${
            token.tagNameStartAt
          }`
        );
        // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name
        if (!token.closing) {
          token.closing = false;
          console.log(
            `997 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
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
      console.log(`1018 inside catch the tag attribute name end clauses`);
      attrib.attribNameEndAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartAt, i);
      console.log(
        `1022 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndAt`}\u001b[${39}m`} = ${
          attrib.attribNameEndAt
        }; ${`\u001b[${33}m${`attrib.attribName`}\u001b[${39}m`} = ${JSON.stringify(
          attrib.attribName,
          null,
          0
        )}`
      );
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
      console.log(`1042 inside catch the tag attribute name start clauses`);
      attrib.attribStart = i;
      attrib.attribNameStartAt = i;
      console.log(
        `1046 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribStart`}\u001b[${39}m`} = ${
          attrib.attribStart
        }; ${`\u001b[${33}m${`attrib.attribNameStartAt`}\u001b[${39}m`} = ${
          attrib.attribNameStartAt
        }`
      );
    }

    // Catch the end of a tag value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "html" &&
      isNum(attrib.attribValueStartAt) &&
      i > attrib.attribValueStartAt &&
      attrib.attribValueEndAt === null
    ) {
      if (`'"`.includes(str[i])) {
        if (str[attrib.attribOpeningQuoteAt] === str[i]) {
          console.log(`1066 opening and closing quotes matched!`);
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
          attrib.attribEnd = i + 1;
          console.log(
            `1072 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
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
          token.attribs.push(Object.assign({}, attrib));
          attribReset();
        }
      }
    }

    // Catch the start of a tag value:
    // -------------------------------------------------------------------------

    if (
      !doNothing &&
      token.type === "html" &&
      !isNum(attrib.attribValueStartAt) &&
      isNum(attrib.attribNameEndAt) &&
      attrib.attribNameEndAt <= i &&
      str[i].trim().length
    ) {
      if (str[i] === "=" && !`'"`.includes(str[right(str, i)])) {
        attrib.attribValueStartAt = right(str, i);
        console.log(
          `1104 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartAt
          }`
        );
      } else if (`'"`.includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartAt = i + 1;
        }
        console.log(
          `1114 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
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
    //                    BOTTOM
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
    // ping charCb
    // -------------------------------------------------------------------------

    if (charCb) {
      console.log(
        `1145 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
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
        0
      )}${
        attrib.attribStart !== null
          ? `\n██ attrib: ${JSON.stringify(attrib, null, 0)}`
          : ""
      }${
        layers.length ? `\n██ layers: ${JSON.stringify(layers, null, 0)}` : ""
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
