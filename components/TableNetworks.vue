<template>
  <v-row>
    <v-col>
      <v-data-table
        v-bind:headers="headerRow"
        v-bind:items="tableRows"
        v-bind:items-per-page="20"
        caption="Select network"
        density="compact"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <router-link v-bind:to="`/model/${item.network}`">
                {{ item.network }}
              </router-link>
            </td>
            <td>{{ item.snapshotCount }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '~/stores/main'

export default {
  name: 'TableNetworks',
  computed: {
    ...mapState(useMainStore, ['modelFiles']),
    headerRow() {
      return [
        { title: 'Network', key: 'network', sortable: true },
        { title: 'Snapshots', key: 'snapshotCount', sortable: true }
      ]
    },
    tableRows() {
      const snapshotsOf = {}
      for (const modelFile of this.modelFiles) {
        if (!snapshotsOf[modelFile.network]) {
          snapshotsOf[modelFile.network] = new Set()
        }
        snapshotsOf[modelFile.network].add(modelFile.snapshot)
      }
      return Object.keys(snapshotsOf).map((network) => ({
        network,
        snapshotCount: snapshotsOf[network].size
      }))
    }
  }
}
</script>

<style scoped></style>
