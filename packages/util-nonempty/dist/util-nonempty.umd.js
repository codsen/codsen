/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.3.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).utilNonempty=n()}(this,function(){"use strict";var t="[object Object]";var n,e,r=Function.prototype,o=Object.prototype,c=r.toString,u=o.hasOwnProperty,f=c.call(Object),i=o.toString,l=(n=Object.getPrototypeOf,e=Object,function(t){return n(e(t))});var a=function(n){if(!function(t){return!!t&&"object"==typeof t}(n)||i.call(n)!=t||function(t){var n=!1;if(null!=t&&"function"!=typeof t.toString)try{n=!!(t+"")}catch(t){}return n}(n))return!1;var e=l(n);if(null===e)return!0;var r=u.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&c.call(r)==f};return function(t){return 0!==arguments.length&&void 0!==t&&(n=t,Array.isArray(n)||function(t){return"string"==typeof t}(t)?t.length>0:a(t)?Object.keys(t).length>0:!!function(t){return"number"==typeof t}(t));var n}});
