<template>
  <v-row>
    <v-col v-if="validModelFile">
      <v-list>
        <v-list-subheader>
          Visualizers
          <template v-if="modelFile"> for {{ modelFile }} </template>
        </v-list-subheader>
        <v-list-item v-for="(vizData, index) in visualizerData" v-bind:key="index" v-bind:to="vizData.link">
          <v-list-item-title>
            {{ vizData.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col v-else>
      <NotFound>Unknown model file: {{ modelFile }}</NotFound>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'pinia'
import NotFound from './NotFound'
import { useMainStore } from '~/stores/main'

export default {
  name: 'TableVisualizers',
  components: {
    NotFound
  },
  props: {
    modelFile: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    ...mapState(useMainStore, ['visualizers', 'modelFiles']),
    validModelFile() {
      if (!this.modelFile) {
        return true
      }
      return this.modelFiles.find((m) => m.file === this.modelFile)
    },
    visualizerData() {
      return this.visualizers.map((v) => ({
        text: v.text,
        link: this.modelFile ? `/model/${this.modelFile}/${v.value}` : `/visualizer/${v.value}`
      }))
    }
  }
}
</script>

<style scoped></style>
