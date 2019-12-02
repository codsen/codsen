/**
 * @fileoverview updates row numbers in front of each encountered console.log
 * @author Roy Revelt
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(`${__dirname}/rules`);
