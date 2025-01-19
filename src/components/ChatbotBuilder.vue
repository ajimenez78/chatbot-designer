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
                v-model="chatbotStore.config.name"
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
                v-model="chatbotStore.config.greeting"
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
              v-model="chatbotStore.config.personality"
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
                <q-item v-for="(doc, index) in chatbotStore.config.knowledgeBase" :key="index">
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
            <flow-list v-model="chatbotStore.config.flows" @update:modelValue="saveFlows" />
          </q-tab-panel>

          <!-- Flows Edition panel -->
          <q-tab-panel name="flow_editor">
            <flow-editor />
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useChatbotStore } from 'src/stores/chatbot-store'
import FlowList from './FlowList.vue'
import FlowEditor from './FlowEditor.vue'
import type { Flow } from 'src/model/types'
const $q = useQuasar()
const { t } = useI18n()
const chatbotStore = useChatbotStore()

// Constants
const tabs = [
  { name: 'basic', icon: 'settings', label: t('tabs.basic') },
  { name: 'personality', icon: 'psychology', label: t('tabs.personality') },
  { name: 'knowledge', icon: 'database', label: t('tabs.knowledge') },
  { name: 'flows', icon: 'account_tree', label: t('tabs.flows') },
  { name: 'flow_editor', icon: 'schema', label: t('tabs.flow_editor') },
] as const

// State
const activeTab = ref<string>('basic')
const currentDocument = ref<string>('')

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
    chatbotStore.config.knowledgeBase.push(currentDocument.value)
    currentDocument.value = ''
    showNotification(t('notifications.documentAdded'))
  }
}

const handleRemoveDocument = (index: number): void => {
  chatbotStore.config.knowledgeBase.splice(index, 1)
  showNotification(t('notifications.documentRemoved'), 'negative', 'delete')
}

const handleSave = async (): Promise<void> => {
  try {
    // Here you would typically make an API call to save the config
    await chatbotStore.saveConfig()
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

const saveFlows = (flows: Flow[]) => {
  chatbotStore.config.flows = flows
}
</script>

<style lang="scss">
.builder-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
