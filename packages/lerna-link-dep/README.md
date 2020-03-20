# lerna-link-dep

> CLI to symlink a local package to the current package in Lerna monorepo

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [TLDR](#tldr)
- [Purpose](#purpose)
- [Extras — supports CLI's](#extras--supports-clis)
- [Against `lerna link`](#against-lerna-link)
- [The finest ingredients](#the-finest-ingredients)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g lerna-link-dep
```

Then, call it from the command line using one of the following keywords:

```bash
deplink
linkdep
```

As a last resort, if your memory would fail, the alternative keyword is: `johnnydepp` — remember the actor, DEPP as in _Johnny Dependency_ - just type his full name and surname.

**[⬆ back to top](#)**

## TLDR

Task: install "detergent" as dep on package "object-all-values-equal-to".
Both are sibling packages of the same monorepo of ours.

Git clone monorepo, navigate to the root of the package "object-all-values-equal-to" and type in the terminal:

```bash
deplink "detergent"
```

That's it. Symlink is created from `<monorepo root>/packages/object-all-values-equal-to/node_modules/detergent` pointing to `<monorepo root>/packages/detergent`

**PS.** If the linked dependency is not in package.json yet, it will be added among `dependencies`. If you want it added to `devDependencies` instead, add `-d` or `--dev` flag when calling the CLI, for example,

```bash
deplink "detergent" -d
deplink "detergent" --dev
```

🍻🍺💪🏼💥🍻👍🏻

**[⬆ back to top](#)**

## Purpose

Imagine, you have a Lerna monorepo and you are in the root of package "a".

You want to symlink another package from the same monorepo, "b" as dependency.

Well, you can copy-paste "b" name into "a"'s package.json, set correct version value and run `lerna bootstrap` (also probably wipe all dependencies before `bootstrap`).

But it's tedious and slow.

But you just want a symlink created, in abstract terms,

```js
ln -s __dirname/"a" __dirname/"b"/node_modules/"a"
```

You don't want to run whole `lerna bootstrap` just for this!

Well, this CLI does solves this problem.

You navigate to the root of a package from a monorepo and say `linkdep xyz` where `xyz` is your local, neighbour package.

Symlink is created for it in `node_modules`. If Lerna's folder tree was clean before, it will still be clean now.

Happy days.

🍺🍺🍻🍻🍻🍺💪🏼💥🍻👍🏻

**[⬆ back to top](#)**

## Extras — supports CLI's

If your package ("b" from example above) is a CLI, symlinks will be put one level deeper, instead of within `node_modules`, for each entry in `bin` from package.json, a symlink will be created in `node_modules/.bin/`, pointing not to the root of the package "b" but straight to the file that `bin` entry in package.json was pointing to.

For example, lerna-clean-changelogs-cli ([gitlab](https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs-cli/), [npm](https://www.npmjs.com/package/lerna-clean-changelogs-cli)) of ours has the following `bin` entry in its `package.json`:

```json
"bin": {
  "lcc": "cli.js",
  "lernacleanchangelog": "cli.js"
}
```

If you git-cloned our monorepo and wanted to link package `lerna-clean-changelogs-cli` to another package, two symlinks would be created, one for `lcc` and another for `lernacleanchangelog`, both pointing to the same file, `cli.js`.

PS. If you wonder, what happens if a package is both CLI and normal package (has both "main" and "bin" keys in `package.json`)? It will still work — both sets of symlinks will be created.

🍻🍺💪🏼🍻💪🏼🍻💥

**[⬆ back to top](#)**

## Against `lerna link`

According to lerna link [documentation](https://github.com/lerna/lerna/tree/master/commands/link), `lerna link` "symlinks together all packages that are dependencies of each other". But we want just to symlink one!

Personally, I never used `lerna link`; I always added package's name manually and ran `wipe` and `bootstrap` each time.

By the way, it's not just me, people complain about it at Lerna's issues board [here](https://github.com/lerna/lerna/issues/2011), [here](https://github.com/lerna/lerna/issues/1839) and [here](https://github.com/lerna/lerna/issues/2029).

Well, now those days are gone, we have a simple dependency linker at last.

🍺💥🍻💪🏼🍻🍻💪🏼🍻

**[⬆ back to top](#)**

## The finest ingredients

Only the finest ~dependencies~ ingredients are used in this CLI:

- [`fs-extra`](https://www.npmjs.com/package/fs-extra) - for promise-based I/O
- [`execa`](https://www.npmjs.com/package/execa) - to run shell processes, the `ln -s` part
- [`meow`](https://www.npmjs.com/package/meow) - to bootstrap the CLI
- [`update-notifier`](https://www.npmjs.com/package/update-notifier) - to remind users if currently installed CLI is outdated

🍻💪🏼🍻🍻💪🏼🍻💥

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-link-dep%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-link-dep%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-link-dep%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-link-dep%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-link-dep%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-link-dep%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-link-dep
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/lerna-link-dep
[downloads-img]: https://img.shields.io/npm/dm/lerna-link-dep.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/lerna-link-dep
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
