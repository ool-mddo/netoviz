/**
 * @file Attribute class for MDDO layer1-3 term-point of topology model.
 */

import RfcAttributeModelBase from '../attr-base'
import MddoOspfTimer from '../tp-attr/mddo-ospf-timer'
import MddoOspfNeighbor from '../tp-attr/mddo-ospf-neighbor'

/**
 * Attribute class for MDDO Layer1 term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL1TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL1TermPointAttributeData
   * @prop {string} description
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL1TermPointAttributeData|MddoL1TermPointAttribute} data - L1 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1TermPointAttribute'

    /** @type {string} */
    this.description = data.description || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>
`
  }
}

/**
 * Attribute class for MDDO Layer2 term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL2TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL2TermPointAttributeData
   * @prop {string} description
   * @prop {Array<string>} flag
   * @prop {string} encapsulation
   * @prop {string} switchportMode
   */
  /**
   * @param {MddoL2TermPointAttributeData|MddoL2TermPointAttribute} data - L1 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2TermPointAttribute'

    /** @type {string} */
    this.description = data.description || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
    /** @type {string} */
    this.encapsulation = data.encapsulation || ''
    /** @type {string} */
    this.switchportMode = data['switchport-mode'] || data.switchportMode || ''
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}
  <li>${this._toHtmlKeyValue('encapsulation', 'Encapsulation')}
  <li>${this._toHtmlKeyValue('switchportMode', 'Switchport mode')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>
`
  }
}

/**
 * Attribute class for MDDO Layer3 term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL3TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL3TermPointAttributeData
   * @prop {string} description
   * @prop {Array<string>} flag
   * @prop {Array<string>} ipAddress
   */
  /**
   * @param {MddoL3TermPointAttributeData|MddoL3TermPointAttribute} data - L1 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3TermPointAttribute'

    /** @type {string} */
    this.description = data.description || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
    /** @type {Array<string>} */
    this.ipAddress = data['ip-address'] || data.ipAddress || [] // notice: array
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}
  <li>${this._toHtmlKeyValue('ipAddress', 'IP Address')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>
`
  }
}

/**
 * Attribute class for MDDO ospf-area term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoOspfAreaTermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfAreaTermPointAttributeData
   * @prop {string} networkType
   * @prop {number} priority
   * @prop {number} metric
   * @prop {boolean} passive
   * @prop {MddoOspfTimerData} timer
   * @prop {Array<MddoOspfNeighborData>} neighbor
   */
  /**
   * @param {MddoOspfAreaTermPointAttributeData|MddoOspfAreaTermPointAttribute} data - ospf-area term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaTermPointAttribute'

    /** @type {string} */
    this.networkType = data['network-type'] || data.networkType || ''
    /** @type {number} */
    this.priority = data.priority || 10
    /** @type {number} */
    this.metric = data.metric || 1
    /** @type {boolean} */
    this.passive = data.passive || false
    /** @type {MddoOspfTimer} */
    this.timer = data.timer
      ? new MddoOspfTimer(data.timer)
      : new MddoOspfTimer({}) // default timer config
    /** @type {Array<MddoOspfNeighbor>} */
    this.neighbor = data.neighbor
      ? data.neighbor.map((n) => new MddoOspfNeighbor(n))
      : []
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('networkType', 'Network type')}</li>
  <li>${this._toHtmlKeyValue('priority', 'Priority')}</li>
  <li>${this._toHtmlKeyValue('metric', 'Metric')}</li>
  <li>${this._toHtmlKeyValue('passive', 'Passive')}</li>
  <li>${this._toHtmlDefaultAttrKey('Timer')}
    ${this.timer.toHtml(
      this?.diffState.findAllDiffDataMatchesPath(/timer\.(.+)/)
    )}
  </li>
  <li>${this._toHtmlDefaultAttrKey('Neighbor')}
    <ul>${this.neighbor
      .map((n, index) =>
        n.toHtml(this?.diffState.diffDataForObjectArray('neighbor', index))
      )
      .join('')}</ul>
  </li>
</ul>
`
  }
}
