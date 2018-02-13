'use strict';

function trimSpaces(s) {
  if (typeof s !== 'string') {
    return s;
  }
  var newStart = void 0;
  var newEnd = void 0;
  if (s.length > 0) {
    if (s[0] === ' ') {
      for (var i = 0, len = s.length; i < len; i++) {
        if (s[i] !== ' ') {
          newStart = i;
          break;
        }
        if (i === s.length - 1) {
          // this means there are only spaces from beginning to the end
          return '';
        }
      }
    }
    if (s[s.length - 1] === ' ') {
      for (var _i = s.length; _i--;) {
        if (s[_i] !== ' ') {
          newEnd = _i + 1;
          break;
        }
      }
    }
    if (newStart) {
      if (newEnd) {
        return s.slice(newStart, newEnd);
      }
      return s.slice(newStart);
    }
    if (newEnd) {
      return s.slice(0, newEnd);
    }
  }
  return s;
}

module.exports = trimSpaces;
