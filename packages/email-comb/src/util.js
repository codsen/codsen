const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;
const defaults = {
  whitelist: [],
  backend: [], // pass the ESP head & tail sets as separate objects inside this array
  uglify: false,
  removeHTMLComments: true,
  removeCSSComments: true,
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isLatinLetter(char) {
  // we mean Latin letters A-Z, a-z
  return (
    typeof char === "string" &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}

export {
  isObj,
  defaults,
  hasOwnProp,
  isLatinLetter,
  regexEmptyStyleTag,
  regexEmptyMediaQuery,
  regexEmptyUnclosedMediaQuery,
};
