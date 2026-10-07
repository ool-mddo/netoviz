import { describe, expect, it } from 'vitest'
import { ChangeDetector } from './change-detector'

describe('ChangeDetector', () => {
  it('uses the first observation as baseline', () => {
    const d = new ChangeDetector()
    expect(d.observe('a')).toBe(false)
    expect(d.observe('a')).toBe(false)
  })

  it('ignores a change observed only once, reports it on the second consecutive observation', () => {
    const d = new ChangeDetector()
    d.observe('a')
    expect(d.observe('b')).toBe(false)
    expect(d.observe('b')).toBe(true)
    expect(d.observe('b')).toBe(false)
  })

  it('waits while the value keeps changing (file still being written)', () => {
    const d = new ChangeDetector()
    d.observe('a')
    expect(d.observe('b')).toBe(false)
    expect(d.observe('c')).toBe(false)
    expect(d.observe('c')).toBe(true)
  })

  it('does not report when the value returns to the baseline', () => {
    const d = new ChangeDetector()
    d.observe('a')
    expect(d.observe('b')).toBe(false)
    expect(d.observe('a')).toBe(false)
    expect(d.observe('a')).toBe(false)
  })

  it('treats null (missing file) as a value and re-baselines after reset', () => {
    const d = new ChangeDetector()
    d.observe(null)
    expect(d.observe('a')).toBe(false)
    expect(d.observe('a')).toBe(true)
    d.reset()
    expect(d.observe('z')).toBe(false)
    expect(d.observe('z')).toBe(false)
  })
})
