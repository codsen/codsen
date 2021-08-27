#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { stri } from "../dist/stristri.esm.js";

const testme = () =>
  stri(`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Title here</title>
  </head>
  <body>
    {% if something %}foo{% else %}bar{% endif %}
  </body>
</html>`);

// action
runPerf(testme, callerDir);
