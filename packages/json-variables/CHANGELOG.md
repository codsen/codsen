# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.1.0 - 2017-04-06
### Improved
- Fixed one edge case where source was array, it was querying variable from `_data` key store, which was in turn querying variable from its own key data store.
- More tests to keep coverage at 100%

## 1.0.0 - 2017-03-28
### New
- First public release
