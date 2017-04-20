# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2017-04-20
### New
- If any key's value contains only a heads or tails marker and nothing else, it will not throw. You can force throwing (that's previous version's behaviour) setting `opts.noSingleMarkers` to `true`. But the default is `false`.
### Improved
- Did some rebasing of the code.

## [1.1.0] - 2017-04-06
### Improved
- Fixed one edge case where source was array, it was querying variable from `_data` key store, which was in turn querying variable from its own key data store.
- More tests to keep coverage at 100%

## 1.0.0 - 2017-03-28
### New
- First public release

[1.1.0]: https://github.com/code-and-send/json-variables/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/code-and-send/json-variables/compare/v1.1.0...v1.2.0
