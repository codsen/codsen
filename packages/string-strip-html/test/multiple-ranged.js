import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// multiple ranged tags
// -----------------------------------------------------------------------------

tap.test("01 - with text in between", (t) => {
  t.hasStrict(
    stripHtml(
      "code here and here <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more"
    ),
    {
      result:
        "code here and here and also some here and finally here some more and also some here and finally here some more and also some here and finally here some more",
    },
    "01"
  );
  t.end();
});

tap.test("02 - tags touching each other", (t) => {
  t.hasStrict(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more"
    ),
    { result: "code here and here and finally here some more" },
    "02"
  );
  t.end();
});

tap.test("03 - lots of dodgy slashes around and within tags", (t) => {
  t.hasStrict(
    stripHtml(
      "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///"
    ),
    { result: "/// /// /// /// /// /// /// /// ///" },
    "03"
  );
  t.end();
});

tap.test("04 - this time repeated slashes inside", (t) => {
  t.hasStrict(
    stripHtml(
      "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///"
    ),
    { result: "/// /// /// /// /// /// /// /// ///" },
    "04"
  );
  t.end();
});

tap.test("05 - and the same but with bunch of line breaks and tabs", (t) => {
  // line breaks within tag doesn't count - the new line breaks should not be introduced!
  t.hasStrict(
    stripHtml(
      "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///"
    ),
    { result: "/// /// /// /// /// /// /// /// ///" },
    "05"
  );
  t.end();
});

tap.test("06 - lots of dodgy exclamation marks around and within tags", (t) => {
  t.hasStrict(
    stripHtml(
      "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz"
    ),
    { result: "zzz zzz zzz zzz zzz zzz zzz zzz zzz" },
    "06"
  );
  t.end();
});

tap.test("07 - this time repeated exclamation marks inside", (t) => {
  t.hasStrict(
    stripHtml(
      "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz"
    ),
    { result: "zzz zzz zzz zzz zzz zzz zzz zzz zzz" },
    "07"
  );
  t.end();
});

tap.test("08 - and the same but with bunch of line breaks and tabs", (t) => {
  t.hasStrict(
    stripHtml(
      "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz"
    ),
    { result: "zzz zzz zzz zzz zzz zzz zzz zzz zzz" },
    "08"
  );
  t.end();
});
