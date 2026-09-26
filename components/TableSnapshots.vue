<template>
  <v-row>
    <v-col>
      <v-data-table
        v-bind:headers="headerRow"
        v-bind:items="tableRows"
        v-bind:items-per-page="20"
        caption="Select snapshot"
        density="compact"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <router-link v-bind:to="item.link">
                {{ item.snapshot }}
              </router-link>
            </td>
            <td>{{ item.fileCount }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '~/stores/main'
import { snapshotUrlEncode } from '~/lib/util/model-link'

export default {
  name: 'TableSnapshots',
  props: {
    network: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    ...mapState(useMainStore, ['modelFiles']),
    headerRow() {
      return [
        { title: 'Snapshot', key: 'snapshot', sortable: true },
        { title: 'Model files', key: 'fileCount', sortable: true }
      ]
    },
    tableRows() {
      const fileCountOf = {}
      for (const modelFile of this.modelFiles) {
        if (modelFile.network !== this.network) {
          continue
        }
        fileCountOf[modelFile.snapshot] = (fileCountOf[modelFile.snapshot] || 0) + 1
      }
      return Object.keys(fileCountOf).map((snapshot) => ({
        snapshot,
        fileCount: fileCountOf[snapshot],
        link: `/model/${this.network}/${snapshotUrlEncode(snapshot)}`
      }))
    }
  }
}
</script>

<style scoped></style>
