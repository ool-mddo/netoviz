/**
 * @file Attribute class for layer1-3 network of MDDO topology model.
 */

import RfcModelBase from './base'

/**
 * Attribute class for MDDO layer1 network.
 * @extends {RfcModelBase}
 */
export class MddoL1NetworkAttribute extends RfcModelBase {
  /**
   * @typedef {Object} MddoL1NetworkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL1NetworkAttributeData|MddoL1NetworkAttribute} data - L1 network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1NetworkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for MDDO layer2 network.
 * @extends {RfcModelBase}
 */
export class MddoL2NetworkAttribute extends RfcModelBase {
  /**
   * @typedef {Object} MddoL2NetworkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL2NetworkAttributeData|MddoL2NetworkAttribute} data - L2 network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2NetworkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for MDDO layer3 network.
 * @extends {RfcModelBase}
 */
export class MddoL3NetworkAttribute extends RfcModelBase {
  /**
   * @typedef {Object} MddoL3NetworkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL3NetworkAttributeData|MddoL3NetworkAttribute} data - L3 network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3NetworkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for MDDO ospf-area network.
 * @extends {RfcModelBase}
 */
export class MddoOspfAreaNetworkAttribute extends RfcModelBase {
  /**
   * @typedef {Object} MddoOspfAreaNetworkAttributeData
   * @prop {string} name
   * @prop {string} identifier
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoOspfAreaNetworkAttributeData|MddoOspfAreaNetworkAttribute} data - L3 network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaNetworkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {string} */
    this.identifier = data.identifier || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}
