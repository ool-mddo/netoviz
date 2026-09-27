import { describe, expect, it } from 'vitest'
import DiffState from './diff-state'

describe('DiffState', () => {
  describe('constructor defaults', () => {
    it('defaults forward/backward to kept and pair to {} when omitted', () => {
      const ds = new DiffState({})
      expect(ds.forward).toBe('kept')
      expect(ds.backward).toBe('kept')
      expect(ds.pair).toStrictEqual({})
      expect(ds.diffData).toStrictEqual([])
    })

    it('accepts diffData under either diffData or diff_data key', () => {
      const rows = [['+', 'foo', 'v']]
      expect(new DiffState({ diffData: rows }).diffData).toHaveLength(1)
      expect(new DiffState({ diff_data: rows }).diffData).toHaveLength(1)
    })
  })

  describe('detect', () => {
    it('returns "added" when forward is added', () => {
      expect(new DiffState({ forward: 'added' }).detect()).toBe('added')
    })

    it('returns "deleted" when forward is deleted', () => {
      expect(new DiffState({ forward: 'deleted' }).detect()).toBe('deleted')
    })

    it('returns "changed" when forward is changed', () => {
      expect(new DiffState({ forward: 'changed' }).detect()).toBe('changed')
    })

    it('returns "changed" when only backward is changed', () => {
      expect(new DiffState({ forward: 'kept', backward: 'changed' }).detect()).toBe('changed')
    })

    it('returns "kept" when neither forward nor backward indicate a diff', () => {
      expect(new DiffState({ forward: 'kept', backward: 'kept' }).detect()).toBe('kept')
    })
  })

  describe('_camelToKebabCase', () => {
    const ds = new DiffState({})

    it('converts a camelCase word boundary to a hyphen', () => {
      expect(ds._camelToKebabCase('someProp')).toBe('some-prop')
    })

    it('leaves an already-kebab-case string unchanged', () => {
      expect(ds._camelToKebabCase('some-prop')).toBe('some-prop')
    })

    it('prefixes a leading hyphen when the string starts with an uppercase letter', () => {
      // every uppercase letter is replaced, including a leading one,
      // so a PascalCase input produces a leading hyphen.
      expect(ds._camelToKebabCase('SomeProp')).toBe('-some-prop')
    })
  })

  describe('findDiffDataByPath', () => {
    const ds = new DiffState({
      diffData: [
        ['+', 'router-id', '10.0.0.1'],
        ['-', 'as-number', '65001']
      ]
    })

    it('finds a diff-element by its camelCase path converted to kebab-case', () => {
      const found = ds.findDiffDataByPath('routerId')
      expect(found).toBeDefined()
      expect(found.path).toBe('router-id')
      expect(found.ddAfter).toBe('10.0.0.1')
    })

    it('returns undefined when no diff-element matches the path', () => {
      expect(ds.findDiffDataByPath('unknownProp')).toBeUndefined()
    })
  })

  describe('findAllDiffDataMatchesPath', () => {
    it('returns matching diff-elements and rewrites path to the first capture group', () => {
      const ds = new DiffState({
        diffData: [
          ['+', 'interface[0]/address', '10.0.0.1'],
          ['+', 'interface[1]/address', '10.0.0.2'],
          ['-', 'as-number', '65001']
        ]
      })
      const found = ds.findAllDiffDataMatchesPath(/^interface\[\d+]\/(.+)$/)
      expect(found).toHaveLength(2)
      expect(found.map((d) => d.path)).toStrictEqual(['address', 'address'])
    })

    it('returns an empty array when nothing matches', () => {
      const ds = new DiffState({ diffData: [['+', 'as-number', '65001']] })
      expect(ds.findAllDiffDataMatchesPath(/^interface/)).toStrictEqual([])
    })
  })

  describe('diffDataForObjectArray', () => {
    it('expands a single added object into one diff-element per key', () => {
      const ds = new DiffState({
        diffData: [['+', 'some-prop[0]', { a: 1, b: 2 }]]
      })
      const result = ds.diffDataForObjectArray('someProp', 0)
      expect(result).toHaveLength(2)
      expect(result.map((d) => [d.path, d.typeSymbol, d.ddAfter])).toStrictEqual([
        ['a', 'added', 1],
        ['b', 'added', 2]
      ])
    })

    it('diffs an added/deleted pair at the same index into per-key changes', () => {
      const ds = new DiffState({
        diffData: [
          ['-', 'some-prop[1]', { a: 1, b: 2 }],
          ['+', 'some-prop[1]', { a: 1, b: 99 }]
        ]
      })
      const result = ds.diffDataForObjectArray('someProp', 1)
      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('b')
      expect(result[0].typeSymbol).toBe('changed')
      expect(result[0].ddBefore).toBe(2)
      expect(result[0].ddAfter).toBe(99)
    })

    it('returns undefined when no diff-element matches the index', () => {
      const ds = new DiffState({ diffData: [['+', 'some-prop[0]', { a: 1 }]] })
      expect(ds.diffDataForObjectArray('someProp', 5)).toBeUndefined()
    })
  })
})
