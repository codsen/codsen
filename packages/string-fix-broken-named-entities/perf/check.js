#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(`&&NbSpzzz&&NbSpzzz
  y &isindot; z
  &nsp;
  &pound
  z &ang y
  x &ang y&ang z
  text&angtext&angtext
  text&pitext&pitext
  text&pivtext&pivtext
  text&Pitext&Pitext
  text&pivtext&pivtext
  text &ang text&ang text text &ang text&ang text text &ang text&ang text
  x &Pound2; y
  &Acd;
  &#163;
  &#xA3;
  one pound;
  y &nbs; z
  y &nbp; z
  &nbs;&nbp;
`);

// action
runPerf(testme, callerDir);
