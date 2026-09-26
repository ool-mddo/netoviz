import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alertHost: ''
  }),
  actions: {
    setAlertHost(payload) {
      this.alertHost = payload
    }
  }
})
