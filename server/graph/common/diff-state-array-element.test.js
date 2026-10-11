import { describe, expect, it } from 'vitest'
import DiffState from './diff-state'

// diff-data of netomox (Hashdiff) for an attribute that has an array of objects (e.g. `fhrp`)
const diffStateOf = (diffData) => new DiffState({ forward: 'changed', diff_data: diffData })
const element = { protocol: 'vrrp', 'group-id': 1, priority: 150 }

describe('DiffState#diffDataForArrayElement', () => {
  it('returns [] if there is no diff', () => {
    expect(new DiffState({}).diffDataForArrayElement('fhrp', 0)).toStrictEqual([])
    expect(diffStateOf([['~', 'description', 'a', 'b']]).diffDataForArrayElement('fhrp', 0)).toStrictEqual([])
  })

  it('finds changed value in the element (path: `array[index].key`)', () => {
    const result = diffStateOf([['~', 'fhrp[0].priority', 150, 100]]).diffDataForArrayElement('fhrp', 0)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ typeSymbol: 'changed', path: 'priority', ddBefore: 150, ddAfter: 100 })
  })

  it('finds added/deleted value in the element', () => {
    const result = diffStateOf([
      ['+', 'fhrp[0].source-address', '192.168.0.1/24'],
      ['-', 'fhrp[0].protocol', 'hsrp']
    ]).diffDataForArrayElement('fhrp', 0)
    expect(result.map((d) => [d.typeSymbol, d.path])).toStrictEqual([
      ['added', 'source-address'],
      ['deleted', 'protocol']
    ])
  })

  it('treats a change in the value array (`array[index].key[n]`) as a change of the key', () => {
    const result = diffStateOf([
      ['~', 'fhrp[0].virtual-address[0]', '192.168.0.1', '192.168.0.254']
    ]).diffDataForArrayElement('fhrp', 0)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ typeSymbol: 'changed', path: 'virtual-address' })
  })

  it('keeps one diff-element for each key', () => {
    const result = diffStateOf([
      ['-', 'fhrp[0].virtual-address[0]', '192.168.0.1'],
      ['+', 'fhrp[0].virtual-address[0]', '192.168.0.254']
    ]).diffDataForArrayElement('fhrp', 0)
    expect(result.map((d) => d.path)).toStrictEqual(['virtual-address'])
  })

  it('expands added/deleted whole element (path: `array[index]`) to its keys', () => {
    const added = diffStateOf([['+', 'fhrp[1]', element]]).diffDataForArrayElement('fhrp', 1)
    expect(added.map((d) => [d.typeSymbol, d.path, d.ddAfter])).toStrictEqual([
      ['added', 'protocol', 'vrrp'],
      ['added', 'group-id', 1],
      ['added', 'priority', 150]
    ])
    const deleted = diffStateOf([['-', 'fhrp[1]', element]]).diffDataForArrayElement('fhrp', 1)
    expect(deleted.every((d) => d.typeSymbol === 'deleted')).toBe(true)
    expect(deleted.map((d) => d.ddBefore)).toStrictEqual(['vrrp', 1, 150])
  })

  it('expands added/deleted whole array (path: `array`) to the keys of the element', () => {
    const second = { protocol: 'hsrp', 'group-id': 10, priority: 110 }
    const ds = diffStateOf([['+', 'fhrp', [element, second]]])
    expect(ds.diffDataForArrayElement('fhrp', 0).map((d) => [d.typeSymbol, d.path, d.ddAfter])).toStrictEqual([
      ['added', 'protocol', 'vrrp'],
      ['added', 'group-id', 1],
      ['added', 'priority', 150]
    ])
    expect(ds.diffDataForArrayElement('fhrp', 1).map((d) => d.ddAfter)).toStrictEqual(['hsrp', 10, 110])
    expect(ds.diffDataForArrayElement('fhrp', 2)).toStrictEqual([])
    const deleted = diffStateOf([['-', 'fhrp', [element]]]).diffDataForArrayElement('fhrp', 0)
    expect(deleted.every((d) => d.typeSymbol === 'deleted')).toBe(true)
  })

  it('does not mix up diff of the other indexes (fhrp[1] does not match fhrp[10], `fhrp[0]`)', () => {
    const ds = diffStateOf([
      ['~', 'fhrp[0].priority', 150, 100],
      ['~', 'fhrp[10].priority', 1, 2]
    ])
    expect(ds.diffDataForArrayElement('fhrp', 1)).toStrictEqual([])
    expect(ds.diffDataForArrayElement('fhrp', 10).map((d) => d.ddAfter)).toStrictEqual([2])
    expect(ds.diffDataForArrayElement('fhrp', 0).map((d) => d.ddAfter)).toStrictEqual([100])
  })

  it('does not modify the diff-data of the state', () => {
    const ds = diffStateOf([['~', 'fhrp[0].priority', 150, 100]])
    ds.diffDataForArrayElement('fhrp', 0)
    ds.diffDataForArrayElement('fhrp', 0)
    expect(ds.diffData[0].path).toBe('fhrp[0].priority')
  })

  it('accepts camelCase array attribute name', () => {
    const ds = diffStateOf([['~', 'virtual-address-list[0].priority', 1, 2]])
    expect(ds.diffDataForArrayElement('virtualAddressList', 0)).toHaveLength(1)
  })
})
