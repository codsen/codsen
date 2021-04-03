/**
 * @name bitbucket-slug
 * @fileoverview Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/bitbucket-slug/}
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
