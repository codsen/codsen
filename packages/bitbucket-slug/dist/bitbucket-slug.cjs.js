/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 1.9.57
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/bitbucket-slug
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deburr = _interopDefault(require('lodash.deburr'));
var ent = _interopDefault(require('ent'));

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }
  while (str !== ent.decode(str)) {
    str = ent.decode(str);
  }
  return "markdown-header-".concat(deburr(str).replace(/\]\((.*?)\)/g, "")
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "")
  .replace(/\s+/g, " ")
  .toLowerCase().trim().replace(/ /g, "-"));
}

module.exports = bSlug;
