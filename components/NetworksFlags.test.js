// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NetworksFlags from './NetworksFlags.vue'

const mountWith = (props) =>
  mount(NetworksFlags, {
    props,
    global: {
      stubs: { VChip: { template: '<span class="chip"><slot /></span>' } },
      mocks: { $config: { public: { netovizRestPort: '3000' } } }
    }
  })

const jsonResponse = (body) => Promise.resolve({ json: () => Promise.resolve(body) })

describe('NetworksFlags', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows one chip per flag of the model file', async () => {
    fetch.mockReturnValue(jsonResponse({ flag: ['blueprint=bp1', 'foo=bar'] }))
    const wrapper = mountWith({ modelFile: 'nw/ss/topology.json' })
    await flushPromises()
    expect(fetch.mock.calls[0][0]).toMatch(/\/api\/models\/attributes\?file=nw%2Fss%2Ftopology\.json$/)
    expect(wrapper.findAll('.chip').map((c) => c.text())).toStrictEqual(['blueprint=bp1', 'foo=bar'])
  })

  it('renders nothing when there is no flag or no model file', async () => {
    fetch.mockReturnValue(jsonResponse({ flag: [] }))
    const wrapper = mountWith({ modelFile: 'nw/ss/topology.json' })
    await flushPromises()
    expect(wrapper.find('#networks-flags').exists()).toBe(false)

    const noFile = mountWith({})
    await flushPromises()
    expect(noFile.find('#networks-flags').exists()).toBe(false)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('fetches again when modelFile or reloadKey changes', async () => {
    fetch.mockReturnValue(jsonResponse({ flag: [] }))
    const wrapper = mountWith({ modelFile: 'nw/ss1/topology.json', reloadKey: 0 })
    await flushPromises()
    await wrapper.setProps({ modelFile: 'nw/ss2/topology.json' })
    await wrapper.setProps({ reloadKey: 1 })
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('ignores a stale response of the previously displayed file', async () => {
    let resolveFirst
    fetch.mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
    fetch.mockReturnValueOnce(jsonResponse({ flag: ['blueprint=new'] }))
    const wrapper = mountWith({ modelFile: 'nw/old/topology.json' })
    await wrapper.setProps({ modelFile: 'nw/new/topology.json' })
    await flushPromises()
    resolveFirst({ json: () => Promise.resolve({ flag: ['blueprint=old'] }) })
    await flushPromises()
    expect(wrapper.findAll('.chip').map((c) => c.text())).toStrictEqual(['blueprint=new'])
  })

  it('clears flags when the request fails', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    fetch.mockRejectedValue(new Error('network error'))
    const wrapper = mountWith({ modelFile: 'nw/ss/topology.json' })
    await flushPromises()
    expect(wrapper.find('#networks-flags').exists()).toBe(false)
  })
})
