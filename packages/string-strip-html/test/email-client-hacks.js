import { readFileSync } from "node:fs";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

// Shared fixtures and source pins are maintained in ops/email-client-hacks/.
// Expectations follow text extraction: remove styles and hidden comments,
// retain revealed content, and keep the returned ranges consistent.
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

test("001 - 2019-03-01-newton-desktop", () => {
  for (const { id, input } of cases["2019-03-01-newton-desktop"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "001.01");
    equal(rApply(input, actual.ranges), expected[id], "001.02");
  }
});

test("002 - 2019-03-26-airmail", () => {
  for (const { id, input } of cases["2019-03-26-airmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "002.01");
    equal(rApply(input, actual.ranges), expected[id], "002.02");
  }
});

test("003 - 2019-03-26-android-2.3", () => {
  for (const { id, input } of cases["2019-03-26-android-2.3"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "003.01");
    equal(rApply(input, actual.ranges), expected[id], "003.02");
  }
});

test("004 - 2019-03-26-android-2", () => {
  for (const { id, input } of cases["2019-03-26-android-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "004.01");
    equal(rApply(input, actual.ranges), expected[id], "004.02");
  }
});

test("005 - 2019-03-26-android-4.2", () => {
  for (const { id, input } of cases["2019-03-26-android-4.2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "005.01");
    equal(rApply(input, actual.ranges), expected[id], "005.02");
  }
});

test("006 - 2019-03-26-android-4.4", () => {
  for (const { id, input } of cases["2019-03-26-android-4.4"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "006.01");
    equal(rApply(input, actual.ranges), expected[id], "006.02");
  }
});

test("007 - 2019-03-26-android", () => {
  for (const { id, input } of cases["2019-03-26-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "007.01");
    equal(rApply(input, actual.ranges), expected[id], "007.02");
  }
});

test("008 - 2019-03-26-aol", () => {
  for (const { id, input } of cases["2019-03-26-aol"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "008.01");
    equal(rApply(input, actual.ranges), expected[id], "008.02");
  }
});

test("009 - 2019-03-26-apple-mail-10", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-10"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "009.01");
    equal(rApply(input, actual.ranges), expected[id], "009.02");
  }
});

test("010 - 2019-03-26-apple-mail-12.4", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-12.4"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "010.01");
    equal(rApply(input, actual.ranges), expected[id], "010.02");
  }
});

test("011 - 2019-03-26-apple-mail-8", () => {
  for (const { id, input } of cases["2019-03-26-apple-mail-8"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "011.01");
    equal(rApply(input, actual.ranges), expected[id], "011.02");
  }
});

test("012 - 2019-03-26-edison-android", () => {
  for (const { id, input } of cases["2019-03-26-edison-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "012.01");
    equal(rApply(input, actual.ranges), expected[id], "012.02");
  }
});

test("013 - 2019-03-26-edison-ios", () => {
  for (const { id, input } of cases["2019-03-26-edison-ios"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "013.01");
    equal(rApply(input, actual.ranges), expected[id], "013.02");
  }
});

test("014 - 2019-03-26-edison", () => {
  for (const { id, input } of cases["2019-03-26-edison"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "014.01");
    equal(rApply(input, actual.ranges), expected[id], "014.02");
  }
});

test("015 - 2019-03-26-freenet-2", () => {
  for (const { id, input } of cases["2019-03-26-freenet-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "015.01");
    equal(rApply(input, actual.ranges), expected[id], "015.02");
  }
});

test("016 - 2019-03-26-freenet", () => {
  for (const { id, input } of cases["2019-03-26-freenet"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "016.01");
    equal(rApply(input, actual.ranges), expected[id], "016.02");
  }
});

test("017 - 2019-03-26-gmail-android", () => {
  for (const { id, input } of cases["2019-03-26-gmail-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "017.01");
    equal(rApply(input, actual.ranges), expected[id], "017.02");
  }
});

test("018 - 2019-03-26-gmail", () => {
  for (const { id, input } of cases["2019-03-26-gmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "018.01");
    equal(rApply(input, actual.ranges), expected[id], "018.02");
  }
});

test("019 - 2019-03-26-gmx-web.de-2", () => {
  for (const { id, input } of cases["2019-03-26-gmx-web.de-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "019.01");
    equal(rApply(input, actual.ranges), expected[id], "019.02");
  }
});

test("020 - 2019-03-26-gmx-web.de", () => {
  for (const { id, input } of cases["2019-03-26-gmx-web.de"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "020.01");
    equal(rApply(input, actual.ranges), expected[id], "020.02");
  }
});

test("021 - 2019-03-26-ios-mail-10", () => {
  for (const { id, input } of cases["2019-03-26-ios-mail-10"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "021.01");
    equal(rApply(input, actual.ranges), expected[id], "021.02");
  }
});

test("022 - 2019-03-26-nine", () => {
  for (const { id, input } of cases["2019-03-26-nine"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "022.01");
    equal(rApply(input, actual.ranges), expected[id], "022.02");
  }
});

test("023 - 2019-03-26-notes-8", () => {
  for (const { id, input } of cases["2019-03-26-notes-8"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "023.01");
    equal(rApply(input, actual.ranges), expected[id], "023.02");
  }
});

test("024 - 2019-03-26-open-xchange", () => {
  for (const { id, input } of cases["2019-03-26-open-xchange"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "024.01");
    equal(rApply(input, actual.ranges), expected[id], "024.02");
  }
});

test("025 - 2019-03-26-orange", () => {
  for (const { id, input } of cases["2019-03-26-orange"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "025.01");
    equal(rApply(input, actual.ranges), expected[id], "025.02");
  }
});

test("026 - 2019-03-26-outlook-ios-android-2", () => {
  for (const { id, input } of cases["2019-03-26-outlook-ios-android-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "026.01");
    equal(rApply(input, actual.ranges), expected[id], "026.02");
  }
});

test("027 - 2019-03-26-outlook-ios-android", () => {
  for (const { id, input } of cases["2019-03-26-outlook-ios-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "027.01");
    equal(rApply(input, actual.ranges), expected[id], "027.02");
  }
});

test("028 - 2019-03-26-outlook-macos", () => {
  for (const { id, input } of cases["2019-03-26-outlook-macos"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "028.01");
    equal(rApply(input, actual.ranges), expected[id], "028.02");
  }
});

test("029 - 2019-03-26-outlook-webmail", () => {
  for (const { id, input } of cases["2019-03-26-outlook-webmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "029.01");
    equal(rApply(input, actual.ranges), expected[id], "029.02");
  }
});

test("030 - 2019-03-26-postbox", () => {
  for (const { id, input } of cases["2019-03-26-postbox"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "030.01");
    equal(rApply(input, actual.ranges), expected[id], "030.02");
  }
});

test("031 - 2019-03-26-samsung-email-s4", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s4"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "031.01");
    equal(rApply(input, actual.ranges), expected[id], "031.02");
  }
});

test("032 - 2019-03-26-samsung-email-s5-s9-2", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "032.01");
    equal(rApply(input, actual.ranges), expected[id], "032.02");
  }
});

test("033 - 2019-03-26-samsung-email-s5-s9-3", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9-3"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "033.01");
    equal(rApply(input, actual.ranges), expected[id], "033.02");
  }
});

test("034 - 2019-03-26-samsung-email-s5-s9", () => {
  for (const { id, input } of cases["2019-03-26-samsung-email-s5-s9"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "034.01");
    equal(rApply(input, actual.ranges), expected[id], "034.02");
  }
});

test("035 - 2019-03-26-spark", () => {
  for (const { id, input } of cases["2019-03-26-spark"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "035.01");
    equal(rApply(input, actual.ranges), expected[id], "035.02");
  }
});

test("036 - 2019-03-26-t-online.de", () => {
  for (const { id, input } of cases["2019-03-26-t-online.de"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "036.01");
    equal(rApply(input, actual.ranges), expected[id], "036.02");
  }
});

test("037 - 2019-03-26-thunderbird-2", () => {
  for (const { id, input } of cases["2019-03-26-thunderbird-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "037.01");
    equal(rApply(input, actual.ranges), expected[id], "037.02");
  }
});

test("038 - 2019-03-26-thunderbird", () => {
  for (const { id, input } of cases["2019-03-26-thunderbird"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "038.01");
    equal(rApply(input, actual.ranges), expected[id], "038.02");
  }
});

test("039 - 2019-03-26-windows-mail-2", () => {
  for (const { id, input } of cases["2019-03-26-windows-mail-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "039.01");
    equal(rApply(input, actual.ranges), expected[id], "039.02");
  }
});

test("040 - 2019-03-26-windows-mail", () => {
  for (const { id, input } of cases["2019-03-26-windows-mail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "040.01");
    equal(rApply(input, actual.ranges), expected[id], "040.02");
  }
});

test("041 - 2019-03-26-yahoo-2", () => {
  for (const { id, input } of cases["2019-03-26-yahoo-2"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "041.01");
    equal(rApply(input, actual.ranges), expected[id], "041.02");
  }
});

test("042 - 2019-03-26-yahoo-3", () => {
  for (const { id, input } of cases["2019-03-26-yahoo-3"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "042.01");
    equal(rApply(input, actual.ranges), expected[id], "042.02");
  }
});

test("043 - 2019-03-26-yahoo", () => {
  for (const { id, input } of cases["2019-03-26-yahoo"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "043.01");
    equal(rApply(input, actual.ranges), expected[id], "043.02");
  }
});

test("044 - 2019-04-01-gmail-ios", () => {
  for (const { id, input } of cases["2019-04-01-gmail-ios"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "044.01");
    equal(rApply(input, actual.ranges), expected[id], "044.02");
  }
});

test("045 - 2019-04-01-gmail", () => {
  for (const { id, input } of cases["2019-04-01-gmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "045.01");
    equal(rApply(input, actual.ranges), expected[id], "045.02");
  }
});

test("046 - 2019-04-01-outlook-android", () => {
  for (const { id, input } of cases["2019-04-01-outlook-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "046.01");
    equal(rApply(input, actual.ranges), expected[id], "046.02");
  }
});

test("047 - 2019-04-01-outlook", () => {
  for (const { id, input } of cases["2019-04-01-outlook"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "047.01");
    equal(rApply(input, actual.ranges), expected[id], "047.02");
  }
});

test("048 - 2019-04-08-outlook-webmail", () => {
  for (const { id, input } of cases["2019-04-08-outlook-webmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "048.01");
    equal(rApply(input, actual.ranges), expected[id], "048.02");
  }
});

test("049 - 2019-06-13-thunderbird", () => {
  for (const { id, input } of cases["2019-06-13-thunderbird"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "049.01");
    equal(rApply(input, actual.ranges), expected[id], "049.02");
  }
});

test("050 - 2019-09-10-freenet", () => {
  for (const { id, input } of cases["2019-09-10-freenet"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "050.01");
    equal(rApply(input, actual.ranges), expected[id], "050.02");
  }
});

test("051 - 2019-10-15-outlook-dark-mode", () => {
  for (const { id, input } of cases["2019-10-15-outlook-dark-mode"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "051.01");
    equal(rApply(input, actual.ranges), expected[id], "051.02");
  }
});

test("052 - 2020-02-19-ios-mail-13", () => {
  for (const { id, input } of cases["2020-02-19-ios-mail-13"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "052.01");
    equal(rApply(input, actual.ranges), expected[id], "052.02");
  }
});

test("053 - 2020-03-23-yahoo", () => {
  for (const { id, input } of cases["2020-03-23-yahoo"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "053.01");
    equal(rApply(input, actual.ranges), expected[id], "053.02");
  }
});

test("054 - 2020-04-27-sapo", () => {
  for (const { id, input } of cases["2020-04-27-sapo"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "054.01");
    equal(rApply(input, actual.ranges), expected[id], "054.02");
  }
});

test("055 - 2021-06-14-ios-mail-15", () => {
  for (const { id, input } of cases["2021-06-14-ios-mail-15"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "055.01");
    equal(rApply(input, actual.ranges), expected[id], "055.02");
  }
});

test("056 - 2021-06-21-yahoo-aol", () => {
  for (const { id, input } of cases["2021-06-21-yahoo-aol"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "056.01");
    equal(rApply(input, actual.ranges), expected[id], "056.02");
  }
});

test("057 - 2021-10-08-163.com", () => {
  for (const { id, input } of cases["2021-10-08-163.com"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "057.01");
    equal(rApply(input, actual.ranges), expected[id], "057.02");
  }
});

test("058 - 2021-10-08-outlook-ios", () => {
  for (const { id, input } of cases["2021-10-08-outlook-ios"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "058.01");
    equal(rApply(input, actual.ranges), expected[id], "058.02");
  }
});

test("059 - 2021-10-08-outlook-pwa", () => {
  for (const { id, input } of cases["2021-10-08-outlook-pwa"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "059.01");
    equal(rApply(input, actual.ranges), expected[id], "059.02");
  }
});

test("060 - 2021-10-08-yahoo-japan", () => {
  for (const { id, input } of cases["2021-10-08-yahoo-japan"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "060.01");
    equal(rApply(input, actual.ranges), expected[id], "060.02");
  }
});

test("061 - 2021-10-29-comcast-webmail", () => {
  for (const { id, input } of cases["2021-10-29-comcast-webmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "061.01");
    equal(rApply(input, actual.ranges), expected[id], "061.02");
  }
});

test("062 - 2021-10-29-libero", () => {
  for (const { id, input } of cases["2021-10-29-libero"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "062.01");
    equal(rApply(input, actual.ranges), expected[id], "062.02");
  }
});

test("063 - 2022-02-22-apple-mail-ipad", () => {
  for (const { id, input } of cases["2022-02-22-apple-mail-ipad"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "063.01");
    equal(rApply(input, actual.ranges), expected[id], "063.02");
  }
});

test("064 - 2022-07-12-outlook-ios-android-3", () => {
  for (const { id, input } of cases["2022-07-12-outlook-ios-android-3"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "064.01");
    equal(rApply(input, actual.ranges), expected[id], "064.02");
  }
});

test("065 - 2022-08-15-seznam.cz", () => {
  for (const { id, input } of cases["2022-08-15-seznam.cz"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "065.01");
    equal(rApply(input, actual.ranges), expected[id], "065.02");
  }
});

test("066 - 2022-11-09-spark-ios-android", () => {
  for (const { id, input } of cases["2022-11-09-spark-ios-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "066.01");
    equal(rApply(input, actual.ranges), expected[id], "066.02");
  }
});

test("067 - 2023-05-11-superhuman-mac", () => {
  for (const { id, input } of cases["2023-05-11-superhuman-mac"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "067.01");
    equal(rApply(input, actual.ranges), expected[id], "067.02");
  }
});

test("068 - 2023-10-22-seznam", () => {
  for (const { id, input } of cases["2023-10-22-seznam"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "068.01");
    equal(rApply(input, actual.ranges), expected[id], "068.02");
  }
});

test("069 - 2023-11-13-gmail-ipad", () => {
  for (const { id, input } of cases["2023-11-13-gmail-ipad"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "069.01");
    equal(rApply(input, actual.ranges), expected[id], "069.02");
  }
});

test("070 - 2023-12-12-outlook-mac-android", () => {
  for (const { id, input } of cases["2023-12-12-outlook-mac-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "070.01");
    equal(rApply(input, actual.ranges), expected[id], "070.02");
  }
});

test("071 - 2023-12-19-apple-mail-ios-17", () => {
  for (const { id, input } of cases["2023-12-19-apple-mail-ios-17"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "071.01");
    equal(rApply(input, actual.ranges), expected[id], "071.02");
  }
});

test("072 - 2024-02-07-qq-mail-android", () => {
  for (const { id, input } of cases["2024-02-07-qq-mail-android"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "072.01");
    equal(rApply(input, actual.ranges), expected[id], "072.02");
  }
});

test("073 - 2024-07-17-samsung-email-microsoft", () => {
  for (const { id, input } of cases["2024-07-17-samsung-email-microsoft"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "073.01");
    equal(rApply(input, actual.ranges), expected[id], "073.02");
  }
});

test("074 - 2024-07-17-samsung-email-non-microsoft", () => {
  for (const { id, input } of cases["2024-07-17-samsung-email-non-microsoft"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "074.01");
    equal(rApply(input, actual.ranges), expected[id], "074.02");
  }
});

test("075 - 2024-07-24-mailspring-desktop", () => {
  for (const { id, input } of cases["2024-07-24-mailspring-desktop"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "075.01");
    equal(rApply(input, actual.ranges), expected[id], "075.02");
  }
});

test("076 - 2024-08-30-freefr-webmail", () => {
  for (const { id, input } of cases["2024-08-30-freefr-webmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "076.01");
    equal(rApply(input, actual.ranges), expected[id], "076.02");
  }
});

test("077 - 2025-03-16-notionmail", () => {
  for (const { id, input } of cases["2025-03-16-notionmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "077.01");
    equal(rApply(input, actual.ranges), expected[id], "077.02");
  }
});

test("078 - 2025-03-26-onet-chrome", () => {
  for (const { id, input } of cases["2025-03-26-onet-chrome"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "078.01");
    equal(rApply(input, actual.ranges), expected[id], "078.02");
  }
});

test("079 - 2025-03-28-outlook-webmail", () => {
  for (const { id, input } of cases["2025-03-28-outlook-webmail"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "079.01");
    equal(rApply(input, actual.ranges), expected[id], "079.02");
  }
});

test("080 - 2025-04-27-proton", () => {
  for (const { id, input } of cases["2025-04-27-proton"]) {
    const actual = stripHtml(input);
    equal(actual.result, expected[id], "080.01");
    equal(rApply(input, actual.ranges), expected[id], "080.02");
  }
});

test.run();
