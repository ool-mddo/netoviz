/**
 * @file Mounts the existing Express Router (server/api/rest) into Nitro.
 * The Router itself stays untouched; only the HTTP host changes from
 * a standalone Express app (Nuxt2) to Nitro (Nuxt4).
 *
 * h3 v2's router.use(path, handler) matches `path` exactly (it is not an
 * Express-style prefix mount), so `/api/**` is required to catch nested
 * routes. A thin Express app re-adds the `/api` prefix stripping that
 * apiRouter's own routes (defined as `/models`, `/graph/...`) rely on.
 */

import express from 'express'
import { fromNodeMiddleware } from 'h3'
import apiRouter from '../api/rest/index.js'

const app = express()
app.use('/api', apiRouter)

export default defineNitroPlugin((nitroApp) => {
  nitroApp.router.use('/api/**', fromNodeMiddleware(app))
})
