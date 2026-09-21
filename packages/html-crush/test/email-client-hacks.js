import { readFileSync } from "node:fs";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

// Shared fixtures and source pins are maintained in ops/email-client-hacks/.
// These historical examples test source preservation, not current client support.
const cases = JSON.parse(
  readFileSync(
    new URL("./fixtures/email-client-hacks/cases.json", import.meta.url),
    "utf8",
  ),
);
// Reviewed expectations belong to this package, independently of fixture projection.
const expected = JSON.parse(
  readFileSync(
    new URL("./fixtures/email-client-hacks/expected.json", import.meta.url),
    "utf8",
  ),
);
const options = {
  removeLineBreaks: true,
  breakToTheLeftOf: [],
  // Yahoo/AOL deliberately interpret declarations hidden in CSS comments.
  removeCSSComments: false,
};

test("01 - 2019-03-01-newton-desktop preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-01-newton-desktop"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "01.01");
    equal(rApply(input, actual.ranges), expected[id], "01.02");
  }
});

test("02 - 2019-03-26-airmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-airmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "02.01");
    equal(rApply(input, actual.ranges), expected[id], "02.02");
  }
});

test("03 - 2019-03-26-android-2.3 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-android-2.3"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "03.01");
    equal(rApply(input, actual.ranges), expected[id], "03.02");
  }
});

test("04 - 2019-03-26-android-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-android-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "04.01");
    equal(rApply(input, actual.ranges), expected[id], "04.02");
  }
});

test("05 - 2019-03-26-android-4.2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-android-4.2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "05.01");
    equal(rApply(input, actual.ranges), expected[id], "05.02");
  }
});

test("06 - 2019-03-26-android-4.4 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-android-4.4"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "06.01");
    equal(rApply(input, actual.ranges), expected[id], "06.02");
  }
});

test("07 - 2019-03-26-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "07.01");
    equal(rApply(input, actual.ranges), expected[id], "07.02");
  }
});

test("08 - 2019-03-26-aol preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-aol"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "08.01");
    equal(rApply(input, actual.ranges), expected[id], "08.02");
  }
});

test("09 - 2019-03-26-apple-mail-10 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-10"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "09.01");
    equal(rApply(input, actual.ranges), expected[id], "09.02");
  }
});

test("10 - 2019-03-26-apple-mail-12.4 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-12.4"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "10.01");
    equal(rApply(input, actual.ranges), expected[id], "10.02");
  }
});

test("11 - 2019-03-26-apple-mail-8 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-8"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "11.01");
    equal(rApply(input, actual.ranges), expected[id], "11.02");
  }
});

test("12 - 2019-03-26-edison-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-edison-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "12.01");
    equal(rApply(input, actual.ranges), expected[id], "12.02");
  }
});

test("13 - 2019-03-26-edison-ios preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-edison-ios"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "13.01");
    equal(rApply(input, actual.ranges), expected[id], "13.02");
  }
});

test("14 - 2019-03-26-edison preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-edison"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "14.01");
    equal(rApply(input, actual.ranges), expected[id], "14.02");
  }
});

test("15 - 2019-03-26-freenet-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-freenet-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "15.01");
    equal(rApply(input, actual.ranges), expected[id], "15.02");
  }
});

test("16 - 2019-03-26-freenet preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-freenet"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "16.01");
    equal(rApply(input, actual.ranges), expected[id], "16.02");
  }
});

test("17 - 2019-03-26-gmail-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-gmail-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "17.01");
    equal(rApply(input, actual.ranges), expected[id], "17.02");
  }
});

test("18 - 2019-03-26-gmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-gmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "18.01");
    equal(rApply(input, actual.ranges), expected[id], "18.02");
  }
});

test("19 - 2019-03-26-gmx-web.de-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-gmx-web.de-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "19.01");
    equal(rApply(input, actual.ranges), expected[id], "19.02");
  }
});

test("20 - 2019-03-26-gmx-web.de preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-gmx-web.de"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "20.01");
    equal(rApply(input, actual.ranges), expected[id], "20.02");
  }
});

test("21 - 2019-03-26-ios-mail-10 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-ios-mail-10"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "21.01");
    equal(rApply(input, actual.ranges), expected[id], "21.02");
  }
});

test("22 - 2019-03-26-nine preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-nine"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "22.01");
    equal(rApply(input, actual.ranges), expected[id], "22.02");
  }
});

test("23 - 2019-03-26-notes-8 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-notes-8"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "23.01");
    equal(rApply(input, actual.ranges), expected[id], "23.02");
  }
});

test("24 - 2019-03-26-open-xchange preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-open-xchange"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "24.01");
    equal(rApply(input, actual.ranges), expected[id], "24.02");
  }
});

test("25 - 2019-03-26-orange preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-orange"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "25.01");
    equal(rApply(input, actual.ranges), expected[id], "25.02");
  }
});

test("26 - 2019-03-26-outlook-ios-android-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-outlook-ios-android-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "26.01");
    equal(rApply(input, actual.ranges), expected[id], "26.02");
  }
});

test("27 - 2019-03-26-outlook-ios-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-outlook-ios-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "27.01");
    equal(rApply(input, actual.ranges), expected[id], "27.02");
  }
});

test("28 - 2019-03-26-outlook-macos preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-outlook-macos"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "28.01");
    equal(rApply(input, actual.ranges), expected[id], "28.02");
  }
});

test("29 - 2019-03-26-outlook-webmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-outlook-webmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "29.01");
    equal(rApply(input, actual.ranges), expected[id], "29.02");
  }
});

test("30 - 2019-03-26-postbox preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-postbox"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "30.01");
    equal(rApply(input, actual.ranges), expected[id], "30.02");
  }
});

test("31 - 2019-03-26-samsung-email-s4 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s4"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "31.01");
    equal(rApply(input, actual.ranges), expected[id], "31.02");
  }
});

test("32 - 2019-03-26-samsung-email-s5-s9-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "32.01");
    equal(rApply(input, actual.ranges), expected[id], "32.02");
  }
});

test("33 - 2019-03-26-samsung-email-s5-s9-3 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9-3"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "33.01");
    equal(rApply(input, actual.ranges), expected[id], "33.02");
  }
});

test("34 - 2019-03-26-samsung-email-s5-s9 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "34.01");
    equal(rApply(input, actual.ranges), expected[id], "34.02");
  }
});

test("35 - 2019-03-26-spark preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-spark"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "35.01");
    equal(rApply(input, actual.ranges), expected[id], "35.02");
  }
});

test("36 - 2019-03-26-t-online.de preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-t-online.de"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "36.01");
    equal(rApply(input, actual.ranges), expected[id], "36.02");
  }
});

test("37 - 2019-03-26-thunderbird-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-thunderbird-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "37.01");
    equal(rApply(input, actual.ranges), expected[id], "37.02");
  }
});

test("38 - 2019-03-26-thunderbird preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-thunderbird"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "38.01");
    equal(rApply(input, actual.ranges), expected[id], "38.02");
  }
});

test("39 - 2019-03-26-windows-mail-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-windows-mail-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "39.01");
    equal(rApply(input, actual.ranges), expected[id], "39.02");
  }
});

test("40 - 2019-03-26-windows-mail preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-windows-mail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "40.01");
    equal(rApply(input, actual.ranges), expected[id], "40.02");
  }
});

test("41 - 2019-03-26-yahoo-2 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-yahoo-2"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "41.01");
    equal(rApply(input, actual.ranges), expected[id], "41.02");
  }
});

test("42 - 2019-03-26-yahoo-3 preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-yahoo-3"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "42.01");
    equal(rApply(input, actual.ranges), expected[id], "42.02");
  }
});

test("43 - 2019-03-26-yahoo preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-03-26-yahoo"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "43.01");
    equal(rApply(input, actual.ranges), expected[id], "43.02");
  }
});

test("44 - 2019-04-01-gmail-ios preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-04-01-gmail-ios"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "44.01");
    equal(rApply(input, actual.ranges), expected[id], "44.02");
  }
});

test("45 - 2019-04-01-gmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-04-01-gmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "45.01");
    equal(rApply(input, actual.ranges), expected[id], "45.02");
  }
});

test("46 - 2019-04-01-outlook-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-04-01-outlook-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "46.01");
    equal(rApply(input, actual.ranges), expected[id], "46.02");
  }
});

test("47 - 2019-04-01-outlook preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-04-01-outlook"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "47.01");
    equal(rApply(input, actual.ranges), expected[id], "47.02");
  }
});

test("48 - 2019-04-08-outlook-webmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-04-08-outlook-webmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "48.01");
    equal(rApply(input, actual.ranges), expected[id], "48.02");
  }
});

test("49 - 2019-06-13-thunderbird preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-06-13-thunderbird"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "49.01");
    equal(rApply(input, actual.ranges), expected[id], "49.02");
  }
});

test("50 - 2019-09-10-freenet preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-09-10-freenet"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "50.01");
    equal(rApply(input, actual.ranges), expected[id], "50.02");
  }
});

test("51 - 2019-10-15-outlook-dark-mode preserves targeting through minification", () => {
  for (const { id, input } of cases["2019-10-15-outlook-dark-mode"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "51.01");
    equal(rApply(input, actual.ranges), expected[id], "51.02");
  }
});

test("52 - 2020-02-19-ios-mail-13 preserves targeting through minification", () => {
  for (const { id, input } of cases["2020-02-19-ios-mail-13"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "52.01");
    equal(rApply(input, actual.ranges), expected[id], "52.02");
  }
});

test("53 - 2020-03-23-yahoo preserves targeting through minification", () => {
  for (const { id, input } of cases["2020-03-23-yahoo"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "53.01");
    equal(rApply(input, actual.ranges), expected[id], "53.02");
  }
});

test("54 - 2020-04-27-sapo preserves targeting through minification", () => {
  for (const { id, input } of cases["2020-04-27-sapo"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "54.01");
    equal(rApply(input, actual.ranges), expected[id], "54.02");
  }
});

test("55 - 2021-06-14-ios-mail-15 preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-06-14-ios-mail-15"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "55.01");
    equal(rApply(input, actual.ranges), expected[id], "55.02");
  }
});

test("56 - 2021-06-21-yahoo-aol preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-06-21-yahoo-aol"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "56.01");
    equal(rApply(input, actual.ranges), expected[id], "56.02");
  }
});

test("57 - 2021-10-08-163.com preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-10-08-163.com"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "57.01");
    equal(rApply(input, actual.ranges), expected[id], "57.02");
  }
});

test("58 - 2021-10-08-outlook-ios preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-10-08-outlook-ios"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "58.01");
    equal(rApply(input, actual.ranges), expected[id], "58.02");
  }
});

test("59 - 2021-10-08-outlook-pwa preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-10-08-outlook-pwa"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "59.01");
    equal(rApply(input, actual.ranges), expected[id], "59.02");
  }
});

test("60 - 2021-10-08-yahoo-japan preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-10-08-yahoo-japan"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "60.01");
    equal(rApply(input, actual.ranges), expected[id], "60.02");
  }
});

test("61 - 2021-10-29-comcast-webmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-10-29-comcast-webmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "61.01");
    equal(rApply(input, actual.ranges), expected[id], "61.02");
  }
});

test("62 - 2021-10-29-libero preserves targeting through minification", () => {
  for (const { id, input } of cases["2021-10-29-libero"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "62.01");
    equal(rApply(input, actual.ranges), expected[id], "62.02");
  }
});

test("63 - 2022-02-22-apple-mail-ipad preserves targeting through minification", () => {
  for (const { id, input } of cases["2022-02-22-apple-mail-ipad"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "63.01");
    equal(rApply(input, actual.ranges), expected[id], "63.02");
  }
});

test("64 - 2022-07-12-outlook-ios-android-3 preserves targeting through minification", () => {
  for (const { id, input } of cases["2022-07-12-outlook-ios-android-3"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "64.01");
    equal(rApply(input, actual.ranges), expected[id], "64.02");
  }
});

test("65 - 2022-08-15-seznam.cz preserves targeting through minification", () => {
  for (const { id, input } of cases["2022-08-15-seznam.cz"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "65.01");
    equal(rApply(input, actual.ranges), expected[id], "65.02");
  }
});

test("66 - 2022-11-09-spark-ios-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2022-11-09-spark-ios-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "66.01");
    equal(rApply(input, actual.ranges), expected[id], "66.02");
  }
});

test("67 - 2023-05-11-superhuman-mac preserves targeting through minification", () => {
  for (const { id, input } of cases["2023-05-11-superhuman-mac"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "67.01");
    equal(rApply(input, actual.ranges), expected[id], "67.02");
  }
});

test("68 - 2023-10-22-seznam preserves targeting through minification", () => {
  for (const { id, input } of cases["2023-10-22-seznam"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "68.01");
    equal(rApply(input, actual.ranges), expected[id], "68.02");
  }
});

test("69 - 2023-11-13-gmail-ipad preserves targeting through minification", () => {
  for (const { id, input } of cases["2023-11-13-gmail-ipad"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "69.01");
    equal(rApply(input, actual.ranges), expected[id], "69.02");
  }
});

test("70 - 2023-12-12-outlook-mac-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2023-12-12-outlook-mac-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "70.01");
    equal(rApply(input, actual.ranges), expected[id], "70.02");
  }
});

test("71 - 2023-12-19-apple-mail-ios-17 preserves targeting through minification", () => {
  for (const { id, input } of cases["2023-12-19-apple-mail-ios-17"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "71.01");
    equal(rApply(input, actual.ranges), expected[id], "71.02");
  }
});

test("72 - 2024-02-07-qq-mail-android preserves targeting through minification", () => {
  for (const { id, input } of cases["2024-02-07-qq-mail-android"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "72.01");
    equal(rApply(input, actual.ranges), expected[id], "72.02");
  }
});

test("73 - 2024-07-17-samsung-email-microsoft preserves targeting through minification", () => {
  for (const { id, input } of cases["2024-07-17-samsung-email-microsoft"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "73.01");
    equal(rApply(input, actual.ranges), expected[id], "73.02");
  }
});

test("74 - 2024-07-17-samsung-email-non-microsoft preserves targeting through minification", () => {
  for (const { id, input } of cases["2024-07-17-samsung-email-non-microsoft"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "74.01");
    equal(rApply(input, actual.ranges), expected[id], "74.02");
  }
});

test("75 - 2024-07-24-mailspring-desktop preserves targeting through minification", () => {
  for (const { id, input } of cases["2024-07-24-mailspring-desktop"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "75.01");
    equal(rApply(input, actual.ranges), expected[id], "75.02");
  }
});

test("76 - 2024-08-30-freefr-webmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2024-08-30-freefr-webmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "76.01");
    equal(rApply(input, actual.ranges), expected[id], "76.02");
  }
});

test("77 - 2025-03-16-notionmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2025-03-16-notionmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "77.01");
    equal(rApply(input, actual.ranges), expected[id], "77.02");
  }
});

test("78 - 2025-03-26-onet-chrome preserves targeting through minification", () => {
  for (const { id, input } of cases["2025-03-26-onet-chrome"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "78.01");
    equal(rApply(input, actual.ranges), expected[id], "78.02");
  }
});

test("79 - 2025-03-28-outlook-webmail preserves targeting through minification", () => {
  for (const { id, input } of cases["2025-03-28-outlook-webmail"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "79.01");
    equal(rApply(input, actual.ranges), expected[id], "79.02");
  }
});

test("80 - 2025-04-27-proton preserves targeting through minification", () => {
  for (const { id, input } of cases["2025-04-27-proton"]) {
    const actual = crush(input, options);
    equal({ id, result: actual.result }, { id, result: expected[id] }, "80.01");
    equal(rApply(input, actual.ranges), expected[id], "80.02");
  }
});

test.run();
