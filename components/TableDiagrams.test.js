// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import TableDiagrams from './TableDiagrams.vue'

const modelFiles = [
  { network: 'nw1', snapshot: 'ss1', file: 'a.json', label: 'a' },
  { network: 'nw1', snapshot: 'dir/ss2', file: 'b.json', label: 'b' },
  { network: 'nw2', snapshot: 'ss1', file: 'c.json', label: 'c' }
]

const mountWith = (props) =>
  mount(TableDiagrams, {
    props,
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState: { main: { modelFiles } } })],
      stubs: { VRow: true, VCol: true, VDataTable: true }
    }
  })

describe('TableDiagrams', () => {
  it('shows all model files with network/snapshot columns by default', () => {
    const vm = mountWith({}).vm
    expect(vm.table_body_rows).toHaveLength(3)
    expect(vm.header_row.slice(0, 3).map((h) => h.key)).toStrictEqual(['network', 'snapshot', 'model'])
    expect(vm.table_body_rows[0].snapshot.link).toBeNull()
  })

  it('filters by network, hides the network column and links snapshots', () => {
    const vm = mountWith({ network: 'nw1' }).vm
    expect(vm.table_body_rows).toHaveLength(2)
    expect(vm.header_row.slice(0, 2).map((h) => h.key)).toStrictEqual(['snapshot', 'model'])
    expect(vm.table_body_rows[1].snapshot.link).toBe('/model/nw1/dir__ss2')
  })

  it('filters by network and (URL-encoded) snapshot, hiding both columns', () => {
    const vm = mountWith({ network: 'nw1', snapshot: 'dir__ss2' }).vm
    expect(vm.table_body_rows).toHaveLength(1)
    expect(vm.header_row[0].key).toBe('model')
    expect(Object.keys(vm.table_body_rows[0])[0]).toBe('model')
  })
})
