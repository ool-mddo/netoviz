<template>
  <div>
    <div v-for="nw in networks" v-bind:key="nw">
      <h3 class="mt-4">
        <router-link v-bind:to="`/model/${nw}`">{{ nw }}</router-link>
      </h3>
      <TableDiagrams v-bind:network="nw" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '~/stores/main'
import TableDiagrams from '~/components/TableDiagrams'

export default {
  components: {
    TableDiagrams
  },
  setup() {
    useHead({ title: 'Model: Networks' })
  },
  computed: {
    ...mapState(useMainStore, ['modelFiles']),
    networks() {
      return [...new Set(this.modelFiles.map((m) => m.network))].sort()
    }
  }
}
</script>

<style scoped></style>
