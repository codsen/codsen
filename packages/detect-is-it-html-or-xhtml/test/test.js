const t = require("tap");
const detect = require("../dist/detect-is-it-html-or-xhtml.cjs");

// ==============================
// Doctype
// ==============================

t.test("01.01 - recognised HTML5 doctype", t => {
  t.equal(
    detect("<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML> aaaa zzzzzz"),
    "html",
    "01.01"
  );
  t.end();
});

t.test("01.02 - recognised all HTML4 doctypes", t => {
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.02.01"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.02.02"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.02.03"
  );
  t.end();
});

t.test("01.03 - recognised XHTML doctypes", t => {
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.01"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.02"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.03"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.04"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.05"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE math PUBLIC "-//W3C//DTD MathML 2.0//EN" "http://www.w3.org/Math/DTD/mathml2/mathml2.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.03.06"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.03.07"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.08"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.09"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg:svg PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.10"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.11"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.12"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.13"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.03.14"
  );
  t.end();
});

t.test("01.04 - recognises old HTML doctypes", t => {
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.04.01"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "01.04.02"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "01.04.03"
  );
  t.end();
});

// ==============================
// No doctype
// ==============================

t.test("02.01 - detects by image tags only, one closed image", t => {
  t.equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss'
    ),
    "xhtml",
    "02.01"
  );
  t.end();
});

t.test("02.02 - detects by images, one closed image and two unclosed", t => {
  t.equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss<img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">aksdhsfhk skjfhjkdhg dkfjghjf <img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">'
    ),
    "html",
    "02.02"
  );
  t.end();
});

t.test("02.03 - one closed, one unclosed image - leans to HTML side", t => {
  t.equal(
    detect(
      'kksfkhdkjd <table><tr><td>skfhdfkshd\nsfdhjkf</td><td><img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/></td></tr></table>jldsdfhkss<img src="spacer.gif" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">'
    ),
    "html",
    "02.03"
  );
  t.end();
});

t.test("02.04 - detects by br tags only, one unclosed br", t => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.04.01"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.04.02"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.04.03"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.04.04"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Br       > alhdf lsdhfldlh gllf dlgd"
    ),
    "html",
    "02.04.05"
  );
  t.end();
});

t.test("02.05 - detects by br tags only, one closed br", t => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.05.01"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <br/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.05.02"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.05.03"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <BR/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.05.04"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Br    /   > alhdf lsdhfldlh gllf dlgd"
    ),
    "xhtml",
    "02.05.05"
  );
  t.end();
});

t.test("02.06 - detects by hr tags only, one unclosed hr", t => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.06.06"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.06.07"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR > alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.06.08"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR> alhdf lsdhfldlh gllf dlgd"),
    "html",
    "02.06.09"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Hr       > alhdf lsdhfldlh gllf dlgd"
    ),
    "html",
    "02.06.10"
  );
  t.end();
});

t.test("02.07 - detects by hr tags only, one closed hr", t => {
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.07.11"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <hr/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.07.12"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR /> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.07.13"
  );
  t.equal(
    detect("alsdlasdslfh dfg dfjlgdf jldj <HR/> alhdf lsdhfldlh gllf dlgd"),
    "xhtml",
    "02.07.14"
  );
  t.equal(
    detect(
      "alsdlasdslfh dfg dfjlgdf jldj <    Hr   /    > alhdf lsdhfldlh gllf dlgd"
    ),
    "xhtml",
    "02.07.15"
  );
  t.end();
});

t.test("02.08 - real-life code", t => {
  t.equal(
    detect(
      '\
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\
              <title>Tile</title>\
            </head>\
            <body>\
            <table width="100%" border="0" cellpadding="0" cellspacing="0">\
              <tr>\
                <td>\
                  <img src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>\
                </td>\
              </tr>\
            </table>\
            </body>\
            </html>\
      '
    ),
    "xhtml",
    "02.08"
  );
  t.end();
});

// ==============================
// Undecided and can't-identify cases
// ==============================

t.test("03.01 - no tags at all, text string only", t => {
  t.equal(
    detect(
      "fhgkd  gjflkgjhlfjl gh;kj;lghj;jklkdjgj hsdkffj jagfg hdkghjkdfhg khkfg sjdgfg gfjdsgfjdhgj kf gfjhk fgkj"
    ),
    null,
    "03.01"
  );
  t.end();
});

t.test("03.02 - unrecognised meta tag - counts as HTML", t => {
  t.equal(detect("<!DOCTYPE rubbish>"), "html", "03.02");
  t.end();
});

t.test("03.03 - no meta tag, no single tags", t => {
  t.equal(detect("<table><tr><td>text</td></tr></table>"), null, "03.03");
  t.end();
});

t.test("03.04 - missing input", t => {
  t.equal(detect(), null, "03.04");
  t.end();
});

t.test("03.05 - input is not string - throws", t => {
  t.throws(() => {
    detect({
      a: "a"
    });
  }, /THROW_ID_01/g);
  t.end();
});
