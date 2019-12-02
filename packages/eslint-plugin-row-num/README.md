# eslint-plugin-row-num

updates row numbers in front of each encountered console.log

There is also a CLI version of this, `js-row-num-cli` ([npm](https://www.npmjs.com/package/js-row-num-cli)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli/))
See the API, the npm package, `js-row-num` ([npm](https://www.npmjs.com/package/js-row-num)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num/))

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-row-num`:

```
$ npm install eslint-plugin-row-num --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-row-num` globally.

## Usage

Add `row-num` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "row-num"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "row-num/correct-row-num": 2
    }
}
```

## Supported Rules

At the moment there is only one rule, `correct-row-num`. It checks, are row numbers correct on all `console.log`s and if they're not, auto-fixes them.

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors
