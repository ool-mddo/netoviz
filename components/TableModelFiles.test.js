// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import TableModelFiles from './TableModelFiles.vue'

const modelFiles = [
  { network: 'nw1', snapshot: 'ss1', file: 'topology.json', label: 'Topo 1' },
  { network: 'nw1', snapshot: 'base/sub', file: 'topology.json', label: 'Topo 2' },
  { network: 'nw2', snapshot: 'ss1', file: 'topology.json', label: 'Other' }
]

const mountFor = (network, snapshot) =>
  mount(TableModelFiles, {
    props: { network, snapshot },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState: { main: { modelFiles } } })],
      stubs: { VDataTable: true, VRow: true, VCol: true }
    }
  })

describe('TableModelFiles', () => {
  it('lists model files matching network + URL-encoded snapshot, with per-visualizer links', () => {
    const wrapper = mountFor('nw1', 'ss1')
    expect(wrapper.vm.tableRows).toHaveLength(1)
    const row = wrapper.vm.tableRows[0]
    expect(row.model).toStrictEqual({ text: 'Topo 1', value: 'topology.json', link: null })
    expect(Object.keys(row).sort()).toStrictEqual(
      ['model', 'forceSimulation', 'dependency', 'dependency2', 'nested', 'distance'].sort()
    )
    expect(row.forceSimulation.link).toBe('/model/nw1/ss1/topology.json?visualizer=forceSimulation')
  })

  it('matches a snapshot that contains a slash via its "__"-encoded segment', () => {
    const wrapper = mountFor('nw1', 'base__sub')
    expect(wrapper.vm.tableRows).toHaveLength(1)
    expect(wrapper.vm.tableRows[0].model.text).toBe('Topo 2')
  })

  it('returns no rows when network/snapshot do not match any model file', () => {
    const wrapper = mountFor('nw1', 'no-such-snapshot')
    expect(wrapper.vm.tableRows).toStrictEqual([])
  })
})
