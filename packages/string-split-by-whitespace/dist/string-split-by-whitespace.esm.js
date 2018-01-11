function split(str) {
  if (str === undefined) {
    throw new Error('string-split-by-whitespace: The input is missing!');
  }
  if (typeof str !== 'string') {
    return str;
  }
  // early ending:
  if (str.trim() === '') {
    return [];
  }

  // if reached this far, traverse and slice accordingly
  var nonWhitespaceSubStringStartsAt = null;
  var res = [];
  for (var i = 0, len = str.length; i < len; i++) {
    // catch the first non-whitespace character
    if (!nonWhitespaceSubStringStartsAt && str[i].trim() !== '') {
      nonWhitespaceSubStringStartsAt = i;
    }
    // catch the first whitespace char when recording substring
    if (nonWhitespaceSubStringStartsAt !== null) {
      if (str[i].trim() === '') {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
        nonWhitespaceSubStringStartsAt = null;
      } else if (str[i + 1] === undefined) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
      }
    }
  }
  return res;
}

export default split;
