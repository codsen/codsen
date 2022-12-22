/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;

interface Obj {
  [key: string]: any;
}

function hasOwnProp(obj: Obj, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export {
  Obj,
  hasOwnProp,
  regexEmptyStyleTag,
  regexEmptyMediaQuery,
  regexEmptyUnclosedMediaQuery,
};
