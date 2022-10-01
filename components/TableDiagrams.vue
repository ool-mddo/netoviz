<template>
  <v-row>
    <v-col>
      <v-data-table
        v-bind:headers="header_row"
        v-bind:items="table_body_rows"
        v-bind:items-per-page="20"
        caption="Select model/visualizer"
        dense
        hide-default-header>
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header">
            <tr>
              <th v-for="(header, index) in props.headers" v-bind:key="index">
                <div v-if="header.link">
                  <router-link v-bind:to="header.link">
                    {{ header.text }}
                  </router-link>
                </div>
                <div v-else>
                  {{ header.text }}
                </div>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:item="props">
          <tr>
            <td
              v-for="(col, index) in Object.keys(props.item)"
              v-bind:key="index">
              <div v-if="props.item[col].link">
                <router-link v-bind:to="props.item[col].link">
                  {{ props.item[col].text }}
                </router-link>
              </div>
              <div v-else>
                {{ props.item[col].text }}
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TableDiagrams',
  computed: {
    ...mapState(['modelFiles', 'visualizers']),
    header_row() {
      const modelItems = [
        {
          text: 'Network',
          value: 'network',
          sortable: true,
          link: null // '/model/networks'
        },
        {
          text: 'SnapShot',
          value: 'snapshot',
          sortable: true,
          link: null
        },
        {
          text: 'Model',
          value: 'model',
          sortable: false,
          link: null
        }
      ]
      const visualizerItems = this.visualizers.map((v) => ({
        text: v.text,
        value: v.value,
        sortable: false,
        link: null
      }))
      return modelItems.concat(visualizerItems)
    },
    table_body_rows() {
      const rows = []
      for (const modelFile of this.modelFiles) {
        const filePath = `${modelFile.network}/${modelFile.snapshot}/${modelFile.file}`
        const item = {
          network: {
            text: modelFile.network,
            value: modelFile.network,
            link: null // `model/${modelFile.network}/snapshots`
          },
          snapshot: {
            text: modelFile.snapshot,
            value: modelFile.snapshot,
            link: null // `model/${modelFile.network}/${modelFile.snapshot}/files`
          },
          model: {
            text: modelFile.label,
            value: modelFile.file,
            link: null
          }
        }
        for (const visualizer of this.visualizers) {
          item[visualizer.value] = {
            text: visualizer.text,
            value: visualizer.value,
            link: `/model/${filePath}?visualizer=${visualizer.value}`
          }
        }
        rows.push(item)
      }
      return rows
    }
  }
}
</script>

<style scoped></style>
