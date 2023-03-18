import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase'
import './style.css'
import App from './App.vue'
import VueSelect from "vue-select";

const pinia = createPinia()
const app = createApp(App)

initializeApp(firebaseConfig)

app.use(pinia)
app.use(router)
app.component("v-select", VueSelect)
app.mount('#app')
