/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "1.9.1";

var version$1 = version;

function emptyCondCommentRegex() {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

exports.emptyCondCommentRegex = emptyCondCommentRegex;
exports.version = version$1;
