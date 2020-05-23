const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;

export {
  regexEmptyStyleTag,
  regexEmptyMediaQuery,
  regexEmptyUnclosedMediaQuery,
};
