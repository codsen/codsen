import matcher from 'matcher';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArr = Array.isArray;

/**
 * pullAllWithGlob - like _.pullAll but pulling stronger
 * Accepts * glob.
 * For example, "module-*" would pull all: "module-1", "module-zzz"...
 *
 * @param  {Array} input           array of strings
 * @param  {Array} toBeRemovedArr  array of strings (might contain asterisk)
 * @return {Array}                 pulled array
 */
function pullAllWithGlob(originalInput, originalToBeRemoved) {
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === 'string';
  }
  // insurance
  if (!existy(originalInput)) {
    throw new Error('array-pull-all-with-glob: [THROW_ID_01] first argument is missing!');
  }
  if (!existy(originalToBeRemoved)) {
    throw new Error('array-pull-all-with-glob: [THROW_ID_02] second argument is missing!');
  }
  if (!isArr(originalInput)) {
    throw new Error('array-pull-all-with-glob: [THROW_ID_03] first argument must be an array! Currently it\'s ' + (typeof originalInput === 'undefined' ? 'undefined' : _typeof(originalInput)) + ', equal to: ' + JSON.stringify(originalInput, null, 4));
  }
  if (!isArr(originalToBeRemoved)) {
    throw new Error('array-pull-all-with-glob: [THROW_ID_04] first argument must be an array! Currently it\'s ' + (typeof originalToBeRemoved === 'undefined' ? 'undefined' : _typeof(originalToBeRemoved)) + ', equal to: ' + JSON.stringify(originalToBeRemoved, null, 4));
  }
  if (originalInput.length === 0 || originalToBeRemoved.length === 0) {
    return originalInput;
  }
  if (!originalInput.every(function (el) {
    return isStr(el);
  })) {
    throw new Error('array-pull-all-with-glob: [THROW_ID_05] first argument array contains non-string elements: ' + JSON.stringify(originalInput, null, 4));
  }
  if (!originalToBeRemoved.every(function (el) {
    return isStr(el);
  })) {
    throw new Error('array-pull-all-with-glob: [THROW_ID_06] first argument array contains non-string elements: ' + JSON.stringify(originalToBeRemoved, null, 4));
  }

  return Array.from(originalInput).filter(function (originalVal) {
    return !originalToBeRemoved.some(function (remVal) {
      return matcher.isMatch(originalVal, remVal);
    });
  });
}

export default pullAllWithGlob;
