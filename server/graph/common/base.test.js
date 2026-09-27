import { describe, expect, it } from 'vitest'
import BaseContainer from './base'

describe('BaseContainer', () => {
  const base = new BaseContainer()

  describe('sortUniq', () => {
    it('removes duplicates and sorts', () => {
      expect(base.sortUniq([3, 1, 2, 1, 3])).toStrictEqual([1, 2, 3])
    })

    it('sorts strings lexicographically', () => {
      expect(base.sortUniq(['b', 'a', 'c', 'a'])).toStrictEqual(['a', 'b', 'c'])
    })

    it('returns an empty array for an empty input', () => {
      expect(base.sortUniq([])).toStrictEqual([])
    })
  })

  describe('flatten', () => {
    it('flattens one level of nested arrays', () => {
      expect(base.flatten([[1, 2], [3], [], [4, 5]])).toStrictEqual([1, 2, 3, 4, 5])
    })

    it('returns an empty array for an empty input', () => {
      expect(base.flatten([])).toStrictEqual([])
    })

    it('does not flatten nested arrays deeper than one level', () => {
      expect(base.flatten([[1, [2, 3]], [4]])).toStrictEqual([1, [2, 3], 4])
    })
  })
})
