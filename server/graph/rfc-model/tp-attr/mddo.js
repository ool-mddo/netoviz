/**
 * @file Attribute class for MDDO layer1-3 term-point of topology model.
 */

import RfcAttributeModelBase from '../attr-base'
import MddoOspfTimer from '../tp-attr/mddo-ospf-timer'
import MddoOspfNeighbor from '../tp-attr/mddo-ospf-neighbor'
import MddoBgpTimer from '../tp-attr/mddo-bgp-timer'

/**
 * Attribute class for MDDO Layer1 term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL1TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL1TermPointAttributeData
   * @prop {string} description
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL1TermPointAttributeData|MddoL1TermPointAttribute} data - L1 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1TermPointAttribute'

    /** @type {string} */
    this.description = data.description || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>
`
  }
}

/**
 * Attribute class for MDDO Layer2 term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL2TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL2TermPointAttributeData
   * @prop {string} description
   * @prop {Array<string>} flag
   * @prop {string} encapsulation
   * @prop {string} switchportMode
   */
  /**
   * @param {MddoL2TermPointAttributeData|MddoL2TermPointAttribute} data - L1 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2TermPointAttribute'

    /** @type {string} */
    this.description = data.description || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
    /** @type {string} */
    this.encapsulation = data.encapsulation || ''
    /** @type {string} */
    this.switchportMode = data['switchport-mode'] || data.switchportMode || ''
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}
  <li>${this._toHtmlKeyValue('encapsulation', 'Encapsulation')}
  <li>${this._toHtmlKeyValue('switchportMode', 'Switchport Mode')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>
`
  }
}

/**
 * Attribute class for MDDO Layer3 term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL3TermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL3TermPointAttributeData
   * @prop {string} description
   * @prop {Array<string>} flag
   * @prop {Array<string>} ipAddress
   */
  /**
   * @param {MddoL3TermPointAttributeData|MddoL3TermPointAttribute} data - L1 term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3TermPointAttribute'

    /** @type {string} */
    this.description = data.description || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
    /** @type {Array<string>} */
    this.ipAddress = data['ip-address'] || data.ipAddress || [] // notice: array
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('description', 'Description')}
  <li>${this._toHtmlKeyValue('ipAddress', 'IP Address')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>
`
  }
}

/**
 * Attribute class for MDDO ospf-area term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoOspfAreaTermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfAreaTermPointAttributeData
   * @prop {string} networkType
   * @prop {number} priority
   * @prop {number} metric
   * @prop {Boolean} passive
   * @prop {MddoOspfTimerData} timer
   * @prop {Array<MddoOspfNeighborData>} neighbor
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoOspfAreaTermPointAttributeData|MddoOspfAreaTermPointAttribute} data
   *   - ospf-area term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaTermPointAttribute'

    /** @type {string} */
    this.networkType = data['network-type'] || data.networkType || ''
    /** @type {number} */
    this.priority = data.priority || 10
    /** @type {number} */
    this.metric = data.metric || 1
    /** @type {Boolean} */
    this.passive = data.passive || false
    /** @type {MddoOspfTimer} */
    this.timer = data.timer ? new MddoOspfTimer(data.timer) : new MddoOspfTimer() // default timer config
    /** @type {Array<MddoOspfNeighbor>} */
    this.neighbor = data.neighbor ? data.neighbor.map((n) => new MddoOspfNeighbor(n)) : []
    /** @type {number} */
    this.area = data.area >= 0 ? data.area : -1
    /** @type {Array<String> } */
    this.flag = data.flag || []
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const neighborStr = this.neighbor.map((n, index) => {
      return n.toHtml(this?.diffState.diffDataForObjectArray('neighbor', index))
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('networkType', 'Network type')}</li>
  <li>${this._toHtmlKeyValue('priority', 'Priority')}</li>
  <li>${this._toHtmlKeyValue('metric', 'Metric')}</li>
  <li>${this._toHtmlKeyValue('passive', 'Passive')}</li>
  <li>${this._toHtmlKeyValue('area', 'Area')}</li>
  <li>${this._toHtmlDefaultAttrKey('Timer')}
    ${this.timer.toHtml(this?.diffState.findAllDiffDataMatchesPath(/timer\.(.+)/))}
  </li>
  <li>${this._toHtmlDefaultAttrKey('Neighbor')}
    <ul>${neighborStr.join('')}</ul>
  </li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO bgp-proc term-point.
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpProcTermPointAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpProcTermPointAttributeData
   * @prop {number} localAs
   * @prop {string} localIp
   * @prop {number} remoteAs
   * @prop {string} remoteIp
   * @prop {string} description
   * @prop {number} confederation
   * @prop {Boolean} routeReflectorClient
   * @prop {string} clusterId
   * @prop {string} peerGroup
   * @prop {Array<string>} importPolicy
   * @prop {Array<string>} exportPolicy
   * @prop {MddoBgpTimerData} timer
   * @prop {Array<String>} flag
   */
  /**
   * @param {MddoBgpProcTermPointAttributeData|MddoBgpProcTermPointAttribute} data - bgp-proc term-point attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpProcTermPointAttribute'

    /** @type {number} */
    this.localAs = data.localAs || data['local-as'] || -1
    /** @type {string} */
    this.localIp = data.localIp || data['local-ip'] || ''
    /** @type {number} */
    this.remoteAs = data.remoteAs || data['remote-as'] || -1
    /** @type {string} */
    this.remoteIp = data.remoteIp || data['remote-ip'] || ''
    /** @type {string} */
    this.description = data.description || ''
    /** @type {number} */
    this.confederation = data.confederation || -1
    /** @type {Boolean} */
    this.routeReflectorClient = data.routeReflectorClient || data['route-reflector-client'] || false
    /** @type {string} */
    this.clusterId = data.clusterId || data['cluster-id'] || ''
    /** @type {string} */
    this.peerGroup = data.peerGroup || data['peer-group'] || ''
    /** @type {Array<string>} */
    this.importPolicy = data.importPolicy || data['import-policy'] || []
    /** @type {Array<string>} */
    this.exportPolicy = data.exportPolicy || data['export-policy'] || []
    /** @type {MddoBgpTimer} */
    this.timer = data.timer ? new MddoBgpTimer(data.timer) : new MddoBgpTimer() // default timer config
    /** @type {Array<string> */
    this.flag = data.flag || []
  }

  /**
   * Convert attribute to html string.
   * @see {TooltipCreator}
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('localAs', 'Local AS')}</li>
  <li>${this._toHtmlKeyValue('localIp', 'Local IP')}</li>
  <li>${this._toHtmlKeyValue('remoteAs', 'Remote AS')}</li>
  <li>${this._toHtmlKeyValue('remoteIp', 'Remote IP')}</li>
  <li>${this._toHtmlKeyValue('description', 'Description')}</li>
  <li>${this._toHtmlKeyValue('confederation', 'Confederation')}</li>
  <li>${this._toHtmlKeyValue('routeReflectorClient', 'RR Client?')}</li>
  <li>${this._toHtmlKeyValue('clusterId', 'Cluster ID')}</li>
  <li>${this._toHtmlKeyValue('peerGroup', 'Peer group')}</li>
  <li>${this._toHtmlKeyValue('importPolicy', 'Import policies')}</li>
  <li>${this._toHtmlKeyValue('exportPolicy', 'Export policies')}</li>
  <li>${this._toHtmlDefaultAttrKey('Timer')}
    ${this.timer.toHtml(this?.diffState.findAllDiffDataMatchesPath(/timer\.(.+)/))}
  </li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO bgp-as term-point.
 * @extends {MddoL1TermPointAttribute}
 */
export class MddoBgpAsTermPointAttribute extends MddoL1TermPointAttribute {
  constructor(data) {
    super(data)
    /** [type {string}] */
    this.class = 'MddoBgpAsTermPointAttribute'
  }
}
