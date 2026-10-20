<template>
  <TableDiagrams v-bind:network="network" />
</template>

<script>
import { computed } from 'vue'
import TableDiagrams from '~/components/TableDiagrams'

export default {
  components: {
    TableDiagrams
  },
  setup() {
    const route = useRoute()
    const network = computed(() => route.params.network)
    useHead({ title: () => `Model: ${network.value} Snapshots` })
    return { network }
  }
}
</script>

<style scoped></style>
