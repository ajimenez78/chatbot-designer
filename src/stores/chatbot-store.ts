import { defineStore, acceptHMRUpdate } from 'pinia'

export const useChatbotStore = defineStore('chatbot', {
  actions: {
    async saveConfig(config: unknown) {
      return new Promise((resolve) => {
        console.log(`Next to save Config ${String(config)}`)
        resolve('Ok')
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatbotStore, import.meta.hot))
}
