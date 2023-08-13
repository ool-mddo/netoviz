/**
 * @file definition of bgp-as type network elements.
 */
import RfcTermPoint from '../term-point'
import RfcNode from '../node'
import RfcLink from '../link'
import RfcNetwork from '../network'
import { MddoBgpAsTermPointAttribute } from '../tp-attr/mddo'
import { MddoBgpAsNodeAttribute } from '../node-attr/mddo'
import { MddoBgpAsLinkAttribute } from '../link-attr/mddo'
import { MddoBgpAsNetworkAttribute } from '../network-attr/mddo'

/**
 * Mddo bgp-as term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoBgpAsTermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:bgp-as-termination-point-attributes' // alias
    /** @type {MddoBgpAsTermPointAttribute} */
    this.attribute = new MddoBgpAsTermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo bgp-as node class.
 * @extends {RfcNode}
 */
class MddoBgpAsNode extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:bgp-as-node-attributes' // alias
    /** @type {MddoBgpAsNodeAttribute} */
    this.attribute = new MddoBgpAsNodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @return {MddoBgpAsTermPoint}
   */
  newTP(data, index) {
    return new MddoBgpAsTermPoint(data, this.path, this.id, index)
  }
}

/**
 * Mddo bgp-as link class.
 * @extends {RfcLink}
 */
class MddoBgpAsLink extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:bgp-as-link-attributes' // alias
    /** @type {MddoBgpAsLinkAttribute} */
    this.attribute = new MddoBgpAsLinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo bgp-as network class.
 * @extends {RfcNetwork}
 */
export class MddoBgpAsNetwork extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:bgp-as-network-attributes' // alias
    /** @type {MddoBgpAsNetworkAttribute} */
    this.attribute = new MddoBgpAsNetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @return {MddoBgpAsNode}
   */
  newNode(data, index) {
    return new MddoBgpAsNode(data, this.path, this.id, index)
  }

  /**
   * @override
   * @return {MddoBgpAsLink}
   */
  newLink(data) {
    return new MddoBgpAsLink(data, this.path)
  }
}
