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
import { visualizerLinksForModelFile } from '~/lib/util/model-link'

export default {
  name: 'TableDiagrams',
  computed: {
    ...mapState(useMainStore, ['modelFiles', 'visualizers']),
    header_row() {
      const modelItems = [
        {
          title: 'Network',
          key: 'network',
          sortable: true,
          link: null // '/model/networks'
        },
        {
          title: 'SnapShot',
          key: 'snapshot',
          sortable: true,
          link: null
        },
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
      for (const modelFile of this.modelFiles) {
        const item = {
          network: {
            text: modelFile.network,
            value: modelFile.network,
            link: null
          },
          snapshot: {
            text: modelFile.snapshot,
            value: modelFile.snapshot,
            link: null
          },
          model: {
            text: modelFile.label,
            value: modelFile.file,
            link: null
          }
        }

        Object.assign(item, visualizerLinksForModelFile(modelFile, this.visualizers))
        rows.push(item)
      }
      return rows
    }
  }
}
</script>

<style scoped></style>
