/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).stringLeftRight={})}(this,function(t){"use strict";t.left=function(t,e){if("string"!=typeof t||!t.length)return null;if(e&&"number"==typeof e||(e=0),e<1)return null;if(t[e-1]&&t[e-1].trim().length)return e-1;if(t[e-2]&&t[e-2].trim().length)return e-2;for(var n=e;n--;)if(t[n]&&t[n].trim().length)return n;return null},t.right=function(t,e){if("string"!=typeof t||!t.length)return null;if(e&&"number"==typeof e||(e=0),!t[e+1])return null;if(t[e+1]&&t[e+1].trim().length)return e+1;if(t[e+2]&&t[e+2].trim().length)return e+2;for(var n=e+1,r=t.length;n<r;n++)if(t[n].trim().length)return n;return null},Object.defineProperty(t,"__esModule",{value:!0})});
