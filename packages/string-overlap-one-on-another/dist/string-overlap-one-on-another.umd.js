/**
 * string-overlap-one-on-another
 * Lay one string on top of another, with an optional offset
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-overlap-one-on-another/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).stringOverlapOneOnAnother={})}(this,(function(e){"use strict";const t={offset:0,offsetFillerCharacter:" "};e.overlap=function(e,n,r){if("string"!=typeof e)throw new Error(`string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ${JSON.stringify(e,null,4)}, which is type "${typeof e}"`);if("string"!=typeof n)throw new Error(`string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ${JSON.stringify(n,null,4)}, which is type "${typeof n}"`);let f;if(r){if("object"!=typeof r)throw new Error(`string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ${JSON.stringify(n,null,4)}, which is type "${typeof r}"`);if(f={...t,...r},f.offset){if(!Number.isInteger(Math.abs(f.offset)))throw new Error(`string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ${JSON.stringify(n,null,4)}, which is type "${typeof n}"`)}else f.offset=0;f.offsetFillerCharacter||""===f.offsetFillerCharacter||(f.offsetFillerCharacter=" ")}else f=t;if(0===n.length)return e;if(0===e.length)return n;if(f.offset<0){return n+(Math.abs(f.offset)>n.length?f.offsetFillerCharacter.repeat(Math.abs(f.offset)-n.length):"")+e.slice(n.length-Math.abs(f.offset)>0?n.length-Math.abs(f.offset):0)}if(f.offset>0){return e.slice(0,f.offset)+(f.offset>e.length?f.offsetFillerCharacter.repeat(Math.abs(f.offset)-e.length):"")+n+(e.length-f.offset-n.length>0?e.slice(e.length-f.offset-n.length+1):"")}return n+(e.length>n.length?e.slice(n.length):"")},e.version="2.0.12",Object.defineProperty(e,"__esModule",{value:!0})}));
