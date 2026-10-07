/**
 * Detect a stable change of a value (file signature) observed by polling.
 * A new value is reported as changed only when it is observed in two consecutive polls,
 * to avoid reacting to a file that is still being written.
 */
export class ChangeDetector {
  constructor() {
    this.reset()
  }

  /** Forget the baseline. The next observation becomes the new baseline. */
  reset() {
    this.initialized = false
    this.confirmed = null
    this.pending = null
  }

  /**
   * @param {*} observed - Current value.
   * @returns {boolean} true when a stable change from the baseline was detected.
   */
  observe(observed) {
    if (!this.initialized) {
      this.initialized = true
      this.confirmed = observed
      this.pending = observed
      return false
    }
    if (observed === this.confirmed) {
      this.pending = observed
      return false
    }
    if (observed === this.pending) {
      this.confirmed = observed
      return true
    }
    this.pending = observed
    return false
  }
}
