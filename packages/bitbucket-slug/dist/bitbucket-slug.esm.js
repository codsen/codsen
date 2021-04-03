/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 2.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/bitbucket-slug/
 */

import deburr from 'lodash.deburr';

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }
  return `markdown-header-${deburr(str).replace(/\]\((.*?)\)/g, "")
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "")
  .replace(/\s+/g, " ")
  .toLowerCase().trim().replace(/ /g, "-")}`;
}

export { bSlug };
