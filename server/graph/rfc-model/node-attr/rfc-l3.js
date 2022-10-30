/**
 * @file Attribute class for layer3 node of topology model.
 */

import RfcAttributeModelBase from '../attr-base'
import RfcL3Prefix from '../node-attr/rfc-l3prefix.js'

/**
 * Attribute class for layer3 node.
 * @extends {RfcAttributeModelBase}
 */
class RfcL3NodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} RfcL3NodeAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   * @prop {Array<string>} router-id
   * @prop {Array<RfcL3Prefix>} prefix
   */
  /**
   * @param {RfcL3NodeAttributeData|RfcL3NodeAttribute} data - L3 node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'RfcL3NodeAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
    /** @type {Array<string>} */
    this.routerId = data.routerId || data['router-id'] || []
    /** @type {Array<RfcL3Prefix>} */
    this.prefix = [] // array
    if (data.prefix) {
      this.prefix = data.prefix.map((d) => new RfcL3Prefix(d))
    }
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const prefixList = this.prefix.map((d, index) => {
      return `<li>${d.toHtml(this?.diffState.diffDataForObjectArray('prefix', index))}</li>`
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('name', 'Name')}</li>
  <li>${this._toHtmlKeyValue('routerId', 'Router ID')}</li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
  <li>${this._toHtmlDefaultAttrKey('Prefix')}
    <ul>${prefixList.join('')}</ul>
  </li>
</ul>
`
  }
}

export default RfcL3NodeAttribute
