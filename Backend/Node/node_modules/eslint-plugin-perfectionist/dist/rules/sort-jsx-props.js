'use strict'
const types = require('@typescript-eslint/types')
const commonJsonSchemas = require('../utils/common-json-schemas.js')
const reportErrors = require('../utils/report-errors.js')
const validateNewlinesAndPartitionConfiguration = require('../utils/validate-newlines-and-partition-configuration.js')
const validateCustomSortConfiguration = require('../utils/validate-custom-sort-configuration.js')
const validateGroupsConfiguration = require('../utils/validate-groups-configuration.js')
const getMatchingContextOptions = require('../utils/get-matching-context-options.js')
const getEslintDisabledLines = require('../utils/get-eslint-disabled-lines.js')
const isNodeEslintDisabled = require('../utils/is-node-eslint-disabled.js')
const sortNodesByGroups = require('../utils/sort-nodes-by-groups.js')
const createEslintRule = require('../utils/create-eslint-rule.js')
const reportAllErrors = require('../utils/report-all-errors.js')
const shouldPartition = require('../utils/should-partition.js')
const getSourceCode = require('../utils/get-source-code.js')
const rangeToDiff = require('../utils/range-to-diff.js')
const getSettings = require('../utils/get-settings.js')
const isSortable = require('../utils/is-sortable.js')
const useGroups = require('../utils/use-groups.js')
const complete = require('../utils/complete.js')
const matches = require('../utils/matches.js')
let defaultOptions = {
  fallbackSort: { type: 'unsorted' },
  specialCharacters: 'keep',
  newlinesBetween: 'ignore',
  partitionByNewLine: false,
  useConfigurationIf: {},
  type: 'alphabetical',
  ignorePattern: [],
  ignoreCase: true,
  customGroups: {},
  locales: 'en-US',
  alphabet: '',
  order: 'asc',
  groups: [],
}
const sortJsxProps = createEslintRule.createEslintRule({
  create: context => ({
    JSXElement: node => {
      if (!isSortable.isSortable(node.openingElement.attributes)) {
        return
      }
      let settings = getSettings.getSettings(context.settings)
      let sourceCode = getSourceCode.getSourceCode(context)
      let matchedContextOptions = getMatchingContextOptions
        .getMatchingContextOptions({
          nodeNames: node.openingElement.attributes
            .filter(
              attribute =>
                attribute.type !==
                types.TSESTree.AST_NODE_TYPES.JSXSpreadAttribute,
            )
            .map(attribute => getNodeName({ attribute })),
          contextOptions: context.options,
        })
        .find(options2 => {
          var _a
          if (
            !((_a = options2.useConfigurationIf) == null
              ? void 0
              : _a.tagMatchesPattern)
          ) {
            return true
          }
          return matches.matches(
            sourceCode.getText(node.openingElement.name),
            options2.useConfigurationIf.tagMatchesPattern,
          )
        })
      let options = complete.complete(
        matchedContextOptions,
        settings,
        defaultOptions,
      )
      validateCustomSortConfiguration.validateCustomSortConfiguration(options)
      validateGroupsConfiguration.validateGroupsConfiguration({
        allowedPredefinedGroups: ['multiline', 'shorthand', 'unknown'],
        allowedCustomGroups: Object.keys(options.customGroups),
        options,
      })
      validateNewlinesAndPartitionConfiguration.validateNewlinesAndPartitionConfiguration(
        options,
      )
      let shouldIgnore = matches.matches(
        sourceCode.getText(node.openingElement.name),
        options.ignorePattern,
      )
      if (
        shouldIgnore ||
        !isSortable.isSortable(node.openingElement.attributes)
      ) {
        return
      }
      let eslintDisabledLines = getEslintDisabledLines.getEslintDisabledLines({
        ruleName: context.id,
        sourceCode,
      })
      let formattedMembers = node.openingElement.attributes.reduce(
        (accumulator, attribute) => {
          var _a
          if (
            attribute.type === types.TSESTree.AST_NODE_TYPES.JSXSpreadAttribute
          ) {
            accumulator.push([])
            return accumulator
          }
          let name = getNodeName({ attribute })
          let { setCustomGroups, defineGroup, getGroup } =
            useGroups.useGroups(options)
          setCustomGroups(options.customGroups, name)
          if (attribute.value === null) {
            defineGroup('shorthand')
          } else if (attribute.loc.start.line !== attribute.loc.end.line) {
            defineGroup('multiline')
          }
          let sortingNode = {
            isEslintDisabled: isNodeEslintDisabled.isNodeEslintDisabled(
              attribute,
              eslintDisabledLines,
            ),
            size: rangeToDiff.rangeToDiff(attribute, sourceCode),
            group: getGroup(),
            node: attribute,
            name,
          }
          let lastSortingNode =
            (_a = accumulator.at(-1)) == null ? void 0 : _a.at(-1)
          if (
            shouldPartition.shouldPartition({
              lastSortingNode,
              sortingNode,
              sourceCode,
              options,
            })
          ) {
            accumulator.push([])
          }
          accumulator.at(-1).push(sortingNode)
          return accumulator
        },
        [[]],
      )
      for (let nodes of formattedMembers) {
        let sortNodesExcludingEslintDisabled = ignoreEslintDisabledNodes =>
          sortNodesByGroups.sortNodesByGroups(nodes, options, {
            ignoreEslintDisabledNodes,
          })
        reportAllErrors.reportAllErrors({
          availableMessageIds: {
            missedSpacingBetweenMembers: 'missedSpacingBetweenJSXPropsMembers',
            extraSpacingBetweenMembers: 'extraSpacingBetweenJSXPropsMembers',
            unexpectedGroupOrder: 'unexpectedJSXPropsGroupOrder',
            unexpectedOrder: 'unexpectedJSXPropsOrder',
          },
          sortNodesExcludingEslintDisabled,
          sourceCode,
          options,
          context,
          nodes,
        })
      }
    },
  }),
  meta: {
    schema: {
      items: {
        properties: {
          ...commonJsonSchemas.commonJsonSchemas,
          useConfigurationIf:
            commonJsonSchemas.buildUseConfigurationIfJsonSchema({
              additionalProperties: {
                tagMatchesPattern: commonJsonSchemas.regexJsonSchema,
              },
            }),
          partitionByNewLine: commonJsonSchemas.partitionByNewLineJsonSchema,
          newlinesBetween: commonJsonSchemas.newlinesBetweenJsonSchema,
          customGroups: commonJsonSchemas.customGroupsJsonSchema,
          ignorePattern: commonJsonSchemas.regexJsonSchema,
          groups: commonJsonSchemas.groupsJsonSchema,
        },
        additionalProperties: false,
        type: 'object',
      },
      uniqueItems: true,
      type: 'array',
    },
    messages: {
      missedSpacingBetweenJSXPropsMembers: reportErrors.MISSED_SPACING_ERROR,
      extraSpacingBetweenJSXPropsMembers: reportErrors.EXTRA_SPACING_ERROR,
      unexpectedJSXPropsGroupOrder: reportErrors.GROUP_ORDER_ERROR,
      unexpectedJSXPropsOrder: reportErrors.ORDER_ERROR,
    },
    docs: {
      url: 'https://perfectionist.dev/rules/sort-jsx-props',
      description: 'Enforce sorted JSX props.',
      recommended: true,
    },
    type: 'suggestion',
    fixable: 'code',
  },
  defaultOptions: [defaultOptions],
  name: 'sort-jsx-props',
})
let getNodeName = ({ attribute }) =>
  attribute.name.type === types.TSESTree.AST_NODE_TYPES.JSXNamespacedName
    ? `${attribute.name.namespace.name}:${attribute.name.name.name}`
    : attribute.name.name
module.exports = sortJsxProps
