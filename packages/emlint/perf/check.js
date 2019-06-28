#!/usr/bin/env node

// deps
const path = require("path");
const callerDir = path.resolve(".");
const runPerf = require(path.resolve("../../scripts/run-perf.js"));

// setup
const { lint } = require("../");
const source = `< tAble><zzz yyy ="qqq"><aaa bbb="ccc"  ddd="eee"><aaa bbb= 'ccc'><aaa/    \n ><aaa bbb=\u201Cccc"><aaa bbb=\u201Dccc"><abc def="ghi" jkl= mno="pqr"/>
				<aaa bbb="ccc'/><aaa bbb=\u2018ccc'><zzz alt="><img alt=""><img alt"">
<zzz alt=zzz"><td alt='a b" something><a href="yz">mn ></a><a bc="de">< gh</a><a b="ccc"<d><a bcd=ef><a bcd=="ef"><a "bcd="ef"/>
<div>&nbbsp;</div><div>&nbbsp;</div>
<a b="c"d="e">

<script a="b" c="d" e="f" ghi jkl,
m cript>",
</script>

&amp; &amp; &amp;

<tag{%- if a > 0 -%}>

abc <! --<d>--> xyz

<a></a>&

<a something//>

<a something / / / / / / / /////  / /   >

<a something \\>

`;
const testme = () => lint(source);

// action
runPerf(testme, callerDir);
