/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 1.9.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).astIsEmpty=e()}(this,(function(){"use strict";var t,e,n=Function.prototype,r=Object.prototype,o=n.toString,u=r.hasOwnProperty,f=o.call(Object),i=r.toString,c=(t=Object.getPrototypeOf,e=Object,function(n){return t(e(n))});var l=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||"[object Object]"!=i.call(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t))return!1;var e=c(t);if(null===e)return!0;var n=u.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&o.call(n)==f};return function t(e){var n,r,o=!0;if(Array.isArray(e)){if(0===e.length)return!0;for(n=0,r=e.length;n<r;n++){if(null===(o=t(e[n])))return null;if(!o)return!1}}else if(l(e)){if(0===Object.keys(e).length)return!0;for(n=0,r=Object.keys(e).length;n<r;n++){if(null===(o=t(e[Object.keys(e)[n]])))return null;if(!o)return!1}}else{if("string"!=typeof e)return null;if(0!==e.length)return!1}return o}}));
