<template>
  <div class="dummy"></div>
</template>

<script>
export default {
  computed: {
    apiParam() {
      return {
        restURIBase: this.restURIBase
      }
    },
    restURIBase() {
      const protocol = window.location.protocol
      const host = window.location.hostname
      // If NETOVIZ_REST_PORT is defined,
      // use it instead of browser location port.
      // Run all-in-one application, unset NETOVIZ_REST_PORT.
      const port = this.$env.NETOVIZ_REST_PORT || window.location.port
      return `${protocol}//${host}:${port}`
    }
  }
}
</script>

<style></style>
