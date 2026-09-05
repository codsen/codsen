# Entity decoding changes

The next release uses `html-entity-codec` for HTML character references. It
corrects two numeric-reference results to follow the HTML standard:

- `&#xD800;` and other surrogate references produce U+FFFD instead of a lone
  surrogate.
- `&#x10FFFF;` produces U+10FFFF instead of U+FFFD. HTML retains this
  noncharacter during forgiving decoding.

Decoding still requires semicolons and repeats until the value stops changing.
`skipHtmlDecoding` bypasses decoding. Ranges, tag locations, and customization
callbacks retain their original-input UTF-16 coordinates.
