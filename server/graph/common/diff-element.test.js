import { describe, expect, it } from 'vitest'
import DiffElement from './diff-element'

describe('DiffElement', () => {
  describe('constructed from an array (added)', () => {
    const de = new DiffElement(['+', 'foo/bar', 'newValue'])

    it('sets typeSign/typeSymbol/path', () => {
      expect(de.typeSign).toBe('+')
      expect(de.typeSymbol).toBe('added')
      expect(de.path).toBe('foo/bar')
    })

    it('has no ddBefore and ddAfter is the added value', () => {
      expect(de.ddBefore).toBeNull()
      expect(de.ddAfter).toBe('newValue')
    })
  })

  describe('constructed from an array (deleted)', () => {
    const de = new DiffElement(['-', 'foo/bar', 'oldValue'])

    it('sets typeSymbol to deleted', () => {
      expect(de.typeSymbol).toBe('deleted')
    })

    it('has ddBefore as the deleted value and no ddAfter', () => {
      expect(de.ddBefore).toBe('oldValue')
      expect(de.ddAfter).toBeNull()
    })
  })

  describe('constructed from an array (changed)', () => {
    const de = new DiffElement(['~', 'foo/bar', 'oldValue', 'newValue'])

    it('sets typeSymbol to changed', () => {
      expect(de.typeSymbol).toBe('changed')
    })

    it('has both ddBefore and ddAfter', () => {
      expect(de.ddBefore).toBe('oldValue')
      expect(de.ddAfter).toBe('newValue')
    })
  })

  describe('constructed from an array with an unknown sign', () => {
    const de = new DiffElement(['?', 'foo/bar', 'value'])

    it('falls back to kept, with no before/after', () => {
      expect(de.typeSymbol).toBe('kept')
      expect(de.ddBefore).toBeNull()
      expect(de.ddAfter).toBeNull()
    })
  })

  describe('constructed from a plain object', () => {
    const data = {
      typeSign: '~',
      typeSymbol: 'changed',
      path: 'foo/bar',
      ddAll: ['oldValue', 'newValue'],
      ddBefore: 'oldValue',
      ddAfter: 'newValue'
    }
    const de = new DiffElement(data)

    it('copies fields as-is without recomputing them', () => {
      expect(de.typeSign).toBe('~')
      expect(de.typeSymbol).toBe('changed')
      expect(de.path).toBe('foo/bar')
      expect(de.ddBefore).toBe('oldValue')
      expect(de.ddAfter).toBe('newValue')
    })
  })
})
