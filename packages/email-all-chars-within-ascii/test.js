'use strict'
/* eslint no-tabs: 0 */

import within from './index'
import test from 'ava'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong/missing input = throw', t => {
  t.throws(function () {
    within()
  })
  t.throws(function () {
    within(1)
  })
  t.throws(function () {
    within(null)
  })
  t.throws(function () {
    within(undefined)
  })
  t.throws(function () {
    within(true)
  })
})

test('01.02 - wrong opts = throw', t => {
  t.throws(function () {
    within('aaaa', true) // not object but bool
  })
  t.throws(function () {
    within('aaaa', 1) // not object but number
  })
  t.notThrows(function () {
    within('aaaa', undefined) // hardcoded "nothing" is ok!
  })
  t.notThrows(function () {
    within('aaaa', null) // null fine too - that's hardcoded "nothing"
  })
  t.throws(function () {
    within('aaaa', {zzz: true}) // opts contain rogue keys.
  })
  t.throws(function () {
    within('aaaa', {zzz: true, messageOnly: false}) // one rogue key is enough to cause a throw
  })
  t.notThrows(function () {
    within('aaaa', {messageOnly: false}) // no rogue keys.
  })
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('02.00 - NULL control char (dec. 0) is not ok', t => {
  t.throws(function () {
    within(`\u0000`)
  })
  t.throws(function () {
    within(`\u0000`, {messageOnly: true})
  })
})

test('02.01 - SOH control char (dec. 1) is not ok', t => {
  t.throws(function () {
    within(`\u0001`)
  })
  t.throws(function () {
    within(`\u0001`, {messageOnly: true})
  })
})

test('02.02 - STX control char (dec. 2) is not ok', t => {
  t.throws(function () {
    within(`\u0002`)
  })
  t.throws(function () {
    within(`\u0002`, {messageOnly: true})
  })
})

test('02.03 - ETX control char (dec. 3) is not ok', t => {
  t.throws(function () {
    within(`\u0003`)
  })
})

test('02.04 - EOT control char (dec. 4) is not ok', t => {
  t.throws(function () {
    within(`\u0004`)
  })
})

test('02.05 - ENQ control char (dec. 5) is not ok', t => {
  t.throws(function () {
    within(`\u0005`)
  })
})

test('02.06 - ACK control char (dec. 6) is not ok', t => {
  t.throws(function () {
    within(`\u0006`)
  })
})

test('02.07 - BEL control char (dec. 7) is not ok', t => {
  t.throws(function () {
    within(`\u0007`)
  })
})

test('02.08 - BS control char (dec. 8) is not ok', t => {
  t.throws(function () {
    within(`\u0008`)
  })
})

test('02.09 - HT control char horizontal tabulation (dec. 9) is ok', t => {
  t.notThrows(function () {
    within(`\u0009`)
  })
  t.notThrows(function () {
    within(`	`)
  })
})

test('02.10 - LF new line control character (dec. 10) is ok', t => {
  t.notThrows(function () {
    within(`\u000A`)
  })
})

test('02.11 - VT control char (dec. 11) is not ok', t => {
  t.throws(function () {
    within(`\u000B`)
  })
})

test('02.12 - FF control char (dec. 12) is not ok', t => {
  t.throws(function () {
    within(`\u000C`)
  })
})

test('02.13 - CR control char (dec. 13) is ok', t => {
  t.notThrows(function () {
    within(`\u000D`)
  })
})

test('02.14 - SO control char (dec. 14) is not ok', t => {
  t.throws(function () {
    within(`\u000E`)
  })
})

test('02.15 - SI control char (dec. 15) is not ok', t => {
  t.throws(function () {
    within(`\u000F`)
  })
})

test('02.16 - DLE control char (dec. 16) is not ok', t => {
  t.throws(function () {
    within(`\u0010`)
  })
})

test('02.17 - DC1 control char (dec. 17) is not ok', t => {
  t.throws(function () {
    within(`\u0011`)
  })
})

test('02.18 - DC2 control char (dec. 18) is not ok', t => {
  t.throws(function () {
    within(`\u0012`)
  })
})

test('02.19 - DC3 control char (dec. 19) is not ok', t => {
  t.throws(function () {
    within(`\u0013`)
  })
})

test('02.20 - DC4 control char (dec. 20) is not ok', t => {
  t.throws(function () {
    within(`\u0014`)
  })
})

test('02.21 - NA control char (dec. 21) is not ok', t => {
  t.throws(function () {
    within(`\u0015`)
  })
})

test('02.22 - SI control char (dec. 22) is not ok', t => {
  t.throws(function () {
    within(`\u0016`)
  })
})

test('02.23 - EOTB control char (dec. 23) is not ok', t => {
  t.throws(function () {
    within(`\u0017`)
  })
})

test('02.24 - CANCL control char (dec. 24) is not ok', t => {
  t.throws(function () {
    within(`\u0018`)
  })
})

test('02.25 - EOM control char (dec. 25) is not ok', t => {
  t.throws(function () {
    within(`\u0019`)
  })
})

test('02.26 - SUBS control char (dec. 26) is not ok', t => {
  t.throws(function () {
    within(`\u001A`)
  })
})

test('02.27 - ESC control char (dec. 27) is not ok', t => {
  t.throws(function () {
    within(`\u001B`)
  })
})

test('02.28 - IS4 control char (dec. 28) is not ok', t => {
  t.throws(function () {
    within(`\u001C`)
  })
})

test('02.29 - IS3 control char (dec. 29) is not ok', t => {
  t.throws(function () {
    within(`\u001D`)
  })
})

test('02.30 - IS2 control char (dec. 30) is not ok', t => {
  t.throws(function () {
    within(`\u001E`)
  })
})

test('02.31 - IS1 control char (dec. 31) is not ok', t => {
  t.throws(function () {
    within(`\u001F`)
  })
})

test('02.32 - space (dec. 32) is ok', t => {
  t.notThrows(function () {
    within(`\u0020`)
  })
})

test('02.33 - delete (dec. 127) is not cool!', t => {
  t.throws(function () {
    within(`\u007F`)
  })
  t.throws(function () {
    within(`\u007F`, {messageOnly: true})
  })
})

// -----------------------------------------------------------------------------
// group 03. some code for kicks
// -----------------------------------------------------------------------------

test('03.01 - some random HTML for fun - whole EMAILCOMB.COM website', t => {
  t.notThrows(function () {
    within(`<!DOCTYPE html>
    <!--
     _______  __   __  _______  ___   ___            _______  _______  __   __  _______
    |       ||  |_|  ||   _   ||   | |   |          |       ||       ||  |_|  ||  _    |
    |    ___||       ||  |_|  ||   | |   |          |       ||   _   ||       || |_|   |
    |   |___ |       ||       ||   | |   |          |       ||  | |  ||       ||       |
    |    ___||       ||       ||   | |   |___       |      _||  |_|  ||       ||  _   |
    |   |___ | ||_|| ||   _   ||   | |       |      |     |_ |       || ||_|| || |_|   |
    |_______||_|   |_||__| |__||___| |_______|      |_______||_______||_|   |_||_______|

    This is a GUI for https://github.com/codsen/email-remove-unused-css
    Made by Roy @ Codsen Ltd (R)
    -->
    <html>
    <head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<title>EmailComb - Removes unused CSS from email</title>

	<link rel="stylesheet" href="styles/main.min.css">

	<meta property="og:title" content="EmailComb"/>
	<meta property="og:url" content="https://emailcomb.com"/>
	<meta property="og:image" content="https://emailcomb.com/emailcomb-screenshot.png"/>
	<meta property="og:site-name" content="EmailComb"/>
	<meta property="og:description" content="Removes the unused CSS from email templates."/>

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="@revelto">
	<meta name="twitter:title" content="EmailComb">
	<meta name="twitter:description" content="Removes the unused CSS from email templates.">
	<meta name="twitter:creator" content="@revelto">
	<meta name="twitter:image:src" content="https://emailcomb.com/emailcomb-screenshot.png">

	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="/manifest.json">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="theme-color" content="#ffffff">

    </head>
    <body>
    <div id="root">
    </div>
    </body>
    </html>
`)
  })
})
