/**
 * @file Client-side (Vue app) copy of server/api/common/alert-util.js.
 * Nuxt4 forbids importing anything under server/api/ from client code
 * (`vite:import-analysis` guard), so this pure helper is duplicated here
 * rather than shared, to avoid depending on a new top-level directory
 * that isn't part of this repo's existing bind-mount set.
 */

/**
 * Split alertHost for alert-host highlight.
 * @param {string} alertHost - Alert host to highlight.
 * @returns {AlertRow}
 * @protected
 */
export const splitAlertHost = (alertHost) => {
  const paths = String(alertHost).split('__')
  switch (paths.length) {
    case 2: // layer__host
      return { layer: paths[0], host: paths[1], tp: '' }
    case 3: // layer__host__tp
      return { layer: paths[0], host: paths[1], tp: paths[2] }
    default:
      return { layer: '', host: alertHost || '', tp: '' }
  }
}
