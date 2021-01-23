/**
 * ranges-regex
 * Integrate regex operations into Ranges workflow
 * Version: 4.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-regex/
 */

import{rMerge as e}from"ranges-merge";import t from"lodash.isregexp";const r="4.0.0";function n(r,n,s){if(void 0===r)throw new TypeError("ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!");if(!t(r))throw new TypeError(`ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ${typeof r}, equal to: ${JSON.stringify(r,null,4)}`);if("string"!=typeof n)throw new TypeError(`ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ${typeof n}, equal to: ${JSON.stringify(n,null,4)}`);if(s&&"string"!=typeof s)throw new TypeError(`ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ${typeof s}, equal to: ${JSON.stringify(s,null,4)}`);if(!n.length)return null;let i;const l=[];if(null===s||"string"==typeof s&&s.length)for(;null!==(i=r.exec(n));)l.push([r.lastIndex-i[0].length,r.lastIndex,s]);else for(;null!==(i=r.exec(n));)l.push([r.lastIndex-i[0].length,r.lastIndex]);return l.length?e(l):null}export{n as rRegex,r as version};
