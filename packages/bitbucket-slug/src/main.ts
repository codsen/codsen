import deburr from "lodash.deburr";

function bSlug(str: string): string {
  if (typeof str !== "string") {
    return "";
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

export { bSlug };
