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
  <li>${this._toHtmlKeyValue('osType', 'OS Type')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
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
  <li>${this._toHtmlKeyValue('name', 'Name')}
  <li>${this._toHtmlKeyValue('vlanId', 'VLAN ID')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
</ul>`
  }
}

/**
 * Attribute class MDDO for layer3 node.
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
  toHtml(_diffElement) {
    const prefixList = this.prefix.map((d, index) => {
      return `
<li>${d.toHtml(this?.diffState.diffDataForObjectArray('prefix', index))}</li>
`
    })
    const staticRouteList = this.staticRoute.map((d, index) => {
      return `
<li>${d.toHtml(
        this?.diffState.diffDataForObjectArray('staticRoute', index)
      )}</li>
`
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('nodeType', 'Node Type')}
  <li>${this._toHtmlKeyValue('flag', 'Flag')}
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
 * Attribute class MDDO for ospf-area node (ospf-proc).
 * @extends {RfcAttributeModelBase}
 */
export class MddoOspfAreaNodeAttribute extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfAreaNodeAttributeData
   * @prop {string} nodeType
   * @prop {string} routerId
   * @prop {string} routerIdSource
   * @prop {boolean} logAdjacencyChange
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
    /** @type {string} */
    this.routerIdSource = data.routerIdSource || data['router-id-source'] || ''
    /** @type {boolean} */
    this.logAdjacencyChange =
      data.logAdjacencyChange || data['log-adjacency-change'] || false
    /** @type {Array<MddoOspfRedistribute>} */
    this.redistribute = data.redistribute.map(
      (d) => new MddoOspfRedistribute(d)
    )
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(_diffElements) {
    const redistributeList = this.redistribute.map((d, index) => {
      return `<li>${d.toHtml(
        this?.diffState.diffDataForObjectArray('redistribute', index)
      )}</li>`
    })

    return `
<ul>
  <li>${this._toHtmlKeyValue('nodeType', 'Node Type')}
  <li>${this._toHtmlKeyValue('routerId', 'Router ID')}</li>
  <li>${this._toHtmlKeyValue('logAdjacencyChange', 'Log adjacency change')}</li>
  <li>${this._toHtmlDefaultAttrKey('Redictribute')}
    <ul>${redistributeList.join('')}</ul>
  </li>
</ul>
`
  }
}
