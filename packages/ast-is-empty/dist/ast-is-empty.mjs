/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 1.11.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-is-empty/
 */

import r from"lodash.isplainobject";var e="1.11.0";function t(e){let n,l,i=!0;if(Array.isArray(e)){if(0===e.length)return!0;for(n=0,l=e.length;l>n;n++){if(i=t(e[n]),null===i)return null;if(!i)return!1}}else if(r(e)){if(0===Object.keys(e).length)return!0;for(n=0,l=Object.keys(e).length;l>n;n++){if(i=t(e[Object.keys(e)[n]]),null===i)return null;if(!i)return!1}}else{if("string"!=typeof e)return null;if(0!==e.length)return!1}return i}export{t as isEmpty,e as version};
