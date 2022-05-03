import { cparser } from "codsen-parser";
import { Ranges } from "ranges-push";
import { rApply } from "ranges-apply";
import { traverse } from "ast-monkey-traverse-with-lookahead";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;
const htmlCommentRegex = /<!--([\s\S]*?)-->/g;

const ranges = new Ranges();

function isObj(something: unknown): boolean {
  return (
    !!something && typeof something === "object" && !Array.isArray(something)
  );
}

interface Obj {
  [key: string]: any;
}

// the plan is to use defaults on the UI, so export them as first-class citizen
interface Opts {
  cssStylesContent: string;
  alwaysCenter: boolean;
}
const defaults: Opts = {
  cssStylesContent: "",
  alwaysCenter: false,
};

interface Res {
  result: string;
}

/**
 * Visual helper to place templating code around table tags into correct places
 */
function patcher(str: string, opts?: Partial<Opts>): Res {
  // insurance
  // ---------------------------------------------------------------------------

  // if inputs are wrong, just return what was given
  if (typeof str !== "string" || str.length === 0) {
    return { result: str };
  }

  // setup
  // ---------------------------------------------------------------------------

  // clone the defaults, don't mutate the input argument object
  let resolvedOpts = { ...defaults, ...opts };
  if (
    resolvedOpts.cssStylesContent &&
    // if not a string was passed
    (typeof resolvedOpts.cssStylesContent !== "string" ||
      // or it was empty of full of whitespace
      !resolvedOpts.cssStylesContent.trim())
  ) {
    resolvedOpts.cssStylesContent = "";
  }

  DEV &&
    console.log(
      `068 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

  // the bizness
  // ---------------------------------------------------------------------------

  // traversal is done from a callback, same like Array.prototype.forEach()
  // you don't assign anything, as in "const x = traverse(..." -
  // instead, you do the deed inside the callback function
  //

  // ensure that we don't traverse inside comment tokens
  // practically we achieve that by comparing does current path start with
  // and of the known comment token paths:
  let knownCommentTokenPaths: string[] = [];

  DEV &&
    console.log(
      `090 ${`\u001b[${36}m${`COMMENCE THE TRAVERSE`}\u001b[${39}m`}`
    );
  traverse(cparser(str), (token, _val, innerObj) => {
    /* istanbul ignore else */
    if (
      isObj(token) &&
      (token as Obj).type === "comment" &&
      !knownCommentTokenPaths.some((oneOfRecordedPaths) =>
        innerObj.path.startsWith(oneOfRecordedPaths)
      )
    ) {
      knownCommentTokenPaths.push(innerObj.path);
    } else if (
      // tags are always stuck in an array, "root" level is array too
      // ast-monkey reports array elements as "key" and "value" is undefined.
      // if this was object, "key" would be key of key/value pair, "value"
      // would be value of the key/value pair.
      //
      // The tag itself is a plain object:
      isObj(token) &&
      // filter by type and tag name
      (token as Obj).type === "tag" &&
      (token as Obj).tagName === "table" &&
      !knownCommentTokenPaths.some((oneOfKnownCommentPaths) =>
        innerObj.path.startsWith(oneOfKnownCommentPaths)
      ) &&
      // ensure it's not closing, otherwise closing tags will be caught too:
      !(token as Obj).closing &&
      // we wrap either raw text or esp template tag nodes only:
      (token as Obj).children.some((childNodeObj: Obj) =>
        ["text", "esp"].includes(childNodeObj.type)
      )
    ) {
      // so this table does have some text nodes straight inside TABLE tag
      DEV &&
        console.log(
          `126 ${`\u001b[${32}m${`TABLE caught!`}\u001b[${39}m`} Path: ${
            innerObj.path
          }`
        );

      // find out how many TD's are there on TR's that have TD's (if any exist)
      // then, that value, if greater then 1 will be the colspan value -
      // we'll wrap this text node's contents with one TR and one TD - but
      // set TD colspan to this value:
      let colspanVal = 1;

      // if td we decide the colspan contains some attributes, we'll note
      // down the range of where first attrib starts and last attrib ends
      // then slice that range and insert of every td, along the colspan
      let centered = false;

      let firstTrFound: Obj = {};
      if (
        // some TR's exist inside this TABLE tag
        (token as Obj).children.some(
          (childNodeObj: Obj) =>
            childNodeObj.type === "tag" &&
            childNodeObj.tagName === "tr" &&
            !childNodeObj.closing &&
            (firstTrFound = childNodeObj)
        )
      ) {
        DEV && console.log(`153 ${`\u001b[${32}m${`TR`}\u001b[${39}m`} found`);
        // DEV && console.log(
        //   `108 ${`\u001b[${33}m${`firstTrFound`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound,
        //     null,
        //     4
        //   )}`
        // );

        // colspanVal is equal to the count of TD's inside children[] array
        // the only condition - we count consecutive TD's, any ESP or text
        // token breaks the counting

        let count = 0;

        // DEV && console.log(
        //   `132 FILTER ${`\u001b[${33}m${`firstTrFound.children`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound.children,
        //     null,
        //     4
        //   )}`
        // );
        for (
          let i = 0, len = (firstTrFound as any).children.length;
          i < len;
          i++
        ) {
          let obj = (firstTrFound as any).children[i];
          // DEV && console.log(
          //   `141 ---------------- ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
          //     obj,
          //     null,
          //     4
          //   )}`
          // );

          // count consecutive TD's
          if (obj.type === "tag" && obj.tagName === "td") {
            if (!obj.closing) {
              // detect center-alignment
              centered = obj.attribs.some(
                (attrib: Obj) =>
                  (attrib.attribName === "align" &&
                    attrib.attribValueRaw === "center") ||
                  (attrib.attribName === "style" &&
                    /text-align:\s*center/i.test(attrib.attribValueRaw))
              );
              count++;
              if (count > colspanVal) {
                colspanVal = count;
              }
            }
            // else - ignore closing tags
          } else if (
            obj.type !== "text" ||
            obj.value.replace(htmlCommentRegex, "").trim()
          ) {
            // reset
            count = 0;
          }

          // DEV && console.log(
          //   `174 ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
          //     count,
          //     null,
          //     4
          //   )}`
          // );
        }
      }

      DEV &&
        console.log(
          `226 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`colspanVal`}\u001b[${39}m`} = ${JSON.stringify(
            colspanVal,
            null,
            4
          )}`
        );

      //
      //
      //
      //                         T Y P E      I.
      //
      //
      //
      // -----------------------------------------------------------------------------

      DEV && console.log(" ");
      DEV &&
        console.log(
          `245                        ${`\u001b[${35}m${`TYPE I.`}\u001b[${39}m`}`
        );
      DEV && console.log(" ");

      // now filter all "text" type children nodes from this TABLE tag
      // this key below is the table tag we filtered in the beginning
      (token as Obj).children
        // filter out text nodes:
        .filter((childNodeObj: Obj) =>
          ["text", "esp"].includes(childNodeObj.type)
        )
        // wrap each with TR+TD with colspan:
        .forEach((obj: Obj) => {
          DEV &&
            console.log(
              `260 -------------------- ${`\u001b[${32}m${`PROCESSING INSIDE TABLE`}\u001b[${39}m`} --------------------`
            );
          DEV &&
            console.log(
              `264 text node, ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
                obj,
                null,
                4
              )}`
            );
          DEV && console.log(" ");
          DEV &&
            console.log(
              `273 ${
                obj.value.trim()
                  ? `${`\u001b[${32}m${`this one needs wrapping`}\u001b[${39}m`}`
                  : `${`\u001b[${31}m${`this one does not need wrapping`}\u001b[${39}m`}`
              }`
            );
          if (obj.value.replace(htmlCommentRegex, "").trim()) {
            // There will always be whitespace in nicely formatted tags,
            // so ignore text tokens which have values that trim to zero length.
            //
            // Since trimmed value of zero length is already falsey, we don't
            // need to do
            // "if (obj.value.trim().length)" or
            // "if (obj.value.trim() === "")" or
            // "if (obj.value.trim().length === 0)"
            //
            ranges.push(
              obj.start,
              obj.end,
              `\n<tr>\n  <td${
                colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
              }${
                resolvedOpts.alwaysCenter || centered ? ` align="center"` : ""
              }${
                resolvedOpts.cssStylesContent
                  ? ` style="${resolvedOpts.cssStylesContent}"`
                  : ""
              }>\n    ${obj.value.trim()}\n  </td>\n</tr>\n`
            );
          }
        });

      //
      //
      //
      //                         T Y P E      II.
      //
      //
      //
      // -----------------------------------------------------------------------------

      DEV && console.log(" ");
      DEV &&
        console.log(
          `317                        ${`\u001b[${35}m${`TYPE II.`}\u001b[${39}m`}`
        );
      DEV && console.log(" ");

      (token as Obj).children
        // filter out text nodes:
        .filter(
          (obj: Obj) =>
            obj.type === "tag" && obj.tagName === "tr" && !obj.closing
        )
        .forEach((trTag: Obj) => {
          // DEV && console.log(
          //   `224 ██ ${`\u001b[${33}m${`trTag`}\u001b[${39}m`} = ${JSON.stringify(
          //     trTag,
          //     null,
          //     4
          //   )}`
          // );

          // we use for loop because we need to look back, what token was
          // before, plus filter

          let doNothing = false;
          for (let i = 0, len = trTag.children.length; i < len; i++) {
            DEV &&
              console.log(
                `343 -------------------- ${`\u001b[${32}m${`PROCESSING INSIDE TR`}\u001b[${39}m`} --------------------`
              );
            let childNodeObj = trTag.children[i];

            // deactivate
            if (
              doNothing &&
              childNodeObj.type === "comment" &&
              childNodeObj.closing
            ) {
              doNothing = false;
              continue;
            }

            // if a child node is opening comment node, activate doNothing
            // until closing counterpart is found
            if (
              !doNothing &&
              childNodeObj.type === "comment" &&
              !childNodeObj.closing
            ) {
              doNothing = true;
            }

            if (
              !doNothing &&
              ["text", "esp"].includes(childNodeObj.type) &&
              childNodeObj.value.trim()
            ) {
              DEV &&
                console.log(
                  `374 ██ ${`\u001b[${33}m${`childNodeObj`}\u001b[${39}m`} = ${JSON.stringify(
                    childNodeObj,
                    null,
                    4
                  )}`
                );

              DEV && console.log(" ");
              DEV &&
                console.log(
                  `384 ${
                    childNodeObj.value.trim()
                      ? `${`\u001b[${32}m${`this one needs wrapping`}\u001b[${39}m`}`
                      : `${`\u001b[${31}m${`this one does not need wrapping`}\u001b[${39}m`}`
                  }`
                );
              if (childNodeObj.value.trim()) {
                // There will always be whitespace in nicely formatted tags,
                // so ignore text tokens which have values that trim to zero length.

                DEV &&
                  console.log(
                    `396 ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
                      i,
                      null,
                      4
                    )}`
                  );

                if (!i) {
                  DEV &&
                    console.log(`405 it's the first element, so TR is behind`);
                  ranges.push(
                    childNodeObj.start,
                    childNodeObj.end,
                    `\n  <td${
                      colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
                    }${
                      resolvedOpts.alwaysCenter || centered
                        ? ` align="center"`
                        : ""
                    }${
                      resolvedOpts.cssStylesContent
                        ? ` style="${resolvedOpts.cssStylesContent}"`
                        : ""
                    }>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`
                  );
                } else if (i && len > 1 && i === len - 1) {
                  DEV &&
                    console.log(
                      `424 it's the last element, closing TR is next`
                    );
                  ranges.push(
                    childNodeObj.start,
                    childNodeObj.end,
                    `\n</tr>\n<tr>\n  <td${
                      colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
                    }${
                      resolvedOpts.alwaysCenter || centered
                        ? ` align="center"`
                        : ""
                    }${
                      resolvedOpts.cssStylesContent
                        ? ` style="${resolvedOpts.cssStylesContent}"`
                        : ""
                    }>\n    ${childNodeObj.value.trim()}\n  </td>\n`
                  );
                } else {
                  DEV && console.log(`442 the previous tag was TD`);
                  ranges.push(
                    childNodeObj.start,
                    childNodeObj.end,
                    `\n</tr>\n<tr>\n  <td${
                      colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
                    }${
                      resolvedOpts.alwaysCenter || centered
                        ? ` align="center"`
                        : ""
                    }${
                      resolvedOpts.cssStylesContent
                        ? ` style="${resolvedOpts.cssStylesContent}"`
                        : ""
                    }>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`
                  );
                }
              }
            }
          }
        });

      DEV &&
        console.log(
          `466 ---------------------------- ${`\u001b[${32}m${`DONE`}\u001b[${39}m`} ----------------------------`
        );
    }
  });

  DEV &&
    console.log(
      `473 after traversal, ${`\u001b[${33}m${`knownCommentTokenPaths`}\u001b[${39}m`} = ${JSON.stringify(
        knownCommentTokenPaths,
        null,
        4
      )}`
    );

  DEV && console.log(" ");
  DEV && console.log(`481 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`);

  if (ranges.current()) {
    let result = rApply(str, ranges.current());
    ranges.wipe();
    DEV &&
      console.log(
        `488 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${result}`
      );
    return { result };
  }

  return { result: str };
}

export { patcher, defaults, version };
