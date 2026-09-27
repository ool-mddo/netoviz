import { describe, expect, it } from 'vitest'
import markNeighborWithTarget from './neighbor-maker'

const makeNode = (path, name, id) => ({
  type: 'node',
  path,
  name,
  id,
  layerPath: () => 'layer1'
})

const makeLink = (path, sourceNodePath, targetNodePath) => ({
  path,
  sourceNodePath,
  targetNodePath,
  isTypeTpTp: () => true,
  isInLayer: (layer) => layer === 'layer1',
  isConnectingNode: (nodePath) => nodePath === sourceNodePath || nodePath === targetNodePath
})

describe('markNeighborWithTarget', () => {
  it('marks reachable nodes with increasing degree by following link direction', () => {
    const x = makeNode('X', 'X', 1)
    const y = makeNode('Y', 'Y', 2)
    const z = makeNode('Z', 'Z', 3)
    const links = [makeLink('l1', 'X', 'Y'), makeLink('l2', 'Y', 'Z')]

    const found = markNeighborWithTarget([x, y, z], links, 'X')

    expect(found).toBe(true)
    expect(x.neighbor.degree).toBe(0)
    expect(y.neighbor.degree).toBe(1)
    expect(z.neighbor.degree).toBe(2)
  })

  it('only follows links where the current node is the source (directional traversal)', () => {
    // a single link points from Q to P; marking neighbors of P must not reach Q,
    // since traversal only looks at links whose sourceNodePath is the current node.
    const p = makeNode('P', 'P', 1)
    const q = makeNode('Q', 'Q', 2)
    const links = [makeLink('l1', 'Q', 'P')]

    const found = markNeighborWithTarget([p, q], links, 'P')

    expect(found).toBe(true)
    expect(p.neighbor.degree).toBe(0)
    expect(q.neighbor).toBeUndefined()
  })

  it('returns false when the target is not found', () => {
    const x = makeNode('X', 'X', 1)
    const found = markNeighborWithTarget([x], [], 'unknown')

    expect(found).toBe(false)
    expect(x.neighbor).toBeUndefined()
  })
})
