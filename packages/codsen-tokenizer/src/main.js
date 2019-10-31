import isObj from "lodash.isplainobject";
// import { left, right } from "string-left-right";
import { matchRight } from "string-match-left-right";
import isTagOpening from "is-html-tag-opening";

// const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}

// function isLetter(something) {
//   return (
//     typeof something === "string" &&
//     something.toUpperCase() !== something.toLowerCase()
//   );
// }

const defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

// contains all common templating language head/tail marker characters:
const espChars = `{}%-$_()*|`;

// it flips all brackets backwards and puts characters in the opposite order
function flipEspTag(str) {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}

function tokenizer(str, cb, originalOpts) {
  // INSURANCE
  // ---------------------------------------------------------------------------
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `html-crush: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (typeof cb !== "function") {
    throw new Error(
      `html-crush: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ${typeof cb}, equal to ${JSON.stringify(
        cb,
        null,
        4
      )}`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `html-crush: [THROW_ID_04] the third input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // VARS
  // ---------------------------------------------------------------------------
  const opts = Object.assign({}, defaults, originalOpts);
  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing; // normally set to a number, index until to do nothing

  // when we compile the token, we fill this object:
  let token = {};
  const tokenDefault = {
    type: null, // html, css, js, text, esp
    start: null,
    end: null,
    tail: null, // used to store the guessed ESP token's/tag's tail
    kind: null
  };
  function tokenReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    token = Object.assign({}, tokenDefault);
  }
  // PS. we need this contraption in order to keep a single source of truth
  // of the token format - we'll improve and change the format of the default
  // object throughout the releases - it's best when its format comes from single
  // place, in this case, "tokenDefault".

  // Initial reset:
  tokenReset();

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
      console.log(`151 wholeEspTagLump = ${wholeEspTagLump}`);
      // match
      // every character from the last "layers" complex-type entry must be
      // present in the extracted lump
      return layers[layers.length - 1].value
        .split("")
        .every(char => wholeEspTagLump.includes(char));
    }
  }

  // INNER FUNCTIONS
  // ---------------------------------------------------------------------------

  function pingcb(incomingToken) {
    console.log(`165 PING cb() with ${JSON.stringify(incomingToken, null, 4)}`);
    cb(incomingToken);
    // reset
    tokenReset();
  }

  function dumpCurrentToken(token, i) {
    // if a token is already being recorded, end it
    if (token.start !== null) {
      token.end = i;
      console.log(
        `176 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        }; then PING CB()`
      );
      pingcb(token);
    }
  }

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
    // ███████████████████████████████████████
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // Progress:
    // ███████████████████████████████████████
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
          opts.reportProgressFuncFrom + Math.floor(i / len);

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
          console.log(`229 DONE ${currentPercentageDone}%`);
        }
      }
    }

    // turn off doNothing if marker passed
    // ███████████████████████████████████████

    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log(`239 TURN OFF doNothing`);
    }

    if (token.end && token.end === i) {
      // if value was captured from the past, push it now
      console.log(`244 call dumpCurrentToken()`);
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
    // ███████████████████████████████████████
    if (
      !doNothing &&
      ["html"].includes(token.type) &&
      [`"`, `'`].includes(str[i])
    ) {
      if (matchLayerLast(str, i)) {
        // maybe it's the closing counterpart?
        layers.pop();
        console.log(`268 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
        console.log(
          `270 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
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
          `289 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            {
              type: "simple",
              value: str[i]
            },
            null,
            4
          )}`
        );
        console.log(
          `299 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
      }
    }

    // catch the beginning of a token
    // ███████████████████████████████████████
    if (!doNothing) {
      console.log(`311, layers.length=${layers.length}`);
      if (
        !layers.length &&
        str[i] === "<" &&
        (isTagOpening(str, i) ||
          matchRight(str, i, ["!--", "!doctype", "?xml"], { i: true }))
      ) {
        dumpCurrentToken(token, i);

        token.start = i;
        token.type = "html";
        console.log(
          `325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );
        if (matchRight(str, i, "!--")) {
          token.kind = "comment";
          console.log(
            `332 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (matchRight(str, i, "!doctype", { i: true })) {
          token.kind = "doctype";
          console.log(
            `339 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (matchRight(str, i, "?xml", { i: true })) {
          token.kind = "xml";
          console.log(
            `346 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
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
        console.log(`358 ESP tag detected`);
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
          `373 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wholeEspTagLump = ${wholeEspTagLump}`
        );
        console.log(
          `376 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );

        if (!["html", "esp"].includes(token.type)) {
          console.log("384");
          dumpCurrentToken(token, i);

          token.start = i;
          token.type = "esp";
          console.log(
            `390 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
          doNothing = i + wholeEspTagLump.length;
          console.log(
            `396 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
          token.tail = flipEspTag(wholeEspTagLump);
          console.log(
            `400 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tail`}\u001b[${39}m`} = ${
              token.tail
            }`
          );
        } else if (token.type === "html") {
          console.log("405");
          // maybe it's closing part of a set?
          if (matchLayerLast(str, i)) {
            layers.pop();
            console.log(`409 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            console.log(`411 ESP tag within HTML tag`);
            layers.push({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            });
            console.log(
              `417 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "esp",
                  value: flipEspTag(wholeEspTagLump)
                },
                null,
                4
              )}`
            );
            console.log(
              `427 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );
          }
        } else {
          console.log("435");
        }
      } else if (token.start === null || token.end === i) {
        if (token.end) {
          console.log(`439 PING CB()`);
          pingcb(token);
        }

        // finally, the last default type is "text"
        token.start = i;
        console.log(
          `446 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }`
        );
        token.type = "text";
        console.log(
          `452 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
            token.type
          }`
        );
      }

      // END OF if (!doNothing)
    }

    // catch the ending of a token
    // ███████████████████████████████████████
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log(
          `467 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        console.log(`477 POSSIBLE ESP TAILS`);
        // extract the whole lump of ESP tag characters:
        let wholeEspTagClosing = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[y];
          } else {
            break;
          }
        }
        console.log(`487 wholeEspTagClosing = ${wholeEspTagClosing}`);

        token.end = i + wholeEspTagClosing.length;
        console.log(
          `491 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
        doNothing = i + wholeEspTagClosing.length;
        console.log(
          `497 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
        );
      }
      // END OF if (!doNothing)
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

    // catch end of the string
    // ███████████████████████████████████████
    // notice there's no "doNothing"
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingcb(token);
    }

    // logging:
    // ███████████████████████████████████████
    console.log(
      `${`\u001b[${90}m${`==========================================\ntoken: ${JSON.stringify(
        token,
        null,
        0
      )}${
        layers.length ? `\nlayers: ${JSON.stringify(layers, null, 0)}` : ""
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
