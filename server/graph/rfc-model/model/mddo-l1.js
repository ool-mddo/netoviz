/**
 * @file definition of MDDO L1-type network elements.
 */

import RfcTermPoint from '../term-point'
import RfcNode from '../node'
import RfcLink from '../link'
import RfcNetwork from '../network'
import { MddoL1TermPointAttribute } from '../tp-attr/mddo.js'
import { MddoL1NodeAttribute } from '../node-attr/mddo'
import { MddoL1LinkAttribute } from '../link-attr/mddo'
import { MddoL1NetworkAttribute } from '../network-attr/mddo'

/**
 * MDDO layer1 term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoL1TermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:l1-termination-point-attributes' // alias
    /** @type {MddoL1TermPointAttribute} */
    this.attribute = new MddoL1TermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo layer1 node class.
 * @extends {RfcNode}
 */
class MddoL1Node extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:l1-node-attributes' // alias
    this.attribute = new MddoL1NodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoL1TermPoint}
   */
  newTP(data, index) {
    return new MddoL1TermPoint(data, this.path, this.id, index)
  }
}

/**
 * MDDO layer1 link class.
 * @extends {RfcLink}
 */
class MddoL1Link extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:l1-link-attributes' // alias
    /** @type {MddoL1LinkAttribute} */
    this.attribute = new MddoL1LinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * MDDO layer1 network class.
 * @extends {RfcNetwork}
 */
export class MddoL1Network extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:l1-topology-attributes'
    this.attribute = new MddoL1NetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoL1Node}
   */
  newNode(data, index) {
    return new MddoL1Node(data, this.path, this.id, index)
  }

  /**
   * @override
   * @returns {MddoL1Link}
   */
  newLink(data) {
    return new MddoL1Link(data, this.path)
  }
}
