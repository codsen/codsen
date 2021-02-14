/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/bitbucket-slug/
 */

import deburr from 'lodash.deburr';

/**
 * Generate BitBucket readme header anchor slug URLs
 */

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  } // characters which will be deleted:


  return `markdown-header-${deburr(str).replace(/\]\((.*?)\)/g, "") // remove all within brackets (Markdown links)
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "") // remove non-letters
  .replace(/\s+/g, " ") // collapse whitespace
  .toLowerCase().trim().replace(/ /g, "-")}`; // replace spaces with dashes
}

export { bSlug };
