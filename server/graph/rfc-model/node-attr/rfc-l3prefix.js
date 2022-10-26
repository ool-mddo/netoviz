/**
 * @file Attribute class for layer3 prefix
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * L3 prefix class.
 * @extends {RfcAttributeModelBase}
 */
class RfcL3Prefix extends RfcAttributeModelBase {
  /**
   * @typedef {Object} RfcL3NodePrefixData
   * @prop {string} prefix
   * @prop {number} metric
   * @prop {Array<string>} flag
   */
  /**
   * @param {RfcL3NodePrefixData|RfcL3Prefix} data - Prefix data for L3 node.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.prefix = data.prefix || ''
    /** @type {number} */
    this.metric = data.metric || 0
    /** @type {Array<string>} */
    this.flag = data.flag || [] // array
  }

  /**
   * Convert attribute to html string.
   * @param {Array<DiffElement>} diffElements
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(diffElements) {
    super.toHtml(diffElements)
    return `
${this._toHtmlKeyValue('prefix', 'Prefix')},
${this._toHtmlKeyValue('metric', 'Metric')},
${this._toHtmlKeyValue('flag', 'Flag')}
`
  }
}

export default RfcL3Prefix
