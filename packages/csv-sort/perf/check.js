// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { sort } from "../dist/csv-sort.esm.js";

const callerDir = path.resolve(".");

const source = `
Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;
const testme = () => sort(source);

// action
runPerf(testme, callerDir);
