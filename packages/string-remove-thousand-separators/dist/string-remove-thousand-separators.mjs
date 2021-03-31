/**
 * string-remove-thousand-separators
 * Detects and removes thousand separators (dot/comma/quote/space) from string-type digits
 * Version: 5.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-thousand-separators/
 */

import{rApply as e}from"ranges-apply";import{Ranges as r}from"ranges-push";import t from"lodash.trim";const o="5.0.12";function s(o,s){let a=!0;const i=[".",",","'"," "];let n;if("string"!=typeof o)throw new TypeError(`string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ${typeof o}, equal to:\n${JSON.stringify(o,null,4)}`);if(s&&"object"!=typeof s)throw new TypeError(`string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ${typeof s}, equal to:\n${JSON.stringify(s,null,4)}`);const m={removeThousandSeparatorsFromNumbers:!0,padSingleDecimalPlaceNumbers:!0,forceUKStyle:!1,...s},d=t(o.trim(),'"');if(""===d)return d;const u=new r;for(let e=0,r=d.length;e<r;e++){if(m.removeThousandSeparatorsFromNumbers&&""===d[e].trim()&&u.add(e,e+1),m.removeThousandSeparatorsFromNumbers&&"'"===d[e]&&(u.add(e,e+1),"'"===d[e+1])){a=!1;break}if(i.includes(d[e])){if(void 0!==d[e+1]&&/^\d*$/.test(d[e+1]))if(void 0!==d[e+2]){if(!/^\d*$/.test(d[e+2])){a=!1;break}if(void 0!==d[e+3]){if(!/^\d*$/.test(d[e+3])){a=!1;break}if(void 0!==d[e+4]&&/^\d*$/.test(d[e+4])){a=!1;break}if(m.removeThousandSeparatorsFromNumbers&&u.add(e,e+1),n){if(d[e]!==n){a=!1;break}}else n=d[e]}else m.removeThousandSeparatorsFromNumbers&&m.forceUKStyle&&","===d[e]&&u.add(e,e+1,".")}else m.forceUKStyle&&","===d[e]&&u.add(e,e+1,"."),m.padSingleDecimalPlaceNumbers&&u.add(e+2,e+2,"0")}else if(!/^\d*$/.test(d[e])){a=!1;break}}return a&&u.current()?e(d,u.current()):d}export{s as remSep,o as version};
