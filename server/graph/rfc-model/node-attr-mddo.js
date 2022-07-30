/**
 * @file Attribute class for MDDO layer1-3 node of topology model.
 */
import RfcModelBase from './base'
import RfcL3Prefix from './node-attr-rfc-l3prefix.js'
import MddoStaticRoute from './node-attr-mddo-static-route'
import MddoOspfRedistribute from './node-attr-mddo-ospf-redistribute'

/**
 * Attribute class for MDDO layer1 node.
 * @extends {RfcModelBase}
 */
export class MddoL1NodeAttribute extends RfcModelBase {
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
  toHtml() {
    return `
<ul>
  <li><span class="attr">OS Type:</span> ${this.osType}</li>
  <li><span class="attr">Flag:</span> ${this.flag}</li>
 </ul>
`
  }
}

/**
 * Attribute class for MDDO layer2 node.
 * @extends {RfcModelBase}
 */
export class MddoL2NodeAttribute extends RfcModelBase {
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
  toHtml() {
    return `
<ul>
  <li><span class="attr">Name:</span> ${this.name}</li>
  <li><span class="attr">VLAN ID:</span> ${this.vlanId}</li>
  <li><span class="attr">Flag:</span> ${this.flag}</li>
</ul>`
  }
}

/**
 * Attribute class MDDO for layer3 node.
 * @extends {RfcModelBase}
 */
export class MddoL3NodeAttribute extends RfcModelBase {
  /**
   * @typedef {Object} MddoL3NodeAttributeData
   * @prop {string} nodeType
   * @prop {Array<string>} flag
   * @prop {Array<RfcL3Prefix>} prefix
   * @prop {Array<MddoStaticRoute>} static_routes
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
    /** @type {Array<MddoStaticroute>} */
    const sr = data.static_routes || data['static-route'] || []
    this.static_routes = sr.map((d) => new MddoStaticRoute(d))
  }

  /**
   * Convert attribute to html string.
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    const prefixList = this.prefix.map((d) => {
      return `<li>${d.toHtml()}</li>`
    })
    const staticRoutes = this.static_routes.map((d) => {
      return `<li>${d.toHtml()}</li>`
    })

    return `
<ul>
  <li><span class="attr">Node type: </span> ${this.nodeType}</li>
  <li><span class="attr">Flag:</span> ${this.flag}</li>
  <li><span class="attr">Prefix:</span>
    <ul>${prefixList.join('')}</ul>
  </li>
  <li><span class="attr">Static Route:</span>
    <ul>${staticRoutes.join('')}</ul>
  </li>
</ul>
`
  }
}

/**
 * Attribute class MDDO for ospf-area node (ospf-proc).
 * @extends {RfcModelBase}
 */
export class MddoOspfAreaNodeAttribute extends RfcModelBase {
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
  toHtml() {
    const redistributeList = this.redistribute.map((d) => {
      return ['<li>', d.toHtml(), '</li>'].join('')
    })

    return `
<ul>
  <li><span class="attr">Node type: </span> ${this.nodeType}</li>
  <li><span class="attr">Router ID: </span> ${this.routerId} (${
      this.routerIdSource
    })</li>
  <li><span class="attr">Log adjacency change: </span> ${
    this.logAdjacencyChange
  }</li>
  <li><span class="attr">Redistribute: </span>
    <ul>${redistributeList.join('')}</ul>
  </li>
</ul>
`
  }
}
