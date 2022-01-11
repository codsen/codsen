# Let's backwards-engineer BitBucket anchor link slug algorithm

This will let us generate the Table of Contents tables for readme files, hosted on BitBucket.

## Word

There's a single word above, first capital

## Two words

There are two words above, first capital

## Three words here

Three words, first capital

## word

There's a single word above, first lowercase

## two words

There are two words above, first lowercase

## three words here

Three words, first lowercase

---

## Word.

There's a single word above, first capital, ends with full stop

## Two words.

There are two words above, first capital, ends with full stop

## Three words here.

Three words, first capital, ends with full stop

## word.

There's a single word above, first lowercase, ends with full stop

## two words.

There are two words above, first lowercase, ends with full stop

## three words here.

Three words, first lowercase, ends with full stop

---

## Word?

There's a single word above, first capital, ends with full stop

## Two words?

There are two words above, first capital, ends with full stop

## Three words here?

Three words, first capital, ends with full stop

## word?

There's a single word above, first lowercase, ends with full stop

## two words?

There are two words above, first lowercase, ends with full stop

## three words here?

Three words, first lowercase, ends with full stop

---

## Word!

There's a single word above, first capital, ends with exclamation mark

## Two words!

There are two words above, first capital, ends with exclamation mark

## Three words here!

Three words, first capital, ends with exclamation mark

## word!

There's a single word above, first lowercase, ends with exclamation mark

## two words!

There are two words above, first lowercase, ends with exclamation mark

## three words here!

Three words, first lowercase, ends with exclamation mark

---

## Word...

There's a single word above, first capital, ends with ellipsis

## Two words...

There are two words above, first capital, ends with ellipsis

## Three words here...

Three words, first capital, ends with ellipsis

## word...

There's a single word above, first lowercase, ends with ellipsis

## two words...

There are two words above, first lowercase, ends with ellipsis

## three words here...

Three words, first lowercase, ends with ellipsis

---

## Here is number 1

Single number in the ends

## 1

Whole h2 is single digit

## 1 title

H2 starts with digit

## 1st title

Digit and letter, no space

## 111 title

Three digits in the h2

---

## So-called "music"

Word with double quotes ends the H2

## So-called "music" is being played

Double quotes mid-sentence

## "Music" is being played

Double quotes starting the H2

---

## #hashtag

Title starts with hash

## Let's tag the #hashtag

Title ends with word that starts with hash

---

## $100 dollars

TItle starts with dollar sign

## Win some $

TItle ends with single dollar sign

---

## 25% cut

Percentage after word

## cut %

Percentage in the end

---

## Ampersand & ampersand

Standalone ampersand

## Something&something

No space around ampersand

---

## Title's notation

Single quote between letters

## Peoples'

Single quote ends the H2

---

## Music (not this) is pleasure

Words with brackets

## (Something)

All H2 wrapped with brackets

---

## Something\*

Asterisk in the end

## 2\*2

Digits with asterisk, tight

## Something \* Something

Asterisk surrounded by spaces

---

## Something + anything

Plus sign, spaces

## Something+anything

Plus sign, tight

---

## Something, anything

Comma, space

## Something,anything

Comma, no space

---

## Slash/dot

Slash, no spaces

## Slash / dot

Slash with spaces

---

## 1 2 3 4 5 6 7 8 9 0

All digits

## aaa 1 2 3 4 5 6 7 8 9 0 bbb

All digits surrounded by letters

## 1234567890

All digits, no spaces

## aaa1234567890bbb

All digits surrounded by letters, no spaces

---

## Colons: practical, useful and, of course, legible

Colon follows the word in h2

---

## Semicolons; What not follows

Semicolon

## Semicolons;

Semicolon

---

## a < b

Less than

## a > b

Greater than

## a = b

Single equal

## a===b

Tripple equal, tight

## a === b

Tripple equal, tight

---

## What is the point of testing this?

Question mark in the end

## What? Don't we need to test?

Two question marks in H2

---

## Email is: roy@domain.com

Email address in the H2

## Something @ something

@ sign surrounded with spaces

---

## [Something](https://codsen.com) link

Link in the H2

---

## Left slash \ here

---

## Something^

Caret, tight

## Something ^

Caret, with space

---

## snake_case

Underscore between letters

## something \_ something

Underscore surrounded by spaces

---

## `variable` is in the beginning

Starts with backtick

## Middle `variable` is here

Middle

## Ends with `variable`

Backtick in the end of H2

---

## Curlies {like this}

Curly braces

## Curlies { and like this }

And with spaces

---

## Pipe character |

Single pipe

## Something || something means "or"

Double pipe

---

## Tilde means approximately ~100

Single tilde in front of digit

## Tilde ~ here

Single tilde in front of word

## tilde~tilde

Tight tilde

---

## Some Lithuanian - Ąžuolynas

Lithuanian

## Путин, Владимир Владимирович

Russian language

## Author 村上春樹

Japanese language

## Price is £10

Pounds

## Price is 100$

Dollars

## 🦄 Unicorn title

Some raw emoji in heading

## ♥ Heart title

Raw heart symbol in heading
