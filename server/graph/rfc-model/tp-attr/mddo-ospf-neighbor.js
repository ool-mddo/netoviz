/**
 * @file Attribute class for ospf-area neighbor config
 */

import RfcModelBase from '../base'

/**
 * ospf neighbor config class
 * @extends {RfcModelBase}
 */
class MddoOspfNeighbor extends RfcModelBase {
  /**
   * @typedef {Object} MddoOspfNeighborData
   * @prop {string} routerId
   * @prop {string} ipAddr
   */
  /**
   * @param {MddoOspfNeighborData|MddoOspfNeighbor} data - ospf neighbor config data for ospf-area term-point
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.routerId = data['router-id'] || data.routerId || ''
    /** @type {string} */
    this.ipAddr = data['ip-address'] || data.ipAddr || ''
  }

  /**
   * Convert attribute to html string
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    return `
<li>
  <span class="attr">Router ID: </span> ${this.routerId},
  <span class="attr">IP Address: </span> ${this.ipAddr}
</li>
`
  }
}

export default MddoOspfNeighbor
