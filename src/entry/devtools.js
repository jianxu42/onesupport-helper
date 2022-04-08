import { createApp } from 'vue'
import App from '../view/devtools.vue'
chrome.devtools.panels.create('onesupport-helper', '', 'devtools.html')
createApp(App).mount('#app')
