/**
 * @file Attribute class for ospf-area timer config
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * ospf timer config class
 * @extends {RfcAttributeModelBase}
 */
class MddoOspfTimer extends RfcAttributeModelBase {
  /**
   * @typedef {Object} MddoOspfTimerData
   * @prop {number} helloInterval
   * @prop {number} deadInterval
   * @prop {number} retransmissionInterval
   */
  /**
   * @param {MddoOspfTimerData|MddoOspfTimer} [optData] - ospf timer config data for ospf-area term-point (optional)
   */
  constructor(optData) {
    const data = !optData ? {} : optData
    super(data)
    /** @type {number} */
    this.helloInterval = data['hello-interval'] || data.helloInterval || 10
    /** @type {number} */
    this.deadInterval = data['dead-interval'] || data.deadInterval || 40
    /** @type {number} */
    this.retransmissionInterval = data['retransmission-interval'] || data.retransmissionInterval || 5
  }

  /**
   * Convert attribute to html string
   * @param {Array<DiffElement>} diffElements
   * @returns {string} HTML string of attribute.
   * @public
   */
  toHtml(diffElements) {
    super.toHtml(diffElements)
    return `
<ul>
  <li>${this._toHtmlKeyValue('helloInterval', 'Hello interval')}</li>
  <li>${this._toHtmlKeyValue('deadInterval', 'Dead Interval')}</li>
  <li>${this._toHtmlKeyValue('retransmissionInterval', 'Retransmission Interval')}</li>
</ul>
`
  }
}

export default MddoOspfTimer
