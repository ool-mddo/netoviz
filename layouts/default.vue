<template>
  <v-app id="app">
    <v-app-bar app dense dark>
      <v-toolbar-title>Netoviz</v-toolbar-title>
      <div class="flex-grow-1" />
      <v-toolbar-items>
        <AppBarLinkSource />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col><AppBreadcrumbs v-bind:path="$nuxt.$route.path" /></v-col>
          <v-col><TableAlerts /></v-col>
        </v-row>
        <v-row>
          <nuxt />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import AppAPICommon from '~/components/AppAPICommon'
import AppBarLinkSource from '~/components/AppBarLinkSource'
import AppBreadcrumbs from '~/components/AppBreadcrumbs'
const TableAlerts = () => ({
  component: import('~/components/TableAlerts')
})

export default {
  components: {
    AppBarLinkSource,
    AppBreadcrumbs,
    TableAlerts
  },
  mixins: [AppAPICommon],
  computed: {
    ...mapState(['modelFiles'])
  },
  mounted() {
    this.updateModelFiles()
  },
  methods: {
    ...mapMutations(['setModelFiles']),
    async updateModelFiles() {
      try {
        const response = await fetch(this.apiParam.restURIBase + '/api/models')
        const modelFiles = await response.json()
        this.setModelFiles(Object.freeze(modelFiles))
      } catch (error) {
        console.log('[SelectModel] Cannot get models data: ', error)
      }
    }
  }
}
</script>

<style scoped></style>
