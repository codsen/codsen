/* eslint prefer-destructuring:0, no-console:0 */

// ===================================
// V A R S

const glob = require('glob-fs')({ gitignore: true })
const fs = require('fs')
const path = require('path')
const split = require('lodash.split')
const trimEnd = require('lodash.trimend')
const trimStart = require('lodash.trimstart')
const isObj = require('lodash.isplainobject')
const checkTypes = require('check-types-mini')
const replaceString = require('replace-string')

// ===================================
// F U N C T I O N S

function existy(x) { return x != null }

// ===================================
// A C T I O N

function homey(input, originalOpts) {
  // precaution for input
  if (!existy(input) || (typeof input !== 'string')) {
    throw new Error(`email-homey: [THROW_ID_01] Currently the first argument is not string${existy(input) ? `, it's: ${typeof input}` : '!'}`)
  }
  // precaution for opts
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(`email-homey: [THROW_ID_02] The options object must be a plain object. Currently it's ${typeof input}, equal to ${JSON.stringify(originalOpts, null, 4)}`)
  }
  // set the API defaults:
  const defaults = {
    placeholder: 'magicFoldersList',
    outputTemplatesFileName: 'index.html',
    seedFileName: 'seed.html',
    throwOnErrors: true, // otherwise, just console.log
  }
  // fill any settings with defaults if missing:
  const opts = Object.assign({}, defaults, originalOpts)

  // sanity-check the options:
  checkTypes(opts, defaults, {
    msg: 'string-html/sh(): [THROW_ID_03*]',
  })

  // get the list of all the subfolder names at that root where this file is called
  let foldersArray
  try {
    foldersArray = glob.readdirSync(`${trimStart(trimEnd(input, '\\./'), '\\./')}/*/`)
  } catch (e) {
    const message = `email-homey: [THROW_ID_04] We could not read the folders list, "${trimStart(trimEnd(input, '\\./'), '\\./')}/*/"`
    if (opts.throwOnErrors) {
      throw new Error(message)
    } else {
      console.log(message)
    }
  }
  foldersArray.forEach((rawFolderPath, i) => {
    foldersArray[i] = split(rawFolderPath, '/')[1]
  })
  console.log(`\n\nfoldersArray = ${JSON.stringify(foldersArray, null, 4)}`)

  // try to read the template file
  let seedTemplateContents
  try {
    seedTemplateContents = fs.readFileSync(path.join(input, opts.seedFileName), 'utf8')
  } catch (e) {
    const message = `email-homey: [THROW_ID_05] We could not read the template, "${path.join(input, opts.seedFileName)}"`
    if (opts.throwOnErrors) {
      throw new Error(message)
    } else {
      console.log(message)
    }
  }
  console.log(`\n\nseedTemplateContents = ${JSON.stringify(seedTemplateContents, null, 4)}`)

  let placeholderStartIndex =

  // fs.writeFileSync(`${input}/index.html`, output)
}

module.exports = homey
