# email-homey

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Generate homepage in the root containing all your templates, by folder

[![bitHound Score](https://www.bithound.io/github/code-and-send/email-homey/badges/score.svg)](https://www.bithound.io/github/code-and-send/email-homey) [![bitHound Dependencies](https://www.bithound.io/github/code-and-send/email-homey/badges/dependencies.svg)](https://www.bithound.io/github/code-and-send/email-homey/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/code-and-send/email-homey/badges/devDependencies.svg)](https://www.bithound.io/github/code-and-send/email-homey/master/dependencies/npm)

## Install

```sh
$ npm install --save-dev email-homey
```

## Purpose

`email-homey` generates a homepage containing the screenshots of all your templates, each linked to a template. Here's how it works.

When you use a Build System for generate email marketing templates, in the root directory, you have something like:

```
root
│
├─ (folder: "modules", "node_modules", "images" and so on)
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

When you use [BrowerSync](https://www.npmjs.com/package/browser-sync) in Gulp and set BrowserSync root as `/dist/` folder, you can access each email template (`index.html` above) by calling folder's name (`template_1_folder` in the URL, for example:

```
http://localhost:3000/template_1_folder
or
http://192.168.0.1:3000/template_1_folder
```

Now the problem is you have to type the folder name manually and also, without homepage you can't choose your templates visually. On desktop you can copy-paste (_slightly_ tedious), but on mobile you have to type manually (_very_ tedious), unless, of course, it's iPhone and _global clipboard_ is on, but it's still _tedious_.

How nice would it be if a script could generate a homepage containing the list of all the folders (`template_1_folder`, `template_2_folder` etc) from the chosen root's subfolder (`dist`), link them and even accept screenshot images?

`email-homey` does that.

## Getting the screenshots of the templates

I recommend using [pageres](https://www.npmjs.com/package/pageres) in Gulp to generate screenshots. I tried [gulp-webshot](https://www.npmjs.com/package/gulp-webshot) but it failed on certain HTML's, timing out. `pageres` captured screenshots fine, so it's my current favourite.

## API


Input argument   | Type                  | Obligatory? | Default val      | Description
-----------------|-----------------------|-------------|------------------|-------------
`folderName`     | String                | yes         |                  | Folder name within root. Can be `folder/subfolder/`.
`imgName`        | String                | no          | 'screenshot.png' | Name of a thumbnail image within each location `folderName`

## Use

Call `email-homey` from Gulp, as a step in your email template build system.

**Step 1.** Install:

```sh
$ npm install --save-dev email-homey
```

**Step 2.** Require `email-homey` in your `gulpfile.js`:

```js
const homey = require('email-homey')
```

**Step 3.** Create a Gulp task that calls it:

```js
gulp.task('homey', () => {
  homey('dist', 'screenshot.png')
})
```

**Step 4**. Gulp <=4 runs asynchronously, so if you're not on v4 yet, you'll need to enforce the sequence of the tasks.
First, install `run-sequence`:

```sh
$ npm install --save-dev run-sequence
```
Then, require it in your `gulpfile.js`:

```js
const runSequence = require('run-sequence')
```

Then, you'll be able to enforce the order of tasks:

```js
gulp.task('default', (callback) => {
  runSequence('build', 'homey', 'browser-sync', 'watch', callback)
})
```

The homepage will be assembled from two parts: 1) main template (`template.html` in the root folder of this package) and 2) template for a single thumbnail (`loop-me.html` in the root folder of this package) which will be loop'ed many times and contain each of your thumbnails/templates.

Both files must be placed in the root of your template folder. Feel free to customise them, just keep the classes on the tags because that's how the JS selects the tags to place the content inside of them.

## Contributing & testing

```sh
$ npm test
```

If you see anything incorrect whatsoever, [raise an issue](https://github.com/code-and-send/email-homey/issues). Pull requests are welcome — fork, hack and pull-request. I'll do my best to merge soon.

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
