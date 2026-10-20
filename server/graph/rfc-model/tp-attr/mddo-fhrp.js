/**
 * @file Attribute class for fhrp (VRRP/HSRP) group config of layer3 term-point
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * fhrp (First Hop Redundancy Protocol: VRRP/HSRP) group config class
 * @extends {RfcAttributeModelBase}
 */
class MddoFhrp extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoFhrpData
   * @prop {string} protocol - 'vrrp' or 'hsrp'
   * @prop {number} groupId
   * @prop {Array<string>} virtualAddress
   * @prop {number} priority
   * @prop {boolean} preempt
   * @prop {string} sourceAddress
   * @prop {boolean} active
   */
  /**
   * @param {MddoFhrpData|MddoFhrp} data - fhrp group config data for layer3 term-point
   *     (accepts both of the topology data keys (kebab-case) and the object properties (camelCase),
   *     because the object is re-constructed from its JSON in the browser.)
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.protocol = data.protocol ?? ''
    /** @type {number} */
    this.groupId = data['group-id'] ?? data.groupId ?? -1
    /** @type {Array<string>} */
    this.virtualAddress = data['virtual-address'] ?? data.virtualAddress ?? [] // notice: array
    /** @type {number} */
    this.priority = data.priority ?? 0
    /** @type {boolean} */
    this.preempt = data.preempt ?? false
    /** @type {string} */
    this.sourceAddress = data['source-address'] ?? data.sourceAddress ?? ''
    /** @type {boolean} */
    this.active = data.active ?? false
  }

  /**
   * Heading of the group (e.g. "VRRP group 1")
   * @returns {string}
   * @private
   */
  _heading() {
    const protocolStr = this.protocol ? this.protocol.toUpperCase() : 'FHRP'
    return `${protocolStr} group ${this.groupId}`
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
  ${this._toHtmlDefaultAttrKey(`${this._heading()}:`)}
  ${this._toHtmlKeyValue('virtualAddress', 'Virtual Address')},
  ${this._toHtmlKeyValue('priority', 'Priority')},
  ${this._toHtmlKeyValue('preempt', 'Preempt')},
  ${this._toHtmlKeyValue('sourceAddress', 'Source Address')},
  ${this._toHtmlKeyValue('active', 'Active')}
</li>
`
  }
}

export default MddoFhrp
