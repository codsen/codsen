/**
 * string-overlap-one-on-another
 * Lay one string on top of another, with an optional offset
 * Version: 2.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-overlap-one-on-another/
 */

const e="2.0.0",t={offset:0,offsetFillerCharacter:" "};function r(e,r,n){if("string"!=typeof e)throw new Error(`string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ${JSON.stringify(e,null,4)}, which is type "${typeof e}"`);if("string"!=typeof r)throw new Error(`string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ${JSON.stringify(r,null,4)}, which is type "${typeof r}"`);let s;if(n){if("object"!=typeof n)throw new Error(`string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ${JSON.stringify(r,null,4)}, which is type "${typeof n}"`);if(s={...t,...n},s.offset){if(!Number.isInteger(Math.abs(s.offset)))throw new Error(`string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ${JSON.stringify(r,null,4)}, which is type "${typeof r}"`)}else s.offset=0;s.offsetFillerCharacter||""===s.offsetFillerCharacter||(s.offsetFillerCharacter=" ")}else s=t;if(0===r.length)return e;if(0===e.length)return r;if(s.offset<0){return r+(Math.abs(s.offset)>r.length?s.offsetFillerCharacter.repeat(Math.abs(s.offset)-r.length):"")+e.slice(r.length-Math.abs(s.offset)>0?r.length-Math.abs(s.offset):0)}if(s.offset>0){return e.slice(0,s.offset)+(s.offset>e.length?s.offsetFillerCharacter.repeat(Math.abs(s.offset)-e.length):"")+r+(e.length-s.offset-r.length>0?e.slice(e.length-s.offset-r.length+1):"")}return r+(e.length>r.length?e.slice(r.length):"")}export{r as overlap,e as version};
