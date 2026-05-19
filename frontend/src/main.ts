import { createApp } from "vue";
import "@/assets/style.css";
import App from "./App.vue";

import router from "./router/main";
import pinia from "./stores";

createApp(App).use(pinia).use(router).mount("#app");
