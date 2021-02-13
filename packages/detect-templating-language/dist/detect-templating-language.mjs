/**
 * detect-templating-language
 * Detects various templating languages present in string
 * Version: 2.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-templating-language/
 */

import{isJinjaNunjucksRegex as t}from"regex-is-jinja-nunjucks";import{isJSP as e}from"regex-is-jsp";import{isJinjaSpecific as n}from"regex-jinja-specific";const r="2.0.4";function i(r){let i=null;if("string"!=typeof r)throw new TypeError(`detect-templating-language: [THROW_ID_01] Input must be string! It was given as ${JSON.stringify(r,null,4)} (type ${typeof r}).`);return r?(t().test(r)?(i="Nunjucks",n().test(r)&&(i="Jinja")):e().test(r)&&(i="JSP"),{name:i}):{name:i}}export{i as detectLang,r as version};
