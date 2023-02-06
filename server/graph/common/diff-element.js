/**
 * @file Definition of diff-element.
 */

/**
 * Diff data of diff state
 */
class DiffElement {
  /**
   * @typedef {Object} DiffElementData
   * @prop {string} typeSign
   * @prop {string} typeSymbol
   * @prop {string} path - jsonpath
   * @prop {Array<string|number>} ddAll
   * @prop {null|string|number} ddBefore
   * @prop {null|string|number} ddAfter
   */
  /**
   * @param {Array|DiffElementData} data - [(+|-|~), jsonpath, diff-element[, diff-element]] or its object
   */
  constructor(data) {
    const isArray = data instanceof Array
    /** @type {string} */
    this.typeSign = isArray ? data[0] : data.typeSign
    /** @type {string} */
    this.typeSymbol = isArray ? this._diffTypeTable() : data.typeSymbol
    /** @type {string} */
    this.path = isArray ? data[1] : data.path
    /** @type {Array<string|number>} */
    this.ddAll = isArray ? data.slice(2) : data.ddAll
    /** @type {string|number} */
    this.ddBefore = this._selectBefore(isArray, data)
    /** @type {string|number} */
    this.ddAfter = this._selectAfter(isArray, data)
  }

  _selectBefore(isArray, data) {
    if (!isArray) {
      return data.ddBefore
    }
    switch (this.typeSymbol) {
      case 'deleted':
      case 'changed':
        return this.ddAll[0]
      case 'added':
      default:
        return null
    }
  }

  _selectAfter(isArray, data) {
    if (!isArray) {
      return data.ddAfter
    }
    switch (this.typeSymbol) {
      case 'added':
        return this.ddAll[0]
      case 'changed':
        return this.ddAll[1]
      case 'deleted':
      default:
        return null
    }
  }

  /**
   * change to redundant expression
   * @returns {string}
   * @private
   */
  _diffTypeTable() {
    switch (this.typeSign) {
      case '+':
        return 'added'
      case '-':
        return 'deleted'
      case '~':
        return 'changed'
      default:
        return 'kept'
    }
  }
}

export default DiffElement
