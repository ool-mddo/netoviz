/**
 * @file Attribute class for layer3 term-point of topology model.
 */
import RfcAttributeModelBase from '../attr-base'

/**
 * Attribute class for layer3 node.
 * @extends {RfcAttributeModelBase}
 */
class RfcL3TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} RfcL3TermPointAttributeData
   * @prop {Array<string>} ip-address
   */
  /**
   * @override
   * @param {RfcL3TermPointAttributeData|RfcL3TermPointAttribute} data - L3 node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'RfcL3TermPointAttribute'
    /**
     * TODO: choice ip/unnumbered/interface-name (now use only ip).
     * @type {Array<string>}
     */
    this.ipAddress = data['ip-address'] || data.ipAddress || [] // notice: array
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
 <li>${this._toHtmlKeyValue('ipAddress', 'IP Address')}</li>
</ul>
`
  }
}

export default RfcL3TermPointAttribute
