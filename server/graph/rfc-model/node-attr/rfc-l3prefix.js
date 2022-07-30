/**
 * @file Attribute class for layer3 prefix
 */

import RfcModelBase from '../base'

/**
 * L3 prefix class.
 * @extends {RfcModelBase}
 */
class RfcL3Prefix extends RfcModelBase {
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
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    return `
<span class="attr">Prefix:</span> ${this.prefix},
<span class="attr">Metric:</span> ${this.metric},
<span class="attr">Flag:</span> ${this.flag}
`
  }
}

export default RfcL3Prefix
