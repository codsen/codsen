import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

// minification within style tags
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - minimal`,
  (t) => {
    t.strictSame(
      m(`<style>\n\ta {\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "01.01"
    );
    t.strictSame(
      m(`<style>\na{\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "01.02"
    );
    t.strictSame(
      m(`<style> \t\t\t      a    {     display:block;     }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "01.03"
    );
    t.strictSame(
      m(`<style>a{display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "01.04"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - spaces`,
  (t) => {
    t.strictSame(
      m(`<style>\na something here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a something here{display:block;}`,
      "02.01"
    );
    t.strictSame(
      m(`<style>\na.something.here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a.something.here{display:block;}`,
      "02.02"
    );
    t.strictSame(
      m(`<style>\na something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a something#here{display:block;}`,
      "02.03"
    );
    t.strictSame(
      m(`<style>\na  something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a something#here{display:block;}`,
      "02.04"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element > element`,
  (t) => {
    t.strictSame(
      m(`<style>\na>something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something#here{display:block;}`,
      "03.01"
    );
    t.strictSame(
      m(`<style>\na > something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something#here{display:block;}`,
      "03.02"
    );
    t.strictSame(
      m(`<style>\na> something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something#here{display:block;}`,
      "03.03"
    );
    t.strictSame(
      m(`<style>\na> something #here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something #here{display:block;}`,
      "03.04"
    );
    t.strictSame(
      m(`<style>\na> something  #here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something #here{display:block;}`,
      "03.05"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element + element`,
  (t) => {
    t.strictSame(
      m(`<style>\na+something#here+there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "04.01"
    );
    t.strictSame(
      m(`<style>\na + something#here + there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "04.02"
    );
    t.strictSame(
      m(`<style>\na + something #here + there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something #here+there{display:block;}`,
      "04.03"
    );
    t.strictSame(
      m(`<style>\na  +  something#here  +  there  {\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "04.04"
    );
    t.strictSame(
      m(
        `<style>\n   a   +    something  #here   +   there   {\n   display: block;   \n}`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<style>a+something #here+there{display:block;}`,
      "04.05"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element ~ element`,
  (t) => {
    t.strictSame(
      m(`<style>\na~something#here~there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "05.01"
    );
    t.strictSame(
      m(`<style>\na ~ something#here ~ there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "05.02"
    );
    t.strictSame(
      m(`<style>\na ~ something #here ~ there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something #here~there{display:block;}`,
      "05.03"
    );
    t.strictSame(
      m(`<style>\na  ~  something#here  ~  there  {\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "05.04"
    );
    t.strictSame(
      m(
        `<style>\n   a   ~    something  #here   ~   there   {\n   display: block;   \n}`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<style>a~something #here~there{display:block;}`,
      "05.05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes CSS comments`,
  (t) => {
    t.strictSame(
      m(`<style> a { display:block; } /* TAB STYLES */`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "06.01"
    );
    t.strictSame(
      m(`<style> a { display:block; } /* TAB STYLES */`, {
        removeLineBreaks: false,
      }).result,
      `<style> a { display:block; }`,
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of !important`,
  (t) => {
    t.strictSame(
      m(`<style>\n  a { display:block!important; }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block!important;}`,
      "07.01 - no space"
    );
    t.strictSame(
      m(`<style>\n  a { display:block !important; }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block!important;}`,
      "07.02 - one space"
    );
    t.strictSame(
      m(`<style>\n  a { display:block  !important; }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block!important;}`,
      "07.03 - two spaces"
    );
    t.strictSame(
      m(`<style>/*  `, {
        removeLineBreaks: true,
      }).result,
      `<style>`,
      "07.04 - resembling real life"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of <script>`,
  (t) => {
    const source =
      'a\n    <script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\n    b';

    t.strictSame(
      m(source, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      source,
      "08.01"
    );
    t.strictSame(
      m(source, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script>\nb',
      "08.02"
    );
    t.strictSame(
      m(source, {
        removeLineBreaks: true,
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
      "08.03"
    );
    t.strictSame(
      m(source, {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
      "08.04"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals`,
  (t) => {
    t.strictSame(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`,
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, lineLengthLimit=off`,
  (t) => {
    t.strictSame(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`,
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix`,
  (t) => {
    t.strictSame(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>`,
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix, lineLengthLimit=off`,
  (t) => {
    t.strictSame(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>`,
      "12"
    );
    t.end();
  }
);
