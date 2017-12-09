# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0] - 2017-12-09
### Changed
- ✨ Rebased in ES node_modules
- ✨ Set up the Rollup (nice rhyming). Now we generate CommonJS, UMD and ES Module (native code) builds.
- ✨ Set up raw ESLint on `airbnb-base` preset with semicolons off. Also linting for AVA unit tests.

## 2.0.0 - 2017-03-02
### Changed
- ✨ In order to prevent accidental input argument mutation when object is given, now we're throwing a type error when the input argument is present, but of a wrong type. That's enough to warrant a major API change under semver.

[3.0.0]: https://github.com/codsen/detect-is-it-html-or-xhtml/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/codsen/detect-is-it-html-or-xhtml/compare/v1.6.0...v2.0.0
