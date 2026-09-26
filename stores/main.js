import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    modelFiles: [],
    visualizers: Object.freeze([
      {
        text: 'Force-simulation',
        value: 'forceSimulation',
        label: 'Force-simulation diagram per layer.'
      },
      {
        text: 'Dependency',
        value: 'dependency',
        label: 'Dependency diagram.'
      },
      {
        text: 'Dependency2',
        value: 'dependency2',
        label: 'Dependency(v2) diagram.'
      },
      {
        text: 'Nested',
        value: 'nested',
        label: 'Nested diagram.'
      },
      {
        text: 'Distance',
        value: 'distance',
        label: 'Distance diagram.'
      }
    ])
  }),
  actions: {
    setModelFiles(payload) {
      this.modelFiles = payload
    }
  }
})
