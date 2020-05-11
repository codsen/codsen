/* eslint no-return-assign: 0 */

import parser from "codsen-parser";
import Ranges from "ranges-push";
import apply from "ranges-apply";
import traverse from "ast-monkey-traverse-with-lookahead";
import htmlCommentRegex from "html-comment-regex";
import { version } from "../package.json";

const ranges = new Ranges();

function isStr(something) {
  return typeof something === "string";
}
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

// the plan is to use defaults on the UI, so export them as first-class citizen
const defaults = {
  cssStylesContent: "",
  alwaysCenter: false,
};

function patcher(str, generalOpts) {
  // insurance
  // ---------------------------------------------------------------------------

  // if inputs are wrong, just return what was given
  if (typeof str !== "string" || str.length === 0) {
    return { result: str };
  }

  // setup
  // ---------------------------------------------------------------------------

  // clone the defaults, don't mutate the input argument object
  const opts = { ...defaults, ...generalOpts };
  if (
    opts.cssStylesContent &&
    // if not a string was passed
    (!isStr(opts.cssStylesContent) ||
      // or it was empty of full of whitespace
      !opts.cssStylesContent.trim())
  ) {
    opts.cssStylesContent = "";
  }

  console.log(
    `052 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
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
  const knownCommentTokenPaths = [];

  console.log(`072 ${`\u001b[${36}m${`COMMENCE THE TRAVERSE`}\u001b[${39}m`}`);
  traverse(parser(str), (key, val, innerObj) => {
    /* istanbul ignore else */
    if (
      isObj(key) &&
      key.type === "comment" &&
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
      isObj(key) &&
      // filter by type and tag name
      key.type === "tag" &&
      key.tagName === "table" &&
      !knownCommentTokenPaths.some((oneOfKnownCommentPaths) =>
        innerObj.path.startsWith(oneOfKnownCommentPaths)
      ) &&
      // ensure it's not closing, otherwise closing tags will be caught too:
      !key.closing &&
      // we wrap either raw text or esp template tag nodes only:
      key.children.some((childNodeObj) =>
        ["text", "esp"].includes(childNodeObj.type)
      )
    ) {
      // so this table does have some text nodes straight inside TABLE tag
      console.log(
        `106 ${`\u001b[${32}m${`TABLE caught!`}\u001b[${39}m`} Path: ${
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

      let firstTrFound;
      if (
        // some TR's exist inside this TABLE tag
        key.children.some(
          (childNodeObj) =>
            childNodeObj.type === "tag" &&
            childNodeObj.tagName === "tr" &&
            !childNodeObj.closing &&
            (firstTrFound = childNodeObj)
        )
      ) {
        console.log(`133 ${`\u001b[${32}m${`TR`}\u001b[${39}m`} found`);
        // console.log(
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

        // console.log(
        //   `132 FILTER ${`\u001b[${33}m${`firstTrFound.children`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound.children,
        //     null,
        //     4
        //   )}`
        // );
        for (let i = 0, len = firstTrFound.children.length; i < len; i++) {
          const obj = firstTrFound.children[i];
          // console.log(
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
                (attrib) =>
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

          // console.log(
          //   `174 ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
          //     count,
          //     null,
          //     4
          //   )}`
          // );
        }
      }

      console.log(
        `201 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`colspanVal`}\u001b[${39}m`} = ${JSON.stringify(
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

      console.log(" ");
      console.log(
        `219                        ${`\u001b[${35}m${`TYPE I.`}\u001b[${39}m`}`
      );
      console.log(" ");

      // now filter all "text" type children nodes from this TABLE tag
      // this key below is the table tag we filtered in the beginning
      key.children
        // filter out text nodes:
        .filter((childNodeObj) => ["text", "esp"].includes(childNodeObj.type))
        // wrap each with TR+TD with colspan:
        .forEach((obj) => {
          console.log(
            `231 -------------------- ${`\u001b[${32}m${`PROCESSING INSIDE TABLE`}\u001b[${39}m`} --------------------`
          );
          console.log(
            `234 text node, ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
              obj,
              null,
              4
            )}`
          );
          console.log(" ");
          console.log(
            `242 ${
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
              }${opts.alwaysCenter || centered ? ` align="center"` : ""}${
                opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""
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

      console.log(" ");
      console.log(
        `281                        ${`\u001b[${35}m${`TYPE II.`}\u001b[${39}m`}`
      );
      console.log(" ");

      key.children
        // filter out text nodes:
        .filter(
          (obj) => obj.type === "tag" && obj.tagName === "tr" && !obj.closing
        )
        .forEach((trTag) => {
          // console.log(
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
            console.log(
              `305 -------------------- ${`\u001b[${32}m${`PROCESSING INSIDE TR`}\u001b[${39}m`} --------------------`
            );
            const childNodeObj = trTag.children[i];

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
              console.log(
                `335 ██ ${`\u001b[${33}m${`childNodeObj`}\u001b[${39}m`} = ${JSON.stringify(
                  childNodeObj,
                  null,
                  4
                )}`
              );

              console.log(" ");
              console.log(
                `344 ${
                  childNodeObj.value.trim()
                    ? `${`\u001b[${32}m${`this one needs wrapping`}\u001b[${39}m`}`
                    : `${`\u001b[${31}m${`this one does not need wrapping`}\u001b[${39}m`}`
                }`
              );
              if (childNodeObj.value.trim()) {
                // There will always be whitespace in nicely formatted tags,
                // so ignore text tokens which have values that trim to zero length.

                console.log(
                  `355 ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
                    i,
                    null,
                    4
                  )}`
                );

                if (!i) {
                  console.log(`363 it's the first element, so TR is behind`);
                  ranges.push(
                    childNodeObj.start,
                    childNodeObj.end,
                    `\n  <td${
                      colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
                    }${opts.alwaysCenter || centered ? ` align="center"` : ""}${
                      opts.cssStylesContent
                        ? ` style="${opts.cssStylesContent}"`
                        : ""
                    }>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`
                  );
                } else if (i && len > 1 && i === len - 1) {
                  console.log(`376 it's the last element, closing TR is next`);
                  ranges.push(
                    childNodeObj.start,
                    childNodeObj.end,
                    `\n</tr>\n<tr>\n  <td${
                      colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
                    }${opts.alwaysCenter || centered ? ` align="center"` : ""}${
                      opts.cssStylesContent
                        ? ` style="${opts.cssStylesContent}"`
                        : ""
                    }>\n    ${childNodeObj.value.trim()}\n  </td>\n`
                  );
                } else {
                  console.log(`389 the previous tag was TD`);
                  ranges.push(
                    childNodeObj.start,
                    childNodeObj.end,
                    `\n</tr>\n<tr>\n  <td${
                      colspanVal > 1 ? ` colspan="${colspanVal}"` : ""
                    }${opts.alwaysCenter || centered ? ` align="center"` : ""}${
                      opts.cssStylesContent
                        ? ` style="${opts.cssStylesContent}"`
                        : ""
                    }>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`
                  );
                }
              }
            }
          }
        });

      console.log(
        `408 ---------------------------- ${`\u001b[${32}m${`DONE`}\u001b[${39}m`} ----------------------------`
      );
    }
  });

  console.log(
    `414 after traversal, ${`\u001b[${33}m${`knownCommentTokenPaths`}\u001b[${39}m`} = ${JSON.stringify(
      knownCommentTokenPaths,
      null,
      4
    )}`
  );

  console.log(" ");
  console.log(`422 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`);

  if (ranges.current()) {
    const result = apply(str, ranges.current());
    ranges.wipe();
    console.log(
      `428 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${result}`
    );
    return { result };
  }

  return { result: str };
}

export { patcher, defaults, version };
