'use strict'

// ===================================
// V A R S

const glob = require('glob-fs')({gitignore: true})
const fs = require('fs')
const Plates = require('plates')
const split = require('lodash.split')
const trimEnd = require('lodash.trimend')
const trimStart = require('lodash.trimstart')

// ===================================
// F U N C T I O N S

function existy (x) { return x != null };

// ===================================
// A C T I O N

module.exports = function homey (input, imgName) {
  // ==============
  // precaution for input
  if (!existy(input) || (typeof input !== 'string')) {
    throw new Error('Current error is not string, it\'s: ' + typeof input)
  }
  // precaution for imgName
  if (!existy(imgName) || (typeof imgName !== 'string')) {
    imgName = 'screenshot.png'
  }
  input = trimEnd(trimStart(input, ' \\/.'), ' \\/.')
  // ==============
  // action
  // see https://github.com/flatiron/plates
  var collection = []
  // ==============
  // get folders list (array):

  var foldersArray = glob.readdirSync(input + '/**/')
  foldersArray.forEach(function (rawFolderPath, i) {
    foldersArray[i] = split(rawFolderPath, '/')[1]
  })
  // ==============
  // read each folder, if index.html present, create collection item; then if (optional) screenshot.jpg present, add it too
  var temp = {}
  if (foldersArray.length > 0) {
    foldersArray.forEach(function (pathToFile) {
      temp = {}
      try {
        // existence of index.html
        fs.accessSync(input + '/' + pathToFile + '/index.html', fs.F_OK)
        temp.name = pathToFile
        temp.url = '/' + pathToFile + '/'
        try {
          // existence of screenshot.*
          var imgPath = input + '/' + pathToFile + '/' + imgName
          fs.accessSync(imgPath, fs.F_OK)
          temp.screenshot = '/' + pathToFile + '/' + imgName
        } catch (e) {
          // screenshot.png missing
          // console.log('no image for ' + pathToFile)
        }
      } catch (e) {
        // index.html missing
        // console.log('no index.html in ' + pathToFile)
      }
      if ((Object.keys(temp).length > 0) && (existy(temp.name))) {
        collection.push(temp)
      }
    })
  }
  if (collection.length === 0) {
    // console.log('No files found, skipping!')
    return
  }
  // ==============
  // reading in the template file
  try {
    // existence of template.html
    fs.accessSync('template.html', fs.F_OK)
    var base = String(fs.readFileSync('template.html'))
  } catch (e) {
    throw new Error('ERROR! Missing template.html in the root folder!')
  }
  // ==============
  // reading in the loop-me file
  try {
    // existence of loop-me.html
    fs.accessSync('loop-me.html', fs.F_OK)
    var partial = String(fs.readFileSync('loop-me.html'))
  } catch (e) {
    throw new Error('ERROR! Missing loop-me.html in the root folder!')
  }
  // ==============
  // use Plates to generate dynamic part that will go inside <body>:
  var map1 = Plates.Map()
  map1.where('class').is('module-link').use('url').as('href')
  map1.where('class').is('module-img').use('screenshot').as('src')
  map1.class('module-label').to('name')
  var allContentOfHtml = Plates.bind(partial, collection, map1)
  // ==============
  // attach all content to <body>:
  var map2 = Plates.Map()
  map2.class('container').append(allContentOfHtml)
  var output = Plates.bind(base, {}, map2)
  // ==============
  // write "output" to index.html
  fs.writeFileSync(input + '/index.html', output)
  // ==============
}
