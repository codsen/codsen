import { tokenizer } from "codsen-tokenizer";
import { collapse } from "string-collapse-white-space";
import { rApply } from "ranges-apply";
import { detectLang } from "detect-templating-language";
import { defaultOpts, Opts, ApplicableOpts, Res } from "./util";
import { version as v } from "../package.json";
const version: string = v;
import { Range } from "../../../scripts/common";

// return function is in single place to ensure no
// discrepancies in API when returning from multiple places
function returnHelper(
  result: string,
  applicableOpts: ApplicableOpts,
  templatingLang: { name: null | string },
  start: number
) {
  /* istanbul ignore next */
  if (arguments.length !== 4) {
    throw new Error(
      `stristri/returnHelper(): should be 3 input args but ${arguments.length} were given!`
    );
  }
  /* istanbul ignore next */
  if (typeof result !== "string") {
    throw new Error("stristri/returnHelper(): first arg missing!");
  }
  /* istanbul ignore next */
  if (typeof applicableOpts !== "object") {
    throw new Error("stristri/returnHelper(): second arg missing!");
  }
  console.log(
    `033 ${`\u001b[${33}m${`RETURN`}\u001b[${39}m`} = ${JSON.stringify(
      {
        result,
        applicableOpts,
      },
      null,
      4
    )}`
  );
  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
    },
    result,
    applicableOpts,
    templatingLang,
  };
}

/**
 * Extracts or deletes HTML, CSS, text and/or templating tags from string
 */
function stri(input: string, originalOpts?: Partial<Opts>): Res {
  const start = Date.now();
  console.log(
    `058 ${`\u001b[${32}m${`INITIAL`}\u001b[${39}m`} ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
      input,
      null,
      4
    )}`
  );

  // insurance
  if (typeof input !== "string") {
    throw new Error(
      `stristri: [THROW_ID_01] the first input arg must be string! It was given as ${JSON.stringify(
        input,
        null,
        4
      )} (${typeof input})`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as ${JSON.stringify(
        originalOpts,
        null,
        4
      )} (${typeof originalOpts})`
    );
  }

  const opts = {
    ...defaultOpts,
    ...originalOpts,
  };
  console.log(
    `090 ${`\u001b[${32}m${`INITIAL`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // Prepare blank applicable opts object, extract all bool keys,
  // anticipate that there will be non-bool values in the future.
  const applicableOpts: ApplicableOpts = {
    html: false,
    css: false,
    text: false,
    js: false,
    templatingTags: false,
  };
  console.log(
    `107 ${`\u001b[${32}m${`INITIAL`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts`}\u001b[${39}m`} = ${JSON.stringify(
      applicableOpts,
      null,
      4
    )}`
  );

  // quick ending
  if (!input) {
    console.log(`116 quick ending, empty input`);
    returnHelper("", applicableOpts, detectLang(input), start);
  }

  const gatheredRanges: Range[] = [];

  // comments like CSS comment
  // /* some text */
  // come as minimum 3 tokens,
  // in case above we've got
  // token type = comment (opening /*), token type = text, token type = comment (closing */)
  // we need to treat the contents text tokens as either HTML or CSS, not as "text"

  let withinHTMLComment = false; // used for children nodes of XML or HTML comment tags
  let withinXML = false; // used for children nodes of XML or HTML comment tags
  let withinCSS = false;
  let withinScript = false;

  tokenizer(input, {
    tagCb: (token) => {
      console.log(`${`\u001b[${36}m${`-`.repeat(80)}\u001b[${39}m`}`);
      console.log(
        `${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
      /* istanbul ignore else */
      if (token.type === "comment") {
        console.log(`146 ${`\u001b[${35}m${`COMMENT TOKEN`}\u001b[${39}m`}`);
        if (withinCSS) {
          if (!applicableOpts.css) {
            applicableOpts.css = true;
            console.log(
              `151 ${`\u001b[${33}m${`applicableOpts.css`}\u001b[${39}m`} = ${JSON.stringify(
                applicableOpts.css,
                null,
                4
              )}`
            );
          }
          if (opts.css) {
            gatheredRanges.push([token.start, token.end, " "]);
            console.log(`160 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          }
        } else {
          // it's HTML comment
          if (!applicableOpts.html) {
            applicableOpts.html = true;
            console.log(
              `167 ${`\u001b[${33}m${`applicableOpts.html`}\u001b[${39}m`} = ${JSON.stringify(
                applicableOpts.html,
                null,
                4
              )}`
            );
          }
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinHTMLComment = true;
            console.log(
              `177 ${`\u001b[${33}m${`withinHTMLComment`}\u001b[${39}m`} = ${withinHTMLComment}`
            );
          } else if (token.closing && withinHTMLComment) {
            withinHTMLComment = false;
            console.log(
              `182 ${`\u001b[${33}m${`withinHTMLComment`}\u001b[${39}m`} = ${withinHTMLComment}`
            );
          }
          if (opts.html) {
            gatheredRanges.push([token.start, token.end, " "]);
            console.log(`187 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          }
        }
      } else if (token.type === "tag") {
        console.log(`191 ${`\u001b[${35}m${`TAG TOKEN`}\u001b[${39}m`}`);
        // mark applicable opts
        if (!applicableOpts.html) {
          applicableOpts.html = true;
          console.log(
            `196 ${`\u001b[${33}m${`applicableOpts.html`}\u001b[${39}m`} = ${
              applicableOpts.html
            }`
          );
        }
        if (opts.html) {
          gatheredRanges.push([token.start, token.end, " "]);
          console.log(`203 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        }
        if (token.tagName === "style" && !token.closing) {
          withinCSS = true;
          console.log(
            `208 ${`\u001b[${33}m${`withinCSS`}\u001b[${39}m`} = ${withinCSS}`
          );
        } else if (
          // closing CSS comment '*/' is met
          withinCSS &&
          token.tagName === "style" &&
          token.closing
        ) {
          withinCSS = false;
          console.log(
            `218 ${`\u001b[${33}m${`withinCSS`}\u001b[${39}m`} = ${withinCSS}`
          );
        }

        if (token.tagName === "xml") {
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinXML = true;
            console.log(
              `226 ${`\u001b[${33}m${`withinXML`}\u001b[${39}m`} = ${withinXML}`
            );
          } else if (token.closing && withinXML) {
            withinXML = false;
            console.log(
              `231 ${`\u001b[${33}m${`withinXML`}\u001b[${39}m`} = ${withinXML}`
            );
          }
        }

        if (token.tagName === "script" && !token.closing) {
          withinScript = true;
          console.log(
            `239 ${`\u001b[${33}m${`withinScript`}\u001b[${39}m`} = ${withinScript}`
          );
        } else if (
          withinScript &&
          token.tagName === "script" &&
          token.closing
        ) {
          withinScript = false;
          console.log(
            `248 ${`\u001b[${33}m${`withinScript`}\u001b[${39}m`} = ${withinScript}`
          );
        }
      } else if (["at", "rule"].includes(token.type)) {
        console.log(`252 ${`\u001b[${35}m${`AT/RULE TOKEN`}\u001b[${39}m`}`);
        // mark applicable opts
        if (!applicableOpts.css) {
          applicableOpts.css = true;
          console.log(
            `257 ${`\u001b[${33}m${`applicableOpts.css`}\u001b[${39}m`} = ${
              applicableOpts.css
            }`
          );
        }
        if (opts.css) {
          gatheredRanges.push([token.start, token.end, " "]);
          console.log(`264 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        }
      } else if (token.type === "text") {
        console.log(`267 ${`\u001b[${35}m${`TEXT TOKEN`}\u001b[${39}m`}`);
        // mark applicable opts
        if (withinScript) {
          applicableOpts.js = true;
          console.log(
            `272 ${`\u001b[${33}m${`applicableOpts.js`}\u001b[${39}m`} = ${
              applicableOpts.js
            }`
          );
        } else if (
          !withinCSS &&
          !withinHTMLComment &&
          !withinXML &&
          !applicableOpts.text &&
          token.value.trim()
        ) {
          applicableOpts.text = true;
          console.log(
            `285 ${`\u001b[${33}m${`applicableOpts.text`}\u001b[${39}m`} = ${
              applicableOpts.text
            }`
          );
        }
        if (
          (withinCSS && opts.css) ||
          (withinScript && opts.js) ||
          (withinHTMLComment && opts.html) ||
          (!withinCSS &&
            !withinHTMLComment &&
            !withinXML &&
            !withinScript &&
            opts.text)
        ) {
          if (withinScript) {
            gatheredRanges.push([token.start, token.end]);
            console.log(`302 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          } else if (token.value.includes("\n")) {
            gatheredRanges.push([token.start, token.end, "\n"]);
            console.log(`305 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          } else {
            gatheredRanges.push([token.start, token.end, " "]);
            console.log(`308 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          }
        }
      } else if (token.type === "esp") {
        console.log(`312 ${`\u001b[${35}m${`ESP TOKEN`}\u001b[${39}m`}`);
        // mark applicable opts
        if (!applicableOpts.templatingTags) {
          applicableOpts.templatingTags = true;
          console.log(
            `317 ${`\u001b[${33}m${`applicableOpts.templatingTags`}\u001b[${39}m`} = ${JSON.stringify(
              applicableOpts.templatingTags,
              null,
              4
            )}`
          );
        }
        if (opts.templatingTags) {
          gatheredRanges.push([token.start, token.end, " "]);
          console.log(`326 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        }
      }

      console.log(`${`\u001b[${90}m${`----------------------`}\u001b[${39}m`}`);
      console.log(
        `${`\u001b[${90}m${`withinScript = ${withinScript}`}\u001b[${39}m`}`
      );
    },
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo * 0.95, // leave the last 5% for collapsing etc.
  });

  console.log(
    `341 ${`\u001b[${32}m${`END`}\u001b[${39}m`} ${`\u001b[${33}m${`gatheredRanges`}\u001b[${39}m`} = ${JSON.stringify(
      gatheredRanges,
      null,
      4
    )}`
  );

  return returnHelper(
    collapse(rApply(input, gatheredRanges), {
      trimLines: true,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1,
    }).result,
    applicableOpts,
    detectLang(input),
    start
  );
}

export { stri, defaultOpts as defaults, version };
