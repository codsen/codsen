/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 1.9.50
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/bitbucket-slug
 */

import deburr from 'lodash.deburr';
import ent from 'ent';

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }
  while (str !== ent.decode(str)) {
    str = ent.decode(str);
  }
  return `markdown-header-${deburr(str)
    .replace(/\]\((.*?)\)/g, "")
    .replace(/ [-]+ /gi, " ")
    .replace(/[^\w\d\s-]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")}`;
}

export default bSlug;
