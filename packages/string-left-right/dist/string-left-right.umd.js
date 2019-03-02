/**
 * string-left-right
 * Look what's to the left or to the right of a given index within a string
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).stringRangeExpander={})}(this,function(e){"use strict";e.left=function(e,t){if("string"!=typeof e||!e.length)return null;if(t&&"number"==typeof t||(t=0),t<1)return null;if(e[t-1]&&e[t-1].trim().length)return t-1;if(e[t-2]&&e[t-2].trim().length)return t-2;for(var n=t;n--;)if(e[n]&&e[n].trim().length)return n;return null},e.right=function(e,t){if("string"!=typeof e||!e.length)return null;if(t&&"number"==typeof t||(t=0),!e[t+1])return null;if(e[t+1]&&e[t+1].trim().length)return t+1;if(e[t+2]&&e[t+2].trim().length)return t+2;for(var n=t+1,r=e.length;n<r;n++)if(e[n].trim().length)return n;return null},Object.defineProperty(e,"__esModule",{value:!0})});
