#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { bSlug } from "../dist/bitbucket-slug.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  bSlug("# Let's backwards-engineer BitBucket anchor link slug algorithm");

// action
runPerf(testme, callerDir);
