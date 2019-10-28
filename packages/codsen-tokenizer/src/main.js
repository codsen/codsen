import isObj from "lodash.isplainobject";
import { left, right } from "string-left-right";
import { matchLeft, matchRight, matchRightIncl } from "string-match-left-right";

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}

const defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

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

  // when we compile the token, we fill this object:
  let token = {};
  const tokenDefault = {
    type: null, // html, css, js, text, eol, esp
    start: null,
    end: null
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

  // INNER FUNCTIONS
  // ---------------------------------------------------------------------------

  function pingcb(incomingToken) {
    console.log(`091 PING cb() with ${JSON.stringify(incomingToken, null, 4)}`);
    cb(incomingToken);
    // reset
    tokenReset();
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
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

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
          console.log(`140 DONE ${currentPercentageDone}%`);
        }
      }
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
    if (token.type === "html" && [`"`, `'`].includes(str[i])) {
      if (layers.length && layers[layers.length - 1] === str[i]) {
        // maybe it's the closing counterpart?
        layers.pop();
      } else {
        // it's opening then
        layers.push(str[i]);
      }
    }

    // catch the beginning of a token
    if (str[i] === "<") {
      // if a token is already being recorded, end it
      if (token.start !== null) {
        token.end = i;
        console.log(
          `172 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }; then PING CB()`
        );
        pingcb(token);
      }

      token.start = i;
      token.type = "html";
      console.log(
        `182 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
          token.start
        }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
      );
    } else if (token.start === null || token.end === i) {
      if (token.end) {
        console.log(`188 PING CB()`);
        pingcb(token);
      }

      // finally, the last default type is "text"
      token.start = i;
      console.log(
        `195 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
          token.start
        }`
      );
      token.type = "text";
      console.log(
        `201 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
          token.type
        }`
      );
    }

    // catch the ending of a token
    if (token.type === "html" && !layers.length && str[i] === ">") {
      token.end = i + 1;
      console.log(
        `211 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        }`
      );
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
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingcb(token);
    }

    // logging:
    console.log(
      `${`\u001b[${90}m${`==========================================\ntoken: ${JSON.stringify(
        token,
        null,
        0
      )}${
        layers.length ? JSON.stringify(layers, null, 0) : ""
      }`}\u001b[${39}m`}`
    );
  }
}

// -----------------------------------------------------------------------------

export default tokenizer;
