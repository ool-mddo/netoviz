<template>
  <v-row>
    <v-col>
      <v-data-table
        v-bind:headers="header_row"
        v-bind:items="table_body_rows"
        v-bind:items-per-page="20"
        caption="Select model/visualizer"
        density="compact"
      >
        <template v-slot:headers="{ columns }">
          <tr>
            <th v-for="(header, index) in columns" v-bind:key="index">
              <div v-if="header.link">
                <router-link v-bind:to="header.link">
                  {{ header.title }}
                </router-link>
              </div>
              <div v-else>
                {{ header.title }}
              </div>
            </th>
          </tr>
        </template>
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
  name: 'TableDiagrams',
  props: {
    // 指定した場合、その network / snapshot (URL エンコード済み) 配下のみ表示する
    network: { type: String, default: null },
    snapshot: { type: String, default: null }
  },
  computed: {
    ...mapState(useMainStore, ['modelFiles', 'visualizers']),
    targetModelFiles() {
      return this.modelFiles.filter(
        (m) =>
          (!this.network || m.network === this.network) &&
          (!this.snapshot || snapshotUrlEncode(m.snapshot) === this.snapshot)
      )
    },
    header_row() {
      const networkItem = {
        title: 'Network',
        key: 'network',
        sortable: true,
        link: null // '/model/networks'
      }
      const snapshotItem = {
        title: 'SnapShot',
        key: 'snapshot',
        sortable: true,
        link: null
      }
      const modelItems = [
        ...(this.network ? [] : [networkItem]),
        ...(this.snapshot ? [] : [snapshotItem]),
        {
          title: 'Model',
          key: 'model',
          sortable: false,
          link: null
        }
      ]
      const visualizerItems = this.visualizers.map((v) => ({
        title: v.text,
        key: v.value,
        sortable: false,
        link: null
      }))
      return modelItems.concat(visualizerItems)
    },
    table_body_rows() {
      const rows = []
      for (const modelFile of this.targetModelFiles) {
        const item = {}
        if (!this.network) {
          item.network = { text: modelFile.network, value: modelFile.network, link: null }
        }
        if (!this.snapshot) {
          // network 階層では snapshot 階層のページへのリンクにする
          const link = this.network ? `/model/${modelFile.network}/${snapshotUrlEncode(modelFile.snapshot)}` : null
          item.snapshot = { text: modelFile.snapshot, value: modelFile.snapshot, link }
        }
        item.model = { text: modelFile.label, value: modelFile.file, link: null }

        Object.assign(item, visualizerLinksForModelFile(modelFile, this.visualizers))
        rows.push(item)
      }
      return rows
    }
  }
}
</script>

<style scoped></style>
