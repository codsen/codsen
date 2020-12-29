/**
 * string-overlap-one-on-another
 * Lay one string on top of another, with an optional offset
 * Version: 1.6.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-overlap-one-on-another/
 */

var t="1.6.0";const e={offset:0,offsetFillerCharacter:" "};function r(t,r,n){if("string"!=typeof t)throw Error(`string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ${JSON.stringify(t,null,4)}, which is type "${typeof t}"`);if("string"!=typeof r)throw Error(`string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ${JSON.stringify(r,null,4)}, which is type "${typeof r}"`);let s;if(n){if("object"!=typeof n)throw Error(`string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ${JSON.stringify(r,null,4)}, which is type "${typeof n}"`);if(s={...e,...n},s.offset){if(!Number.isInteger(Math.abs(s.offset)))throw Error(`string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ${JSON.stringify(r,null,4)}, which is type "${typeof r}"`)}else s.offset=0;s.offsetFillerCharacter||""===s.offsetFillerCharacter||(s.offsetFillerCharacter=" ")}else s=e;if(0===r.length)return t;if(0===t.length)return r;if(0>s.offset){return r+(Math.abs(s.offset)>r.length?s.offsetFillerCharacter.repeat(Math.abs(s.offset)-r.length):"")+t.slice(r.length-Math.abs(s.offset)>0?r.length-Math.abs(s.offset):0)}if(s.offset>0){return t.slice(0,s.offset)+(s.offset>t.length?s.offsetFillerCharacter.repeat(Math.abs(s.offset)-t.length):"")+r+(t.length-s.offset-r.length>0?t.slice(t.length-s.offset-r.length+1):"")}return r+(t.length>r.length?t.slice(r.length):"")}export{r as overlap,t as version};
