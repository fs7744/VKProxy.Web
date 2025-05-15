import './assets/main.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { router } from './router';

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages
})

createApp(App).use(i18n).use(router).mount('#app')
