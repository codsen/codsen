/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.5.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-test-num/
 */

import e from"object-path";import{left as t}from"string-left-right";function s(e,t){if("string"!=typeof e||!e.length)return{};const s={offset:0,...t};let r=null,n=null;for(let t=0,a=e.length;t<=a;t++){if(null!==r&&"number"==typeof n&&(e[t]&&e[t].trim().length&&!/\d/.test(e[t])&&!["."].includes(e[t])||!e[t]))return{start:s.offset+r,end:s.offset+n+1,value:e.slice(r,n+1)};if(/^\d*$/.test(e[t])&&(n=t,null===r&&(r=t)),null===r&&e[t]&&e[t].trim()&&!/[\d.'"`]/.test(e[t]))return{}}return{}}const r=(e,t,s)=>"single"===e?t:`${t}.${`${s}`.padStart(2,"0")}`,n=new Set(["ok","notOk","true","false","assert","assertNot","error","ifErr","ifError","rejects","resolves","resolveMatchSnapshot","throws","throw","doesNotThrow","notThrow","expectUncaughtException"]),a=new Set(["emits","rejects","resolveMatch","throws","throw","expectUncaughtException","equal","equals","isEqual","is","strictEqual","strictEquals","strictIs","isStrict","isStrictly","notEqual","inequal","notEqual","notEquals","notStrictEqual","notStrictEquals","isNotEqual","isNot","doesNotEqual","isInequal","same","equivalent","looseEqual","looseEquals","deepEqual","deepEquals","isLoose","looseIs","notSame","inequivalent","looseInequal","notDeep","deepInequal","notLoose","looseNot","strictSame","strictEquivalent","strictDeepEqual","sameStrict","deepIs","isDeeply","isDeep","strictDeepEquals","strictNotSame","strictInequivalent","strictDeepInequal","notSameStrict","deepNot","notDeeply","strictDeepInequals","notStrictSame","hasStrict","match","has","hasFields","matches","similar","like","isLike","includes","include","contains","notMatch","dissimilar","unsimilar","notSimilar","unlike","isUnlike","notLike","isNotLike","doesNotHave","isNotSimilar","isDissimilar","type","isa","isA"]);var o={configs:{recommended:{plugins:["test-num"],rules:{"no-console":"off","test-num/correct-test-num":"error"}}},rules:{"correct-test-num":{create:o=>{let i=0;return{ExpressionStatement(l){if("CallExpression"===e.get(l,"expression.type")&&["test","only","skip","todo"].includes(e.get(l,"expression.callee.property.name"))&&["TemplateLiteral","Literal"].includes(e.get(l,"expression.arguments.0.type"))){i+=1;const u=`${i}`.padStart(2,"0");let p={};if(!p.value&&"TemplateLiteral"===e.get(l,"expression.arguments.0.type")&&e.has(l,"expression.arguments.0.quasis.0.value.raw")){const t=e.get(l,"expression.arguments.0.quasis.0.start"),r=e.get(l,"expression.arguments.0.range.0")+1,n=e.get(l,"expression.arguments.0.quasis.0.value.raw");s(n,{offset:t||r,returnRangesOnly:!0});const{start:a,end:o,value:i}=s(n,{offset:t||r,returnRangesOnly:!0})||{};"number"==typeof a&&"number"==typeof o&&i&&i!==u&&(p={start:a,end:o,value:u,node:e.get(l,"expression.arguments.0.quasis.0")})}if(!p.value&&"Literal"===l.expression.arguments[0].type&&l.expression.arguments[0].raw){const t=e.get(l,"expression.arguments.0.start"),r=e.get(l,"expression.arguments.0.range.0"),{start:n,end:a,value:o}=s(l.expression.arguments[0].raw,{offset:t||r,returnRangesOnly:!0})||{};"number"==typeof n&&"number"==typeof a&&o&&o!==u&&(p={start:n,end:a,value:u,node:l.expression.arguments[0]})}if(!p.value&&"ArrowFunctionExpression"===e.get(l,"expression.arguments.1.type")&&"BlockStatement"===e.get(l,"expression.arguments.1.body.type")&&e.get(l,"expression.arguments.1.body.body").length){let i="multiple",p=[];2===(p=e.get(l,"expression.arguments.1.body.body").filter((t=>"ExpressionStatement"===t.type&&"t"===e.get(t,"expression.callee.object.name")))).length&&"end"===e.get(p[p.length-1],"expression.callee.property.name")&&(i="single");const g=e.get(l,"expression.arguments.1.body.body");if(Array.isArray(g)){let l=0;for(let p=0,c=g.length;p<c;p++){const c=e.get(g[p],"expression.callee.property.name");if(!c)continue;let m;if(a.has(c)&&e.has(g[p],"expression.arguments.2")?m=2:n.has(c)&&e.has(g[p],"expression.arguments.1")&&(m=1),m){let t,n,a="";"TemplateLiteral"===e.get(g[p],`expression.arguments.${m}.type`)?(a=`expression.arguments.${m}.quasis.0`,t=e.get(g[p],`${a}.value.raw`),n=e.get(g[p],`${a}.start`),l+=1):"Literal"===e.get(g[p],`expression.arguments.${m}.type`)&&(a=`expression.arguments.${m}`,t=e.get(g[p],`${a}.raw`),n=e.get(g[p],`${a}.start`)||e.get(g[p],`${a}.range.0`),l+=1);const{start:c,end:d}=s(t,{offset:n,returnRangesOnly:!0})||{};if(!c||!d)continue;const f=r(i,u,l);a&&s(t).value!==f&&o.report({node:e.get(g[p],a),messageId:"correctTestNum",fix:e=>e.replaceTextRange([c,d],f)})}else{let s;if(a.has(c)&&Array.isArray(e.get(g[p],"expression.arguments"))&&2===e.get(g[p],"expression.arguments").length?s=2:n.has(c)&&Array.isArray(e.get(g[p],"expression.arguments"))&&1===e.get(g[p],"expression.arguments").length&&(s=1),s){const s=(e.get(g[p],"expression.end")||e.get(g[p],"expression.range.1"))-1,n=r(i,u,l),a=o.getSourceCode().getText(),c=s,m=(t(a,c)||0)+1;let d=`, "${n}"`;if(a.slice(m,c).includes("\n")){const e=Array.from(a.slice(m,c)).filter((e=>!"\r\n".includes(e))).join("");d=`,\n${e}  "${n}"\n${e}`}o.report({node:g[p],messageId:"correctTestNum",fix:e=>e.replaceTextRange([m,c],d)})}}}}}p.value&&o.report({messageId:"correctTestNum",node:p.node||l,fix:e=>e.replaceTextRange([p.start,p.end],p.value)})}}}},meta:{type:"suggestion",messages:{correctTestNum:"Update the test number."},fixable:"code"}}}};export default o;
