/**
 * ranges-compose
 * Convert ranges over ranges into flat single set of ranges
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-compose
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('lodash.clonedeep');
require('lodash.isplainobject');
var merge = _interopDefault(require('ranges-merge'));

function composeRanges(str, olderRanges1, newerRanges2, originalOpts) {
  if (olderRanges1 === null) {
    if (newerRanges2 === null) {
      return null;
    }
    return newerRanges2;
  }
  if (newerRanges2 === null) {
    return olderRanges1;
  }
  var older = merge(olderRanges1);
  var newer = merge(newerRanges2);
  var newerlen = newer.length;
  var olderlen = older.length;
  var composed = [];
  var offset = 0;
  var currentNewerPushed = false;
  var lastOlderPushed = null;
  for (var i = 0; i < newerlen; i++) {
    currentNewerPushed = false;
    for (var y = 0; y < olderlen; y++) {
      if (y !== lastOlderPushed) {
        offset += older[y][1] - older[y][0];
        if (newer[i][1] < older[y][0]) {
          composed.push(newer[i]);
          currentNewerPushed = true;
        } else if (newer[i][1] === older[y][0]) {
          composed.push([newer[i][0], older[y][1]]);
          currentNewerPushed = true;
        } else if (newer[i][0] === older[y][0]) {
          var newFromVal = older[y][0];
          var newToVal = older[y][1] + (newer[i][1] - newer[i][0]);
          if (older[y + 1]) ;
          var tempToPush = [newFromVal, newToVal];
          composed.push(tempToPush);
          currentNewerPushed = true;
          lastOlderPushed = y;
          break;
        } else if (newer[i][0] > older[y][1]) {
          composed.push(older[y]);
        }
      }
    }
    if (!currentNewerPushed) {
      var _tempToPush = [newer[i][0] + offset, newer[i][1] + offset];
      composed.push(_tempToPush);
    } else if (i + 1 === newerlen && lastOlderPushed < olderlen) {
      for (var z = lastOlderPushed + 1; z < olderlen; z++) {
        composed.push(older[z]);
      }
    }
    if (i === newerlen - 1) {
      if (newer[i][1] < older[0][0]) {
        composed.push(older[0]);
      }
    }
  }
  return merge(composed);
}

module.exports = composeRanges;
