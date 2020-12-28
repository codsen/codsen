/**
 * string-extract-class-names
 * Extract class (or id) name from a string
 * Version: 5.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-class-names/
 */

import{right as t,left as r}from"string-left-right";var e="5.10.1";function n(e){if("string"!=typeof e)throw new TypeError(`string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof e}, currently equal to ${JSON.stringify(e,null,4)}`);const n=".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`";let s;function l(t){return"string"==typeof t&&!!t.length&&(t.charCodeAt(0)>64&&91>t.charCodeAt(0)||t.charCodeAt(0)>96&&123>t.charCodeAt(0))}let o=null;const i={res:[],ranges:[]};for(let u=0,c=e.length;c>=u;u++){null===o||o>u||e[u]&&e[u].trim()&&!n.includes(e[u])||(u>o+1&&(i.ranges.push([o,u]),i.res.push(`${s||""}${e.slice(o,u)}`),s&&(s=void 0)),o=null),!e[u]||null!==o||"."!==e[u]&&"#"!==e[u]||(o=u);const c=t(e,u+4);e.startsWith("class",u)&&"number"==typeof r(e,u)&&"["===e[r(e,u)]&&"number"==typeof c&&"="===e[c]&&(t(e,c)&&l(e[t(e,c)])?o=t(e,c):"'\"".includes(e[t(e,c)])&&l(e[t(e,t(e,c))])&&(o=t(e,t(e,c))),s=".");const a=t(e,u+1);e.startsWith("id",u)&&"["===e[r(e,u)]&&"="===e[a]&&(l(e[t(e,a)])?o=t(e,a):"'\"".includes(e[t(e,a)])&&l(e[t(e,t(e,a))])&&(o=t(e,t(e,a))),s="#")}return i.ranges.length||(i.ranges=null),i}export{n as extract,e as version};
