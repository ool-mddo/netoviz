/**
 * @file Shared helpers to build `/model/...` URLs from model-file entries
 *   (`static/model/_index.json` rows, `{ network, snapshot, file, label }`).
 */

/**
 * Encode a snapshot name for use as a single URL path segment.
 * NOTICE: only the first `/` is replaced (matches existing server/client behavior).
 * @param {string} snapshot - Snapshot name (may contain `/` for nested snapshots).
 * @returns {string} URL-safe snapshot segment.
 */
export const snapshotUrlEncode = (snapshot) => snapshot.replace('/', '__')

/**
 * Decode a URL path segment back into a snapshot name.
 * @param {string} snapshotSegment - URL path segment (`__`-encoded).
 * @returns {string} Original snapshot name.
 */
export const snapshotUrlDecode = (snapshotSegment) => snapshotSegment.replace('__', '/')

/**
 * Build visualizer-link items for a model-file entry.
 * @param {{network: string, snapshot: string, file: string}} modelFile - Model-file entry.
 * @param {Array<{text: string, value: string}>} visualizers - Visualizer definitions.
 * @returns {Object<string, {text: string, value: string, link: string}>} Keyed by visualizer value.
 */
export const visualizerLinksForModelFile = (modelFile, visualizers) => {
  const filePath = [modelFile.network, snapshotUrlEncode(modelFile.snapshot), modelFile.file].join('/')
  const links = {}
  for (const visualizer of visualizers) {
    links[visualizer.value] = {
      text: visualizer.text,
      value: visualizer.value,
      link: `/model/${filePath}?visualizer=${visualizer.value}`
    }
  }
  return links
}
