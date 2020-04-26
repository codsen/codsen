import deburr from "lodash.deburr";
import ent from "ent";

function bSlug(str) {
  if (typeof str !== "string") {
    return "";
  }

  // decode entities
  while (str !== ent.decode(str)) {
    // eslint-disable-next-line no-param-reassign
    str = ent.decode(str);
  }

  // characters which will be deleted:
  return `markdown-header-${deburr(str)
    .replace(/\]\((.*?)\)/g, "") // remove all within brackets (Markdown links)
    .replace(/ [-]+ /gi, " ")
    .replace(/[^\w\d\s-]/g, "") // remove non-letters
    .replace(/\s+/g, " ") // collapse whitespace
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")}`; // replace spaces with dashes
}

export default bSlug;
