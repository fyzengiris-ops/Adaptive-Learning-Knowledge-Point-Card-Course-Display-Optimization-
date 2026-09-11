/**
 * 需求注册表结构定义
 * 用户可见业务逻辑正文以 logicSections 为唯一来源。
 *
 * @typedef {'field'|'copy'|'button'|'region'|'dialog'|'panel'|'tab'|'step'|'state'|'data'} RequirementObjectType
 * @typedef {'implemented'|'planned'} AnchorStatus
 * @typedef {'code'|'decision'|'code+decision'} RequirementSourceType
 *
 * @typedef {Object} ActivationStep
 * @property {'navigate'|'openPanel'|'openDialog'|'setStep'|'setTab'|'scrollTo'|'highlight'} type
 * @property {string} label
 * @property {string} [to]
 * @property {string} [panel]
 * @property {string} [dialog]
 * @property {string} [step]
 * @property {string} [tab]
 * @property {string} [anchorId]
 *
 * @typedef {Object} LogicSection
 * @property {string} title 一级标题；由规则归类产生
 * @property {string[]} items 业务规则条目；每条一个可验收事实
 *
 * @typedef {Object} RequirementSource
 * @property {string} decisionFile
 * @property {string} decisionObject
 * @property {string[]} relatedFiles
 *
 * @typedef {Object} RequirementItem
 * @property {string} id
 * @property {string} title
 * @property {RequirementSourceType} sourceType
 * @property {RequirementObjectType} objectType
 * @property {string} objectName
 * @property {string} module
 * @property {string} pageName
 * @property {string} route
 * @property {string} anchorId
 * @property {AnchorStatus} anchorStatus
 * @property {ActivationStep[]} activate
 * @property {LogicSection[]} logicSections
 * @property {string[]} acceptance
 * @property {RequirementSource} source
 *
 * @typedef {Object} ExcludedDecision
 * @property {string} objectName
 * @property {string} reason
 * @property {string} sourceDecision
 *
 * @typedef {Object} RequirementRegistry
 * @property {string} registryId
 * @property {string} pageName
 * @property {string} route
 * @property {string} module
 * @property {string} description
 * @property {string} sourceDecisionFile
 * @property {string[]} relatedFiles
 * @property {RequirementItem[]} requirements
 * @property {ExcludedDecision[]} excludedDecisions
 */
