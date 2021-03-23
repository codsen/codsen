/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 2.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/bitbucket-slug/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var deburr = require('lodash.deburr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var deburr__default = /*#__PURE__*/_interopDefaultLegacy(deburr);

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }
  return "markdown-header-" + deburr__default['default'](str).replace(/\]\((.*?)\)/g, "")
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "")
  .replace(/\s+/g, " ")
  .toLowerCase().trim().replace(/ /g, "-");
}

exports.bSlug = bSlug;
