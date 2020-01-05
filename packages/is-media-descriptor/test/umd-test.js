const t = require("tap");
const isMediaD = require("../dist/is-media-descriptor.umd");

t.test("UMD build works fine", t => {
  [
    "all",
    "aural",
    "braille",
    "embossed",
    "handheld",
    "print",
    "projection",
    "screen",
    "speech",
    "tty",
    "tv"
  ].forEach(val => {
    t.match(isMediaD(val), []);
  });
  t.end();
});
