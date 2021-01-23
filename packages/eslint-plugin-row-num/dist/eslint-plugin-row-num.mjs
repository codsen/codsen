/**
 * eslint-plugin-row-num
 * ESLint plugin to update row numbers on each console.log
 * Version: 1.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/eslint-plugin-row-num/
 */

import{fixRowNums as e}from"js-row-num";var r={configs:{recommended:{plugins:["row-num"],rules:{"no-console":"off","row-num/correct-row-num":"error"}}},rules:{"correct-row-num":{create:r=>({CallExpression(t){t.callee&&"MemberExpression"===t.callee.type&&t.callee.object&&"Identifier"===t.callee.object.type&&"console"===t.callee.object.name&&t.callee.property&&"Identifier"===t.callee.property.type&&"log"===t.callee.property.name&&t.arguments&&Array.isArray(t.arguments)&&t.arguments.length&&t.arguments.forEach((a=>{"Literal"===a.type&&"string"==typeof a.raw&&a.raw!==e(a.raw,{overrideRowNum:a.loc.start.line,returnRangesOnly:!1,extractedLogContentsWereGiven:!0})?r.report({node:t,messageId:"correctRowNum",fix:r=>{const t=e(a.raw,{overrideRowNum:a.loc.start.line,returnRangesOnly:!0,extractedLogContentsWereGiven:!0});if(t){return r.replaceTextRange([a.start+t[0][0],a.start+t[0][1]],t[0][2])}}}):"TemplateLiteral"===a.type&&Array.isArray(a.quasis)&&a.quasis.length&&"object"==typeof a.quasis[0]&&a.quasis[0].value&&a.quasis[0].value.raw&&a.quasis[0].value.raw!==e(a.quasis[0].value.raw,{overrideRowNum:a.loc.start.line,returnRangesOnly:!1,extractedLogContentsWereGiven:!0})&&r.report({node:t,messageId:"correctRowNum",fix:r=>{const t=e(a.quasis[0].value.raw,{overrideRowNum:a.loc.start.line,returnRangesOnly:!0,extractedLogContentsWereGiven:!0});if(t){return r.replaceTextRange([a.start+1+t[0][0],a.start+1+t[0][1]],t[0][2])}}})}))}}),meta:{type:"suggestion",messages:{correctRowNum:"Update the row number."},fixable:"code"}}}};export default r;
