![idea](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/chlu-cli/media/0_idea.png)

# chlu-cli

> CH-ange-L-og U-pdate - Automatically fix errors in your changelog file

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install globally](#markdown-header-install-globally)
- [What it does](#markdown-header-what-it-does)
- [A nifty setup idea](#markdown-header-a-nifty-setup-idea)
- [Updating it](#markdown-header-updating-it)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install globally

```bash
npm i -g chlu-cli
```

This is a CLI app. Once installed, call it in the root folder where your `changelog.md` sits:

```bash
chlu
```

On a default setting, `chlu` just silently does the job — checks and fixes your changelog. If you want some output, call it with `--loud` flag. It will say "OK" each time it writes successfully.

Chlu works on both **Bitbucket** and **Github** (God bless M\$) repositories.

`chlu` stands for **CH**ange**L**og **U**pdate. We should note that all changelogs should follow the rules given by http://keepachangelog.com. Now, the tedious part is **diff links**. Chlu takes care of them. Also, changelog should have all dates in ISO format, should have diff links between changelog entries and use a consistent title format, for example, `## [1.11.0] - 2018-07-24`. These are main things, and `chlu-cli` automates updating all that.

**[⬆ back to top](#markdown-header-chlu-cli)**

## What it does

![features](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/chlu-cli/media/features_comp.png)

**7 main features (see above):**

1.  Wraps the version with a link (brackets) and creates the diff URL in the footer.
2.  Adds missing diff links in the footer. It's intelligent-enough to detect existing links and their order.
3.  If the `.git` repo data is successfully read, it will create/convert diff links either in Bitbucket- or Github-based repository changelogs.
4.  User account name in diff link is set correctly as per `package.json`
5.  Project's name in diff link is set correctly as per `package.json`
6.  "from" version is chosen wisely. If there is no `git` data available, a previous entry in the changelog will be used. But if there is, the real, previous version will be used. In practice, often there are many patch releases between changelog entries (hence the word used in the title — "notable changes"). If we merely calculated the diff between changelog entries (usually minor/major releases), all patch releases would get caught in between and skew the picture of what was released for real.
7.  If dates are not in [ISO format](https://en.wikipedia.org/wiki/ISO_8601) (year-month-date), we try to convert them. Couple well-known projects with messed-up changelogs are used as guinea pigs in our unit tests.

**[⬆ back to top](#markdown-header-chlu-cli)**

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

**[⬆ back to top](#markdown-header-chlu-cli)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. [Same tech](https://www.npmjs.com/package/update-notifier) that AVA or npm uses!

**[⬆ back to top](#markdown-header-chlu-cli)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=chlu-cli%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=chlu-cli%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=chlu-cli%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-chlu-cli)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/chlu-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/chlu-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/chlu-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/chlu-cli
[downloads-img]: https://img.shields.io/npm/dm/chlu-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/chlu-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/chlu-cli
