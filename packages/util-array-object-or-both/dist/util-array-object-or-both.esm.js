import includes from 'lodash.includes';
import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function arrObjOrBoth(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(str)) {
    throw new Error('util-array-object-or-both/validate(): [THROW_ID_01] Please provide a string to work on. Currently it\'s equal to ' + JSON.stringify(str, null, 4));
  }
  if (typeof str !== 'string') {
    throw new Error('util-array-object-or-both/validate(): [THROW_ID_02] Input must be string! Currently it\'s ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to: ' + JSON.stringify(str, null, 4));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error('util-array-object-or-both/validate(): [THROW_ID_03] Second argument, options object, must be, well, object! Currenlty it\'s: ' + (typeof originalOpts === 'undefined' ? 'undefined' : _typeof(originalOpts)) + ', equal to: ' + JSON.stringify(originalOpts, null, 4));
  }

  var onlyObjectValues = ['object', 'objects', 'obj', 'ob', 'o'];
  var onlyArrayValues = ['array', 'arrays', 'arr', 'aray', 'arr', 'a'];
  var onlyAnyValues = ['any', 'all', 'everything', 'both', 'either', 'each', 'whatever', 'whatevs', 'e'];

  var defaults = {
    msg: '',
    optsVarName: 'given variable'
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: 'util-array-object-or-both/validate(): [THROW_ID_03]',
    optsVarName: 'opts',
    schema: {
      msg: ['string', null],
      optsVarName: ['string', null]
    }
  });
  if (existy(opts.msg) && opts.msg.length > 0) {
    opts.msg = opts.msg.trim() + ' ';
  }
  if (opts.optsVarName !== 'given variable') {
    opts.optsVarName = 'variable "' + opts.optsVarName + '"';
  }

  if (includes(onlyObjectValues, str.toLowerCase().trim())) {
    return 'object';
  } else if (includes(onlyArrayValues, str.toLowerCase().trim())) {
    return 'array';
  } else if (includes(onlyAnyValues, str.toLowerCase().trim())) {
    return 'any';
  }
  throw new TypeError(opts.msg + 'The ' + opts.optsVarName + ' was customised to an unrecognised value: ' + str + '. Please check it against the API documentation.');
}

export default arrObjOrBoth;
