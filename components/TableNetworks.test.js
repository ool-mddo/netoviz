// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import TableNetworks from './TableNetworks.vue'

const modelFiles = [
  { network: 'nw1', snapshot: 'ss1', file: 'topology.json' },
  { network: 'nw1', snapshot: 'ss2', file: 'topology.json' },
  { network: 'nw2', snapshot: 'ss1', file: 'topology.json' }
]

const mountWithModelFiles = (files) =>
  mount(TableNetworks, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState: { main: { modelFiles: files } } })],
      stubs: { VDataTable: true, VRow: true, VCol: true }
    }
  })

describe('TableNetworks', () => {
  it('groups model files by network and counts distinct snapshots per network', () => {
    const wrapper = mountWithModelFiles(modelFiles)
    expect(wrapper.vm.tableRows).toStrictEqual([
      { network: 'nw1', snapshotCount: 2 },
      { network: 'nw2', snapshotCount: 1 }
    ])
  })

  it('returns no rows when there are no model files', () => {
    const wrapper = mountWithModelFiles([])
    expect(wrapper.vm.tableRows).toStrictEqual([])
  })
})
