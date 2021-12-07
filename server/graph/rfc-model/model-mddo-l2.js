/**
 * @file definition of MDDO L2-type network elements.
 */

import RfcTermPoint from './term-point'
import RfcNode from './node'
import RfcLink from './link'
import RfcNetwork from './network'
import { MddoL2TermPointAttribute } from './term-point-attr-mddo'
import { MddoL2NodeAttribute } from './node-attr-mddo'
import { MddoL2LinkAttribute } from './link-attr-mddo'
import { MddoL2NetworkAttribute } from './network-attr-mddo'

/**
 * MDDO layer2 term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoL2TermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:l2-termination-point-attributes' // alias
    /** @type {MddoL2TermPointAttribute} */
    this.attribute = new MddoL2TermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * MDDO layer2 node class.
 * @extends {RfcNode}
 */
class MddoL2Node extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:l2-node-attributes' // alias
    /** @type{MddoL2NodeAttribute} */
    this.attribute = new MddoL2NodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoL2TermPoint}
   */
  newTP(data, index) {
    return new MddoL2TermPoint(data, this.path, this.id, index)
  }
}

/**
 * MDDO layer2 link class.
 * @extends {RfcLink}
 */
class MddoL2Link extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:l2-link-attributes' // alias
    /** @type {MddoL2LinkAttribute} */
    this.attribute = new MddoL2LinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo layer2 network class.
 * @extends {RfcNetwork}
 */
export class MddoL2Network extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:l2-topology-attributes'
    /** @type {MddoL2NetworkAttribute} */
    this.attribute = new MddoL2NetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoL2Node}
   */
  newNode(data, index) {
    return new MddoL2Node(data, this.path, this.id, index)
  }

  /**
   * @override
   * @returns {MddoL2Link}
   */
  newLink(data) {
    return new MddoL2Link(data, this.path)
  }
}
