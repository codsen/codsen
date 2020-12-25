/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

var i="1.9.1";function n(){return/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi}export{n as emptyCondCommentRegex,i as version};
