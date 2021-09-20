/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 2.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).regexEmptyConditionalComments={})}(this,(function(e){"use strict";e.emptyCondCommentRegex=function(){return/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi},e.version="2.0.2",Object.defineProperty(e,"__esModule",{value:!0})}));
