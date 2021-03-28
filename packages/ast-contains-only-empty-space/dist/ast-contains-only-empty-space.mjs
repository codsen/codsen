/**
 * ast-contains-only-empty-space
 * Does AST contain only empty space?
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-contains-only-empty-space/
 */

import{traverse as t}from"ast-monkey-traverse";function r(r){if("string"==typeof r)return!r.trim();if(!["object","string"].includes(typeof r)||!r)return!1;let e=!0;return r=t(r,((t,r,n,o)=>{const i=void 0!==r?r:t;return"string"==typeof i&&i.trim()&&(e=!1,o.now=!0),i})),e}export{r as empty};
