# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.3.0 (2026-08-18)

### Bug Fixes

- **codsen-glob:** make the case-insensitive example filesystem-agnostic ([12ff568](https://github.com/codsen/codsen/commit/12ff568727b4475f9ce955808152ae2c75982bfb))
- do not store value into attrObj if empty quotes ([9faad8f](https://github.com/codsen/codsen/commit/9faad8f827f11a9d3ec5ab0597c8101ace60b951))
- make clean checkouts self-bootstrapping ([ac8b550](https://github.com/codsen/codsen/commit/ac8b55012a50d30e6cc5b1c0890024661f05c2f1))
- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve review findings REV-004 through REV-007 ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- trim production type dependencies ([426e081](https://github.com/codsen/codsen/commit/426e081f78e72bf3caecc138b339722309630dd8))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))
- replace string-strip-html's per-tag range re-merge with a ranges-push predicate ([913a9f6](https://github.com/codsen/codsen/commit/913a9f6323e5d4b7f95c9f282e0dacfcf145c128))

### Performance Improvements

- stop shipping a debug-only scan in string-fix-broken-named-entities ([47996ea](https://github.com/codsen/codsen/commit/47996ea45423bc34e61f37822387c6308259dc62))
- stop shipping debug-only work in published bundles ([6fe5fee](https://github.com/codsen/codsen/commit/6fe5feebdf726b553ae3034690634166b461fca5))

### Reverts

- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 0.2.51 (2022-12-23)

### Bug Fixes

- update the latest version for `string-strip-html` ([8c25d73](https://github.com/codsen/codsen/commit/8c25d7349ed324303257af576d6d3574318b8d14))

## 0.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 0.1.38 (2022-08-03)

### Bug Fixes

- remove postinstall script from @codsen/data ([9949590](https://github.com/codsen/codsen/commit/9949590e8340aa56d1dc53eea6ed0f17dee9471a))

## 0.1.5 (2022-04-19)

### Bug Fixes

- prepare data to be released ([5d10682](https://github.com/codsen/codsen/commit/5d10682e98c9ee2886d94aef07a2bf49c25cc88c))

## 0.1.0 (2022-04-10)

### Features

- merge in the data repo ([57a44ac](https://github.com/codsen/codsen/commit/57a44ac66032ff716529472d68f6522db4a59273))
