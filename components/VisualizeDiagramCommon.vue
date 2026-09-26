<template>
  <div class="dummy"></div>
</template>

<script>
import { watch } from 'vue'
import { useAlertStore } from '~/stores/alert'

export default {
  props: {
    modelFile: {
      type: String,
      default: '',
      require: true
    }
  },
  data() {
    return {
      alertStore: useAlertStore(),
      visualizer: null,
      visualizerName: 'base',
      unwatchAlertHost: null
    }
  },
  computed: {
    alertHost: {
      get() {
        return this.alertStore.alertHost
      },
      set(value) {
        this.alertStore.setAlertHost(value)
      }
    },
    svgWidth() {
      return this.$vuetify.display.width * 0.95
    },
    svgHeight() {
      return this.$vuetify.display.height * 0.8
    }
  },
  watch: {
    $route(newRoute, oldRoute) {
      /*
       watch `params.modelFile` change:
       because if `modelFile` changed, diagram component will reused
       (will not be called lifecycle hook).
       if `params.visualizer` changed, then views/VisualizeDiagram component
       switches corresponding component and run its lifecycle hook.
      */
      const oldModelFile = oldRoute.params.modelFile
      const newModelFile = newRoute.params.modelFile
      if (oldModelFile !== newModelFile) {
        this.watchModelFile(newModelFile, oldModelFile)
      }
    }
  },
  mounted() {
    // Lifecycle for diagram visualizer:
    // merged at including component X.
    // called here before X.mounted()
    console.log(`[viz/${this.visualizerName}] mounted`)
    this.beforeMakeVisualizer() // hook (to ready make visualizer)
    this.visualizer = this.makeVisualizer()
    this.afterMakeVisualizer() // hook (to initialize visualizer)
    this.drawRfcTopologyData() // generate initial diagram

    // set watcher for store change
    this.unwatchalertHost = watch(
      () => this.alertStore.alertHost,
      (newValue, oldValue) => this.watchAlertHost(newValue, oldValue)
    )
  },
  beforeUnmount() {
    // clear store watcher
    this.unwatchalertHost && this.unwatchalertHost()

    // Lifecycle for diagram visualizer:
    // merged at including component X.
    // called here before X.beforeUnmount()
    console.log(`[viz/${this.visualizerName}] before destroy`)
    this.beforeDeleteVisualizer() // hook
    delete this.visualizer
    this.afterDeleteVisualizer() // hook
  },
  methods: {
    // Common methods (template):
    // Methods are overwritten at including (mix-in) component
    makeVisualizer() {
      // return diagram visualizer as `this.visualizer`
      console.error('[viz] makeVisualizer must be overwritten.')
    },
    watchAlertHost(newValue, oldValue) {
      this.drawRfcTopologyData()
      this.highlightByAlert(newValue)
    },
    watchModelFile(newModelFile, oldModelFile) {
      // callback function when modelFile changed.
      console.log(`[viz/${this.visualizerName}] modelFile changed from ${oldModelFile} to ${newModelFile}`)
      this.clearAllHighlight()
      this.drawRfcTopologyData()
    },
    clearAllHighlight() {
      // function to clear all highlights in diagram(s).
      console.error('[viz] clearAllHighlight must be overwritten.')
    },
    beforeMakeVisualizer() {
      // optional: hook in mounted(): to ready make visualizer
    },
    afterMakeVisualizer() {
      // optional: hook in mounted(): to initialize visualizer
    },
    beforeDeleteVisualizer() {
      // optional: hook in beforeUnmount()
    },
    afterDeleteVisualizer() {
      // optional: hook in beforeUnmount()
    },
    drawRfcTopologyData() {
      // function to generate diagram using visualizer.
      console.error('[viz] drawRfcTopologyData must be overwrite.')
    },
    highlightByAlert(alertHost) {
      if (alertHost) {
        this.visualizer.highlightByAlert(alertHost)
      } else {
        this.clearAllHighlight()
      }
    },
    resizeSVG() {
      this.visualizer && this.visualizer.resizeRootSVG(this.svgWidth, this.svgHeight)
    },
    nodeClickCallback(nodeData) {
      // For nested and distance diagram:
      // re-construct path with layer-name and name attribute,
      // because path has deep-copy identifier (::N).
      const paths = [nodeData.path.split('__').shift(), nodeData.name]
      this.alertHost = paths.join('__')
    }
  }
}
</script>

<style scoped></style>
