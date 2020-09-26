import tap from "tap";
import detect from "../dist/detect-is-it-html-or-xhtml.esm";

tap.test("01 - recognised HTML5 doctype", (t) => {
  t.equal(
    detect("<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML> aaaa zzzzzz"),
    "html",
    "01"
  );
  t.end();
});

tap.test("02 - recognised all HTML4 doctypes", (t) => {
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "02.01"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "02.02"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "02.03"
  );
  t.end();
});

tap.test("03 - recognised XHTML doctypes", (t) => {
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.01"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.02"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.03"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.04"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.05"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE math PUBLIC "-//W3C//DTD MathML 2.0//EN" "http://www.w3.org/Math/DTD/mathml2/mathml2.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "03.06"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "03.07"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.08"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.09"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg:svg PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.10"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.11"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.12"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.13"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "03.14"
  );
  t.end();
});

tap.test("04 - recognises old HTML doctypes", (t) => {
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "04.01"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "html",
    "04.02"
  );
  t.equal(
    detect(
      '<jshkjdfghg>jdslfjlf dghjlgjh <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd">\n<sdfhksh>\n<ljkgldkjfgl>sfjldg<qkwejklqwe>'
    ),
    "xhtml",
    "04.03"
  );
  t.end();
});
