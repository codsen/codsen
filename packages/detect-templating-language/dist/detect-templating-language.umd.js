/**
 * detect-templating-language
 * Detects various templating languages present in string
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-templating-language/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).detectTemplatingLanguage=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}return function(e){var n=null;if("string"!=typeof e)throw new TypeError("detect-templating-language: [THROW_ID_01] Input must be string! It was given as ".concat(JSON.stringify(e,null,4)," (type ").concat(t(e),")."));return e?(/{%|{{|%}|}}/gi.test(e)?n="Nunjucks":/<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi.test(e)&&(n="JSP"),{name:n}):{name:n}}}));
