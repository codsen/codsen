// Quick Take

import { strict as assert } from "assert";

import { extractVars } from "../dist/string-extract-sass-vars.esm.js";

assert.deepEqual(
  extractVars(`// all variables are here!!!
// ------------------------------------------
$red: #ff6565; // this is red
// $green: #63ffbd; // no green here
$yellow: #ffff65; // this is yellow
$blue: #08f0fd; // this is blue
$fontfamily: Helvetica, sans-serif;
$border: 1px solid #dedede;
$borderroundedness: 3px;
$customValue1: tralala;
$customValue2: tralala;
// don't mind this comment about #ff6565;
$customValue3: 10;`),
  {
    red: "#ff6565",
    yellow: "#ffff65",
    blue: "#08f0fd",
    fontfamily: "Helvetica, sans-serif",
    border: "1px solid #dedede",
    borderroundedness: "3px",
    customValue1: "tralala",
    customValue2: "tralala",
    customValue3: 10,
  },
);
