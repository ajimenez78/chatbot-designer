export interface ChatbotConfig {
  name: string
  personality: string
  greeting: string
  knowledgeBase: string[]
  flows: Flow[]
}
export interface Flow {
  id: string
  trigger: string
  response: string
}
