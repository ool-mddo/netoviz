// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppBreadcrumbs from './AppBreadcrumbs.vue'

const mountWithPath = (path) =>
  mount(AppBreadcrumbs, {
    props: path === undefined ? {} : { path },
    global: { stubs: { VBreadcrumbs: true } }
  })

describe('AppBreadcrumbs', () => {
  it('defaults to a single disabled "index" crumb when no path prop is given', () => {
    const wrapper = mountWithPath(undefined)
    expect(wrapper.vm.items).toStrictEqual([{ title: 'index', to: '/', exact: true, disabled: true }])
  })

  it('builds one crumb per path segment, disabling only the last one', () => {
    const wrapper = mountWithPath('/model/nw1')
    expect(wrapper.vm.items).toStrictEqual([
      { title: 'index', to: '/', exact: true, disabled: false },
      { title: 'model', to: '/model', exact: true, disabled: false },
      { title: 'nw1', to: '/model/nw1', exact: true, disabled: true }
    ])
  })

  it('ignores a trailing slash (produces the same crumbs as without one)', () => {
    const withSlash = mountWithPath('/model/nw1/')
    const withoutSlash = mountWithPath('/model/nw1')
    expect(withSlash.vm.items).toStrictEqual(withoutSlash.vm.items)
  })
})
