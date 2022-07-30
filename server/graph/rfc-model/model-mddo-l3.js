/**
 * @file definition of L3-type network elements.
 */

import RfcTermPoint from './term-point'
import RfcNode from './node'
import RfcLink from './link'
import RfcNetwork from './network'
import { MddoL3TermPointAttribute } from './term-point-attr-mddo'
import { MddoL3NodeAttribute } from './node-attr-mddo'
import { MddoL3LinkAttribute } from './link-attr-mddo'
import { MddoL3NetworkAttribute } from './network-attr-mddo'

/**
 * MDDO layer3 term-point of topology model.
 * @extends {RfcTermPoint}
 */
class MddoL3TermPoint extends RfcTermPoint {
  /**
   * @override
   */
  constructor(data, nodePath, nodeId, tpNum) {
    super(data, nodePath, nodeId, tpNum)
    const attrKey = 'mddo-topology:l3-termination-point-attributes' // alias
    /** @type {MddoL3TermPointAttribute} */
    this.attribute = new MddoL3TermPointAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * Mddo layer3 node class.
 * @extends {RfcNode}
 */
class MddoL3Node extends RfcNode {
  /**
   * @override
   */
  constructor(data, nwPath, nwId, nodeNum) {
    super(data, nwPath, nwId, nodeNum)
    const attrKey = 'mddo-topology:l3-node-attributes' // alias
    /** @type {MddoL3NodeAttribute} */
    this.attribute = new MddoL3NodeAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoL3TermPoint}
   */
  newTP(data, index) {
    return new MddoL3TermPoint(data, this.path, this.id, index)
  }
}

/**
 * MDDO layer3 link class.
 * @extends {RfcLink}
 */
class MddoL3Link extends RfcLink {
  /**
   * @override
   */
  constructor(data, nwPath) {
    super(data, nwPath)
    const attrKey = 'mddo-topology:l3-link-attributes' // alias
    /** @type {MddoL3LinkAttribute} */
    this.attribute = new MddoL3LinkAttribute(data[attrKey] || {}) // avoid undefined
  }
}

/**
 * MDDO layer3 network class.
 * @extends {RfcNetwork}
 */
export class MddoL3Network extends RfcNetwork {
  /**
   * @override
   */
  constructor(data, nwNum) {
    super(data, nwNum)
    const attrKey = 'mddo-topology:l3-topology-attributes'
    /** @type {MddoL3NetworkAttribute} */
    this.attribute = new MddoL3NetworkAttribute(data[attrKey] || {}) // avoid undefined
  }

  /**
   * @override
   * @returns {MddoL3Node}
   */
  newNode(data, index) {
    return new MddoL3Node(data, this.path, this.id, index)
  }

  /**
   * @override
   * @returns {MddoL3Link}
   */
  newLink(data) {
    return new MddoL3Link(data, this.path)
  }
}
