/**
 * @name regex-is-jsp
 * @fileoverview Regular expression for detecting JSP (Java Server Pages) code
 * @version 3.0.4
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jsp/}
 */

!function(e,s){"object"==typeof exports&&"undefined"!=typeof module?s(exports):"function"==typeof define&&define.amd?define(["exports"],s):s((e="undefined"!=typeof globalThis?globalThis:e||self).regexIsJsp={})}(this,(function(e){"use strict";e.isJSP=function(){return/<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi},e.version="3.0.4",Object.defineProperty(e,"__esModule",{value:!0})}));
