/**
 * @file Attribute class for ospf-area redistribute config
 */

import RfcModelBase from './base'

/**
 * ospf redistribute config class
 * @extends {RfcModelBase}
 */
class MddoOspfRedistribute extends RfcModelBase {
  /**
   * @typedef {Object} MddoOspfRedistributeData
   * @prop {string} protocol static or connected
   * @prop {number} metricType 1 or 2 (OE1 or OE2)
   */
  /**
   * @param {MddoOspfRedistributeData|MddoOspfAreaLinkAttribute} data - ospf redistribute config data for ospf-area node.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.protocol = data.protocol || ''
    /** @type {number} */
    this.metricType = data.metricType || data['metric-type'] || 2
  }

  /**
   * Convert attribute to html string
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    return `
<span class="attr">Protocol: </span> ${this.protocol},
<span class="attr">Metric Type: </span> ${this.metricType}
`
  }
}

export default MddoOspfRedistribute
