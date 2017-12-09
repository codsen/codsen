#!/usr/bin/env node
'use strict';

/* eslint no-console:0 */

var meow = require('meow');
var chlu = require('chlu');
var fs = require('fs');

var pack = './package.json';
var change = './changelog.md';
var updateNotifier = require('update-notifier');

var cli = meow('\n  Usage\n    $ chlu\n\n  Options\n    --loud, -l  Will not perform all operations silently\n\n  Example\n    Just call it in the root, where your package.json is located\n', {
  alias: {
    l: 'loud'
  }
});
updateNotifier({ pkg: cli.pkg }).notify();

fs.readFile(change, 'utf8', function (changelogErr, changelogData) {
  var res = void 0;
  if (changelogData) {
    fs.readFile(pack, 'utf8', function (packageErr, packageData) {
      if (packageErr) {
        if (cli.flags.loud) {
          console.log('couldn\'t get the package.json contents, continuing with changelog.md only');
        }
        res = chlu(changelogData);
        fs.writeFile(change, res, 'utf8', function (err) {
          if (err) throw err;
          if (cli.flags.loud) {
            console.log('the changelog has been overwritten');
          }
        });
      }
      if (packageData) {
        if (cli.flags.loud) {
          console.log('fetched both package.json and changelog.md');
        }
        res = chlu(changelogData, packageData);
        fs.writeFile(change, res, 'utf8', function (err) {
          if (err) throw err;
          if (cli.flags.loud) {
            console.log('the changelog has been overwritten');
          }
        });
      }
    });
  }
  if (changelogErr) {
    if (cli.flags.loud) {
      console.log('couldn\'t fetch the changelog.md, bailing!');
    }
    process.exit(0);
  }
});
