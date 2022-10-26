/**
 * @file Attribute class for ospf-area static route config
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * layer3 static route config class
 * @extends {RfcAttributeModelBase}
 */
class MddoStaticRoute extends RfcAttributeModelBase {
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
   * @param {MddoStaticRouteData|MddoStaticRoute} data - layer3 static route config data for ospf-area node.
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
   * @param {Array<DiffElement>} diffElements
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(diffElements) {
    super.toHtml(diffElements)
    return `
${this._toHtmlKeyValue('prefix', 'Prefix')},
${this._toHtmlKeyValue('nextHop', 'Next hop')},
${this._toHtmlKeyValue('interface', 'Interface')},
${this._toHtmlKeyValue('preference', 'Preference')},
${this._toHtmlKeyValue('description', 'Description')}
`
  }
}

export default MddoStaticRoute
