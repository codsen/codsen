/**
 * array-includes-with-glob
 * Like _.includes but with wildcards
 * Version: 3.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

import e from"matcher";const s="3.0.1",t={arrayVsArrayAllMustBeFound:"any",caseSensitive:!0};function i(s,i,r){if(!s.length||!i.length)return!1;const n={...t,...r},a="string"==typeof s?[s]:Array.from(s);return"string"==typeof i?a.some((s=>e.isMatch(s,i,{caseSensitive:n.caseSensitive}))):"any"===n.arrayVsArrayAllMustBeFound?i.some((s=>a.some((t=>e.isMatch(t,s,{caseSensitive:n.caseSensitive}))))):i.every((s=>a.some((t=>e.isMatch(t,s,{caseSensitive:n.caseSensitive})))))}export{t as defaults,i as includesWithGlob,s as version};
