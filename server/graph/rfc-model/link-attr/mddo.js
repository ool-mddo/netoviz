/**
 * @file Attribute class for MDDO layer1-3 link of topology model.
 * TODO: Link attribute details is not defined (TBA)
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * Attribute class for layer1 link.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL1LinkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL1LinkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL1LinkAttributeData|MddoL1LinkAttribute} data - L1 link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1LinkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for layer2 link.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL2LinkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL2LinkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL2LinkAttributeData|MddoL2LinkAttribute} data - L2 link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2LinkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for layer3 link.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL3LinkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL3LinkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL3LinkAttributeData|MddoL3LinkAttribute} data - L3 link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3LinkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for ospf-area link.
 * @extends {RfcAttributeModelBase}
 */
export class MddoOspfAreaLinkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfAreaLinkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoOspfAreaLinkAttributeData|MddoOspfAreaLinkAttribute} data - Ospf-area link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaLinkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for bgp-proc link.
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpProcLinkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpProcLinkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoBgpProcLinkAttributeData|MddoBgpProcLinkAttribute} data - BGP-proc link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpProcLinkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for bgp-as link.
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpAsLinkAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpAsLinkAttributeData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoBgpAsLinkAttributeData|MddoBgpAsLinkAttribute} data - BGP-as link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpAsLinkAttribute'
    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}
