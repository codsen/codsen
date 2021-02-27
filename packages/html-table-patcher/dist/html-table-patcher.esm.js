/**
 * html-table-patcher
 * Visual helper to place templating code around table tags into correct places
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-table-patcher/
 */

import { cparser } from 'codsen-parser';
import { Ranges } from 'ranges-push';
import { rApply } from 'ranges-apply';
import { traverse } from 'ast-monkey-traverse-with-lookahead';

var version$1 = "4.0.5";

const version = version$1;
const htmlCommentRegex = /<!--([\s\S]*?)-->/g;
const ranges = new Ranges();

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

const defaults = {
  cssStylesContent: "",
  alwaysCenter: false
};
/**
 * Visual helper to place templating code around table tags into correct places
 */

function patcher(str, generalOpts) {
  // insurance
  // ---------------------------------------------------------------------------
  // if inputs are wrong, just return what was given
  if (typeof str !== "string" || str.length === 0) {
    return {
      result: str
    };
  } // setup
  // ---------------------------------------------------------------------------
  // clone the defaults, don't mutate the input argument object


  const opts = { ...defaults,
    ...generalOpts
  };

  if (opts.cssStylesContent && ( // if not a string was passed
  typeof opts.cssStylesContent !== "string" || // or it was empty of full of whitespace
  !opts.cssStylesContent.trim())) {
    opts.cssStylesContent = "";
  } // the bizness
  // ---------------------------------------------------------------------------
  // traversal is done from a callback, same like Array.prototype.forEach()
  // you don't assign anything, as in "const x = traverse(..." -
  // instead, you do the deed inside the callback function
  //
  // ensure that we don't traverse inside comment tokens
  // practically we achieve that by comparing does current path start with
  // and of the known comment token paths:

  const knownCommentTokenPaths = [];
  traverse(cparser(str), (token, _val, innerObj) => {
    /* istanbul ignore else */
    if (isObj(token) && token.type === "comment" && !knownCommentTokenPaths.some(oneOfRecordedPaths => innerObj.path.startsWith(oneOfRecordedPaths))) {
      knownCommentTokenPaths.push(innerObj.path);
    } else if ( // tags are always stuck in an array, "root" level is array too
    // ast-monkey reports array elements as "key" and "value" is undefined.
    // if this was object, "key" would be key of key/value pair, "value"
    // would be value of the key/value pair.
    //
    // The tag itself is a plain object:
    isObj(token) && // filter by type and tag name
    token.type === "tag" && token.tagName === "table" && !knownCommentTokenPaths.some(oneOfKnownCommentPaths => innerObj.path.startsWith(oneOfKnownCommentPaths)) && // ensure it's not closing, otherwise closing tags will be caught too:
    !token.closing && // we wrap either raw text or esp template tag nodes only:
    token.children.some(childNodeObj => ["text", "esp"].includes(childNodeObj.type))) {
      // so this table does have some text nodes straight inside TABLE tag // find out how many TD's are there on TR's that have TD's (if any exist)
      // then, that value, if greater then 1 will be the colspan value -
      // we'll wrap this text node's contents with one TR and one TD - but
      // set TD colspan to this value:

      let colspanVal = 1; // if td we decide the colspan contains some attributes, we'll note
      // down the range of where first attrib starts and last attrib ends
      // then slice that range and insert of every td, along the colspan

      let centered = false;
      let firstTrFound = {};

      if ( // some TR's exist inside this TABLE tag
      token.children.some(childNodeObj => childNodeObj.type === "tag" && childNodeObj.tagName === "tr" && !childNodeObj.closing && (firstTrFound = childNodeObj))) { // console.log(
        //   `108 ${`\u001b[${33}m${`firstTrFound`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound,
        //     null,
        //     4
        //   )}`
        // );
        // colspanVal is equal to the count of TD's inside children[] array
        // the only condition - we count consecutive TD's, any ESP or text
        // token breaks the counting

        let count = 0; // console.log(
        //   `132 FILTER ${`\u001b[${33}m${`firstTrFound.children`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound.children,
        //     null,
        //     4
        //   )}`
        // );

        for (let i = 0, len = firstTrFound.children.length; i < len; i++) {
          const obj = firstTrFound.children[i]; // console.log(
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
              centered = obj.attribs.some(attrib => attrib.attribName === "align" && attrib.attribValueRaw === "center" || attrib.attribName === "style" && /text-align:\s*center/i.test(attrib.attribValueRaw));
              count++;

              if (count > colspanVal) {
                colspanVal = count;
              }
            } // else - ignore closing tags

          } else if (obj.type !== "text" || obj.value.replace(htmlCommentRegex, "").trim()) {
            // reset
            count = 0;
          } // console.log(
          //   `174 ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
          //     count,
          //     null,
          //     4
          //   )}`
          // );

        }
      } //
      //
      //
      //                         T Y P E      I.
      //
      //
      //
      // ----------------------------------------------------------------------------- // now filter all "text" type children nodes from this TABLE tag
      // this key below is the table tag we filtered in the beginning

      token.children // filter out text nodes:
      .filter(childNodeObj => ["text", "esp"].includes(childNodeObj.type)) // wrap each with TR+TD with colspan:
      .forEach(obj => {

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
          ranges.push(obj.start, obj.end, `\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""}>\n    ${obj.value.trim()}\n  </td>\n</tr>\n`);
        }
      }); //
      //
      //
      //                         T Y P E      II.
      //
      //
      //
      // -----------------------------------------------------------------------------
      token.children // filter out text nodes:
      .filter(obj => obj.type === "tag" && obj.tagName === "tr" && !obj.closing).forEach(trTag => {
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
          const childNodeObj = trTag.children[i]; // deactivate

          if (doNothing && childNodeObj.type === "comment" && childNodeObj.closing) {
            doNothing = false;
            continue;
          } // if a child node is opening comment node, activate doNothing
          // until closing counterpart is found


          if (!doNothing && childNodeObj.type === "comment" && !childNodeObj.closing) {
            doNothing = true;
          }

          if (!doNothing && ["text", "esp"].includes(childNodeObj.type) && childNodeObj.value.trim()) {

            if (childNodeObj.value.trim()) {
              // There will always be whitespace in nicely formatted tags,
              // so ignore text tokens which have values that trim to zero length.

              if (!i) {
                ranges.push(childNodeObj.start, childNodeObj.end, `\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""}>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`);
              } else if (i && len > 1 && i === len - 1) {
                ranges.push(childNodeObj.start, childNodeObj.end, `\n</tr>\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""}>\n    ${childNodeObj.value.trim()}\n  </td>\n`);
              } else {
                ranges.push(childNodeObj.start, childNodeObj.end, `\n</tr>\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""}>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`);
              }
            }
          }
        }
      });
    }
  });

  if (ranges.current()) {
    const result = rApply(str, ranges.current());
    ranges.wipe();
    return {
      result
    };
  }

  return {
    result: str
  };
}

export { defaults, patcher, version };
