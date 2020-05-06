/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 1.10.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).astIsEmpty=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}return function t(n){var r,o,f,u=!0;if(Array.isArray(n)){if(0===n.length)return!0;for(r=0,o=n.length;r<o;r++){if(null===(u=t(n[r])))return null;if(!u)return!1}}else if((f=n)&&"object"===e(f)&&!Array.isArray(f)){if(0===Object.keys(n).length)return!0;for(r=0,o=Object.keys(n).length;r<o;r++){if(null===(u=t(n[Object.keys(n)[r]])))return null;if(!u)return!1}}else{if("string"!=typeof n)return null;if(0!==n.length)return!1}return u}}));
