/* eslint quote-props:0 */

import { isStr, type Obj } from "codsen-utils";
import { decode } from "html-entity-codec";

import { version as v } from "../package.json";

const version: string = v;

const CHARS: Obj = {
  "\u00B4": "'",
  "\u02BB": "'",
  "\u02BC": "'",
  "\u02BD": "'",
  "\u02C8": "'",
  "\u02B9": "'",
  "\u0312": "'",
  "\u0313": "'",
  "\u0314": "'",
  "\u0315": "'",
  "\u02BA": '"',
  "\u201C": '"',
  "\u201D": '"',
  "\u2012": "-",
  "\u2013": "-",
  "\u2014": "-",
  "\u2018": "'",
  "\u2019": "'",
  "\u2026": "...",
  "\u2212": "-",
  "\uFE49": "-",
  "\u00A0": " ",
};

function unfancy(str: string): string {
  if (!isStr(str)) {
    throw new Error(
      `string-unfancy/unfancy(): [THROW_ID_01] The input is not a string! It's: ${typeof str}`,
    );
  }
  // decode anticipating multiple encoding one on top of another
  let res = str;
  let next = decode(res);
  while (next !== res) {
    res = next;
    next = decode(res);
  }
  // Every typography substitution is non-ASCII. Native scanning avoids a
  // per-character dictionary lookup for already plain text.
  if (!/[\u0080-\uFFFF]/.test(res)) return res;
  for (let i = 0; i < res.length; i++) {
    if (res[i] in CHARS) {
      res = `${res.slice(0, i)}${CHARS[res[i]] as string}${res.slice(i + 1)}`;
    }
  }
  return res;
}

export { unfancy, version };
