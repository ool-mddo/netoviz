<template>
  <v-list>
    <v-subheader>About Netoviz</v-subheader>
    <v-list-item-group>
      <v-list-item v-for="(link, index) in links" v-bind:key="index" v-bind:href="link.href" target="_blank">
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          icon: 'mdi-code-tags',
          text: 'Github repository.',
          href: 'https://github.com/ool-mddo/netoviz'
        },
        {
          icon: 'mdi-text-box-multiple',
          text: 'Documents (JSDoc)',
          href: '/docs'
        }
      ]
    }
  },
  head: () => ({ title: 'About' })
}
</script>

<style scoped></style>
