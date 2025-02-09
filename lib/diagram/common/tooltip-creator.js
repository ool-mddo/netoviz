/**
 * @file Definition of tooltip controller.
 */
/**
 * All types of node data in network diagrams.
 * @typedef {
 *   ForceSimulationNodeData
 *   |DependencyElementData
 *   |Dependency2NodeData
 *   |NestedNodeData
 * } AllNodeData
 */

import {
  OpsNetworkAttribute,
  OpsLinkAttribute,
  OpsNodeAttribute,
  OpsTermPointAttribute
} from '../../../server/graph/rfc-model/model/ops-attr'
import RfcL2LinkAttribute from '../../../server/graph/rfc-model/link-attr/rfc-l2'
import RfcL3LinkAttribute from '../../../server/graph/rfc-model/link-attr/rfc-l3'
import RfcL2NetworkAttribute from '../../../server/graph/rfc-model/network-attr/rfc-l2'
import RfcL3NetworkAttribute from '../../../server/graph/rfc-model/network-attr/rfc-l3'
import RfcL2NodeAttribute from '../../../server/graph/rfc-model/node-attr/rfc-l2'
import RfcL3NodeAttribute from '../../../server/graph/rfc-model/node-attr/rfc-l3'
import RfcL2TermPointAttribute from '../../../server/graph/rfc-model/tp-attr/rfc-l2'
import RfcL3TermPointAttribute from '../../../server/graph/rfc-model/tp-attr/rfc-l3'
import AggregatedNodeAttribute from '../../../server/graph/rfc-model/node-attr/aggr'
import {
  MddoL1NetworkAttribute,
  MddoL2NetworkAttribute,
  MddoL3NetworkAttribute,
  MddoOspfAreaNetworkAttribute,
  MddoBgpProcNetworkAttribute,
  MddoBgpAsNetworkAttribute
} from '../../../server/graph/rfc-model/network-attr/mddo'
import {
  MddoL1NodeAttribute,
  MddoL2NodeAttribute,
  MddoL3NodeAttribute,
  MddoOspfAreaNodeAttribute,
  MddoBgpProcNodeAttribute,
  MddoBgpAsNodeAttribute
} from '../../../server/graph/rfc-model/node-attr/mddo'
import {
  MddoL1LinkAttribute,
  MddoL2LinkAttribute,
  MddoL3LinkAttribute,
  MddoOspfAreaLinkAttribute,
  MddoBgpProcLinkAttribute,
  MddoBgpAsLinkAttribute
} from '../../../server/graph/rfc-model/link-attr/mddo'
import {
  MddoL1TermPointAttribute,
  MddoL2TermPointAttribute,
  MddoL3TermPointAttribute,
  MddoOspfAreaTermPointAttribute,
  MddoBgpProcTermPointAttribute,
  MddoBgpAsTermPointAttribute
} from '../../../server/graph/rfc-model/tp-attr/mddo'

/**
 * Attribute class string to class dictionary.
 * @type {Object}
 */
const AttributeClassOf = {
  RfcL2LinkAttribute,
  RfcL3LinkAttribute,
  RfcL2NetworkAttribute,
  RfcL3NetworkAttribute,
  RfcL2NodeAttribute,
  RfcL3NodeAttribute,
  RfcL2TermPointAttribute,
  RfcL3TermPointAttribute,
  AggregatedNodeAttribute,
  OpsNetworkAttribute,
  OpsLinkAttribute,
  OpsNodeAttribute,
  OpsTermPointAttribute,
  MddoL1NetworkAttribute,
  MddoL2NetworkAttribute,
  MddoL3NetworkAttribute,
  MddoOspfAreaNetworkAttribute,
  MddoBgpProcNetworkAttribute,
  MddoBgpAsNetworkAttribute,
  MddoL1NodeAttribute,
  MddoL2NodeAttribute,
  MddoL3NodeAttribute,
  MddoOspfAreaNodeAttribute,
  MddoBgpProcNodeAttribute,
  MddoBgpAsNodeAttribute,
  MddoL1LinkAttribute,
  MddoL2LinkAttribute,
  MddoL3LinkAttribute,
  MddoOspfAreaLinkAttribute,
  MddoBgpProcLinkAttribute,
  MddoBgpAsLinkAttribute,
  MddoL1TermPointAttribute,
  MddoL2TermPointAttribute,
  MddoL3TermPointAttribute,
  MddoOspfAreaTermPointAttribute,
  MddoBgpProcTermPointAttribute,
  MddoBgpAsTermPointAttribute
}

/**
 * Tooltip creator.
 */
class TooltipCreator {
  /**
   * @param {Selection} origin - HTML selection to put tooltip container.
   */
  constructor(origin) {
    this._makeTooltip(origin)
    /**
     * Timeout ID (>0)
     * @type {number}
     */
    this.disableTooltipTimeout = -1
  }

  /**
   * Make tooltip.
   * @param {Selection} origin - HTML selection to put tooltip container.
   * @private
   */
  _makeTooltip(origin) {
    this.tooltip = origin // d3-selection to insert tooltip
      .append('div')
      .classed('tooltip', true)
      .classed('pop-down', true)
  }

  /**
   * Check the node is aggregated-node.
   * @param {AllNodeData} node - Node to check.
   * @returns {boolean} True if aggregated-node.
   * @private
   */
  _isAggregated(node) {
    return node?.attribute?.class === 'AggregatedNodeAttribute'
  }

  /**
   * Clear tooltip timeout.
   * @private
   */
  _clearTimeout() {
    this.disableTooltipTimeout >= 0 && clearTimeout(this.disableTooltipTimeout)
  }

  /**
   * Tooltip for aggregated-node.
   * @param {AllNodeData} node - Aggregated-node.
   * @param {tooltipCreator-enableTooltipCallback} tooltipAnchorClickCallback - Callback
   *     to make anchors in tooltip.
   * @private
   */
  _enableTooltipForAggregatedNode(node, tooltipAnchorClickCallback) {
    const mouseEnter = () => {
      this._clearTimeout()
    }
    const mouseLeave = () => {
      this._disableTooltipBody()
    }
    const tooltipAnchorClick = (event, element) => {
      /** @type {AggregatedNodePath} */
      const anchorNode = {
        name: element.getAttribute('data-name'),
        path: element.getAttribute('data-path')
      }
      /**
       * @callback tooltipCreator-enableTooltipCallback
       * @param {AggregatedNodePath} node - Clicked node name/path in tooltip anchor.
       */
      tooltipAnchorClickCallback(event, anchorNode)
    }
    this.tooltip.classed('aggregated', true).on('mouseenter', mouseEnter).on('mouseleave', mouseLeave)
    this.tooltip.selectAll('a').on('click', function (event) {
      tooltipAnchorClick(event, this)
    })
  }

  /**
   * Enable (visible) tooltip.
   * @param {Event} event - Event info (old d3.event)
   * @param {AllNodeData} node - Node to enable tooltip.
   * @param {tooltipCreator-enableTooltipCallback} [tooltipAnchorClickCallback] - Callback
   *     for aggregated-node tooltip. It is used for aggregated-node tooltip.
   *     (click drill-down callback)
   * @public
   */
  enableTooltip(event, node, tooltipAnchorClickCallback) {
    // disable timer
    this._clearTimeout()
    this._disableTooltipBody()
    // tooltip header
    let tooltipBody = node.path
    // tooltip body
    if (node && Object.keys(node.attribute).length > 0) {
      const AttrClass = AttributeClassOf[node.attribute.class]
      const attr = new AttrClass(node.attribute)
      tooltipBody = tooltipBody + attr.toHtml()
    }
    // tooltip position
    this.tooltip
      .style('top', `${event.pageY - 70}px`)
      .style('left', `${event.pageX + 10}px`)
      .classed('pop-up', true)
      .classed('pop-down', false)
      .html(tooltipBody)

    // for aggregated node
    if (this._isAggregated(node)) {
      this._enableTooltipForAggregatedNode(node, tooltipAnchorClickCallback)
    }
  }

  /**
   * Disable (invisible) tooltip.
   * @private
   */
  _disableTooltipBody() {
    this.tooltip.classed('pop-up', false).classed('pop-down', true).classed('aggregated', false)
  }

  /**
   * Disable (invisible) tooltip. (with timer to disable tooltip)
   * @param {AllNodeData} [node] - Node to enable tooltip.
   *     Specify `node` (aggregated node) to set delay to disable tooltip.
   */
  disableTooltip(node) {
    if (this._isAggregated(node)) {
      const timeoutCallback = () => this._disableTooltipBody()
      this.disableTooltipTimeout = setTimeout(timeoutCallback, 1500)
    } else {
      this._disableTooltipBody()
    }
  }
}

export default TooltipCreator
