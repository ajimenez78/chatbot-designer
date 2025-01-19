// This is just an example,
// so you can safely delete all default props below

export default {
  builder: { title: 'Chatbot Builder', subtitle: 'Customize your virtual assistant' },
  tabs: { basic: 'Basic', personality: 'Personality', knowledge: 'Knowledge', flows: 'Flows' },
  basic: {
    name: 'Chatbot Name',
    nameHint: 'E.g.: Sales Assistant',
    greeting: 'Welcome Message',
    greetingHint: 'First message users will see',
  },
  personality: { title: 'Chatbot Personality', hint: 'Define the tone and communication style' },
  knowledge: {
    title: 'Knowledge Base',
    hint: 'Enter documentation, FAQs, or relevant information',
  },
  flows: {
    trigger: 'Trigger',
    triggerHint: 'E.g.: "I want to make a complaint"',
    response: 'Response',
    responseHint: 'Customized chatbot response',
    addFlow: 'Add Flow',
    edit: 'Edit flow',
    delete: 'Delete flow',
    editFlow: 'Edit flow',
    deleteConfirm: 'Delete flow',
    deleteMessage: 'Are you sure you want to delete this flow?',
  },
  actions: { save: 'Save', cancel: 'Cancel' },
  validation: {
    required: 'This field is required',
  },
  notifications: {
    documentAdded: 'Document added successfully',
    documentRemoved: 'Document removed',
    flowAdded: 'Flow added successfully',
    flowRemoved: 'Flow removed',
    configSaved: 'Configuration saved successfully',
    error: 'An error occurred',
    flowUpdated: 'Flow updated successfully',
  },
  dialogs: {
    cancelTitle: 'Cancel Configuration',
    cancelMessage: 'Are you sure you want to cancel? All changes will be lost.',
  },
}
