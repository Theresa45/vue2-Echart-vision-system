import Vue from "vue";
import App from "./App.vue";
// 引入路由器
import router from "./router";
import store from "./store";
// import * as echarts from "echarts";
import axios from "axios";
// 引入Socket对象
import SocketService from "@/utils/socket_service";
// 引入全局的样式文件
import "./assets/css/global.less";
// 引入字体文件
import "./assets/font/iconfont.css";

// 配置请求的基本路径
// 将axios挂载到Vue的原型对象上
axios.defaults.baseURL = "http://127.0.0.1:8888/api/";
Vue.prototype.$http = axios;

// 获取Socket实例对象
// 对服务器进行WebSocket连接
SocketService.Instance.connect();
// 方便组件更好地获取服务器发送来的Socket数据
Vue.prototype.$socket = SocketService.Instance;

// 将全局的echarts对象挂载到Vue的原型对象上
// 组件使用echarts对象的方式： this.$echarts
// 自定义主题
// Vue.prototype.$echarts = echarts;
Vue.prototype.$echarts = window.echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
