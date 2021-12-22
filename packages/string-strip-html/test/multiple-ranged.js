import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// multiple ranged tags
// -----------------------------------------------------------------------------

test("01 - with text in between", () => {
  equal(
    stripHtml(
      "code here and here <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more"
    ).result,
    "code here and here and also some here and finally here some more and also some here and finally here some more and also some here and finally here some more",
    "01"
  );
});

test("02 - tags touching each other", () => {
  equal(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more"
    ).result,
    "code here and here and finally here some more",
    "02"
  );
});

test("03 - lots of dodgy slashes around and within tags", () => {
  equal(
    stripHtml(
      "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///"
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "03"
  );
});

test("04 - this time repeated slashes inside", () => {
  equal(
    stripHtml(
      "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///"
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "04"
  );
});

test("05 - and the same but with bunch of line breaks and tabs", () => {
  // line breaks within tag doesn't count - the new line breaks should not be introduced!
  equal(
    stripHtml(
      "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///"
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "05"
  );
});

test("06 - lots of dodgy exclamation marks around and within tags", () => {
  equal(
    stripHtml(
      "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz"
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "06"
  );
});

test("07 - this time repeated exclamation marks inside", () => {
  equal(
    stripHtml(
      "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz"
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "07"
  );
});

test("08 - and the same but with bunch of line breaks and tabs", () => {
  equal(
    stripHtml(
      "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz"
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "08"
  );
});

test.run();
