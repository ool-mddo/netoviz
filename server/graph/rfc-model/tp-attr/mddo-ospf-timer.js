/**
 * @file Attribute class for ospf-area timer config
 */

import RfcModelBase from '../base'

/**
 * ospf timer config class
 * @extends {RfcModelBase}
 */
class MddoOspfTimer extends RfcModelBase {
  /**
   * @typedef {Object} MddoOspfTimerData
   * @prop {number} helloInterval
   * @prop {number} deadInterval
   * @prop {number} retransmissionInterval
   */
  /**
   * @param {MddoOspfTimerData|MddoOspfTimer} data - ospf timer config data for ospf-area term-point
   */
  constructor(data) {
    super(data)
    /** @type {number} */
    this.helloInterval = data['hello-interval'] || data.helloInterval || 10
    /** @type {number} */
    this.deadInterval = data['dead-interval'] || data.deadInterval || 40
    /** @type {number} */
    this.retransmissionInterval =
      data['retransmission-interval'] || data.retransmissionInterval || 5
  }

  /**
   * Convert attribute to html string
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml() {
    return `
<ul>
  <li><span class="attr">Hello interval: </span> ${this.helloInterval}</li>
  <li><span class="attr">Dead interval: </span> ${this.deadInterval}</li>
  <li><span class="attr">Retransmission interval: </span> ${this.retransmissionInterval}</li>
</ul>
`
  }
}

export default MddoOspfTimer
