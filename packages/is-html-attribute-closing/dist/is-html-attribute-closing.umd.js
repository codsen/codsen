/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).isHtmlAttributeClosing=t()}(this,(function(){"use strict";return function(e,t,n){if("string"!=typeof e||!e.trim().length||!Number.isInteger(t)||!Number.isInteger(n)||!e[t]||!e[n]||t>=n)return!1;for(var i="'\"".includes(e[t])?e[t]:null,r=t;r<n;r++)if("="===e[r]&&"'\"".includes(e[r+1]))return!1;return!(!i||e[n]!=e[n])}}));
