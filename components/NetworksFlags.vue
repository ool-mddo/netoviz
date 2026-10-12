<template>
  <div v-if="flags.length > 0" id="networks-flags">
    <v-chip v-for="flag in flags" v-bind:key="flag" size="small" label class="mr-2">{{ flag }}</v-chip>
  </div>
</template>

<script>
import AppAPICommon from '~/components/AppAPICommon'

// Show flags of networks-level attribute (`mddo-topology:networks-attributes`) of the displayed model file.
export default {
  mixins: [AppAPICommon],
  props: {
    // `<network>/<snapshot>/<file>` of the displayed model file (null on other pages)
    modelFile: {
      type: String,
      default: null,
      required: false
    },
    // incremented when the model file is reloaded
    reloadKey: {
      type: Number,
      default: 0,
      required: false
    }
  },
  data: () => ({ flags: [] }),
  watch: {
    modelFile: 'fetchFlags',
    reloadKey: 'fetchFlags'
  },
  mounted() {
    this.fetchFlags()
  },
  methods: {
    async fetchFlags() {
      if (!this.modelFile) {
        this.flags = []
        return
      }
      const requested = this.modelFile
      try {
        const query = `?file=${encodeURIComponent(requested)}`
        const response = await fetch(`${this.apiParam.restURIBase}/api/models/attributes${query}`)
        const attr = await response.json()
        // ignore stale response (another file is displayed now)
        if (requested === this.modelFile) {
          this.flags = Array.isArray(attr.flag) ? attr.flag : []
        }
      } catch (error) {
        console.log('[NetworksFlags] Cannot get networks attributes: ', error)
        this.flags = []
      }
    }
  }
}
</script>

<style scoped></style>
