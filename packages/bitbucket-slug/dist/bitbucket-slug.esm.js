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
