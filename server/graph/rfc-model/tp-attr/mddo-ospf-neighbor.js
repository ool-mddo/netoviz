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
    this.routerId = data.routerId || data['router-id'] || ''
    /** @type {string} */
    this.ipAddr = data.ipAddr || data['ip-address'] || ''
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
