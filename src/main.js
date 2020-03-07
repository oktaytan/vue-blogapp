import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import moment from "moment";
import chart from 'chart.js';

Vue.config.productionTip = false;
Vue.use(Antd);

Vue.prototype.$moment = moment;
Vue.prototype.$chart = chart;

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
