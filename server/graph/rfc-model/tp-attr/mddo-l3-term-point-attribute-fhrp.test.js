import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import RfcTopology from '../topology'
import { MddoL3TermPointAttribute } from './mddo'
import MddoFhrp from './mddo-fhrp'

const fixturePath = fileURLToPath(new URL('../../../../test/fixtures/rfc8345/mddo-l3-fhrp.json', import.meta.url))
const fhrpFixture = JSON.parse(readFileSync(fixturePath, 'utf8'))

const vrrp = {
  protocol: 'vrrp',
  'group-id': 1,
  'virtual-address': ['192.168.101.1'],
  priority: 150,
  preempt: true,
  'source-address': '192.168.101.2/24',
  active: true
}
const hsrp = { ...vrrp, protocol: 'hsrp', 'group-id': 10, 'virtual-address': ['192.168.101.254'], priority: 110 }
const baseData = { description: 'to_lan', 'ip-address': ['192.168.101.2/24'], flag: [] }

// term-point attribute with diff-state (netomox `_diff_state_`)
const attrWithDiff = (data, diffData) =>
  new MddoL3TermPointAttribute({ ...data, _diff_state_: { forward: 'changed', diff_data: diffData } })

describe('MddoL3TermPointAttribute with fhrp', () => {
  describe('constructor', () => {
    it('has MddoFhrp objects', () => {
      const attr = new MddoL3TermPointAttribute({ ...baseData, fhrp: [vrrp, hsrp] })
      expect(attr.fhrp).toHaveLength(2)
      expect(attr.fhrp).toEqual(expect.arrayContaining([expect.any(MddoFhrp)]))
      expect(attr.fhrp.map((f) => [f.protocol, f.groupId])).toStrictEqual([
        ['vrrp', 1],
        ['hsrp', 10]
      ])
    })

    it('has no fhrp if the term-point does not have it', () => {
      expect(new MddoL3TermPointAttribute(baseData).fhrp).toStrictEqual([])
      expect(new MddoL3TermPointAttribute({}).fhrp).toStrictEqual([])
    })

    it('is read from the topology (RfcTopology) by the term-point', () => {
      const topology = new RfcTopology(fhrpFixture)
      const [cr1] = topology.networks[0].nodes
      const [tpVrrp, tpBoth, tpNone] = cr1.termPoints
      expect(tpVrrp.attribute).toBeInstanceOf(MddoL3TermPointAttribute)
      expect(tpVrrp.attribute.fhrp.map((f) => f.priority)).toStrictEqual([150])
      expect(tpBoth.attribute.fhrp.map((f) => f.protocol)).toStrictEqual(['vrrp', 'hsrp'])
      expect(tpNone.attribute.fhrp).toStrictEqual([])
    })
  })

  describe('toHtml', () => {
    it('shows fhrp groups', () => {
      const html = new MddoL3TermPointAttribute({ ...baseData, fhrp: [vrrp] }).toHtml()
      expect(html).toContain('FHRP:')
      expect(html).toContain('VRRP group 1:')
      expect(html).toContain('192.168.101.1')
      expect(html).toContain('150')
      expect(html).toContain('Description:')
      expect(html).toContain('IP Address:')
    })

    it('shows multiple groups (vrrp and hsrp), one item for each group', () => {
      const html = new MddoL3TermPointAttribute({ ...baseData, fhrp: [vrrp, hsrp] }).toHtml()
      expect(html).toContain('VRRP group 1:')
      expect(html).toContain('HSRP group 10:')
      expect(html).toContain('192.168.101.254')
      // Description, IP Address, Flag, FHRP + 2 groups
      expect(html.match(/<li>/g)).toHaveLength(6)
    })

    it('does not show FHRP if the term-point does not have fhrp (same as before)', () => {
      const html = new MddoL3TermPointAttribute(baseData).toHtml()
      expect(html).not.toContain('FHRP')
      expect(html.match(/<li>/g)).toHaveLength(3)
      expect(html).toBe(`
<ul>
  <li>${new MddoL3TermPointAttribute(baseData)._toHtmlKeyValue('description', 'Description')}
  <li>${new MddoL3TermPointAttribute(baseData)._toHtmlKeyValue('ipAddress', 'IP Address')}
  <li>${new MddoL3TermPointAttribute(baseData)._toHtmlKeyValue('flag', 'Flag')}
</ul>
`)
    })

    it('gives the same html after JSON round trip (the tooltip re-constructs the attribute from JSON)', () => {
      const attr = new MddoL3TermPointAttribute({ ...baseData, fhrp: [vrrp, hsrp] })
      const restored = new MddoL3TermPointAttribute(JSON.parse(JSON.stringify(attr)))
      expect(restored.toHtml()).toBe(attr.toHtml())
    })

    it('does not use diff classes if there is no diff', () => {
      const html = new MddoL3TermPointAttribute({ ...baseData, fhrp: [vrrp] }).toHtml()
      expect(html).not.toMatch(/attr-(key|val) (added|deleted|changed)/)
    })
  })

  describe('toHtml with diff', () => {
    it('shows old and new value of changed parameter', () => {
      const data = { ...baseData, fhrp: [{ ...vrrp, priority: 100 }] }
      const html = attrWithDiff(data, [['~', 'fhrp[0].priority', 150, 100]]).toHtml()
      expect(html).toMatch(/attr-key changed">Priority:/)
      expect(html).toContain('<span class="attr-val added">100</span>')
      expect(html).toContain('<span class="attr-val deleted">150</span>')
      // the other parameter is not marked
      expect(html).not.toMatch(/attr-key (added|deleted|changed)">Preempt:/)
    })

    it('marks the parameters of added group', () => {
      const data = { ...baseData, fhrp: [vrrp, hsrp] }
      const html = attrWithDiff(data, [['+', 'fhrp[1]', hsrp]]).toHtml()
      const [, secondGroup] = html.split('HSRP group 10:')
      expect(secondGroup).toMatch(/attr-key added">Priority:/)
      const [firstGroup] = html.split('HSRP group 10:')
      expect(firstGroup).not.toMatch(/attr-key added">Priority:/)
    })

    it('marks the heading and the parameters if the whole fhrp is added', () => {
      const data = { ...baseData, fhrp: [vrrp] }
      const html = attrWithDiff(data, [['+', 'fhrp', [vrrp]]]).toHtml()
      expect(html).toMatch(/attr-key added">FHRP:/)
      expect(html).toMatch(/attr-key added">Priority:/)
    })

    it('marks the changed virtual address', () => {
      const data = { ...baseData, fhrp: [{ ...vrrp, 'virtual-address': ['192.168.101.254'] }] }
      const html = attrWithDiff(data, [
        ['~', 'fhrp[0].virtual-address[0]', '192.168.101.1', '192.168.101.254']
      ]).toHtml()
      expect(html).toMatch(/attr-key changed">Virtual Address:/)
    })
  })
})
