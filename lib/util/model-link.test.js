import { describe, expect, it } from 'vitest'
import { snapshotUrlEncode, snapshotUrlDecode, visualizerLinksForModelFile } from './model-link'

describe('snapshotUrlEncode / snapshotUrlDecode', () => {
  it('round-trips a snapshot name with a single "/"', () => {
    const encoded = snapshotUrlEncode('base/sub')
    expect(encoded).toBe('base__sub')
    expect(snapshotUrlDecode(encoded)).toBe('base/sub')
  })

  it('leaves a snapshot name without "/" unchanged', () => {
    expect(snapshotUrlEncode('snapshot1')).toBe('snapshot1')
    expect(snapshotUrlDecode('snapshot1')).toBe('snapshot1')
  })

  it('only replaces the first "/" for a snapshot name with multiple slashes (does not round-trip)', () => {
    // documents the current (asymmetric) behavior rather than an ideal one:
    // encode only touches the first '/', so a name with 2+ slashes does not
    // round-trip back to the original string.
    const encoded = snapshotUrlEncode('a/b/c')
    expect(encoded).toBe('a__b/c')
    expect(snapshotUrlDecode(encoded)).toBe('a/b/c')
  })

  it('only replaces the first "__" when decoding a segment with multiple "__"', () => {
    const decoded = snapshotUrlDecode('a__b__c')
    expect(decoded).toBe('a/b__c')
  })
})

describe('visualizerLinksForModelFile', () => {
  const visualizers = [
    { text: 'Force Simulation', value: 'forceSimulation' },
    { text: 'Dependency', value: 'dependency' }
  ]

  it('builds one link entry per visualizer, keyed by visualizer value', () => {
    const modelFile = { network: 'nw1', snapshot: 'ss1', file: 'topology.json' }
    const links = visualizerLinksForModelFile(modelFile, visualizers)

    expect(Object.keys(links)).toStrictEqual(['forceSimulation', 'dependency'])
    expect(links.forceSimulation).toStrictEqual({
      text: 'Force Simulation',
      value: 'forceSimulation',
      link: '/model/nw1/ss1/topology.json?visualizer=forceSimulation'
    })
  })

  it('URL-encodes the snapshot segment of the file path', () => {
    const modelFile = { network: 'nw1', snapshot: 'base/sub', file: 'topology.json' }
    const links = visualizerLinksForModelFile(modelFile, visualizers)

    expect(links.dependency.link).toBe('/model/nw1/base__sub/topology.json?visualizer=dependency')
  })
})
