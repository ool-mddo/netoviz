/**
 * @file Attribute class for ospf-area redistribute config
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * ospf redistribute config class
 * @extends {RfcAttributeModelBase}
 */
class MddoOspfRedistribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfRedistributeData
   * @prop {string} protocol static or connected
   * @prop {number} metricType 1 or 2 (OE1 or OE2)
   */
  /**
   * @param {MddoOspfRedistributeData|MddoOspfAreaLinkAttribute} data
   *   - ospf redistribute config data for ospf-area node.
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
   * @param {Array<DiffElement>} diffElements
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(diffElements) {
    super.toHtml(diffElements)

    return `
${this._toHtmlKeyValue('protocol', 'Protocol')},
${this._toHtmlKeyValue('metricType', 'Metric Type')}
`
  }
}

export default MddoOspfRedistribute
