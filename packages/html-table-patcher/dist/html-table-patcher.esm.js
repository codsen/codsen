/**
 * @name html-table-patcher
 * @fileoverview Visual helper to place templating code around table tags into correct places
 * @version 4.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-table-patcher/}
 */

import { cparser } from 'codsen-parser';
import { Ranges } from 'ranges-push';
import { rApply } from 'ranges-apply';
import { traverse } from 'ast-monkey-traverse-with-lookahead';

var version$1 = "4.0.15";

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
function patcher(str, generalOpts) {
  if (typeof str !== "string" || str.length === 0) {
    return {
      result: str
    };
  }
  const opts = { ...defaults,
    ...generalOpts
  };
  if (opts.cssStylesContent && (
  typeof opts.cssStylesContent !== "string" ||
  !opts.cssStylesContent.trim())) {
    opts.cssStylesContent = "";
  }
  const knownCommentTokenPaths = [];
  traverse(cparser(str), (token, _val, innerObj) => {
    /* istanbul ignore else */
    if (isObj(token) && token.type === "comment" && !knownCommentTokenPaths.some(oneOfRecordedPaths => innerObj.path.startsWith(oneOfRecordedPaths))) {
      knownCommentTokenPaths.push(innerObj.path);
    } else if (
    isObj(token) &&
    token.type === "tag" && token.tagName === "table" && !knownCommentTokenPaths.some(oneOfKnownCommentPaths => innerObj.path.startsWith(oneOfKnownCommentPaths)) &&
    !token.closing &&
    token.children.some(childNodeObj => ["text", "esp"].includes(childNodeObj.type))) {
      let colspanVal = 1;
      let centered = false;
      let firstTrFound = {};
      if (
      token.children.some(childNodeObj => childNodeObj.type === "tag" && childNodeObj.tagName === "tr" && !childNodeObj.closing && (firstTrFound = childNodeObj))) {
        let count = 0;
        for (let i = 0, len = firstTrFound.children.length; i < len; i++) {
          const obj = firstTrFound.children[i];
          if (obj.type === "tag" && obj.tagName === "td") {
            if (!obj.closing) {
              centered = obj.attribs.some(attrib => attrib.attribName === "align" && attrib.attribValueRaw === "center" || attrib.attribName === "style" && /text-align:\s*center/i.test(attrib.attribValueRaw));
              count++;
              if (count > colspanVal) {
                colspanVal = count;
              }
            }
          } else if (obj.type !== "text" || obj.value.replace(htmlCommentRegex, "").trim()) {
            count = 0;
          }
        }
      }
      token.children
      .filter(childNodeObj => ["text", "esp"].includes(childNodeObj.type))
      .forEach(obj => {
        if (obj.value.replace(htmlCommentRegex, "").trim()) {
          ranges.push(obj.start, obj.end, `\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""}>\n    ${obj.value.trim()}\n  </td>\n</tr>\n`);
        }
      });
      token.children
      .filter(obj => obj.type === "tag" && obj.tagName === "tr" && !obj.closing).forEach(trTag => {
        let doNothing = false;
        for (let i = 0, len = trTag.children.length; i < len; i++) {
          const childNodeObj = trTag.children[i];
          if (doNothing && childNodeObj.type === "comment" && childNodeObj.closing) {
            doNothing = false;
            continue;
          }
          if (!doNothing && childNodeObj.type === "comment" && !childNodeObj.closing) {
            doNothing = true;
          }
          if (!doNothing && ["text", "esp"].includes(childNodeObj.type) && childNodeObj.value.trim()) {
            if (childNodeObj.value.trim()) {
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
