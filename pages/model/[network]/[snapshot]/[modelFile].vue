<template>
  <VisualizeDiagram v-bind:model-file="modelFile" v-bind:visualizer="visualizer" />
</template>

<script>
import { computed } from 'vue'
import VisualizeDiagram from '~/components/VisualizeDiagram'

export default {
  components: {
    VisualizeDiagram
  },
  setup() {
    const route = useRoute()
    const visualizer = computed(() => route.query.visualizer || 'forceSimulation')
    const modelFile = computed(() => {
      const prm = route.params // alias
      return `${prm.network}/${prm.snapshot}/${prm.modelFile}`
    })
    useHead({
      title: () => `${visualizer.value} Diagram for ${modelFile.value}`
    })
    return { visualizer, modelFile }
  }
}
</script>

<style scoped></style>
