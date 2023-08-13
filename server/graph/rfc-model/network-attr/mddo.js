/**
 * @file Attribute class for layer1-3 network of MDDO topology model.
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * Attribute base-class for Mddo network.
 * @extends {RfcAttributeModelBase}
 */
class MddoNetworkAttributeBase extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoNetworkAttributeBaseData
   * @prop {string} name
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoNetworkAttributeBaseData|MddoNetworkAttributeBase} data - Network attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoNetworkAttributeBase'

    /** @type {string} */
    this.name = data.name || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }
}

/**
 * Attribute class for MDDO layer1 network.
 * @extends {MddoNetworkAttributeBase}
 */
export class MddoL1NetworkAttribute extends MddoNetworkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1NetworkAttribute'
  }
}

/**
 * Attribute class for MDDO layer2 network.
 * @extends {MddoNetworkAttributeBase}
 */
export class MddoL2NetworkAttribute extends MddoNetworkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2NetworkAttribute'
  }
}

/**
 * Attribute class for MDDO layer3 network.
 * @extends {MddoNetworkAttributeBase}
 */
export class MddoL3NetworkAttribute extends MddoNetworkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3NetworkAttribute'
  }
}

/**
 * Attribute class for MDDO ospf-area network.
 * @extends {MddoNetworkAttributeBase}
 */
export class MddoOspfAreaNetworkAttribute extends MddoNetworkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaNetworkAttribute'

    /** @type {string} */
    this.identifier = data.identifier || ''
  }
}

/**
 * Attribute class for MDDO bgp-proc network.
 * @extends {MddoNetworkAttributeBase}
 */
export class MddoBgpProcNetworkAttribute extends MddoNetworkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpProcNetworkAttribute'
  }
}

/**
 * Attribute class for MDDO bgp-as network.
 * @extends {MddoNetworkAttributeBase}
 */
export class MddoBgpAsNetworkAttribute extends MddoNetworkAttributeBase {
  /**
   * @override
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpAsNetworkAttribute'
  }
}
