/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-is-empty/
 */

import e from"lodash.isplainobject";const r="2.0.11";function t(r){let n,l,i=!0;if(Array.isArray(r)){if(0===r.length)return!0;for(n=0,l=r.length;n<l;n++){if(i=t(r[n]),null===i)return null;if(!i)return!1}}else if(e(r)){if(0===Object.keys(r).length)return!0;for(n=0,l=Object.keys(r).length;n<l;n++){if(i=t(r[Object.keys(r)[n]]),null===i)return null;if(!i)return!1}}else{if("string"!=typeof r)return null;if(0!==r.length)return!1}return i}export{t as isEmpty,r as version};
