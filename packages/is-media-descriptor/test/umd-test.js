import tap from "tap";
import isMediaD from "../dist/is-media-descriptor.umd";

tap.test("UMD build works fine", (t) => {
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
    "tv",
  ].forEach((val) => {
    t.match(isMediaD(val), []);
  });
  t.end();
});
