import { describe, expect, it } from 'vitest'
import markFamilyWithTarget from './family-maker'

const makeNode = (path, name, id, { parents = [], children = [] } = {}) => ({
  type: 'node',
  path,
  name,
  id,
  parents,
  children
})

describe('markFamilyWithTarget', () => {
  it('marks the target, its parent chain, and its child chain by degree', () => {
    const nodeA = makeNode('A', 'A', 1000, { children: ['B'] })
    const nodeB = makeNode('B', 'B', 2000, { parents: ['A'], children: ['C'] })
    const nodeC = makeNode('C', 'C', 3000, { parents: ['B'] })
    const nodes = [nodeA, nodeB, nodeC]

    const found = markFamilyWithTarget(nodes, 'B')

    expect(found).toBe(true)
    expect(nodeA.family.relation).toBe('parents')
    expect(nodeA.family.degree).toBe(1)
    expect(nodeB.family.relation).toBe('target')
    expect(nodeB.family.degree).toBe(0)
    expect(nodeC.family.relation).toBe('children')
    expect(nodeC.family.degree).toBe(1)
  })

  it('finds the target by layer-qualified path when targetNodeLayer is given', () => {
    const nodeB1 = makeNode('layer1__B', 'B', 1000)
    const nodeB2 = makeNode('layer2__B', 'B', 2000)
    const nodes = [nodeB1, nodeB2]

    const found = markFamilyWithTarget(nodes, 'B', 'layer2')

    expect(found).toBe(true)
    expect(nodeB2.family.relation).toBe('target')
    expect(nodeB1.family).toBeUndefined()
  })

  it('returns false and marks nothing when the target is not found', () => {
    const nodeA = makeNode('A', 'A', 1000)
    const found = markFamilyWithTarget([nodeA], 'unknown')

    expect(found).toBe(false)
    expect(nodeA.family).toBeUndefined()
  })
})
