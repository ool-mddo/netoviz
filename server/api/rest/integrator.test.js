import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import RESTIntegrator from './integrator'

const fixtureModelDir = fileURLToPath(new URL('../../../test/fixtures/model', import.meta.url)).replace(/\/$/, '')
const fixtureDistDir = path.dirname(fixtureModelDir)
const sampleJsonName = 'sample-network/sample-snapshot/topology.json'

describe('RESTIntegrator (read-only graph conversions)', () => {
  const api = new RESTIntegrator(fixtureDistDir)

  describe('toDependencyTopologyData', () => {
    // NOTE: markFamilyWithTarget mutates a `family` property directly onto the raw
    // ForceSimulationNode objects, and DependencyNetwork's node/tp filtering reads that
    // property correctly. But DependencyNode (server/graph/dependency/node.js) wraps each
    // raw node via `super(nodeData)` (ForceSimulationNode's constructor), which does not
    // copy `nodeData.family` onto `this` -- so `family` in the *serialized* toData() output
    // is always undefined, even though the found-target filtering itself works as intended.
    // These tests pin that filtering behavior; they do not assert on `.family` in the output.
    it('includes only the target and its family-connected nodes when the target is found', async () => {
      const result = await api.toDependencyTopologyData(sampleJsonName, { query: { target: 'node1' } })

      expect(result).toHaveLength(2)
      const [layer2, layer3] = result
      // layer3's node1 is the target itself (highest network id wins the by-name lookup)
      expect(layer3.nodes.map((n) => n.name)).toStrictEqual(['node1'])
      // layer2's node1 is a child of the target (via supporting-node reference)
      expect(layer2.nodes.map((n) => n.name)).toStrictEqual(['node1'])
    })

    it('resolves alertHost into target/layer, equivalent to passing them directly', async () => {
      const result = await api.toDependencyTopologyData(sampleJsonName, {
        query: { alertHost: 'layer3__node1' }
      })
      const [, layer3] = result
      expect(layer3.nodes.map((n) => n.name)).toStrictEqual(['node1'])
    })

    it('falls back to including every node when the target is not found', async () => {
      const result = await api.toDependencyTopologyData(sampleJsonName, { query: { target: 'no-such-node' } })
      const [layer2] = result
      expect(layer2.nodes.map((n) => n.name).sort()).toStrictEqual(['node1', 'node2'])
    })
  })

  describe('toNestedTopologyData', () => {
    it('returns nodes/inoperativeNodes/links/grid without a target or layout file', async () => {
      const result = await api.toNestedTopologyData(sampleJsonName, { query: {} })
      expect(Object.keys(result).sort()).toStrictEqual(['grid', 'inoperativeNodes', 'links', 'nodes'].sort())
      expect(Array.isArray(result.nodes)).toBe(true)
    })

    it('reads the layout.json next to the topology file when present', async () => {
      const result = await api.toNestedTopologyData(sampleJsonName, { query: {} })
      // fixture layout.json defines a 4x4 grid
      expect(result.grid).toStrictEqual({ x: [10, 20, 30, 40], y: [10, 20, 30, 40] })
    })
  })

  describe('toDistanceTopologyData', () => {
    it('returns layouts/supportLinks/links for a found target', async () => {
      const result = await api.toDistanceTopologyData(sampleJsonName, { query: { target: 'node1' } })
      expect(Object.keys(result).sort()).toStrictEqual(['layouts', 'links', 'supportLinks'].sort())
      expect(result.layouts.length).toBeGreaterThan(0)
    })

    it('returns an empty layout (no throw) when the target is not found', async () => {
      const result = await api.toDistanceTopologyData(sampleJsonName, { query: { target: 'no-such-node' } })
      expect(result.layouts).toStrictEqual([])
    })
  })

  describe('getGraphData dispatch', () => {
    it.each(['forceSimulation', 'dependency', 'nested', 'distance'])(
      'returns a JSON-serializable payload for graphName=%s',
      async (graphName) => {
        const json = await api.getGraphData(graphName, sampleJsonName, { query: { target: 'node1' } })
        expect(() => JSON.parse(json)).not.toThrow()
      }
    )
  })
})

describe('RESTIntegrator#postGraphData (write side-effect)', () => {
  let tmpDistDir

  beforeEach(() => {
    tmpDistDir = fs.mkdtempSync(path.join(os.tmpdir(), 'netoviz-test-'))
    fs.cpSync(fixtureModelDir, path.join(tmpDistDir, 'model'), { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tmpDistDir, { recursive: true, force: true })
  })

  // waits for the fire-and-forget fs.writeFile in postGraphData to land, instead of
  // assuming it has completed the instant postGraphData()'s own promise resolves.
  const waitForFile = async (filePath, predicate, { retries = 40, intervalMs = 25 } = {}) => {
    for (let i = 0; i < retries; i++) {
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          if (predicate(content)) return content
        } catch {
          // fs.writeFile is fire-and-forget in postGraphData, so the file may be
          // mid-write (empty/partial) when we read it; just retry.
        }
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
    throw new Error(`timed out waiting for ${filePath} to match`)
  }

  it('merges posted grid data into layout.json under the "standard" key by default', async () => {
    const api = new RESTIntegrator(tmpDistDir)
    const postedGrid = { x: [1, 2, 3], y: [4, 5, 6] }
    const req = {
      body: postedGrid,
      params: {
        graphName: 'nested',
        network: 'sample-network',
        snapshot: 'sample-snapshot',
        jsonName: 'topology.json'
      },
      query: {}
    }

    await api.postGraphData(req)

    const layoutPath = path.join(tmpDistDir, 'model', 'sample-network', 'sample-snapshot', 'layout.json')
    const saved = await waitForFile(layoutPath, (content) => {
      return JSON.stringify(content.standard.grid) === JSON.stringify(postedGrid)
    })
    expect(saved.standard.grid).toStrictEqual(postedGrid)
    // the "reverse" side must be untouched
    expect(saved.reverse.grid).toStrictEqual({ x: [10, 20, 30, 40], y: [10, 20, 30, 40] })
  })

  it('writes to the "reverse" key when reverse=true is passed', async () => {
    const api = new RESTIntegrator(tmpDistDir)
    const postedGrid = { x: [7, 8], y: [9, 10] }
    const req = {
      body: postedGrid,
      params: {
        graphName: 'nested',
        network: 'sample-network',
        snapshot: 'sample-snapshot',
        jsonName: 'topology.json'
      },
      query: { reverse: 'true' }
    }

    await api.postGraphData(req)

    const layoutPath = path.join(tmpDistDir, 'model', 'sample-network', 'sample-snapshot', 'layout.json')
    const saved = await waitForFile(layoutPath, (content) => {
      return JSON.stringify(content.reverse.grid) === JSON.stringify(postedGrid)
    })
    expect(saved.reverse.grid).toStrictEqual(postedGrid)
    expect(saved.standard.grid).toStrictEqual({ x: [10, 20, 30, 40], y: [10, 20, 30, 40] })
  })
})
