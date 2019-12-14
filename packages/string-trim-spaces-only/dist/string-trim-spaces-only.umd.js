/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 2.8.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-trim-spaces-only
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).stringTrimSpacesOnly=n()}(this,(function(){"use strict";function e(n){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(n)}return function(n,t){if("string"!=typeof n)throw new Error("string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ".concat(e(n),", equal to:\n").concat(JSON.stringify(n,null,4)));var r,s,i=Object.assign({},{classicTrim:!1,cr:!1,lf:!1,tab:!1,space:!0,nbsp:!1},t);function o(e){return i.classicTrim&&0===e.trim().length||!i.classicTrim&&(i.space&&" "===e||i.cr&&"\r"===e||i.lf&&"\n"===e||i.tab&&"\t"===e||i.nbsp&&" "===e)}if(n.length>0){if(o(n[0]))for(var f=0,c=n.length;f<c;f++){if(!o(n[f])){r=f;break}if(f===n.length-1)return{res:"",ranges:[[0,n.length]]}}if(o(n[n.length-1]))for(var l=n.length;l--;)if(!o(n[l])){s=l+1;break}return r?s?{res:n.slice(r,s),ranges:[[0,r],[s,n.length]]}:{res:n.slice(r),ranges:[[0,r]]}:s?{res:n.slice(0,s),ranges:[[s,n.length]]}:{res:n,ranges:[]}}return{res:"",ranges:[]}}}));
