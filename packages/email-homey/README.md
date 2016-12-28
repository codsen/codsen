# email-homey

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Generate homepage in the root containing all your templates, by folder

[![bitHound Overall Score](https://www.bithound.io/github/code-and-send/email-homey/badges/score.svg)](https://www.bithound.io/github/code-and-send/email-homey) [![bitHound Dependencies](https://www.bithound.io/github/code-and-send/email-homey/badges/dependencies.svg)](https://www.bithound.io/github/code-and-send/email-homey/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/code-and-send/email-homey/badges/devDependencies.svg)](https://www.bithound.io/github/code-and-send/email-homey/master/dependencies/npm)

## Install

```sh
$ npm install --save email-homey
```

## Use

```js
var homey = require('email-homey')
```

## Test

```sh
$ npm test
```

## Purpose

If and when you use a Build System for generate email marketing templates, in the root directory, at minimum, you have:

```
root
│
├─ ("modules", "node_modules", "images" folders)
│
├─ dist
│  │
│  └─ template_1_folder
│  │  └─ screenshot.png
│  │  └─ index.html
│  │
│  └─ template_2_folder
│     └─ screenshot.png
│     └─ index.html
│
└─ templates
   │
   └─ template_1_folder
   │  └─ index.json
   │  └─ index.njk
   │
   └─ template_2_folder
      └─ index.html
      └─ index.njk
```

When you use [BrowerSync](https://www.npmjs.com/package/browser-sync) in Gulp and set BrowserSync root as `/dist/` folder, you can access each email template by appending the folder's name:

```
http://localhost:3000/template_1_folder
or
http://192.168.0.1:3000/template_1_folder
```

Now the problem is _appending of the folder's name_. On desktop you can copy-paste (slightly tedious), but on mobile you have to type manually (very tedious), unless of course it's iPhone and global clipboard is on, but it's still tedious.

How nice would it be if a script could generate a homepage containing the list of all the folders (`template_1_folder`, `template_2_folder` etc) from the chosen root's subfolder (`dist`), link them and even accept screenshot images?

This library does that.

## Getting the screenshots of the templates

I recommend using [pageres](https://www.npmjs.com/package/pageres) in Gulp to generate screenshots. I tried [gulp-webshot](https://www.npmjs.com/package/gulp-webshot) but it failed on certain HTML's, timing out. Same files were captured fine with `pageres`.

## API

```js
homey(
  folderName   // STRING. Compiled templates root folder where you want index created. In the above example, it would be `dist` — the folder which contains rendered template folders.
)
// => undefined (this library only generates an index.html in the "folderName" root)
```

## Contributing & testing

If you see anything incorrect whatsoever, [raise an issue](https://github.com/code-and-send/email-homey/issues). PR's are welcome — fork, hack and PR.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Code and Send Ltd, Roy Reveltas

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
