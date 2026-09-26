<template>
  <TableModelFiles v-bind:network="network" v-bind:snapshot="snapshot" />
</template>

<script>
import { computed } from 'vue'
import TableModelFiles from '~/components/TableModelFiles'

export default {
  components: {
    TableModelFiles
  },
  setup() {
    const route = useRoute()
    const network = computed(() => route.params.network)
    const snapshot = computed(() => route.params.snapshot)
    useHead({ title: () => `Model: ${network.value}/${snapshot.value}` })
    return { network, snapshot }
  }
}
</script>

<style scoped></style>
