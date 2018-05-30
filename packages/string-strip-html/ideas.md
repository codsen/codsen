[ ] Record all tags stripped so far. Use that info to catch mis-formatted, same-named tags.
[x] Consider custom HTML tags.
[x] Unclosed range tags should be caught.
[x] Avoid using lookaround traversals - achieve everything with flags only.
[x] Closing slashes can be put in the wrong places.
[ ] Option to strip only HTML tag - more conservative approach.
[ ] Allow to input the blacklist and whitelist of tag names.
[x] Prevent accidental string concatenation - stripping should add spaces/linebreaks if needed. Linebreaks are added if stripped content contained at least a single line break. Otherwise, space is added.
[ ] Tags are stripped with or without the whitespace around them.
[x] Consider and test string formatting tags: `<em>`, `<b>`, `<sup>` and so on.
[x] Plausible custom-named tags become confirmed once spotted anywhere in the `opts` and stripping becomes more aggressive.
[x] consider !doctype
[x] case-insensitive recognised tag names
[ ] opts.stripOnlyTags
