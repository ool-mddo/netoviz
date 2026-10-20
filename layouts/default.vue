<template>
  <v-app id="app">
    <v-app-bar app density="compact" theme="dark">
      <v-toolbar-title>Netoviz</v-toolbar-title>
      <div class="flex-grow-1" />
      <v-switch
        v-model="autoReload"
        label="Auto reload"
        density="compact"
        color="primary"
        hide-details
        class="mr-4 flex-grow-0"
        v-on:update:model-value="saveAutoReload"
      />
      <v-btn
        icon
        density="compact"
        class="mr-2"
        v-bind:title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        v-on:click="toggleTheme"
      >
        <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      </v-btn>
      <v-toolbar-items>
        <AppBarLinkSource />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row v-if="currentModelFile">
          <v-col><NetworksFlags v-bind:model-file="currentModelFile" v-bind:reload-key="reloadKey" /></v-col>
        </v-row>
        <v-row>
          <!-- key: force re-render on every navigation -->
          <v-col><AppBreadcrumbs v-bind:key="currentPath" v-bind:path="currentPath" /></v-col>
          <v-col><TableAlerts /></v-col>
        </v-row>
        <v-row>
          <NuxtPage v-bind:page-key="String(reloadKey)" />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import AppAPICommon from '~/components/AppAPICommon'
import AppBarLinkSource from '~/components/AppBarLinkSource'
import AppBreadcrumbs from '~/components/AppBreadcrumbs'
import NetworksFlags from '~/components/NetworksFlags'
import { useMainStore } from '~/stores/main'
import { ChangeDetector } from '~/lib/util/change-detector'
const TableAlerts = defineAsyncComponent(() => import('~/components/TableAlerts'))

export default {
  components: {
    AppBarLinkSource,
    AppBreadcrumbs,
    NetworksFlags,
    TableAlerts
  },
  mixins: [AppAPICommon],
  setup() {
    return { theme: useTheme() }
  },
  data: () => ({
    autoReload: true,
    reloadKey: 0,
    pollIntervalMs: 5000,
    pollTimer: null,
    indexDetector: new ChangeDetector(),
    fileDetector: new ChangeDetector()
  }),
  computed: {
    ...mapState(useMainStore, ['modelFiles']),
    isDark() {
      return this.theme.current.value.dark
    },
    // Path of the router's current route. (`$route` in a layout follows the rendered page and can lag behind)
    currentPath() {
      return this.$router.currentRoute.value.path
    },
    // `<network>/<snapshot>/<file>` of the displayed model file (null on other pages)
    currentModelFile() {
      const p = this.$router.currentRoute.value.params
      return p.network && p.snapshot && p.modelFile ? [p.network, p.snapshot, p.modelFile].join('/') : null
    }
  },
  watch: {
    // another file is displayed: take the baseline again
    currentModelFile() {
      this.fileDetector.reset()
    }
  },
  mounted() {
    this.updateModelFiles()
    this.loadAutoReload()
    this.loadTheme()
    document.addEventListener('visibilitychange', this.pollModelStatus)
    this.pollTimer = setInterval(this.pollModelStatus, this.pollIntervalMs)
  },
  beforeUnmount() {
    clearInterval(this.pollTimer)
    document.removeEventListener('visibilitychange', this.pollModelStatus)
  },
  methods: {
    ...mapActions(useMainStore, ['setModelFiles']),
    loadAutoReload() {
      try {
        this.autoReload = localStorage.getItem('netoviz.autoReload') !== 'false'
      } catch {
        // storage unavailable: keep default
      }
    },
    // restore the manually selected theme (follows the OS setting until one is selected)
    loadTheme() {
      try {
        const saved = localStorage.getItem('netoviz.theme')
        if (saved === 'light' || saved === 'dark') {
          this.theme.change(saved)
        }
      } catch {
        // storage unavailable: keep default
      }
    },
    toggleTheme() {
      const next = this.isDark ? 'light' : 'dark'
      this.theme.change(next)
      try {
        localStorage.setItem('netoviz.theme', next)
      } catch {
        // storage unavailable: ignore
      }
    },
    saveAutoReload(value) {
      try {
        localStorage.setItem('netoviz.autoReload', String(value))
      } catch {
        // storage unavailable: ignore
      }
      // take baselines again to avoid reacting to changes made while disabled
      this.indexDetector.reset()
      this.fileDetector.reset()
    },
    // Poll change signatures of _index.json and the displayed model file.
    async pollModelStatus() {
      if (!this.autoReload || document.visibilityState === 'hidden') {
        return
      }
      try {
        const query = this.currentModelFile ? `?file=${encodeURIComponent(this.currentModelFile)}` : ''
        const response = await fetch(`${this.apiParam.restURIBase}/api/models/status${query}`)
        const status = await response.json()
        if (this.indexDetector.observe(status.index)) {
          await this.updateModelFiles()
        }
        if (this.currentModelFile && this.fileDetector.observe(status.file)) {
          this.reloadKey++ // remount page: visualizer fetches data and redraws
        }
      } catch (error) {
        // server may be restarting: retry on next poll
        console.log('[AutoReload] Cannot get model status: ', error)
      }
    },
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
