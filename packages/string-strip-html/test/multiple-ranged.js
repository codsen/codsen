// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// multiple ranged tags
// -----------------------------------------------------------------------------

test("001 - with text in between", () => {
  equal(
    stripHtml(
      "code here and here <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more",
    ).result,
    "code here and here and also some here and finally here some more and also some here and finally here some more and also some here and finally here some more",
    "001.01",
  );
});

test("002 - tags touching each other", () => {
  equal(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more",
    ).result,
    "code here and here and finally here some more",
    "002.01",
  );
});

test("003 - lots of dodgy slashes around and within tags", () => {
  equal(
    stripHtml(
      "///</div>///<div/>///</ div>///< /div></ div>///< /div>///</ div />///</div/>///< / div / >///",
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "003.01",
  );
  equal(
    stripHtml(
      "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///",
    ).result,
    "///////////////////////////",
    "003.02",
  );
});

test("004 - this time repeated slashes inside", () => {
  equal(
    stripHtml(
      "///<///div>///<div/////>///<//// div>///< ///div><// div>///< ///div>///<// div //>///<///div///>///< //// div //// >///",
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "004.01",
  );
  equal(
    stripHtml(
      "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///",
    ).result,
    "///////////////////////////",
    "004.02",
  );
});

test("005 - and the same but with bunch of line breaks and tabs", () => {
  // line breaks within tag doesn't count - the new line breaks should not be introduced!
  equal(
    stripHtml(
      "///</\n/\n/\tdiv>///<div\n///\n//\t>///<\n////\t div>///< /\n//\ndiv><// \tdiv>///<\n\n\n\n ///div>///<\t\t\t\t// \n\n\ndiv //>///<\n\n\n///div\n///\n>///<\n //// \ndiv\n //// \n>///",
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "005.01",
  );
  equal(
    stripHtml(
      "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///",
    ).result,
    "///////////////////////////",
    "005.02",
  );
});

test("006 - lots of dodgy exclamation marks around and within tags", () => {
  equal(
    stripHtml(
      "zzz<!div>zzz<div!>zzz<! div>zzz< !div><! div>zzz< !div>zzz<! div !>zzz<!div!>zzz< ! div ! >zzz",
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "006.01",
  );
  equal(
    stripHtml(
      "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz",
    ).result,
    "zzzzzzzzzzzzzzzzzzzzzzzzzzz",
    "006.02",
  );
});

test("007 - this time repeated exclamation marks inside", () => {
  equal(
    stripHtml(
      "zzz<!!!div>zzz<div!!!!!>zzz<!!!! div>zzz< !!!div><!! div>zzz< !!!div>zzz<!! div !!>zzz<!!!div!!!>zzz< !!!! div !!!! >zzz",
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "007.01",
  );
  equal(
    stripHtml(
      "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz",
    ).result,
    "zzzzzzzzzzzzzzzzzzzzzzzzzzz",
    "007.02",
  );
});

test("008 - and the same but with bunch of line breaks and tabs", () => {
  equal(
    stripHtml(
      "zzz<!\n!\n!\tdiv>zzz<div\n!!!\n!!\t>zzz<\n!!!!\t div>zzz< !\n!!\ndiv><!! \tdiv>zzz<\n\n\n\n !!!div>zzz<\t\t\t\t!! \n\n\ndiv !!>zzz<\n\n\n!!!div\n!!!\n>zzz<\n !!!! \ndiv\n !!!! \n>zzz",
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "008.01",
  );
  equal(
    stripHtml(
      "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz",
    ).result,
    "zzzzzzzzzzzzzzzzzzzzzzzzzzz",
    "008.02",
  );
});

test.run();
