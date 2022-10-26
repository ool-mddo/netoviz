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
        return `<span class="attr-val added">${valueStr}</span>`
      case 'deleted':
        return `<span class="attr-val deleted">${valueStr}</span>`
      case 'changed':
        return `<span class="attr-val added">${valueStr}</span> <span class="attr-val deleted">~${ddElement.ddBefore}</span>`
      default:
        return `<span class="attr-val">${valueStr}</span>`
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
      this.diffState = this._dummyDiffState(
        diffElements[0].typeSymbol,
        diffElements
      )
    }
  }
}

export default RfcAttributeModelBase
