# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2021-01-23)


### Bug Fixes

* add requirement for loose array contents object matching - there must be more than 1 obj ([089b565](https://github.com/codsen/codsen/commit/089b56530c2b4ba0cafe359314e15527e0cc455f))
* fix score calculation ([128a969](https://github.com/codsen/codsen/commit/128a9690aaad12bc11e3db97bf7ce324648f6734))


### Features

* init ([9448308](https://github.com/codsen/codsen/commit/9448308b4ddd16b0e1fc6d008462f7ae32c8addc))
* opts.arrayStrictComparison (set to false by default) ([a3345d6](https://github.com/codsen/codsen/commit/a3345d6016d832a265b9afe22351fd1172ad4097))
* pass the path as the third argument to cb() ([2a46309](https://github.com/codsen/codsen/commit/2a463094a668e2ea67e1998c83bf35a350a7febc))
* rewrite in TS and start using named exports ([3e15bd3](https://github.com/codsen/codsen/commit/3e15bd3ad49cb570083e56289cba3ab53800afb6))


### BREAKING CHANGES

* previously you'd consume a default export: "import deepContains from ..." - now use
"import { deepContains } from ..."
* initial release





## 2.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.1.0 (2019-11-27)

### Bug Fixes

- add requirement for loose array contents object matching - there must be more than 1 obj ([e90ee45](https://gitlab.com/codsen/codsen/commit/e90ee453df8c3924dbaa6401a70824ba9ab03600))
- fix score calculation ([3601ce2](https://gitlab.com/codsen/codsen/commit/3601ce282fb3f186531198ffb61ad41c1bb3e31b))

### Features

- opts.arrayStrictComparison (set to false by default) ([ef8fcdd](https://gitlab.com/codsen/codsen/commit/ef8fcdd63ec2e31a8ed673e56e64f88171ffe275))

## 1.0.0 (2019-11-11)

- ✨ First public release.
