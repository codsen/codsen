/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.8.62
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

'use strict';

var main = (function () {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
});

module.exports = main;
