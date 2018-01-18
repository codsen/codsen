function collapseLeadingWhitespace(str) {
  if (typeof str === 'string') {
    // quick end
    if (str.length === 0) {
      return ''
    } else if (str.trim() === '') {
      if (str.includes('\n')) {
        return '\n'
      }
      return ' '
    }
    // set the default to put in front:
    let startCharacter = ''
    // if there's some leading whitespace
    if (str[0].trim() === '') {
      startCharacter = ' '
      let lineBreakEncountered = false
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === '\n') {
          lineBreakEncountered = true
        }
        if (str[i].trim() !== '') {
          break
        }
      }
      if (lineBreakEncountered) {
        startCharacter = '\n'
      }
    }

    // set the default to put in front:
    let endCharacter = ''
    // if there's some trailing whitespace
    if (str.slice(-1).trim() === '') {
      endCharacter = ' '
      let lineBreakEncountered = false
      for (let i = str.length; i--;) {
        if (str[i] === '\n') {
          lineBreakEncountered = true
        }
        if (str[i].trim() !== '') {
          break
        }
      }
      if (lineBreakEncountered) {
        endCharacter = '\n'
      }
    }
    return startCharacter + str.trim() + endCharacter
  }
  return str
}

export default collapseLeadingWhitespace
