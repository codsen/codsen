/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.10.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "1.10.9";

var version = version$1;
function emptyCondCommentRegex() {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

exports.emptyCondCommentRegex = emptyCondCommentRegex;
exports.version = version;
