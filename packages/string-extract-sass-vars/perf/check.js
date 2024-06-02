// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { extractVars } from "../dist/string-extract-sass-vars.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  extractVars(
    `// test file 01
// ------------------------------------------
$red:

#ff6565; // this is red
// $green: #63ffbd; // no green here
$yellow: #ffff65; // this is yellow
$blue: #08f0fd; // this is blue
$fontfamily: Helvetica, sans-serif;
$border: 1px solid #dedede;
$borderroundedness: 3px;
$customValue1: "trala; la";
$customValue2: trala: la;
$customValue3: tralala;
// don't mind this comment about #ff6565;
$customValue4: 10;
`,
  );

// action
runPerf(testme, callerDir);
