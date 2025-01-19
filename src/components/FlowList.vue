<template>
  <div class="flows-container q-pa-md">
    <q-card flat bordered class="q-mb-md">
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

    <li>
      <ul v-for="flow in props.modelValue" :key="flow.id">
        {{
          flow.trigger
        }}
      </ul>
    </li>

    <vue-draggable-next
      v-model="sortableFlows"
      item-key="id"
      handle=".drag-handle"
      animation="200"
      @start="drag = true"
      @end="drag = false"
      class="flows-list"
    >
      <template #item="{ element, index }">
        <q-card class="flow-item q-mb-sm">
          <q-item>
            <q-item-section avatar>
              <q-icon name="drag_indicator" class="drag-handle cursor-move" size="sm" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ element.trigger }}
              </q-item-label>
              <q-item-label caption>
                {{ truncateText(element.response, 100) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <q-badge color="primary" class="q-mr-sm">
                  {{ index + 1 }}
                </q-badge>
                <q-btn
                  flat
                  round
                  dense
                  color="grey"
                  icon="edit"
                  @click="handleEditFlow(element, index)"
                >
                  <q-tooltip>{{ t('flows.edit') }}</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  @click="handleRemoveFlow(index)"
                >
                  <q-tooltip>{{ t('flows.delete') }}</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-card>
      </template>
    </vue-draggable-next>

    <!-- Dialog para editar flujo -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ t('flows.editFlow') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editingFlow.trigger"
            filled
            :label="t('flows.trigger')"
            class="q-mb-md"
          />
          <q-input
            v-model="editingFlow.response"
            filled
            type="textarea"
            :label="t('flows.response')"
            autogrow
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="t('actions.cancel')" v-close-popup />
          <q-btn flat :label="t('actions.save')" @click="saveEdit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { VueDraggableNext } from 'vue-draggable-next'
import { v4 as uuidv4 } from 'uuid'
import type { Flow } from 'src/model/types'

const $q = useQuasar()
const { t } = useI18n()

interface Props {
  modelValue: Flow[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Flow[]): void
}>()

// Estado local
const drag = ref(false)
const editDialog = ref(false)
const editingIndex = ref<number>(-1)
const editingFlow = ref<Flow>({ id: '', trigger: '', response: '' })
const currentFlow = ref<Omit<Flow, 'id'>>({
  trigger: '',
  response: '',
})

// Computed property para manejar v-model con draggable
const sortableFlows = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Métodos
const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text
}

const handleAddFlow = () => {
  const newFlow: Flow = {
    id: uuidv4(),
    trigger: currentFlow.value.trigger,
    response: currentFlow.value.response,
  }

  emit('update:modelValue', [...props.modelValue, newFlow])
  currentFlow.value = { trigger: '', response: '' }

  showNotification(t('notifications.flowAdded'))
}

const handleEditFlow = (flow: Flow, index: number) => {
  editingFlow.value = { ...flow }
  editingIndex.value = index
  editDialog.value = true
}

const saveEdit = () => {
  if (editingIndex.value > -1) {
    const updatedFlows = [...props.modelValue]
    updatedFlows[editingIndex.value] = editingFlow.value
    emit('update:modelValue', updatedFlows)
    showNotification(t('notifications.flowUpdated'))
  }
}

const handleRemoveFlow = (index: number) => {
  $q.dialog({
    title: t('flows.deleteConfirm'),
    message: t('flows.deleteMessage'),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const updatedFlows = [...props.modelValue]
    updatedFlows.splice(index, 1)
    emit('update:modelValue', updatedFlows)
    showNotification(t('notifications.flowRemoved'), 'negative')
  })
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
</script>

<style lang="scss" scoped>
.flows-container {
  .flow-item {
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .drag-handle {
    cursor: move;
    opacity: 0.5;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.sortable-drag {
  cursor: move;
}
</style>
