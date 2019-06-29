/**
 * string-extract-class-names
 * Extract class (or id) name from a string
 * Version: 5.8.27
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-class-names
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).stringExtractClassNames=n()}(this,function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}return function(n,e){if(void 0===n)throw new Error("string-extract-class-names: [THROW_ID_01] input must not be undefined!");if("string"!=typeof n)throw new TypeError("string-extract-class-names: [THROW_ID_02] first input should be string, not ".concat(t(n),", currently equal to ").concat(JSON.stringify(n,null,4)));if(null!=e&&e){if("boolean"!=typeof e)throw new TypeError("string-extract-class-names: [THROW_ID_03] second input argument should be a Boolean, not ".concat(t(n),", currently equal to ").concat(JSON.stringify(n,null,4)))}else e=!1;for(var o=null,r=[],l=0,u=n.length;l<u;l++)null===o||!".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`".includes(n[l])&&0!==n[l].trim().length||(l>o+1&&(e?r.push([o,l]):r.push(n.slice(o,l))),o=null),null!==o||"."!==n[l]&&"#"!==n[l]||(o=l),l+1===u&&null!==o&&l>o&&(e?r.push([o,u]):r.push(n.slice(o,u)));return r}});
