/**
 * @file Attribute class for MDDO layer1-3 link of topology model.
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * Attribute base-class for Mddo link.
 * @extends {RfcAttributeModelBase}
 */
class MddoLinkAttributeBase extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoLinkAttributeBaseData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoLinkAttributeBaseData|MddoLinkAttributeBase} data - link attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoLinkAttributeBase'

    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for layer1 link.
 * @extends {MddoLinkAttributeBase}
 */
export class MddoL1LinkAttribute extends MddoLinkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1LinkAttribute'
  }
}

/**
 * Attribute class for layer2 link.
 * @extends {MddoLinkAttributeBase}
 */
export class MddoL2LinkAttribute extends MddoLinkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2LinkAttribute'
  }
}

/**
 * Attribute class for layer3 link.
 * @extends {MddoLinkAttributeBase}
 */
export class MddoL3LinkAttribute extends MddoLinkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3LinkAttribute'
  }
}

/**
 * Attribute class for ospf-area link.
 * @extends {MddoLinkAttributeBase}
 */
export class MddoOspfAreaLinkAttribute extends MddoLinkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaLinkAttribute'
  }
}

/**
 * Attribute class for bgp-proc link.
 * @extends {MddoLinkAttributeBase}
 */
export class MddoBgpProcLinkAttribute extends MddoLinkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpProcLinkAttribute'
  }
}

/**
 * Attribute class for bgp-as link.
 * @extends {MddoLinkAttributeBase}
 */
export class MddoBgpAsLinkAttribute extends MddoLinkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpAsLinkAttribute'
  }
}
