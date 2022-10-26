/**
 * @file Definition of base class of all topology model components.
 */
import DiffState from '../common/diff-state'
import BaseContainer from '../common/base'

/**
 * Base class of all topology model components.
 * (Used for common operation to get `diff`.)
 * @extends {BaseContainer}
 */
class RfcModelBase extends BaseContainer {
  /**
   * @param {Object} data - RFC topology data.
   */
  constructor(data) {
    super()
    this._constructDiffState(data)
  }

  /**
   * Construct diff-state.
   * @param {Object} data - RFC topology data.
   * @private
   */
  _constructDiffState(data) {
    const dsKey1 = '_diff_state_'
    const dsKey2 = 'diffState'
    if (data && (dsKey1 in data || dsKey2 in data)) {
      /** @type {DiffState} */
      this.diffState = new DiffState(data[dsKey1] || data[dsKey2])
    } else {
      /** @type {DiffState} */
      this.diffState = new DiffState({}) // empty diff state
    }
  }
}

export default RfcModelBase
