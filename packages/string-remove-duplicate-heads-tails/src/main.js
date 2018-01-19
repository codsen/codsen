/* eslint no-mixed-operators:0, no-param-reassign:0 */

import checkTypes from 'check-types-mini'
import isObj from 'lodash.isplainobject'
import arrayiffy from 'arrayiffy-if-string'
import findht from 'string-find-heads-tails'

function removeDuplicateHeadsTails(str, originalOpts = {}) {
  function existy(x) { return x != null }
  const has = Object.prototype.hasOwnProperty
  function isStr(something) { return typeof something === 'string' }
  if (str === undefined) {
    throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!')
  }
  if (typeof str !== 'string') {
    throw new Error(`string-remove-duplicate-heads-tails: [THROW_ID_02] The input is not string but ${typeof str}`)
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(`string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ${typeof originalOpts}!`)
  }
  if (
    existy(originalOpts) &&
    has.call(originalOpts, 'heads')
  ) {
    if (!arrayiffy(originalOpts.heads).every(val => isStr(val))) {
      throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.heads contains elements which are not string-type!')
    } else if (isStr(originalOpts.heads)) {
      originalOpts.heads = arrayiffy(originalOpts.heads)
    }
  }
  if (
    existy(originalOpts) &&
    has.call(originalOpts, 'tails')
  ) {
    if (!arrayiffy(originalOpts.tails).every(val => isStr(val))) {
      throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_06] The opts.tails contains elements which are not string-type!')
    } else if (isStr(originalOpts.tails)) {
      originalOpts.tails = arrayiffy(originalOpts.tails)
    }
  }


  // early ending:
  if (str.trim() === '') {
    return str
  }

  const defaults = {
    heads: ['{{'],
    tails: ['}}'],
  }
  const opts = Object.assign({}, defaults, originalOpts)
  checkTypes(opts, defaults, { msg: 'string-remove-duplicate-heads-tails: [THROW_ID_04*]' })

  // ===================== the action =====================

  // if at least one head and one tail was not found, bail early:
  if (
    !opts.heads.some(head => str.includes(head.trim())) &&
    !opts.tails.some(tail => str.includes(tail.trim()))
  ) {
    return str
  }

  let allVarsResolved = true

  try {
    findht(str, opts.heads.map(val => val.trim()), opts.tails.map(val => val.trim()))
  } catch (e) {
    allVarsResolved = false
  }

  let foundHead
  let foundTail

  // console.log(`allVarsResolved = ${JSON.stringify(allVarsResolved, null, 4)}`)

  if (
    !allVarsResolved &&
    opts.heads.some((head) => {
      // console.log('1')
      const res = str.trim().startsWith(head.trim())
      if (res) {
        foundHead = head.trim()
        return true
      }
      // console.log('2')
      return false
    }) &&
    opts.tails.some((tail) => {
      // console.log('3')
      const res = str.trim().endsWith(tail.trim())
      if (res) {
        foundTail = tail.trim()
        return true
      }
      // console.log('4')
      return false
    })
  ) {
    const from = foundHead.length
    const to = str.trim().length - foundTail.length

    return str
      .trim()
      .slice(from, to)
      .trim()
  }

  return str
}

export default removeDuplicateHeadsTails
