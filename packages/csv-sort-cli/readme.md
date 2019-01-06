# csv-sort-cli

> Command line app to sort double-entry CSVs coming from internet banking statements

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: [csv-sort](https://bitbucket.org/codsen/csv-sort)

## Table of Contents

- [Install globally, call `csvsort` on a file](#markdown-header-install-globally-call-csvsort-on-a-file)
- [or, omit the file's name, it will let you pick a CSV:](#markdown-header-or-omit-the-files-name-it-will-let-you-pick-a-csv)
- [What it does exactly](#markdown-header-what-it-does-exactly)
- [Updating it](#markdown-header-updating-it)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install globally, call `csvsort` on a file

```bash
$ npm i -g csv-sort-cli
```

- then, either call `csvsort` (or `sortcsv`) appending your file name (with or without `-o`/`--overwrite` flag):

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

![calling directly on a file](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort-cli/media/example1.gif)

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## or, omit the file's name, it will let you pick a CSV:

```bash
$ csvsort # omit the file's name, but you can include -o/--overwrite flag
```

omit the file name and `csv-sort-cli` will offer a list of CSV files in the current folder to choose from:

![calling without specifying a file name](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort-cli/media/example2.gif)

You can even try it without installing — use `npx`:

```bash
$ npx csv-sort-cli YOURFILE.csv
```

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## What it does exactly

1.  It **sorts CSV file rows** to correspond to the [double-entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) principles:

![double bookkeeping example](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort/media/img1.png)

Sometimes internet banking CSV's have rows in a wrong order, especially when entries are on the _same date_. This library helps to sort the rows in correct order.

2.  As a bonus, it will **trim** the empty columns/rows:

![2D trim of a CSV contents](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/csv-sort/media/img2.png)

3.  Not to mention, the [our custom CSV parse](https://bitbucket.org/codsen/csv-split-easy) used here will ensure that all CSV cell _contents_ are trimmed, and there are no empty rows between the content rows. It also accepts any commas as content if the cell is wrapped with a double quotes. Read more in [its repo's readme](https://bitbucket.org/codsen/csv-split-easy).

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same tool](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=csv-sort-cli%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=csv-sort-cli%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=csv-sort-cli%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-csv-sort-cli)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/csv-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/csv-sort-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/csv-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/csv-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/csv-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort-cli
