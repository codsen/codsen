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
    "01.01"
  );
});

test("02 - tags touching each other", () => {
  equal(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more"
    ).result,
    "code here and here and finally here some more",
    "02.01"
  );
});

test("03 - lots of dodgy slashes around and within tags", () => {
  equal(
    stripHtml(
      "///</div>///<div/>///</ div>///< /div></ div>///< /div>///</ div />///</div/>///< / div / >///"
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "03.01"
  );
  equal(
    stripHtml(
      "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///"
    ).result,
    "///////////////////////////",
    "03.02"
  );
});

test("04 - this time repeated slashes inside", () => {
  equal(
    stripHtml(
      "///<///div>///<div/////>///<//// div>///< ///div><// div>///< ///div>///<// div //>///<///div///>///< //// div //// >///"
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "04.01"
  );
  equal(
    stripHtml(
      "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///"
    ).result,
    "///////////////////////////",
    "04.02"
  );
});

test("05 - and the same but with bunch of line breaks and tabs", () => {
  // line breaks within tag doesn't count - the new line breaks should not be introduced!
  equal(
    stripHtml(
      "///</\n/\n/\tdiv>///<div\n///\n//\t>///<\n////\t div>///< /\n//\ndiv><// \tdiv>///<\n\n\n\n ///div>///<\t\t\t\t// \n\n\ndiv //>///<\n\n\n///div\n///\n>///<\n //// \ndiv\n //// \n>///"
    ).result,
    "/// /// /// /// /// /// /// /// ///",
    "05.01"
  );
  equal(
    stripHtml(
      "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///"
    ).result,
    "///////////////////////////",
    "05.02"
  );
});

test("06 - lots of dodgy exclamation marks around and within tags", () => {
  equal(
    stripHtml(
      "zzz<!div>zzz<div!>zzz<! div>zzz< !div><! div>zzz< !div>zzz<! div !>zzz<!div!>zzz< ! div ! >zzz"
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "06.01"
  );
  equal(
    stripHtml(
      "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz"
    ).result,
    "zzzzzzzzzzzzzzzzzzzzzzzzzzz",
    "06.02"
  );
});

test("07 - this time repeated exclamation marks inside", () => {
  equal(
    stripHtml(
      "zzz<!!!div>zzz<div!!!!!>zzz<!!!! div>zzz< !!!div><!! div>zzz< !!!div>zzz<!! div !!>zzz<!!!div!!!>zzz< !!!! div !!!! >zzz"
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "07.01"
  );
  equal(
    stripHtml(
      "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz"
    ).result,
    "zzzzzzzzzzzzzzzzzzzzzzzzzzz",
    "07.02"
  );
});

test("08 - and the same but with bunch of line breaks and tabs", () => {
  equal(
    stripHtml(
      "zzz<!\n!\n!\tdiv>zzz<div\n!!!\n!!\t>zzz<\n!!!!\t div>zzz< !\n!!\ndiv><!! \tdiv>zzz<\n\n\n\n !!!div>zzz<\t\t\t\t!! \n\n\ndiv !!>zzz<\n\n\n!!!div\n!!!\n>zzz<\n !!!! \ndiv\n !!!! \n>zzz"
    ).result,
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "08.01"
  );
  equal(
    stripHtml(
      "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz"
    ).result,
    "zzzzzzzzzzzzzzzzzzzzzzzzzzz",
    "08.02"
  );
});

test.run();
