/**
 * @file definition of ospf-area-type network elements.
 */

import RfcTermPoint from './term-point'
import RfcNode from './node'
import RfcLink from './link'
import RfcNetwork from './network'
import { MddoOspfAreaTermPointAttribute } from './term-point-attr-mddo'
import { MddoOspfAreaNodeAttribute } from './node-attr-mddo'
import { MddoOspfAreaLinkAttribute } from './link-attr-mddo'
import { MddoOspfAreaNetworkAttribute } from './network-attr-mddo'

/**
 * MDDO ospf-area term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoOspfAreaTermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:ospf-area-termination-point-attributes' // alias
    /** @type {MddoOspfAreaTermPointAttribute} */
    this.attribute = new MddoOspfAreaTermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo ospf-area node class.
 * @extends {RfcNode}
 */
class MddoOspfAreaNode extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:ospf-area-node-attributes' // alias
    this.attribute = new MddoOspfAreaNodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoOspfAreaTermPoint}
   */
  newTP(data, index) {
    return new MddoOspfAreaTermPoint(data, this.path, this.id, index)
  }
}

/**
 * Mddo ospf-area link class.
 * @extends {RfcLink}
 */
class MddoOspfAreaLink extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:ospf-area-link-attributes' // alias
    /** @type {MddoOspfAreaLinkAttribute} */
    this.attribute = new MddoOspfAreaLinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo ospf-area network class.
 * @extends {RfcNetwork}
 */
export class MddoOspfAreaNetwork extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:ospf-area-network-attributes'
    /** @type {MddoOspfAreaNetworkAttribute} */
    this.attribute = new MddoOspfAreaNetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoOspfAreaNode}
   */
  newNode(data, index) {
    return new MddoOspfAreaNode(data, this.path, this.id, index)
  }

  /**
   * @override
   * @returns {MddoOspfAreaLink}
   */
  newLink(data) {
    return new MddoOspfAreaLink(data, this.path)
  }
}
