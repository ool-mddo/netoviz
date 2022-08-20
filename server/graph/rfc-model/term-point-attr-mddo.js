/**
 * @file Attribute class for MDDO layer1-3 term-point of topology model.
 */

import RfcModelBase from './base'

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
