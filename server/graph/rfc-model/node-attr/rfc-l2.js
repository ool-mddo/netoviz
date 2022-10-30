/**
 * @file Attribute class for layer2 node of topology model.
 */
import RfcAttributeModelBase from '../attr-base'

/**
 * Attribute class for layer2 node.
 * @extends {RfcAttributeModelBase}
 */
class RfcL2NodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} RfcL2NodeAttributeData
   * @prop {string} name
   * @prop {string} description
   * @prop {Array<string>} management-address
   * @prop {string} sys-mac-address
   * @prop {number} management-vid
   * @prop {Array<string>} flag
   */
  /**
   * @param {RfcL2NodeAttributeData|RfcL2NodeAttribute} data - L2 node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'RfcL2NodeAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {string} */
    this.description = data.description || ''
    /**
     * List of IP address.
     * @type {Array<string>}
     */
    this.managementAddress = data['management-address'] || data.managementAddress || []
    /** @type {string} */
    this.sysMacAddress = data['sys-mac-address'] || data.sysMacAddress || 'zz:zz:zz:zz:zz:zz'
    /** @type {number} */
    this.managementVid = data['management-vid'] || data.managementVid || 1
    /** @type {Array<string>} */
    this.flag = data.flag || [] // list
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const mgmtIpStr = this.managementAddress.map((d) => {
      return `<li>${d}</li>` // TODO: fine diff for literal-array
    })
    return `
<ul>
  <li>${this._toHtmlKeyValue('name', 'Name')}</li>
  <li>${this._toHtmlKeyValue('description', 'Description')}</li>
  <li>${this._toHtmlDefaultAttrKey('Management IP')}</li>
    <ul>${mgmtIpStr.join('')}</ul>
  <li>${this._toHtmlKeyValue('managementVid', 'Management VID')}</li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
`
  }
}

export default RfcL2NodeAttribute
