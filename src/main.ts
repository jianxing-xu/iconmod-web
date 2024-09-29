import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { addAPIProvider } from 'iconify-icon'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import './main.css'
import 'uno.css'

import { basePath } from './env'
import routes from '~pages'

addAPIProvider('', {
  resources: [import.meta.env.VITE_ICON_PROVIDER],
})

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
})

app.use(router)
app.mount('#app')
