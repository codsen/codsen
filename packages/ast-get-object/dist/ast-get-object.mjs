/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 2.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-object/
 */

import r from"lodash.clonedeep";import t from"lodash.isplainobject";import{compare as o}from"ast-compare";const e="2.0.6";function i(r){return null!=r}function n(e,s,a,c=[]){if(!i(e))throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");if(!i(s))throw new Error("ast-get-object: [THROW_ID_02] Second argument is missing!");let f=!1;i(a)&&Array.isArray(a)&&(f=!0);let m=r(e);return t(m)?o(m,s)?f?a.length>0&&(m=a[0],a.shift()):c.push(m):Object.keys(m).forEach((r=>{(Array.isArray(m[r])||t(m[r]))&&(f?m[r]=n(m[r],s,a,c):n(m[r],s,a,c))})):Array.isArray(m)&&m.forEach(((r,o)=>{(t(m[o])||Array.isArray(m[o]))&&(f?m[o]=n(m[o],s,a,c):n(m[o],s,a,c))})),!1!==(u=a)&&i(u)?m:c;var u}function s(r,t,o){return n(r,t,o)}export{s as getObj,e as version};
