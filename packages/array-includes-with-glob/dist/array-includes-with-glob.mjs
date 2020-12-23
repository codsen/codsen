/**
 * array-includes-with-glob
 * Like _.includes but with wildcards
 * Version: 2.13.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

import e from"matcher";var s="2.13.0";const t={arrayVsArrayAllMustBeFound:"any",caseSensitive:!0};function r(s,r,i){if(!s.length||!r.length)return!1;const a={...t,...i},n="string"==typeof s?[s]:Array.from(s);return"string"==typeof r?n.some((s=>e.isMatch(s,r,{caseSensitive:a.caseSensitive}))):"any"===a.arrayVsArrayAllMustBeFound?r.some((s=>n.some((t=>e.isMatch(t,s,{caseSensitive:a.caseSensitive}))))):r.every((s=>n.some((t=>e.isMatch(t,s,{caseSensitive:a.caseSensitive})))))}export{t as defaults,r as includesWithGlob,s as version};
