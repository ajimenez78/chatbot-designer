export default {
  builder: {
    title: 'Constructor de Chatbot',
    subtitle: 'Personaliza tu asistente virtual',
  },
  tabs: {
    basic: 'Básico',
    personality: 'Personalidad',
    knowledge: 'Conocimiento',
    flows: 'Flujos',
    flow_editor: 'Editor de flujos',
  },
  basic: {
    name: 'Nombre del Chatbot',
    nameHint: 'Ej.: Asistente de Ventas',
    greeting: 'Mensaje de Bienvenida',
    greetingHint: 'Primer mensaje que verán los usuarios',
  },
  personality: {
    title: 'Personalidad del Chatbot',
    hint: 'Define el tono y estilo de comunicación',
  },
  knowledge: {
    title: 'Base de Conocimiento',
    hint: 'Ingresa documentación, FAQs o información relevante',
  },
  flows: {
    trigger: 'Disparador',
    triggerHint: 'Ej.: "Quiero hacer un reclamo"',
    response: 'Respuesta',
    responseHint: 'Respuesta personalizada del chatbot',
    addFlow: 'Agregar Flujo',
    edit: 'Editar flujo',
    delete: 'Eliminar flujo',
    editFlow: 'Editar Flujo',
    deleteConfirm: 'Eliminar Flujo',
    deleteMessage: '¿Estás seguro que deseas eliminar este flujo?',
  },
  actions: {
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  validation: {
    required: 'Este campo es requerido',
  },
  notifications: {
    documentAdded: 'Documento agregado exitosamente',
    documentRemoved: 'Documento eliminado',
    flowAdded: 'Flujo agregado exitosamente',
    flowRemoved: 'Flujo eliminado',
    configSaved: 'Configuración guardada exitosamente',
    error: 'Ha ocurrido un error',
    flowUpdated: 'Flujo actualizado exitosamente',
  },
  dialogs: {
    cancelTitle: 'Cancelar Configuración',
    cancelMessage: '¿Estás seguro que deseas cancelar? Se perderán todos los cambios.',
  },
}
