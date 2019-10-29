/**
 * is-html-tag-opening
 * Is given opening bracket a beginning of a tag?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).isHtmlTagOpening=t()}(this,(function(){"use strict";return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=t?e.slice(t):e,n=!1;return/^<\s*\w+\s*\/?\s*>/g.test(s)?n=!0:/^<\s*\w+\s+\w+\s*=\s*['"]/g.test(s)?n=!0:/^<\s*\/?\s*\w+\s*\/?\s*>/g.test(s)?n=!0:/^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g.test(s)&&(n=!0),"string"==typeof e&&t<e.length&&n}}));
