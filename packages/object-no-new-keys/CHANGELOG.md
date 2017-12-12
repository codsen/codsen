# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-12-12
### Changed
- ✨ Rebased in ES Modules
- ✨ Set up Rollup. Now we generate and serve three builds: CommonJS, UMD and ES Modules.
- ✨ Whole setup overhaul to match my latest understanding how things should be set.

## [1.1.0] - 2017-07-25
### Added
- ✨ Since mode is integer, some people might pass integer as a third argument (instead of if passing plain object, `{mode: 1||2}`. I added a human-friendly error message which explains it's wrong if it's happens.

### Removed
- `object-assign` from dependencies, switched to native ES6 `Object.assign`
- `type-detect` replacing it with 10 times lighter `lodash.isplainobject`

## 1.0.0 - 2017-05-15
### New
- First public release

[2.0.0]: https://github.com/codsen/object-no-new-keys/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/codsen/object-no-new-keys/compare/v1.0.0...v1.1.0
