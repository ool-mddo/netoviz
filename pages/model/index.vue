<template>
  <div v-for="nw in networks" v-bind:key="nw">
    <h3 class="mt-4">
      <router-link v-bind:to="`/model/${nw}`">{{ nw }}</router-link>
    </h3>
    <TableDiagrams v-bind:network="nw" />
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
  computed: {
    ...mapState(useMainStore, ['modelFiles']),
    networks() {
      return [...new Set(this.modelFiles.map((m) => m.network))].sort()
    }
  },
  setup() {
    useHead({ title: 'Model: Networks' })
  }
}
</script>

<style scoped></style>
