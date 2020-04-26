/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 1.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).isCharSuitableForHtmlAttrName=t()}(this,(function(){"use strict";return function(e){return"string"==typeof e&&(e.charCodeAt(0)>96&&e.charCodeAt(0)<123||e.charCodeAt(0)>64&&e.charCodeAt(0)<91||e.charCodeAt(0)>47&&e.charCodeAt(0)<58||":"===e||"-"===e)}}));
