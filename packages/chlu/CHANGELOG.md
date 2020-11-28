# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.8.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- remove accidentally added chlu-cli from deps ([d671eb9](https://git.sr.ht/~royston/codsen/commits/d671eb98bd59206cfd3a77aed08338bbef804f50))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Bitbucket support ([c3ff18e](https://git.sr.ht/~royston/codsen/commits/c3ff18e02862dacec949902618811d66fc7ae027))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- support only changelog data, no package.json or git tags ([142b047](https://git.sr.ht/~royston/codsen/commits/142b0474f5ab00966ec3198b9c07bf3b038868c3))

### Performance Improvements

- remove dependency lodash.reverse and switch to native ([121abc0](https://git.sr.ht/~royston/codsen/commits/121abc07a8ffe730c980550422cda9f06f32f670))

## 3.7.46 (2019-10-05)

### Performance Improvements

- remove dependency lodash.reverse and switch to native ([121abc0](https://gitlab.com/codsen/codsen/commit/121abc0))

## 3.7.38 (2019-08-15)

### Bug Fixes

- remove accidentally added chlu-cli from deps ([d671eb9](https://gitlab.com/codsen/codsen/commit/d671eb9))

## 3.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-12-26)

- ✨ Bitbucket support ([c3ff18e](https://gitlab.com/codsen/codsen/tree/master/packages/chlu/commits/c3ff18e))
- ✨ Support only changelog data, no package.json or git tags ([142b047](https://gitlab.com/codsen/codsen/tree/master/packages/chlu/commits/142b047))

## 3.2.0 (2018-10-14)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 3.1.0 (2018-06-14)

- ✨ Now we really support input with only `changelog.md` data (no package.json, no git tags data)

## 3.0.0 (2018-06-13)

API changes - new input argument - `gitTags` comes as 2nd, and existing arguments from 2nd (inclusive) onwards shift by one place further.
It's necessary so that we could accomodate the Git tag customisations.

- ✨ Provider: GitHub or BitBucket is extracted automatically from `package.json`. You probably noticed, BitBucket's versions in diff URL are backwards (later version goes first) and separator between versions is `%0D`. Not to mention different root.
- ✨ If the repo already has diff links in changelog but in a wrong provider's format (GitHub vs BitBucket, either way), `chlu` will reference the `package.json` and will correct the diff links automatically.
- ✨ If second (newly added) argument is provided, diffs will be rendered more precisely — namely, diff link will be calculated not from the release, last mentioned in the CHANGELOG, but from its last patch release. This is because between feature (minor/major) releases which get mentioned in CHANGELOG I produce numerous patch maintenance releases: updates, setup tweaks and whatnot which are not mentioned in CHANGELOG. Since those are not mentioned, diff link doesn't pick them up and up until now, it didn't even know they existed because Git info was not tapped. Until now, that is. We tapped Git data and [chlu-cli](https://www.npmjs.com/package/chlu-cli) will provide it to us when it will be "driving" the action.

## 2.10.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 2.9.0 (2018-03-10)

- ✨ Switched from deprecated `posthtml-ast-contains-only-empty-space` ([npm](https://www.npmjs.com/package/posthtml-ast-contains-only-empty-space), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/posthtml-ast-contains-only-empty-space)) to fresh `ast-contains-only-empty-space` ([npm](https://www.npmjs.com/package/ast-contains-only-empty-space), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-contains-only-empty-space))
- ✨ Updated all dependencies
- 💥 Removing UMD build - nobody's gonna use this library in a browser

## 2.8.0 (2018-01-23)

- ✨ Test-fodder libraries' licences at the bottom of readme
- ✨ Updated all depdendencies

## 2.7.0 (2017-12-08)

- ✨ Set up Rollup and now we generate 3 flavours: CommonJS, UMD and ES Modules. Source is now in ES Modules.

## 2.6.0 (2017-11-27)

- ✨ Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolons override.
- ✨ Since JS Standard is lagging on checks, I had to make some rebasing too.
- ✨ Tweaked the algorithm, specifically the part which identifies the titles (like `## 2.6.0 (2017-11-27)` above this bullet list, as opposed to the link lines in the footer). Now it's required for a title to have a `#` to be considered a title.

## 2.5.0 (2017-07-23)

- ✨ Now mixed marker dates such as `2014/04-20` are recognised. Updated unit tests accordingly. Thanks to [dehumanize-date](https://github.com/ForbesLindesay/dehumanize-date/commit/7b4a27477a2bfdb614a4eb74c7972d5eea529480) by [forbeslindsay](https://github.com/ForbesLindesay).

## 2.4.0 (2017-07-22)

- ✨ Now when date in title is unrecognised, cleaning of the title will still happen: letter "v" in front of version digits will be removed (if it exists), whatever-date will be trimmed out of usual separators like minus, dash etc and separated by a single minus-dash.
- ✨ Did I mention, new erroneous title format `## v0.3.17 / 2016-03-23` is recognised and fixed automatically? It's letter `v` and/or dash separating the version and date.
- ✨ Copyrights and licences in README mentioning real-life changelogs used in unit tests.
- ✨ All Lodash deps are now set to `*`, _the latest_.
- ✨ Removed bunch of irrelevant lines from unit test dummy package.json's
- ✨ Updated the documentation and licence with the up-to-date author name

## 2.3.0 (2017-07-04)

- ✨ Now supports `[YANKED]`, `YANKED`, `[yanked]` and `yanked` in the titles. Exactly as per [keepachangelog](http://keepachangelog.com/) spec.

## 2.2.0 (2017-06-29)

- ✨ Avoids false positives coming from semver pattern used within regular text
- ✨ Improved date extraction what will lead to less unrecognised dates in title

## 2.1.1 (2017-06-28)

- ✨ Added n-dash, m-dash, tab, comma, full stop and non-breaking space to the list of what's being trimmed after link titles. This means, bigger variation of non-standard titles would get recognised and there will be less chance that the remainder will not get recognised by `dehumanize-date`.

## 2.0.0 (2017-06-26)

- ✨ Merged getRepoInfo and setRepoInfo. This might prevent some bugs when both algorithms are not the same. I anticipate to improve getter/setter algorithms in the future and it's easier when both are within the same function. The only difference between getter and setter is presence of second argument - if it's not provided, it's get. If it is, it's set.
- ✨ Footer link versions within GitHub magic diff links are validated and fixed if necessary. Fixes in include wrong versions (before and/or after), missing or multiple letters `v` before version and complete rubbish within any of the parts of the footer link (like text instead of diff link's version, in the URL).
- ✨ Empty lines between footer versions are deleted.
- ✨ Added safeguards against some edge cases where footer links are broken but in a sneaky way similar to real-ones, like `[3.0.0.]: whatever`. Now they're recognised and removed (and new-ones, correct-ones are generated if needed).

## 1.3.0 (2017-06-23)

- ✨ Now GitHub magic diff links will be added for all titles except the smallest version-one.
- ✨ Chlu will remove unused footer links. For now, only the links from recognised headers are cleaned (what should cover all normal use cases compliant with keepachangelog.com).

## 1.2.0 (2017-05-19)

- ✨ If the empty row above footer links is missing, it will be added.

## 1.1.0 (2017-05-17)

- ✨ Added this changelog. Ha!
- ✨ Improved the algorithm of adding missing links, case when mid-range links are missing now leaves footer links in a correct order.
- ✨ Added more unit tests to maintain a total 100% coverage.
- ✨ Improved readme

## 1.0.0 (2017-05-16)

- 🌟 First public release
