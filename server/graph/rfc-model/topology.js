/**
 * @file Definition of networks class of topology model.
 */

import RfcModelBase from './base'
import RfcNetwork from './network'
import { RfcL2Network } from './model-rfc-l2'
import { RfcL3Network } from './model-rfc-l3'
import { OpsNetwork } from './model-ops'
import { MddoL1Network } from './model-mddo-l1'
import { MddoL2Network } from './model-mddo-l2'
import { MddoL3Network } from './model-mddo-l3'
import { MddoOspfAreaNetwork } from './model-mddo-ospf-area'

/**
 * @typedef {
 *   RfcNetwork|RfcL2Network|RfcL3Network|
 *   OpsNetwork|
 *   MddoL1Network|MddoL2Network|MddoL3Network
 * } AllRfcNetwork
 */
/**
 * Networks of topology model.
 * (Container of multiple networks.)
 * @extends {RfcModelBase}
 */
class RfcTopology extends RfcModelBase {
  /**
   * @typedef {Object} RfcTopologyData
   * @prop {RfcNetworksContainerData} ietf-network:networks - Container of Networks
   */
  /**
   * @typedef {Object} RfcNetworksData
   * @prop {Array<RfcNetwork>} network - Networks
   */
  /**
   * @param {RfcTopologyData} rfcTopologyData
   */
  constructor(rfcTopologyData) {
    const nwKey = 'ietf-network:networks' // alias
    super(rfcTopologyData[nwKey])
    /** @type {Array<AllRfcNetwork>} */
    this.networks = rfcTopologyData[nwKey].network.map((nw, nwNum) => {
      return this.newNetwork(nw, nwNum + 1)
    })
  }

  /**
   * Create (new) network.
   * @param {RfcNetworkData} data - Network data.
   * @param {number} nwNum - ID of network.
   * @returns {AllRfcNetwork}
   * @protected
   */
  newNetwork(data, nwNum) {
    const nw = new RfcNetwork(data, nwNum)
    // if network has augmented type, re-generate its type
    if (nw.isTypeRfcLayer3()) {
      return new RfcL3Network(data, nwNum)
    } else if (nw.isTypeRfcLayer2()) {
      return new RfcL2Network(data, nwNum)
    } else if (nw.isTypeOps()) {
      return new OpsNetwork(data, nwNum)
    } else if (nw.isTypeMddoLayer1()) {
      return new MddoL1Network(data, nwNum)
    } else if (nw.isTypeMddoLayer2()) {
      return new MddoL2Network(data, nwNum)
    } else if (nw.isTypeMddoLayer3()) {
      return new MddoL3Network(data, nwNum)
    } else if (nw.isTypeMddoOspfArea()) {
      return new MddoOspfAreaNetwork(data, nwNum)
    }
    return nw
  }
}

export default RfcTopology
