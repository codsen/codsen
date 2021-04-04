/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 1.10.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "1.10.14";

var version = version$1;
function emptyCondCommentRegex() {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

exports.emptyCondCommentRegex = emptyCondCommentRegex;
exports.version = version;
