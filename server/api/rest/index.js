/**
 * @file API definition of netoviz HTTP server.
 */

import express from 'express'
import RESTIntegrator from './integrator'

/**
 * Routing API class of Express server.
 * ({@link http://expressjs.com/en/guide/routing.html})
 * @typedef {Object} Router
 * @prop {function} use
 * @prop {function} post
 * @prop {function} get
 */
/** @type {Router} */
const apiRouter = express.Router()

/**
 * API class instance of topology graph.
 * It converts RFC8345 data (from json) for topology data.
 * Other graph read it and convert for each graph.
 * @type{RESTIntegrator}
 */
const restApi = new RESTIntegrator('static')
apiRouter.use(express.json())

// API to send all model-file data.
apiRouter.get('/models', async (req, res) => {
  console.log('[REST] GET models')
  res.type('json')
  res.send(await restApi.getModels())
})

// API to receive graph-layout data. (in nested graph)
apiRouter.post('/graph/:network/:snapshot/:jsonName', (req, res) => {
  console.log('[REST] POST graph layout')
  restApi.postGraphData(req)
  res.send(JSON.stringify({ message: 'layout data received.' }))
})

// API to send converted graph data. (for web frontend)
apiRouter.get(
  '/graph/:graphName/:network/:snapshot/:jsonName',
  async (req, res) => {
    res.type('json')
    const p = req.params // alias
    const ssUrlDec = p.snapshot.replace('__', '/') // decode multiple depth snapshot string
    const jsonFile = `${p.network}/${ssUrlDec}/${p.jsonName}`
    console.log(`[REST] graph=${p.graphName}, file=${jsonFile}`)
    res.send(await restApi.getGraphData(p.graphName, jsonFile, req))
})

export default apiRouter
