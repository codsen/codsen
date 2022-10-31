import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { detectIsItHTMLOrXhtml as detect } from "../dist/detect-is-it-html-or-xhtml.esm.js";

test("01 - detects by image tags only, one closed image", () => {
  equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss'
    ),
    "xhtml",
    "01.01"
  );
});

test("02 - detects by images, one closed image and two unclosed", () => {
  equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss<img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">aksdhsfhk skjfhjkdhg dkfjghjf <img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">'
    ),
    "html",
    "02.01"
  );
});

test("03 - one closed, one unclosed image - leans to HTML side", () => {
  equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss<img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">'
    ),
    "html",
    "03.01"
  );
});

test("04 - detects by br tags only, one unclosed br", () => {
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.01"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.02"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.03"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "04.04"
  );
  equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Br       > alhdf lsdhfldlh gllf dlgd"
    ),
    "html",
    "04.05"
  );
});

test("05 - detects by br tags only, one closed br", () => {
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.01"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.02"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.03"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "05.04"
  );
  equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Br    /   > alhdf lsdhfldlh gllf dlgd"
    ),
    "xhtml",
    "05.05"
  );
});

test("06 - detects by hr tags only, one unclosed hr", () => {
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.01"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.02"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.03"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "06.04"
  );
  equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Hr       > alhdf lsdhfldlh gllf dlgd"
    ),
    "html",
    "06.05"
  );
});

test("07 - detects by hr tags only, one closed hr", () => {
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.01"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.02"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.03"
  );
  equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "07.04"
  );
  equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Hr   /    > alhdf lsdhfldlh gllf dlgd"
    ),
    "xhtml",
    "07.05"
  );
});

test.run();
