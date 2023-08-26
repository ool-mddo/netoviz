/**
 * @file Attribute class for bgp timer config
 */

import RfcAttributeModelBase from '../attr-base'

/**
 * bgp timer config class
 * @extends {RfcAttributeModelBase}
 */
class MddoBgpTimer extends RfcAttributeModelBase {
  /**
   * @typedef {object} MddoBgpTimerData
   * @prop {number} connectRetry
   * @prop {number} holdTime
   * @prop {number} keepaliveInterval
   * @prop {number} minimumAdvertisementInterval
   * @prop {number} restartTime
   */
  /**
   * @param {MddoBgpTimerData|MddoBgpTimer} [optData] - bgp timer config data for bgp term-point (optional)
   */
  constructor(optData) {
    const data = !optData ? {} : optData
    super(data)
    /** @type {number} */
    this.connectRetry = data.connectRetry || data['connect-retry'] || 30
    /** @type {number} */
    this.holdTime = data.holdTime || data['hold-time'] || 90
    /** @type {number} */
    this.keepaliveInterval = data.keepaliveInterval || data['keepalive-interval'] || 30
    /** @type {number} */
    this.minimumAdvertisementInterval =
      data.minimumAdvertisementInterval || data['minimum-advertisement-interval'] || 30
    /** @type {number} */
    this.restartTime = data.restartTime || data['restart-time'] || -1
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
  <li>${this._toHtmlKeyValue('connectRetry', 'Connect retry')}</li>
  <li>${this._toHtmlKeyValue('holdTime', 'Hold time')}</li>
  <li>${this._toHtmlKeyValue('keepaliveInterval', 'Keep-alive interval')}</li>
  <li>${this._toHtmlKeyValue('minimumAdvertisementInterval', 'Minimum advertisement interval')}</li>
  <li>${this._toHtmlKeyValue('restartTime', 'Restart time')}</li>
</ul>
`
  }
}

export default MddoBgpTimer
