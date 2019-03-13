/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((t=t||self).stringLeftRight={})}(this,function(t){"use strict";function r(t,r){if("string"!=typeof t||!t.length)return null;if(r&&"number"==typeof r||(r=0),!t[r+1])return null;if(t[r+1]&&t[r+1].trim().length)return r+1;if(t[r+2]&&t[r+2].trim().length)return r+2;for(var e=r+1,n=t.length;e<n;e++)if(t[e].trim().length)return e;return null}function e(t,r){if("string"!=typeof t||!t.length)return null;if(r&&"number"==typeof r||(r=0),r<1)return null;if(t[r-1]&&t[r-1].trim().length)return r-1;if(t[r-2]&&t[r-2].trim().length)return r-2;for(var e=r;e--;)if(t[e]&&t[e].trim().length)return e;return null}function n(t,n,f,i){if("string"!=typeof n||!n.length)return null;if(f&&"number"==typeof f||(f=0),!i.length)return"right"===t?r(n,f):e(n,f);if("right"===t&&!n[f+1]||"left"===t&&!n[f-1])return null;for(var u=f,l=[],o=0,g=i.length;o<g;o++)if(i[o].length){var h="right"===t?r(n,u):e(n,u);if("right"===t&&h>u+1?l.push([u+1,h]):"left"===t&&h<u-1&&l.unshift([h+1,u]),n[h]!==i[o])return null;u=h}return!l.length||l}t.left=e,t.right=r,t.rightSeq=function(t,r){for(var e=arguments.length,f=new Array(e>2?e-2:0),i=2;i<e;i++)f[i-2]=arguments[i];return n("right",t,r,f)},t.leftSeq=function(t,r){for(var e=arguments.length,f=new Array(e>2?e-2:0),i=2;i<e;i++)f[i-2]=arguments[i];return n("left",t,r,Array.from(f).reverse())},Object.defineProperty(t,"__esModule",{value:!0})});
