# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.5.0 (2026-09-01)

### Bug Fixes

- accept readonly array removal inputs ([804254d](https://github.com/codsen/codsen/commit/804254dac354c85ad20d831f9df65fbef78f4589))
- align null options type contract ([4693b8a](https://github.com/codsen/codsen/commit/4693b8a16cf2fcbf25b1166f13b567e7a9097995))
- align ranges-apply input types ([5db3a0b](https://github.com/codsen/codsen/commit/5db3a0be33ccdf6db2c43f1f940454a586e1f4ee))
- allow omitted surrogate inputs ([ae1f614](https://github.com/codsen/codsen/commit/ae1f6146d4a1e6e868e2612934bcc5e5dec95967))
- **ast-compare:** correct matching semantics ([2ebcd60](https://github.com/codsen/codsen/commit/2ebcd601c231a01043f46bc5afbcac2eaaf91db3))
- **ast-contains-only-empty-space:** harden traversal contracts ([34cd77e](https://github.com/codsen/codsen/commit/34cd77e9273347ec8d8c6c69bbc85ea89b8b9aa9))
- **ast-is-empty:** make traversal graph-safe ([653714b](https://github.com/codsen/codsen/commit/653714bc23a3cffe46099781f2d24f2f0ad5445a))
- **ast-monkey:** preserve traversal data semantics ([861b9fc](https://github.com/codsen/codsen/commit/861b9fc242abb9e6a06c665a80e884970276b22d))
- **check-types-mini:** harden validation contracts ([ee91068](https://github.com/codsen/codsen/commit/ee910686461b2fcc531a37710917ae6cd58118f2))
- enforce traversal tree inputs ([c539860](https://github.com/codsen/codsen/commit/c5398605891bca6e8074a9ab1cd8903489e0ddb0))
- expose parent declaration directly ([7b5ef85](https://github.com/codsen/codsen/commit/7b5ef851d1682235a6d94c738431be5ed50d1e38))
- make ast traversal stack-safe ([fce2227](https://github.com/codsen/codsen/commit/fce22270cbec4406974b3b89e964ec3e78584374))
- model fixed combination values ([9bbc12b](https://github.com/codsen/codsen/commit/9bbc12bda952db28e1081a8cb2df9c7eac2c3662))
- narrow trim range result type ([cd59232](https://github.com/codsen/codsen/commit/cd592322564c786a1d0b99187ef67762bca1d8e7))
- **object-delete-key:** make deletion linear and safe ([6d2623f](https://github.com/codsen/codsen/commit/6d2623fc25bc0a67f9f291c2e530d5f7584e7d27))
- **object-merge-advanced:** harden merge contracts ([a2908fa](https://github.com/codsen/codsen/commit/a2908fa22147628eaea643d82907bd9814d2d3b7))
- preserve broad arrayiffy result types ([326ab4b](https://github.com/codsen/codsen/commit/326ab4b55583dcb5cd676f571c10e147f9681c91))
- preserve proto data keys ([6747b19](https://github.com/codsen/codsen/commit/6747b198c8af2444b75856734422e495d28c11e1))
- publish recursive conversion types ([f01a9da](https://github.com/codsen/codsen/commit/f01a9dae93557fe59e84683f43267ec2583d728c))
- publish sound traversal types ([03f3d46](https://github.com/codsen/codsen/commit/03f3d467978a27d41a16599a17d6cccf15d35634))
- **remark-typography:** preserve phrasing context ([371dd5e](https://github.com/codsen/codsen/commit/371dd5e98481277017d90182e33125a96f179abd))
- remove stale detergent dependency ([ee87124](https://github.com/codsen/codsen/commit/ee8712468e96fcb9ea9bcc3ae13ebdad8bd0c7b2))
- **string-left-right:** align stop helper index types ([21a8768](https://github.com/codsen/codsen/commit/21a876865715da43bb7c20c1f97f6a41ba1078a8))
- **string-left-right:** type variadic match arguments ([f20a40a](https://github.com/codsen/codsen/commit/f20a40a3f6230180785b717cc747b8e4af79c3c0))
- **test-mixer:** isolate generated option values ([07111a6](https://github.com/codsen/codsen/commit/07111a6c852bac5cfad6b1dc4a5f11b48cb738de))
- **test-mixer:** type generated option rows ([8a4775c](https://github.com/codsen/codsen/commit/8a4775c56d2f2cee0e12655607e25fdb4e87e47a))
- **test-mixer:** validate input objects ([40a8cce](https://github.com/codsen/codsen/commit/40a8cceac1d76e0a823e301893ec3ea9efd33a2c))
- type whitespace passthrough values ([1bdf211](https://github.com/codsen/codsen/commit/1bdf2115dfee943d58e5dbf6518adb663a9e5407))
- **util-nonempty:** harden shallow value checks ([6f1eda6](https://github.com/codsen/codsen/commit/6f1eda6108ec38d15d30d4b3cb24a8880fcb4656))
- validate whitespace line break limits ([604e433](https://github.com/codsen/codsen/commit/604e4332634b6fdd285969126efa9f82457461d4))

### Features

- expand HTML attribute selector support ([dce1556](https://github.com/codsen/codsen/commit/dce15563659efaee1b739570346919daaddb575d))
- isolate diagnostic value formatting ([a7dc987](https://github.com/codsen/codsen/commit/a7dc987a57d3d39f175b942dd8244bdb896ada28))
- support exact AST path segments ([686e2a0](https://github.com/codsen/codsen/commit/686e2a0352be468cab356cace8615cd0b6be3242))
- **test-mixer:** bound eager combinations ([d3a9824](https://github.com/codsen/codsen/commit/d3a9824af4ae972f7e7a2b36991b0b412adb07bf))

### Performance Improvements

- accelerate literal array removals ([fbbd70c](https://github.com/codsen/codsen/commit/fbbd70ce3f35f903b09d150635d9ffa3d34737e9))
- avoid array matcher cache thrashing ([2daab5f](https://github.com/codsen/codsen/commit/2daab5fad46dbeadb0cfa2d0fe2876d9e6a7f876))
- establish corrected traversal baseline ([fd8b705](https://github.com/codsen/codsen/commit/fd8b705aec8373b1cd1e9b8e11dbcaacd15bf202))
- keep selector extraction linear ([ae03343](https://github.com/codsen/codsen/commit/ae03343dd4f29ffc33e80c67faaf4077cfd654a1))
- remove debug-only loop bookkeeping ([d97eb45](https://github.com/codsen/codsen/commit/d97eb453a69b649bba338eab2159fe4827582eed))
- streamline trim boundary scans ([98273ed](https://github.com/codsen/codsen/commit/98273ed6087fca18e4e525be426fd7ee7b825c92))
- **test-mixer:** stream boolean combinations ([21fb192](https://github.com/codsen/codsen/commit/21fb1924c978371023ba6386a7053059132d61f4))

## 0.4.0 (2026-08-22)

### Features

- **codsen-utils:** add reusable type and trim helpers ([d30a73f](https://github.com/codsen/codsen/commit/d30a73fe807afd129cd7b8e776fde1fc230628b9))

## 0.3.0 (2026-08-19)

### Bug Fixes

- **codsen-glob:** make the case-insensitive example filesystem-agnostic ([12ff568](https://github.com/codsen/codsen/commit/12ff568727b4475f9ce955808152ae2c75982bfb))
- do not store value into attrObj if empty quotes ([9faad8f](https://github.com/codsen/codsen/commit/9faad8f827f11a9d3ec5ab0597c8101ace60b951))
- make clean checkouts self-bootstrapping ([ac8b550](https://github.com/codsen/codsen/commit/ac8b55012a50d30e6cc5b1c0890024661f05c2f1))
- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
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

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
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
