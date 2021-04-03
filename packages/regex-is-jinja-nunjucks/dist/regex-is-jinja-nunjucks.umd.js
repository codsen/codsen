/**
 * @name regex-is-jinja-nunjucks
 * @fileoverview Regular expression for detecting Jinja or Nunjucks code
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jinja-nunjucks/}
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).regexIsJinjaNunjucks={})}(this,(function(e){"use strict";e.isJinjaNunjucksRegex=function(){return/{%|{{|%}|}}/gi},e.version="2.0.13",Object.defineProperty(e,"__esModule",{value:!0})}));
