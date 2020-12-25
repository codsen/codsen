/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 1.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-object/
 */

import r from"lodash.clonedeep";import t from"lodash.isplainobject";import{compare as o}from"ast-compare";var i="1.10.1";function a(r){return null!=r}function e(i,s,n,c=[]){if(!a(i))throw Error("ast-get-object: [THROW_ID_01] First argument is missing!");if(!a(s))throw Error("ast-get-object: [THROW_ID_02] Second argument is missing!");let f=!1;a(n)&&Array.isArray(n)&&(f=!0);let m=r(i);return t(m)?o(m,s)?f?n.length>0&&(m=n[0],n.shift()):c.push(m):Object.keys(m).forEach((r=>{(Array.isArray(m[r])||t(m[r]))&&(f?m[r]=e(m[r],s,n,c):e(m[r],s,n,c))})):Array.isArray(m)&&m.forEach(((r,o)=>{(t(m[o])||Array.isArray(m[o]))&&(f?m[o]=e(m[o],s,n,c):e(m[o],s,n,c))})),!1!==(u=n)&&a(u)?m:c;var u}function s(r,t,o){return e(r,t,o)}export{s as getObj,i as version};
