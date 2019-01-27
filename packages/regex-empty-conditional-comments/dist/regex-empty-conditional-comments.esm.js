/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.8.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments
 */

var main = () => /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;

export default main;
