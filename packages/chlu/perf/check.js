#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const source = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## 1.3.0 - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/correct-lib/compare/v1.3.0...v1.4.0
`;
const testme = () => f(source);

// action
runPerf(testme, callerDir);
