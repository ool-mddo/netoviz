<template>
  <TableSnapshots v-bind:network="network" />
</template>

<script>
import { computed } from 'vue'
import TableSnapshots from '~/components/TableSnapshots'

export default {
  components: {
    TableSnapshots
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
