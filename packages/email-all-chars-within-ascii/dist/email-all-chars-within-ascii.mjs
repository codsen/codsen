/**
 * email-all-chars-within-ascii
 * Scans all characters within a string and checks are they within ASCII range
 * Version: 3.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/email-all-chars-within-ascii/
 */

const t="3.0.5",n={lineLength:500};function i(t,i){if("string"!=typeof t)throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ${typeof t}, equal to: ${JSON.stringify(t,null,4)}`);if(i&&"object"!=typeof i)throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ${typeof i}, equal to:\n${JSON.stringify(i,null,4)}`);if(!t.length)return[];const e={...n,...i};let o=0,r=1;const l=[];for(let n=0,i=t.length;n<=i;n++)if(e.lineLength&&(!t[n]||"\r"===t[n]||"\n"===t[n])&&o>e.lineLength&&l.push({type:"line length",line:r,column:o,positionIdx:n,value:o}),"\r"===t[n]||"\n"===t[n]?(o=0,"\n"!==t[n]&&"\n"===t[n+1]||(r+=1)):o+=1,t[n]){const i=t[n].codePointAt(0);(void 0===i||i>126||i<9||11===i||12===i||i>13&&i<32)&&l.push({type:"character",line:r,column:o,positionIdx:n,value:t[n],codePoint:i,UTF32Hex:t[n].charCodeAt(0).toString(16).padStart(4,"0").toLowerCase()})}return l}export{n as defaults,t as version,i as within};
