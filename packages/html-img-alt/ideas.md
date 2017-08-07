# ideas

## to do:

[ ] options object to let override closing slashes
[ ] options object to set/enforce single quotes on all attributes, including ALT (JS code?)
[ ] copes with invisible Unicode chars (like ETX)
[ ] copes with emoji within ALT/other attribute values
[ ] turn off excessive whitespace removal (1. it might be done on all code anyway, so img-only cleaning might be redundant and waste of resources. On other hand, whole HTML cleaning is outside of the scope of this lib, so we have to limit outselves to IMG tags only. 2. the code might be clean and the reason might be to improve the performance of this lib, to make it run even faster by skipping this step.)

## test/investigate:

[ ] nunjucks code, if conditionals, equal signs and so on
[ ] esp code, Adobe, Responsys and eDialog

## done:

[x] test multiple alt's being unfancie'd
[x] combos of clashing alt addition and excessive white space removal
[x] don't damage all other attributes without "equal+quotes"
[x] copes with excessive white space of all kinds
[x] copes with sneaky "alt" characters within other attribute values
[x] should take only a single string traversal, with no splitting + dumping into arrays

## stupid ideas, won't gonna do:

[-] options object to set/enforce single quotes on all attributes, including ALT (JS code?) (doable, but too difficult)
[-] copes with fanci-fied quotes. Let's say somebody turned quote pairs into pairs of fancy quotes, damaging HTML. (Scope to IMG tag only???) (outside of the scope, dedicated cleaning libs should do such edits)
[-] integrate with `detect-is-it-html-or-xhtml` (outside of the scope)
