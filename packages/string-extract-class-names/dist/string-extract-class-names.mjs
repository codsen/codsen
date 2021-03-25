/**
 * string-extract-class-names
 * Extracts CSS class/id names from a string
 * Version: 6.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-class-names/
 */

import{right as t,left as n}from"string-left-right";const r="6.0.10";function e(r){if("string"!=typeof r)throw new TypeError(`string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof r}, currently equal to ${JSON.stringify(r,null,4)}`);const e=".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`";let s;function l(t){return"string"==typeof t&&!!t.length&&(t.charCodeAt(0)>64&&t.charCodeAt(0)<91||t.charCodeAt(0)>96&&t.charCodeAt(0)<123)}let o=null;const i={res:[],ranges:[]};for(let u=0,c=r.length;u<=c;u++){null!==o&&u>=o&&(!r[u]||!r[u].trim()||e.includes(r[u]))&&(u>o+1&&(i.ranges.push([o,u]),i.res.push(`${s||""}${r.slice(o,u)}`),s&&(s=void 0)),o=null),!r[u]||null!==o||"."!==r[u]&&"#"!==r[u]||(o=u);const c=t(r,u+4);r.startsWith("class",u)&&"number"==typeof n(r,u)&&"["===r[n(r,u)]&&"number"==typeof c&&"="===r[c]&&(t(r,c)&&l(r[t(r,c)])?o=t(r,c):"'\"".includes(r[t(r,c)])&&l(r[t(r,t(r,c))])&&(o=t(r,t(r,c))),s=".");const a=t(r,u+1);r.startsWith("id",u)&&"["===r[n(r,u)]&&null!==a&&"="===r[a]&&(l(r[t(r,a)])?o=t(r,a):"'\"".includes(r[t(r,a)])&&l(r[t(r,t(r,a))])&&(o=t(r,t(r,a))),s="#")}return i.ranges.length||(i.ranges=null),i}export{e as extract,r as version};
