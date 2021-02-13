/**
 * lerna-clean-changelogs
 * Removes frivolous entries from commitizen generated changelogs
 * Version: 2.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/lerna-clean-changelogs/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).lernaCleanChangelogs={})}(this,(function(e){"use strict";var t="2.0.4";function n(e){return"string"==typeof e}e.cleanChangelogs=function(e){if(void 0===e)throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");if(!n(e))throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as "+(Array.isArray(e)?"array":typeof e)+", equal to:\n"+JSON.stringify(e,null,4));var r,i=!1;if("string"==typeof e&&e.length&&(!e.includes("\n")||!e.includes("\r"))){var s=n(e)&&e.length&&("\n"===e[e.length-1]||"\r"===e[e.length-1]),o=(e=e.trim().replace(/(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,"$1commit/")).split(/\r?\n/);o.forEach((function(e,t){e.startsWith("#")&&(o[t]=e.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,"$1 $2")),t&&o[t].startsWith("# ")&&(o[t]="#"+o[t])}));for(var a=[],l=o.length;l--;){if(o[l].startsWith("**Note:** Version bump only")||o[l].toLowerCase().includes("wip")){for(;n(o[l-1])&&!o[l-1].trim()&&l;)l-=1;for(l&&n(o[l-1])&&o[l-1].trim().startsWith("#")&&(l-=1);n(o[l-1])&&!o[l-1].trim()&&l;)l-=1}else o[l].trim()?a.unshift("*"===o[l][0]&&" "===o[l][1]?"- "+o[l].slice(2):o[l]):i||(a.unshift(o[l].trim()),i=!0);o[l].trim()&&(i=!1)}r=a.join("\n")+(s?"\n":"")}return{version:t,res:r||e}},e.version=t,Object.defineProperty(e,"__esModule",{value:!0})}));
