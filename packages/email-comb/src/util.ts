/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;

interface Obj {
  [key: string]: any;
}

// proper plain object checks such as lodash's cost more perf than this below
function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

function hasOwnProp(obj: Obj, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isLatinLetter(char: any): boolean {
  // we mean Latin letters A-Z, a-z
  return (
    typeof char === "string" &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}

export {
  Obj,
  isObj,
  hasOwnProp,
  isLatinLetter,
  regexEmptyStyleTag,
  regexEmptyMediaQuery,
  regexEmptyUnclosedMediaQuery,
};
