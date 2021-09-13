/**
 * @name email-all-chars-within-ascii
 * @fileoverview Scans all characters within a string and checks are they within ASCII range
 * @version 4.0.1
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/email-all-chars-within-ascii/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).emailAllCharsWithinAscii={})}(this,(function(e){"use strict";const t={lineLength:500};e.defaults=t,e.version="4.0.1",e.within=function(e,n){if("string"!=typeof e)throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(n&&"object"!=typeof n)throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ${typeof n}, equal to:\n${JSON.stringify(n,null,4)}`);if(!e.length)return[];const i={...t,...n};let o=0,l=1;const r=[];for(let t=0,n=e.length;t<=n;t++)if(i.lineLength&&(!e[t]||"\r"===e[t]||"\n"===e[t])&&o>i.lineLength&&r.push({type:"line length",line:l,column:o,positionIdx:t,value:o}),"\r"===e[t]||"\n"===e[t]?(o=0,"\n"!==e[t]&&"\n"===e[t+1]||(l+=1)):o+=1,e[t]){const n=e[t].codePointAt(0);(void 0===n||n>126||n<9||11===n||12===n||n>13&&n<32)&&r.push({type:"character",line:l,column:o,positionIdx:t,value:e[t],codePoint:n,UTF32Hex:e[t].charCodeAt(0).toString(16).padStart(4,"0").toLowerCase()})}return r},Object.defineProperty(e,"__esModule",{value:!0})}));
