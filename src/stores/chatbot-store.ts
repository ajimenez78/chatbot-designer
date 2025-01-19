import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ChatbotConfig } from 'src/model/types'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    config: {
      name: '',
      personality: '',
      greeting: '',
      knowledgeBase: [],
      flows: [],
    } as ChatbotConfig,
  }),
  actions: {
    saveConfig() {
      return new Promise((resolve) => {
        console.log(`Next to save config ${JSON.stringify(this.config)}`)
        // TODO: save this.config
        resolve('Ok')
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatbotStore, import.meta.hot))
}
