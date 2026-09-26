<template>
  <TableDiagrams />
</template>

<script>
import TableDiagrams from '~/components/TableDiagrams'

export default {
  components: {
    TableDiagrams
  },
  setup() {
    useHead({ title: 'Index: Model/Visualizer Table' })
  }
}
</script>

<style scoped></style>
