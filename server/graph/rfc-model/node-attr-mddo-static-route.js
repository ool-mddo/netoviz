/**
 * @file Attribute class for ospf-area static route config
 */

import RfcModelBase from './base'

/**
 * layer3 static route config class
 * @extends {RfcModelBase}
 */
class MddoStaticRoute extends RfcModelBase {
  /**
   * @typedef {Object} MddoStaticRouteData
   * @prop {string} prefix
   * @prop {string} nextHop
   * @prop {string} interface
   * @prop {number} metric
   * @prop {number} preference
   * @prop {string} description
   */
  /**
   * @param [MddoStaticRouteData|MddoStaticRoute} data - layer3 static route config data for ospf-area node.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.prefix = data.prefix || ''
    /** @type {string} */
    this.nextHop = data.nextHop || data['next-hop'] || ''
    /** @type {string} */
    this.interface = data.interface || ''
    /** @type {number} */
    this.metric = data.metric || 10
    /** @type {number} */
    this.preference = data.preference || 1
    /** @type {string} */
    this.description = data.description || ''
  }

  /**
   * Convert attribute to html string
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    return `
  <span class="attr">Prefix:</span> ${this.prefix},
  <span class="attr">Next hop:</span> ${this.nextHop},
  <span class="attr">Interface:</span> ${this.interface},
  <span class="attr">Metric:</span> ${this.metric},
  <span class="attr">Preference:</span> ${this.preference},
  <span class="attr">Description:</span> ${this.description}
`
  }
}

export default MddoStaticRoute
