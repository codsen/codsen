import tokenizer from "codsen-tokenizer";
import pathNext from "./util/pathNext";
import pathUp from "./util/pathUp";
import op from "object-path";

const tagsThatNest = [
  "a",
  "b",
  "div",
  "em",
  "i",
  "span",
  "strong",
  "table",
  "td",
  "tr"
];

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

function cparser(str, originalOpts) {
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
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
    tagCb: null,
    charCb: null
  };
  const opts = Object.assign({}, defaults, originalOpts);

  //
  //
  //
  //
  //
  //
  //
  // ACTION
  // ---------------------------------------------------------------------------

  const res = [];

  // this flag is used to give notice
  // we use object-path notation
  // (https://www.npmjs.com/package/object-path)
  // outer container is array so starting path is zero.
  // object-path notation differs from normal js notation
  // in that array paths are with digits, a.2 not a[2]
  // which means, object keys can't have digit-only names.
  // The benefit of this notation is that it's consistent -
  // all the levels are joined with a dot, there are no brackets.
  let path;

  let nestNext = false;

  // Call codsen-tokenizer. It works through callbacks,
  // pinging each token to the function you give, opts.tagCb
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCb: tokenObj => {
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //              TAG CALLBACK STARTS
      //
      //
      //
      //
      //
      //
      //
      //

      console.log(`-`.repeat(100));
      console.log(
        `171 ██ ${`\u001b[${33}m${`INCOMING TOKEN`}\u001b[${39}m`}:\n${JSON.stringify(
          {
            type: tokenObj.type,
            tagName: tokenObj.tagName,
            start: tokenObj.start,
            end: tokenObj.end
          },
          null,
          4
        )}`
      );
      // pass the token to the 3rd parties through opts.tagCb
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }

      // consume the token ourselves
      // tokenizer does not build AST's so there is no
      // "children" key reported on each node. However,
      // here we do build AST's and while some tokens might
      // not have children tokens or can't (text nodes),
      // for consistency we will add children key with
      // an empty array value to each token in AST.

      // recalculate the path for this token

      if (nestNext) {
        // 1. reset the flag
        nestNext = false;

        // 2. go deeper
        // "1.children.3" -> "1.children.3.children.0"
        console.log(`203 ${`\u001b[${35}m${`██ NEST`}\u001b[${39}m`}`);
        path = `${path}.children.0`;
      } else if (
        tokenObj.type === "html" &&
        tokenObj.closing &&
        path.includes(".")
      ) {
        // goes up and then bumps,
        // "1.children.3" -> "2"
        console.log(`212 ${`\u001b[${35}m${`██ UP`}\u001b[${39}m`}`);
        path = pathNext(pathUp(path));

        // but check, does this closing tag have an
        // opening counterpart
        //
      } else if (!path) {
        // it's the first element - push the token into index 0
        console.log(`220 ${`\u001b[${35}m${`██ FIRST`}\u001b[${39}m`}`);
        path = "0";
      } else {
        // bumps the index,
        // "1.children.3" -> "1.children.4"
        console.log(`225 ${`\u001b[${35}m${`██ BUMP`}\u001b[${39}m`}`);
        path = pathNext(path);
      }

      // activate the nestNext
      if (
        tokenObj.type === "html" &&
        tagsThatNest.includes(tokenObj.tagName) &&
        !tokenObj.closing
      ) {
        nestNext = true;
      }

      console.log(
        `239 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
      op.set(res, path, Object.assign({ children: [] }, tokenObj));
      console.log(
        `247 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
          res,
          null,
          4
        )}`
      );

      console.log(
        `255 ENDING ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
          path,
          null,
          4
        )}`
      );

      // LOGGING
      console.log(`${`\u001b[${90}m${`---`}\u001b[${39}m`}`);
      console.log(
        `${`\u001b[${90}m${`██ nestNext = ${`\u001b[${
          nestNext ? 32 : 31
        }m${nestNext}\u001b[${39}m`}`}\u001b[${39}m`}`
      );

      //
      //
      //
      //
      //
      //
      //
      //
      //              TAG CALLBACK ENDS
      //
      //
      //
      //
      //
      //
      //
      //
    },
    charCb: opts.charCb
  });
  console.log(`-`.repeat(100));

  console.log(
    `293 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`} ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

// -----------------------------------------------------------------------------

export default cparser;
