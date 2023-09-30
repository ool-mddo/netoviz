/**
 * @file Attribute class for MDDO layer1-3 node of topology model.
 */
import RfcAttributeModelBase from '../attr-base'
import RfcL3Prefix from '../node-attr/rfc-l3prefix.js'
import MddoStaticRoute from '../node-attr/mddo-static-route'
import MddoOspfRedistribute from '../node-attr/mddo-ospf-redistribute'

/**
 * Attribute class for MDDO layer1 node.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL1NodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL1NodeAttributeData
   * @prop {string} osType
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL1NodeAttributeData|MddoL1NodeAttribute} data - L1 node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL1NodeAttribute'

    /** @type {string} */
    this.osType = data.osType || data['os-type'] || ''
    /** @type {Array<string>} */
    this.flag = data.flag || [] // list
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('osType', 'OS Type')}</li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO layer2 node.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL2NodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL2NodeAttributeData
   * @prop {string} name
   * @prop {string} vlanId
   * @prop {Array<string>} flag
   */
  /**
   * @param {MddoL2NodeAttributeData|MddoL2NodeAttribute} data - L2 node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL2NodeAttribute'

    /** @type {string} */
    this.name = data.name || ''
    /** @type {string} */
    this.vlanId = data.vlanId || data['vlan-id'] || 0
    /** @type {Array<string>} */
    this.flag = data.flag || [] // list
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('name', 'Name')}</li>
  <li>${this._toHtmlKeyValue('vlanId', 'VLAN ID')}</li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
</ul>`
  }
}

/**
 * Attribute class for MDDO layer3 node.
 * @extends {RfcAttributeModelBase}
 */
export class MddoL3NodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoL3NodeAttributeData
   * @prop {string} nodeType
   * @prop {Array<string>} flag
   * @prop {Array<RfcL3Prefix>} prefix
   * @prop {Array<MddoStaticRoute>} staticRoute
   */
  /**
   * @param {MddoL3NodeAttributeData|MddoL3NodeAttribute} data - L3 node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoL3NodeAttribute'

    /** @type {string} */
    this.nodeType = data.nodeType || data['node-type'] || ''
    /** @type {Array<string>} */
    this.flag = data.flag || []
    /** @type {Array<RfcL3Prefix>} */
    this.prefix = [] // array
    if (data.prefix) {
      this.prefix = data.prefix.map((d) => new RfcL3Prefix(d))
    }
    /** @type {Array<MddoStaticRoute>} */
    const sr = data.staticRoute || data['static-route'] || []
    this.staticRoute = sr.map((d) => new MddoStaticRoute(d))
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const prefixList = this.prefix.map((d, index) => {
      return `<li>${d.toHtml(this?.diffState.diffDataForObjectArray('prefix', index))}</li>`
    })
    const staticRouteList = this.staticRoute.map((d, index) => {
      return `<li>${d.toHtml(this?.diffState.diffDataForObjectArray('staticRoute', index))}</li>`
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('nodeType', 'Node Type')}</li>
  <li>${this._toHtmlKeyValue('flag', 'Flag')}</li>
  <li>${this._toHtmlDefaultAttrKey('Prefix')}
    <ul>${prefixList.join('')}</ul>
  </li>
  <li>${this._toHtmlDefaultAttrKey('Static Route')}
    <ul>${staticRouteList.join('')}</ul>
  </li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO ospf-area node (ospf-proc).
 * @extends {RfcAttributeModelBase}
 */
export class MddoOspfAreaNodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfAreaNodeAttributeData
   * @prop {string} nodeType
   * @prop {string} routerId
   * @prop {string} routerIdSource
   * @prop {Boolean} logAdjacencyChange
   * @prop {Array<MddoOspRedistributeData>} redistribute
   */
  /**
   * @param {MddoOspfAreaNodeAttributeData|MddoOspfAreaNodeAttribute} data - ospf-area node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoOspfAreaNodeAttribute'

    /** @type {string} */
    this.nodeType = data.nodeType || data['node-type'] || ''
    /** @type {string} */
    this.routerId = data.routerId || data['router-id'] || ''
    /** @type {string} } */
    this.processId = data.processId || data['process-id'] || 'default'
    /** @type {string} */
    this.routerIdSource = data.routerIdSource || data['router-id-source'] || ''
    /** @type {Boolean} */
    this.logAdjacencyChange = data.logAdjacencyChange || data['log-adjacency-change'] || false
    /** @type {Array<MddoOspfRedistribute>} */
    this.redistribute = data.redistribute.map((d) => new MddoOspfRedistribute(d))
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const redistributeList = this.redistribute.map((d, index) => {
      return `<li>${d.toHtml(this?.diffState.diffDataForObjectArray('redistribute', index))}</li>`
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('nodeType', 'Node Type')}</li>
  <li>${this._toHtmlKeyValue('routerId', 'Router ID')}</li>
  <li>${this._toHtmlKeyValue('processId', 'Process ID')}</li>
  <li>${this._toHtmlKeyValue('logAdjacencyChange', 'Log Adjacency Change')}</li>
  <li>${this._toHtmlDefaultAttrKey('Redistribute')}
    <ul>${redistributeList.join('')}</ul>
  </li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO bgp-proc node
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpProcNodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpProcNodeAttributeData
   * @prop {string} routerId
   * @prop {number} confederationId
   * @prop {Array<number>} confederationMember
   * @prop {Boolean} routeReflector
   * @prop {Array<string>} peerGroup // TODO: attr implementation
   * @prop {Array} policy // TODO: attr implementation
   * @prop {Array} prefixSet // TODO: attr implementation
   * @prop {Array} asPathSet // TODO: attr implementation
   * @prop {Array} communitySet // TODO: attr implementation
   * @prop {Array} redistribute // TODO: attr implementation
   */
  /**
   * @param {MddoBgpProcNodeAttributeData|MddoBgpProcNodeAttribute} data - bgp-proc node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpProcNodeAttribute'

    /** @type {string} */
    this.routerId = data.routerId || data['router-id'] || ''
    /** @type {number} */
    this.confederationId = data.confederationId || data['confederation-id'] || -1
    /** @type {Array<number>} */
    this.confederationMember = data.confederationMember || data['confederation-member'] || []
    /** @type {Boolean} */
    this.routeReflector = data.routeReflector || data['route-reflector'] || false
    /** @type {Array<string>} */
    this.peerGroup = data.peerGroup || data['peer-group'] || [] // TODO: attr implementation
    /** @type {Array} */
    this.policy = data.policy || [] // TODO: attr implementation
    /** @type {Array} */
    this.prefixSet = data.prefixSet || data['prefix-set'] || [] // TODO: attr implementation
    /** @type {Array} */
    this.asPathSet = data.asPathSet || data['as-path-set'] || [] // TODO: attr implementation
    /** @type {Array} */
    this.communitySet = data.communitySet || data['community-set'] || [] // TODO: attr implementation
    /** @type {Array} */
    this.redistribute = data.redistribute || [] // TODO: attr implementation
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('routerId', 'Router ID')}</li>
  <li>${this._toHtmlKeyValue('confederationId', 'Confederation ID')}</li>
  <li>${this._toHtmlKeyValue('confederationMember', 'Confederation Members')}</li>
  <li>${this._toHtmlKeyValue('routeReflector', 'Route reflector?')}</li>
  <li>${this._toHtmlKeyValue('peerGroup', 'Peer group')}</li>
  <li>${this._toHtmlLargeKeyValue('policy', 'Policies')}</li>
  <li>${this._toHtmlLargeKeyValue('prefixSet', 'Prefix Sets')}</li>
  <li>${this._toHtmlLargeKeyValue('asPathSet', 'AS-Path Sets')}</li>
  <li>${this._toHtmlLargeKeyValue('communitySet', 'Community Sets')}</li>
  <li>${this._toHtmlKeyValue('redistribute', 'Redistribute')}</li>
</ul>
`
  }
}

/**
 * Attribute class for MDDO bgp-as node
 * @extends {RfcAttributeModelBase}
 */
export class MddoBgpAsNodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoBgpAsNodeAttributeData
   * @prop {number} asNumber
   */
  /**
   * @param {MddoBgpAsNodeAttributeData|MddoBgpAsNodeAttribute} data - bgp-as node attribute data.
   */
  constructor(data) {
    super(data)
    /** @type {string} */
    this.class = 'MddoBgpAsNodeAttribute'

    /** @type{number} */
    this.asNumber = data.asNumber || data['as-number'] || -1
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    return `
<ul>
  <li>${this._toHtmlKeyValue('asNumber', 'AS Number')}</li>
</ul>
`
  }
}
