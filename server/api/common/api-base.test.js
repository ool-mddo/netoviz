import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import APIBase from './api-base'

const fixtureDistDir = fileURLToPath(new URL('../../../test/fixtures', import.meta.url)).replace(/\/$/, '')
const sampleJsonName = 'sample-network/sample-snapshot/topology.json'

describe('APIBase', () => {
  describe('getModels', () => {
    it('reads and parses _index.json under <distDir>/model', async () => {
      const api = new APIBase(fixtureDistDir)
      const models = await api.getModels()
      expect(models).toStrictEqual([
        { network: 'sample-network', snapshot: 'sample-snapshot', file: 'topology.json', label: 'Sample topology' }
      ])
    })

    it('returns null when _index.json is missing', async () => {
      const api = new APIBase(`${fixtureDistDir}/does-not-exist`)
      expect(await api.getModels()).toBeNull()
    })
  })

  describe('readLayoutJSON', () => {
    it('reads layout.json from the same directory as the topology json', async () => {
      const api = new APIBase(fixtureDistDir)
      const layout = await api.readLayoutJSON(sampleJsonName)
      expect(layout.standard.grid).toStrictEqual({ x: [10, 20, 30, 40], y: [10, 20, 30, 40] })
    })

    it('returns null when layout.json does not exist (layout is optional)', async () => {
      const api = new APIBase(fixtureDistDir)
      const layout = await api.readLayoutJSON('sample-network/no-layout-snapshot/topology.json')
      expect(layout).toBeNull()
    })
  })

  describe('toForceSimulationTopologyData', () => {
    it('converts the RFC8345 topology file into force-simulation graph data', async () => {
      const api = new APIBase(fixtureDistDir)
      const data = await api.toForceSimulationTopologyData(sampleJsonName)
      expect(data).toHaveLength(2)
      expect(data.map((nw) => nw.name)).toStrictEqual(['layer2', 'layer3'])
    })

    it('throws when the topology file does not exist', async () => {
      const api = new APIBase(fixtureDistDir)
      await expect(api.toForceSimulationTopologyData('no/such/file.json')).rejects.toThrow()
    })
  })

  describe('getGraphData', () => {
    it('dispatches "forceSimulation" to toForceSimulationTopologyData and returns a JSON string', async () => {
      const api = new APIBase(fixtureDistDir)
      const json = await api.getGraphData('forceSimulation', sampleJsonName, { query: {} })
      expect(JSON.parse(json)).toHaveLength(2)
    })

    it('returns an error payload for an unknown graph name', async () => {
      const api = new APIBase(fixtureDistDir)
      const json = await api.getGraphData('unknownGraph', sampleJsonName, { query: {} })
      expect(JSON.parse(json)).toStrictEqual({ error: 'invalid graph name', graphName: 'unknownGraph' })
    })

    it('returns an error payload (rather than throwing) when the topology file is missing', async () => {
      const api = new APIBase(fixtureDistDir)
      const json = await api.getGraphData('forceSimulation', 'no/such/file.json', { query: {} })
      expect(JSON.parse(json)).toStrictEqual({ error: 'invalid data file', jsonName: 'no/such/file.json' })
    })
  })
})
