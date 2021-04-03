/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.10.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).regexEmptyConditionalComments={})}(this,(function(e){"use strict";e.emptyCondCommentRegex=function(){return/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi},e.version="1.10.13",Object.defineProperty(e,"__esModule",{value:!0})}));
