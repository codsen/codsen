/*! adapted from https://github.com/csstree/validator validateString() function
Copyright (C) 2016-2018 by Roman Dvornov MIT licence
*/

import csstree from "css-tree";
const syntax = csstree.lexer;

function validate(css, filename) {
  const errors = [];
  const ast = csstree.parse(css, {
    filename: filename,
    positions: true,
    onParseError: function(error) {
      errors.push(error);
    }
  });

  csstree.walk(ast, {
    visit: "Declaration",
    enter: function(node) {
      const match = syntax.matchDeclaration(node);
      const error = match.error;

      if (error) {
        let message = error.rawMessage || error.message || error;

        // ignore errors except those which make sense
        if (
          error.name !== "SyntaxMatchError" &&
          error.name !== "SyntaxReferenceError"
        ) {
          return;
        }

        if (message === "Mismatch") {
          message = `Invalid value for \`${node.property}\``;
        }

        errors.push({
          name: error.name,
          node: node,
          loc: error.loc || node.loc,
          line:
            error.line || (node.loc && node.loc.start && node.loc.start.line),
          column:
            error.column ||
            (node.loc && node.loc.start && node.loc.start.column),
          property: node.property,
          message: message,
          error: error
        });
      }
    }
  });

  return errors;
}

export default validate;
