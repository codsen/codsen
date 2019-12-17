/**
 * lerna-clean-changelogs
 * Cleans all the crap from Lerna and Conventional Commits-generated changelogs
 * Version: 1.3.43
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).lernaCleanChangelogs=n()}(this,(function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}var n="1.3.43";function e(t){return"string"==typeof t}return function(r){if(void 0===r)throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");if(!e(r))throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ".concat(Array.isArray(r)?"array":t(r),", equal to:\n").concat(JSON.stringify(r,null,4)));var o,i=!1;if(r.length&&(!r.includes("\n")||!r.includes("\r"))){var s=e(r)&&r.length&&("\n"===r[r.length-1]||"\r"===r[r.length-1]),f=(r=r.trim()).split(/\r?\n/);f.forEach((function(t,n){t.startsWith("#")&&(f[n]=t.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,"$1 $2")),n&&f[n].startsWith("# ")&&(f[n]="#".concat(f[n]))}));for(var l=[],a=f.length;a--;){if(f[a].startsWith("**Note:** Version bump only")||f[a].toLowerCase().includes("wip")){for(;e(f[a-1])&&!f[a-1].trim().length&&a;)a--;for(a&&e(f[a-1])&&f[a-1].trim().startsWith("#")&&a--;e(f[a-1])&&!f[a-1].trim().length&&a;)a--}else f[a].trim().length?"*"===f[a][0]&&" "===f[a][1]?l.unshift("- ".concat(f[a].slice(2))):l.unshift(f[a]):i||(l.unshift(f[a].trim()),i=!0);f[a].trim().length&&(i=!1)}o="".concat(l.join("\n")).concat(s?"\n":"")}return{version:n,res:o||r}}}));
