/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((t=t||self).stringLeftRight={})}(this,function(t){"use strict";function r(t,r){if("string"!=typeof t||!t.length)return null;if(r&&"number"==typeof r||(r=0),!t[r+1])return null;if(t[r+1]&&t[r+1].trim().length)return r+1;if(t[r+2]&&t[r+2].trim().length)return r+2;for(var e=r+1,n=t.length;e<n;e++)if(t[e].trim().length)return e;return null}function e(t,r){if("string"!=typeof t||!t.length)return null;if(r&&"number"==typeof r||(r=0),r<1)return null;if(t[r-1]&&t[r-1].trim().length)return r-1;if(t[r-2]&&t[r-2].trim().length)return r-2;for(var e=r;e--;)if(t[e]&&t[e].trim().length)return e;return null}function n(t,n,i,f){if("string"!=typeof n||!n.length)return null;if(i&&"number"==typeof i||(i=0),"right"===t&&!n[i+1]||"left"===t&&!n[i-1])return null;for(var l,u,o=i,g=[],h=0,s=f.length;h<s;h++)if(f[h].length){var p="right"===t?r(n,o):e(n,o);if("right"===t&&p>o+1?g.push([o+1,p]):"left"===t&&p<o-1&&g.unshift([p+1,o]),n[p]!==f[h])return null;o=p,"right"===t?(void 0===l&&(l=p),u=p):(void 0===u&&(u=p),l=p)}return void 0===l?null:{gaps:g,leftmostChar:l,rightmostChar:u}}t.left=e,t.right=r,t.rightSeq=function(t,e){for(var i=arguments.length,f=new Array(i>2?i-2:0),l=2;l<i;l++)f[l-2]=arguments[l];return f.length?n("right",t,e,f):r(t,e)},t.leftSeq=function(t,r){for(var i=arguments.length,f=new Array(i>2?i-2:0),l=2;l<i;l++)f[l-2]=arguments[l];return f.length?n("left",t,r,Array.from(f).reverse()):e(t,r)},Object.defineProperty(t,"__esModule",{value:!0})});
