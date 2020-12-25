/**
 * regex-is-jinja-nunjucks
 * Regular expression for detecting Jinja or Nunjucks code
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jinja-nunjucks/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).regexIsJinjaNunjucks={})}(this,(function(e){"use strict";e.isJinjaNunjucksRegex=function(){return/{%|{{|%}|}}/gi},e.version="1.1.1",Object.defineProperty(e,"__esModule",{value:!0})}));
