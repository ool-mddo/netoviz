/**
 * @file Definition of diff-state.
 */

import DiffElement from './diff-element'

/**
 * Diff state of network diagram components.
 */
class DiffState {
  /**
   * @typedef {Object} DiffStateData
   * @prop {string} forward - Forward diff status.
   * @prop {string} backward - Backward diff status.
   * @prop {string} pair - Path of diff-counterpart.
   * @prop {Array} diff_Data - array of diff-element. (optional)
   */
  /**
   * @param {DiffStateData|{}} data - Data of diff state.
   */
  constructor(data) {
    /** @type {string} */
    this.forward = data.forward || 'kept'
    /** @type {string} */
    this.backward = data.backward || 'kept'
    /** @type {string|Object | {}} */
    this.pair = data.pair || {}

    const ddList = data.diffData || data.diff_data || []
    /** @type {Array<DiffElement> | []} */
    this.diffData = ddList.map((d) => new DiffElement(d))
  }

  /**
   * Detect diff state.
   * @returns {string} Diff state.
   * @public
   */
  detect() {
    if (this.forward === 'added' || this.forward === 'deleted') {
      return this.forward
    } else if (this.forward === 'changed' || this.backward === 'changed') {
      return 'changed'
    }
    return 'kept'
  }

  /**
   * Convert camelCase string to snake_case string
   * @param {string} str
   * @returns {string}
   * @private
   */
  _camelToKebabCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  }

  /**
   * Find diff-element by path
   * @param {string} path
   * @returns {DiffElement | undefined} undefined if not found or diffData is null
   * @public
   */
  findDiffDataByPath(path) {
    const kebabCasePath = this._camelToKebabCase(path)
    return this?.diffData.find((d) => d.path === kebabCasePath)
  }

  /**
   * Find all diff-elements which matches regexp
   * @param {RegExp} regexp
   * @return {Array<string> | undefined}
   */
  findAllDiffDataMatchesPath(regexp) {
    return this?.diffData.filter((d) => {
      const matches = d.path.match(regexp)
      if (!matches) {
        return false
      }
      if (matches?.length > 0) {
        d.path = matches[1]
      }
      return true
    })
  }

  _isPairOfAddedAndDeleted(diffElements) {
    return (
      diffElements
        .map((d) => d.typeSymbol)
        .sort()
        .toString() === 'added,deleted'
    )
  }

  /**
   * diff-data for Array<Object> diff
   * @param {string} path
   * @param {number} index
   * @return {Array<DiffElement> | undefined}
   */
  diffDataForObjectArray(path, index) {
    const kebabCasePath = this._camelToKebabCase(path)
    const regexp = new RegExp(`${kebabCasePath}\\[${index}]`)
    const diffElements = this?.diffData.filter((d) => d.path.match(regexp))

    // if found single object: added or deleted
    if (diffElements.length === 1) {
      return Object.keys(diffElements[0].ddAll[0]).map((path) => {
        return new DiffElement([diffElements[0].typeSign, path, diffElements[0].ddAll[0][path]])
      })
    }
    // found two object: added and deleted pair
    if (diffElements.length === 2 && this._isPairOfAddedAndDeleted(diffElements)) {
      const before = diffElements.find((d) => d.typeSymbol === 'deleted')
      const after = diffElements.find((d) => d.typeSymbol === 'added')
      return Object.keys(before.ddBefore)
        .filter((path) => before.ddBefore[path] !== after.ddAfter[path])
        .map((path) => {
          return new DiffElement(['~', path, before.ddBefore[path], after.ddAfter[path]])
        })
    }
    // not found or unknown pattern: ignore it
    return undefined
  }

  /**
   * Convert each key-value of an object into diff-element (used for added/deleted whole object)
   * @param {DiffElement} diffElement - diff-element of the whole object
   * @param {Object} obj - added/deleted object
   * @return {Array<DiffElement>}
   * @private
   */
  _objectKeysToDiffElements(diffElement, obj) {
    return Object.keys(obj).map((key) => new DiffElement([diffElement.typeSign, key, obj[key]]))
  }

  /**
   * Find diff-elements of an element of object-array attribute (e.g. `fhrp[0].priority`).
   * This does not modify the diff-data of this state.
   * @param {string} path - Array attribute path (e.g. 'fhrp')
   * @param {number} index - Index of the element
   * @return {Array<DiffElement>} Diff-elements. Their path is the attribute key in the element
   *     (kebab-case, e.g. 'priority'). Empty array if the element has no diff.
   * @public
   */
  diffDataForArrayElement(path, index) {
    const kebabCasePath = this._camelToKebabCase(path)
    const childRegexp = new RegExp(`^${kebabCasePath}\\[${index}]\\.([^.\\[]+)(?:\\[\\d+])?$`)
    const elementPath = `${kebabCasePath}[${index}]`
    const found = new Map() // key => diff-element (an attribute key has one diff-element)

    this.diffData.forEach((d) => {
      const matches = d.path.match(childRegexp)
      let elements = []
      if (matches) {
        // changed value of the element (`path[index].key`, `path[index].key[n]` (value in the array))
        elements = [new DiffElement({ ...d, path: matches[1] })]
      } else if (d.path === elementPath && d.ddAll[0] && typeof d.ddAll[0] === 'object') {
        // added/deleted whole element (`path[index]`)
        elements = this._objectKeysToDiffElements(d, d.ddAll[0])
      } else if (d.path === kebabCasePath && Array.isArray(d.ddAll[0]) && d.ddAll[0][index]) {
        // added/deleted whole array (`path`)
        elements = this._objectKeysToDiffElements(d, d.ddAll[0][index])
      }
      elements.filter((e) => !found.has(e.path)).forEach((e) => found.set(e.path, e))
    })
    return [...found.values()]
  }
}

export default DiffState
