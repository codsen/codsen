const t = require("tap");
const { comb } = require("../dist/email-comb.cjs");

t.todo(
  `01.01 - ${`\u001b[${33}m${`false positives`}\u001b[${39}m`} - word class in text`,
  t => {
    const source = `<html>
  <head>
  </head>
  <body>
    <p>test class test </p>
  </body>
</html>
`;
    t.equal(comb(source).result, source, "01.01");
    t.end();
  }
);
