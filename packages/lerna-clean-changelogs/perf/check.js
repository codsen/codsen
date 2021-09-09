#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const source = `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.0 (2018-12-26)

### Bug Fixes

- aaa

### Features

- bbb
`;
const testme = () => cleanChangelogs(source);

// action
runPerf(testme, callerDir);
