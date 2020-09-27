/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 1.10.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/bitbucket-slug/
 */

'use strict';

var deburr = require('lodash.deburr');
var ent = require('ent');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var deburr__default = /*#__PURE__*/_interopDefaultLegacy(deburr);
var ent__default = /*#__PURE__*/_interopDefaultLegacy(ent);

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }
  while (str !== ent__default['default'].decode(str)) {
    str = ent__default['default'].decode(str);
  }
  return "markdown-header-".concat(deburr__default['default'](str).replace(/\]\((.*?)\)/g, "")
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "")
  .replace(/\s+/g, " ")
  .toLowerCase().trim().replace(/ /g, "-"));
}

module.exports = bSlug;
