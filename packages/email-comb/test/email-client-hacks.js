import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

// Shared fixtures and source pins are maintained in ops/email-client-hacks/.
// These cases test source preservation, not present-day email-client rendering.
// Expectations retain each targeting mechanism while removing the unrelated
// .discard rule and orphan class. Explicit whitelists protect client-injected
// wrappers, or both identities where the client rewrites an authored class.
// In the Outlook null-escape case, CSS decodes \\0 to U+FFFD; whitelist that
// canonical selector identity as well as the pre-client HTML class.
const cases = JSON.parse(
  readFileSync(
    new URL("./fixtures/email-client-hacks/cases.json", import.meta.url),
    "utf8",
  ),
);
const expected = JSON.parse(
  readFileSync(
    new URL("./fixtures/email-client-hacks/expected.json", import.meta.url),
    "utf8",
  ),
);

test("01 - 2019-03-01-newton-desktop", () => {
  for (const { id, input } of cases["2019-03-01-newton-desktop"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "01.01");
    const uglified = comb(input, { ...options, uglify: true });
    equal(
      uglified.log.uglified.map(([before]) => before),
      [".target"],
      "01.02",
    );
    const name = uglified.log.uglified[0][1].slice(1);
    equal(
      uglified.result,
      result
        .replace(".target", `.${name}`)
        .replace('class="target"', `class="${name}"`),
      "01.03",
    );
  }
});

test("02 - 2019-03-26-airmail", () => {
  for (const { id, input } of cases["2019-03-26-airmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "02.01");
    const uglified = comb(input, { ...options, uglify: true });
    equal(
      uglified.log.uglified.map(([before]) => before),
      [".target"],
      "02.02",
    );
    const name = uglified.log.uglified[0][1].slice(1);
    equal(
      uglified.result,
      result
        .replace(".target", `.${name}`)
        .replace('class="target"', `class="${name}"`),
      "02.03",
    );
  }
});

test("03 - 2019-03-26-android-2.3", () => {
  for (const { id, input } of cases["2019-03-26-android-2.3"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "03.01");
  }
});

test("04 - 2019-03-26-android-2", () => {
  for (const { id, input } of cases["2019-03-26-android-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "04.01");
  }
});

test("05 - 2019-03-26-android-4.2", () => {
  for (const { id, input } of cases["2019-03-26-android-4.2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "05.01");
  }
});

test("06 - 2019-03-26-android-4.4", () => {
  for (const { id, input } of cases["2019-03-26-android-4.4"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "06.01");
  }
});

test("07 - 2019-03-26-android", () => {
  for (const { id, input } of cases["2019-03-26-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "07.01");
  }
});

test("08 - 2019-03-26-aol", () => {
  for (const { id, input } of cases["2019-03-26-aol"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "08.01");
  }
});

test("09 - 2019-03-26-apple-mail-10", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-10"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "09.01");
  }
});

test("10 - 2019-03-26-apple-mail-12.4", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-12.4"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "10.01");
  }
});

test("11 - 2019-03-26-apple-mail-8", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-8"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "11.01");
  }
});

test("12 - 2019-03-26-edison-android", () => {
  for (const { id, input } of cases["2019-03-26-edison-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "12.01");
  }
});

test("13 - 2019-03-26-edison-ios", () => {
  for (const { id, input } of cases["2019-03-26-edison-ios"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "13.01");
  }
});

test("14 - 2019-03-26-edison", () => {
  for (const { id, input } of cases["2019-03-26-edison"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "14.01");
  }
});

test("15 - 2019-03-26-freenet-2", () => {
  for (const { id, input } of cases["2019-03-26-freenet-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "15.01");
  }
});

test("16 - 2019-03-26-freenet", () => {
  for (const { id, input } of cases["2019-03-26-freenet"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "16.01");
  }
});

test("17 - 2019-03-26-gmail-android", () => {
  for (const { id, input } of cases["2019-03-26-gmail-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "17.01");
  }
});

test("18 - 2019-03-26-gmail", () => {
  for (const { id, input } of cases["2019-03-26-gmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "18.01");
  }
});

test("19 - 2019-03-26-gmx-web.de-2", () => {
  for (const { id, input } of cases["2019-03-26-gmx-web.de-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "19.01");
  }
});

test("20 - 2019-03-26-gmx-web.de", () => {
  for (const { id, input } of cases["2019-03-26-gmx-web.de"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "20.01");
  }
});

test("21 - 2019-03-26-ios-mail-10", () => {
  for (const { id, input } of cases["2019-03-26-ios-mail-10"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "21.01");
  }
});

test("22 - 2019-03-26-nine", () => {
  for (const { id, input } of cases["2019-03-26-nine"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "22.01");
  }
});

test("23 - 2019-03-26-notes-8", () => {
  for (const { id, input } of cases["2019-03-26-notes-8"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "23.01");
  }
});

test("24 - 2019-03-26-open-xchange", () => {
  for (const { id, input } of cases["2019-03-26-open-xchange"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "24.01");
  }
});

test("25 - 2019-03-26-orange", () => {
  for (const { id, input } of cases["2019-03-26-orange"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "25.01");
  }
});

test("26 - 2019-03-26-outlook-ios-android-2", () => {
  for (const { id, input } of cases["2019-03-26-outlook-ios-android-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "26.01");
  }
});

test("27 - 2019-03-26-outlook-ios-android", () => {
  for (const { id, input } of cases["2019-03-26-outlook-ios-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "27.01");
  }
});

test("28 - 2019-03-26-outlook-macos", () => {
  for (const { id, input } of cases["2019-03-26-outlook-macos"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "28.01");
  }
});

test("29 - 2019-03-26-outlook-webmail", () => {
  for (const { id, input } of cases["2019-03-26-outlook-webmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "29.01");
  }
});

test("30 - 2019-03-26-postbox", () => {
  for (const { id, input } of cases["2019-03-26-postbox"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "30.01");
  }
});

test("31 - 2019-03-26-samsung-email-s4", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s4"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "31.01");
  }
});

test("32 - 2019-03-26-samsung-email-s5-s9-2", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "32.01");
  }
});

test("33 - 2019-03-26-samsung-email-s5-s9-3", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9-3"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "33.01");
  }
});

test("34 - 2019-03-26-samsung-email-s5-s9", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "34.01");
  }
});

test("35 - 2019-03-26-spark", () => {
  for (const { id, input } of cases["2019-03-26-spark"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "35.01");
  }
});

test("36 - 2019-03-26-t-online.de", () => {
  for (const { id, input } of cases["2019-03-26-t-online.de"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "36.01");
  }
});

test("37 - 2019-03-26-thunderbird-2", () => {
  for (const { id, input } of cases["2019-03-26-thunderbird-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "37.01");
  }
});

test("38 - 2019-03-26-thunderbird", () => {
  for (const { id, input } of cases["2019-03-26-thunderbird"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "38.01");
  }
});

test("39 - 2019-03-26-windows-mail-2", () => {
  for (const { id, input } of cases["2019-03-26-windows-mail-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "39.01");
  }
});

test("40 - 2019-03-26-windows-mail", () => {
  for (const { id, input } of cases["2019-03-26-windows-mail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "40.01");
  }
});

test("41 - 2019-03-26-yahoo-2", () => {
  for (const { id, input } of cases["2019-03-26-yahoo-2"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "41.01");
  }
});

test("42 - 2019-03-26-yahoo-3", () => {
  for (const { id, input } of cases["2019-03-26-yahoo-3"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "42.01");
  }
});

test("43 - 2019-03-26-yahoo", () => {
  for (const { id, input } of cases["2019-03-26-yahoo"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "43.01");
    if (id.endsWith("--fence-1") || id.endsWith("--escaped-marker")) {
      const uglified = comb(input, { ...options, uglify: true });
      equal(
        uglified.log.uglified.map(([before]) => before),
        [".target"],
        "43.02",
      );
      const name = uglified.log.uglified[0][1].slice(1);
      equal(
        uglified.result,
        result
          .replace(".target", `.${name}`)
          .replace('class="target"', `class="${name}"`),
        "43.03",
      );
    }
  }
});

test("44 - 2019-04-01-gmail-ios", () => {
  for (const { id, input } of cases["2019-04-01-gmail-ios"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "44.01");
  }
});

test("45 - 2019-04-01-gmail", () => {
  for (const { id, input } of cases["2019-04-01-gmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "45.01");
  }
});

test("46 - 2019-04-01-outlook-android", () => {
  for (const { id, input } of cases["2019-04-01-outlook-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "46.01");
  }
});

test("47 - 2019-04-01-outlook", () => {
  for (const { id, input } of cases["2019-04-01-outlook"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "47.01");
  }
});

test("48 - 2019-04-08-outlook-webmail", () => {
  for (const { id, input } of cases["2019-04-08-outlook-webmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "48.01");
  }
});

test("49 - 2019-06-13-thunderbird", () => {
  for (const { id, input } of cases["2019-06-13-thunderbird"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "49.01");
  }
});

test("50 - 2019-09-10-freenet", () => {
  for (const { id, input } of cases["2019-09-10-freenet"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "50.01");
  }
});

test("51 - 2019-10-15-outlook-dark-mode", () => {
  for (const { id, input } of cases["2019-10-15-outlook-dark-mode"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "51.01");
  }
});

test("52 - 2020-02-19-ios-mail-13", () => {
  for (const { id, input } of cases["2020-02-19-ios-mail-13"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "52.01");
  }
});

test("53 - 2020-03-23-yahoo", () => {
  for (const { id, input } of cases["2020-03-23-yahoo"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "53.01");
  }
});

test("54 - 2020-04-27-sapo", () => {
  for (const { id, input } of cases["2020-04-27-sapo"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "54.01");
  }
});

test("55 - 2021-06-14-ios-mail-15", () => {
  for (const { id, input } of cases["2021-06-14-ios-mail-15"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "55.01");
  }
});

test("56 - 2021-06-21-yahoo-aol", () => {
  for (const { id, input } of cases["2021-06-21-yahoo-aol"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "56.01");
  }
});

test("57 - 2021-10-08-163.com", () => {
  for (const { id, input } of cases["2021-10-08-163.com"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "57.01");
  }
});

test("58 - 2021-10-08-outlook-ios", () => {
  for (const { id, input } of cases["2021-10-08-outlook-ios"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "58.01");
  }
});

test("59 - 2021-10-08-outlook-pwa", () => {
  for (const { id, input } of cases["2021-10-08-outlook-pwa"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "59.01");
  }
});

test("60 - 2021-10-08-yahoo-japan", () => {
  for (const { id, input } of cases["2021-10-08-yahoo-japan"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "60.01");
  }
});

test("61 - 2021-10-29-comcast-webmail", () => {
  for (const { id, input } of cases["2021-10-29-comcast-webmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "61.01");
  }
});

test("62 - 2021-10-29-libero", () => {
  for (const { id, input } of cases["2021-10-29-libero"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "62.01");
  }
});

test("63 - 2022-02-22-apple-mail-ipad", () => {
  for (const { id, input } of cases["2022-02-22-apple-mail-ipad"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "63.01");
  }
});

test("64 - 2022-07-12-outlook-ios-android-3", () => {
  for (const { id, input } of cases["2022-07-12-outlook-ios-android-3"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "64.01");
  }
});

test("65 - 2022-08-15-seznam.cz", () => {
  for (const { id, input } of cases["2022-08-15-seznam.cz"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "65.01");
  }
});

test("66 - 2022-11-09-spark-ios-android", () => {
  for (const { id, input } of cases["2022-11-09-spark-ios-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "66.01");
  }
});

test("67 - 2023-05-11-superhuman-mac", () => {
  for (const { id, input } of cases["2023-05-11-superhuman-mac"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "67.01");
  }
});

test("68 - 2023-10-22-seznam", () => {
  for (const { id, input } of cases["2023-10-22-seznam"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "68.01");
  }
});

test("69 - 2023-11-13-gmail-ipad", () => {
  for (const { id, input } of cases["2023-11-13-gmail-ipad"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "69.01");
  }
});

test("70 - 2023-12-12-outlook-mac-android", () => {
  for (const { id, input } of cases["2023-12-12-outlook-mac-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "70.01");
  }
});

test("71 - 2023-12-19-apple-mail-ios-17", () => {
  for (const { id, input } of cases["2023-12-19-apple-mail-ios-17"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "71.01");
  }
});

test("72 - 2024-02-07-qq-mail-android", () => {
  for (const { id, input } of cases["2024-02-07-qq-mail-android"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "72.01");
  }
});

test("73 - 2024-07-17-samsung-email-microsoft", () => {
  for (const { id, input } of cases["2024-07-17-samsung-email-microsoft"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "73.01");
  }
});

test("74 - 2024-07-17-samsung-email-non-microsoft", () => {
  for (const { id, input } of cases["2024-07-17-samsung-email-non-microsoft"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "74.01");
  }
});

test("75 - 2024-07-24-mailspring-desktop", () => {
  for (const { id, input } of cases["2024-07-24-mailspring-desktop"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "75.01");
  }
});

test("76 - 2024-08-30-freefr-webmail", () => {
  for (const { id, input } of cases["2024-08-30-freefr-webmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "76.01");
  }
});

test("77 - 2025-03-16-notionmail", () => {
  for (const { id, input } of cases["2025-03-16-notionmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "77.01");
  }
});

test("78 - 2025-03-26-onet-chrome", () => {
  for (const { id, input } of cases["2025-03-26-onet-chrome"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "78.01");
  }
});

test("79 - 2025-03-28-outlook-webmail", () => {
  for (const { id, input } of cases["2025-03-28-outlook-webmail"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "79.01");
  }
});

test("80 - 2025-04-27-proton", () => {
  for (const { id, input } of cases["2025-04-27-proton"]) {
    const { options, result } = expected[id];
    equal(comb(input, options).result, result, "80.01");
  }
});

test.run();
