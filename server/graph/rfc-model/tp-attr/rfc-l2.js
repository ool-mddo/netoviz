/**
 * @file Attribute class for layer2 term-point of topology model.
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * VLAN ID/Name class.
 * @extends {RfcAttributeModelBase}
 */
class RfcL2VlanIdName extends RfcAttributeModelBase {
  /**
   * @typedef {Object} RfcL2TermPointVlanIdNameData
   * @prop {number} vlan-id
   * @prop {string} vlan-name
   */
  /**
   * @param {RfcL2TermPointVlanIdNameData|RfcL2VlanIdName} data
   */
  constructor(data) {
    super(data)
    /** @type {number} */
    this.vlanId = data['vlan-id'] || data.vlanId
    /** @type {string} */
    this.vlanName = data['vlan-name'] || data.vlanName
  }

  /**
   * Convert attribute to html string.
   * @param {Array<DiffElement>} diffElements
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(diffElements) {
    super.toHtml(diffElements)

    return `
${this._toHtmlKeyValue('vlanId', 'VID')},
${this._toHtmlKeyValue('vlanName', 'Name')}
`
  }
}

/**
 * Attribute class for Layer2 term-point.
 * (NOTICE: This is an attribute for attribute-type:VLAN)
 * @extends {RfcAttributeModelBase}
 */
class RfcL2TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} RfcL2TermPointAttributeData
   * @prop {string} description
   * @prop {number} maximum-frame-size
   * @prop {string} mac-address
   * @prop {string} eth-encapsulation
   * @prop {number} port-vlan-id
   * @prop {Array<RfcL2VlanIdName>} vlan-id-name
   * @prop {string} tp-state
   */
  /**
   * @param {RfcL2TermPointAttributeData|RfcL2TermPointAttribute} data - L2 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'RfcL2TermPointAttribute'
    /** @type {string} */
    this.description = data.description || ''
    /** @type {number} */
    this.maximumFrameSize = data['maximum-frame-size'] || data.maximumFrameSize || 1500
    /** @type {string} */
    this.macAddress = data['mac-address'] || data.macAddress || 'xx:xx:xx:xx:xx:xx'
    /** @type {string} */
    this.ethEncapsulation = data['eth-encapsulation'] || data.ethEncapsulation || ''
    /** @type {number} */
    this.portVlanId = data['port-vlan-id'] || data.portVlanId || 0
    /** @type {Array<RfcL2VlanIdName>} */
    this.vlanIdName = []
    const vlanIdList = data['vlan-id-name'] || data.vlanIdName
    if (vlanIdList) {
      this.vlanIdName = vlanIdList.map((d) => new RfcL2VlanIdName(d))
    }
    /** @type {string} */
    this.tpState = data['tp-state'] || data.tpState || 'others'
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const portIdNameStr = this.vlanIdName.map((d, index) => {
      return `<li>${d.toHtml(this?.diffState.diffDataForObjectArray('vlan-id-name', index))}</li>`
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}</li>
  <li>${this._toHtmlKeyValue('maximumFrameSize', 'Maximum Frame Size')}</li>
  <li>${this._toHtmlKeyValue('macAddress', 'MAC Address')}</li>
  <li>${this._toHtmlKeyValue('ethEncapsulation', 'Ether Encapsulation')}</li>
  <li>${this._toHtmlKeyValue('portVlanId', 'Port VLAN ID')}</li>
  <li>${this._toHtmlDefaultAttrKey('VLAN ID/Name')}</li>
    <ul>${portIdNameStr.join('')}</ul>
  <li>${this._toHtmlKeyValue('tpState', 'TP State')}</li>
</ul>
`
  }
}

export default RfcL2TermPointAttribute
