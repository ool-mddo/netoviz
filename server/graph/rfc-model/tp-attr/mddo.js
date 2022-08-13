/**
 * @file Attribute class for MDDO layer1-3 term-point of topology model.
 */

import RfcModelBase from '../base'
import MddoOspfTimer from '../tp-attr/mddo-ospf-timer'
import MddoOspfNeighbor from '../tp-attr/mddo-ospf-neighbor'

/**
 * Attribute class for MDDO Layer1 term-point.
 * @extends {RfcModelBase}
 */
export class MddoL1TermPointAttribute extends RfcModelBase {
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
  toHtml() {
    return `
<ul>
  <li><span class="attr">Description:</span> ${this.description}</li>
  <li><span class="attr">Flag:</span> ${this.flag}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO Layer2 term-point.
 * @extends {RfcModelBase}
 */
export class MddoL2TermPointAttribute extends RfcModelBase {
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
    this.switchportMode = data.switchportMode || data['switchport-mode'] || ''
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    return `
<ul>
  <li><span class="attr">Description:</span> ${this.description}</li>
  <li><span class="attr">Encapsulation:</span> ${this.encapsulation}</li>
  <li><span class="attr">Switchport mode:</span> ${this.switchportMode}</li>
  <li><span class="attr">Flag:</span> ${this.flag}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO Layer3 term-point.
 * @extends {RfcModelBase}
 */
export class MddoL3TermPointAttribute extends RfcModelBase {
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
  toHtml() {
    return `
<ul>
  <li><span class="attr">Description:</span> ${this.description}</li>
  <li><span class="attr">IP Address:</span> ${this.ipAddress}</li>
  <li><span class="attr">Flag:</span> ${this.flag}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO ospf-area term-point.
 * @extends {RfcModelBase}
 */
export class MddoOspfAreaTermPointAttribute extends RfcModelBase {
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
    this.networkType = data.networkType || data['network-type'] || ''
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
  toHtml() {
    return `
<ul>
  <li><span class="attr">Network type:</span> ${this.networkType}</li>
  <li><span class="attr">Priority:</span> ${this.priority}</li>
  <li><span class="attr">Metric:</span> ${this.metric}</li>
  <li><span class="attr">Passive:</span> ${this.passive}</li>
  <li><span class="attr">Timer:</span>
    ${this.timer.toHtml()}
  </li>
  <li><span class="attr">Neighbor:</span>
    <ul>${this.neighbor.map((n) => n.toHtml()).join('')}</ul>
  </li>
</ul>
`
  }
}
