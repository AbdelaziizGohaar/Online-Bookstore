'use strict'
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
let getCustomGroupsCompareOptions = (options, groupNumber) => {
  if (!Array.isArray(options.customGroups)) {
    return options
  }
  let group = options.groups[groupNumber]
  let customGroup =
    typeof group === 'string'
      ? options.customGroups.find(
          currentGroup => group === currentGroup.groupName,
        )
      : null
  return {
    ...options,
    order: (customGroup == null ? void 0 : customGroup.order) ?? options.order,
    type: (customGroup == null ? void 0 : customGroup.type) ?? options.type,
  }
}
exports.getCustomGroupsCompareOptions = getCustomGroupsCompareOptions
