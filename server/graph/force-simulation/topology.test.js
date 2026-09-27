import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import toForceSimulationTopologyData from './index'

const fixturePath = fileURLToPath(new URL('../../../test/fixtures/rfc8345/mixed-layers.json', import.meta.url))
const mixedLayersFixture = JSON.parse(readFileSync(fixturePath, 'utf8'))

describe('toForceSimulationTopologyData', () => {
  it('produces one network entry per RFC8345 network, with flattened node/tp graph-nodes', () => {
    const result = toForceSimulationTopologyData(mixedLayersFixture)

    expect(result).toHaveLength(2)
    const [layer2, layer3] = result
    expect(layer2.name).toBe('layer2')
    expect(layer3.name).toBe('layer3')

    // each network has 2 node-type and 2 tp-type graph-nodes (one tp per node)
    expect(layer2.nodes.filter((n) => n.type === 'node')).toHaveLength(2)
    expect(layer2.nodes.filter((n) => n.type === 'tp')).toHaveLength(2)
  })

  it('resolves supporting-node/supporting-termination-point references into parent links', () => {
    const result = toForceSimulationTopologyData(mixedLayersFixture)
    const [, layer3] = result

    // layer3 node1 has a supporting-node in layer2, so layer2's node1 gets it as a parent
    const layer2Node1 = result[0].nodes.find((n) => n.path === 'layer2__node1' && n.type === 'node')
    expect(layer2Node1.parents).toContain('layer3__node1')

    const layer3Node1 = layer3.nodes.find((n) => n.path === 'layer3__node1' && n.type === 'node')
    expect(layer3Node1.children).toContain('layer2__node1')
  })

  it('resolves link source/target ids by matching term-point paths', () => {
    const result = toForceSimulationTopologyData(mixedLayersFixture)
    const [layer2] = result

    const tpTpLink = layer2.links.find((l) => l.type === 'tp-tp')
    const sourceTp = layer2.nodes.find((n) => n.path === tpTpLink.sourcePath)
    const targetTp = layer2.nodes.find((n) => n.path === tpTpLink.targetPath)

    expect(tpTpLink.sourceId).toBe(sourceTp.id)
    expect(tpTpLink.targetId).toBe(targetTp.id)
  })
})
