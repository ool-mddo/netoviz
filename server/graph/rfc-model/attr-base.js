/**
 * @file Definition of attribute base class of all topology model components.
 */
import DiffState from '../common/diff-state'
import RfcModelBase from './base'

/**
 * Attribute base class
 * @extends {RfcModelBase}
 */
class RfcAttributeModelBase extends RfcModelBase {
  _toHtmlDefaultAttrKey(attrKeyDisplay) {
    return `<span class="attr-key">${attrKeyDisplay}</span>`
  }

  /**
   * Convert a attribute key to html string.
   * @param {string} _attrKey
   * @param {DiffElement|null} ddElement
   * @returns {string}
   * @private
   */
  _attrKeyClassString(_attrKey, ddElement) {
    if (!ddElement) {
      return 'attr-key'
    }
    return ['attr-key', ddElement.typeSymbol].join(' ')
  }

  /**
   * <span> tagged string
   * @param {Array<string>} classList
   * @param {string} value
   * @return {string}
   * @private
   */
  _htmlSpan(classList, value) {
    return `<span class="${classList.join(' ')}">${value}</span>`
  }

  /**
   * @param {string} valueStr - attribute value
   * @param {DiffElement|null} ddElement
   * @returns {string}
   * @private
   */
  _toHtmlAttrValueByDiffType(valueStr, ddElement) {
    if (!ddElement) {
      return `<span class="val">${valueStr}</span>`
    }
    switch (ddElement.typeSymbol) {
      case 'added':
        return this._htmlSpan(['attr-val', 'added'], valueStr)
      case 'deleted':
        return this._htmlSpan(['attr-val', 'deleted'], valueStr)
      case 'changed':
        return [
          this._htmlSpan(['attr-val', 'added'], valueStr),
          this._htmlSpan(['attr-val', 'deleted'], ddElement.ddBefore)
        ].join(' ')
      default:
        return this._htmlSpan(['attr-val'], valueStr)
    }
  }

  /**
   * Convert a string value to html string.
   * @param {string} attrKey
   * @param {DiffElement|null} ddElement
   * @returns {string}
   * @private
   */
  _toHtmlAttrValue(attrKey, ddElement) {
    if (!ddElement) {
      return this[attrKey]
    }
    return this._toHtmlAttrValueByDiffType(this[attrKey], ddElement)
  }

  /**
   * Convert a attribute key-value pair to html string.
   * @param {string} attrKey - Key of attribute
   * @param {string} attrKeyDisplay - String to display name of the key
   * @returns {string}
   * @private
   */
  _toHtmlKeyValue(attrKey, attrKeyDisplay) {
    const ddElement = this?.diffState.findDiffDataByPath(attrKey)
    const keyClassStr = this._attrKeyClassString(attrKey, ddElement)
    const keyValueStr = this._toHtmlAttrValue(attrKey, ddElement)
    return `<span class="${keyClassStr}">${attrKeyDisplay}:</span> ${keyValueStr}`
  }

  /**
   * Convert value = large object data (array/hash)
   * @param valueObj
   * @returns {string}
   * @private
   */
  _toHtmlLargeValue(valueObj) {
    if (Array.isArray(valueObj)) {
      const valueStrings = valueObj.map((obj) => `<li>${this._toHtmlLargeValue(obj)}</li>`).join('')
      return `<ul>${valueStrings}</ul>`
    } else {
      const jsonStr = JSON.stringify(valueObj)
      // set attribute-key class
      const jsonStrK = jsonStr.replace(/"([^"]+)":/g, `<span class="attr-key">$1</span>:`)
      // set attribute-value class
      return jsonStrK.replace(/:"([^"]*)"/g, `:<span class="val">$1</span>`)
    }
  }

  /**
   * Convert a attribute key-value pair to html string. (value = large object data (array/hash))
   * @param {string} attrKey - Key of attribute
   * @param {string} attrKeyDisplay - String to display name of the key
   * @return {string}
   * @private
   */
  _toHtmlLargeKeyValue(attrKey, attrKeyDisplay) {
    const ddElement = this?.diffState.findDiffDataByPath(attrKey)
    const keyClassStr = this._attrKeyClassString(attrKey, ddElement)
    const valueStr = this._toHtmlLargeValue((this[attrKey]))
    return `<span class="${keyClassStr}">${attrKeyDisplay}:</span> ${valueStr}`
  }

  /**
   * Make dummy diff-state
   * @param {string} state
   * @param {Array<DiffElement>} diffElements
   * @return {DiffState}
   * @private
   */
  _dummyDiffState(state, diffElements) {
    return new DiffState({
      forward: state,
      diff_data: diffElements
    })
  }

  /**
   * Convert attribute to html string (base operation)
   * @param {Array<DiffElement>} [diffElements] - List of diff-element (optional)
   */
  toHtml(diffElements) {
    // set dummy diff-state if diff-elements exists
    if (diffElements && diffElements?.length > 0) {
      this.diffState = this._dummyDiffState(diffElements[0].typeSymbol, diffElements)
    }
  }
}

export default RfcAttributeModelBase
