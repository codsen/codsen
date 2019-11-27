/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.8.49
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments
 */

var main = () => /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;

export default main;
