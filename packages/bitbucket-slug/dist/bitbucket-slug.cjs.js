/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/bitbucket-slug/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var deburr = require('lodash.deburr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var deburr__default = /*#__PURE__*/_interopDefaultLegacy(deburr);

/**
 * Generate BitBucket readme header anchor slug URLs
 */

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  } // characters which will be deleted:


  return "markdown-header-" + deburr__default['default'](str).replace(/\]\((.*?)\)/g, "") // remove all within brackets (Markdown links)
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "") // remove non-letters
  .replace(/\s+/g, " ") // collapse whitespace
  .toLowerCase().trim().replace(/ /g, "-"); // replace spaces with dashes
}

exports.bSlug = bSlug;
