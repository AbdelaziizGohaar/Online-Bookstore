'use strict'
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
let matches = (value, regexOption) => {
  if (Array.isArray(regexOption)) {
    return regexOption.some(opt => matches(value, opt))
  }
  if (typeof regexOption === 'string') {
    return new RegExp(regexOption).test(value)
  }
  return new RegExp(regexOption.pattern, regexOption.flags).test(value)
}
exports.matches = matches
