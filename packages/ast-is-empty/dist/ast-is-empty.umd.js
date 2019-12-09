/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 1.9.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).astIsEmpty=e()}(this,(function(){"use strict";var t="[object Object]";var e,n,r=Function.prototype,o=Object.prototype,u=r.toString,f=o.hasOwnProperty,i=u.call(Object),c=o.toString,l=(e=Object.getPrototypeOf,n=Object,function(t){return e(n(t))});var s=function(e){if(!function(t){return!!t&&"object"==typeof t}(e)||c.call(e)!=t||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(e))return!1;var n=l(e);if(null===n)return!0;var r=f.call(n,"constructor")&&n.constructor;return"function"==typeof r&&r instanceof r&&u.call(r)==i};return function t(e){var n,r,o=!0;if(Array.isArray(e)){if(0===e.length)return!0;for(n=0,r=e.length;n<r;n++){if(null===(o=t(e[n])))return null;if(!o)return!1}}else if(s(e)){if(0===Object.keys(e).length)return!0;for(n=0,r=Object.keys(e).length;n<r;n++){if(null===(o=t(e[Object.keys(e)[n]])))return null;if(!o)return!1}}else{if("string"!=typeof e)return null;if(0!==e.length)return!1}return o}}));
