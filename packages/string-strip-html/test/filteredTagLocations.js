import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// tag pairs vs content
// -----------------------------------------------------------------------------

tap.only("01 - tag pair among defaults", (t) => {
  t.match(
    stripHtml("abc<script>const x = 1;</script>xyz"),
    {
      result: "abc xyz",
      ranges: [[3, 32, " "]],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [[3, 32]],
    },
    "01"
  );
  t.end();
});

tap.test("02 - tag pair custom-defined", (t) => {
  t.match(
    stripHtml("abc<script>const x = 1;</script>xyz", {
      stripTogetherWithTheirContents: ["script"],
    }),
    {
      result: "abc xyz",
      ranges: [[3, 32, " "]],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [[3, 32]],
    },
    "02"
  );
  t.end();
});

tap.test("03 - tag pair's contents not deleted upon request", (t) => {
  t.match(
    stripHtml("abc<script>const x = 1;</script>xyz", {
      stripTogetherWithTheirContents: ["div"],
    }),
    {
      result: "abc const x = 1; xyz",
      ranges: [
        [3, 11, " "],
        [23, 32, " "],
      ],
      allTagLocations: [
        [3, 11],
        [23, 32],
      ],
      filteredTagLocations: [
        [3, 11],
        [23, 32],
      ],
    },
    "03"
  );
  t.end();
});
