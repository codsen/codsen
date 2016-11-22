# array-pull-all-with-glob

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> pullAllWithGlob - like _.pullAll but pulling stronger, with globs

[![Build Status](https://travis-ci.org/code-and-send/array-pull-all-with-glob.svg?branch=master)](https://travis-ci.org/code-and-send/array-pull-all-with-glob) [![bitHound Overall Score](https://www.bithound.io/github/code-and-send/array-pull-all-with-glob/badges/score.svg)](https://www.bithound.io/github/code-and-send/array-pull-all-with-glob) [![bitHound Dependencies](https://www.bithound.io/github/code-and-send/array-pull-all-with-glob/badges/dependencies.svg)](https://www.bithound.io/github/code-and-send/array-pull-all-with-glob/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/code-and-send/array-pull-all-with-glob/badges/devDependencies.svg)](https://www.bithound.io/github/code-and-send/array-pull-all-with-glob/master/dependencies/npm) [![Downloads/Month](https://img.shields.io/npm/dm/array-pull-all-with-glob.svg)](https://www.npmjs.com/package/array-pull-all-with-glob)

## Pulling

Let's say you have an array of strings and another array of strings to remove from the first array. That's easy to achieve with Lodash's [_.pullAll](https://lodash.com/docs/#pullAll). However, what if you are not sure what the to-be-removed strings exactly look like, or there are many of them, like `module-1`, `module-2`, ... `module-99` and so on?

You need be able to put a _glob_ in a search query, that is a string pattern (`*`), which means _any character from here on_.

Check it out how easy it is to pull (remove) some strings from an array:

```js
source = ['something', 'module-1', 'module-2', 'module-jhkgdhgkhdfghdkghfdk']
whitelist = ['module-*']
pullAllWithGlob(source, whitelist)
// => ['something']
```

I needed this library for whitelisting to-be-deleted classes in upcoming [email-remove-unused-css](https://github.com/code-and-send/email-remove-unused-css).

## Install

```bash
$ npm install --save array-pull-all-with-glob
```

## API

```js
pullAllWithGlob (
  incomingArray,   // input array of strings
  whitelistArray   // strings to pull
);
```

## Test

```bash
$ npm test
```

Uses AVA.

## Contributing & testing

All contributions welcome. This library uses [Standard JavaScript](https://github.com/feross/standard) notation. See `test.js`. It's very minimalistic unit testing setup using [AVA](https://github.com/avajs/ava).

```bash
npm test
```

If you see anything incorrect whatsoever, [raise an issue](https://github.com/code-and-send/array-pull-all-with-glob/issues). PR's welcome too.

## Licence

MIT © [Roy Reveltas](https://github.com/revelt)
