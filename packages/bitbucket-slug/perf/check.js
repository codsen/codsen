#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { bSlug } from "../dist/bitbucket-slug.esm.js";

const testme = () =>
  bSlug("# Let's backwards-engineer BitBucket anchor link slug algorithm");

// action
runPerf(testme, callerDir);
