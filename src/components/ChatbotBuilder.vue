<template>
  <q-page class="q-pa-md">
    <q-card class="builder-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          <q-icon name="chat" class="q-mr-sm" />
          {{ t('builder.title') }}
        </div>
        <div class="text-subtitle2">{{ t('builder.subtitle') }}</div>
      </q-card-section>

      <q-card-section>
        <q-tabs
          v-model="activeTab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.name"
            :name="tab.name"
            :icon="tab.icon"
            :label="tab.label"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Basic Panel -->
          <q-tab-panel name="basic">
            <q-form class="q-gutter-md">
              <q-input
                v-model="config.name"
                filled
                :label="t('basic.name')"
                :hint="t('basic.nameHint')"
                :rules="[(val: string) => !!val || t('validation.required')]"
              >
                <template v-slot:prepend>
                  <q-icon name="robot" />
                </template>
              </q-input>

              <q-input
                v-model="config.greeting"
                filled
                :label="t('basic.greeting')"
                :hint="t('basic.greetingHint')"
                :rules="[(val: string) => !!val || t('validation.required')]"
              >
                <template v-slot:prepend>
                  <q-icon name="chat_bubble" />
                </template>
              </q-input>
            </q-form>
          </q-tab-panel>

          <!-- Personality Panel -->
          <q-tab-panel name="personality">
            <q-input
              v-model="config.personality"
              filled
              type="textarea"
              :label="t('personality.title')"
              :hint="t('personality.hint')"
              autogrow
            >
              <template v-slot:prepend>
                <q-icon name="psychology" />
              </template>
            </q-input>
          </q-tab-panel>

          <!-- Knowledge Base Panel -->
          <q-tab-panel name="knowledge">
            <div class="q-gutter-md">
              <q-input
                v-model="currentDocument"
                filled
                type="textarea"
                :label="t('knowledge.title')"
                :hint="t('knowledge.hint')"
                autogrow
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
                <template v-slot:after>
                  <q-btn
                    round
                    color="primary"
                    icon="add"
                    @click="handleAddDocument"
                    :disable="!currentDocument"
                  />
                </template>
              </q-input>

              <q-list bordered separator>
                <q-item v-for="(doc, index) in config.knowledgeBase" :key="index">
                  <q-item-section>
                    <q-item-label>{{ truncateText(doc, 100) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="handleRemoveDocument(index)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-tab-panel>

          <!-- Flows Panel -->
          <q-tab-panel name="flows">
            <div class="q-gutter-md">
              <q-card flat bordered>
                <q-card-section>
                  <q-input
                    v-model="currentFlow.trigger"
                    filled
                    :label="t('flows.trigger')"
                    :hint="t('flows.triggerHint')"
                  >
                    <template v-slot:prepend>
                      <q-icon name="electric_bolt" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="currentFlow.response"
                    filled
                    type="textarea"
                    :label="t('flows.response')"
                    :hint="t('flows.responseHint')"
                    class="q-mt-md"
                    autogrow
                  >
                    <template v-slot:prepend>
                      <q-icon name="question_answer" />
                    </template>
                  </q-input>

                  <div class="q-mt-md">
                    <q-btn
                      color="primary"
                      icon="add"
                      :label="t('flows.addFlow')"
                      @click="handleAddFlow"
                      :disable="!currentFlow.trigger || !currentFlow.response"
                    />
                  </div>
                </q-card-section>
              </q-card>

              <q-list bordered separator>
                <q-expansion-item
                  v-for="(flow, index) in config.flows"
                  :key="index"
                  :label="flow.trigger"
                  icon="account_tree"
                >
                  <q-card>
                    <q-card-section>
                      <div class="text-subtitle2">{{ t('flows.response') }}:</div>
                      <div class="q-mt-sm">{{ flow.response }}</div>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn flat color="negative" icon="delete" @click="handleRemoveFlow(index)" />
                    </q-card-actions>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="bg-white">
        <q-btn flat :label="t('actions.cancel')" color="negative" @click="handleCancel" />
        <q-btn flat :label="t('actions.save')" color="primary" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import type { ChatbotConfig, ConversationFlow, CurrentFlow } from 'src/model/types'
import { useChatbotStore } from 'src/stores/chatbot-store'
const $q = useQuasar()
const { t } = useI18n()
const chatbotStore = useChatbotStore()

// Constants
const tabs = [
  { name: 'basic', icon: 'settings', label: t('tabs.basic') },
  { name: 'personality', icon: 'psychology', label: t('tabs.personality') },
  { name: 'knowledge', icon: 'database', label: t('tabs.knowledge') },
  { name: 'flows', icon: 'account_tree', label: t('tabs.flows') },
] as const

// State
const activeTab = ref<string>('basic')
const currentDocument = ref<string>('')
const currentFlow = reactive<CurrentFlow>({
  trigger: '',
  response: '',
})

const config = reactive<ChatbotConfig>({
  name: '',
  personality: '',
  greeting: '',
  knowledgeBase: [],
  flows: [],
})

// Methods
const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text
}

const showNotification = (
  message: string,
  color: 'positive' | 'negative' = 'positive',
  icon: string = 'check',
) => {
  $q.notify({
    message,
    color,
    icon,
  })
}

const handleAddDocument = (): void => {
  if (currentDocument.value.trim()) {
    config.knowledgeBase.push(currentDocument.value)
    currentDocument.value = ''
    showNotification(t('notifications.documentAdded'))
  }
}

const handleRemoveDocument = (index: number): void => {
  config.knowledgeBase.splice(index, 1)
  showNotification(t('notifications.documentRemoved'), 'negative', 'delete')
}

const handleAddFlow = (): void => {
  if (currentFlow.trigger.trim() && currentFlow.response.trim()) {
    config.flows.push({ ...currentFlow })
    currentFlow.trigger = ''
    currentFlow.response = ''
    showNotification(t('notifications.flowAdded'))
  }
}

const handleRemoveFlow = (index: number): void => {
  config.flows.splice(index, 1)
  showNotification(t('notifications.flowRemoved'), 'negative', 'delete')
}

const handleSave = async (): Promise<void> => {
  try {
    // Here you would typically make an API call to save the config
    await chatbotStore.saveConfig(config)
    showNotification(t('notifications.configSaved'))
  } catch (error) {
    showNotification(t('notifications.error'), 'negative', 'error')
    console.error('Error saving config:', error)
  }
}

const handleCancel = (): void => {
  $q.dialog({
    title: t('dialogs.cancelTitle'),
    message: t('dialogs.cancelMessage'),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Reset form or navigate away
  })
}
</script>

<style lang="scss">
.builder-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
