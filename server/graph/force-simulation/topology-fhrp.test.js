import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import toForceSimulationTopologyData from './index'

const fixturePath = fileURLToPath(new URL('../../../test/fixtures/rfc8345/mddo-l3-fhrp.json', import.meta.url))
const fhrpFixture = JSON.parse(readFileSync(fixturePath, 'utf8'))

describe('toForceSimulationTopologyData with fhrp', () => {
  const [layer3] = toForceSimulationTopologyData(fhrpFixture)
  const findTp = (path) => layer3.nodes.find((n) => n.type === 'tp' && n.path === path)

  it('keeps fhrp in the attribute of the layer3 term-point (the tooltip re-constructs the attribute from it)', () => {
    const tp = findTp('layer3__cr1__ge-0/0/2.0')
    expect(tp.attribute.class).toBe('MddoL3TermPointAttribute')
    expect(tp.attribute.fhrp).toHaveLength(1)
    expect(tp.attribute.fhrp[0]).toMatchObject({ protocol: 'vrrp', groupId: 1, priority: 150 })
  })

  it('keeps both of vrrp and hsrp of a term-point', () => {
    const tp = findTp('layer3__cr1__ge-0/0/3.0')
    expect(tp.attribute.fhrp.map((f) => f.protocol)).toStrictEqual(['vrrp', 'hsrp'])
  })

  it('has empty fhrp in the term-point without fhrp', () => {
    expect(findTp('layer3__cr1__ge-0/0/0.0').attribute.fhrp).toStrictEqual([])
  })
})
