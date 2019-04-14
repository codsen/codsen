import test from "ava";
import alt from "../dist/html-img-alt.esm";

// GROUP ZEROZERO.
// -----------------------------------------------------------------------------
// no alt attr is missing, only whitespace control

test("00.01 - nothing is missing", t => {
  t.deepEqual(
    alt('zzz<img        alt="123" >zzz'),
    'zzz<img alt="123" >zzz',
    "00.01 - one HTML tag, only excessive whitespace"
  );
});

test("00.02 - nothing is missing", t => {
  t.deepEqual(
    alt('<img   alt="123"    >'),
    '<img alt="123" >',
    "00.02 - whitespace on both sides, one tag"
  );
});

test("00.03 - nothing is missing", t => {
  t.deepEqual(
    alt('xxx<img        alt="123" >yyy<img   alt="123"    >zzz'),
    'xxx<img alt="123" >yyy<img alt="123" >zzz',
    "00.03 - multiple HTML tags, only excessive whitespace"
  );
});

test("00.04 - nothing is missing", t => {
  t.deepEqual(
    alt('zzz<img        alt="123" />zzz'),
    'zzz<img alt="123" />zzz',
    "00.04 - one XHTML tag, only excessive whitespace"
  );
});

test("00.05 - nothing is missing", t => {
  t.deepEqual(
    alt('xxx<img        alt="123" />yyy<img   alt="123"    />zzz'),
    'xxx<img alt="123" />yyy<img alt="123" />zzz',
    "00.05 - multiple XHTML tags, only excessive whitespace"
  );
});

test("00.06 - nothing is missing", t => {
  t.deepEqual(
    alt("aaaa        bbbbb"),
    "aaaa        bbbbb",
    "00.06 - excessive whitespace, no tags at all"
  );
});

test("00.07 - nothing is missing", t => {
  t.deepEqual(
    alt("aaaa alt bbbbb"),
    "aaaa alt bbbbb",
    "00.07 - suspicious alt within copy but not IMG tag"
  );
});

test("00.08 - nothing is missing", t => {
  t.deepEqual(
    alt("aaaa alt= bbbbb"),
    "aaaa alt= bbbbb",
    "00.08 - suspicious alt= within copy but not IMG tag"
  );
});

test("00.09 - nothing is missing", t => {
  t.deepEqual(
    alt("aaaa alt = bbbbb"),
    "aaaa alt = bbbbb",
    "00.09 - suspicious alt= within copy but not IMG tag"
  );
});

test("00.10 - nothing is missing", t => {
  t.deepEqual(
    alt('<img alt="1   23" >'),
    '<img alt="1   23" >',
    "00.10 - does nothing"
  );
});

test("00.11 - nothing is missing", t => {
  t.deepEqual(
    alt('<img    class="zzz"   alt="123"    >'),
    '<img class="zzz" alt="123" >',
    "00.11 - whitespace on both sides, one tag"
  );
});

test("00.12 - nothing is missing", t => {
  t.deepEqual(
    alt('zzz<img        alt="123"    /  >yyy'),
    'zzz<img alt="123" />yyy',
    "00.12"
  );
});

test("00.13 - nothing is missing", t => {
  t.deepEqual(
    alt('z/zz<img        alt="/123/"    /  >y/yy'),
    'z/zz<img alt="/123/" />y/yy',
    "00.13"
  );
});

test("00.14 - nothing is missing", t => {
  t.deepEqual(
    alt('zzz<img     alt    =     ""    /     >zzz'),
    'zzz<img alt="" />zzz',
    "00.14"
  );
});

test("00.15 - nothing is missing", t => {
  t.deepEqual(
    alt('zzz<img        alt="123"   class="test" >zzz'),
    'zzz<img alt="123" class="test" >zzz',
    "00.15"
  );
});

// GROUP ONE.
// -----------------------------------------------------------------------------
// alt attr is missing

test("01.01 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img>zzz"),
    'zzz<img alt="" >zzz',
    "01.01 - html - tight"
  );
});

test("01.02 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img >zzz"),
    'zzz<img alt="" >zzz',
    "01.02 - html - trailing space"
  );
});

test("01.03 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img      >zzz"),
    'zzz<img alt="" >zzz',
    "01.03 - html - excessive trailing space"
  );
});

test("01.04 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img/>zzz"),
    'zzz<img alt="" />zzz',
    "01.04 - xhtml - tight"
  );
});

test("01.05 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img />zzz"),
    'zzz<img alt="" />zzz',
    "01.05 - xhtml - one space before slash"
  );
});

test("01.06 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img           />zzz"),
    'zzz<img alt="" />zzz',
    "01.06 - xhtml - many spaces before slash"
  );
});

test("01.07 - missing alt", t => {
  t.deepEqual(
    alt("zzz<img           /    >zzz"),
    'zzz<img alt="" />zzz',
    "01.07 - xhtml - many spaces on both sides"
  );
});

// GROUP TWO.
// -----------------------------------------------------------------------------
// adds ALT

test("02.01 - normalising all attributes on IMG, adding ALT", t => {
  t.deepEqual(
    alt('z<img         a="zz"        >z'),
    'z<img a="zz" alt="" >z',
    "02.01 - html simples"
  );
});

test("02.02 - normalising all attributes on IMG, adding ALT", t => {
  t.deepEqual(
    alt('z<img         a="zz"        />z'),
    'z<img a="zz" alt="" />z',
    "02.02 - xhtml simples"
  );
});

test("02.03 - normalising all attributes on IMG, adding ALT", t => {
  t.deepEqual(
    alt('z<img         a="zz"        /     >z'),
    'z<img a="zz" alt="" />z',
    "02.03 - xhtml simples"
  );
});

test("02.04 - normalising all attributes on IMG, adding ALT", t => {
  t.deepEqual(
    alt('z<img         a="zz"/     >z'),
    'z<img a="zz" alt="" />z',
    "02.04 - xhtml simples"
  );
});

test("02.05 - normalising all attributes on IMG, adding ALT", t => {
  t.deepEqual(
    alt(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       >zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" >zzz',
    "02.05 - html advanced"
  );
});

test("02.06 - normalising all attributes on IMG, adding ALT", t => {
  t.deepEqual(
    alt(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       />zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" />zzz',
    "02.06 - xhtml advanced"
  );
});

// GROUP THREE.
// -----------------------------------------------------------------------------
// missing ALT, other attributes present

test("03.01 - alt attribute is missing, there are other attributes too - HTML - #1", t => {
  // HTML
  t.deepEqual(
    alt('zzz<img class="">zzz'),
    'zzz<img class="" alt="" >zzz',
    "03.01"
  );
});

test("03.02 - alt attribute is missing, there are other attributes too - HTML - #2", t => {
  t.deepEqual(
    alt('zzz<img    class="">zzz'),
    'zzz<img class="" alt="" >zzz',
    "03.02"
  );
});

test("03.03 - alt attribute is missing, there are other attributes too - HTML - #3", t => {
  t.deepEqual(
    alt('zzz<img class=""    >zzz<img class=""    >zzz<img class=""    >zzz'),
    'zzz<img class="" alt="" >zzz<img class="" alt="" >zzz<img class="" alt="" >zzz',
    "03.03"
  );
});

test("03.04 - alt attribute is missing, there are other attributes too - XHTML - #1", t => {
  // XHTML
  t.deepEqual(
    alt('zzz<img class=""/>zzz'),
    'zzz<img class="" alt="" />zzz',
    "03.04"
  );
});

test("03.05 - alt attribute is missing, there are other attributes too - XHTML - #1", t => {
  t.deepEqual(
    alt('zzz<img    class=""/>zzz'),
    'zzz<img class="" alt="" />zzz',
    "03.05"
  );
});

test("03.06 - alt attribute is missing, there are other attributes too - XHTML - #2", t => {
  t.deepEqual(
    alt('zzz<img class=""    />zzz'),
    'zzz<img class="" alt="" />zzz',
    "03.06"
  );
});

test("03.07 - alt attribute is missing, there are other attributes too - XHTML - #3", t => {
  t.deepEqual(
    alt('zzz<img    class=""   />zzz'),
    'zzz<img class="" alt="" />zzz',
    "03.07"
  );
});

test("03.08 - alt attribute is missing, there are other attributes too - XHTML - #4", t => {
  t.deepEqual(
    alt(
      'zzz<img class=""       />zzz<img class=""       />zzz<img class=""       />zzz'
    ),
    'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
    "03.08"
  );
});

test("03.09 - alt attribute is missing, there are other attributes too - XHTML - #5", t => {
  t.deepEqual(
    alt('zzz<img class=""/   >zzz'),
    'zzz<img class="" alt="" />zzz',
    "03.09"
  );
});

test("03.10 - alt attribute is missing, there are other attributes too - XHTML - #6", t => {
  t.deepEqual(
    alt('zzz<img    class=""/   >zzz'),
    'zzz<img class="" alt="" />zzz',
    "03.10"
  );
});

test("03.11 - alt attribute is missing, there are other attributes too - XHTML - #7", t => {
  t.deepEqual(
    alt(
      'zzz<img class=""    /   >zzz<img class=""    /   >zzz<img class=""    /   >zzz'
    ),
    'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
    "03.11"
  );
});

// GROUP FOUR.
// -----------------------------------------------------------------------------
// alt attr is present, but without equal and double quotes.

test("04.01 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img alt>zzz"),
    'zzz<img alt="" >zzz',
    "04.01 - html - tight"
  );
});

test("04.02 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img    alt>zzz"),
    'zzz<img alt="" >zzz',
    "04.02 - html - excessive white space"
  );
});

test("04.03 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img alt >zzz"),
    'zzz<img alt="" >zzz',
    "04.03 - html - one trailing space"
  );
});

test("04.04 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img      alt      >zzz"),
    'zzz<img alt="" >zzz',
    "04.04 - html - excessive white space on both sides"
  );
});

test("04.05 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img alt/>zzz"),
    'zzz<img alt="" />zzz',
    "04.05 - xhtml - tight"
  );
});

test("04.06 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img alt />zzz"),
    'zzz<img alt="" />zzz',
    "04.06 - xhtml - single space on both sides"
  );
});

test("04.07 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img      alt   />zzz"),
    'zzz<img alt="" />zzz',
    "04.07 - xhtml - excessive white space on both sides"
  );
});

test("04.08 - alt without equal", t => {
  t.deepEqual(
    alt("zzz<img      alt   /   >zzz"),
    'zzz<img alt="" />zzz',
    "04.08 - xhtml - excessive white space everywhere"
  );
});

// GROUP FIVE.
// -----------------------------------------------------------------------------
// alt attr is present, but with only equal character

test("05.01 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz',
    "05.01 - html, no space after"
  );
});

test("05.02 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt=>zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz<img alt="" >zzz',
    "05.02 - html, two imag tags, no space after each"
  );
});

test("05.03 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt= >zzz"),
    'zzz<img alt="" >zzz',
    "05.03 - html, space after"
  );
});

test("05.04 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img    alt=>zzz"),
    'zzz<img alt="" >zzz',
    "05.04 - html, excessive space in front"
  );
});

test("05.05 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt=    >zzz"),
    'zzz<img alt="" >zzz',
    "05.05 - html, excessive space after"
  );
});

test("05.06 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "05.06 - xhtml, no space after"
  );
});

test("05.07 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt=/   >zzz"),
    'zzz<img alt="" />zzz',
    "05.07 - xhtml, no space after"
  );
});

test("05.08 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt= />zzz"),
    'zzz<img alt="" />zzz',
    "05.08 - xhtml, space after"
  );
});

test("05.09 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img    alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "05.09 - xhtml, excessive space before"
  );
});

test("05.10 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "05.10 - xhtml, excessive space after"
  );
});

test("05.11 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img     alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "05.11 - xhtml, excessive space on both sides of alt="
  );
});

test("05.12 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img     alt   =    />zzz"),
    'zzz<img alt="" />zzz',
    "05.12 - xhtml, excessive space on both sides of equal, no quotes"
  );
});

test("05.13 - alt with just equal", t => {
  t.deepEqual(
    alt("zzz<img alt    =>zzz"),
    'zzz<img alt="" >zzz',
    "05.13 - html, no space after"
  );
});

test("05.14 - alt with just equal", t => {
  t.deepEqual(
    alt('zzz<img alt    =   "">zzz'),
    'zzz<img alt="" >zzz',
    "05.14 - html, no space after"
  );
});

// GROUP SIX.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single), one tag

test("06.01 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt=">zzz'), 'zzz<img alt="" >zzz', "06.01");
});

test("06.02 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt =">zzz'), 'zzz<img alt="" >zzz', "06.02");
});

test("06.03 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt= ">zzz'), 'zzz<img alt="" >zzz', "06.03");
});

test("06.04 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt=" >zzz'), 'zzz<img alt="" >zzz', "06.04");
});

test("06.05 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt   =">zzz'), 'zzz<img alt="" >zzz', "06.05");
});

test("06.06 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt=   ">zzz'), 'zzz<img alt="" >zzz', "06.06");
});

test("06.07 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt="   >zzz'), 'zzz<img alt="" >zzz', "06.07");
});

test("06.08 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt   =   ">zzz'), 'zzz<img alt="" >zzz', "06.08");
});

test("06.09 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt=   "   >zzz'), 'zzz<img alt="" >zzz', "06.09");
});

test("06.10 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(alt('zzz<img alt   ="   >zzz'), 'zzz<img alt="" >zzz', "06.10");
});

test("06.11 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(
    alt('zzz<img alt   =   "   >zzz'),
    'zzz<img alt="" >zzz',
    "06.11"
  );
});

test("06.12 - alt with only one double quote, one HTML tag", t => {
  t.deepEqual(
    alt('<img alt="legit quote: \'" >'),
    '<img alt="legit quote: \'" >',
    "06.12"
  );
});

// GROUP SEVEN.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single), 3 tags

test("07.01 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt=">zzz<img alt=">zzz<img alt=">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.01"
  );
});

test("07.02 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt =">zzz<img alt =">zzz<img alt =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.02"
  );
});

test("07.03 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt= ">zzz<img alt= ">zzz<img alt= ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.03"
  );
});

test("07.04 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt=" >zzz<img alt=" >zzz<img alt=" >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.04"
  );
});

test("07.05 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt   =">zzz<img alt   =">zzz<img alt   =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.05"
  );
});

test("07.06 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt=   ">zzz<img alt=   ">zzz<img alt=   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.06"
  );
});

test("07.07 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt="   >zzz<img alt="   >zzz<img alt="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.07"
  );
});

test("07.08 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt   =   ">zzz<img alt   =   ">zzz<img alt   =   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.08"
  );
});

test("07.09 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt=   "   >zzz<img alt=   "   >zzz<img alt=   "   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.09"
  );
});

test("07.10 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt   ="   >zzz<img alt   ="   >zzz<img alt   ="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.10"
  );
});

test("07.11 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt(
      'zzz<img alt   =   "   >zzz<img alt   =   "   >zzz<img alt   =   "   >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.11"
  );
});

test("07.12 - alt with only one double quote, three HTML tags", t => {
  t.deepEqual(
    alt(
      '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >'
    ),
    '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >',
    "07.12"
  );
});

// GROUP EIGHT.
// -----------------------------------------------------------------------------
// alt with only one double quote, one XHTML tag

test("08.01 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt="/>zzz'), 'zzz<img alt="" />zzz', "08.01");
});

test("08.02 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt ="/>zzz'), 'zzz<img alt="" />zzz', "08.02");
});

test("08.03 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt= "/>zzz'), 'zzz<img alt="" />zzz', "08.03");
});

test("08.04 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt=" />zzz'), 'zzz<img alt="" />zzz', "08.04");
});

test("08.05 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt   ="/>zzz'), 'zzz<img alt="" />zzz', "08.05");
});

test("08.06 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt\n="/>zzz'), 'zzz<img alt="" />zzz', "08.06");
});

test("08.07 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt="   />zzz'), 'zzz<img alt="" />zzz', "08.07");
});

test("08.08 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(alt('zzz<img alt   ="   />zzz'), 'zzz<img alt="" />zzz', "08.08");
});

test("08.09 - alt with only one double quote, one XHTML tag", t => {
  t.deepEqual(
    alt('<img alt="legit quote: \'" />'),
    '<img alt="legit quote: \'" />',
    "08.09"
  );
});

// GROUP NINE.
// -----------------------------------------------------------------------------
// alt with only one double quote, three XHTML tags

test("09.01 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt="/>zzz<img alt="   />zzz<img alt="/    >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.01"
  );
});

test("09.02 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt ="/>zzz<img alt ="   />zzz<img alt ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.02"
  );
});

test("09.03 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt= "/>zzz<img alt= "   />zzz<img alt= "/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.03"
  );
});

test("09.04 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt=" />zzz<img alt="    />zzz<img alt=" /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.04"
  );
});

test("09.05 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt   ="/>zzz<img alt   ="    />zzz<img alt   ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.05"
  );
});

test("09.06 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt('zzz<img alt="   />zzz<img alt="     />zzz<img alt="   /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.06"
  );
});

test("09.07 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt(
      'zzz<img alt   ="   />zzz<img alt   ="     />zzz<img alt   ="   /    >zzz'
    ),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.07"
  );
});

test("09.08 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(alt('<img alt="z"/   >'), '<img alt="z" />', "09.08");
});

test("09.09 - alt with only one double quote, three XHTML tags", t => {
  t.deepEqual(
    alt(
      '<img alt="legit quote: \'"/><img alt="legit quote: \'"   /><img alt="legit quote: \'"/   >'
    ),
    '<img alt="legit quote: \'" /><img alt="legit quote: \'" /><img alt="legit quote: \'" />',
    "09.09"
  );
});

// GROUP TEN.
// -----------------------------------------------------------------------------
// alt with only one single quote

test("10.01 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zzz<img alt='>zzz"),
    'zzz<img alt="" >zzz',
    "10.01 - html, one single quote"
  );
});

test("10.02 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zzz<img alt=  '  >zzz"),
    'zzz<img alt="" >zzz',
    "10.02 - html, one single quote"
  );
});

test("10.03 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zzz<img alt   =  '  >zzz"),
    'zzz<img alt="" >zzz',
    "10.03 - html, one single quote"
  );
});

test("10.04 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zz'z<img alt='>zzz<img alt=\"legit quote: '\" >zz"),
    'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    "10.04 - html, one single quote"
  );
});

test("10.05 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zzz<img alt=  ''  >zzz"),
    'zzz<img alt="" >zzz',
    "10.05 - html, two single quotes"
  );
});

test("10.06 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zzz<img alt=  ''>zzz"),
    'zzz<img alt="" >zzz',
    "10.06 - html, two single quotes"
  );
});

test("10.07 - alt with only one single quote", t => {
  t.deepEqual(
    alt("zzz<img alt    ='>zzz"),
    'zzz<img alt="" >zzz',
    "10.07 - html, one single quote"
  );
});

// GROUP ELEVEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, excessive whitespace, HTML

test("11.01 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt=""    >zzz'),
    'zzz<img alt="" >zzz',
    "11.01 - html, excessive white space"
  );
});

test("11.02 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =""    >zzz'),
    'zzz<img alt="" >zzz',
    "11.02 - html, excessive white space"
  );
});

test("11.03 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""    >zzz'),
    'zzz<img alt="" >zzz',
    "11.03 - html, excessive white space"
  );
});

test("11.04 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "">zzz'),
    'zzz<img alt="" >zzz',
    "11.04 - html, excessive white space"
  );
});

test("11.05 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt="   "    >zzz'),
    'zzz<img alt="" >zzz',
    "11.05 - html, excessive white space"
  );
});

test("11.06 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    ="   "    >zzz'),
    'zzz<img alt="" >zzz',
    "11.06 - html, excessive white space"
  );
});

test("11.07 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    >zzz'),
    'zzz<img alt="" >zzz',
    "11.07 - html, excessive white space"
  );
});

test("11.08 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   ">zzz'),
    'zzz<img alt="" >zzz',
    "11.08 - html, excessive white space"
  );
});

test("11.09 - alt with two double quotes, excessive whitespace, HTML, 1 img tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   ">zzz'),
    'zzz<img alt="" >zzz',
    "11.09 - html, excessive white space"
  );
});

test("11.10 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt=""    >zzz<img     alt=""    >zzz<img     alt=""    >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.10 - html, excessive white space"
  );
});

test("11.11 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    =""    >zzz<img     alt    =""    >zzz<img     alt    =""    >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.11 - html, excessive white space"
  );
});

test("11.12 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.12 - html, excessive white space"
  );
});

test("11.13 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "">zzz<img     alt    =    "">zzz<img     alt    =    "">zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.13 - html, excessive white space"
  );
});

test("11.14 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt="   "    >zzz<img     alt="   "    >zzz<img     alt="   "    >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.14 - html, excessive white space"
  );
});

test("11.15 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.15 - html, excessive white space"
  );
});

test("11.16 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.16 - html, excessive white space"
  );
});

test("11.17 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.17 - html, excessive white space"
  );
});

test("11.18 - alt with two double quotes, excessive whitespace, HTML, 3 img tags", t => {
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "11.18 - html, excessive white space"
  );
});

// GROUP TWELVE.
// -----------------------------------------------------------------------------
// alt with two double quotes, no space after slash, one XHTML tag

test("12.01 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt=""    />zzz'),
    'zzz<img alt="" />zzz',
    "12.01 - html, excessive white space"
  );
});

test("12.02 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =""    />zzz'),
    'zzz<img alt="" />zzz',
    "12.02 - html, excessive white space"
  );
});

test("12.03 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""    />zzz'),
    'zzz<img alt="" />zzz',
    "12.03 - html, excessive white space"
  );
});

test("12.04 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""/>zzz'),
    'zzz<img alt="" />zzz',
    "12.04 - html, excessive white space"
  );
});

test("12.05 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt="   "    />zzz'),
    'zzz<img alt="" />zzz',
    "12.05 - html, excessive white space"
  );
});

test("12.06 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    ="   "    />zzz'),
    'zzz<img alt="" />zzz',
    "12.06 - html, excessive white space"
  );
});

test("12.07 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    />zzz'),
    'zzz<img alt="" />zzz',
    "12.07 - html, excessive white space"
  );
});

test("12.08 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/>zzz'),
    'zzz<img alt="" />zzz',
    "12.08 - html, excessive white space"
  );
});

test("12.09 - alt with two double quotes, no space after slash, one XHTML tag", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/>zzz'),
    'zzz<img alt="" />zzz',
    "12.09 - html, excessive white space"
  );
});

// GROUP THIRTEEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, no space after slash, one XHTML tag

test("13.01 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt=""    / >zzz'),
    'zzz<img alt="" />zzz',
    "13.01"
  );
});

test("13.02 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =""    / >zzz'),
    'zzz<img alt="" />zzz',
    "13.02"
  );
});

test("13.03 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""    / >zzz'),
    'zzz<img alt="" />zzz',
    "13.03"
  );
});

test("13.04 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""/ >zzz'),
    'zzz<img alt="" />zzz',
    "13.04"
  );
});

test("13.05 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt="   "    / >zzz'),
    'zzz<img alt="" />zzz',
    "13.05"
  );
});

test("13.06 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    ="   "    / >zzz'),
    'zzz<img alt="" />zzz',
    "13.06"
  );
});

test("13.07 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    / >zzz'),
    'zzz<img alt="" />zzz',
    "13.07"
  );
});

test("13.08 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/ >zzz'),
    'zzz<img alt="" />zzz',
    "13.08"
  );
});

test("13.09 - alt with two double quotes, one space between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/ >zzz'),
    'zzz<img alt="" />zzz',
    "13.09"
  );
});

// GROUP FOURTEEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, many spaces between slash & bracket, XHTML
// same but with many spaces between slash and closing bracket:

test("14.01 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt=""    /    >zzz'),
    'zzz<img alt="" />zzz',
    "14.01"
  );
});

test("14.02 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =""    /    >zzz'),
    'zzz<img alt="" />zzz',
    "14.02"
  );
});

test("14.03 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""    /    >zzz'),
    'zzz<img alt="" />zzz',
    "14.03"
  );
});

test("14.04 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    ""/    >zzz'),
    'zzz<img alt="" />zzz',
    "14.04"
  );
});

test("14.05 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt="   "    /    >zzz'),
    'zzz<img alt="" />zzz',
    "14.05"
  );
});

test("14.06 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    ="   "    /    >zzz'),
    'zzz<img alt="" />zzz',
    "14.06"
  );
});

test("14.07 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    /    >zzz'),
    'zzz<img alt="" />zzz',
    "14.07"
  );
});

test("14.08 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/    >zzz'),
    'zzz<img alt="" />zzz',
    "14.08"
  );
});

test("14.09 - alt with two double quotes, many spaces between slash & bracket, XHTML", t => {
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/    >zzz'),
    'zzz<img alt="" />zzz',
    "14.09"
  );
});

// GROUP FIFTEEN.
// -----------------------------------------------------------------------------
// alt with two single quotes, HTML

test("15.01 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt=''    >zzz"),
    'zzz<img alt="" >zzz',
    "15.01"
  );
});

test("15.02 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt    =''    >zzz"),
    'zzz<img alt="" >zzz',
    "15.02"
  );
});

test("15.03 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt    =    ''    >zzz"),
    'zzz<img alt="" >zzz',
    "15.03"
  );
});

test("15.04 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt    =    ''>zzz"),
    'zzz<img alt="" >zzz',
    "15.04"
  );
});

test("15.05 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt='   '    >zzz"),
    'zzz<img alt="" >zzz',
    "15.05"
  );
});

test("15.06 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt    ='   '    >zzz"),
    'zzz<img alt="" >zzz',
    "15.06"
  );
});

test("15.07 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt    =    '   '    >zzz"),
    'zzz<img alt="" >zzz',
    "15.07"
  );
});

test("15.08 - alt with two single quotes, HTML", t => {
  t.deepEqual(
    alt("zzz<img     alt    =    '   '>zzz"),
    'zzz<img alt="" >zzz',
    "15.08"
  );
});

// GROUP SIXTEEN.
// -----------------------------------------------------------------------------
// weird code cases, all broken (X)HTML

test("16.01 - testing escape latch for missing second double quote cases", t => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.deepEqual(
    alt('zzz<img alt="  class="" />zzz'),
    'zzz<img alt="  class="" />zzz',
    "16.01"
  );
});

test("16.02 - testing seriously messed up code", t => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.deepEqual(
    alt("zzz<img >>>>>>>>>>zzz"),
    'zzz<img alt="" >>>>>>>>>>zzz',
    "16.02.01"
  );
  t.deepEqual(alt("zzz<<img >>zzz"), 'zzz<<img alt="" >>zzz', "16.02.02");
  t.deepEqual(
    alt("zzz<><><<>><<<>>>><img >>zzz"),
    'zzz<><><<>><<<>>>><img alt="" >>zzz',
    "16.02.03"
  );
});

test("16.03 - other attributes don't have equal and value", t => {
  t.deepEqual(
    alt('<img something alt="" >'),
    '<img something alt="" >',
    "16.03.01 - img tag only, with alt"
  );
  t.deepEqual(
    alt("<img something>"),
    '<img something alt="" >',
    "16.03.02 - img tag only, no alt"
  );
  t.deepEqual(
    alt("<img something >"),
    '<img something alt="" >',
    "16.03.03 - img tag only, no alt"
  );
  // XHTML counterparts:
  t.deepEqual(
    alt('<img something alt="" />'),
    '<img something alt="" />',
    "16.03.04 - img tag only, with alt"
  );
  t.deepEqual(
    alt("<img something/>"),
    '<img something alt="" />',
    "16.03.05 - img tag only, no alt, tight"
  );
  t.deepEqual(
    alt("<img something />"),
    '<img something alt="" />',
    "16.03.06 - img tag only, no alt"
  );
  t.deepEqual(
    alt('<img something alt="" /     >'),
    '<img something alt="" />',
    "16.03.07 - img tag only, with alt, excessive white space"
  );
  t.deepEqual(
    alt("<img something/     >"),
    '<img something alt="" />',
    "16.03.08 - img tag only, no alt, excessive white space"
  );
  t.deepEqual(
    alt("<img something /     >"),
    '<img something alt="" />',
    "16.03.09 - img tag only, no alt, excessive white space"
  );
});

test("16.04 - specific place in the algorithm, protection against rogue slashes", t => {
  t.deepEqual(
    alt('<img alt="/ class="" />'),
    '<img alt="/ class="" />',
    "16.04 - should do nothing."
  );
});

// GROUP SEVENTEEN.
// -----------------------------------------------------------------------------
// throws

test("17.01 - throws if encounters img tag within img tag", t => {
  t.throws(() => {
    alt('zzz<img alt="  <img />zzz');
  });
});

test("17.02 - throws if input is not string", t => {
  t.throws(() => {
    alt(null);
  });
  t.throws(() => {
    alt();
  });
  t.throws(() => {
    alt(undefined);
  });
  t.throws(() => {
    alt(111);
  });
  t.throws(() => {
    alt(true);
  });
});

test("17.03 - throws if opts is not a plain object", t => {
  t.throws(() => {
    alt("zzz", ["aaa"]);
  });
  t.notThrows(() => {
    alt("zzz", null); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  });
  t.notThrows(() => {
    alt("zzz", undefined); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  });
  t.throws(() => {
    alt("zzz", 1);
  });
  t.notThrows(() => {
    alt("zzz", {});
  });
  t.throws(() => {
    alt("zzz", { zzz: "yyy" }); // rogue keys - throws. WTF?
  });
});

// GROUP EIGHTEEM.
// -----------------------------------------------------------------------------
// opts.unfancyTheAltContents

test("18.01 - cleans alt tag contents - fancy quote", t => {
  t.deepEqual(
    alt('<img alt    ="   someone’s " >'),
    '<img alt="someone\'s" >',
    "18.01.01 - default"
  );
  t.deepEqual(
    alt('<img alt    ="   someone’s " >', { unfancyTheAltContents: true }),
    '<img alt="someone\'s" >',
    "18.01.02 - hardcoded default, unfancyTheAltContents on"
  );
  t.deepEqual(
    alt('<img alt    ="   someone’s " >', { unfancyTheAltContents: false }),
    '<img alt="   someone’s " >',
    "18.01.03 - unfancyTheAltContents off - no character substitution, no trim"
  );
});

test("18.02 - cleans alt tag contents - m-dash + trim", t => {
  t.deepEqual(
    alt('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "18.02.01 - default"
  );
  t.deepEqual(
    alt('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "18.02.02 - hardcoded default, unfancyTheAltContents on"
  );
  t.deepEqual(
    alt('<img alt    =" The new offer \u2014 50% discount " >', {
      unfancyTheAltContents: false
    }),
    '<img alt=" The new offer \u2014 50% discount " >',
    "18.02.03 - unfancyTheAltContents off - no character substitution, no trimming done"
  );
});

test("18.03 - un-fancies multiple alt tags", t => {
  t.deepEqual(
    alt(
      'abc <img alt    ="   someone’s " > def\n <img alt    =" The new offer \u2014 50% discount " > ghi <img      >\n\n\njkl'
    ),
    'abc <img alt="someone\'s" > def\n <img alt="The new offer - 50% discount" > ghi <img alt="" >\n\n\njkl',
    "18.03.01 - default"
  );
});

test("18.04 - adds an ALT within a nunjucks-sprinkled HTML", t => {
  t.deepEqual(
    alt(
      '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %}></td>'
    ),
    '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %} alt="" ></td>',
    "18.04.01 - minime of 18.04.02"
  );
  t.deepEqual(
    alt(
      '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %}></td>'
    ),
    '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %} alt="" ></td>',
    "18.04.02"
  );
});

test('18.05 - Nunjucks code following straight after character g of "img"', t => {
  t.deepEqual(
    alt(
      '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;">'
    ),
    '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;" alt="" >',
    "18.05"
  );
});

test("18.06 - Nunjucks code tight before ALT", t => {
  t.deepEqual(
    alt('<img {% if variables %}class="variables" {% endif %}alt=>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "18.06.01 - alt with equal with no quotes"
  );
  t.deepEqual(
    alt('<img {% if variables %}class="variables" {% endif %}alt=">'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "18.06.02 - alt with equal and single quote, second is missing"
  );
  t.deepEqual(
    alt('<img {% if variables %}class="variables" {% endif %}alt>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "18.06.03 - alt with both equal and quotes missing"
  );
});
