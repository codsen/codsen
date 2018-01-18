'use strict';

function collapseLeadingWhitespace(str) {
  if (typeof str === 'string') {
    // quick end
    if (str.length === 0) {
      return '';
    } else if (str.trim() === '') {
      if (str.includes('\n')) {
        return '\n';
      }
      return ' ';
    }
    // set the default to put in front:
    var startCharacter = '';
    // if there's some leading whitespace
    if (str[0].trim() === '') {
      startCharacter = ' ';
      var lineBreakEncountered = false;
      for (var i = 0, len = str.length; i < len; i++) {
        if (str[i] === '\n') {
          lineBreakEncountered = true;
        }
        if (str[i].trim() !== '') {
          break;
        }
      }
      if (lineBreakEncountered) {
        startCharacter = '\n';
      }
    }

    // set the default to put in front:
    var endCharacter = '';
    // if there's some trailing whitespace
    if (str.slice(-1).trim() === '') {
      endCharacter = ' ';
      var _lineBreakEncountered = false;
      for (var _i = str.length; _i--;) {
        if (str[_i] === '\n') {
          _lineBreakEncountered = true;
        }
        if (str[_i].trim() !== '') {
          break;
        }
      }
      if (_lineBreakEncountered) {
        endCharacter = '\n';
      }
    }
    return startCharacter + str.trim() + endCharacter;
  }
  return str;
}

module.exports = collapseLeadingWhitespace;
