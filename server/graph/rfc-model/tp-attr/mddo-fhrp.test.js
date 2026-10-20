import { describe, expect, it } from 'vitest'
import MddoFhrp from './mddo-fhrp'
import DiffElement from '../../common/diff-element'

// topology data (kebab-case keys)
const topologyData = {
  protocol: 'vrrp',
  'group-id': 1,
  'virtual-address': ['192.168.101.1'],
  priority: 150,
  preempt: true,
  'source-address': '192.168.101.2/24',
  active: true
}

describe('MddoFhrp', () => {
  describe('constructor', () => {
    it('reads topology data (kebab-case keys)', () => {
      expect(new MddoFhrp(topologyData)).toMatchObject({
        protocol: 'vrrp',
        groupId: 1,
        virtualAddress: ['192.168.101.1'],
        priority: 150,
        preempt: true,
        sourceAddress: '192.168.101.2/24',
        active: true
      })
    })

    it('can be re-constructed from its own JSON (camelCase properties), like the browser does', () => {
      const fhrp = new MddoFhrp(topologyData)
      const restored = new MddoFhrp(JSON.parse(JSON.stringify(fhrp)))
      expect(restored).toMatchObject({
        protocol: 'vrrp',
        groupId: 1,
        virtualAddress: ['192.168.101.1'],
        priority: 150,
        preempt: true,
        sourceAddress: '192.168.101.2/24',
        active: true
      })
    })

    it('keeps false/0 values (not replaced by defaults)', () => {
      const data = { ...topologyData, priority: 0, preempt: false, active: false }
      const restored = new MddoFhrp(JSON.parse(JSON.stringify(new MddoFhrp(data))))
      expect(restored).toMatchObject({ priority: 0, preempt: false, active: false })
    })

    it('uses default values for missing keys', () => {
      expect(new MddoFhrp({})).toMatchObject({
        protocol: '',
        groupId: -1,
        virtualAddress: [],
        priority: 0,
        preempt: false,
        sourceAddress: '',
        active: false
      })
    })
  })

  describe('toHtml', () => {
    it('shows the protocol/group and all parameters in one item', () => {
      const html = new MddoFhrp(topologyData).toHtml()
      expect(html).toContain('VRRP group 1:')
      expect(html).toContain('Virtual Address:')
      expect(html).toContain('192.168.101.1')
      expect(html).toContain('Priority:')
      expect(html).toContain('150')
      expect(html).toContain('Preempt:')
      expect(html).toContain('true')
      expect(html).toContain('Source Address:')
      expect(html).toContain('192.168.101.2/24')
      expect(html).toContain('Active:')
      expect(html.match(/<li>/g)).toHaveLength(1)
    })

    it('shows hsrp group and false values', () => {
      const html = new MddoFhrp({ ...topologyData, protocol: 'hsrp', 'group-id': 10, preempt: false }).toHtml()
      expect(html).toContain('HSRP group 10:')
      expect(html).toMatch(/Preempt:<\/span> false/)
    })

    it('shows multiple virtual addresses', () => {
      const html = new MddoFhrp({ ...topologyData, 'virtual-address': ['192.168.101.1', '192.168.101.254'] }).toHtml()
      expect(html).toContain('192.168.101.1,192.168.101.254')
    })

    it('shows changed value with the diff classes', () => {
      const diffElements = [new DiffElement(['~', 'priority', 150, 100])]
      const html = new MddoFhrp({ ...topologyData, priority: 100 }).toHtml(diffElements)
      expect(html).toContain('attr-key changed')
      expect(html).toContain('attr-val added')
      expect(html).toContain('attr-val deleted')
    })
  })
})
