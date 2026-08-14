import { test } from "uvu";
import { equal } from "uvu/assert";

test("01 - falls back when Intl.Segmenter is unavailable", async () => {
  const nativeSegmenter = Intl.Segmenter;
  Intl.Segmenter = undefined;

  let fallbackApi;
  try {
    fallbackApi = await import(
      "../dist/string-convert-indexes.esm.js?without-intl-segmenter"
    );
  } finally {
    Intl.Segmenter = nativeSegmenter;
  }

  equal(
    fallbackApi.nativeToUnicode("a🧑‍🤝‍🧑b", [1, 2, 3, 4, 5, 6, 7, 8, 9]),
    [1, 1, 1, 1, 1, 1, 1, 1, 2],
    "01.01",
  );
  equal(fallbackApi.unicodeToNative("a🧑‍🤝‍🧑b", [0, 1, 2]), [0, 1, 9], "01.02");
});

test.run();
