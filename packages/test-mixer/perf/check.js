// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { mixer } from "../dist/test-mixer.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  mixer(
    {
      foo: true,
    },
    {
      foo: true,
      bar: false,
      baz: {
        a: {
          b: {
            c: 9,
          },
        },
      },
    },
  );

// action
runPerf(testme, callerDir);
