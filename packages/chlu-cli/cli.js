#!/usr/bin/env node

/* eslint no-console:0 */

const meow = require('meow')
const chlu = require('chlu')
const fs = require('fs')

const pack = './package.json'
const change = './changelog.md'
const updateNotifier = require('update-notifier')

const cli = meow(`
  Usage
    $ chlu

  Options
    --loud, -l  Will not perform all operations silently

  Example
    Just call it in the root, where your package.json is located
`, {
    alias: {
      l: 'loud',
    },
  })
updateNotifier({ pkg: cli.pkg }).notify()

fs.readFile(change, 'utf8', (changelogErr, changelogData) => {
  let res
  if (changelogData) {
    fs.readFile(pack, 'utf8', (packageErr, packageData) => {
      if (packageErr) {
        if (cli.flags.loud) {
          console.log('couldn\'t get the package.json contents, continuing with changelog.md only')
        }
        res = chlu(changelogData)
        fs.writeFile(change, res, 'utf8', (err) => {
          if (err) throw err
          if (cli.flags.loud) {
            console.log('the changelog has been overwritten')
          }
        })
      }
      if (packageData) {
        if (cli.flags.loud) {
          console.log('fetched both package.json and changelog.md')
        }
        res = chlu(changelogData, packageData)
        fs.writeFile(change, res, 'utf8', (err) => {
          if (err) throw err
          if (cli.flags.loud) {
            console.log('the changelog has been overwritten')
          }
        })
      }
    })
  }
  if (changelogErr) {
    if (cli.flags.loud) {
      console.log('couldn\'t fetch the changelog.md, bailing!')
    }
    process.exit(0)
  }
})
