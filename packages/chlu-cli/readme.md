# chlu-cli

> CH-ange-L-og U-pdate - Automatically fix errors in your changelog file

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Table of Contents](#markdown-header-markdown-header-table-of-contents)
- [Install](#markdown-header-markdown-header-install)
- [What it does](#markdown-header-markdown-header-what-it-does)
- [Extras](#markdown-header-markdown-header-extras)
- [A nifty setup idea](#markdown-header-markdown-header-a-nifty-setup-idea)
- [Updating it](#markdown-header-markdown-header-updating-it)
- [Wishlist](#markdown-header-markdown-header-wishlist)
- [Contributing](#markdown-header-markdown-header-contributing)
- [Licence](#markdown-header-markdown-header-licence)

## Install

```bash
npm i -g chlu-cli
```

Yes, install globally. This is a CLI app. Once installed, call it in the root where your Changelog sits:

```bash
chlu
```

There's no config, if just silently does the job, checks and fixes your Changelog.

**[⬆ back to top](#)**

## What it does

`chlu` stands for CHangeLog Update. To start, your changelogs should follow the rules given by http://keepachangelog.com. In practice, often two things happen:

1.  I copy a changelog from one library to another to use as a template and forget to amend everything that needed to be amended. CHLU would fix that.
2.  I am too lazy and deliberately leave some work for CHLU, for example, linking titles with magic GitHub diff URL's. I know CHLU will fix those.

**Here are all the fixes that CHLU can apply:**

**[⬆ back to top](#)**

### 1. Missing diff URLs in the footer for newly-added titles

This is the primary reason I created `chlu`. Often I clone the previous title and feature description but forget to clone and edit the **title's link in the footer**. `chlu` will scan all titles and add the missing links in the footer. Working on the changelog of this very repo:

![](chlu_adds_missing_diff_links.gif)

Observe how I can delete footer links and they are restored by `chlu`! Magic!

In practice, this means your titles become actually linked (before/after example below):

![](feature1.gif)

**[⬆ back to top](#)**

### 2. Wrong package/user in the diff URL

This has happened to me before, actually on Detergent's repo even. I copied and edited the changelog from my other library and forgot to edit the package name in the footer diff links. For example, `PUT_A_WRONG_NAME_OF_THE_PACKAGE_HERE` below would get replaced by the correct name fresh from your `package.json`:

```md
[1.4.0]: https://github.com/codsen/PUT_A_WRONG_PACKAGE_HERE/compare/v1.3.0...v1.4.0
```

Same with wrong user names in the URL.

**[⬆ back to top](#)**

### 3. Automatic title linking (where it's missing)

I believe that every title in the changelog should be linked to a GitHub's magic diff view, showing what was added between those two versions.

Chlu will scan the titles and add GitHub magic diff links between each title. The smallest version's title won't get a link.

For example, if you have:

```md
## 3.1.2 (2017-03-17)

blablabla

## 3.1.1 (2017-03-01)

blablabla

## 3.1.0 (2017-02-27)

blablabla
```

If would add links on `3.1.2` (comparing it against `3.1.1`) and `3.1.1` (comparing it against `3.1.0`).

**[⬆ back to top](#)**

### 4. Automatic date conversion

As long as your titles follow reasonable patterns, `chlu` will recognise and convert the dates into a correct format. Also, it will add missing dash between the version and the date.

For example, all titles below would get converted to the same thing: `## [3.1.2] - 2017-03-17`:

```md
## 3.1.2 (2017-3-17)

## 3.1.2 (2017-03-17)

## 3.1.2 (March 17th, 2017)

## 3.1.2 (March 17th, 2017)

## 3.1.2 (March 17, 2017)

## 3.1.2 2017-3-17

## 3.1.2 2017-03-17

## 3.1.2 March 17th, 2017

## 3.1.2 March 17, 2017

## 3.1.2 March 17, 2017

## 3.1.2 - (2017-3-17)

## 3.1.2 - (2017-03-17)

## 3.1.2 - (March 17th, 2017)

## 3.1.2 - (March 17th, 2017)

## 3.1.2 - (March 17, 2017)

## 3.1.2 - 2017-3-17

## 3.1.2 - 2017-03-17

## 3.1.2 - March 17th, 2017

## 3.1.2 - March 17, 2017

## 3.1.2 - March 17, 2017

...and many other date combinations
```

That's thanks to amazing [dehumanize-date](https://www.npmjs.com/package/dehumanize-date).

**[⬆ back to top](#)**

## Extras

Since the order of the features is descending, the default order of title Markdown links in the footer should also be descending. That's also how example in http://keepachangelog.com is set. I dislike that. Personally, I find it difficult to visually `grep` the links if they are in descending order. That's why `chlu` will respect the **existing** order of your footer links and add the missing link **in order you've already got**. If all your title links are missing, the default order is sensible _descending_. In the meantime, I'll keep my footer links in an _ascending_ order.

**[⬆ back to top](#)**

## A nifty setup idea

It would be tedious and unnecessary to run `chlu` manually. Not to mention, you might even forget to run it.

What I suggest, add `chlu` to one of your aliases, for example, `git add .`. That's what I do.

For example, edit your `.zshrc` (or Bash config, or whatever-you-are-using-shell's config) file to contain:

```
# create a function which runs commands if certain files exist, and skips if they don't:
my-git-add() {
  [ -e readme.md ] && doctoc readme.md
  [ -e readme.md ] && bitsausage
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
- then it runs [bitsausage](https://github.com/codsen/bitsausage) if it detects you use BitHound,
- then it runs [npm-check](https://www.npmjs.com/package/npm-check) and lastly,
- it runs the `git add .`.

It means, you always get your readme, changelog, BitHound config (`.bithoundrc`) committed in a correct, updated state. Also it will notify you if any of your dependencies are outdated or unused. Just install all the packages above globally, with `-g` flag.

The example above is growing; I want to automate _everything_. Literally.

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. [Same tech](https://www.npmjs.com/package/update-notifier) that AVA or npm uses!

**[⬆ back to top](#)**

## Wishlist

My biggest next challenge for CHLU is to tap the Git data. If we did that, we could automatically fill/fix the versions! Also, diff links currently calculate the GitHub diff URL from the latest entry in the changelog. This can be imprecise, because often between the minor releases, I create bunch of minor edits on readme etc. bumping the patch digit. Those patch releases never reach into changelog, so they get included in the diff.

For example, I released `1.1.0` and put entry in changelog. Then I edited readme and patched to `1.1.1`. Then new feature is released with `1.2.0` and its diff link is (currently) generated between `1.1.0` and `1.2.0`, including my readme patch `1.1.1`. That would be fixed if I tapped the Git data.

Also, with Git data, even if you cloned the last entry, I would be able to detect that and delete its contents, set today's date, bump minor version and link diff correctly to the latest commit in Git.

That would be awesome!

**[⬆ back to top](#)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/chlu-cli/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/chlu-cli/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/chlu-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/chlu-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/chlu-cli
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/chlu-cli/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/chlu-cli?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/chlu-cli
[downloads-img]: https://img.shields.io/npm/dm/chlu-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/chlu-cli
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/chlu-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/chlu-cli
