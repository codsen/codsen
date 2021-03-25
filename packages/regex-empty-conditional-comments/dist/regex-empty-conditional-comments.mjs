/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.10.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

const n="1.10.10";function i(){return/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi}export{i as emptyCondCommentRegex,n as version};
