'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deburr = _interopDefault(require('lodash.deburr'));
var ent = _interopDefault(require('ent'));

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }

  // decode entities
  while (str !== ent.decode(str)) {
    str = ent.decode(str);
  }

  // characters which will be deleted:
  return "markdown-header-" + deburr(str).replace(/\]\((.*?)\)/g, "") // remove all within brackets (Markdown links)
  .replace(/ [-]+ /gi, " ").replace(/[^\w\d\s-]/g, "") // remove non-letters
  .replace(/\s+/g, " ") // collapse whitespace
  .toLowerCase().trim().replace(/ /g, "-"); // replace spaces with dashes
}

module.exports = bSlug;
