import path from "node:path";
import { runPerf } from "../../../ops/scripts/perf.js";
import { decode } from "../dist/html-entity-codec.esm.js";

const callerDir = path.resolve(".");
const input = "Tea &amp; biscuits &#x1F36A; &notit; &NotEqualTilde; ".repeat(
  100,
);
const testme = () => decode(input);

runPerf(testme, callerDir);
