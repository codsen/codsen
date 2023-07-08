#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { detectIsItHTMLOrXhtml } from "../dist/detect-is-it-html-or-xhtml.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  detectIsItHTMLOrXhtml(
    '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>',
  );

// action
runPerf(testme, callerDir);
