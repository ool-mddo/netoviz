<template>
  <v-row>
    <v-col>
      <v-data-table
        v-bind:headers="headerRow"
        v-bind:items="tableRows"
        v-bind:items-per-page="20"
        caption="Select visualizer"
        density="compact"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td v-for="(col, index) in Object.keys(item)" v-bind:key="index">
              <div v-if="item[col].link">
                <router-link v-bind:to="item[col].link">
                  {{ item[col].text }}
                </router-link>
              </div>
              <div v-else>
                {{ item[col].text }}
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '~/stores/main'
import { snapshotUrlEncode, visualizerLinksForModelFile } from '~/lib/util/model-link'

export default {
  name: 'TableModelFiles',
  props: {
    network: {
      type: String,
      default: '',
      required: false
    },
    snapshot: {
      // URL-encoded (`__`) snapshot path segment, as taken from the route params.
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    ...mapState(useMainStore, ['modelFiles', 'visualizers']),
    modelFilesInSnapshot() {
      return this.modelFiles.filter(
        (m) => m.network === this.network && snapshotUrlEncode(m.snapshot) === this.snapshot
      )
    },
    headerRow() {
      const modelHeader = { title: 'Model', key: 'model', sortable: false }
      const visualizerHeaders = this.visualizers.map((v) => ({ title: v.text, key: v.value, sortable: false }))
      return [modelHeader, ...visualizerHeaders]
    },
    tableRows() {
      return this.modelFilesInSnapshot.map((modelFile) => {
        const item = {
          model: { text: modelFile.label, value: modelFile.file, link: null }
        }
        Object.assign(item, visualizerLinksForModelFile(modelFile, this.visualizers))
        return item
      })
    }
  }
}
</script>

<style scoped></style>
