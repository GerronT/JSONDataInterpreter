import {createApp} from 'vue'

import App from './App.vue'
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

AOS.init();

createApp(App).mount("#app")