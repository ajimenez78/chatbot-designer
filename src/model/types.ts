export interface ChatbotConfig {
  name: string
  personality: string
  greeting: string
  knowledgeBase: string[]
  flows: ConversationFlow[]
}
export interface ConversationFlow {
  trigger: string
  response: string
}
export interface CurrentFlow {
  trigger: string
  response: string
}
