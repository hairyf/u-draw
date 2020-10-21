import Vue from 'vue';
import App from './App.vue';
import store from './store';
Vue.prototype.$store = store;
Vue.config.productionTip = false;
new App().$mount();
// import { createFromStrategy } from 'form-strategy';
// import * as rules from 'form-strategy/dist/rules';
// const { validate } = createFromStrategy({
//   ...rules,
// });
