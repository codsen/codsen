/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.8.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments
 */

'use strict';

var main = (function () {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
});

module.exports = main;
