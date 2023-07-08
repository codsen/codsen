/* eslint quote-props:0 */

import he from "he";
import { Obj, isStr } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

function unfancy(str: string): string {
  let CHARS: Obj = {
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
  if (!isStr(str)) {
    throw new Error(
      `string-unfancy/unfancy(): [THROW_ID_01] The input is not a string! It's: ${typeof str}`,
    );
  }
  // decode anticipating multiple encoding one on top of another
  let res = str;
  while (he.decode(res) !== res) {
    res = he.decode(res);
  }
  for (let i = 0, len = res.length; i < len; i++) {
    if (res[i] in CHARS) {
      res = `${res.slice(0, i)}${CHARS[res[i]] as string}${res.slice(i + 1)}`;
    }
  }
  return res;
}

export { unfancy, version };
