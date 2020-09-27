/**
 * lerna-clean-changelogs
 * Removes frivolous changelog entries from commitizen-generated changelogs
 * Version: 1.3.60
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/lerna-clean-changelogs/
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t="undefined"!=typeof globalThis?globalThis:t||self).lernaCleanChangelogs=n()}(this,(function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}function n(t){return"string"==typeof t}return function(e){if(void 0===e)throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");if(!n(e))throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ".concat(Array.isArray(e)?"array":t(e),", equal to:\n").concat(JSON.stringify(e,null,4)));var r,o=!1;if("string"==typeof e&&e.length&&(!e.includes("\n")||!e.includes("\r"))){var i=n(e)&&e.length&&("\n"===e[e.length-1]||"\r"===e[e.length-1]),s=(e=e.trim()).split(/\r?\n/);s.forEach((function(t,n){t.startsWith("#")&&(s[n]=t.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,"$1 $2")),n&&s[n].startsWith("# ")&&(s[n]="#".concat(s[n]))}));for(var f=[],a=s.length;a--;){if(s[a].startsWith("**Note:** Version bump only")||s[a].toLowerCase().includes("wip")){for(;n(s[a-1])&&!s[a-1].trim()&&a;)a-=1;for(a&&n(s[a-1])&&s[a-1].trim().startsWith("#")&&(a-=1);n(s[a-1])&&!s[a-1].trim()&&a;)a-=1}else s[a].trim()?"*"===s[a][0]&&" "===s[a][1]?f.unshift("- ".concat(s[a].slice(2))):f.unshift(s[a]):o||(f.unshift(s[a].trim()),o=!0);s[a].trim()&&(o=!1)}r="".concat(f.join("\n")).concat(i?"\n":"")}return{version:"1.3.60",res:r||e}}}));
