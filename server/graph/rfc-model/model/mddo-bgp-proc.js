/**
 * @file definition of bgp-proc type network elements.
 */
import RfcTermPoint from '../term-point'
import RfcNode from '../node'
import RfcLink from '../link'
import RfcNetwork from '../network'
import { MddoBgpProcTermPointAttribute } from '../tp-attr/mddo'
import { MddoBgpProcNodeAttribute } from '../node-attr/mddo'
import { MddoBgpProcLinkAttribute } from '../link-attr/mddo'
import { MddoBgpProcNetworkAttribute } from '../network-attr/mddo'

/**
 * Mddo bgp-proc term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoBgpProcTermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:bgp-proc-termination-point-attributes' // alias
    /** @type {MddoBgpProcTermPointAttribute} */
    this.attribute = new MddoBgpProcTermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo bgp-proc node class.
 * @extends {RfcNode}
 */
class MddoBgpProcNode extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:bgp-proc-node-attributes' // alias
    /** @type {MddoBgpProcNodeAttribute} */
    this.attribute = new MddoBgpProcNodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoBgpProcTermPoint}
   */
  newTP(data, index) {
    return new MddoBgpProcTermPoint(data, this.path, this.id, index)
  }
}

/**
 * Mddo bgp-proc link class.
 * @extends {RfcLink}
 */
class MddoBgpProcLink extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:bgp-proc-link-attributes' // alias
    /** @type {MddoBgpProcLinkAttribute} */
    this.attribute = new MddoBgpProcLinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo bgp-proc network class.
 * @extends {RfcNetwork}
 */
export class MddoBgpProcNetwork extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:bgp-proc-network-attributes' // alias
    /** @type {MddoBgpProcNetworkAttribute} */
    this.attribute = new MddoBgpProcNetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoBgpProcNode}
   */
  newNode(data, index) {
    return new MddoBgpProcNode(data, this.path, this.id, index)
  }

  /**
   * @override
   * @returns {MddoBgpProcLink}
   */
  newLink(data) {
    return new MddoBgpProcLink(data, this.path)
  }
}
