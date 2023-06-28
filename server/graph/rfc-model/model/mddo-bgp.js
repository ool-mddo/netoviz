/**
 * @file defintion of bgp-type network elements.
 */
import RfcTermPoint from '../term-point'
import RfcNode from '../node'
import RfcLink from '../link'
import RfcNetwork from '../network'
import { MddoBgpTermPointAttribute } from '../tp-attr/mddo'
import { MddoBgpNodeAttribute } from '../node-attr/mddo'
import { MddoBgpLinkAttribute } from '../link-attr/mddo'
import { MddoBgpNetworkAttribute } from '../network-attr/mddo'

/**
 * Mddo bgp term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoBgpTermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:bgp-termination-point-attributes' // alias
    /** @type {MddoBgpTermPointAttribute} */
    this.attribute = new MddoBgpTermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo bgp node class.
 * @extends {RfcNode}
 */
class MddoBgpNode extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:bgp-node-attributes' // alias
    /** @type {MddoBgpNodeAttribute} */
    this.attribute = new MddoBgpNodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoBgpTermPoint}
   */
  newTP(data, index) {
    return new MddoBgpTermPoint(data, this.path, this.id, index)
  }
}

/**
 * Mddo bgp link class.
 * @extends {RfcLink}
 */
class MddoBgpLink extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:bgp-link-attributes' // alias
    /** @type {MddoBgpLinkAttribute} */
    this.attribute = new MddoBgpLinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo bgp network class.
 * @extends {RfcNetwork}
 */
export class MddoBgpNetwork extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:bgp-network-attributes' // alias
    /** @type {MddoBgpNetworkAttribute} */
    this.attribute = new MddoBgpNetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoBgpNode}
   */
  newNode(data, index) {
    return new MddoBgpNode(data, this.path, this.id, index)
  }

  /**
   * @override
   * @returns {MddoBgpLink}
   */
  newLink(data) {
    return new MddoBgpLink(data, this.path)
  }
}
