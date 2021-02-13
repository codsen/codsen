/**
 * ast-loose-compare
 * Compare anything: AST, objects, arrays and strings
 * Version: 2.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-loose-compare/
 */

import{empty as r}from"ast-contains-only-empty-space";import e from"lodash.isplainobject";const t="2.0.4";function n(t,i,f){function s(r){return null!=r}let o,l;if(void 0===f){if(!s(t)||!s(i))return}else if(!s(t)||!s(i))return!1;if(f=f||!0,typeof t!=typeof i)return!(!r(t)||!r(i));if(Array.isArray(t)&&Array.isArray(i)){if(!(i.length>0))return!!(0===i.length&&0===t.length||r(i)&&r(t));for(o=0,l=i.length;o<l;o++)if(Array.isArray(i[o])||e(i[o])){if(!(f=n(t[o],i[o],f)))return!1}else if(i[o]!==t[o])return!(!r(i[o])||!r(t[o]))}else if(e(t)&&e(i)){if(!(Object.keys(i).length>0))return!!(0===Object.keys(i).length&&0===Object.keys(t).length||r(i)&&r(t));{const s=Object.keys(i);for(o=0,l=s.length;o<l;o++)if(Array.isArray(i[s[o]])||e(i[s[o]])||"string"==typeof i[s[o]]){if(!(f=n(t[s[o]],i[s[o]],f)))return!1}else if(!(i[s[o]]===t[s[o]]||r(i[s[o]])&&r(t[s[o]])))return!1}}else{if("string"!=typeof t||"string"!=typeof i)return!(!r(i)||!r(t));if(t!==i)return!(!r(i)||!r(t))}return f}function i(r,e){return n(r,e)}export{i as looseCompare,t as version};
