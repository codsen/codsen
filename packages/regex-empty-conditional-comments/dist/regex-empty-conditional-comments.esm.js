/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 2.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */

var version$1 = "2.0.5";

const version = version$1;
function emptyCondCommentRegex() {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

export { emptyCondCommentRegex, version };
