// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import TableSnapshots from './TableSnapshots.vue'

const modelFiles = [
  { network: 'nw1', snapshot: 'ss1', file: 'topology.json' },
  { network: 'nw1', snapshot: 'ss1', file: 'layout.json' },
  { network: 'nw1', snapshot: 'base/sub', file: 'topology.json' },
  { network: 'nw2', snapshot: 'other', file: 'topology.json' }
]

const mountFor = (network) =>
  mount(TableSnapshots, {
    props: { network },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState: { main: { modelFiles } } })],
      stubs: { VDataTable: true, VRow: true, VCol: true }
    }
  })

describe('TableSnapshots', () => {
  it('counts model files per snapshot, scoped to the given network', () => {
    const wrapper = mountFor('nw1')
    expect(wrapper.vm.tableRows).toStrictEqual([
      { snapshot: 'ss1', fileCount: 2, link: '/model/nw1/ss1' },
      { snapshot: 'base/sub', fileCount: 1, link: '/model/nw1/base__sub' }
    ])
  })

  it('excludes model files belonging to other networks', () => {
    const wrapper = mountFor('nw2')
    expect(wrapper.vm.tableRows).toStrictEqual([{ snapshot: 'other', fileCount: 1, link: '/model/nw2/other' }])
  })

  it('returns no rows for a network with no model files', () => {
    const wrapper = mountFor('no-such-network')
    expect(wrapper.vm.tableRows).toStrictEqual([])
  })
})
