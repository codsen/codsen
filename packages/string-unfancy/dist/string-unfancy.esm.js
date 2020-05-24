/**
 * string-unfancy
 * Replace all fancy dashes, quotes etc with their simpler equivalents
 * Version: 3.9.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy
 */

import he from 'he';

function existy(x) {
  return x != null;
}
function unfancy(str) {
  const CHARS = {
    "\u00B4": "'",
    ʻ: "'",
    ʼ: "'",
    ʽ: "'",
    ˈ: "'",
    ʹ: "'",
    "\u0312": "'",
    "\u0313": "'",
    "\u0314": "'",
    "\u0315": "'",
    ʺ: '"',
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
  if (!existy(str)) {
    throw new Error(
      "string-unfancy/unfancy(): [THROW_ID_01] The input is missing!"
    );
  }
  if (typeof str !== "string") {
    throw new Error(
      `string-unfancy/unfancy(): [THROW_ID_02] The input is not a string! It's: ${typeof str}`
    );
  }
  let res = str;
  while (he.decode(res) !== res) {
    res = he.decode(res);
  }
  for (let i = 0, len = res.length; i < len; i++) {
    if (Object.prototype.hasOwnProperty.call(CHARS, res[i])) {
      res = res.slice(0, i) + CHARS[res[i]] + res.slice(i + 1);
    }
  }
  return res;
}

export default unfancy;
