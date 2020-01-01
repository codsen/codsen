<div align="center">
  <h1>lerna-clean-changelogs-cli</h1>
</div>

<div align="center">
  <p><img alt="lerna-clean-changelogs-cli" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/lerna-clean-changelogs-cli/media/deleted.png" width="680" align="center"></p>
</div>

<div align="center"><p>CLI application to cleanse the lerna-generated changelogs</p></div>

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: `lerna-clean-changelogs` [on npm](https://www.npmjs.com/package/lerna-clean-changelogs), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs)

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [Purpose](#purpose)
- [The proof of the pudding is in the eating](#the-proof-of-the-pudding-is-in-the-eating)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g lerna-clean-changelogs-cli
```

Then, call it from the command line using one of the following keywords:

```bash
lcc
lernacleanchangelog
```

## Use it

Once installed, call it one of two ways:

```bash
$ lcc
$ lernacleanchangelog
```

PS. That dollar sign above just means it's a terminal. Never type that dollar sign!

## Purpose

This application performs the following cleaning steps on all encountered `changelog.md`'s:

1. It removes bump-only changelog entries that `conventional-changelog` generates. For example:

   ```
   **Note:** Version bump only for package ranges-apply
   ```

   These will be deleted along with their headings.

2. It removes diff links from headings. Change the following:

   ```
   ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.9.1 (2018-12-27)
   ```

   Diff links that changelog generator produces are not universal between GitLab, GitHub and BitBucket and sometimes there are bugs in them.

3. Remove `h1` headings and turn them into `h2`, with the exception of the first, main heading of the changelog.

   For exampe, change the following:

   ```
   # [2.0.0](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.0.0...ranges-apply@1.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.0.0 (2018-12-27)
   ```

   (notice how a second `#` character is added, beside link being removed)

---

More features will follow.

**[⬆ back to top](#)**

## The proof of the pudding is in the eating

Here's how we use it ourselves.

In short, GitLab CI calls package.json script and it cleanses the changelogs before npm package is published to npm and all builds are comitted from CI to git.

In long, have a look at our GitLab CI yml:

```yml
deploy:
  except:
    - tags
  image: node:latest
  stage: deploy
  script:
    - git config --global credential.helper store
    - git remote set-url origin https://gitlab-ci-token:$PERSONAL_ACCESS_TOKEN@gitlab.com/codsen/codsen.git
    - git config --global user.email "$GITLAB_USER_EMAIL"
    - git config --global user.name "$YOUR_NAME_SURNAME"
    - npm set unsafe-perm true -g
    - npm set //registry.npmjs.org/:_authToken $NPM_TOKEN -g
    - npm set username $NPM_USERNAME -g
    - npm set email $NPM_EMAIL -g
    - echo "git user:"
    - git config user.name
    - echo "npm user:"
    - npm whoami
    - echo '█████████████████████████████ 1 █████████████████████████████'
    - git status
    - git checkout master
    - echo '█████████████████████████████ 2 █████████████████████████████'
    - git status
    - npm run fresh
    - echo '█████████████████████████████ 3 █████████████████████████████'
    - git status
    - npm run readme:generate
    - npm run info
    - echo '█████████████████████████████ 4 █████████████████████████████'
    - git status
    - git add packages
    - git add stats
    - git add readme.md
    - "git diff-index --quiet HEAD || git commit -m '[skip ci] chore: automated build tasks' --no-verify"
    - npx lerna changed
    - npm run pub:vers
    - echo '█████████████████████████████ 5 █████████████████████████████'
    - git status
    - git rm -f packages/ava/CHANGELOG.md || true
    - git rm -f packages/domutils/CHANGELOG.md || true
    - git add packages
    - git add readme.md
    - echo '█████████████████████████████ 6 █████████████████████████████'
    - git status
    - "git commit -m '[skip ci] chore: automated build tasks' --no-verify"
    - echo '█████████████████████████████ 7 █████████████████████████████'
    - git status
    - npm run republish
    - echo '█████████████████████████████ 8 █████████████████████████████'
    - git status
    - git push origin master
    - echo '█████████████████████████████ 9 █████████████████████████████ - done'
```

At the end of step four, there's a line:

```
- npm run pub:vers
```

That's how CI calls npm script. By the way, "lerna-clean-changelogs-cli" can be called at the first place because our monorepo root package.json has it as a dependency:

```
"devDependencies": {
  ...
  "lerna-clean-changelogs-cli": "^1.2.37",
  ...
}
```

In the package.json, `pub:vers` looks like this:

```
"pub:vers": "lerna version --conventional-commits --no-commit-hooks --yes && lernacleanchangelog '**'",
```

We call `lerna version` and then we call `lernacleanchangelog` — the call name for `lerna-clean-changelogs-cli`. We could also call `lcc` instead but it's more descriptive, considering you come back after months and wonder what is such and such command...

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-clean-changelogs-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-clean-changelogs-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-clean-changelogs-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-clean-changelogs-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-clean-changelogs-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-clean-changelogs-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/lerna-clean-changelogs-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/lerna-clean-changelogs-cli
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs-cli
[cov-img]: https://img.shields.io/badge/coverage-77.5%25-yellow.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/lerna-clean-changelogs-cli
[downloads-img]: https://img.shields.io/npm/dm/lerna-clean-changelogs-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/lerna-clean-changelogs-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
