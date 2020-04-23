/**
 * lerna-clean-changelogs
 * Cleans all the crap from Lerna and Conventional Commits-generated changelogs
 * Version: 1.3.52
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).lernaCleanChangelogs=n()}(this,(function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}function n(t){return"string"==typeof t}return function(r){if(void 0===r)throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");if(!n(r))throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ".concat(Array.isArray(r)?"array":t(r),", equal to:\n").concat(JSON.stringify(r,null,4)));var e,o=!1;if("string"==typeof r&&r.length&&(!r.includes("\n")||!r.includes("\r"))){var i=n(r)&&r.length&&("\n"===r[r.length-1]||"\r"===r[r.length-1]),s=(r=r.trim()).split(/\r?\n/);s.forEach((function(t,n){t.startsWith("#")&&(s[n]=t.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,"$1 $2")),n&&s[n].startsWith("# ")&&(s[n]="#".concat(s[n]))}));for(var f=[],a=s.length;a--;){if(s[a].startsWith("**Note:** Version bump only")||s[a].toLowerCase().includes("wip")){for(;n(s[a-1])&&!s[a-1].trim()&&a;)a-=1;for(a&&n(s[a-1])&&s[a-1].trim().startsWith("#")&&(a-=1);n(s[a-1])&&!s[a-1].trim()&&a;)a-=1}else s[a].trim()?"*"===s[a][0]&&" "===s[a][1]?f.unshift("- ".concat(s[a].slice(2))):f.unshift(s[a]):o||(f.unshift(s[a].trim()),o=!0);s[a].trim()&&(o=!1)}e="".concat(f.join("\n")).concat(i?"\n":"")}return{version:"1.3.52",res:e||r}}}));
