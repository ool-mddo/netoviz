/**
 * @file Attribute class for layer1-3 network of MDDO topology model.
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * Attribute class for MDDO layer1 network.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL1NetworkAttribute extends RfcAttributeModelBase {
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
 * @extends {RfcAttributeModelBase}
 */
export class MddoL2NetworkAttribute extends RfcAttributeModelBase {
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
 * @extends {RfcAttributeModelBase}
 */
export class MddoL3NetworkAttribute extends RfcAttributeModelBase {
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
 * @extends {RfcAttributeModelBase}
 */
export class MddoOspfAreaNetworkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfAreaNetworkAttributeData
   * @prop {string} name
   * @prop {string} identifier
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoOspfAreaNetworkAttributeData|MddoOspfAreaNetworkAttribute} data - ospf-area network attribute data.
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

/**
 * Attribute class for MDDO bgp-proc network.
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpProcNetworkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpProcNetworkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoBgpProcNetworkAttributeData|MddoBgpProcNetworkAttribute} data - bgp-proc network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpProcNetworkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for MDDO bgp-as network.
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpAsNetworkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpAsNetworkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoBgpAsNetworkAttributeData|MddoBgpAsNetworkAttribute} data - bgp-as network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpAsNetworkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}
