![idea](https://glcdn.githack.com/codsen/codsen/raw/master/packages/chlu-cli/media/0_idea.png)


# chlu-cli

> CH-ange-L-og U-pdate - Automatically fix errors in your changelog file

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: `chlu` [on npm](https://www.npmjs.com/package/chlu), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/chlu)

## Table of Contents

- [Install](#install)
- [How it works](#how-it-works)
- [What it does](#what-it-does)
- [A nifty setup idea](#a-nifty-setup-idea)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g chlu-cli
```

Then, call it from the command line using keyword:

```bash
chlu
```

## How it works

This is a CLI app. Once installed, call it in the root folder where your `changelog.md` sits:

```bash
chlu
```

On a default setting, `chlu` just silently does the job — checks and fixes your changelog. If you want some output, call it with `--loud` flag. It will say "OK" each time it writes successfully.

Chlu works on both **Bitbucket** and **Github** (God bless M\$) repositories.

`chlu` stands for **CH**ange**L**og **U**pdate. We should note that all changelogs should follow the rules given by http://keepachangelog.com. Now, the tedious part is **diff links**. Chlu takes care of them. Also, changelog should have all dates in ISO format, should have diff links between changelog entries and use a consistent title format, for example, `## [1.11.0] - 2018-07-24`. These are main things, and `chlu-cli` automates updating all that.

**[⬆ back to top](#)**

## What it does

![features](https://glcdn.githack.com/codsen/codsen/raw/master/packages/chlu-cli/media/features_comp.png)

**7 main features (see above):**

1.  Wraps the version with a link (brackets) and creates the diff URL in the footer.
2.  Adds missing diff links in the footer. It's intelligent-enough to detect existing links and their order.
3.  If the `.git` repo data is successfully read, it will create/convert diff links either in Bitbucket- or Github-based repository changelogs.
4.  User account name in diff link is set correctly as per `package.json`
5.  Project's name in diff link is set correctly as per `package.json`
6.  "from" version is chosen wisely. If there is no `git` data available, a previous entry in the changelog will be used. But if there is, the real, previous version will be used. In practice, often there are many patch releases between changelog entries (hence the word used in the title — "notable changes"). If we merely calculated the diff between changelog entries (usually minor/major releases), all patch releases would get caught in between and skew the picture of what was released for real.
7.  If dates are not in [ISO format](https://en.wikipedia.org/wiki/ISO_8601) (year-month-date), we try to convert them. Couple well-known projects with messed-up changelogs are used as guinea pigs in our unit tests.

**[⬆ back to top](#)**

## A nifty setup idea

It would be tedious and unnecessary to run `chlu` manually. Not to mention, you might even forget to run it.

What I suggest, add `chlu` to one of your aliases, for example, `git add .`. That's what I do.

For example, edit your `.zshrc` (or Bash config, or whatever-you-are-using-shell's config) file to contain:

```
# create a function which runs commands if certain files exist, and skips if they don't:
my-git-add() {
  [ -e readme.md ] && doctoc readme.md
  [ -e changelog.md ] && chlu
  npm-check
  git add .
}

# create alias for your command, call the function:
alias gaa=my-git-add
```

The example above runs:

- [doctoc](https://www.npmjs.com/package/doctoc) on `readme.md` if it exists,
- then it runs [chlu](https://www.npmjs.com/package/chlu-cli) on `changelog.md` if it exists,
- then it runs [npm-check](https://www.npmjs.com/package/npm-check) and lastly,
- it runs the `git add .`.

It means, you always get your readme, changelog committed in a correct, updated state and all dependencies checked.

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. [Same tech](https://www.npmjs.com/package/update-notifier) that AVA or npm uses!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=chlu-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Achlu-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=chlu-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Achlu-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=chlu-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Achlu-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/chlu-cli
[cov-img]: https://img.shields.io/badge/coverage-89.19%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/chlu-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/chlu-cli
[downloads-img]: https://img.shields.io/npm/dm/chlu-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/chlu-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
