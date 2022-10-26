/**
 * @file Attribute class for ospf-area neighbor config
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * ospf neighbor config class
 * @extends {RfcAttributeModelBase}
 */
class MddoOspfNeighbor extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfNeighborData
   * @prop {string} routerId
   * @prop {string} ipAddress
   */
  /**
   * @param {MddoOspfNeighborData|MddoOspfNeighbor} data - ospf neighbor config data for ospf-area term-point
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.routerId = data['router-id'] || data.routerId || ''
    /** @type {string} */
    this.ipAddress = data['ip-address'] || data.ipAddress || ''
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
<li>
  ${this._toHtmlKeyValue('routerId', 'Router ID')},
  ${this._toHtmlKeyValue('ipAddress', 'IP Address')}
</li>
`
  }
}

export default MddoOspfNeighbor
