# Entity decoding changes

The next release uses `html-entity-codec` when matching class names, IDs, and
label `for` values. Attribute values still decode once, and a legacy name
without a semicolon stays literal when followed by an ASCII letter, digit,
or `=`.

Two numeric-reference results now follow the HTML standard: surrogate
references such as `&#xD800;` produce U+FFFD, and `&#x10FFFF;` produces
U+10FFFF. Selectors, whitelist matching, and label associations use these
corrected characters. This can change which CSS is retained for templates
containing those references.
