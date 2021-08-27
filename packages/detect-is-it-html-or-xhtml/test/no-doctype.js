import tap from "tap";
import { detectIsItHTMLOrXhtml as detect } from "../dist/detect-is-it-html-or-xhtml.esm.js";

tap.test("01 - detects by image tags only, one closed image", (t) => {
  t.equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss'
    ),
    "xhtml",
    "01"
  );
  t.end();
});

tap.test("02 - detects by images, one closed image and two unclosed", (t) => {
  t.equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss<img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">aksdhsfhk skjfhjkdhg dkfjghjf <img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">'
    ),
    "html",
    "02"
  );
  t.end();
});

tap.test("03 - one closed, one unclosed image - leans to HTML side", (t) => {
  t.equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss<img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">'
    ),
    "html",
    "03"
  );
  t.end();
});

tap.test("04 - detects by br tags only, one unclosed br", (t) => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.01"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.02"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.03"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.04"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Br       > alhdf lsdhfldlh gllf dlgd"
    ),
    "html",
    "04.05"
  );
  t.end();
});

tap.test("05 - detects by br tags only, one closed br", (t) => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.01"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.02"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.03"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.04"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Br    /   > alhdf lsdhfldlh gllf dlgd"
    ),
    "xhtml",
    "05.05"
  );
  t.end();
});

tap.test("06 - detects by hr tags only, one unclosed hr", (t) => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.01"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.02"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.03"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.04"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Hr       > alhdf lsdhfldlh gllf dlgd"
    ),
    "html",
    "06.05"
  );
  t.end();
});

tap.test("07 - detects by hr tags only, one closed hr", (t) => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.01"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.02"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.03"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.04"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Hr   /    > alhdf lsdhfldlh gllf dlgd"
    ),
    "xhtml",
    "07.05"
  );
  t.end();
});
