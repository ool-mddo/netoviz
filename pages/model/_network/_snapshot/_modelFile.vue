<template>
  <VisualizeDiagram v-bind:model-file="modelFile" v-bind:visualizer="visualizer" />
</template>

<script>
import VisualizeDiagram from '~/components/VisualizeDiagram'

export default {
  components: {
    VisualizeDiagram
  },
  head() {
    return {
      title: `${this.visualizer} Diagram for ${this.modelFile}`
    }
  },
  computed: {
    visualizer() {
      return this.$nuxt.$route.query.visualizer || 'forceSimulation'
    },
    modelFile() {
      const prm = this.$nuxt.$route.params // alias
      return `${prm.network}/${prm.snapshot}/${prm.modelFile}`
    }
  }
}
</script>

<style scoped></style>
