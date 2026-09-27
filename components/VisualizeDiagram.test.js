// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import VisualizeDiagram from './VisualizeDiagram.vue'

const modelFiles = [{ network: 'nw1', snapshot: 'ss1', file: 'topology.json' }]
const validModelFile = 'nw1/ss1/topology.json'

// Stub every DOM/D3-heavy diagram wrapper, so mounting VisualizeDiagram never runs
// their real mounted() hooks. Vuetify/router components (v-row, v-alert, router-link)
// are deliberately left unstubbed and unregistered: Vue falls back to rendering them
// as plain (unresolved) elements, which still renders their slot content -- exactly
// what these tests need to assert on NotFound's message text.
const stubs = {
  VisualizeDiagramForceSimulation: true,
  VisualizeDiagramDependency: true,
  VisualizeDiagramDependency2: true,
  VisualizeDiagramNested: true,
  VisualizeDiagramDistance: true
}

const mountWith = (visualizer, modelFile) =>
  mount(VisualizeDiagram, {
    props: { visualizer, modelFile },
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState: { main: { modelFiles } } })],
      stubs
    }
  })

describe('VisualizeDiagram', () => {
  const stubTagFor = {
    forceSimulation: 'visualize-diagram-force-simulation-stub',
    dependency: 'visualize-diagram-dependency-stub',
    dependency2: 'visualize-diagram-dependency2-stub',
    nested: 'visualize-diagram-nested-stub',
    distance: 'visualize-diagram-distance-stub'
  }

  it('renders the diagram matching a valid visualizer + model file', () => {
    const wrapper = mountWith('forceSimulation', validModelFile)
    expect(wrapper.find(stubTagFor.forceSimulation).exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Model and/or Visualizer Not Found')
  })

  it.each(['dependency', 'dependency2', 'nested', 'distance'])(
    'renders the diagram matching visualizer=%s',
    (visualizer) => {
      const wrapper = mountWith(visualizer, validModelFile)
      expect(wrapper.find(stubTagFor[visualizer]).exists()).toBe(true)
    }
  )

  it('falls back to NotFound with a message for an unknown visualizer', () => {
    const wrapper = mountWith('unknownViz', validModelFile)
    expect(wrapper.text()).toContain('Model and/or Visualizer Not Found')
    expect(wrapper.text()).toContain('Unknown visualizer: unknownViz')
    expect(wrapper.text()).not.toContain('Unknown model file')
  })

  it('falls back to NotFound with a message for an unknown model file', () => {
    const wrapper = mountWith('forceSimulation', 'no/such/file.json')
    expect(wrapper.text()).toContain('Model and/or Visualizer Not Found')
    expect(wrapper.text()).toContain('Unknown model file: no/such/file.json')
    expect(wrapper.text()).not.toContain('Unknown visualizer')
  })
})
