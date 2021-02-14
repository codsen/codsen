/**
 * string-overlap-one-on-another
 * Lay one string on top of another, with an optional offset
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-overlap-one-on-another/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).stringOverlapOneOnAnother={})}(this,(function(e){"use strict";function t(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function n(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?r(Object(o),!0).forEach((function(r){t(e,r,o[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}var o={offset:0,offsetFillerCharacter:" "};e.overlap=function(e,t,r){if("string"!=typeof e)throw new Error("string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as "+JSON.stringify(e,null,4)+', which is type "'+typeof e+'"');if("string"!=typeof t)throw new Error("string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as "+JSON.stringify(t,null,4)+', which is type "'+typeof t+'"');var i;if(r){if("object"!=typeof r)throw new Error("string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as "+JSON.stringify(t,null,4)+', which is type "'+typeof r+'"');if((i=n(n({},o),r)).offset){if(!Number.isInteger(Math.abs(i.offset)))throw new Error("string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as "+JSON.stringify(t,null,4)+', which is type "'+typeof t+'"')}else i.offset=0;i.offsetFillerCharacter||""===i.offsetFillerCharacter||(i.offsetFillerCharacter=" ")}else i=o;return 0===t.length?e:0===e.length?t:i.offset<0?t+(Math.abs(i.offset)>t.length?i.offsetFillerCharacter.repeat(Math.abs(i.offset)-t.length):"")+e.slice(t.length-Math.abs(i.offset)>0?t.length-Math.abs(i.offset):0):i.offset>0?e.slice(0,i.offset)+(i.offset>e.length?i.offsetFillerCharacter.repeat(Math.abs(i.offset)-e.length):"")+t+(e.length-i.offset-t.length>0?e.slice(e.length-i.offset-t.length+1):""):t+(e.length>t.length?e.slice(t.length):"")},e.version="2.0.5",Object.defineProperty(e,"__esModule",{value:!0})}));
