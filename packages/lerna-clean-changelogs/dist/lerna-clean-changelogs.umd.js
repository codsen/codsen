/**
 * @name lerna-clean-changelogs
 * @fileoverview Removes frivolous entries from commitizen generated changelogs
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/lerna-clean-changelogs/}
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).lernaCleanChangelogs={})}(this,(function(t){"use strict";const e="2.0.14";function n(t){return"string"==typeof t}t.cleanChangelogs=function(t){if(void 0===t)throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");if(!n(t))throw new Error(`lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ${Array.isArray(t)?"array":typeof t}, equal to:\n${JSON.stringify(t,null,4)}`);let r,i=!1;if("string"==typeof t&&t.length&&(!t.includes("\n")||!t.includes("\r"))){const e=n(t)&&t.length&&("\n"===t[t.length-1]||"\r"===t[t.length-1]),s=(t=t.trim().replace(/(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,"$1commit/")).split(/\r?\n/);s.forEach(((t,e)=>{t.startsWith("#")&&(s[e]=t.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,"$1 $2")),e&&s[e].startsWith("# ")&&(s[e]=`#${s[e]}`)}));const o=[];for(let t=s.length;t--;){if(s[t].startsWith("**Note:** Version bump only")||s[t].toLowerCase().includes("wip")){for(;n(s[t-1])&&!s[t-1].trim()&&t;)t-=1;for(t&&n(s[t-1])&&s[t-1].trim().startsWith("#")&&(t-=1);n(s[t-1])&&!s[t-1].trim()&&t;)t-=1}else s[t].trim()?o.unshift("*"===s[t][0]&&" "===s[t][1]?`- ${s[t].slice(2)}`:s[t]):i||(o.unshift(s[t].trim()),i=!0);s[t].trim()&&(i=!1)}r=`${o.join("\n")}${e?"\n":""}`}return{version:e,res:r||t}},t.version=e,Object.defineProperty(t,"__esModule",{value:!0})}));
