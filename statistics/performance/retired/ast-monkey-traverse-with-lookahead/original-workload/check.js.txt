// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

const callerDir = path.resolve(".");

const input = {
  a: {
    b: {
      c: "c_val",
      d: "d_val",
      e: "e_val",
    },
    f: {
      g: {
        h: ["1", "2", "3"],
        i: [
          "4",
          "5",
          {
            j: "k",
          },
        ],
        l: ["7", "8", "9"],
      },
    },
  },
};
const testme = () => {
  let futureNodes = 0;
  traverse(
    input,
    (_key, _val, innerObj) => {
      futureNodes += innerObj.next.length;
    },
    1,
  );
  return futureNodes;
};

// action
runPerf(testme, callerDir);
