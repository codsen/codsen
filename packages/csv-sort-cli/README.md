# csv-sort-cli

> Command line app to sort double-entry CSVs coming from internet banking statements

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: `csv-sort` [on npm](https://www.npmjs.com/package/csv-sort), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort)

## Table of Contents

- [Install](#install)
- [Call on a file](#call-on-a-file)
- [Or omit the file's name](#or-omit-the-files-name)
- [What it does exactly](#what-it-does-exactly)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g csv-sort-cli
```

Then, call it from the command line using one of the following keywords:

```bash
csvsort
sortcsv
```

## Call on a file

Call `csvsort` (or `sortcsv`) appending your file name (with or without `-o`/`--overwrite` flag):

```bash
$ csvsort YOURFILE.csv

$ csvsort -o YOURFILE.csv
$ csvsort --overwrite YOURFILE.csv
$ csvsort -v
$ csvsort --version
$ csvsort -h
$ csvsort --help
```

**like this:**

![calling directly on a file](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort-cli/media/example1.gif)

**[⬆ back to top](#)**

## Or omit the file's name

It will let you pick a CSV:

```bash
$ csvsort # omit the file's name, but you can include -o/--overwrite flag
```

omit the file name and `csv-sort-cli` will offer a list of CSV files in the current folder to choose from:

![calling without specifying a file name](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort-cli/media/example2.gif)

You can even try it without installing — use `npx`:

```bash
$ npx csv-sort-cli YOURFILE.csv
```

**[⬆ back to top](#)**

## What it does exactly

1.  It **sorts CSV file rows** to correspond to the [double-entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) principles:

![double bookkeeping example](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort/media/img1.png)

Sometimes internet banking CSV's have rows in a wrong order, especially when entries are on the _same date_. This library helps to sort the rows in correct order.

2.  As a bonus, it will **trim** the empty columns/rows:

![2D trim of a CSV contents](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort/media/img2.png)

3.  Not to mention, the our custom CSV parser ([npm](https://www.npmjs.com/package/csv-split-easy), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy)) used here will ensure that all CSV cell _contents_ are trimmed, and there are no empty rows between the content rows. It also accepts any commas as content if the cell is wrapped with a double quotes. Read more in its repo's readme [on npm](https://www.npmjs.com/package/csv-split-easy), or [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy)).

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same tool](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-sort-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-sort-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-sort-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-sort-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=csv-sort-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acsv-sort-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/csv-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
