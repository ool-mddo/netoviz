import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import RfcTopology from './topology'
import { RfcL2Network } from './model/rfc-l2'
import { RfcL3Network } from './model/rfc-l3'

const fixturePath = fileURLToPath(new URL('../../../test/fixtures/rfc8345/mixed-layers.json', import.meta.url))
const mixedLayersFixture = JSON.parse(readFileSync(fixturePath, 'utf8'))

describe('RfcTopology', () => {
  it('dispatches each network to its layer-specific subclass by network-types', () => {
    const topology = new RfcTopology(mixedLayersFixture)

    expect(topology.networks).toHaveLength(2)
    expect(topology.networks[0]).toBeInstanceOf(RfcL2Network)
    expect(topology.networks[1]).toBeInstanceOf(RfcL3Network)
  })

  it('assigns network/node/term-point IDs using the "LL NNN TTT" numbering scheme', () => {
    const topology = new RfcTopology(mixedLayersFixture)

    const [layer2, layer3] = topology.networks
    // network id = nwNum * 1_000_000 (1st network -> 1_000_000, 2nd -> 2_000_000)
    expect(layer2.id).toBe(1000000)
    expect(layer3.id).toBe(2000000)

    // node id = nwId + nodeNum * 1000
    const [node1, node2] = layer2.nodes
    expect(node1.id).toBe(1000000 + 1 * 1000)
    expect(node2.id).toBe(1000000 + 2 * 1000)

    // term-point id = nodeId + tpNum
    expect(node1.termPoints[0].id).toBe(node1.id + 1)
    expect(node2.termPoints[0].id).toBe(node2.id + 1)

    // ids stay unique and correctly offset across networks
    const [l3node1] = layer3.nodes
    expect(l3node1.id).toBe(2000000 + 1 * 1000)
  })

  it('resolves node names and paths from the RFC8345 node-id/network-id fields', () => {
    const topology = new RfcTopology(mixedLayersFixture)
    const [layer2] = topology.networks

    expect(layer2.name).toBe('layer2')
    expect(layer2.nodes[0].name).toBe('node1')
    expect(layer2.nodes[0].path).toBe('layer2__node1')
    expect(layer2.nodes[0].termPoints[0].path).toBe('layer2__node1__eth0')
  })
})
