// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// false positives
// -----------------------------------------------------------------------------

test("001 - false positives - equations: very sneaky considering b is a legit tag name", () => {
  equal(
    stripHtml("Equations are: a < b and c > d").result,
    "Equations are: a < b and c > d",
    "001.01",
  );
});

test("002 - false positives - inwards-pointing arrows", () => {
  equal(
    stripHtml("Look here: ---> a <---").result,
    "Look here: ---> a <---",
    "002.01",
  );
});

test("003 - false positives - arrows mixed with tags", () => {
  equal(
    stripHtml(
      "Look here: ---> a <--- and here: ---> b <--- oh, and few tags: <div><article>\nzz</article></div>",
    ).result,
    "Look here: ---> a <--- and here: ---> b <--- oh, and few tags:\nzz",
    "003.01",
  );
});

test("004 - false positives - opening bracket", () => {
  equal(stripHtml("<").result, "<", "004.01");
});

test("005 - false positives - closing bracket", () => {
  equal(stripHtml(">").result, ">", "005.01");
});

test("006 - false positives - three openings", () => {
  equal(stripHtml(">>>").result, ">>>", "006.01");
});

test("007 - false positives - three closings", () => {
  equal(stripHtml("<<<").result, "<<<", "007.01");
});

test("008 - false positives - spaced three openings", () => {
  equal(stripHtml(" <<< ").result, "<<<", "008.01");
});

test("009 - false positives - tight recognised opening tag name, missing closing", () => {
  equal(stripHtml("<a").result, "", "009.01");
});

test("010 - false positives - unrecognised opening tag, missing closing", () => {
  equal(stripHtml("<yo").result, "", "010.01");
});

test("011 - false positives - missing opening, recognised tag", () => {
  equal(stripHtml("a>").result, "a>", "011.01");
});

test("012 - false positives - missing opening, unrecognised tag", () => {
  equal(stripHtml("yo>").result, "yo>", "012.01");
});

test("013 - false positives - conditionals that appear on Outlook only", () => {
  equal(
    stripHtml(`<!--[if (gte mso 9)|(IE)]>
  <table width="540" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
<![endif]-->
zzz
<!--[if (gte mso 9)|(IE)]>
      </td>
    </tr>
  </table>
<![endif]-->`).result,
    "zzz",
    "013.01",
  );
});

test("014 - false positives - conditionals that are visible for Outlook only", () => {
  equal(
    stripHtml(`<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->`).result,
    "shown for everything except Outlook",
    "014.01",
  );
});

test("015 - false positives - conditionals that are visible for Outlook only", () => {
  equal(
    stripHtml(`a<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->b`).result,
    "a\nshown for everything except Outlook\nb",
    "015.01",
  );
});

test("016 - false positives - conditionals that are visible for Outlook only", () => {
  equal(
    stripHtml(`<!--[if !mso]><!--><table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        shown for everything except Outlook
      </td>
    </tr>
  </table><!--<![endif]-->`).result,
    "shown for everything except Outlook",
    "016.01",
  );
});

test("017 - false positives - consecutive tags", () => {
  equal(
    stripHtml(
      "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
    ).result,
    "Text First point Second point Third point Text straight after",
    "017.01",
  );
});

test("018 - digit is the first character following the opening bracket, quote", () => {
  let input = '"<5 text here';
  equal(stripHtml(input).result, input, "018.01");
});

test("019 - digit is the first character following the opening bracket", () => {
  let input = "<5 text here";
  equal(stripHtml(input).result, input, "019.01");
});

test("020 - digit is the first character following the opening bracket", () => {
  let input = "< 5 text here";
  equal(stripHtml(input).result, input, "020.01");
});

test("021 - numbers compared", () => {
  let input = "1 < 5 for sure";
  equal(stripHtml(input).result, input, "021.01");
});

test("022 - numbers compared, tight", () => {
  let input = "1 <5 for sure";
  equal(stripHtml(input).result, input, "022.01");
});

test("023 - number letter", () => {
  let input = "aaa 1 < 5s bbb";
  equal(stripHtml(input).result, input, "023.01");
});

test("024 - number letter, tight", () => {
  let input = "aaa 1 <5s bbb";
  equal(stripHtml(input).result, input, "024.01");
});

test("025 - number letter, tight around", () => {
  let input = "aaa 1<5s bbb";
  equal(stripHtml(input).result, input, "025.01");
});

test("026 - tag name with closing bracket in front", () => {
  let input = ">table";
  equal(stripHtml(input).result, input, "026.01");
});

test("027", () => {
  let input = '{"Operator":"<=","IsValid":true}';
  equal(stripHtml(input).result, input, "027.01");
});

test("028", () => {
  let input = '<a">';
  equal(stripHtml(input).result, "", "028.01");
});

test("029", () => {
  let input = '<a"">';
  equal(stripHtml(input).result, "", "029.01");
});

test("030", () => {
  let input = "<a'>";
  equal(stripHtml(input).result, "", "030.01");
});

test("031", () => {
  let input = "<a''>";
  equal(stripHtml(input).result, "", "031.01");
});

test("032", () => {
  let input = "H4<bE77]7oQL";
  equal(stripHtml(input).result, "H4", "032.01");
});

test("033", () => {
  let input = "head > shoulders > knees > toes";
  equal(stripHtml(input).result, input, "033.01");
});

test("034", () => {
  let input = "hat > head > shoulders > knees > toes";
  equal(stripHtml(input).result, input, "034.01");
});

test("035", () => {
  let input = "aaa hat > head > shoulders > knees > toes";
  equal(stripHtml(input).result, input, "035.01");
});

// https://github.com/codsen/codsen/issues/78
// presence of closing slash is a sign of being a tag:
test("036", () => {
  let input = "head /> shoulders > knees > toes";
  equal(stripHtml(input).result, "shoulders > knees > toes", "036.01");
});
test("037", () => {
  let input = "head / > shoulders > knees > toes";
  equal(stripHtml(input).result, "shoulders > knees > toes", "037.01");
});
test("038", () => {
  let input = "head/ > shoulders > knees > toes";
  equal(stripHtml(input).result, "shoulders > knees > toes", "038.01");
});
test("039", () => {
  let input = "head/> shoulders > knees > toes";
  equal(stripHtml(input).result, "shoulders > knees > toes", "039.01");
});

test("040", () => {
  let input = "hat > head /> shoulders > knees > toes";
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "040.01");
});
test("041", () => {
  let input = "hat > head / > shoulders > knees > toes";
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "041.01");
});
test("042", () => {
  let input = "hat > head/ > shoulders > knees > toes";
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "042.01");
});
test("043", () => {
  let input = "hat > head/> shoulders > knees > toes";
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "043.01");
});

// HTML attribute presence incriminates being a tag
test("044 - double quotes", () => {
  let input = 'hat > head class="z"> shoulders > knees > toes';
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "044.01");
});
test("045 - double quotes", () => {
  let input = 'hat > head class="z"/> shoulders > knees > toes';
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "045.01");
});
test("046 - single quotes", () => {
  let input = "hat > head class='z'> shoulders > knees > toes";
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "046.01");
});
test("047 - single quotes", () => {
  let input = "hat > head class='z'/> shoulders > knees > toes";
  equal(stripHtml(input).result, "hat > shoulders > knees > toes", "047.01");
});

// https://github.com/codsen/codsen/issues/97
test("048 - dollar sign is not a tag-name starter", () => {
  let input =
    "I make <$2k/month right now and looking to add a new income source";
  equal(
    stripHtml(input),
    {
      result: input,
      ranges: null,
      allTagLocations: [],
      filteredTagLocations: [],
    },
    "048.01",
  );
});

test("049 - whitespace before an invalid tag-name starter", () => {
  let input =
    "I make <   $2k/month right now and looking to add a new income source";
  equal(stripHtml(input).result, input, "049.01");
});

test("050 - valid tags around an invalid tag candidate", () => {
  let input = "<b>I make <$2k/month right now</b>";
  equal(stripHtml(input).result, "I make <$2k/month right now", "050.01");
});

test.run();
