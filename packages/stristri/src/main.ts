import { tokenizer } from "codsen-tokenizer";
import { collapse } from "string-collapse-white-space";
import { rApply } from "ranges-apply";
import { detectLang } from "detect-templating-language";
import type { Range } from "../../../ops/typedefs/common";

import { defaultOpts, Opts, ApplicableOpts, Res } from "./util";
import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// return function is in single place to ensure no
// discrepancies in API when returning from multiple places
function returnHelper(
  result: string,
  applicableOpts: ApplicableOpts,
  templatingLang: { name: null | string },
  start: number
): Res {
  /* c8 ignore next */
  if (arguments.length !== 4) {
    throw new Error(
      `stristri/returnHelper(): should be 3 input args but ${arguments.length} were given!`
    );
  }
  /* c8 ignore next */
  if (typeof result !== "string") {
    throw new Error("stristri/returnHelper(): first arg missing!");
  }
  /* c8 ignore next */
  if (typeof applicableOpts !== "object") {
    throw new Error("stristri/returnHelper(): second arg missing!");
  }
  DEV &&
    console.log(
      `038 ${`\u001b[${33}m${`RETURN`}\u001b[${39}m`} = ${JSON.stringify(
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
function stri(input: string, opts?: Partial<Opts>): Res {
  let start = Date.now();
  DEV &&
    console.log(
      `064 ${`\u001b[${32}m${`INITIAL`}\u001b[${39}m`} ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
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
  if (opts && typeof opts !== "object") {
    throw new Error(
      `stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as ${JSON.stringify(
        opts,
        null,
        4
      )} (${typeof opts})`
    );
  }

  let resolvedOpts = {
    ...defaultOpts,
    ...opts,
  };
  DEV &&
    console.log(
      `097 ${`\u001b[${32}m${`INITIAL`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

  // Prepare blank applicable resolvedOpts object, extract all bool keys,
  // anticipate that there will be non-bool values in the future.
  let applicableOpts: ApplicableOpts = {
    html: false,
    css: false,
    text: false,
    js: false,
    templatingTags: false,
  };
  DEV &&
    console.log(
      `115 ${`\u001b[${32}m${`INITIAL`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts`}\u001b[${39}m`} = ${JSON.stringify(
        applicableOpts,
        null,
        4
      )}`
    );

  // quick ending
  if (!input) {
    DEV && console.log(`124 quick ending, empty input`);
    returnHelper("", applicableOpts, detectLang(input), start);
  }

  let gatheredRanges: Range[] = [];

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
      DEV && console.log(`${`\u001b[${36}m${`-`.repeat(80)}\u001b[${39}m`}`);
      DEV &&
        console.log(
          `${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )}`
        );
      /* c8 ignore next */
      if (token.type === "comment") {
        DEV &&
          console.log(`156 ${`\u001b[${35}m${`COMMENT TOKEN`}\u001b[${39}m`}`);
        if (withinCSS) {
          if (!applicableOpts.css) {
            applicableOpts.css = true;
            DEV &&
              console.log(
                `162 ${`\u001b[${33}m${`applicableOpts.css`}\u001b[${39}m`} = ${JSON.stringify(
                  applicableOpts.css,
                  null,
                  4
                )}`
              );
          }
          if (resolvedOpts.css) {
            gatheredRanges.push([token.start, token.end, " "]);
            DEV && console.log(`171 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          }
        } else {
          // it's HTML comment
          if (!applicableOpts.html) {
            applicableOpts.html = true;
            DEV &&
              console.log(
                `179 ${`\u001b[${33}m${`applicableOpts.html`}\u001b[${39}m`} = ${JSON.stringify(
                  applicableOpts.html,
                  null,
                  4
                )}`
              );
          }
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinHTMLComment = true;
            DEV &&
              console.log(
                `190 ${`\u001b[${33}m${`withinHTMLComment`}\u001b[${39}m`} = ${withinHTMLComment}`
              );
          } else if (token.closing && withinHTMLComment) {
            withinHTMLComment = false;
            DEV &&
              console.log(
                `196 ${`\u001b[${33}m${`withinHTMLComment`}\u001b[${39}m`} = ${withinHTMLComment}`
              );
          }
          if (resolvedOpts.html) {
            gatheredRanges.push([token.start, token.end, " "]);
            DEV && console.log(`201 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          }
        }
      } else if (token.type === "tag") {
        DEV && console.log(`205 ${`\u001b[${35}m${`TAG TOKEN`}\u001b[${39}m`}`);
        // mark applicable resolvedOpts
        if (!applicableOpts.html) {
          applicableOpts.html = true;
          DEV &&
            console.log(
              `211 ${`\u001b[${33}m${`applicableOpts.html`}\u001b[${39}m`} = ${
                applicableOpts.html
              }`
            );
        }
        if (resolvedOpts.html) {
          gatheredRanges.push([token.start, token.end, " "]);
          DEV && console.log(`218 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        }
        if (token.tagName === "style" && !token.closing) {
          withinCSS = true;
          DEV &&
            console.log(
              `224 ${`\u001b[${33}m${`withinCSS`}\u001b[${39}m`} = ${withinCSS}`
            );
        } else if (
          // closing CSS comment '*/' is met
          withinCSS &&
          token.tagName === "style" &&
          token.closing
        ) {
          withinCSS = false;
          DEV &&
            console.log(
              `235 ${`\u001b[${33}m${`withinCSS`}\u001b[${39}m`} = ${withinCSS}`
            );
        }

        if (token.tagName === "xml") {
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinXML = true;
            DEV &&
              console.log(
                `244 ${`\u001b[${33}m${`withinXML`}\u001b[${39}m`} = ${withinXML}`
              );
          } else if (token.closing && withinXML) {
            withinXML = false;
            DEV &&
              console.log(
                `250 ${`\u001b[${33}m${`withinXML`}\u001b[${39}m`} = ${withinXML}`
              );
          }
        }

        if (token.tagName === "script" && !token.closing) {
          withinScript = true;
          DEV &&
            console.log(
              `259 ${`\u001b[${33}m${`withinScript`}\u001b[${39}m`} = ${withinScript}`
            );
        } else if (
          withinScript &&
          token.tagName === "script" &&
          token.closing
        ) {
          withinScript = false;
          DEV &&
            console.log(
              `269 ${`\u001b[${33}m${`withinScript`}\u001b[${39}m`} = ${withinScript}`
            );
        }
      } else if (["at", "rule"].includes(token.type)) {
        DEV &&
          console.log(`274 ${`\u001b[${35}m${`AT/RULE TOKEN`}\u001b[${39}m`}`);
        // mark applicable resolvedOpts
        if (!applicableOpts.css) {
          applicableOpts.css = true;
          DEV &&
            console.log(
              `280 ${`\u001b[${33}m${`applicableOpts.css`}\u001b[${39}m`} = ${
                applicableOpts.css
              }`
            );
        }
        if (resolvedOpts.css) {
          gatheredRanges.push([token.start, token.end, " "]);
          DEV && console.log(`287 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        }
      } else if (token.type === "text") {
        DEV &&
          console.log(`291 ${`\u001b[${35}m${`TEXT TOKEN`}\u001b[${39}m`}`);
        // mark applicable resolvedOpts
        if (withinScript) {
          applicableOpts.js = true;
          DEV &&
            console.log(
              `297 ${`\u001b[${33}m${`applicableOpts.js`}\u001b[${39}m`} = ${
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
          DEV &&
            console.log(
              `311 ${`\u001b[${33}m${`applicableOpts.text`}\u001b[${39}m`} = ${
                applicableOpts.text
              }`
            );
        }
        if (
          (withinCSS && resolvedOpts.css) ||
          (withinScript && resolvedOpts.js) ||
          (withinHTMLComment && resolvedOpts.html) ||
          (!withinCSS &&
            !withinHTMLComment &&
            !withinXML &&
            !withinScript &&
            resolvedOpts.text)
        ) {
          if (withinScript) {
            gatheredRanges.push([token.start, token.end]);
            DEV && console.log(`328 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          } else if (token.value.includes("\n")) {
            gatheredRanges.push([token.start, token.end, "\n"]);
            DEV && console.log(`331 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          } else {
            gatheredRanges.push([token.start, token.end, " "]);
            DEV && console.log(`334 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          }
        }
      } else if (token.type === "esp") {
        DEV && console.log(`338 ${`\u001b[${35}m${`ESP TOKEN`}\u001b[${39}m`}`);
        // mark applicable resolvedOpts
        if (!applicableOpts.templatingTags) {
          applicableOpts.templatingTags = true;
          DEV &&
            console.log(
              `344 ${`\u001b[${33}m${`applicableOpts.templatingTags`}\u001b[${39}m`} = ${JSON.stringify(
                applicableOpts.templatingTags,
                null,
                4
              )}`
            );
        }
        if (resolvedOpts.templatingTags) {
          gatheredRanges.push([token.start, token.end, " "]);
          DEV && console.log(`353 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        }
      }

      DEV &&
        console.log(
          `${`\u001b[${90}m${`----------------------`}\u001b[${39}m`}`
        );
      DEV &&
        console.log(
          `${`\u001b[${90}m${`withinScript = ${withinScript}`}\u001b[${39}m`}`
        );
    },
    reportProgressFunc: resolvedOpts.reportProgressFunc,
    reportProgressFuncFrom: resolvedOpts.reportProgressFuncFrom,
    reportProgressFuncTo: resolvedOpts.reportProgressFuncTo * 0.95, // leave the last 5% for collapsing etc.
  });

  DEV &&
    console.log(
      `373 ${`\u001b[${32}m${`END`}\u001b[${39}m`} ${`\u001b[${33}m${`gatheredRanges`}\u001b[${39}m`} = ${JSON.stringify(
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
