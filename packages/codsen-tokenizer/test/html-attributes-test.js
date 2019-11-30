// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";
import deepContains from "ast-deep-contains";

// 01. basic - double quoted attributes
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - single- and double-quoted attr`, t => {
  const gathered = [];
  ct(`<a b="c" d='e'>`, obj => {
    gathered.push(obj);
  });

  deepContains(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 15,
        attribs: [
          {
            attribName: "b",
            attribNameStartAt: 3,
            attribNameEndAt: 4,
            attribOpeningQuoteAt: 5,
            attribClosingQuoteAt: 7,
            attribValue: "c",
            attribValueStartAt: 6,
            attribValueEndAt: 7,
            attribStart: 3,
            attribEnd: 8
          },
          {
            attribName: "d",
            attribNameStartAt: 9,
            attribNameEndAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 13,
            attribValue: "e",
            attribValueStartAt: 12,
            attribValueEndAt: 13,
            attribStart: 9,
            attribEnd: 14
          }
        ]
      }
    ],
    t.is,
    t.fail
  );
});

// 02. broken - no equal
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - no equals but quotes present`, t => {
  const gathered = [];
  ct(`<a b"c" d'e'>`, obj => {
    gathered.push(obj);
  });

  deepContains(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 13,
        attribs: [
          {
            attribName: "b",
            attribNameStartAt: 3,
            attribNameEndAt: 4,
            attribOpeningQuoteAt: 4,
            attribClosingQuoteAt: 6,
            attribValue: "c",
            attribValueStartAt: 5,
            attribValueEndAt: 6,
            attribStart: 3,
            attribEnd: 7
          },
          {
            attribName: "d",
            attribNameStartAt: 8,
            attribNameEndAt: 9,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 11,
            attribValue: "e",
            attribValueStartAt: 10,
            attribValueEndAt: 11,
            attribStart: 8,
            attribEnd: 12
          }
        ]
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.02 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - no opening quotes but equals present`, t => {
  const gathered = [];
  ct(`<a b=c" d=e'>`, obj => {
    gathered.push(obj);
  });

  deepContains(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 15,
        attribs: [
          {
            attribName: "b",
            attribNameStartAt: 3,
            attribNameEndAt: 4,
            attribOpeningQuoteAt: 5,
            attribClosingQuoteAt: 7,
            attribValue: "c",
            attribValueStartAt: 6,
            attribValueEndAt: 7,
            attribStart: 3,
            attribEnd: 8
          },
          {
            attribName: "d",
            attribNameStartAt: 9,
            attribNameEndAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 13,
            attribValue: "e",
            attribValueStartAt: 12,
            attribValueEndAt: 13,
            attribStart: 9,
            attribEnd: 14
          }
        ]
      }
    ],
    t.is,
    t.fail
  );
});
