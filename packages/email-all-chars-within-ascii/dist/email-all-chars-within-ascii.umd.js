/**
 * email-all-chars-within-ascii
 * Scans all characters within a string and checks are they within ASCII range
 * Version: 3.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/email-all-chars-within-ascii/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).emailAllCharsWithinAscii={})}(this,(function(e){"use strict";function t(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function n(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function r(e){for(var r=1;r<arguments.length;r++){var i=null!=arguments[r]?arguments[r]:{};r%2?n(Object(i),!0).forEach((function(n){t(e,n,i[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var i={lineLength:500};e.defaults=i,e.version="3.0.5",e.within=function(e,t){if("string"!=typeof e)throw new Error("email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but "+typeof e+", equal to: "+JSON.stringify(e,null,4));if(t&&"object"!=typeof t)throw new Error("email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but "+typeof t+", equal to:\n"+JSON.stringify(t,null,4));if(!e.length)return[];for(var n=r(r({},i),t),o=0,l=1,c=[],a=0,f=e.length;a<=f;a++)if(n.lineLength&&(!e[a]||"\r"===e[a]||"\n"===e[a])&&o>n.lineLength&&c.push({type:"line length",line:l,column:o,positionIdx:a,value:o}),"\r"===e[a]||"\n"===e[a]?(o=0,"\n"!==e[a]&&"\n"===e[a+1]||(l+=1)):o+=1,e[a]){var u=e[a].codePointAt(0);(void 0===u||u>126||u<9||11===u||12===u||u>13&&u<32)&&c.push({type:"character",line:l,column:o,positionIdx:a,value:e[a],codePoint:u,UTF32Hex:e[a].charCodeAt(0).toString(16).padStart(4,"0").toLowerCase()})}return c},Object.defineProperty(e,"__esModule",{value:!0})}));
