import './assets/main.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-loading.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router';
import { i18n } from './service/confirm'


createApp(App).use(i18n).use(router).mount('#app')
