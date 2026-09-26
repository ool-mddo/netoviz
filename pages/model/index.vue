<template>
  <TableNetworks />
</template>

<script>
import TableNetworks from '~/components/TableNetworks'

export default {
  components: {
    TableNetworks
  },
  setup() {
    useHead({ title: 'Model: Networks' })
  }
}
</script>

<style scoped></style>
